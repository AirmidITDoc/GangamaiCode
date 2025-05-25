import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IssueToDepartmentService } from '../issue-to-department.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { IssueItemList, NewIssueList3 } from '../issue-to-department.component';
import { GRNItemResponseType } from 'app/main/purchase/good-receiptnote/new-grn/types';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { IssuTodeptComponent } from '../issu-todept/issu-todept.component';

@Component({
  selector: 'app-issue-to-deparment-against-indent',
  templateUrl: './issue-to-deparment-against-indent.component.html',
  styleUrls: ['./issue-to-deparment-against-indent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IssueToDeparmentAgainstIndentComponent implements OnInit {
  IndentFrom: FormGroup;

  displayedColumns: string[] = [
    // 'CheckBox',
    'IndentNo',
    'IndentDate',
    'FromStoreName',
    'ToStoreName',
    'Addedby',
  ];
  displayedColumns1: string[] = [
    // 'Status',
    'ItemName',
    'IndTotalQty',
    'IssueQty',
    'IndBalQty'
  ]
  autocompletestore: string = "Store";
  dateTimeObj: any;
  sIsLoading: string = '';
  isLoading = true;
  FromStoreList: any = [];
  hasSelectedContacts: boolean = false;
  Charglist: any = [];
  ToStoreList1: any = [];
  filteredOptionsStore: Observable<string[]>;
  isStoreSelected: boolean = false;


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

  ngOnInit(): void {
    this.IndentFrom = this._IssueToDep.createIndentFrom()
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getIndentList() {
    this.sIsLoading = 'loading-data';

    let frdate=this.datePipe.transform(this.IndentFrom.get("start").value, "yyyy-MM-dd")
     let todate=this.datePipe.transform(this.IndentFrom.get("end").value, "yyyy-MM-dd")
    var vdata = {
      "first": 0,
      "rows": 10,
      "sortField": "IndentId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "FromStoreId",
          "fieldValue": String(this.accountService.currentUserValue.user.storeId),
          "opType": "Equals"

        },
        {
          "fieldName": "ToStoreId",
          "fieldValue": String(this.vstoreId),
          "opType": "Equals"

        },
        {
          "fieldName": "From_Dt",
          "fieldValue": "2024-01-01",
          "opType": "Equals"

        },
        {
          "fieldName": "To_Dt",
          "fieldValue": "2025-08-21",
          "opType": "Equals"

        },
        {
          "fieldName": "Status",
          "fieldValue": "0",
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

      console.log(data);
      this.dsIndentList.sort = this.sort;
      this.dsIndentList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  getIndentItemDetList(Param) {
    console.log(Param)
    this.sIsLoading = 'loading-data';
    var vdata = {
      "first": 0,
      "rows": 10,
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
      // this.dsIndentItemDetList.sort = this.sort;
      // this.dsIndentItemDetList.paginator = this.paginator;
      console.log(this.Charglist)
      this.sIsLoading = '';
    });
    this.GetIndentGainstlist(Param);
  }

  GetIndentGainstlist(param) {
    var vdata = {
      'IndentId': param.indentId
    }
    console.log(vdata);
    this._IssueToDep.getAgainstIndentList(vdata).subscribe(data => {
      this.dstempdata.data = data as IndentItemDetList[];
      this.Charglist = this.dstempdata.data;
      console.log(this.Charglist);
      console.log(this.dstempdata.data);
    });
  }

  vstoreId: any = 0;
  selectChangeStore(obj: any) {
    this.vstoreId = obj.value

  }

  OnIndentList() {
    if ((!this.dsIndentItemDetList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    console.log(this.Charglist)
    this._dialogRef.close(this.Charglist);
    const dialogRef = this._matDialog.open(IssuTodeptComponent,
      {
        maxWidth: "97vw",
        height: '90%',
        width: '95%',
        data: this.Charglist
      });
    dialogRef.afterClosed().subscribe(result => {

    });
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
  constructor(IndentList) {
    {
      this.IndentNo = IndentList.IndentNo || 0;
      this.IndentDate = IndentList.IndentDate || 0;
      this.FromStoreName = IndentList.FromStoreName || '';
      this.ToStoreName = IndentList.ToStoreName || '';
      this.Addedby = IndentList.Addedby || 0;
      this.IndentId = IndentList.IndentId || 0;
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
  constructor(IndentItemDetList) {
    {
      this.IndentNo = IndentItemDetList.IndentNo || 0;
      this.IndentDate = IndentItemDetList.IndentDate || 0;
      this.FromStoreName = IndentItemDetList.FromStoreName || '';
      this.ToStoreName = IndentItemDetList.ToStoreName || '';
      this.Addedby = IndentItemDetList.Addedby || 0;
      this.IndentId = IndentItemDetList.IndentId || 0;
    }
  }
}
