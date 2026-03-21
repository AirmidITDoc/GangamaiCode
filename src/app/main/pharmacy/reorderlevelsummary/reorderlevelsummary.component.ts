import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IndentrequestComponent } from './indentrequest/indentrequest.component';
import { ReorderlevelsummaryService } from './reorderlevelsummary.service';

@Component({
    selector: 'app-reorderlevelsummary',
    templateUrl: './reorderlevelsummary.component.html',
    styleUrls: ['./reorderlevelsummary.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ReorderlevelsummaryComponent implements OnInit {
    displayedColumns = [
        'Action',
        'ItemName',
        'Packing',
        'BalQty',
        'ReorderQty'
    ]
    dateTimeObj: any;
    sIsLoading: string = '';
    isLoadingStr: string = "";
    isLoading: string = '';
    RaisedIndentList: any = [];
    autocompleteReorderType: 'ConstantType'
    autocompleteReorderQty: 'ConstantType'

    dsReorderlevelSummery = new MatTableDataSource<ReorderlvlList>();
    @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        public _Reorderlevelsummery: ReorderlevelsummaryService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        private _loggedService: AuthenticationService,
    ) { }

    ngOnInit(): void {
    }
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    getReorderlvlList() {
        debugger
        const vdata = {
            "first": 0,
            "rows": 25,
            "sortField": "ItemName",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "StoreID", "fieldValue": String(this._loggedService.currentUserValue.user.storeId), "opType": "Equals" },
                { "fieldName": "ReOderQty", "fieldValue": String(this._Reorderlevelsummery.SearchFrom.get('ReorderQty').value), "opType": "Equals" },
                { "fieldName": "vType", "fieldValue": String(this._Reorderlevelsummery.SearchFrom.get('Type').value), "opType": "StartsWith" }
            ],
            "exportType": "JSON",
            "columns": [{ "data": "string", "name": "string" }]
        }
        this._Reorderlevelsummery.getReorderlevelList(vdata).subscribe(response => {
            this.dsReorderlevelSummery.data = response?.data as ReorderlvlList[];
            this.dsReorderlevelSummery.sort = this.sort;
            this.dsReorderlevelSummery.paginator = this.paginator;
            this.sIsLoading = '';
        },
            error => {
                this.sIsLoading = '';
            });
    }
    tableElementChecked(event, element) {
        if (event.checked) {
            this.RaisedIndentList.push(element);
        }
    }
    RaiseIndent() {
        const dialogRef = this._matDialog.open(IndentrequestComponent,
            {
                maxWidth: "100%",
                height: '95%',
                width: '95%',
                data: {
                    Obj: this.RaisedIndentList,
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getReorderlvlList();
            this.RaisedIndentList = [];
        });
    }
    OnClear() {
        this._Reorderlevelsummery.SearchFrom.reset();
    }
    getValidationMessages() {
        return {
            Type: [
                // { name: "required", Message: "Invoice No is storeid" }
            ],
            ReorderQty: [
                // { name: "required", Message: "Invoice No is storeid" }
            ]

        };
    }
}
export class ReorderlvlList {
    ItemName: string;
    BalQty: any;
    ReorderQty: any;
    IndentQty: any;
    constructor(ReorderlvlList) {
        {
            this.ItemName = ReorderlvlList.ItemName || '';
            this.BalQty = ReorderlvlList.BalQty || 0;
            this.ReorderQty = ReorderlvlList.ReorderQty || 0;
            this.IndentQty = ReorderlvlList.IndentQty || 0;
        }
    }
}
