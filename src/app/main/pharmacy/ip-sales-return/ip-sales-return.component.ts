import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { IpSalesReturnService } from './ip-sales-return.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { IndentList, Printsal } from '../sales/sales.component';
import { ToastrService } from 'ngx-toastr';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ip-sales-return',
  templateUrl: './ip-sales-return.component.html',
  styleUrls: ['./ip-sales-return.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IpSalesReturnComponent implements OnInit {

  sIsLoading: string = '';
  isLoading = true;
  isRegIdSelected:boolean=false;
  PatientListfilteredOptions: any;
  ItemfilteredOptions:any;
  noOptionFound:any;
  filteredOptions:any;
  isItemIdSelected:any;
  Store1List: any = [];
  screenFromString = 'admission-form';
  chargeslist: any = []; 
  dateTimeObj: any;
  vRegNo:any;
  vPatientName:any;
  vMobileNo:any;
  vAdmissionDate:any;
  vReturnQty:any;
  vItemName:any;
  vRegId:any;
  vAdmissionID:any;
  vTotalQty:any;
  vSalesNo:any;
  vBatchNo:any;
  vBatchExpDate:any;
  vUnitMRP:any;
  vVatPer:any;
  vDiscPer:any; 
  vFinalGSTAmt:any;
  vFinalDiscAmount:any;
  vSalesID:any;
  vOP_IP_Id:any;
  vOP_IP_Type:any;
  vLandedPrice:any;
  vTotalLandedAmount:any;
  vPurRateWf:any;
  vPurTotAmt:any;
  vSalesDetId:any;
  vStkID:any;
  vItemId:any;
  TotalAmt:any;
  GSTAmt:any;
  DiscAmt:any; 
  NetAmt:any;
  vFinalNetAmount:any;
  vFinalTotalAmt:any
  vRegID:any;
  vIPDNo:any; 
  vTariffName:any;
  vCompanyName:any; 
  vDoctorName:any;
  vRoomName:any;
  vBedName:any;
  vAge:any;
  vGenderName:any;
  vDischargePatientfalg:boolean=false;
 dsIpSaleItemList = new MatTableDataSource<IPSalesItemList>(); 
  dsIpRetrunItemList = new MatTableDataSource<IPSalesItemList>();
 
  displayedColumns = [
    'SalesNo',
    'ItemName',
    'BatchNo',
    'ExpDate',
    'Qty',
    'ReturnQty',
    'MRP',
    'TotalAmt',
    'GST',
    'GSTAmt',
    'Disc',
    'DiscAmt',
    'LandedPrice',
    // 'TotalLandedAmount', 
    // 'PurRateWf',
    // 'PurTotAmt', 
    'NetAmount' ,
    //'SalesDetId',
    'StkID',
    'Action'
  ];
  displayeditemColumns = [ 
    'ItemName',
    'BatchNo', 
    'Qty'  
  ];
 

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;

  constructor(
    public _IpSalesRetService: IpSalesReturnService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    public toastr: ToastrService,

  ) { }

  ngOnInit(): void {  
  }
   
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
  getSearchList() {
    var m_data = {
      "Keyword": `${this._IpSalesRetService.userFormGroup.get('RegID').value}%`
    }
    if (this._IpSalesRetService.userFormGroup.get('RegID').value.length >= 1) {
      this._IpSalesRetService.getAdmittedpatientlist(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        console.log(resData)
        this.PatientListfilteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        } 
      });
    } 
  } 
  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
  }
  getDischargedSearchList() {
    var m_data = {
      "Keyword": `${this._IpSalesRetService.userFormGroup.get('RegID').value}%`
    }
    if (this._IpSalesRetService.userFormGroup.get('RegID').value.length >= 1) {
      this._IpSalesRetService.getDischargepatientlist(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        console.log(resData) 
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        } 
      });
    } 
  } 
  getOptionDischargeText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
  } 

  getSelectedObj(obj){
    console.log(obj)
   this.vRegNo = obj.RegNo;
   this.vPatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
   this.vAdmissionDate = obj.AdmissionDate;
   this.vMobileNo = obj.MobileNo; 
   this.vAdmissionID = obj.AdmissionID;
   this.vRegId = obj.RegID;
   this.vIPDNo = obj.IPDNo; 
   this.vDoctorName = obj.DoctorName;
   this.vTariffName =obj.TariffName
   this.vCompanyName = obj.CompanyName 
   this.vRoomName = obj.RoomName;
   this.vBedName = obj.BedName
   this.vGenderName = obj.GenderName
   this.vAge = obj.Age 
   this.itemname.nativeElement.focus(); 
   this.getIpPrescriptinRetrunlist();
  }
  filteredOptionsItem:any;
