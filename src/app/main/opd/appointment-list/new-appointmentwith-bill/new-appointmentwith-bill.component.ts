import { DatePipe, Location } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, Optional, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { ConfigService } from 'app/core/services/config.service';
import { HospitalConfigService } from 'app/core/services/hospital-config.service';
import { AppointmentlistService } from '../appointmentlist.service';
import { ChargesList } from '../appointment-billing/appointment-billing.component';
import { RegInsert } from '../../registration/registration.component';
import { PreviousDeptListComponent } from '../update-reg-patient-info/previous-dept-list/previous-dept-list.component';
import { PackageDetailsComponent } from '../appointment-billing/package-details/package-details.component';
import { LabRequest } from 'app/main/Lab Management/lab-patient-reg/lab-patient-reg.component';

@Component({
  selector: 'app-new-appointmentwith-bill',
  templateUrl: './new-appointmentwith-bill.component.html',
  styleUrls: ['./new-appointmentwith-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewAppointmentwithBillComponent {
  // 'ServiceCode', 'DiscountPer', 'DiscountAmount', , 'DoctorName', 'Qty','ClassName', 'ChargesAddedName', 'Exclucion', 
  public displayedChargeColumns: string[] =
    ['Status', 'ServiceName', 'Price', 'TotalAmount', 'NetAmount', 'Action'];
  public displayedColumnspackage: string[] =
    ['IsCheck', 'ServiceNamePackage', 'ServiceName', 'Price', 'Qty', 'TotalAmt', 'DoctorName', 'DiscAmt', 'NetAmount'];
  public displayedPrescriptionColumns =
    ['groupName', 'serviceName', 'classRate', 'userName'];


  myForm: FormGroup
  searchFormGroup: FormGroup
  AppointmentBillfinalform: FormGroup
  RegiAppointmentBillfinalform: FormGroup
  chargeForm: FormGroup
  OpBillForm: FormGroup
  OPFooterForm: FormGroup
  searchForm: FormGroup
  VisitFormGroup: FormGroup
  screenFromString = 'Common-Form';
  registerObj = new RegInsert({});
  companyDet = new RegInsert({});

  autocompleteModepatienttype: string = "PatientType";
  autocompleteModegender: string = "Gender";
  autocompleteModecountry: string = "Country";
  autocompleteModeDepartment: string = "Department";
  autocompleteModerefdoc: string = "RefDoctor";

  autocompleteModeCashcounter: string = "CashCounter";
  autocompleteModetariff: string = "Tariff";
  autocompleteModedeptdoc: string = "ConDoctor";
  autocompleteModeService: string = "Service";
  autocompleteModeConcession: string = "Concession";
  autocompleteModeGroup: string = "GroupName";

  autocompleteModearea: string = "Area";
  autocompleteModecity: string = "City";
  autocompleteModestate: string = "State";
  autocompleteModemstatus: string = "MaritalStatus";
  autocompleteModereligion: string = "Religion";
  autocompleteModerelationship: string = "Relationship";

  autocompleteModeunit: string = "Hospital";
  autocompleteModecompany: string = "Company";
  autocompleteModesubcompany: string = "SubCompany";
  autocompletedepartment: string = "Department";
  autocompleteModepurpose: string = "Purpose";
  autocompleteModeClass: string = "Class";
  autocompleteModecamp: string = "CampMaster";

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  isServiceIdSelected: boolean = false;
  isDoctor: boolean = false;
  isWaiting = false;
  public isModal = false;
  chkIsEditable: boolean = true;
  Consessionres: boolean = false;
  public isServiceSelected = false;
  public isDiscountApplied = false;
  serviceSelct = false
  savebtn: boolean = true;
  Regflag: boolean = false;
  IsPhoneAppflag: boolean = true;
  isRegSearchDisabled: boolean = false;
  showEmergencyFlag: boolean = false;
  chkregisterd: boolean = false;
  public isUpdating = false;
  isCompanySelected: boolean = false;

  @ViewChild('serviceTable') serviceTable!: TemplateRef<any>;

  dsLabRequest2 = new MatTableDataSource<LabRequest>();
  public dstable1 = new MatTableDataSource<ChargesList>();
  public dsChargeList = new MatTableDataSource<ChargesList>();
  public dsPackageList = new MatTableDataSource<ChargesList>();
  public dsServiceList = new MatTableDataSource<ChargesList>();
  public chargeList: ChargesList[] = [];
  public packageList: ChargesList[] = [];
  public serviceList: ChargesList[] = [];
  EditedPackageService: any = [];
  OriginalPackageService: any = [];
  prevResults: any[] = [];
  filteredOptions: any[] = [];
  doctorName: any
  chargeslist: any = [];
  public subscription: Array<Subscription> = [];
  dateTimeObj: any;
  minDate = new Date();
  selectedPatient: any;
  selectedMobile: any;
  statusMessage: string = 'Processing...';

  vOPIPId = 0
  regNo = 0;
  PatientName: any;
  opdNo = "0";
  ageYear: any = 0;
  ageMonth: any = 0;
  ageDays: any = 0;
  ageDay = 0;
  doctorId = 0;
  doctorname = '';
  companyId = 0;
  companyName = '';
  patienttype = 0
  ConcessionId = 0;
  ConcessionReason = '';
  departmentname = '';
  IsPathology: any;
  IsRadiology: any;
  vIsPackage: any;
  RegId = 0;
  CityName = ""
  vRegNo: any;
  vTariffId: any = 1;
  vClassId: any = 1;
  vRegId: any;

  // Bill
  value = new Date()
  ApiURL: any = '';
  tariffId = 1
  classId = 1
  ExclusionAmt: any = 0;
  InclusionAmt: any = 0;
  serviceId: any;
  SrvcName1: any = ""
  vQty: any;
  vPrice = '0';
  TotalPrice: any = 0;
  className = "OPD";
  PacakgeList: any = [];


  displayedServiceColumns: string[] = [
    'ServiceName',
    'price',
    'Action'
  ]

  displayedServiceselected: string[] = [
    'ServiceName',
    'Price',
    'buttons'
  ]

  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
  @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
  @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
  toastrService: any;

  constructor(public _AppointmentlistService: AppointmentlistService,
    public _matDialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<NewAppointmentwithBillComponent>,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public _formbuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private accountService: AuthenticationService,
    private hospitalconfigservice: HospitalConfigService,
    public toastr: ToastrService, public _ConfigService: ConfigService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + this.tariffId + "&ClassId=" + this.classId + "&ServiceName="
    // Check if opened as modal or as standalone page
    this.isModal = !!this.dialogRef;
  }

  ngOnInit(): void {
    this.AppointmentBillfinalform = this.createFinalFormView()
    this.RegiAppointmentBillfinalform = this.createRegistredFinalFormView()

    this.myForm = this.CreateAppointmentForm();
    this.myForm.markAllAsTouched();
    this.searchFormGroup = this.createSearchForm();
    this.chargeForm = this.createChargeForm();
    this.OpBillForm = this.createTotalChargeForm();

    this.OPFooterForm = this.CreateOPFooter();
    this.OPFooterForm.markAllAsTouched();
    this.searchForm = this.createbillSearchForm();
    this.VisitFormGroup = this._AppointmentlistService.createVisitdetailForm();
    this.VisitFormGroup.markAllAsTouched();

    this.OPFooterForm = this.CreateOPFooter();
    // this.getServiceList();

    console.log(this.hospitalconfigservice.HospitalconfigParams)
    console.log(this._ConfigService.configParams)

    this.setupFormListener();
    this.startCountdown();

    // Handle route params when opened as standalone page (not modal)
    if (!this.isModal) {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          // Load data based on route param if needed
          this.loadDataById(id);
        }
      });

      // Also check query params for additional data
      this.route.queryParams.subscribe(queryParams => {
        if (queryParams) {
          this.data = queryParams;
        }
      });
    }
  }

  // Load data by ID when opened as standalone page
  private loadDataById(id: string): void {
    // You can add logic here to load data based on the ID
    // For now, we'll just set the data object with the ID
    if (!this.data) {
      this.data = {};
    }
    this.data.id = id;
  }

  // Method to close modal or navigate back
  closeOrNavigateBack(): void {
    if (this.isModal && this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['/opd/appointment']);
    }
  }

  // Method to close all modals or navigate back
  closeAllOrNavigateBack(): void {
    if (this.isModal) {
      this._matDialog.closeAll();
    } else {
      this.router.navigate(['/opd/appointment']);
    }
  }

  createFinalFormView() {
    {
      return this._formbuilder.group({
        appRegistrationBills: '',
        visit: '',
        appOPBillIngModels: ''
      })
    }
  }

  createRegistredFinalFormView() {
    {
      return this._formbuilder.group({
        // appRegistrationBills: '',
        visit: '',
        appOPBillIngModels: ''
      })
    }
  }

  private setupFormListener(): void {

    this.handleChange('price', () => this.calculateTotalCharge());
    this.handleChange('qty', () => this.calculateTotalCharge());
    this.handleChange('discountPer', () => this.updateDiscountAmount());
    this.handleChange('discountAmount', () => this.updateDiscountPercentage());
    this.handleChange('totalDiscountPer', () => this.updateTotalDiscountAmt(), this.OPFooterForm);
    this.handleChange('concessionAmt', () => this.updateTotalDiscountPer(), this.OPFooterForm);
  }
  createSearchForm() {
    return this._formbuilder.group({
      regRadio: ['registration'],
      regRadio1: ['registration1'],
      RegId: [''],
      PhoneRegId: [''],
      UnitId: [this.accountService.currentUserValue.user.unitId]
    });
  }
  createbillSearchForm() {
    return this._formbuilder.group({
      regId: [''],
      CashCounterID: [this.hospitalconfigservice.HospitalconfigParams?.OPD_Billing_CounterId],
      TariffId: [this.tariffId],

    });
  }

  createChargeForm() {
    return this._formbuilder.group({
      serviceName: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      qty: [1, [Validators.required, Validators.min(1)]],
      totalAmount: [0,],
      discountPer: [0, [Validators.min(0), Validators.max(100)]],
      discountAmount: [0, [Validators.required, Validators.min(0)]],
      netAmount: [0, [Validators.min(0)]],
      DoctorID: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      GroupId: [0]
    });
  }
  CreateAppointmentForm() {
    return this._formbuilder.group({
      RegId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      // RegNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      PrefixId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      FirstName: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z/() ]*$"),
        this._FormvalidationserviceService.noWhitespaceValidator()
      ]],
      MiddleName: ['', [
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z/() ]*$"),
        this._FormvalidationserviceService.allowEmptyStringValidator()
      ]],
      LastName: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z/() ]*$"),
        this._FormvalidationserviceService.noWhitespaceValidator()
      ]],

      Address: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(200)]],
      aadharCardNo: ['', [
        Validators.minLength(12),
        Validators.maxLength(12),
        // this._FormvalidationserviceService.onlyNumberValidator()
      ]], // Validators.pattern("^[0-9]*$"),Validators.pattern(/^[xX]{8}\d{4}$/),
      GenderId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

      DateOfBirth: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      Age: ['0'],
      AgeYear: ['0', [
        Validators.maxLength(3),
        Validators.pattern("^[0-9]*$")]],
      AgeMonth: ['0', [Validators.pattern("^[0-9]*$")]],
      AgeDay: ['0', [Validators.pattern("^[0-9]*$")]],
      PhoneNo: ['', [Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
      this._FormvalidationserviceService.onlyNumberValidator()
      ]],
      MobileNo: ['', [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
      this._FormvalidationserviceService.onlyNumberValidator()
      ]],
      panCardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      MaritalStatusId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]], //changed by raksha
      ReligionId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      AreaId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      CityId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      City: [''],
      StateId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      CountryId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      IsCharity: false,
      IsSeniorCitizen: false,
      AddedBy: [this.accountService.currentUserValue.userId, this._FormvalidationserviceService.onlyNumberValidator()],
      // updatedBy: [this.accountService.currentUserValue.userId, this._FormvalidationserviceService.onlyNumberValidator()],
      RegDate: ['', Validators.required],
      RegTime: ['', Validators.required],
      Photo: [''],
      PinNo: [''],

      //emergency form
      emgContactPersonName: ['', [
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      emgRelationshipId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      emgMobileNo: ['', [Validators.minLength(10), Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"), this._FormvalidationserviceService.onlyNumberValidator()]],
      emgLandlineNo: ['', [Validators.minLength(10), Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"), this._FormvalidationserviceService.onlyNumberValidator()]],
      engAddress: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(100)]],
      emgAadharCardNo: ['', [Validators.minLength(12), Validators.maxLength(12),
        // this._FormvalidationserviceService.onlyNumberValidator(),Validators.pattern("^[0-9]*$")
      ]],
      emgDrivingLicenceNo: ['', [Validators.minLength(16), Validators.maxLength(16),
      Validators.pattern(/^[A-Za-z0-9\- ]{5,16}$/)]],
      //Validators.pattern(/^[A-Z]{2}-\d{2}-\d{7,11}$/) eg:MH14-20210001234

      // medical tourisum
      medTourismPassportNo: ['', [Validators.minLength(8), Validators.maxLength(8), Validators.pattern(/^[A-Z][0-9]{7}$/)]], //Validators.pattern(/^[A-Z][0-9]{7}$/) eg:A1234567
      medTourismVisaIssueDate: [new Date().toISOString()], //"2025-10-25",
      medTourismVisaValidityDate: [new Date().toISOString()], //"2025-10-25",
      medTourismNationalityId: ['', [Validators.minLength(10), Validators.maxLength(20)]],
      medTourismCitizenship: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      medTourismPortOfEntry: ['', [Validators.maxLength(20)]],
      medTourismDateOfEntry: [new Date().toISOString()], //"2025-10-25",
      medTourismResidentialAddress: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(100)]],
      medTourismOfficeWorkAddress: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(100)]],

      // extra field
      IsNRI: [false],

      // departmentId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      // doctorId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      // refDocId: [0],
      photo: ""
    })
  }



  //Footer Form
  CreateOPFooter() {
    return this._formbuilder.group({
      totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      totalDiscountPer: [0, [Validators.min(0), Validators.max(100), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionAmt: [0, [Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionReasonId: [0, this._FormvalidationserviceService.onlyNumberValidator()],
      netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      paymentType: ['CashPay'],
    })
  }
  createTotalChargeForm(): FormGroup {
    return this._formbuilder.group({
      //bill header  
      billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdIpdId: [this.vOPIPId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      regNo: ["0", [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      patientName: [this.PatientName, [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      ipdno: ["", [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      ageYear: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      ageMonth: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      ageDays: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      wardId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      bedId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      patientType: [false],
      companyName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      companyAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      patientAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      paidAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      balanceAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      billDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
      opdipdType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      addedBy: [this.accountService.currentUserValue.userId],
      totalAdvanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      billTime: [this.datePipe.transform(new Date(), 'shortTime'), [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      concessionReasonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isSettled: true,
      isPrinted: true,
      isFree: true,
      companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      tariffId: [this.vTariffId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      interimOrFinal: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      companyRefNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      concessionAuthorizationName: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      speTaxPer: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      speTaxAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      compDiscAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      discComments: [0, [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],//need to set concession reason
      cashCounterId: ["1", [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],//need to set cashCounterId
      createdBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      govtApprovedAmt: 0,
      addCharges: this._formbuilder.array([]),

      // ✅ Fixed: should be FormArray
      billDetails: this._formbuilder.array([]),

      // ✅ Fixed: should be FormArray
      packcagecharges: this._formbuilder.array([]),

      //Payment form
      payments: this._formbuilder.group({
        paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        receiptNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        paymentDate: [''],
        paymentTime: [''],
        cashPayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        chequePayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        chequeNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        bankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        chequeDate: ['1999-01-01'],
        cardPayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        cardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        cardBankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        cardDate: ['1999-01-01'],
        advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        transactionType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        addBy: [this.accountService.currentUserValue.userId],
        isCancelled: [false],
        isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelledDate: ['1999-01-01'],
        neftpayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        neftbankMaster: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        neftdate: ['1999-01-01'],
        payTmamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        payTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        payTmdate: ['1999-01-01'],
        tdsamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        unitId: [this.accountService.currentUserValue.user.unitId],
        wfamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        companyId: [0]
        // salesId: [0],
      })
    });
  }
  CreateAddchargeform(item: any): FormGroup {

    return this._formbuilder.group({
      chargesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      opdIpdType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdIpdId: [this.vOPIPId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceId: [item?.ServiceId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      price: [item?.Price, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      qty: [1, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      totalAmt: [item?.TotalAmt, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionPercentage: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionAmount: [item?.DiscAmt ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      netAmount: [item?.NetAmount, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      doctorId: [item?.DoctorId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorName: [item?.DoctorName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      docPercentage: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      docAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      hospitalAmt: [item?.NetAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
      refundAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      isComServ: [false],
      isPrintCompSer: [false],
      isGenerated: [true],
      addedBy: [this.accountService.currentUserValue.userId],
      isCancelled: [false],
      isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isCancelledDate: ['1999-01-01'],
      isPathology: [item?.IsPathology ? true : false],
      isRadiology: [item?.IsRadiology ? true : false],
      isPackage: [Number(item?.IsPackage ?? 0) === 1],
      wardId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      bedId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceCode: [String(item?.ServiceId) || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      serviceName: [item?.ServiceName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      companyServiceName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      isInclusionExclusion: [item?.isInclusionExclusion || false,],
      isHospMrk: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      packageMainChargeID: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isSelfOrCompanyService: [false],
      packageId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesTime: this.datePipe.transform(new Date(), 'shortTime'),
      classId: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
      tariffId: [this.vTariffId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      createdBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }
  createBillDetails(item: any): FormGroup {
    return this._formbuilder.group({
      billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesId: [parseInt(item?.ServiceId), [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }
  get ChargeddetailsArray(): FormArray {
    return this.OpBillForm.get('addCharges') as FormArray;
  }
  get BillDetailsArray(): FormArray {
    return this.OpBillForm.get('billDetails') as FormArray;
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }


  onChangeDateofBirth(DateOfBirth: Date) {

    if (DateOfBirth > this.minDate) {
      this.toastr.warning('Enter Proper Birth Date..', 'warning !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
      return;
    }
    if (DateOfBirth) {
      const todayDate = new Date();
      const dob = new Date(DateOfBirth);
      const timeDiff = Math.abs(Date.now() - dob.getTime());

      this.ageYear = todayDate.getFullYear() - dob.getFullYear();
      this.ageMonth = (todayDate.getMonth() - dob.getMonth());
      this.ageDay = (todayDate.getDate() - dob.getDate());

      if (this.ageDay < 0) {
        this.ageMonth--;
        const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
        this.ageDay += previousMonth.getDate(); // Days in previous month
        // this.ageDay =this.ageDay +1;
      }

      if (this.ageMonth < 0) {
        this.ageYear--;
        this.ageMonth += 12;
      }

      this.value = DateOfBirth;
      this.myForm.get('DateOfBirth').setValue(DateOfBirth);
      if (this.ageYear > 110)
        this.toastr.warning('Please Enter Valid BirthDate..', 'warning !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
    }
  }
  getServiceList() {
    let ServiceName = this.myForm.get("ServiceId").value + "%" || "%";
    let IsPathRad = this.myForm.get("IsPathRad").value || "1"
    var param = {
      "first": 0,
      "rows": 10,
      "sortField": "ServiceId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "ServiceName",
          "fieldValue": ServiceName,
          "opType": "Equals"
        },
        {
          "fieldName": "TariffId",
          "fieldValue": String(this.vTariffId),
          "opType": "Equals"
        },
        {
          "fieldName": "IsPathRad",
          "fieldValue": String(IsPathRad),
          "opType": "Equals"
        },
        {
          "fieldName": "ClassId",
          "fieldValue": String(this.vClassId),
          "opType": "Equals"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }


  }

  getSelectedserviceObj(obj) {

    console.log(obj)
    this.SrvcName1 = obj.serviceName;
    this.serviceId = obj.serviceId;
    this.vQty = 1;
    this.IsPathology = obj.isPathology;
    this.IsRadiology = obj.isRadiology;
    this.vIsPackage = obj.isPackage;
    this.chargeForm.patchValue({
      price: obj.classRate
    })
    if (obj?.creditedtoDoctor == true) {
      this.isDoctor = true;
      this.chargeForm.get('DoctorID').reset();
      this.chargeForm.get('DoctorID').setValidators([Validators.required]);
      this.chargeForm.get('DoctorID').enable();
    } else {
      this.isDoctor = false;
      this.chargeForm.get('DoctorID').reset();
      this.chargeForm.get('DoctorID').clearValidators();
      this.chargeForm.get('DoctorID').updateValueAndValidity();
      this.chargeForm.get('DoctorID').disable();
    }
    if (obj?.isEditable == true) {
      this.chkIsEditable = false;
    } else {
      this.chkIsEditable = true;
    }
    this.serviceSelct = true
    // }
    this.getRtevPackageDetList(obj)
    this.calculateTotalAmount();
  }
  getRtevPackageDetList(obj) {
    var vdata =
    {
      "first": 0,
      "rows": 10,
      "sortField": "ServiceId",
      "sortOrder": 0,
      "filters": [{ "fieldName": "ServiceId", "fieldValue": String(obj.serviceId), "opType": "Equals" }],
      "exportType": "JSON",
      "columns": [{ "data": "string", "name": "string" }]
    }
    //console.log(vdata)
    this._AppointmentlistService.getRtevPackageDetList(vdata).subscribe(data => {
      this.dsPackageList.data = data.data as ChargesList[];
      this.dsPackageList.data.forEach(element => {
        this.PacakgeList.push(
          {
            serviceId: element.packageServiceId,
            serviceName: element.serviceName,
            price: element.price || 0,
            Qty: 1,
            TotalAmt: (element.price * 1) || 0,
            ConcessionPercentage: 0,
            DiscAmt: 0,
            NetAmount: (element.price * 1) || 0,
            isPathology: element.isPathology,
            isRadiology: element.isRadiology,
            packageId: element.packageId,
            PackageServiceId: element.serviceId,
            pacakgeServiceName: element.pacakgeServiceName,
            doctorName: element.doctorName,
            doctorId: element.doctorId
          })
      })
      this.dsPackageList.data = this.PacakgeList
    });
  }
  updateCalculation() {

    const total = this.chargeList.reduce((sum, item) => sum + (parseFloat(item.Price.toString()) || 0), 0);
    const discPer = Number(this.myForm.get('totalDiscountPer')?.value) || 0;
    // this.myForm.get('discountAmt').value
    const discountAmt = (total * discPer) / 100;
    const netAmt = Math.round(total - discountAmt);

    this.myForm.patchValue({
      totalAmt: total,
      discountAmt: discountAmt,
      netPayableAmt: netAmt
    });
  }
  total = 0
  // getCellCalculation(element) {

  //   const total = this.dstable1.data.reduce((sum, item) => sum + (parseFloat(item.Price.toString()) || 0), 0);
  //   const discPer = Number(this.myForm.get('totalDiscountPer')?.value) || 0;
  //   // this.myForm.get('discountAmt').value
  //   const discountAmt = (total * discPer) / 100;
  //   const netAmt = total - discountAmt;
  //   element.TotalAmt = total
  //   element.DiscPer = 0,
  //     element.DiscAmt = discountAmt | 0,
  //     element.NetAmount = netAmt,

  //     this.myForm.patchValue({
  //       totalAmt: total,
  //       discountAmt: discountAmt,
  //       netPayableAmt: netAmt
  //     });
  // }

  onPriceOrQtyChange(row: ChargesList = null): void {
    if (!row) return;

    row.Price = Math.abs(row.Price);
    row.Qty = Math.abs(row.Qty);

    const totalAmount = row.Price * row.Qty;

    // If discount percentage exists, recalculate discount amount
    if (row.DiscPer) {
      row.DiscAmt = parseFloat(((totalAmount * row.DiscPer) / 100).toFixed(2));
    }
    row.TotalAmt = totalAmount;
    row.NetAmount = totalAmount - row.DiscAmt;

    this.calculateTotalAmount();
  }
  onDiscountPerChange(row: ChargesList): void {
    if (!row) return;
    let discountPer = +row.DiscPer || 0;
    const totalAmount = (+row.Price || 0) * (+row.Qty || 0);

    if (discountPer < 0 || discountPer > 100) {
      discountPer = 0; // Reset if out of range
      row.DiscPer = 0;
      this.toastrService.error("Enter discount % between 0-100");
    }

    this.Consessionres = true
    if (discountPer == 0) {
      this.Consessionres = false
      this.OPFooterForm.get("concessionReasonId").setValue(0)
    }

    row.DiscAmt = parseFloat(((totalAmount * discountPer) / 100).toFixed(2));
    row.TotalAmt = totalAmount;
    row.NetAmount = totalAmount - row.DiscAmt;

    this.calculateTotalAmount();
  }
  onDiscountAmtChange(row: ChargesList): void {
    if (!row) return;
    let discountAmt = +row.DiscAmt || 0;
    const totalAmount = (+row.Price || 0) * (+row.Qty || 0);

    if (discountAmt < 0 || discountAmt > totalAmount) {
      row.DiscAmt = 0;
      discountAmt = 0;
      this.toastrService.error("Discount must be between 0 and the total amount.");
    }

    this.Consessionres = true
    if (discountAmt == 0) {
      this.Consessionres = false
      this.OPFooterForm.get("concessionReasonId").setValue(0)
    }
    row.DiscPer = totalAmount ? parseFloat(((discountAmt / totalAmount) * 100).toFixed(2)) : 0;
    row.TotalAmt = totalAmount;
    row.NetAmount = totalAmount - discountAmt;

    this.calculateTotalAmount();
  }
  updateTotalDiscountAmt(): void {
    if (this.isUpdating) return; // Stop recursion
    this.isUpdating = true;
    const totalDiscountPer = +this.OPFooterForm.get("totalDiscountPer").value;
    if (totalDiscountPer == 0)
      this.OPFooterForm.get("concessionReasonId").setValue(0)
    if (totalDiscountPer < 0 || totalDiscountPer > 100) {
      this.OPFooterForm.get("totalDiscountPer").setValue(0);
      this.OPFooterForm.get("concessionAmt").setValue(0);

      this.isUpdating = false;
      this.Consessionres = false;

      this.toastrService.error("Discount must be between 0 to 100.");
      return;
    }
    this.Consessionres = totalDiscountPer !== 0;
    if (!this.isDiscountApplied) {
      const totalAmount = +this.OPFooterForm.get("totalAmt").value;
      const discountAmount = (totalAmount * totalDiscountPer) / 100;
      const netAmount = totalAmount - discountAmount;
      this.OPFooterForm.patchValue({
        concessionAmt: Math.round(discountAmount),
        netPayableAmt: Math.round(netAmount)
      }, { emitEvent: false });
    }
    this.isUpdating = false;
  }
  updateTotalDiscountPer(): void {
    if (this.isUpdating) return; // Stop recursion
    this.isUpdating = true;

    const totalDiscountAmount = +this.OPFooterForm.get("concessionAmt").value;
    const totalChargeAmount = +(this.OPFooterForm.get("totalAmt").value);

    if (totalDiscountAmount == 0)
      this.OPFooterForm.get("concessionReasonId").setValue(0)

    if (totalDiscountAmount < 0 || totalDiscountAmount > totalChargeAmount) {
      this.OPFooterForm.get("totalDiscountPer").setValue(0);
      this.OPFooterForm.get("concessionAmt").setValue(0);
      this.isUpdating = false;
      this.Consessionres = false;
      this.toastrService.error("Discount must be between 0 and the total amount.");
      return;
    }
    this.Consessionres = totalDiscountAmount !== 0;
    if (!this.isDiscountApplied) {
      // const disountPer = Number(totalChargeAmount ? ((totalDiscountAmount / totalChargeAmount) * 100).toFixed(2) : "0.00");

      const disountPer = Math.ceil(Number(totalChargeAmount ? ((totalDiscountAmount / totalChargeAmount) * 100).toFixed(2) : "0.00"));
      const netAmount = totalChargeAmount - totalDiscountAmount;
      this.OPFooterForm.patchValue({
        totalDiscountPer: disountPer,
        netPayableAmt: netAmount.toFixed(2)
      }, { emitEvent: false });
    }
    this.isUpdating = false;
  }

  onAddCharges(): void {
    const serviceNameValue = this.chargeForm.get('serviceName')?.value;
    if (!serviceNameValue || serviceNameValue === '%' || this.serviceSelct == false) {
      this.toastrService.warning('Please select a valid service name.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.chargeForm.get('DoctorID').value == "0") {
      this.toastrService.warning('Please select a valid doctor name.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.chargeForm.valid) {
      const formValue = this.chargeForm.value;
      if (this.chargeForm.value.discountPer > 0)
        this.Consessionres = true
      // Calculate total amount, discount amount, and net amount
      const totalAmount = formValue.price * formValue.qty;
      const discountAmount = (totalAmount * formValue.discountPer) / 100;
      const netAmount = totalAmount - discountAmount;
      if (totalAmount > 0) {
        const newRow = {
          ServiceId: formValue.serviceName.serviceId,
          ServiceName: formValue.serviceName.serviceName,
          Price: formValue.price,
          Qty: formValue.qty,
          TotalAmt: totalAmount,
          DiscPer: formValue.discountPer || 0,
          DiscAmt: discountAmount || 0,
          NetAmount: netAmount,
          DoctorName: this.doctorName || '-',
          ClassName: this.className || '-',
          DoctorId: formValue.DoctorID,
          ChargesAddedName: this.accountService.currentUserValue.userName,
          IsPathology: this.IsPathology,
          IsRadiology: this.IsRadiology,
          IsPackage: this.vIsPackage,
          serviceCode: formValue.serviceName.companyCode,
          isInclusionExclusion: formValue.serviceName.isInclusionOrExclusion
        };
        if (!this.isDiscountApplied && discountAmount > 0) {
          this.isDiscountApplied = true;
          this.Consessionres = true
        }
        const newCharge = new ChargesList(newRow);
        newCharge.DiscAmt = newCharge.DiscAmt || 0;
        newCharge.DiscPer = newCharge.DiscPer || 0;
        this.chargeList.push(newCharge);
        this.dsChargeList.data = this.chargeList;
        this.calculateTotalAmount();
        this.serviceSelct = false
        this.resetform();
        this.chargeForm.get("qty").setValue(1);
        const serviceNameElement = document.querySelector(`[name='serviceName']`) as HTMLElement;
        if (serviceNameElement) {
          serviceNameElement.focus();
        }
      } else {
        Swal.fire({
          title: 'Message',
          text: "Please Enter Service Detail.. !",
          icon: "warning"
        });
      }
    }
  }

  // Calculation of total amount.
  calculateTotalAmount(): void {

    let totalSum = this.chargeList.reduce((sum, charge) => sum + (+charge.TotalAmt), 0);
    let totalDiscount = this.chargeList.reduce((sum, charge) => sum + (+charge.DiscAmt), 0);
    let totalNet = totalSum - totalDiscount;

    this.OPFooterForm.patchValue({
      totalAmt: totalSum,
      concessionAmt: Math.round(totalDiscount),
      netPayableAmt: Math.round(totalNet)
    }, { emitEvent: false });

    const Exclusionlist = this.chargeList.filter(i => i.isInclusionExclusion === true)
    const Inclusionlist = this.chargeList.filter(i => i.isInclusionExclusion !== true)
    this.ExclusionAmt = Exclusionlist.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    this.InclusionAmt = Inclusionlist.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);

  }

  // deleteTableRow(element) {
  //   this.chargeslist = this.dstable1.data;
  //   let index = this.chargeslist.indexOf(element);
  //   if (index >= 0) {
  //     this.chargeslist.splice(index, 1);
  //     this.dstable1.data = [];
  //     this.dstable1.data = this.chargeslist;

  //     if (this.chargeslist.length === 0) {
  //       this.myForm.patchValue({
  //         totalAmt: 0,
  //         totalDiscountPer: 0,
  //         discountAmt: 0,
  //         netPayableAmt: 0
  //       });
  //     } else {
  //       this.updateCalculation();
  //     }
  //   }
  //   this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
  //     toastClass: 'tostr-tost custom-toast-success',
  //   });
  // }

  chkChange() {
    if (this.registerObj.dateOfBirth > this.minDate) {
      this.toastr.warning('Enter Proper Birth Date', 'warning !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    }
  }
  startCountdown() {
    // const interval = setInterval(() => {
    //     this.countdown--;
    //     // Update color dynamically
    //     if (this.countdown > 120) {
    //         this.countdownColorClass = 'green';
    //     } else if (this.countdown > 60) {
    //         this.countdownColorClass = 'orange';
    //     } else {
    //         this.countdownColorClass = 'red';
    //     }
    //     if (this.countdown <= 0) {
    //         clearInterval(interval);
    //         this.isWaiting = false;
    //     }

    // }, 1000);
  }
  onChangePrefix(e) {
    this.ddlGender.SetSelection(e.sexId);
  }

  onChangecity(e) {
    this.CityName = e.cityName
    this.registerObj.stateId = e.stateId
    this._AppointmentlistService.getstateId(e.stateId).subscribe((Response) => {
      this.ddlState.SetSelection(Response.stateId)
      this.ddlCountry.SetSelection(Response.countryId);
    });
  }

  getSelectedTariffObj(event) {

    this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + event.value + "&ClassId=" + this.classId + "&ServiceName="
    this.tariffId = event.value
  }

  departmentId = 0
  selectChangedepartment(obj: any) {
    console.log(obj)
    this.departmentId = obj.value
    this.departmentname = obj.text

    if (obj.value) {
      this._AppointmentlistService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
        console.log(data)
        this.ddlDoctor.options = data;
        this.ddlDoctor.bindGridAutoComplete();
      });
    }
    else {
      this._AppointmentlistService.getDoctorsByDepartment(obj.departmentId).subscribe((data: any) => {
        // 
        this.ddlDoctor.options = data;
        const incomingDoctorId = obj.doctorId ?? obj.consultantDocId;
        console.log("Id:", incomingDoctorId)
        setTimeout(() => {
          this.ddlDoctor.bindGridAutoComplete();
          if (incomingDoctorId) {
            const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
            if (matchedDoctor) {
              this.ddlDoctor.SetSelection(matchedDoctor.value);
            }
          }
        }, 100);
      });
    }

  }

  selectChangeConcession(event) {
    this.ConcessionId = event.value
    this.ConcessionReason = event.text
  }
  allowOnlyDigits(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only digits (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    // Prevent entering more than 10 digits
    const input = event.target as HTMLInputElement;
    if (input.value.length >= 10) {
      event.preventDefault();
      return false;
    }
    return true;
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

  BillSave() {
    Swal.fire({
      title: 'Confirm Save',
      text: 'Are you sure you want to save this Appointment Bill?',
      icon: 'warning', // or 'question'
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Blue
      cancelButtonColor: '#d33',     // Red
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(this.myForm.value)

        const now = new Date();
        const formattedDate = this.datePipe.transform(now, "yyyy-MM-dd");
        const formattedTime = this.datePipe.transform(now, 'yyyy-MM-dd HH:mm:ss');
        // const formattedTime = formattedDate + this.dateTimeObj.time;

        this.myForm.get('RegDate').setValue(formattedDate);
        this.myForm.get('RegTime').setValue(formattedTime);

        // if (!this.regflag) {
        //   this.myForm.get('firstName').setValue(this.myForm.get('patientName').value)
        // }

        if (!this.myForm.invalid)
          this.OnSave();
        else {
          let invalidFields = [];
          if (this.myForm.invalid) {
            for (const controlName in this.myForm.controls) {
              const control = this.myForm.get(controlName);

              if (control instanceof FormGroup || control instanceof FormArray) {
                for (const nestedKey in control.controls) {
                  if (control.get(nestedKey)?.invalid) {
                    invalidFields.push(`Appointment Bill Data : ${controlName}.${nestedKey}`);
                  }
                }
              } else if (control?.invalid) {
                invalidFields.push(`Appointment Bill From: ${controlName}`);
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
    });
  }
  OnSave() {

    console.log(this.myForm.getRawValue())
    let DateOfBirth1 = this.myForm.get('DateOfBirth')?.value;
    if (DateOfBirth1) {

      const todayDate = new Date();
      const dob = new Date(DateOfBirth1);
      let ageYear = (todayDate.getFullYear() - dob.getFullYear());
      let ageMonth = (todayDate.getMonth() - dob.getMonth());
      let ageDay = (todayDate.getDate() - dob.getDate());

      this.ageYear = ageYear
      this.ageMonth = ageMonth
      this.ageDay = ageDay

      if (ageDay < 0) {
        (ageMonth)--;
        const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
        ageDay += previousMonth.getDate();
      }

      if (ageMonth < 0) {
        ageYear--;
        ageMonth += 12;
      }
      if (
        (!ageYear || ageYear == 0) &&
        (!ageMonth || ageMonth == 0) &&
        (!ageDay || ageDay == 0)
      ) {
        this.toastr.warning('Please select the birthdate or enter the age of the patient.', 'Warning!', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }

      this.myForm.get('Age')?.setValue(String(ageYear), { emitEvent: false });

      this.myForm.get('AgeYear')?.setValue(String(ageYear), { emitEvent: false });
      this.myForm.get('AgeMonth')?.setValue(String(ageMonth), { emitEvent: false });
      this.myForm.get('AgeDay')?.setValue(String(ageDay), { emitEvent: false });

    }
    debugger
    // if (this.PatientName){
    this.PatientName = this.myForm.get('FirstName').value + " " + this.myForm.get('LastName').value
    // }

    // Bill data
    const formattedDate1 = this.datePipe.transform(this.OpBillForm.get('billDate').value, "yyyy-MM-dd");
    const formattedTime1 = this.datePipe.transform(new Date(), "HH:mm:ss");

    this.OpBillForm.get('billDate').setValue(formattedDate1);
    this.OpBillForm.get('billTime').setValue(formattedDate1 + ' ' + formattedTime1);
    this.OpBillForm.get('opdIpdId')?.setValue(0)
    this.OpBillForm.get('tariffId')?.setValue(this.vTariffId)
    this.OpBillForm.get('regNo')?.setValue(this.regNo)
    this.OpBillForm.get('ipdno')?.setValue(this.opdNo)
    this.OpBillForm.get('ageYear')?.setValue(Number(this.ageYear) || 0)
    this.OpBillForm.get('ageMonth')?.setValue(Number(this.ageMonth) || 0)
    this.OpBillForm.get('ageDays')?.setValue(Number(this.ageDays) || 0)
    this.OpBillForm.get('doctorId')?.setValue(this.VisitFormGroup.get('ConsultantDocId').value || 0)
    this.OpBillForm.get('doctorName')?.setValue(this.doctorname || '')
    this.OpBillForm.get('patientType')?.setValue(this.companyId ? true : false)
    this.OpBillForm.get('companyName')?.setValue(this.companyName || '')
    this.OpBillForm.get('companyAmt')?.setValue(0)
    this.OpBillForm.get('patientAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
    this.OpBillForm.get('totalAmt')?.setValue(this.OPFooterForm.get('totalAmt')?.value)
    this.OpBillForm.get('concessionAmt')?.setValue(0)
    this.OpBillForm.get('netPayableAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
    this.OpBillForm.get('concessionReasonId')?.setValue(this.ConcessionId)
    this.OpBillForm.get('discComments')?.setValue(this.ConcessionReason)
    this.OpBillForm.get('patientName')?.setValue(this.PatientName)


    const formValue = { ...this.myForm.value };
    const controlsToRemove = ['patientName', 'IsPathRad', 'IsNRI', 'ServiceId', 'totalAmt', 'totalDiscountPer', 'discountAmt', 'netPayableAmt', 'paymentType'];
    controlsToRemove.forEach(key => delete formValue[key]);
    console.log(formValue)
    console.log("form values", this.OpBillForm.value)


    this.AppointmentBillfinalform.get("appRegistrationBills").setValue(formValue)
    this.AppointmentBillfinalform.get("visit").setValue(this.VisitFormGroup.value)


    console.log("form values", this.AppointmentBillfinalform.value)
    if (!this.myForm.invalid && !this.VisitFormGroup.invalid) {

      if (this.isCompanySelected && this.VisitFormGroup.get('CompanyId').value == 0) {
        this.toastr.warning('Please select valid Company ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      debugger
      if (this.searchFormGroup.get('regRadio').value == "registration") {

        //
        if (this.OpBillForm.invalid) {

          this.ChargeddetailsArray.clear();
          this.BillDetailsArray.clear();

          this.dsChargeList.data.forEach(item => {
            this.ChargeddetailsArray.push(this.CreateAddchargeform(item as ChargesList));
            this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));

          });

          console.log("form values", this.OpBillForm.value)

          if (this.OPFooterForm.get('paymentType').value == 'PayOption') {
            let PatientHeaderObj = {};
            PatientHeaderObj['Date'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '01/01/1900',
              PatientHeaderObj['PatientName'] = this.PatientName; // this.patientDetail.patientName;
            PatientHeaderObj['RegNo'] = this.regNo;
            PatientHeaderObj['DoctorName'] = this.doctorname;
            PatientHeaderObj['CompanyName'] = this.companyName;
            PatientHeaderObj['DepartmentName'] = this.departmentname;
            PatientHeaderObj['OPD_IPD_Id'] = this.vOPIPId;
            PatientHeaderObj['Age'] = this.ageYear;
            PatientHeaderObj['NetPayAmount'] = Math.round(this.OPFooterForm.get('netPayableAmt').value);
            const dialogRef = this._matDialog.open(OpPaymentComponent,
              {
                maxWidth: "80vw",
                height: '750px',
                width: '80%',
                data: {
                  vPatientHeaderObj: PatientHeaderObj,
                  FromName: "OP-Bill",
                  advanceObj: PatientHeaderObj,
                }
              });
            dialogRef.afterClosed().subscribe(result => {
              if (result && result.IsSubmitFlag == true) {
                this.OpBillForm.get('balanceAmt').setValue(result.BillBalanceAmount || 0)
                this.OpBillForm.get('payments').setValue(result.submitDataPay.ipPaymentInsert)

                this.AppointmentBillfinalform.get('appOPBillIngModels').setValue(this.OpBillForm.value)
                console.log(this.AppointmentBillfinalform.value)

                this._AppointmentlistService.InsertAppointmentBilling(this.AppointmentBillfinalform.value).subscribe(response => {
                  this.viewgetOPBillReportPdf(response.billNo)
                  this.closeAllOrNavigateBack();
                  this.savebtn = true
                });
              }
            });
          }
          else if (this.OPFooterForm.get('paymentType').value == 'CashPay') {//Cash pay  

            this.OpBillForm.get('balanceAmt').setValue(0)
            this.OpBillForm.get('paidAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
            this.OpBillForm.get('payments.cashPayAmount')?.setValue(Number(this.OPFooterForm.get('netPayableAmt')?.value))
            this.OpBillForm.get('payments.paymentDate')?.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
            this.OpBillForm.get('payments.paymentTime')?.setValue(this.datePipe.transform(new Date(), 'HH:mm:ss'))

            console.log(this.OpBillForm.value)
            this.AppointmentBillfinalform.get('appOPBillIngModels').setValue(this.OpBillForm.value)
            console.log(this.AppointmentBillfinalform.value)
            this._AppointmentlistService.InsertAppointmentBilling(this.AppointmentBillfinalform.value).subscribe(response => {
              console.log(response)
              this.viewgetOPBillReportPdf(response.billNo)
              this.closeAllOrNavigateBack();
              this.savebtn = true

            });
          }
          else if (this.OPFooterForm.get('paymentType').value == 'CreditPay') {//Credit pay 
            this.OpBillForm.get('paidAmt').setValue(0)
            this.OpBillForm.get('balanceAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
            this.OpBillForm.removeControl('payments')

            this.AppointmentBillfinalform.get('appOPBillIngModels').setValue(this.OpBillForm.value)
            console.log(this.AppointmentBillfinalform.value)

            this._AppointmentlistService.InsertAppointmentCreditBill(this.AppointmentBillfinalform.value).subscribe(response => {
              // this.viewgetOPBillReportPdf(response.billNo)
              this.closeAllOrNavigateBack();
              this.savebtn = true
            });
          }
        }
        else {
          let invalidFields = [];
          if (this.OpBillForm.invalid) {
            for (const controlName in this.OpBillForm.controls) {
              const control = this.OpBillForm.get(controlName);

              if (control instanceof FormGroup || control instanceof FormArray) {
                for (const nestedKey in control.controls) {
                  if (control.get(nestedKey)?.invalid) {
                    invalidFields.push(`OP Bill Data : ${controlName}.${nestedKey}`);
                  }
                }
              } else if (control?.invalid) {
                invalidFields.push(`OpBill From: ${controlName}`);
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
      // Reg Patient
      else if (this.searchFormGroup.get('regRadio').value == "registrered") {
        if (this.OpBillForm.invalid) {

          this.ChargeddetailsArray.clear();
          this.BillDetailsArray.clear();

          this.dsChargeList.data.forEach(item => {
            this.ChargeddetailsArray.push(this.CreateAddchargeform(item as ChargesList));
            this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));

          });

          console.log("form values", this.OpBillForm.value)

          if (this.OPFooterForm.get('paymentType').value == 'PayOption') {
            let PatientHeaderObj = {};
            PatientHeaderObj['Date'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '01/01/1900',
              PatientHeaderObj['PatientName'] = this.PatientName; // this.patientDetail.patientName;
            PatientHeaderObj['RegNo'] = this.regNo;
            PatientHeaderObj['DoctorName'] = this.doctorname;
            PatientHeaderObj['CompanyName'] = this.companyName;
            PatientHeaderObj['DepartmentName'] = this.departmentname;
            PatientHeaderObj['OPD_IPD_Id'] = this.vOPIPId;
            PatientHeaderObj['Age'] = this.ageYear;
            PatientHeaderObj['NetPayAmount'] = Math.round(this.OPFooterForm.get('netPayableAmt').value);
            const dialogRef = this._matDialog.open(OpPaymentComponent,
              {
                maxWidth: "80vw",
                height: '750px',
                width: '80%',
                data: {
                  vPatientHeaderObj: PatientHeaderObj,
                  FromName: "OP-Bill",
                  advanceObj: PatientHeaderObj,
                }
              });
            dialogRef.afterClosed().subscribe(result => {
              if (result && result.IsSubmitFlag == true) {
                this.OpBillForm.get('balanceAmt').setValue(result.BillBalanceAmount || 0)
                this.OpBillForm.get('payments').setValue(result.submitDataPay.ipPaymentInsert)

                // this.AppointmentBillfinalform.get('appOPBillIngModels').setValue(this.OpBillForm.value)
                // console.log(this.AppointmentBillfinalform.value)
                this.RegiAppointmentBillfinalform.get('appOPBillIngModels').setValue(this.OpBillForm.value)
                this.RegiAppointmentBillfinalform.get("visit").setValue(this.VisitFormGroup.value)


                console.log(this.RegiAppointmentBillfinalform.value)

                this._AppointmentlistService.RegistredAppointmentBilling(this.RegiAppointmentBillfinalform.value).subscribe(response => {
                  this.viewgetOPBillReportPdf(response.billNo)
                  this.closeAllOrNavigateBack();
                  this.savebtn = true
                });
              }
            });
          }
          else if (this.OPFooterForm.get('paymentType').value == 'CashPay') {//Cash pay  

            this.OpBillForm.get('balanceAmt').setValue(0)
            this.OpBillForm.get('paidAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
            this.OpBillForm.get('payments.cashPayAmount')?.setValue(Number(this.OPFooterForm.get('netPayableAmt')?.value))
            this.OpBillForm.get('payments.paymentDate')?.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
            this.OpBillForm.get('payments.paymentTime')?.setValue(this.datePipe.transform(new Date(), 'HH:mm:ss'))

            console.log(this.OpBillForm.value)

            this.RegiAppointmentBillfinalform.get('appOPBillIngModels').setValue(this.OpBillForm.value)
            this.RegiAppointmentBillfinalform.get("visit").setValue(this.VisitFormGroup.value)


            console.log(this.RegiAppointmentBillfinalform.value)
            debugger

            // const formValue = { ...this.RegiAppointmentBillfinalform.value };
            // delete formValue['appRegistrationBills']
            console.log(this.RegiAppointmentBillfinalform.value)
            //  console.log(formValue)
            this._AppointmentlistService.RegistredAppointmentBilling(this.RegiAppointmentBillfinalform.value).subscribe(response => {
              console.log(response)
              this.viewgetOPBillReportPdf(response.billNo)
              this.closeAllOrNavigateBack();
              this.savebtn = true

            });
          }
          else if (this.OPFooterForm.get('paymentType').value == 'CreditPay') {//Credit pay 
            this.OpBillForm.get('paidAmt').setValue(0)
            this.OpBillForm.get('balanceAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
            this.OpBillForm.removeControl('payments')

            this.AppointmentBillfinalform.get('appOPBillIngModels').setValue(this.OpBillForm.value)
            console.log(this.AppointmentBillfinalform.value)

            this._AppointmentlistService.InsertAppointmentCreditBill(this.AppointmentBillfinalform.value).subscribe(response => {
              // this.viewgetOPBillReportPdf(response.billNo)
              this.closeAllOrNavigateBack();
              this.savebtn = true
            });
          }
        }
        else {
          let invalidFields = [];
          if (this.OpBillForm.invalid) {
            for (const controlName in this.OpBillForm.controls) {
              const control = this.OpBillForm.get(controlName);

              if (control instanceof FormGroup || control instanceof FormArray) {
                for (const nestedKey in control.controls) {
                  if (control.get(nestedKey)?.invalid) {
                    invalidFields.push(`OP Bill Data : ${controlName}.${nestedKey}`);
                  }
                }
              } else if (control?.invalid) {
                invalidFields.push(`OpBill From: ${controlName}`);
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


      //
    } else {
      let invalidFields = [];
      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) { invalidFields.push(`Personal Form: ${controlName}`); }
        }
      }
      if (this.VisitFormGroup.invalid) {
        for (const controlName in this.VisitFormGroup.controls) { if (this.VisitFormGroup.controls[controlName].invalid) { invalidFields.push(`Visit Form: ${controlName}`); } }
      }

      if (invalidFields.length > 0) {
        invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
      }

    }
  }

  getPacakgeDetail(contact) {
    const dialogRef = this._matDialog.open(PackageDetailsComponent,
      {
        maxWidth: "100%",
        height: '75%',
        width: '70%',
        data: {
          Obj: contact,
          // PatientDet: this.patientDetail
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      if (result) {
        this.dsPackageList.data = result
        console.log(this.dsPackageList.data)
        this.dsPackageList.data.forEach(element => {
          this.PacakgeList = [];
          if (element.BillwiseTotalAmt > 0) {
            this.TotalPrice = element.BillwiseTotalAmt;
            console.log(this.TotalPrice)
          } else {
            this.TotalPrice = parseInt(this.TotalPrice) + parseInt(element.Price);
            console.log(this.TotalPrice)
          }
          this.OriginalPackageService = this.dsChargeList.data.filter(item => item.ServiceId !== element.PackageServiceId)
          this.EditedPackageService = this.dsChargeList.data.filter(item => item.ServiceId === element.PackageServiceId)
          console.log(this.OriginalPackageService)
          console.log(this.EditedPackageService)
        });
        let price = 0;
        let TotalAmt = 0;
        let NetAmount = 0;
        this.dsPackageList.data.forEach(element => {
          if (element.BillwiseTotalAmt > 0) {
            price = 0;
            TotalAmt = 0;
            NetAmount = 0;
          } else {
            price = element.Price
            TotalAmt = element.TotalAmt
            NetAmount = element.NetAmount
          }
          this.PacakgeList.push(
            {
              serviceId: element.ServiceId,
              serviceName: element.ServiceName,
              price: price || 0,
              Qty: element.Qty || 1,
              TotalAmt: TotalAmt || 0,
              ConcessionPercentage: element.ConcessionPercentage || 0,
              DiscAmt: element.DiscAmt || 0,
              NetAmount: NetAmount || 0,
              isPathology: element.IsPathology || 0,
              isRadiology: element.IsRadiology || 0,
              packageId: element.PackageId || 0,
              PackageServiceId: element.PackageServiceId || 0,
              pacakgeServiceName: element.PacakgeServiceName || '',
              doctorName: element.DoctorName || '',
              doctorId: element.DoctorId || 0
            });
          this.dsPackageList.data = this.PacakgeList;
        });
        if (this.EditedPackageService.length) {
          this.EditedPackageService.forEach(element => {
            this.OriginalPackageService.push(
              {
                ChargesId: 0,// this.serviceId,
                ServiceId: element.ServiceId,
                ServiceName: element.ServiceName,
                Price: this.TotalPrice || 0,
                Qty: element.Qty || 0,
                TotalAmt: (parseFloat(element.Qty) * parseFloat(this.TotalPrice)) || 0,
                DiscPer: element.DiscPer || 0,
                DiscAmt: element.DiscAmt || 0,
                NetAmount: (parseFloat(element.Qty) * parseFloat(this.TotalPrice)) || 0,
                ClassId: 1,
                DoctorId: element.DoctornewId,
                DoctorName: element.DoctorName,
                ChargesDate: this.datePipe.transform(new Date(), 'MM/dd/yyyy') || '01/01/1900',
                IsPathology: element.IsPathology,
                IsRadiology: element.IsRadiology,
                IsPackage: element.IsPackage,
                ClassName: element.ClassName,
                ChargesAddedName: this.accountService.currentUserValue.user.id || 1,
              });
            this.dsChargeList.data = this.OriginalPackageService;
            this.chargeList = this.dsChargeList.data
          });
        }
        this.TotalPrice = 0;
      }
      this.calculateTotalAmount();
    })
  }
  calculateTotalCharge(row: any = null): void {

    let qty = +this.chargeForm.get("qty").value;
    let price = +this.chargeForm.get("price").value;
    let total = 0
    if (qty > 0 && price > 0) {
      total = qty * price;
    }
    this.chargeForm.patchValue({
      totalAmount: total,
      netAmount: total  // Set net amount initially
    }, { emitEvent: false }); // Prevent infinite loop

    this.updateDiscountAmount();
    this.updateDiscountPercentage();
  }
  // Trigger when discount percentage change
  updateDiscountAmount(row: any = null): void {
    if (this.isUpdating) return; // Stop recursion
    this.isUpdating = true;

    const perControl = this.chargeForm.get("discountPer");
    if (!perControl.valid) {
      this.chargeForm.get("discountAmount").setValue(0);
      this.chargeForm.get("discountPer").setValue(0);
      this.isUpdating = false;
      this.toastrService.error("Enter discount % between 0-100");
      return;
    }
    let percentage = perControl.value;
    let totalAmount = this.chargeForm.get("totalAmount").value;

    // let discountAmount = this.getFixedDecimal(totalAmount * percentage / 100);
    // let netAmount = this.getFixedDecimal(totalAmount - discountAmount);
    let discountAmount = parseFloat((totalAmount * percentage / 100).toFixed(2));
    let netAmount = parseFloat((totalAmount - discountAmount).toFixed(2));

    this.chargeForm.patchValue({
      discountAmount: discountAmount,
      netAmount: netAmount
    }, { emitEvent: false }); // Prevent infinite loop

    this.isUpdating = false; // Reset flag
  }
  // Trigger when discount amount change
  updateDiscountPercentage(): void {
    if (this.isUpdating) return;
    this.isUpdating = true;

    let discountAmount = this.chargeForm.get("discountAmount").value;
    let totalAmount = this.chargeForm.get("totalAmount").value;

    if (discountAmount < 0 || discountAmount > totalAmount) {
      this.chargeForm.get("discountAmount").setValue(0);
      this.chargeForm.get("discountPer").setValue(0);
      this.isUpdating = false;
      this.toastrService.error("Discount must be between 0 and the total amount.");
      return;
    }
    // let percent = this.getFixedDecimal(totalAmount ? (discountAmount / totalAmount) * 100 : 0);
    // let netAmount = this.getFixedDecimal(totalAmount - discountAmount);

    let percent = Number(totalAmount ? ((discountAmount / totalAmount) * 100).toFixed(2) : "0.00");
    let netAmount = Number((totalAmount - discountAmount).toFixed(2));
    this.chargeForm.patchValue({
      discountPer: percent,
      netAmount: netAmount
    }, { emitEvent: false }); // Prevent infinite loop

    this.isUpdating = false; // Reset flag
  }
  handleChange(key: string, callback: () => void, form: FormGroup = this.chargeForm) {

    this.subscription.push(form.get(key).valueChanges.subscribe(value => {
      callback();
    }));
  }
  getFixedDecimal(value: number) {
    return Number(value.toFixed(2));
  }
  getAmount(key: string): number {
    const control = this.OPFooterForm.get(key);
    return control ? control.value : 0;
  }
  // Calculation of total amount.

  openServiceTable(): void {
    this._matDialog.open(this.serviceTable, {
      width: '40%',
      height: '60%',
    })
    let Data = {
      "first": 0,
      "rows": 100,
      "sortField": "RequestTranId",
      "sortOrder": 0,
      "filters": [{ "fieldName": "VisitId", "fieldValue": String(this.vOPIPId), "opType": "Equals" }],
      "exportType": "JSON",
      "columns": [{ "data": "string", "name": "string" }]
    }
    this._AppointmentlistService.getOPDEmrId(Data).subscribe((response) => {
      this.dsServiceList.data = response.data;
      console.log(this.dsServiceList.data)
    });
  }

  viewgetOPBillReportPdf(element) {
    this.commonService.Onprint("BillNo", element, "OpBillReceipt");
  }
  Patientnewold: any = 1;
  // ??old
  // onChangeReg(event) {
  //   
  //   if (event.value === 'registration') {
  //     this.myForm.reset();
  //     this.myForm.get('RegId').reset();
  //     this.searchFormGroup.get('RegId').disable();
  //     this.isRegSearchDisabled = false;
  //     this.Patientnewold = 1;

  //     // Instead of reassigning, update controls one by one
  //     const myForm = this.CreateAppointmentForm();
  //     this.resetFilteredOptions();
  //     Object.keys(myForm.controls).forEach(key => {
  //       if (this.myForm.contains(key)) {
  //         this.myForm.setControl(key, myForm.get(key));
  //       } else {
  //         this.myForm.addControl(key, myForm.get(key));
  //       }
  //     });

  //     // const myForm = this._AppointmentlistService.createVisitdetailForm();
  //     // Object.keys(myForm.controls).forEach(key => {
  //     //   if (this.myForm.contains(key)) {
  //     //     this.myForm.setControl(key, myForm.get(key));
  //     //   } else {
  //     //     this.myForm.addControl(key, myForm.get(key));
  //     //   }
  //     // });

  //     this.myForm.markAllAsTouched();
  //     this.myForm.markAllAsTouched();

  //     this.Regflag = false;
  //     this.IsPhoneAppflag = true;

  //   } else if (event.value === 'registrered') {

  //     this.myForm.get('RegId').enable();
  //     this.searchFormGroup.get('RegId').enable();
  //     this.searchFormGroup.get('RegId').reset();
  //     this.myForm.reset();
  //     this.Patientnewold = 2;

  //     const newPersonalForm = this.CreateAppointmentForm();
  //     this.resetFilteredOptions();
  //     Object.keys(newPersonalForm.controls).forEach(key => {
  //       if (this.myForm.contains(key)) {
  //         this.myForm.setControl(key, newPersonalForm.get(key));
  //       } else {
  //         this.myForm.addControl(key, newPersonalForm.get(key));
  //       }
  //     });

  //     // const newVisitForm = this._AppointmentlistService.createVisitdetailForm();
  //     // Object.keys(newVisitForm.controls).forEach(key => {
  //     //   if (this.myForm.contains(key)) {
  //     //     this.myForm.setControl(key, newVisitForm.get(key));
  //     //   } else {
  //     //     this.myForm.addControl(key, newVisitForm.get(key));
  //     //   }
  //     // });

  //     this.myForm.markAllAsTouched();
  //     this.myForm.markAllAsTouched();

  //     this.Regflag = true;
  //     this.IsPhoneAppflag = false;
  //     this.isRegSearchDisabled = true;
  //   }
  // }
  //Reg patient
  resetFilteredOptions() {
    this.filteredOptions = [];
    this.prevResults = [];
  }
  getdocdetail(event) {
    console.log(event)
    this.doctorName = event.text
  }
  getSelectedObj(obj) {
    // debugger
    if (this.data?.FormName == 'Registration-Page') {
      // this.PatientName = obj.firstName + ' ' + obj.lastName;
      this.PatientName = obj.patientName

      // this.RegId = obj.regId;
      // this.VisitFlagDisp = true;
      if ((this.RegId ?? 0) > 0) {
        console.log(obj)
        setTimeout(() => {
          this._AppointmentlistService.getRegistraionById(this.RegId).subscribe((response) => {
            this.registerObj = response;
            this.value = response.dateofBirth
            this.vRegNo = response.regno
            this.onChangeDateofBirth(response.dateofBirth)
            console.log(response)
            this.getLastDepartmetnNameList(this.registerObj)
            this.myForm.patchValue({
              FirstName: this.registerObj.firstName.trim(),
              middleName: this.registerObj.middleName.trim(),
              LastName: this.registerObj.lastName.trim(),
              MobileNo: this.registerObj.mobileNo.trim(),
              address: this.registerObj.address.trim(),
              // DateOfBirth:this.registerObj.dateofBirth,
              emgContactPersonName: this.registerObj?.emgContactPersonName ?? '',
              emgRelationshipId: this.registerObj?.emgRelationshipId ?? 0,
              emgMobileNo: this.registerObj?.emgMobileNo ?? '',
              emgLandlineNo: this.registerObj?.emgLandlineNo ?? '',
              engAddress: this.registerObj?.engAddress ?? '',
              emgAadharCardNo: this.registerObj?.emgAadharCardNo ?? '',
              emgDrivingLicenceNo: this.registerObj?.emgDrivingLicenceNo ?? '',
              medTourismPassportNo: this.registerObj?.medTourismPassportNo ?? '',
              medTourismVisaIssueDate: this.registerObj?.medTourismVisaIssueDate ?? '',
              medTourismVisaValidityDate: this.registerObj?.medTourismVisaValidityDate ?? '',
              medTourismNationalityId: this.registerObj?.medTourismNationalityId ?? '',
              medTourismCitizenship: this.registerObj?.medTourismCitizenship ?? 0,
              medTourismPortOfEntry: this.registerObj?.medTourismPortOfEntry ?? '',
              medTourismDateOfEntry: this.registerObj?.medTourismDateOfEntry ?? '',
              medTourismResidentialAddress: this.registerObj?.medTourismResidentialAddress ?? '',
              medTourismOfficeWorkAddress: this.registerObj?.medTourismOfficeWorkAddress ?? '',
            });
            console.log(this.registerObj)
          });

        }, 100);
      }

    } else {
      this.PatientName = obj.PatientName;
      this.RegId = obj.value;
      // this.VisitFlagDisp = true;
      if ((this.RegId ?? 0) > 0) {
        console.log(obj)
        setTimeout(() => {
          this.searchFormGroup.get('regRadio')?.setValue('registrered');
          this.onChangeReg({ value: 'registrered' });
          this._AppointmentlistService.getRegistraionById(this.RegId).subscribe((response) => {
            this.registerObj = response;
            console.log(response)
            this.value = response.dateofBirth
            this.onChangeDateofBirth(response.dateofBirth)
            this.getLastDepartmetnNameList(this.registerObj)
            this.myForm.patchValue({
              FirstName: this.registerObj.firstName,
              middleName: this.registerObj.middleName.trim(),
              LastName: this.registerObj.lastName,
              MobileNo: this.registerObj.mobileNo,
              address: this.registerObj.address.trim(),
              // DateOfBirth:this.registerObj.dateofBirth,
              emgContactPersonName: this.registerObj?.emgContactPersonName ?? '',
              emgRelationshipId: this.registerObj?.emgRelationshipId ?? 0,
              emgMobileNo: this.registerObj?.emgMobileNo ?? '',
              emgLandlineNo: this.registerObj?.emgLandlineNo ?? '',
              engAddress: this.registerObj?.engAddress ?? '',
              emgAadharCardNo: this.registerObj?.emgAadharCardNo ?? '',
              emgDrivingLicenceNo: this.registerObj?.emgDrivingLicenceNo ?? '',
              medTourismPassportNo: this.registerObj?.medTourismPassportNo ?? '',
              medTourismVisaIssueDate: this.registerObj?.medTourismVisaIssueDate ?? new Date(),
              medTourismVisaValidityDate: this.registerObj?.medTourismVisaValidityDate ?? new Date(),
              medTourismNationalityId: this.registerObj?.medTourismNationalityId ?? '',
              medTourismCitizenship: this.registerObj?.medTourismCitizenship ?? 0,
              medTourismPortOfEntry: this.registerObj?.medTourismPortOfEntry ?? '',
              medTourismDateOfEntry: this.registerObj?.medTourismDateOfEntry ?? new Date(),
              medTourismResidentialAddress: this.registerObj?.medTourismResidentialAddress ?? '',
              medTourismOfficeWorkAddress: this.registerObj?.medTourismOfficeWorkAddress ?? '',
            });

          });

        }, 100);
      }
    }

    this.onChangeDateofBirth(this.registerObj.dateofBirth)
  }
  PrevregisterObj: any;
  getLastDepartmetnNameList(row) {
    const dialogRef = this._matDialog.open(PreviousDeptListComponent,
      {
        maxWidth: "45vw",
        height: '45%',
        width: '100%',
        data: {
          Obj: row,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.PrevregisterObj = result
      this.VisitFormGroup.get("DepartmentId").setValue(this.PrevregisterObj.departmentId)
      this.selectChangedepartment(this.PrevregisterObj)
      console.log(this.PrevregisterObj)
    });
  }

  vDepId = 0;
  vDocId = 0;
  //   changed by raksha date:17/6/25
  getSelectedObjphone(obj) {
    console.log("Phone data:", obj)

    if (obj.phAppId > 0) {
      const name = obj.text?.split('|')[0]?.trim();
      Swal.fire({
        icon: 'warning',
        title: 'Appointment already completed',
        text: `This ${name} already has an appointment.`,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    this.PatientName = obj.text;
    // this.RegId = obj.regId;
    this.registerObj = obj;
    this.vDepId = this.registerObj.departmentId
    this.vDocId = this.registerObj.doctorId

  }
  selectChangedepartmentForPhone(obj: any) {

    this._AppointmentlistService.getDoctorsByDepartment(obj).subscribe((data: any) => {
      // console.log(data)
      this.ddlDoctor.options = data;
      this.ddlDoctor.bindGridAutoComplete();
      const incomingDoctorId = this.vDocId;
      if (incomingDoctorId) {
        const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
        if (matchedDoctor) {
          // this.myForm.get('ConsultantDocId')?.setValue(matchedDoctor.value);
        }
      }
    });
  }

  resetform(): void {
    this.chargeForm.reset({
      serviceName: "a",
      price: 0,
      qty: 0,
      totalAmount: 0,
      discountPer: 0,
      discountAmount: 0,
      netAmount: 0,
      DoctorID: 0,
      DoctorName: ''
    });
    this.doctorName = '';
  }
  onChangeReg(event) {
    if (event.value === 'registration') {
      this.myForm.reset();
      this.myForm.get('RegId').reset();
      this.searchFormGroup.get('RegId').disable();
      this.isRegSearchDisabled = false;
      this.Patientnewold = 1;

      // Instead of reassigning, update controls one by one
      const newPersonalForm = this.CreateAppointmentForm();
      this.resetFilteredOptions();
      Object.keys(newPersonalForm.controls).forEach(key => {
        if (this.myForm.contains(key)) {
          this.myForm.setControl(key, newPersonalForm.get(key));
        } else {
          this.myForm.addControl(key, newPersonalForm.get(key));
        }
      });

      const newVisitForm = this._AppointmentlistService.createVisitdetailForm();
      Object.keys(newVisitForm.controls).forEach(key => {
        if (this.VisitFormGroup.contains(key)) {
          this.VisitFormGroup.setControl(key, newVisitForm.get(key));
        } else {
          this.VisitFormGroup.addControl(key, newVisitForm.get(key));
        }
      });

      this.myForm.markAllAsTouched();
      this.VisitFormGroup.markAllAsTouched();

      this.Regflag = false;
      this.IsPhoneAppflag = true;

    } else if (event.value === 'registrered') {

      this.myForm.get('RegId').enable();
      this.searchFormGroup.get('RegId').enable();
      this.searchFormGroup.get('RegId').reset();
      this.myForm.reset();
      this.Patientnewold = 2;

      const newPersonalForm = this.CreateAppointmentForm();
      this.resetFilteredOptions();
      Object.keys(newPersonalForm.controls).forEach(key => {
        if (this.myForm.contains(key)) {
          this.myForm.setControl(key, newPersonalForm.get(key));
        } else {
          this.myForm.addControl(key, newPersonalForm.get(key));
        }
      });

      const newVisitForm = this._AppointmentlistService.createVisitdetailForm();
      Object.keys(newVisitForm.controls).forEach(key => {
        if (this.VisitFormGroup.contains(key)) {
          this.VisitFormGroup.setControl(key, newVisitForm.get(key));
        } else {
          this.VisitFormGroup.addControl(key, newVisitForm.get(key));
        }
      });

      this.myForm.markAllAsTouched();
      this.VisitFormGroup.markAllAsTouched();

      this.Regflag = true;
      this.IsPhoneAppflag = false;
      this.isRegSearchDisabled = true;
    }
  }
  onChangePatient(value) {

    var mode = "Company"
    if (value.text != "Self") {
      this._AppointmentlistService.getMaster(mode, 1);
      this.VisitFormGroup.get('CompanyId').setValidators([Validators.required]);
      this.isCompanySelected = true;
      this.patienttype = 2;
    } else if (value.text == "Self") {
      this.isCompanySelected = false;
      this.VisitFormGroup.get('CompanyId').clearValidators();
      this.VisitFormGroup.get('SubCompanyId').clearValidators();
      this.VisitFormGroup.get('CompanyId').updateValueAndValidity();
      this.VisitFormGroup.get('SubCompanyId').updateValueAndValidity();
      this.patienttype = 1;
    }
  }

  onChangeCompany(value) {
    this._AppointmentlistService.getCompanyById(value.value).subscribe((response) => {
      this.companyDet = response;
      console.log("Company Data:", this.companyDet)
      this.VisitFormGroup.get('TariffId').setValue(this.companyDet.traiffId);
    });
  }


  getValidationMessages() {
    return {
      CashCounterID: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      price: [
        { name: "pattern", Message: "only Number allowed." },
        { name: "min", Message: "Enter valid price." }
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
      totalNetAmount: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      DoctorID: [
        { name: "pattern", Message: "only Char allowed." }
      ],
      discountPer: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      discountAmount: [{ name: "pattern", Message: "only Number allowed." }],
      netAmount: [{ name: "pattern", Message: "only Number allowed." }],
      tariffId: [
        { name: "pattern", Message: "only Char allowed." }
      ],


      firstName: [
        { name: "required", Message: "First Name is required" },
        { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      middleName: [
        { name: "pattern", Message: "only char allowed." }
      ],
      lastName: [
        { name: "required", Message: "Last Name is required" },
        { name: "pattern", Message: "only char allowed." }
      ],
      address: [
        { name: "required", Message: "Address is required" },

      ],
      prefixId: [
        { name: "required", Message: "Prefix Name is required" }
      ],
      genderId: [
        { name: "required", Message: "Gender is required" }
      ],
      areaId: [
        { name: "required", Message: "Area Name is required" }
      ],
      cityId: [
        { name: "required", Message: "City Name is required" }
      ],
      religionId: [
        { name: "required", Message: "Religion Name is required" }
      ],
      countryId: [
        { name: "required", Message: "Country Name is required" }
      ],
      maritalStatusId: [
        { name: "required", Message: "Mstatus Name is required" }
      ],
      stateId: [
        { name: "required", Message: "State Name is required" }
      ],
      mobileNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "Mobile No is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ],
      phoneNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ],
      aadharCardNo: [
        // { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "AAdharcard No is required" },
        { name: "minLength", Message: "12 digit required." },
        { name: "maxLength", Message: "More than 12 digits not allowed." }

      ],
      patientTypeId: [
        { name: "required", Message: "Country Name is required" }
      ],

      departmentId: [
        { name: "required", Message: "Department Name is required" }
      ],
      refDocId: [
        { name: "required", Message: "Ref Doctor Name is required" }
      ],
      PurposeId: [
        { name: "required", Message: "Purpose Name is required" }
      ],
      CompanyId: [
        { name: "required", Message: "Company Name is required" }
      ],
      SubCompanyId: [
        { name: "required", Message: "SubCompany Name is required" }
      ],
      emgDrivingLicenceNo: [
        { name: "pattern", Message: "e.g., MH14-20210001234" },
        { name: "minLength", Message: "16 digit required." },
        { name: "maxLength", Message: "More than 16 digits not allowed." }
      ],
      medTourismPassportNo: [
        { name: "pattern", Message: "e.g., A1234567" },
        { name: "minLength", Message: "8 digit required." },
        { name: "maxLength", Message: "More than 8 digits not allowed." }
      ],
      medTourismNationalityId: [
        { name: "pattern", Message: "Only alphanumeric, 10 to 15 characters" },
        { name: "minLength", Message: "Minimum 10 characters required." },
        { name: "maxLength", Message: "Maximum 15 characters allowed." }
      ],
      UnitId: [
        { name: "required", Message: "Unit Name is required" }
      ],
      ClassId: [
        { name: "required", Message: "Class Name is required" }
      ],
    }
  }
  aadharRaw = '';
  onAadhaarInput(e: any) {
    const v = (e.target.value || '').replace(/\D/g, '').slice(0, 12); // only digits
    this.aadharRaw = v;

    const displayValue = (v.length === 12)
      ? 'xxxxxxxx' + v.slice(-4)
      : v;
    this.myForm.get('aadharCardNo')?.setValue(displayValue, { emitEvent: false });
  }
  onChangestate(e) {
  }

  chkDoctor(event) {
    console.log(event)
    this.doctorname = event.text
  }
  onClose() {
    this.myForm.reset();
    this.closeOrNavigateBack();
  }

  // Delete charge from list
  deleteCharge(index: number, contact: any): void {
    if (index >= 0 && index < this.chargeList.length) {
      this.chargeList.splice(index, 1);
      this.dsChargeList.data = this.chargeList;
      this.calculateTotalAmount();

      if (this.chargeList.length === 0) {
        this.isDiscountApplied = false;
        this.Consessionres = false;
      }

      this.toastr.success('Service removed successfully.', 'Removed!', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    }
  }

  // Get service from service table popup
  getService(contact: any): void {
    if (contact) {
      this.chargeForm.patchValue({
        serviceName: contact,
        price: contact.classRate || 0
      });
      this.serviceId = contact.serviceId;
      this.SrvcName1 = contact.serviceName;
      this.IsPathology = contact.isPathology;
      this.IsRadiology = contact.isRadiology;
      this.vIsPackage = contact.isPackage;
      this.serviceSelct = true;
      this.calculateTotalCharge();
      this._matDialog.closeAll();
    }
  }

  // Manual refresh for waiting state
  manualRefresh(): void {
    this.statusMessage = 'Refreshing...';
    // Add any refresh logic here if needed
    setTimeout(() => {
      this.statusMessage = 'Processing...';
    }, 1000);
  }
}
// Set NODE_OPTIONS="--max-old-space-size=8192"


