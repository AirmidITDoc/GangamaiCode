import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AdvanceDetailObj, ChargesList } from '../ip-search-list.component';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { IPSearchListService } from '../ip-search-list.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from '../../advance';
import { DatePipe } from '@angular/common';
import { debounceTime, map, startWith, takeUntil } from 'rxjs/operators';
import { IPAdvancePaymentComponent, IpPaymentInsert } from '../ip-advance-payment/ip-advance-payment.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { MatDrawer } from '@angular/material/sidenav';
import { MatAccordion } from '@angular/material/expansion';
import * as converter from 'number-to-words';
import { InterimBillComponent } from '../interim-bill/interim-bill.component';
import { PrintPreviewService } from 'app/main/shared/services/print-preview.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { forEach } from 'lodash';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { IpPaymentwithAdvanceComponent } from '../ip-paymentwith-advance/ip-paymentwith-advance.component';
import { IPpaymentWithadvanceComponent } from '../../ip-settlement/ippayment-withadvance/ippayment-withadvance.component';
import { PrebillDetailsComponent } from './prebill-details/prebill-details.component';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ConfigService } from 'app/core/services/config.service';
import { query } from '@angular/animations';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';


@Component({
  selector: 'app-ip-billing',
  templateUrl: './ip-billing.component.html',
  styleUrls: ['./ip-billing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPBillingComponent implements OnInit {
  displayedColumns = [
    'checkbox',
    'IsCheck',
    'ChargesDate',
    'ServiceName',
    'Price',
    'Qty',
    'TotalAmt',
    'DiscPer',
    'DiscAmt',
    'NetAmount',
    'DoctorName',
    'ClassName',
    'ChargesAddedName',
    'buttons',
  ];
  tableColumns = [
    'ServiceName',
    'Price'
  ];
  PackageBillColumns = [
    'BDate',
    'PBillNo',
    'TotalAmt',
    'ConcessionAmt',
    'NetPayableAmt',
    'BalanceAmt',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'AdvanceUsedAmount',
    'Action'
  ];

  opD_IPD_Id: any = "0"
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('actionButtonTemplatePrevlist') actionButtonTemplatePrevlist!: TemplateRef<any>;
  ngAfterViewInit() {
    // Assign the template to the column dynamically 
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    this.gridConfig1.columnsList.find(col => col.key === 'action1')!.template = this.actionButtonTemplatePrevlist;
  }

  allColumns = [
    { heading: "Date", key: "bDate", sort: true, align: 'left', emptySign: 'NA', width: 110 },
    { heading: "billNo", key: "billNo", sort: true, align: 'left', emptySign: 'NA', width: 110 },
    { heading: "Total Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "Disc Amt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "Net Amt", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "Bal Amt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "cashPayAmt", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "chequePayAmt", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "cardPayAmt", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "AdvUsedAmt", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    {
      heading: "Action", key: "action1", align: "right", width: 110, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplatePrevlist  // Assign ng-template to the column
    }
  ]
  AdvanceColumns = [
    { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Advance No", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Advance Amt", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "UsedAmt", key: "usedAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Refund Amt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "NEFT Pay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "PayTM Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Reason", key: "reason", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    {
      heading: "Action", key: "action", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]
  gridConfig1: gridModel = {
    apiUrl: "IPBill/IPPreviousBillList",
    columnsList: this.allColumns,
    sortField: "BillNo",
    sortOrder: 0,
    filters: [{ fieldName: "IP_Id", fieldValue: String(this.opD_IPD_Id), opType: OperatorComparer.Equals }]
  }

  gridConfig: gridModel = {
    apiUrl: "Advance/PatientWiseAdvanceList",
    columnsList: this.AdvanceColumns,
    sortField: "AdvanceDetailID",
    sortOrder: 0,
    filters: [
      { fieldName: "AdmissionID", fieldValue: String(this.opD_IPD_Id), opType: OperatorComparer.Equals }
    ]
  }
  Ipbillform: FormGroup;
  isClasselected: boolean = false;
  isServiceNameSelected: boolean = false;
  isDoctorSelected: boolean = false;
  filteredOptionsBillingClassName: Observable<string[]>;

  BillDiscperFlag: boolean = false;
  vGenbillflag: boolean = false
  IntreamFinal: any;
  sIsLoading: string = '';
  showTable: boolean;
  msg: any;
  chargeslist: any = [];
  chargeslist1: any = [];
  vDoctorID: any = 0;
  currentDate: Date = new Date();
  chkDiscflag: boolean = false;
  selectDate: Date = new Date();
  filteredDoctor: any;
  noOptionFoundsupplier: any;
  vClassId: any = 0;
  vClassName: any;
  vService: any;
  vAdminPer: any;
  vAdminAmt: any;


  dataSource = new MatTableDataSource<ChargesList>();
  dataSource1 = new MatTableDataSource<ChargesList>();
  prevbilldatasource = new MatTableDataSource<Bill>();
  advancedatasource = new MatTableDataSource<any>();
  PackageDatasource = new MatTableDataSource

  showAutocomplete = false;
  private nextPage$ = new Subject();
  vCashCounterID: any;

  FinalAmountpay = 0;
  vServiceDisAmt: any;
  b_DoctorName = '';
  b_traiffId = '';
  b_isPath = '';
  b_isRad = '';
  b_IsEditable = '';
  b_IsDocEditable = '';
  dateTimeObj: any;
  PharmacyAmont: any = 0;
  isExpanded: boolean = false;
  ServiceName: any;
  interimArray: any = [];

  discAmount: any;
  screenFromString = 'IP-billing';
  ChargesDoctorname: any;
  isLoadingStr: string = '';
  BalanceAmt: any;
  paidamt: any;
  balanceamt: any;
  IsCredited: boolean;
  flagSubmit: boolean;
  Adminamt: any;
  Adminper: any;
  FAmount: any;
  AdminDiscamt: any;
  CompDisamount: any;

  vTotalBillAmount: any;
  vDiscountAmount: any = 0;
  vNetBillAmount: any;
  vAdvTotalAmount: any = 0;
  vBalanceAmt: any = 0;
  vFinalDiscountAmt: any;
  vpaidBalanceAmt: any = 0;
  vConcessionId: any = 0;
  vFinalDiscper: any = 0;

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('drawer') public drawer: MatDrawer;

  ConcessionShow: boolean = false;
  isLoading: String = '';
  // selectedAdvanceObj: AdvanceDetailObj;
  selectedAdvanceObj: any;
  isFilteredDateDisabled: boolean = false;
  Admincharge: boolean = true;
  doctorNameCmbList: any = [];
  BillingClassCmbList: any = [];
  IPBillingInfor: any = [];
  AdmissionId: any;
  MenuMasterid: any;
  reportPrintObj: any;
  reportPrintObjList: any[] = [];
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  ConcessionId: any;
  vIpCash: any = 0;
  vPharcash: any = 0;
  ClassList: any = [];
  optionsclass: any[] = [];

  vMobileNo: any;
  filteredOptionsCashCounter: Observable<string[]>;
  filteredOptionsDoctors: any;
  optionsSearchDoc: any[] = [];

  private _onDestroy = new Subject<void>();
  isDoctor: boolean = false;
  Consession: boolean = true;
  percentag: boolean = true;
  Amount: boolean = true;

  filteredOptionsselclass: Observable<string[]>;
  registerObj1: any;
  public subscription: Array<Subscription> = [];


  public isUpdating = false;

  Serviceform: FormGroup;

  SelectedAdvancelist: any = [];


  vPrice: any = '0';
  vQty: any;
  vServiceTotalAmt: any;
  vServiceNetAmt: any;
  vServiceDiscPer: any;
  doctorName: any
  doctorID: any;
  serviceId: any;
  vAdvanceId: any = 0;
  TotalAdvanceAmt: any = 0;
  BillBalAmount: any = 0;

  autocompleteModeCashcounter: string = "CashCounter";
  autocompleteModedeptdoc: string = "ConDoctor";
  autocompleteModeService: string = "Service";
  autocompleteModeConcession: string = "Concession";
  autocompleteModeClass: string = "Class";


  constructor(
    private _Activatedroute: ActivatedRoute,
    private changeDetectorRefs: ChangeDetectorRef,
    public _printPreview: PrintPreviewService,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public _IpSearchListService: IPSearchListService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<IPBillingComponent>,
    private accountService: AuthenticationService,
    public _WhatsAppEmailService: WhatsAppEmailService,
    public toastr: ToastrService,
    public _ConfigService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder) {
    this.showTable = false;
  }

  ApiURL: any;

  ngOnInit(): void {
    debugger
    this.createserviceForm();
    this.createBillForm();
    if (this.data) {
      this.selectedAdvanceObj = this.data.Obj;
      console.log(this.selectedAdvanceObj)
      this.opD_IPD_Id = this.selectedAdvanceObj.admissionId || "0"
      console.log(this.opD_IPD_Id)
      this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + this.selectedAdvanceObj.tariffId + "&ClassId=" + 2 + "&ServiceName="
      this.getdata(this.selectedAdvanceObj.admissionId)
      this.getadvancelist(this.selectedAdvanceObj.admissionId)
    }
    this.getChargesList();
    this.getBillheaderList();
    this.getPharmacyAmount();
    this.getRequestChargelist(); 


    if (this.selectedAdvanceObj.IsDischarged) {
      this.Ipbillform.get('GenerateBill').enable();
      this.Ipbillform.get('GenerateBill').setValue(true);
    }
    else {
      this.Ipbillform.get('GenerateBill').disable();
      this.Ipbillform.get('GenerateBill').setValue(false);
    }
    if (this.selectedAdvanceObj.CompanyName) {
      this.Ipbillform.get('CreditBill').enable();
      this.Ipbillform.get('CreditBill').setValue(true);
    }
    else {
      //this.Ipbillform.get('CreditBill').disable();
      this.Ipbillform.get('CreditBill').setValue(false);
    }
    this.setupFormListener();
  }
  private setupFormListener(): void {
    // this.handleChange('serviceName', () => this.filterServiceName());
    this.handleChange('price', () => this.calculateTotalCharge());
    this.handleChange('qty', () => this.calculateTotalCharge());
    this.handleChange('discPer', () => this.updateDiscountAmount());
    this.handleChange('discAmount', () => this.updateDiscountdiscPer());
    // this.handleChange('totalDiscountPer', () => this.updateTotalDiscountAmt(), this.totalChargeForm);
    // this.handleChange('totalDiscountAmount', () => this.updateTotalDiscountPer(), this.totalChargeForm);
  }

  calculateTotalCharge(row: any = null): void {
    let qty = +this.Serviceform.get("qty").value;
    let price = +this.Serviceform.get("price").value;

    if (qty <= 0 || price <= 0) return;

    let total = qty * price;
    this.Serviceform.patchValue({
      TotalAmt: total,
      netAmount: total  // Set net amount initially
    }, { emitEvent: false }); // Prevent infinite loop

    this.updateDiscountAmount();
    this.updateDiscountdiscPer();

  }
  // Trigger when discount discPer change
  updateDiscountAmount(row: any = null): void { 
    if (this.isUpdating) return; // Stop recursion
    this.isUpdating = true;

    const perControl = this.Serviceform.get("discPer");
    if (!perControl.valid) {
      this.Serviceform.get("discAmount").setValue(0);
      this.Serviceform.get("discPer").setValue(0);
      this.isUpdating = false;
      this.toastr.error("Enter discount % between 0-100");
      return;
    }
    let discPer = perControl.value;
    let totalAmount = this.Serviceform.get("TotalAmt").value;
    let discountAmount = parseFloat((totalAmount * discPer / 100).toFixed(2));
    let netAmount = parseFloat((totalAmount - discountAmount).toFixed(2));

    this.Serviceform.patchValue({
      discAmount: discountAmount,
      netAmount: netAmount
    }, { emitEvent: false }); // Prevent infinite loop

    this.isUpdating = false; // Reset flag
  }

  // Trigger when discount amount change
  updateDiscountdiscPer(): void {
    debugger
    if (this.isUpdating) return;
    this.isUpdating = true;

    let discountAmount = this.Serviceform.get("discAmount").value;
    let totalAmount = this.Serviceform.get("TotalAmt").value;

    if (discountAmount < 0 || discountAmount > totalAmount) {
      this.Serviceform.get("discAmount").setValue(0);
      this.Serviceform.get("discPer").setValue(0);
      this.isUpdating = false;
      this.toastr.error("Discount must be between 0 and the total amount.");
      return;
    }

    let percent = Number(totalAmount ? ((discountAmount / totalAmount) * 100).toFixed(2) : "0.00");
    let netAmount = Number((totalAmount - discountAmount).toFixed(2));
    this.Serviceform.patchValue({
      discPer: percent,
      netAmount: netAmount
    }, { emitEvent: false }); // Prevent infinite loop

    this.isUpdating = false; // Reset flag
  }
 
  getFixedDecimal(value: number) {
    return Number(value.toFixed(2));
  }
  // Create registered form group
  createserviceForm() {
    this.Serviceform = this.formBuilder.group({
      ChargeClass: ['', Validators.required],
      Date: [new Date()],
      ServiceName: ['', Validators.required],
      price: [0, Validators.required],
      qty: [1, Validators.required],
      TotalAmt: [0, Validators.required],
      DoctorID: [''],
      discPer: [0, [Validators.min(0), Validators.max(100)]],
      discAmount: [0, [Validators.min(0)]],
      netAmount: [0, Validators.required]
    });
  }
  //service selected data
  getSelectedserviceObj(obj) {
    console.log(obj)
    this.ServiceName = obj.ServiceName;
    this.vPrice = obj.classRate;
    this.vServiceTotalAmt = obj.Price;
    this.vServiceNetAmt = obj.Price;
    this.serviceId = obj.serviceId;
    this.b_isPath = obj.isPathology;
    this.b_isRad = obj.isRadiology;

    if (obj.creditedtoDoctor == true) {
      this.Serviceform.get('DoctorID').reset();
      this.Serviceform.get('DoctorID').setValidators([Validators.required]);
      this.Serviceform.get('DoctorID').enable();
      this.isDoctor = true;

    } else {
      this.Serviceform.get('DoctorID').reset();
      this.Serviceform.get('DoctorID').clearValidators();
      this.Serviceform.get('DoctorID').updateValueAndValidity();
      this.Serviceform.get('DoctorID').disable();
      this.isDoctor = false;
    }
  }

  //Doctor selected 
  getdocdetail(event) {
    this.doctorName = event.text
    this.doctorID = event.value
  }
  //Class selected 
  getSelectedClassObj(event) {
    this.vClassName = event.text
    this.vClassId = event.value
    this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + this.selectedAdvanceObj.tariffId + "&ClassId=" + event.value + "&ServiceName="
  }

  // Service Add 
  onSaveAddCharges() {
    let doctorid = 0;
    let doctorName = '';
    if (this.isDoctor) {
      if ((this.doctorID == '' || this.doctorID == null || this.doctorID == undefined)) {
        this.toastr.warning('Please select Doctor', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if (this.Serviceform.get("DoctorID").value)
        doctorid = this.Serviceform.get("DoctorID").value.DoctorID;

      if (this.Serviceform.get("DoctorID").value)
        doctorName = this.Serviceform.get("DoctorID").value.DoctorName;
    }

    if (this.Serviceform.valid) {
      const formValue = this.Serviceform.value;
      console.log("Form values:", formValue)
      //CHecking Validation 
      if ((formValue.ChargeClass == '' || formValue.ChargeClass == null || formValue.ChargeClass == undefined)) {
        this.toastr.warning('Please select Ward', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if ((formValue.ServiceName.serviceId == '' || formValue.ServiceName.serviceId == null || formValue.ServiceName.serviceId == undefined)) {
        this.toastr.warning('Please select service', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if ((formValue.price == '' || formValue.price == null || formValue.price == undefined || formValue.price == '0')) {
        this.toastr.warning('Please enter price', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if ((formValue.qty == '' || formValue.qty == null || formValue.qty == undefined || formValue.qty == '0')) {
        this.toastr.warning('Please enter qty', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      // Calculate total amount, discount amount, and net amount
      const totalAmount = formValue.price * formValue.qty;
      const discountAmount = (totalAmount * formValue.discPer) / 100;
      const netAmount = totalAmount - discountAmount;

      var m_data = {
        "chargesId": 0,
        "chargesDate": this.datePipe.transform(formValue.Date, "yyyy-MM-dd") || '1900-01-01',
        "opdIpdType": 1,
        "opdIpdId": this.opD_IPD_Id,
        "serviceId": formValue.ServiceName.serviceId,
        "price": formValue.price || 0,
        "qty": formValue.qty || 0,
        "totalAmt": totalAmount || 0,
        "concessiondiscPer": formValue.discPer || 0,
        "concessionAmount": discountAmount || 0,
        "netAmount": netAmount || 0,
        "doctorId": doctorid,
        "docdiscPer": 0,
        "docAmt": 0,
        "hospitalAmt": 0,
        "isGenerated": false,
        "addedBy": this.accountService.currentUserValue.userId,
        "isCancelled": false,
        "isCancelledBy": 0,
        "isCancelledDate": "1900-01-01",
        "isPathology": formValue.ServiceName.isPathology,
        "isRadiology": formValue.ServiceName.isRadiology,
        "isDoctorShareGenerated": 0,
        "isInterimBillFlag": 0,
        "isPackage": formValue.ServiceName.isPackage,
        "isSelfOrCompanyService": 0,
        "packageId": 0,
        "chargesTime": this.datePipe.transform(formValue.Date, "yyyy-MM-dd") || '1900-01-01', // this.datePipe.transform(this.currentDate, "MM-dd-yyyy HH:mm:ss"),
        "packageMainChargeId": 0,
        "classId": formValue.ChargeClass,
        "refundAmount": 0,
        "cPrice": 0,
        "cQty": 0,
        "cTotalAmount": 0,
        "isComServ": false,
        "isPrintCompSer": false,
        "serviceName": "",
        "chPrice": 0,
        "chQty": 0,
        "chTotalAmount": 0,
        "isBillableCharity": false,
        "salesId": 0,
        "billNo": 1,
        "isHospMrk": 0
      }
      console.log("Save JSON:", m_data);
      this._IpSearchListService.InsertIPAddCharges(m_data).subscribe(response => {
        console.log(response)
        this.toastr.success(response.message);
        this.getChargesList();
      }, (error) => {
        this.toastr.error(error.message);
      });

    }
    this.interimArray = [];
    this.isDoctor = false;
    this.onClearServiceAddList();
  }
  onClearServiceAddList() {
    this.Serviceform.get('ServiceName').setValue("");
    this.Serviceform.get('price').reset();
    this.Serviceform.get('qty').reset('1');
    this.Serviceform.get('TotalAmt').reset();
    this.Serviceform.get('DoctorID').reset();
    this.Serviceform.get('discPer').reset();
    this.Serviceform.get('discAmount').reset();
    this.Serviceform.get('netAmount').reset();
  }

  getdata(opD_IPD_Id) {
    this.gridConfig1 = {
      apiUrl: "IPBill/IPPreviousBillList",
      columnsList: this.allColumns,
      sortField: "BillNo",
      sortOrder: 0,
      filters: [
        { fieldName: "IP_Id", fieldValue: String(opD_IPD_Id), opType: OperatorComparer.Equals }
      ]
    },
      this.gridConfig = {
        apiUrl: "Advance/PatientWiseAdvanceList",
        columnsList: this.AdvanceColumns,
        sortField: "AdvanceDetailID",
        sortOrder: 0,
        filters: [
          { fieldName: "AdmissionID", fieldValue: String(opD_IPD_Id), opType: OperatorComparer.Equals }
        ]
      }
  }
  //Advance list
  getadvancelist(AdmissionId) {
    if (AdmissionId > 0) {
      var vdata = {
        "first": 0,
        "rows": 10,
        "sortField": "AdmissionID",
        "sortOrder": 0,
        "filters": [
          {
            "fieldName": "AdmissionID",
            "fieldValue": String(AdmissionId),
            "opType": "Equals"
          }
        ],
        "exportType": "JSON"
      }
      setTimeout(() => {
        this._IpSearchListService.AdvanceHeaderlist(vdata).subscribe((response) => {
          this.SelectedAdvancelist = response.data;
          if (this.SelectedAdvancelist.length > 0)
            this.vAdvanceId = this.SelectedAdvancelist[0].advanceId
          this.SelectedAdvancelist.forEach(element => {
            this.TotalAdvanceAmt += element.advanceAmount
          })
          if (this.TotalAdvanceAmt < this.vNetBillAmount) {
            this.BillBalAmount = this.vNetBillAmount - this.TotalAdvanceAmt
          } else {
            this.BillBalAmount = this.vNetBillAmount
          }

        });
      }, 500);
    }
  }
  //Charge list 
  getChargesList() {
    this.chargeslist = [];
    this.dataSource.data = [];
    var vdata = {
      "first": 0,
      "rows": 10,
      "sortField": "ServiceId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "OPD_IPD_Id",
          "fieldValue": String(this.opD_IPD_Id),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON"
    }
    // console.log(Query);
    this._IpSearchListService.getchargesList(vdata).subscribe(response => {
      this.chargeslist = response.data
      console.log(this.chargeslist)
      this.dataSource.data = this.chargeslist;
      this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
    },
      (error) => {
        this.isLoading = 'list-loaded';
      });
    this.chkdiscstatus();
  } 
  //Table Total netAmt
  TotalShowAmt:any=0;
  DiscShowAmt:any=0;
  getNetAmtSum(element) {
    let netAmt = element.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0);
    this.TotalShowAmt = element.reduce((sum, { totalAmt }) => sum += +(totalAmt || 0), 0);
    this.DiscShowAmt = element.reduce((sum, { concessionAmount }) => sum += +(concessionAmount || 0), 0);
 
    this.Ipbillform.patchValue({
      FinalAmount:netAmt,
      concessionAmt:this.DiscShowAmt
    })

    if (this.DiscShowAmt > 0) { 
      this.ConcessionShow = true
    } else { 
      this.ConcessionShow = false
    }
    return netAmt;
  }  















  
  createBillForm() {
    this.Ipbillform = this.formBuilder.group({
      TotalAmt: [0],
      discPer: [''],
      concessionAmt: [''],
      ConcessionId: [''],
      Remark: [''],
      GenerateBill: [1],
      CreditBill: [''],
      FinalAmount: 0,
      CashCounterID: [''],
      IpCash: [''],
      Pharcash: [''],
      ChargeClass: [''],
      AdminPer: [''],
      AdminAmt: [''],
      Admincheck: [''],
    });
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getValidationMessages() {
    return {
      ChargeClass: [
        { name: "required", Message: "Class Name is required" },
      ],
      ServiceName: [
        { name: "required", Message: "Service Name is required" },
      ],
      cashCounterId: [
        { name: "required", Message: "First Name is required" },

        { name: "pattern", Message: "only Number allowed." }
      ],
      price: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      qty: [
        { name: "required", Message: "Qty required!", },
        { name: "pattern", Message: "only Number allowed.", },
        { name: "min", Message: "Enter valid qty.", }
      ],
      totalAmount: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      DoctorId: [
        { name: "pattern", Message: "only Char allowed." }
      ],
      discPer: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      discAmount: [{ name: "pattern", Message: "only Number allowed." }],
      netAmount: [{ name: "pattern", Message: "only Number allowed." }],
      concessionId: [{}],
      DoctorID: [{}]
    }
  }
  selectChangeConcession(event) { }

  OnDateChange() {
    // 
    // if (this.selectedAdvanceObj.AdmDateTime) {
    //   const day = +this.selectedAdvanceObj.AdmDateTime.substring(0, 2);
    //   const month = +this.selectedAdvanceObj.AdmDateTime.substring(3, 5);
    //   const year = +this.selectedAdvanceObj.AdmDateTime.substring(6, 10);

    //   this.vExpDate = `${year}/${this.pad(month)}/${day}`;
    // }
    // const serviceDate = this.datePipe.transform(this.Serviceform.get('Date').value,"yyyy-MM-dd 00:00:00.000") || 0;
    // const AdmissionDate = this.datePipe.transform(this.selectedAdvanceObj.AdmDateTime,"yyyy-MM-dd 00:00:00.000") || 0;
    // if(serviceDate > AdmissionDate){
    //   Swal.fire('should not chnage');
    // }
    // else{
    //   Swal.fire('ok');
    // }
  }

 
 
  //Pharamcy Amount 
  getPharmacyAmount() {
    let Query = "select isnull(Sum(BalanceAmount),0) as PhBillCredit from T_SalesHeader where OP_IP_Type=1 and OP_IP_ID=" + this.AdmissionId
    this._IpSearchListService.getPharmacyAmt(Query).subscribe((data) => {
      console.log(data)
      this.PharmacyAmont = data[0].PhBillCredit;
    })
  }
  getDatewiseChargesList(param) {
    // console.log(param);
    this.chargeslist = [];
    this.dataSource.data = [];
    this.isLoadingStr = 'loading';
    let Query = "Select * from lvwAddCharges where IsGenerated=0 and IsPackage=0 and IsCancelled =0 AND OPD_IPD_ID=" + this.selectedAdvanceObj.AdmissionID + " and OPD_IPD_Type=1 and ChargesDate ='" + this.datePipe.transform(param, "dd/MM/YYYY") + "' Order by Chargesid"

    // console.log(Query)
    this._IpSearchListService.getchargesList(Query).subscribe(data => {
      this.chargeslist = data as ChargesList[];
      // console.log(this.chargeslist)
      this.dataSource.data = this.chargeslist;
      this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
    },
      (error) => {
        this.isLoading = 'list-loaded';
      });
  }
  getRequestChargelist() {
    this.chargeslist1 = [];
    this.dataSource1.data = [];
    var m = {
      OP_IP_ID: this.selectedAdvanceObj.AdmissionID,
    }
    this._IpSearchListService.getchargesList1(m).subscribe(data => {
      this.chargeslist1 = data as ChargesList[];
      this.dataSource1.data = this.chargeslist1;
      // console.log(this.dataSource1.data)
      this.isLoading = 'list-loaded';
    },
      (error) => {
        this.isLoading = 'list-loaded';
      });
  }



  billheaderlist: any;
  //Admin Charge retreiving 
  getBillheaderList() {
    this.isLoadingStr = 'loading';
    let Query = "select Isnull(AdminPer,0) as AdminPer from Admission where AdmissionId=" + this.selectedAdvanceObj.AdmissionID
    //console.log(Query); 
    this._IpSearchListService.getBillheaderList(Query).subscribe(data => {
      this.billheaderlist = data[0].AdminPer;
      // console.log(this.billheaderlist)
      if (this.billheaderlist > 0) {
        this.isAdminDisabled = true;
        this.Ipbillform.get('Admincheck').setValue(true)
        this.vAdminPer = this.billheaderlist
        //   console.log(this.vAdminPer)
      } else {
        this.isAdminDisabled = false;
        this.Ipbillform.get('Admincheck').setValue(false)
      }
    });
  }
  //nursing Service List added
  AddList(m) {
    console.log(m)
    var m_data = {
      "chargeID": 0,
      "chargesDate": this.datePipe.transform(this.currentDate, "MM-dd-yyyy"),
      "opD_IPD_Type": 1,
      "opD_IPD_Id": m.OP_IP_ID,
      "serviceId": m.ServiceId,
      "price": m.price,
      "qty": 1,
      "totalAmt": (m.price * 1),
      "concessiondiscPer": 0,
      "concessionAmount": 0,
      "netAmount": (m.price * 1),
      "doctorId": 0,
      "docdiscPer": 0,
      "docAmt": 0,
      "hospitalAmt": 0,
      "isGenerated": 0,
      "addedBy": this.accountService.currentUserValue.userId,
      "isCancelled": 0,
      "isCancelledBy": 0,
      "isCancelledDate": "01/01/1900",
      "isPathology": m.IsPathology,
      "isRadiology": m.IsRadiology,
      "isPackage": 0,
      "packageMainChargeID": 0,
      "isSelfOrCompanyService": false,
      "packageId": 0,
      "chargeTime": this.datePipe.transform(this.currentDate, "MM-dd-yyyy HH:mm:ss"),
      "classId": this.Serviceform.get("ChargeClass").value.ClassId
    }
    let submitData = {
      "addCharges": m_data
    };
    this._IpSearchListService.InsertIPAddChargesNew(submitData).subscribe(data => {
      if (data) {
        Swal.fire('Success !', 'ChargeList Row Added Successfully', 'success');
        this.getChargesList();
      }
    });
    this.onClearServiceAddList()
    this.itemid.nativeElement.focus();
    this.isLoading = '';
  }



  
  //Admin Charge Check Box On 
  isAdminDisabled: boolean = false;
  TotalServiceDiscPer:any;
  AdminStatus(event) {
    if (event.checked == true) {
      this.isAdminDisabled = true;
    } else {
      this.isAdminDisabled = false;
      this.Ipbillform.get('AdminPer').reset();
      this.Ipbillform.get('AdminAmt').reset();
    }
    if (parseInt(this.TotalServiceDiscPer) > 0) {
      this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
    } else {
      this.Ipbillform.get('FinalAmount').setValue(this.vTotalAmount);
      this.CalFinalDisc();
      this.chkdiscstatus();
    }
  }

  CalculateAdminCharge() {
    if (this.vAdminPer > 0 && this.vAdminPer < 100) {
      this.vAdminAmt = Math.round((parseFloat(this.vTotalAmount) * parseFloat(this.vAdminPer)) / 100).toFixed(2);
      let FinalTotalAmt = (parseFloat(this.vTotalAmount) + parseFloat(this.vAdminAmt)).toFixed(2);

      if (parseInt(this.TotalServiceDiscPer) > 0) {
        let finalnetamt = Math.round(parseFloat(FinalTotalAmt) - parseFloat(this.vFinalDiscountAmt)).toFixed(2);
        this.Ipbillform.get('FinalAmount').setValue(finalnetamt);
      } else {
        let discPer = this.Ipbillform.get('discPer').value || 0;
        this.vFinalDiscountAmt = Math.round((parseFloat(FinalTotalAmt) * parseFloat(discPer)) / 100).toFixed(2);
        this.vNetBillAmount = Math.round(parseFloat(FinalTotalAmt) - parseFloat(this.vFinalDiscountAmt)).toFixed(2);
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
      }
    } else {
      if (this.vAdminPer < 0 && this.vAdminPer > 100 || this.vAdminPer == 0 || this.vAdminPer == '') {
        this.Ipbillform.get('AdminPer').reset();
        this.Ipbillform.get('AdminAmt').reset();
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        this.CalFinalDisc();
      }
      if (this.vAdminPer > 100) {
        this.toastr.warning('Please Enter Admin % less than 100 and Greater than 0.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        this.Ipbillform.get('AdminPer').reset();
        this.Ipbillform.get('AdminAmt').reset();
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        this.CalFinalDisc();
      }
    }
  }
  // Total Bill Disc Per cal 
  CalFinalDisc() {

    let BillDiscPer = this.Ipbillform.get('discPer').value || 0;

    if (this.Ipbillform.get('AdminAmt').value > 0) {
      let FinalTotalAmt = ((parseFloat(this.vTotalAmount) + parseFloat(this.vAdminAmt))).toFixed(2);

      if (BillDiscPer > 0 && BillDiscPer < 100 || BillDiscPer > 100) {
        if (BillDiscPer > 100) {
          this.toastr.warning('Please Enter Discount % less than 100 and Greater than 0.', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          this.Ipbillform.get('discPer').reset();
          this.vFinalDiscountAmt = '';
          this.vNetBillAmount = FinalTotalAmt;
          this.Ipbillform.get('concessionAmt').setValue(this.vFinalDiscountAmt);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        } else {
          this.vFinalDiscountAmt = Math.round((parseFloat(FinalTotalAmt) * parseFloat(BillDiscPer)) / 100).toFixed(2);
          this.vNetBillAmount = Math.round(parseFloat(FinalTotalAmt) - parseFloat(this.vFinalDiscountAmt)).toFixed(2);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
          this.Ipbillform.get('concessionAmt').setValue(this.vFinalDiscountAmt);
        }
      } else {
        this.Ipbillform.get('discPer').reset();
        this.vFinalDiscountAmt = '';
        this.vNetBillAmount = FinalTotalAmt;
        this.Ipbillform.get('concessionAmt').setValue(this.vFinalDiscountAmt);
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        this.finaldisc.nativeElement.focus();
      }
      this.chkdiscstatus();
    } else {
      if (BillDiscPer > 0 && BillDiscPer < 100) {
        this.vFinalDiscountAmt = Math.round((parseFloat(this.vTotalAmount) * parseFloat(BillDiscPer)) / 100).toFixed(2);
        this.vNetBillAmount = Math.round(parseFloat(this.vTotalAmount) - parseFloat(this.vFinalDiscountAmt)).toFixed(2);
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        this.Ipbillform.get('concessionAmt').setValue(this.vFinalDiscountAmt);
      } else {
        this.Ipbillform.get('discPer').reset();
        this.vFinalDiscountAmt = '';
        this.vNetBillAmount = this.vTotalAmount;
        this.Ipbillform.get('concessionAmt').setValue(this.vFinalDiscountAmt);
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
      }
      if (BillDiscPer > 100) {
        this.toastr.warning('Please Enter Discount % less than 100 and Greater than 0.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        this.Ipbillform.get('discPer').reset();
        this.vFinalDiscountAmt = '';
        this.vNetBillAmount = this.vTotalAmount;
        this.Ipbillform.get('concessionAmt').setValue(this.vFinalDiscountAmt);
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
      }
      this.chkdiscstatus();
    }

  }
  //Total Bill DiscAMt cal
  vTotalAmount:any;
  getDiscAmtCal() {
    let FinalDiscAmt = this.Ipbillform.get('concessionAmt').value || 0;

    if (this.Ipbillform.get('AdminAmt').value > 0) {

      let FinalTotalAMt = ((parseFloat(this.vTotalAmount) + parseFloat(this.vAdminAmt))).toFixed(2);

      if (FinalDiscAmt > 0 && parseFloat(FinalDiscAmt) < parseFloat(FinalTotalAMt) || parseFloat(FinalDiscAmt) > parseFloat(FinalTotalAMt)) {
        if (parseFloat(FinalDiscAmt) > parseFloat(FinalTotalAMt)) {
          this.toastr.warning('Please Enter Discount amt less than Total and Greater than 0.', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          this.Ipbillform.get('concessionAmt').reset();
          this.vFinalDiscper = '';
          this.vNetBillAmount = FinalTotalAMt;
          this.Ipbillform.get('discPer').setValue(this.vFinalDiscper);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        } else {
          this.vFinalDiscper = ((parseFloat(FinalDiscAmt) / parseFloat(FinalTotalAMt)) * 100).toFixed(2);
          this.vNetBillAmount = Math.round(parseFloat(FinalTotalAMt) - parseFloat(FinalDiscAmt)).toFixed(2);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
          this.Ipbillform.get('discPer').setValue(this.vFinalDiscper);
        }
      } else {
        this.toastr.warning('Please Enter Discount amt less than Total and Greater than 0.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        this.Ipbillform.get('concessionAmt').reset();
        this.vFinalDiscper = '';
        this.vNetBillAmount = FinalTotalAMt;
        this.Ipbillform.get('discPer').setValue(this.vFinalDiscper);
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
      }

    } else {
      if (FinalDiscAmt > 0 && parseFloat(FinalDiscAmt) < parseFloat(this.vTotalAmount) || parseFloat(FinalDiscAmt) > parseFloat(this.vTotalAmount)) {
        if (parseFloat(FinalDiscAmt) > parseFloat(this.vTotalAmount)) {
          this.toastr.warning('Please Enter Discount amt less than Total and Greater than 0.', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          this.Ipbillform.get('concessionAmt').reset();
          this.vFinalDiscper = '';
          this.vNetBillAmount = this.vTotalAmount;
          this.Ipbillform.get('discPer').setValue(this.vFinalDiscper);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        } else {
          this.vFinalDiscper = ((parseFloat(FinalDiscAmt) / parseFloat(this.vTotalAmount)) * 100).toFixed(2);
          this.vNetBillAmount = Math.round(parseFloat(this.vTotalAmount) - parseFloat(FinalDiscAmt)).toFixed(2);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
          this.Ipbillform.get('discPer').setValue(this.vFinalDiscper);
        }
      } else {
        this.toastr.warning('Please Enter Discount amt less than Total and Greater than 0.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        this.Ipbillform.get('concessionAmt').reset();
        this.vFinalDiscper = '';
        this.vNetBillAmount = this.vTotalAmount;
        this.Ipbillform.get('discPer').setValue(this.vFinalDiscper);
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
      }
    }
    this.chkdiscstatus();
  }

  chkdiscstatus() {
    let CheckDiscAmt = this.Ipbillform.get('concessionAmt').value || 0
    if (this.vFinalDiscountAmt > 0 || CheckDiscAmt > 0) {
      this.ConcessionShow = true;
    } else {
      this.ConcessionShow = false;
    }
    if (parseFloat(this.TotalServiceDiscPer) > 0) {
      this.BillDiscperFlag = false;
    } else {
      this.BillDiscperFlag = true;
    }
  }
  generateBillchk($event) {
    if ($event)
      this.vGenbillflag = true;
    if (!$event)
      this.vGenbillflag = false;
  }


  deletecharges(contact) {
    Swal.fire({
      title: 'Do you want to Delete Charges',
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'OK',

    }).then((flag) => {

      if (flag.isConfirmed) {
        let Chargescancle = {};
        Chargescancle['ChargesId'] = contact.ChargesId;
        Chargescancle['userId'] = this.accountService.currentUserValue.userId;

        let submitData = {
          "deleteCharges": Chargescancle
        };

        console.log(submitData);
        this._IpSearchListService.Addchargescancle(submitData).subscribe(response => {
          if (response) {
            Swal.fire('Charges cancelled !', 'Charges cancelled Successfully!', 'success').then((result) => {
              this.getChargesList();
              this.CalculateAdminCharge();
              this.CalFinalDisc();
              this.chkdiscstatus()
            });
          } else {
            Swal.fire('Error !', 'Charges cancelled data not saved', 'error');
          }
          this.isLoading = '';
        });
      }
    });

  }
  showAllFilter(event) {
    console.log(event);
    if (event.checked == true)
      // this.isFilteredDateDisabled = event.value;
      this.isFilteredDateDisabled = true;
    if (event.checked == false) {
      this.getChargesList();
      this.isFilteredDateDisabled = false;
    }
  }
  //Save
  onSave() {
    if (this.Ipbillform.get('concessionAmt').value > 0 || this.Ipbillform.get('discPer').value > 0) {
      if (!this.Ipbillform.get('ConcessionId').value.ConcessionId) {
        this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    if (!this.Ipbillform.get('CashCounterID').value) {
      this.toastr.warning('Please select Cash Counter.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // if (this.Ipbillform.get('CashCounterID').value) {
    //   if (!this.CashCounterList.some(item => item.CashCounterName === this.Ipbillform.get('CashCounterID').value.CashCounterName)) {
    //     this.toastr.warning('Please Select valid Cash Counter Name', 'Warning !', {
    //       toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    //   }
    // }

    if (this.dataSource.data.length > 0) {
      if (this.Ipbillform.get('GenerateBill').value) {
        Swal.fire({
          title: 'Do you want to generate the Final Bill ',
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Generate!"

        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {

            // this.SaveBill();
            this.SaveBill1();
          }
        })
      }
      else {
        Swal.fire({
          title: 'Do you want to save the Draft Bill ',
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Save!"

        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.onSaveDraft();
          }
        })
      }
    } else {
      Swal.fire("Select Data For Save")
    }


    //this.Ipbillform.get('GenerateBill').setValue(false);
  }
  SaveBill1() {
    if (this.dataSource.data.length > 0 && (this.vNetBillAmount > 0)) {
      this.isLoading = 'submit';
      if (this.Ipbillform.get('CreditBill').value || this.selectedAdvanceObj.CompanyId) {
        this.IPCreditBill();
      }
      else {
        let PatientHeaderObj = {};
        PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
        PatientHeaderObj['Date'] = this.dateTimeObj.date;
        PatientHeaderObj['UHIDNO'] = this.selectedAdvanceObj.RegNo;
        PatientHeaderObj['DoctorName'] = this.selectedAdvanceObj.Doctorname;
        PatientHeaderObj['IPDNo'] = this.selectedAdvanceObj.IPDNo; // this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value;
        PatientHeaderObj['NetPayAmount'] = this.Ipbillform.get('FinalAmount').value;
        PatientHeaderObj['AdvanceAmount'] = this.Ipbillform.get('FinalAmount').value;
        PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;

        console.log('============================== Save IP Billing ===========');
        //==============-======--==============Payment======================
        // IPAdvancePaymentComponent
        this.advanceDataStored.storage = new AdvanceDetailObj(PatientHeaderObj);
        const dialogRef = this._matDialog.open(IPpaymentWithadvanceComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              vPatientHeaderObj: PatientHeaderObj,
              FromName: "IP-Bill",
              advanceObj: PatientHeaderObj
            }
          });

        dialogRef.afterClosed().subscribe(result => {
          // console.log('============================== Save IP Billing ===========');
          console.log(result);

          this.flagSubmit = result.IsSubmitFlag

          if (this.flagSubmit) {
            this.paidamt = result.PaidAmt;
            this.balanceamt = result.BalAmt;
          }
          else {
            this.balanceamt = result.BalAmt;
          }
          let InsertBillUpdateBillNoObj = {};
          InsertBillUpdateBillNoObj['BillNo'] = 0;
          InsertBillUpdateBillNoObj['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID,
            InsertBillUpdateBillNoObj['TotalAmt'] = this.vTotalAmount || 0;
          InsertBillUpdateBillNoObj['ConcessionAmt'] = this.Ipbillform.get('concessionAmt').value || 0;
          InsertBillUpdateBillNoObj['NetPayableAmt'] = this.Ipbillform.get('FinalAmount').value || 0;
          InsertBillUpdateBillNoObj['PaidAmt'] = this.paidamt,
            InsertBillUpdateBillNoObj['BalanceAmt'] = this.balanceamt,
            InsertBillUpdateBillNoObj['BillDate'] = this.dateTimeObj.date;
          InsertBillUpdateBillNoObj['OPD_IPD_Type'] = 1;
          InsertBillUpdateBillNoObj['AddedBy'] = this.accountService.currentUserValue.userId,
            InsertBillUpdateBillNoObj['TotalAdvanceAmount'] = this.vAdvTotalAmount || 0,
            InsertBillUpdateBillNoObj['BillTime'] = this.dateTimeObj.time;
          InsertBillUpdateBillNoObj['ConcessionReasonId'] = this.Ipbillform.get('ConcessionId').value.ConcessionId || 0
          InsertBillUpdateBillNoObj['IsSettled'] = 0;
          InsertBillUpdateBillNoObj['IsPrinted'] = 1;
          InsertBillUpdateBillNoObj['IsFree'] = 0;
          InsertBillUpdateBillNoObj['CompanyId'] = this.selectedAdvanceObj.CompanyId || 0,
            InsertBillUpdateBillNoObj['TariffId'] = this.selectedAdvanceObj.TariffId || 0,
            InsertBillUpdateBillNoObj['UnitId'] = this.selectedAdvanceObj.UnitId || 0;
          InsertBillUpdateBillNoObj['InterimOrFinal'] = 0;
          InsertBillUpdateBillNoObj['CompanyRefNo'] = 0;
          InsertBillUpdateBillNoObj['ConcessionAuthorizationName'] = 0;
          InsertBillUpdateBillNoObj['TaxPer'] = this.Ipbillform.get('AdminPer').value || 0;
          InsertBillUpdateBillNoObj['TaxAmount'] = this.Ipbillform.get('AdminAmt').value || 0;
          InsertBillUpdateBillNoObj['DiscComments'] = this.Ipbillform.get('Remark').value || '';
          InsertBillUpdateBillNoObj['CompDiscAmt'] = 0//this.InterimFormGroup.get('Remark').value || ''; 
          InsertBillUpdateBillNoObj['cashCounterId'] = this.Ipbillform.get('CashCounterID').value.CashCounterId || 0;

          let Billdetsarr = [];
          this.dataSource.data.forEach((element) => {
            let BillDetailsInsertObj = {};
            BillDetailsInsertObj['BillNo'] = 0;
            BillDetailsInsertObj['ChargesId'] = element.chargesId;
            Billdetsarr.push(BillDetailsInsertObj);
          });

          let Cal_DiscAmount_IPBillObj = {};
          Cal_DiscAmount_IPBillObj['BillNo'] = 0;

          let AdmissionIPBillingUpdateObj = {};
          AdmissionIPBillingUpdateObj['AdmissionID'] = this.selectedAdvanceObj.AdmissionID;

          // const InsertBillUpdateBillNo = new Bill(InsertBillUpdateBillNoObj);
          // const Cal_DiscAmount_IPBill = new Cal_DiscAmount(Cal_DiscAmount_IPBillObj);
          // const AdmissionIPBillingUpdate = new AdmissionIPBilling(AdmissionIPBillingUpdateObj); 

          let UpdateAdvanceDetailarr1: IpPaymentInsert[] = [];
          UpdateAdvanceDetailarr1 = result.submitDataAdvancePay;

          // new
          let UpdateBillBalAmtObj = {};
          UpdateBillBalAmtObj['BillNo'] = 0;
          UpdateBillBalAmtObj['BillBalAmount'] = this.balanceamt;


          let UpdateAdvanceDetailarr = [];
          if (result.submitDataAdvancePay.length > 0) {
            result.submitDataAdvancePay.forEach((element) => {
              let UpdateAdvanceDetailObj = {};
              UpdateAdvanceDetailObj['AdvanceDetailID'] = element.AdvanceDetailID;
              UpdateAdvanceDetailObj['UsedAmount'] = element.UsedAmount;
              UpdateAdvanceDetailObj['BalanceAmount'] = element.BalanceAmount;
              UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);
            });
          }
          else {
            let UpdateAdvanceDetailObj = {};
            UpdateAdvanceDetailObj['AdvanceDetailID'] = 0,
              UpdateAdvanceDetailObj['UsedAmount'] = 0,
              UpdateAdvanceDetailObj['BalanceAmount'] = 0,
              UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);
          }

          let UpdateAdvanceHeaderObj = {};
          if (result.submitDataAdvancePay.length > 0) {
            UpdateAdvanceHeaderObj['AdvanceId'] = UpdateAdvanceDetailarr1[0]['AdvanceId'],
              UpdateAdvanceHeaderObj['AdvanceUsedAmount'] = UpdateAdvanceDetailarr1[0]['AdvanceAmount'],
              UpdateAdvanceHeaderObj['BalanceAmount'] = UpdateAdvanceDetailarr1[0]['BalanceAmount']
          }
          else {
            UpdateAdvanceHeaderObj['AdvanceId'] = 0,
              UpdateAdvanceHeaderObj['AdvanceUsedAmount'] = 0,
              UpdateAdvanceHeaderObj['BalanceAmount'] = 0
          }

          if (this.flagSubmit == true) {
            let submitData = {
              "InsertBillUpdateBillNo": InsertBillUpdateBillNoObj,
              "BillDetailsInsert": Billdetsarr,
              "Cal_DiscAmount_IPBill": Cal_DiscAmount_IPBillObj,
              "AdmissionIPBillingUpdate": AdmissionIPBillingUpdateObj,
              "ipInsertPayment": result.submitDataPay.ipPaymentInsert,
              "ipBillBalAmount": UpdateBillBalAmtObj,
              "ipAdvanceDetailUpdate": UpdateAdvanceDetailarr,
              "ipAdvanceHeaderUpdate": UpdateAdvanceHeaderObj

            };
            console.log(submitData)
            this._IpSearchListService.InsertIPBilling(submitData).subscribe(response => {
              if (response) {

                Swal.fire('Bill successfully !', 'IP final Bill generated successfully !', 'success').then((result) => {
                  if (result.isConfirmed) {
                    this._matDialog.closeAll();
                    this.viewgetBillReportPdf(response);
                    this.getWhatsappshareIPFinalBill(response, this.vMobileNo)
                  }
                });
              } else {
                Swal.fire('Error !', 'IP Final Billing data not saved', 'error');
              }
              this.isLoading = '';
            });
          }
        });
      }
    }
    this.advanceDataStored.storage = [];
  }
  IPCreditBill() {
    if (this.Ipbillform.get('CreditBill').value) {
      let InsertBillUpdateBillNoObj = {};
      InsertBillUpdateBillNoObj['BillNo'] = 0;
      InsertBillUpdateBillNoObj['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID,
        InsertBillUpdateBillNoObj['totalAmt'] = this.vTotalAmount || 0;
      InsertBillUpdateBillNoObj['ConcessionAmt'] = this.Ipbillform.get('concessionAmt').value || 0;
      InsertBillUpdateBillNoObj['NetPayableAmt'] = this.Ipbillform.get('FinalAmount').value || 0;
      InsertBillUpdateBillNoObj['PaidAmt'] = 0;
      InsertBillUpdateBillNoObj['BalanceAmt'] = this.Ipbillform.get('FinalAmount').value || 0;
      InsertBillUpdateBillNoObj['BillDate'] = this.dateTimeObj.date;
      InsertBillUpdateBillNoObj['OPD_IPD_Type'] = 1;
      InsertBillUpdateBillNoObj['AddedBy'] = this.accountService.currentUserValue.userId,
        InsertBillUpdateBillNoObj['TotalAdvanceAmount'] = this.vAdvTotalAmount || 0,
        InsertBillUpdateBillNoObj['BillTime'] = this.dateTimeObj.time;
      InsertBillUpdateBillNoObj['ConcessionReasonId'] = this.Ipbillform.get('ConcessionId').value.ConcessionId || 0,//this.ConcessionId;
        InsertBillUpdateBillNoObj['IsSettled'] = false;
      InsertBillUpdateBillNoObj['IsPrinted'] = true;
      InsertBillUpdateBillNoObj['IsFree'] = false;
      InsertBillUpdateBillNoObj['CompanyId'] = this.selectedAdvanceObj.CompanyId || 0,
        InsertBillUpdateBillNoObj['TariffId'] = this.selectedAdvanceObj.TariffId || 0,
        InsertBillUpdateBillNoObj['UnitId'] = this.selectedAdvanceObj.UnitId || 0;
      InsertBillUpdateBillNoObj['InterimOrFinal'] = 0;
      InsertBillUpdateBillNoObj['CompanyRefNo'] = 0;
      InsertBillUpdateBillNoObj['ConcessionAuthorizationName'] = 0;
      InsertBillUpdateBillNoObj['TaxPer'] = this.Ipbillform.get('AdminPer').value || 0;
      InsertBillUpdateBillNoObj['TaxAmount'] = this.Ipbillform.get('AdminAmt').value || 0;
      InsertBillUpdateBillNoObj['DiscComments'] = this.Ipbillform.get('Remark').value || '';
      InsertBillUpdateBillNoObj['CompDiscAmt'] = 0//this.InterimFormGroup.get('Remark').value || '';
      InsertBillUpdateBillNoObj['cashCounterId'] = this.Ipbillform.get('CashCounterID').value.CashCounterId || 0;

      //const InsertBillUpdateBillNo = new Bill(InsertBillUpdateBillNoObj);

      let billDetailscreditInsert = [];
      this.dataSource.data.forEach((element) => {
        let BillDetailsInsertObj = {};
        BillDetailsInsertObj['BillNo'] = 0;
        BillDetailsInsertObj['ChargesId'] = element.chargesId;
        billDetailscreditInsert.push(BillDetailsInsertObj);
      });

      let Cal_DiscAmount_IPBillObj = {};
      Cal_DiscAmount_IPBillObj['BillNo'] = 0;

      //const cal_DiscAmount_IPBillcredit = new Bill(Cal_DiscAmount_IPBillObj);

      let AdmissionIPBillingUpdateObj = {};
      AdmissionIPBillingUpdateObj['AdmissionID'] = this.selectedAdvanceObj.AdmissionID;

      //const admissionIPBillingcreditUpdate = new Bill(AdmissionIPBillingUpdateObj);

      let ipBillBalAmountcreditObj = {};
      // let BillBalAmt = 0;
      // BillBalAmt = this.Ipbillform.get('FinalAmount').value
      ipBillBalAmountcreditObj['BillNo'] = 0;
      ipBillBalAmountcreditObj['BillBalAmount'] = parseFloat(this.Ipbillform.get('FinalAmount').value) || 0;

      //const ipBillBalAmountcredit = new Bill(ipBillBalAmountcreditObj)

      let ipAdvanceDetailUpdatecedit = [];

      let UpdateAdvanceDetailObj = {};
      UpdateAdvanceDetailObj['AdvanceDetailID'] = 0,
        UpdateAdvanceDetailObj['UsedAmount'] = 0,
        UpdateAdvanceDetailObj['BalanceAmount'] = 0,
        ipAdvanceDetailUpdatecedit.push(UpdateAdvanceDetailObj);

      let UpdateAdvanceHeaderObj = {};
      UpdateAdvanceHeaderObj['AdvanceId'] = 0,
        UpdateAdvanceHeaderObj['AdvanceUsedAmount'] = 0,
        UpdateAdvanceHeaderObj['BalanceAmount'] = 0

      let submitData = {
        "insertBillcreditUpdateBillNo": InsertBillUpdateBillNoObj,
        "billDetailscreditInsert": billDetailscreditInsert,
        "cal_DiscAmount_IPBillcredit": Cal_DiscAmount_IPBillObj,
        "admissionIPBillingcreditUpdate": AdmissionIPBillingUpdateObj,
        "ipBillBalAmountcredit": ipBillBalAmountcreditObj,
        "ipAdvanceDetailUpdatecedit": ipAdvanceDetailUpdatecedit,
        "ipAdvanceHeaderUpdatecredit": UpdateAdvanceHeaderObj
      };
      console.log(submitData);
      this._IpSearchListService.InsertIPBillingCredit(submitData).subscribe(response => {
        if (response) {
          Swal.fire('Bill successfully !', 'IP final bill Credited successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();
              this.viewgetBillReportPdf(response);
            }
          });
        } else {
          Swal.fire('Error !', 'IP Final Billing Credited data not saved', 'error');
        }
        this.isLoading = '';
      });
    }
    else {
      Swal.fire('check is a credit bill or not ')
    }

    this.advanceDataStored.storage = [];
  }
  onSaveDraft() {
    if (this.dataSource.data.length > 0 && (this.vNetBillAmount > 0)) {
      this.chargeslist = this.dataSource;
      this.isLoading = 'submit';

      let InsertDraftBillOb = {};
      InsertDraftBillOb['drbNo'] = 0;
      InsertDraftBillOb['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID,
        InsertDraftBillOb['TotalAmt'] = this.vTotalAmount || 0;
      InsertDraftBillOb['ConcessionAmt'] = this.vDiscountAmount || this.Ipbillform.get('concessionAmt').value || 0;
      InsertDraftBillOb['NetPayableAmt'] = this.Ipbillform.get('FinalAmount').value || 0;
      InsertDraftBillOb['PaidAmt'] = 0;
      InsertDraftBillOb['BalanceAmt'] = this.Ipbillform.get('FinalAmount').value || 0;
      InsertDraftBillOb['BillDate'] = this.dateTimeObj.date;
      InsertDraftBillOb['OPD_IPD_Type'] = 1;
      InsertDraftBillOb['AddedBy'] = this.accountService.currentUserValue.userId,
        InsertDraftBillOb['TotalAdvanceAmount'] = 0;
      InsertDraftBillOb['BillTime'] = this.dateTimeObj.time;
      InsertDraftBillOb['ConcessionReasonId'] = this.Ipbillform.get('ConcessionId').value.ConcessionId || 0
      InsertDraftBillOb['IsSettled'] = 0;
      InsertDraftBillOb['IsPrinted'] = 0;
      InsertDraftBillOb['IsFree'] = 0;
      InsertDraftBillOb['CompanyId'] = this.selectedAdvanceObj.CompanyId || 0,
        InsertDraftBillOb['TariffId'] = 3,//this.selectedAdvanceObj.TariffId || 0,
        InsertDraftBillOb['UnitId'] = this.selectedAdvanceObj.UnitId || 0,
        InsertDraftBillOb['InterimOrFinal'] = 0;
      InsertDraftBillOb['CompanyRefNo'] = 0;
      InsertDraftBillOb['ConcessionAuthorizationName'] = '';
      InsertDraftBillOb['TaxPer'] = this.Ipbillform.get('AdminPer').value || 0;
      InsertDraftBillOb['TaxAmount'] = this.Ipbillform.get('AdminAmt').value || 0;

      let DraftBilldetsarr = [];
      this.dataSource.data.forEach((element) => {
        let DraftBillDetailsInsertObj = {};
        DraftBillDetailsInsertObj['DRNo'] = 0;
        DraftBillDetailsInsertObj['ChargesId'] = element.chargesId;
        DraftBilldetsarr.push(DraftBillDetailsInsertObj);
      });

      const InsertDraftBillObj = new DraftBill(InsertDraftBillOb);
      console.log('============================== Save IP Billing ===========');
      let submitData = {
        "ipIntremdraftbillInsert": InsertDraftBillObj,
        "interimBillDetailsInsert": DraftBilldetsarr
      };
      console.log(submitData)
      this._IpSearchListService.InsertIPDraftBilling(submitData).subscribe(response => {
        if (response) {
          Swal.fire('Draft Bill successfully!', 'IP Draft bill generated successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this.viewgetDraftBillReportPdf(response);
            }
          });
        } else {
          Swal.fire('Error !', 'IP Draft Billing data not saved', 'error');
        }
        this.isLoading = '';
      });

    } else {
      Swal.fire('error !', 'Please select check box ', 'error');
    }
    this._matDialog.closeAll();
  }
  public setFocus(nextElementId): void {
    document.querySelector<HTMLInputElement>(`#${nextElementId}`)?.focus();
  }

  onClose() {
    this.dialogRef.close({ result: "cancel" });
    this.advanceDataStored.storage = [];
  }


  //select cehckbox
  tableElementChecked(event, element) {
    console.log(event)
    console.log(element)
    if (event.checked) {
      this.interimArray.push(element);
      console.log(this.interimArray)
    } else if (this.interimArray.length > 0) {
      let index = this.interimArray.indexOf(element);
      if (index !== -1) {
        this.interimArray.splice(index, 1);
      }
    }
  }
  //Intrim bill popup 
  getInterimData() {
    if (this.interimArray.length > 0) {
      console.log('this.interimArray==', this.interimArray);
      this._matDialog.open(InterimBillComponent,
        {
          maxWidth: "85vw",
          width: '100%',
          height: "75%",
          data: {
            PatientHeaderObj: this.selectedAdvanceObj,
            Obj: this.interimArray
          }
        });
    } else {
      Swal.fire('Warring !', 'Please select check box ', 'warning');
    }
    this.getChargesList();
    this.interimArray = [];
  }


  chkprint: boolean = false;
  AdList: boolean = false;
  viewgetIPAdvanceReportPdf(contact) {
    this.chkprint = true;
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
      // this.SpinLoading =true;
      this.AdList = true;

      this._IpSearchListService.getViewAdvanceReceipt(
        contact.AdvanceDetailID
      ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Ip advance Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
        });
      });

    }, 100)
    this.chkprint = false;
  }
  // onwhatsappbill() {
  getWhatsappshareIPFinalBill(el, vmono) {

    if (vmono != '' && vmono != "0") {
      var m_data = {
        "insertWhatsappsmsInfo": {
          "mobileNumber": vmono || 0,
          "smsString": '',
          "isSent": 0,
          "smsType": 'IPBill',
          "smsFlag": 0,
          "smsDate": this.currentDate,
          "tranNo": el,
          "PatientType": 2,//el.PatientType,
          "templateId": 0,
          "smSurl": "info@gmail.com",
          "filePath": '',
          "smsOutGoingID": 0
        }
      }
      this._WhatsAppEmailService.InsertWhatsappSales(m_data).subscribe(response => {
        if (response) {
          this.toastr.success('IP Final Bill Sent on WhatsApp Successfully.', 'Save !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
        } else {
          this.toastr.error('API Error!', 'Error WhatsApp!', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
  }
  // exec rptIPDInterimBill 193667 9507 
  viewgetInterimBillReportPdf(contact) {
    this._IpSearchListService.getIpInterimBillReceipt(
      contact.BillNo
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Ip Interim Bill  Viewer"
          }
        });
    });
  }
  //For testing 
  viewgetDraftBillReportPdf(AdmissionID) {
    this._IpSearchListService.getIpDraftBillReceipt(
      AdmissionID
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "IP Draft Bill  Viewer"
          }
        });
    });
  }
  viewgetBillReportPdf(BillNo) {
    this._IpSearchListService.getIpFinalBillReceiptgroupwise(
      BillNo
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Ip Bill  Viewer"
          }
        });
    });
  }



  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('doctorname') doctorname: ElementRef;
  @ViewChild('disc') disc: ElementRef;
  @ViewChild('discamt') discamt: ElementRef;
  @ViewChild('qty') qty: ElementRef;
  @ViewChild('Netamt') Netamt: ElementRef;
  @ViewChild('price') price: ElementRef;
  @ViewChild('finaldisc') finaldisc: ElementRef;
  @ViewChild('addbutton') addbutton: ElementRef;

  onEnterservice(event): void {
    if (event.which === 13) {
      this.price.nativeElement.focus();
    }
  }
  public onEnterprice(event): void {
    if (event.which === 13) {
      this.qty.nativeElement.focus();
    }
  }
  public onEnterqty(event): void {
    if (event.which === 13) {
      if (this.isDoctor) {
        this.doctorname.nativeElement.focus();
      }
      else {
        this.disc.nativeElement.focus();
      }
    }
  }
  public onEnterdoctor(event): void {
    if (event.which === 13) {
      this.disc.nativeElement.focus();
    }
  }

  public onEnterdiscper(event, value): void {
    if (event.which === 13) {
      this.discamt.nativeElement.focus();

    }
  }
  public onEnterdiscamt(event): void {
    if (event.which === 13) {
      this.Netamt.nativeElement.focus();
    }
  }

  public onEnternetAmount(event): void {
    if (event.which === 13) {
      this.addbutton.nativeElement.focus();
    }
  }


  getPreBilldet(contact) {
    //console.log(contact)
    const dialogRef = this._matDialog.open(PrebillDetailsComponent,
      {
        maxWidth: "100%",
        height: '60%',
        width: '74%',
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
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
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  onScroll() {
    //Note: This is called multiple times after the scroll has reached the 80% threshold position.
    this.nextPage$.next(true);
  } 
  handleChange(key: string, callback: () => void, form: FormGroup = this.Serviceform) {
    this.subscription.push(form.get(key).valueChanges.subscribe(value => {
      callback();
    }));
  }
}

export class Bill {
  AdmissionID: any;
  BillNo: number;
  OPD_IPD_ID: number;
  TotalAmt: any;
  ConcessionAmt: any;
  NetPayableAmt: any;
  PaidAmt: any;
  BalanceAmt: any;
  BillDate: any;
  OPD_IPD_Type: any;
  AddedBy: any;
  TotalAdvanceAmount: any;
  BillTime: any;
  ConcessionReasonId: any;
  IsSettled: boolean;
  IsPrinted: boolean;
  IsFree: boolean;
  CompanyId: any;
  TariffId: any;
  UnitId: any;
  InterimOrFinal: any;
  CompanyRefNo: any;
  ConcessionAuthorizationName: any;
  TaxPer: any;
  TaxAmount: any;
  DiscComments: String;
  vCashCounterID: any;
  Bdate: any;
  PBillNo: any;
  CashPayAmount: any;
  ChequePayAmount: any;
  CardPayAmount: any;
  AdvanceUsedAmount: any;
  PatientName: any;

  constructor(InsertBillUpdateBillNoObj) {
    this.AdmissionID = InsertBillUpdateBillNoObj.AdmissionID || 0;
    this.BillNo = InsertBillUpdateBillNoObj.BillNo || 0;
    this.OPD_IPD_ID = InsertBillUpdateBillNoObj.OPD_IPD_ID || 0;
    this.TotalAmt = InsertBillUpdateBillNoObj.TotalAmt || 0;
    this.ConcessionAmt = InsertBillUpdateBillNoObj.ConcessionAmt || 0;
    this.NetPayableAmt = InsertBillUpdateBillNoObj.NetPayableAmt || 0;
    this.PaidAmt = InsertBillUpdateBillNoObj.PaidAmt || '0';
    this.BalanceAmt = InsertBillUpdateBillNoObj.BalanceAmt || '0';
    this.BillDate = InsertBillUpdateBillNoObj.BillDate || '';
    this.OPD_IPD_Type = InsertBillUpdateBillNoObj.OPD_IPD_Type || '0';
    this.AddedBy = InsertBillUpdateBillNoObj.AddedBy || '0';
    this.TotalAdvanceAmount = InsertBillUpdateBillNoObj.TotalAdvanceAmount || '0';
    this.BillTime = InsertBillUpdateBillNoObj.BillTime || '';
    this.ConcessionReasonId = InsertBillUpdateBillNoObj.ConcessionReasonId || '0';
    this.IsSettled = InsertBillUpdateBillNoObj.IsSettled || 0;
    this.IsPrinted = InsertBillUpdateBillNoObj.IsPrinted || 0;
    this.IsFree = InsertBillUpdateBillNoObj.IsFree || 0;
    this.CompanyId = InsertBillUpdateBillNoObj.CompanyId || '0';
    this.TariffId = InsertBillUpdateBillNoObj.TariffId || '0';
    this.UnitId = InsertBillUpdateBillNoObj.UnitId || '0';
    this.InterimOrFinal = InsertBillUpdateBillNoObj.InterimOrFinal || '0';
    this.CompanyRefNo = InsertBillUpdateBillNoObj.CompanyRefNo || '0';
    this.ConcessionAuthorizationName = InsertBillUpdateBillNoObj.ConcessionAuthorizationName || '0';
    this.TaxPer = InsertBillUpdateBillNoObj.TaxPer || '0';
    this.TaxAmount = InsertBillUpdateBillNoObj.TaxAmount || '0';
    this.DiscComments = InsertBillUpdateBillNoObj.DiscComments || '';
    this.vCashCounterID = InsertBillUpdateBillNoObj.CashCounterID || '';
    this.Bdate = InsertBillUpdateBillNoObj.Bdate || '';

    this.PBillNo = InsertBillUpdateBillNoObj.PBillNo || '0';
    this.CashPayAmount = InsertBillUpdateBillNoObj.CashPayAmount || '0';
    this.ChequePayAmount = InsertBillUpdateBillNoObj.ChequePayAmount || '';
    this.CardPayAmount = InsertBillUpdateBillNoObj.CardPayAmount || '';
    this.AdvanceUsedAmount = InsertBillUpdateBillNoObj.AdvanceUsedAmount || '';
    this.PatientName = InsertBillUpdateBillNoObj.PatientName || ''
  }

}

export class BillDetails {
  BillNo: number;
  ChargesID: number;

  constructor(BillDetailsInsertObj) {
    this.BillNo = BillDetailsInsertObj.BillNo || 0;
    this.ChargesID = BillDetailsInsertObj.ChargesID || 0;
  }

}
export class Cal_DiscAmount {
  BillNo: number;

  constructor(Cal_DiscAmount_IPBillObj) {
    this.BillNo = Cal_DiscAmount_IPBillObj.BillNo || 0;
  }

}

export class AdmissionIPBilling {
  AdmissionID: number;

  constructor(Cal_DiscAmount_IPBillObj) {
    this.AdmissionID = Cal_DiscAmount_IPBillObj.AdmissionID || 0;
  }

}


export class PatientBilldetail {
  AdmissionID: Number;
  BillNo: any;
  BillDate: Date;
  concessionReasonId: number;
  tariffId: number;
  RemarkofBill: string
  /**
 * Constructor
 *
 * @param PatientBilldetail
 */
  constructor(PatientBilldetail) {
    {
      this.AdmissionID = PatientBilldetail.AdmissionID || '';
      this.BillNo = PatientBilldetail.BillNo || '';
      this.BillDate = PatientBilldetail.BillDate || '';
      this.concessionReasonId = PatientBilldetail.concessionReasonId || '';
      this.tariffId = PatientBilldetail.tariffId || '';
      this.RemarkofBill = PatientBilldetail.RemarkofBill;
    }
  }
}


export class DraftBill {

  OPD_IPD_ID: number;
  TotalAmt: any;
  ConcessionAmt: any;
  NetPayableAmt: any;
  PaidAmt: any;
  BalanceAmt: any;
  BillDate: any;
  OPD_IPD_Type: any;
  AddedBy: any;
  TotalAdvanceAmount: any;
  BillTime: any;
  ConcessionReasonId: any;
  IsSettled: boolean;
  IsPrinted: boolean;
  IsFree: boolean;
  CompanyId: any;
  TariffId: any;
  UnitId: any;
  InterimOrFinal: any;
  CompanyRefNo: any;
  ConcessionAuthorizationName: any;
  TaxPer: any;
  TaxAmount: any;
  drbNo: any;

  constructor(DraftBill) {

    this.OPD_IPD_ID = DraftBill.OPD_IPD_ID || 0;
    this.TotalAmt = DraftBill.TotalAmt || 0;
    this.ConcessionAmt = DraftBill.ConcessionAmt || 0;
    this.NetPayableAmt = DraftBill.NetPayableAmt || 0;
    this.PaidAmt = DraftBill.PaidAmt || '0';
    this.BalanceAmt = DraftBill.BalanceAmt || '0';
    this.BillDate = DraftBill.BillDate || '';
    this.OPD_IPD_Type = DraftBill.OPD_IPD_Type || '0';
    this.AddedBy = DraftBill.AddedBy || '0';
    this.TotalAdvanceAmount = DraftBill.TotalAdvanceAmount || '0';
    this.BillTime = DraftBill.BillTime || '';
    this.ConcessionReasonId = DraftBill.ConcessionReasonId || '0';
    this.IsSettled = DraftBill.IsSettled || 0;
    this.IsPrinted = DraftBill.IsPrinted || 0;
    this.IsFree = DraftBill.IsFree || 0;
    this.CompanyId = DraftBill.CompanyId || '0';
    this.TariffId = DraftBill.TariffId || '0';
    this.UnitId = DraftBill.UnitId || '0';
    this.InterimOrFinal = DraftBill.InterimOrFinal || '0';
    this.CompanyRefNo = DraftBill.CompanyRefNo || '0';
    this.ConcessionAuthorizationName = DraftBill.ConcessionAuthorizationName || '0';
    this.TaxPer = DraftBill.TaxPer || '0';
    this.TaxAmount = DraftBill.TaxAmount || '0';
    this.drbNo = DraftBill.drbNo || 0;

  }

}