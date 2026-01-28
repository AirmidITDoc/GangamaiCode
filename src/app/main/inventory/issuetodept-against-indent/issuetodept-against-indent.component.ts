import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { IssueToDepartmentService } from '../issue-to-department/issue-to-department.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { NewIssueTodeptComponent } from '../issue-to-department/new-issue-todept/new-issue-todept.component';

@Component({
  selector: 'app-issuetodept-against-indent',
  templateUrl: './issuetodept-against-indent.component.html',
  styleUrls: ['./issuetodept-against-indent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IssuetodeptAgainstIndentComponent {
  IndentFrom: FormGroup;
  autocompletestore: string = "Store";
  dateTimeObj: any;
  sIsLoading: string = '';
  tostoreId = this.accountService.currentUserValue.user.storeId || 0
  vstoreId: any = "0";
  isLoading = true;
  isStoreSelected: boolean = false;
  hasSelectedContacts: boolean = false;
  Charglist: any = [];
  Charglist1: any = [];
  FromStoreList: any = [];
  filteredOptionsStore: Observable<string[]>;

  displayedColumns: string[] = [
    // 'CheckBox',
    'Priority',
    'IndentNo',
    'IndentTime',
    'FromStoreName',
    'ToStoreName',
    'Addedby',
    'action',
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
    // public _dialogRef: MatDialogRef<IssueToDeparmentAgainstIndentComponent>,
    private accountService: AuthenticationService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.IndentFrom = this._IssueToDep.createIndentFrom()
    this.getIndentList()
  }

  getIndentList() {
    this.sIsLoading = 'loading-data';

    let frdate = this.datePipe.transform(this.IndentFrom.get("start").value, "yyyy-MM-dd")
    let todate = this.datePipe.transform(this.IndentFrom.get("end").value, "yyyy-MM-dd")
    let IsClose = this.IndentFrom.get("Status").value

    var vdata = {
      "first": 0,
      "rows": 10,
      "sortField": "IndentId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "FromStoreId",
          "fieldValue": String(this.tostoreId),
          "opType": "Equals"
        },
        {
          "fieldName": "ToStoreId",
          "fieldValue": String(this.vstoreId),
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
          "fieldName": "IsVerify",
          "fieldValue": "1",
          "opType": "Equals"
        },
         {
          "fieldName": "IsClosed",
          "fieldValue": IsClose,
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
      this.dsIndentItemDetList.sort = this.sort;
      this.dsIndentItemDetList.paginator = this.paginator;

      this.sIsLoading = '';
    });
    // if (this.dsIndentItemDetList.data.length > 0)
    //   this.OnIndentList()
  }
  // ongetIndent(data){
  //   this.getIndentItemDetList(data)
  //   this.getIndentList()
  // }

  selectChangeStore(obj: any) {
    this.vstoreId = obj.value
    this.getIndentList()
  }

  OnIndentList(contact) {
    //  this.getIndentItemDetList(Param)

    // if ((!this.dsIndentItemDetList.data.length)) {
    //   this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    // this.Charglist.forEach(element => {
    //   if (element.balanceQty > 0)
    //     this.Charglist1.push(element)
    // })

    // if (this.Charglist1.length > 0)
    //   this._dialogRef.close(this.Charglist1);
    // else {
    //   Swal.fire("Indent Balance Qty 0..No Item to Add")
    //   this._dialogRef.close(this.Charglist1);
    // }

    console.log(contact)
    // this._dialogRef.close(this.Charglist1)

    const dialogRef = this._matDialog.open(NewIssueTodeptComponent,
      {
        maxWidth: "97vw",
        height: '99%',
        width: '95%',
        data:contact// this.Charglist
      });
    dialogRef.afterClosed().subscribe(result => {
      // this.dsIndentList.data = []
      // this.dsIndentItemDetList.data = []
      // this.Charglist = []
      // this.vstoreId=0
      // this.IndentFrom.get('FromStoreId').setValue(0)
      // this.getIndentList()
    });

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
