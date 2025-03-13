import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AdmissionPersonlModel, Bed, RegInsert } from '../admission.component';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AdmissionService } from '../admission.service';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { IPDSearcPatienthComponent } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import Swal from 'sweetalert2';
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { fuseAnimations } from '@fuse/animations';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';

@Component({
  selector: 'app-new-admission',
  templateUrl: './new-admission.component.html',
  styleUrls: ['./new-admission.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewAdmissionComponent implements OnInit {

  personalFormGroup: FormGroup;
  admissionFormGroup: FormGroup;
  wardFormGroup: FormGroup;
  otherFormGroup: FormGroup;
  searchFormGroup: FormGroup;


  options = [];
  msg: any = [];
  optionRegSearch: any[] = [];
  subscriptionArr: Subscription[] = [];

  matDialogRef: any;
  patienttype: any;
  AdmissionId: any = 0;
  isCompanySelected: boolean = false;
  Regflag: boolean = false;
  Regdisplay: boolean = false;
  isAlive = false;
  savedValue: number = null;
  submitted = false;
  isLinear = true;
  noOptionFound: boolean = false;
  isRegSearchDisabled: boolean = true;
  registredflag: boolean = true;

  printTemplate: any;
  selectedAdvanceObj: AdvanceDetailObj;
  newRegSelected: any = 'registration';
  filteredOptionsRegSearch: Observable<string[]>;
  registerObj1 = new AdmissionPersonlModel({});
  registerObj = new RegInsert({});

  currentDate = new Date();
  public now: Date = new Date();
  isLoading: string = '';
  screenFromString = 'admission-form';

  @Input() panelWidth: string | number;
  @ViewChild('admissionFormStepper') admissionFormStepper: MatStepper;
  @ViewChild('multiUserSearch') multiUserSearchInput: ElementRef;
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
  @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
  @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;


  constructor(public _AdmissionService: AdmissionService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewAdmissionComponent>,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private commonService: PrintserviceService,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
    this.personalFormGroup = this._AdmissionService.createPesonalForm();
    this.admissionFormGroup = this._AdmissionService.createAdmissionForm();
  }

  autocompleteModeprefix: string = "Prefix";
  autocompleteModemaritalstatus: string = "MaritalStatus";
  autocompleteModearea: string = "Area";
  autocompleteModecity: string = "City";
  autocompleteModereligion: string = "Religion";
  autocompleteModegender: string = "Gender";
  autocompleteModestatus: string = "StateByCity";
  autocompleteModecountry: string = "Country";
  autocompleteModerelationship: string = "Relationship";
  autocompleteModepatienttype: string = "PatientType";
  autocompleteModetariff: string = "Tariff";
  autocompleteModeDepartment: string = "Department";
  autocompleteModeRefDoctor: string = "RefDoctor";
  autocompleteModeDoctor: string = "ConDoctor";
  autocompleteModeCompany: string = "Company";
  autocompleteModeSubCompany: string = "SubCompany";
  autocompleteModeWardName: string = "Room";
  autocompleteModeBedName: string = "Bed";
  autocompleteModeClass: string = "Class";
  autocompleteModemstatus: string = "MaritalStatus";
  autocompleteModestate: string = "State";

  autocompleteModehospital: string = "Hospital";

 ngOnInit(): void {
   this.searchFormGroup = this.createSearchForm();
    this.personalFormGroup.markAllAsTouched();
    this.admissionFormGroup.markAllAsTouched();

    if (this.AdmissionId)
      this.searchFormGroup.get("regRadio").setValue("registrered")
  }


  createSearchForm() {
    return this.formBuilder.group({
      regRadio: ['registration'],
      RegId: [{ value: '', disabled: this.isRegSearchDisabled }],
      HospitalId: 1
    });
  }

  getSelectedObj(obj) {
    console.log(obj)
    // this.RegOrPhoneflag = 'Entry from Registration';
    
    if ((obj.value ?? 0) > 0) {

      console.log(this.data)
      setTimeout(() => {
        this._AdmissionService.getRegistraionById(obj.value).subscribe((response) => {
          this.registerObj = response;
          console.log(this.registerObj)

        });

      }, 500);
    }

  }

  chkHealthcard(e) { }
  ///New Admission 
  //Radio btn
  onChangeReg(event) {
    if (event.value == 'registration') {
      this.Regflag = false;
      this.personalFormGroup.get('RegId').reset();
      this.personalFormGroup.get('RegId').disable();
      // this.isRegSearchDisabled = true;
      this.registerObj1 = new AdmissionPersonlModel({});
      this.personalFormGroup.reset();

      this.personalFormGroup = this._AdmissionService.createPesonalForm();
      this.admissionFormGroup = this._AdmissionService.createAdmissionForm();

      this.Regdisplay = false;
      // this.showtable = false;

    } else {
      this.Regdisplay = true;
      this.Regflag = true;
      this.searchFormGroup.get('RegId').enable();
      // this.isRegSearchDisabled = false;

      this.personalFormGroup = this._AdmissionService.createPesonalForm();
      this.personalFormGroup.markAllAsTouched();
      this.admissionFormGroup.markAllAsTouched();


      // this.showtable = true;
    }

   
  }

  onNewSave() {

    if (!this.personalFormGroup.invalid && !this.admissionFormGroup.invalid ){

    Swal.fire({
      title: 'Do you want to Save the Admission ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save!"

    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.OnSaveAdmission();
      }
    })
    }else{
      Swal.fire("Enter Peroepr values..orm Id Invalid")
    }
  }


  onChangePatient(value) {
    
    var mode = "Company"
    if (value.text != "Self") {
      this._AdmissionService.getMaster(mode, 1);
      this.admissionFormGroup.get('CompanyId').setValidators([Validators.required]);
      this.isCompanySelected = true;
      this.patienttype = 2;
    } else if (value.text == "Self") {
      this.isCompanySelected = false;
      this.admissionFormGroup.get('CompanyId').clearValidators();
      this.admissionFormGroup.get('SubCompanyId').clearValidators();
      this.admissionFormGroup.get('CompanyId').updateValueAndValidity();
      this.admissionFormGroup.get('SubCompanyId').updateValueAndValidity();
      this.patienttype = 1;
    }


  }

  OnSaveAdmission() {

    this.personalFormGroup.get('RegDate').setValue(this.datePipe.transform(this.personalFormGroup.get('RegDate').value, 'yyyy-MM-dd'))
    this.admissionFormGroup.get('AdmissionDate').setValue(this.datePipe.transform(this.admissionFormGroup.get('AdmissionDate').value, 'yyyy-MM-dd'))

     if (this.isCompanySelected && this.admissionFormGroup.get('CompanyId').value == 0) {
      this.toastr.warning('Please select valid Company ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    
    if (this.searchFormGroup.get('regRadio').value == "registration" && this.AdmissionId == 0) {

      let submitData = {
        "AdmissionReg": this.personalFormGroup.value,
        "ADMISSION": this.admissionFormGroup.value
      };
      console.log(submitData);

      this._AdmissionService.AdmissionNewInsert(submitData).subscribe(response => {
        console.log(response)
        this.toastr.success(response.message);
        this.getAdmittedPatientCasepaperview(response.admissionId);
        this.onClear();
        this._matDialog.closeAll();
       
      }, (error) => {
        this.toastr.error(error.message);

      });


    }
    else {
     
      let submitData = {
        "AdmissionReg": this.personalFormGroup.value,
        "ADMISSION": this.admissionFormGroup.value
      };
      console.log(submitData);

      this._AdmissionService.AdmissionRegisteredInsert(submitData).subscribe(response => {
        this.toastr.success(response.message);
        console.log(response)
        this.getAdmittedPatientCasepaperview(response.admissionId);
        this.onClear();
        this._matDialog.closeAll();
      }, (error) => {
        this.toastr.error(error.message);

      });
    }
  }


  selectChangedepartment(obj: any) {
    
    console.log(obj)
    this._AdmissionService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
      this.ddlDoctor.options = data;
      this.ddlDoctor.bindGridAutoComplete();
    });
  }
 

  getAdmittedPatientCasepaperview(AdmissionId) {
       this.commonService.Onprint("AdmissionId", AdmissionId, "IpCasepaperReport");
  }

  displayFn(user: any): string {
    return user.text;
  }
  onChangePrefix(e) {
    this.ddlGender.SetSelection(e.sexId);
  }

  onChangestate(e) {
    // this.ddlCountry.SetSelection(e.stateId);
  }

  // onChangecity(e) {
  //   this.ddlState.SetSelection(e.cityId);
  //   this.ddlCountry.SetSelection(e.stateId);
  // }

  onChangecity(e) {
    console.log(e)
    this.registerObj.stateId=e.stateId
    this._AdmissionService.getstateId(e.stateId).subscribe((Response)=>{
        console.log(Response)
        this.ddlCountry.SetSelection(Response.countryId);
    });

  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
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
        // { name: "required", Message: "phoneNo No is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ],
      aadharCardNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "AadharCard No is required" },
        { name: "minLength", Message: "12 digit required." },
        { name: "maxLength", Message: "More than 12 digits not allowed." }
      ],
      MaritalStatusId: [
        { name: "required", Message: "Mstatus Name is required" }
      ],
      AdmittedDoctor1: [
        { name: "required", Message: "AdmittedDoctor1 is required" }
      ],
      AdmittedDoctor2: [
        { name: "required", Message: "AdmittedDoctor2 is required" }
      ],
      RefDocNameId: [
        { name: "pattern", Message: "RefDocNameId allowed" },

      ],
      CompanyId: [
        { name: "pattern", Message: "CompanyId Only numbers allowed" },

      ],
      SubTpaComId: [
        { name: "pattern", Message: "Only numbers allowed" },
      ],
      bedId: [
        { name: "required", Message: "Bedid is required" }
      ],
      wardId: [
        { name: "required", Message: "wardId is required" }
      ],
      ClassId: [
        { name: "required", Message: "ClassId is required" }
      ],
      RelativeName: [
        { name: "required", Message: "RelativeName is required" }
      ],
      RelativeAddress: [
        { name: "required", Message: "RelativeAddress is required" }
      ],

      RelationshipId: [
        { name: "required", Message: "RelationshipId is required" }
      ],
      DepartmentId: [
        { name: "required", Message: "DepartmentId is required" }
      ],
      DocNameId: [
        { name: "required", Message: "DocNameId Name is required" }
      ],
      TariffId: [
        { name: "required", Message: "TariffId Name is required" }
      ],
      PatientTypeId: [
        { name: "required", Message: "PatientTypeId Name is required" }
      ],
      HospitalId: [
        { name: "required", Message: "HospitalId Name is required" }
      ],
      RphoneNo: [
        { name: "required", Message: "RelatvieMobileNo Name is required" }
      ],
      docNameId: [
        { name: "required", Message: "RelatvieMobileNo Name is required" }
      ],
    };
  }
  onClear() { }
  onClose() {

    this.searchFormGroup.get('RegId').reset();
    this.searchFormGroup.get('RegId').disable();
    this.isCompanySelected = false;
    this.admissionFormGroup.get('CompanyId').clearValidators();
    this.admissionFormGroup.get('SubCompanyId').clearValidators();
    this.admissionFormGroup.get('CompanyId').updateValueAndValidity();
    this.admissionFormGroup.get('SubCompanyId').updateValueAndValidity();
    this.patienttype = 1;
    this.personalFormGroup.get('CityId').reset();
  }
  onReset() {
    
    this.personalFormGroup.get('RegId').reset();
    this.personalFormGroup.get('RegId').disable();

    if (this.searchFormGroup.get('regRadio').value == "registration")
      this.searchFormGroup.get('RegId').disable();
    else
      this.searchFormGroup.get('RegId').enable();

    this.registerObj1 = new AdmissionPersonlModel({});
    this.personalFormGroup.reset();

    this.personalFormGroup = this._AdmissionService.createPesonalForm();
    this.personalFormGroup.markAllAsTouched();

    this.admissionFormGroup = this._AdmissionService.createAdmissionForm();
    this.admissionFormGroup.markAllAsTouched();

    this.admissionFormGroup.get('CompanyId').clearValidators();
    this.admissionFormGroup.get('SubCompanyId').clearValidators();
    this.admissionFormGroup.get('CompanyId').updateValueAndValidity();
    this.admissionFormGroup.get('SubCompanyId').updateValueAndValidity();


  }




}