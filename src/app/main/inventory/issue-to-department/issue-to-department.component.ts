import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { IssueToDepartmentService } from './issue-to-department.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-issue-to-department',
  templateUrl: './issue-to-department.component.html',
  styleUrls: ['./issue-to-department.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IssueToDepartmentComponent implements OnInit {
  displayedColumns:string[] = [
    'action',
    'IssueNo',
    'IssueDate',
    'FromStoreName',
    'ToStoreName',
    'NetAmount',
    'Remark',
    'Receivedby'
    
  ];
  displayedColumns1:string[] = [
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'Qty',
    'PerUnitLandedRate',
    'LandedTotalAmount',
    'VatPercentage'
   ]

   displayedNewIssuesList3:string[] = [
    'ItemId',
    'ItemName',
    'BatchNO',
    'ExpDate',
    'BalanceQty',
    'Qty',
    'UnitRate',
    'TotalAmount'
   ];
   displayedNewIssuesList1:string[] = [
    'ItemName',
    'Qty'
   ]
   displayedNewIssuesList2:string[] = [
    'BatchNo',
    'ExpDateNo',
    'BalQty'
   ]
   hasSelectedContacts: boolean;
   isItemIdSelected: boolean = false;
  sIsLoading: string = '';
  isLoading = true;
  ToStoreList:any=[];
  FromStoreList:any=[];
  screenFromString = 'admission-form';
  filteredOptions: any;
  ItemnameList = [];
  showAutocomplete = false;
  noOptionFound: boolean = false;
  ItemCode:any;
  ItemName:any;
  Qty:any;
  chargeslist: any = [];
  filteredOptionsItem:any;
  ItemId: any;
  BalanceQty: any;


  dsIssueToDep = new MatTableDataSource<IssueToDep>();

  dsIssueItemList = new MatTableDataSource<IssueItemList>();

  dsNewIssueList1 = new MatTableDataSource<NewIssueList1>();
  dsNewIssueList2 = new MatTableDataSource<NewIssueList2>();
  dsNewIssueList3 = new MatTableDataSource<NewIssueList3>();

 

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  
  constructor(
    public _IssueToDep: IssueToDepartmentService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    
  ) {  }

  ngOnInit(): void {
   
    this.getToStoreSearchList();
    this.getFromStoreSearchList();
    // this.getIssueToDepList();
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
  getToStoreSearchList() {
    this._IssueToDep.getToStoreSearchList().subscribe(data => {
      this.ToStoreList = data;
    });
  }

  getFromStoreSearchList() {
    var data = {
      "Id": 1
    }
    this._IssueToDep.getFromStoreSearchList(data).subscribe(data => {
      this.FromStoreList = data;
       this._IssueToDep.IssueSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0]);
    });
  }
  
  getIssueToDepList() {
    var vdata = {
      "FromStoreId": this._IssueToDep.IssueSearchGroup.get('FromStoreId').value.FromStoreId || 1,
      "ToStoreId": this._IssueToDep.IssueSearchGroup.get('ToStoreId').value.ToStoreId || 0,
       "From_Dt": this.datePipe.transform(this._IssueToDep.IssueSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "To_Dt": this.datePipe.transform(this._IssueToDep.IssueSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "IsVerify": 0,
    }
    console.log(vdata)
      this._IssueToDep.getIssueToDepList(vdata).subscribe(data => {
      this.dsIssueToDep.data = data as IssueToDep[];
      this.dsIssueToDep.sort = this.sort;
      this.dsIssueToDep.paginator = this.paginator;
      console.log(this.dsIssueToDep.data);
    } );
  }

  getIssueItemList(Param){
    
    var vdata = {
      "IssueId": Param
    }
      this._IssueToDep.getIssueItemList(vdata).subscribe(data => {
      this.dsIssueItemList.data = data as IssueItemList[];
      this.dsIssueItemList.sort = this.sort;
      this.dsIssueItemList.paginator = this.paginator;
      console.log(this.dsIssueItemList.data);
    });
  }
  OnSelect(Param){
    console.log(Param.IssueId);
    this.getIssueItemList(Param.IssueId)
  } 
  
  
  
  getSearchItemList() {
    var m_data = {
      "ItemName": `${this._IssueToDep.userFormGroup.get('ItemID').value}%`
      // "ItemID": 1//this._IssueToDep.userFormGroup.get('ItemID').value.ItemID || 0 
    }
    // console.log(m_data);
    if (this._IssueToDep.userFormGroup.get('ItemID').value.length >= 2) {
      this._IssueToDep.getItemlist(m_data).subscribe(data => {
        this.filteredOptionsItem = data;
        // console.log(this.filteredOptionsItem.data);
        this.filteredOptionsItem = data;
        if (this.filteredOptionsItem.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }
  }
  getOptionItemText(option) {
    this.ItemId = option.ItemID;
    if (!option) return '';
    return option.ItemID + ' ' + option.ItemName ;
  }
  getSelectedObjItem(obj) {
    // this.registerObj = obj;
    this.ItemName = obj.ItemName;
    this.ItemId = obj.ItemID;
 

  }
 
}
export class NewIssueList3{

  ItemId:any;
  ItemName:any;
  BatchNO:any;
  ExpDate:any;
  BalanceQty:any;
  Qty:any;
  UnitRate:any;
  TotalAmount:any;
  
  constructor(NewIssueList3){
    this.ItemId = NewIssueList3.ItemId || 0;
    this.ItemName = NewIssueList3.ItemName || '';
    this.BatchNO = NewIssueList3.BatchNO || 0;
    this.ExpDate = NewIssueList3.ExpDate ||  1/2/23;
    this.BalanceQty = NewIssueList3.BalanceQty ||  0;
    this.Qty = NewIssueList3.Qty || 0;
    this.UnitRate = NewIssueList3.UnitRate || 0;
    this.TotalAmount = NewIssueList3.TotalAmount || 0;
  }
}

export class NewIssueList2{

  BatchNo:any;
  ExpDateNo;any;
  BalQty:any;
  
  constructor(NewIssueList2){
    this.BatchNo = NewIssueList2.BatchNo || 0;
    this.ExpDateNo = NewIssueList2.ExpDateNo || 1/2/23;
    this.BalQty = NewIssueList2.BalQty || 0;

  }
}
export class NewIssueList1{

  ItemName:any;
  Qty;any;

  constructor(NewIssueList1){
    this.ItemName = NewIssueList1.ItemName || '';
    this.Qty = NewIssueList1.Qty || 0;

  }
}

export class IssueItemList {
  ItemName: string;
  BatchNo: number;
  BatchExpDate:number;
  Qty:number;
  PerUnitLandedRate:number;
  LandedTotalAmount:number;
  VatPercentage:number;
  StoreId:any;
  StoreName:any;

  constructor(IssueItemList) {
    {
      this.ItemName = IssueItemList.ItemName || "";
      this.BatchNo = IssueItemList.BatchNo || 0;
      this.BatchExpDate = IssueItemList.BatchExpDate || 0;
      this.Qty = IssueItemList.Qty|| 0;
      this.PerUnitLandedRate = IssueItemList.PerUnitLandedRate || 0;
      this.LandedTotalAmount=IssueItemList.LandedTotalAmount || 0;
      this.VatPercentage=IssueItemList.VatPercentage || 0;
      this.StoreId = IssueItemList.StoreId || 0;
      this.StoreName = IssueItemList.StoreName || "";
    }
  }
}

export class IssueToDep {
  IssueNo: Number;
  IssueDate: number;
  FromStoreName:string;
  ToStoreName:string;
  NetAmount:number;
  Remark: string;
  Receivedby:string;
  IssueDepId:number;

  constructor(IssueToDep) {
    {
      this.IssueNo = IssueToDep.IssueNo || 0;
      this.IssueDate = IssueToDep.IssueDate || 0;
      this.FromStoreName = IssueToDep.FromStoreName || "";
      this.ToStoreName = IssueToDep.ToStoreName || "";
      this.NetAmount = IssueToDep.NetAmount || 0;
      this.Remark = IssueToDep.Remark || "";
      this.Receivedby = IssueToDep.Receivedby || "";
      this.IssueDepId = IssueToDep.IssueDepId || 0;
    }
    }
  }

