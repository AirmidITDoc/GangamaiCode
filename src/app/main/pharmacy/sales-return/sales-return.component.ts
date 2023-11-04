import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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

  GrossAmt:any;
  DiscAmt:any;
  VatAmount:any;
  CGSTAmount:any;
  SGSTAmount:any;
  IGSTAmount:any;
  TotalAmt:any;
  LandAmt:any;
  PurAmt:any; 
  dateTimeObj: any;

  StoreList:any = [];
  Itemselectedlist: any = [];
  ReturnAmt:any=0;
  NetAmt:any=0;
  Qty:any=0;
  RQty:any=0;
  FinalTotalAmount:any=0;
  sIsLoading:any;
  screenFromString = 'payment-form';
  SalesID:any;
  SalesDetId:any;
  OP_IP_Id:any;
  IspureRate:boolean=true;

  displayedColumns = [
    // 'SalesId',
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
    // 'OP_IP_ID',
    // 'ItemId',
    'ItemName',
    'BatchNo',
    // 'BatchExpDate',
    // 'UnitMRP',
    'Qty',
    // 'ReturnQty',
    'TotalAmount',
    // 'VatPer',
    // 'VatAmount',
    'DiscPer',
    // 'DiscAmount',
    // 'GrossAmount',
    // 'LandedPrice',
    // 'TotalLandedAmount',
    // 'IsBatchRequired',
    // 'PurRateWf',
    // 'PurTotAmt',
    // 'IsPrescription',
    // 'CGSTPer',
    // 'SGSTPer',
    // 'IGSTPer',
    // 'IsPurRate',
    // 'StkID'
  ]

  dspSalesDetselectedColumns = [
    // 'SalesId',
    'SalesNo',
    // 'SalesDetId',
    // 'OP_IP_ID',
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
    'LandedPrice',
    'TotalLandedAmount',
    // 'IsBatchRequired',
    'PurRateWf',
    'PurTotAmt',
    'CGSTPer',
    'CGSTAmount',
    'SGSTPer',
    'SGSTAmount',
    'IGSTPer',
    'IGSTAmount',
    'IsPurRate',
    'StkID'
  ]
  SearchForm: FormGroup;
  FinalReturnform: FormGroup;
  dssaleList = new MatTableDataSource<SaleBillList>();
  dssaleDetailList= new MatTableDataSource<SalesDetailList>();
  selectedssaleDetailList= new MatTableDataSource<SalesDetailList>();
  

  constructor(
    public _SalesReturnService: SalesReturnService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private _loggedService: AuthenticationService,
    
  ) { 
    this.SearchForm=this.SearchFilter();
    this.FinalReturnform=this.Returnform();
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

  Returnform() {
    return this._formBuilder.group({
      NetAmt:'',
      ReturnAmt:''
    });
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
    debugger
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
    this.SalesID=Params.SalesId;
    var vdata={
      SalesId:Params.SalesId,                                            
      SalesNo: Params.SalesNo  ,                                     
      StoreId :this.SearchForm.get('StoreId').value.storeid || 0  ,
      CashCounterId : Params.CashCounterID 
    }
   console.log(vdata);
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

  getCellCalculation(contact,ReturnQty){
   
    this.RQty=parseInt(ReturnQty);
   
    if( (parseInt(this.RQty)) > (parseInt(contact.Qty))){
      Swal.fire("Return Qty cannot be greater than Qty")

    }
    else{
      
      let index = this.Itemselectedlist.indexOf(contact);
      if (index >= 0) {
        this.Itemselectedlist.splice(index, 1);
        this.selectedssaleDetailList.data = [];
        this.selectedssaleDetailList.data = this.Itemselectedlist;
      }
  

      this.GrossAmt = (parseFloat(contact.UnitMRP) * parseInt(this.RQty)).toFixed(2);
      this.DiscAmt = ((parseFloat(this.GrossAmt) * parseFloat(contact.DiscPer)) /100).toFixed(2);
      this.VatAmount = ((parseFloat(contact.UnitMRP)  * (parseFloat(contact.VatPer)) / 100) * parseInt(this.RQty)).toFixed(2);
      this.CGSTAmount = (((parseFloat(contact.UnitMRP) * (parseFloat(contact.CGSTPer)) /100)) * parseInt(this.RQty)).toFixed(2);//(Val(txtPerMRP.Text) * Val(txtCGSTPer.Text) / 100) * Val(txtIssueQty.Text)

      debugger
      this.SGSTAmount =(((parseFloat(contact.UnitMRP)) * (parseFloat(contact.SGSTPer)) /100) * parseInt(this.RQty)).toFixed(2);// (Val(txtPerMRP.Text) * Val(txtSGSTPer.Text) / 100) * Val(txtIssueQty.Text)
      this.IGSTAmount =((((parseFloat(contact.UnitMRP)) * (parseFloat(contact.IGSTPer)) /100)) * parseInt(this.RQty)).toFixed(2);// (Val(txtPerMRP.Text) * Val(txtIGSTPer.Text) / 100) * Val(txtIssueQty.Text)
      this.TotalAmt =  (parseFloat(contact.UnitMRP) * parseInt(this.RQty)).toFixed(2);
      if(parseFloat(contact.LandedPrice) > 0.0){
      this.LandAmt = (parseFloat(contact.LandedPrice) * parseInt(this.RQty)).toFixed(2);
      }
      this.PurAmt =  (parseFloat(contact.PurRateWf) * parseInt(this.RQty)).toFixed(2);
      // this.Qty= parseInt(contact.Qty) - parseInt(this.RQty);


      this.Itemselectedlist.push(
        {
  
          SalesNo:contact.SalesNo,
          SalesDetId:contact.SalesDetId,
          OP_IP_ID:contact.OP_IP_ID,
          ItemName:contact.ItemName,
          BatchNo:contact.BatchNo,
          UnitMRP:contact.UnitMRP,
          Qty:contact.Qty,
          ReturnQty:this.RQty,
          TotalAmount:this.TotalAmt,
          VatPer:contact.VatPer,
          VatAmount:this.VatAmount,
          DiscPer:contact.DiscPer,
          DiscAmount:this.DiscAmt,
          GrossAmount:this.GrossAmt,
          LandedPrice:contact.LandedPrice,
          TotalLandedAmount:this.LandAmt,
          PurRateWf:contact.PurRateWf,
          PurTotAmt:this.PurAmt,
          CGSTPer:contact.CGSTPer,
          CGSTAmount:this.CGSTAmount,
          SGSTPer:contact.SGSTPer,
          SGSTAmount:this.SGSTAmount,
          IGSTPer:contact.IGSTPer,
          IGSTAmount:this.IGSTAmount,
          IsPurRate:contact.IsPurRate,
          StkID:contact.StkID
  
        });
      this.selectedssaleDetailList.data = this.Itemselectedlist;

    }
    this.ReturnQty.nativeElement.focus();
  }
  @ViewChild('ReturnQty') ReturnQty: ElementRef;
  SelectedItem(contact) {

    let Amount = contact.UnitMRP * contact.ReturnQty;
   
    this.Itemselectedlist.push(
      {
        SalesNo:contact.SalesNo,
        SalesDetId:contact.SalesDetId,
        OP_IP_ID:contact.OP_IP_ID,
        ItemName:contact.ItemName,
        BatchNo:contact.BatchNo,
        UnitMRP:contact.UnitMRP,
        Qty:contact.Qty,
        ReturnQty:contact.Qty,
        TotalAmount:contact.TotalAmount,
        VatPer:contact.VatPer,
        VatAmount:contact.VatAmount,
        DiscPer:contact.DiscPer,
        DiscAmount:contact.DiscAmount,
        GrossAmount:contact.GrossAmount,
        LandedPrice:contact.LandedPrice,
        TotalLandedAmount:contact.LandAmt,
        PurRateWf:contact.PurRateWf,
        PurTotAmt:contact.PurAmt,
        CGSTPer:contact.CGSTPer,
        SGSTPer:contact.SGSTPer,
        IGSTPer:contact.IGSTPer,
        IsPurRate:contact.IsPurRate,
        StkID:contact.StkID
      
      });
    this.selectedssaleDetailList.data = this.Itemselectedlist;

    this.OP_IP_Id=contact.OP_IP_ID;
    this.SalesDetId=contact.SalesDetId;
    this.NetAmt=contact.GrossAmount;
  }

  onclickrow(contact) {
    Swal.fire("Row selected :" + contact)
  }

  onSave(){
    
    let salesReturnHeader = {};
    salesReturnHeader['Date'] = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'; //'2023-11-03T08:07:41.318Z';//this.dateTimeObj.date;
    salesReturnHeader['time'] = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd 00:00:00.000") || '01/01/1900';//'2023-11-03T08:07:41.318Z';//this.dateTimeObj.time;
    salesReturnHeader['salesId'] =  this.SalesID;
    salesReturnHeader['oP_IP_ID'] =this.OP_IP_Id;
    salesReturnHeader['oP_IP_Type'] =2,// this.OP_IPType;
    salesReturnHeader['totalAmount'] = this.FinalTotalAmount;
    salesReturnHeader['vatAmount'] = this.VatAmount;
    salesReturnHeader['discAmount'] = this.DiscAmt;
    salesReturnHeader['netAmount'] =  this.FinalTotalAmount;
    salesReturnHeader['paidAmount'] = this.FinalTotalAmount;
    salesReturnHeader['balanceAmount'] = 0;
    salesReturnHeader['isSellted'] = 0;
    salesReturnHeader['isPrint'] = 0;
    salesReturnHeader['isFree'] = 0;
    salesReturnHeader['unitID'] = 1;
    salesReturnHeader['addedBy'] = this._loggedService.currentUserValue.user.id,
    salesReturnHeader['storeID'] = this._loggedService.currentUserValue.user.storeId,
    salesReturnHeader['Narration'] = '';
    salesReturnHeader['salesReturnId'] = 0;
  

    let salesReturnDetailarr = [];
    this.selectedssaleDetailList.data.forEach((element) => {
      let salesReturnDetail = {};
      salesReturnDetail['salesID'] =  element.SalesId;
      salesReturnDetail['itemId'] = element.ItemId;
      salesReturnDetail['batchNo'] = element.BatchNo;
      salesReturnDetail['batchExpDate'] = this.datePipe.transform(element.BatchExpDate, "yyyy-MM-dd 00:00:00.000") || '01/01/1900';//element.BatchExpDate;
      salesReturnDetail['unitMRP'] = element.UnitMRP;
      salesReturnDetail['qty'] = element.Qty;
      salesReturnDetail['totalAmount'] = element.TotalAmount;
      salesReturnDetail['vatPer'] = element.VatPer;
      salesReturnDetail['vatAmount'] = element.VatAmount;
      salesReturnDetail['discPer'] = element.DiscPer;
      salesReturnDetail['discAmount'] = element.DiscAmount;
      salesReturnDetail['grossAmount'] = element.GrossAmount;
      salesReturnDetail['landedPrice'] =element.LandedPrice;
      salesReturnDetail['totalLandedAmount'] = element.TotalLandedAmount;
      salesReturnDetail['purRateWf'] = element.PurRateWf;
      salesReturnDetail['purTotAmt'] = element.PurTotAmt;
      salesReturnDetail['cgstPer'] = element.CGSTPer;
      salesReturnDetail['cgstAmt'] = this.CGSTAmount;
      salesReturnDetail['sgstPer'] = element.SGSTPer;
      salesReturnDetail['sgstAmt'] = this.SGSTAmount;
      salesReturnDetail['igstPer'] = element.IGSTPer
      salesReturnDetail['igstAmt'] = this.IGSTAmount
      salesReturnDetail['isPurRate'] = 0;
      salesReturnDetail['stkID'] = element.StkID;
      salesReturnDetailarr.push(salesReturnDetail);
    });

    let salesReturn_CurStk_Uptarray = [];
    this.selectedssaleDetailList.data.forEach((element) => {
      let salesReturn_CurStk_Upt = {};
      salesReturn_CurStk_Upt['itemId'] = element.ItemId;
      salesReturn_CurStk_Upt['issueQty'] = element.Qty;
      salesReturn_CurStk_Upt['storeID'] = this._loggedService.currentUserValue.user.storeId,
      salesReturn_CurStk_Upt['stkID'] = element.StkID;

      salesReturn_CurStk_Uptarray.push(salesReturn_CurStk_Upt);
    });

    let update_SalesReturnQty_SalesTblarray = [];
    this.selectedssaleDetailList.data.forEach((element) => {
      let update_SalesReturnQty_SalesTbl = {};
      update_SalesReturnQty_SalesTbl['salesDetId'] = element.SalesDetId;
      update_SalesReturnQty_SalesTbl['returnQty'] = element.Qty;
     
      update_SalesReturnQty_SalesTblarray.push(update_SalesReturnQty_SalesTbl);
    });

    let update_SalesRefundAmt_SalesHeader = {};
    update_SalesRefundAmt_SalesHeader['salesReturnId'] = 0;

    let cal_GSTAmount_SalesReturn = {};
    cal_GSTAmount_SalesReturn['salesReturnID'] = 0;

    let insert_ItemMovementReport_Cursor = {};
    insert_ItemMovementReport_Cursor['id'] =   this.SalesID
    insert_ItemMovementReport_Cursor['typeId'] = 2;

    console.log("Procced with Payment Option");

    let submitData = {
      "salesReturnHeader": salesReturnHeader,
      "salesReturnDetail": salesReturnDetailarr,
      "salesReturn_CurStk_Upt": salesReturn_CurStk_Uptarray,
      "update_SalesReturnQty_SalesTbl": update_SalesReturnQty_SalesTblarray,
      "update_SalesRefundAmt_SalesHeader": update_SalesRefundAmt_SalesHeader,
      "cal_GSTAmount_SalesReturn": cal_GSTAmount_SalesReturn,
      "insert_ItemMovementReport_Cursor": insert_ItemMovementReport_Cursor
    };
    console.log(submitData);
    this._SalesReturnService.InsertSalesReturn(submitData).subscribe(response => {
      if (response) {
        Swal.fire(' Sales Return !', 'Record Saved Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            // let m = response;
            // this.getPrint(response);
            // this.Itemchargeslist = [];
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Sale data not saved', 'error');
      }
      this.sIsLoading = '';
    });
  }

  
  getTotAmtSum(element) {
   
    this.FinalTotalAmount =(element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);

    return this.FinalTotalAmount;
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClose(){
    this.Itemselectedlist = [];
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
  CGSTAmount:any;
  SGSTPer:any;
  SGSTAmount:any;
  IGSTPer:any;
  IGSTAmount:any;
  Narration:any;
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
      this.CGSTAmount= SalesDetailList.CGSTAmount || 0;
      this.SGSTPer= SalesDetailList.SGSTPer || 0;
      this.SGSTAmount= SalesDetailList.SGSTAmount || 0;
      this.IGSTPer= SalesDetailList.IGSTPer || 0;
      this.IGSTAmount= SalesDetailList.IGSTAmount || 0;
      this.Narration=SalesDetailList.Narration || '';
      this.IsPurRate= SalesDetailList.IsPurRate || 0;
      this.StkID= SalesDetailList.StkID || 0;
    }
  }
}


    // If lngQty < lngReturnQty Then
    //             MessageBox.Show("Return Qty cannot be greater than Qty.")
    //             'dgvReturnItemList.Item(6, j).Value = 0
    //             dgvReturnItemList.Item(10, j).Value = 0

    //             dgvReturnItemList.Item(11, j).Value = dgvReturnItemList.Item(8, j).Value * dgvReturnItemList.Item(10, j).Value
    //             dgvReturnItemList.Item(16, j).Value = dgvReturnItemList.Item(8, j).Value * dgvReturnItemList.Item(10, j).Value

    //             ' Gross Amt = MRP * Return Qty
    //             dgvReturnItemList.Item(16, j).Value = dgvReturnItemList.Item(8, j).Value * dgvReturnItemList.Item(10, j).Value
    //             'Disc Amt = Gross Amt * Dis Per /100
    //             dgvReturnItemList.Item(15, j).Value = Format(((dgvReturnItemList.Item(8, j).Value * dgvReturnItemList.Item(10, j).Value) * dgvReturnItemList.Item(14, j).Value / 100), "0.00")
    //             'Vat Amount = (Val(txtPerMRP.Text) * Val(txtVatPer.Text) / 100) * Val(txtIssueQty.Text)
    //             dgvReturnItemList.Item(13, j).Value = Format((Val(dgvReturnItemList.Item(8, j).Value * dgvReturnItemList.Item(12, j).Value) / 100) * dgvReturnItemList.Item(10, j).Value, "0.00")

    //             'CGST Amount = (Val(txtPerMRP.Text) * Val(txtCGSTPer.Text) / 100) * Val(txtIssueQty.Text)
    //             dgvReturnItemList.Item(24, j).Value = Format((Val(dgvReturnItemList.Item(8, j).Value * dgvReturnItemList.Item(23, j).Value) / 100) * dgvReturnItemList.Item(10, j).Value, "0.00")

    //             'SGST Amount = (Val(txtPerMRP.Text) * Val(txtSGSTPer.Text) / 100) * Val(txtIssueQty.Text)
    //             dgvReturnItemList.Item(26, j).Value = Format((Val(dgvReturnItemList.Item(8, j).Value * dgvReturnItemList.Item(25, j).Value) / 100) * dgvReturnItemList.Item(10, j).Value, "0.00")

    //             'IGST Amount = (Val(txtPerMRP.Text) * Val(txtIGSTPer.Text) / 100) * Val(txtIssueQty.Text)
    //             dgvReturnItemList.Item(28, j).Value = Format((Val(dgvReturnItemList.Item(8, j).Value * dgvReturnItemList.Item(27, j).Value) / 100) * dgvReturnItemList.Item(10, j).Value, "0.00")

    //             ' Total Amt = MRP * Return Qty
    //             dgvReturnItemList.Item(11, j).Value = (dgvReturnItemList.Item(8, j).Value * dgvReturnItemList.Item(10, j).Value) - dgvReturnItemList.Item(15, j).Value
    //             ' Land Amt = Landed Price * Return Qty
    //             dgvReturnItemList.Item(18, j).Value = dgvReturnItemList.Item(17, j).Value * dgvReturnItemList.Item(10, j).Value
    //             ' Pur Amt = Pur Price * Return Qty
    //             dgvReturnItemList.Item(21, j).Value = dgvReturnItemList.Item(20, j).Value * dgvReturnItemList.Item(10, j).Value
    //             Exit For
    //         End If