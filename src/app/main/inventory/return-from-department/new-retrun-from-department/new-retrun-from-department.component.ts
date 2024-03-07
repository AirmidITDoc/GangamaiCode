import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ReturnFromDepartmentService } from '../return-from-department.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-new-retrun-from-department',
  templateUrl: './new-retrun-from-department.component.html',
  styleUrls: ['./new-retrun-from-department.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewRetrunFromDepartmentComponent implements OnInit {
  displayedColumns = [
    'ItemName',
    'IssueQty',
    'LandedTotalAmount',
  ];
  displayedColumns1 = [
    'IssueDate',
    'IssueId',
    'IssueNo'
  ];
  displayedColumns2 = [
    'ItemName',
    'BatchExpDate',
    'IssueQty',
    'PerUnitLandedRate',
    'VatPercentage',
    'LandedTotalAmount',
    'StkId'
  ];
  dateTimeObj:any;
  StoreList:any;
  ToStoreList:any;
  isStoreSelected:boolean=false;
  filteredOptionsStore: Observable<string[]>;
  screenFromString ='admission-from';
  sIsLoading: string = '';
  isLoading = true;

  dsItemList = new MatTableDataSource<ItemList>();
  dsIssueList = new MatTableDataSource<IssueList>();
  dsItemDetailsList = new MatTableDataSource<ItemDetailsList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('secondPaginator', { static: true }) public secondPaginator: MatPaginator;
  @ViewChild('thirdPaginator', { static: true }) public thirdPaginator: MatPaginator;
  constructor(
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewRetrunFromDepartmentComponent>,
    private accountService: AuthenticationService,
    public _loggedService:AuthenticationService,
    public toastr: ToastrService,
    public _ReturnToDepartmentList: ReturnFromDepartmentService,
    private _fuseSidebarService: FuseSidebarService,
  ) { }

  ngOnInit(): void {
    this.gePharStoreList();
    this.getToStoreSearchList();

    this.filteredOptionsStore = this._ReturnToDepartmentList.userFormGroup.get('ToStoreId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterToStore(value)),
    );
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._ReturnToDepartmentList.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._ReturnToDepartmentList.userFormGroup.get('StoreId').setValue(this.StoreList[0]);
    });
  }
  getToStoreSearchList() {
    this._ReturnToDepartmentList.getToStoreSearchList().subscribe(data => {
      this.ToStoreList = data;
     // console.log(this.ToStoreList)
    });
  }
  private _filterToStore(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
      return this.ToStoreList.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextStoresList(option) {
    return option && option.StoreName ? option.StoreName : '';
  }

getNewReturnToDepartmentList() {
  this.sIsLoading = 'loading-data';
  var vdata = {
    "FromStoreId": this._ReturnToDepartmentList.userFormGroup.get('ToStoreId').value.StoreId || 0,
    "ToStoreId": this._loggedService.currentUserValue.user.storeId || 0,
    "FromDate": this.datePipe.transform(this._ReturnToDepartmentList.userFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    "ToDate": this.datePipe.transform(this._ReturnToDepartmentList.userFormGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
  }
 // console.log(vdata);
  this._ReturnToDepartmentList.getNewReturnToDepartmentList(vdata).subscribe(data => {
    this.dsIssueList.data = data as IssueList[];
    this.dsIssueList.sort = this.sort;
    this.dsIssueList.paginator = this.paginator;
    this.sIsLoading = '';
   // console.log(this.dsIssueList.data);
  },
  error => {
    this.sIsLoading = '';
  });
}
getItemList(param){
  var vdata={
    "IssueId": param.IssueId
  }
 // console.log(vdata);
  this._ReturnToDepartmentList.getNewReturnItemList(vdata).subscribe(data => {
    this.dsItemList.data = data as ItemList[];
    this.dsItemList.sort = this.sort;
    this.dsItemList.paginator = this.paginator;
    this.sIsLoading = '';
   // console.log(this.dsItemList.data);
  },
  error => {
    this.sIsLoading = '';
  });
}
chargeslist:any=[];
getItemdetails(param){
  console.log(param)
  this.chargeslist.push(
    {
      ItemId: param.ItemId || 0,
      ItemName: param.ItemName || '',
      BatchExpDate: param.BatchExpDate || 0,
      IssueQty:param.PerUnitLandedRate || 0,
      PerUnitLandedRate :param.PerUnitLandedRate || 0,
      VatPercentage:param.VatPercentage || 0,
      LandedTotalAmount :param.LandedTotalAmount || 0,
      StkId:param.StkId || 0
    });
  this.sIsLoading = '';
  this.dsItemDetailsList.data = this.chargeslist;
}
OnSave(){
  if ((!this.dsIssueList.data.length)) {
    this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }
  if ((!this.dsItemDetailsList.data.length)) {
    this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }
  if ((!this.dsItemList.data.length)) {
    this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  } 
}
OnReset(){
  this.dsIssueList.data = [];
  this.dsItemDetailsList.data = [];
  this.dsItemList.data = [];
}
  onClose(){
    this._matDialog.closeAll();
  }
}
export class ItemList{
  ItemName:string;
  IssueQty:any;
  LandedTotalAmount:any;
  constructor(ItemList){
    {
      this.ItemName = ItemList.ItemName || '';
      this.IssueQty = ItemList.IssueQty || 0;
      this.LandedTotalAmount = ItemList.LandedTotalAmount || 0;
    }
  }
}
export class IssueList{
  IssueDate:any;
  IssueId:any;
  IssueNo:any;
  constructor(IssueList){
    {
      this.IssueDate = IssueList.IssueDate || 0;
      this.IssueId = IssueList.IssueId || 0;
      this.IssueNo = IssueList.IssueNo || 0;

    }
  }
}
export class ItemDetailsList {
  ItemId: any;
  ItemName: string;
  BatchExpDate: any;
  IssueQty: number;
  PerUnitLandedRate: number;
  VatPercentage: number;
  LandedTotalAmount: number;
  StkId: any;
  constructor(ItemDetailsList) {
    {
      this.ItemId = ItemDetailsList.ItemId || 0,
        this.ItemName = ItemDetailsList.ItemName || '',
        this.BatchExpDate = ItemDetailsList.BatchExpDate || 0,
        this.IssueQty = ItemDetailsList.PerUnitLandedRate || 0,
        this.PerUnitLandedRate = ItemDetailsList.PerUnitLandedRate || 0,
        this.VatPercentage = ItemDetailsList.VatPercentage || 0,
        this.LandedTotalAmount = ItemDetailsList.LandedTotalAmount || 0,
        this.StkId = ItemDetailsList.StkId || 0
    }
  }

}
