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
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

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
    'NetAmount',
    'StkID',
    'Action'
  ];

  ItemFormGroup: FormGroup;
  IPSalesRetFooterform: FormGroup;
  IpSalesRetForm: FormGroup
  sIsLoading: string = '';
  isLoading = true;
  isItemIdSelected: boolean = false;
  ItemfilteredOptions: Observable<string[]>;
  vRegno: any = 0;
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
    public formBuilder: FormBuilder,
    public _FormvalidationserviceService: FormvalidationserviceService
  ) { }


  ngOnInit(): void {
    this.ItemFormGroup = this.CreateItemfromGroup();
    this.IPSalesRetFooterform = this.CreateSalesFooterform();
    this.IpSalesRetForm = this.CreateSalesFooterform();
    this.ItemFormGroup.markAllAsTouched();
    this.IPSalesRetFooterform.markAllAsTouched();
  }
  CreateSalesFooterform() {
    return this.formBuilder.group({
      FinalNetAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      FinalTotalAmt: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      FinalGSTAmt: [0],
      FinalDiscAmount: [0],
    });
  }
  CreateItemfromGroup() {
    return this.formBuilder.group({
      Op_ip_id: ['1'],
      PatientName:[''],
      PaymentType: ['CashPay'],
      ItemName: ['', [Validators.required]],
      ReturnQty: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
      TotalQty: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
    });
  }
  CreateSalesRetForm() {
    return this.formBuilder.group({
      //sales return header  
      salesReturn: this.formBuilder.group({
        salesReturnId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        date: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
        time: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
        salesId: [this.selcteditemObj.SalesId, [this._FormvalidationserviceService.onlyNumberValidator()]],
        opIpId: [this.selcteditemObj.OP_IP_ID, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
        opIpType: [1],
        totalAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
        vatAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        discAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        netAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
        paidAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        balanceAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isSellted: false,
        isPrint: true,
        isFree: false,
        unitId: [1, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
        addedBy: [this.accountService.currentUserValue.userId],
        storeId: [this.accountService.currentUserValue.user.storeId, [this._FormvalidationserviceService.onlyNumberValidator()]],
        narration: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],//need to set concession reason
      }),
      // sales return details in array
      salesReturnDetails: this.formBuilder.array([]),
      // Current stock in array
      currentStock: this.formBuilder.array([]),
      // sales details update in array
      salesDetail: this.formBuilder.array([]),
      //Payment form
      payment: this.formBuilder.group({
        paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        billNo: [this.selcteditemObj.SalesId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        paymentDate: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
        paymentTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
        cashPayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        chequePayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        chequeNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        bankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        chequeDate: ['1999-01-01'],
        cardPayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        cardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        cardBankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        cardDate: ['1999-01-01'],
        advanceUsedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        transactionType: [5, [this._FormvalidationserviceService.onlyNumberValidator()]],
        remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        addBy: [this.accountService.currentUserValue.userId],
        isCancelled: [false],
        isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelledDate: ['1999-01-01'],
        opdipdType: [3, [this._FormvalidationserviceService.onlyNumberValidator()]],
        neftpayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        neftbankMaster: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        neftdate: ['1999-01-01'],
        payTmamount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        payTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        payTmdate: ['1999-01-01'],
      })
    });
  }
  createSalesretDetails(element: any): FormGroup {
    return this.formBuilder.group({
      salesReturnID: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      itemId: [element.ItemId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      batchNo: [element.BatchNo, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      batchExpDate: [this.datePipe.transform(element.ExpDate, "yyyy-MM-dd"), [this._FormvalidationserviceService.onlyNumberValidator()]],
      unitMrp: [element.MRP, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      qty: [element.ReturnQty, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      totalAmount: [element.TotalAmt, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      vatPer: [element.GST, [this._FormvalidationserviceService.onlyNumberValidator()]],
      vatAmount: [element.GSTAmt, [this._FormvalidationserviceService.onlyNumberValidator()]],
      discPer: [element.Disc, [this._FormvalidationserviceService.onlyNumberValidator()]],
      discAmount: [element.DiscAmt, [this._FormvalidationserviceService.onlyNumberValidator()]],
      grossAmount: [element.NetAmount, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      landedPric: [element.LandedPrice, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      totalLandedAmount: [element.TotalLandedAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
      purRate: [element.PurRateWf, [this._FormvalidationserviceService.onlyNumberValidator()]],
      purTot: [element.PurTotAmt, [this._FormvalidationserviceService.onlyNumberValidator()]],
      salesId: [this.selcteditemObj.SalesId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      salesDetId: [element.SalesDetId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      isCashOrCredit: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      cgstper: [((element.GST) / 2), [this._FormvalidationserviceService.onlyNumberValidator()]],
      cgstamt: [((element.GSTAmt) / 2), [this._FormvalidationserviceService.onlyNumberValidator()]],
      sgstper: [((element.GST) / 2), [this._FormvalidationserviceService.onlyNumberValidator()]],
      sgstamt: [((element.GSTAmt) / 2), [this._FormvalidationserviceService.onlyNumberValidator()]],
      igstper: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      igstamt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      stkId: [element.StkID, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    })
  }
  createcurrentStock(element: any): FormGroup {
    return this.formBuilder.group({
      itemId: [element?.ItemId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      issueQty: [element?.ReturnQty ?? 0, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      storeId: [this.accountService.currentUserValue.storeId],
      istkId: [element?.StkID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }
  createSalesDetails(element: any): FormGroup {
    return this.formBuilder.group({
      salesDetId: [element.SalesDetId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      returnQty: [element.ReturnQty, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }
  // Getters 
  get SaleRetDetailsArray(): FormArray {
    return this.IpSalesRetForm.get('salesReturnDetails') as FormArray;
  }
  get currentStockArray(): FormArray {
    return this.IpSalesRetForm.get('currentStock') as FormArray;
  }
  get SalesDetArray(): FormArray {
    return this.IpSalesRetForm.get('salesDetail') as FormArray;
  }

  getSelectedObjRegIP(obj) {
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
    if (this.vRegno == '' || this.vRegno == null || this.vRegno == undefined || this.vRegno == 0) {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return
    }
    let storeID = this.accountService.currentUserValue.user.storeId
    let ItemName = this.ItemFormGroup.get('ItemName').value + '%' || '%'
    const Filters = [
      { "fieldName": "RegNo", "fieldValue": String(this.vRegno), "opType": "Equals" },
      { "fieldName": "StoreId", "fieldValue": String(storeID), "opType": "Equals" },
      { "fieldName": "ItemName", "fieldValue": String(ItemName), "opType": "Equals" },
      { "fieldName": "BatchNo", "fieldValue": String(0), "opType": "Equals" }
    ]

    if (this.ItemFormGroup.get('PaymentType').value == 'CashPay') {
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
    this._IpSalesRetService.getSalesReturnitemlist(param).subscribe(response => {
      this.Itemlist = response
      this.ItemfilteredOptions = this.ItemFormGroup.get('ItemName').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterItemname(value) : this.Itemlist.slice()),
      );
    })
  }
  getOptionTextitemname(option) {
    return option && option.ItemName ? option.ItemName : '';
  }
  getSelectedItemObj(obj) {
    this.selcteditemObj = obj;
    this.ItemFormGroup.patchValue({
      TotalQty: obj.Qty
    }) 
    this.IpSalesRetForm = this.CreateSalesFooterform();
  }
  private _filterItemname(value: any): string[] {
    if (value) {
      const filterValue = value && value.ItemName ? value.ItemName.toLowerCase() : value.toLowerCase();
      return this.Itemlist.filter(option => option.ItemName.toLowerCase().includes(filterValue));
    }
  }
  OnAdd() {
    let invalidFields = [];
    if (this.ItemFormGroup.invalid) {
      for (const controlName in this.ItemFormGroup.controls) {
        if (this.ItemFormGroup.controls[controlName].invalid) {
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

    const formValues = this.ItemFormGroup.value
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
        ItemName: this.ItemFormGroup.get('ItemName').value.ItemName || '',
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
    this.ItemFormGroup.get('ItemName').setValue('%');
    this.ItemFormGroup.get('ReturnQty').setValue('');
    this.ItemFormGroup.get('TotalQty').setValue('');
    this.ItemFormGroup.markAllAsTouched();
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
    const formValues = this.ItemFormGroup.value
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
      this.ItemFormGroup.get('ReturnQty').setValue('');
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
    const form = this.IPSalesRetFooterform;
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
    const formValues = this.ItemFormGroup.value
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


    this.IpSalesRetForm.get('salesReturn.date').setValue(formattedDate)
    this.IpSalesRetForm.get('salesReturn.time').setValue(formattedTime)
    this.IpSalesRetForm.get('salesReturn.totalAmount').setValue(this.IPSalesRetFooterform.get('FinalTotalAmt').value)
    this.IpSalesRetForm.get('salesReturn.vatAmount').setValue(this.IPSalesRetFooterform.get('FinalGSTAmt').value)
    this.IpSalesRetForm.get('salesReturn.discAmount').setValue(this.IPSalesRetFooterform.get('FinalDiscAmount').value)
    this.IpSalesRetForm.get('salesReturn.netAmount').setValue(this.IPSalesRetFooterform.get('FinalNetAmount').value)

    if (this.IpSalesRetForm.valid) {
      this.SaleRetDetailsArray.clear()
      this.currentStockArray.clear()
      this.SalesDetArray.clear()
      this.dsIpSaleItemList.data.forEach((element) => {
        this.SaleRetDetailsArray.push(this.createSalesretDetails(element));
        this.currentStockArray.push(this.createcurrentStock(element));
        this.SalesDetArray.push(this.createSalesDetails(element));
      });
      if (this.ItemFormGroup.get('PaymentType').value == 'CashPay') {
        this.IpSalesRetForm.get('salesReturn.paidAmount').setValue(this.IPSalesRetFooterform.get('FinalNetAmount').value)
        this.IpSalesRetForm.get('salesReturn.balanceAmount').setValue(0)
        this.IpSalesRetForm.get('payment.paymentDate').setValue(formattedDate)
        this.IpSalesRetForm.get('payment.paymentTime').setValue(formattedTime)
        this.IpSalesRetForm.get('payment.cashPayAmount').setValue(this.IPSalesRetFooterform.get('FinalTotalAmt').value)

        console.log(this.IpSalesRetForm.value);
        this._IpSalesRetService.InsertCashSalesReturn(this.IpSalesRetForm.value).subscribe(response => {
          this.OnReset();
        });
      }
      else {
        this.IpSalesRetForm.get('salesReturn.paidAmount').setValue(0)
        this.IpSalesRetForm.get('salesReturn.balanceAmount').setValue(this.IPSalesRetFooterform.get('FinalNetAmount').value)
        this.IpSalesRetForm.get('payment.paymentDate').setValue(formattedDate)
        this.IpSalesRetForm.get('payment.paymentTime').setValue(formattedTime)

        console.log(this.IpSalesRetForm.value);
        this._IpSalesRetService.InsertCreditSalesReturn(this.IpSalesRetForm.value).subscribe(response => {
          this.OnReset();
        });
      }
    } else {
      let invalidFields = [];
      if (this.IpSalesRetForm.invalid) {
        for (const controlName in this.IpSalesRetForm.controls) {
          const control = this.IpSalesRetForm.get(controlName);
          if (control instanceof FormGroup || control instanceof FormArray) {
            for (const nestedKey in control.controls) {
              if (control.get(nestedKey)?.invalid) {
                invalidFields.push(`Sales Return Date : ${controlName}.${nestedKey}`);
              }
            }
          } else if (control?.invalid) {
            invalidFields.push(`Sales Return From: ${controlName}`);
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
    }
  }
  // onSavePaymentold() {
  //   const currentDate = new Date();
  //   const datePipe = new DatePipe('en-US');
  //   const formattedTime = datePipe.transform(currentDate, 'shortTime');
  //   const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

  //   let salesReturnHeader = {};
  //   salesReturnHeader['date'] = formattedDate;
  //   salesReturnHeader['time'] = formattedTime;
  //   salesReturnHeader['salesId'] = this.selcteditemObj.SalesId || 0;
  //   salesReturnHeader['opIpId'] =  this.selcteditemObj.OP_IP_ID || 0;
  //   salesReturnHeader['opIpType'] = 1;
  //   salesReturnHeader['totalAmount'] = this.IPSalesRetFooterform.get('FinalTotalAmt').value || 0;
  //   salesReturnHeader['vatAmount'] = this.IPSalesRetFooterform.get('FinalGSTAmt').value || 0;
  //   salesReturnHeader['discAmount'] = this.IPSalesRetFooterform.get('FinalDiscAmount').value || 0;
  //   salesReturnHeader['netAmount'] = Math.round(this.IPSalesRetFooterform.get('FinalNetAmount').value) || 0;
  //   if (this.ItemFormGroup.get('PaymentType').value == 'CashPay') {
  //     salesReturnHeader['paidAmount'] = Math.round(this.IPSalesRetFooterform.get('FinalNetAmount').value) || 0;
  //     salesReturnHeader['balanceAmount'] = 0;
  //   } else {
  //     salesReturnHeader['paidAmount'] = 0;
  //     salesReturnHeader['balanceAmount'] = Math.round(this.IPSalesRetFooterform.get('FinalNetAmount').value) || 0;
  //   }
  //   salesReturnHeader['isSellted'] = false;
  //   salesReturnHeader['isPrint'] = true,
  //   salesReturnHeader['isFree'] = false;
  //   salesReturnHeader['unitId'] = 1;
  //   salesReturnHeader['addedBy'] = this.accountService.currentUserValue.userId;
  //   salesReturnHeader['storeId'] = this.accountService.currentUserValue.user.storeId,
  //   salesReturnHeader['narration'] = "";
  //   salesReturnHeader['salesReturnId'] = 0

  //   let salesReturnDetailInsertCreditarr = [];
  //   this.dsIpSaleItemList.data.forEach((element) => {
  //     let salesReturnDetailCredit = {};

  //     salesReturnDetailCredit['salesReturnID'] = 0;
  //     salesReturnDetailCredit['itemId'] = element.ItemId || 0;
  //     salesReturnDetailCredit['batchNo'] = element.BatchNo || '';
  //     salesReturnDetailCredit['batchExpDate'] =this.datePipe.transform(element.ExpDate , "yyyy-MM-dd") || '1900-01-01'; 
  //     salesReturnDetailCredit['unitMRP'] = element.MRP || 0;
  //     salesReturnDetailCredit['qty'] = element.ReturnQty || 0;
  //     salesReturnDetailCredit['totalAmount'] = element.TotalAmt || 0;
  //     salesReturnDetailCredit['vatPer'] = element.GST || 0;
  //     salesReturnDetailCredit['vatAmount'] = element.GSTAmt || 0;
  //     salesReturnDetailCredit['discPer'] = element.Disc || 0;
  //     salesReturnDetailCredit['discAmount'] = element.DiscAmt || 0;
  //     salesReturnDetailCredit['grossAmount'] = element.NetAmount || 0;
  //     salesReturnDetailCredit['landedPrice'] = element.LandedPrice || 0;
  //     salesReturnDetailCredit['totalLandedAmount'] = element.TotalLandedAmount || 0;
  //     salesReturnDetailCredit['purRate'] = element.PurRateWf || 0;
  //     salesReturnDetailCredit['purTot'] = element.PurTotAmt || 0;
  //     salesReturnDetailCredit['salesId'] =  this.selcteditemObj.SalesId || 0;
  //     salesReturnDetailCredit['salesDetId'] = element.SalesDetId || 0;
  //     let isCashOrCredit
  //     if (this.ItemFormGroup.get('PaymentType').value == 'CashPay') {
  //       isCashOrCredit = 0;
  //     } else {
  //       isCashOrCredit = 1;
  //     }
  //     salesReturnDetailCredit['isCashOrCredit'] = isCashOrCredit;
  //     salesReturnDetailCredit['cgstPer'] = ((element.GST) / 2) || 0;
  //     salesReturnDetailCredit['cgstAmt'] = ((element.GSTAmt) / 2) || 0;
  //     salesReturnDetailCredit['sgstPer'] = ((element.GST) / 2) || 0;
  //     salesReturnDetailCredit['sgstAmt'] = ((element.GSTAmt) / 2) || 0;
  //     salesReturnDetailCredit['igstPer'] = 0;
  //     salesReturnDetailCredit['igstAmt'] = 0;
  //     salesReturnDetailCredit['stkId'] = element.StkID || 0;
  //     salesReturnDetailInsertCreditarr.push(salesReturnDetailCredit);
  //   });

  //   console.log(salesReturnDetailInsertCreditarr);
  //   let updateCurrStkSales = [];
  //   this.dsIpSaleItemList.data.forEach((element) => {
  //     let updateCurStkSalesObj = {};
  //     updateCurStkSalesObj['itemId'] = element.ItemId;
  //     updateCurStkSalesObj['issueQty'] = element.ReturnQty;
  //     updateCurStkSalesObj['storeId'] = this.accountService.currentUserValue.storeId,
  //     updateCurStkSalesObj['istkId'] = element.StkID;
  //     updateCurrStkSales.push(updateCurStkSalesObj);
  //   });

  //   let Update_SalesReturnQtySalesTblarray = [];
  //   this.dsIpSaleItemList.data.forEach((element) => {
  //     let Update_SalesReturnQtySalesTbl = {};
  //     Update_SalesReturnQtySalesTbl['salesDetId'] = element.SalesDetId;
  //     Update_SalesReturnQtySalesTbl['returnQty'] = element.ReturnQty;
  //     Update_SalesReturnQtySalesTblarray.push(Update_SalesReturnQtySalesTbl);
  //   });

  //   let Update_SalesRefundAmt_SalesHeader = {};
  //   Update_SalesRefundAmt_SalesHeader['salesReturnId'] = 0;

  //   let Cal_GSTAmount_SalesReturn = {};
  //   Cal_GSTAmount_SalesReturn['salesReturnId'] = 0;

  //   let Insert_ItemMovementReport_Cursor = {};
  //   Insert_ItemMovementReport_Cursor['id'] = 0;
  //   Insert_ItemMovementReport_Cursor['typeId'] = 2;

  //   let PaymentInsertobj = {};
  //   PaymentInsertobj['paymentId'] = 0
  //   PaymentInsertobj['billNo'] = this.selcteditemObj.SalesId || 0,
  //   PaymentInsertobj['paymentDate'] = formattedDate;
  //   PaymentInsertobj['paymentTime'] = formattedTime;
  //   PaymentInsertobj['cashPayAmount'] = this.IPSalesRetFooterform.get('FinalNetAmount').value || 0;
  //   PaymentInsertobj['chequePayAmount'] = 0,
  //   PaymentInsertobj['chequeNo'] = '0',
  //   PaymentInsertobj['bankName'] = '',
  //   PaymentInsertobj['chequeDate'] = '1900-01-01',
  //   PaymentInsertobj['cardPayAmount'] = 0,
  //   PaymentInsertobj['cardNo'] = '0',
  //   PaymentInsertobj['cardBankName'] = '',
  //   PaymentInsertobj['cardDate'] ='1900-01-01',
  //   PaymentInsertobj['advanceUsedAmount'] = 0;
  //   PaymentInsertobj['advanceId'] = 0;
  //   PaymentInsertobj['refundId'] = 0;
  //   PaymentInsertobj['transactionType'] = 5;
  //   PaymentInsertobj['remark'] = '',
  //   PaymentInsertobj['addBy'] = this.accountService.currentUserValue.userId,
  //   PaymentInsertobj['isCancelled'] = false;
  //   PaymentInsertobj['isCancelledBy'] = 0;
  //   PaymentInsertobj['isCancelledDate'] = '1900-01-01',
  //   PaymentInsertobj['opdipdType'] = 3;
  //   PaymentInsertobj['neftpayAmount'] = 0,
  //   PaymentInsertobj['neftno'] = '0',
  //   PaymentInsertobj['neftbankMaster'] = '',
  //   PaymentInsertobj['neftdate'] = '1900-01-01',
  //   PaymentInsertobj['payTmamount'] = 0,
  //   PaymentInsertobj['payTmtranNo'] = '0',
  //   PaymentInsertobj['payTmdate'] = '1900-01-01'

  //   if (this.ItemFormGroup.get('PaymentType').value == 'CashPay') {
  //     let submitData = {
  //       "salesReturn": salesReturnHeader,
  //       "salesReturnDetails": salesReturnDetailInsertCreditarr,
  //       "currentStock": updateCurrStkSales,
  //       "salesDetail": Update_SalesReturnQtySalesTblarray,
  //       "tSalesReturn": Update_SalesRefundAmt_SalesHeader,
  //       "tSalesReturns": Cal_GSTAmount_SalesReturn,
  //       "salesHeader": Insert_ItemMovementReport_Cursor,
  //       "payment": PaymentInsertobj
  //     };
  //     console.log(submitData);
  //     this._IpSalesRetService.InsertCashSalesReturn(submitData).subscribe(response => { 
  //         this.OnReset();  
  //     });
  //   }
  //   else {
  //     let submitData = {
  //       "salesReturn": salesReturnHeader,
  //       "salesReturnDetails": salesReturnDetailInsertCreditarr,
  //       "currentStock": updateCurrStkSales,
  //       "salesDetail": Update_SalesReturnQtySalesTblarray,
  //       "tSalesReturn": Update_SalesRefundAmt_SalesHeader,
  //       "tSalesReturns": Cal_GSTAmount_SalesReturn,
  //       "salesHeader": Insert_ItemMovementReport_Cursor
  //     };
  //     console.log(submitData);
  //     this._IpSalesRetService.InsertCreditSalesReturn(submitData).subscribe(response => { 
  //         this.OnReset(); 
  //     });
  //   }
  // }

  OnReset() {
    this.ItemFormGroup.reset();
    this.IPSalesRetFooterform.reset();
    this.dsIpSaleItemList.data = [];
    this.chargeslist = [];
    this.vPatientName = '';
    this.registerObj = '';
    this.selcteditemObj = '';
    this.ItemFormGroup.get('Op_ip_id').setValue('1');
    this.ItemFormGroup.get('PaymentType').setValue('CashPay');
    this.ItemFormGroup.markAllAsTouched();
    this.IPSalesRetFooterform.markAllAsTouched();
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
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
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
