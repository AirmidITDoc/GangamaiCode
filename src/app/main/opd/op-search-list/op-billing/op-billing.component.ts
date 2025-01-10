import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject, Subject, Subscription, of } from 'rxjs';
import { SearchInforObj, ChargesList } from '../opd-search-list/opd-search-list.component';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { OPSearhlistService } from '../op-searhlist.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { debounceTime, exhaustMap, filter, map, scan, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { IpPaymentInsert, OPAdvancePaymentComponent } from '../op-advance-payment/op-advance-payment.component';
import * as converter from 'number-to-words';
import { OpPaymentNewComponent } from '../op-payment-new/op-payment-new.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AdvanceDetailObj, RegInsert } from '../../appointment/appointment.component';
import { ToastrService } from 'ngx-toastr';
import { MatSelect } from '@angular/material/select';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ConfigService } from 'app/core/services/config.service';
import { OperatorComparer } from 'app/core/models/gridRequest';
import { BrowseOPDBill } from '../../new-oplist/new-oplist.component';
import { Regdetail } from '../../appointment-list/appointment-list.component';

type NewType = Observable<any[]>;
export class ILookup {
  BalanceQty: number;
  ItemID: number;
  ItemName: string;
  UOM: string;
  UnitofMeasurementId: number;
}

