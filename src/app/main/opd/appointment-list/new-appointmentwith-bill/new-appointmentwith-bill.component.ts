import { DatePipe, Location } from '@angular/common';
import { Component, Inject, Optional, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { HospitalConfigService } from 'app/core/services/hospital-config.service';
import { LabRequest } from 'app/main/Lab Management/lab-patient-reg/lab-patient-reg.component';
import { PrevlabHistoryComponent } from 'app/main/Lab Management/lab-patient-reg/prevlab-history/prevlab-history.component';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject, Subscription, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { RegInsert } from '../../registration/registration.component';
import { ChargesList } from '../appointment-billing/appointment-billing.component';
import { PackageDetailsComponent } from '../appointment-billing/package-details/package-details.component';
import { AppointmentlistService } from '../appointmentlist.service';
import { PreviousDeptListComponent } from '../update-reg-patient-info/previous-dept-list/previous-dept-list.component';
import { MatTabChangeEvent } from '@angular/material/tabs';

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
        ['IsCheck', 'ServiceNamePackage', 'ServiceName', 'Price', 'DoctorName'];

    public displayedPrescriptionColumns =
        ['groupName', 'serviceName', 'classRate', 'userName'];

    isExpanded2 = false;
    onlineflag: boolean = false;
    mode: any;
    abhaForm: FormGroup
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
    currentDate = new Date();
    autocompleteModepatienttype: string = "PatientType";
    autocompleteModegender: string = "Gender";
    autocompleteModecountry: string = "Country";
    autocompleteModeDepartment: string = "Department";
    autocompleteModerefdoc: string = "RefDoctor";
    autocompleteModedoctor: string = "ConDoctor";
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
    vhealthCardNo: any
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
    vUserID: any = 0;
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
    doctorOptions: any[] = [];
    HealthCardExpDate: any;
    isExpanded1 = false; // Defaults to closed
    isExpanded3 = false;
    vUPINO: any = ""
    UserWsieCashcounterId: boolean = false;
    doctorName1 = ""
    pincode = '';
    area = ''
    displayedServiceColumns: string[] = [
        'ServiceName',
        'price',
        'Action'
    ]

    displayedServiceselected: string[] = [
        'Status',
        'ServiceName',
        'DoctorName',
        // 'Urgent',
        'Price',
        'DiscountPer',
        'DiscountAmount',
        'NetAmount',
        'buttons'
    ]
    @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
    @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
    @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
    @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
    IsCasepaperBillPrint: boolean = false;
    IsOPCasePaperPrtWithoutPreviewID: boolean = false;

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
        private router: Router, private apiCaller: ApiCaller,
        private location: Location
    ) {
        this.ApiURL = "VisitDetail/search-GetServiceListwithTraiff?TariffId=" + this.vTariffId + "&ClassId=" + 1 + "&SrvcName="
        // Check if opened as modal or as standalone page
        this.isModal = !!this.dialogRef;
    }

    ngOnInit(): void {
        this.vUserID = this.accountService.currentUserValue?.userId || 0;
        this.createBillForm()
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
        this.VisitFormGroup = this.createVisitdetailForm();
        this.VisitFormGroup.markAllAsTouched();
        this.loadDropdownOptions();
        this.abhaForm = this._AppointmentlistService.createAbhadetailForm()

        this.setupFormListener();
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
        const rawValue1 = this?._ConfigService?.configParams?.IsCasepaperBillPrint || "";
        const [id1, val1] = rawValue1.includes(":") ? rawValue1.split(":") : [null, null];
        this.IsCasepaperBillPrint = id1 === "1";


        const [UserWsieCashcounterId, UserWsieCashcounterVal] = this._ConfigService.configParams.IsUserwiseCashCounterflow.split(":");
        this.UserWsieCashcounterId = UserWsieCashcounterId === "1";

        const [IsOPCasePaperPrtWithoutPreviewID, IsOPCasePaperPrtWithoutPreviewVal] = this._ConfigService.configParams.IsOPCasePaperPrtWithoutPreview.split(":");
        this.IsOPCasePaperPrtWithoutPreviewID = IsOPCasePaperPrtWithoutPreviewID === "1";


        const [OPDDefaultDepartmentId, OPDDefaultDepartmentVal] = this._ConfigService.configParams.OPDDefaultDepartment.split(":");

        const [OPDDefaultDoctorId, OPDDefaultDoctorVal] = this._ConfigService.configParams.OPDDefaultDoctor.split(":");
        if (OPDDefaultDepartmentId === "1") {
            setTimeout(() => {
                this.VisitFormGroup.get('DepartmentId').setValue(OPDDefaultDepartmentVal);
                this.selectChangedepartment(this.VisitFormGroup.get('DepartmentId'))
            }, 1000);
        }
        debugger
        if (OPDDefaultDoctorId === "1") {
            setTimeout(() => {
                this.VisitFormGroup.get('ConsultantDocId').setValue(OPDDefaultDoctorVal);
                this.getDocServicelist(this.VisitFormGroup.get('ConsultantDocId').value)
            }, 1000);
        }
    }

    // Load data by ID when opened as standalone page
    private loadDataById(id: string): void {
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
        // if (this.isModal) {
        //   this._matDialog.closeAll();
        // } else {
        this.router.navigate(['/opd/appointment']);
        // }
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
                appRegistrationBills: '',
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
        // this.handleChange('totalDiscountPer', () => this.updateTotalDiscountAmt(), this.OPFooterForm);
        // this.handleChange('concessionAmt', () => this.updateTotalDiscountPer(), this.OPFooterForm);
    }
    createSearchForm() {
        return this._formbuilder.group({
            regRadio: ['registration'],
            regRadio1: ['registration1'],
            RegId: [''],
            PhoneRegId: [''],
            UnitId: [this.accountService.currentUserValue.user.unitId],
            CashCounterID: [this.hospitalconfigservice.HospitalconfigParams?.OPD_Billing_CounterId],
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
            prefixId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            firstName: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100),
                // Validators.pattern("^[A-Za-z/() ]*$"),
                this._FormvalidationserviceService.noWhitespaceValidator()
            ]],
            middleName: ['', [
                Validators.maxLength(100),
                // Validators.pattern("^[A-Za-z/() ]*$"),
                this._FormvalidationserviceService.allowEmptyStringValidator()
            ]],
            lastName: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100),
                // Validators.pattern("^[A-Za-z/() ]*$"),
                this._FormvalidationserviceService.noWhitespaceValidator()
            ]],

            address: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(200)]],
            aadharCardNo: ['', [
                Validators.minLength(12),
                Validators.maxLength(12),
                // this._FormvalidationserviceService.onlyNumberValidator()
            ]], // Validators.pattern("^[0-9]*$"),Validators.pattern(/^[xX]{8}\d{4}$/),
            genderId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

            DateOfBirth: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            age: ['0'],
            ageYear: ['0', [
                Validators.maxLength(3),
                Validators.pattern("^[0-9]*$")]],
            ageMonth: ['0', [Validators.pattern("^[0-9]*$")]],
            ageDay: ['0', [Validators.pattern("^[0-9]*$")]],
            phoneNo: ['', [Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
            this._FormvalidationserviceService.onlyNumberValidator()
            ]],
            mobileNo: ['', [Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
            this._FormvalidationserviceService.onlyNumberValidator()
            ]],
            panCardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            maritalStatusId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]], //changed by raksha
            religionId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            areaId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cityId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            City: [this.CityName],
            stateId: [this.stateId],//, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            countryId: [this.countryId],// [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            IsCharity: false,
            IsSeniorCitizen: false,
            AddedBy: [this.accountService.currentUserValue.userId, this._FormvalidationserviceService.onlyNumberValidator()],
            // updatedBy: [this.accountService.currentUserValue.userId, this._FormvalidationserviceService.onlyNumberValidator()],
            RegDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
            RegTime: [this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'), Validators.required],
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

            unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],

            photo: "",
            doctorId: 0,
            ServiceId: 0,
            patientType: 0,
            patientTypeId: 1,
            // companyId:0,
            refDocId: 0,
            Comments: '',
            emailId: ['', [Validators.email]],
            PhoneNo: '',
            IsPathRad: 0,
            membershipId: 0,
            isMember: false,
            abhaTranId: 0,

        })
    }

    createVisitdetailForm() {
        return this._formbuilder.group({

            regId: [this.RegId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            visitDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            visitTime: [(new Date()).toISOString()],


            PatientTypeId: [1, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            UnitId: [this.accountService.currentUserValue.user.unitId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            ConsultantDocId: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            RefDocId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            TariffId: [1, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            SubCompanyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            addedBy: [this.accountService.currentUserValue.userId, this._FormvalidationserviceService.onlyNumberValidator()],
            updatedBy: [this.accountService.currentUserValue.userId, this._FormvalidationserviceService.onlyNumberValidator()],
            isCancelledBy: 0,
            isCancelled: false,
            isCancelledDate: ['1900-01-01'],
            ClassId: [1, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            DepartmentId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            patientOldNew: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
            firstFollowupVisit: 0,
            AppPurposeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            campId: [0],
            followupDate: [(new Date()).toISOString()],
            crossConsulFlag: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            phoneAppId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            crossConsultantDrId: 0,
            visitId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            // policyNumber: [0],
            // policyLimit: [0],
            // policyValidateDate: [(new Date()).toISOString()],
            patientTypeId: 1
        });
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
            UPINO: '',
            discountAmt: 0
        })
    }
    createTotalChargeForm(): FormGroup {
        return this._formbuilder.group({
            //bill header  
            billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opdIpdId: [this.vOPIPId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            regNo: ["0", [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            patientName: [this.PatientName, [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            ipdno: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
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
            concessionPercentage: [item?.DiscPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
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

    selectedTabIndex = 0;
    onTabChange(event: MatTabChangeEvent) {
        this.selectedTabIndex = event.index;
    }

    getSelectedserviceObj(obj) {

        // console.log(obj)
        this.SrvcName1 = obj.serviceName;
        this.serviceId = obj.serviceId;
        this.vQty = 1;
        this.IsPathology = obj.isPathology;
        this.IsRadiology = obj.isRadiology;
        this.vIsPackage = obj.isPackage;
        this.serviceSelct = true
        if (obj?.isEditable == true) {
            this.chkIsEditable = false; //price should not get edit
        } else {
            this.chkIsEditable = true; //price should get edit
        }
        this.onSaveEntry(obj);

        // ✅ Clear Service Name
        this.myForm.get('ServiceId')?.reset();

        // ✅ Focus back to input (wait for DOM update)
        // setTimeout(() => {
        //   this.serviceInput?.nativeElement.focus();
        // });
    }

    vPhoneAppId: any = 0;


    onSaveEntry(row) {
        debugger
        const doctorid = 0;
        const formValue = this.myForm.value

        const isDuplicate = this.dstable1.data.some(item => item.ServiceId === row.serviceId);
        if (!isDuplicate) {
            this.onAddCharges(row)
        }
        else {
            this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
    }

    updateCalculation(source: 'PER' | 'LIST' = 'LIST') {
        // 
        const totalAmt = this.chargeList.reduce(
            (sum, item) => sum + (Number(item.Price) || 0),
            0
        );

        let discountAmt = Number(this.OPFooterForm.get('discountAmt')?.value) || 0;
        const discountPer = Number(this.OPFooterForm.get('totalDiscountPer')?.value) || 0;

        if (source === 'PER') {
            // Discount % entered
            discountAmt = totalAmt > 0
                ? +(totalAmt * discountPer / 100).toFixed(2)
                : 0;

            this.Consessionres = discountPer > 0;
        }

        // if (source === 'AMT') {
        //   // Discount Amount entered
        //   discountPer = totalAmt > 0
        //     ? +(discountAmt * 100 / totalAmt).toFixed(2)
        //     : 0;
        // }

        const netAmt = totalAmt - discountAmt;

        this.OPFooterForm.patchValue({
            totalAmt: totalAmt,
            discountAmt: discountAmt,
            totalDiscountPer: discountPer,
            netPayableAmt: Math.round(netAmt)
        }, { emitEvent: false });
    }



    updateFromDiscountAmt() {
        const total = this.chargeList.reduce(
            (sum, item) => sum + (parseFloat(item.Price.toString()) || 0),
            0
        );

        const discountAmt = Number(this.OPFooterForm.get('discountAmt')?.value) || 0;

        this.Consessionres = discountAmt > 0;

        const discPer = total > 0 ? (discountAmt * 100) / total : 0;
        const netAmt = Math.round(total - discountAmt);

        this.OPFooterForm.patchValue({
            totalAmt: total,
            totalDiscountPer: discPer,
            netPayableAmt: netAmt
        }, { emitEvent: false });
    }

    total = 0
    urgentStatus: boolean = false;
    onUrgentToggleChange(event: any, contact: any) {
        this.urgentStatus = event.checked;
        // optionally do recalculation or other logic
        console.log(contact);
    }
    onDiscountPerChange(row: ChargesList): void {

        if (!row) return;

        if (row.DiscPer == null) {
            row.DiscPer = 0;
        }

        let discountPer = +row.DiscPer || 0;
        const totalAmount = (+row.Price || 0) * (+row.Qty || 0);

        if (discountPer < 0 || discountPer > 100) {
            discountPer = 0; // Reset if out of range
            row.DiscPer = 0;
            this.toastr.error("Enter discount % between 0-100");
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
            this.toastr.error("Discount must be between 0 and the total amount.");
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
        this.updateCalculation();
    }

    getCellCalculation(element) {
        // 
        const price = Number(element.Price) || 0;

        // row-level calculation ONLY
        element.TotalAmt = price;
        element.DiscPer = element.DiscPer || 0;
        element.DiscAmt = +(price * element.DiscPer / 100).toFixed(2);
        element.NetAmount = price - element.DiscAmt;

        // update footer separately
        this.updateFooterTotals();
    }
    updateFooterTotals() {

        const totalAmt = this.dstable1.data.reduce(
            (sum, item) => sum + (Number(item.TotalAmt) || 0),
            0
        );

        const discountAmt = this.dstable1.data.reduce(
            (sum, item) => sum + (Number(item.DiscAmt) || 0),
            0
        );

        const netAmt = this.dstable1.data.reduce(
            (sum, item) => sum + (Number(item.NetAmount) || 0),
            0
        );

        // const discPer = totalAmt > 0
        //   ? +(discountAmt * 100 / totalAmt).toFixed(2)
        //   : 0;

        this.OPFooterForm.patchValue({
            totalAmt: totalAmt,
            discountAmt: discountAmt,
            // totalDiscountPer: discPer,
            netPayableAmt: Math.round(netAmt)
        }, { emitEvent: false });
    }

    showDoctorDropdown(row: any): boolean {
        return row && row.creditedtoDoctor === true;
    }

    isRowDiscountApplied = false;
    Doctorflag = false
    onAddCharges(row): void {
        debugger
        const isPackage = (row.isPackage ?? row.IsPackage) == 1;

        if (row.isPathology !== undefined || row.IsPathology !== undefined) {
            this.IsPathology = row.isPathology ?? row.IsPathology;
            this.IsRadiology = row.isRadiology ?? row.IsRadiology;
        }


        if (row.creditedtoDoctor)
            row.Doctorflag = true
        else
            row.Doctorflag = false

        const formValue = this.myForm.value;
        // var totalAmount;
        // if (row.PackageId == 0 || row.PackageId > 0) {
        //   totalAmount = row.NetAmount * 1;
        // } else {
        //   totalAmount = row.price * 1;
        // }
        const totalAmount = row.price * 1;
        // 

        // const discountAmount = formValue.discountAmt;//(totalAmount * formValue.discountPer) / 100;
        // const netAmount = totalAmount - discountAmount;

        let discountAmount = 0;
        let discountPer = 0;

        // 🔐 Apply discount ONLY if this row itself has discount (prev data)
        if (row.DiscAmt > 0 || row.DiscPer > 0) {
            discountAmount = row.DiscAmt || 0;
            discountPer = row.DiscPer || 0;
        }

        const netAmount = totalAmount - discountAmount;

        //  === true


        const newRow = {
            ServiceId: row.serviceId,
            ServiceName: row.serviceName,
            Price: row.price ?? 0,
            Qty: 1,
            TotalAmt: totalAmount || 0,
            // DiscPer: row.DiscPer ?? 0,
            // DiscAmt: row.DiscAmt ?? 0,
            DiscPer: discountPer,
            DiscAmt: discountAmount,
            // DiscAmt: discountAmount || row.DiscAmt,
            NetAmount: netAmount || 0,
            ClassName: 1,//this.className || '-',
            creditedtoDoctor: row.creditedtoDoctor,
            DoctorId: row.Doctorflag ? (this.VisitFormGroup.get('ConsultantDocId')?.value || row?.DoctorId) ?? 0 : 0,
            DoctorName: row.Doctorflag ? this.doctorName ?? '' : '',
            ChargesAddedName: this.accountService.currentUserValue.userName,
            IsPathology: row.isPathology == 1 ? true : false,
            IsRadiology: row.isRadiology == 1 ? true : false,
            IsPackage: row.isPackage,
            serviceCode: 0,//formValue.serviceName.companyCode, 
            isInclusionExclusion: true,//formValue.serviceName.isInclusionOrExclusion
            Doctorflag: row.Doctorflag,// == true ? true : false,// row.creditedtoDoctor ? true : false
            // EditDoctor: row.Doctorflag

        };
        if (!this.isDiscountApplied && discountAmount > 0) {
            this.isDiscountApplied = true;
            this.Consessionres = true
        }

        const newCharge = new ChargesList(newRow);
        newCharge.DiscAmt = newCharge.DiscAmt || 0;
        newCharge.DiscPer = newCharge.DiscPer || 0;
        this.chargeList.push(newCharge);
        this.dstable1.data = this.chargeList;

        // 🔁 Auto-switch tab based on package
        if ((row.isPackage ?? row.IsPackage) == 1) {
            this.selectedTabIndex = 1; // Package List tab
        } else {
            this.selectedTabIndex = 0; // Charges List tab
        }

        this.updateCalculation(row);


        if (row.PackageId == undefined) {
            this.getRtevPackageDetList(row)
        }
    }

    addCopyToPackageTable(row) {
        // prevent duplicates
        if (this.PacakgeList.some(p => p.PackageServiceId === (row.ServiceId ?? row.serviceId))) {
            return;
        }

        this.PacakgeList.push({
            serviceId: row.packageServiceId ?? row.serviceId,
            serviceName: row.serviceName,
            price: row.price || 0,
            Qty: 1,
            TotalAmt: (row.price * 1) || 0,
            ConcessionPercentage: 0,
            DiscAmt: 0,
            NetAmount: (row.price * 1) || 0,
            packageId: row.PackageId ?? row.packageId,
            PackageServiceId: row.ServiceId ?? row.serviceId,
            doctorId: row.DoctorId ?? 0,
            doctorName: row.DoctorName ?? '',
            isPathology: row.isPathology,
            isRadiology: row.isRadiology,
            pacakgeServiceName: row.pacakgeServiceName,
        });

        this.dsPackageList.data = [...this.PacakgeList];
    }


    getRtevPackageDetList(obj) {
        const vdata =
        {
            "first": 0,
            "rows": 10,
            "sortField": "ServiceId",
            "sortOrder": 0,
            "filters": [{ "fieldName": "ServiceId", "fieldValue": String(obj.serviceId), "opType": "Equals" }],
            "exportType": "JSON",
            "columns": []
        }
        //console.log(vdata)
        this._AppointmentlistService.getRtevPackageDetList(vdata).subscribe(data => {
            // 
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


    servicedoctorname: any;
    serivcedoctorId: any;
    deleteTableRow(element) {
        this.chargeslist = this.dstable1.data;
        const index = this.chargeslist.indexOf(element);
        if (index >= 0) {

            // Package remove logic
            if (element.IsPackage == '1' && element.ServiceId) {
                this.PacakgeList = this.PacakgeList.filter(item => item.PackageServiceId != element.ServiceId);
                this.dsPackageList.data = this.PacakgeList;
            }

            this.chargeslist.splice(index, 1);
            this.dstable1.data = [];
            this.dstable1.data = this.chargeslist;

            if (this.chargeslist.length === 0) {
                this.myForm.patchValue({
                    totalAmt: 0,
                    totalDiscountPer: 0,
                    discountAmt: 0,
                    netPayableAmt: 0
                });
                this.isDiscountApplied = false;
            } else {
                this.updateCalculation();
            }
            this.servicedoctorname = ''
            this.serivcedoctorId = 0
        }
        this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
            toastClass: 'tostr-tost custom-toast-success',
        });
    }
    vRefDocId = 0
    vRefDocName = ''
    onChangeRefdoc(value) {
        this.vRefDocId = value.doctorId
        this.vRefDocName = value.doctorName
        this.myForm.get('refDocId').setValue(value.doctorId);
    }

    onChangeCondoc(value) {
        console.log(value)

        this.doctorId = value.value
        this.doctorName1 = value.text
        console.log(this.doctorName1)
        this.getDocServicelist(value.value)

    }

    prefixName: any;
    onChangePrefix(e) {
        this.prefixName = e.prefixName
        this.ddlGender.SetSelection(e.sexId);
    }

    // onChangecity(e) {
    //   this.CityName = e.cityName
    //   this.registerObj.stateId = e.stateId

    //   this._AppointmentlistService.getstateId(e.stateId).subscribe((Response) => {
    //     this.ddlState.SetSelection(Response.stateId)
    //     this.ddlCountry.SetSelection(Response.countryId);
    //   });
    // }
    stateId = 0
    countryId = 0
    onChangecity(e) {

        this.CityName = e.cityName
        this.registerObj.stateId = e.stateId
        this.stateId = e.stateId
        this._AppointmentlistService.getstateId(e.stateId).subscribe((Response) => {
            // console.log(Response)
            // this.ddlCountry.SetSelection(Response.countryId);
            this.countryId = Response.countryId
            console.log(Response.countryId)
        });
    }


    getSelectedTariffObj(event) {

        this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + event.value + "&ClassId=" + this.classId + "&ServiceName="
        this.tariffId = event.value
    }

    departmentId = 0
    selectChangedepartment(obj: any) {
        // console.log(obj)
        this.departmentId = obj.value
        this.departmentname = obj.text

        if (obj.value) {
            this._AppointmentlistService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
                // console.log(data)
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
                            this.getDocServicelist(matchedDoctor.value)
                        }
                    }
                }, 300);
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
        const inp = String.fromCharCode(event.keyCode);
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
            text: 'Are you sure you want to save this OP Bill?',
            icon: 'warning', // or 'question'
            showCancelButton: true,
            confirmButtonColor: '#3085d6', // Blue
            cancelButtonColor: '#d33',     // Red
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(this.myForm.value)

                if (!this.dstable1.data || this.dstable1.data.length === 0) {
                    this.toastr.warning('Please Add Service', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    return;
                }

                const priceflag = this.dstable1.data.filter(row => row.Price == 0 || row.Price == '');

                if (priceflag.length) {
                    this.toastr.warning('Please Enter Price For Service', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    return;
                }


                const docflag = this.dstable1.data.filter(row => row.Doctorflag == true && row.DoctorId == 0);

                if (docflag.length) {
                    this.toastr.warning('Please Select Doctor For Service', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    return;
                }
                // this.OPFooterForm.get('concessionAmt').value > 0 &&

                if (this.Consessionres) {
                    if (!this.OPFooterForm.get('concessionReasonId').value) {
                        this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
                            toastClass: 'tostr-tost custom-toast-warning',
                        });
                        return;
                    }
                }

                this.myForm.get('firstName').setValue(this.myForm.get('firstName').value)
                this.myForm.get('City').setValue(this.CityName)
                this.myForm.get('stateId').setValue(this.stateId)
                this.myForm.get('countryId').setValue(String(this.countryId))
                if (!this.myForm.invalid)
                    this.OnSave();

                else {
                    const invalidFields = [];
                    if (this.myForm.invalid) {
                        for (const controlName in this.myForm.controls) {
                            const control = this.myForm.get(controlName);

                            if (control instanceof FormGroup || control instanceof FormArray) {
                                for (const nestedKey in control.controls) {
                                    if (control.get(nestedKey)?.invalid) {
                                        invalidFields.push(`OP Bill Data : ${controlName}.${nestedKey}`);
                                    }
                                }
                            } else if (control?.invalid) {
                                invalidFields.push(`OP Bill From: ${controlName}`);
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
        // }
    }
    OnSave() {


        const formattedDate = this.datePipe.transform(this.VisitFormGroup.get('visitDate').value, "yyyy-MM-dd");
        const formattedTime = this.datePipe.transform(new Date(), "HH:mm:ss");
        this.VisitFormGroup.get('visitDate').setValue(formattedDate);
        this.VisitFormGroup.get('visitTime').setValue(formattedDate + ' ' + formattedTime);


        console.log(this.myForm.getRawValue())
        const DateOfBirth1 = this.myForm.get('DateOfBirth')?.value;
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

            this.myForm.get('age')?.setValue(String(ageYear), { emitEvent: false });

            this.myForm.get('ageYear')?.setValue(String(ageYear), { emitEvent: false });
            this.myForm.get('ageMonth')?.setValue(String(ageMonth), { emitEvent: false });
            this.myForm.get('ageDay')?.setValue(String(ageDay), { emitEvent: false });

        }

        // if (this.PatientName){
        this.PatientName = this.myForm.get('firstName').value + " " + this.myForm.get('lastName').value
        // }

        // Bill data
        const formattedDate1 = this.datePipe.transform(this.OpBillForm.get('billDate').value, "yyyy-MM-dd");
        const formattedTime1 = this.datePipe.transform(new Date(), "HH:mm:ss");

        this.OpBillForm.get('billDate').setValue(formattedDate1);
        this.OpBillForm.get('billTime').setValue(formattedDate1 + ' ' + formattedTime1);
        this.OpBillForm.get('opdIpdId')?.setValue(0)
        this.OpBillForm.get('tariffId')?.setValue(this.vTariffId)
        this.OpBillForm.get('regNo')?.setValue(this.regNo)
        // this.OpBillForm.get('ipdno')?.setValue(this.opdNo)
        this.OpBillForm.get('ageYear')?.setValue(Number(this.ageYear) || 0)
        this.OpBillForm.get('ageMonth')?.setValue(Number(this.ageMonth) || 0)
        this.OpBillForm.get('ageDays')?.setValue(Number(this.ageDays) || 0)
        this.OpBillForm.get('doctorId')?.setValue(this.VisitFormGroup.get('ConsultantDocId').value || 0)
        debugger
        this.OpBillForm.get('doctorName')?.setValue(this.doctorName1 || '')
        this.OpBillForm.get('patientType')?.setValue(this.companyId ? true : false)
        this.OpBillForm.get('companyName')?.setValue(this.companyName || '')
        this.OpBillForm.get('companyAmt')?.setValue(0)
        this.OpBillForm.get('patientAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
        this.OpBillForm.get('totalAmt')?.setValue(this.OPFooterForm.get('totalAmt')?.value)
        this.OpBillForm.get('concessionAmt')?.setValue(this.OPFooterForm.get('discountAmt')?.value || 0)
        this.OpBillForm.get('netPayableAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
        this.OpBillForm.get('concessionReasonId')?.setValue(this.ConcessionId)
        this.OpBillForm.get('discComments')?.setValue(this.ConcessionReason)
        this.OpBillForm.get('patientName')?.setValue(this.PatientName)
        this.OpBillForm.get('cashCounterId')?.setValue(this.searchFormGroup.get('CashCounterID')?.value)

        const formValue = { ...this.myForm.value };
        const controlsToRemove = ['patientName', 'IsPathRad', 'IsNRI', 'ServiceId', 'totalAmt', 'totalDiscountPer', 'discountAmt', 'netPayableAmt', 'paymentType'];
        controlsToRemove.forEach(key => delete formValue[key]);
        console.log(formValue)
        console.log("form values", this.OpBillForm.value)
        this.myForm.get('RegId').setValue(this.RegId)

        // this.VisitFormGroup.get('ConsultantDocId').setValue(this.myForm.get('doctorId').value || 0)
        this.AppointmentBillfinalform.get("appRegistrationBills").setValue(formValue)
        this.AppointmentBillfinalform.get("visit").setValue(this.VisitFormGroup.value)


        console.log("form values", this.AppointmentBillfinalform.value)
        // form vali??

        if (!this.myForm.invalid && !this.VisitFormGroup.invalid) {

            if (this.isCompanySelected && this.VisitFormGroup.get('companyId').value == 0) {
                this.toastr.warning('Please select valid Company ', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }

            if (this.searchFormGroup.get('regRadio').value == "registration") {

                //
                // if (this.OpBillForm.invalid) {

                this.VisitFormGroup.get("patientOldNew").setValue(1)
                this.ChargeddetailsArray.clear();
                this.BillDetailsArray.clear();

                this.dstable1.data.forEach(item => {
                    this.ChargeddetailsArray.push(this.CreateAddchargeform(item as ChargesList));
                    this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));

                });

                console.log("form values", this.OpBillForm.value)

                if (this.OPFooterForm.get('paymentType').value == 'PayOption') {
                    const PatientHeaderObj = {};
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
                                console.log(response)
                                if (response) {
                                    if (this.IsCasepaperBillPrint)
                                        this.OnViewReportPdf(response.opdIpdId);
                                    else
                                        this.viewgetOPBillReportPdf(response.billNo)

                                    this.closeAllOrNavigateBack();
                                    this.savebtn = true
                                }

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
                        if (response) {
                            debugger
                            if (this.IsCasepaperBillPrint)
                                this.OnViewReportPdf(response.opdIpdId);
                            else
                                this.viewgetOPBillReportPdf(response.billNo)

                            this.closeAllOrNavigateBack();
                            this.savebtn = true
                        }
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
                } else if (this.OPFooterForm.get('paymentType').value == 'onlinepay') {


                    if (this.OPFooterForm.get('UPINO').value == 0) {
                        this.toastr.warning('Please select UPINO ', 'Warning !', {
                            toastClass: 'tostr-tost custom-toast-warning',
                        });
                        return;
                    }



                    this.OpBillForm.get('balanceAmt').setValue(0)
                    this.OpBillForm.get('paidAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
                    this.OpBillForm.get('payments.payTmamount')?.setValue(Number(this.OPFooterForm.get('netPayableAmt')?.value))
                    this.OpBillForm.get('payments.paymentDate')?.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
                    this.OpBillForm.get('payments.paymentTime')?.setValue(new Date(), 'HH:mm:ss')
                    this.OpBillForm.get('payments.payTmtranNo')?.setValue(this.OPFooterForm.get('UPINO')?.value || 0)
                    this.OpBillForm.get('payments.payTmdate')?.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
                    this.OpBillForm.get('payments.companyId')?.setValue(this.companyId || 0)

                    console.log(this.OpBillForm.value)
                    this.AppointmentBillfinalform.get('appOPBillIngModels').setValue(this.OpBillForm.value)
                    console.log(this.AppointmentBillfinalform.value)
                    this._AppointmentlistService.InsertAppointmentBilling(this.AppointmentBillfinalform.value).subscribe(response => {
                        if (response)
                            this.viewgetOPBillReportPdf(response.billNo)
                        this.closeAllOrNavigateBack();
                        this.savebtn = true

                    });
                }
                // }
                // else {
                //   let invalidFields = [];
                //   if (this.OpBillForm.invalid) {
                //     for (const controlName in this.OpBillForm.controls) {
                //       const control = this.OpBillForm.get(controlName);

                //       if (control instanceof FormGroup || control instanceof FormArray) {
                //         for (const nestedKey in control.controls) {
                //           if (control.get(nestedKey)?.invalid) {
                //             invalidFields.push(`OP Bill Data : ${controlName}.${nestedKey}`);
                //           }
                //         }
                //       } else if (control?.invalid) {
                //         invalidFields.push(`OpBill From: ${controlName}`);
                //       }
                //     }
                //   }
                //   if (invalidFields.length > 0) {
                //     invalidFields.forEach(field => {
                //       this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                //       );
                //     });
                //     return
                //   }
                // }
            }
            // Reg Patient
            else if (this.searchFormGroup.get('regRadio').value == "registrered") {
                debugger
                this.VisitFormGroup.get("patientOldNew").setValue(2)
                this.VisitFormGroup.get('regId').setValue(this.RegId)
                // Map RegId to formValue
                formValue.RegId = this.RegId;
                this.RegiAppointmentBillfinalform.get('appRegistrationBills').setValue(formValue)

                this.ChargeddetailsArray.clear();
                this.BillDetailsArray.clear();

                this.dstable1.data.forEach(item => {
                    this.ChargeddetailsArray.push(this.CreateAddchargeform(item as ChargesList));
                    this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));
                });
                console.log("form values", this.OpBillForm.value)

                if (this.OPFooterForm.get('paymentType').value == 'PayOption') {
                    const PatientHeaderObj = {};
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
                                if (response)
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


                    // const formValue = { ...this.RegiAppointmentBillfinalform.value };
                    // delete formValue['appRegistrationBills']
                    console.log(this.RegiAppointmentBillfinalform.value)
                    //  console.log(formValue)
                    this._AppointmentlistService.RegistredAppointmentBilling(this.RegiAppointmentBillfinalform.value).subscribe(response => {
                        console.log(response)
                        if (response)
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
                } else if (this.OPFooterForm.get('paymentType').value == 'onlinepay') {


                    if (this.OPFooterForm.get('UPINO').value == 0) {
                        this.toastr.warning('Please select UPINO ', 'Warning !', {
                            toastClass: 'tostr-tost custom-toast-warning',
                        });
                        return;
                    }

                    const ModePaymentObj = [];
                    ModePaymentObj.push({
                        paymentDate: formattedDate,
                        paymentTime: formattedTime,
                        payAmount: this.OPFooterForm.get('netPayableAmt')?.value ?? 0,
                        tranNo: this.OPFooterForm.get('UpiNo')?.value || 0,
                        bankName: "",
                        validationDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
                        comments: "",
                        payMode: "UPI",
                        onlineTranNo: "0",
                        onlineTranResponse: "0",
                        companyId: this.companyId ?? 0,
                        cashCounterId: this.searchForm.get('CashCounterID')?.value || 0,
                        transactionType: 0,
                        isSelfOrcompany: this.companyId ? 1 : 0,
                    });

                    this.OpBillForm.get('balanceAmt').setValue(0)
                    this.OpBillForm.get('paidAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
                    this.OpBillForm.get('payments.payTmamount')?.setValue(Number(this.OPFooterForm.get('netPayableAmt')?.value))
                    this.OpBillForm.get('payments.paymentDate')?.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
                    this.OpBillForm.get('payments.paymentTime')?.setValue(new Date(), 'HH:mm:ss')
                    this.OpBillForm.get('payments.payTmtranNo')?.setValue(this.OPFooterForm.get('UPINO')?.value || 0)
                    this.OpBillForm.get('payments.payTmdate')?.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
                    this.OpBillForm.get('payments.companyId')?.setValue(this.companyId || 0)

                    // this.ModeOfPaymentsArray.clear();
                    // ModePaymentObj.forEach(item => {
                    //     this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
                    // });

                    this.RegiAppointmentBillfinalform.get('appOPBillIngModels').setValue(this.OpBillForm.value)
                    this.RegiAppointmentBillfinalform.get("visit").setValue(this.VisitFormGroup.value)

                    console.log(this.RegiAppointmentBillfinalform.value)

                    this._AppointmentlistService.RegistredAppointmentBilling(this.RegiAppointmentBillfinalform.value).subscribe(response => {
                        console.log(response)
                        if (response)
                            this.viewgetOPBillReportPdf(response.billNo)
                        this.closeAllOrNavigateBack();
                        this.savebtn = true

                    });
                }
                // }
                // else {
                //   let invalidFields = [];
                //   if (this.OpBillForm.invalid) {
                //     for (const controlName in this.OpBillForm.controls) {
                //       const control = this.OpBillForm.get(controlName);

                //       if (control instanceof FormGroup || control instanceof FormArray) {
                //         for (const nestedKey in control.controls) {
                //           if (control.get(nestedKey)?.invalid) {
                //             invalidFields.push(`OP Bill Data : ${controlName}.${nestedKey}`);
                //           }
                //         }
                //       } else if (control?.invalid) {
                //         invalidFields.push(`OpBill From: ${controlName}`);
                //       }
                //     }
                //   }
                //   if (invalidFields.length > 0) {
                //     invalidFields.forEach(field => {
                //       this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                //       );
                //     });
                //     return
                //   }
                // }
            }


            //form valid
        } else {
            const invalidFields = [];
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


    OnViewReportPdf(element) {

        this.commonService.Onprint("VisitId", element, "AppointmentReceipt");
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

    calculateTotalAmount(): void {

        const totalSum = this.chargeList.reduce((sum, charge) => sum + (+charge.TotalAmt), 0);
        const totalDiscount = this.chargeList.reduce((sum, charge) => sum + (+charge.DiscAmt), 0);
        const totalDiscountPer = this.chargeList.reduce((sum, charge) => sum + (+charge.DiscPer), 0);
        const totalNet = totalSum - totalDiscount;

        this.OPFooterForm.patchValue({
            totalAmt: totalSum,
            totalDiscountPer: Math.round(totalDiscountPer),
            discountAmt: Math.round(totalDiscount),
            netPayableAmt: Math.round(totalNet)
        }, { emitEvent: false });
        if (!this.isDiscountApplied && totalDiscount > 0) {
            this.isDiscountApplied = true;
            this.Consessionres = true
        }

        this.Consessionres = this.chargeList.some(
            charge => (+charge.DiscAmt || 0) > 0
        );
        this.isDiscountApplied = this.Consessionres;
    }

    calculateTotalCharge(row: any = null): void {

        const qty = +this.chargeForm.get("qty").value;
        const price = +this.chargeForm.get("price").value;
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
            this.toastr.error("Enter discount % between 0-100");
            return;
        }
        const percentage = perControl.value;
        const totalAmount = this.chargeForm.get("totalAmount").value;

        // let discountAmount = this.getFixedDecimal(totalAmount * percentage / 100);
        // let netAmount = this.getFixedDecimal(totalAmount - discountAmount);
        const discountAmount = parseFloat((totalAmount * percentage / 100).toFixed(2));
        const netAmount = parseFloat((totalAmount - discountAmount).toFixed(2));

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

        const discountAmount = this.chargeForm.get("discountAmount").value;
        const totalAmount = this.chargeForm.get("totalAmount").value;

        if (discountAmount < 0 || discountAmount > totalAmount) {
            this.chargeForm.get("discountAmount").setValue(0);
            this.chargeForm.get("discountPer").setValue(0);
            this.isUpdating = false;
            this.toastr.error("Discount must be between 0 and the total amount.");
            return;
        }
        // let percent = this.getFixedDecimal(totalAmount ? (discountAmount / totalAmount) * 100 : 0);
        // let netAmount = this.getFixedDecimal(totalAmount - discountAmount);

        const percent = Number(totalAmount ? ((discountAmount / totalAmount) * 100).toFixed(2) : "0.00");
        const netAmount = Number((totalAmount - discountAmount).toFixed(2));
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
        const Data = {
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
        debugger
        if (this.IsOPCasePaperPrtWithoutPreviewID) {
            this.commonService.OnprintDirect("BillNo", element, "OpBillReceipt", true);
        } else {
            this.commonService.OnprintDirect("BillNo", element, "OpBillReceipt", false);
        }
    }
    Patientnewold: any = 1;
    resetFilteredOptions() {
        this.filteredOptions = [];
        this.prevResults = [];
    }
    opbillServiceform: FormGroup;
    createBillForm() {
        this.opbillServiceform = this._formbuilder.group({
            EditDoctor: [''],

        });
    }

    keyPressCharater(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/^\d*\.?\d*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    DoctorisableEditing(row: ChargesList) {
        row.EditDoctor = false;
        this.opbillServiceform.get('EditDoctor').setValue('')
        // this.getChargesList()
    }

    DocenableEditing(row: ChargesList) {
        if (row.creditedtoDoctor == false) {
            this.toastr.warning('Doctor option unavailable for the selected service!', 'warning', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return
        }
        row.EditDoctor = true;
        row.doctorName = '';
    }


    SelectedDocName: any = [];
    DropDownValue(element, Obj) {
        element.DoctorId = Obj.value
        element.DoctorName = Obj.text

        element.EditDoctor = false;
        console.log(Obj)
    }
    private destroy$ = new Subject<void>();
    ////////////////////////// dd new method start ////////////////////
    getdocdetail(event: MatSelectChange, row: any): void {

        const option = this.doctorOptions.find(
            opt => (opt.value ?? opt.Value) === event.value
        );

        if (!option) return;

        row.DoctorId = option.value ?? option.Value | this.doctorId;
        row.DoctorName = option.text ?? option.Text | this.doctorName;

        this.dstable1.data = [...this.dstable1.data];
    }

    private loadDropdownOptions(): void {
        this.fetchDropdownOptions(this.autocompleteModedoctor)
            .pipe(takeUntil(this.destroy$))
            .subscribe(options => {
                this.doctorOptions = options || [];
            });
    }

    private fetchDropdownOptions(mode: string): Observable<any[]> {
        if (!mode) {
            return of([]);
        }
        return this.apiCaller.GetData(`Dropdown/GetBindDropDown?mode=${mode}`);
    }

    VRegId = 0
    getSelectedObj(obj) {
        // 
        debugger
        if (this.data?.FormName == 'Registration-Page') {
            console.log(obj)
            this.PatientName = obj.patientName
            this.RegId = obj.value
            if ((this.RegId ?? 0) > 0) {
                this.VRegId = obj.visitId;
                this.VisitFormGroup.get('regId').setValue(this.RegId)

                setTimeout(() => {
                    this._AppointmentlistService.getRegistraionById(this.RegId).subscribe((response) => {
                        this.registerObj = response;
                        console.log(response)
                        this.value = response.dateofBirth
                        this.vRegNo = response.regno
                        this.RegId = response.regId
                        this.regNo = response.regNo

                        this.CityName = this.registerObj?.city ?? '';
                        this.stateId = this.registerObj?.stateId ?? 0;
                        this.countryId = this.registerObj?.countryId ?? 0;
                        this.pincode = this.registerObj?.pinNo || ''

                        this.onChangeDateofBirth(response.dateofBirth)
                        console.log(response)
                        this.getLastDepartmetnNameList(this.registerObj)
                        this.myForm.patchValue({
                            firstName: this.registerObj.firstName.trim(),
                            middleName: this.registerObj.middleName.trim(),
                            lastName: this.registerObj.lastName.trim(),
                            mobileNo: this.registerObj.mobileNo.trim(),
                            Address: this.registerObj.address.trim(),
                            stateId: this.registerObj.stateId,
                            countryId: this.registerObj.countryId,
                            aadharCardNo: this.registerObj.aadharCardNo ?? '',
                            panCardNo: this.registerObj?.panCardNo ?? '',
                            emailId: this.registerObj?.emailId ?? '',
                            PinNo: this.registerObj?.pinNo ?? '',
                            City: this.registerObj?.city ?? '',
                            PhoneNo: this.registerObj?.phoneNo ?? '',
                            StateId: this.registerObj?.stateId ?? '',
                            CountryId: this.registerObj?.countryId ?? '',
                            maritalStatusId: this.registerObj?.maritalStatusId ?? '',
                            religionId: this.registerObj?.religionId ?? '',
                            areaId: this.registerObj?.areaId ?? '',
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
                            medTourismDateOfEntry: this.registerObj?.medTourismDateOfEntry ?? '',
                            medTourismResidentialAddress: this.registerObj?.medTourismResidentialAddress ?? '',
                            medTourismOfficeWorkAddress: this.registerObj?.medTourismOfficeWorkAddress ?? '',
                            RegDate: this.registerObj?.regDate ?? this.currentDate,
                            RegTime: this.registerObj?.regTime ?? this.currentDate
                        });
                        console.log(this.registerObj)
                    });

                }, 100);
            }

        } else {
            this.PatientName = obj.patientName;
            this.RegId = obj.value;
            // this.VisitFlagDisp = true;
            if ((this.RegId ?? 0) > 0) {
                console.log(obj)
                setTimeout(() => {
                    this.searchFormGroup.get('regRadio')?.setValue('registrered');
                    this.onChangeReg1({ value: 'registrered' });
                    this._AppointmentlistService.getRegistraionById(this.RegId).subscribe((response) => {
                        this.registerObj = response;
                        console.log(response)
                        this.value = response.dateofBirth
                        this.RegId = response.regId
                        this.regNo = response.regNo
                        this.CityName = this.registerObj?.city ?? '';
                        this.stateId = this.registerObj?.stateId ?? 0;
                        this.countryId = this.registerObj?.countryId ?? 0;
                        this.pincode = this.registerObj?.pinNo || ''
                        this.onChangeDateofBirth(response.dateofBirth)
                        this.getLastDepartmetnNameList(this.registerObj)
                        this.myForm.patchValue({
                            firstName: this.registerObj.firstName,
                            middleName: this.registerObj.middleName.trim(),
                            lastName: this.registerObj.lastName,
                            mobileNo: this.registerObj.mobileNo,
                            address: this.registerObj.address.trim(),
                            aadharCardNo: this.registerObj.aadharCardNo ?? '',
                            panCardNo: this.registerObj?.panCardNo ?? '',
                            emailId: this.registerObj?.emailId ?? '',
                            PinNo: this.registerObj?.pinNo ?? '',
                            City: this.registerObj?.city ?? '',
                            PhoneNo: this.registerObj?.phoneNo ?? '',
                            StateId: this.registerObj?.stateId ?? '',
                            CountryId: this.registerObj?.countryId ?? '',
                            MaritalStatusId: this.registerObj?.maritalStatusId ?? '',
                            ReligionId: this.registerObj?.religionId ?? '',
                            AreaId: this.registerObj?.areaId ?? '',
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
                            RegDate: this.registerObj?.regDate ?? this.currentDate,
                            RegTime: this.registerObj?.regTime ?? this.currentDate
                        });

                    });

                }, 100);
            }
        }

        this.onChangeDateofBirth(this.registerObj.dateofBirth)

        // if (this.VRegId) {
        // this.showPrevBtn = true
        // this.getPrevList();
        // }
    }
    showPrevBtn: boolean = false
    PrevregisterObj: any;
    VisitId = 0
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
            if (result) {
                this.PrevregisterObj = result

                if (result.doctorName)
                    this.doctorName1 = result?.doctorName

                this.VisitFormGroup.get("DepartmentId").setValue(this.PrevregisterObj.departmentId)
                this.selectChangedepartment(this.PrevregisterObj)
                this.vOPIPId = this.PrevregisterObj.visitId
                if (this.vOPIPId)
                    this.getPrevBill()
                console.log(this.PrevregisterObj)
            }

        });
    }


    getPrevBill() {
        Swal.fire({
            title: 'Confirm Save',
            text: 'Are you sure you want to Check Previous Bill?',
            icon: 'warning', // or 'question'
            showCancelButton: true,
            confirmButtonColor: '#3085d6', // Blue
            cancelButtonColor: '#d33',     // Red
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                this.getPrevList();
            }
        })
    }
    vDepId = 0;
    vDocId = 0;
    //   changed by raksha date:17/6/25
    getSelectedObjphone1(obj) {
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
        this.RegId = obj.regId;
        this.vPhoneAppId = obj.value;
        this.VisitFormGroup.get("phoneAppId")?.setValue(this.vPhoneAppId);

        this.registerObj = obj;
        this.vDepId = this.registerObj.departmentId
        this.vDocId = this.registerObj.doctorId
        // if ((this.RegId ?? 0) > 0) {
        //     setTimeout(() => {
        //         this.searchFormGroup.get('regRadio')?.setValue('registrered');
        //         this.onChangeReg({ value: 'registrered' });
        //         this._AppointmentlistService.getRegistraionById(this.RegId).subscribe((response) => {
        //             this.registerObj = response;
        //             this.personalFormGroup.patchValue({
        //                 FirstName: this.registerObj.firstName,
        //                 MiddleName: this.registerObj.middleName,
        //                 LastName: this.registerObj.lastName,
        //                 MobileNo: this.registerObj.mobileNo,
        //                 emgContactPersonName: this.registerObj?.emgContactPersonName ?? '',
        //                 emgRelationshipId: this.registerObj?.emgRelationshipId ?? 0,
        //                 emgMobileNo: this.registerObj?.emgMobileNo ?? '',
        //                 emgLandlineNo: this.registerObj?.emgLandlineNo ?? '',
        //                 engAddress: this.registerObj?.engAddress ?? '',
        //                 emgAadharCardNo: this.registerObj?.emgAadharCardNo ?? '',
        //                 emgDrivingLicenceNo: this.registerObj?.emgDrivingLicenceNo ?? '',
        //                 medTourismPassportNo: this.registerObj?.medTourismPassportNo ?? '',
        //                 medTourismVisaIssueDate: this.registerObj?.medTourismVisaIssueDate ?? 0,
        //                 medTourismVisaValidityDate: this.registerObj?.medTourismVisaValidityDate ?? '',
        //                 medTourismNationalityId: this.registerObj?.medTourismNationalityId ?? '',
        //                 medTourismCitizenship: this.registerObj?.medTourismCitizenship ?? 0,
        //                 medTourismPortOfEntry: this.registerObj?.medTourismPortOfEntry ?? '',
        //                 medTourismDateOfEntry: this.registerObj?.medTourismDateOfEntry ?? '',
        //                 medTourismResidentialAddress: this.registerObj?.medTourismResidentialAddress ?? '',
        //                 medTourismOfficeWorkAddress: this.registerObj?.medTourismOfficeWorkAddress ?? '',
        //             })
        //             this.VisitFormGroup.get('DepartmentId').setValue(this.vDepId)
        //             this.selectChangedepartmentForPhone(this.vDepId)
        //         });

        //     }, 100);
        // } 
        // else {
        setTimeout(() => {
            this._AppointmentlistService.getPhoneappById(this.vPhoneAppId).subscribe((response) => {
                this.registerObj = response;
                // console.log(this.registerObj)
                this.registerObj.religionId = 0;
                this.VisitFormGroup.get('DepartmentId').setValue(this.registerObj.departmentId)
                this.selectChangedepartment(this.registerObj) //to set doctorid
                this.myForm.patchValue({
                    firstName: this.registerObj.firstName,
                    middleName: this.registerObj.middleName,
                    lastName: this.registerObj.lastName,
                    mobileNo: this.registerObj.mobileNo.trim()
                });
                this.registerObj.maritalStatusId = 0;
                this.registerObj.areaId = 0
                this.registerObj.regId = 0
                this.registerObj.phoneNo = ''
                this.registerObj.aadharCardNo = ''
                this.registerObj.dateOfBirth = new Date();
                this.registerObj.mobileNo = this.registerObj.mobileNo.trim()
            });
        }, 500);
        // }
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

    onChangeReg(event) {
        if (event.value == 'onlinepay') {
            this.onlineflag = true;
            this.OPFooterForm.get('UPINO').setValidators([Validators.required]);
            this.OPFooterForm.get('UPINO').enable();
        } else {
            this.onlineflag = false;
            this.OPFooterForm.get('UPINO').reset();
            this.OPFooterForm.get('UPINO').clearValidators();
            this.OPFooterForm.get('UPINO').updateValueAndValidity();
        }
    }

    onChangeReg1(event) {

        if (event.value === 'registration') {
            this.myForm.reset();
            this.myForm.get('RegId').reset();
            this.searchFormGroup.get('RegId').disable();
            // this.VisitFormGroup.get('DepartmentId')?.reset();
            // this.VisitFormGroup.get('ConsultantDocId')?.reset();
            this.isRegSearchDisabled = false;
            this.Patientnewold = 1;

            this.Regflag = false;
            this.IsPhoneAppflag = true;

        } else if (event.value === 'registrered') {

            // this.myForm.get('RegId').enable();
            this.searchFormGroup.get('RegId').enable();
            this.searchFormGroup.get('RegId').reset();
            // this.myForm.reset();
            this.Patientnewold = 2;

            this.myForm.markAllAsTouched();
            this.VisitFormGroup.markAllAsTouched();

            this.Regflag = true;
            this.IsPhoneAppflag = false;
            this.isRegSearchDisabled = true;
        }
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

    onChangePatient(value) {

        const mode = "Company"
        if (value.text != "Self") {
            this._AppointmentlistService.getMaster(mode, 1);
            this.VisitFormGroup.get('companyId').setValidators([Validators.required]);
            this.isCompanySelected = true;
            this.patienttype = 2;
        } else if (value.text == "Self") {
            this.isCompanySelected = false;
            this.VisitFormGroup.get('companyId').clearValidators();
            this.VisitFormGroup.get('SubCompanyId').clearValidators();
            this.VisitFormGroup.get('companyId').updateValueAndValidity();
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
            Comments: [],
            ReferByName: [],
            location: [],
            adharCardNo: [],
            MaritalStatusId: [],
            companyId: [],
            PinNo: [],

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


    onClose() {
        this.myForm.reset();
        this.closeOrNavigateBack();
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
    debounceTimers: { [key: string]: any } = {};
    // Manual refresh for waiting state
    manualRefresh(): void {
        this.statusMessage = 'Refreshing...';
        // Add any refresh logic here if needed
        setTimeout(() => {
            this.statusMessage = 'Processing...';
        }, 1000);
    }

    handleInputChange(changedField: string): void {
        // Get all current field values
        const firstName = this.myForm.get('firstName').value?.trim() || '';
        const middleName = this.myForm.get('middleName').value?.trim() || '';
        const lastName = this.myForm.get('lastName').value?.trim() || '';
        const mobileNo = this.myForm.get('mobileNo').value?.trim() || '';

        // If all fields are empty, clear everything
        if (!firstName && !lastName && !mobileNo) {
            this.resetFilteredOptions();
            return;
        }

        // Count how many fields are filled
        const filledFields = [firstName, mobileNo].filter(Boolean).length;

        // If only one field is filled, and it's FirstName or MobileNo, call API
        if (filledFields === 1 && (changedField === 'FirstName' || changedField === 'MobileNo')) {
            const keyword = firstName || mobileNo;
            this._AppointmentlistService.getSuggestions("OutPatient/auto-complete?Keyword=", keyword).subscribe(results => {
                this.prevResults = results || [];
                this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo, middleName });
            });
            return;
        }

        // If only one field is filled, and it's LastName, just filter prevResults (do not call API)
        if (filledFields === 1 && changedField === 'LastName') {
            this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo, middleName });
            return;
        }

        // If only one field is filled, and it's MiddleName, just filter prevResults (do not call API)
        if (filledFields === 1 && changedField === 'MiddleName') {
            this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo, middleName });
            return;
        }

        // If more than one field is filled, filter from prevResults
        if (this.prevResults.length > 0) {
            this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo, middleName });
        } else if (changedField === 'FirstName' || changedField === 'MobileNo') {
            // Fallback: if prevResults is empty, call API with the changed field (if allowed)
            const keyword = firstName || mobileNo;// this.myForm.get(changedField).value?.trim();
            if (keyword) {
                this._AppointmentlistService.getSuggestions("OutPatient/auto-complete?Keyword=", keyword).subscribe(results => {
                    this.prevResults = results || [];
                    this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo, middleName });
                });
            }
        } else {
            // If changedField is LastName and prevResults is empty, do nothing
            this.filteredOptions = [];
        }
    }

    // Helper function to filter results by all non-empty fields
    filterResults(results: any[], fields: { firstName: string, lastName: string, mobileNo: string, middleName: string }) {
        const { firstName, lastName, mobileNo, middleName } = fields;
        return results.filter(item => {
            return (!firstName || item.patientName?.toLowerCase().includes(firstName.toLowerCase()))
                && (!lastName || item.patientName?.toLowerCase().includes(lastName.toLowerCase()))
                && (!middleName || item.patientName?.toLowerCase().includes(middleName.toLowerCase()))
                && (!mobileNo || item.mobileNo?.startsWith(mobileNo));
        });
    }
    onSelectPatient(row: any) {
        this.getSelectedObj(row);
        this.resetFilteredOptions();
    }
    handleInputChangeDebounced(changedField: string): void {

        // Clear any existing timer for this field
        if (this.debounceTimers[changedField]) {
            clearTimeout(this.debounceTimers[changedField]);
        }
        // Set a new timer
        this.debounceTimers[changedField] = setTimeout(() => {
            this.handleInputChange(changedField);
        }, 300); // 300ms debounce
    }

    rawDate1: Date | string = '1900-01-01';
    rawDate2: Date | string = '1900-01-01';
    rawDate3: Date | string = '1900-01-01';

    onVisaDateChange(event: MatDatepickerInputEvent<Date>) {
        console.log('Visa date selected:', event.value);
        this.rawDate1 = event.value || '1900-01-01';
    }

    onValidityDateChange(event: MatDatepickerInputEvent<Date>) {
        console.log('Validity date selected:', event.value);
        this.rawDate2 = event.value || '1900-01-01';
        if (this.rawDate1 instanceof Date && this.rawDate2 instanceof Date && this.rawDate1 > this.rawDate2) {
            this.toastr.warning('Visa Issue Date cannot be greater than Visa Validity Date.', 'Warning!', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            this.myForm.get('medTourismVisaValidityDate')?.setValue('');
            return;
        }
    }

    onEntryDateChange(event: MatDatepickerInputEvent<Date>) {
        console.log('Entry date selected:', event.value);
        this.rawDate3 = event.value || '1900-01-01';
    }

    getPrevList() {

        const dialogRef = this._matDialog.open(PrevlabHistoryComponent,
            {
                maxWidth: "80vw",
                height: '80%',
                width: '100%',
                data: this.vOPIPId
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('Prev List:', result);
            if (!result || result.length === 0) {
                return;
            }

            let hasPrevDiscount = false;
            if (Array.isArray(result)) {
                result.forEach(item => {
                    item.serviceId = item.serviceId || item.ServiceId;
                    item.serviceName = item.serviceName || item.ServiceName;
                    item.price = item.price || item.Price;
                    item.isPathology = item.isPathology ?? item.IsPathology;
                    item.isRadiology = item.isRadiology ?? item.IsRadiology;
                    item.isPackage = item.isPackage ?? item.IsPackage;
                    item.DoctorId = item.DoctorId;
                    item.DoctorName = item.DoctorName;
                    // item.DiscPer = item.ConcessionPercentage
                    // item.DiscAmt = item.ConcessionAmount
                    item.DiscPer = 0
                    item.DiscAmt = 0
                    item.creditedtoDoctor = (item.DoctorId > 0);

                    if (item.DiscAmt > 0 || item.DiscPer > 0) {
                        this.isDiscountApplied = true;
                        hasPrevDiscount = true;
                    }

                    if (item.PackageId > 0) {
                        //goes ONLY to package table
                        this.addCopyToPackageTable(item);
                    } else {
                        this.onSaveEntry(item);
                    }
                });

                // need to check here during prevlist call diff addcharge so do there only calculateion
                if (hasPrevDiscount) {
                    setTimeout(() => {
                        // this.updateFooterFromPrev();
                    });
                }

            }

            else {
                this.onSaveEntry(result);
            }
        });
    }
    docServiceList: any = [];

    getDocServicelist(DoctorId: number) {

        const vdata = {
            searchFields: [
                {
                    fieldName: 'DoctorId',
                    fieldValue: String(DoctorId),
                    opType: 'Equals'
                }
            ],
            mode: 'DoctorWiseCharges'
        };

        this._AppointmentlistService.getDocServicelist(vdata).subscribe((data: any[]) => {
            this.docServiceList = data || [];
            debugger
            this.chargeList = [];
            this.dstable1.data = this.chargeList;
            const tempList = this.docServiceList.map(row => ({
                serviceId: row.ServiceId,
                serviceName: row.ServiceName,
                price: row.Price ?? 0,
                creditedtoDoctor: row.CreditedtoDoctor,
                DoctorId: row.CreditedtoDoctor ? (row.DoctorId ?? 0) : 0,
                DoctorName: row.Doctorflag ? (row.DoctorName ?? '') : '',
                isPathology: row.IsPathology == 1,
                isRadiology: row.IsRadiology == 1,
                isPackage: row.IsPackage
            }));

            this.doctorName1 = (this.docServiceList[0]?.DoctorId ?? 0) > 0 ? this.docServiceList[0]?.DoctorName ?? '' : '';

            tempList.forEach(item => {
                this.onSaveEntry(item);
            });
        });
    }

    onChangeArea(event) {
        console.log(event)
        this.pincode = event.pincode
        this.CityName = event.cityName
        this.area = event.area
        this.myForm.get('cityId').setValue(event.cityId)

        this.onChangepincityDD(event.cityId)
    }


    onChangePincode(obj: string) {
        // Call API only when exactly 6 digits are entered
        if (obj && obj.length === 6) {
            this._AppointmentlistService.getbypincode(obj).subscribe((data: any) => {
                if (data && data.length > 0) {
                    console.log(data);

                    this.CityName = data[0].cityName;
                    this.area = data[0].area;

                    this.myForm.get('areaId').setValue(data[0].areaId);
                    // this.personalFormGroup.get('CityId').setValue(data[0].cityId);

                    this.onChangepincityDD(data[0].cityId);
                    this.registerObj.cityId = data[0].cityId;
                } else {
                    Swal.fire("Pincode does not exist.")
                }
            });
        }
    }
    onChangepincityDD(obj) {
        debugger
        this._AppointmentlistService.getstatebypincode(obj).subscribe((data: any) => {
            console.log(data)

            this.registerObj.stateId = data.stateId
            this._AppointmentlistService.getstateId(data.stateId).subscribe((Response) => {
                this.ddlCountry.SetSelection(Response.countryId);
            });
        });
    }
}
// Set NODE_OPTIONS="--max-old-space-size=8192"