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


  dsIssueToDep = new MatTableDataSource<IssueToDep>();

  dsIssueItemList = new MatTableDataSource<IssueItemList>();

  dsItemNameList = new MatTableDataSource<ItemNameList>();

  displayedColumns = [
    'IssueNo',
    'IssueDate',
    'FromStoreName',
    'ToStoreName',
    'NetAmount',
    'Remark',
    'Receivedby',
    'action',
  ];

  displayedColumns1 = [
   'ItemName',
   'BatchNo',
   'BatchExpDate',
   'Qty',
   'PerUnitLandedRate',
   'LandedTotalAmount',
   'VatPercentage',
  ];

  displayedColumns2 = [
    'ItemId',
    'ItemName',
    'BatchNO',
    'BalanceQty',
    'Qty',
    'UnitRate',
    'TotalAmount',
   ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private _formBuilder: any;
  BatchNO: any;
  BalanceQty: any;
  UnitRate: any;
  TotalAmount: any;
  IssueForm: any;

  constructor(
    public _IssueToDep: IssueToDepartmentService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    
  ) { 

   
  }

  ngOnInit(): void {
    this.getItemNameList();
    this.getToStoreSearchList();
    this.getFromStoreSearchList();
    this.getIssueToDep() 
  }
  

  getOptionText(option) {
    
    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';

  }


  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
  
  getIssueToDep() {
    this.sIsLoading = 'loading-data';
    var Param = {
      "FromStoreId": this._IssueToDep.IssueSearchGroup.get('FromStoreId').value.FromStoreId || 1,
      "ToStoreId": this._IssueToDep.IssueSearchGroup.get('ToStoreId').value.ToStoreId || 0,
       "From_Dt": this.datePipe.transform(this._IssueToDep.IssueSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "To_Dt": this.datePipe.transform(this._IssueToDep.IssueSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "IsVerify": 0,
    }
    console.log(Param)
      this._IssueToDep.getIssueToDep(Param).subscribe(data => {
      this.dsIssueToDep.data = data as IssueToDep[];
      this.dsIssueToDep.sort = this.sort;
      this.dsIssueToDep.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }


  getItemNameList(){
    var Param = {

      "ItemName": `${this._IssueToDep.userFormGroup.get('ItemName').value}%`,
      "StoreId": 1//this._IndentID.IndentSearchGroup.get("Status").value.Status
    }
    console.log(Param);
    this._IssueToDep.getItemNameList(Param).subscribe(data => {
      this.filteredOptions = data;
      // console.log( this.filteredOptions )
            if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }

  getSelectedObj(obj) {
    this.ItemCode=obj.ItemId;
    this.ItemName = obj.ItemName;
    this.BatchNO = obj.BatchNO;
    this.BalanceQty = obj.BalanceQty;
    this.Qty = 32//obj.BalQty;
    this.UnitRate = obj.UnitRate;
    this.TotalAmount = obj.TotalAmount;
   
  }

  onAdd(){
    debugger;
    // this.dsItemNameList.data = [];
    if(this.dsItemNameList.data.length > 0){
  
    this.dsItemNameList.data.forEach((element) => {
      console.log(element)
      debugger;
     if(this.ItemCode == element.ItemId)
     {
      Swal.fire("Item already Added")
     }else if(this.ItemCode != element.ItemId){
      debugger;
      this.chargeslist.push(
        {
          ItemId:this.ItemCode,
          ItemName: this.ItemName,
          BatchNO: this.BatchNO,
          BalanceQty: this.BalanceQty,
          UnitRate: this.UnitRate,
          TotalAmount: this.TotalAmount,
        });
     }
    });
  }

  if(this.dsItemNameList.data.length ==0){
    this.chargeslist.push(
      {
        ItemId:this.ItemCode,
        ItemName: this.ItemName,
        BatchNO: this.BatchNO,
        BalanceQty: this.BalanceQty,
        UnitRate: this.UnitRate,
        TotalAmount: this.TotalAmount,
      });
    }

      this.dsItemNameList.data=this.chargeslist
  }

  
  onScroll() {
    //Note: This is called multiple times after the scroll has reached the 80% threshold position.
    // this.nextPage$.next();
  }
  getIssueItemList(Params){
    this.sIsLoading = 'loading-data';
    var Param = {
      "IssueId": Params.IssueId
    }
      this._IssueToDep.getIssueItemList(Param).subscribe(data => {
      this.dsIssueItemList.data = data as IssueItemList[];
      this.dsIssueItemList.sort = this.sort;
      this.dsIssueItemList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
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
      
  onClear(){
    
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
  static ItemId: string;
  static ItemName: number;
  static Qty: number;
  static BatchNO: number;
  static BalanceQty: number;
  static UnitRate: number;
  static TotalAmount: number;
  
  /**
   * Constructor
   *
   * @param IssueItemList
   */
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

  /**
   * Constructor
   *
   * @param IssueToDep
   */
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


export class ItemNameList {
  ItemId: string;
  ItemName: number;
  BatchNO:number;
  BalanceQty:number;
  Qty:number;
  UnitRate:number;
  TotalAmount:number;
  /**
   * Constructor
   *
   * @param ItemNameList
   */
  constructor(ItemNameList) {
    {
      this.ItemId = IssueItemList.ItemId || "";
      this.ItemName = IssueItemList.ItemName || 0;
      this.BatchNO = IssueItemList.BatchNO || 0;
      this.BalanceQty = IssueItemList.BalanceQty || 0;
      this.Qty = IssueItemList.Qty || 0;
      this.UnitRate = IssueItemList.UnitRate || 0;
      this.TotalAmount = IssueItemList.TotalAmount || 0;
      
    }
  }
}
