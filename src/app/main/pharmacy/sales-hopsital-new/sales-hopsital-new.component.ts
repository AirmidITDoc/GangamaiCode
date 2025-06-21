import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { parseInt } from 'lodash';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { RequestforlabtestService } from 'app/main/nursingstation/requestforlabtest/requestforlabtest.service';
import { MatDrawer } from '@angular/material/sidenav';
import { PaymentModeComponent } from 'app/main/shared/componets/payment-mode/payment-mode.component';
import { OnlinePaymentService } from 'app/main/shared/services/online-payment.service';
import { ToastrService } from 'ngx-toastr';
import { BrowsSalesBillService } from '../brows-sales-bill/brows-sales-bill.service';
import { PrescriptionComponent } from '../sales/prescription/prescription.component';
import { SalePopupComponent } from '../sales/sale-popup/sale-popup.component';
import { SubstitutesComponent } from '../sales/substitutes/substitutes.component';
import { SalesHospitalService } from './sales-hospital-new.service';
import { BalAvaListStore, DraftSale, IndentList, PatientType, Printsal, SalesBatchItemModel, SalesItemModel } from './types';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';

@Component({
  selector: 'app-sales-hospital',
  templateUrl: './sales-hopsital-new.component.html',
  styleUrls: ['./sales-hopsital-new.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SalesHospitalNewComponent implements OnInit {
  // Display Columns
  patientDisplayedColumns: string[] = ['UHID', 'PatientName', 'NetAmt', 'MobileNo', 'UserName'];
  displayedColumns = ['FromStoreId', 'IndentNo', 'IndentDate', 'FromStoreName', 'ToStoreName', 'Addedby', 'IsInchargeVerify', 'action'];
  displayedColumns1 = ['ItemName', 'Qty', 'IssQty', 'Bal'];
  selectedSaleDisplayedCol = ['ItemName', 'BatchNo', 'BatchExpDate', 'Qty', 'UnitMRP', 'GSTPer', 'GSTAmount', 'TotalMRP', 'DiscPer', 'DiscAmt', 'NetAmt', 'MarginAmt', 'buttons'];
  DraftAvbStkListDisplayedCol = ['StoreName', 'BalQty'];
  DraftSaleDisplayedCol = ['ExtMobileNo', 'buttons'];
  // View Children
  @ViewChild('qtyInputRef') qtyInputRef: ElementRef;
  @ViewChild('discAmount') discAmount: ElementRef;
  @ViewChild('ConseId') ConseId: ElementRef;
  @ViewChild('drawer') public drawer: MatDrawer;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('billTemplate2') billTemplate2: ElementRef;
  @ViewChild('discamt') discamt: ElementRef;
  @ViewChild('doctorname') doctorname: ElementRef;
  @ViewChild('mobileno') mobileno: ElementRef;
  @ViewChild('disper') disper: ElementRef;
  @ViewChild('discamount') discamount: ElementRef;
  @ViewChild('patientname') patientname: ElementRef;
  @ViewChild('address') address: ElementRef;
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('addbutton') addbutton: ElementRef;

  // Form Groups
  ItemSubform: FormGroup;

  // Data Sources
  dsIndentList = new MatTableDataSource<IndentList>();
  datasource = new MatTableDataSource<IndentList>();
  saleSelectedDatasource = new MatTableDataSource<IndentList>();
  tempDatasource = new MatTableDataSource<IndentList>();
  chargeslist = new MatTableDataSource<IndentList>();
  dsPatientList = new MatTableDataSource();
  dsDraftList = new MatTableDataSource<DraftSale>();
  dsBalAvaListStore = new MatTableDataSource<BalAvaListStore>();
  dsItemNameList1 = new MatTableDataSource<IndentList>();



  // Patient Related
  PatientType = PatientType;
  PatientName: any;
  RegID: any;
  MobileNo: any;
  DoctorName: any;
  vPatientType: any;
  Patienttype: any;
  vAdmissionID: any;
  RegId: any = '';
  IPMedID: any;
  OPDNo: any;
  IPDNo: any;
  // Item Related
  ItemName: any;
  ItemId: any;
  BalanceQty: any;
  Itemchargeslist: any = [];
  Itemchargeslist1: any = [];
  BalChkList: any = [];
  BatchNo: any;
  BatchExpDate: any;
  UnitMRP: any;
  Qty: any = 0;
  IssQty: any;
  Bal: any;
  StoreName: any;
  GSTPer: any;
  MRP: any;
  DiscPer: any = 0;
  DiscAmt: any = 0;
  FinalDiscPer: any = 0;
  FinalDiscAmt: any = 0;
  NetAmt: any = 0;
  TotalMRP: any = 0;
  FinalTotalAmt: any;
  FinalNetAmount: any = 0;
  FinalGSTAmt: any = 0;
  BalQty: any = 0;
  TotalBalQty: any = 0;
  ItemObj: IndentList;
  v_marginamt: any = 0;
  TotalMarginAmt: any = 0;

  // Payment Related
  balanceamt: number = 0;
  BalAmount: any = 0;
  v_PaidbyPatient: any = 0;
  v_PaidbacktoPatient: any = 0;
  roundoffAmt: any;
  TotalCreditAmt: any = 0;
  TotalAdvanceAmt: any = 0;
  TotalBalanceAmt: any = 0;
  netPayAmt: number = 0;
  isPaymentSuccess: boolean = false;
  nowDate: Date;
  PatientHeaderObj: any;
  data: any;

  // Store Related
  Store1List: any = [];
  StoreId: any;
  StockId: any;
  vStockId: any = 0;

  // Flags
  isItemIdSelected: boolean = false;
  paymethod: boolean = false;
  IsOnlineRefNo: boolean = false;
  ConShow: Boolean = false;
  add1: Boolean = false;
  isPatienttypeDisabled: boolean = true;
  chkdiscper: boolean = true;
  stockidflag: boolean = true;
  deleteflag: boolean = true;
  Creditflag: boolean = false;
  IsCreditflag: boolean = false;
  drafttable: boolean = false;
  IsLoading: boolean = false;
  showTable: boolean = false;
  Addflag: boolean = false;
  vBarcodeflag: boolean = false;
  Itemflag: boolean = false;
  opflag: Boolean = false;
  ipflag: Boolean = false;
  externalflag: Boolean = false;
  barcodeflag: boolean = false;
  add: Boolean = false;
  loadingarry: any = [];
  isLoading123 = false;
  chargeslist1: any = [];
  // Other Properties
  sIsLoading: string = '';
  isLoading = true;
  noOptionFound: boolean = false;
  labelPosition: 'before' | 'after' = 'after';
  msg: any;
  currentDate = new Date();
  DiscId: any;
  DraftID: any = 0;
  DiffNetRoundAmt: any = 0;
  Functionflag = 0;
  type = ' ';
  vPaymode = '';
  vBarcode: any;
  chargeslistBarcode: any = [];
  dateTimeObj: any;
  newDateTimeObj: any = {};
  GSalesNo: any = 0;
  LandedRate: any;
  LandedRateandedTotal: any = 0;
  PurchaseRate: any;
  PurTotAmt: any = 0;
  GSTAmount: any;
  CGSTAmt: any;
  SGSTAmt: any;
  IGSTAmt: any;
  VatPer: any;
  CgstPer: any;
  SgstPer: any;
  IgstPer: any;
  VatAmount: any;
  TotDiscAmt: any = 0;
  gstAmt: any;
  DiscOld: any = 0.0;
  QtyBalchk: any = 0;
  DraftQty: any = 0;
  RQty: any = 0;
  loadingRow: number | null = null;
  OP_IP_Id: any = 0;
  OP_IPType: any = 2;
  BalancechkFlag: any = 0;
  SalesDraftId: any = 0;
  OP_IP_Type: any;
  vSalesDetails: Printsal[] = [];
  vSalesIdList: any = [];
  screenFromString = 'payment-form';
  vextAddress: any = '';

  // Lists
  ConcessionReasonList: any = [];

  // Print Related
  reportPrintObj: Printsal;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  reportPrintObjList: Printsal[] = [];
  SalesIDObjList: Printsal[] = [];
  Filepath: any;
  reportItemPrintObj: Printsal;
  reportPrintObjItemList: Printsal[] = [];
  repeatItemList: IndentList[] = [];

  // Pharmacy Options
  vPharExtOpt: any;
  vPharOPOpt: any;
  vPharIPOpt: any;
  vSelectedOption: any = '0';
  vCondition: boolean = false;
  vConditionExt: boolean = false;
  vConditionIP: boolean = false;
  PharmaSalesForm: FormGroup;
  PharmaSalesDraftForm: FormGroup

  // Payment Details
  advanceData: any = {};
  billNo: any;
  chequeNo: any;
  chequeAmt: any;
  cashAmt: any;
  cardNo: any;
  BillDate: any;
  paytmTransNo: any;
  neftAmt: any;
  cardAmt: any;
  neftNo: any;
  paytmAmt: any;
  UTRNO: any;
  selectedItem: SalesBatchItemModel;
  selectedTableRowItem: IndentList;


  WardName: any;
  BedName: any;
  DoctorNamecheck: boolean = false;
  IPDNocheck: boolean = false;
  OPDNoCheck: boolean = false;
  autocompletestore: string = 'Store';

  Patientdetails: any;

  constructor(
    public _BrowsSalesBillService: BrowsSalesBillService,
    public _salesService: SalesHospitalService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private _loggedService: AuthenticationService,
    public _RequestforlabtestService: RequestforlabtestService,
    public toastr: ToastrService,
    private onlinePaymentService: OnlinePaymentService,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) {
    this.PatientHeaderObj = this.data;
  }

  ngOnInit(): void {
    this.getSalesFooterform();
    this.getStoredet();
    this.getDraftorderList();

    this.PharmaSalesForm = this.CreatePharmasalesform();
    this.PharmaSalesDraftForm = this.CreatePharmasalesDraftform();
    if (this.vPharExtOpt == true) {
      this.paymethod = false;
      this.vSelectedOption = '2';
    } else {
      this.vPharOPOpt = true;
    }
    if (this.vPharIPOpt == true) {
      if (this.vPharOPOpt == false) {
        this.paymethod = true;
        this.vSelectedOption = '1';
      }
    } else {
      this.vConditionIP = true;
    }
    if (this.vPharOPOpt == true) {
      if (this.vPharExtOpt == false) {
        this.paymethod = true;
        this.vSelectedOption = '2';
      }
    } else {
      this.vCondition = true;
    }
  }
    //sales footer form
  getSalesFooterform() {
    this.ItemSubform = this.formBuilder.group({
      FinalDiscPer: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      CashPay: ['CashPay'],
      referanceNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      PaidbyPatient: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      PaidbacktoPatient: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      roundoffAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opIpType: ['1', [this._FormvalidationserviceService.onlyNumberValidator()]],
      totalAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      vatAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      discAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      netAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      paidAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      balanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionReasonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      externalPatientName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      doctorName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      regId: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      extMobileNo: [0, [Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10), this._FormvalidationserviceService.onlyNumberValidator()]],
      extAddress: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
    });
  }
  //sales save form
  CreatePharmasalesform() {
    return this.formBuilder.group({
      //Sales header
      sales: this.formBuilder.group({
        salesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        date: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
        time: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
        opIpId: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        opIpType: [1, [this._FormvalidationserviceService.onlyNumberValidator, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        totalAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        vatAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        discAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        netAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        paidAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        balanceAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        concessionReasonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        concessionAuthorizationId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isSellted: [true],
        isPrint: [true],
        isFree: [true],
        unitId: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        externalPatientName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        doctorName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        storeId: [this._loggedService.currentUserValue.user.storeId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        isPrescription: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        addedBy: [this._loggedService.currentUserValue.userId],
        creditReason: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        creditReasonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        wardId: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        bedId: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        discperH: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isPurBill: [false],
        isBillCheck: [true],
        salesHeadName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        salesTypeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        regId: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        extMobileNo: ['', [Validators.minLength(10), Validators.maxLength(10), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        roundOff: [false],
        extAddress: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        tSalesDetails: this.formBuilder.array([]),
      }),
      //sales payment
      payment: this.formBuilder.group({
        paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        paymentDate: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        paymentTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        cashPayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        chequePayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        chequeNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        bankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        chequeDate: "1999-01-01",
        cardPayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        cardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        cardBankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        cardDate: "1999-01-01",
        advanceUsedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        transactionType: [4, [this._FormvalidationserviceService.onlyNumberValidator()]],
        remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        addBy: [this._loggedService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelled: false,
        isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelledDate: "1999-01-01",
        opdipdType: [3, [this._FormvalidationserviceService.onlyNumberValidator()]],
        neftpayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        neftbankMaster: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        neftdate: "1999-01-01",
        payTmamount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        payTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        payTmdate: "1999-01-01"
      }),
      //Sales current stock
      tCurrentStock: this.formBuilder.array([]),
      prescription: this.formBuilder.group({
        opipid: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isclosed: [true]
      }),
      //Sales draft
      salesDraft: this.formBuilder.group({
        dSalesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isclosed: [true]
      })
    })
  }
  CreateSalesDetailsform(item: any) {
    return this.formBuilder.group({
      salesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      itemId: [item?.ItemId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      batchNo: [item?.BatchNo, [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      batchExpDate: [this.datePipe.transform(item.BatchExpDate, 'yyyy-MM-dd'), [this._FormvalidationserviceService.validDateValidator()]],
      unitMrp: [item?.UnitMRP, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      qty: [item?.Qty, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      totalAmount: [item?.TotalMRP, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      vatPer: [item?.VatPer ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      vatAmount: [item?.VatAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      discPer: [item?.DiscPer ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      discAmount: [item?.DiscAmt ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      grossAmount: [item?.NetAmt, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      landedPrice: [item?.LandedRate, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      totalLandedAmount: [item?.LandedRateandedTotal, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      returnQty: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      purRateWf: [item?.PurchaseRate ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      purTotAmt: [item?.PurTotAmt ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      cgstper: [item?.CgstPer ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      cgstamt: [item?.sgstper ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      sgstper: [item?.SgstPer ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      sgstamt: [item?.SGSTAmt ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      igstper: [item?.IgstPer ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      igstamt: [item?.IGSTAmt ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      isPurRate: [true],
      stkId: [item?.StockId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      mrp: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      mrpTotal: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
    })
  }
  CreateCurrentStockForm(item: any) {
    return this.formBuilder.group({
      itemId: [item?.ItemId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      issueQty: [item?.Qty, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      iStkId: [item?.StockId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      storeID: [this._loggedService.currentUserValue.user.storeId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]]
    })
  }
  // Getters 
  get SalesDetailsAarry(): FormArray {
    return this.PharmaSalesForm.get('sales.tSalesDetails') as FormArray;
  }
  get CurrentStockArray(): FormArray {
    return this.PharmaSalesForm.get('tCurrentStock') as FormArray;
  }
  // Getters 
  get SalesDraftDetailsAarry(): FormArray {
    return this.PharmaSalesDraftForm.get('salesDraftDet') as FormArray;
  }
  //sales draft save form
  CreatePharmasalesDraftform() {
    return this.formBuilder.group({
      //Sales Draft header
      salesDraft: this.formBuilder.group({
        dsalesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        date: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
        time: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
        opIpId: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        opIpType: [1, [this._FormvalidationserviceService.onlyNumberValidator, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        totalAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        vatAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        discAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        netAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        paidAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        balanceAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        concessionReasonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        concessionAuthorizationId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isSellted: [true],
        isPrint: [true],
        unitId: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        addedBy: [this._loggedService.currentUserValue.userId],
        externalPatientName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        doctorName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        storeId: [this._loggedService.currentUserValue.user.storeId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        creditReason: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        creditReasonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isClosed: [false],
        isPrescription: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        wardId: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        bedId: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        extMobileNo: ['', [Validators.minLength(10), Validators.maxLength(10), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        extAddress: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      }),
      //Sales draft details
      salesDraftDet: this.formBuilder.array([]),
    })
  }
  CreateDraftDetails(item: any) {
    return this.formBuilder.group({
      dsalesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      itemId: [item?.ItemId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      batchNo: [item?.BatchNo, [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      batchExpDate: [this.datePipe.transform(item.BatchExpDate, 'yyyy-MM-dd'), [this._FormvalidationserviceService.validDateValidator()]],
      unitMrp: [item?.UnitMRP, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      qty: [item?.Qty, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      totalAmount: [item?.TotalMRP, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      vatPer: [item?.VatPer ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      vatAmount: [item?.VatAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      discPer: [item?.DiscPer ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      discAmount: [item?.DiscAmt ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      grossAmount: [item?.NetAmt, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      landedPrice: [item?.LandedRate, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      totalLandedAmount: [item?.LandedRateandedTotal, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      purRateWf: [item?.PurchaseRate ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      purTotAmt: [item?.PurTotAmt ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]]
    })
  }
  onChangePatientType(event) {
    if (event.value == '0') {
      this.OP_IPType = 0;
      this.RegId = '';
      this.paymethod = true;
      this.ItemSubform.get('extMobileNo').clearValidators();
      this.ItemSubform.get('externalPatientName').clearValidators();
      this.ItemSubform.get('extMobileNo').updateValueAndValidity();
      this.ItemSubform.get('externalPatientName').updateValueAndValidity();
      this.ItemSubform.get('regId').setValue('');
      this.saleSelectedDatasource.data = [];
    } else if (event.value == '1') {
      this.OP_IPType = 1;
      this.RegId = '';
      this.paymethod = true;
      this.ItemSubform.get('extMobileNo').clearValidators();
      this.ItemSubform.get('externalPatientName').clearValidators();
      this.ItemSubform.get('extMobileNo').updateValueAndValidity();
      this.ItemSubform.get('externalPatientName').updateValueAndValidity();
      this.ItemSubform.get('regId').setValue('');
      this.saleSelectedDatasource.data = [];
    } else {
      this.ItemSubform.get('extMobileNo').reset();
      this.ItemSubform.get('extMobileNo').setValidators([Validators.required]);
      this.ItemSubform.get('extMobileNo').enable();
      this.ItemSubform.get('externalPatientName').reset();
      this.ItemSubform.get('externalPatientName').setValidators([Validators.required]);
      this.ItemSubform.get('externalPatientName').enable();
      this.ItemSubform.get('regId').setValue('');
      this.ItemSubform.updateValueAndValidity();
      this.saleSelectedDatasource.data = [];
      this.paymethod = false;
      this.OP_IPType = 2;
    }
  }
  getSelectedObjRegIP(obj) {
    console.log(obj);
    let IsDischarged = 0;
    IsDischarged = obj.isDischarged;
    if (IsDischarged == 1) {
      Swal.fire('Selected Patient is already discharged');
      this.RegId = '';
    } else {
      console.log(obj);
      this.Patientdetails = obj;
      this.DoctorNamecheck = true;
      this.IPDNocheck = true;
      this.OPDNoCheck = false;
      this.PatientName = obj.firstName + ' ' + obj.lastName;
      this.RegId = obj.regID;
      this.OP_IP_Id = obj.admissionID;
      this.IPDNo = obj.ipdNo;
      this.DoctorName = obj.doctorName;
    }
    // this.getBillSummary(); 
  }
  getSelectedObjOP(obj) {
    console.log(obj);
    this.Patientdetails = obj;
    this.OPDNoCheck = true;
    this.DoctorNamecheck = false;
    this.IPDNocheck = false;
    this.PatientName = obj.firstName + ' ' + obj.lastName;
    this.RegId = obj.regID;
    this.OP_IP_Id = obj.VisitId;
    this.OPDNo = obj.OPDNo;
    this.DoctorName = obj.doctorName;
    //this.getBillSummary(); 
  }
  onPatientChange(event: any): void {
    console.log(event);
  }
  onItemChange(event: SalesItemModel): void {
    this.ItemId = event.itemId;
    this.getBatch(event.itemId, event.storeId);
  }
  // NOTE: If `isEditable` true then it means this popup will open for table row data 
  getBatch(itemId: number, storeId: number, isEditable = false) {
    const dialogRef = this._matDialog.open(SalePopupComponent, {
      maxWidth: '800px',
      minWidth: '800px',
      width: '800px',
      height: '380px',
      disableClose: true,
      data: {
        ItemId: itemId,
        StoreId: storeId,
      },
    });
    dialogRef.afterClosed().subscribe((result1) => {
      let isEscaped = result1.vEscflag;
      if (isEscaped && !isEditable) {
        this._salesService.ItemSearchGroup.get('ItemId').setValue('a');
        return;
      }
      let result = result1.selectedData as SalesBatchItemModel;
      const isAlreadyExists = this.Itemchargeslist.find((i) => i.StockId === result.stockId && i.ItemId === result.itemId);
      if (isAlreadyExists) {
        this.toastr.warning('Selected Item already added in the list', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        if (!isEditable) {
          const ItemIdElement = document.querySelector(`[name='ItemId']`) as HTMLElement;
          if (ItemIdElement) {
            ItemIdElement.focus();
          }
          this.ItemFormreset();
        }
        return;
      }
      const QtyElement = this.getElementByName(isEditable ? 'tableQty' : 'Qty') as HTMLElement;
      if (QtyElement) {
        QtyElement.focus();
      }

      this.selectedItem = result;
      if (isEditable) {
        // If it is table row then update new values
        const updatedItem = {
          ItemName: result.itemName,
          BatchNo: result.batchNo,
          BatchExpDate: this.datePipe.transform(result.batchExpDate, 'MM-dd-yyyy'),
          GSTPer: result.cgstPer + result.sgstPer + result.igstPer,
          UnitMRP: result.unitMRP,
          CgstPer: result.cgstPer,
          SgstPer: result.sgstPer,
          IgstPer: result.igstPer,
          StockId: result.stockId,
          LandedRate: result.landedRate,
          PurchaseRate: result.purchaseRate,
        } as IndentList;

        Object.assign(this.selectedTableRowItem, updatedItem);
        this.calculateCellNetAmount(this.selectedTableRowItem);
        this.getCellCalculation(this.selectedTableRowItem);
        this.selectedTableRowItem = null;
        return;
      }
      console.log(this.selectedItem)
      this.ItemAddForm = this.createItemAddTable()
      this._salesService.ItemSearchGroup.patchValue({
        BatchNo: result.batchNo,
        BatchExpDate: this.datePipe.transform(result.batchExpDate, 'yyyy-MM-dd'),
        BalanceQty: result.balanceQty,
        Qty: 0,
        DiscAmt: 0,
        GSTPer: result.vatPercentage,
        MRP: result.unitMRP,
      })
    });
  }
  calculateTotalAmt() {
    const formvalues = this._salesService.ItemSearchGroup.value;
    let qty = +formvalues.Qty;
    if (qty > formvalues.BalanceQty) {
      Swal.fire({
        icon: "warning",
        title: "Enter Qty less than Balance Qty",
        showConfirmButton: false,
        timer: 2000
      });
      this.ItemFormreset();
    }
    if (qty && formvalues.MRP) {
      let TotalMRP = (qty * formvalues.MRP).toFixed(2);
      let LandedRateandedTotal = (qty * this.selectedItem?.landedRate).toFixed(2);
      let marginamt = (parseFloat(TotalMRP) - parseFloat(LandedRateandedTotal)).toFixed(2);
      let PurTotAmt = (qty * this.selectedItem?.purchaseRate).toFixed(2);
      let GSTAmount = (((parseFloat(TotalMRP) * formvalues.GSTPer) / 100) * qty).toFixed(2);
      let CGSTAmt = (((parseFloat(TotalMRP) * this.selectedItem?.cgstPer) / 100) * qty).toFixed(2);
      let SGSTAmt = (((parseFloat(TotalMRP) * this.selectedItem?.sgstPer) / 100) * qty).toFixed(2);
      let IGSTAmt = (((parseFloat(TotalMRP) * this.selectedItem?.igstPer) / 100) * qty).toFixed(2);

      this._salesService.ItemSearchGroup.patchValue({
        TotalMrp: TotalMRP,
        NetAmt: TotalMRP,
        MarginAmt: marginamt,
        GSTAmount: GSTAmount,
        LandedRateandedTotal: LandedRateandedTotal,
        CGSTAmt: CGSTAmt,
        SGSTAmt: SGSTAmt,
        IGSTAmt: IGSTAmt,
        PurTotAmt: PurTotAmt,
      })
    }
  }
  public discperCal(): void {
    const formValue = this._salesService.ItemSearchGroup.value;
    const discPer = Number(formValue.DiscPer);

    if (discPer < 0 || discPer > 100) {
      this.toastr.error('Enter discount between 0 - 100', 'Error !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this.chkdiscper = false;
      this._salesService.ItemSearchGroup.patchValue({
        DiscAmt: 0,
        DiscPer: 0,
      });
      return;
    }
    if (formValue.TotalMrp) {
      // Calculate discount amount from percentage
      let DiscAmt = ((formValue.TotalMrp * discPer) / 100).toFixed(2);
      this.chkdiscper = true;
      this._salesService.ItemSearchGroup.patchValue({
        DiscAmt: DiscAmt,
      });
      this.calculateNetAmount();
    }
  }
  private calculateNetAmount(): void {
    const formValue = this._salesService.ItemSearchGroup.value;
    if (formValue.TotalMrp) {
      let NetAmt = (formValue.TotalMrp - (formValue.DiscAmt || 0)).toFixed(2);
      this._salesService.ItemSearchGroup.patchValue({
        NetAmt: NetAmt,
      });
    }
  }
  public CaldiscAmount(): void {
    const formValue = this._salesService.ItemSearchGroup.value;
    const discAmt = Number(formValue.DiscAmt);

    if (discAmt < 0 || discAmt > Number(formValue.TotalMrp)) {
      this.toastr.error('Discount amount should less then Total MRP', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
      this._salesService.ItemSearchGroup.patchValue({
        DiscAmt: 0,
        DiscPer: 0,
      });
      return;
    }
    if (formValue.TotalMrp && discAmt) {
      // Calculate discount percentage from amount
      let DiscPer = ((formValue.DiscAmt / formValue.TotalMrp) * 100).toFixed(2);
      this._salesService.ItemSearchGroup.patchValue({
        DiscPer: DiscPer,
      });
      this.calculateNetAmount();
    }
  }  
  //Add Item list
  ItemAddForm: FormGroup;
  createItemAddTable() {
    return this.formBuilder.group({
      ItemId: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ItemName: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      BatchNo: [this.selectedItem?.batchNo, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      BatchExpDate: [this.datePipe.transform(this.selectedItem?.batchExpDate, 'yyyy-MM-dd'), [this._FormvalidationserviceService.validDateValidator()]],
      Qty: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      UnitMRP: [this.selectedItem?.unitMRP, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      GSTPer: [(this.selectedItem?.cgstPer + this.selectedItem?.sgstPer), [this._FormvalidationserviceService.onlyNumberValidator()]],
      GSTAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      TotalMRP: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      DiscPer: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      DiscAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      NetAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      RoundNetAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      StockId: [this.selectedItem?.stockId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      VatPer: [(this.selectedItem?.cgstPer + this.selectedItem?.sgstPer), [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      VatAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      LandedRate: [this.selectedItem?.landedRate, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      LandedRateandedTotal: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      CgstPer: [this.selectedItem?.cgstPer, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      CGSTAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      SgstPer: [this.selectedItem?.sgstPer, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      SGSTAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      IgstPer: [this.selectedItem?.igstPer, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      IGSTAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      PurchaseRate: [this.selectedItem?.purchaseRate, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      PurTotAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      MarginAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      BalanceQty: [this.selectedItem?.balanceQty, [this._FormvalidationserviceService.onlyNumberValidator()]],
      SalesDraftId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      StoreId: [this.selectedItem?.storeId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    })
  } 
  OnAddItem() {
    debugger;
    if (this.saleSelectedDatasource.data.length > 0) {
      this.saleSelectedDatasource.data.forEach((element) => {
        if (element.StockId == this.StockId) {
          this.toastr.warning('Selected Item already added in the list', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          this.ItemFormreset();
          return;
        }
      });
    }
    if (this.vBarcode == 0) {
      if (this.ItemId == 0 || this.Qty == null || this.MRP == '' || this.TotalMRP == 0) {
        this.toastr.warning('Please select Item Detail', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    const formValue = this._salesService.ItemSearchGroup.value;
    this.ItemAddForm.patchValue({
      ItemId: formValue.ItemId.itemId,
      ItemName: formValue.ItemId.itemName,
      Qty: formValue.Qty,
      UnitMRP: formValue.MRP,
      GSTAmount: formValue.GSTAmount,
      TotalMRP: formValue.TotalMrp,
      DiscPer: formValue.DiscPer,
      DiscAmt: formValue.DiscAmt,
      NetAmt: formValue.NetAmt,
      GSTPer: formValue.GSTPer,
      VatPer: formValue.GSTPer,
      RoundNetAmt: Math.round(formValue.NetAmt),
      VatAmount: formValue.GSTAmount,
      LandedRateandedTotal: formValue.LandedRateandedTotal,
      CGSTAmt: formValue.CGSTAmt,
      SGSTAmt: formValue.SGSTAmt,
      IGSTAmt: formValue.IGSTAmt,
      PurTotAmt: formValue.PurTotAmt,
      MarginAmt: formValue.MarginAmt,
    })
    console.log(this.ItemAddForm.value)
    if (!this.vBarcodeflag) {
      if (this.ItemAddForm.valid) {
        this.Itemchargeslist.push(this.ItemAddForm.value)
        this.saleSelectedDatasource.data = this.Itemchargeslist;
      } else {
        let invalidFields = [];
        if (this.ItemAddForm.invalid) {
          for (const controlName in this.ItemAddForm.controls) {
            if (this.ItemAddForm.controls[controlName].invalid) {
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
      }
      this.add = false;
      this.ItemFormreset();
      this.getUpdateNetAmtSum(this.saleSelectedDatasource.data)
    }
  }
  ItemFormreset() {
    this._salesService.ItemSearchGroup.patchValue({
      ItemId: ['a'],
      ItemName: '',
      BatchNo: '',
      BatchExpDate: '01/01/1900',
      BalanceQty: '',
      Qty: [1],
      GSTPer: '',
      MRP: '',
      TotalMrp: '',
      DiscAmt: ' ',
      NetAmt: '',
      DiscPer: '',
      MarginAmt: '0',
      GSTAmount: '0',
      LandedRateandedTotal: '0',
      CGSTAmt: '0',
      SGSTAmt: '0',
      IGSTAmt: '0',
      PurTotAmt: '0',
    })
    this._salesService.ItemSearchGroup.get('ItemId').reset('a');
    this.dsBalAvaListStore.data = [];

  }
  Formreset() {
    this.FinalTotalAmt = 0;
    this.FinalDiscPer = 0;
    this.FinalDiscAmt = 0;
    this.BalAmount = 0;
    this.FinalGSTAmt = 0;
    this.FinalNetAmount = 0;
    this.ItemSubform.reset();
    this.RegId = '';
    this.PatientName = '';
    this.DoctorName = '';
    this.ItemSubform.get('opIpType').setValue('2');
    this.ItemSubform.get('CashPay').setValue('CashPay');
    this.IsOnlineRefNo = false;
    this.ItemSubform.get('referanceNo').reset('');
    this.ItemSubform.get('extMobileNo').reset('');
    this.ItemSubform.get('externalPatientName').reset('');
    this.ItemSubform.get('doctorName').reset('');
    this.ConShow = false;
    this.ItemSubform.get('concessionReasonId').clearValidators();
    this.ItemSubform.get('concessionReasonId').updateValueAndValidity();
    this.ItemSubform.get('concessionReasonId').disable();
    this.saleSelectedDatasource.data = [];
    this.getDraftorderList();
    this.TotalAdvanceAmt = 0;
    this.TotalBalanceAmt = 0;
    this.TotalCreditAmt = 0;
  }
  deleteTableRow(event, element) {
    let index = this.Itemchargeslist.indexOf(element);
    if (index >= 0) {
      this.Itemchargeslist.splice(index, 1);
      this.saleSelectedDatasource.data = [];
      this.saleSelectedDatasource.data = this.Itemchargeslist;
    }
    Swal.fire('Success !', 'ItemList Row Deleted Successfully', 'success');
    this.getUpdateNetAmtSum(this.saleSelectedDatasource.data)
  }
    getUpdateNetAmtSum(data) {
      const itemData = data
    let FinalNetAmt = itemData.reduce((sum, { NetAmt }) => (sum += +(NetAmt || 0)), 0).toFixed(2);
    let FinalTotalAmt = itemData.reduce((sum, { TotalMRP }) => (sum += +(TotalMRP || 0)), 0).toFixed(2);
    let FinalDiscAmt = itemData.reduce((sum, { DiscAmt }) => (sum += +(DiscAmt || 0)), 0).toFixed(2);
    let FinalGSTAmt = itemData.reduce((sum, { GSTAmount }) => (sum += +(GSTAmount || 0)), 0).toFixed(2);
    let roundoffAmt = Math.round(FinalNetAmt);
    this.ItemSubform.patchValue({
      roundoffAmt: roundoffAmt,
      totalAmount: FinalTotalAmt,
      vatAmount: FinalGSTAmt,
      discAmount: FinalDiscAmt,
      netAmount: FinalNetAmt,
    })
  }  
  getStoredet() {
    this._salesService.getstoreDetails(this.autocompletestore).subscribe((data) => {
      const storename = data;
      this.StoreName = storename[1].text;
      console.log(this.StoreName);
    });
  }
  getFinalDiscperAmt() {
    const formValues = this.ItemSubform.value;
    let Disc = formValues.FinalDiscPer || 0;
    let DiscAmt = formValues.discAmount || 0;
    let NetAmount = formValues.netAmount;
    let FinalDiscAmt = '';
    if (Disc > 0 || Disc < 100) {
      this.ConShow = true;
      FinalDiscAmt = ((formValues.totalAmount * Disc) / 100).toFixed(2);
      NetAmount = (formValues.totalAmount - parseFloat(FinalDiscAmt)).toFixed(2);
      this.ItemSubform.get('concessionReasonId').reset();
      this.ItemSubform.get('concessionReasonId').setValidators([Validators.required]);
      this.ItemSubform.get('concessionReasonId').enable();
      this.ItemSubform.updateValueAndValidity();
    } else {
      this.ConShow = false;
      this.ItemSubform.get('concessionReasonId').reset();
      this.ItemSubform.get('concessionReasonId').clearValidators();
      this.ItemSubform.get('concessionReasonId').updateValueAndValidity();
    }
    this.ItemSubform.patchValue({
      discAmount: FinalDiscAmt,
      netAmount: NetAmount,
    })
  }
  getFinalDiscAmount() {
    const formValues = this.ItemSubform.value;
    let totDiscAmt = formValues.discAmount || 0;
    let NetAmount = formValues.netAmount;
    if (totDiscAmt > 0) {
      NetAmount = (formValues.netAmount - totDiscAmt).toFixed(2);
      this.ConShow = true;
      this.ItemSubform.get('concessionReasonId').reset();
      this.ItemSubform.get('concessionReasonId').setValidators([Validators.required]);
      this.ItemSubform.get('concessionReasonId').enable();
    } else {
      this.ConShow = false;
      this.ItemSubform.get('concessionReasonId').reset();
      this.ItemSubform.get('concessionReasonId').clearValidators();
      this.ItemSubform.get('concessionReasonId').updateValueAndValidity();
      //this.ConseId.nativeElement.focus();
    }
    this.ItemSubform.patchValue({
      netAmount: NetAmount,
    })

  }
  onSave(event) {
    const formValue = this.ItemSubform.value
    if (!this.isValidForm()) {
      Swal.fire('Please enter valid table data.');
      return;
    }
    if (this.ItemSubform.get('opIpType').value == '2') {
      if (this.PatientName == '' || this.MobileNo == '' || this.DoctorName == '') {
        this.toastr.warning('Please select Customer Detail', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    debugger

    this.PharmaSalesForm.get('sales.date').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
    this.PharmaSalesForm.get('sales.time').setValue(this.datePipe.transform(new Date(), 'hh:mm'))
    this.PharmaSalesForm.get('sales.opIpType').setValue(formValue.opIpType)
    this.PharmaSalesForm.get('sales.totalAmount').setValue(Number(Math.round(formValue.totalAmount)))
    this.PharmaSalesForm.get('sales.vatAmount').setValue(Number(Math.round(formValue.vatAmount)))
    this.PharmaSalesForm.get('sales.discAmount').setValue(Number(Math.round(formValue.discAmount)))
    this.PharmaSalesForm.get('sales.netAmount').setValue(Number(Math.round(formValue.netAmount)))
    this.PharmaSalesForm.get('sales.roundOff').setValue(Number(Math.round(formValue.netAmount)))
    this.PharmaSalesForm.get('sales.regId').setValue(this.Patientdetails?.regID)
    this.PharmaSalesForm.get('sales.concessionReasonId').setValue(formValue.concessionReasonId)
    this.PharmaSalesForm.get('sales.opIpId').setValue(this.Patientdetails?.admissionID)
    this.PharmaSalesForm.get('sales.unitId').setValue(this.Patientdetails?.hospitalID)
    this.PharmaSalesForm.get('sales.wardId').setValue(this.Patientdetails?.wardId)
    this.PharmaSalesForm.get('sales.bedId').setValue(this.Patientdetails?.bedId)


    if (formValue.opIpType == 2) {
      this.PharmaSalesForm.get('sales.externalPatientName').setValue(formValue.externalPatientName)
      this.PharmaSalesForm.get('sales.doctorName').setValue(formValue.doctorName)
      this.PharmaSalesForm.get('sales.extAddress').setValue(formValue.extAddress)
      this.PharmaSalesForm.get('sales.extMobileNo').setValue(formValue.extMobileNo)
    }

    if (this.PharmaSalesForm.valid) {
      this.SalesDetailsAarry.clear();
      this.CurrentStockArray.clear()
      this.saleSelectedDatasource.data.forEach((element) => {
        this.SalesDetailsAarry.push(this.CreateSalesDetailsform(element))
        this.CurrentStockArray.push(this.CreateCurrentStockForm(element))
      });
      console.log(this.PharmaSalesForm.value)

      if (this.ItemSubform.get('CashPay').value == 'CashPay') {
        this.PharmaSalesForm.get('sales.paidAmount').setValue(Number(Math.round(formValue.netAmount)))
        this.PharmaSalesForm.get('sales.balanceAmount').setValue(0)
        this.PharmaSalesForm.get('payment.paymentDate').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
        this.PharmaSalesForm.get('payment.paymentTime').setValue(this.datePipe.transform(new Date(), 'hh:mm'))
        this.PharmaSalesForm.get('payment.cashPayAmount').setValue(Number(Math.round(formValue.netAmount)))
        console.log(this.PharmaSalesForm.value)
        this._salesService.InsertCashSales(this.PharmaSalesForm.value).subscribe((response) => {
          this.onClose()
        });
      } else if (this.ItemSubform.get('CashPay').value == 'Credit') {
        this.PharmaSalesForm.get('payment.paymentDate').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
        this.PharmaSalesForm.get('payment.paymentTime').setValue(this.datePipe.transform(new Date(), 'hh:mm'))
        this.PharmaSalesForm.get('sales.paidAmount').setValue(0)
        this.PharmaSalesForm.get('sales.balanceAmount').setValue(Number(Math.round(formValue.netAmount)))
        console.log(this.PharmaSalesForm.value)
        this._salesService.InsertCreditSales(this.PharmaSalesForm.value).subscribe((response) => {
          this.onClose()
        });
      } else if (this.ItemSubform.get('CashPay').value == 'PayOption') {
        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
          PatientHeaderObj['PatientName'] = this.PatientName;
        PatientHeaderObj['RegNo'] = this.Patientdetails.regNo;
        PatientHeaderObj['DoctorName'] = this.Patientdetails.doctorName;
        if (formValue.opIpType == '1') {
          PatientHeaderObj['OPD_IPD_Id'] = this.Patientdetails.ipdNo;
        } else {
          PatientHeaderObj['OPD_IPD_Id'] = this.Patientdetails.ipdNo;
        }
        PatientHeaderObj['Age'] = this.Patientdetails.age;
        PatientHeaderObj['NetPayAmount'] = this.ItemSubform.get('roundoffAmt').value;
        const dialogRef = this._matDialog.open(OpPaymentComponent,
          {
            maxWidth: "80vw",
            height: '700px',
            width: '80%',
            data: {
              vPatientHeaderObj: PatientHeaderObj,
              FromName: "Phar-SalesPay",
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          if (result && result.IsSubmitFlag == true) {
            this.PharmaSalesForm.get('payment').setValue(result.submitDataPay.ipPaymentInsert)
            console.log(this.PharmaSalesForm.value)
            this._salesService.InsertCashSales(this.PharmaSalesForm.value).subscribe(response => {
              this.onClose()
            });
          }
        });
      }
    } else {
      let invalidFields = [];
      if (this.PharmaSalesForm.invalid) {
        for (const controlName in this.PharmaSalesForm.controls) {
          const control = this.PharmaSalesForm.get(controlName);
          if (control instanceof FormGroup || control instanceof FormArray) {
            for (const nestedKey in control.controls) {
              if (control.get(nestedKey)?.invalid) {
                invalidFields.push(`Sales Data : ${controlName}.${nestedKey}`);
              }
            }
          } else if (control?.invalid) {
            invalidFields.push(`Sales From: ${controlName}`);
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
    this.getDraftorderList();
    this.PatientName = '';
    this.DoctorName = '';

  }
  onClose() {
    this.Itemchargeslist = [];
    this.ItemFormreset();
    this.ItemSubform.reset();
    this.Formreset();
    this.PatientName = '';
    this.MobileNo = '';
    this.saleSelectedDatasource.data = [];
    this.ItemSubform.get('FinalDiscPer').enable();
  }

 ///////////////// //Darft part ---------------------------------------------------------------------------------------////////////////////////////
  getDraftorderList() {
    this.chargeslist1 = [];
    this.dsDraftList.data = [];
    let currentDate = new Date();
    var m = {
      FromDate: this.datePipe.transform(currentDate, 'MM/dd/yyyy') || '01/01/1900',
      ToDate: this.datePipe.transform(currentDate, 'MM/dd/yyyy') || '01/01/1900',
    };
    // this._salesService.getDraftList(m).subscribe(
    //   (data) => {
    //     this.chargeslist1 = data as ChargesList[];
    //     this.dsDraftList.data = this.chargeslist1;
    //   },
    //   (error) => {}
    // );
  }
  AddItem(row) {
    console.log(row);
    this.repeatItemList = row.value;
    this.Itemchargeslist = [];
    this.repeatItemList.forEach((element) => {
      let Qty = parseInt(element.Qty.toString());
      let UnitMrp = element.UnitMRP.split('|')[0];
      let GSTAmount = (((element.UnitMRP * this.GSTPer) / 100) * Qty).toFixed(2);
      let CGSTAmt = (((element.UnitMRP * this.CgstPer) / 100) * Qty).toFixed(2);
      let SGSTAmt = (((element.UnitMRP * this.SgstPer) / 100) * Qty).toFixed(2);
      let IGSTAmt = (((element.UnitMRP * this.IgstPer) / 100) * Qty).toFixed(2);

      this.NetAmt = (UnitMrp * element.Qty).toFixed(2);
      this.Itemchargeslist.push({
        ItemId: element.ItemId,
        ItemName: element.ItemShortName,
        BatchNo: element.BatchNo,
        BatchExpDate: this.datePipe.transform(element.BatchExpDate, 'dd/MM/YYYY'),
        Qty: element.Qty,
        UnitMRP: UnitMrp || element.UnitMRP,
        TotalMRP: element.TotalAmount,
        GSTPer: element.VatPer || 0,
        GSTAmount: element.VatAmount || 0,
        DiscPer: element.DiscPer,
        DiscAmt: element.DiscAmount,
        NetAmt: this.NetAmt,
        RoundNetAmt: Math.round(this.NetAmt),
        StockId: this.StockId,
        VatPer: this.VatPer,
        VatAmount: this.GSTAmount,
        LandedRate: this.LandedRate,
        LandedRateandedTotal: this.LandedRateandedTotal,
        CgstPer: this.CgstPer,
        CGSTAmt: this.CGSTAmt,
        SgstPer: this.SgstPer,
        SGSTAmt: this.SGSTAmt,
        IgstPer: this.IgstPer,
        IGSTAmt: this.IGSTAmt,
        PurchaseRate: this.PurchaseRate,
        PurTotAmt: this.PurTotAmt,
        MarginAmt: this.v_marginamt,
        BalanceQty: this.BalQty,
        SalesDraftId: 1,
      });
    });
    this.sIsLoading = '';
    this.saleSelectedDatasource.data = this.Itemchargeslist;
  }
    DeleteDraft() {
    let Query = 'delete T_SalesDraftHeader where DSalesId=' + this.DraftID + '';
    this._salesService.getDelDrat(Query).subscribe((data) => {
      if (data) {
        this.getDraftorderList();
      }
    });
  } 
  onSaveDraftBill() {
    const formValue = this.ItemSubform.value
    if (!this.isValidForm()) {
      Swal.fire('Please enter valid table data.');
      return;
    }
    if (this.ItemSubform.get('opIpType').value == '2') {
      if (this.PatientName == '' || this.MobileNo == '' || this.DoctorName == '') {
        this.toastr.warning('Please select Customer Detail', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    debugger
    this.PharmaSalesDraftForm.get('salesDraft.date').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
    this.PharmaSalesDraftForm.get('salesDraft.time').setValue(this.datePipe.transform(new Date(), 'hh:mm'))
    this.PharmaSalesDraftForm.get('salesDraft.opIpId').setValue(this.Patientdetails?.admissionID)
    this.PharmaSalesDraftForm.get('salesDraft.opIpType').setValue(formValue.opIpType)
    this.PharmaSalesDraftForm.get('salesDraft.totalAmount').setValue(Number(Math.round(formValue.totalAmount)))
    this.PharmaSalesDraftForm.get('salesDraft.vatAmount').setValue(Number(Math.round(formValue.vatAmount)))
    this.PharmaSalesDraftForm.get('salesDraft.discAmount').setValue(Number(Math.round(formValue.discAmount)))
    this.PharmaSalesDraftForm.get('salesDraft.netAmount').setValue(Number(Math.round(formValue.netAmount)))
    this.PharmaSalesDraftForm.get('salesDraft.unitId').setValue(this.Patientdetails?.hospitalID)
    this.PharmaSalesDraftForm.get('salesDraft.wardId').setValue(this.Patientdetails?.wardId)
    this.PharmaSalesDraftForm.get('salesDraft.bedId').setValue(this.Patientdetails?.bedId)
    this.PharmaSalesDraftForm.get('salesDraft.concessionReasonId').setValue(formValue.concessionReasonId)
    this.PharmaSalesDraftForm.get('salesDraft.paidAmount').setValue(Number(Math.round(formValue.netAmount)))

    if (formValue.opIpType == 2) {
      this.PharmaSalesDraftForm.get('salesDraft.externalPatientName').setValue(formValue.externalPatientName)
      this.PharmaSalesDraftForm.get('salesDraft.doctorName').setValue(formValue.doctorName)
      this.PharmaSalesDraftForm.get('salesDraft.extAddress').setValue(formValue.extAddress)
      this.PharmaSalesDraftForm.get('salesDraft.extMobileNo').setValue(formValue.extMobileNo)
    } else {
      this.PharmaSalesDraftForm.get('salesDraft.externalPatientName').setValue(this.PatientName)
      this.PharmaSalesDraftForm.get('salesDraft.doctorName').setValue(this.Patientdetails.doctorName)
    }
    if (this.PharmaSalesDraftForm.valid) {
      this.SalesDraftDetailsAarry.clear();
      this.saleSelectedDatasource.data.forEach((element) => {
        this.SalesDraftDetailsAarry.push(this.CreateDraftDetails(element))
      });
      console.log(this.PharmaSalesDraftForm.value)
      this._salesService.InsertSalesDraftBill(this.PharmaSalesDraftForm.value).subscribe((response) => {
        this.onClose()
        this.getDraftorderList();
      });
    }
    else {
      let invalidFields = [];
      if (this.PharmaSalesDraftForm.invalid) {
        for (const controlName in this.PharmaSalesDraftForm.controls) {
          const control = this.PharmaSalesDraftForm.get(controlName);
          if (control instanceof FormGroup || control instanceof FormArray) {
            for (const nestedKey in control.controls) {
              if (control.get(nestedKey)?.invalid) {
                invalidFields.push(`Sales Draft Data : ${controlName}.${nestedKey}`);
              }
            }
          } else if (control?.invalid) {
            invalidFields.push(`Sales Draft From: ${controlName}`);
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
    onAddRepeat(contact) {
    this.tempDatasource.data = [];
    this.saleSelectedDatasource.data = [];
    this.Itemchargeslist1 = [];
    this.Itemchargeslist = [];
    let strSql = 'Select ItemId,Qty from m_vSalesListforRepeat where SalesId=' + contact.value[0].vSalesId + ' Order by ItemId ';
    this._salesService.getchargesList(strSql).subscribe((data) => {
      this.tempDatasource.data = data as any;
      // console.log(this.tempDatasource.data);
      if (this.tempDatasource.data.length >= 1) {
        this.tempDatasource.data.forEach((element) => {
          this.DraftQty = element.Qty;
          this.onAddDraftListTosale(element, this.DraftQty);
        });
      }
    });
  }
  onAddDraftList(contact) {
    // console.log(contact)
    this.PatientName = contact.PatientName;
    this.MobileNo = contact.ExtMobileNo;
    this.vextAddress = contact.extAddress;
    this.DoctorName = contact.AdmDoctorName;
    this.DraftID = contact.DSalesId;
    this.saleSelectedDatasource.data = [];
    this.Itemchargeslist1 = [];
    this.Itemchargeslist = [];

    let strSql = 'Select ItemId,QtyPerDay,BalQty,IsBatchRequired from Get_SalesDraftBillItemDet where DSalesId=' + contact.DSalesId + ' Order by ItemId ';
    this._salesService.getchargesList(strSql).subscribe((data) => {
      this.tempDatasource.data = data as any;
      // console.log(this.tempDatasource.data);
      if (this.tempDatasource.data.length >= 1) {
        this.tempDatasource.data.forEach((element) => {
          this.DraftQty = element.QtyPerDay;
          this.onAddDraftListTosale(element, this.DraftQty);
        });
      }
    });
  }
  onAddDraftListTosale(contact, DraftQty) {
    // console.log(contact)
    this.Itemchargeslist1 = [];
    this.QtyBalchk = 0;

    var m_data = {
      ItemId: contact.ItemId,
      StoreId: this._loggedService.currentUserValue.storeId || 0,
    };
    this._salesService.getDraftBillItem(m_data).subscribe((draftdata) => {
      console.log(draftdata);
      this.Itemchargeslist1 = draftdata as any;
      if (this.Itemchargeslist1.length == 0) {
        Swal.fire(contact.ItemId + ' : ' + 'Item Stock is Not Avilable:');
      } else if (this.Itemchargeslist1.length > 0) {
        let ItemID;
        this.Itemchargeslist1.forEach((element) => {
          // console.log(element)
          if (ItemID != element.ItemId) {
            this.QtyBalchk = 0;
          }
          if (this.QtyBalchk != 1) {
            if (DraftQty <= element.BalanceQty) {
              this.QtyBalchk = 1;
              this.getFinalCalculation(element, DraftQty);
              ItemID = element.ItemId;
            } else {
              Swal.fire('Balance Qty is :', element.BalanceQty);
              this.QtyBalchk = 0;
              Swal.fire('Balance Qty is Less than Selected Item Qty for Item :' + element.ItemId + 'Balance Qty:', element.BalanceQty);
            }
          }
        });
      }
    });
  }
    getFinalCalculation(contact, DraftQty) {
    console.log(contact);
    // if (parseInt(contact.BalanceQty) > parseInt(this.)) {

    this.RQty = parseInt(DraftQty);
    if (this.RQty && contact.UnitMRP) {
      this.TotalMRP = (parseInt(this.RQty) * contact.UnitMRP).toFixed(2);
      this.LandedRateandedTotal = (parseInt(this.RQty) * contact.LandedRate).toFixed(2);
      this.PurTotAmt = (parseInt(this.RQty) * contact.PurchaseRate).toFixed(2);

      this.v_marginamt = (parseFloat(this.TotalMRP) - parseFloat(this.LandedRateandedTotal)).toFixed(2);

      this.GSTAmount = (((contact.UnitMRP * contact.VatPercentage) / 100) * parseInt(this.RQty)).toFixed(2);
      this.CGSTAmt = (((contact.UnitMRP * contact.CGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
      this.SGSTAmt = (((contact.UnitMRP * contact.SGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
      this.IGSTAmt = (((contact.UnitMRP * contact.IGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);

      this.NetAmt = (parseFloat(this.TotalMRP) - 0).toFixed(2);

      if (contact.DiscPer > 0) {
        this.DiscAmt = ((this.TotalMRP * contact.DiscPer) / 100).toFixed(2);
        this.NetAmt = (this.TotalMRP - this.DiscAmt).toFixed(2);
      }

      // if (this.ItemName && (parseInt(contact.Qty) != 0) && this.MRP > 0 && this.NetAmt > 0) {
      // this.saleSelectedDatasource.data = [];

      this.Itemchargeslist.push({
        ItemId: contact.ItemId,
        ItemName: contact.ItemName,
        BatchNo: contact.BatchNo,
        BatchExpDate: this.datePipe.transform(contact.BatchExpDate, 'yyyy-MM-dd'),
        Qty: DraftQty,
        UnitMRP: contact.UnitMRP,
        GSTPer: contact.VatPercentage || 0,
        GSTAmount: this.GSTAmount || 0,
        TotalMRP: this.TotalMRP,
        DiscPer: contact.DiscPer || 0,
        DiscAmt: this.DiscAmt || 0,
        NetAmt: this.NetAmt || 0,
        RoundNetAmt: Math.round(this.NetAmt),
        StockId: contact.StockId,
        VatPer: contact.VatPer,
        VatAmount: this.GSTAmount,
        LandedRate: contact.LandedRate,
        LandedRateandedTotal: this.LandedRateandedTotal,
        CgstPer: contact.CgstPer,
        CGSTAmt: this.CGSTAmt,
        SgstPer: contact.SgstPer,
        SGSTAmt: this.SGSTAmt,
        IgstPer: contact.IgstPer,
        IGSTAmt: this.IGSTAmt,
        PurchaseRate: contact.PurchaseRate,
        PurTotAmt: this.PurTotAmt,
        MarginAmt: this.v_marginamt,
        BalanceQty: contact.BalQty,
        SalesDraftId: 0,
      });
      this.sIsLoading = '';

      this.saleSelectedDatasource.data = this.Itemchargeslist;
      this.ItemFormreset();
    }

    // this.Itemchargeslist=[];
  }



















 
  updateCellDiscount(item: IndentList): void {
    let discPer = +item.DiscPer;
    let totalMrp = +item.TotalMRP;

    if (discPer < 0 || discPer > 100) {
      this.toastr.error('Enter discount between 0 - 100', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      item.DiscPer = 0;
      item.DiscAmt = 0;
      this.calculateCellNetAmount(item);
      return;
    }
    item.DiscAmt = ((totalMrp * discPer) / 100).toFixed(2);
    this.calculateCellNetAmount(item);
  } 
  getCellCalculation(item: IndentList) {
    let qty = +item.Qty;
    if (!qty) {
      qty = 0;
    }
    const gstPer = +item.GSTPer;
    const unitMrp = +item.UnitMRP;
    const totalMrp = qty * unitMrp;
    const gstAmount = (totalMrp * gstPer) / 100;
    const landedRateandedTotal = qty * item.LandedRate;
    const marginAmt = totalMrp - landedRateandedTotal;

    const updatedItem = {
      GSTAmount: gstAmount.toFixed(2),
      TotalMRP: totalMrp.toFixed(2),
      MarginAmt: marginAmt.toFixed(2),
      Qty: qty,
    } as IndentList;

    Object.assign(item, updatedItem);
    this.calculateCellNetAmount(item);
  }
  calculateCellNetAmount(item: IndentList): void {
    const formValue = this.ItemSubform.value;
    const discAmt = +item.DiscAmt;
    const totalMrp = +item.TotalMRP;

    const netAmount = (totalMrp - discAmt).toFixed(2);
    item.NetAmt = netAmount; 
        let DiscPer = ((formValue.discAmount * 100) / formValue.totalAmount).toFixed(2); 
      this.ItemSubform.patchValue({
      FinalDiscPer: DiscPer,
    }) 
  }
 

  tblCalucation(contact, Qty) {
    let TotalMRP;
    this.RQty = parseInt(contact.Qty) || 1;
    if (this.RQty && contact.UnitMRP) {
      TotalMRP = (parseInt(this.RQty) * contact.UnitMRP).toFixed(2);
      let LandedRateandedTotal = (parseInt(this.RQty) * contact.LandedRate).toFixed(2);
      let v_marginamt = (parseFloat(TotalMRP) - parseFloat(LandedRateandedTotal)).toFixed(2);
      //
      this.PurTotAmt = (parseInt(this.RQty) * contact.PurchaseRate).toFixed(2);
      let NetAmt;
      let DiscAmt;
      this.GSTAmount = (((contact.UnitMRP * contact.VatPer) / 100) * parseInt(this.RQty)).toFixed(2);
      this.CGSTAmt = (((contact.UnitMRP * contact.CgstPer) / 100) * parseInt(this.RQty)).toFixed(2);
      this.SGSTAmt = (((contact.UnitMRP * contact.SgstPer) / 100) * parseInt(this.RQty)).toFixed(2);
      this.IGSTAmt = (((contact.UnitMRP * contact.IgstPer) / 100) * parseInt(this.RQty)).toFixed(2);
      NetAmt = (parseFloat(TotalMRP) - parseFloat(contact.DiscAmt)).toFixed(2);

      if (contact.DiscPer > 0) {
        DiscAmt = ((TotalMRP * contact.DiscPer) / 100).toFixed(2);
        NetAmt = (parseFloat(TotalMRP) - parseFloat(DiscAmt)).toFixed(2);
      }

      contact.GSTAmount = (((contact.UnitMRP * contact.VatPer) / 100) * parseInt(this.RQty)).toFixed(2) || 0;
      contact.TotalMRP = (parseInt(this.RQty) * contact.UnitMRP).toFixed(2); //this.TotalMRP || 0,
      (contact.DiscAmt = DiscAmt || 0),
        (contact.NetAmt = NetAmt), // (parseFloat(TotalMRP) - parseFloat(DiscAmt)).toFixed(2); //this.NetAmt,
        (contact.RoundNetAmt = Math.round(NetAmt)),
        (contact.StockId = this.StockId),
        (contact.VatAmount = 0), // this.GSTAmount || 0,
        (contact.LandedRateandedTotal = LandedRateandedTotal),
        (contact.CGSTAmt = contact.CGSTAmt || 0),
        (contact.SGSTAmt = contact.SGSTAmt || 0),
        (contact.IGSTAmt = contact.IGSTAmt || 0),
        (contact.PurchaseRate = contact.PurchaseRate || 0),
        (contact.PurTotAmt = 0), //this.PurTotAmt || 0,
        (contact.MarginAmt = v_marginamt || 0);
    }
    this.ItemFormreset();
  }


  m_getBalAvaListStore(Param) {
    this.dsDraftList.data = [];
    var m = {
      ItemId: Param,
    };
    this._salesService.getBalAvaListStore(m).subscribe(
      (data) => {
        this.dsBalAvaListStore.data = data as BalAvaListStore[];
      },
      (error) => { }
    );
  }
  
  salesIdWiseObj: any;
  dummySalesIdNameArr = [];
  SalesIdWiseObj: any = {};
  getTopSalesDetailsList(MobileNo) {
    var vdata = {
      ExtMobileNo: MobileNo,
    };
    this.sIsLoading = 'get-sales-data';
    this._salesService.getTopSalesDetails(vdata).subscribe((data: any) => {
      if (data && data.length > 0) {
        this.reportPrintObjItemList = data as Printsal[];
        this.repeatItemList = data;
        this.reportItemPrintObj = data[0] as Printsal;
        this.PatientName = data[0].ExternalPatientName;
        this.DoctorName = data[0].DoctorName;
        this.salesIdWiseObj = this.reportPrintObjItemList.reduce((acc, item: any) => {
          if (!acc[item.SalesId]) {
            acc[item.SalesId] = [];
          }
          acc[item.SalesId].push(item);
          return acc;
        }, {});
        this.sIsLoading = '';
        this.patientname.nativeElement.focus();
      } else {
        this.sIsLoading = '';
      }
    });
    this.getTopSalesDetailsprint();
  }
  getTopSalesDetailsprint() {
    var strrowslist = '';
    let onlySalesId = [];
    this.reportPrintObjItemList.forEach((ele) => onlySalesId.push(ele.SalesId));

    let SalesidNamesArr = [...new Set(onlySalesId)];
    SalesidNamesArr.forEach((ele) => this.dummySalesIdNameArr.push({ SalesId: ele, isHidden: false }));

    this.SalesIdWiseObj = this.reportPrintObjItemList.reduce((acc, item: any) => {
      if (!acc[item.SalesId]) {
        acc[item.SalesId] = [];
      }
      acc[item.SalesId].push(item);
      return acc;
    }, {});

    for (let i = 1; i <= this.reportPrintObjItemList.length; i++) {
      var objreportPrint = this.reportPrintObjItemList[i - 1];

      var strabc =
        this.getSalesIdName(objreportPrint.SalesId) +
        `
  <div style="display:flex;margin:8px 0">
  <div style="display:flex;width:80px;margin-left:20px;">
      <div>` +
        objreportPrint.ItemShortName +
        `</div>
  </div>
  </div>`;
      strrowslist += strabc;
    }
  }
  getSalesIdName(SalesId: String) {
    let groupDiv;
    for (let i = 0; i < this.dummySalesIdNameArr.length; i++) {
      if (this.dummySalesIdNameArr[i].SalesId == SalesId && !this.dummySalesIdNameArr[i].isHidden) {
        let groupHeader =
          `<div style="display:flex;width:960px;margin-left:20px;justify-content:space-between;">
          <div> <h3>` +
          SalesId +
          `</h3></div>
           </div>`;
        this.dummySalesIdNameArr[i].isHidden = true;
        groupDiv = groupHeader;
        break;
      } else {
        groupDiv = ``;
      }
    }
    return groupDiv;
  }
  PatientInformRest() {
    this.PatientName = '';
    this.IPDNo = '';
    this.DoctorName = '';
    this.OPDNo = '';
  }
  CalPaidbackAmt() {
    this.v_PaidbacktoPatient = (parseFloat(this.roundoffAmt) - parseFloat(this.v_PaidbyPatient)).toFixed(2);
  }
  chkbarcode(event) {
    if (event.checked == true) {
      this.barcodeflag = true;
    } else {
      this.barcodeflag = false;
    }
  }
  barcodeItemfetch() {
    var d = {
      StockId: this._salesService.ItemSearchGroup.get('Barcode').value || 0,
      StoreId: this._loggedService.currentUserValue.storeId || 0,
    };
    this._salesService.getCurrentStockItem(d).subscribe((data) => {
      this.tempDatasource.data = data as any;
      if (this.tempDatasource.data.length >= 1) {
        this.tempDatasource.data.forEach((element) => {
          this.DraftQty = 0;
          this.onAddBarcodeItemList(element, element.IssueQty);
        });
      } else if (this.tempDatasource.data.length == 0) {
        this.toastr.error('Item Not Found !', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    });
    this.vBarcode = '';
    this.Addflag = false;
  }
  onAddBarcodeItemList(contact, DraftQty) {
    console.log(contact);
    //
    this.vBarcodeflag = true;
    let i = 0;

    if (this.saleSelectedDatasource.data.length > 0) {
      this.chargeslistBarcode = this.saleSelectedDatasource.data;

      this.saleSelectedDatasource.data.forEach((element) => {
        if (element.ItemId == contact.ItemId) {
          this.Itemflag = true;
          this.toastr.warning('Selected Item already added in the list', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          //

          if (contact.IssueQty != null) {
            this.DraftQty = element.Qty + contact.IssueQty;
            if (this.DraftQty > contact.BalanceQty) {
              Swal.fire('Enter Qty less than Balance :', contact.BalanceQty);
              element.Qty = this.DraftQty - contact.IssueQty;
              this.ItemFormreset();
            }
          } else {
            this.DraftQty = element.Qty + 1;
            if (this.DraftQty > contact.BalanceQty) {
              Swal.fire('Enter Qty less than Balance :', contact.BalanceQty);
              element.Qty = this.DraftQty - 1;
              this.ItemFormreset();
            }
          }

          let TotalMRP = (parseInt(this.DraftQty) * contact.UnitMRP).toFixed(2);
          let Vatamount = ((parseFloat(TotalMRP) * contact.VatPercentage) / 100).toFixed(2);
          let vFinalNetAmount = (parseFloat(Vatamount) + parseFloat(TotalMRP)).toFixed(2);
          let LandedRateandedTotal = (parseInt(this.DraftQty) * contact.LandedRate).toFixed(2);
          let v_marginamt = (parseFloat(TotalMRP) - parseFloat(LandedRateandedTotal)).toFixed(2);
          let PurTotAmt = (parseInt(this.DraftQty) * contact.PurUnitRateWF).toFixed(2);

          let CGSTAmt = (((contact.UnitMRP * contact.CgstPer) / 100) * this.DraftQty).toFixed(2);
          let SGSTAmt = (((contact.UnitMRP * contact.SgstPer) / 100) * this.DraftQty).toFixed(2);
          let IGSTAmt = (((contact.UnitMRP * contact.IgstPer) / 100) * this.DraftQty).toFixed(2);

          // let DiscAmt= ((parseFloat(TotalMRP) * (contact.DiscPer)) / 100).toFixed(2)

          let DiscAmt = ((parseFloat(TotalMRP) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
          let NetAmt = (parseFloat(TotalMRP) - parseFloat(DiscAmt)).toFixed(2);

          let BalQty = contact.BalanceQty - this.DraftQty;

          this.saleSelectedDatasource.data[i].Qty = this.DraftQty;
          this.saleSelectedDatasource.data[i].VatAmount = Vatamount;
          this.saleSelectedDatasource.data[i].TotalAmount = TotalMRP;
          this.saleSelectedDatasource.data[i].NetAmt = vFinalNetAmount;
          this.saleSelectedDatasource.data[i].TotalMRP = TotalMRP;
          this.saleSelectedDatasource.data[i].VatAmount = Vatamount;
          this.saleSelectedDatasource.data[i].TotalAmount = TotalMRP;
          this.saleSelectedDatasource.data[i].NetAmt = NetAmt;

          this.saleSelectedDatasource.data[i].DiscPer = contact.DiscPer;
          this.saleSelectedDatasource.data[i].DiscAmt = DiscAmt;

          this.saleSelectedDatasource.data[i].CGSTAmt = CGSTAmt;
          this.saleSelectedDatasource.data[i].SGSTAmt = SGSTAmt;
          this.saleSelectedDatasource.data[i].IGSTAmt = IGSTAmt;

          this.saleSelectedDatasource.data[i].CgstPer = contact.CGSTPer;
          this.saleSelectedDatasource.data[i].SgstPer = contact.SGSTPer;
          this.saleSelectedDatasource.data[i].IgstPer = contact.IGSTPer;

          this.saleSelectedDatasource.data[i].LandedRate = contact.LandedRate;
          this.saleSelectedDatasource.data[i].LandedRateandedTotal = LandedRateandedTotal;
          this.saleSelectedDatasource.data[i].PurchaseRate = contact.PurUnitRateWF;
          this.saleSelectedDatasource.data[i].PurTotAmt = PurTotAmt;

          this.saleSelectedDatasource.data[i].BalanceQty = BalQty;
          this.saleSelectedDatasource.data[i].StockId = contact.StockId;
        }
        i++;
      });
    }
    if (!this.Itemflag) {
      if (contact.IssueQty != null) {
        this.DraftQty = DraftQty + contact.IssueQty;

        if (this.DraftQty > contact.BalanceQty) {
          Swal.fire('Enter Qty less than Balance');
          this.DraftQty = DraftQty - contact.IssueQty;
          this.ItemFormreset();
        }
      } else {
        this.DraftQty = DraftQty + 1;
        if (this.DraftQty > contact.BalanceQty) {
          Swal.fire('Enter Qty less than Balance');
          this.DraftQty = DraftQty - 1;
          this.ItemFormreset();
        }
      }

      let TotalMRP = (parseInt(this.DraftQty) * contact.UnitMRP).toFixed(2);
      let Vatamount = ((parseFloat(TotalMRP) * contact.VatPercentage) / 100).toFixed(2);
      let TotalNet = parseFloat(TotalMRP + Vatamount).toFixed(2);
      let LandedRateandedTotal = (parseInt(this.DraftQty) * contact.LandedRate).toFixed(2);
      let v_marginamt = (parseFloat(TotalMRP) - parseFloat(LandedRateandedTotal)).toFixed(2);
      let PurTotAmt = (parseInt(this.DraftQty) * contact.PurUnitRateWF).toFixed(2);

      let CGSTAmt = (((contact.UnitMRP * contact.CGSTPer) / 100) * this.DraftQty).toFixed(2);
      let SGSTAmt = (((contact.UnitMRP * contact.SGSTPer) / 100) * this.DraftQty).toFixed(2);
      let IGSTAmt = (((contact.UnitMRP * contact.IGSTPer) / 100) * this.DraftQty).toFixed(2);

      let DiscAmt = ((parseFloat(TotalMRP) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
      let NetAmt = (parseFloat(TotalMRP) - parseFloat(DiscAmt)).toFixed(2);

      this.chargeslistBarcode.push({
        ItemId: contact.ItemId || 0,
        ItemName: contact.ItemName || '',
        BatchNo: contact.BatchNo,
        BatchExpDate: this.datePipe.transform(contact.BatchExpDate, 'yyyy-MM-dd') || '01/01/1900',
        BalanceQty: contact.BalanceQty,
        Qty: this.DraftQty || 0,
        UnitMRP: contact.UnitMRP,
        GSTPer: contact.VatPer || 0,
        GSTAmount: Vatamount || 0,
        TotalMRP: TotalMRP,
        DiscPer: contact.DiscPer,
        DiscAmt: DiscAmt || 0,
        NetAmt: TotalNet,
        RoundNetAmt: parseInt(TotalNet), // Math.round(TotalNet),
        StockId: contact.StockId,
        LandedRate: contact.LandedRate,
        LandedRateandedTotal: LandedRateandedTotal,
        CgstPer: contact.CGSTPer,
        CGSTAmt: CGSTAmt,
        SgstPer: contact.SGSTPer,
        SGSTAmt: SGSTAmt,
        IgstPer: contact.IGSTPer,
        IGSTAmt: IGSTAmt,
        PurchaseRate: contact.PurUnitRateWF,
        PurTotAmt: PurTotAmt,
        MarginAmt: v_marginamt,
        SalesDraftId: 1,
      });
      console.log(this.chargeslistBarcode);
      // });
    }
    this.saleSelectedDatasource.data = this.chargeslistBarcode;
    console.log(this.saleSelectedDatasource.data);

    this.vBarcode = 0;
    this.vBarcodeflag = false;
  }
  getPRESCRIPTION() {
    if (this.ItemSubform.get('opIpType').value == '1') {
      const dialogRef = this._matDialog.open(PrescriptionComponent, {
        maxWidth: '100%',
        height: '95%',
        width: '95%',
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed - Insert Action', result);
        console.log(result);
        // this.DoctorNamecheck = true;
        // this.IPDNocheck = true;
        // this.OPDNoCheck = false;
        // // this.registerObj = result;
        // // console.log(this.registerObj)
        // this.PatientName = result[0].PatientName;
        // this.RegId = result[0].RegId;
        // this.OP_IP_Id = result[0].AdmissionID;
        // this.ItemSubform.get('regId').setValue(result[0].RegId);
        // this.IPDNo = result[0].IPDNo;
        // this.RegNo = result[0].RegNo;
        // this.DoctorName = result[0].DoctorName;
        // this.TariffName = result[0].TariffName;
        // this.IPMedID = result[0].IPMedID;
        // this.CompanyName = result[0].CompanyName;
        // this.IPDNo = result[0].IPDNo;
        // if (this.IPMedID > 0) {
        //   this.paymethod = true;
        //   this.vSelectedOption = '1';
        // }

        this.dsItemNameList1.data = result;
        this.dsItemNameList1.data.forEach((contact) => {
          var m_data = {
            ItemId: contact.ItemId,
            StoreId: this._loggedService.currentUserValue.storeId || 0,
          };
          this._salesService.getDraftBillItem(m_data).subscribe((draftdata) => {
            //console.log(draftdata)
            this.Itemchargeslist1 = draftdata as any;
            if (this.Itemchargeslist1.length == 0) {
              Swal.fire(contact.ItemId + ' : ' + 'Item Stock is Not Avilable:');
            } else if (this.Itemchargeslist1.length > 0) {
              let ItemID = contact.ItemId;
              //
              let remaing_qty = contact.QtyPerDay;
              let bal_qnt = 0;
              this.Itemchargeslist1.forEach((element) => {
                let PreQty = remaing_qty;
                if (PreQty > 0) {
                  if (ItemID != element.ItemId) {
                    this.QtyBalchk = 0;
                  }
                  // if (this.QtyBalchk != 1) {
                  if (PreQty <= element.BalanceQty) {
                    this.QtyBalchk = 1;
                    this.getFinalCalculation(element, PreQty);
                    ItemID = element.ItemId;
                    bal_qnt += element.BalanceQty - PreQty;
                  } else if (PreQty > element.BalanceQty) {
                    this.QtyBalchk = 1;
                    //Swal.fire("For Item :" + element.ItemId + " adding the Balance Qty: ", element.BalanceQty)
                    this.getFinalCalculation(element, element.BalanceQty);
                    ItemID = element.ItemId;
                  }
                  remaing_qty = PreQty - element.BalanceQty;
                } else {
                  bal_qnt += element.BalanceQty;
                }
              });
              Swal.fire('Balance Qty is :', String(bal_qnt));
            }
          });
        });
      });
    } else {
      this.toastr.warning('Please Select opIpType IP.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    }
  }
  getBillSummary() {
    let query;
    query = 'select  SUM(BalanceAmount) as CreditAmount from t_salesheader where OP_IP_ID=' + this.OP_IP_Id;
    this._salesService.getBillSummaryQuery(query).subscribe((data) => {
      console.log(data);
      this.TotalCreditAmt = data[0].CreditAmount;
    });

    query = 'select AdvanceAmount,BalanceAmount from T_PHAdvanceHeader where OPD_IPD_Id=' + this.OP_IP_Id;
    this._salesService.getBillSummaryQuery(query).subscribe((data) => {
      console.log(data);
      let mdata = (this.TotalAdvanceAmt = data[0].AdvanceAmount);
      this.TotalBalanceAmt = data[0].BalanceAmount;
    });
  }
  onEnterItemName(item: IndentList): void {
    const itemId = item.ItemId;
    const storeId = item.StoreId;
    this.selectedTableRowItem = item;
    this.getBatch(itemId, storeId, true);
  }

  focusNext(ref: ElementRef): void {
    ((ref as any).el?.nativeElement as HTMLElement)?.querySelector('input')?.focus();
  }
  isValidForm(): boolean {
    return this.saleSelectedDatasource.data.every((i) => i.Qty > 0 && i.UnitMRP > 0);
  }
  getElementByName(name: string): HTMLElement {
    return document.querySelector(`[name=${name}]`) as HTMLElement;
  }
  // NEW BHAVDIP CODE
  getValidationMessages() {
    return {
      mobileNo: [
        { name: 'required', Message: 'Mobile no required' },
        { name: 'pattern', Message: 'only Number allowed.' },
      ],
      StoreId: [
        // { name: "required", Message: "Invoice No is required" }
      ],
    };
  }
  public onEnterpatientname(event): void {
    if (event.which === 13) {
      this.doctorname.nativeElement.focus();
    }
  }
  public onEntermobileno(event): void {
    if (this.ItemSubform.get('MobileNo').value && this.ItemSubform.get('extMobileNo').value.length == 10) {
      this.getTopSalesDetailsList(this.MobileNo);
      this.patientname.nativeElement.focus();
    }
  }
  public onEnterDoctorname(event): void {
    if (event.which === 13) {
      this.address.nativeElement.focus();
    }
  }
  public onEnterAddress(event): void {
    if (event.which === 13) {
      this.itemid.nativeElement.focus();
    }
  }
  public onF6Reset(event): void {
    if (event.which === 117) {
      this.onClose();
    }
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === 119) {
      this.onsubstitutes();
    }
    if (event.keyCode === 120) {
      this.onSave(event);
    }
  }
  onsubstitutes() {
    const dialogRef = this._matDialog.open(SubstitutesComponent, {
      maxWidth: '65vw',
      height: '650px',
      width: '60%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getWhatsappshareSales(el, vmono) {
    var m_data = {
      insertWhatsappsmsInfo: {
        mobileNumber: vmono || 0,
        smsString:
          'Dear' +
          vmono +
          ',Your Sales Bill has been successfully completed. UHID is ' +
          el +
          ' For, more deatils, call 08352249399. Thank You, JSS Super Speciality Hospitals, Near S-Hyper Mart, Vijayapur ' || '',
        isSent: 0,
        smsType: 'Sales',
        smsFlag: 0,
        smsDate: this.currentDate,
        tranNo: el,
        PatientType: 2, //el.PatientType,
        templateId: 0,
        smSurl: 'info@gmail.com',
        filePath: this.Filepath || '',
        smsOutGoingID: 0,
      },
    };
    this._BrowsSalesBillService.InsertWhatsappSales(m_data).subscribe((response) => {
      if (response) {
        this.toastr.success('Bill Sent on WhatsApp Successfully.', 'Save !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
      } else {
        this.toastr.error('API Error!', 'Error WhatsApp!', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    });
  }
  T
}