@Component({
  selector: 'app-op-billing',
  templateUrl: './op-billing.component.html',
  styleUrls: ['./op-billing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OPBillingComponent implements OnInit {
  searchFormGroup: FormGroup;
  registeredForm: FormGroup;
  BillingForm: FormGroup;
  myShowAdvanceForm: FormGroup;
  
  screenFromString = 'OP-billing';
  displayedColumns = [
    'IsCheck',
    'ServiceName',
    'Price',
    'Qty',
    'TotalAmt',
    'DiscPer',
    'DiscAmt',
    'NetAmount',
    'ChargeDoctorName',
    'ClassName',
    'ChargesAddedName',
    'action'
  ];
  displayedColumnspackage = [
    'IsCheck',
    'ServiceNamePackage',
    'ServiceName',
    'Qty',
    'Price',
    'TotalAmt',
    'DiscPer',
    'DiscAmt',
    'NetAmount',
    // 'action'
  ];
  displayedPrescriptionColumns = [
    'ServiceName',
    'Qty',
    'Price',
    'TotalAmt',
  ];

  billingServiceList = [];
  chargeslist: any = [];
  PacakgeList: any = [];
  interimArray: any = [];
  IPBillingInfor: any = [];
  filteredOptionsDoctor: Observable<string[]>;
  filteredOptionsCashCounter: Observable<string[]>;


  private nextPage$ = new Subject();
  registerObj = new BrowseOPDBill({});
  registerObj1 = new Regdetail({});
  selectedAdvanceObj: SearchInforObj;
  PatientHeaderObj: AdvanceDetailObj;
  dataSource = new MatTableDataSource<ChargesList>();
  dsPackageDet = new MatTableDataSource<ChargesList>();
  dsprescritionList = new MatTableDataSource<ChargesList>();

  isServiceSelected: boolean = false;
  isDoctor: boolean = false;
  isRegIdSelected: boolean = false;
  Consessionres: boolean = false;
  savebtn: boolean = true;
  BillDiscPer: boolean = false;
  saveclick: boolean = false;
  isExpanded: boolean = false;
  add: Boolean = false;
  isFilteredDateDisabled: boolean = true;
  noOptionFound: boolean = false;

  currentDate = new Date();
  CreditedtoDoctor: any;
  IsPathology: any;
  IsRadiology: any;
  isLoading: String = '';
  vIsPackage: any;
  vPrice = '0';
  vQty: any;
  vChargeTotalAmount: any = 0;
  vDoctor: any;
  SrvcName1: any = ""
  vCahrgeNetAmount: any;
  serviceId: any;
  VchargeDiscPer: any;
  vchargeDisAmount: any;
  DoctornewId: any;
  ChargesDoctorname: any;
  vClassName: any;
  filteredOptionsService: any;
  vFinalConcessionAmt:any;
  FinalNetAmt:any;
  vFinalconcessionDiscPer:any;
  vFinalTotalAmt:any;
  //new 
  autocompleteModeCashcounter: string = "CashCounter";
  autocompleteModedeptdoc: string = "ConDoctor";
  autocompleteModeService: string = "Service";
  autocompleteModeConcession: string = "Concession";

  getsupplierId
  ServiceList: any = [];
  constructor(
    private _fuseSidebarService: FuseSidebarService,
    private changeDetectorRefs: ChangeDetectorRef,
    public _oPSearhlistService: OPSearhlistService,
    public element: ElementRef<HTMLElement>,
    private _ActRoute: Router,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    private renderer: Renderer2,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    public _httpClient: HttpClient,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    public _WhatsAppEmailService: WhatsAppEmailService,
    public _ConfigService: ConfigService,
    private _loggedService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();

    this.createForm();

    this.BillingFooterForm();
    if (this.data) {
      console.log(this.data)
      setTimeout(() => {
        this._oPSearhlistService.getRegistraionById(this.data.regId).subscribe((response) => {
          this.registerObj1 = response;
          console.log(this.registerObj1)
        });
      }, 500);
    }


  }
  createSearchForm() {
    return this.formBuilder.group({
      RegId: [''],
      CashCounterID: ['']
    });
  }
  // Create registered form group
  createForm() {
    this.registeredForm = this.formBuilder.group({
      SrvcName: [''],
      price: [Validators.required],
      qty: [Validators.required, Validators.pattern("^[0-9]*$")],
      ChargeTotalAmount: [Validators.required],
      DoctorID: [0],
      ChargeDiscPer: [''],
      ChargeDiscAmount: [''],
      doctorId: [0],
      netAmount: [''],
    });
  }
  BillingFooterForm() {
    this.BillingForm = this.formBuilder.group({
      FinalTotalAmt: ['', Validators.required],
      FinalconcessionAmt: [''],
      FinalconcessionPer: [''],
      ConcessionId: [''],
      BillRemark: [''],
      FinalNetAmt: ['', Validators.required],
      PaymentType: ['CashPay'],
      CashCounterID: ['']
    });
  }


  dateTimeObj: any;

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  //Service list

  getServiceListCombobox() {
    debugger
    let sname = this.registeredForm.get('SrvcName').value + '%' || '%'
    var m_data = {

      "first": 0,
      "rows": 100,
      "sortField": "ServiceId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "ServiceName", "fieldValue": sname, "opType": "StartsWith" },
        { "fieldName": "TariffId", "fieldValue": "0", "opType": "Equals" },
        { "fieldName": "GroupId", "fieldValue": "0", "opType": "Equals" },
        { "fieldName": "Start", "fieldValue": "0", "opType": "Equals" },
        { "fieldName": "Length", "fieldValue": "30", "opType": "Equals" }
      ],
      "exportType": "JSON"
    }

    console.log(m_data)

    this._oPSearhlistService.getBillingServiceList(m_data).subscribe(data => {
      this.filteredOptionsService = data.data;
      this.ServiceList = data.data;

      if (this.filteredOptionsService.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });


  }
  calculateTotalAmtbyprice(){}
  getSelectedObj(obj) {
    if (this.dataSource.data.length > 0) {
      this.dataSource.data.forEach((element) => {
        if (obj.serviceId == element.serviceId) {

          Swal.fire('Selected Item already added in the list ');

          this.onClearServiceAddList();
        }

      });
    } else {
      console.log(obj)

      this.SrvcName1 = obj.serviceName;
      this.vPrice = obj.price;
      this.vQty = 1;
      this.vChargeTotalAmount = obj.price;
      this.vCahrgeNetAmount = obj.price;
      this.serviceId = obj.serviceId;
      this.IsPathology = obj.isPathology;
      this.IsRadiology = obj.isRadiology;
      this.vIsPackage = obj.IsPackage;
      this.CreditedtoDoctor = obj.creditedtoDoctor;
      if (this.CreditedtoDoctor == true) {
        this.isDoctor = true;
        this.registeredForm.get('DoctorID').reset();
        this.registeredForm.get('DoctorID').setValidators([Validators.required]);
        this.registeredForm.get('DoctorID').enable();

      } else {
        this.isDoctor = false;
        this.registeredForm.get('DoctorID').reset();
        this.registeredForm.get('DoctorID').clearValidators();
        this.registeredForm.get('DoctorID').updateValueAndValidity();
        this.registeredForm.get('DoctorID').disable();
      }
    }


  }



  getOptionText(option) {

    return option && option.serviceName ? option.serviceName : '';
  }

  
  //add service

  onAddCharges() {

    this.isLoading = 'save';
    this.dataSource.data = [];
    console.log(this.registeredForm.get('SrvcName').value)
    this.chargeslist.push(
      {
        ChargesId: 0,// this.serviceId,
        ServiceId: this.serviceId,
        ServiceName: this.SrvcName1,
        Price: this.vPrice || 0,
        Qty: this.vQty || 0,
        TotalAmt: this.vChargeTotalAmount || 0,
        DiscPer: this.VchargeDiscPer || 0,
        DiscAmt: this.vchargeDisAmount || 0,
        NetAmount: this.vCahrgeNetAmount || 0,
        ClassId: 1,//this.selectedAdvanceObj.ClassId || 0,
        DoctorId: this.DoctornewId,// (this.registeredForm.get("DoctorID").value.DoctorName).toString() || '',
        DoctorName: this.ChargesDoctorname,
        ChargesDate: this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
        IsPathology: this.IsPathology,
        IsRadiology: this.IsRadiology,
        IsPackage: this.vIsPackage,
        ClassName: this.vClassName,// this.selectedAdvanceObj.ClassName || '',
        ChargesAddedName: 1// this.accountService.currentUserValue.user.id || 1,

      });
    this.isLoading = '';
    this.dataSource.data = this.chargeslist;
    this.changeDetectorRefs.detectChanges();
    this.isDoctor = false;
    // this.Servicename.nativeElement.focus();
    this.add = false;
    this.savebtn = false;
    this.ChargesDoctorname = '';
    this.DoctornewId = 0;
    
    this.finaldiscAmt();
    this.getpackagedetList();
    this.onClearServiceAddList();

  }
  onClearServiceAddList() {
    this.registeredForm.get('SrvcName').reset();
    this.registeredForm.get('price').reset(0);
    this.registeredForm.get('qty').reset('1');
    this.registeredForm.get('ChargeTotalAmount').reset(0);
    this.registeredForm.get('DoctorID').reset(0);
    this.registeredForm.get('ChargeDiscPer').reset(0);
    this.registeredForm.get('ChargeDiscAmount').reset(0);
    this.registeredForm.get('netAmount').reset(0);
    this.registeredForm.get('DoctorID').reset('');
    this.registeredForm.reset();
  }
  vchargewisetotaldiscAmt: any = 0;
  finaldiscAmt() {
    
  }
  chkdelte: any = [];
  deleteTableRow(element) {

 
  }


  //package list 
  getpackagedetList() {

  }

  onsave() {
    if ((!this.dataSource.data.length)) {
      this.toastr.warning('Please add service in table', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    Swal.fire({
      title: 'Do you want to Generate the Bill',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Generate!"

    }).then((result) => {
      if (result.isConfirmed) {
        this.onSaveOPBill2();
      }
    })
  }



  SavePackageList: any = [];
  onSaveOPBill2() {
    debugger

    if ((!this.dataSource.data.length)) {
      this.toastr.warning('Please add service in table', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

  }


  saveCreditbill() {

  }




  onClose() {
    this._matDialog.closeAll();
    this.registeredForm.reset();
    this.searchFormGroup.reset();
    this.BillingForm.reset();
    this.dataSource.data = [];
    this.dsPackageDet.data = [];
    this.chargeslist = [];
    this.PacakgeList = [];
    this.advanceDataStored.storage = [];
    this.BillingForm.get('PaymentType').setValue('CashPay');

  }
  addData() {
    this.add = true;
    //   this.addbutton.nativeElement.focus();
  }

  onEnterservice(event): void {
 
    if (event.which === 13) {
      // this.price.nativeElement.focus();
    }
  }
  getPacakgeDetail(contact) {

  }
  getValidationMessages() {
    return {
      CashCounterID: [
        { name: "required", Message: "First Name is required" },

        { name: "pattern", Message: "only Number allowed." }
      ],
      price: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      qty: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      ChargeTotalAmount: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      DoctorId: [
        { name: "pattern", Message: "only Char allowed." }
      ],
      ChargeDiscPer: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      ChargeDiscAmount: [{ name: "pattern", Message: "only Number allowed." }],
      netAmount: [{ name: "pattern", Message: "only Number allowed." }],
      SrvcName: [{ name: "required", Message: "Service Name is required", }],
      ConcessionId: [{}]

    }
  }
  selectChangedeptdoc(event) { }

  selectChangeConcession(event) { }

  getDiscAmtSum(event){}
  getNetAmtSum(event){}
  calculatePersc(){}
  calChargeDiscAmt(){}
  onScroll(){}
}


export class Bill {
  BillNo: number;
  OPD_IPD_ID: number;
  TotalAmt: number;
  FinalconcessionAmt: number;
  NetPayableAmt: number;
  PaidAmt: number;
  BalanceAmt: number;
  BillDate: any;
  OPD_IPD_Type: number;
  AddedBy: number;
  TotalAdvanceAmount: number;
  BillTime: Date;
  ConcessionReasonId: number;
  IsSettled: boolean;
  IsPrinted: boolean;
  IsFree: boolean;
  CompanyId: number;
  TariffId: number;
  UnitId: number;
  InterimOrFinal: number;

  CompanyRefNo: any;
  ConcessionAuthorizationName: number;
  TaxPer: any;
  TaxAmount: any;
  DiscComments: String;
  CashCounterId: any;
  discComments: any;
  constructor(InsertBillUpdateBillNoObj) {
    {
      this.BillNo = InsertBillUpdateBillNoObj.BillNo || 0;
      this.OPD_IPD_ID = InsertBillUpdateBillNoObj.OPD_IPD_ID || 0;
      this.TotalAmt = InsertBillUpdateBillNoObj.TotalAmt || 0;
      this.FinalconcessionAmt = InsertBillUpdateBillNoObj.FinalconcessionAmt || 0;
      this.NetPayableAmt = InsertBillUpdateBillNoObj.NetPayableAmt || 0;
      this.PaidAmt = InsertBillUpdateBillNoObj.PaidAmt || 0;
      this.BalanceAmt = InsertBillUpdateBillNoObj.BalanceAmt || 0;
      this.BillDate = InsertBillUpdateBillNoObj.BillDate || '';
      this.OPD_IPD_Type = InsertBillUpdateBillNoObj.OPD_IPD_Type || 0;
      this.AddedBy = InsertBillUpdateBillNoObj.AddedBy || 0;
      this.TotalAdvanceAmount = InsertBillUpdateBillNoObj.TotalAdvanceAmount || 0;
      this.BillTime = InsertBillUpdateBillNoObj.BillTime || '';
      this.ConcessionReasonId = InsertBillUpdateBillNoObj.ConcessionReasonId || 0;
      this.IsSettled = InsertBillUpdateBillNoObj.IsSettled || 0;
      this.IsPrinted = InsertBillUpdateBillNoObj.IsPrinted || 0;
      this.IsFree = InsertBillUpdateBillNoObj.IsFree || 0;
      this.CompanyId = InsertBillUpdateBillNoObj.CompanyId || 0;
      this.TariffId = InsertBillUpdateBillNoObj.TariffId || 0;
      this.UnitId = InsertBillUpdateBillNoObj.UnitId || 0;
      this.InterimOrFinal = InsertBillUpdateBillNoObj.InterimOrFinal || 0;
      this.CompanyRefNo = InsertBillUpdateBillNoObj.CompanyRefNo || 0;
      this.ConcessionAuthorizationName = InsertBillUpdateBillNoObj.ConcessionAuthorizationName || 0;
      this.TaxPer = InsertBillUpdateBillNoObj.TaxPer || 0;
      this.TaxAmount = InsertBillUpdateBillNoObj.TaxAmount || 0;
      this.DiscComments = InsertBillUpdateBillNoObj.DiscComments || '';
      this.CashCounterId = InsertBillUpdateBillNoObj.CashCounterId || 0;
      this.discComments = InsertBillUpdateBillNoObj.discComments || 0;
    }
  }
}

export class BillDetails {
  BillNo: number;
  ChargesId: number;

  constructor(BillDetailsInsertObj) {
    {
      this.BillNo = BillDetailsInsertObj.BillNo || 0;
      this.ChargesId = BillDetailsInsertObj.ChargesId || 0;
      //this.BillDetailId=BillDetailsInsertObj.BillDetailId || 0;
    }
  }
}
export class Cal_DiscAmount {
  BillNo: number;

  constructor(Cal_DiscAmount_OPBillObj) {
    {
      this.BillNo = Cal_DiscAmount_OPBillObj.BillNo || 0;
    }
  }
}

export class PathologyReportHeader {

  PathDate: Date;
  PathTime: Date;
  OPD_IPD_Type: number;
  OPD_IPD_Id: number;
  PathTestID: number;
  AddedBy: number;
  ChargeID: number;
  IsCompleted: Boolean;
  IsPrinted: Boolean;
  IsSampleCollection: Boolean;
  TestType: Boolean;

  /**
   * Constructor
   *
   * @param PathologyReportHeaderObj
   */
  constructor(PathologyReportHeaderObj) {
    {
      this.PathDate = PathologyReportHeaderObj.PathDate || '';
      this.PathTime = PathologyReportHeaderObj.PathTime || '';
      this.OPD_IPD_Type = PathologyReportHeaderObj.OPD_IPD_Type || 0;
      this.OPD_IPD_Id = PathologyReportHeaderObj.OPD_IPD_Id || 0;
      this.PathTestID = PathologyReportHeaderObj.PathTestID || 0;
      this.AddedBy = PathologyReportHeaderObj.AddedBy || 0;
      this.ChargeID = PathologyReportHeaderObj.ChargeID || 0;
      this.IsCompleted = PathologyReportHeaderObj.IsCompleted || 0;
      this.IsPrinted = PathologyReportHeaderObj.IsPrinted || 0;
      this.IsSampleCollection = PathologyReportHeaderObj.IsSampleCollection || 0;
      this.TestType = PathologyReportHeaderObj.TestType || 0;

    }
  }
}

export class RadiologyReportHeader {

  RadDate: Date;
  RadTime: Date;
  OPD_IPD_Type: number;
  OPD_IPD_Id: number;
  RadTestID: number;
  AddedBy: number;
  IsCancelled: Boolean;
  ChargeID: number;
  IsCompleted: Boolean;
  IsPrinted: Boolean;
  TestType: Boolean;

  /**
   * Constructor
   *
   * @param RadiologyReportHeaderObj
   */
  constructor(RadiologyReportHeaderObj) {
    {
      this.RadDate = RadiologyReportHeaderObj.RadDate || '';
      this.RadTime = RadiologyReportHeaderObj.RadTime || '';
      this.OPD_IPD_Type = RadiologyReportHeaderObj.OPD_IPD_Type || 0;
      this.OPD_IPD_Id = RadiologyReportHeaderObj.OPD_IPD_Id || 1;
      this.RadTestID = RadiologyReportHeaderObj.RadTestID || 0;
      this.AddedBy = RadiologyReportHeaderObj.AddedBy || 0;
      this.ChargeID = RadiologyReportHeaderObj.ChargeID || 0;
      this.IsCompleted = RadiologyReportHeaderObj.IsCompleted || 0;
      this.IsPrinted = RadiologyReportHeaderObj.IsPrinted || 0;
      this.TestType = RadiologyReportHeaderObj.TestType || 0;

    }
  }
}

export class OPDoctorShareGroupAdmCharge {

  BillNo: number;

  /**
  * Constructor
  *
  * @param OPDoctorShareGroupAdmChargeObj
  */
  constructor(OPDoctorShareGroupAdmChargeObj) {
    {
      this.BillNo = OPDoctorShareGroupAdmChargeObj.BillNo || 0;
    }
  }
}


export class PaymentInsert {
  PaymentId: number;
  BillNo: number;
  ReceiptNo: String;
  PaymentDate: any;
  PaymentTime: any;
  CashPayAmount: number;
  ChequePayAmount: number;
  ChequeNo: String;
  BankName: String;
  ChequeDate: any;
  CardPayAmount: number;
  CardNo: String;
  CardBankName: String;
  CardDate: any;
  AdvanceUsedAmount: number;
  AdvanceId: number;
  RefundId: number;
  TransactionType: number;
  Remark: String;
  AddBy: number;
  IsCancelled: Boolean;
  IsCancelledBy: number;
  IsCancelledDate: any;
  CashCounterId: number;
  IsSelfORCompany: number;
  CompanyId: number;
  NEFTPayAmount: any;
  NEFTNo: String;
  NEFTBankMaster: String;
  NEFTDate: any;
  PayTMAmount: number;
  PayTMTranNo: String;
  PayTMDate: any;

  /**
  * Constructor
  *
  * @param PaymentInsertObj
  */
  constructor(PaymentInsertObj) {
    {
      this.PaymentId = PaymentInsertObj.PaymentId || 0;
      this.BillNo = PaymentInsertObj.BillNo || 0;
      this.ReceiptNo = PaymentInsertObj.ReceiptNo || 0;
      this.PaymentDate = PaymentInsertObj.PaymentDate || '';
      this.PaymentTime = PaymentInsertObj.PaymentTime || '';
      this.CashPayAmount = PaymentInsertObj.CashPayAmount || 0;
      this.ChequePayAmount = PaymentInsertObj.ChequePayAmount || 0;
      this.ChequeNo = PaymentInsertObj.ChequeNo || '';
      this.BankName = PaymentInsertObj.BankName || '';
      this.ChequeDate = PaymentInsertObj.ChequeDate || '';
      this.CardPayAmount = PaymentInsertObj.CardPayAmount || 0;
      this.CardNo = PaymentInsertObj.CardNo || 0;
      this.CardBankName = PaymentInsertObj.CardBankName || '';
      this.CardDate = PaymentInsertObj.CardDate || '';
      this.AdvanceUsedAmount = PaymentInsertObj.AdvanceUsedAmount || 0;
      this.AdvanceId = PaymentInsertObj.AdvanceId || 0;
      this.RefundId = PaymentInsertObj.RefundId || 0;
      this.TransactionType = PaymentInsertObj.TransactionType || 0;
      this.Remark = PaymentInsertObj.Remark || '';
      this.AddBy = PaymentInsertObj.AddBy || 0;
      this.IsCancelled = PaymentInsertObj.IsCancelled || false;
      this.IsCancelledBy = PaymentInsertObj.IsCancelledBy || 0;
      this.IsCancelledDate = PaymentInsertObj.IsCancelledDate || '';
      this.IsCancelledDate = PaymentInsertObj.IsCancelledDate || '';
      this.CashCounterId = PaymentInsertObj.CashCounterId || 0;
      this.IsSelfORCompany = PaymentInsertObj.IsSelfORCompany || 0;
      this.CompanyId = PaymentInsertObj.CompanyId || 0;
      this.NEFTPayAmount = PaymentInsertObj.NEFTPayAmount || 0;
      this.NEFTNo = PaymentInsertObj.NEFTNo || '';
      this.NEFTBankMaster = PaymentInsertObj.NEFTBankMaster || '';
      this.NEFTDate = PaymentInsertObj.NEFTDate || '';
      this.PayTMAmount = PaymentInsertObj.PayTMAmount || 0;
      this.PayTMTranNo = PaymentInsertObj.PayTMTranNo || '';
      this.PayTMDate = PaymentInsertObj.PayTMDate || '';
    }

  }
}


export class patientinfo {
  Date: Date;
  OPD_IPD_Id: number;
  NetPayAmount: number;

  constructor(patientinfo) {
    this.Date = patientinfo.Date || 0;
    this.OPD_IPD_Id = patientinfo.OPD_IPD_Id || 0;
    this.NetPayAmount = patientinfo.NetPayAmount || '';
  }
}


export class AddChargesInsert {


  ChargeID: number;
  ChargesDate: Date;
  OPD_IPD_Type: number;
  OPD_IPD_Id: number;
  ServiceId: any;
  Price: number;
  Qty: number;
  TotalAmt: String;
  ConcessionPercentage: String;
  ConcessionAmount: any;
  NetAmount: number;
  DoctorId: String;
  DocPercentage: String;
  DocAmt: any;
  HospitalAmt: number;
  IsGenerated: boolean;
  AddedBy: number;
  IsCancelled: boolean;
  IsCancelledBy: String;
  IsCancelledDate: number;
  CashCounterId: number;
  IsPathology: boolean;
  IsRadiology: boolean;
  IsPackage: boolean;
  PackageMainChargeID: any;
  IsSelfOrCompanyService: boolean;
  PackageId: String;
  ChargeTime: any;
  ClassId: number;

  /**
  * Constructor
  *
  * @param AddChargesInsert
  */
  constructor(AddChargesInsertObj) {
    {
      this.ChargeID = AddChargesInsertObj.ChargeID || 0;
      this.ChargesDate = AddChargesInsertObj.ChargesDate || 0;
      this.OPD_IPD_Type = AddChargesInsertObj.OPD_IPD_Type || 0;
      this.OPD_IPD_Id = AddChargesInsertObj.OPD_IPD_Id || '';
      this.ServiceId = AddChargesInsertObj.ServiceId || '';
      this.Price = AddChargesInsertObj.Price || 0;
      this.Qty = AddChargesInsertObj.Qty || 0;
      this.TotalAmt = AddChargesInsertObj.TotalAmt || '';
      this.ConcessionPercentage = AddChargesInsertObj.ConcessionPercentage || '';
      this.ConcessionAmount = AddChargesInsertObj.ConcessionAmount || '';
      this.NetAmount = AddChargesInsertObj.NetAmount || 0;
      this.DoctorId = AddChargesInsertObj.DoctorId || 0;
      this.DocPercentage = AddChargesInsertObj.DocPercentage || '';
      this.DocAmt = AddChargesInsertObj.DocAmt || '';
      this.HospitalAmt = AddChargesInsertObj.HospitalAmt || 0;
      this.IsGenerated = AddChargesInsertObj.IsGenerated || 0;
      this.AddedBy = AddChargesInsertObj.AddedBy || 0;
      this.IsCancelled = AddChargesInsertObj.IsCancelled || 0;
      this.IsCancelledBy = AddChargesInsertObj.IsCancelledBy || '';
      this.IsCancelledDate = AddChargesInsertObj.IsCancelledDate || 0;
      this.IsPathology = AddChargesInsertObj.IsPathology || false;
      this.IsRadiology = AddChargesInsertObj.IsRadiology || 0;
      this.IsPackage = AddChargesInsertObj.IsPackage || '';
      this.PackageMainChargeID = AddChargesInsertObj.PackageMainChargeID || '';
      this.IsSelfOrCompanyService = AddChargesInsertObj.IsSelfOrCompanyService || 0;
      this.PackageId = AddChargesInsertObj.PackageId || 0;
      this.ChargeTime = AddChargesInsertObj.ChargeTime || 0;
      this.ClassId = AddChargesInsertObj.ClassId || 0;

    }
  }
}

export class advanceHeader {
  AdvanceId: number;
  AdvanceAmount: number;
  Date: Date;
  RefId: number;
  OPD_IPD_Type: number;
  OPD_IPD_Id: number;
  AdvanceUsedAmount: number;
  BalanceAmount: number;
  AddedBy: number;
  IsCancelled: boolean;
  IsCancelledBy: number;
  IsCancelledDate: Date;

  constructor(advanceHeaderObj) {
    {
      this.AdvanceId = advanceHeaderObj.AdvanceId || 0;
      this.Date = advanceHeaderObj.Date || '';
      this.RefId = advanceHeaderObj.RefId || 0;
      this.OPD_IPD_Type = advanceHeaderObj.OPD_IPD_Type || 0;
      this.OPD_IPD_Id = advanceHeaderObj.OPD_IPD_Id || 0;
      this.AdvanceAmount = advanceHeaderObj.AdvanceAmount || 0;
      this.AdvanceUsedAmount = advanceHeaderObj.AdvanceUsedAmount || 0;
      this.BalanceAmount = advanceHeaderObj.BalanceAmount || 0;
      this.AddedBy = advanceHeaderObj.AddedBy || 0;
      this.IsCancelled = advanceHeaderObj.IsCancelled || false;
      this.IsCancelledBy = advanceHeaderObj.IsCancelledBy || 0;
      this.IsCancelledDate = advanceHeaderObj.IsCancelledDate || '';
    }
  }
}
export class Post {
  BillNo: any;

  constructor(Post) {
    {
      this.BillNo = Post.BillNo || 0;
    }
  }
}

