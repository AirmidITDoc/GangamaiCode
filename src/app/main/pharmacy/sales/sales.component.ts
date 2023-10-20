import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, ElementRef, HostListener, Inject, Injector, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { SalesService } from './sales.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference, parseInt } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { SalePopupComponent } from './sale-popup/sale-popup.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OpPaymentNewComponent } from 'app/main/opd/op-search-list/op-payment-new/op-payment-new.component';
import { ConditionalExpr } from '@angular/compiler';
import { Observable, Subscription } from 'rxjs';
import * as converter from 'number-to-words';
import { ItemNameList } from 'app/main/inventory/issue-to-department/issue-to-department.component';
import { IpPaymentInsert } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ComponentPortal, DomPortalOutlet, PortalInjector } from '@angular/cdk/portal';
import { HeaderComponent } from 'app/main/shared/componets/header/header.component';
import { element } from 'protractor';
import { OPSearhlistService } from 'app/main/opd/op-search-list/op-searhlist.service';
import { map, startWith } from 'rxjs/operators';


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
  // dsIndentID = new MatTableDataSource<IndentID>();

  ItemName: any;
  ItemId: any;
  BalanceQty: any;
  Itemchargeslist: any = [];
  ConcessionReasonList: any = [];

  BatchNo: any;
  BatchExpDate: any;
  UnitMRP: any;
  Qty: any = 1;
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

  ConShow: Boolean = false;
  ItemObj: IndentList;

  paidamt: number;
  flagSubmit: boolean;
  balanceamt: number =0;
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

  reportItemPrintObj: Printsal;
  reportPrintObjItemList: Printsal[] = [];

  GSTAmount: any;
 

  dsIndentList = new MatTableDataSource<IndentList>();
  datasource = new MatTableDataSource<IndentList>();
  saleSelectedDatasource = new MatTableDataSource<IndentList>();

  // vSalesDetails: any = [];
  vSalesDetails: Printsal[] = [];
  vSalesIdList: any = [];
  isPaymentSelected: boolean = false;

  // payment code

  
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
  balanceAmt: number =0;
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
  
  filteredOptionsBank2: Observable<string[]>;
  optionsBank2: any[] = [];
  isBank1elected2: boolean = false;
  filteredOptionsBank3: Observable<string[]>;
  optionsBank3: any[] = [];
  isBank1elected3: boolean = false;
  filteredOptionsBank4: Observable<string[]>;
  optionsBank4: any[] = [];
  isBank1elected4: boolean = false
  
