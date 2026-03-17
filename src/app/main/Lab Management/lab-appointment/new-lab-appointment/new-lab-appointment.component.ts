import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { ChargesList, LabPatientList } from '../../lab-patient-reg/lab-patient-reg.component';
import { LabAppointmentService } from '../lab-appointment.service';
import { MatTableDataSource } from '@angular/material/table';

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

  vFirstNameConfig: any;
  vmiddleNameConfig: any;
  vlastNameConfig: any;
  patientTypeList: any = [];
  VlabPatRegId: any;
  ApiURL: any = '';
  vTariffId: any = 1;
  vClassId: any = 1;
  dateTimeObj: any;
  isExpanded2 = true;

  isCompanySelected: boolean = false;
  isTariffSelect: boolean = false;
  patienttype = 0
  UnitId: any = this.accountService.currentUserValue.user.unitId;
  vRefDocId: any = 0
  vRefDocName: any = ''
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
  doctorID = 0
  refDocID = 0

  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
  @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
  @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
  @ViewChild('ddlcompanyExec') ddlcompanyExec: AirmidDropDownComponent;

   displayedServiceselected: string[] = [
    'ServiceName',
    'Price',
    'buttons'
  ]

  constructor(public _appointmentService: LabAppointmentService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewLabAppointmentComponent>,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public _formbuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private accountService: AuthenticationService,
    private hospitalconfigservice: HospitalConfigService,
    public toastrService: ToastrService, public _ConfigService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configue: ConfigService,
    private apiCaller: ApiCaller,
  ) { }

  ngOnInit(): void {
    this.myForm = this.CreateMyForm();
    this.myForm.markAllAsTouched();

    const Type = 'LabPatientType'
    this._appointmentService.getPatientType(Type).subscribe(res => {
      this.patientTypeList = res;
      const normalType = this.patientTypeList.find(
        (item: any) => item.name === 'Normal'
      );

      if (normalType) {
        this.myForm.get('patientType')?.setValue(normalType.constantId);
      }
    });

    console.log("retrive Data:", this.data)

    this.myForm.get('refDocId').setValue(this.data?.refdoctorId);

    this.ApiURL = "VisitDetail/search-GetServiceListwithTraiff?TariffId=" + this.vTariffId + "&ClassId=" + 1 + "&SrvcName="

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
      ServiceId: [''],
      LabPatRegId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      regDate: [new Date()],
      regTime: [],
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
      doctorId: [0],
      refDocId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      patientType: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    })
  }

  prefixName: any;
  onChangePrefix(e) {
    this.prefixName = e.prefixName
    this.ddlGender.SetSelection(e.sexId);
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

  SrvcName1: any = "";
  serviceId: any;
  vQty: any;
  chkIsEditable: boolean = true;
  serviceSelct = false
  @ViewChild('serviceInput', { read: ElementRef }) serviceInput!: ElementRef;

  getSelectedserviceObj(obj) {
    console.log(obj)
    this.SrvcName1 = obj.serviceName;
    this.serviceId = obj.serviceId;
    this.vQty = 1;
    this.serviceSelct = true
    this.onSaveEntry(obj);

    this.myForm.get('ServiceId')?.reset();

    setTimeout(() => {
      const input = this.serviceInput.nativeElement.querySelector('input');
      input?.focus();
    }, 150);
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

  public packageList: ChargesList[] = [];
  public chargeList: ChargesList[] = [];
  public dstable1 = new MatTableDataSource<ChargesList>();
  onAddCharges(row): void {
    // debugger
    const newRow = {
      ServiceId: row.serviceId,
      ServiceName: row.serviceName,
      Price: row.price ?? 0,
      serviceCode: 0,//formValue.serviceName.companyCode, 
      isInclusionExclusion: true,//formValue.serviceName.isInclusionOrExclusion
    };
    const newCharge = new ChargesList(newRow);
    this.chargeList.push(newCharge);
    this.dstable1.data = this.chargeList;
  }

  chargeslist: any = [];
  deleteTableRow(element) {
    debugger
    this.chargeslist = this.dstable1.data;
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {

      this.chargeslist.splice(index, 1);
      this.dstable1.data = [];
      this.dstable1.data = this.chargeslist;
    }
    this.toastrService.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }


  regflag = false
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
            firstName: this.registerObj.firstName.trim(),
            middleName: this.registerObj.middleName.trim(),
            LastName: this.registerObj.lastName.trim(),
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

  handleInputChange(changedField: string): void {
    // Get all current field values
    // debugger
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
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  BillSave() {

  }
  onClose() {
    this.myForm.reset();
    this.dialogRef.close();
  }

  onChangeRefdoc(value) {
    this.vRefDocId = value.doctorId
    this.vRefDocName = value.doctorName
    this.myForm.get('refDocId').setValue(value.doctorId);
  }

  onChangeCompany(value) {
    this.companyId = value.companyId
    this.companyName = value.companyName
    if (this.companyId) {
      this.isTariffSelect = true
    }
    this._appointmentService.getCompanyById(value.companyId).subscribe((response) => {
      this.companyDet = response;
      this.myForm.get('tariffId').setValue(this.companyDet.traiffId);
      this.vTariffId = this.companyDet.traiffId

      this.ApiURL = "VisitDetail/search-GetServiceListwithTraiff?TariffId=" + this.vTariffId + "&ClassId=" + 1 + "&SrvcName="
    });
  }

  onChangeTariff(value) {
    this.vTariffId = value.value
    this.ApiURL = "VisitDetail/search-GetServiceListwithTraiff?TariffId=" + this.vTariffId + "&ClassId=" + 1 + "&SrvcName="
  }

  onChangePatient(value) {
    var mode = "Company"
    if (value.text != "Self") {
      this._appointmentService.getMaster(mode, 1);
      this.myForm.get('companyId').setValidators([Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]);
      // this.isCompanySelected = true;
      this.myForm.get('companyId').enable()
      this.myForm.get('refDocId').setValue(0);
      this.patienttype = 2;
      this.myForm.get('refDocId').disable()
      this.myForm.get('refDocId').clearValidators();
      this.myForm.get('refDocId').updateValueAndValidity();

    } else if (value.text == "Self") {
      // this.isCompanySelected = false;      
      this.patienttype = 1;
      this.myForm.get('refDocId').setValidators([Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]);
      this.myForm.get('refDocId').enable()
      this.myForm.get('companyId').setValue(0);
      this.myForm.get('tariffId').setValue(1);
      this.isTariffSelect = false //tariff not readonly
      this.myForm.get('companyId').disable()
      this.myForm.get('companyId').clearValidators();
      this.myForm.get('companyId').updateValueAndValidity();
    }
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
      patientTypeId: [
        { name: "required", Message: "Country Name is required" }
      ],
      tariffId: [
        { name: "required", Message: "Mstatus Name is required" }
      ],
      DoctorID: [
        { name: "required", Message: "Doctor Name is required" }
      ],
      refDocId: [
        { name: "required", Message: "Ref Doctor Name is required" }
      ],
      companyId: [
        { name: "required", Message: "Company Name is required" }
      ],
      patientTypeValue: [
        { name: "required", Message: "PatientType is required" }
      ],
      UnitId: [
        { name: "required", Message: "Unit Name is required" }
      ]
    };
  }
}
