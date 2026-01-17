import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDetailObj, ChargesList } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { LabPatientList, LabRequest } from '../lab-patient-reg.component';
import { LabPatientRegService } from '../lab-patient-reg.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { ConfigService } from 'app/core/services/config.service';
import { ItemNameList } from 'app/main/purchase/purchase-order/purchase-order.component';
import { HospitalConfigService } from 'app/core/services/hospital-config.service';
import { debounce } from 'lodash';
import { PreviousDeptListComponent } from 'app/main/opd/appointment-list/update-reg-patient-info/previous-dept-list/previous-dept-list.component';
import { MatSelectChange } from '@angular/material/select';
import { ApiCaller } from 'app/core/services/apiCaller';

@Component({
  selector: 'app-new-lab-patient-reg',
  templateUrl: './new-lab-patient-reg.component.html',
  styleUrls: ['./new-lab-patient-reg.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewLabPatientRegComponent {
  myForm: FormGroup
  searchFormGroup: FormGroup
  LabBillfinalform: FormGroup
  chargeForm: FormGroup
  OpBillForm: FormGroup
  OPFooterForm: FormGroup
  TPaymentForm: FormGroup

  screenFromString = 'Common-form';
  registerObj = new LabPatientList({});
  companyDet = new LabPatientList({});
  CityName = ""
  vTariffId: any = 1;
  vClassId: any = 1;

  isServiceIdSelected: boolean = false;
  isDoctor: boolean = false;
  // Consessionres: boolean = false;

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

  dsLabRequest2 = new MatTableDataSource<LabRequest>();
  // dstable1 = new MatTableDataSource<LabRequest>();
  filteredOptions: any[] = [];
  prevResults: any[] = [];
  public dstable1 = new MatTableDataSource<ChargesList>();
  debounceTimers: { [key: string]: any } = {};

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
  patienttype = 0
  mode: any;

  public chargeList: ChargesList[] = [];

  savebtn: boolean = true;

  displayedServiceColumns: string[] = [
    'ServiceName',
    'price',
    'Action'
  ]

  displayedServiceselected: string[] = [
    'ServiceName',
    'DoctorName',
    'Price',
    'buttons'
  ]

  doctorOptions: any[] = [];
  onlineflag: boolean = false;
  UnitId: any = this.accountService.currentUserValue.user.unitId;

  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
  @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
  @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;

  constructor(public _labPatientRegService: LabPatientRegService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewLabPatientRegComponent>,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public _formbuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private accountService: AuthenticationService,
    private hospitalconfigservice: HospitalConfigService,
    public toastr: ToastrService, public _ConfigService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiCaller: ApiCaller
  ) { }

  ngOnInit(): void {
    this.myForm = this.CreateMyForm();
    this.myForm.markAllAsTouched();

    this.loadDropdownOptions();

    this.LabBillfinalform = this.createFinalFormView()
    //  this.chargeForm = this.createChargeForm();
    this.OpBillForm = this.createTotalChargeForm();
    this.OPFooterForm = this.CreateOPFooter();
    // this.TPaymentForm = this.CreateModePaymentform();

    this.mode = this.data?.mode || 'add';

    if (this.data?.row?.labPatientId) {
      this._labPatientRegService.getLabRegistraionById(this.data?.row?.labPatientId).subscribe((response) => {
        this.registerObj = response;
        this.VlabPatRegId = this.registerObj.labPatRegId
        console.log("retrive Data:", this.registerObj)
        this._labPatientRegService.getLabRegistraionMasterById(this.VlabPatRegId).subscribe((response) => {
          this.registerObj = response;
          console.log("Master Data:", this.registerObj)
          this.myForm.patchValue(this.registerObj)
        });
      });
    }
    this.getServiceList();
    console.log(this.hospitalconfigservice.HospitalconfigParams)
    console.log(this._ConfigService.configParams)
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

  CreateMyForm() {
    const maxLen = this.Is9_Digit_National_Id ? 9 : 12;
    return this._formbuilder.group({
      labPatientId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      regDate: [new Date()],
      regTime: [],
      unitId: this.accountService.currentUserValue.user.unitId,
      prefixId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      middleName: ['', [Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$"), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      lastName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$")]],
      genderId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      DateOfBirth: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      ageYear: ['', [Validators.maxLength(3), Validators.pattern("^[0-9]*$")]],
      ageMonth: ['', [Validators.pattern("^[0-9]*$")]],
      ageDay: ['', [Validators.pattern("^[0-9]*$")]],
      address: ['', [Validators.maxLength(100), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      cityId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      stateId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      countryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      patientTypeId: [1],
      tariffId: [1],//this.hospitalconfigservice.HospitalconfigParams?.IPD_Billing_CounterId], // need to ask sir what value to pass
      classId: [1],// [this.hospitalconfigservice.HospitalconfigParams?.IPD_Billing_CounterId],
      departmentId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      doctorId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      refDocId: [0],
      companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      subCompanyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      campId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      adharCardNo: [0, [
        Validators.minLength(12),  //     Validators.minLength(12),
        Validators.maxLength(12), //     Validators.maxLength(12),
        Validators.pattern("^[0-9]*$"),
        this._FormvalidationserviceService.onlyNumberValidator()
      ]],

      // extra fields
      mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      regId: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      IsPathRad: ['1'],
      ServiceId: [''],
      totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      totalDiscountPer: [0, [Validators.min(0), Validators.max(100), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      discountAmt: [0, [Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      paymentType: ['CashPay'],
      patientName: [''],
      createdBy: this.accountService.currentUserValue.userId,
      LabPatRegId: 0,
      servicedoctorId: [0],
      concessionReasonId: [0, this._FormvalidationserviceService.onlyNumberValidator()],
    })
  }

  // only passed for cash & credit pay demo
  CreateModePaymentform(item: any): FormGroup {
    // debugger
    return this._formbuilder.group({
      paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      unitId: [this.accountService.currentUserValue.user.unitId],
      billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdipdtype: [4],
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
      opdipdid: [this.vOPIPId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      regNo: ["0", [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
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
      opdipdType: [4, [this._FormvalidationserviceService.onlyNumberValidator()]],
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
      opdIpdType: [4, [this._FormvalidationserviceService.onlyNumberValidator()]],
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
      serviceCode: [item?.ServiceId || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
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
  get ModeOfPaymentsArray(): FormArray {
    return this.LabBillfinalform.get('tPayments') as FormArray;
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onChangePatient(value) {
    var mode = "Company"
    if (value.text != "Self") {
      this._labPatientRegService.getMaster(mode, 1);
      this.myForm.get('companyId').setValidators([Validators.required]);
      this.isCompanySelected = true;
      this.patienttype = 2;
      this.OPFooterForm.get('paymentType').setValue('CreditPay')
    } else if (value.text == "Self") {
      this.isCompanySelected = false;
      this.myForm.get('companyId').clearValidators();
      this.myForm.get('subCompanyId').clearValidators();
      this.myForm.get('companyId').updateValueAndValidity();
      this.myForm.get('subCompanyId').updateValueAndValidity();
      this.patienttype = 1;
      this.OPFooterForm.get('paymentType').setValue('CashPay')
    }
    // else {
    //   if (this.patienttype != 2)
    //     this.OPFooterForm.get('paymentType').setValue('CashPay')
    // }
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
    this.companyId = value.value
    this._labPatientRegService.getCompanyById(value.value).subscribe((response) => {
      this.companyDet = response;
      this.myForm.get('tariffId').setValue(this.companyDet.traiffId);
    });
  }

  regflag = false
  VlabPatRegId: any;
  getSelectedObj(obj) {
    console.log(obj)
    // this.PatientName = obj.patientName;
    this.PatientName = obj.firstName + ' ' + obj.lastName;
    this.VlabPatRegId = obj.visitId;
    if (this.VlabPatRegId) {
      setTimeout(() => {
        this._labPatientRegService.getLabRegistraionMasterById(this.VlabPatRegId).subscribe((response) => {
          console.log(response)
          this.registerObj = response;
          this.value = response.dateofBirth
          this.regNo = response.labRequestNo
          this.onChangeDateofBirth(response.dateofBirth)
          this.getLastDepartmetnNameList(this.registerObj)
          this.regflag = true
          this.myForm.patchValue({
            firstName: this.registerObj.firstName.trim(),
            middleName: this.registerObj.middleName.trim(),
            LastName: this.registerObj.lastName.trim(),
            MobileNo: this.registerObj.mobileNo.trim(),
            address: this.registerObj.address.trim(),
            // DateOfBirth:this.registerObj.dateofBirth,
          });
          // this.selectChangedepartment(this.registerObj)
        });
      }, 100);
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
          Obj: row, Label: 'Lab'
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.PrevregisterObj = result
      this.myForm.get("departmentId").setValue(this.PrevregisterObj.departmentId)
      this.selectChangedepartment(this.PrevregisterObj)
      console.log(this.PrevregisterObj)
    });
  }

  value = new Date()
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

    this._labPatientRegService.getserviceList(param).subscribe(Menu => {

      this.dsLabRequest2.data = Menu.data as LabRequest[];
      this.dsLabRequest2.sort = this.sort;
      this.dsLabRequest2.paginator = this.paginator;

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

  selectChangeConcession(event) {
    this.ConcessionId = event.value
    this.ConcessionReason = event.text
  }

  onSaveEntry(row) {
    let doctorid = 0;
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
  getCellCalculation(element) {

    const total = this.dstable1.data.reduce((sum, item) => sum + (parseFloat(item.Price.toString()) || 0), 0);
    const discPer = Number(this.myForm.get('totalDiscountPer')?.value) || 0;
    // this.myForm.get('discountAmt').value
    const discountAmt = (total * discPer) / 100;
    const netAmt = total - discountAmt;
    element.TotalAmt = total
    element.DiscPer = 0,
      element.DiscAmt = discountAmt | 0,
      element.NetAmount = netAmt,

      this.myForm.patchValue({
        totalAmt: total,
        discountAmt: discountAmt,
        netPayableAmt: netAmt
      });
  }

  showDoctorDropdown(row: any): boolean {
    return row && row.creditedtoDoctor === true;
  }

  onAddCharges(row): void {

    if (this.myForm.get("IsPathRad").value == '1')
      this.IsPathology = true
    else
      this.IsRadiology = true

    const formValue = this.myForm.value;

    const totalAmount = row.price * 1;
    const discountAmount = formValue.discountAmt;//(totalAmount * formValue.discountPer) / 100;
    const netAmount = totalAmount - discountAmount;

    const newRow = {
      ServiceId: row.serviceId,
      ServiceName: row.serviceName,
      Price: row.price || 0,
      Qty: 1,
      TotalAmt: totalAmount || 0,
      DiscPer: 0,
      DiscAmt: discountAmount || 0,
      NetAmount: netAmount || 0,
      ClassName: 1,//this.className || '-',
      creditedtoDoctor: row.creditedtoDoctor === true,
      DoctorId: row.DoctorId || 0,
      DoctorName: row.DoctorName || '-',
      ChargesAddedName: this.accountService.currentUserValue.userName,
      IsPathology: row.isPathology,
      IsRadiology: row.isRadiology,
      IsPackage: 0,
      serviceCode: 0,//formValue.serviceName.companyCode, 
      isInclusionExclusion: 1,//formValue.serviceName.isInclusionOrExclusion
    };

    const newCharge = new ChargesList(newRow);
    newCharge.DiscAmt = newCharge.DiscAmt || 0;
    newCharge.DiscPer = newCharge.DiscPer || 0;
    this.chargeList.push(newCharge);
    this.dstable1.data = this.chargeList;
    this.updateCalculation();

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

  chkChange() {
    if (this.registerObj.dateOfBirth > this.minDate) {
      this.toastr.warning('Enter Proper Birth Date', 'warning !', {
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
    this._labPatientRegService.getstateId(e.stateId).subscribe((Response) => {
      this.ddlState.SetSelection(Response.stateId)
      this.ddlCountry.SetSelection(Response.countryId);
    });
  }
  departmentId = 0
  selectChangedepartment(obj: any) {
    // console.log(obj)
    this.departmentId = obj.value
    this.departmentname = obj.text

    if (obj.value) {
      this._labPatientRegService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
        // console.log(data)
        this.ddlDoctor.options = data;
        this.ddlDoctor.bindGridAutoComplete();
      });
    }
    else {
      this._labPatientRegService.getDoctorsByDepartment(obj.departmentId).subscribe((data: any) => {
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
              this.doctorname = matchedDoctor.text
            }
          }
        }, 100);
      });
    }

    // this.myForm.get('departmentId').setValue(this.departmentId)
    // this.myForm.get('doctorId').setValue(parseInt(this.myForm.get('refDocId').value))
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

    if (this.mode === 'edit') {
      Swal.fire({
        title: 'Confirm Save',
        text: 'Are you sure you want to update registration?',
        icon: 'warning', // or 'question'
        showCancelButton: true,
        confirmButtonColor: '#3085d6', // Blue
        cancelButtonColor: '#d33',     // Red
        confirmButtonText: 'Yes, save it!',
        cancelButtonText: 'No, cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          // update registration api call here
          this.myForm.get('LabPatRegId').setValue(this.VlabPatRegId);
          const formValue = { ...this.myForm.value };
          const controlsToRemove = ['patientName', 'regId', 'IsPathRad', 'ServiceId', 'totalAmt', 'totalDiscountPer', 'discountAmt', 'netPayableAmt',
            'paymentType', 'servicedoctorId'];
          controlsToRemove.forEach(key => delete formValue[key]);
          console.log(formValue)
          this._labPatientRegService.labPatientSave(formValue).subscribe((response) => {
            this._matDialog.closeAll();
          });
          console.log("Api pending")
          return;
        }
      });
    } else {
      Swal.fire({
        title: 'Confirm Save',
        text: 'Are you sure you want to save this Lab Bill?',
        icon: 'warning', // or 'question'
        showCancelButton: true,
        confirmButtonColor: '#3085d6', // Blue
        cancelButtonColor: '#d33',     // Red
        confirmButtonText: 'Yes, save it!',
        cancelButtonText: 'No, cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(this.myForm.value)
          let priceflag = this.dstable1.data.filter(row => row.Price == 0);

          if (priceflag.length) {
            this.toastr.warning('Please Enter Price For Service', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }
          // debugger
          this.myForm.get('firstName').setValue(this.myForm.get('firstName').value)
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
                      invalidFields.push(`Lab Register Bill Data : ${controlName}.${nestedKey}`);
                    }
                  }
                } else if (control?.invalid) {
                  invalidFields.push(`Lab Register Bill From: ${controlName}`);
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
  }

  OnSave() {
    const formattedDate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd");
    const formattedTime = formattedDate + this.dateTimeObj.time;

    this.myForm.get('regDate').setValue(formattedDate);
    this.myForm.get('regTime').setValue(formattedTime);
    this.myForm.get('LabPatRegId').setValue(this.VlabPatRegId ?? 0);
    this.myForm.get('adharCardNo').setValue(Number(this.myForm.get('adharCardNo').value) ?? 0);
    // this.PatientName = this.prefixName + ' ' + this.myForm.get('firstName').value + ' ' + this.myForm.get('lastName').value

    if (this.myForm.get('discountAmt').value > 0) {
      if (!this.myForm.get('concessionReasonId').value) {
        this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

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
      this.myForm.get('ageYear')?.setValue(String(ageYear), { emitEvent: false });
      this.myForm.get('ageMonth')?.setValue(String(ageMonth), { emitEvent: false });
      this.myForm.get('ageDay')?.setValue(String(ageDay), { emitEvent: false });

    }

    const formValue = { ...this.myForm.value };
    const controlsToRemove = ['patientName', 'regId', 'IsPathRad', 'ServiceId', 'totalAmt', 'totalDiscountPer', 'discountAmt', 'netPayableAmt',
      'paymentType', 'servicedoctorId'];
    controlsToRemove.forEach(key => delete formValue[key]);
    console.log(formValue)

    // Bill data
    const formattedDate1 = this.datePipe.transform(this.OpBillForm.get('billDate').value, "yyyy-MM-dd");
    const formattedTime1 = this.datePipe.transform(new Date(), "HH:mm:ss");

    this.OpBillForm.get('billDate').setValue(formattedDate1);
    this.OpBillForm.get('billTime').setValue(formattedDate1 + ' ' + formattedTime1);
    this.OpBillForm.get('opdipdid')?.setValue(0)
    this.OpBillForm.get('tariffId')?.setValue(this.vTariffId)
    this.OpBillForm.get('regNo')?.setValue(this.regNo)
    this.OpBillForm.get('patientName')?.setValue(this.PatientName ?? this.prefixName + ' ' + this.myForm.get('firstName').value + ' ' + this.myForm.get('lastName').value)
    this.OpBillForm.get('ipdno')?.setValue(this.opdNo)
    this.OpBillForm.get('ageYear')?.setValue(Number(this.ageYear) || 0)
    this.OpBillForm.get('ageMonth')?.setValue(Number(this.ageMonth) || 0)
    this.OpBillForm.get('ageDays')?.setValue(Number(this.ageDays) || 0)
    this.OpBillForm.get('doctorId')?.setValue(this.myForm.get('doctorId').value || 0)
    this.OpBillForm.get('doctorName')?.setValue(this.doctorname || '')
    this.OpBillForm.get('patientType')?.setValue(this.companyId ? true : false)
    this.OpBillForm.get('companyName')?.setValue(this.companyName || '')
    this.OpBillForm.get('companyAmt')?.setValue(0)
    this.OpBillForm.get('patientAmt')?.setValue(this.myForm.get('netPayableAmt')?.value)
    this.OpBillForm.get('totalAmt')?.setValue(this.myForm.get('totalAmt')?.value)
    this.OpBillForm.get('concessionAmt')?.setValue(this.myForm.get('discountAmt')?.value)
    this.OpBillForm.get('netPayableAmt')?.setValue(this.myForm.get('netPayableAmt')?.value)
    this.OpBillForm.get('concessionReasonId')?.setValue(this.ConcessionId)
    this.OpBillForm.get('discComments')?.setValue(this.ConcessionReason)

    // this.OpBillForm.get('cashCounterId')?.setValue(this.searchForm.get('CashCounterID')?.value)
    console.log("form values", this.OpBillForm.value)
    // debugger
    console.log("form values", this.LabBillfinalform.value)
    if (this.OpBillForm.invalid) {

      this.ChargeddetailsArray.clear();
      this.BillDetailsArray.clear();

      const invalidRow = this.dstable1.data.find(item =>
        item.creditedtoDoctor === true && (!item.DoctorId || item.DoctorId === 0)
      );

      if (invalidRow) {
        this.toastr.warning(
          'Please select Doctor for added service', 'Warning!');
        return;
      }
      debugger
      this.dstable1.data.forEach(item => {
        this.ChargeddetailsArray.push(this.CreateAddchargeform(item as ChargesList));
        this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));
      });

      console.log("form values", this.OpBillForm.value)
      // const [ThermalPrint, ThermalPrintValue] = this._ConfigService.configParams.ThermalPrint.split(":");

      if (this.OPFooterForm.get('paymentType').value == 'PayOption') {
        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
          PatientHeaderObj['PatientName'] = this.PatientName; // this.patientDetail.patientName;
        PatientHeaderObj['RegNo'] = this.regNo;
        PatientHeaderObj['DoctorName'] = this.doctorname;
        PatientHeaderObj['CompanyName'] = this.companyName;
        PatientHeaderObj['DepartmentName'] = this.departmentname;
        PatientHeaderObj['OPD_IPD_Id'] = this.vOPIPId;
        PatientHeaderObj['CompanyId'] = this.companyId || 0;
        PatientHeaderObj['CashCounterId'] = this.OpBillForm.get('cashCounterId')?.value || 0;
        PatientHeaderObj['Age'] = this.ageYear;
        PatientHeaderObj['TransactionLabel'] = 'LAB_BILL';
        PatientHeaderObj['NetPayAmount'] = Math.round(this.myForm.get('netPayableAmt').value);
        const dialogRef = this._matDialog.open(OpPaymentComponent,
          {
            maxWidth: "80vw",
            height: '750px',
            width: '80%',
            data: {
              vPatientHeaderObj: PatientHeaderObj,
              FromName: "LAB-Bill",
              advanceObj: PatientHeaderObj,
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          if (result && result.IsSubmitFlag == true) {
            console.log(this.OpBillForm.value)
            console.log(result.submitDataPay.ipPaymentInsert)
            console.log(result.BillBalanceAmount)
            this.OpBillForm.get('balanceAmt').setValue(result.BillBalanceAmount || 0)
            this.OpBillForm.get('payments').setValue(result.submitDataPay.ipPaymentInsert)

            this.LabBillfinalform.get('labPatientRegistration').setValue(formValue)
            this.LabBillfinalform.get('opBillIngModels').setValue(this.OpBillForm.value)
            this.ModeOfPaymentsArray.clear();
            result.submitDataPay.ipModePaymentInsert.forEach(item => {
              this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
            });
            // this.LabBillfinalform.get('tPayments').setValue(result.submitDataPay.ipModePaymentInsert)
            console.log(this.LabBillfinalform.value)
            this._labPatientRegService.InsertLabRegBilling(this.LabBillfinalform.value).subscribe(response => {
              this.viewgetOPBillReportPdf(response)
              this._matDialog.closeAll();
              this.savebtn = true
            });
          }
        });
      }
      else if (this.OPFooterForm.get('paymentType').value == 'CashPay') {
        // debugger
        let ModePaymentObj = [];
        ModePaymentObj.push({
          paymentDate: formattedDate,
          paymentTime: formattedTime,
          payAmount: Math.round(this.myForm.get('netPayableAmt').value),
          tranNo: "",
          bankName: "",
          validationDate: formattedDate,
          comments: "",
          payMode: "CASH",
          onlineTranNo: "0",
          onlineTranResponse: "0",
          companyId: this.companyId || 0,
          cashCounterId: 0,
          transactionType: 0,
          isSelfOrcompany: this.companyId ? 1 : 0,
        });

        this.OpBillForm.get('balanceAmt').setValue(0)
        this.OpBillForm.get('paidAmt')?.setValue(this.myForm.get('netPayableAmt')?.value)
        this.OpBillForm.get('payments.cashPayAmount')?.setValue(Number(this.myForm.get('netPayableAmt')?.value))
        this.OpBillForm.get('payments.paymentDate')?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
        this.OpBillForm.get('payments.paymentTime')?.setValue(this.dateTimeObj.time)

        console.log(this.OpBillForm.value)
        this.LabBillfinalform.get('labPatientRegistration').setValue(formValue)
        this.LabBillfinalform.get('opBillIngModels').setValue(this.OpBillForm.value)
        debugger
        this.ModeOfPaymentsArray.clear();
        ModePaymentObj.forEach(item => {
          this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
        });

        // this.LabBillfinalform.get('tPayments').setValue([this.TPaymentForm.value])

        console.log("Final Payload:", this.LabBillfinalform.value)

        this._labPatientRegService.InsertLabRegBilling(this.LabBillfinalform.value).subscribe(response => {
          console.log(response)
          // debugger
          this.viewgetOPBillReportPdf(response)
          this._matDialog.closeAll();
          this.savebtn = true
          // this.resetform();
        });
      }
      else if (this.OPFooterForm.get('paymentType').value == 'CreditPay') {//Credit pay 
        this.OpBillForm.get('paidAmt').setValue(0)
        this.OpBillForm.get('balanceAmt')?.setValue(this.myForm.get('netPayableAmt')?.value)
        this.OpBillForm.removeControl('payments')

        this.LabBillfinalform.get('labPatientRegistration').setValue(formValue)
        this.LabBillfinalform.get('opBillIngModels').setValue(this.OpBillForm.value)
        // this.LabBillfinalform.get('tPayments').setValue([this.TPaymentForm.value])

        console.log(this.LabBillfinalform.value)

        this._labPatientRegService.InsertlabregCredit(this.LabBillfinalform.value).subscribe(response => {
          // this.viewgetOPBillReportPdf(response)
          this._matDialog.closeAll();
          this.savebtn = true
        });
      }
      else if (this.OPFooterForm.get('paymentType').value == 'onlinepay') {
        // debugger
        if (!(this.OPFooterForm.get('UPINO')?.value)) {
          this.toastr.warning('Please enter upi no', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }

        let ModePaymentObj = [];
        ModePaymentObj.push({
          paymentDate: formattedDate,
          paymentTime: formattedTime,
          payAmount: Math.round(this.myForm.get('netPayableAmt').value),
          tranNo: "",
          bankName: "",
          validationDate: formattedDate,
          comments: "",
          payMode: "UPI",
          onlineTranNo: "0",
          onlineTranResponse: "0",
          companyId: this.companyId || 0,
          cashCounterId: 0,
          transactionType: 0,
          isSelfOrcompany: this.companyId ? 1 : 0,
        });

        this.OpBillForm.get('payments.payTmamount')?.setValue(this.myForm.get('netPayableAmt')?.value)
        this.OpBillForm.get('payments.payTmtranNo')?.setValue(this.OPFooterForm.get('UPINO')?.value)
        this.OpBillForm.get('payments.payTmdate').setValue(formattedDate)
        this.OpBillForm.get('payments.paymentDate')?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
        this.OpBillForm.get('payments.paymentTime')?.setValue(this.dateTimeObj.time)

        console.log(this.OpBillForm.value)
        this.LabBillfinalform.get('labPatientRegistration').setValue(formValue)
        this.LabBillfinalform.get('opBillIngModels').setValue(this.OpBillForm.value)

        this.ModeOfPaymentsArray.clear();
        ModePaymentObj.forEach(item => {
          this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
        });

        // this.LabBillfinalform.get('tPayments').setValue([this.TPaymentForm.value])

        console.log(this.LabBillfinalform.value)

        this._labPatientRegService.InsertLabRegBilling(this.LabBillfinalform.value).subscribe(response => {
          console.log(response)
          // debugger
          this.viewgetOPBillReportPdf(response)
          this._matDialog.closeAll();
          this.savebtn = true
          // this.resetform();
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

  viewgetOPBillReportPdf(element) {
    this.commonService.Onprint("BillNo", element, "LabregisterBillReceipt");
  }
  filterResults(results: any[], fields: { firstName: string, lastName: string, mobileNo: string }) {
    const { firstName, lastName, mobileNo } = fields;
    return results.filter(item => {
      return (!firstName || item.firstName?.toLowerCase().includes(firstName.toLowerCase()))
        && (!lastName || item.lastName?.toLowerCase().includes(lastName.toLowerCase()))
        && (!mobileNo || item.mobileNo?.startsWith(mobileNo));
    });
  }
  handleInputChange(changedField: string): void {
    // Get all current field values
    // debugger
    const firstName = this.myForm.get('firstName').value?.trim() || '';
    const lastName = this.myForm.get('lastName').value?.trim() || '';
    const mobileNo = this.myForm.get('mobileNo').value?.trim() || '';

    // If all fields are empty, clear everything
    if (!firstName && !lastName && !mobileNo) {
      // this.resetFilteredOptions();
      return;
    }

    // Count how many fields are filled
    const filledFields = [firstName, mobileNo].filter(Boolean).length;

    // If only one field is filled, and it's FirstName or MobileNo, call API
    if (filledFields === 1 && (changedField === 'firstName' || changedField === 'mobileNo')) {
      const keyword = firstName || mobileNo;
      this._labPatientRegService.getlabSuggestions(`LabPatientRegistration/search-patient-1?UnitId=${this.UnitId}&Keyword=`, keyword).subscribe(results => {
        this.prevResults = results || [];
        // console.log(results)
        this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
      });
      return;
    }

    // If only one field is filled, and it's LastName, just filter prevResults (do not call API)
    if (filledFields === 1 && changedField === 'lastName') {
      this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
      return;
    }

    // If more than one field is filled, filter from prevResults
    if (this.prevResults.length > 0) {
      this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
    } else if (changedField === 'firstName' || changedField === 'mobileNo') {
      // Fallback: if prevResults is empty, call API with the changed field (if allowed)
      const keyword = this.myForm.get(changedField).value?.trim();
      if (keyword) {
        this._labPatientRegService.getlabSuggestions(`LabPatientRegistration/search-patient-1?UnitId=${this.UnitId}&Keyword=`, keyword).subscribe(results => {
          this.prevResults = results || [];
          this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
        });
      }
    } else {
      // If changedField is LastName and prevResults is empty, do nothing
      this.filteredOptions = [];
    }
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

  onSelectPatient(row: any) {
    this.getSelectedObj(row);
    this.resetFilteredOptions();
  }
  resetFilteredOptions() {
    this.filteredOptions = [];
    this.prevResults = [];
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
