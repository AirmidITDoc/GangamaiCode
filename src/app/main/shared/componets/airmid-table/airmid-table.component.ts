import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, ViewChild, ContentChildren, QueryList, OnInit, ElementRef, AfterViewInit, Output } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { gridModel, gridRequest, gridResponseType } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { ApiCaller } from 'app/core/services/apiCaller';

@Component({
    selector: 'airmid-table',
    templateUrl: './airmid-table.component.html',
    styleUrls: ['./airmid-table.component.scss']
})
export class AirmidTableComponent implements OnInit {

    constructor(private _httpClient: ApiCaller,public datePipe: DatePipe) { }

    @Input() gridConfig: gridModel; // or whatever type of datasource you have
    @Output() status: EventEmitter<any> = new EventEmitter();
    resultsLength = 0;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatTable, { static: true }) table: MatTable<any>;
    // @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;
    dataSource = new MatTableDataSource<any>();
    // @ViewChild(MatSort) set sort(sort: MatSort) {
    //     this.dataSource.sort = sort;
    // }
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    // ngAfterContentInit() {
    //     this.gridConfig.columnsList.forEach(columnDef => this.table.addColumnDef(columnDef));
    // }
    ngOnInit(): void {
        this.bindGridData();
    }
    public get GridAction() {
        return gridActions;
    }
    public get GridColumnType() {
        return gridColumnTypes;
    }
    bindGridData(){
        if(this.gridConfig.apiType == 'dynamic')
            this.bindGridSPListData();
        else
            this.bindGridMasterListData();         
    }
    bindGridMasterListData() {
        var param: gridRequest = {
            sortField: this.sort?.active ?? this.gridConfig.sortField,
            sortOrder: this.sort?.direction ?? 'asc' == 'asc' ? 0 : -1, filters: this.gridConfig.filters,
            columns: [],
            first: (this.paginator?.pageIndex ?? 0),
            rows: (this.paginator?.pageSize ?? this.gridConfig.row),
            exportType: gridResponseType.JSON
        };
        this._httpClient.PostData(this.gridConfig.apiUrl, param).subscribe((data: any) => {
            this.dataSource.data = data.data as [];
            this.dataSource.sort = this.sort;
            //this.dataSource.paginator = this.paginator;
            this.resultsLength = data["recordsFiltered"];
            //this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
        });
        //this.sort.emit();
    }
    bindGridSPListData() {
        debugger
        this.gridConfig.filters.find(x => x.fieldName === 'Start').fieldValue = (this.paginator?.pageIndex ?? 0).toString();
        this.gridConfig.filters.find(x => x.fieldName === 'Length').fieldValue = (this.paginator?.pageSize ?? this.gridConfig.row).toString();
        this.gridConfig.filters.find(x => x.fieldName === 'Sort').fieldValue = this.sort?.active ?? this.gridConfig.sortField;
        this.gridConfig.filters.find(x => x.fieldName === 'Order').fieldValue =  this.sort?.direction ?? 'asc' == 'asc' ? 'desc' : 'asc';

        if(this.gridConfig.filters.find(x => x.fieldName === 'From_Dt').fieldValue)
            this.gridConfig.filters.find(x => x.fieldName === 'From_Dt').fieldValue = this.datePipe.transform(this.gridConfig.filters.find(x => x.fieldName === 'From_Dt').fieldValue, "yyyy-MM-dd 00:00:00.000") || "01/01/1900";
        if(this.gridConfig.filters.find(x => x.fieldName === 'To_Dt').fieldValue)
            this.gridConfig.filters.find(x => x.fieldName === 'To_Dt').fieldValue = this.datePipe.transform(this.gridConfig.filters.find(x => x.fieldName === 'To_Dt').fieldValue, "yyyy-MM-dd 00:00:00.000") || "01/01/1900";

        var param: any = {
            searchFields: this.gridConfig.filters,
            mode: this.gridConfig.mode
        };
        this._httpClient.PostData(this.gridConfig.apiUrl, param).subscribe((data: any) => {
            if(data){
                this.dataSource.data = data[this.gridConfig?.responseTag  || 'Table0'] as [];
                this.dataSource.sort = this.sort;
                this.resultsLength = data["Table"][0]["total_row"];
            }
        });
    }
    onClear() {

    }
    getStatus(status: boolean) {
        return status;
    }
}
