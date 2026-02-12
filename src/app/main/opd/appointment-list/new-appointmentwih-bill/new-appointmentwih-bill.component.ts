import { Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { RegInsert } from '../../registration/registration.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { AppointmentlistService } from '../appointmentlist.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { HospitalConfigService } from 'app/core/services/hospital-config.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'app/core/services/config.service';
import { DatePipe } from '@angular/common';
import { MatSelectChange } from '@angular/material/select';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { PrevlabHistoryComponent } from 'app/main/Lab Management/lab-patient-reg/prevlab-history/prevlab-history.component';

import { PackageDetailsComponent } from '../appointment-billing/package-details/package-details.component';
import Swal from 'sweetalert2';
import { OpPaymentComponent } from '../../op-search-list/op-payment/op-payment.component';
import { PreviousDeptListComponent } from '../update-reg-patient-info/previous-dept-list/previous-dept-list.component';
import { ChargesList, LabRequest } from 'app/main/Lab Management/lab-patient-reg/lab-patient-reg.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-appointmentwih-bill',
  templateUrl: './new-appointmentwih-bill.component.html',
  styleUrls: ['./new-appointmentwih-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewAppointmentwihBillComponent {
  myForm: FormGroup
  searchFormGroup: FormGroup
  LabBillfinalform: FormGroup
  chargeForm: FormGroup
  OpBillForm: FormGroup
  OPFooterForm: FormGroup
  TPaymentForm: FormGroup
  VisitFormGroup: FormGroup
  AppointmentBillfinalform: FormGroup
  RegiAppointmentBillfinalform
  screenFromString = 'Common-form';
  registerObj = new RegInsert({});
  companyDet = new RegInsert({});
  CityName = ""
  vTariffId: any = 1;
  vClassId: any = 1;
  ApiURL: any = '';
  isServiceIdSelected: boolean = false;
  isDoctor: boolean = false;
  // Consessionres: boolean = false;
  RegId = 0
  vDepId = 0;
  autocompleteModepatienttype: string = "PatientType";
  autocompleteModegender: string = "Gender";
  autocompleteModecountry: string = "Country";
  autocompleteModeDepartment: string = "Department";
  autocompleteModerefdoc: string = "RefDoctor";
  autocompleteModeunit: string = "Hospital";
  autocompleteModeClass: string = "Class";
  autocompleteModetariff: string = "Tariff";
  autocompleteModecompany: string = "Company";
  autocompleteModesubcompany: string = "SubCompany";
  autocompleteModecamp: string = "CampMaster";
  autocompleteModedoctor: string = "ConDoctor";
  autocompleteModeConcession: string = "Concession";
  autocompleteModeLabPatientType: string = "LabPatientType";
  autocompleteModepurpose: string = "Purpose";
  autocompletedepartment: string = "Department";
  public dsChargeList = new MatTableDataSource<ChargesList>();
  dsLabRequest2 = new MatTableDataSource<LabRequest>();
  public dsPackageList = new MatTableDataSource<ChargesList>();
  filteredOptions: any[] = [];
  prevResults: any[] = [];

  public dstable1 = new MatTableDataSource<ChargesList>();
  dsCopyItemList = new MatTableDataSource<ChargesList>();

  debounceTimers: { [key: string]: any } = {};
  chkregisterd: boolean = false;
  showEmergencyFlag: boolean = false;
  chargeslist: any = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dateTimeObj: any;
  minDate = new Date();
  selectedPatient: any;
  selectedMobile: any;
  vOPIPId = 0
  regNo = 0;
  PatientName: any;
  opdNo = "0";
  ageYear: any;
  ageMonth: any;
  ageDays: any;
  ageDay = 0;
  doctorId = 0;
  doctorname = '';
  servicedoctorname: any;
  serivcedoctorId: any;
  companyId = 0;
  companyName = '';
  ExclusionAmt = '';
  InclusionAmt = '';
  ConcessionId = 0;
  ConcessionReason = '';
  departmentname = '';
  IsPathology: any;
  IsRadiology: any;
  vIsPackage: any;
  isCompanySelected: boolean = false;
  isTariffSelect: boolean = false;
  patienttype = 0
  mode: any;
  isExpanded2 = false;
  isRegSearchDisabled: boolean = false;
  Regflag: boolean = false;
  IsPhoneAppflag: boolean = true;
  public chargeList: ChargesList[] = [];

  savebtn: boolean = true;

  displayedServiceColumns: string[] = [
    'ServiceName',
    'price',
    // 'Action'
  ]

  displayedServiceselected: string[] = [
    'Status',
    'ServiceName',
    'DoctorName',
    'Urgent',
    'Price',
    'DiscountPer',
    'DiscountAmount',
    'NetAmount',
    'buttons'
  ]
  public displayedColumnspackage: string[] =
    ['IsCheck', 'ServiceNamePackage', 'ServiceName', 'Price', 'DoctorName'];

  doctorOptions: any[] = [];
  onlineflag: boolean = false;
  abhaForm: FormGroup;
  UnitId: any = this.accountService.currentUserValue.user.unitId;
  vRefDocId: any = 0
  vRefDocName: any = ''

  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
  @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
  @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
  @ViewChild('ddlcompanyExec') ddlcompanyExec: AirmidDropDownComponent;

  @ViewChild('serviceInput') serviceInput!: ElementRef<HTMLInputElement>;
  toastr: any;

  constructor(public _AppointmentlistService: AppointmentlistService,

    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewAppointmentwihBillComponent>,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public _formbuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private accountService: AuthenticationService,
    private hospitalconfigservice: HospitalConfigService,
    public toastrService: ToastrService, public _ConfigService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiCaller: ApiCaller,
  ) { }

  ngOnInit(): void {
    this.AppointmentBillfinalform = this.createFinalFormView1()
    this.RegiAppointmentBillfinalform = this.createRegistredFinalFormView1()
    this.VisitFormGroup = this.createVisitdetailForm();
    this.VisitFormGroup.markAllAsTouched();

    this.myForm = this.CreateMyForm();
    this.myForm.markAllAsTouched();
    this.searchFormGroup = this.createSearchForm();
    this.loadDropdownOptions();

    this.LabBillfinalform = this.createFinalFormView()

    this.OpBillForm = this.createTotalChargeForm();
    this.OPFooterForm = this.CreateOPFooter();
    // this.abhaForm = this._AppointmentlistService.createAbhadetailForm();

    this.mode = this.data?.mode || 'add';

    // this.myForm.get('patientType').setValue(this.data?.row?.patientTypeId);
    this.myForm.get('Comments').setValue(this.data?.row?.comments);
    this.myForm.get('ReferByName').setValue(this.data?.row?.referByName);
    this.myForm.get('tariffId').setValue(this.data?.row?.tariffId ?? 1);
    this.myForm.get('companyId').disable() // disable for 1st time when form will open after comp select enable

    // if (this.data?.row?.labPatientId) {
    //   this._AppointmentlistService.getLabRegistraionById(this.data?.row?.labPatientId).subscribe((response) => {
    //     this.registerObj = response;
    //     this.myForm.get('doctorId').setValue(this.registerObj.doctorId);
    //     this.myForm.get('refDocId').setValue(this.registerObj.refDocId);
    //     this.VlabPatRegId = this.registerObj.labPatRegId
    //     console.log("retrive Data:", this.registerObj)
    //     this._AppointmentlistService.getLabRegistraionMasterById(this.VlabPatRegId).subscribe((response) => {
    //       this.registerObj = response;
    //       console.log("Master Data:", this.registerObj)
    //       this.myForm.patchValue(this.registerObj)
    //     });
    //   });
    // }

    this.getServiceList();
    console.log(this.hospitalconfigservice.HospitalconfigParams)
    console.log(this._ConfigService.configParams)

    this.ApiURL = "VisitDetail/search-GetServiceListwithTraiff?TariffId=" + this.vTariffId + "&ClassId=" + 1 + "&SrvcName="
  }

  createFinalFormView() {
    {
      return this._formbuilder.group({
        labPatientRegistration: '',
        opBillIngModels: '',
        tPayments: this._formbuilder.array([]),
      })
    }
  }

  createFinalFormView1() {
    {
      return this._formbuilder.group({
        appRegistrationBills: '',
        visit: '',
        appOPBillIngModels: ''
      })
    }
  }

  createRegistredFinalFormView1() {
    {
      return this._formbuilder.group({
        // appRegistrationBills: '',
        visit: '',
        appOPBillIngModels: ''
      })
    }
  }

  CreateMyForm() {
    const maxLen = this.Is9_Digit_National_Id ? 9 : 12;
    return this._formbuilder.group({
      regDate: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
      regTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      unitId: this.accountService.currentUserValue.user.unitId,
      prefixId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      middleName: ['', [Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$"), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      lastName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$")]],
      genderId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      DateOfBirth: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      ageYear: ['', [Validators.maxLength(3), Validators.pattern("^[0-9]*$")]],
      ageMonth: ['', [Validators.pattern("^[0-9]*$")]],
      ageDay: ['', [Validators.pattern("^[0-9]*$")]],
      address: ['', [Validators.maxLength(100), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      cityId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      stateId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      countryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      patientTypeId: [1, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      tariffId: [this.vTariffId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],//this.hospitalconfigservice.HospitalconfigParams?.IPD_Billing_CounterId], // need to ask sir what value to pass
      classId: [1],// [this.hospitalconfigservice.HospitalconfigParams?.IPD_Billing_CounterId],
      departmentId: [0],
      Address: '',
      doctorId: [0],
      refDocId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      createdBy: this.accountService.currentUserValue.userId,
      labPatientId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      LabPatRegId: 0,
      adharCardNo: [0, [
        Validators.minLength(12),  //     Validators.minLength(12),
        Validators.maxLength(12), //     Validators.maxLength(12),
        Validators.pattern("^[0-9]*$"),
        this._FormvalidationserviceService.onlyNumberValidator()
      ]],
      companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      subCompanyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      campId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      patientType: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      Comments: ['', [Validators.maxLength(255), Validators.pattern("^[A-Za-z/() ]*$"), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      ReferByName: ['', [Validators.maxLength(255), Validators.pattern("^[A-Za-z/() ]*$"), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      companyExecutiveId: [0],
      aadharCardNo: ['', [
        Validators.minLength(12),
        Validators.maxLength(12),
        // this._FormvalidationserviceService.onlyNumberValidator()
      ]],


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

      photo: "",


      // extra fields
      regId: [0, [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      IsPathRad: ['1'],
      ServiceId: [''],
      totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      totalDiscountPer: [0, [Validators.min(0), Validators.max(100), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      discountAmt: [0, [Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      paymentType: ['CashPay'],
      patientName: [''],
      servicedoctorId: [0],
      concessionReasonId: [0, this._FormvalidationserviceService.onlyNumberValidator()],
    })
  }

  createVisitdetailForm() {
    return this._formbuilder.group({

      regId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],

      visitDate: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
      visitTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      PatientTypeId: [1, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      UnitId: [this.accountService.currentUserValue.user.unitId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ConsultantDocId: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      RefDocId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      TariffId: [1, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      CompanyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      SubCompanyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      addedBy: [this.accountService.currentUserValue.userId, this._FormvalidationserviceService.onlyNumberValidator()],
      updatedBy: [this.accountService.currentUserValue.userId, this._FormvalidationserviceService.onlyNumberValidator()],
      isCancelledBy: 0,
      isCancelled: false,
      isCancelledDate: ['1900-01-01'],
      ClassId: [1, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      DepartmentId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      patientOldNew: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      firstFollowupVisit: 0,
      AppPurposeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      campId: [0],
      followupDate: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
      crossConsulFlag: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      phoneAppId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      crossConsultantDrId: 0,
      visitId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
     
     
      policyNumber: [0],
      policyLimit: [0],
      policyValidateDate: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
    });
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
  // only passed for cash & credit pay demo
  CreateModePaymentform(item: any): FormGroup {
    // debugger
    return this._formbuilder.group({
      paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      unitId: [this.accountService.currentUserValue.user.unitId],
      billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdipdtype: [0],
      paymentDate: [item?.paymentDate ?? ''],
      paymentTime: [item?.paymentTime ?? ''],
      payAmount: [item?.payAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      tranNo: [item?.tranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      bankName: [item?.bankName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      validationDate: [item?.validationDate ?? ''],
      advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      comments: [item?.comments ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      payMode: [item?.payMode ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      onlineTranNo: [item?.onlineTranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      onlineTranResponse: [item?.onlineTranResponse ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      companyId: [item?.companyId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      cashCounterId: [item?.cashCounterId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      transactionType: [item?.transactionType ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isSelfOrcompany: [item?.isSelfOrcompany ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      tranMode: ['HOSP', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      createdBy: [this.accountService.currentUserValue.userId],
      transactionLabel: ['LAB_BILL'],
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
      UPINO: [''],
    })
  }
  createTotalChargeForm(): FormGroup {
    return this._formbuilder.group({
      //bill header  
      billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdipdid: [this.VlabPatRegId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      regNo: ["0", [this._FormvalidationserviceService.onlyNumberValidator()]],
      patientName: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
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
      govtApprovedAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],

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
        companyId: 0
      })
    });
  }
  CreateAddchargeform(item: any): FormGroup {
    // debugger
    return this._formbuilder.group({
      chargesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      opdIpdType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdIpdId: [this.VlabPatRegId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceId: [item?.ServiceId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      price: [item?.Price, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      qty: [1, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      totalAmt: [item?.TotalAmt, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionPercentage: [item?.DiscPer ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionAmount: [Number(item?.DiscAmt) ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
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
      chargesId: [parseInt(item?.ServiceId), [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }
  Createpacakgechargeform(item: any): FormGroup {
    // debugger
    return this._formbuilder.group({
      chargesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      opdIpdType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdIpdId: [this.VlabPatRegId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceId: [item?.serviceId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      price: [item?.price, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      qty: [item?.Qty, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      totalAmt: [item?.TotalAmt, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionPercentage: [item?.DiscPer ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionAmount: [item?.DiscAmt ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      netAmount: [item?.NetAmount, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      doctorId: [item?.doctorId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorName: [item?.doctorName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      docPercentage: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      docAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      hospitalAmt: [item?.NetAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
      refundAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isComServ: [false],
      isPrintCompSer: [false],
      salesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isGenerated: [false],
      addedBy: [this.accountService.currentUserValue.userId],
      isCancelled: [false],
      isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isCancelledDate: ['1999-01-01'],
      isPathology: [item?.isPathology ? true : false],
      isRadiology: [item?.isRadiology ? true : false],
      isPackage: [true],
      wardId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      bedId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceCode: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      serviceName: [item?.serviceName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      companyServiceName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      isInclusionExclusion: [false],
      isHospMrk: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      packageMainChargeID: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isSelfOrCompanyService: [false],
      packageId: [item?.PackageServiceId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesTime: this.datePipe.transform(new Date(), 'shortTime'),
      classId: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
      tariffId: [this.vTariffId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      createdBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]]
    });
  }
  get packcagechargesArray(): FormArray {
    return this.OpBillForm.get('packcagecharges') as FormArray;
  }
  get ChargeddetailsArray(): FormArray {
    return this.OpBillForm.get('addCharges') as FormArray;
  }
  get BillDetailsArray(): FormArray {
    return this.OpBillForm.get('billDetails') as FormArray;
  }
  get ModeOfPaymentsArray(): FormArray {
    return this.LabBillfinalform.get('tPayments') as FormArray;
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  selectedTabIndex = 0;
  onTabChange(event: MatTabChangeEvent) {
    this.selectedTabIndex = event.index;
  }

  onChangePatient(value) {
    var mode = "Company"
    if (value.text != "Self") {
      this._AppointmentlistService.getMaster(mode, 1);
      this.myForm.get('companyId').setValidators([Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]);
      this.isCompanySelected = true;
      this.myForm.get('companyId').enable()
      this.patienttype = 2;
      this.OPFooterForm.get('paymentType').setValue('CreditPay')

    } else if (value.text == "Self") {
      this.isCompanySelected = false;      
      this.myForm.get('companyId').disable()
      this.myForm.get('companyId').clearValidators();
      this.myForm.get('companyId').updateValueAndValidity();
      this.patienttype = 1;
      this.OPFooterForm.get('paymentType').setValue('CashPay')
      this.myForm.get('companyId').setValue(0);
      this.myForm.get('tariffId').setValue(1);
      this.isTariffSelect = false //tariff not readonly
    }
  }

  private destroy$ = new Subject<void>();

  ////////////////////////// dd new method start ////////////////////
  getdocdetail(event: MatSelectChange, row: any): void {

    const option = this.doctorOptions.find(
      opt => (opt.value ?? opt.Value) === event.value
    );

    if (!option) return;

    row.DoctorId = option.value ?? option.Value;
    row.DoctorName = option.text ?? option.Text;

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

  ////////////////////////// dd new method end ////////////////////
  onChangeCompany(value) {
    this.companyId = value.companyId
    this.companyName = value.companyName
    if (this.companyId) {
      this.isTariffSelect = true
    }
    this._AppointmentlistService.getCompanyById(value.companyId).subscribe((response) => {
      this.companyDet = response;
      this.myForm.get('tariffId').setValue(this.companyDet.traiffId);
      this.vTariffId = this.companyDet.traiffId

      this.ApiURL = "VisitDetail/search-GetServiceListwithTraiff?TariffId=" + this.vTariffId + "&ClassId=" + 1 + "&SrvcName="
    });
  }

  onChangeRefdoc(value) {
    this.vRefDocId = value.doctorId
    this.vRefDocName = value.doctorName
    this.myForm.get('refDocId').setValue(value.doctorId);
  }

  onChangeTariff(value) {
    this.vTariffId = value.value
    this.ApiURL = "VisitDetail/search-GetServiceListwithTraiff?TariffId=" + this.vTariffId + "&ClassId=" + 1 + "&SrvcName="
  }
  urgentStatus: boolean = false;
  onUrgentToggleChange(event: any, contact: any) {
    this.urgentStatus = event.checked;
    // optionally do recalculation or other logic
    console.log(contact);
  }
  vRegNo = 0
  regflag = false
  VlabPatRegId: any;
  showPrevBtn: boolean = false
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
  private updateFooterFromPrev(): void {
    if (!this.chargeList || this.chargeList.length === 0) return;

    let total = 0;
    let totalDisc = 0;

    this.chargeList.forEach(item => {
      const rowTotal = (+item.Price || 0) * (+item.Qty || 1);
      const rowDisc = +item.DiscAmt || 0;

      total += rowTotal;
      totalDisc += rowDisc;
    });

    // const discPer = total > 0 ? +(totalDisc * 100 / total).toFixed(2) : 0;
    const discPer = this.chargeList.reduce((sum, item) => sum + (Number(item.DiscPer) || 0), 0);

    const netAmt = Math.round(total - totalDisc);

    this.myForm.patchValue({
      totalAmt: total,
      discountAmt: totalDisc,
      totalDiscountPer: discPer,
      netPayableAmt: netAmt
    }, { emitEvent: false });

    this.isDiscountApplied = totalDisc > 0;
    this.Consessionres = totalDisc > 0;
  }


  getPrevList(row: any = null) {
    const dialogRef = this._matDialog.open(PrevlabHistoryComponent,
      {
        maxWidth: "80vw",
        height: '80%',
        width: '100%',
        data: this.VlabPatRegId
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
          item.DiscPer = item.ConcessionPercentage
          item.DiscAmt = item.ConcessionAmount
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
            this.updateFooterFromPrev();
          });
        }

      }

      else {
        this.onSaveEntry(result);
      }
    });
  }

  value = new Date()
  onChangeDateofBirth(DateOfBirth: Date) {

    if (DateOfBirth > this.minDate) {
      this.toastrService.warning('Enter Proper Birth Date..', 'warning !', {
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
        this.toastrService.warning('Please Enter Valid BirthDate..', 'warning !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
    }
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
      // this.myForm.get("DepartmentId").setValue(this.PrevregisterObj.departmentId)
      this.selectChangedepartment(this.PrevregisterObj)
      console.log(this.PrevregisterObj)



    });
  }

  selectChangedepartment(obj: any) {

    if (obj.value) {
      this._AppointmentlistService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
        this.ddlDoctor.options = data;
        this.ddlDoctor.bindGridAutoComplete();
      });
    } else {
      this._AppointmentlistService.getDoctorsByDepartment(obj.departmentId).subscribe((data: any) => {
        console.log(data)
        if (data) {

          this.ddlDoctor.options = data;
          this.ddlDoctor.bindGridAutoComplete();
          const incomingDoctorId = obj.consultantDocId || obj.doctorId;
          if (incomingDoctorId) {
            const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
            if (matchedDoctor) {
              // this.myForm.get('ConsultantDocId')?.setValue(matchedDoctor.value);
            }
          }
        }
      });
    }
  }
  Consessionres: boolean = false;

  onDiscountPerChange(row: ChargesList): void {
    debugger
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
    this.updateCalculation();
  }
  // Calculation of total amount.
  calculateTotalAmount(): void {
    debugger
    let totalSum = this.chargeList.reduce((sum, charge) => sum + (+charge.TotalAmt), 0);
    let totalDiscount = this.chargeList.reduce((sum, charge) => sum + (+charge.DiscAmt), 0);
    let totalDiscountPer = this.chargeList.reduce((sum, charge) => sum + (+charge.DiscPer), 0);
    let totalNet = totalSum - totalDiscount;

    this.myForm.patchValue({
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

  getServiceList() {
    let ServiceName = this.myForm.get("ServiceId").value + "%" || "%";
    let IsPathRad = 3
    // this.myForm.get("IsPathRad").value || "1"
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

    this._AppointmentlistService.getserviceList(param).subscribe(Menu => {

      this.dsLabRequest2.data = Menu.data as LabRequest[];
      this.dsLabRequest2.sort = this.sort;
      this.dsLabRequest2.paginator = this.paginator;

    });

  }
  SrvcName1: any = "";
  serviceId: any;
  vQty: any;
  chkIsEditable: boolean = true;
  serviceSelct = false
  getSelectedserviceObj(obj) {
    console.log(obj)
    this.SrvcName1 = obj.serviceName;
    this.serviceId = obj.serviceId;
    this.vQty = 1;
    this.IsPathology = obj.isPathology;
    this.IsRadiology = obj.isRadiology;
    this.vIsPackage = obj.isPackage;
    this.serviceSelct = true
    this.onSaveEntry(obj);

    // ✅ Clear Service Name
    this.myForm.get('ServiceId')?.reset();

    // ✅ Focus back to input (wait for DOM update)
    setTimeout(() => {
      this.serviceInput?.nativeElement.focus();
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
  Patientnewold: any = 1;
  onChangeReg1(event) {
    if (event.value === 'registration') {
      this.myForm.reset();
      this.myForm.get('RegId').reset();
      this.searchFormGroup.get('RegId').disable();
      this.isRegSearchDisabled = false;
      this.Patientnewold = 1;

      // Instead of reassigning, update controls one by one
      // const newPersonalForm = this.CreateAppointmentForm();
      // this.resetFilteredOptions();
      // Object.keys(newPersonalForm.controls).forEach(key => {
      //   if (this.myForm.contains(key)) {
      //     this.myForm.setControl(key, newPersonalForm.get(key));
      //   } else {
      //     this.myForm.addControl(key, newPersonalForm.get(key));
      //   }
      // });

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

      // const newPersonalForm = this.crea();
      // this.resetFilteredOptions();
      // Object.keys(newPersonalForm.controls).forEach(key => {
      //   if (this.myForm.contains(key)) {
      //     this.myForm.setControl(key, newPersonalForm.get(key));
      //   } else {
      //     this.myForm.addControl(key, newPersonalForm.get(key));
      //   }
      // });

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

  selectChangeConcession(event) {
    this.ConcessionId = event.value
    this.ConcessionReason = event.text
  }

  onSaveEntry(row) {
    // debugger
    let doctorid = 0;
    const formValue = this.myForm.value

    const isDuplicate = this.dstable1.data.some(item => item.ServiceId === row.serviceId);
    if (!isDuplicate) {
      this.onAddCharges(row)
    }
    else {
      this.toastrService.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }


  updateCalculation(source: 'PER' | 'LIST' = 'LIST') {
    debugger
    const totalAmt = this.chargeList.reduce(
      (sum, item) => sum + (Number(item.Price) || 0),
      0
    );

    let discountAmt = Number(this.myForm.get('discountAmt')?.value) || 0;
    let discountPer = Number(this.myForm.get('totalDiscountPer')?.value) || 0;

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

    this.myForm.patchValue({
      totalAmt: totalAmt,
      discountAmt: discountAmt,
      totalDiscountPer: discountPer,
      netPayableAmt: Math.round(netAmt)
    }, { emitEvent: false });
  }

  // updateCalculation(row: any = null) {
  //   debugger
  //   const totalAmt = this.chargeList.reduce(
  //     (sum, item) => sum + (Number(item.Price) || 0),
  //     0
  //   );

  //   const discountAmt = this.chargeList.reduce(
  //     (sum, item) => sum + (Number(item.DiscAmt) || 0),
  //     0
  //   );

  //   const netAmt = this.chargeList.reduce(
  //     (sum, item) => sum + (Number(item.NetAmount) || 0),
  //     0
  //   );

  //   // const discPer = totalAmt > 0
  //   //   ? +(discountAmt * 100 / totalAmt).toFixed(2)
  //   //   : 0;
  //   // const discPer = this.chargeList.reduce(
  //   //   (sum, item) => sum + (Number(item.DiscPer) || 0),
  //   //   0
  //   // );

  //   this.myForm.patchValue({
  //     totalAmt: totalAmt,
  //     discountAmt: discountAmt,
  //     // totalDiscountPer: discPer,
  //     netPayableAmt: Math.round(netAmt)
  //   }, { emitEvent: false });
  // }

  updateFromDiscountAmt() {
    const total = this.chargeList.reduce(
      (sum, item) => sum + (parseFloat(item.Price.toString()) || 0),
      0
    );

    const discountAmt = Number(this.myForm.get('discountAmt')?.value) || 0;

    this.Consessionres = discountAmt > 0;

    const discPer = total > 0 ? (discountAmt * 100) / total : 0;
    const netAmt = Math.round(total - discountAmt);

    this.myForm.patchValue({
      totalAmt: total,
      totalDiscountPer: discPer,
      netPayableAmt: netAmt
    }, { emitEvent: false });
  }

  total = 0


  getCellCalculation(element) {
    debugger
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

    this.myForm.patchValue({
      totalAmt: totalAmt,
      discountAmt: discountAmt,
      // totalDiscountPer: discPer,
      netPayableAmt: Math.round(netAmt)
    }, { emitEvent: false });
  }


  showDoctorDropdown(row: any): boolean {
    return row && row.creditedtoDoctor === true;
  }

  public isDiscountApplied = false;
  isRowDiscountApplied = false;
  onAddCharges(row): void {
    const isPackage = (row.isPackage ?? row.IsPackage) == 1;

    if (row.isPathology !== undefined || row.IsPathology !== undefined) {
      this.IsPathology = row.isPathology ?? row.IsPathology;
      this.IsRadiology = row.isRadiology ?? row.IsRadiology;
    } else {
      if (this.myForm.get("IsPathRad")?.value == '1') {
        this.IsPathology = true;
        this.IsRadiology = false;
      } else {
        this.IsRadiology = true;
        this.IsPathology = false;
      }
    }

    const formValue = this.myForm.value;
    // var totalAmount;
    // if (row.PackageId == 0 || row.PackageId > 0) {
    //   totalAmount = row.NetAmount * 1;
    // } else {
    //   totalAmount = row.price * 1;
    // }
    const totalAmount = row.price * 1;
    debugger

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

    debugger
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
      creditedtoDoctor: row.creditedtoDoctor === true,
      DoctorId: row.DoctorId || 0,
      DoctorName: row.DoctorName || '-',
      ChargesAddedName: this.accountService.currentUserValue.userName,
      IsPathology: row.isPathology == 1 ? true : false,
      IsRadiology: row.isRadiology == 1 ? true : false,
      IsPackage: row.isPackage,
      serviceCode: 0,//formValue.serviceName.companyCode, 
      isInclusionExclusion: true,//formValue.serviceName.isInclusionOrExclusion
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

  public packageList: ChargesList[] = [];
  PacakgeList: any = [];
  EditedPackageService: any = [];
  OriginalPackageService: any = [];
  TotalPrice: any = 0;
  getRtevPackageDetList(obj) {
    var vdata =
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
      // debugger
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

  getPacakgeDetail(contact) {
    const dialogRef = this._matDialog.open(PackageDetailsComponent,
      {
        maxWidth: "100%",
        height: '75%',
        width: '70%',
        data: {
          Obj: contact,
          PatientDet: this.registerObj,
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
          this.OriginalPackageService = this.dstable1.data.filter(item => item.ServiceId !== element.PackageServiceId)
          this.EditedPackageService = this.dstable1.data.filter(item => item.ServiceId === element.PackageServiceId)
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
                ChargesDate: this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
                IsPathology: element.IsPathology,
                IsRadiology: element.IsRadiology,
                IsPackage: element.IsPackage,
                ClassName: element.ClassName,
                ChargesAddedName: this.accountService.currentUserValue.user.id || 1,
              });
            this.dstable1.data = this.OriginalPackageService;
            this.chargeList = this.dstable1.data
          });
        }
        this.TotalPrice = 0;
        // this.getRtevPackageDetList(result);
        // this.onAddCharges(result)
      }
      this.calculateTotalAmount();
    });
  }

  deleteTableRow(element) {
    this.chargeslist = this.dstable1.data;
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
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
    this.toastrService.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  chkChange() {
    if (this.registerObj.dateOfBirth > this.minDate) {
      this.toastrService.warning('Enter Proper Birth Date', 'warning !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    }
  }

  prefixName: any;
  onChangePrefix(e) {
    this.prefixName = e.prefixName
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

    // if (this.PatientName){
    // this.PatientName = this.myForm.get('FirstName').value + " " + this.myForm.get('LastName').value
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
    // if (!this.myForm.invalid && !this.VisitFormGroup.invalid) {

    if (this.isCompanySelected && this.VisitFormGroup.get('CompanyId').value == 0) {
      this.toastr.warning('Please select valid Company ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    debugger
    if (this.searchFormGroup.get('regRadio').value == "registration") {


      if (this.OpBillForm.invalid) {

        this.ChargeddetailsArray.clear();
        this.BillDetailsArray.clear();

        this.dstable1.data.forEach(item => {
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
                // this.closeAllOrNavigateBack();
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
            // this.closeAllOrNavigateBack();
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
            // this.closeAllOrNavigateBack();
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
                // this.closeAllOrNavigateBack();
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
            // this.closeAllOrNavigateBack();
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
            // this.closeAllOrNavigateBack();
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
    // } else {
    //   let invalidFields = [];
    //   if (this.myForm.invalid) {
    //     for (const controlName in this.myForm.controls) {
    //       if (this.myForm.controls[controlName].invalid) { invalidFields.push(`Personal Form: ${controlName}`); }
    //     }
    //   }
    //   if (this.VisitFormGroup.invalid) {
    //     for (const controlName in this.VisitFormGroup.controls) { if (this.VisitFormGroup.controls[controlName].invalid) { invalidFields.push(`Visit Form: ${controlName}`); } }
    //   }

    //   if (invalidFields.length > 0) {
    //     invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
    //   }

    // }
  }
  // BillSave() {

  //   if (this.mode === 'edit') {
  //     Swal.fire({
  //       title: 'Confirm Save',
  //       text: 'Are you sure you want to update registration?',
  //       icon: 'warning', // or 'question'
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6', // Blue
  //       cancelButtonColor: '#d33',     // Red
  //       confirmButtonText: 'Yes, save it!',
  //       cancelButtonText: 'No, cancel'
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         // update registration api call here
  //         this.myForm.get('LabPatRegId').setValue(this.VlabPatRegId);
  //         const formValue = { ...this.myForm.value };
  //         const controlsToRemove = ['patientName', 'regId', 'IsPathRad', 'ServiceId', 'totalAmt', 'totalDiscountPer', 'discountAmt', 'netPayableAmt',
  //           'paymentType', 'servicedoctorId'];
  //         controlsToRemove.forEach(key => delete formValue[key]);
  //         console.log(formValue)
  //         this._AppointmentlistService.AppointwihRegistredeBillSave(formValue).subscribe((response) => {
  //           this._matDialog.closeAll();
  //         });
  //         console.log("Api pending")
  //         return;
  //       }
  //     });
  //   } else {
  //     Swal.fire({
  //       title: 'Confirm Save',
  //       text: 'Are you sure you want to save this Lab Bill?',
  //       icon: 'warning', // or 'question'
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6', // Blue
  //       cancelButtonColor: '#d33',     // Red
  //       confirmButtonText: 'Yes, save it!',
  //       cancelButtonText: 'No, cancel'
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         console.log(this.myForm.value)
  //         let priceflag = this.dstable1.data.filter(row => row.Price == 0);

  //         if (priceflag.length) {
  //           this.toastrService.warning('Please Enter Price For Service', 'Warning !', {
  //             toastClass: 'tostr-tost custom-toast-warning',
  //           });
  //           return;
  //         }
  //         // debugger
  //         this.myForm.get('firstName').setValue(this.myForm.get('firstName').value)
  //         if (!this.myForm.invalid)
  //           this.OnSave();

  //         else {
  //           let invalidFields = [];
  //           if (this.myForm.invalid) {
  //             for (const controlName in this.myForm.controls) {
  //               const control = this.myForm.get(controlName);

  //               if (control instanceof FormGroup || control instanceof FormArray) {
  //                 for (const nestedKey in control.controls) {
  //                   if (control.get(nestedKey)?.invalid) {
  //                     invalidFields.push(`Lab Register Bill Data : ${controlName}.${nestedKey}`);
  //                   }
  //                 }
  //               } else if (control?.invalid) {
  //                 invalidFields.push(`Lab Register Bill From: ${controlName}`);
  //               }
  //             }
  //           }
  //           if (invalidFields.length > 0) {
  //             invalidFields.forEach(field => {
  //               this.toastrService.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
  //               );
  //             });
  //             return
  //           }
  //         }
  //       }
  //     });
  //   }
  // }

  // OnSave() {
  //   const formattedDate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd");
  //   const formattedTime = formattedDate + this.dateTimeObj.time;

  //   this.myForm.get('regDate').setValue(formattedDate);
  //   this.myForm.get('regTime').setValue(formattedTime);
  //   this.myForm.get('LabPatRegId').setValue(this.VlabPatRegId ?? 0);
  //   this.myForm.get('adharCardNo').setValue(Number(this.myForm.get('adharCardNo').value) ?? 0);

  //   const overallDiscAmt = +this.myForm.get('discountAmt')?.value || 0; //bottom discount

  //   const rowDiscApplied = this.dstable1?.data?.some( //row discount
  //     (row: any) => (+row.DiscAmt || 0) > 0
  //   ) || false;

  //   if (overallDiscAmt > 0 || rowDiscApplied) {
  //     if (!this.myForm.get('concessionReasonId')?.value) {
  //       this.toastrService.warning('Please select DiscountReason.', 'Warning !', {
  //         toastClass: 'tostr-tost custom-toast-warning',
  //       });
  //       return;
  //     }
  //   }

  //   console.log(this.myForm.getRawValue())
  //   let DateOfBirth1 = this.myForm.get('DateOfBirth')?.value;
  //   if (DateOfBirth1) {

  //     const todayDate = new Date();
  //     const dob = new Date(DateOfBirth1);
  //     let ageYear = (todayDate.getFullYear() - dob.getFullYear());
  //     let ageMonth = (todayDate.getMonth() - dob.getMonth());
  //     let ageDay = (todayDate.getDate() - dob.getDate());

  //     this.ageYear = ageYear
  //     this.ageMonth = ageMonth
  //     this.ageDay = ageDay

  //     if (ageDay < 0) {
  //       (ageMonth)--;
  //       const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
  //       ageDay += previousMonth.getDate();
  //     }

  //     if (ageMonth < 0) {
  //       ageYear--;
  //       ageMonth += 12;
  //     }
  //     if (
  //       (!ageYear || ageYear == 0) &&
  //       (!ageMonth || ageMonth == 0) &&
  //       (!ageDay || ageDay == 0)
  //     ) {
  //       this.toastrService.warning('Please select the birthdate or enter the age of the patient.', 'Warning!', {
  //         toastClass: 'tostr-tost custom-toast-warning',
  //       });
  //       return;
  //     }
  //     this.myForm.get('ageYear')?.setValue(String(ageYear), { emitEvent: false });
  //     this.myForm.get('ageMonth')?.setValue(String(ageMonth), { emitEvent: false });
  //     this.myForm.get('ageDay')?.setValue(String(ageDay), { emitEvent: false });

  //   }

  //   const formValue = { ...this.myForm.value };
  //   const controlsToRemove = ['patientName', 'regId', 'IsPathRad', 'ServiceId', 'totalAmt', 'totalDiscountPer', 'discountAmt', 'netPayableAmt',
  //     'paymentType', 'servicedoctorId'];
  //   controlsToRemove.forEach(key => delete formValue[key]);
  //   console.log(formValue)

  //   // Bill data
  //   const formattedDate1 = this.datePipe.transform(this.OpBillForm.get('billDate').value, "yyyy-MM-dd");
  //   const formattedTime1 = this.datePipe.transform(new Date(), "HH:mm:ss");
  //   debugger
  //   this.OpBillForm.get('billDate').setValue(formattedDate1);
  //   this.OpBillForm.get('billTime').setValue(formattedDate1 + ' ' + formattedTime1);
  //   this.OpBillForm.get('opdipdid')?.setValue(0)
  //   this.OpBillForm.get('tariffId')?.setValue(this.vTariffId)
  //   this.OpBillForm.get('regNo')?.setValue(this.regNo)
  //   this.OpBillForm.get('patientName')?.setValue(this.PatientName ?? this.prefixName + ' ' + this.myForm.get('firstName').value + ' ' + this.myForm.get('lastName').value)
  //   this.OpBillForm.get('ipdno')?.setValue(this.opdNo)
  //   this.OpBillForm.get('ageYear')?.setValue(this.myForm.get('ageYear')?.value || 0)
  //   this.OpBillForm.get('ageMonth')?.setValue(this.myForm.get('ageMonth')?.value || 0)
  //   this.OpBillForm.get('ageDays')?.setValue(this.myForm.get('ageDay')?.value || 0)

  //   // commented doctor field & passing ref doctor
  //   // this.OpBillForm.get('doctorId')?.setValue(this.myForm.get('doctorId').value || 0)
  //   // this.OpBillForm.get('doctorName')?.setValue(this.doctorname || '')
  //   this.OpBillForm.get('doctorId')?.setValue(this.vRefDocId || 0)
  //   this.OpBillForm.get('doctorName')?.setValue(this.vRefDocName || '')

  //   this.OpBillForm.get('patientType')?.setValue(this.companyId ? true : false)
  //   this.OpBillForm.get('companyName')?.setValue(this.companyName || '')
  //   this.OpBillForm.get('companyId')?.setValue(this.companyId || 0)
  //   this.OpBillForm.get('companyAmt')?.setValue(0)
  //   this.OpBillForm.get('patientAmt')?.setValue(this.myForm.get('netPayableAmt')?.value)
  //   this.OpBillForm.get('totalAmt')?.setValue(this.myForm.get('totalAmt')?.value)
  //   this.OpBillForm.get('concessionAmt')?.setValue(this.myForm.get('discountAmt')?.value)
  //   this.OpBillForm.get('netPayableAmt')?.setValue(this.myForm.get('netPayableAmt')?.value)
  //   this.OpBillForm.get('concessionReasonId')?.setValue(this.ConcessionId)
  //   this.OpBillForm.get('discComments')?.setValue(this.ConcessionReason)

  //   // this.OpBillForm.get('cashCounterId')?.setValue(this.searchForm.get('CashCounterID')?.value)

  //   this.ChargeddetailsArray.clear();
  //   this.BillDetailsArray.clear();

  //   const invalidRow = this.dstable1.data.find(item =>
  //     item.creditedtoDoctor === true && (!item.DoctorId || item.DoctorId === 0)
  //   );

  //   if (invalidRow) {
  //     this.toastrService.warning(
  //       'Please select Doctor for added service', 'Warning!');
  //     return;
  //   }

  //   this.dstable1.data.forEach(item => {
  //     this.ChargeddetailsArray.push(this.CreateAddchargeform(item as ChargesList));
  //     this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));

  //     if (item.IsPackage == 1) {
  //       this.packcagechargesArray.clear();
  //       this.dsPackageList.data.forEach(item => {
  //         this.packcagechargesArray.push(this.Createpacakgechargeform(item as ChargesList));
  //       });
  //     }
  //   });
  //   console.log("1. from values", this.OpBillForm.value)
  //   console.log('2. Invalid Checks Form status:', this.OpBillForm.status);

  //   debugger
  //   // const [ThermalPrint, ThermalPrintValue] = this._ConfigService.configParams.ThermalPrint.split(":");
  //   if (!this.OpBillForm.invalid) {

  //     if (this.OPFooterForm.get('paymentType').value == 'PayOption') {
  //       let PatientHeaderObj = {};
  //       PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
  //         PatientHeaderObj['PatientName'] = this.PatientName; // this.patientDetail.patientName;
  //       PatientHeaderObj['RegNo'] = this.regNo;
  //       PatientHeaderObj['DoctorName'] = this.doctorname || '';
  //       PatientHeaderObj['CompanyName'] = this.companyName;
  //       PatientHeaderObj['DepartmentName'] = this.departmentname;
  //       PatientHeaderObj['OPD_IPD_Id'] = this.VlabPatRegId;
  //       PatientHeaderObj['CompanyId'] = this.companyId || 0;
  //       PatientHeaderObj['CashCounterId'] = this.OpBillForm.get('cashCounterId')?.value || 0;
  //       PatientHeaderObj['Age'] = this.ageYear;
  //       PatientHeaderObj['TransactionLabel'] = 'LAB_BILL';
  //       PatientHeaderObj['NetPayAmount'] = Math.round(this.myForm.get('netPayableAmt').value);
  //       const dialogRef = this._matDialog.open(OpPaymentComponent,
  //         {
  //           maxWidth: "80vw",
  //           height: '750px',
  //           width: '80%',
  //           data: {
  //             vPatientHeaderObj: PatientHeaderObj,
  //             FromName: "LAB-Bill",
  //             advanceObj: PatientHeaderObj,
  //           }
  //         });
  //       dialogRef.afterClosed().subscribe(result => {
  //         if (result && result.IsSubmitFlag == true) {
  //           console.log(this.OpBillForm.value)
  //           console.log(result.submitDataPay.ipPaymentInsert)
  //           console.log(result.BillBalanceAmount)
  //           this.OpBillForm.get('balanceAmt').setValue(result.BillBalanceAmount || 0)
  //           this.OpBillForm.get('payments').setValue(result.submitDataPay.ipPaymentInsert)

  //           this.LabBillfinalform.get('labPatientRegistration').setValue(formValue)
  //           this.LabBillfinalform.get('opBillIngModels').setValue(this.OpBillForm.value)
  //           this.ModeOfPaymentsArray.clear();
  //           result.submitDataPay.ipModePaymentInsert.forEach(item => {
  //             this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
  //           });
  //           // this.LabBillfinalform.get('tPayments').setValue(result.submitDataPay.ipModePaymentInsert)
  //           console.log(this.LabBillfinalform.value)
  //           this._AppointmentlistService.InsertAppointmentBilling(this.LabBillfinalform.value).subscribe(response => {
  //             this.viewgetOPBillReportPdf(response)
  //             this._matDialog.closeAll();
  //             this.savebtn = true
  //           });
  //         }
  //       });
  //     }
  //     else if (this.OPFooterForm.get('paymentType').value == 'CashPay') {
  //       // debugger
  //       let ModePaymentObj = [];
  //       ModePaymentObj.push({
  //         paymentDate: formattedDate,
  //         paymentTime: formattedTime,
  //         payAmount: Math.round(this.myForm.get('netPayableAmt').value),
  //         tranNo: "",
  //         bankName: "",
  //         validationDate: formattedDate,
  //         comments: "",
  //         payMode: "CASH",
  //         onlineTranNo: "0",
  //         onlineTranResponse: "0",
  //         companyId: this.companyId || 0,
  //         cashCounterId: 0,
  //         transactionType: 0,
  //         isSelfOrcompany: this.companyId ? 1 : 0,
  //       });

  //       this.OpBillForm.get('balanceAmt').setValue(0)
  //       this.OpBillForm.get('paidAmt')?.setValue(this.myForm.get('netPayableAmt')?.value)
  //       this.OpBillForm.get('payments.cashPayAmount')?.setValue(Number(this.myForm.get('netPayableAmt')?.value))
  //       this.OpBillForm.get('payments.paymentDate')?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
  //       this.OpBillForm.get('payments.paymentTime')?.setValue(this.dateTimeObj.time)

  //       console.log(this.OpBillForm.value)
  //       this.LabBillfinalform.get('labPatientRegistration').setValue(formValue)
  //       this.LabBillfinalform.get('opBillIngModels').setValue(this.OpBillForm.value)
  //       debugger
  //       this.ModeOfPaymentsArray.clear();
  //       ModePaymentObj.forEach(item => {
  //         this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
  //       });

  //       // this.LabBillfinalform.get('tPayments').setValue([this.TPaymentForm.value])

  //       console.log("Final Payload:", this.LabBillfinalform.value)

  //       this._AppointmentlistService.InsertAppointmentBilling(this.LabBillfinalform.value).subscribe(response => {
  //         console.log(response)
  //         // debugger
  //         this.viewgetOPBillReportPdf(response)
  //         this._matDialog.closeAll();
  //         this.savebtn = true
  //         // this.resetform();
  //       });
  //     }
  //     else if (this.OPFooterForm.get('paymentType').value == 'CreditPay') {//Credit pay 
  //       this.OpBillForm.get('paidAmt').setValue(0)
  //       this.OpBillForm.get('balanceAmt')?.setValue(this.myForm.get('netPayableAmt')?.value)
  //       this.OpBillForm.removeControl('payments')

  //       this.LabBillfinalform.get('labPatientRegistration').setValue(formValue)
  //       this.LabBillfinalform.get('opBillIngModels').setValue(this.OpBillForm.value)
  //       // this.LabBillfinalform.get('tPayments').setValue([this.TPaymentForm.value])

  //       console.log(this.LabBillfinalform.value)

  //       this._AppointmentlistService.InsertAppointmentBillingCredit(this.LabBillfinalform.value).subscribe(response => {
  //         // this.viewgetOPBillReportPdf(response)
  //         this._matDialog.closeAll();
  //         this.savebtn = true
  //       });
  //     }
  //     else if (this.OPFooterForm.get('paymentType').value == 'onlinepay') {
  //       // debugger
  //       if (!(this.OPFooterForm.get('UPINO')?.value)) {
  //         this.toastrService.warning('Please enter upi no', 'Warning !', {
  //           toastClass: 'tostr-tost custom-toast-warning',
  //         });
  //         return;
  //       }

  //       let ModePaymentObj = [];
  //       ModePaymentObj.push({
  //         paymentDate: formattedDate,
  //         paymentTime: formattedTime,
  //         payAmount: Math.round(this.myForm.get('netPayableAmt').value),
  //         tranNo: "",
  //         bankName: "",
  //         validationDate: formattedDate,
  //         comments: "",
  //         payMode: "UPI",
  //         onlineTranNo: "0",
  //         onlineTranResponse: "0",
  //         companyId: this.companyId || 0,
  //         cashCounterId: 0,
  //         transactionType: 0,
  //         isSelfOrcompany: this.companyId ? 1 : 0,
  //       });

  //       this.OpBillForm.get('payments.payTmamount')?.setValue(this.myForm.get('netPayableAmt')?.value)
  //       this.OpBillForm.get('payments.payTmtranNo')?.setValue(this.OPFooterForm.get('UPINO')?.value)
  //       this.OpBillForm.get('payments.payTmdate').setValue(formattedDate)
  //       this.OpBillForm.get('payments.paymentDate')?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
  //       this.OpBillForm.get('payments.paymentTime')?.setValue(this.dateTimeObj.time)

  //       console.log(this.OpBillForm.value)
  //       this.LabBillfinalform.get('labPatientRegistration').setValue(formValue)
  //       this.LabBillfinalform.get('opBillIngModels').setValue(this.OpBillForm.value)

  //       this.ModeOfPaymentsArray.clear();
  //       ModePaymentObj.forEach(item => {
  //         this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
  //       });

  //       // this.LabBillfinalform.get('tPayments').setValue([this.TPaymentForm.value])

  //       console.log(this.LabBillfinalform.value)

  //       this._AppointmentlistService.InsertAppointmentBilling(this.LabBillfinalform.value).subscribe(response => {
  //         console.log(response)
  //         // debugger
  //         this.viewgetOPBillReportPdf(response)
  //         this._matDialog.closeAll();
  //         this.savebtn = true
  //         // this.resetform();
  //       });
  //     }
  //   }
  //   else {
  //     const invalidFields = this.collectErrors(this.OpBillForm);
  //     if (invalidFields.length > 0) {
  //       invalidFields.forEach(field => {
  //         this.toastrService.warning(`Field "${field}" is invalid.`, 'Warning');
  //       });
  //       return;
  //     }
  //   }

  // }

  collectErrors(formGroup: FormGroup | FormArray, parentKey: string = ''): string[] {
    let errors: string[] = [];
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (control instanceof FormGroup || control instanceof FormArray) {
        // go deeper
        errors = errors.concat(this.collectErrors(control, newKey));
      } else {
        if (control?.invalid) {
          errors.push(newKey);
        }
      }
    });
    return errors;
  }

  viewgetOPBillReportPdf(element) {
    // this.commonService.Onprint("BillNo", element, "LabregisterBillReceipt");
    this.commonService.Onprint("BillNo", element, "LabMoneyReceipt");
  }

   handleInputChange(changedField: string): void {
        // Get all current field values
        const firstName = this.myForm.get('firstName').value?.trim() || '';
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
                this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
            });
            return;
        }

        // If only one field is filled, and it's LastName, just filter prevResults (do not call API)
        if (filledFields === 1 && changedField === 'LastName') {
            this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
            return;
        }

        // If more than one field is filled, filter from prevResults
        if (this.prevResults.length > 0) {
            this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
        } else if (changedField === 'FirstName' || changedField === 'MobileNo') {
            // Fallback: if prevResults is empty, call API with the changed field (if allowed)
            const keyword = this.myForm.get(changedField).value?.trim();
            if (keyword) {
                this._AppointmentlistService.getSuggestions("OutPatient/auto-complete?Keyword=", keyword).subscribe(results => {
                    this.prevResults = results || [];
                    this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
                });
            }
        } else {
            // If changedField is LastName and prevResults is empty, do nothing
            this.filteredOptions = [];
        }
    }

    // Helper function to filter results by all non-empty fields
    filterResults(results: any[], fields: { firstName: string, lastName: string, mobileNo: string }) {
        const { firstName, lastName, mobileNo } = fields;
        return results.filter(item => {
            return (!firstName || item.patientName?.toLowerCase().includes(firstName.toLowerCase()))
                && (!lastName || item.patientName?.toLowerCase().includes(lastName.toLowerCase()))
                && (!mobileNo || item.mobileNo?.startsWith(mobileNo));
        });
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
    resetFilteredOptions() {
        this.filteredOptions = [];
        this.prevResults = [];
    }

  onSelectPatient(row: any) {
    this.getSelectedObj(row);
    this.resetFilteredOptions();
  }
 
  Is9_Digit_National_Id: boolean = false;

  getValidationMessages() {
    const maxLen = this.Is9_Digit_National_Id ? 9 : 12;
    const minLen = this.Is9_Digit_National_Id ? 7 : 12;
    return {
      RegId: [],
      firstName: [
        { name: "required", Message: "First Name is required" },
        { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      middleName: [
        // { name: "required", Message: "Middle Name is required" },
        // { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      lastName: [
        { name: "required", Message: "Last Name is required" },
        // { name: "maxLength", Message: "Enter only upto 50 chars" },
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
        // { name: "required", Message: "phoneNo No is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ],
      adharCardNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "Aadhaar / National ID is required" },
        { name: "minLength", Message: `Minimum ${minLen} digits required.` },
        { name: "maxLength", Message: `More than ${maxLen} digits not allowed.` }
      ],
      MaritalStatusId: [
        { Message: "Mstatus Name is required" }
      ],
      patientTypeId: [
        { name: "required", Message: "Country Name is required" }
      ],
      tariffId: [
        { name: "required", Message: "Mstatus Name is required" }
      ],
      departmentId: [
        { name: "required", Message: "Department Name is required" }
      ],
      DoctorID: [
        { name: "required", Message: "Doctor Name is required" }
      ],
      refDocId: [
        { name: "required", Message: "Ref Doctor Name is required" }
      ],
      PurposeId: [
        { name: "required", Message: "Purpose Name is required" }
      ],
      companyId: [
        { name: "required", Message: "Company Name is required" }
      ],
      subCompanyId: [
        { name: "required", Message: "SubCompany Name is required" }
      ],
      patientTypeValue: [
        { name: "required", Message: "PatientType is required" }
      ],
      Comments: [
        { name: "pattern", Message: "only char allowed." }
      ],
      ReferByName: [
        { name: "pattern", Message: "only char allowed." }
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
      aadharCardNo: [
        { name: "required", Message: "aadharCardNo is required" }
      ],
      EmailId: [
        { name: "required", Message: "aadharCardNo is required" }
      ],
    };
  }

  resetform() {

    this.OPFooterForm.reset({
      totalAmt: 0,
      totalDiscountPer: 0,
      concessionAmt: 0,
      netPayableAmt: 0,
      concessionReasonId: 0,
    });
    this.OPFooterForm.get('paymentType').setValue('CashPay')
  }


  chkDoctor(event) {
    console.log(event)
    this.doctorname = event.text
  }
  onClose() {
    this.myForm.reset();
    this.dialogRef.close();
  }
}
// Set NODE_OPTIONS="--max-old-space-size=8192"