IsCreditflag : boolean=false

    

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
    'DiscAmt',
    'NetAmt',
    // 'StkId',
    'buttons'
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  data:any;
  constructor(
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

  ) {
    this.nowDate = new Date();
    this.PatientHeaderObj = this.data;
    
    // this.advanceData = this.data.vPatientHeaderObj;
    

    // if (this.data.FromName == "Advance") {
    //   this.netPayAmt = parseInt(this.advanceData.NetPayAmount);
    //   this.cashAmt = parseInt(this.advanceData.NetPayAmount);
    //   this.paidAmt = parseInt(this.advanceData.NetPayAmount);
    //   this.billNo = parseInt(this.advanceData.BillId);
    //   this.Paymentobj['TransactionType'] = 1;
    //   this.getBalanceAmt();
    //   this.IsCreditflag=true;
    // }
    // if (this.data.FromName == "OP-Bill" || this.PatientHeaderObj.FromName == "IP-Bill") {

      this.netPayAmt = this.FinalNetAmount;// parseInt(this.advanceData.NetPayAmount) || this.advanceData.NetPayableAmt;
      this.cashAmt = this.FinalNetAmount;// parseInt(this.advanceData.NetPayAmount);
      this.paidAmt = this.FinalNetAmount;// parseInt(this.advanceData.NetPayAmount);
      this.billNo =this.FinalNetAmount;//  parseInt(this.advanceData.BillId);
      this.PatientName = this.advanceData.PatientName;
      this.BillDate = this.advanceData.Date;
      this.getBalanceAmt();
      // this.Paymentobj['TransactionType'] = 0;
      this.IsCreditflag=false
    // }
    // if (this.PatientHeaderObj.FromName == "SETTLEMENT") {
    //   this.netPayAmt = parseInt(this.advanceData.NetPayAmount) || this.advanceData.NetPayableAmt;
    //   this.cashAmt = parseInt(this.advanceData.NetPayAmount);
    //   this.paidAmt = parseInt(this.advanceData.NetPayAmount);
    //   this.billNo = parseInt(this.advanceData.BillId);
    //   this.PatientName = this.advanceData.PatientName;
    //   this.BillDate = this.advanceData.Date;
    //   this.getBalanceAmt();
    //   this.Paymentobj['TransactionType'] = 0;
    //   this.IsCreditflag=true;
    // }
    // else {
    //   this.netPayAmt = parseInt(this.advanceData.NetPayAmount);
    //   this.cashAmt = parseInt(this.advanceData.NetPayAmount);
    //   this.paidAmt = parseInt(this.advanceData.NetPayAmount);
    //   this.Paymentobj['TransactionType'] = 2;
    //   this.getBalanceAmt();
    // }
   }

  ngOnInit(): void {
    // this.Itemchargeslist = [];
    this.patientDetailsFormGrp = this.createForm();
    this.gePharStoreList();
    this.getItemSubform();
    this.getConcessionReasonList();
    // this.getTopSalesDetailsList();

    // pament Code
    
    this.patientDetailsFormGrp = this.createForm();
  //  debugger
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
      balanceAmountController: []

      // paymentType6: [],
      // amount6: [],
      // bankName6: [],
      // regDate6: [(new Date()).toISOString()],
      // referenceNo6: []
    });
  }

  OtherPayment(){
  // debugger
    this.amount1=this.FinalNetAmount;
    this.paidAmt = this.FinalNetAmount;
    this.isPaymentSelected=true;
    this.netPayAmt=this.FinalNetAmount;
    this.getBalanceAmt();
    this.paymentRowObj["cash"] = true;
    this.onPaymentChange(1, 'cash');
    
  }

  getBalanceAmt() {
    // debugger
    this.balanceAmt = parseInt(this.FinalNetAmount)- ((this.amount1 ? parseInt(this.amount1) : 0)
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
    // debugger
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


  getOptionTextBank2(option){
    return option && option.BankName ? option.BankName : '';
  }
  getOptionTextBank3(option){
    return option && option.BankName ? option.BankName : '';
  }
  getOptionTextBank4(option){
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
    // debugger
    console.log(this.Paymentobj)
    return;
  }

  getChequeObj(type: string) {
    // debugger
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
    console.log(this.Paymentobj)
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
    console.log(this.Paymentobj)
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
    console.log(this.Paymentobj)
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
    console.log(this.Paymentobj)
    return;
  }

// Payment code Over





  getItemSubform() {
    this.ItemSubform = this.formBuilder.group({
      PatientName: '',
      DoctorName: '',
      MobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10),]],
      PatientType: ['External'],
      TotalAmt: '',
      GSTPer: '',
      DiscAmt: '',
      concessionAmt: [0],
      ConcessionId: 0,
      Remark: [''],
      FinalAmount: '',
      BalAmount: '',
      FinalDiscPer: '',
      FinalDiscAmt: '',
      FinalTotalAmt: '',
      FinalNetAmount: '',
      FinalGSTAmt: '',
      BalanceAmt: '',
      CashPay: ['CashPay'],
      referanceNo: '',
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
      "StoreId": this._salesService.IndentSearchGroup.get('StoreId').value.storeid || 0
    }
    if (this._salesService.IndentSearchGroup.get('ItemId').value.length >= 2) {
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
      if(data && data.length > 0) {
        this.reportPrintObjItemList = data as Printsal[];
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

  getTopSalesDetailsprint(){ 
// debugger
  var strrowslist = "";
  let onlySalesId = [];
  this.reportPrintObjItemList.forEach(ele => onlySalesId.push(ele.SalesId));
  
  let SalesidNamesArr = [...new Set(onlySalesId)];
  SalesidNamesArr.forEach(ele => this.dummySalesIdNameArr.push({SalesId: ele, isHidden: false}));

  this.SalesIdWiseObj = this.reportPrintObjItemList.reduce((acc, item: any) => {
    if (!acc[item.SalesId]) {
      acc[item.SalesId] = [];
    }
    acc[item.SalesId].push(item);
    return acc;
  }, {})
  console.log(this.SalesIdWiseObj);

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
    for(let i = 0; i < this.dummySalesIdNameArr.length; i++) {
      if(this.dummySalesIdNameArr[i].SalesId == SalesId && !this.dummySalesIdNameArr[i].isHidden) {
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


  onClear() {

  }
  calculateTotalAmt() {

    let Qty = this._salesService.IndentSearchGroup.get('Qty').value
    if (Qty > this.BalanceQty) {
      Swal.fire("Enter Qty less than Balance");
      this.ItemFormreset();
    }

    if (Qty && this.MRP) {
      debugger;
      this.TotalMRP = (parseInt(Qty) * (this._salesService.IndentSearchGroup.get('MRP').value)).toFixed(2);
      //this.TotalMRP = ((Qty) * (this.MRP)).toFixed(2);
      this.LandedRateandedTotal = (parseInt(Qty) * (this.LandedRate)).toFixed(2)
      this.PurTotAmt = (parseInt(Qty) * (this.PurchaseRate)).toFixed(2)

      console.log(this.VatPer);
      this.GSTAmount = (((this.UnitMRP) * (this.VatPer) / 100) * parseInt(Qty)).toFixed(2);
      this.CGSTAmt = (((this.UnitMRP) * (this.CgstPer) / 100) * parseInt(Qty)).toFixed(2);
      this.SGSTAmt = (((this.UnitMRP) * (this.SgstPer) / 100) * parseInt(Qty)).toFixed(2);
      this.IGSTAmt = (((this.UnitMRP) * (this.IgstPer) / 100) * parseInt(Qty)).toFixed(2);
      
      console.log(this.GSTAmount);
      
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
          StockId: this.StockId,
          VatPer:this.VatPer,
          VatAmount:this.GSTAmount,
          LandedRate:this.LandedRate,
          LandedRateandedTotal:this.LandedRateandedTotal,
          CgstPer:this.CgstPer,
          CGSTAmt:this.CGSTAmt,
          SgstPer:this.SgstPer,
          SGSTAmt:this.SGSTAmt,
          IgstPer:this.IgstPer,
          IGSTAmt:this.IGSTAmt,
          PurchaseRate:this.PurchaseRate,
          PurTotAmt:this.PurTotAmt

        });
      this.sIsLoading = '';
      this.saleSelectedDatasource.data = this.Itemchargeslist;
      this.ItemFormreset();
    }
    this.itemid.nativeElement.focus();
    this.add = false;
  }

  // OnAddUpdate(event) {

  //   this.sIsLoading = 'save';
  //   // let Qty = this._salesService.IndentSearchGroup.get('Qty').value

  //   if (this.Itemchargeslist.length > 0) {
  //     this.Itemchargeslist.forEach((element) => {
  //       if (element.StockId.toString().toLowerCase().search(this.StockId) !== -1) {
  //         debugger
  //         this.stockidflag = false;
  //         // Swal.fire('Item from Present StockID');
  //         console.log(element);
  //         debugger
  //         this.Qty= parseInt(this.Qty) + parseInt(element.Qty);
  //         this.TotalMRP = this.Qty * this.UnitMRP,
           
  //         this.GSTAmount = this.GSTAmount + parseFloat(element.GSTAmount);
  //         this.NetAmt = parseFloat(this.NetAmt) + (parseFloat(element.NetAmt));
  //         this.DiscAmt = parseFloat(element.DiscAmt) + this.DiscAmt;
  //         this.ItemId =element.ItemId;
  //         this.ItemName=element.ItemName;
  //         this.BatchNo=element.BatchNo;
  //         this.StockId=element.StockId; 
  //         this.BatchExpDate=element.BatchExpDate  || '01/01/1900';
  //         this.deleteflag=false;
  //         this.deleteTableRow(event, element);
          
  //         // this.Itemchargeslist.push(
  //         //   {

  //         //     ItemId: this.ItemId,
  //         //     ItemName: this.ItemName,
  //         //     BatchNo: this.BatchNo,
  //         //     BatchExpDate: this.BatchExpDate || '01/01/1900',
  //         //     Qty: this.Qty + element.Qty,
  //         //     UnitMRP: this.MRP,
  //         //     GSTPer: this.GSTPer || 0,
  //         //     GSTAmount: this.GSTAmount || 0,
  //         //     TotalMRP: this.TotalMRP,
  //         //     DiscAmt: this._salesService.IndentSearchGroup.get('DiscAmt').value || 0,
  //         //     NetAmt: this.NetAmt,
  //         //     StockId: this.StockId,

  //         //   });
  //         // this.saleSelectedDatasource.data = this.Itemchargeslist;
  //         // this.ItemFormreset();

  //       } 
  //       // else {
  //       //   this.stockidflag = true;
  //       // }

  //     });

  //   }
    
  //   if (this.stockidflag == true) {
  //     this.onAdd();
  //   }else{
       
  //         this.Itemchargeslist.push(
  //           {

  //             ItemId: this.ItemId,
  //             ItemName: this.ItemName,
  //             BatchNo: this.BatchNo,
  //             BatchExpDate: this.BatchExpDate || '01/01/1900',
  //             Qty: this.Qty,
  //             UnitMRP: this.MRP,
  //             GSTPer: this.GSTPer || 0,
  //             GSTAmount: this.GSTAmount || 0,
  //             TotalMRP: this.TotalMRP,
  //             DiscAmt: this.DiscAmt| 0,
  //             NetAmt: this.NetAmt,
  //             StockId: this.StockId,

  //           });
  //         this.saleSelectedDatasource.data = this.Itemchargeslist;
  //         this.ItemFormreset();

  //   }

  //   this.itemid.nativeElement.focus();
  //   this.add = false;


  // }

  OnAddUpdate(event) {

    this.sIsLoading = 'save';
    
    // if (this.Itemchargeslist.length > 0) {
    //   this.Itemchargeslist.forEach((element) => {
    //     if (element.StockId.toString().toLowerCase().search(this.StockId) !== -1) {
    //       // debugger
    //       this.stockidflag = false;
    //       // Swal.fire('Item from Present StockID');
    //       console.log(element);
    //       // debugger
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
    
    if (this.stockidflag == true) {
      this.onAdd();
    }else{
       
      debugger;
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
              DiscAmt: this.DiscAmt| 0,
              NetAmt: this.NetAmt,
              StockId: this.StockId,
              VatPer:this.VatPer,
              VatAmount:this.GSTAmount,
              LandedRate:this.LandedRate,
              LandedRateandedTotal:this.LandedRateandedTotal,
              CgstPer:this.CgstPer,
              CGSTAmt:this.CGSTAmt,
              SgstPer:this.SgstPer,
              SGSTAmt:this.SGSTAmt,
              IgstPer:this.IgstPer,
              IGSTAmt:this.IGSTAmt,
              PurchaseRate:this.PurchaseRate,
              PurTotAmt:this.PurTotAmt
            });
          this.saleSelectedDatasource.data = this.Itemchargeslist;
          console.log(this.saleSelectedDatasource.data);
          this.ItemFormreset();

    }
    console.log(this.saleSelectedDatasource.data);
    this.itemid.nativeElement.focus();
    this.add = false;


  }

  getBatch() {
    this.Quantity.nativeElement.focus();
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
      console.log(result);
      this.BatchNo = result.BatchNo;
      this.BatchExpDate = this.datePipe.transform(result.BatchExpDate, "MM-dd-yyyy");
      this.MRP = result.UnitMRP;
      this.Qty = 1;
      this.Bal = result.BalanceAmt;
      this.GSTPer = result.VatPercentage;

      this.TotalMRP = this.Qty * this.MRP;
      this.DiscAmt = 0;
      this.NetAmt = this.TotalMRP;
      this.BalanceQty = this.BalanceQty;
      this.ItemObj = result;

      this.VatPer = result.VatPercentage;
      console.log(this.VatPer);
      this.CgstPer = result.CGSTPer;
      this.SgstPer = result.SGSTPer;
      this.IgstPer = result.IGSTPer;

      this.VatAmount = result.VatPercentage;
      // this.CGSTAmt = result.VatPercentage;
      // this.SGSTAmt = result.VatPercentage;
      // this.IGSTAmt = result.VatPercentage;
      this.StockId = result.StockId
      this.StoreId = result.StoreId;
      this.LandedRate = result.LandedRate;
      this.PurchaseRate = result.PurchaseRate;
      this.UnitMRP = result.UnitMRP;
    });

    this.Quantity.nativeElement.focus();
  }

  focusNextService() {
    // this.renderer.selectRootElement('#myInput').focus();
  }

  ItemFormreset() {
    this.BatchNo = "";
    this.BatchExpDate = "01/01/1900"
    this.MRP = 0;
    this.Qty = 1;
    this.Bal = 0;
    this.GSTPer = 0;
    this.DiscPer=0;
    this.DiscAmt=0;
    this.TotalMRP = 0;
    this.NetAmt = 0;
    this._salesService.IndentSearchGroup.get('ItemId').reset('');
    this.filteredOptions=[];
    
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
    this.ItemSubform.get('referanceNo').reset('');
  }


  // getTotalAmtSum(element) {
  //   let TotAmt;
  //   TotAmt = (element.reduce((sum, { TotalMRP }) => sum += +(TotalMRP || 0), 0)).toFixed(2);
  //   this.FinalNetAmount = TotAmt;
  //   return TotAmt;
  // }
  
  // getDiscAmtSum(element) {
  //   let discAmt;
  //   discAmt = (element.reduce((sum, { NetAmt }) => sum += +(NetAmt || 0), 0)).toFixed(2);
  //    this.FinalDiscAmt =discAmt;
  //   return discAmt;
  // }


  getNetAmtSum(element) {
   
    this.FinalNetAmount =(element.reduce((sum, { NetAmt }) => sum += +(NetAmt || 0), 0)).toFixed(2);

    this.FinalTotalAmt =  (element.reduce((sum, { TotalMRP }) => sum += +(TotalMRP || 0), 0)).toFixed(2);

    this.FinalDiscAmt =(element.reduce((sum, { DiscAmt }) => sum += +(DiscAmt || 0), 0)).toFixed(2);
   
     this.FinalGSTAmt = (element.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0)).toFixed(2);

    // return this.GSTTotal;
    return this.FinalNetAmount;
  }


  // getGSTSum(element) {
  //   let TotGST;
  //   TotGST = (element.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0)).toFixed(2);
  //   return TotGST;
  // }

  calculateDiscAmt() {
    if (parseFloat(this.DiscAmt) > 0 && (parseFloat(this.DiscAmt)) < parseFloat(this.TotalMRP)) {
      this.NetAmt = (this.TotalMRP - (this._salesService.IndentSearchGroup.get('DiscAmt').value)).toFixed(2);
      this.add = true;
      this.addbutton.focus();
    }
    else if (parseFloat(this.DiscAmt) > parseFloat(this.NetAmt)) {
      Swal.fire('Check Discount Amount !')
    }
    if (parseFloat(this.DiscAmt) == 0) {
      this.add = true;
      this.addbutton.focus();
    }
  }

  // calculateGSTAmt() {
  //   let GST = this._salesService.IndentSearchGroup.get('GSTPer').value
  //   if (GST > 0) {
  //     this.GSTAmount = ((this.NetAmt * (GST)) / 100);
  //     // this.DiscAmt = this.GSTAmount.toFixed(2);
  //     this.NetAmt = ((this.NetAmt) - (discAmt)).toFixed(2);
  //   }
  // }

  getDiscPer() {
    // debugger
    let DiscPer = this._salesService.IndentSearchGroup.get('DiscPer').value
    if (this.DiscPer > 0) {
      this.DiscAmt = ((this.TotalMRP * (this.DiscPer)) / 100).toFixed(2);
      this.NetAmt = (this.TotalMRP - this.DiscAmt).toFixed(2);
      this.ItemSubform.get('DiscAmt').disable();
      this.chkdiscper=true;
    } else {
      this.chkdiscper = false;
      this.DiscAmt=0;
      this.ItemSubform.get('DiscAmt').enable();
      this.NetAmt = (this.TotalMRP - this.DiscAmt).toFixed(2);
    }
  }

  getFinalDiscperAmt() {
    let Disc = this.ItemSubform.get('FinalDiscPer').value;
    // this.FinalDiscAmt=0
    // if (Disc > 0) {
    //   this.FinalDiscAmt = ((this.FinalTotalAmt * (Disc)) / 100).toFixed(2);
    //   this.FinalNetAmount = ((this.FinalTotalAmt) - (this.FinalDiscAmt)).toFixed(2);
    //   this.ConShow = true
    // }

    if (Disc > 0) {
      this.ConShow = true
      this.FinalDiscAmt = ((this.FinalTotalAmt * (Disc)) / 100).toFixed(2);
      this.FinalNetAmount = ((this.FinalTotalAmt) - (this.FinalDiscAmt)).toFixed(2);
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').setValidators([Validators.required]);
      this.ItemSubform.get('ConcessionId').enable();

    } else {
      this.ConShow = false
      this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').clearValidators();
      this.ItemSubform.get('ConcessionId').updateValueAndValidity();

      this.ConseId.nativeElement.focus();

    }

    this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);
  }

  getFinalDiscAmount() {
    let Discamt = this.ItemSubform.get('FinalDiscAmt').value

    if (Discamt > 0 && Discamt < this.FinalNetAmount) {
      this.FinalNetAmount = ((this.FinalNetAmount) - (Discamt)).toFixed(2);
      this.ConShow = true
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').setValidators([Validators.required]);
      this.ItemSubform.get('ConcessionId').enable();

    } else {

      this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').clearValidators();
      this.ItemSubform.get('ConcessionId').updateValueAndValidity();

      this.ConseId.nativeElement.focus();

    }
  }



  CalfinalGST() {
    let GST = this.ItemSubform.get('FinalGSTAmt').value
    if (GST > 0 && GST < this.FinalNetAmount) {
      this.FinalNetAmount = ((this.FinalNetAmount) + (GST))
      this.ConShow = true
    }
    this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount.toFixed(2));
  }
  // key: any;
  // @HostListener('document:keyup', ['$event'])
  // handleDeleteKeyboardEvent(event: KeyboardEvent, s) {
  //   if (event.key === 'Delete') {
  //     this.key = 'Delete';

  //   }
  // }
  // @HostListener('document:keydown.delete', ['$event'])

  // show(eve, contact) {
  //   // Swal.fire(contact);
  //   if (this.key == "Delete") {
  //     this.deleteTableRow(eve, contact);
  //   }
  // }


  onChangePatientType(event) {
    if (event.value == 'External') {

      this.ItemSubform.get('MobileNo').reset();
      this.ItemSubform.get('MobileNo').setValidators([Validators.required]);
      this.ItemSubform.get('MobileNo').enable();
      this.ItemSubform.get('PatientName').reset();
      this.ItemSubform.get('PatientName').setValidators([Validators.required]);
      this.ItemSubform.get('PatientName').enable();


    } else {
      // this.Regdisplay = true;

      this.ItemSubform.get('MobileNo').disable();

      this.ItemSubform.get('PatientName').disable();
      this.isPatienttypeDisabled = false;

      this.ItemSubform.get('MobileNo').reset();
      this.ItemSubform.get('MobileNo').clearValidators();
      this.ItemSubform.get('MobileNo').updateValueAndValidity();

      this.ItemSubform.get('PatientName').reset();
      this.ItemSubform.get('PatientName').clearValidators();
      this.ItemSubform.get('PatientName').updateValueAndValidity();
    }
  }



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
  onSave() {
    if (this.ItemSubform.get('CashPay').value == 'CashPay' || this.ItemSubform.get('CashPay').value == 'Online') {
      this.onCashpaySave()
    }
    else if (this.ItemSubform.get('CashPay').value == 'Credit') {
      this.onCreditpaySave()
    }
  }

  onCashpaySave() {
    let NetAmt = (this.ItemSubform.get('FinalNetAmount').value);
   
    let ConcessionId = 0;
    if (this.ItemSubform.get('ConcessionId').value)
      ConcessionId = this.ItemSubform.get('ConcessionId').value.ConcessionId;
      // debugger
      
    // if (this.patientDetailsFormGrp.get('balanceAmountController').value==0) {
    // console.log("Procced with Payment Option");

    let SalesInsert = {};
    SalesInsert['Date'] = this.dateTimeObj.date;
    SalesInsert['time'] = this.dateTimeObj.time;
    SalesInsert['oP_IP_ID'] = 0;
    SalesInsert['oP_IP_Type'] = 2;
    SalesInsert['totalAmount'] = this.FinalTotalAmt
    SalesInsert['vatAmount'] = this.VatAmount;
    SalesInsert['discAmount'] = this.FinalDiscAmt;
    SalesInsert['netAmount'] = NetAmt;
    SalesInsert['paidAmount'] = NetAmt;
    SalesInsert['balanceAmount'] = 0;
    SalesInsert['concessionReasonID'] = ConcessionId || 0;
    SalesInsert['concessionAuthorizationId'] = 0;
    SalesInsert['isSellted'] = 0;
    SalesInsert['isPrint'] = 0;
    SalesInsert['isFree'] = 0;
    SalesInsert['unitID'] = 1;
    SalesInsert['addedBy'] = this._loggedService.currentUserValue.user.id,
    SalesInsert['externalPatientName'] = this.PatientName;
    SalesInsert['doctorName'] = "";
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
    SalesInsert['extMobileNo'] = this.MobileNo;

    let salesDetailInsertarr = [];
    this.saleSelectedDatasource.data.forEach((element) => {
      console.log(element);
      let salesDetailInsert = {};
      salesDetailInsert['salesID'] = 0;
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

    let PaymentInsertobj = {};
    if (this.ItemSubform.get('CashPay').value == 'Other') {
      this.getCashObj('cash');
      this.getChequeObj('cheque');
      this.getCardObj('card');
      this.getNeftObj('neft');
      this.getUpiObj('upi');
      
      PaymentInsertobj['PaymentDate'] = this.dateTimeObj.date;
      PaymentInsertobj['PaymentTime'] = this.dateTimeObj.date;
      PaymentInsertobj['AdvanceUsedAmount'] = 0;
      PaymentInsertobj['AdvanceId'] = 0;
      PaymentInsertobj['RefundId'] = 0;
      PaymentInsertobj['TransactionType'] = 4;
      PaymentInsertobj['Remark'] = "" //this.patientDetailsFormGrp.get('commentsController').value;
      PaymentInsertobj['AddBy'] = this._loggedService.currentUserValue.user.id,
      PaymentInsertobj['IsCancelled'] = 0;
      PaymentInsertobj['IsCancelledBy'] = 0;
      PaymentInsertobj['IsCancelledDate'] = "01/01/1900" //this.dateTimeObj.date;
      // this.Paymentobj['CashCounterId'] = 0;
      // this.Paymentobj['IsSelfORCompany'] = 0;
      // this.Paymentobj['CompanyId'] = 0;
      PaymentInsertobj['PaymentDate'] = this.dateTimeObj.date;
      PaymentInsertobj['PaymentTime'] = this.dateTimeObj.time;
      PaymentInsertobj['PaidAmt'] = this.patientDetailsFormGrp.get('paidAmountController').value;
      PaymentInsertobj['BalanceAmt'] = this.patientDetailsFormGrp.get('balanceAmountController').value;
      
  
    }else if (this.ItemSubform.get('CashPay').value == 'CashPay') {
   
    PaymentInsertobj['BillNo'] = 0,
    PaymentInsertobj['ReceiptNo'] = '',
    PaymentInsertobj['PaymentDate'] = this.dateTimeObj.date;
    PaymentInsertobj['PaymentTime'] = this.dateTimeObj.time;
    PaymentInsertobj['CashPayAmount'] = NetAmt;
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
    // this.Paymentobj['PaidAmt'] = NetAmt;
    // this.Paymentobj['BalanceAmt'] = 0;
    }else if (this.ItemSubform.get('CashPay').value == 'Online') {
      // let Paymentobj = {};
     PaymentInsertobj['BillNo'] = 0,
     PaymentInsertobj['ReceiptNo'] = '',
     PaymentInsertobj['PaymentDate'] = this.dateTimeObj.date;
     PaymentInsertobj['PaymentTime'] = this.dateTimeObj.time;
     PaymentInsertobj['CashPayAmount'] = 0;
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
     PaymentInsertobj['NEFTPayAmount'] = 0; 
     PaymentInsertobj['NEFTNo'] = '',
     PaymentInsertobj['NEFTBankMaster'] = '',
     PaymentInsertobj['NEFTDate'] = "01/01/1900",
     PaymentInsertobj['PayTMAmount'] = NetAmt,
     PaymentInsertobj['PayTMTranNo'] = this.ItemSubform.get('referanceNo').value ||0,
     PaymentInsertobj['PayTMDate'] = this.dateTimeObj.date;
    //  this.Paymentobj['PaidAmt'] = NetAmt;
    //  this.Paymentobj['BalanceAmt'] = 0;
    }
  
    // const ipPaymentInsert = new IpPaymentInsert(this.Paymentobj);

    console.log("Procced with Payment Option");

    let submitData = {
      "salesInsert": SalesInsert,
      "salesDetailInsert": salesDetailInsertarr,
      "updateCurStkSales": updateCurStkSalestarr,
      "cal_DiscAmount_Sales": cal_DiscAmount_Sales,
      "cal_GSTAmount_Sales": cal_GSTAmount_Sales,
      "salesPayment": PaymentInsertobj
    };
    console.log(submitData);
    this._salesService.InsertCashSales(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Cash Sales !', 'Record Saved Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            // let m = response;
            this.getPrint(response);
            this.Itemchargeslist = [];
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Sale data not saved', 'error');
      }
      this.sIsLoading = '';
    });
    // }
    // });

    this.ItemFormreset();
    this.patientDetailsFormGrp.reset();
    this.Formreset();
    this.ItemSubform.get('ConcessionId').reset();
    this.PatientName = '';
    this.MobileNo = '';
    this.saleSelectedDatasource.data = [];
  // }
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
    salesInsertCredit['oP_IP_ID'] = 0;
    salesInsertCredit['oP_IP_Type'] = 2;
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
      salesDetailInsertCredit['batchExpDate'] = element.BatchExpDate;
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

    console.log("Procced with Payment Option");

    let submitData = {
      "salesInsertCredit": salesInsertCredit,
      "salesDetailInsertCredit": salesDetailInsertCreditarr,
      "updateCurStkSalesCredit": updateCurStkSalesCreditarray,
      "cal_DiscAmount_SalesCredit": cal_DiscAmount_SalesCredit,
      "cal_GSTAmount_SalesCredit": cal_GSTAmount_SalesCredit
    };
    // console.log(submitData);
    // debugger
    this._salesService.InsertCreditSales(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Credit Sales!', 'Data saved Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            let m = response;
            this.getPrint(m);
            this.Itemchargeslist = [];
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Sale Credit data not saved', 'error');
      }
      this.sIsLoading = '';
    });
    this.ItemFormreset();
    this.Formreset();
    this.ItemSubform.get('ConcessionId').reset();
    this.getConcessionReasonList();
    this.PatientName = '';
    this.MobileNo = '';
    this.saleSelectedDatasource.data = [];
    this.saleSelectedDatasource.data = [];

  }

  @ViewChild('discamt') discamt: ElementRef;
  @ViewChild('doctorname') doctorname: ElementRef;
  @ViewChild('mobileno') mobileno: ElementRef;
  @ViewChild('disper') disper: ElementRef;
  @ViewChild('discamount') discamount: ElementRef;
  @ViewChild('patientname') patientname: ElementRef;
  @ViewChild('itemid') itemid: ElementRef;
  add: boolean = false;
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
    }
  }
  public onEnterdiscAmount(event): void {
    if (event.which === 13) {
      this.addbutton.focus();
    }
  }

  public onEnterDoctorname(event): void {
    if (event.which === 13) {
      this.itemid.nativeElement.focus();
    }
  }


  getPrint(el) {
    var D_data = {
      "SalesID":el, 
      "OP_IP_Type": 2
    }
    let printContents;
    this.subscriptionArr.push(
      this._salesService.getSalesPrint(D_data).subscribe(res => {
        this.reportPrintObjList = res as Printsal[];
        // console.log(this.reportPrintObjList);
        this.reportPrintObj = res[0] as Printsal;
        this.getTemplate();

      })
    );
  }
  getTemplate() {
    // debugger
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=36';
    this._salesService.getTemplate(query).subscribe((resData: any) => {
  
      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['PatientName', 'RegNo', 'IP_OP_Number', 'DoctorName', 'SalesNo', 'Date', 'Time', 'ItemName', 'OP_IP_Type', 'GenderName', 'AgeYear', 'BatchNo', 'BatchExpDate', 'UnitMRP', 'Qty', 'TotalAmount', 'GrossAmount', 'NetAmount', 'VatPer', 'VatAmount', 'DiscAmount', 'ConcessionReason', 'PaidAmount', 'BalanceAmount', 'UserName', 'HSNCode', 'CashPayAmount', 'CardPayAMount', 'ChequePayAmount', 'PayTMAmount', 'NEFTPayAmount', 'GSTPer', 'GSTAmt', 'CGSTAmt', 'CGSTPer', 'SGSTPer', 'SGSTAmt', 'IGSTPer', 'IGSTAmt', 'ManufShortName', 'StoreNo','StoreName', 'DL_NO', 'GSTIN', 'CreditReason', 'CompanyName'];
      // ;
      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      var strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        // console.log(this.reportPrintObjList);
        var objreportPrint = this.reportPrintObjList[i - 1];
        let PackValue = '1200'
        // <div style="display:flex;width:60px;margin-left:20px;">
        //     <div>`+ i + `</div> 
        // </div>
  
        var strabc = `<hr style="border-color:white" >
        <div style="display:flex;margin:8px 0">
        <div style="display:flex;width:40px;margin-left:20px;">
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

        <div style="display:flex;width:60px;text-align:left;margin-left:10px;">
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
      // console.log(this.printTemplate);
      setTimeout(() => {
        this.print();
      }, 1000);
    });
  
  
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
    // this.dialogRef.close({ result: "cancel" });
    this.Itemchargeslist = [];
  }
}


export class IndentList {
  SalesNo:any
  ItemId: any;
  ItemName: string;
  BatchNo: string;
  BatchExpDate: any;
  BalanceQty: any;
  UnitMRP: any;
  Qty: number;
  IssueQty: number;
  Bal: number;
  StoreId: any;
  StoreName: any;
  GSTPer: any;
  GSTAmount:any;
  TotalMRP: any;
  DiscPer:any;
  DiscAmt: any;
  NetAmt: any;
  StockId: any;
  ReturnQty:any;
  TotalAmount:any;
  Total:any;
  VatPer:any;
  VatAmount:any;
  LandedRate:any;
  CgstPer:any;
  CGSTAmt:any;
  SgstPer:any;
  SGSTAmt:any;
  IgstPer:any;
  IGSTAmt:any;
  LandedRateandedTotal:any;
  PurchaseRate:any;
  PurTotAmt;any;
  /**
   * Constructor
   *
   * @param IndentList
   */
  constructor(IndentList) {
    {
      this.SalesNo=IndentList.SalesNo ||0;
      this.ItemId = IndentList.ItemId || 0;
      this.ItemName = IndentList.ItemName || "";
      this.BatchNo = IndentList.BatchNo || "";
      this.BatchExpDate = IndentList.BatchExpDate || "";
      this.UnitMRP = IndentList.UnitMRP || "";
      this.ItemName = IndentList.ItemName || "";
      this.Qty = IndentList.Qty || 0;
      this.IssueQty = IndentList.IssueQty || 0;
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
      this.TotalAmount=IndentList.TotalAmount || 0;    
      this.Total=IndentList.Total || '';
      this.VatPer=IndentList.VatPer || 0;    
      this.VatAmount=IndentList.VatAmount || 0;    
      this.LandedRate=IndentList.LandedRate || 0;    
      this.CgstPer=IndentList.CgstPer || 0;    
      this.CGSTAmt=IndentList.CGSTAmt || 0;    
      this.SgstPer=IndentList.SgstPer || 0;    
      this.SGSTAmt=IndentList.SGSTAmt || 0;    
      this.IgstPer=IndentList.IgstPer || 0;    
      this.IGSTAmt=IndentList.IGSTAmt || 0;    
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

export class Printsal {
  PatientName: any;
  RegNo: any;
  ItemShortName:any;
  SalesId:any;
  StoreName:any;
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
  VatPer: any;
  VatAmount: any;
  DiscAmount: any;
  ConcessionReason: any;
  PaidAmount: any;
  BalanceAmount: any;
  UserName: any;
  HSNcode: any;
  CashPayAmount: any;
  CardPayAMount: any;
  ChequePayAmount: any;
  PayTMAmount: any;
  NEFTPayAmount: any;
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
  HTotalAmount:any;

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

    this.VatPer = Printsal.VatPer || '';
    this.VatAmount = Printsal.VatAmount || 0;
    this.DiscAmount = Printsal.DiscAmount || "";
    this.ConcessionReason = Printsal.ConcessionReason || "";
    this.PaidAmount = Printsal.PaidAmount || 0;
    this.BalanceAmount = Printsal.BalanceAmount || "";
    this.UserName = Printsal.UserName || "";
    this.HSNcode = Printsal.HSNcode || "";

    this.CashPayAmount = Printsal.CashPayAmount || '';
    this.CardPayAMount = Printsal.CardPayAMount || 0;
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
    this.StoreName= Printsal.StoreName|| '';
    this.StoreNo = Printsal.StoreNo || "";
    this.DL_NO = Printsal.DL_NO || "";
    this.GSTIN = Printsal.GSTIN || "";
    this.CreditReason = Printsal.CreditReason || "";
    this.CompanyName = Printsal.CompanyName || "";
    this.ItemShortName=Printsal.ItemShortName || ''
    this.HTotalAmount=Printsal.HTotalAmount || '';
  }
}

function Consructur() {
  throw new Error('Function not implemented.');
}
