import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { SalesReturnService } from './sales-return.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalesReturnDetList, SalesReturnList } from '../brows-sales-bill/brows-sales-bill.component';

@Component({
  selector: 'app-sales-return',
  templateUrl: './sales-return.component.html',
  styleUrls: ['./sales-return.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class SalesReturnComponent implements OnInit {

  displayedColumns = [
    'SalesId',
    'Date',
    'SalesNo',
    'RegNo',
    'PatientName',
    'TotalAmount',
    // 'action',
  ];
  
  dspSalesDetColumns = [
    // 'SalesId',
    'SalesNo',
    // 'SalesDetId',
    'OP_IP_ID',
    // 'ItemId',
    'ItemName',
    'BatchNo',
    // 'BatchExpDate',
    'UnitMRP',
    'Qty',
    'ReturnQty',
    'TotalAmount',
    'VatPer',
    'VatAmount',
    'DiscPer',
    'DiscAmount',
    'GrossAmount',
    // 'LandedPrice',
    // 'TotalLandedAmount',
    // 'IsBatchRequired',
    // 'PurRateWf',
    // 'PurTotAmt',
    // 'IsPrescription',
    'CGSTPer',
    'SGSTPer',
    'IGSTPer',
    'IsPurRate',
    'StkID'
  ]
  SearchForm: FormGroup;
  dssaleList = new MatTableDataSource<SaleBillList>();
  dssaleDetailList= new MatTableDataSource<SalesDetailList>();

  StoreList:any = [];

  constructor(
    public _SalesReturnService: SalesReturnService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private _loggedService: AuthenticationService,
    
  ) { 
    this.SearchForm=this.SearchFilter();
  }

  ngOnInit(): void {
   this.getSalesList();
   this.getPharStoreList()
  }
  
  SearchFilter():FormGroup{
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo:'',
      F_Name:'',                                           
      L_Name: '',                                                      
      SalesNo : '',
      StoreId :'',
    })
  }

  getPharStoreList() {
    var vdata={
      Id : this._loggedService.currentUserValue.user.storeId
    }
    this._SalesReturnService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this.SearchForm.get('StoreId').setValue(this.StoreList[0]);
      
    });
  }

  getSalesList(){
    var vdata={
      F_Name:this.SearchForm.get('F_Name').value || '%' ,                                            
      L_Name: this.SearchForm.get('L_Name').value || '%'  ,                                     
      From_Dt: this.datePipe.transform(this.SearchForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',                                      
      To_Dt :  this.datePipe.transform(this.SearchForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',                                 
      Reg_No :this.SearchForm.get('RegNo').value || 0  ,                  
      SalesNo :this.SearchForm.get('SalesNo').value || 0  , 
      StoreId :this.SearchForm.get('StoreId').value.storeid || 0  ,
    }
   console.log(vdata);
    this._SalesReturnService.getSalesBillList(vdata).subscribe(data=>{
      this.dssaleList.data= data as SaleBillList[];
      // this.dssaleList.sort = this.sort;
      // this.dssaleList.paginator = this.paginator;
      console.log(this.dssaleList.data);
    })
  }

  onSelect(Parama){
  // console.log(Parama);
    if (Parama.PaidType == "Paid"){
      this.getSalesDetCashList(Parama)
    }
     else{
      this.getSalesDetCreditList(Parama)
     }
 }
 
  getSalesDetCashList(Params){
    var vdata={
      SalesId:Params.SalesId,                                            
      SalesNo: Params.SalesNo  ,                                     
      StoreId :this.SearchForm.get('StoreId').value.storeid || 0  ,
      CashCounterId : Params.CashCounterID 
    }
  //  console.log(vdata);
    this._SalesReturnService.getSalesDetCashList(vdata).subscribe(data=>{
      this.dssaleDetailList.data= data as SalesDetailList[];
      // this.dssaleList.sort = this.sort;
      // this.dssaleList.paginator = this.paginator;
      console.log(this.dssaleDetailList.data);
    })
  }

  getSalesDetCreditList(Params){
    var vdata={
      SalesId:Params.SalesId,                                            
      SalesNo: Params.SalesNo  ,                                     
      StoreId :this.SearchForm.get('StoreId').value.storeid || 0  ,
      CashCounterId : Params.CashCounterID 
    }
  //  console.log(vdata);
    this._SalesReturnService.getSalesDetCreditList(vdata).subscribe(data=>{
      this.dssaleDetailList.data= data as SalesDetailList[];
      // this.dssaleList.sort = this.sort;
      // this.dssaleList.paginator = this.paginator;
      console.log(this.dssaleDetailList.data);
    })
  }

  getCellCalculation(contact){
    console.log(contact);
  }

}

export class SaleBillList {
  SalesId: number;
  Date: Date;
  SalesNo:number;
  RegNo:number;
  PatientName:string;
  TotalAmount:any;
  VatAmount:any;
  DiscAmount:any;
  NetAmount:any;
  BalanceAmount:any;
  PaidAmount:any;
  OP_IP_Type:any;
  PatientType:any;
  PaidType:any;
  IsPrescription:boolean;
  CashCounterID:any;
  /**
   * Constructor
   *
   * @param SaleBillList
   */
  constructor(SaleBillList) {
    {
      this.SalesId = SaleBillList.SalesId || "";
      this.Date = SaleBillList.Date || 0;
      this.SalesNo = SaleBillList.SalesNo || 0;
      this.RegNo = SaleBillList.RegNo|| 0;
      this.PatientName = SaleBillList.PatientName || 0;
      this.TotalAmount =SaleBillList.TotalAmount || 0;
      this.VatAmount  =SaleBillList.VatAmount || 0;
      this.DiscAmount =SaleBillList.DiscAmount || 0;
      this.NetAmount =SaleBillList.NetAmount || 0;
      this.BalanceAmount =SaleBillList.BalanceAmount || 0;
      this.PaidAmount =SaleBillList.PaidAmount || 0;
      this.OP_IP_Type =SaleBillList.OP_IP_Type || 0;
      this.PatientType =SaleBillList.PatientType || '';
      this.PaidType =SaleBillList.PaidType || '';
      this.IsPrescription =SaleBillList.IsPrescription || '';
      this.CashCounterID =SaleBillList.CashCounterID || 0;
    }
  }
}
export class SalesDetailList {
  SalesId: Number;
  SalesDetId: number;
  SalesNo:string;
  OP_IP_ID:string;
  ItemId:number;
  ItemName: string;
  BatchNo:any;
  BatchExpDate:Date;
  UnitMRP:any;
  Qty:any;
  TotalAmount:any;
  VatPer
  VatAmount:any;
  DiscPer:any;
  DiscAmount:any;
  GrossAmount:any;
  LandedPrice:any;
  TotalLandedAmount:any;
  IsBatchRequired:any;
  PurRateWf:any;
  PurTotAmt:any;
  IsPrescription:any;
  CGSTPer:any;
  SGSTPer:any;
  IGSTPer:any;
  IsPurRate:any;
  StkID:any;
  /**
   * Constructor
   *
   * @param SalesDetailList
   */
  constructor(SalesDetailList) {
    {
      this.SalesId= SalesDetailList.SalesId || 0;
      this.SalesDetId= SalesDetailList.SalesDetId || 0;
      this.SalesNo= SalesDetailList.SalesNo || 0;
      this.OP_IP_ID= SalesDetailList.OP_IP_ID || 0;
      this.ItemId= SalesDetailList.ItemId || 0;
      this.ItemName= SalesDetailList.ItemName || 0;
      this.BatchNo= SalesDetailList.BatchNo || 0;
      this.BatchExpDate= SalesDetailList.BatchExpDate || 0;
      this.UnitMRP= SalesDetailList.UnitMRP || 0;
      this.Qty= SalesDetailList.Qty || 0;
      this.TotalAmount= SalesDetailList.TotalAmount || 0;
      this.VatPer= SalesDetailList.VatPer || 0;
      this.VatAmount= SalesDetailList.VatAmount || 0;
      this.DiscPer= SalesDetailList.DiscPer || 0;
      this.DiscAmount= SalesDetailList.DiscAmount || 0;
      this.GrossAmount= SalesDetailList.GrossAmount || 0;
      this.LandedPrice= SalesDetailList.LandedPrice || 0;
      this.TotalLandedAmount= SalesDetailList.TotalLandedAmount || 0;
      this.IsBatchRequired= SalesDetailList.IsBatchRequired || 0;
      this.PurRateWf= SalesDetailList.PurRateWf || 0;
      this.PurTotAmt= SalesDetailList.PurTotAmt || 0;
      this.IsPrescription= SalesDetailList.IsPrescription || 0;
      this.CGSTPer= SalesDetailList.CGSTPer || 0;
      this.SGSTPer= SalesDetailList.SGSTPer || 0;
      this.IGSTPer= SalesDetailList.IGSTPer || 0;
      this.IsPurRate= SalesDetailList.IsPurRate || 0;
      this.StkID= SalesDetailList.StkID || 0;
    }
  }
}

