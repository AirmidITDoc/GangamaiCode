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

@Component({
  selector: 'app-issue-to-deparment-against-indent',
  templateUrl: './issue-to-deparment-against-indent.component.html',
  styleUrls: ['./issue-to-deparment-against-indent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IssueToDeparmentAgainstIndentComponent implements OnInit {
  displayedColumns: string[] = [
    'IndentNo',
    'IndentDate',
    'FromStoreName',
    'ToStoreName',
    'Addedby',
  ];
  displayedColumns1: string[] = [
    'ItemName',
    'Qty',
  ]

  dateTimeObj: any;
  sIsLoading: string = '';
  isLoading = true;
  FromStoreList: any = [];
  hasSelectedContacts: boolean = false;
  Charglist:any=[];


  dsIndentList = new MatTableDataSource<IndentList>();
  dsIndentItemDetList = new MatTableDataSource<IndentItemDetList>();
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
    this.gePharStoreList();
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getIndentList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
      "ToStoreId": 10003,//this._loggedService.currentUserValue.user.storeId,
      "From_Dt": this.datePipe.transform(this._IssueToDep.IndentFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._IssueToDep.IndentFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "Status": this._IssueToDep.IndentFrom.get('Status').value
    }
    console.log(vdata);
    this._IssueToDep.getIndentList(vdata).subscribe(data => {
      this.dsIndentList.data = data as IndentList[];
      console.log(this.dsIndentList);
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
      'IndentId':Param.IndentId  
    }
   // console.log(vdata);
    this._IssueToDep.getIndentItemDetList(vdata).subscribe(data => {
      this.dsIndentItemDetList.data = data as IndentItemDetList[];
      this.Charglist = this.dsIndentItemDetList.data;
     console.log(this.dsIndentItemDetList);
      this.dsIndentItemDetList.sort = this.sort;
      this.dsIndentItemDetList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._IssueToDep.getLoggedStoreList(vdata).subscribe(data => {
      this.FromStoreList = data;
      this._IssueToDep.IndentFrom.get('FromStoreId').setValue(this.FromStoreList[0])
    });
  }
  OnIndentList(){
    if ((!this.dsIndentItemDetList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    console.log(this.Charglist)
    this._dialogRef.close(this.Charglist);
  }
  onClose() {
    this._matDialog.closeAll();
  }
  OnReset(){
    this._matDialog.closeAll();
  }
}
export class IndentList {
  IndentNo: any;
  IndentDate: any;
  FromStoreName: string;
  ToStoreName: string;
  Addedby: any;
  constructor(IndentList) {
    {
      this.IndentNo = IndentList.IndentNo || 0;
      this.IndentDate = IndentList.IndentDate || 0;
      this.FromStoreName = IndentList.FromStoreName || '';
      this.ToStoreName = IndentList.ToStoreName || '';
      this.Addedby = IndentList.Addedby || 0;
    }
  }
}
export class IndentItemDetList {
  IndentNo: any;
  IndentDate: any;
  FromStoreName: string;
  ToStoreName: string;
  Addedby: any;
  constructor(IndentItemDetList) {
    {
      this.IndentNo = IndentItemDetList.IndentNo || 0;
      this.IndentDate = IndentItemDetList.IndentDate || 0;
      this.FromStoreName = IndentItemDetList.FromStoreName || '';
      this.ToStoreName = IndentItemDetList.ToStoreName || '';
      this.Addedby = IndentItemDetList.Addedby || 0;
    }
  }
}
