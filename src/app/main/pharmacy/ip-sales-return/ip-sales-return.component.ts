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
import { IndentList } from '../sales/sales.component';
import { ToastrService } from 'ngx-toastr';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

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
  ItemfilteredOptions:any=[];
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
 ;
 dsIpSaleItemList = new MatTableDataSource<IPSalesItemList>();
  SelectedList = new MatTableDataSource<IndentList>();
  saleSelectedDatasource = new MatTableDataSource<IndentList>();
 
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
 
  
  registerObj:any; 
  selcteditemObj:any;

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

  getSelectedObjRegIP(obj) {
    console.log(obj);
    let IsDischarged = 0;
    IsDischarged = obj.isDischarged;
    if (IsDischarged == 1) {
      Swal.fire({
        icon: "warning",
        title: "Selected Patient is already discharged",
        showConfirmButton: false,
        timer: 1500
      });
      return
    }
    this.registerObj = obj;
    this.vPatientName = obj.firstName + ' ' + obj.middleName + ' ' + obj.lastName;
    this.getItemNameList();
  }
 
OnRadioChange(){
  this.dsIpSaleItemList.data = [];
  this.getItemNameList();
}
  getItemNameList() {
    if ((this.registerObj.regNo == '' || this.registerObj.regNo == null || this.registerObj.regNo == undefined)) {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return
    }

    let storeID = this.accountService.currentUserValue.user.storeId
    let ItemName = this._IpSalesRetService.userFormGroup.get('ItemName').value + '%' || '%'
    const Filters = [
      { "fieldName": "RegNo", "fieldValue": String(0), "opType": "Equals" },
      { "fieldName": "StoreId", "fieldValue": String(storeID), "opType": "Equals" },
      { "fieldName": "ItemName", "fieldValue": String(ItemName), "opType": "Equals" },
      { "fieldName": "BatchNo", "fieldValue": String(0), "opType": "Equals" }
    ]

    if (this._IpSalesRetService.userFormGroup.get('PaymentType').value == 'CashPay') {
      var param = {
        "searchFields": Filters,
        "mode": "IPSalesReturnCash"
      }
    }
    else {
      var param = {
        "searchFields": Filters,
        "mode": "IPSalesReturnCredit"
      }
    }
    // console.log(param)
    this._IpSalesRetService.getSalesReturnitemlist(param).subscribe(response => {
      this.ItemfilteredOptions = response
      // console.log(this.ItemfilteredOptions)
    })
  } 
  getSelectedItemObj(obj){
    console.log(obj)
    this.selcteditemObj = obj;
    this._IpSalesRetService.userFormGroup.patchValue({
      TotalQty:obj.Qty
    }) 
  }
  OnAdd() {
    debugger
    let invalidFields = [];
    if (this._IpSalesRetService.userFormGroup.invalid) {
      for (const controlName in this._IpSalesRetService.userFormGroup.controls) {
        if (this._IpSalesRetService.userFormGroup.controls[controlName].invalid) {
          invalidFields.push(`${controlName}`);
        }
      }
    }
    if (invalidFields.length > 0) {
      invalidFields.forEach(field => {
        this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
        );
      });
    }

    if (this.dsIpSaleItemList.data.length > 0) {
      const isDuplicate = this.dsIpSaleItemList.data.some(item => item.BatchNo === this.registerObj.BatchNo);
      if (!isDuplicate) {
        this.toastr.warning('Selected Item already added in the list', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return
      }
    } 
    const formValues = this._IpSalesRetService.userFormGroup.value
    let totalAmt = (parseFloat(this.selcteditemObj.UnitMRP) * parseFloat(formValues.ReturnQty)).toFixed(2);
    let GSTAmt = ((parseFloat(this.selcteditemObj.VatPer) * parseFloat(totalAmt)) / 100).toFixed(2) || 0;
    let DiscAmt = ((parseFloat(this.selcteditemObj.DiscPer) * parseFloat(totalAmt)) / 100).toFixed(2) || '0';
    let netAmt = (parseFloat(totalAmt) - parseFloat(DiscAmt)).toFixed(2);
    let PurTotAmt = (parseFloat(this.selcteditemObj.PurRateWf) * parseFloat(formValues.ReturnQty)).toFixed(2);
    let TotalLandedAmount = (parseFloat(this.selcteditemObj.LandedPrice) * parseFloat(formValues.ReturnQty)).toFixed(2);

    this.chargeslist.push(
      {
        SalesNo: this.selcteditemObj.SalesNo || 0,
        ItemName: this._IpSalesRetService.userFormGroup.get('ItemName').value.ItemName || '',
        ItemId: this.selcteditemObj.ItemId || 0,
        BatchNo: this.selcteditemObj.BatchNo || 0,
        ExpDate: this.selcteditemObj.BatchExpDate || 0,
        MRP: this.selcteditemObj.UnitMRP || 0,
        Qty: this.selcteditemObj.Qty || 0,
        ReturnQty: this.vReturnQty || 0,
        TotalAmt: totalAmt || 0,
        GST: this.selcteditemObj.VatPer || 0,
        GSTAmt: GSTAmt || 0,
        Disc: this.selcteditemObj.DiscPer || 0,
        DiscAmt: this.DiscAmt || 0,
        LandedPrice: this.selcteditemObj.LandedPrice || 0,
        TotalLandedAmount: TotalLandedAmount || 0,
        PurRateWf: this.selcteditemObj.PurRateWf || 0,
        PurTotAmt: PurTotAmt || 0,
        NetAmount: netAmt || 0,
        SalesDetId: this.selcteditemObj.SalesDetId || 0,
        StkID: this.selcteditemObj.StkID || 0
      });
    console.log(this.chargeslist)
    this.dsIpSaleItemList.data = this.chargeslist;
    this.ItemReset();
    const ItemNameElement = document.querySelector(`[name='ItemName']`) as HTMLElement;
    if (ItemNameElement) {
      ItemNameElement.focus();
    }
  }
  ItemReset() {
    this._IpSalesRetService.userFormGroup.patchValue({
      ItemName: [''],
      ReturnQty: [''],
      TotalQty: [0],
      PaymentType: ['CashPay'],
    })
  }
 deleteTableRow(event, element) { 
  let index = this.chargeslist.indexOf(element);
  if (index >= 0) {
    this.chargeslist.splice(index, 1);
    this.dsIpSaleItemList.data = [];
    this.dsIpSaleItemList.data = this.chargeslist;
  }
  Swal.fire('Success !', 'ItemList Row Deleted Successfully', 'success'); 
}

 
checkQty(){
  const formValues = this._IpSalesRetService.userFormGroup.value
   if(!formValues.RegID){
    this.toastr.warning('Please select Patient Name', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });  
    return 
  }
  if(formValues.ReturnQty > formValues.TotalQty){
    this.toastr.warning('Return Qty cannot be greater than BalQty', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    }); 
    formValues.ReturnQty = ''; 
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
    if(this._IpSalesRetService.userFormGroup.get('PaymentType').value == 'CashPay'){
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
    salesReturnHeader['addedBy'] = this.accountService.currentUserValue.userId,
    salesReturnHeader['StoreID'] = this.accountService.currentUserValue.storeId,
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
      if(this._IpSalesRetService.userFormGroup.get('PaymentType').value == 'CashPay'){
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
      updateCurStkSalesCredit['storeID'] = this.accountService.currentUserValue.storeId,
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
    PaymentInsertobj['AddBy'] = this.accountService.currentUserValue.userId,
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

 if(this._IpSalesRetService.userFormGroup.get('PaymentType').value == 'CashPay'){

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
       this.ViewSalesRetPdf(response);  
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
       this.ViewSalesRetPdf(response);
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


  ViewSalesRetPdf(SalesReturnId) {
    
    setTimeout(() => {

      this._IpSalesRetService.getSalesReturnPdf(SalesReturnId,this.vOP_IP_Type).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pharma Sales Return bill viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
        this.sIsLoading = ' ';
        });
      });

    }, 100);
  }



  OnReset() {
    this._IpSalesRetService.userFormGroup.reset();
    this._IpSalesRetService.IPFinalform.reset();
    this.dsIpSaleItemList.data = [];
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