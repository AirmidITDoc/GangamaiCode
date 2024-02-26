import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, ElementRef, HostListener, Inject, Injector, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { SalesService } from './sales.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference, forEach, parseInt } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { SalePopupComponent } from './sale-popup/sale-popup.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OpPaymentNewComponent } from 'app/main/opd/op-search-list/op-payment-new/op-payment-new.component';
import { ConditionalExpr } from '@angular/compiler';
import { Observable, Subscription } from 'rxjs';
import * as converter from 'number-to-words';
// import { ItemNameList } from 'app/main/inventory/issue-to-department/issue-to-department.component';
import { IpPaymentInsert } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ComponentPortal, DomPortalOutlet, PortalInjector } from '@angular/cdk/portal';
import { HeaderComponent } from 'app/main/shared/componets/header/header.component';
import { element } from 'protractor';
import { OPSearhlistService } from 'app/main/opd/op-search-list/op-searhlist.service';
import { map, startWith } from 'rxjs/operators';
import { RequestforlabtestService } from 'app/main/nursingstation/requestforlabtest/requestforlabtest.service';
import { RegInsert } from 'app/main/opd/appointment/appointment.component';
import { SnackBarService } from 'app/main/shared/services/snack-bar.service';
import { ToasterService } from 'app/main/shared/services/toaster.service';
import { PaymentModeComponent } from 'app/main/shared/componets/payment-mode/payment-mode.component';
import { ToastrService } from 'ngx-toastr';
import { OnlinePaymentService } from 'app/main/shared/services/online-payment.service';
import { ChargesList } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { MatDrawer } from '@angular/material/sidenav';
import { BrowsSalesBillService } from '../brows-sales-bill/brows-sales-bill.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class SalesComponent implements OnInit {

  @ViewChild('Quantity') Quantity: ElementRef;
  @ViewChild('discAmount') discAmount: ElementRef;
  @ViewChild('ConseId') ConseId: ElementRef;

  ItemSubform: FormGroup;
  sIsLoading: string = '';
  isLoading = true;
  Store1List: any = [];
  filteredOptions: any;
  noOptionFound: boolean = false;
  labelPosition: 'before' | 'after' = 'after';
  isItemIdSelected: boolean = false;
  paymethod: boolean = false;
  IsOnlineRefNo: boolean = false;

  // dsIndentID = new MatTableDataSource<IndentID>();

  ItemName: any;
  ItemId: any;
  BalanceQty: any;
  Itemchargeslist: any = [];
  Itemchargeslist1: any = [];
  BalChkList: any = [];
  ConcessionReasonList: any = [];

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
  ConShow: Boolean = false;
  add1: Boolean = false;

  ItemObj: IndentList;
  v_marginamt: any = 0;
  TotalMarginAmt: any = 0;
  paidamt: number;
  flagSubmit: boolean;
  balanceamt: number = 0;
  disamt: any;
  msg: any;
  currentDate = new Date();

  VatPer: any;
  CgstPer: any;
  SgstPer: any;
  IgstPer: any;

  VatAmount: any;
  CGSTAmt: any;
  SGSTAmt: any;
  IGSTAmt: any;
  StockId: any;
  StoreId: any;
  LandedRate: any;
  PurchaseRate: any;
  LandedRateandedTotal: any = 0;
  PurTotAmt: any = 0;
  TotDiscAmt: any = 0;
  PatientName: any;
  RegID: any;

  BalAmount: any = 0;
  MobileNo: any;
  gstAmt: any;
  DoctorName: any;
  isPatienttypeDisabled: boolean = true;
  chkdiscper: boolean = true;
  stockidflag: boolean = true;
  deleteflag: boolean = true;
  reportPrintObj: Printsal;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  reportPrintObjList: Printsal[] = [];
  SalesIDObjList: Printsal[] = [];
  Filepath:any;
  reportItemPrintObj: Printsal;
  reportPrintObjItemList: Printsal[] = [];

  repeatItemList: IndentList[] = [];
  DiscOld: any = 0.0;
  GSTAmount: any;
  QtyBalchk: any = 0;
  DraftQty: any = 0;
  RQty: any = 0;
  GSalesNo:any=0;
  @ViewChild('drawer') public drawer: MatDrawer;

  dsIndentList = new MatTableDataSource<IndentList>();
  datasource = new MatTableDataSource<IndentList>();
  saleSelectedDatasource = new MatTableDataSource<IndentList>();
  tempDatasource = new MatTableDataSource<IndentList>();
  chargeslist = new MatTableDataSource<IndentList>();

  dataSource1 = new MatTableDataSource<DraftSale>();

  // vSalesDetails: any = [];
  vSalesDetails: Printsal[] = [];
  vSalesIdList: any = [];
  isPaymentSelected: boolean = false;
  OP_IP_Type: any;
  // payment code
  DiscId: any;
DraftID:any=0;
  DiffNetRoundAmt:any=0;
  roundoffAmt: any;
  Functionflag=0;

  patientDetailsFormGrp: FormGroup;
  paymentArr1: any[] = this.opService.getPaymentArr();
  paymentArr2: any[] = this.opService.getPaymentArr();
  paymentArr3: any[] = this.opService.getPaymentArr();
  paymentArr4: any[] = this.opService.getPaymentArr();
  paymentArr5: any[] = this.opService.getPaymentArr();
  paymentRowObj = {
    cash: false,
    cheque: false,
    card: false,
    upi: false,
    neft: false,
  };

  PatientHeaderObj: any;

  selectedPaymnet1: string = '';
  selectedPaymnet2: string = '';
  selectedPaymnet3: string = '';
  selectedPaymnet4: string = '';
  selectedPaymnet5: string = '';

  netPayAmt: number = 0;
  nowDate: Date;
  amount1: any;
  amount2: any;
  amount3: any;
  amount4: any;
  amount5: any;

  dateTimeObj: any;
  screenFromString = 'payment-form';
  // Paymentobj = {};
  paidAmt: number;
  balanceAmt: number = 0;
  BankNameList2: any = [];
  BankNameList3: any = [];
  BankNameList4: any = [];
  //latest
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
  @ViewChild('billTemplate2') billTemplate2: ElementRef;

  filteredOptionsBank2: Observable<string[]>;
  optionsBank2: any[] = [];
  isBank1elected2: boolean = false;
  filteredOptionsBank3: Observable<string[]>;
  optionsBank3: any[] = [];
  isBank1elected3: boolean = false;
  filteredOptionsBank4: Observable<string[]>;
  optionsBank4: any[] = [];
  isBank1elected4: boolean = false

  IsCreditflag: boolean = false
  OP_IP_Id: any = 0;
  OP_IPType: any = 2;
  drafttable: boolean = false
