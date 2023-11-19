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
import { Subscription } from 'rxjs';
import { IndentList, Printsal } from '../sales/sales.component';
import * as converter from 'number-to-words';
import { OpPaymentNewComponent } from 'app/main/opd/op-search-list/op-payment-new/op-payment-new.component';


@Component({
  selector: 'app-sales-return',
  templateUrl: './sales-return.component.html',
  styleUrls: ['./sales-return.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class SalesReturnComponent implements OnInit {
  isLoadingStr: string = '';
  isLoading: String = '';

  @ViewChild('billTemplate2') billTemplate2:ElementRef;
  vStoreName: any;

  GrossAmt: any;
  DiscAmt: any;
  VatAmount: any;
  CGSTAmount: any;
  IGSTAmount: any;
  SGSTAmount: any=0.0;
  TotalAmt: any;
  LandAmt: any;
  PurAmt: any;
  dateTimeObj: any;

  StoreList: any = [];
  Itemselectedlist: any = [];
  TempItemselectedlist: any = [];
  ReturnAmt: any = 0;
  NetAmt: any = 0.0;
  Qty: any = 0;
  RQty: any = 0;
  FinalTotalAmount: any = 0;
  sIsLoading: any;
  screenFromString = 'payment-form';
  SalesID: any;
  SalesDetId: any;
  OP_IP_Id: any;
  IspureRate: boolean = true;

  reportPrintObj: Printsal;
  reportPrintObjTax: Printsal;
  subscriptionArr: Subscription[] = [];
  reportPrintObjList: Printsal[] = [];
  printTemplate: any;
  currentDate =new Date();
  OP_IP_Type:any;
  IsPrescriptionFlag:boolean;

  
  Itemchargeslist: any = [];
 
  FinalTotalAmt: any;
  FinalDiscAmt: any;
  PatientName: any;
  MobileNo: any;
  PaymentType: any;

  displayedColumns = [
    // 'SalesId',
    'Date',
    'SalesNo',
    'RegNo',
    'PatientName',
    'TotalAmount',
    'PaidType',
  ];

  dspSalesDetColumns = [
    // 'SalesId',
    // 'SalesNo',
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
    "buttons",
    // 'SalesId',
    // 'SalesNo',
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
    // 'VatAmount',
    'DiscPer',
    'DiscAmount',
    'GrossAmount',
    'LandedPrice',
    'TotalLandedAmount',
    // 'IsBatchRequired',
    // 'PurRateWf',
    // 'PurTotAmt',
    'CGSTPer',
    'CGSTAmount',
    'SGSTPer',
    'SGSTAmount',
    'IGSTPer',
    'IGSTAmount',
    // 'IsPurRate',
    // 'StkID'
  ]
  SearchForm: FormGroup;
  FinalReturnform: FormGroup;
  dssaleList = new MatTableDataSource<SaleBillList>();
  dssaleDetailList = new MatTableDataSource<SalesDetailList>();
  selectedssaleDetailList = new MatTableDataSource<SalesDetailList>();


  constructor(
    public _SalesReturnService: SalesReturnService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private _loggedService: AuthenticationService,

  ) {
    this.SearchForm = this.SearchFilter();
    this.FinalReturnform = this.Returnform();
  }

  ngOnInit(): void {
    this.getSalesList();
    this.getPharStoreList()
  }

  SearchFilter(): FormGroup {
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo: '',
      F_Name: '',
      L_Name: '',
      SalesNo: '',
      StoreId: '',
    })
  }

  Returnform() {
    return this._formBuilder.group({
      NetAmt: '',
      ReturnAmt: ''
    });
  }

  getPharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._SalesReturnService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this.SearchForm.get('StoreId').setValue(this.StoreList[0]);
      this.vStoreName =  this.SearchForm.get('StoreId').value.StoreName;
    });
  }

  getSalesList() {
    this.dssaleDetailList.data = [];
    this.selectedssaleDetailList.data = [];
    this.TempItemselectedlist.data = [];
    this.Itemselectedlist.data = [];
    this.Itemselectedlist = [];

    debugger
    var vdata = {
      F_Name: this.SearchForm.get('F_Name').value + '%' || '%',
      L_Name: this.SearchForm.get('L_Name').value + '%' || '%',
      From_Dt: this.datePipe.transform(this.SearchForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      To_Dt: this.datePipe.transform(this.SearchForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      Reg_No: this.SearchForm.get('RegNo').value || 0,
      SalesNo: this.SearchForm.get('SalesNo').value || 0,
      StoreId: this.SearchForm.get('StoreId').value.storeid || 0,
    }
    setTimeout(() => {
      this.isLoadingStr = 'loading';
      this._SalesReturnService.getSalesBillList(vdata).subscribe(
        (data) => {
          this.dssaleList.data = data as SaleBillList[];
          console.log(this.dssaleList.data);
          // this.dataSource.sort = this.sort;
          // this.dataSource.paginator = this.paginator;
          this.isLoadingStr = this.dssaleList.data.length == 0 ? 'no-data' : '';
        },
        (error) => {
          this.isLoading = 'list-loaded';
        }
      );
    }, 1000);
  }

  onSelect(Parama) {
    console.log(Parama);
    this.dssaleDetailList.data = [];
    this.selectedssaleDetailList.data = [];
    this.Itemselectedlist.data =[];
    this.Itemselectedlist =[];
   this.PatientName=Parama.PatientName;
debugger
    if (Parama.PaidType == "Paid") {
      this.getSalesDetCashList(Parama)
      this.PaymentType='Paid'
    }
    else {
      this.getSalesDetCreditList(Parama)
      this.PaymentType='Credit'
    }
  }

  getSalesDetCashList(Params) {
    this.SalesID = Params.SalesId;
    var vdata = {
      SalesId: Params.SalesId,
      SalesNo: Params.SalesNo,
      StoreId: this.SearchForm.get('StoreId').value.storeid || 0,
      CashCounterId: Params.CashCounterID
    }
    setTimeout(() => {
      this.isLoadingStr = 'loading';
      this._SalesReturnService.getSalesDetCashList(vdata).subscribe(
        (data) => {
          this.dssaleDetailList.data = data as SalesDetailList[];
          this.isLoadingStr = this.dssaleDetailList.data.length == 0 ? 'no-data' : '';
        },
        (error) => {
          this.isLoading = 'list-loaded';
        }
      );
    }, 1000);

    // this._SalesReturnService.getSalesDetCashList(vdata).subscribe(data => {
    //   this.dssaleDetailList.data = data as SalesDetailList[];
    
      
    // })
    
  }

  getSalesDetCreditList(Params) {
    this.SalesID = Params.SalesId;
    var vdata = {
      SalesId: Params.SalesId,
      SalesNo: Params.SalesNo,
      StoreId: this.SearchForm.get('StoreId').value.storeid || 0,
      CashCounterId: Params.CashCounterID
    }
    //  console.log(vdata);
    this._SalesReturnService.getSalesDetCreditList(vdata).subscribe(data => {
      this.dssaleDetailList.data = data as SalesDetailList[];
    
    })
  }

  getCellCalculation(contact, ReturnQty) {

    this.RQty = parseInt(ReturnQty);
    debugger;
    if ((parseInt(this.RQty)) > (parseInt(contact.Qty))) {
      Swal.fire("Return Qty cannot be greater than Qty")
      contact.ReturnQty = this.RQty
    }
    else {
      this.GrossAmt = (parseFloat(contact.UnitMRP) * parseInt(this.RQty)).toFixed(2);
      this.DiscAmt = ((parseFloat(this.GrossAmt) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
      this.VatAmount = ((parseFloat(contact.UnitMRP) * (parseFloat(contact.VatPer)) / 100) * parseInt(this.RQty)).toFixed(2);
      this.CGSTAmount = (((parseFloat(contact.UnitMRP) * (parseFloat(contact.CGSTPer))) / 100) * parseInt(this.RQty)).toFixed(2);
      this.SGSTAmount = (((parseFloat(contact.UnitMRP) * (parseFloat(contact.SGSTPer))) / 100) * parseInt(this.RQty)).toFixed(2);
      this.IGSTAmount = ((((parseFloat(contact.UnitMRP) * (parseFloat(contact.IGSTPer))) / 100)) * parseInt(this.RQty)).toFixed(2);
      this.TotalAmt = (parseFloat(contact.UnitMRP) * parseInt(this.RQty)).toFixed(2);
      if (parseFloat(contact.LandedPrice) > 0.0) {
        this.LandAmt = (parseFloat(contact.LandedPrice) * parseInt(this.RQty)).toFixed(2);
      }
      this.PurAmt = (parseFloat(contact.PurRateWf) * parseInt(this.RQty)).toFixed(2);


        contact.SalesNo = contact.SalesNo,
        contact.SalesDetId = contact.SalesDetId,
        contact.OP_IP_ID = contact.OP_IP_ID,
        contact.ItemName = contact.ItemName,
        contact.BatchNo = contact.BatchNo,
        contact.UnitMRP = contact.UnitMRP,
        contact.Qty = contact.Qty,
        contact.ReturnQty = this.RQty,
        contact.TotalAmount = this.TotalAmt,
        contact.VatPer = contact.VatPer,
        contact.VatAmount = this.VatAmount,
        contact.DiscPer = contact.DiscPer,
        contact.DiscAmount = this.DiscAmt,
        contact.GrossAmount = this.GrossAmt,
        contact.LandedPrice = contact.LandedPrice,
        contact.TotalLandedAmount = this.LandAmt,
        contact.PurRateWf = contact.PurRateWf,
        contact.PurTotAmt = this.PurAmt,
        contact.CGSTPer = contact.CGSTPer,
        contact.CGSTAmount = this.CGSTAmount,
        contact.SGSTPer = contact.SGSTPer,
        contact.SGSTAmount = this.SGSTAmount,
        contact.IGSTPer = contact.IGSTPer,
        contact.IGSTAmount = this.IGSTAmount,
        contact.IsPurRate = contact.IsPurRate,
        contact.StkID = contact.StkID
      // this.selectedssaleDetailList.data = this.Itemselectedlist;

    }
    
  }


  
  SelectedItem(contact) {
  
    this.OP_IP_Type=contact.OP_IP_Type;
    this.IsPrescriptionFlag=contact.IsPrescriptionFlag;
    this.TempItemselectedlist.data=this.selectedssaleDetailList.data;

    console.log(this.TempItemselectedlist)

    
    if(parseInt(contact.Qty) >=1){
    if (this.TempItemselectedlist.data.length >= 1) {
      debugger
      let id=1;
      this.TempItemselectedlist.data.forEach((element) => {
        
        if (element.ItemName == contact.ItemName) {
          id=0;
          Swal.fire("Item Already Present");
        } 
      
      });

      if(id==1){
        this.AddItem(contact);
      }

    } else {
      this.AddItem(contact);
    }

  }
  else{
    Swal.fire("Qty is Zero!..Plz chk Item Qty")
  }
  }


  AddItem(contact) {
    debugger
    this.RQty=parseInt(contact.Qty);
    let Amount = contact.UnitMRP * contact.ReturnQty;
    this.NetAmt =parseFloat(contact.GrossAmount) + parseFloat(this.NetAmt);
    this.GrossAmt = (parseFloat(contact.UnitMRP) * parseInt(this.RQty)).toFixed(2);
    this.DiscAmt = ((parseFloat(this.GrossAmt) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
    this.VatAmount = ((parseFloat(contact.UnitMRP) * (parseFloat(contact.VatPer)) / 100) * parseInt(this.RQty)).toFixed(2);
    this.CGSTAmount = (((parseFloat(contact.UnitMRP) * (parseFloat(contact.CGSTPer))) / 100) * parseInt(this.RQty)).toFixed(2);
    this.SGSTAmount = (((parseFloat(contact.UnitMRP) * (parseFloat(contact.SGSTPer))) / 100) * parseInt(this.RQty)).toFixed(2);
    this.IGSTAmount = ((((parseFloat(contact.UnitMRP) * (parseFloat(contact.IGSTPer))) / 100)) * parseInt(this.RQty)).toFixed(2);
    this.TotalAmt = (parseFloat(contact.UnitMRP) * parseInt(this.RQty)).toFixed(2);
    if (parseFloat(contact.LandedPrice) > 0.0) {
      this.LandAmt = (parseFloat(contact.LandedPrice) * parseInt(this.RQty)).toFixed(2);
    }
    this.PurAmt = (parseFloat(contact.PurRateWf) * parseInt(this.RQty)).toFixed(2);

    this.Itemselectedlist.push(
      {
       
        SalesNo :contact.SalesNo,
        SalesId:contact.SalesId,
        SalesDetId : contact.SalesDetId,
        OP_IP_ID :contact.OP_IP_ID,
        ItemId:contact.ItemId,
        ItemName : contact.ItemName,
        BatchNo :contact.BatchNo,
        UnitMRP : contact.UnitMRP,
        Qty : contact.Qty,
        ReturnQty : contact.Qty,
        TotalAmount :this.TotalAmt,
        VatPer : contact.VatPer,
        VatAmount : this.VatAmount,
        DiscPer : contact.DiscPer,
        DiscAmount : this.DiscAmt,
        GrossAmount : this.GrossAmt,
        LandedPrice : contact.LandedPrice,
        TotalLandedAmount : this.LandAmt,
        PurRateWf : contact.PurRateWf,
        PurTotAmt : this.PurAmt,
        CGSTPer : contact.CGSTPer,
        CGSTAmount : this.CGSTAmount,
        SGSTPer : contact.SGSTPer,
        SGSTAmount : this.SGSTAmount,
        IGSTPer : contact.IGSTPer,
        IGSTAmount : this.IGSTAmount,
        IsPurRate : contact.IsPurRate,
        StkID : contact.StkID

      });
      
      this.selectedssaleDetailList.data = this.Itemselectedlist;
      

    this.OP_IP_Id = contact.OP_IP_ID;
    this.SalesDetId = contact.SalesDetId;
    
  }
  onclickrow(contact) {
    Swal.fire("Row selected :" + contact)
  }

  // onSave() {
    
  //   let salesReturnHeader = {};
  //   salesReturnHeader['Date'] = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'; //'2023-11-03T08:07:41.318Z';//this.dateTimeObj.date;
  //   salesReturnHeader['time'] = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd 00:00:00.000") || '01/01/1900';//'2023-11-03T08:07:41.318Z';//this.dateTimeObj.time;
  //   salesReturnHeader['salesId'] = this.SalesID;
  //   salesReturnHeader['oP_IP_ID'] = this.OP_IP_Id;
  //   salesReturnHeader['oP_IP_Type'] = 2,// this.OP_IPType;
  //   salesReturnHeader['totalAmount'] = this.FinalTotalAmount;
  //   salesReturnHeader['vatAmount'] = this.VatAmount;
  //   salesReturnHeader['discAmount'] = this.DiscAmt;
  //   salesReturnHeader['netAmount'] = this.FinalTotalAmount;
  //   salesReturnHeader['paidAmount'] = this.FinalTotalAmount;
  //   salesReturnHeader['balanceAmount'] = 0;
  //   salesReturnHeader['isSellted'] = 0;
  //   salesReturnHeader['isPrint'] = 0;
  //   salesReturnHeader['isFree'] = 0;
  //   salesReturnHeader['unitID'] = 1;
  //   salesReturnHeader['addedBy'] = this._loggedService.currentUserValue.user.id,
  //   salesReturnHeader['storeID'] = this._loggedService.currentUserValue.user.storeId,
  //   salesReturnHeader['Narration'] = '';
  //   salesReturnHeader['salesReturnId'] = 0;


  //   let salesReturnDetailarr = [];
  //   this.TempItemselectedlist.data.forEach((element) => {
  //     let salesReturnDetail = {};
  //     salesReturnDetail['salesID'] = element.SalesId;
  //     salesReturnDetail['itemId'] = element.ItemId;
  //     salesReturnDetail['batchNo'] = element.BatchNo;
  //     salesReturnDetail['batchExpDate'] = this.datePipe.transform(element.BatchExpDate, "yyyy-MM-dd 00:00:00.000") || '01/01/1900';//element.BatchExpDate;
  //     salesReturnDetail['unitMRP'] = element.UnitMRP;
  //     salesReturnDetail['qty'] = element.Qty;
  //     salesReturnDetail['totalAmount'] = element.TotalAmount;
  //     salesReturnDetail['vatPer'] = element.VatPer;
  //     salesReturnDetail['vatAmount'] = element.VatAmount;
  //     salesReturnDetail['discPer'] = element.DiscPer;
  //     salesReturnDetail['discAmount'] = element.DiscAmount;
  //     salesReturnDetail['grossAmount'] = element.GrossAmount;
  //     salesReturnDetail['landedPrice'] = element.LandedPrice;
  //     salesReturnDetail['totalLandedAmount'] = element.TotalLandedAmount;
  //     salesReturnDetail['purRateWf'] = element.PurRateWf;
  //     salesReturnDetail['purTotAmt'] = element.PurTotAmt;
  //     salesReturnDetail['cgstPer'] = element.CGSTPer;
  //     salesReturnDetail['cgstAmt'] = this.CGSTAmount;
  //     salesReturnDetail['sgstPer'] = element.SGSTPer;
  //     salesReturnDetail['sgstAmt'] = this.SGSTAmount;
  //     salesReturnDetail['igstPer'] = element.IGSTPer
  //     salesReturnDetail['igstAmt'] = this.IGSTAmount
  //     salesReturnDetail['isPurRate'] = 0;
  //     salesReturnDetail['stkID'] = element.StkID;
  //     salesReturnDetailarr.push(salesReturnDetail);
  //   });

  //   let salesReturn_CurStk_Uptarray = [];
  //   this.TempItemselectedlist.data.forEach((element) => {
  //     let salesReturn_CurStk_Upt = {};
  //     salesReturn_CurStk_Upt['itemId'] = element.ItemId;
  //     salesReturn_CurStk_Upt['issueQty'] = element.Qty;
  //     salesReturn_CurStk_Upt['storeID'] = this._loggedService.currentUserValue.user.storeId,
  //       salesReturn_CurStk_Upt['stkID'] = element.StkID;

  //     salesReturn_CurStk_Uptarray.push(salesReturn_CurStk_Upt);
  //   });

  //   let update_SalesReturnQty_SalesTblarray = [];
  //   this.TempItemselectedlist.data.forEach((element) => {
  //     let update_SalesReturnQty_SalesTbl = {};
  //     update_SalesReturnQty_SalesTbl['salesDetId'] = element.SalesDetId;
  //     update_SalesReturnQty_SalesTbl['returnQty'] = element.Qty;

  //     update_SalesReturnQty_SalesTblarray.push(update_SalesReturnQty_SalesTbl);
  //   });

  //   let update_SalesRefundAmt_SalesHeader = {};
  //   update_SalesRefundAmt_SalesHeader['salesReturnId'] = 0;

  //   let cal_GSTAmount_SalesReturn = {};
  //   cal_GSTAmount_SalesReturn['salesReturnID'] = 0;

  //   let insert_ItemMovementReport_Cursor = {};
  //   insert_ItemMovementReport_Cursor['id'] = this.SalesID
  //   insert_ItemMovementReport_Cursor['typeId'] = 2;

  //   console.log("Procced with Payment Option");

  //   let submitData = {
  //     "salesReturnHeader": salesReturnHeader,
  //     "salesReturnDetail": salesReturnDetailarr,
  //     "salesReturn_CurStk_Upt": salesReturn_CurStk_Uptarray,
  //     "update_SalesReturnQty_SalesTbl": update_SalesReturnQty_SalesTblarray,
  //     "update_SalesRefundAmt_SalesHeader": update_SalesRefundAmt_SalesHeader,
  //     "cal_GSTAmount_SalesReturn": cal_GSTAmount_SalesReturn,
  //     "insert_ItemMovementReport_Cursor": insert_ItemMovementReport_Cursor
  //   };
  //   console.log(submitData);
  //   this._SalesReturnService.InsertSalesReturn(submitData).subscribe(response => {
  //     if (response) {
  //       Swal.fire(' Sales Return !', 'Record Saved Successfully !', 'success').then((result) => {
  //         if (result.isConfirmed) {
  //           // let m = response;
  //           this.getSalesRetPrint(response);
  //           // this.Itemchargeslist = [];
  //           this._matDialog.closeAll();
  //         }
  //       });
  //     } else {
  //       Swal.fire('Error !', 'Sale data not saved', 'error');
  //     }
  //     this.sIsLoading = '';
  //   });
  // }

  
  onSave() {
  
    if (this.PaymentType=='Paid') {
      this.onCashOnlinePaySave()
    }
    else if (this.PaymentType=='Credit') {
      this.onCreditpaySave()
    }
  
  }

  onCreditpaySave() {
  
  
    let salesReturnHeader = {};
    salesReturnHeader['Date'] = "2023-11-18T09:52:18.446Z";// this.dateTimeObj.date;
    salesReturnHeader['Time'] = "2023-11-18T09:52:18.446Z";// this.dateTimeObj.time;
    salesReturnHeader['SalesId'] = this.SalesID;
    salesReturnHeader['OP_IP_ID'] = this.OP_IP_Id;
    salesReturnHeader['OP_IP_Type'] = 2;
    salesReturnHeader['TotalAmount'] = this.TotalAmt;
    salesReturnHeader['VatAmount'] = this.VatAmount || 0;
    salesReturnHeader['DiscAmount'] =this.DiscAmt || 0;
    salesReturnHeader['NetAmount'] =this.NetAmt || 0;
    salesReturnHeader['PaidAmount'] = this.NetAmt || 0;
    salesReturnHeader['BalanceAmount'] = 0;
    salesReturnHeader['isSellted'] = true;
    salesReturnHeader['isPrint'] = true,
      salesReturnHeader['isFree'] = true;
    salesReturnHeader['unitID'] = 1;
    salesReturnHeader['addedBy'] = this._loggedService.currentUserValue.user.id,
      salesReturnHeader['storeID '] =this._loggedService.currentUserValue.user.storeId,
    salesReturnHeader['narration'] = "Na";
    salesReturnHeader['salesReturnId'] = 0

    let salesReturnDetailInsertCreditarr = [];
    this.selectedssaleDetailList.data.forEach((element) => {
      let salesReturnDetailCredit = {};
      salesReturnDetailCredit['SalesReturnId'] = 0;
      salesReturnDetailCredit['itemId'] = element.ItemId;
      salesReturnDetailCredit['batchNo'] = element.BatchNo;
      salesReturnDetailCredit['batchExpDate'] = "2023-11-18T09:52:18.446Z";//element.BatchExpDate;
      salesReturnDetailCredit['unitMRP'] = element.UnitMRP;
      salesReturnDetailCredit['qty'] = element.Qty;
      salesReturnDetailCredit['totalAmount'] = element.TotalAmount;
      salesReturnDetailCredit['vatPer'] = element.VatPer;
      salesReturnDetailCredit['vatAmount'] = element.VatAmount;
      salesReturnDetailCredit['discPer'] = element.DiscPer;
      salesReturnDetailCredit['discAmount'] = element.DiscAmount;
      salesReturnDetailCredit['grossAmount'] = element.GrossAmount;
      salesReturnDetailCredit['landedPrice'] = element.LandedPrice;
      salesReturnDetailCredit['totalLandedAmount'] = element.TotalLandedAmount;
      salesReturnDetailCredit['PurRate'] = element.PurRateWf;
      salesReturnDetailCredit['PurTot'] = element.PurTotAmt;
      salesReturnDetailCredit['SalesID'] = this.SalesID;
      salesReturnDetailCredit['SalesDetID'] = this.SalesDetId;
      salesReturnDetailCredit['isCashOrCredit'] =0;
      salesReturnDetailCredit['cgstPer'] = element.CGSTPer;
      salesReturnDetailCredit['cgstAmt'] = element.CGSTAmount;
      salesReturnDetailCredit['sgstPer'] = element.SGSTPer;
      salesReturnDetailCredit['sgstAmt'] = element.SGSTAmount;
      salesReturnDetailCredit['igstPer'] = element.IGSTPer
      salesReturnDetailCredit['igstAmt'] = element.IGSTAmount
      salesReturnDetailCredit['stkID'] = element.StkID;
      salesReturnDetailInsertCreditarr.push(salesReturnDetailCredit);
    });
 
    let updateCurStkSalesCreditarray = [];
    this.selectedssaleDetailList.data.forEach((element) => {
      let updateCurStkSalesCredit = {};
      updateCurStkSalesCredit['itemId'] = element.ItemId;
      updateCurStkSalesCredit['issueQty'] = element.Qty;
      updateCurStkSalesCredit['storeID'] = this._loggedService.currentUserValue.user.storeId,
        updateCurStkSalesCredit['stkID'] = element.StkID;

      updateCurStkSalesCreditarray.push(updateCurStkSalesCredit);
    });

    let Update_SalesReturnQtySalesTblarray = [];
    this.selectedssaleDetailList.data.forEach((element) => {
    let Update_SalesReturnQtySalesTbl = {};
    Update_SalesReturnQtySalesTbl['SalesDetId'] = this.SalesDetId;
    Update_SalesReturnQtySalesTbl['ReturnQty'] = this.RQty;
    Update_SalesReturnQtySalesTblarray.push(Update_SalesReturnQtySalesTbl);
  });

    let Update_SalesRefundAmt_SalesHeader = {};
    Update_SalesRefundAmt_SalesHeader['SalesReturnId'] = 0;

    let Cal_GSTAmount_SalesReturn = {};
    Cal_GSTAmount_SalesReturn['SalesReturnID'] = 0;

    let Insert_ItemMovementReport_Cursor = {};
    Insert_ItemMovementReport_Cursor['Id'] = this.SalesID;
    Insert_ItemMovementReport_Cursor['TypeId'] = 2;
    // console.log("Procced with Payment Option");

    let submitData = {
      "salesReturnHeader": salesReturnHeader,
      "salesReturnDetail": salesReturnDetailInsertCreditarr,
      "salesReturn_CurStk_Upt": updateCurStkSalesCreditarray,
      "update_SalesReturnQty_SalesTbl": Update_SalesReturnQtySalesTblarray,
      "update_SalesRefundAmt_SalesHeader": Update_SalesRefundAmt_SalesHeader,
      "cal_GSTAmount_SalesReturn": Cal_GSTAmount_SalesReturn,
      "insert_ItemMovementReport_Cursor": Insert_ItemMovementReport_Cursor,
    };
    console.log(submitData);
    // debugger
    this._SalesReturnService.InsertCreditSalesReturn(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Credit SalesReturn!', 'Data saved Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            // this.getPrint3(response);
            this.Itemchargeslist = [];
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Sale Return Credit data not saved', 'error');
      }
      this.sIsLoading = '';
    });
    this.dssaleList.data=[];
    this.dssaleDetailList.data = [];
    this.selectedssaleDetailList.data = [];

  }

  onCashOnlinePaySave() {

    let salesReturnHeader = {};
    salesReturnHeader['Date'] = "2023-11-18T09:52:18.446Z";// this.dateTimeObj.date;
    salesReturnHeader['Time'] = "2023-11-18T09:52:18.446Z";// this.dateTimeObj.time;
    salesReturnHeader['SalesId'] = this.SalesID;
    salesReturnHeader['OP_IP_ID'] = this.OP_IP_Id;
    salesReturnHeader['OP_IP_Type'] = 2;
    salesReturnHeader['TotalAmount'] = this.TotalAmt;
    salesReturnHeader['VatAmount'] = this.VatAmount || 0;
    salesReturnHeader['DiscAmount'] =this.DiscAmt || 0;
    salesReturnHeader['NetAmount'] =this.NetAmt || 0;
    salesReturnHeader['PaidAmount'] = this.NetAmt || 0;
    salesReturnHeader['BalanceAmount'] = 0;
    salesReturnHeader['IsSellted'] = 1;
    salesReturnHeader['IsPrint'] = 0,
      salesReturnHeader['IsFree'] = 0;
    salesReturnHeader['UnitID'] = 1;
    salesReturnHeader['addedBy'] = this._loggedService.currentUserValue.user.id,
      salesReturnHeader['StoreID'] =this._loggedService.currentUserValue.user.storeId,
    salesReturnHeader['Narration'] = "";
    salesReturnHeader['SalesReturnId'] = 0

    let salesReturnDetailInsertCreditarr = [];
    this.selectedssaleDetailList.data.forEach((element) => {
      let salesReturnDetailCredit = {};
      salesReturnDetailCredit['SalesReturnId'] = 0;
      salesReturnDetailCredit['itemId'] = element.ItemId;
      salesReturnDetailCredit['batchNo'] = element.BatchNo;
      salesReturnDetailCredit['batchExpDate'] = "2023-11-18T09:52:18.446Z";//element.BatchExpDate;
      salesReturnDetailCredit['unitMRP'] = element.UnitMRP;
      salesReturnDetailCredit['qty'] = element.Qty;
      salesReturnDetailCredit['totalAmount'] = element.TotalAmount;
      salesReturnDetailCredit['vatPer'] = element.VatPer;
      salesReturnDetailCredit['vatAmount'] = element.VatAmount;
      salesReturnDetailCredit['discPer'] = element.DiscPer;
      salesReturnDetailCredit['discAmount'] = element.DiscAmount;
      salesReturnDetailCredit['grossAmount'] = element.GrossAmount;
      salesReturnDetailCredit['landedPrice'] = element.LandedPrice;
      salesReturnDetailCredit['totalLandedAmount'] = element.TotalLandedAmount;
      salesReturnDetailCredit['PurRate'] = element.PurRateWf;
      salesReturnDetailCredit['PurTot'] = element.PurTotAmt;
      salesReturnDetailCredit['SalesID'] = this.SalesID;
      salesReturnDetailCredit['SalesDetID'] = this.SalesDetId;
      salesReturnDetailCredit['isCashOrCredit'] =0;
      salesReturnDetailCredit['cgstPer'] = element.CGSTPer;
      salesReturnDetailCredit['cgstAmt'] = element.CGSTAmount;
      salesReturnDetailCredit['sgstPer'] = element.SGSTPer;
      salesReturnDetailCredit['sgstAmt'] = element.SGSTAmount;
      salesReturnDetailCredit['igstPer'] = element.IGSTPer
      salesReturnDetailCredit['igstAmt'] = element.IGSTAmount
      salesReturnDetailCredit['stkID'] = element.StkID;
      salesReturnDetailInsertCreditarr.push(salesReturnDetailCredit);
    });
 
    let updateCurStkSalesCreditarray = [];
    this.selectedssaleDetailList.data.forEach((element) => {
      let updateCurStkSalesCredit = {};
      updateCurStkSalesCredit['itemId'] = element.ItemId;
      updateCurStkSalesCredit['issueQty'] = element.Qty;
      updateCurStkSalesCredit['storeID'] = this._loggedService.currentUserValue.user.storeId,
        updateCurStkSalesCredit['stkID'] = element.StkID;

      updateCurStkSalesCreditarray.push(updateCurStkSalesCredit);
    });

    let Update_SalesReturnQtySalesTblarray = [];
    this.selectedssaleDetailList.data.forEach((element) => {
    let Update_SalesReturnQtySalesTbl = {};
    Update_SalesReturnQtySalesTbl['SalesDetId'] = this.SalesDetId;
    Update_SalesReturnQtySalesTbl['ReturnQty'] = this.RQty;
    Update_SalesReturnQtySalesTblarray.push(Update_SalesReturnQtySalesTbl);
  });

    let Update_SalesRefundAmt_SalesHeader = {};
    Update_SalesRefundAmt_SalesHeader['SalesReturnId'] = 0;

    let Cal_GSTAmount_SalesReturn = {};
    Cal_GSTAmount_SalesReturn['SalesReturnID'] = 0;

    let Insert_ItemMovementReport_Cursor = {};
    Insert_ItemMovementReport_Cursor['Id'] = this.SalesID;
    Insert_ItemMovementReport_Cursor['TypeId'] = 2;

    let PaymentInsertobj = {};
    // if (this._SalesReturnService.IndentSearchGroup.get('CashPay').value == 'Other') {
      let PatientHeaderObj = {};

      PatientHeaderObj['Date'] ="2023-11-18T09:52:18.446Z";// this.dateTimeObj.date;
      PatientHeaderObj['PatientName'] = this.PatientName;
      PatientHeaderObj['OPD_IPD_Id'] = 0,// this.reportPrintObj.RegNo;
      PatientHeaderObj['NetPayAmount'] = this.NetAmt;
  
      // if (!this.BillingForm.get('cashpay').value) {
        // const dialogRef = this._matDialog.open(OpPaymentNewComponent,
        //   {
        //     maxWidth: "100vw",
        //     height: '600px',
        //     width: '100%',
        //     data: {
        //       vPatientHeaderObj: PatientHeaderObj,
        //       FromName: "OP-Bill"
        //     }
        //   });
  
        // dialogRef.afterClosed().subscribe(result => {
  
          // this.paidamt = result.submitDataPay.ipPaymentInsert.PaidAmt;
          // this.balanceamt = result.submitDataPay.ipPaymentInsert.BalanceAmt;
                
    
      // }

      // } else if (this._SalesReturnService.IndentSearchGroup.get('CashPay').value == 'CashPay') {

      PaymentInsertobj['BillNo'] = this.SalesID,
     // PaymentInsertobj['ReceiptNo'] = '',
      PaymentInsertobj['PaymentDate'] = "2023-11-18T09:52:18.446Z";// this.dateTimeObj.date;
      PaymentInsertobj['PaymentTime'] = "2023-11-18T09:52:18.446Z";//this.dateTimeObj.time;
      PaymentInsertobj['CashPayAmount'] = this.NetAmt;
      PaymentInsertobj['ChequePayAmount'] = 0,
        PaymentInsertobj['ChequeNo'] = 0,
        PaymentInsertobj['BankName'] = '',
        PaymentInsertobj['ChequeDate'] = "2023-11-18T09:52:18.446Z";
        PaymentInsertobj['CardPayAmount'] = 0,
        PaymentInsertobj['CardNo'] = '',
        PaymentInsertobj['CardBankName'] = '',
        PaymentInsertobj['CardDate'] = "2023-11-18T09:52:18.446Z";
        PaymentInsertobj['AdvanceUsedAmount'] = 0;
      PaymentInsertobj['AdvanceId'] = 0;
      PaymentInsertobj['RefundId'] = 0;
      PaymentInsertobj['TransactionType'] = 4;
      PaymentInsertobj['Remark'] = '',
        PaymentInsertobj['AddBy'] = this._loggedService.currentUserValue.user.id,
        PaymentInsertobj['IsCancelled'] = true;
      PaymentInsertobj['IsCancelledBy'] = 0;
      PaymentInsertobj['IsCancelledDate'] = "2023-11-18T09:52:18.446Z";
        PaymentInsertobj['OPD_IPD_Type'] = 3;
      PaymentInsertobj['NEFTPayAmount'] = 0,
        PaymentInsertobj['NEFTNo'] = '',
        PaymentInsertobj['NEFTBankMaster'] = '',
        PaymentInsertobj['NEFTDate'] ="2023-11-18T09:52:18.446Z";
        PaymentInsertobj['PayTMAmount'] = 0,
        PaymentInsertobj['PayTMTranNo'] = '',
        PaymentInsertobj['PayTMDate'] = "2023-11-18T09:52:18.446Z";
    // } else if (this._SalesReturnService.IndentSearchGroup.get('CashPay').value == 'Online') {
      // let Paymentobj = {};
      // PaymentInsertobj['BillNo'] = 0,
      //   PaymentInsertobj['ReceiptNo'] = '',
      //   PaymentInsertobj['PaymentDate'] = this.dateTimeObj.date;
      // PaymentInsertobj['PaymentTime'] = this.dateTimeObj.time;
      // PaymentInsertobj['CashPayAmount'] = 0;
      // PaymentInsertobj['ChequePayAmount'] = 0,
      //   PaymentInsertobj['ChequeNo'] = 0,
      //   PaymentInsertobj['BankName'] = '',
      //   PaymentInsertobj['ChequeDate'] = '01/01/1900',
      //   PaymentInsertobj['CardPayAmount'] = 0,
      //   PaymentInsertobj['CardNo'] = '',
      //   PaymentInsertobj['CardBankName'] = '',
      //   PaymentInsertobj['CardDate'] = '01/01/1900',
      //   PaymentInsertobj['AdvanceUsedAmount'] = 0;
      // PaymentInsertobj['AdvanceId'] = 0;
      // PaymentInsertobj['RefundId'] = 0;
      // PaymentInsertobj['TransactionType'] = 4;
      // PaymentInsertobj['Remark'] = '',
      //   PaymentInsertobj['AddBy'] = this._loggedService.currentUserValue.user.id,
      //   PaymentInsertobj['IsCancelled'] = 0;
      // PaymentInsertobj['IsCancelledBy'] = 0;
      // PaymentInsertobj['IsCancelledDate'] = '01/01/1900',
      //   PaymentInsertobj['OPD_IPD_Type'] = 3;
      // PaymentInsertobj['NEFTPayAmount'] = 0;
      // PaymentInsertobj['NEFTNo'] = '',
      //   PaymentInsertobj['NEFTBankMaster'] = '',
      //   PaymentInsertobj['NEFTDate'] = "01/01/1900",
      //   PaymentInsertobj['PayTMAmount'] = this.NetAmt,
      //   PaymentInsertobj['PayTMTranNo'] =0,// this._SalesReturnService.IndentSearchGroup.get('referanceNo').value || 0,
      //   PaymentInsertobj['PayTMDate'] = this.dateTimeObj.date;

    // }

    let submitData = {
      "salesReturnHeader": salesReturnHeader,
      "salesReturnDetail": salesReturnDetailInsertCreditarr,
      "salesReturn_CurStk_Upt": updateCurStkSalesCreditarray,
      "update_SalesReturnQty_SalesTbl": Update_SalesReturnQtySalesTblarray,
      "update_SalesRefundAmt_SalesHeader": Update_SalesRefundAmt_SalesHeader,
      "cal_GSTAmount_SalesReturn": Cal_GSTAmount_SalesReturn,
      "insert_ItemMovementReport_Cursor": Insert_ItemMovementReport_Cursor,
      "salesReturnPayment":  PaymentInsertobj
    };
    console.log(submitData);
    this._SalesReturnService.InsertCashSalesReturn(submitData).subscribe(response => {
      if (response) {
         console.log(response);
        //  this._toastr.showSuccess('Record Saved Successfully');
        //  this.snackBarService.showSuccessSnackBar('Record Saved Successfully', 'success','blue-snackbar');
        //  this.getPrint3(response);
        this.Itemchargeslist = [];
        this._matDialog.closeAll();
        // Swal.fire({
        //   position: "center",
        //   icon: "success",
        //   title: "Record Saved Successfully",
        //   showConfirmButton: false,
        //   timer: 1500
        // })
        Swal.fire('Paid SalesReturn!', 'Data saved Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            // this.getPrint3(response);
            this.Itemchargeslist = [];
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Sale data not saved', 'error');
      }
      this.sIsLoading = '';
    }, error => {
      // this.snackBarService.showErrorSnackBar('Sales data not saved !, Please check API error..', 'Error !');
    });
    this.dssaleList.data=[];
    this.dssaleDetailList.data = [];
    this.selectedssaleDetailList.data = [];

    // }
  }

  getTotAmtSum(element) {

    this.FinalTotalAmount = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
    // this.NetAmt =(element.reduce((sum, { GrossAmount }) => sum += +(GrossAmount || 0), 0)).toFixed(2);
    return this.FinalTotalAmount;
  }

  getSalesRetPrint(el){
    debugger
    var D_data = {
      "SalesID": el,// 
      "OP_IP_Type": this.OP_IP_Type,
      "IsPrescriptionFlag":0,// this.IsPrescriptionFlag
    }
  
    let printContents;
    this.subscriptionArr.push(
      this._SalesReturnService.getSalesReturnPrint(D_data).subscribe(res => {
  
        this.reportPrintObjList = res as Printsal[];
        console.log(this.reportPrintObjList);
  
        this.reportPrintObj = res[0] as Printsal;
        console.log(this.reportPrintObj);
        this.getTemplateTax2();
  
     
      })
    );
  }

  getTemplateTax2() {
    debugger
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=37';
    this._SalesReturnService.getTemplate(query).subscribe((resData: any) => {
  
      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['PatientName', 'RegNo', 'IP_OP_Number', 'DoctorName', 'SalesNo', 'Date', 'Time', 'ItemName', 'OP_IP_Type', 'GenderName', 'AgeYear', 'BatchNo', 'BatchExpDate', 'UnitMRP', 'Qty', 'TotalAmount', 'GrossAmount', 'NetAmount', 'VatPer', 'VatAmount', 'DiscAmount', 'ConcessionReason', 'PaidAmount', 'BalanceAmount', 'UserName', 'HSNCode', 'CashPayAmount', 'CardPayAMount', 'ChequePayAmount', 'PayTMAmount', 'NEFTPayAmount', 'GSTPer', 'GSTAmt', 'CGSTAmt', 'CGSTPer', 'SGSTPer', 'SGSTAmt', 'IGSTPer', 'IGSTAmt', 'ManufShortName', 'StoreNo','StoreName', 'DL_NO', 'GSTIN', 'CreditReason', 'CompanyName','HTotalAmount','ExtMobileNo'];
      // ;
      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      var strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        console.log(this.reportPrintObjList);
        var objreportPrint = this.reportPrintObjList[i - 1];
        let PackValue = '1200'
        // <div style="display:flex;width:60px;margin-left:20px;">
        //     <div>`+ i + `</div> 
        // </div>
  
        var strabc = `<hr style="border-color:white" >
        <div style="display:flex;margin:8px 0">
        <div style="display:flex;width:20px;margin-left:20px;">
            <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
        </div>
      
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.HSNcode + `</div> 
        </div>
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+objreportPrint.ManufShortName + `</div> 
        </div>
        <div style="display:flex;width:240px;text-align:left;margin-left:10px;">
            <div>`+ objreportPrint.ItemName + `</div> 
        </div>
         <div style="display:flex;width:60px;text-align:left;">
            <div>`+ objreportPrint.Qty + `</div> 
        </div>
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.BatchNo + `</div> 
         </div>
        <div style="display:flex;width:90px;text-align:left;margin-left:10px;">
        <div>`+ this.datePipe.transform(objreportPrint.BatchExpDate, 'dd/MM/yyyy') + `</div> 
        </div>
        <div style="display:flex;width:80px;text-align:left;margin-left:20px;">
        <div>`+ objreportPrint.UnitMRP + `</div> 
        </div>
        <div style="display:flex;width:100px;margin-left:10px;text-align:left;">
            <div>`+ '₹' + objreportPrint.TotalAmount.toFixed(2) + `</div> 
        </div>
        </div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];
  
      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.NetAmount));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.Time));
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
  
      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      console.log(this.printTemplate);
  
      setTimeout(() => {
         this.print3();
      }, 1000);
    });
  
  
  }

  convertToWord(e) {

    return converter.toWords(e);
  }
  
  transform2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
  }
  

  print3() {
    let popupWin, printContents;
   
    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
    
    popupWin.document.write(` <html>
    <head><style type="text/css">`);
    popupWin.document.write(`
      </style>
      <style type="text/css" media="print">
    @page { size: portrait; }
  </style>
          <title></title>
      </head>
    `);
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.billTemplate2.nativeElement.innerHTML}</body>
    <script>
      var css = '@page { size: portrait; }',
      head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');
      style.type = 'text/css';
      style.media = 'print';
  
      if (style.styleSheet){
          style.styleSheet.cssText = css;
      } else {
          style.appendChild(document.createTextNode(css));
      }
      head.appendChild(style);
    </script>
    </html>`);
    // popupWin.document.write(`<body style="margin:0;font-size: 16px;">${this.printTemplate}</body>
    // </html>`);
    
    popupWin.document.close();
  }
  deleteTableRow(element) {
   
  // Delete row in datatable level
    let index = this.Itemselectedlist.indexOf(element);
    if (index >= 0) {
      this.Itemselectedlist.splice(index, 1);
      this.selectedssaleDetailList.data = [];
      this.selectedssaleDetailList.data = this.Itemselectedlist;
    }
    Swal.fire('Success !', 'Item Row Deleted Successfully', 'success');
  }


  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClose() {
    this.Itemselectedlist = [];
  }
}

