import { Component, AfterContentInit, Input, ViewChild, ContentChildren, QueryList, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatColumnDef, MatTable, MatTableDataSource } from '@angular/material/table';
import { gridModel, gridRequest, gridResponseType } from 'app/core/models/gridRequest';
import { GenderMasterService } from 'app/main/setup/PersonalDetails/gender-master/gender-master.service';

@Component({
    selector: 'airmid-table',
    templateUrl: './airmid-table.component.html',
    styleUrls: ['./airmid-table.component.scss']
})
export class AirmidTableComponent implements OnInit {

    constructor(public _GenderService: GenderMasterService) { }

    @Input() gridConfig: gridModel; // or whatever type of datasource you have
    resultsLength = 0;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;
    dataSource = new MatTableDataSource<any>();
    // @ViewChild(MatSort) set sort(sort: MatSort) {
    //     this.dataSource.sort = sort;
    // }
    @ViewChild(MatSort,{ static: true }) sort: MatSort;
    ngAfterContentInit() {
        this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
    }
    ngOnInit(): void {
        this.bindGridData();
    }
    bindGridData() {
        debugger
        var Param: gridRequest = {
            sortField: this.sort?.active ?? this.gridConfig.sortField,
            sortOrder: this.sort?.direction ?? 'asc' == 'asc' ? 0 : -1, filters: [],
            first: (this.paginator?.pageIndex ?? 0),
            rows: (this.paginator?.pageSize ?? this.gridConfig.row),
            exportType: gridResponseType.JSON
        };
        this._GenderService.getGenderMasterList(Param).subscribe((data: any) => {
            this.dataSource.data = data.data as [];
            this.dataSource.sort = this.sort;
            //this.dataSource.paginator = this.paginator;
            this.resultsLength = data["recordsFiltered"];
            //this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
        });
    }
}
