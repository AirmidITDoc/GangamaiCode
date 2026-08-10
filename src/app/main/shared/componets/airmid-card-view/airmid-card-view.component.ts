import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { gridModel, gridRequest, gridResponseType } from 'app/core/models/gridRequest';
import { DATE_TYPES, gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { ApiCaller } from 'app/core/services/apiCaller';
import { permissionType } from '../../model/permission.model';
import { PagePermissionService } from '../../services/page-permission.service';
@Component({
  selector: 'airmid-card-view',
  templateUrl: './airmid-card-view.component.html',
  styleUrls: ['./airmid-card-view.component.scss']
})
export class AirmidCardViewComponent implements OnInit, OnChanges {
  constructor(private _httpClient: ApiCaller, public datePipe: DatePipe, public _matDialog: MatDialog, private fuseSidebarService: FuseSidebarService,
    public permissionService: PagePermissionService
) {
}
dateType = DATE_TYPES;
@Input() gridConfig: gridModel; // or whatever type of datasource you have
resultsLength = 0;
@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatTable, { static: false }) table!: MatTable<any>;
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
@Output() afterLoadData = new EventEmitter<any>();
@Input() ShowFilter: boolean = true;
@Input() ShowButtons: boolean = true;
@Input() FullWidth: boolean = false;
@Input() tableClasses: string = '';
@Input() config: any;
pageSize: number = 25;
public selectedRow: any = null;
public defaultColumnWidth = 120;
private hasEmitted = false;

ngOnInit(): void {
    if (this.gridConfig && this.gridConfig.row > 0)
        this.pageSize = this.gridConfig.row;
    this.bindGridData();
    if (this.gridConfig && this.gridConfig.permissionCode)
        this.ShowButtons = this.permissionService.getPermission(this.gridConfig.permissionCode, permissionType.Export);
}

ngOnChanges(changes: SimpleChanges): void {
    if (changes['gridConfig'] && !changes['gridConfig'].firstChange) {
        this.bindGridData();
    }
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
gridDataRequest: gridRequest = new gridRequest();

@Output() action = new EventEmitter<{ action: string, item: any }>();

onAction(action: string, item: any) {
  this.action.emit({ action, item });
}
bindGridData() {
    if (!this.gridConfig) {
        return;
    }
    
    // this.updateFilters();
    // debugger
    this.gridDataRequest = {
        sortField: this.sort?.active ?? this.gridConfig.sortField,
        sortOrder: this.sort?.direction ?? 'asc' == 'asc' ? 0 : -1, filters: this.gridConfig.filters,
        columns: this.gridConfig.columnsList.map(x => ({ Name: x.heading, Data: x.key })),
        first: (this.paginator?.pageIndex ?? 0),
        rows: (this.paginator?.pageSize ?? this.pageSize),
        exportType: gridResponseType.JSON
    };
    this._httpClient.PostData(this.gridConfig.apiUrl, this.gridDataRequest).subscribe((data: any) => {
        this.dataSource.data = data.data as [];
        
        console.log(this.dataSource.data);
        this.dataSource.sort = this.sort;
        this.resultsLength = data["recordsFiltered"];
        if (!this.hasEmitted) {
            this.afterLoadData.emit(data.data);
            this.hasEmitted = true;
        }
    });
}

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
        // 'table-row-green': row?.patientType && row.patientType !== 'Self',
        'table-row-gray': row === this.selectedRow,
        // You can add more classes dynamically

        // 'table-row-green': row?.flagAppDone && row.flagAppDone !== '0',

        'table-row-blue': row?.balanceAmt && row.balanceAmt !== '0',

        // added by raksha on 6/8/25 from reg list
        'table-row-green': row?.isMark == true,

        // added by raksha on 20/8/25 for admission list if company present
        'table-row-yellow' : row?.companyId > 0 
    }


}
public get GridExportType() {
    return gridResponseType;
}
onExportClick(type: gridResponseType) {
    this.gridDataRequest.exportType = type;
    let filename = this.gridConfig.fileName;
    if ((filename ?? "") == "") filename = "Document";
    if (type == gridResponseType.Csv)
        filename = filename + ".csv";
    else if (type == gridResponseType.Pdf)
        filename = filename + ".pdf";
    else if (type == gridResponseType.Excel)
        filename = filename + ".xlsx";
    this._httpClient.downloadFile(this.gridConfig.apiUrl, this.gridDataRequest, 1, filename).subscribe((data) => {

    });
}

onPage(event: PageEvent) {
    this.pageSize = event.pageSize ?? this.pageSize;
    if (this.paginator) {
        this.paginator.pageIndex = event.pageIndex ?? 0;
        this.paginator.pageSize = this.pageSize;
    }
    this.bindGridData();
}

}
