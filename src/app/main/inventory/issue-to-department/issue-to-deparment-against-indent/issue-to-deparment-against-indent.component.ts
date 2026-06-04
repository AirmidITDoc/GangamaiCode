import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { IssueToDepartmentService } from '../issue-to-department.service';

@Component({
    selector: 'app-issue-to-deparment-against-indent',
    templateUrl: './issue-to-deparment-against-indent.component.html',
    styleUrls: ['./issue-to-deparment-against-indent.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class IssueToDeparmentAgainstIndentComponent implements OnInit {
    IndentFrom: FormGroup;
    autocompletestore: string = "Store";
    dateTimeObj: any;
    sIsLoading: string = '';
    vstoreId: any = 0;
    isLoading = true;
    isStoreSelected: boolean = false;
    hasSelectedContacts: boolean = false;
    Charglist: any = [];
    Charglist1: any = [];
    FromStoreList: any = [];
    filteredOptionsStore: Observable<string[]>;
  IsMaterialAccept: boolean = false;
    IsIndentAgainstMaterialAccept: boolean = false;
    displayedColumns: string[] = [
        // 'CheckBox',
        'Priority',
        'IndentNo',
        'IndentTime',
        'FromStoreName',
        'ToStoreName',
        'Addedby',
    ];
    displayedColumns1: string[] = [
        // 'Status',
        'ItemName',
        'IndTotalQty',
        'IssueQty',
        'IndBalQty',
    ]

    dsIndentList = new MatTableDataSource<IndentList>();
    dsIndentItemDetList = new MatTableDataSource<IndentItemDetList>();
    dstempdata = new MatTableDataSource<IndentItemDetList>();
    @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
    @ViewChild('SecondPaginator', { static: true }) public SecondPaginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    constructor(
        public _IssueToDep: IssueToDepartmentService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        public _dialogRef: MatDialogRef<IssueToDeparmentAgainstIndentComponent>,
        private accountService: AuthenticationService,
        private _loggedService: AuthenticationService
    ) { }
  Status = ''
    ngOnInit(): void {
        this.IndentFrom = this._IssueToDep.createIndentFrom()
        this.getIndentList()

          if (this.IsMaterialAccept)
            this.Status = 'Material Direct issued with Acceptance'
        else
            this.Status = 'Material Issued without Acceptance'

        if (this.IsIndentAgainstMaterialAccept)
            this.Status = 'Indent Against Material issued with Acceptance'
        else
            this.Status = 'Indent Against  Material  issued without Acceptance'

    }


    getIndentList() {
        this.sIsLoading = 'loading-data';

        const frdate = this.datePipe.transform(this.IndentFrom.get("start").value, "yyyy-MM-dd")
        const todate = this.datePipe.transform(this.IndentFrom.get("end").value, "yyyy-MM-dd")
        const status = this.IndentFrom.get("Status").value
        const vdata = {
            "first": 0,
            "rows": 9999,
            "sortField": "IndentId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "FromStoreId",
                    "fieldValue": String(this.vstoreId),
                    "opType": "Equals"

                },
                {
                    "fieldName": "ToStoreId",
                    "fieldValue": String(this.accountService.currentUserValue.user.storeId),// String(this.vstoreId),
                    "opType": "Equals"

                },
                {
                    "fieldName": "From_Dt",
                    "fieldValue": frdate,
                    "opType": "Equals"

                },
                {
                    "fieldName": "To_Dt",
                    "fieldValue": todate,
                    "opType": "Equals"

                },
                {
                    "fieldName": "Status",
                    "fieldValue": status,
                    "opType": "Equals"

                }
            ],
            "exportType": "JSON",
            "columns": [
                {
                    "data": "string",
                    "name": "string"
                }
            ]

        }
        console.log(vdata);
        this._IssueToDep.getIndentList(vdata).subscribe(data => {
            this.dsIndentList.data = data.data as IndentList[];
            this.dsIndentList.sort = this.sort;
            this.dsIndentList.paginator = this.paginator;
            this.sIsLoading = '';
        },
            error => {
                this.sIsLoading = '';
            });
    }


    getIndentItemDetList(Param) {

        this.sIsLoading = 'loading-data';
        const vdata = {
            "first": 0,
            "rows": 9999,
            "sortField": "IndentId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "IndentId",
                    "fieldValue": String(Param.indentId),
                    "opType": "Equals"
                }
            ],
            "exportType": "JSON",
            "columns": [
                {
                    "data": "string",
                    "name": "string"
                }
            ]
        }

        this._IssueToDep.getIndentItemDetList(vdata).subscribe(data => {
            this.dsIndentItemDetList.data = data.data as IndentItemDetList[];
            console.log(data.data)
            this.Charglist = this.dsIndentItemDetList.data;
            this.dsIndentItemDetList.sort = this.sort;
            this.dsIndentItemDetList.paginator = this.paginator;

            this.sIsLoading = '';
        });
    }



    selectChangeStore(obj: any) {
        this.vstoreId = obj.value
        this.getIndentList()
    }

    OnIndentList() {
        if ((!this.dsIndentItemDetList.data.length)) {
            this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        this.Charglist.forEach(element => {
            if (element.balanceQty > 0)
                this.Charglist1.push(element)
        })

        if (this.Charglist1.length > 0)
            this._dialogRef.close(this.Charglist1);
        else {
            Swal.fire("Indent Balance Qty 0..No Item to Add")
            this._dialogRef.close(this.Charglist1);
        }

        console.log(this.Charglist1)
        this._dialogRef.close(this.Charglist1)

    }

    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    onClose() {
        this._matDialog.closeAll();
    }
    OnReset() {
        this._matDialog.closeAll();
        this.IndentFrom.reset();
    }
}
export class IndentList {
    IndentNo: any;
    IndentDate: any;
    FromStoreName: string;
    ToStoreName: string;
    Addedby: any;
    IndentId: any;
    Priority: any;
    constructor(IndentList) {
        {
            this.IndentNo = IndentList.IndentNo || 0;
            this.IndentDate = IndentList.IndentDate || 0;
            this.FromStoreName = IndentList.FromStoreName || '';
            this.ToStoreName = IndentList.ToStoreName || '';
            this.Addedby = IndentList.Addedby || 0;
            this.IndentId = IndentList.IndentId || 0;
            this.Priority = IndentList.Priority || 0;
        }
    }
}
export class IndentItemDetList {
    IndentNo: any;
    IndentDate: any;
    FromStoreName: string;
    ToStoreName: string;
    Addedby: any;
    IndentId: any;
    FromStoreId: any;
    ToStoreId: any;
    constructor(IndentItemDetList) {
        {
            this.IndentNo = IndentItemDetList.IndentNo || 0;
            this.IndentDate = IndentItemDetList.IndentDate || 0;
            this.FromStoreName = IndentItemDetList.FromStoreName || '';
            this.ToStoreName = IndentItemDetList.ToStoreName || '';
            this.Addedby = IndentItemDetList.Addedby || 0;
            this.IndentId = IndentItemDetList.IndentId || 0;
            this.FromStoreId = IndentItemDetList.FromStoreId || 0;
            this.ToStoreId = IndentItemDetList.ToStoreId || 0;
        }
    }
}