BalancechkFlag:any=0;
SalesDraftId:any=0;
v_PaidbyPatient:any=0;
v_PaidbacktoPatient:any=0;
loadingRow: number | null = null
IsLoading:boolean=false;
showTable: boolean = false
vPatientType:any;


  displayedColumns = [
    'FromStoreId',
    'IndentNo',
    'IndentDate',
    'FromStoreName',
    'ToStoreName',
    'Addedby',
    'IsInchargeVerify',
    'action',
  ];

  displayedColumns1 = [
    'ItemName',
    'Qty',
    'IssQty',
    'Bal',
  ];

  selectedSaleDisplayedCol = [
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'Qty',
    'UnitMRP',
    'GSTPer',
    'GSTAmount',
    'TotalMRP',
    'DiscPer',
    'DiscAmt',
    'NetAmt',
    'MarginAmt',
    'buttons'
  ];


  
  DraftSaleDisplayedCol = [
    // 'DSalesId',
    'extMobileNo',
    'buttons'
  ];

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  data: any;
  PatientListfilteredOptions: any;
  registerObj = new RegInsert({});
  RegId: any = '';
  vAdmissionID: any;
  isPaymentSuccess: boolean = false;
  newDateTimeObj: any = {};
  vextAddress:any = '';


  constructor(
    public _BrowsSalesBillService: BrowsSalesBillService,
    public _salesService: SalesService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private _loggedService: AuthenticationService,
    private injector: Injector,

    // @Inject(MAT_DIALOG_DATA) public data: any,
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private opService: OPSearhlistService,
    public _RequestforlabtestService: RequestforlabtestService,
    public toastr: ToastrService,
    private onlinePaymentService: OnlinePaymentService
  ) {
    this.nowDate = new Date();
    this.PatientHeaderObj = this.data;
    this.netPayAmt = this.FinalNetAmount;// parseInt(this.advanceData.NetPayAmount) || this.advanceData.NetPayableAmt;
    this.cashAmt = this.FinalNetAmount;// parseInt(this.advanceData.NetPayAmount);
    this.paidAmt = this.FinalNetAmount;// parseInt(this.advanceData.NetPayAmount);
    this.billNo = this.FinalNetAmount;//  parseInt(this.advanceData.BillId);
    this.PatientName = this.advanceData.PatientName;
    this.BillDate = this.advanceData.Date;
    this.getBalanceAmt();
    // this.Paymentobj['TransactionType'] = 0;
    this.IsCreditflag = false
    this.showTable = false;
  }

  ngOnInit(): void {
    this.patientDetailsFormGrp = this.createForm();
    this.gePharStoreList();
    this.getItemSubform();
    this.getConcessionReasonList();

    // pament Code
    this.patientDetailsFormGrp = this.createForm();
    this.selectedPaymnet1 = this.paymentArr1[0].value;
    this.amount1 = this.FinalNetAmount// this.netPayAmt = parseInt(this.advanceData.NetPayAmount) || this.advanceData.NetPayableAmt;
    this.getBalanceAmt();
    this.paymentRowObj["cash"] = true;
    this.onPaymentChange(1, 'cash');
    this.paidAmt = 0;
    this.onAddClick('cash');
    this.getBankNameList2();
    this.getBankNameList3();
    this.getBankNameList4();
    this.getDraftorderList();
  }

 



  createForm() {
    return this.formBuilder.group({
      paymentType1: [],
      amount1: [this.netPayAmt],
      referenceNumber1: [],
      bankName1: [],
      regDate1: [(new Date()).toISOString()],

      paymentType2: [],
      amount2: [],
      referenceNo2: [],
      bankName2: [],
      regDate2: [(new Date()).toISOString()],

      paymentType3: [],
      amount3: [],
      bankName3: [],
      referenceNo3: [],
      regDate3: [(new Date()).toISOString()],

      paymentType4: [],
      amount4: [],
      referenceNo4: [],
      bankName4: [],
      regDate4: [(new Date()).toISOString()],

      paymentType5: [],
      amount5: [],
      bankName5: [],
      regDate5: [(new Date()).toISOString()],
      referenceNo5: [],

      paidAmountController: [],
      balanceAmountController: [],
      // roundoffAmt: ''
      // paymentType6: [],
      // amount6: [],
      // bankName6: [],
      // regDate6: [(new Date()).toISOString()],
      // referenceNo6: []
    });
  }

  OtherPayment() {
    // 
    this.amount1 = this.FinalNetAmount;
    this.paidAmt = this.FinalNetAmount;
    this.isPaymentSelected = true;
    this.netPayAmt = this.FinalNetAmount;
    this.getBalanceAmt();
    this.paymentRowObj["cash"] = true;
    this.onPaymentChange(1, 'cash');

  }

  getBalanceAmt() {
    // 
    this.balanceAmt = parseInt(this.FinalNetAmount) - ((this.amount1 ? parseInt(this.amount1) : 0)
      + (this.amount2 ? parseInt(this.amount2) : 0)
      + (this.amount3 ? parseInt(this.amount3) : 0)
      + (this.amount4 ? parseInt(this.amount4) : 0)
      + (this.amount5 ? parseInt(this.amount5) : 0));
  }

  onAddClick(paymentOption: string) {
    this.paymentRowObj[paymentOption] = true;
    switch (paymentOption) {
      case 'cash':
        this.setSecRowValidators(paymentOption);
        break;

      case 'upi':
        this.amount2 = this.netPayAmt - this.amount1;
        this.getBalanceAmt();
        this.setThirdRowValidators(paymentOption);
        break;

      case 'neft':
        this.amount5 = this.netPayAmt - (parseInt(this.amount1) + parseInt(this.amount2) + parseInt(this.amount3) + parseInt(this.amount4));
        this.getBalanceAmt();
        this.setThirdRowValidators(paymentOption);
        break;

      case 'cheque':
        this.amount3 = this.netPayAmt - (parseInt(this.amount1) + parseInt(this.amount2));
        this.getBalanceAmt();
        this.setFourthRowValidators(paymentOption);
        break;

      case 'card':
        this.amount4 = this.netPayAmt - (parseInt(this.amount1) + parseInt(this.amount2) + parseInt(this.amount3));
        this.getBalanceAmt();
        this.setFifthRowValidators(paymentOption);
        break;

      default:
        break;
    }

    // if (paymentOption && paymentOption == 'upi') {

    // }
  }

  onPaymentChange(rowId: number, value: string) {
    // 
    switch (rowId) {
      case 1:
        this.paymentArr2 = this.opService.getPaymentArr();
        let element = this.paymentArr2.findIndex(ele => ele.value == this.selectedPaymnet1);
        this.paymentArr2.splice(element, 1);

        this.paymentArr3 = this.opService.getPaymentArr();
        let element1 = this.paymentArr3.findIndex(ele => ele.value == this.selectedPaymnet1);
        this.paymentArr3.splice(element1, 1);

        this.paymentArr4 = this.opService.getPaymentArr();
        let element2 = this.paymentArr4.findIndex(ele => ele.value == this.selectedPaymnet1);
        this.paymentArr4.splice(element2, 1);

        this.paymentArr5 = this.opService.getPaymentArr();
        let element3 = this.paymentArr5.findIndex(ele => ele.value == this.selectedPaymnet1);
        this.paymentArr5.splice(element3, 1);
        break;

      case 2:
        this.paymentArr1 = this.opService.getPaymentArr();
        let ele = this.paymentArr1.findIndex(ele => ele.value == this.selectedPaymnet2);
        this.paymentArr1.splice(ele, 1);

        this.paymentArr3 = this.opService.getPaymentArr();
        let ele1 = this.paymentArr3.findIndex(ele => ele.value == this.selectedPaymnet2);
        this.paymentArr3.splice(ele1, 1);

        this.paymentArr4 = this.opService.getPaymentArr();
        let ele2 = this.paymentArr4.findIndex(ele => ele.value == this.selectedPaymnet2);
        this.paymentArr4.splice(ele2, 1);

        this.paymentArr5 = this.opService.getPaymentArr();
        let ele3 = this.paymentArr5.findIndex(ele => ele.value == this.selectedPaymnet2);
        this.paymentArr5.splice(ele3, 1);
        this.setSecRowValidators(value);
        this.patientDetailsFormGrp.updateValueAndValidity();
        break;

      case 3:
        this.paymentArr1 = this.opService.getPaymentArr();
        let elem = this.paymentArr1.findIndex(ele => ele.value == this.selectedPaymnet3);
        this.paymentArr1.splice(elem, 1);

        this.paymentArr2 = this.opService.getPaymentArr();
        let elem1 = this.paymentArr2.findIndex(ele => ele.value == this.selectedPaymnet3);
        this.paymentArr2.splice(elem1, 1);

        this.paymentArr4 = this.opService.getPaymentArr();
        let elem2 = this.paymentArr4.findIndex(ele => ele.value == this.selectedPaymnet3);
        this.paymentArr4.splice(elem2, 1);

        this.paymentArr5 = this.opService.getPaymentArr();
        let elem3 = this.paymentArr5.findIndex(ele => ele.value == this.selectedPaymnet3);
        this.paymentArr5.splice(elem3, 1);
        this.setThirdRowValidators(value);
        this.patientDetailsFormGrp.updateValueAndValidity();
        break;

      case 4:
        this.paymentArr1 = this.opService.getPaymentArr();
        let elemen = this.paymentArr1.findIndex(ele => ele.value == this.selectedPaymnet4);
        this.paymentArr1.splice(elemen, 1);

        this.paymentArr2 = this.opService.getPaymentArr();
        let elemen1 = this.paymentArr2.findIndex(ele => ele.value == this.selectedPaymnet4);
        this.paymentArr2.splice(elemen1, 1);

        this.paymentArr3 = this.opService.getPaymentArr();
        let elemen2 = this.paymentArr3.findIndex(ele => ele.value == this.selectedPaymnet4);
        this.paymentArr3.splice(elemen2, 1);

        this.paymentArr5 = this.opService.getPaymentArr();
        let elemen3 = this.paymentArr5.findIndex(ele => ele.value == this.selectedPaymnet4);
        this.paymentArr5.splice(elemen3, 1);
        this.setFourthRowValidators(value);
        this.patientDetailsFormGrp.updateValueAndValidity();
        break;

      case 5:
        this.paymentArr1 = this.opService.getPaymentArr();
        let elemnt = this.paymentArr1.findIndex(ele => ele.value == this.selectedPaymnet5);
        this.paymentArr1.splice(elemnt, 1);

        this.paymentArr2 = this.opService.getPaymentArr();
        let elemnt1 = this.paymentArr2.findIndex(ele => ele.value == this.selectedPaymnet5);
        this.paymentArr2.splice(elemnt1, 1);

        this.paymentArr3 = this.opService.getPaymentArr();
        let elemnt2 = this.paymentArr3.findIndex(ele => ele.value == this.selectedPaymnet5);
        this.paymentArr3.splice(elemnt2, 1);

        this.paymentArr4 = this.opService.getPaymentArr();
        let elemnt3 = this.paymentArr4.findIndex(ele => ele.value == this.selectedPaymnet5);
        this.paymentArr4.splice(elemnt3, 1);
        this.setFifthRowValidators(value);
        this.patientDetailsFormGrp.updateValueAndValidity();
        break;

      // case 6:
      //   this.paymentArr1 = this.opService.getPaymentArr();
      //   let elemnt = this.paymentArr1.findIndex(ele => ele.value == this.selectedPaymnet5);
      //   this.paymentArr1.splice(elemnt, 1);

      //   this.paymentArr2 = this.opService.getPaymentArr();
      //   let elemnt1 = this.paymentArr2.findIndex(ele => ele.value == this.selectedPaymnet5);
      //   this.paymentArr2.splice(elemnt1, 1);

      //   this.paymentArr3 = this.opService.getPaymentArr();
      //   let elemnt2 = this.paymentArr3.findIndex(ele => ele.value == this.selectedPaymnet5);
      //   this.paymentArr3.splice(elemnt2, 1);

      //   this.paymentArr4 = this.opService.getPaymentArr();
      //   let elemnt3 = this.paymentArr4.findIndex(ele => ele.value == this.selectedPaymnet5);
      //   this.paymentArr4.splice(elemnt3, 1);
      //   this.setFifthRowValidators(value);
      //   this.patientDetailsFormGrp.updateValueAndValidity();
      //   break;

      default:
        break;
    }
  }

  setPaymentOption() {
    if (this.selectedPaymnet1) {
      let element1 = this.paymentArr2.findIndex(ele => ele.value == this.selectedPaymnet1);
      this.paymentArr2.splice(element1, 1);

      let element2 = this.paymentArr3.findIndex(ele => ele.value == this.selectedPaymnet1);
      this.paymentArr3.splice(element2, 1);

      let element3 = this.paymentArr4.findIndex(ele => ele.value == this.selectedPaymnet1);
      this.paymentArr4.splice(element3, 1);

      let element4 = this.paymentArr5.findIndex(ele => ele.value == this.selectedPaymnet1);
      this.paymentArr5.splice(element4, 1);
    }
  }

  setSecRowValidators(paymentOption: any) {
    if (this.selectedPaymnet2 && this.selectedPaymnet2 != 'cash') {
      this.patientDetailsFormGrp.get('referenceNo2').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('bankName2').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('regDate2').setValidators([Validators.required]);
      this.patientDetailsFormGrp.updateValueAndValidity();
    } else if (this.selectedPaymnet2 && this.selectedPaymnet2 == 'cash') {
      this.patientDetailsFormGrp.get('referenceNo2').clearAsyncValidators();
      this.patientDetailsFormGrp.get('bankName2').clearAsyncValidators();
      this.patientDetailsFormGrp.get('regDate2').clearAsyncValidators();
      this.patientDetailsFormGrp.updateValueAndValidity();
    }
  }

  setThirdRowValidators(paymentOption: any) {
    if (this.selectedPaymnet2 && this.selectedPaymnet2 != 'cash') {
      this.patientDetailsFormGrp.get('amount3').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('referenceNo3').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('bankName3').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('regDate3').setValidators([Validators.required]);
      this.patientDetailsFormGrp.updateValueAndValidity();
    } else if (this.selectedPaymnet2 && this.selectedPaymnet2 == 'cash') {
      this.removeThirdValidators();
    }
  }

  setFourthRowValidators(paymentOption: any) {
    if (this.selectedPaymnet2 && this.selectedPaymnet2 != 'cash') {
      this.patientDetailsFormGrp.get('referenceNo4').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('bankName4').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('regDate4').setValidators([Validators.required]);
      this.patientDetailsFormGrp.updateValueAndValidity();
    } else if (this.selectedPaymnet2 && this.selectedPaymnet2 == 'cash') {
      this.patientDetailsFormGrp.get('referenceNo4').clearAsyncValidators();
      this.patientDetailsFormGrp.get('bankName4').clearAsyncValidators();
      this.patientDetailsFormGrp.get('regDate4').clearAsyncValidators();
      this.patientDetailsFormGrp.updateValueAndValidity();
    }
  }

  setFifthRowValidators(paymentOption: any) {
    if (this.selectedPaymnet2 && this.selectedPaymnet2 != 'cash') {
      this.patientDetailsFormGrp.get('referenceNo5').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('bankName5').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('regDate5').setValidators([Validators.required]);
      this.patientDetailsFormGrp.updateValueAndValidity();
    } else if (this.selectedPaymnet2 && this.selectedPaymnet2 == 'cash') {
      this.patientDetailsFormGrp.get('referenceNo5').clearAsyncValidators();
      this.patientDetailsFormGrp.get('bankName5').clearAsyncValidators();
      this.patientDetailsFormGrp.get('regDate5').clearAsyncValidators();
      this.patientDetailsFormGrp.updateValueAndValidity();
    }
  }

  removeThirdValidators() {
    this.patientDetailsFormGrp.get('amount3').clearAsyncValidators();
    this.patientDetailsFormGrp.get('referenceNo3').clearAsyncValidators();
    this.patientDetailsFormGrp.get('bankName3').clearAsyncValidators();
    this.patientDetailsFormGrp.get('regDate3').clearAsyncValidators();
    this.patientDetailsFormGrp.updateValueAndValidity();
  }

  private _filterBank2(value: any): string[] {
    if (value) {
      const filterValue = value && value.BankName ? value.BankName.toLowerCase() : value.toLowerCase();
      return this.optionsBank2.filter(option => option.BankName.toLowerCase().includes(filterValue));
    }

  }


  private _filterBank3(value: any): string[] {
    if (value) {
      const filterValue = value && value.BankName ? value.BankName.toLowerCase() : value.toLowerCase();
      return this.optionsBank3.filter(option => option.BankName.toLowerCase().includes(filterValue));
    }

  }


  private _filterBank4(value: any): string[] {
    if (value) {
      const filterValue = value && value.BankName ? value.BankName.toLowerCase() : value.toLowerCase();
      return this.optionsBank4.filter(option => option.BankName.toLowerCase().includes(filterValue));
    }

  }
  getBankNameList2() {
    this.opService.getBankMasterCombo().subscribe(data => {
      this.BankNameList2 = data;
      this.optionsBank2 = this.BankNameList2.slice();
      this.filteredOptionsBank2 = this.patientDetailsFormGrp.get('bankName2').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterBank2(value) : this.BankNameList2.slice()),
      );

    });
  }

  getBankNameList3() {
    this.opService.getBankMasterCombo().subscribe(data => {
      this.BankNameList3 = data;
      this.optionsBank3 = this.BankNameList3.slice();
      this.filteredOptionsBank3 = this.patientDetailsFormGrp.get('bankName3').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterBank3(value) : this.BankNameList3.slice()),
      );

    });
  }

  getBankNameList4() {
    this.opService.getBankMasterCombo().subscribe(data => {
      this.BankNameList4 = data;
      this.optionsBank4 = this.BankNameList4.slice();
      this.filteredOptionsBank4 = this.patientDetailsFormGrp.get('bankName4').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterBank4(value) : this.BankNameList4.slice()),
      );

    });
  }


  getOptionTextBank2(option) {
    return option && option.BankName ? option.BankName : '';
  }
  getOptionTextBank3(option) {
    return option && option.BankName ? option.BankName : '';
  }
  getOptionTextBank4(option) {
    return option && option.BankName ? option.BankName : '';
  }

  secondAddEnable() {
    return parseInt(this.amount1.toString()) + parseInt(this.amount2.toString()) < this.netPayAmt ? true : false;
  }

  thirdAddEnable() {
    return parseInt(this.amount1.toString()) + parseInt(this.amount2.toString()) + parseInt(this.amount3.toString()) < this.netPayAmt ? true : false;
  }

  fourthAddEnable() {
    if ((parseInt(this.amount1.toString()) + parseInt(this.amount2.toString()) + parseInt(this.amount3.toString()) + parseInt(this.amount4.toString())) < this.netPayAmt) {
      return true;
    } else {
      return false;
    }
  }

  onRemoveClick(caseId: string) {
    this.paymentRowObj[caseId] = false;
    switch (caseId) {
      case 'upi':
        this.removeThirdValidators();
        break;

      default:
        break;
    }
  }

  getCashObj(type: string) {

    if (this.patientDetailsFormGrp.get("paymentType1").value == type) {
      this.Paymentobj['CashPayAmount'] = parseInt(this.amount1.toString());
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType2").value == type) {
      this.Paymentobj['CashPayAmount'] = parseInt(this.amount2.toString());
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType3").value == type) {
      this.Paymentobj['CashPayAmount'] = parseInt(this.amount3.toString());
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType4").value == type) {
      this.Paymentobj['CashPayAmount'] = parseInt(this.amount4.toString());
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType5").value == type) {
      this.Paymentobj['CashPayAmount'] = parseInt(this.amount5.toString());
      return;
    }
    // 
    // console.log(this.Paymentobj)
    return;
  }

  getChequeObj(type: string) {
    // 
    if (this.patientDetailsFormGrp.get("paymentType1").value == type) {
      this.Paymentobj['ChequePayAmount'] = this.amount1;
      this.Paymentobj['ChequeNo'] = this.patientDetailsFormGrp.get("referenceNo1").value;
      this.Paymentobj['BankName'] = this.patientDetailsFormGrp.get("bankName1").value.BankName;
      this.Paymentobj['ChequeDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType2").value == type) {
      this.Paymentobj['ChequePayAmount'] = this.amount2;
      this.Paymentobj['ChequeNo'] = this.patientDetailsFormGrp.get("referenceNo2").value;
      this.Paymentobj['BankName'] = this.patientDetailsFormGrp.get("bankName2").value.BankName;
      this.Paymentobj['ChequeDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType3").value == type) {
      this.Paymentobj['ChequePayAmount'] = this.amount3;
      this.Paymentobj['ChequeNo'] = this.patientDetailsFormGrp.get("referenceNo3").value;
      this.Paymentobj['BankName'] = this.patientDetailsFormGrp.get("bankName3").value.BankName;
      this.Paymentobj['ChequeDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType4").value == type) {
      this.Paymentobj['ChequePayAmount'] = this.amount4;
      this.Paymentobj['ChequeNo'] = this.patientDetailsFormGrp.get("referenceNo4").value;
      this.Paymentobj['BankName'] = this.patientDetailsFormGrp.get("bankName4").value.BankName;
      this.Paymentobj['ChequeDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType5").value == type) {
      this.Paymentobj['ChequePayAmount'] = this.amount5;
      this.Paymentobj['ChequeNo'] = this.patientDetailsFormGrp.get("referenceNo5").value;
      this.Paymentobj['BankName'] = this.patientDetailsFormGrp.get("bankName5").value.BankName;
      this.Paymentobj['ChequeDate'] = this.dateTimeObj.date;
      return;
    }
    // console.log(this.Paymentobj)
    return;

  }

  getCardObj(type: string) {
    if (this.patientDetailsFormGrp.get("paymentType1").value == type) {
      this.Paymentobj['CardPayAmount'] = this.amount1;
      this.Paymentobj['CardNo'] = this.patientDetailsFormGrp.get("referenceNo1").value;
      this.Paymentobj['CardBankName'] = this.patientDetailsFormGrp.get("bankName1").value;
      this.Paymentobj['CardDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType2").value == type) {
      this.Paymentobj['CardPayAmount'] = this.amount2;
      this.Paymentobj['CardNo'] = this.patientDetailsFormGrp.get("referenceNo2").value;
      this.Paymentobj['CardBankName'] = this.patientDetailsFormGrp.get("bankName2").value.BankName;
      this.Paymentobj['CardDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType3").value == type) {
      this.Paymentobj['CardPayAmount'] = this.amount3;
      this.Paymentobj['CardNo'] = this.patientDetailsFormGrp.get("referenceNo3").value;
      this.Paymentobj['CardBankName'] = this.patientDetailsFormGrp.get("bankName3").value.BankName;
      this.Paymentobj['CardDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType4").value == type) {
      this.Paymentobj['CardPayAmount'] = this.amount4;
      this.Paymentobj['CardNo'] = this.patientDetailsFormGrp.get("referenceNo4").value;
      this.Paymentobj['CardBankName'] = this.patientDetailsFormGrp.get("bankName4").value.BankName;
      this.Paymentobj['CardDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType5").value == type) {
      this.Paymentobj['CardPayAmount'] = this.amount5;
      this.Paymentobj['CardNo'] = this.patientDetailsFormGrp.get("referenceNo5").value;
      this.Paymentobj['CardBankName'] = this.patientDetailsFormGrp.get("bankName5").value.BankName;
      this.Paymentobj['CardDate'] = this.dateTimeObj.date;
      return;
    }
    // console.log(this.Paymentobj)
    return;
  }

  getNeftObj(type: string) {
    if (this.patientDetailsFormGrp.get("paymentType1").value == type) {
      this.Paymentobj['NEFTPayAmount'] = this.amount1;
      this.Paymentobj['NEFTNo'] = this.patientDetailsFormGrp.get("referenceNo1").value;
      this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName1").value;
      this.Paymentobj['NEFTDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType2").value == type) {
      this.Paymentobj['NEFTPayAmount'] = this.amount2;
      this.Paymentobj['NEFTNo'] = this.patientDetailsFormGrp.get("referenceNo2").value;
      this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName2").value.BankName;
      this.Paymentobj['NEFTDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType3").value == type) {
      this.Paymentobj['NEFTPayAmount'] = this.amount3;
      this.Paymentobj['NEFTNo'] = this.patientDetailsFormGrp.get("referenceNo3").value;
      this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName3").value.BankName;
      this.Paymentobj['NEFTDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType4").value == type) {
      this.Paymentobj['NEFTPayAmount'] = this.amount4;
      this.Paymentobj['NEFTNo'] = this.patientDetailsFormGrp.get("referenceNo4").value;
      this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName4").value.BankName;
      this.Paymentobj['NEFTDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType5").value == type) {
      this.Paymentobj['NEFTPayAmount'] = this.amount5;
      this.Paymentobj['NEFTNo'] = this.patientDetailsFormGrp.get("referenceNo5").value;
      this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName5").value;
      this.Paymentobj['NEFTDate'] = this.dateTimeObj.date;
      return;
    }
    // console.log(this.Paymentobj)
    return;
  }

  getUpiObj(type: string) {
    if (this.patientDetailsFormGrp.get("paymentType1").value == type) {
      this.Paymentobj['PayTMAmount'] = this.amount1;
      this.Paymentobj['PayTMTranNo'] = this.patientDetailsFormGrp.get("referenceNo1").value;
      // this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName1").value;
      this.Paymentobj['PayTMDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType2").value == type) {
      this.Paymentobj['PayTMAmount'] = this.amount2;
      this.Paymentobj['PayTMTranNo'] = this.patientDetailsFormGrp.get("referenceNo2").value;
      // this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName2").value;
      this.Paymentobj['PayTMDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType3").value == type) {
      this.Paymentobj['PayTMAmount'] = this.amount3;
      this.Paymentobj['PayTMTranNo'] = this.patientDetailsFormGrp.get("referenceNo3").value;
      // this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName3").value;
      this.Paymentobj['PayTMDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType4").value == type) {
      this.Paymentobj['PayTMAmount'] = this.amount4;
      this.Paymentobj['PayTMTranNo'] = this.patientDetailsFormGrp.get("referenceNo4").value;
      // this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName4").value;
      this.Paymentobj['PayTMDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType5").value == type) {
      this.Paymentobj['PayTMAmount'] = this.amount5;
      this.Paymentobj['PayTMTranNo'] = this.patientDetailsFormGrp.get("referenceNo5").value;
      // this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName5").value;
      this.Paymentobj['PayTMDate'] = this.dateTimeObj.date;
      return;
    }
    // console.log(this.Paymentobj)
    return;
  }

  // Payment code Over





  getItemSubform() {
    this.ItemSubform = this.formBuilder.group({
      PatientName: '',
      DoctorName: '',
      extAddress: '',
      MobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10),]],
      PatientType: ['External', [Validators.required]],
      // OP_IP_ID: [0,[Validators.required]],
      TotalAmt: '',
      GSTPer: '',
      DiscAmt: '',
      concessionAmt: [0],
      ConcessionId: [0, [Validators.required]],
      Remark: [''],
      FinalAmount: '',
      BalAmount: '',
      FinalDiscPer: 0,
      FinalDiscAmt: 0,
      FinalTotalAmt: 0,
      FinalNetAmount: 0,
      FinalGSTAmt: 0,
      BalanceAmt: 0,
      CashPay: ['CashPay'],
      referanceNo: '',
      RegID: '',
      PaidbyPatient:'',
      PaidbacktoPatient:'',
      roundoffAmt:'0'
     

      // Credit: [0]
    });
  }


  getConcessionReasonList() {
    this._salesService.getConcessionCombo().subscribe(data => {
      this.ConcessionReasonList = data;
      // this.Ipbillform.get('ConcessionId').setValue(this.ConcessionReasonList[1]);
    })
  }


  getDateTime(dateTimeObj) {
    
    this.dateTimeObj = dateTimeObj;
  }


  getPharItemList() {
    var m_data = {
      "ItemName": `${this._salesService.IndentSearchGroup.get('ItemId').value}%`,
      "StoreId": this._loggedService.currentUserValue.user.storeId || 0
    }
    if (this._salesService.IndentSearchGroup.get('ItemId').value.length >= 1) {
      this._salesService.getItemList(m_data).subscribe(data => {
        this.filteredOptions = data;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }
  }

  getOptionText(option) {
    this.ItemId = option.ItemId;
    if (!option) return '';
    return option.ItemId + ' ' + option.ItemName + ' (' + option.BalanceQty + ')';
  }

  getSelectedObj(obj) {
    // this.registerObj = obj;
    this.ItemName = obj.ItemName;
    this.ItemId = obj.ItemId;
    this.BalanceQty = obj.BalanceQty;
    this.LandedRate = obj.LandedRate;
    if (this.BalanceQty > 0) {
      this.getBatch();
    }
  }

  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._salesService.getLoggedStoreList(vdata).subscribe(data => {
      this.Store1List = data;
      this._salesService.IndentSearchGroup.get('StoreId').setValue(this.Store1List[0]);
      this.StoreName = this._salesService.IndentSearchGroup.get('StoreId').value.StoreName;
    });
  }

  salesIdWiseObj: any;
  getTopSalesDetailsList(MobileNo) {
    var vdata = {
      ExtMobileNo: MobileNo
    }
    this.sIsLoading = 'get-sales-data'
    this._salesService.getTopSalesDetails(vdata).subscribe((data: any) => {
      if (data && data.length > 0) {
        this.reportPrintObjItemList = data as Printsal[];
        this.repeatItemList = data;
        console.log(data)
        this.reportItemPrintObj = data[0] as Printsal;

        this.PatientName = data[0].ExternalPatientName;
        this.DoctorName = data[0].DoctorName;
        this.salesIdWiseObj = this.reportPrintObjItemList.reduce((acc, item: any) => {
          if (!acc[item.SalesId]) {
            acc[item.SalesId] = [];
          }
          acc[item.SalesId].push(item);
          return acc;
        }, {})
        this.sIsLoading = '';
        this.patientname.nativeElement.focus();
        // console.log(this.salesIdWiseObj);
      } else {
        this.sIsLoading = '';
      }
    });
    this.getTopSalesDetailsprint();

  }

  dummySalesIdNameArr = [];
  SalesIdWiseObj: any = {};

  getTopSalesDetailsprint() {
    // 
    var strrowslist = "";
    let onlySalesId = [];
    this.reportPrintObjItemList.forEach(ele => onlySalesId.push(ele.SalesId));

    let SalesidNamesArr = [...new Set(onlySalesId)];
    SalesidNamesArr.forEach(ele => this.dummySalesIdNameArr.push({ SalesId: ele, isHidden: false }));

    this.SalesIdWiseObj = this.reportPrintObjItemList.reduce((acc, item: any) => {
      if (!acc[item.SalesId]) {
        acc[item.SalesId] = [];
      }
      acc[item.SalesId].push(item);
      return acc;
    }, {})
    // console.log(this.SalesIdWiseObj);

    for (let i = 1; i <= this.reportPrintObjItemList.length; i++) {
      var objreportPrint = this.reportPrintObjItemList[i - 1];

      var strabc = this.getSalesIdName(objreportPrint.SalesId) + `
  <div style="display:flex;margin:8px 0">
  <div style="display:flex;width:80px;margin-left:20px;">
      <div>`+ objreportPrint.ItemShortName + `</div>
  </div>
  </div>`;
      strrowslist += strabc;
    }


  }


  getSalesIdName(SalesId: String) {
    let groupDiv;
    for (let i = 0; i < this.dummySalesIdNameArr.length; i++) {
      if (this.dummySalesIdNameArr[i].SalesId == SalesId && !this.dummySalesIdNameArr[i].isHidden) {
        let groupHeader = `<div style="display:flex;width:960px;margin-left:20px;justify-content:space-between;">
          <div> <h3>`+ SalesId + `</h3></div>
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

// to handel functio keys
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    // f10
    if (event.keyCode === 121) {
        this.Formreset();
    }
  // f8
    if (event.keyCode === 119) {
      this. onSave();
  }
    // f9
if (event.keyCode === 120) {
  this.Functionflag=1
  this. onSave();
  
  // if(this.GSalesNo !=0){
  // this. getWhatsappshare();
  // }
}

}


loadingarry:any=[];
  getWhatsappshare() {
    debugger
    var m_data = {
      "insertWhatsappsmsInfo": {
        "mobileNumber": this.MobileNo,
        "smsString": 'PatientDetail' || '',
        "isSent": 0,
        "smsType": 'bulk',
        "smsFlag": 0,
        "smsDate": this.currentDate,// this.datePipe.transform(this._OtManagementService.otreservationFormGroup.get("OPDate").value,"yyyy-MM-dd 00:00:00.000"),
        "tranNo": this.GSalesNo, // this.datePipe.transform(this._OtManagementService.otreservationFormGroup.get("OPDate").value,"yyyy-MM-dd 00:00:00.000"),
        "templateId": 0,
        "smSurl": "info@gmail.com",
        "filePath": this.Filepath || '',
        "smsOutGoingID": 0
      }
    }
    console.log(m_data);
    this._salesService.InsertWhatsappSms(m_data).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'WhatsApp Sms  Data  save Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Whatsapp Sms Data  not saved', 'error');
      }

    });
    this.IsLoading = false;
    // el.button.disbled=false;
  }


  onClear() {

  }
  calculateTotalAmt() {
    let Qty = this._salesService.IndentSearchGroup.get('Qty').value
    if (Qty > this.BalanceQty) {
      Swal.fire("Enter Qty less than Balance");
      this.ItemFormreset();
    }

    if (Qty && this.MRP) {
      this.TotalMRP = (parseInt(Qty) * (this._salesService.IndentSearchGroup.get('MRP').value)).toFixed(2);
      //this.TotalMRP = ((Qty) * (this.MRP)).toFixed(2);
      this.LandedRateandedTotal = (parseInt(Qty) * (this.LandedRate)).toFixed(2);
      this.v_marginamt = (parseFloat(this.TotalMRP) - parseFloat(this.LandedRateandedTotal)).toFixed(2);
      this.PurTotAmt = (parseInt(Qty) * (this.PurchaseRate)).toFixed(2);

      // console.log("Purchase rate");
      // console.log(this.PurchaseRate);
      this.GSTAmount = (((this.UnitMRP) * (this.GSTPer) / 100) * parseInt(Qty)).toFixed(2);
      this.CGSTAmt = (((this.UnitMRP) * (this.CgstPer) / 100) * parseInt(Qty)).toFixed(2);
      this.SGSTAmt = (((this.UnitMRP) * (this.SgstPer) / 100) * parseInt(Qty)).toFixed(2);
      this.IGSTAmt = (((this.UnitMRP) * (this.IgstPer) / 100) * parseInt(Qty)).toFixed(2);

      // console.log(this.GSTAmount);
      this.getDiscPer();
    }



    // txtMRPTotal.Text = Format(Val(txtIssueQty.Text) * Val(txtPerMRP.Text), "0.00")
    // txtTotMRPAftDisAmt.Text = Format(Val(txtIssueQty.Text) * Val(txtPerMRP.Text), "0.00")
    // txtLandedTotal.Text = Format(Val(txtIssueQty.Text) * Val(txtUnitLandedRate.Text), "0.00")
    // txtPurTotAmt.Text = Format(Val(txtIssueQty.Text) * Val(txtPurUnitRateWF.Text), "0.00")
    // Call CalculateVatAmount()

    // Dim lngVatAmount, lngCGSTAmt, lngSGSTAmt, lngIGSTAmt As Double
    // lngVatAmount = (Val(txtPerMRP.Text) * Val(txtVatPer.Text) / 100) * Val(txtIssueQty.Text)
    // lngCGSTAmt = (Val(txtPerMRP.Text) * Val(txtCGSTPer.Text) / 100) * Val(txtIssueQty.Text)
    // lngSGSTAmt = (Val(txtPerMRP.Text) * Val(txtSGSTPer.Text) / 100) * Val(txtIssueQty.Text)
    // lngIGSTAmt = (Val(txtPerMRP.Text) * Val(txtIGSTPer.Text) / 100) * Val(txtIssueQty.Text)

    // footer total
    // txtPerItemVatAmt.Text = Format(lngVatAmount, "0.00")
    // txtCGSTAmt.Text = Format(lngCGSTAmt, "0.00")
    // txtSGSTAmt.Text = Format(lngSGSTAmt, "0.00")
    // txtIGSTAmt.Text = Format(lngIGSTAmt, "0.00")


  }
 
  OnAddUpdate(event) {
    this.sIsLoading = 'save';
    if (this.Itemchargeslist.length > 0) {
      this.Itemchargeslist.forEach((element) => {
        // console.log(element.StockId)  
        // console.log(this.StockId)
        // Swal.fire(element.StockId +'Added Item ' + this.StockId);
        if (element.StockId == this.StockId) {
          // Swal.fire('Selected Item already added in the list');
          this.toastr.warning('Selected Item already added in the list', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          this.ItemFormreset();
        } else {
          this.onAdd();
        }
      });
    }
    else {
      // Swal.fire('Else Condition');
      this.onAdd();
    }
    // if (this.Itemchargeslist.length > 0) {
    //   this.Itemchargeslist.forEach((element) => {
    //     if (element.StockId.toString().toLowerCase().search(this.StockId) !== -1) {
    //       // 
    //       this.stockidflag = false;
    //       // Swal.fire('Item from Present StockID');
    //       console.log(element);
    //       // 
    //       this.Qty= parseInt(this.Qty) + parseInt(element.Qty);
    //       this.TotalMRP = this.Qty * this.UnitMRP,

    //       this.GSTAmount = this.GSTAmount + parseFloat(element.GSTAmount);
    //       this.NetAmt = parseFloat(this.NetAmt) + (parseFloat(element.NetAmt));
    //       this.DiscAmt = parseFloat(element.DiscAmt) + this.DiscAmt;
    //       this.ItemId =element.ItemId;
    //       this.ItemName=element.ItemName;
    //       this.BatchNo=element.BatchNo;
    //       this.StockId=element.StockId; 
    //       this.BatchExpDate=element.BatchExpDate  || '01/01/1900';

    //       this.deleteflag=false;
    //       this.deleteTableRow(event, element);

    //       // this.Itemchargeslist.push(
    //       //   {

    //       //     ItemId: this.ItemId,
    //       //     ItemName: this.ItemName,
    //       //     BatchNo: this.BatchNo,
    //       //     BatchExpDate: this.BatchExpDate || '01/01/1900',
    //       //     Qty: this.Qty + element.Qty,
    //       //     UnitMRP: this.MRP,
    //       //     GSTPer: this.GSTPer || 0,
    //       //     GSTAmount: this.GSTAmount || 0,
    //       //     TotalMRP: this.TotalMRP,
    //       //     DiscAmt: this._salesService.IndentSearchGroup.get('DiscAmt').value || 0,
    //       //     NetAmt: this.NetAmt,
    //       //     StockId: this.StockId,

    //       //   });
    //       // this.saleSelectedDatasource.data = this.Itemchargeslist;
    //       // this.ItemFormreset();

    //     } 
    //     // else {
    //     //   this.stockidflag = true;
    //     // }

    //   });

    // }

    // if (this.stockidflag == true) {
    //   this.onAdd();
    // } else {
    //   this.Itemchargeslist.push(
    //     {
    //       ItemId: this.ItemId,
    //       ItemName: this.ItemName,
    //       BatchNo: this.BatchNo,
    //       BatchExpDate: this.BatchExpDate || '01/01/1900',
    //       Qty: this.Qty,
    //       UnitMRP: this.MRP,
    //       GSTPer: this.GSTPer || 0,
    //       GSTAmount: this.GSTAmount || 0,
    //       TotalMRP: this.TotalMRP,
    //       DiscAmt: this.DiscAmt | 0,
    //       NetAmt: this.NetAmt,
    //       StockId: this.StockId,
    //       VatPer: this.VatPer,
    //       VatAmount: this.GSTAmount,
    //       LandedRate: this.LandedRate,
    //       LandedRateandedTotal: this.LandedRateandedTotal,
    //       CgstPer: this.CgstPer,
    //       CGSTAmt: this.CGSTAmt,
    //       SgstPer: this.SgstPer,
    //       SGSTAmt: this.SGSTAmt,
    //       IgstPer: this.IgstPer,
    //       IGSTAmt: this.IGSTAmt,
    //       PurchaseRate: this.PurchaseRate,
    //       PurTotAmt: this.PurTotAmt
    //     });
    //   this.saleSelectedDatasource.data = this.Itemchargeslist;
    //   // console.log(this.saleSelectedDatasource.data);
    //   this.ItemFormreset();

    // }
    // // console.log(this.saleSelectedDatasource.data);
    // this.itemid.nativeElement.focus();
    // this.add = false;

    // if(this.DiscId==1){
    //   this.ConShow=true;
    //   this.ItemSubform.get('ConcessionId').reset();
    //   this.ItemSubform.get('ConcessionId').setValidators([Validators.required]);
    //   this.ItemSubform.get('ConcessionId').enable();
    //   this.ItemSubform.updateValueAndValidity();
    // }
  }

  Addrepeat(row){
    debugger
    
   this.repeatItemList = row.value;
    this.Itemchargeslist=[];
    this.repeatItemList.forEach((element) => {
      let Qty = parseInt(element.Qty.toString())
      let UnitMrp= element.UnitMRP.split('|')[0];
      console.log(UnitMrp)
 
      // this.LandedRateandedTotal = (parseInt(element.Qty) * (element.LandedRate)).toFixed(2);
      // this.v_marginamt = (parseFloat(this.TotalMRP) - parseFloat(this.LandedRateandedTotal)).toFixed(2);
      // this.PurTotAmt = (parseInt(element.Qty) * (this.PurchaseRate)).toFixed(2);
      let GSTAmount = (((element.UnitMRP) * (this.GSTPer) / 100) * (Qty)).toFixed(2);
      let CGSTAmt = (((element.UnitMRP) * (this.CgstPer) / 100) * (Qty)).toFixed(2);
      let SGSTAmt = (((element.UnitMRP) * (this.SgstPer) / 100) * (Qty)).toFixed(2);
      let IGSTAmt = (((element.UnitMRP) * (this.IgstPer) / 100) * (Qty)).toFixed(2);
      
    
      this.NetAmt = ((UnitMrp) * (element.Qty)).toFixed(2);
      // this.v_marginamt =Math.round(this.NetAmt);

  this.Itemchargeslist.push(
    {
      ItemId: element.ItemId,
      ItemName: element.ItemShortName,
      BatchNo: element.BatchNo,
      BatchExpDate: this.datePipe.transform(element.BatchExpDate , 'dd/MM/YYYY'),
      Qty: element.Qty,
      UnitMRP: UnitMrp || element.UnitMRP,
      TotalMRP: element.TotalAmount,
      GSTPer: row.GSTPer || 0,
      GSTAmount: row.GSTAmount || 0,
      DiscPer: this._salesService.IndentSearchGroup.get('DiscPer').value || 0,
      DiscAmt: this._salesService.IndentSearchGroup.get('DiscAmt').value || 0,
      NetAmt: this.NetAmt,
      RoundNetAmt:Math.round(this.NetAmt),
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
      BalanceQty:this.BalQty,
      SalesDraftId:1
    });
  });
  this.sIsLoading = '';
  this.saleSelectedDatasource.data = this.Itemchargeslist;
  }

  onAdd() {
    this.sIsLoading = 'save';
    let Qty = this._salesService.IndentSearchGroup.get('Qty').value
    if (this.ItemName && (parseInt(Qty) != 0) && this.MRP > 0 && this.NetAmt > 0) {
      this.saleSelectedDatasource.data = [];
      this.Itemchargeslist.push(
        {
          ItemId: this.ItemId,
          ItemName: this.ItemName,
          BatchNo: this.BatchNo,
          BatchExpDate: this.BatchExpDate || '01/01/1900',
          Qty: this.Qty,
          UnitMRP: this.MRP,
          GSTPer: this.GSTPer || 0,
          GSTAmount: this.GSTAmount || 0,
          TotalMRP: this.TotalMRP,
          DiscPer: this._salesService.IndentSearchGroup.get('DiscPer').value || 0,
          DiscAmt: this._salesService.IndentSearchGroup.get('DiscAmt').value || 0,
          NetAmt: this.NetAmt,
          RoundNetAmt:Math.round(this.NetAmt),
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
          BalanceQty:this.BalQty,
          SalesDraftId:1
        });
      this.sIsLoading = '';
      this.saleSelectedDatasource.data = this.Itemchargeslist;
      this.ItemFormreset();
    }
    this.itemid.nativeElement.focus();
    this.add = false;
  }


  getBatch() {
    this.Quantity.nativeElement.focus();
    // setTimeout(() => this.Quantity.nativeElement.focus(), 1000);
    const dialogRef = this._matDialog.open(SalePopupComponent,
      {
        maxWidth: "800px",
        minWidth: '800px',
        width: '800px',
        height: '380px',
        disableClose: true,
        data: {
          "ItemId": this._salesService.IndentSearchGroup.get('ItemId').value.ItemId,
          "StoreId": this._salesService.IndentSearchGroup.get('StoreId').value.storeid
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      this.BatchNo = result.BatchNo;
      this.BatchExpDate = this.datePipe.transform(result.BatchExpDate, "MM-dd-yyyy");
      this.MRP = result.UnitMRP;
      this.Qty = '';
      this.Bal = result.BalanceAmt;
      this.GSTPer = result.VatPercentage;

      this.TotalMRP = this.Qty * this.MRP;
      this.DiscAmt = 0;
      this.NetAmt = this.TotalMRP;
      this.BalanceQty = result.BalanceQty;
      this.ItemObj = result;

      this.VatPer = result.VatPercentage;
      // console.log(this.VatPer);
      this.CgstPer = result.CGSTPer;
      this.SgstPer = result.SGSTPer;
      this.IgstPer = result.IGSTPer;

      this.VatAmount = result.VatPercentage;
      this.StockId = result.StockId
      this.StoreId = result.StoreId;
      this.LandedRate = result.LandedRate;
      this.PurchaseRate = result.PurchaseRate;
      this.UnitMRP = result.UnitMRP;
    });

    // this.Quantity.nativeElement.focus();
  }

  focusNextService() {
    // this.renderer.selectRootElement('#myInput').focus();
  }

  Colorchange(){
    
  }

  ItemFormreset() {
    this.BatchNo = "";
    this.BatchExpDate = "01/01/1900"
    this.MRP = 0;
    this.Qty = '';
    this.Bal = 0;
    this.GSTPer = 0;
    this.DiscPer = 0;
    this.DiscAmt = 0;
    this.TotalMRP = 0;
    this.NetAmt = 0;
    this.v_marginamt = 0;
    this._salesService.IndentSearchGroup.get('ItemId').reset('');
    this.filteredOptions = [];

    // this.add=false;
    this.getPharItemList();
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

    this.ItemSubform.get('PatientType').setValue('External');
    this.ItemSubform.get('CashPay').setValue('CashPay');

    this.IsOnlineRefNo = false;
    this.ItemSubform.get('referanceNo').reset('');

    this.ConShow = false;
    this.ItemSubform.get('ConcessionId').clearValidators();
    this.ItemSubform.get('ConcessionId').updateValueAndValidity();
    this.ItemSubform.get('ConcessionId').disable();

    this.saleSelectedDatasource.data=[];
  }

  getGSTAmtSum(element) {
    this.FinalDiscAmt = (element.reduce((sum, { DiscAmt }) => sum += +(DiscAmt || 0), 0)).toFixed(2);
    return this.FinalGSTAmt;
  }

  getNetAmtSum(element) {

    
    this.FinalNetAmount = (element.reduce((sum, { NetAmt }) => sum += +(NetAmt || 0), 0)).toFixed(2);
    this.FinalTotalAmt = (element.reduce((sum, { TotalMRP }) => sum += +(TotalMRP || 0), 0)).toFixed(2);
    this.FinalDiscAmt = (element.reduce((sum, { DiscAmt }) => sum += +(DiscAmt || 0), 0)).toFixed(2);
    this.FinalGSTAmt = (element.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0)).toFixed(2);
    this.roundoffAmt=  Math.round(this.ItemSubform.get("FinalNetAmount").value)// Math.round(this.FinalNetAmount); //(element.reduce((sum, { RoundNetAmt }) => sum += +(RoundNetAmt || 0), 0)).toFixed(2) || Math.round(this.FinalNetAmount);
   
    this.DiffNetRoundAmt= (parseFloat(this.roundoffAmt) - parseFloat(this.FinalNetAmount)).toFixed(2);
    return this.FinalNetAmount;
  }
  getMarginSum(element) {
    this.TotalMarginAmt = (element.reduce((sum, { MarginAmt }) => sum += +(MarginAmt || 0), 0)).toFixed(2);
    return this.TotalMarginAmt;
  }

  calculateDiscAmt() {
    let ItemDiscAmount = this._salesService.IndentSearchGroup.get('DiscAmt').value;
    // let PurTotalAmount = this.PurTotAmt;
    let LandedTotalAmount = this.LandedRateandedTotal;
    let m_marginamt = (parseFloat(this.TotalMRP) - parseFloat(ItemDiscAmount)).toFixed(2);
    this.v_marginamt = ((parseFloat(this.TotalMRP) - parseFloat(ItemDiscAmount)) - (parseFloat(LandedTotalAmount))).toFixed(2);

    if (parseFloat(this.DiscAmt) > 0 && (parseFloat(this.DiscAmt)) < parseFloat(this.TotalMRP)) {
      // this.DiscId=1;
      this.ConShow = true;
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').setValidators([Validators.required]);
      this.ItemSubform.get('ConcessionId').enable();
      if (parseFloat(m_marginamt) <= parseFloat(LandedTotalAmount)) {
        Swal.fire('Discount amount greater than Purchase amount, Please check !');
        this.ItemFormreset();
        this.itemid.nativeElement.focus();
        this.ConShow = false;
        this.ItemSubform.get('ConcessionId').clearValidators();
        this.ItemSubform.get('ConcessionId').updateValueAndValidity();
      } else {
        this.NetAmt = (this.TotalMRP - (this._salesService.IndentSearchGroup.get('DiscAmt').value)).toFixed(2);
        this.add = true;
        this.addbutton.focus();
      }
    }
    else if (parseFloat(this.DiscAmt) > parseFloat(this.NetAmt)) {
      Swal.fire('Check Discount Amount !')
      this.ConShow = false;
      this.ItemSubform.get('ConcessionId').clearValidators();
      this.ItemSubform.get('ConcessionId').updateValueAndValidity();
    }
    if (parseFloat(this._salesService.IndentSearchGroup.get('DiscAmt').value) == 0) {
      this.add = true;
      this.ConShow = false;
      this.ItemSubform.get('ConcessionId').clearValidators();
      this.ItemSubform.get('ConcessionId').updateValueAndValidity();
      this.addbutton.focus();
    }
  }
  getDiscPer() {
    let DiscPer = this._salesService.IndentSearchGroup.get('DiscPer').value
    if (this.DiscPer > 0) {
      this.chkdiscper = true;
      this.DiscAmt = ((this.TotalMRP * (this.DiscPer)) / 100).toFixed(2);
      this.NetAmt = (this.TotalMRP - this.DiscAmt).toFixed(2);
      this.ItemSubform.get('DiscAmt').disable();
    } else {
      this.chkdiscper = false;
      this.DiscAmt = 0;
      this.ItemSubform.get('DiscAmt').enable();
      this.NetAmt = (this.TotalMRP - this.DiscAmt).toFixed(2);
    }
  }

  getFinalDiscperAmt() {
    let Disc = this.ItemSubform.get('FinalDiscPer').value;
    let DiscAmt = this.ItemSubform.get('FinalDiscAmt').value;

    if (Disc > 0 || DiscAmt > 0) {
      this.ConShow = true
      this.FinalDiscAmt = ((this.FinalTotalAmt * (Disc)) / 100).toFixed(2);
      this.ItemSubform.get('FinalDiscAmt').setValue(this.FinalDiscAmt);
      this.FinalNetAmount = ((this.FinalTotalAmt) - (this.FinalDiscAmt)).toFixed(2);
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').setValidators([Validators.required]);
      this.ItemSubform.get('ConcessionId').enable();
      this.ItemSubform.updateValueAndValidity();

    } else {
      this.ConShow = false
      this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').clearValidators();
      this.ItemSubform.get('ConcessionId').updateValueAndValidity();
      // this.ConseId.nativeElement.focus();
    }

    this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);
  }

  getFinalDiscAmount() {
    // console.log("total disc");
    let totDiscAmt = this.ItemSubform.get('FinalDiscAmt').value
    // console.log(totDiscAmt);
    // console.log(this.FinalDiscAmt);
    if (totDiscAmt > 0) {
      this.FinalNetAmount = ((this.FinalNetAmount) - (this.FinalDiscAmt)).toFixed(2);
      this.ConShow = true
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').setValidators([Validators.required]);
      this.ItemSubform.get('ConcessionId').enable();

    } else {
      this.ConShow = false
      this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').clearValidators();
      this.ItemSubform.get('ConcessionId').updateValueAndValidity();
      //this.ConseId.nativeElement.focus();
    }
  }
  onChangePatientType(event) {
    if (event.value == 'OP') {
      this.OP_IPType = 0;
      this.RegId = "";
      this.paymethod = true;
      this.ItemSubform.get('MobileNo').clearValidators();
      this.ItemSubform.get('PatientName').clearValidators();
      this.ItemSubform.get('MobileNo').updateValueAndValidity();
      this.ItemSubform.get('PatientName').updateValueAndValidity();
    }
    else if (event.value == 'IP') {
      this.OP_IPType = 1;
      this.RegId = "";
      this.paymethod = true;
      this.ItemSubform.get('MobileNo').clearValidators();
      this.ItemSubform.get('PatientName').clearValidators();
      this.ItemSubform.get('MobileNo').updateValueAndValidity();
      this.ItemSubform.get('PatientName').updateValueAndValidity();
    } else {
      this.ItemSubform.get('MobileNo').reset();
      this.ItemSubform.get('MobileNo').setValidators([Validators.required]);
      this.ItemSubform.get('MobileNo').enable();
      this.ItemSubform.get('PatientName').reset();
      this.ItemSubform.get('PatientName').setValidators([Validators.required]);
      this.ItemSubform.get('PatientName').enable();
      this.ItemSubform.updateValueAndValidity();
      this.paymethod = false;
      this.OP_IPType = 2;
    }
  }
  onChangePaymentMode(event) {
    if (event.value == 'Online') {
      this.IsOnlineRefNo = true;

      this.ItemSubform.get('referanceNo').reset();
      this.ItemSubform.get('referanceNo').setValidators([Validators.required]);
      this.ItemSubform.get('referanceNo').enable();
      // other payment Option   
      this.isPaymentSelected = false;

    } else if (event.value == 'Other') {
      this.isPaymentSelected = true;
      this.amount1 = this.FinalNetAmount;
      this.paidAmt = this.FinalNetAmount;
      this.netPayAmt = this.FinalNetAmount;
      this.getBalanceAmt();
      this.paymentRowObj["cash"] = true;
      this.onPaymentChange(1, 'cash');

      this.IsOnlineRefNo = false;
      this.ItemSubform.get('referanceNo').clearValidators();
      this.ItemSubform.get('referanceNo').updateValueAndValidity();
    } else if (event.value == "PayOption") {
      this.IsOnlineRefNo = false;
      this.ItemSubform.get('referanceNo').clearValidators();
      this.ItemSubform.get('referanceNo').updateValueAndValidity();
    }
    else {
      this.IsOnlineRefNo = false;
      this.ItemSubform.get('referanceNo').clearValidators();
      this.ItemSubform.get('referanceNo').updateValueAndValidity();
      // other payment Option   
      this.isPaymentSelected = false;
    }

  }
  // OtherPayment(){
  //   // 
  //     this.amount1=this.FinalNetAmount;
  //     this.paidAmt = this.FinalNetAmount;
  //     this.isPaymentSelected=true;
  //     this.netPayAmt=this.FinalNetAmount;
  //     this.getBalanceAmt();
  //     this.paymentRowObj["cash"] = true;
  //     this.onPaymentChange(1, 'cash');

  //   }

  convertToWord(e) {
    return converter.toWords(e);
  }


  transform2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
  }

  transform1(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy');
    return value;
  }

  // PRINT 
  print1() {

    let popupWin, printContents;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
    // popupWin.document.open();
    popupWin.document.write(` <html>
    <head><style type="text/css">`);
    popupWin.document.write(`
      </style>
          <title></title>
      </head>
    `);
    popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
    </html>`);
    if (this.reportPrintObjList.length > 0) {
      // if(this.reportPrintObjList[0].BalanceAmt === 0) {
      //   popupWin.document.getElementById('trAmountBalance').style.display = 'none';
      // }
      // if (this.reportPrintObjList[0].ConcessionAmt === 0) {
      //   popupWin.document.getElementById('trAmountconcession').style.display = 'none';
      // }
      // if (this.reportPrintObjList[0].BalanceAmt === 0) {
      //   popupWin.document.getElementById('idBalAmt').style.display = 'none';
      // }
    }
    popupWin.document.close();
  }

  deleteTableRow(event, element) {
    // if (this.key == "Delete") {
    let index = this.Itemchargeslist.indexOf(element);
    if (index >= 0) {
      this.Itemchargeslist.splice(index, 1);
      this.saleSelectedDatasource.data = [];
      this.saleSelectedDatasource.data = this.Itemchargeslist;
    }
    Swal.fire('Success !', 'ItemList Row Deleted Successfully', 'success');

    // }
  }

  Paymentobj = {};

  chargeslist1: any = [];
  onCheckBalQty() {

    this.saleSelectedDatasource.data.forEach((element) => {
      
      let SelectQuery = "select isnull(BalanceQty,0) as BalanceQty from lvwCurrentBalQtyCheck where StoreId = " + this.StoreId + " AND ItemId = " + element.ItemId + ""
      // and LandedRate = " & dgvSales.Item(10, J).Value & " and PurUnitRateWF = " & dgvSales.Item(13, J).Value & ""
      
      // console.log(SelectQuery);

      this._salesService.getchargesList(SelectQuery).subscribe(data => {

        this.chargeslist1 = data;
        if (this.chargeslist1.length > 0) {
          if (this.chargeslist1[0].BalanceQty >= element.Qty) {
            
            this.QtyBalchk = 1;

          }
          else {
            Swal.fire("Balance Qty is :", this.chargeslist1[0].BalanceQty)
            this.QtyBalchk = 0;
            Swal.fire("Balance Qty is Less than Selected Item Qty for Item :", element.ItemId + "Balance Qty:",)
          }
        }

      },
        (error) => {
          Swal.fire("No Item Found!!")
        });

    });
  }

  DeleteDraft(){

    
    let Query = "delete T_SalesDraftHeader where DSalesId=" + this.DraftID+ "";
    this._salesService.getDelDrat(Query).subscribe(data => {
      if(data){
      this.getDraftorderList();
      }
    });
  }


  onSave() {
    let patientTypeValue = this.ItemSubform.get('PatientType').value;
    if ((patientTypeValue == 'OP' || patientTypeValue == 'IP')
      && (this.registerObj.AdmissionID == '' || this.registerObj.AdmissionID == null || this.registerObj.AdmissionID == undefined)) {
      this.toastr.warning('Please select Patient Type.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.ItemSubform.get('CashPay').value == 'CashPay' || this.ItemSubform.get('CashPay').value == 'Online') {
      this.onCashOnlinePaySave()
    }
    // else if (this.ItemSubform.get('CashPay').value == 'Credit') {
    //   this.onCreditpaySave()
    // }
    else if (this.ItemSubform.get('CashPay').value == 'PayOption') {
      this.onSavePayOption()
    }
    
    
  }


  onCashOnlinePaySave() {
    
    let nowDate = new Date();
    let nowDate1 = nowDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
    this.newDateTimeObj = { date: nowDate1[0], time: nowDate1[1] };
    // console.log(this.newDateTimeObj);

    let NetAmt = (this.ItemSubform.get('FinalNetAmount').value);
    let ConcessionId = 0;
    if (this.ItemSubform.get('ConcessionId').value)
      ConcessionId = this.ItemSubform.get('ConcessionId').value.ConcessionId;

    let SalesInsert = {};
    SalesInsert['Date'] = this.newDateTimeObj.date;
    SalesInsert['time'] = this.newDateTimeObj.time;

    if (this.ItemSubform.get('PatientType').value == 'External') {
      SalesInsert['oP_IP_Type'] = 2;
      SalesInsert['oP_IP_ID'] = this.OP_IP_Id;
    } else if (this.ItemSubform.get('PatientType').value == 'OP') {
      SalesInsert['oP_IP_Type'] = 0;
      SalesInsert['oP_IP_ID'] = this.OP_IP_Id;
    } else if (this.ItemSubform.get('PatientType').value == 'IP') {
      SalesInsert['oP_IP_Type'] = 1;
      SalesInsert['oP_IP_ID'] = this.OP_IP_Id;
    }
    SalesInsert['totalAmount'] = this.ItemSubform.get('FinalTotalAmt').value ||0; //this.FinalTotalAmt
    SalesInsert['vatAmount'] = this.ItemSubform.get('FinalGSTAmt').value || 0;
    SalesInsert['discAmount'] = this.ItemSubform.get('FinalDiscAmt').value || 0; //this.FinalDiscAmt;
    SalesInsert['netAmount'] = this.ItemSubform.get('FinalNetAmount').value || 0;
    SalesInsert['paidAmount'] = this.ItemSubform.get('roundoffAmt').value; // NetAmt;
    SalesInsert['balanceAmount'] = 0;
    SalesInsert['concessionReasonID'] = ConcessionId || 0;
    SalesInsert['concessionAuthorizationId'] = 0;
    SalesInsert['isSellted'] = 0;
    SalesInsert['isPrint'] = 0;
    SalesInsert['isFree'] = 0;
    SalesInsert['unitID'] = 1;
    SalesInsert['addedBy'] = this._loggedService.currentUserValue.user.id,
    SalesInsert['externalPatientName'] = this.PatientName || '';
    SalesInsert['doctorName'] = this.DoctorName || '';
    SalesInsert['storeId'] = this._salesService.IndentSearchGroup.get('StoreId').value.storeid;
    SalesInsert['isPrescription'] = 0;
    SalesInsert['creditReason'] = '';
    SalesInsert['creditReasonID'] = 0;
    SalesInsert['wardId'] = 0;
    SalesInsert['bedID'] = 0;
    SalesInsert['discper_H'] = 0;
    SalesInsert['isPurBill'] = 0;
    SalesInsert['isBillCheck'] = 0;
    SalesInsert['salesHeadName'] = ""
    SalesInsert['salesTypeId'] = 0;
    SalesInsert['salesId'] = 0;
    SalesInsert['extMobileNo'] = this.MobileNo || 0;

    let salesDetailInsertarr = [];
    this.saleSelectedDatasource.data.forEach((element) => {

      console.log(element);
      // "2025-06-01"
      let salesDetailInsert = {};
      salesDetailInsert['salesID'] = 0;
      salesDetailInsert['itemId'] = element.ItemId;
      salesDetailInsert['batchNo'] = element.BatchNo;
      salesDetailInsert['batchExpDate'] =element.BatchExpDate; //|| this.datePipe.transform(element.BatchExpDate,"yyyy/MM/dd");
      salesDetailInsert['unitMRP'] = element.UnitMRP;
      salesDetailInsert['qty'] = element.Qty;
      salesDetailInsert['totalAmount'] = element.TotalMRP;
      salesDetailInsert['vatPer'] = element.VatPer;
      salesDetailInsert['vatAmount'] = element.VatAmount;
      salesDetailInsert['discPer'] = element.DiscPer;
      salesDetailInsert['discAmount'] = element.DiscAmt;
      salesDetailInsert['grossAmount'] = element.NetAmt;
      salesDetailInsert['landedPrice'] = element.LandedRate;
      salesDetailInsert['totalLandedAmount'] = element.LandedRateandedTotal;
      salesDetailInsert['purRateWf'] = element.PurchaseRate;
      salesDetailInsert['purTotAmt'] = element.PurTotAmt;
      salesDetailInsert['cgstPer'] = element.CgstPer;
      salesDetailInsert['cgstAmt'] = element.CGSTAmt;
      salesDetailInsert['sgstPer'] = element.SgstPer;
      salesDetailInsert['sgstAmt'] = element.SGSTAmt;
      salesDetailInsert['igstPer'] = element.IgstPer
      salesDetailInsert['igstAmt'] = element.IGSTAmt
      salesDetailInsert['isPurRate'] = 0;
      salesDetailInsert['stkID'] = element.StockId;
      salesDetailInsertarr.push(salesDetailInsert);
    });

    let updateCurStkSalestarr = [];
    this.saleSelectedDatasource.data.forEach((element) => {
      let updateCurStkSales = {};
      updateCurStkSales['itemId'] = element.ItemId;
      updateCurStkSales['issueQty'] = element.Qty;
      updateCurStkSales['storeID'] = this._loggedService.currentUserValue.user.storeId,
      updateCurStkSales['stkID'] = element.StockId;
      updateCurStkSalestarr.push(updateCurStkSales);
    });

    let cal_DiscAmount_Sales = {};
    cal_DiscAmount_Sales['salesID'] = 0;

    let cal_GSTAmount_Sales = {};
    cal_GSTAmount_Sales['salesID'] = 0;


    
    let salesDraftStatusUpdate = {};
    salesDraftStatusUpdate['DSalesId'] = this.DraftID || 0;
    salesDraftStatusUpdate['IsClosed'] =1

    let PaymentInsertobj = {};
   
      PaymentInsertobj['BillNo'] = 0,
      PaymentInsertobj['ReceiptNo'] = '',
      PaymentInsertobj['PaymentDate'] = this.newDateTimeObj.date; //  this.dateTimeObj.date;
      PaymentInsertobj['PaymentTime'] = this.newDateTimeObj.time; //  this.dateTimeObj.time;
      PaymentInsertobj['CashPayAmount'] = this.ItemSubform.get('roundoffAmt').value; //NetAmt;
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
      PaymentInsertobj['TransactionType'] = 4;
      PaymentInsertobj['Remark'] = '',
      PaymentInsertobj['AddBy'] = this._loggedService.currentUserValue.user.id,
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
      PaymentInsertobj['PayTMDate'] = '01/01/1900'
   

    let submitData = {
      "salesInsert": SalesInsert,
      "salesDetailInsert": salesDetailInsertarr,
      "updateCurStkSales": updateCurStkSalestarr,
      "cal_DiscAmount_Sales": cal_DiscAmount_Sales,
      "cal_GSTAmount_Sales": cal_GSTAmount_Sales,
      "salesDraftStatusUpdate":salesDraftStatusUpdate,
      "salesPayment": PaymentInsertobj
    };
    console.log(submitData)
    let vMobileNo=this.MobileNo;
    this._salesService.InsertCashSales(submitData).subscribe(response => {
      if (response) {
        this.toastr.success('Record Saved Successfully.', 'Save !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.getPrint3(response);
        this.getWhatsappshareSales(response,vMobileNo);
        this.Itemchargeslist = [];
        this._matDialog.closeAll();
      
      } else {
        this.toastr.error('API Error!', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
      this.sIsLoading = '';
    }, error => {
      this.toastr.error('API Error!', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });

    this.ItemFormreset();
    this.patientDetailsFormGrp.reset();
    this.Formreset();
    this.ItemSubform.get('ConcessionId').reset();
    // this.PatientName = '';
    // this.MobileNo = '';
    this.saleSelectedDatasource.data = [];
    // }
  }
  onSavePayOption() {


    this.vPatientType=this.ItemSubform.get('PatientType').value;

    let PatientHeaderObj = {};
    PatientHeaderObj['Date'] =  this.dateTimeObj.date;
    PatientHeaderObj['PatientName'] = this.PatientName;
    PatientHeaderObj['OPD_IPD_Id'] = this.OP_IP_Id;
    PatientHeaderObj['NetPayAmount'] = this.ItemSubform.get('roundoffAmt').value; //this.ItemSubform.get('FinalNetAmount').value;
    const dialogRef = this._matDialog.open(OpPaymentNewComponent,
      {
        
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "Phar-SalesPay"
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      // let CurrDate = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
      // let dateobj=this.datePipe.transform( result.submitDataPay.ipPaymentInsert.PaymentDate, 'MM/dd/yyyy')
      
      // if(CurrDate == dateobj){
    //   if(this.dateTimeObj.date == result.submitDataPay.ipPaymentInsert.PaymentDate)
    // {
      if (result?.IsSubmitFlag == true) {
        let cashpay = result.submitDataPay.ipPaymentInsert.CashPayAmount;
        let chequepay = result.submitDataPay.ipPaymentInsert.ChequePayAmount;
        let cardpay = result.submitDataPay.ipPaymentInsert.CardPayAmount;
        let Neftpay = result.submitDataPay.ipPaymentInsert.NEFTPayAmount;
        let onlinepay = result.submitDataPay.ipPaymentInsert.PayTMAmount;

        if ((cashpay == 0 && chequepay == 0 && cardpay == 0 && Neftpay == 0 && onlinepay == 0) == false) {
          let NetAmt = (this.ItemSubform.get('FinalNetAmount').value);
          let ConcessionId = 0;
          if (this.ItemSubform.get('ConcessionId').value)
            ConcessionId = this.ItemSubform.get('ConcessionId').value.ConcessionId;

            let nowDate = new Date();
            let nowDate1 = nowDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
            this.newDateTimeObj = { date: nowDate1[0], time: nowDate1[1] };

          let SalesInsert = {};
          SalesInsert['Date'] =  this.newDateTimeObj.date;
          SalesInsert['time'] = this.newDateTimeObj.time;

          if (this.ItemSubform.get('PatientType').value == 'External') {
            SalesInsert['oP_IP_Type'] = 2;
            SalesInsert['oP_IP_ID'] = this.OP_IP_Id;
          } else if (this.ItemSubform.get('PatientType').value == 'OP') {
            SalesInsert['oP_IP_Type'] = 0;
            SalesInsert['oP_IP_ID'] = this.OP_IP_Id;
          } else if (this.ItemSubform.get('PatientType').value == 'IP') {
            SalesInsert['oP_IP_Type'] = 1;
            SalesInsert['oP_IP_ID'] = this.OP_IP_Id;
          }
          SalesInsert['totalAmount'] = this.ItemSubform.get('FinalTotalAmt').value || 0; //this.FinalTotalAmt
          SalesInsert['vatAmount'] = this.ItemSubform.get('FinalGSTAmt').value || 0;
          SalesInsert['discAmount'] = this.ItemSubform.get('FinalDiscAmt').value || 0; //this.FinalDiscAmt;
          SalesInsert['netAmount'] = this.ItemSubform.get('FinalNetAmount').value || 0;
          SalesInsert['paidAmount'] = this.ItemSubform.get('roundoffAmt').value || 0; // NetAmt;
          SalesInsert['balanceAmount'] = 0;
          SalesInsert['concessionReasonID'] = ConcessionId || 0;
          SalesInsert['concessionAuthorizationId'] = 0;
          SalesInsert['isSellted'] = 0;
          SalesInsert['isPrint'] = 0;
          SalesInsert['isFree'] = 0;
          SalesInsert['unitID'] = 1;
          SalesInsert['addedBy'] = this._loggedService.currentUserValue.user.id,
          SalesInsert['externalPatientName'] = this.PatientName || '';
          SalesInsert['doctorName'] = this.DoctorName || '';
          SalesInsert['storeId'] = this._salesService.IndentSearchGroup.get('StoreId').value.storeid;
          SalesInsert['isPrescription'] = 0;
          SalesInsert['creditReason'] = '';
          SalesInsert['creditReasonID'] = 0;
          SalesInsert['wardId'] = 0;
          SalesInsert['bedID'] = 0;
          SalesInsert['discper_H'] = 0;
          SalesInsert['isPurBill'] = 0;
          SalesInsert['isBillCheck'] = 0;
          SalesInsert['salesHeadName'] = ""
          SalesInsert['salesTypeId'] = 0;
          SalesInsert['salesId'] = 0;
          SalesInsert['extMobileNo'] = this.MobileNo || 0;

          let salesDetailInsertarr = [];
          this.saleSelectedDatasource.data.forEach((element) => {
            // console.log(element);
            let salesDetailInsert = {};
            salesDetailInsert['salesID'] = 0;
            salesDetailInsert['itemId'] = element.ItemId;
            salesDetailInsert['batchNo'] = element.BatchNo;
            salesDetailInsert['batchExpDate'] =element.BatchExpDate;// this.datePipe.transform(element.BatchExpDate,"yyyy/mm/dd");//element.BatchExpDate;
            salesDetailInsert['unitMRP'] = element.UnitMRP;
            salesDetailInsert['qty'] = element.Qty;
            salesDetailInsert['totalAmount'] = element.TotalMRP;
            salesDetailInsert['vatPer'] = element.VatPer;
            salesDetailInsert['vatAmount'] = element.VatAmount;
            salesDetailInsert['discPer'] = element.DiscPer;
            salesDetailInsert['discAmount'] = element.DiscAmt;
            salesDetailInsert['grossAmount'] = element.NetAmt;
            salesDetailInsert['landedPrice'] = element.LandedRate;
            salesDetailInsert['totalLandedAmount'] = element.LandedRateandedTotal;
            salesDetailInsert['purRateWf'] = element.PurchaseRate;
            salesDetailInsert['purTotAmt'] = element.PurTotAmt;
            salesDetailInsert['cgstPer'] = element.CgstPer;
            salesDetailInsert['cgstAmt'] = element.CGSTAmt;
            salesDetailInsert['sgstPer'] = element.SgstPer;
            salesDetailInsert['sgstAmt'] = element.SGSTAmt;
            salesDetailInsert['igstPer'] = element.IgstPer
            salesDetailInsert['igstAmt'] = element.IGSTAmt
            salesDetailInsert['isPurRate'] = 0;
            salesDetailInsert['stkID'] = element.StockId;
            salesDetailInsertarr.push(salesDetailInsert);
          });
          let updateCurStkSalestarr = [];
          this.saleSelectedDatasource.data.forEach((element) => {
            let updateCurStkSales = {};
            updateCurStkSales['itemId'] = element.ItemId;
            updateCurStkSales['issueQty'] = element.Qty;
            updateCurStkSales['storeID'] = this._loggedService.currentUserValue.user.storeId,
            updateCurStkSales['stkID'] = element.StockId;
            updateCurStkSalestarr.push(updateCurStkSales);
          });

          let cal_DiscAmount_Sales = {};
          cal_DiscAmount_Sales['salesID'] = 0;

          let cal_GSTAmount_Sales = {};
          cal_GSTAmount_Sales['salesID'] = 0;

           
    let salesDraftStatusUpdate = {};
    salesDraftStatusUpdate['DSalesId'] = this.DraftID || 0;
    salesDraftStatusUpdate['IsClosed'] =1

          let submitData = {
            "salesInsert": SalesInsert,
            "salesDetailInsert": salesDetailInsertarr,
            "updateCurStkSales": updateCurStkSalestarr,
            "cal_DiscAmount_Sales": cal_DiscAmount_Sales,
            "cal_GSTAmount_Sales": cal_GSTAmount_Sales,
            "salesDraftStatusUpdate":salesDraftStatusUpdate,
            "salesPayment": result.submitDataPay.ipPaymentInsert
          };
          let vMobileNo=this.MobileNo;
          console.log(submitData)
          this._salesService.InsertCashSales(submitData).subscribe(response => {
            if (response) {
              this.toastr.success('Record Saved Successfully.', 'Save !', {
                toastClass: 'tostr-tost custom-toast-success',
              });
              this.getPrint3(response);
              this.getWhatsappshareSales(response,vMobileNo)
              this.Itemchargeslist = [];
              this._matDialog.closeAll();
            } else {
              this.toastr.error('API Error!', 'Error !', {
                toastClass: 'tostr-tost custom-toast-error',
              });
            }
            this.sIsLoading = '';
            // });
          }, error => {
            
            this.toastr.error('API Error!', 'Error !', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          });

          this.ItemFormreset();
          this.patientDetailsFormGrp.reset();
          this.Formreset();
          this.ItemSubform.get('ConcessionId').reset();
          this.PatientName = '';
          this.MobileNo = '';
          this.saleSelectedDatasource.data = [];
        }
        else{
          this.toastr.warning('Please check Payment Mode and Amount (Now it is Selected Zero).', 'Save !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
        }
      }
    else{
      debugger
      if(this.vPatientType =='External'){
        // Swal.fire("Plz Chk Payment Data !");
      }else{
        Swal.fire('Do You Want to generate Credit Bill ?').then((result) => {
          if (result.isConfirmed) {
            this.onCreditpaySave();
          }
        });
     
      
      }}
    })
  
  }
 
  
  getPrint3(el) {
    var D_data = {
      "SalesID": el,// 
      "OP_IP_Type": this.OP_IPType
    }
    let printContents;
    this.subscriptionArr.push(
      this._salesService.getSalesPrint(D_data).subscribe(res => {
        this.reportPrintObjList = res as Printsal[];
        this.reportPrintObj = res[0] as Printsal;
        setTimeout(() => {
          this.print3();
        }, 1000);
      })
    );
  }

  getWhatsappshareSales(el,vmono) {
    var m_data = {
      "insertWhatsappsmsInfo": {
        "mobileNumber": vmono || 0,
        "smsString": "Dear" + vmono + ",Your Sales Bill has been successfully completed. UHID is " + el + " For, more deatils, call 08352249399. Thank You, JSS Super Speciality Hospitals, Near S-Hyper Mart, Vijayapur " || '',
        "isSent": 0,
        "smsType": 'Sales',
        "smsFlag": 0,
        "smsDate": this.currentDate,
        "tranNo": el,
        "PatientType":2,//el.PatientType,
        "templateId": 0,
        "smSurl": "info@gmail.com",
        "filePath": this.Filepath || '',
        "smsOutGoingID": 0
      }
    }
    this._BrowsSalesBillService.InsertWhatsappSales(m_data).subscribe(response => {
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
    this.IsLoading = false;
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

  getDiscountCellCal(contact,DiscPer){
debugger
// let DiscOld=DiscPer;
    let DiscAmt;
    let TotalMRP=contact.TotalMRP;

    if (DiscPer > 0) {
      DiscAmt = ((contact.TotalMRP * (DiscPer)) / 100).toFixed(2);
      let NetAmt = (parseFloat(contact.TotalMRP) - parseFloat(DiscAmt)).toFixed(2);

      contact.DiscAmt= DiscAmt || 0,
      contact.NetAmt= NetAmt
    } else {
      let DiscAmt = 0;
      let NetAmt =  (parseFloat(contact.TotalMRP)).toFixed(2);

      contact.DiscAmt= DiscAmt || 0,
      contact.NetAmt= NetAmt 
    }


    let ItemDiscAmount = DiscAmt// this._salesService.IndentSearchGroup.get('DiscAmt').value;
    // let PurTotalAmount = this.PurTotAmt;
    let LandedTotalAmount =(parseInt(contact.Qty) * (contact.LandedRate)).toFixed(2);
    // this.LandedRateandedTotal = (parseInt(this.RQty) * (contact.LandedRate)).toFixed(2);
    let m_marginamt = (parseFloat(contact.TotalMRP) - parseFloat(ItemDiscAmount)).toFixed(2);
    let v_marginamt = ((parseFloat(contact.TotalMRP) - parseFloat(ItemDiscAmount)) - (parseFloat(LandedTotalAmount))).toFixed(2);

    if (parseFloat(DiscAmt) > 0 && (parseFloat(DiscAmt)) < parseFloat(TotalMRP)) {
      
      if (parseFloat(m_marginamt) <= parseFloat(LandedTotalAmount)) {
        Swal.fire('Discount amount greater than Purchase amount, Please check !');
        
        contact.DiscPer= this.DiscOld;
        DiscAmt = 0// ((contact.TotalMRP * (this.DiscOld)) / 100).toFixed(2);
        let NetAmt = parseFloat(contact.TotalMRP);

        contact.DiscAmt= DiscAmt || 0,
         contact.NetAmt= NetAmt

      } else {
        // this.NetAmt = (this.TotalMRP - (this._salesService.IndentSearchGroup.get('DiscAmt').value)).toFixed(2);
      }
    }
   
    

  }

  getCellCalculation(contact, Qty) {
    debugger
    this.StockId=contact.StockId;
    this.Qty=Qty;
    if (contact.Qty != 0 && contact.Qty != null) {
      // console.log(contact.Qty);
      this.BalChkList = [];
      this.StoreId = this._loggedService.currentUserValue.user.storeId
      let SelectQuery = "select isnull(BalanceQty,0) as BalanceQty from lvwCurrentBalQtyCheck where StoreId = " + this.StoreId + " AND ItemId = " + contact.ItemId + " AND  BatchNo='" + contact.BatchNo + "' AND  StockId=" + contact.StockId + ""
      console.log(SelectQuery);
      this._salesService.getchargesList(SelectQuery).subscribe(data => {
        this.BalChkList = data;
        // console.log(this.BalChkList);
        if (this.BalChkList.length > 0) {
          if (this.BalChkList[0].BalanceQty >= contact.Qty) {
            this.QtyBalchk = 1;
            
            this.tblCalucation(contact,contact.Qty)
          }
          else {
            this.QtyBalchk = 1;
            Swal.fire("Please Enter Qty Less than Balance Qty :" + contact.ItemName + " . Available Balance Qty :" + this.BalChkList[0].BalanceQty)
            contact.Qty = parseInt(this.BalChkList[0].BalanceQty);
            contact.Qty=this.Qty;
            this.tblCalucation(contact,contact.Qty)
          }
        }
      },
        (error) => {
          Swal.fire("No Item Found!!")
        });
        this.getDiscountCellCal(contact,contact.DiscPer)
    }
    else {
      Swal.fire("Please enter Qty!!")
      
      contact.GSTAmount =0;
      contact.TotalMRP = 0
      contact.DiscAmt = 0,
      contact.NetAmt = 0;
      contact.RoundNetAmt = 0;
      contact.StockId = this.StockId,
      contact.VatAmount = 0;
      contact.LandedRateandedTotal = 0;
      contact.CGSTAmt = 0;
      contact.SGSTAmt = 0;
      contact.IGSTAmt = 0;
      contact.PurchaseRate = this.PurchaseRate,
      contact.PurTotAmt = this.PurTotAmt,
      contact.MarginAmt = 0
    }

   

    // this.DiscOld=contact.DiscPer;
    this.ItemFormreset();
  }

  tblCalucation(contact,Qty){
    let TotalMRP;
      this.RQty = parseInt(contact.Qty) || 1;
      if (this.RQty && contact.UnitMRP) {
        TotalMRP = (parseInt(this.RQty) * (contact.UnitMRP)).toFixed(2);
        let LandedRateandedTotal = (parseInt(this.RQty) * (contact.LandedRate)).toFixed(2);
        let v_marginamt = (parseFloat(TotalMRP) - parseFloat(LandedRateandedTotal)).toFixed(2);
        this.PurTotAmt = (parseInt(this.RQty) * (contact.PurchaseRate)).toFixed(2);
        let NetAmt 
        let DiscAmt
        this.GSTAmount = (((contact.UnitMRP) * (contact.VatPer) / 100) * parseInt(this.RQty)).toFixed(2);
        this.CGSTAmt = (((contact.UnitMRP) * (contact.CgstPer) / 100) * parseInt(this.RQty)).toFixed(2);
        this.SGSTAmt = (((contact.UnitMRP) * (contact.SgstPer) / 100) * parseInt(this.RQty)).toFixed(2);
        this.IGSTAmt = (((contact.UnitMRP) * (contact.IgstPer) / 100) * parseInt(this.RQty)).toFixed(2);
        NetAmt = (parseFloat(TotalMRP) - parseFloat(contact.DiscAmt)).toFixed(2);
      
        if (contact.DiscPer > 0) {
          DiscAmt = ((TotalMRP * (contact.DiscPer)) / 100).toFixed(2);
          NetAmt = (parseFloat(TotalMRP) - parseFloat(DiscAmt)).toFixed(2);
        }

          contact.GSTAmount = (((contact.UnitMRP) * (contact.VatPer) / 100) * parseInt(this.RQty)).toFixed(2) || 0;
          contact.TotalMRP = (parseInt(this.RQty) * (contact.UnitMRP)).toFixed(2);  //this.TotalMRP || 0,
          contact.DiscAmt = DiscAmt || 0,
          contact.NetAmt =NetAmt,// (parseFloat(TotalMRP) - parseFloat(DiscAmt)).toFixed(2); //this.NetAmt,
          contact.RoundNetAmt = Math.round(NetAmt),
          contact.StockId = this.StockId,
          contact.VatAmount = this.GSTAmount,
          contact.LandedRateandedTotal = LandedRateandedTotal,
          contact.CGSTAmt = this.CGSTAmt,
          contact.SGSTAmt = this.SGSTAmt,
          contact.IGSTAmt = this.IGSTAmt,
          contact.PurchaseRate = this.PurchaseRate,
          contact.PurTotAmt = this.PurTotAmt,
          contact.MarginAmt = v_marginamt
      }
      this.ItemFormreset();
  }

  onCreditpaySave() {
    // if (this._salesService.IndentSearchGroup.get('PatientType').value == "External" && this.PatientName  != null && this.MobileNo != null) {
    let NetAmt = (this.ItemSubform.get('FinalNetAmount').value);
    let ConcessionId = 0;
    if (this.ItemSubform.get('ConcessionId').value)
      ConcessionId = this.ItemSubform.get('ConcessionId').value.ConcessionId;

    let salesInsertCredit = {};
    salesInsertCredit['Date'] = this.dateTimeObj.date;
    salesInsertCredit['time'] = this.dateTimeObj.time;
    if (this.ItemSubform.get('PatientType').value == 'External') {
      salesInsertCredit['oP_IP_Type'] = 2;
      salesInsertCredit['oP_IP_ID'] = this.OP_IP_Id;
    } else if (this.ItemSubform.get('PatientType').value == 'OP') {
      salesInsertCredit['oP_IP_Type'] = 0;
      salesInsertCredit['oP_IP_ID'] = this.OP_IP_Id;
    } else if (this.ItemSubform.get('PatientType').value == 'IP') {
      salesInsertCredit['oP_IP_Type'] = 1;
      salesInsertCredit['oP_IP_ID'] = this.OP_IP_Id;
    }
    salesInsertCredit['totalAmount'] = this.FinalTotalAmt
    salesInsertCredit['vatAmount'] = this.VatAmount;
    salesInsertCredit['discAmount'] = this.FinalDiscAmt;
    salesInsertCredit['netAmount'] = NetAmt;
    salesInsertCredit['paidAmount'] = 0;
    salesInsertCredit['balanceAmount'] = NetAmt;
    salesInsertCredit['concessionReasonID'] = ConcessionId || 0;
    salesInsertCredit['concessionAuthorizationId'] = 0;
    salesInsertCredit['isSellted'] = 0;
    salesInsertCredit['isPrint'] = 0;
    salesInsertCredit['isFree'] = 0;
    salesInsertCredit['unitID'] = 1;
    salesInsertCredit['addedBy'] = this._loggedService.currentUserValue.user.id,
      salesInsertCredit['externalPatientName'] = this.PatientName;
    salesInsertCredit['doctorName'] = "";
    salesInsertCredit['storeId'] = this._loggedService.currentUserValue.user.storeId,
      salesInsertCredit['isPrescription'] = 0;
    salesInsertCredit['creditReason'] = '';
    salesInsertCredit['creditReasonID'] = 0;
    salesInsertCredit['wardId'] = 0;
    salesInsertCredit['bedID'] = 0;
    salesInsertCredit['discper_H'] = 0;
    salesInsertCredit['isPurBill'] = 0;
    salesInsertCredit['isBillCheck'] = 0;
    salesInsertCredit['salesHeadName'] = ""
    salesInsertCredit['salesTypeId'] = 0;
    salesInsertCredit['salesId'] = 0;
    salesInsertCredit['extMobileNo'] = this.MobileNo;

    let salesDetailInsertCreditarr = [];
    this.saleSelectedDatasource.data.forEach((element) => {
      let salesDetailInsertCredit = {};
      salesDetailInsertCredit['salesID'] = 0;
      salesDetailInsertCredit['itemId'] = element.ItemId;
      salesDetailInsertCredit['batchNo'] = element.BatchNo;
      salesDetailInsertCredit['batchExpDate'] =  element.BatchExpDate;//this.datePipe.transform(element.BatchExpDate,"yyyy/mm/dd");// element.BatchExpDate;
      salesDetailInsertCredit['unitMRP'] = element.UnitMRP;
      salesDetailInsertCredit['qty'] = element.Qty;
      salesDetailInsertCredit['totalAmount'] = element.TotalMRP;
      salesDetailInsertCredit['vatPer'] = element.VatPer;
      salesDetailInsertCredit['vatAmount'] = element.VatAmount;
      salesDetailInsertCredit['discPer'] = element.DiscPer;
      salesDetailInsertCredit['discAmount'] = element.DiscAmt;
      salesDetailInsertCredit['grossAmount'] = element.NetAmt;
      salesDetailInsertCredit['landedPrice'] = element.LandedRate;
      salesDetailInsertCredit['totalLandedAmount'] = element.LandedRateandedTotal;
      salesDetailInsertCredit['purRateWf'] = element.PurchaseRate;
      salesDetailInsertCredit['purTotAmt'] = element.PurTotAmt;
      salesDetailInsertCredit['cgstPer'] = element.CgstPer;
      salesDetailInsertCredit['cgstAmt'] = element.CGSTAmt;
      salesDetailInsertCredit['sgstPer'] = element.SgstPer;
      salesDetailInsertCredit['sgstAmt'] = element.SGSTAmt;
      salesDetailInsertCredit['igstPer'] = element.IgstPer
      salesDetailInsertCredit['igstAmt'] = element.IGSTAmt
      salesDetailInsertCredit['isPurRate'] = 0;
      salesDetailInsertCredit['stkID'] = element.StockId;
      salesDetailInsertCreditarr.push(salesDetailInsertCredit);
    });

    let updateCurStkSalesCreditarray = [];
    this.saleSelectedDatasource.data.forEach((element) => {
      let updateCurStkSalesCredit = {};
      updateCurStkSalesCredit['itemId'] = element.ItemId;
      updateCurStkSalesCredit['issueQty'] = element.Qty;
      updateCurStkSalesCredit['storeID'] = this._loggedService.currentUserValue.user.storeId,
        updateCurStkSalesCredit['stkID'] = element.StockId;

      updateCurStkSalesCreditarray.push(updateCurStkSalesCredit);
    });

    let cal_DiscAmount_SalesCredit = {};
    cal_DiscAmount_SalesCredit['salesID'] = 0;

    let cal_GSTAmount_SalesCredit = {};
    cal_GSTAmount_SalesCredit['salesID'] = 0;

    // console.log("Procced with Payment Option");

    let submitData = {
      "salesInsertCredit": salesInsertCredit,
      "salesDetailInsertCredit": salesDetailInsertCreditarr,
      "updateCurStkSalesCredit": updateCurStkSalesCreditarray,
      "cal_DiscAmount_SalesCredit": cal_DiscAmount_SalesCredit,
      "cal_GSTAmount_SalesCredit": cal_GSTAmount_SalesCredit
    };
    let vMobileNo=this.mobileno;
    this._salesService.InsertCreditSales(submitData).subscribe(response => {
      if (response) {
        this.toastr.success('Record Saved Successfully.', 'Credit Save !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.getPrint3(response);
        this.getWhatsappshareSales(response,vMobileNo);
        this.Itemchargeslist = [];
        this._matDialog.closeAll();
      
      } else {
      
        this.toastr.error('API Error!', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
      this.sIsLoading = '';
    }, error => {
      
      this.toastr.error('API Error!', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });
    this.ItemFormreset();
    this.Formreset();
    this.ItemSubform.get('ConcessionId').reset();
    this.getConcessionReasonList();
    this.PatientName = '';
    // this.MobileNo = '';
    this.saleSelectedDatasource.data = [];
    this.saleSelectedDatasource.data = [];

  }

  OnEnableDraftAdd(){
    if(this.drafttable==false){
    this.drafttable=true;
    this.saleSelectedDatasource.data=[];
    }
    else{
      this.drafttable=false;
    }
 }

 
 getDraftorderList() {
 
   this.chargeslist1 = [];
   this.dataSource1.data = [];

   let currentDate =new Date();
   var m = {
  
     "FromDate": this.datePipe.transform(currentDate, "MM/dd/yyyy") || "01/01/1900",
     "ToDate":  this.datePipe.transform(currentDate, "MM/dd/yyyy") || "01/01/1900",
         }
        console.log(m)
   this._salesService.getDraftList(m).subscribe(data => {
     this.chargeslist1 = data as ChargesList[];
     this.dataSource1.data = this.chargeslist1;
      
   },
     (error) => {
       
     });
     
    
 }
  onAddDraftList(contact) {
    console.log(contact)
    this.DraftID=contact.DSalesId;
    this.saleSelectedDatasource.data = [];
    this.Itemchargeslist1=[];
    this.Itemchargeslist=[];

    let strSql = "Select ItemId,QtyPerDay,BalQty,IsBatchRequired from Get_SalesDraftBillItemDet where DSalesId=" + contact.DSalesId + " Order by ItemId "
    // console.log(strSql);
    this._salesService.getchargesList(strSql).subscribe(data => {
      this.tempDatasource.data = data as any;
      console.log(this.tempDatasource.data);
      if (this.tempDatasource.data.length >= 1) {
        this.tempDatasource.data.forEach((element) => {
          this.DraftQty = element.QtyPerDay
          
          this.onAddDraftListTosale(element,this.DraftQty);
        });
      }
    });
  }



  onAddDraftListTosale(contact,DraftQty) {
    console.log(contact)
    this.Itemchargeslist1=[];
    this.QtyBalchk = 0;
    this.PatientName = this.dataSource1.data[0]["PatientName"];
    this.MobileNo = this.dataSource1.data[0]["extMobileNo"];
    this.vextAddress = this.dataSource1.data[0]["extAddress"];
    this.DoctorName = this.dataSource1.data[0]["AdmDoctorName"];

  
    // if (this.tempDatasource.data.length > 0) {

      var m_data = {
        "ItemId": contact.ItemId,
        "StoreId": this._loggedService.currentUserValue.user.storeId || 0
      }

      this._salesService.getDraftBillItem(m_data).subscribe(draftdata => {
        console.log(draftdata)
        this.Itemchargeslist1=draftdata as any;
        if(this.Itemchargeslist1.length == 0){
          Swal.fire(contact.ItemId + " : " + "Item Stock is Not Avilable:"  )
          // this.PatientName = '';
          // this.vextAddress=" ";
          // this.MobileNo =' ';
          // this.DoctorName=" ";
        }
        else if(this.Itemchargeslist1.length > 0){
      
        let ItemID;
        this.Itemchargeslist1.forEach((element) => {
        
          // console.log(element)
          if(ItemID !=element.ItemId){
            this.QtyBalchk =0;
          }
          if (this.QtyBalchk != 1) {
            if (DraftQty <= element.BalanceQty) {
              
              this.QtyBalchk = 1;
              this.getFinalCalculation(element,DraftQty);
              ItemID=element.ItemId;
            }
            else {
              Swal.fire("Balance Qty is :", element.BalanceQty)
              this.QtyBalchk = 0;
              Swal.fire("Balance Qty is Less than Selected Item Qty for Item :", element.ItemId + "Balance Qty:", element.BalanceQty)
            }
          }
        });
      }

      });

    // }

  }

  getFinalCalculation(contact,DraftQty) {
 
      // if (parseInt(contact.BalanceQty) > parseInt(this.)) {
      this.RQty = parseInt(DraftQty);
      if (this.RQty && contact.UnitMRP) {
        this.TotalMRP = (parseInt(this.RQty) * (contact.UnitMRP)).toFixed(2);
        this.LandedRateandedTotal = (parseInt(this.RQty) * (contact.LandedRate)).toFixed(2);
        this.v_marginamt = (parseFloat(this.TotalMRP) - parseFloat(this.LandedRateandedTotal)).toFixed(2);
        this.PurTotAmt = (parseInt( this.RQty) * (contact.PurchaseRate)).toFixed(2);
        this.GSTAmount = (((contact.UnitMRP) * (contact.VatPercentage) / 100) * parseInt(this.RQty)).toFixed(2);
        this.CGSTAmt = (((contact.UnitMRP) * (contact.CGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
        this.SGSTAmt = (((contact.UnitMRP) * (contact.SGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
        this.IGSTAmt = (((contact.UnitMRP) * (contact.IGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
        this.NetAmt= (parseFloat(this.TotalMRP) + parseFloat(this.GSTAmount)).toFixed(2);
        
        if (contact.DiscPer > 0) {
         
          this.DiscAmt = ((this.TotalMRP * (contact.DiscPer)) / 100).toFixed(2);
          this.NetAmt = (this.TotalMRP - this.DiscAmt).toFixed(2);
          
        } 
    
        
        // if (this.ItemName && (parseInt(contact.Qty) != 0) && this.MRP > 0 && this.NetAmt > 0) {
          // this.saleSelectedDatasource.data = [];
         debugger
          this.Itemchargeslist.push(
            {
              ItemId: contact.ItemId,
              ItemName: contact.ItemName,
              BatchNo: contact.BatchNo,
              BatchExpDate: this.datePipe.transform(contact.BatchExpDate, "yyyy-MM-dd"),
              Qty:DraftQty,
              UnitMRP: contact.UnitMRP,
              GSTPer: contact.VatPercentage || 0,
              GSTAmount: this.GSTAmount || 0,
              TotalMRP: this.TotalMRP,
              DiscPer: contact.DiscPer || 0,
              DiscAmt:  this.DiscAmt || 0,
              NetAmt: this.NetAmt || 0,
              RoundNetAmt:Math.round(this.NetAmt),
              StockId:  contact.StockId,
              VatPer:  contact.VatPer,
              VatAmount: this.GSTAmount,
              LandedRate:  contact.LandedRate,
              LandedRateandedTotal: this.LandedRateandedTotal,
              CgstPer:  contact.CgstPer,
              CGSTAmt: this.CGSTAmt,
              SgstPer:  contact.SgstPer,
              SGSTAmt: this.SGSTAmt,
              IgstPer: contact.IgstPer,
              IGSTAmt: this.IGSTAmt,
              PurchaseRate: contact.PurchaseRate,
              PurTotAmt: this.PurTotAmt,
              MarginAmt: this.v_marginamt,
              BalanceQty:contact.BalQty,
              SalesDraftId:0
            });
          this.sIsLoading = '';
          
          this.saleSelectedDatasource.data = this.Itemchargeslist;
          this.ItemFormreset();
        }

        // this.Itemchargeslist=[];
    }
  // }
  // }

  onSaveDraftBill() {
    let NetAmt = (this.ItemSubform.get('FinalNetAmount').value);
    let ConcessionId = 0;
    if (this.ItemSubform.get('ConcessionId').value)
      ConcessionId = this.ItemSubform.get('ConcessionId').value.ConcessionId;

    let SalesInsert = {};
    SalesInsert['Date'] = this.dateTimeObj.date;
    SalesInsert['time'] = this.dateTimeObj.time;

    if (this.ItemSubform.get('PatientType').value == 'External') {
      SalesInsert['oP_IP_Type'] = 2;
      SalesInsert['oP_IP_ID'] = 0;
    } else if (this.ItemSubform.get('PatientType').value == 'OP') {
      SalesInsert['oP_IP_Type'] = 0;
      SalesInsert['oP_IP_ID'] = this.OP_IP_Id;
    } else if (this.ItemSubform.get('PatientType').value == 'IP') {
      SalesInsert['oP_IP_Type'] = 1;
      SalesInsert['oP_IP_ID'] = this.OP_IP_Id;
    }
    SalesInsert['totalAmount'] = this.FinalTotalAmt
    SalesInsert['vatAmount'] = this.FinalGSTAmt || 0;//this.ItemSubform.get('FinalGSTAmt').value;
    SalesInsert['discAmount'] = this.FinalDiscAmt;
    SalesInsert['netAmount'] = NetAmt;
    SalesInsert['paidAmount'] = NetAmt;
    SalesInsert['balanceAmount'] = 0;
    SalesInsert['concessionReasonID'] = ConcessionId || 0;
    SalesInsert['concessionAuthorizationId'] = 0;
    SalesInsert['isSellted'] = 0;
    SalesInsert['isPrint'] = 0;
    SalesInsert['unitID'] = 1;
    SalesInsert['addedBy'] = this._loggedService.currentUserValue.user.id,
    SalesInsert['externalPatientName'] = this.PatientName || '';
    SalesInsert['doctorName'] = this.DoctorName || '';
    SalesInsert['storeId'] = this._salesService.IndentSearchGroup.get('StoreId').value.storeid;
    SalesInsert['isPrescription'] = 0;
    SalesInsert['creditReason'] = '';
    SalesInsert['creditReasonID'] = 0;
    SalesInsert['wardId'] = 0;
    SalesInsert['bedId'] = 0;
    SalesInsert['extMobileNo'] = this.MobileNo;
    SalesInsert['extAddress'] = this.vextAddress;

    SalesInsert['DsalesId'] = 0;
   
    let salesDetailInsertarr = [];
    this.saleSelectedDatasource.data.forEach((element) => {
      
      let salesDetailInsert = {};
      salesDetailInsert['DsalesID'] = 0;
      salesDetailInsert['itemId'] = element.ItemId;
      salesDetailInsert['batchNo'] = element.BatchNo;
      salesDetailInsert['batchExpDate'] = element.BatchExpDate;
      salesDetailInsert['unitMRP'] = element.UnitMRP;
      salesDetailInsert['qty'] = element.Qty;
      salesDetailInsert['totalAmount'] = element.TotalMRP;
      salesDetailInsert['vatPer'] = element.VatPer;
      salesDetailInsert['vatAmount'] = element.VatAmount;
      salesDetailInsert['discPer'] = element.DiscPer;
      salesDetailInsert['discAmount'] = element.DiscAmt;
      salesDetailInsert['grossAmount'] = element.NetAmt;
      salesDetailInsert['landedPrice'] = element.LandedRate;
      salesDetailInsert['totalLandedAmount'] = element.LandedRateandedTotal;
      salesDetailInsert['purRateWf'] = element.PurchaseRate;
      salesDetailInsert['purTotAmt'] = element.PurTotAmt;
    
      salesDetailInsertarr.push(salesDetailInsert);

    });
    

    let submitData = {
      "salesDraftbillInsert": SalesInsert,
      "salesDraftbillDetailInsert": salesDetailInsertarr
    
    };
    // console.log(submitData);
    this._salesService.InsertSalesDraftBill(submitData).subscribe(response => {
      if (response) {
       
        this.toastr.success('Record Saved Successfully.', 'Save !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
       
        this.Itemchargeslist = [];
        this._matDialog.closeAll();

      //  this.onAddDraftList(response);
      this.getDraftorderList();
      
      }else {
       
        this.toastr.error('API Error!', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
      this.sIsLoading = '';
    }, error => {
      // this.snackBarService.showErrorSnackBar('Sales data not saved !, Please check API error..', 'Error !');
      this.toastr.error('API Error!', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });

    this.ItemFormreset();
    this.patientDetailsFormGrp.reset();
    this.Formreset();
    this.ItemSubform.get('ConcessionId').reset();
    this.PatientName = '';
    this.MobileNo = '';
    this.saleSelectedDatasource.data = [];
    }

    add:Boolean = false;
  @ViewChild('discamt') discamt: ElementRef;
  @ViewChild('doctorname') doctorname: ElementRef;
  @ViewChild('mobileno') mobileno: ElementRef;
  @ViewChild('disper') disper: ElementRef;
  @ViewChild('discamount') discamount: ElementRef;
  @ViewChild('patientname') patientname: ElementRef;
  @ViewChild('address') address: ElementRef;
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;


  public onEnterqty(event): void {
    if (event.which === 13) {
      this.disper.nativeElement.focus();
      this.calculateTotalAmt()
    }
  }
  public onEnterdiscper(event): void {
    
    if (event.which === 13) {
      this.discamount.nativeElement.focus();
    }
  }

  public onEnterpatientname(event): void {
    if (event.which === 13) {
      // this.itemid.nativeElement.focus();
      this.doctorname.nativeElement.focus();
    }
  }
  public onEntermobileno(event): void {
    if ((this.ItemSubform.get('MobileNo').value && this.ItemSubform.get('MobileNo').value.length == 10)) {
      this.getTopSalesDetailsList(this.MobileNo);
      this.patientname.nativeElement.focus();
    }
  }
  public onEnterdiscAmount(event): void {
    if (event.which === 13) {
      this.addbutton.focus();
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
    ;
    if (event.which === 117) {
      this.onClose();
    }
  }

  getPrint(el) {
    var D_data = {
      "SalesID": el,
      "OP_IP_Type": 2
    }
    let printContents;
    this.subscriptionArr.push(
      this._salesService.getSalesPrint(D_data).subscribe(res => {
        this.reportPrintObjList = res as Printsal[];
        // console.log(this.reportPrintObjList);
        this.reportPrintObj = res[0] as Printsal;
           
        if(this.reportPrintObj.ChequePayAmount !=0){
          this.UTRNO = this.reportPrintObj.ChequeNo;
        }else if(this.reportPrintObj.CardPayAmount !=0){
          this.UTRNO =  this.UTRNO +','+ this.reportPrintObj.ChequeNo;
        }else if(this.reportPrintObj.NEFTPayAmount !=0){
          this.UTRNO =  this.UTRNO +','+ this.reportPrintObj.NEFTNo;
        }else if(this.reportPrintObj.PayTMAmount !=0){
          this.UTRNO =  this.UTRNO +','+ this.reportPrintObj.PayTMTranNo;
        }
      })
    );
  }
 

  print() {

    let popupWin, printContents;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');

    popupWin.document.write(` <html>
    <head><style type="text/css">`);
    popupWin.document.write(`
      </style>
          <title></title>
      </head>
    `);
    popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
    </html>`);

    popupWin.document.close();
  }


  onClose() {
    this.Itemchargeslist = [];
    this.ItemFormreset();
    this.patientDetailsFormGrp.reset();
    this.Formreset();
    this.ItemSubform.get('ConcessionId').reset();
    this.PatientName = '';
    this.MobileNo = '';
    this.saleSelectedDatasource.data = [];
  }

  getOptionTextReg(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
  }



  getSearchList() {
    var m_data = {
      "Keyword": `${this.ItemSubform.get('RegID').value}%`
    }
    if (this.ItemSubform.get('RegID').value.length >= 1) {
      this._RequestforlabtestService.getAdmittedPatientList(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        // console.log(resData);
        this.PatientListfilteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }

      });
    }
  }
  
  getSelectedObjReg(obj) {
    
    this.registerObj = obj;
    this.PatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.PatientName;
    this.RegId = obj.RegID;
    // console.log(this.registerObj)
    this.OP_IP_Id = this.registerObj.AdmissionID;


    // this.getDraftorderList(obj);
  }

  CalPaidbackAmt(){
    this.v_PaidbacktoPatient= (parseFloat(this.roundoffAmt) - parseFloat(this.v_PaidbyPatient)).toFixed(2);
  }

  payOnline() {

    
    const matDialog = this._matDialog.open(PaymentModeComponent, {
      data: { finalAmount: this.FinalNetAmount },
      // height: '380px',
      disableClose: true,
      panelClass: 'payment-dialog'
      // panelClass: ['animate__animated','animate__slideInRight']
    });
    matDialog.afterClosed().subscribe(result => {
      if (result) {
        this.isPaymentSuccess = true;
        this.ItemSubform.get('referanceNo').setValue(this.onlinePaymentService.PlutusTransactionReferenceID);
      }
    });
  }
}


export class IndentList {
  SalesNo: any
  ItemId: any;
  ItemName: string;
  ItemShortName:any;
  BatchNo: string;
  BatchExpDate: any;
  BalanceQty: any;
  QtyPerDay:any;
  UnitMRP: any;
  Qty: number;
  IssueQty: number;
  Bal: number;
  StoreId: any;
  StoreName: any;
  GSTPer: any;
  GSTAmount: any;
  TotalMRP: any;
  DiscPer: any;
  DiscAmt: any;
  NetAmt: any;
  StockId: any;
  ReturnQty: any;
  TotalAmount: any;
  Total: any;
  VatPer: any;
  VatAmount: any;
  LandedRate: any;
  CgstPer: any;
  CGSTAmt: any;
  SgstPer: any;
  SGSTAmt: any;
  IgstPer: any;
  IGSTAmt: any;
  LandedRateandedTotal: any;
  PurchaseRate: any;
  PurTotAmt; any;
  BalanceAmount: any;
  PatientName: any;
  SalesReturnId: any;
  DiscAmount: any;
  NetAmount: any;
  MarginAmt: any;
  /**
   * Constructor
   *
   * @param IndentList
   */
  constructor(IndentList) {
    {
      this.SalesNo = IndentList.SalesNo || 0;
      this.ItemId = IndentList.ItemId || 0;
      this.ItemName = IndentList.ItemName || "";
      this.ItemShortName=IndentList.ItemShortName || "";
      this.BatchNo = IndentList.BatchNo || "";
      this.BatchExpDate = IndentList.BatchExpDate || "";
      this.UnitMRP = IndentList.UnitMRP || "";
      this.ItemName = IndentList.ItemName || "";
      this.Qty = IndentList.Qty || 0;
      this.IssueQty = IndentList.IssueQty || 0;
      this.QtyPerDay=IndentList.QtyPerDay || 0;
      this.Bal = IndentList.Bal || 0;
      this.StoreId = IndentList.StoreId || 0;
      this.StoreName = IndentList.StoreName || '';
      this.GSTPer = IndentList.GSTPer || "";
      this.TotalMRP = IndentList.TotalMRP || 0;
      this.DiscAmt = IndentList.DiscAmt || 0;
      this.NetAmt = IndentList.NetAmt || 0;
      this.StockId = IndentList.StockId || 0;
      this.NetAmt = IndentList.NetAmt || 0;
      this.ReturnQty = IndentList.ReturnQty || 0;
      this.TotalAmount = IndentList.TotalAmount || 0;
      this.Total = IndentList.Total || '';
      this.VatPer = IndentList.VatPer || 0;
      this.VatAmount = IndentList.VatAmount || 0;
      this.LandedRate = IndentList.LandedRate || 0;
      this.CgstPer = IndentList.CgstPer || 0;
      this.CGSTAmt = IndentList.CGSTAmt || 0;
      this.SgstPer = IndentList.SgstPer || 0;
      this.SGSTAmt = IndentList.SGSTAmt || 0;
      this.IgstPer = IndentList.IgstPer || 0;
      this.IGSTAmt = IndentList.IGSTAmt || 0;
      this.BalanceAmount = IndentList.BalanceAmount || 0;
      this.PatientName = IndentList.PatientName || '';
      this.SalesReturnId = IndentList.SalesReturnId || 0;
      this.NetAmount = IndentList.NetAmount || 0;
      this.DiscAmount = IndentList.DiscAmount || 0;
      this.MarginAmt = IndentList.MarginAmt || 0;
    }
  }
}
export class IndentID {
  IndentNo: Number;
  IndentDate: number;
  FromStoreName: string;
  ToStoreName: string;
  Addedby: number;
  IsInchargeVerify: string;
  IndentId: any;
  FromStoreId: boolean;

  /**
   * Constructor
   *
   * @param IndentID
   */
  constructor(IndentID) {
    {
      this.IndentNo = IndentID.IndentNo || 0;
      this.IndentDate = IndentID.IndentDate || 0;
      this.FromStoreName = IndentID.FromStoreName || "";
      this.ToStoreName = IndentID.ToStoreName || "";
      this.Addedby = IndentID.Addedby || 0;
      this.IsInchargeVerify = IndentID.IsInchargeVerify || "";
      this.IndentId = IndentID.IndentId || "";
      this.FromStoreId = IndentID.FromStoreId || "";
    }
  }
}

export class DraftSale {
  DSalesId:any;
  PatientName:any;
  RegID:any;
  Time:any;
  NetAmount:any;
  OP_IP_ID:any;
  OP_IP_Type:any;
  WardId:any;
  BedId:any;
  IsPrescription:any;

  /**
   * Constructor
   *
   * @param DraftSale
   */
  constructor(DraftSale) {
    {
      this.DSalesId = DraftSale.DSalesId || 0;
      this.PatientName = DraftSale.PatientName || 0;
      this.RegID = DraftSale.RegID || "";
      this.Time = DraftSale.Time || "";
      this.NetAmount = DraftSale.NetAmount || 0;
      this.OP_IP_ID = DraftSale.OP_IP_ID || "";
      this.OP_IP_Type = DraftSale.OP_IP_Type || "";
      this.WardId = DraftSale.WardId || "";
      this.BedId = DraftSale.BedId || "";
      this.IsPrescription = DraftSale.IsPrescription || "";
    
    }
  }
}

export class Printsal {
  PatientName: any;
  RegNo: any;
  ItemShortName: any;
  SalesId: any;
  StoreName: any;
  IP_OP_Number: any;
  DoctorName: any;
  SalesNo: any;
  Date: Date;
  Time: any;
  ItemName: any;
  OP_IP_Type: any;
  GenderName: any;
  AgeYear: any;
  BatchNo: any;
  BatchExpDate: any;
  UnitMRP: any;
  Qty: any;
  TotalAmount: any;
  GrossAmount: any;
  NetAmount: any;
  RoundNetAmt: any;
  VatPer: any;
  VatAmount: any;
  DiscAmount: any;
  ConcessionReason: any;
  PaidAmount: any;
  BalanceAmount: any;
  UserName: any;
  HSNcode: any;
  CashPayAmount: any;
  CardPayAmount: any;
  ChequePayAmount: any;
  PayTMAmount: any;
  NEFTPayAmount: any;

  CardNo: any;
  ChequeNo: any;
  PayTMTranNo: any;
  NEFTNo: any;


  GSTPer: any;
  GSTAmount: any;
  CGSTAmt: any;
  CGSTPer: any;
  SGSTPer: any;
  SGSTAmt: any;
  IGSTPer: any;
  IGSTAmt: any;
  ManufShortName: any;
  StoreNo: any;
  DL_NO: any;
  GSTIN: any;
  CreditReason: any;
  CompanyName: any;
  HTotalAmount: any;
  ExtMobileNo: any;
  StoreAddress: any;
  PayMode: any;
  MRNO: any;
  AdvanceUsedAmount: any;
  Label: any;
  ConversionFactor:any;
  TotalBillAmount: any;
  BalAmount: any;
  CashPay: any;
  ChequePay: any;
  CardPay: any;
  NEFTPay: any;
  OnlinePay: any;
  PrintStoreName: any;
  PatientType: any;
  BillVatAmount: any;
  BillDiscAmount: any;
  BillTotalAmount: any;
  HospitalMobileNo: any;
  HospitalEmailId: any;
  SalesReturnNo:any;
  RoundOff:any;
  

  Consructur(Printsal) {
    this.PatientName = Printsal.PatientName || '';
    this.RegNo = Printsal.RegNo || 0;
    this.IP_OP_Number = Printsal.OP_IP_Number || "";
    this.DoctorName = Printsal.DoctorName || "";
    this.Date = Printsal.Date || 0;
    this.Time = Printsal.Time || "";
    this.OP_IP_Type = Printsal.OP_IP_Type || "";
    this.GenderName = Printsal.GenderName || "";

    this.AgeYear = Printsal.AgeYear || '';
    this.BatchNo = Printsal.BatchNo || 0;
    this.BatchExpDate = Printsal.BatchExpDate || "";
    this.UnitMRP = Printsal.UnitMRP || "";
    this.Qty = Printsal.Qty || 0;
    this.TotalAmount = Printsal.TotalAmount || "";
    this.GrossAmount = Printsal.GrossAmount || "";
    this.NetAmount = Printsal.NetAmount || "";
    this.RoundNetAmt =Printsal.RoundNetAmt || "";
    this.VatPer = Printsal.VatPer || '';
    this.VatAmount = Printsal.VatAmount || 0;
    this.DiscAmount = Printsal.DiscAmount || "";
    this.ConcessionReason = Printsal.ConcessionReason || "";
    this.PaidAmount = Printsal.PaidAmount || 0;
    this.BalanceAmount = Printsal.BalanceAmount || "";
    this.UserName = Printsal.UserName || "";
    this.HSNcode = Printsal.HSNcode || "";

    this.CashPayAmount = Printsal.CashPayAmount || '';
    this.CardPayAmount = Printsal.CardPayAmount || 0;
    this.NEFTPayAmount = Printsal.NEFTPayAmount || "";
    this.PayTMAmount = Printsal.PayTMAmount || "";
    this.ChequePayAmount = Printsal.ChequePayAmount || 0;
    this.GSTPer = Printsal.GSTPer || "";
    this.GSTAmount = Printsal.GSTAmount || "";
    this.SGSTPer = Printsal.SGSTPer || "";
    this.SGSTAmt = Printsal.SGSTAmt || 0;
    this.CGSTPer = Printsal.CGSTPer || "";
    this.CGSTAmt = Printsal.CGSTAmt || "";
    this.IGSTPer = Printsal.IGSTPer || "";
    this.IGSTAmt = Printsal.IGSTAmt || "";
    this.StoreName = Printsal.StoreName || '';
    this.StoreNo = Printsal.StoreNo || "";
    this.DL_NO = Printsal.DL_NO || "";
    this.GSTIN = Printsal.GSTIN || "";
    this.CreditReason = Printsal.CreditReason || "";
    this.CompanyName = Printsal.CompanyName || "";
    this.ItemShortName = Printsal.ItemShortName || ''
    this.HTotalAmount = Printsal.HTotalAmount || '';
    this.ExtMobileNo = Printsal.ExtMobileNo || '';
    this.StoreAddress = Printsal.StoreAddress || '';
    this.PayMode = Printsal.PayMode || '';

    this.ItemShortName = Printsal.ItemShortName || ''
    this.HTotalAmount = Printsal.HTotalAmount || '';
    this.ExtMobileNo = Printsal.ExtMobileNo || '';
    this.StoreAddress = Printsal.StoreAddress || '';
    this.PayMode = Printsal.PayMode || '';
    this.MRNO = Printsal.MRNO || '';
    this.AdvanceUsedAmount = Printsal.PayMode || '';
    this.Label = Printsal.Label || ';'
    this.TotalBillAmount = Printsal.PayMode || '';
    this.CashPay = Printsal.CashPay || '';
    this.ChequePay = Printsal.ChequePay || '';
    this.CardPay = Printsal.CardPay || '';
    this.NEFTPay = Printsal.NEFTPay || '';
    this.OnlinePay = Printsal.OnlinePay || '';
    this.PrintStoreName = Printsal.PrintStoreName || '';
    this.PatientType = Printsal.PatientType || '';

    this.BillVatAmount = Printsal.BillVatAmount || '';
    this.BillDiscAmount = Printsal.BillDiscAmount || '';
    this.BillTotalAmount = Printsal.BillTotalAmount || '';
    this.HospitalMobileNo = Printsal.HospitalMobileNo || '';
    this.HospitalEmailId = Printsal.HospitalEmailId || '';
    this.ConversionFactor =Printsal.ConversionFactor || '';
    this.SalesReturnNo =Printsal.SalesReturnNo||0;
    this.RoundOff =Printsal.RoundOff||0;
  }
}

function Consructur() {
  throw new Error('Function not implemented.');
}

