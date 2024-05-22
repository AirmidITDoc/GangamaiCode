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

@Component({
  selector: 'app-issue-to-deparment-against-indent',
  templateUrl: './issue-to-deparment-against-indent.component.html',
  styleUrls: ['./issue-to-deparment-against-indent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IssueToDeparmentAgainstIndentComponent implements OnInit {
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

  dateTimeObj: any;
  sIsLoading: string = '';
  isLoading = true;
  FromStoreList: any = [];
  hasSelectedContacts: boolean = false;
  Charglist:any=[];
  ToStoreList1:any=[];
  filteredOptionsStore: Observable<string[]>;
  isStoreSelected:boolean=false;


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
    this.getToStoreList();
    this.filteredOptionsStore = this._IssueToDep.IndentFrom.get('ToStoreId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterToStore(value)),
  );
  }
  getToStoreList() {
    this._IssueToDep.getToStoreSearchList().subscribe(data => {
        this.ToStoreList1 = data;
    });
}
private _filterToStore(value: any): string[] {
    if (value) {
        const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
        return this.ToStoreList1.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    }
}
getOptionTextStores(option) {
  return option && option.StoreName ? option.StoreName : '';
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
      "ToStoreId": this._IssueToDep.IndentFrom.get('ToStoreId').value.StoreId || 0,
      "From_Dt": this.datePipe.transform(this._IssueToDep.IndentFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._IssueToDep.IndentFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "Status": this._IssueToDep.IndentFrom.get('Status').value
    }
   // console.log(vdata);
    this._IssueToDep.getIndentList(vdata).subscribe(data => {
      this.dsIndentList.data = data as IndentList[];
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
    this._IssueToDep.getIndentItemDetList(vdata).subscribe(data => {
      this.dsIndentItemDetList.data = data as IndentItemDetList[];
     // console.log(this.dsIndentItemDetList.data)
     // this.Charglist = this.dsIndentItemDetList.data;
      this.dsIndentItemDetList.sort = this.sort;
      this.dsIndentItemDetList.paginator = this.paginator;
     // console.log(this.vIndentId)
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
      this.GetIndentGainstlist(Param);  
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
  GetIndentGainstlist(param){
    var vdata = {
      'IndentId':  param.IndentId 
  }
      console.log(vdata);
     this._IssueToDep.getAgainstIndentList(vdata).subscribe(data => {
      this.dstempdata.data = data as IndentItemDetList[];
      this.Charglist = this.dstempdata.data;
      console.log(this.Charglist);
      console.log( this.dstempdata.data);
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
    this._IssueToDep.IndentFrom.reset();
  }
}
export class IndentList {
  IndentNo: any;
  IndentDate: any;
  FromStoreName: string;
  ToStoreName: string;
  Addedby: any;
  IndentId:any;
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
  IndentId:any;
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
