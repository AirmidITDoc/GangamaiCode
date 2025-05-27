import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import Swal from 'sweetalert2';
import { IpSalesReturnService } from './ip-sales-return.service';

@Component({
  selector: 'app-ip-sales-return',
  templateUrl: './ip-sales-return.component.html',
  styleUrls: ['./ip-sales-return.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IpSalesReturnComponent implements OnInit {
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
    'NetAmount',
    //'SalesDetId',
    'StkID',
    'Action'
  ];

  sIsLoading: string = '';
  isLoading = true;
  isItemIdSelected: boolean = false; 
    ItemfilteredOptions: Observable<string[]>;   
  vRegno:any = 0;
  Itemlist: any = [];
  screenFromString = 'admission-form';
  chargeslist: any = [];
  dateTimeObj: any; 
  vPatientName: any;    
  vOP_IP_Type: any;  
  registerObj: any;
  selcteditemObj: any; 

  dsIpSaleItemList = new MatTableDataSource<IPSalesItemList>();   

  @ViewChild('ItemName') ItemName!: ElementRef; 
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;

  constructor(
    public _IpSalesRetService: IpSalesReturnService,
    public _matDialog: MatDialog, 
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    public toastr: ToastrService, 
  ) { }

  ngOnInit(): void {
    this._IpSalesRetService.userFormGroup.markAllAsTouched();
    this._IpSalesRetService.IPFinalform.markAllAsTouched();
  }

  getDateTime(dateTimeObj) {
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
        timer: 2000
      });
      return
    }
    this.registerObj = obj;
    this.vPatientName = obj.firstName + ' ' + obj.middleName + ' ' + obj.lastName; 
    this.vRegno = this.registerObj.regNo;
    this.getItemNameList();
    this.OnRadioChange();
  }

  OnRadioChange() {
    this.dsIpSaleItemList.data = [];
    this.chargeslist = [];
    this.getUpdateTotalAmt();
    this.getItemNameList();
  }
  getItemNameList() {
    debugger
    if (this.vRegno == '' || this.vRegno == null || this.vRegno == undefined || this.vRegno == 0) {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return
    }

    let storeID = this.accountService.currentUserValue.user.storeId
    let ItemName = this._IpSalesRetService.userFormGroup.get('ItemName').value + '%' || '%'
    const Filters = [
      { "fieldName": "RegNo", "fieldValue": String(this.vRegno), "opType": "Equals" },
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
      this.Itemlist = response
      this.ItemfilteredOptions = this._IpSalesRetService.userFormGroup.get('ItemName').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterItemname(value) : this.Itemlist.slice()),
        ); 
    })
  }
  getOptionTextitemname(option){
    return option && option.ItemName ? option.ItemName : '';
  }
  getSelectedItemObj(obj) {
    console.log(obj)
    this.selcteditemObj = obj;
    this._IpSalesRetService.userFormGroup.patchValue({
      TotalQty: obj.Qty
    })
  }
    private _filterItemname(value: any): string[] {
      if (value) {
        const filterValue = value && value.ItemName ? value.ItemName.toLowerCase() : value.toLowerCase();
        return this.Itemlist.filter(option => option.ItemName.toLowerCase().includes(filterValue));
      }
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
        return
    }

    const formValues = this._IpSalesRetService.userFormGroup.value
    if (!(formValues.PatientName.admissionID > 0)) {
      this.toastr.warning('Please select Patient Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return
    }
    if (this.dsIpSaleItemList.data.length > 0) {
       const isItemAlreadyAdded = this.dsIpSaleItemList.data.some((element) => element.BatchNo === this.selcteditemObj.BatchNo);
      if (isItemAlreadyAdded) {
        this.toastr.warning('Selected Item already added in the list', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        this.ItemReset();
        this.ItemName.nativeElement.focus(); 
        return
      } 
    }
   
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
        ReturnQty: formValues.ReturnQty || 0,
        TotalAmt: totalAmt || 0,
        GST: this.selcteditemObj.VatPer || 0,
        GSTAmt: GSTAmt || 0,
        Disc: parseFloat(this.selcteditemObj.DiscPer).toFixed(2) || 0,
        DiscAmt: DiscAmt || 0,
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
    this.getUpdateTotalAmt();
    this.ItemReset();
    this.ItemName.nativeElement.focus(); 
  }

  ItemReset() {
    this._IpSalesRetService.userFormGroup.get('ItemName').setValue('%');
    this._IpSalesRetService.userFormGroup.get('ReturnQty').setValue('');
    this._IpSalesRetService.userFormGroup.get('TotalQty').setValue(''); 
        this._IpSalesRetService.userFormGroup.markAllAsTouched(); 
  }
  deleteTableRow(event, element) {
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsIpSaleItemList.data = [];
      this.dsIpSaleItemList.data = this.chargeslist;
    }
    Swal.fire('Success !', 'ItemList Row Deleted Successfully', 'success');
    this.getUpdateTotalAmt();
  }
  checkQty() {
    const formValues = this._IpSalesRetService.userFormGroup.value
    if (!formValues.PatientName) {
      this.toastr.warning('Please select Patient Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return
    }
    if (formValues.ReturnQty > formValues.TotalQty) {
      this.toastr.warning('Return Qty cannot be greater than BalQty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this._IpSalesRetService.userFormGroup.get('ReturnQty').setValue('');
      return
    }
  }
  //Table calulation
  getCellCalculation(contact, ReturnQty) {
    if (parseInt(ReturnQty) > parseInt(contact.Qty)) {
      Swal.fire({
        icon: "warning",
        title: "Return Qty cannot be greater than BalQty",
        showConfirmButton: false,
        timer: 2000
      });
      contact.ReturnQty = '';
      contact.TotalAmt = 0;
      contact.GSTAmt = 0;
      contact.DiscAmt = 0;
      contact.NetAmount = 0;
      return
    }
    else if (contact.ReturnQty == '0' || contact.ReturnQty == '' || contact.ReturnQty == null || contact.ReturnQty == undefined) {
      contact.ReturnQty = 0;
      contact.ReturnQty = '';
      contact.TotalAmt = 0;
      contact.GSTAmt = 0;
      contact.DiscAmt = 0;
      contact.NetAmount = 0;
    }
    else {
      contact.TotalAmt = (parseFloat(contact.MRP) * parseFloat(contact.ReturnQty)).toFixed(2);
      contact.GSTAmt = ((parseFloat(contact.GST) * parseFloat(contact.TotalAmt)) / 100).toFixed(2) || 0;
      contact.DiscAmt = ((parseFloat(contact.Disc) * parseFloat(contact.TotalAmt)) / 100).toFixed(2) || 0;
      contact.NetAmount = (parseFloat(contact.TotalAmt) - parseFloat(contact.DiscAmt)).toFixed(2);
      contact.PurTotAmt = (parseFloat(contact.PurRateWf) * parseFloat(contact.ReturnQty)).toFixed(2);
      contact.TotalLandedAmount = (parseFloat(contact.LandedPrice) * parseFloat(contact.ReturnQty)).toFixed(2);
    }
    this.getUpdateTotalAmt();
  }
  getUpdateTotalAmt() { 
    const form = this._IpSalesRetService.IPFinalform;
    const itemList = this.dsIpSaleItemList.data;
    const netAmount = itemList.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    const updatableFormValues = {
      FinalTotalAmt: itemList.reduce((sum, { TotalAmt }) => sum += +(TotalAmt || 0), 0).toFixed(2),
      FinalGSTAmt: itemList.reduce((sum, { GSTAmt }) => sum += +(GSTAmt || 0), 0).toFixed(2),
      FinalDiscAmount: itemList.reduce((sum, { DiscAmt }) => sum += +(DiscAmt || 0), 0).toFixed(2),
      FinalNetAmount: netAmount.toFixed(2),
    }
    form.patchValue({
      ...updatableFormValues
    });
  }
  //Save code 
  onSave() {
debugger
    const formValues = this._IpSalesRetService.userFormGroup.value
    if (!(formValues.PatientName.admissionID > 0)) {
      this.toastr.warning('Please select Patient Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return
    } 
    if ((this.vRegno == '' || this.vRegno == null || this.vRegno == undefined || this.vRegno == 0)) {
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
    if (!this.isValidForm()) {
      Swal.fire({
        icon: "warning",
        title: "Please enter ReturnQty Without ReturnQty Cannot perform save operation.",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }  
    Swal.fire({
      title: 'Do you want to Save the Sales Return',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save !"

    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.onSavePayment();
      }
    })
  } 

  onSavePayment() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    let salesReturnHeader = {};
    salesReturnHeader['date'] = formattedDate;
    salesReturnHeader['time'] = formattedTime;
    salesReturnHeader['salesId'] = this.selcteditemObj.SalesId || 0;
    salesReturnHeader['opIpId'] =  this.selcteditemObj.OP_IP_ID || 0;
    salesReturnHeader['opIpType'] = 1;
    salesReturnHeader['totalAmount'] = this._IpSalesRetService.IPFinalform.get('FinalTotalAmt').value || 0;
    salesReturnHeader['vatAmount'] = this._IpSalesRetService.IPFinalform.get('FinalGSTAmt').value || 0;
    salesReturnHeader['discAmount'] = this._IpSalesRetService.IPFinalform.get('FinalDiscAmount').value || 0;
    salesReturnHeader['netAmount'] = Math.round(this._IpSalesRetService.IPFinalform.get('FinalNetAmount').value) || 0;
    if (this._IpSalesRetService.userFormGroup.get('PaymentType').value == 'CashPay') {
      salesReturnHeader['paidAmount'] = Math.round(this._IpSalesRetService.IPFinalform.get('FinalNetAmount').value) || 0;
      salesReturnHeader['balanceAmount'] = 0;
    } else {
      salesReturnHeader['paidAmount'] = 0;
      salesReturnHeader['balanceAmount'] = Math.round(this._IpSalesRetService.IPFinalform.get('FinalNetAmount').value) || 0;
    }
    salesReturnHeader['isSellted'] = false;
    salesReturnHeader['isPrint'] = true,
    salesReturnHeader['isFree'] = false;
    salesReturnHeader['unitId'] = 1;
    salesReturnHeader['addedBy'] = this.accountService.currentUserValue.userId;
    salesReturnHeader['storeId'] = this.accountService.currentUserValue.user.storeId,
    salesReturnHeader['narration'] = "";
    salesReturnHeader['salesReturnId'] = 0

    let salesReturnDetailInsertCreditarr = [];
    this.dsIpSaleItemList.data.forEach((element) => {
      let salesReturnDetailCredit = {};

      salesReturnDetailCredit['salesReturnID'] = 0;
      salesReturnDetailCredit['itemId'] = element.ItemId || 0;
      salesReturnDetailCredit['batchNo'] = element.BatchNo || '';
      salesReturnDetailCredit['batchExpDate'] =this.datePipe.transform(element.ExpDate , "yyyy-MM-dd") || '1900-01-01'; 
      salesReturnDetailCredit['unitMRP'] = element.MRP || 0;
      salesReturnDetailCredit['qty'] = element.ReturnQty || 0;
      salesReturnDetailCredit['totalAmount'] = element.TotalAmt || 0;
      salesReturnDetailCredit['vatPer'] = element.GST || 0;
      salesReturnDetailCredit['vatAmount'] = element.GSTAmt || 0;
      salesReturnDetailCredit['discPer'] = element.Disc || 0;
      salesReturnDetailCredit['discAmount'] = element.DiscAmt || 0;
      salesReturnDetailCredit['grossAmount'] = element.NetAmount || 0;
      salesReturnDetailCredit['landedPrice'] = element.LandedPrice || 0;
      salesReturnDetailCredit['totalLandedAmount'] = element.TotalLandedAmount || 0;
      salesReturnDetailCredit['purRate'] = element.PurRateWf || 0;
      salesReturnDetailCredit['purTot'] = element.PurTotAmt || 0;
      salesReturnDetailCredit['salesId'] =  this.selcteditemObj.SalesId || 0;
      salesReturnDetailCredit['salesDetId'] = element.SalesDetId || 0;
      let isCashOrCredit
      if (this._IpSalesRetService.userFormGroup.get('PaymentType').value == 'CashPay') {
        isCashOrCredit = 0;
      } else {
        isCashOrCredit = 1;
      }
      salesReturnDetailCredit['isCashOrCredit'] = isCashOrCredit;
      salesReturnDetailCredit['cgstPer'] = ((element.GST) / 2) || 0;
      salesReturnDetailCredit['cgstAmt'] = ((element.GSTAmt) / 2) || 0;
      salesReturnDetailCredit['sgstPer'] = ((element.GST) / 2) || 0;
      salesReturnDetailCredit['sgstAmt'] = ((element.GSTAmt) / 2) || 0;
      salesReturnDetailCredit['igstPer'] = 0;
      salesReturnDetailCredit['igstAmt'] = 0;
      salesReturnDetailCredit['stkId'] = element.StkID || 0;
      salesReturnDetailInsertCreditarr.push(salesReturnDetailCredit);
    });

    console.log(salesReturnDetailInsertCreditarr);
    let updateCurrStkSales = [];
    this.dsIpSaleItemList.data.forEach((element) => {
      let updateCurStkSalesObj = {};
      updateCurStkSalesObj['itemId'] = element.ItemId;
      updateCurStkSalesObj['issueQty'] = element.ReturnQty;
      updateCurStkSalesObj['storeId'] = this.accountService.currentUserValue.storeId,
      updateCurStkSalesObj['istkId'] = element.StkID;
      updateCurrStkSales.push(updateCurStkSalesObj);
    });

    let Update_SalesReturnQtySalesTblarray = [];
    this.dsIpSaleItemList.data.forEach((element) => {
      let Update_SalesReturnQtySalesTbl = {};
      Update_SalesReturnQtySalesTbl['salesDetId'] = element.SalesDetId;
      Update_SalesReturnQtySalesTbl['returnQty'] = element.ReturnQty;
      Update_SalesReturnQtySalesTblarray.push(Update_SalesReturnQtySalesTbl);
    });

    let Update_SalesRefundAmt_SalesHeader = {};
    Update_SalesRefundAmt_SalesHeader['salesReturnId'] = 0;

    let Cal_GSTAmount_SalesReturn = {};
    Cal_GSTAmount_SalesReturn['salesReturnId'] = 0;

    let Insert_ItemMovementReport_Cursor = {};
    Insert_ItemMovementReport_Cursor['id'] = 0;
    Insert_ItemMovementReport_Cursor['typeId'] = 2;

    let PaymentInsertobj = {};
    PaymentInsertobj['paymentId'] = 0
    PaymentInsertobj['billNo'] = this.selcteditemObj.SalesId || 0,
    PaymentInsertobj['paymentDate'] = formattedDate;
    PaymentInsertobj['paymentTime'] = formattedTime;
    PaymentInsertobj['cashPayAmount'] = this._IpSalesRetService.IPFinalform.get('FinalNetAmount').value || 0;
    PaymentInsertobj['chequePayAmount'] = 0,
    PaymentInsertobj['chequeNo'] = '0',
    PaymentInsertobj['bankName'] = '',
    PaymentInsertobj['chequeDate'] = '1900-01-01',
    PaymentInsertobj['cardPayAmount'] = 0,
    PaymentInsertobj['cardNo'] = '0',
    PaymentInsertobj['cardBankName'] = '',
    PaymentInsertobj['cardDate'] ='1900-01-01',
    PaymentInsertobj['advanceUsedAmount'] = 0;
    PaymentInsertobj['advanceId'] = 0;
    PaymentInsertobj['refundId'] = 0;
    PaymentInsertobj['transactionType'] = 5;
    PaymentInsertobj['remark'] = '',
    PaymentInsertobj['addBy'] = this.accountService.currentUserValue.userId,
    PaymentInsertobj['isCancelled'] = false;
    PaymentInsertobj['isCancelledBy'] = 0;
    PaymentInsertobj['isCancelledDate'] = '1900-01-01',
    PaymentInsertobj['opdipdType'] = 3;
    PaymentInsertobj['neftpayAmount'] = 0,
    PaymentInsertobj['neftno'] = '0',
    PaymentInsertobj['neftbankMaster'] = '',
    PaymentInsertobj['neftdate'] = '1900-01-01',
    PaymentInsertobj['payTmamount'] = 0,
    PaymentInsertobj['payTmtranNo'] = '0',
    PaymentInsertobj['payTmdate'] = '1900-01-01'

    if (this._IpSalesRetService.userFormGroup.get('PaymentType').value == 'CashPay') {
      let submitData = {
        "salesReturn": salesReturnHeader,
        "salesReturnDetails": salesReturnDetailInsertCreditarr,
        "currentStock": updateCurrStkSales,
        "salesDetail": Update_SalesReturnQtySalesTblarray,
        "tSalesReturn": Update_SalesRefundAmt_SalesHeader,
        "tSalesReturns": Cal_GSTAmount_SalesReturn,
        "salesHeader": Insert_ItemMovementReport_Cursor,
        "payment": PaymentInsertobj
      };
      console.log(submitData);
      this._IpSalesRetService.InsertCashSalesReturn(submitData).subscribe(response => {
        if (response) {
          console.log(response);
          this.ViewSalesRetPdf(response);
          this.OnReset(); 
        }
      });
    }
    else {
      let submitData = {
        "salesReturn": salesReturnHeader,
        "salesReturnDetails": salesReturnDetailInsertCreditarr,
        "currentStock": updateCurrStkSales,
        "salesDetail": Update_SalesReturnQtySalesTblarray,
        "tSalesReturn": Update_SalesRefundAmt_SalesHeader,
        "tSalesReturns": Cal_GSTAmount_SalesReturn,
        "salesHeader": Insert_ItemMovementReport_Cursor
      };
      console.log(submitData);
      this._IpSalesRetService.InsertCreditSalesReturn(submitData).subscribe(response => {
        if (response) {
          console.log(response);
          this.ViewSalesRetPdf(response); 
          this.OnReset();
        }
      });
    }
  }


  ViewSalesRetPdf(SalesReturnId) {

    setTimeout(() => {

      this._IpSalesRetService.getSalesReturnPdf(SalesReturnId, this.vOP_IP_Type).subscribe(res => {
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
    this.vPatientName = '';
    this.registerObj = '';
    this.selcteditemObj = '' ;
    this._IpSalesRetService.userFormGroup.get('Op_ip_id').setValue('1');
    this._IpSalesRetService.userFormGroup.get('PaymentType').setValue('CashPay');
    this._IpSalesRetService.userFormGroup.markAllAsTouched();
    this._IpSalesRetService.IPFinalform.markAllAsTouched();
  } 
   isValidForm(): boolean {
    return this.dsIpSaleItemList.data.every((i) => i.ReturnQty > 0);
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
 
   focusNext(nextElement: HTMLElement) {
    nextElement.focus();
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
  GST: any;
  Disc: any;
  GSTAmt: any;
  DiscAmt: any;
  NetAmount: any;
  ItemId: any;
  SalesId: any;
  SalesDetId: any;
  LandedPrice: any;
  TotalLandedAmount: any;
  StkID: any;
  CGSTPer: any;
  CGSTAmount: any;
  SGSTPer: any;
  SGSTAmount: any;
  IGSTPer: any;
  IGSTAmount: any;
  PurRateWf: any;
  PurTotAmt: any;


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
      this.ReturnQty = IPSalesItemList.ReturnQty || 0;
      this.TotalAmt = IPSalesItemList.TotalAmt || 0;
      this.GST = IPSalesItemList.GST || 0;
      this.Disc = IPSalesItemList.Disc || 0;
      this.GSTAmt = IPSalesItemList.GSTAmt || 0;
      this.DiscAmt = IPSalesItemList.DiscAmt || 0;
      this.NetAmount = IPSalesItemList.NetAmount || 0;

      this.ItemId = IPSalesItemList.ItemId || 0;
      this.SalesId = IPSalesItemList.SalesId || 0;
      this.SalesDetId = IPSalesItemList.SalesDetId || 0;
      this.LandedPrice = IPSalesItemList.LandedPrice || 0;
      this.TotalLandedAmount = IPSalesItemList.TotalLandedAmount || 0;
      this.StkID = IPSalesItemList.StkID || 0;
      this.CGSTPer = IPSalesItemList.CGSTPer || 0;
      this.CGSTAmount = IPSalesItemList.CGSTAmount || 0;
      this.SGSTPer = IPSalesItemList.SGSTPer || 0;
      this.SGSTAmount = IPSalesItemList.SGSTAmount || 0;
      this.IGSTPer = IPSalesItemList.IGSTPer || 0;
      this.IGSTAmount = IPSalesItemList.IGSTAmount || 0;
      this.PurRateWf = IPSalesItemList.PurRateWf || 0;
      this.PurTotAmt = IPSalesItemList.PurTotAmt || 0;
    }
  }
}