OnRadioChange(){
  this.dsIpSaleItemList.data = [];
  this.getItemNameList();
}
getDischargedList(event){
  if(event.checked == true){
    //this.patientInfoReset();
    this.OnReset();
    this.vDischargePatientfalg = true;
  }else{
    //this.patientInfoReset(); 
    this.OnReset();
    this.vDischargePatientfalg = false;
  } 
}
  getItemNameList() {
    if ((this.vRegID == '' || this.vRegID == null || this.vRegID == undefined)) {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if(this._IpSalesRetService.userFormGroup.get('TypeodPay').value == 'CashPay')
      {
    var Param = {
      "RegNo":  this.vRegNo || 0,
      "StoreId":  this.accountService.currentUserValue.user.storeId || 0,
      "ItemName":  `${this._IpSalesRetService.userFormGroup.get('ItemName').value}%`, 
      "BatchNo":  0
    }
    console.log(Param)
    this._IpSalesRetService.getCashItemList(Param).subscribe(data => {
      this.ItemfilteredOptions = data;
      console.log(this.ItemfilteredOptions)
      this.filteredOptionsItem = data;
      if (this.ItemfilteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  else{
    var Param = {
      "RegNo":  this.vRegNo || 0,
      "StoreId":  this.accountService.currentUserValue.user.storeId || 0,
      "ItemName":  `${this._IpSalesRetService.userFormGroup.get('ItemName').value}%`, 
      "BatchNo":  0
    }
    console.log(Param)
    this._IpSalesRetService.getCreditItemList(Param).subscribe(data => {
      this.ItemfilteredOptions = data;
      console.log(this.ItemfilteredOptions)
      this.filteredOptionsItem = data;
      if (this.ItemfilteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  }
  getItemOptionText(option) {
    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';
  }
  getSelectedItemObj(obj){
    console.log(obj)
    this.vTotalQty = obj.Qty;
    this.vSalesNo = obj.SalesNo; 
    this.vBatchNo = obj.BatchNo;
    this.vBatchExpDate = obj.BatchExpDate
    this.vUnitMRP = obj.UnitMRP;
    this.vVatPer = obj.VatPer; 
    this.vDiscPer = obj.DiscPer;
    this.vRegId = obj.RegID;
    this.vSalesID = obj.SalesId;
    this.vOP_IP_Id = obj.OP_IP_ID;
    this.vOP_IP_Type =obj.OP_IP_Type;
    this.vLandedPrice = obj.LandedPrice;
    //this.vTotalLandedAmount =obj.TotalLandedAmount;
    this.vPurRateWf = obj.PurRateWf;
    this.vItemId =obj.ItemId;
    this.vStkID = obj.StkID;
    this.vSalesDetId =obj.SalesDetId;
  }
 OnAdd(){
  if ((this.vReturnQty == '' || this.vReturnQty == null || this.vReturnQty == undefined)) {
    this.toastr.warning('Please enter a Return Qty', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }
  const isDuplicate = this.dsIpSaleItemList.data.some(item => item.BatchNo === this.vBatchNo);
  if (!isDuplicate) {
    this.chargeslist = this.dsIpSaleItemList.data;
    this.chargeslist.push(
      {
        SalesNo:this.vSalesNo || 0,
        ItemName:this._IpSalesRetService.userFormGroup.get('ItemName').value.ItemName || '',
        ItemId:this.vItemId || 0,
        BatchNo: this.vBatchNo || 0,
        ExpDate: this.vBatchExpDate || 0,
        MRP: this.vUnitMRP || 0,
        Qty: this.vTotalQty || 0,
        ReturnQty: this.vReturnQty || 0,
        TotalAmt: this.TotalAmt || 0,
        GST:this.vVatPer || 0,
        GSTAmt:this.GSTAmt || 0,
        Disc:this.vDiscPer || 0,
        DiscAmt:this.DiscAmt || 0,
        LandedPrice: this.vLandedPrice || 0,
        TotalLandedAmount:    this.vTotalLandedAmount || 0,
        PurRateWf: this.vPurRateWf || 0,
        PurTotAmt: this.vPurTotAmt || 0,
        NetAmount:  this.NetAmt || 0,
        SalesDetId: this.vSalesDetId || 0,
        StkID: this.vStkID  || 0
      });
      console.log(this.chargeslist)
    this.dsIpSaleItemList.data = this.chargeslist;
  } else {
    this.toastr.warning('Selected Item already added in the list', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
  }
  this.ItemReset();
  this.itemname.nativeElement.focus();
 }
 ItemReset(){
this.vItemName = '';
this.vReturnQty = 0 ;
this.vTotalQty = 0 ;
 }
 deleteTableRow(event, element) {
  // if (this.key == "Delete") {
  let index = this.chargeslist.indexOf(element);
  if (index >= 0) {
    this.chargeslist.splice(index, 1);
    this.dsIpSaleItemList.data = [];
    this.dsIpSaleItemList.data = this.chargeslist;
  }
  Swal.fire('Success !', 'ItemList Row Deleted Successfully', 'success');

  // }
}
calculation(){
  if(parseInt(this.vReturnQty) > parseInt(this.vTotalQty)){
    this.toastr.warning('Return Qty cannot be greater than BalQty', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    this.vReturnQty= 0;
  }else{
    this.TotalAmt = (parseFloat(this.vUnitMRP) * parseFloat(this.vReturnQty)).toFixed(2);
    this.GSTAmt =  ((parseFloat(this.vVatPer) * parseFloat(this.TotalAmt))/100).toFixed(2) || 0;
    this.DiscAmt =  ((parseFloat(this.vDiscPer) * parseFloat(this.TotalAmt))/100).toFixed(2) || 0;
    this.NetAmt = (parseFloat(this.TotalAmt) - parseFloat(this.DiscAmt)).toFixed(2);
    this.vPurTotAmt = (parseFloat(this.vPurRateWf) * parseFloat(this.vReturnQty)).toFixed(2);
    this.vTotalLandedAmount = (parseFloat(this.vLandedPrice) * parseFloat(this.vReturnQty)).toFixed(2);
  }

} 
getCellCalculation(contact, ReturnQty) {
  if (parseInt(contact.ReturnQty) > parseInt(contact.Qty)) {
    this.toastr.warning('Return Qty cannot be greater than BalQty', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    contact.ReturnQty = 0;
    contact.ReturnQty = ''; 
    contact.TotalAmt = 0;
    contact.GSTAmt = 0;
    contact.DiscAmt = 0;
    contact.NetAmount = 0;
  }
  else if(contact.ReturnQty == '0' || contact.ReturnQty == '' || contact.ReturnQty == null || contact.ReturnQty == undefined){
    contact.ReturnQty = 0;
    contact.ReturnQty = ''; 
    contact.TotalAmt = 0;
    contact.GSTAmt = 0;
    contact.DiscAmt = 0;
    contact.NetAmount = 0;
  }
  else { 
    contact.TotalAmt = (parseFloat(contact.MRP) * parseFloat(contact.ReturnQty)).toFixed(2);
    contact.GSTAmt=  ((parseFloat(contact.GST) * parseFloat(contact.TotalAmt))/100).toFixed(2) || 0;
    contact.DiscAmt=  ((parseFloat(contact.Disc) * parseFloat(contact.TotalAmt))/100).toFixed(2) || 0;
    contact.NetAmount = (parseFloat(contact.TotalAmt) - parseFloat(contact.DiscAmt)).toFixed(2);
    contact.PurTotAmt = (parseFloat(contact.PurRateWf) * parseFloat(contact.ReturnQty)).toFixed(2);
    contact.TotalLandedAmount = (parseFloat(contact.LandedPrice) * parseFloat(contact.ReturnQty)).toFixed(2);
  }
}
getTotalAmt(element) { 
  this.vFinalNetAmount = (element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0)).toFixed(2);
  this.vFinalTotalAmt = (element.reduce((sum, { TotalAmt }) => sum += +(TotalAmt || 0), 0)).toFixed(2);
  this.vFinalGSTAmt = (element.reduce((sum, { GSTAmt }) => sum += +(GSTAmt || 0), 0)).toFixed(2);
  this.vFinalDiscAmount = (element.reduce((sum, { DiscAmt }) => sum += +(DiscAmt || 0), 0)).toFixed(2);
 
  return this.vFinalNetAmount;
}
keyPressAlphanumeric(event) {
  var inp = String.fromCharCode(event.keyCode);
  if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}  
  vcheckreturnQty:any=''; 
  savebtn:boolean=false;
  onSave() {
    if ((this.vRegID == '' || this.vRegID == null || this.vRegID == undefined)) {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((!this.dsIpSaleItemList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const isCheckReturnQty = this.dsIpSaleItemList.data.some(item => item.ReturnQty === this.vcheckreturnQty);
    if(!isCheckReturnQty){ 
      this.isLoading123 = true; 
      this.onCreditPaySave(); 
  }
  else{
    this.toastr.warning('Please enter ReturnQty Without ReturnQty Cannot perform save operation.', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-error',
    }); 
  }
  }
  isLoading123 = false;
 
  onCreditPaySave() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    this.savebtn=true;  
    let salesReturnHeader = {};
    salesReturnHeader['Date'] = formattedDate;
    salesReturnHeader['Time'] = formattedTime;
    salesReturnHeader['SalesId'] = this.vSalesID;
    salesReturnHeader['OP_IP_ID'] = this.vOP_IP_Id;
    salesReturnHeader['OP_IP_Type'] = this.vOP_IP_Type;
    salesReturnHeader['TotalAmount'] = this._IpSalesRetService.IPFinalform.get('FinalTotalAmt').value || 0;
    salesReturnHeader['VatAmount'] = this._IpSalesRetService.IPFinalform.get('FinalGSTAmt').value || 0;
    salesReturnHeader['DiscAmount'] = this._IpSalesRetService.IPFinalform.get('FinalDiscAmount').value || 0;
    salesReturnHeader['NetAmount'] = Math.round(this._IpSalesRetService.IPFinalform.get('FinalNetAmount').value) || 0;
    let PaidAmount
    let balanceAmount
    if(this._IpSalesRetService.userFormGroup.get('TypeodPay').value == 'CashPay'){
      PaidAmount = Math.round(this._IpSalesRetService.IPFinalform.get('FinalNetAmount').value) || 0;
      balanceAmount = 0;
    }else{
      balanceAmount = Math.round(this._IpSalesRetService.IPFinalform.get('FinalNetAmount').value) || 0; 
      PaidAmount = 0;
    } 
    salesReturnHeader['PaidAmount'] = PaidAmount || 0;
    salesReturnHeader['BalanceAmount'] = balanceAmount || 0;
    salesReturnHeader['IsSellted'] = 1;
    salesReturnHeader['IsPrint'] = 0,
    salesReturnHeader['IsFree'] = 0;
    salesReturnHeader['UnitID'] = 1;
    salesReturnHeader['addedBy'] = this.accountService.currentUserValue.user.id,
    salesReturnHeader['StoreID'] = this.accountService.currentUserValue.user.storeId,
    salesReturnHeader['Narration'] = "";
    salesReturnHeader['SalesReturnId'] = 0

    let salesReturnDetailInsertCreditarr = [];
    this.dsIpSaleItemList.data.forEach((element) => {
      let salesReturnDetailCredit = {};
      salesReturnDetailCredit['SalesReturnId'] = 0;
      salesReturnDetailCredit['itemId'] = element.ItemId;
      salesReturnDetailCredit['batchNo'] = element.BatchNo;
      salesReturnDetailCredit['batchExpDate'] = element.ExpDate;
      salesReturnDetailCredit['unitMRP'] = element.MRP;
      salesReturnDetailCredit['qty'] = element.ReturnQty;
      salesReturnDetailCredit['totalAmount'] = element.TotalAmt;
      salesReturnDetailCredit['vatPer'] = element.GST;
      salesReturnDetailCredit['vatAmount'] = element.GSTAmt;
      salesReturnDetailCredit['discPer'] = element.Disc;
      salesReturnDetailCredit['discAmount'] = element.DiscAmt;
      salesReturnDetailCredit['grossAmount'] = element.NetAmount;
      salesReturnDetailCredit['landedPrice'] = element.LandedPrice;
      salesReturnDetailCredit['totalLandedAmount'] = element.TotalLandedAmount;
      salesReturnDetailCredit['PurRate'] = element.PurRateWf;
      salesReturnDetailCredit['PurTot'] = element.PurTotAmt;
      salesReturnDetailCredit['SalesID'] = this.vSalesID;
      salesReturnDetailCredit['SalesDetID'] = element.SalesDetId;
      let isCashOrCredit 
      if(this._IpSalesRetService.userFormGroup.get('TypeodPay').value == 'CashPay'){
        isCashOrCredit = 0;
      }else{ 
        isCashOrCredit = 1;
      }  
      salesReturnDetailCredit['isCashOrCredit'] = isCashOrCredit;
      salesReturnDetailCredit['cgstPer'] = ((element.GST)/2);
      salesReturnDetailCredit['cgstAmt'] =  ((element.GSTAmt)/2);
      salesReturnDetailCredit['sgstPer'] = ((element.GST)/2);
      salesReturnDetailCredit['sgstAmt'] = ((element.GSTAmt)/2);
      salesReturnDetailCredit['igstPer'] =  0;
      salesReturnDetailCredit['igstAmt'] =  0;
      salesReturnDetailCredit['stkID'] = element.StkID;
      salesReturnDetailInsertCreditarr.push(salesReturnDetailCredit);
    });

    console.log(salesReturnDetailInsertCreditarr);
    let updateCurStkSalesCreditarray = [];
    this.dsIpSaleItemList.data.forEach((element) => {
      let updateCurStkSalesCredit = {};
      updateCurStkSalesCredit['itemId'] = element.ItemId;
      updateCurStkSalesCredit['issueQty'] = element.ReturnQty;
      updateCurStkSalesCredit['storeID'] = this.accountService.currentUserValue.user.storeId,
      updateCurStkSalesCredit['stkID'] = element.StkID;
      updateCurStkSalesCreditarray.push(updateCurStkSalesCredit);
    });

    let Update_SalesReturnQtySalesTblarray = [];
    this.dsIpSaleItemList.data.forEach((element) => {
      let Update_SalesReturnQtySalesTbl = {};
      Update_SalesReturnQtySalesTbl['SalesDetId'] = element.SalesDetId;
      Update_SalesReturnQtySalesTbl['ReturnQty'] = element.ReturnQty;
      Update_SalesReturnQtySalesTblarray.push(Update_SalesReturnQtySalesTbl);
    });

    let Update_SalesRefundAmt_SalesHeader = {};
    Update_SalesRefundAmt_SalesHeader['SalesReturnId'] = 0;

    let Cal_GSTAmount_SalesReturn = {};
    Cal_GSTAmount_SalesReturn['SalesReturnID'] = 0;

    let Insert_ItemMovementReport_Cursor = {};
    Insert_ItemMovementReport_Cursor['Id'] = 0;
    Insert_ItemMovementReport_Cursor['TypeId'] = 2;

    let PaymentInsertobj = {};
    PaymentInsertobj['BillNo'] = 0,
    PaymentInsertobj['ReceiptNo'] = '',
    PaymentInsertobj['PaymentDate'] = formattedDate;
    PaymentInsertobj['PaymentTime'] = formattedTime;
    PaymentInsertobj['CashPayAmount'] = this._IpSalesRetService.IPFinalform.get('FinalNetAmount').value || 0;
    PaymentInsertobj['ChequePayAmount'] = 0,
    PaymentInsertobj['ChequeNo'] = 0,
    PaymentInsertobj['BankName'] = '',
    PaymentInsertobj['ChequeDate'] = '01/01/1900',
    PaymentInsertobj['CardPayAmount'] = 0,
    PaymentInsertobj['CardNo'] = '',
    PaymentInsertobj['CardBankName'] = '',
    PaymentInsertobj['CardDate'] = '01/01/1900',
    PaymentInsertobj['AdvanceUsedAmount'] = 0;
    PaymentInsertobj['AdvanceId'] = 0;
    PaymentInsertobj['RefundId'] = 0;
    PaymentInsertobj['TransactionType'] = 5;
    PaymentInsertobj['Remark'] = '',
    PaymentInsertobj['AddBy'] = this.accountService.currentUserValue.user.id,
    PaymentInsertobj['IsCancelled'] = 0;
    PaymentInsertobj['IsCancelledBy'] = 0;
    PaymentInsertobj['IsCancelledDate'] = '01/01/1900',
    PaymentInsertobj['OPD_IPD_Type'] = 3;
    PaymentInsertobj['NEFTPayAmount'] = 0,
    PaymentInsertobj['NEFTNo'] = '',
    PaymentInsertobj['NEFTBankMaster'] = '',
    PaymentInsertobj['NEFTDate'] = '01/01/1900',
    PaymentInsertobj['PayTMAmount'] = 0,
    PaymentInsertobj['PayTMTranNo'] = '',
    PaymentInsertobj['PayTMDate'] = '01/01/1900',
    PaymentInsertobj['paymentId'] = 0

 if(this._IpSalesRetService.userFormGroup.get('TypeodPay').value == 'CashPay'){

  let submitData = {
    "salesReturnHeader": salesReturnHeader,
    "salesReturnDetail": salesReturnDetailInsertCreditarr,
    "salesReturn_CurStk_Upt": updateCurStkSalesCreditarray,
    "update_SalesReturnQty_SalesTbl": Update_SalesReturnQtySalesTblarray,
    "update_SalesRefundAmt_SalesHeader": Update_SalesRefundAmt_SalesHeader,
    "cal_GSTAmount_SalesReturn": Cal_GSTAmount_SalesReturn,
    "insert_ItemMovementReport_Cursor": Insert_ItemMovementReport_Cursor,
    "salesReturnPayment": PaymentInsertobj
  };
  console.log(submitData);
  this._IpSalesRetService.InsertCashSalesReturn(submitData).subscribe(response => {
    if (response) {
      console.log(response);
      this.toastr.success('Record Saved Successfully.', 'Save !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
      this.getSalesRetPrint(response);
      this.OnReset();
      this.savebtn=false;   
    } else {
      this.toastr.error('transaction error!', 'error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    } 
  }, error => {
    this.toastr.error('API error!', 'error !', {
      toastClass: 'tostr-tost custom-toast-error',
    });
  }); 
 }
 else{ 
  let submitData = {
    "salesReturnHeader": salesReturnHeader,
    "salesReturnDetail": salesReturnDetailInsertCreditarr,
    "salesReturn_CurStk_Upt": updateCurStkSalesCreditarray,
    "update_SalesReturnQty_SalesTbl": Update_SalesReturnQtySalesTblarray,
    "update_SalesRefundAmt_SalesHeader": Update_SalesRefundAmt_SalesHeader,
    "cal_GSTAmount_SalesReturn": Cal_GSTAmount_SalesReturn,
    "insert_ItemMovementReport_Cursor": Insert_ItemMovementReport_Cursor
  };
  console.log(submitData);
  this._IpSalesRetService.InsertCreditSalesReturn(submitData).subscribe(response => {
    if (response) {
      console.log(response);
      this.toastr.success('Record Saved Successfully.', 'Save !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
      this.getSalesRetPrint(response);
      this.savebtn=false;  
      this.OnReset();
    
    } else {
      this.toastr.error('transaction error!', 'error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    }
    this.sIsLoading = '';
  }, error => {
    this.toastr.error('API error!', 'error !', {
      toastClass: 'tostr-tost custom-toast-error',
    });
  });  
 } 
    setTimeout(() => { 
      this.isLoading123=false;
    }, 2000);
  }
  reportPrintObj: Printsal;
  reportPrintObjTax: Printsal;
  subscriptionArr: Subscription[] = [];
  reportPrintObjList: Printsal[] = [];
  printTemplate: any;
  @ViewChild('billSalesReturn') billSalesReturn:ElementRef;
  getSalesRetPrint(el){ 
    var D_data = {
      "SalesID": el,
      "OP_IP_Type": this.vOP_IP_Type,
    }
    let printContents;
    this.subscriptionArr.push(
      this._IpSalesRetService.getSalesReturnPrint(D_data).subscribe(res => {
        this.reportPrintObjList = res as Printsal[];
        // console.log(this.reportPrintObjList);
        this.reportPrintObj = res[0] as Printsal;
        console.log(this.reportPrintObj);
        setTimeout(() => {
          this.print3();
       }, 1000);
      })
    );
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
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.billSalesReturn.nativeElement.innerHTML}</body>
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


















getIpPrescriptinRetrunlist(){
  var vdata={
    "PresReId":this.vAdmissionID
  }
  console.log(vdata)
  this._IpSalesRetService.getIpPrescriptinRetrunlist(vdata).subscribe(data=>{
    this.dsIpRetrunItemList.data = data as IPSalesItemList[]
    console.log(this.dsIpRetrunItemList.data)
  })
}

  // ViewSalesRetPdf(SalesReturnId) { 
  //   setTimeout(() => { 
  //     this._IpSalesRetService.getSalesReturnPdf(SalesReturnId,this.vOP_IP_Type).subscribe(res => {
  //       const dialogRef = this._matDialog.open(PdfviewerComponent,
  //         {
  //           maxWidth: "85vw",
  //           height: '750px',
  //           width: '100%',
  //           data: {
  //             base64: res["base64"] as string,
  //             title: "Pharma Sales Return bill viewer"
  //           }
  //         });
  //       dialogRef.afterClosed().subscribe(result => {
  //       this.sIsLoading = ' ';
  //       });
  //     });

  //   }, 100);
  // }



  OnReset() {
    this._IpSalesRetService.userFormGroup.reset();
    this._IpSalesRetService.IPFinalform.reset();
    this.dsIpSaleItemList.data = [];
    this.PatientListfilteredOptions = [];
    this.chargeslist = [];
    this.vRegNo = '';
    this.vPatientName = '';
    this.vAdmissionID = '';
    this.vAdmissionDate = ''; 
    this.vRegId ='';
    this.vIPDNo = ''; 
    this.vDoctorName =  '';
    this.vTariffName =  '';
    this.vCompanyName =  '';
    this.vRoomName =  '';
    this.vBedName =  '';
    this.vGenderName =  '';
    this.vAge =  '';
    this._IpSalesRetService.userFormGroup.get('Op_ip_id').setValue('1');
    this._IpSalesRetService.userFormGroup.get('TypeodPay').setValue('CashPay');
  }

  onClear() {

  }
  @ViewChild('itemname') itemname: ElementRef;
  @ViewChild('ReturnQty') ReturnQty: ElementRef; 
  @ViewChild('addbutton') addbutton: ElementRef;
 
  public onEnteritemName(event): void {
    if (event.which === 13) {
      this.ReturnQty.nativeElement.focus();
    }
  }
  public onEnterReturnQty(event): void {
    if (event.which === 13) {
      this.addbutton.nativeElement.focus();
    }
  }
} 
export class IPSalesItemList {
  SalesNo: Number;
  ExpDate: number;
  ItemName: string;
  BatchNo: string;
  MRP: number;
  Qty: any;;
  ReturnQty: any;
  TotalAmt: any;
  GST:any;
  Disc:any;
  GSTAmt:any;
  DiscAmt:any;
  NetAmount:any; 
  ItemId:any;
  SalesId:any;
  SalesDetId:any;
  LandedPrice:any;
  TotalLandedAmount:any;
  StkID:any;
  CGSTPer:any;
  CGSTAmount:any;
  SGSTPer:any;
  SGSTAmount:any;
  IGSTPer:any;
  IGSTAmount:any;
  PurRateWf:any;
  PurTotAmt:any;

 
  /**
   * Constructor
   *
   * @param IPSalesItemList
   */
  constructor(IPSalesItemList) {
    {
      this.SalesNo = IPSalesItemList.SalesNo || 0;
      this.ExpDate = IPSalesItemList.ExpDate || 0;
      this.ItemName = IPSalesItemList.ItemName || "";
      this.BatchNo = IPSalesItemList.BatchNo || "";
      this.MRP = IPSalesItemList.MRP || 0;
      this.Qty = IPSalesItemList.Qty || 0;
      this.ReturnQty = IPSalesItemList.ReturnQty ||  0;
      this.TotalAmt = IPSalesItemList.TotalAmt ||  0;
      this.GST = IPSalesItemList.GST ||  0;
      this.Disc = IPSalesItemList.Disc ||  0;
      this.GSTAmt = IPSalesItemList.GSTAmt ||  0;
      this.DiscAmt = IPSalesItemList.DiscAmt ||  0;
      this.NetAmount = IPSalesItemList.NetAmount ||  0;

      this.ItemId = IPSalesItemList.ItemId ||  0;
      this.SalesId = IPSalesItemList.SalesId ||  0;
      this.SalesDetId = IPSalesItemList.SalesDetId ||  0;
      this.LandedPrice = IPSalesItemList.LandedPrice ||  0;
      this.TotalLandedAmount = IPSalesItemList.TotalLandedAmount ||  0;
      this.StkID = IPSalesItemList.StkID || 0;
      this.CGSTPer = IPSalesItemList.CGSTPer || 0;
      this.CGSTAmount = IPSalesItemList.CGSTAmount || 0;
      this.SGSTPer = IPSalesItemList.SGSTPer || 0;
      this.SGSTAmount = IPSalesItemList.SGSTAmount ||  0;
      this.IGSTPer = IPSalesItemList.IGSTPer ||  0;
      this.IGSTAmount = IPSalesItemList.IGSTAmount ||  0;
      this.PurRateWf = IPSalesItemList.PurRateWf || 0;
      this.PurTotAmt = IPSalesItemList.PurTotAmt || 0;
    }
  }
}

// <!-- (keyup)="getTotalAmount(contact)" -->