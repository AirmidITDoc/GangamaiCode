import { AfterViewInit, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiCaller } from 'app/core/services/apiCaller';

import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';


@Component({
    selector: 'airmid-common-table',
    templateUrl: './airmid-common-table.component.html',
    styleUrls: ['./airmid-common-table.component.scss']
})
export class AirmidCommonTableComponent implements OnInit, AfterViewInit {
    @Input() mode: string;
    @Input() filters: any[];
    displayedColumns: string[] = [];
    sampleReportDataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    constructor(private _httpClient: ApiCaller, public toastr: ToastrService) {
    }
    ngAfterViewInit() {
        this.sampleReportDataSource.paginator = this.paginator;
    }
    ngOnInit(): void {
        this.loadData();
    }

    ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters'] || changes['mode']) {
    this.loadData();
    }
  }
  
    loadData() {

        debugger
        var param = { Mode: this.mode, SearchFields: this.filters };
        this._httpClient.PostData("Common/get-data-table-by-proc", param).subscribe(res => {
            const data = res;
            if (!data || data.length === 0)
                return;
            this.displayedColumns = Object.keys(data[0]);
            this.sampleReportDataSource.data = data;
            if (this.paginator) {
                this.sampleReportDataSource.paginator = this.paginator;
            }
        }, (error) => {
            this.toastr.error(error.message);
        });
    }
    exportExcel() {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.sampleReportDataSource.filteredData);
        const workbook: XLSX.WorkBook = { Sheets: { Data: worksheet }, SheetNames: ['Data'] };
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        FileSaver.saveAs(blob, 'Report.xlsx');
    }
}
