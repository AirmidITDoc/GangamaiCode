import { Component, AfterContentInit, Input, ViewChild, ContentChildren, QueryList, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatColumnDef, MatTable } from '@angular/material/table';
import { gridRequest, gridResponseType } from 'app/core/models/gridRequest';
import { GenderMasterService } from 'app/main/setup/PersonalDetails/gender-master/gender-master.service';

@Component({
    selector: 'airmid-table',
    templateUrl: './airmid-table.component.html',
    styleUrls: ['./airmid-table.component.scss']
})
export class AirmidTableComponent implements OnInit {

  constructor(public _GenderService: GenderMasterService) { }

    @Input() dataSource: []; // or whatever type of datasource you have
    @Input() headers: string[];
    resultsLength = 0;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    // this is where the magic happens: 
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;
    // after the <ng-content> has been initialized, the column definitions are available.
    // All that's left is to add them to the table ourselves:
    ngAfterContentInit() {
        debugger
        this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
    }
    ngOnInit(): void {
        debugger
        var Param: gridRequest = {
            SortField: this.sort?.active ?? "GenderId", SortOrder: this.sort?.direction ?? 'asc' == 'asc' ? 0 : -1, Filters: [],
            Columns: [],
            First: (this.paginator?.pageIndex ?? 0),
            Rows: (this.paginator?.pageSize ?? 12),
            ExportType: gridResponseType.JSON
        };
        this._GenderService.getGenderMasterList(Param).subscribe((data: any) => {
            this.dataSource = data.data as [];
            //this.dataSource.sort = this.sort;
            //this.DSGenderMasterList.paginator = this.paginator;
            this.resultsLength = data["recordsFiltered"];
        });
    }
}
