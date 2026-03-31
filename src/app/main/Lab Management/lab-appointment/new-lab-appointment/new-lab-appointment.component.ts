import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
// import { AdvanceDetailObj, ChargesList } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ConfigService } from 'app/core/services/config.service';
import { HospitalConfigService } from 'app/core/services/hospital-config.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { ChargesList, LabPatientList, LabRequest } from '../../lab-patient-reg/lab-patient-reg.component';
import { LabAppointmentService } from '../lab-appointment.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LabPackageDetailsComponent } from '../../lab-patient-reg/lab-package-details/lab-package-details.component';

@Component({
  selector: 'app-new-lab-appointment',
  templateUrl: './new-lab-appointment.component.html',
  styleUrls: ['./new-lab-appointment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewLabAppointmentComponent {
  myForm: FormGroup
  abhaForm: FormGroup;
  screenFromString = 'ExternalLab-form';
  registerObj = new LabPatientList({});

  autocompleteModegender: string = "Gender";
  autocompleteModecountry: string = "Country";
  autocompleteModegroupName: string = "GroupName";
  autocompleteModesubGroupName: string = "SubGroupName";

  vFirstNameConfig: any;
  vmiddleNameConfig: any;
  vlastNameConfig: any;
  patientTypeList: any = [];
  VlabPatRegId: any;
  dateTimeObj: any;
  isExpanded2 = true;
  vTariffId: any = 1;
  vClassId: any = 1;
  ApiURL: any = '';
  isServiceIdSelected: boolean = false;
  isDoctor: boolean = false;
  servicedoctorname: any;
  serivcedoctorId: any;

  isCompanySelected: boolean = false;
  isTariffSelect: boolean = false;
  patienttype = 0
  UnitId: any = this.accountService.currentUserValue.user.unitId;
  vdoctorId: any = 0
  vdoctorName: any = ''
  companyId = 0;
  companyName = '';
  companyDet = new LabPatientList({});
  ageYear: any;
  ageMonth: any;
  ageDays: any;
  stateId = 0
  counryId = 0
  filteredOptions: any[] = [];
  prevResults: any[] = [];
  debounceTimers: { [key: string]: any } = {};
  PatientName: any;
  regNo: any;
  ageDay = 0;
  minDate = new Date();
  CityName: '';
  labPatientId = 0
  timeflag = 0
  isTimeChanged: boolean = false;
  phdatetime: any;
  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  isDatePckrDisabled: boolean = false;
  fromDate: Date;
  toDate: Date;
  isEditMode: boolean = false;
  public now: Date = new Date();

  chkIsEditable: boolean = true;
  serviceSelct = false
  public isDiscountApplied = false;
  isRowDiscountApplied = false;
  public packageList: ChargesList[] = [];
  PacakgeList: any = [];
  EditedPackageService: any = [];
  OriginalPackageService: any = [];
  TotalPrice: any = 0;
  regflag = false
  SrvcName1: any = "";
  serviceId: any;
  vQty: any;
  IsPathology: any;
  IsRadiology: any;
  vIsPackage: any;
  vLabAppId: any = 0;
  @ViewChild('serviceInput') serviceInput!: ElementRef<HTMLInputElement>;
  public chargeList: ChargesList[] = [];

  dsLabRequest2 = new MatTableDataSource<LabRequest>();
  public dsPackageList = new MatTableDataSource<ChargesList>();

  public dstable1 = new MatTableDataSource<ChargesList>();
  dsCopyItemList = new MatTableDataSource<ChargesList>();

  displayedServiceselected: string[] = [
    'Status',
    'ServiceName',
    'Price',
    'DiscountPer',
    'DiscountAmount',
    'NetAmount',
    'buttons'
  ]
  public displayedColumnspackage: string[] =
    ['IsCheck', 'ServiceNamePackage', 'ServiceName', 'Price',
      // 'DoctorName'
    ];

  chargeslist: any = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
  @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
  @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
  @ViewChild('ddlcompanyExec') ddlcompanyExec: AirmidDropDownComponent;
  autocompleteRadioDD: string = "RadioCategory";
  autocompleteRefDoctorDD: string = "RefDoctor";
  autocompleteModeConcession: string = "Concession";

  constructor(public _appointmentService: LabAppointmentService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewLabAppointmentComponent>,
    public datePipe: DatePipe,
    public _formbuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private accountService: AuthenticationService,
    private hospitalconfigservice: HospitalConfigService,
    public toastrService: ToastrService, public _ConfigService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configue: ConfigService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.myForm = this.CreateMyForm();
    this.myForm.markAllAsTouched();
    this.minDate = new Date();

    console.log("retrive Data:", this.data)

    if (this.data?.labAppId) {
      this.vLabAppId = this.data?.labAppId
      this.regNo = this.data?.seqNo
      this._appointmentService.getAppById(this.data?.labAppId).subscribe((response) => {
        console.log("App master", response)
        this.registerObj = response;
        this.value = response.dateofBirth
        this.VlabPatRegId = this.registerObj.labPatRegId ?? 0
        this.onChangeDateofBirth(response.dateofBirth)
        this.regflag = true
        this.myForm.patchValue({
          firstName: this.registerObj.firstName.trim(),
          middleName: this.registerObj.middleName.trim(),
          LastName: this.registerObj.lastName.trim(),
          MobileNo: String(this.registerObj.mobileNo).trim(),
          address: this.registerObj.address.trim()
        });
        this.myForm.get('labAppDate').setValue(this.datePipe.transform(this.data.labAppDate, 'yyyy-MM-dd'));
        // this.myForm.get('labAppTime').setValue(this.convertToTime(this.data.startTime));
        // this.myForm.get('startTime').setValue(this.convertToTime(this.data.startTime));
        // this.myForm.get('endTime').setValue(this.convertToTime(this.data.endTime));
        this.myForm.get('labAppTime').setValue(new Date(this.data.startTime));
        this.myForm.get('startTime').setValue(new Date(this.data.startTime));
        this.myForm.get('endTime').setValue(this.convertISOToTime(this.data.endTime));
        this.myForm.get('categoryId').setValue(this.data.categoryId);
        this.myForm.get('doctorId').setValue(this.data.doctorId);
        this.myForm.get('cityId').setValue(this.registerObj.cityId);
        if (this.registerObj.cityId) {
          this._appointmentService.getcityId(this.registerObj.cityId).subscribe((Response) => {
            this.stateId = Response.stateId

            this._appointmentService.getstateId(this.stateId).subscribe((Response) => {
              this.counryId = Response.countryId
            });
          });
        }
      });
      this.getAppointmentSerList();
    } else {
      if (this.data) {
        this.isEditMode = true;
        console.log(this.data)
        this.myForm.get('labAppDate').setValue(this.datePipe.transform(this.data.fromDate, 'yyyy-MM-dd'));
        this.myForm.get('labAppTime').setValue(this.data.fromDate);
        this.myForm.get('startTime').setValue(this.data.fromDate);
        this.myForm.get('endTime').setValue(this.data.toDate);
        this.myForm.get('categoryId').setValue(this.data.categoryId);
        this.myForm.get('doctorId').setValue(this.data.refDoctorId);
        this.fromDate = this.data.fromDate;
        this.toDate = this.data.toDate;
      } else {
        this.isEditMode = false;
        const currentDateTime = new Date();
        const today = new Date();
        const utcMidnight = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
        this.myForm.get('labAppDate').setValue(utcMidnight.toISOString());
        this.myForm.get('labAppTime')?.setValue(currentDateTime);
        this.myForm.get('endTime')?.setValue(currentDateTime);
        this.myForm.get('startTime').setValue(currentDateTime);
      }
    }

    this.ApiURL = "LabPatientRegistration/search-LabServiceListwithTraiff?TariffId=" + 1 + "&ClassId=" + 1 + "&GroupId=" + this.groupId + "&SubGroupId=" + this.subGroupId + "&SrvcName="
    // this.getServiceList();

    // var rawValue=this?._configue?.configParams?.Is9_Digit_NationalId || "";
    const firstValue = this?._configue?.configParams?.FirstNameMandatory || "";
    const [firstnameid, firstnameval] = firstValue.includes(":") ? firstValue.split(":") : [null, null];
    this.vFirstNameConfig = firstnameid

    const middleValue = this?._configue?.configParams?.MiddleNameMandatory || "";
    const [middlenameid, middlenameval] = middleValue.includes(":") ? middleValue.split(":") : [null, null];
    this.vmiddleNameConfig = middlenameid

    const lastValue = this?._configue?.configParams?.LastNameMandatory || "";
    const [lastnameid, lastnameval] = lastValue.includes(":") ? lastValue.split(":") : [null, null];
    this.vlastNameConfig = lastnameid

    this.setNameValidations();

    // Dropdown clear & search option
    this.myForm.get('groupId')?.valueChanges.subscribe(val => {
      if (val == 0) {
        this.groupId = 0;
        this.ApiURL = "LabPatientRegistration/search-LabServiceListwithTraiff?TariffId=" + this.vTariffId + "&ClassId=" + 1 + "&GroupId=" + this.groupId + "&SubGroupId=" + this.subGroupId + "&SrvcName="
      } else {
        this.groupId = val;
        this.ApiURL = "LabPatientRegistration/search-LabServiceListwithTraiff?TariffId=" + this.vTariffId + "&ClassId=" + 1 + "&GroupId=" + this.groupId + "&SubGroupId=" + this.subGroupId + "&SrvcName="
      }
    });

    this.myForm.get('subGroupId')?.valueChanges.subscribe(val => {
      if (val == 0) {
        this.subGroupId = 0;
        this.ApiURL = "LabPatientRegistration/search-LabServiceListwithTraiff?TariffId=" + this.vTariffId + "&ClassId=" + 1 + "&GroupId=" + this.groupId + "&SubGroupId=" + this.subGroupId + "&SrvcName="
      } else {
        this.subGroupId = val;
        this.ApiURL = "LabPatientRegistration/search-LabServiceListwithTraiff?TariffId=" + this.vTariffId + "&ClassId=" + 1 + "&GroupId=" + this.groupId + "&SubGroupId=" + this.subGroupId + "&SrvcName="
      }
    });

  }

  convertISOToTime(dateTime: string): Date | null {
    if (!dateTime) return null;

    const d = new Date(dateTime);

    const timeOnly = new Date();
    timeOnly.setHours(d.getHours(), d.getMinutes(), 0);

    return timeOnly;
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  setNameValidations() {
    const fieldConfigs = [
      { field: 'firstName', config: this.vFirstNameConfig },
      { field: 'middleName', config: this.vmiddleNameConfig },
      { field: 'lastName', config: this.vlastNameConfig }
    ];

    fieldConfigs.forEach(item => {
      const ctrl = this.myForm.get(item.field);
      if (!ctrl) return;

      if (item.config === '1') {
        ctrl.setValidators([Validators.required]);
      } else {
        ctrl.clearValidators();
      }

      ctrl.updateValueAndValidity();
    });
  }

  CreateMyForm() {
    return this._formbuilder.group({
      labAppId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      unitId: this.accountService.currentUserValue.user.unitId,
      appDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      appTime: [''],
      prefixId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      genderId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      middleName: ['', [Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$"), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      lastName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$")]],
      DateOfBirth: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      cityId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      stateId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      countryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      address: ['', [Validators.maxLength(100), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      doctorId: [0],
      categoryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      labAppDate: [(new Date()).toISOString(), [Validators.required, this._FormvalidationserviceService.validDateValidator()]],
      labAppTime: ['', [Validators.required]],
      addedBy: this.accountService.currentUserValue.userId,
      updatedBy: 0,
      isCancelled: false,
      isCancelledBy: [0],
      isCancelledDate: ['1900-01-01'],
      labPatRegId: [0],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      tLabAppServiceDetails: this._formbuilder.array([]),

      // extra fields
      ServiceId: [''],
      groupId: [0],
      subGroupId: [0],
      totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      totalDiscountPer: [0, [Validators.min(0), Validators.max(100), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      discountAmt: [0, [Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      netPayableAmt: [0],
      // netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      patientName: [''],
      servicedoctorId: [0],
      concessionReasonId: [0, this._FormvalidationserviceService.onlyNumberValidator()],
    })
  }

  createServiceDetForm(item: any): FormGroup {
    return this._formbuilder.group({
      appointmentDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      labAppId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      testId: [item.ServiceId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      price: [item.Price, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      // price: [item.Price, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      qty: [item.Qty, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      totalAmount: [item.TotalAmt, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      discPer: [item.DiscPer ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      discAmount: [item.DiscAmt ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      netAmount: [item.NetAmount, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      isCancel: false,
      isCancelledBy: 0,
      isCancelledDate: "1900-01-01"
    });
  }

  get ServicedetailsArray(): FormArray {
    return this.myForm.get('tLabAppServiceDetails') as FormArray;
  }

  prefixName: any;
  onChangePrefix(e) {
    this.prefixName = e.prefixName
    this.ddlGender.SetSelection(e.sexId);
  }

  onChangeRefdoc(value) {
    this.vdoctorId = value.doctorId
    this.vdoctorName = value.doctorName
    // this.vdoctorId = value.value
    // this.vdoctorName = value.text
  }

  selectChangeCategory(obj: any) {
    // this.categoryId = obj.value
    // this.CateName = obj.text
  }

  onChangecity(e) {
    this.CityName = e.cityName
    this.registerObj.stateId = e.stateId
    this.stateId = e.stateId
    this._appointmentService.getstateId(e.stateId).subscribe((Response) => {
      // this.ddlState.SetSelection(Response.stateId)
      // this.ddlCountry.SetSelection(Response.countryId);
      this.counryId = Response.countryId
    });
  }

  private _Consessionres = false;

  get Consessionres(): boolean {
    return this._Consessionres;
  }

  set Consessionres(value: boolean) {
    if (this._Consessionres !== value) {
      this._Consessionres = value;
      this.toggleConcessionValidator();
    }
  }

  toggleConcessionValidator() {
    const control = this.myForm.get('concessionReasonId');

    if (!control) return;

    if (this.Consessionres) {
      control.setValidators([Validators.required]);
    } else {
      control.clearValidators();
      control.setValue(null);
    }

    control.updateValueAndValidity({ emitEvent: false });
  }

  FetchList: any = [];
  getAppointmentSerList() {
    const param = {
      "first": 0,
      "rows": 10,
      "sortField": "LabAppId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "LabAppId",
          "fieldValue": String(this.vLabAppId),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": []
    }

    this._appointmentService.getAppDetById(param).subscribe(Menu => {
      this.FetchList = Menu.data as ChargesList[];

      let hasPrevDiscount = false;
      if (Array.isArray(this.FetchList)) {
        this.FetchList.forEach(item => {
          item.serviceId = item.testId;
          item.serviceName = item.serviceName;
          item.price = item.price;
          item.totalAmt = item.totalAmount;
          item.netAmount = item.netAmount;
          item.DiscPer = item.discPer
          item.DiscAmt = item.discAmount
          item.isPathology = 0;
          item.isRadiology = 1;
          item.isOtherService = 0;
          item.isPackage = item.isPackage ?? item.IsPackage;
          if (item?.isEditable == true) {
            this.chkIsEditable = false; //price should not get edit
          } else {
            this.chkIsEditable = true; //price should get edit
          }
          if (item.DiscAmt > 0 || item.DiscPer > 0) {
            this.isDiscountApplied = true;
            hasPrevDiscount = true;
          }

          this.onSaveEntry(item);

        });
      }
    });

  }

  groupId = 0;
  subGroupId = 0;

  onServiceInput(event: any) {
    let value = event.target.value;

    if (!value) return;
    // ✅ replace only +
    let encoded = value.replace(/\+/g, '%2B');

    if (value !== encoded) {
      this.myForm.get('ServiceId')?.setValue(encoded, { emitEvent: false });
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
    setTimeout(() => {
      this.serviceInput?.nativeElement.focus();
    });
  }

  onSaveEntry(row) {
    // debugger
    const doctorid = 0;
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

    const totalAmount = row.price * 1;
    // debugger
    let discountAmount = 0;
    let discountPer = 0;

    // 🔐 Apply discount ONLY if this row itself has discount (prev data)
    if (row.DiscAmt > 0 || row.DiscPer > 0) {
      discountAmount = row.DiscAmt || 0;
      discountPer = row.DiscPer || 0;
    }

    const netAmount = totalAmount - discountAmount;

    // debugger
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

  getCellCalculation(element) {
    // debugger
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

    this.myForm.patchValue({
      totalAmt: totalAmt,
      discountAmt: discountAmt,
      // totalDiscountPer: discPer,
      netPayableAmt: Math.round(netAmt)
    }, { emitEvent: false });
  }

  updateCalculation(source: 'PER' | 'LIST' = 'LIST') {
    // debugger
    const totalAmt = this.chargeList.reduce(
      (sum, item) => sum + (Number(item.Price) || 0),
      0
    );

    let discountAmt = Number(this.myForm.get('discountAmt')?.value) || 0;
    const discountPer = 0 //Number(this.myForm.get('totalDiscountPer')?.value) || 0;

    if (source === 'PER') {
      // Discount % entered
      discountAmt = totalAmt > 0
        ? +(totalAmt * discountPer / 100).toFixed(2)
        : 0;

      this.Consessionres = discountPer > 0;
    }

    const netAmt = totalAmt - discountAmt;

    this.myForm.patchValue({
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
    this._appointmentService.getRtevPackageDetList(vdata).subscribe(data => {
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
    const dialogRef = this._matDialog.open(LabPackageDetailsComponent,
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

  calculateTotalAmount(): void {
    // debugger
    const totalSum = this.chargeList.reduce((sum, charge) => sum + (+charge.TotalAmt), 0);
    const totalDiscount = this.chargeList.reduce((sum, charge) => sum + (+charge.DiscAmt), 0);
    const totalDiscountPer = this.chargeList.reduce((sum, charge) => sum + (+charge.DiscPer), 0);
    const totalNet = totalSum - totalDiscount;

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

  onDiscountPerChange(row: ChargesList): void {
    // debugger
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
      this.myForm.get("concessionReasonId").setValue(0)
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
      this.myForm.get("concessionReasonId").setValue(0)
    }
    row.DiscPer = totalAmount ? parseFloat(((discountAmt / totalAmount) * 100).toFixed(2)) : 0;
    row.TotalAmt = totalAmount;
    row.NetAmount = totalAmount - discountAmt;

    this.calculateTotalAmount();
    this.updateCalculation();
  }

  private syncFooterDiscountWithRows() {
    const hasAnyDiscountedRow = this.dstable1.data.some(
      (row: any) =>
        Number(row.DiscPer) > 0 || Number(row.DiscAmt) > 0
    );

    if (!hasAnyDiscountedRow) {
      this.myForm.patchValue({
        totalDiscountPer: 0,
        discountAmt: 0
      }, { emitEvent: false });

      this.isDiscountApplied = false;
      this.Consessionres = false;
    }
  }

  deleteTableRow(element) {
    this.chargeslist = this.dstable1.data;
    const index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dstable1.data = [];
      this.dstable1.data = this.chargeslist;

      this.syncFooterDiscountWithRows();

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

  showPrevBtn: boolean = false
  getSelectedObj(obj) {
    console.log(obj)
    // this.PatientName = obj.patientName;
    this.PatientName = obj.firstName + ' ' + obj.lastName;
    this.VlabPatRegId = obj.visitId;
    if (this.VlabPatRegId) {
      setTimeout(() => {
        this._appointmentService.getLabRegistraionMasterById(this.VlabPatRegId).subscribe((response) => {
          console.log(response)
          this.registerObj = response;
          this.counryId = response.countryId
          this.stateId = response.stateId
          this.value = response.dateofBirth
          this.regNo = response.labRequestNo
          this.onChangeDateofBirth(response.dateofBirth)
          this.regflag = true
          this.myForm.patchValue({
            firstName: this.registerObj.firstName.trim().toUpperCase() || '',
            middleName: this.registerObj.middleName.trim().toUpperCase() || '',
            lastName: this.registerObj.lastName.trim().toUpperCase() || '',
            MobileNo: this.registerObj.mobileNo.trim(),
            address: this.registerObj.address.trim(),
            // DateOfBirth:this.registerObj.dateofBirth,
          });

        });
      }, 100);
    }

    if (this.VlabPatRegId) {
      this.showPrevBtn = true
    }
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

  filterResults(results: any[], fields: { firstName: string, lastName: string, mobileNo: string }) {
    const { firstName, lastName, mobileNo } = fields;
    return results.filter(item => {
      return (!firstName || item.firstName?.toLowerCase().includes(firstName.toLowerCase()))
        && (!lastName || item.lastName?.toLowerCase().includes(lastName.toLowerCase()))
        && (!mobileNo || item.mobileNo?.startsWith(mobileNo));
    });
  }

  ChangeToUpperCase(changedField: string) {
    const control = this.myForm.get(changedField);
    if (control && control.value) {
      control.setValue(control.value.toUpperCase(), { emitEvent: false });
    }
  }

  handleInputChange(changedField: string): void {
    // Get all current field values
    // debugger

    // change in upper case letter
    const control = this.myForm.get(changedField);
    if (control && control.value) {
      control.setValue(control.value.toUpperCase(), { emitEvent: false });
    }

    const firstName = this.myForm.get('firstName').value?.trim() || '';
    const lastName = this.myForm.get('lastName').value?.trim() || '';
    const mobileNo = this.myForm.get('mobileNo').value?.trim() || '';

    if (mobileNo && mobileNo.length !== 10) {
      this.filteredOptions = [];
      return;
    }

    // If all fields are empty, clear everything
    if (!firstName && !lastName && !mobileNo) {
      this.resetFilteredOptions();
      return;
    }

    // Count how many fields are filled
    const filledFields = [firstName, mobileNo].filter(Boolean).length;

    // If only one field is filled, and it's FirstName or MobileNo, call API
    if (filledFields === 1 && (changedField === 'firstName' || (changedField === 'mobileNo' && mobileNo.length === 10))) {
      const keyword = firstName || mobileNo;
      this._appointmentService.getlabSuggestions(`LabPatientRegistration/search-patient-1?UnitId=${this.UnitId}&Keyword=`, keyword).subscribe(results => {
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

    // required for lastname
    // if (filledFields === 1 && changedField === 'lastName') {
    //   const keyword = lastName;

    //   if (keyword) {
    //     this._appointmentService.getlabSuggestions(
    //       `LabPatientRegistration/search-patient-1?UnitId=${this.UnitId}&Keyword=`,
    //       keyword
    //     ).subscribe(results => {
    //       this.prevResults = results || [];
    //       this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
    //     });
    //   }

    //   return;
    // }

    // If more than one field is filled, filter from prevResults
    if (this.prevResults.length > 0) {
      this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
    } else if (changedField === 'firstName' || changedField === 'mobileNo') {
      // Fallback: if prevResults is empty, call API with the changed field (if allowed)
      const keyword = this.myForm.get(changedField).value?.trim();
      if (keyword) {
        this._appointmentService.getlabSuggestions(`LabPatientRegistration/search-patient-1?UnitId=${this.UnitId}&Keyword=`, keyword).subscribe(results => {
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
  keyPressAlphanumeric(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  onChangeDate(value: any) {
    debugger;
    if (value) {
      const inputDate = new Date(value);

      const dateOfReg = new Date(Date.UTC(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
      ));

      // Optional: Emit localized date and time
      const [datePart, timePart] = dateOfReg
        .toLocaleString("en-US")
        .split(',')
        .map(part => part.trim());

      this.eventEmitForParent(datePart, timePart);

      const isoDateString = dateOfReg.toISOString();
      this.myForm.get('labAppDate').setValue(isoDateString);
    }
  }

  onChangeTime(event: any) {
    this.timeflag = 1;

    if (event) {
      const selectedTime = new Date(event);

      const localeString = selectedTime.toLocaleString("en-US");
      const [datePart, timePart] = localeString.split(',').map(part => part.trim());

      this.isTimeChanged = true;
      this.phdatetime = timePart;
      console.log(this.phdatetime);

      this.myForm.get('labAppTime').setValue(selectedTime);
      this.myForm.get('startTime').setValue(selectedTime);

      this.eventEmitForParent(datePart, timePart);
    }
  }

  onChangeTime1(event: any) {
    this.timeflag = 1;

    if (event) {
      const selectedTime = new Date(event);

      const localeString = selectedTime.toLocaleString("en-US");
      const [datePart, timePart] = localeString.split(',').map(part => part.trim());

      this.isTimeChanged = true;
      this.phdatetime = timePart;
      console.log(this.phdatetime);
      this.myForm.get('endTime').setValue(selectedTime);
      this.eventEmitForParent(datePart, timePart);
    }
  }

  eventEmitForParent(actualDate, actualTime) {
    const localaDateValues = actualDate.split('/');
    const localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }

  OnSubmit() {
    debugger
    const date = new Date(this.data.fromDate);
    date.setHours(this.now.getHours(), this.now.getMinutes());

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
        this.toastrService.warning('Please select the birthdate or enter the age of the patient.', 'Warning!', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    if (this.vLabAppId > 0) {
      const dateedit = new Date();
      dateedit.setHours(this.now.getHours(), this.now.getMinutes());
      this.myForm.get('appDate').setValue(this.datePipe.transform(this.data.appDate, 'yyyy-MM-dd'));
      this.myForm.get('appTime').setValue(this.datePipe.transform(dateedit, 'yyyy-MM-dd HH:mm'));
    } else {
      this.myForm.get('appDate').setValue(this.datePipe.transform(this.data.fromDate, 'yyyy-MM-dd'));
      this.myForm.get('appTime').setValue(this.datePipe.transform(date, 'yyyy-MM-dd HH:mm'));
    }
    this.myForm.get('labPatRegId').setValue(this.VlabPatRegId ?? 0);
    this.myForm.get('labAppId').setValue(this.vLabAppId ?? 0);
    this.myForm.get('stateId').setValue(this.stateId)
    this.myForm.get('countryId').setValue(String(this.counryId))

    this.ServicedetailsArray.clear();
    this.dstable1.data.forEach(item => {
      this.ServicedetailsArray.push(this.createServiceDetForm(item as ChargesList));
    });

    const formValue = { ...this.myForm.value };
    const controlsToRemove = ['patientName', 'ServiceId', 'totalAmt', 'totalDiscountPer', 'discountAmt', 'netPayableAmt',
      'concessionReasonId', 'servicedoctorId'];

    controlsToRemove.forEach(key => delete formValue[key]);
    console.log(formValue)

    console.log("Form values", formValue)

    // return;
    if (!this.myForm.invalid) {
      this._appointmentService.appointmentMasterSave(formValue).subscribe((response) => {
        this.onClose();
      });
    } else {
      const invalidFields = this.collectErrors(this.myForm);
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastrService.warning(`Field "${field}" is invalid.`, 'Warning');
        });
        return;
      }
    }
  }

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

  onClose() {
    this.myForm.reset();
    this.dialogRef.close();
  }

  getValidationMessages() {
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
      MaritalStatusId: [
        { Message: "Mstatus Name is required" }
      ],
      UnitId: [
        { name: "required", Message: "Unit Name is required" }
      ]
    };
  }
}