export class SaleBillList {
  SalesId: number;
  Date: Date;
  SalesNo: number;
  RegNo: number;
  PatientName: string;
  TotalAmount: any;
  VatAmount: any;
  DiscAmount: any;
  NetAmount: any;
  BalanceAmount: any;
  PaidAmount: any;
  OP_IP_Type: any;
  PatientType: any;
  PaidType: any;
  IsPrescription: boolean;
  CashCounterID: any;
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
      this.RegNo = SaleBillList.RegNo || 0;
      this.PatientName = SaleBillList.PatientName || 0;
      this.TotalAmount = SaleBillList.TotalAmount || 0;
      this.VatAmount = SaleBillList.VatAmount || 0;
      this.DiscAmount = SaleBillList.DiscAmount || 0;
      this.NetAmount = SaleBillList.NetAmount || 0;
      this.BalanceAmount = SaleBillList.BalanceAmount || 0;
      this.PaidAmount = SaleBillList.PaidAmount || 0;
      this.OP_IP_Type = SaleBillList.OP_IP_Type || 0;
      this.PatientType = SaleBillList.PatientType || '';
      this.PaidType = SaleBillList.PaidType || '';
      this.IsPrescription = SaleBillList.IsPrescription || '';
      this.CashCounterID = SaleBillList.CashCounterID || 0;
    }
  }
}
export class SalesDetailList {
  SalesId: Number;
  SalesDetId: number;
  SalesNo: string;
  OP_IP_ID: string;
  ItemId: number;
  ItemName: string;
  BatchNo: any;
  BatchExpDate: Date;
  UnitMRP: any;
  Qty: any;
  TotalAmount: any;
  VatPer
  VatAmount: any;
  DiscPer: any;
  DiscAmount: any;
  GrossAmount: any;
  LandedPrice: any;
  TotalLandedAmount: any;
  IsBatchRequired: any;
  PurRateWf: any;
  PurTotAmt: any;
  IsPrescription: any;
  CGSTPer: any;
  CGSTAmount: any;
  SGSTPer: any;
  SGSTAmount: any;
  IGSTPer: any;
  IGSTAmount: any;
  Narration: any;
  IsPurRate: any;
  StkID: any;
  /**
   * Constructor
   *
   * @param SalesDetailList
   */
  constructor(SalesDetailList) {
    {
      this.SalesId = SalesDetailList.SalesId || 0;
      this.SalesDetId = SalesDetailList.SalesDetId || 0;
      this.SalesNo = SalesDetailList.SalesNo || 0;
      this.OP_IP_ID = SalesDetailList.OP_IP_ID || 0;
      this.ItemId = SalesDetailList.ItemId || 0;
      this.ItemName = SalesDetailList.ItemName || 0;
      this.BatchNo = SalesDetailList.BatchNo || 0;
      this.BatchExpDate = SalesDetailList.BatchExpDate || 0;
      this.UnitMRP = SalesDetailList.UnitMRP || 0;
      this.Qty = SalesDetailList.Qty || 0;
      this.TotalAmount = SalesDetailList.TotalAmount || 0;
      this.VatPer = SalesDetailList.VatPer || 0;
      this.VatAmount = SalesDetailList.VatAmount || 0;
      this.DiscPer = SalesDetailList.DiscPer || 0;
      this.DiscAmount = SalesDetailList.DiscAmount || 0;
      this.GrossAmount = SalesDetailList.GrossAmount || 0;
      this.LandedPrice = SalesDetailList.LandedPrice || 0;
      this.TotalLandedAmount = SalesDetailList.TotalLandedAmount || 0;
      this.IsBatchRequired = SalesDetailList.IsBatchRequired || 0;
      this.PurRateWf = SalesDetailList.PurRateWf || 0;
      this.PurTotAmt = SalesDetailList.PurTotAmt || 0;
      this.IsPrescription = SalesDetailList.IsPrescription || 0;
      this.CGSTPer = SalesDetailList.CGSTPer || 0;
      this.CGSTAmount = SalesDetailList.CGSTAmount || 0;
      this.SGSTPer = SalesDetailList.SGSTPer || 0;
      this.SGSTAmount = SalesDetailList.SGSTAmount || 0.0;
      this.IGSTPer = SalesDetailList.IGSTPer || 0;
      this.IGSTAmount = SalesDetailList.IGSTAmount || 0;
      this.Narration = SalesDetailList.Narration || '';
      this.IsPurRate = SalesDetailList.IsPurRate || 0;
      this.StkID = SalesDetailList.StkID || 0;
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