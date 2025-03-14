import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, ViewChild, ContentChildren, QueryList, OnInit, ElementRef, AfterViewInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { gridModel, gridRequest, gridResponseType, OperatorComparer } from 'app/core/models/gridRequest';
import { DATE_TYPES, gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { ApiCaller } from 'app/core/services/apiCaller';

@Component({
    selector: 'airmid-table',
    templateUrl: './airmid-table.component.html',
    styleUrls: ['./airmid-table.component.scss']
})
export class AirmidTableComponent implements OnInit {

    constructor(private _httpClient: ApiCaller, public datePipe: DatePipe, public _matDialog: MatDialog, private fuseSidebarService: FuseSidebarService) {
    }
    dateType = DATE_TYPES;
    @Input() gridConfig: gridModel; // or whatever type of datasource you have
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
    headers = [];
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @Output() onSelectRow = new EventEmitter<any>();
    @Input() ShowFilter: boolean = true;
    @Input() ShowButtons: boolean = true;
    @Input() FullWidth: boolean = false;
    @Input() tableClasses: string = '';
    pageSize: number = 10;
    public selectedRow: any = null;
    public defaultColumnWidth = 120;
    ngOnInit(): void {
        if (this.gridConfig.row > 0)
            this.pageSize = this.gridConfig.row;
        this.bindGridData();
    }
    public get GridAction() {
        return gridActions;
    }
    public get GridColumnType() {
        return gridColumnTypes;
    }
    public get Headers() {
        return this.gridConfig.columnsList.map(x => x.key.replaceAll(' ', ''));
    }
    bindGridData() {
        // this.updateFilters();

        var param: gridRequest = {
            sortField: this.sort?.active ?? this.gridConfig.sortField,
            sortOrder: this.sort?.direction ?? 'asc' == 'asc' ? 0 : -1, filters: this.gridConfig.filters,
            columns: [],
            first: (this.paginator?.pageIndex ?? 0),
            rows: (this.paginator?.pageSize ?? this.pageSize),
            exportType: gridResponseType.JSON
        };
        this._httpClient.PostData(this.gridConfig.apiUrl, param).subscribe((data: any) => {
            this.dataSource.data = data.data as [];
            this.dataSource.sort = this.sort;
            this.resultsLength = data["recordsFiltered"];
        });
    }
    // updateFilters(): void {
    //     this.gridConfig.filters = this.gridConfig.filters.map(filter => {
    //         let { fieldValue, opType, ...rest } = filter;

    //         // If opType is 'Equals' and fieldValue is null or undefined, set it to "0"
    //         if (opType === OperatorComparer.Equals && (fieldValue === null || fieldValue === undefined || fieldValue === "")) {
    //             fieldValue = '0';
    //         }

    //         // If opType is 'Contains' and fieldValue doesn't start with '%', add '%'
    //         if (opType === OperatorComparer.Contains && typeof fieldValue === 'string' && !fieldValue.startsWith('%')) {
    //             fieldValue = `%${fieldValue}`;
    //         }

    //         return { ...rest, opType, fieldValue };
    //     });

    // }
    onClear() {

    }
    getStatus(status: boolean) {
        return status;
    }
    onDelete(obj, element) {
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage = obj.message ?? "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            if (result) {
                obj.callback(element);
            }
            this.confirmDialogRef = null;
        });
    }
    SelectRow(row) {
        this.selectedRow = row;
        this.onSelectRow.emit(this.selectedRow);
    }
    getRowClasses(row: any): { [key: string]: boolean } {
        // || row?.isCancelled && row.isCancelled !== '1'
        return {
            'table-row-green': row?.patientType && row.patientType !== 'Self',
            'table-row-gray': row === this.selectedRow,
            // You can add more classes dynamically

            // 'table-row-yellow': row?.balanceAmt && row.balanceAmt !== '0',

            'table-row-blue': row?.balanceAmt && row.balanceAmt !== '0',
        }


    }
}
