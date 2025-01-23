import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Admission, AdmissionPersonlModel, Bed, RegInsert } from '../admission.component';
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
import { AirmidAutocompleteComponent } from 'app/main/shared/componets/airmid-autocomplete/airmid-autocomplete.component';

@Component({
  selector: 'app-new-admission',
  templateUrl: './new-admission.component.html',
  styleUrls: ['./new-admission.component.scss']
})
export class NewAdmissionComponent implements OnInit {

  personalFormGroup: FormGroup;
  admissionFormGroup: FormGroup;
  wardFormGroup: FormGroup;
  otherFormGroup: FormGroup;
  searchFormGroup: FormGroup;


  
  registration: any;
  matDialogRef: any;

  msg: any = [];
  optionRegSearch: any[] = [];
  subscriptionArr: Subscription[] = [];

  filteredOptionsRegSearch: Observable<string[]>;
 
  filteredOptions: any;

 
  saveflag: boolean = false;
  isCompanySelected: boolean = false;
  Regflag: boolean = false;
  showtable: boolean = false;
  Regdisplay: boolean = false;
  isAlive = false;
  savedValue: number = null;
  submitted = false;
  isLinear = true;
  noOptionFound: boolean = false;
  isRegSearchDisabled: boolean = true;

  reportPrintObj: Admission;
  printTemplate: any;
  selectedAdvanceObj: AdvanceDetailObj;
  registerObj = new AdmissionPersonlModel({});
  registerObj1=new RegInsert({});
  bedObj = new Bed({});
  newRegSelected: any = 'registration';


  capturedImage: any;
  options = [];

  patienttype:any;

  currentDate = new Date();
  public now: Date = new Date();
  isLoading: string = '';
  screenFromString = 'admission-form';

  @Input() panelWidth: string | number;
  @ViewChild('admissionFormStepper') admissionFormStepper: MatStepper;
  @ViewChild('multiUserSearch') multiUserSearchInput: ElementRef;


  constructor(public _AdmissionService: AdmissionService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewAdmissionComponent>,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }



  autocompleteModeprefix: string = "Prefix";
  autocompleteModemaritalstatus: string = "MaritalStatus";
  autocompleteModearea: string = "Area";
  autocompleteModecity: string = "City";
  autocompleteModereligion: string = "Religion";
  autocompleteModegender: string = "GenderByPrefix";
  autocompleteModestatus: string = "StateByCity";
  autocompleteModecountry: string = "CountryByState";
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

  @ViewChild('ddlGender') ddlGender: AirmidAutocompleteComponent;
      @ViewChild('ddlState') ddlState: AirmidAutocompleteComponent;
      @ViewChild('ddlCountry') ddlCountry: AirmidAutocompleteComponent;
  

  ngOnInit(): void {
    this.isAlive = true;
    this.personalFormGroup = this.createPesonalForm();
    this.admissionFormGroup = this.createAdmissionForm();

    if (this.data) {
      console.log(this.data)
      this.registerObj = this.data.row;
      
    }

  }


  createPesonalForm() {
    return this.formBuilder.group({
      RegId: [0],
      RegNo: '1',
      PrefixId: ['', [Validators.required]],
      FirstName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
      ]],
      MiddleName: ['', [
        Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
      ]],
      LastName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z () ]*[a-zA-z() ]*$"),
      ]],
      GenderId: new FormControl('', [Validators.required]),
      Address: '',
      dateOfBirth: [(new Date()).toISOString()],
      Age: ['0'],
      AgeYear: ['0', [
        // Validators.required,
        Validators.maxLength(3),
        Validators.pattern("^[0-9]*$")]],
      AgeMonth: ['0', [
        Validators.pattern("^[0-9]*$")]],
      AgeDay: ['0', [
        Validators.pattern("^[0-9]*$")]],
      PhoneNo: ['', [Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      MobileNo: ['', [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      aadharCardNo: ['', [Validators.required,
      Validators.minLength(12),
      Validators.maxLength(12),
      Validators.pattern("^[0-9]*$")
      ]],
      panCardNo: 'ds',
      MaritalStatusId: '',
      ReligionId: 0,
      AreaId: '',
      CityId: '',
      City: ['d'],
      StateId: '',
      CountryId: '',
      IsCharity: false,
      IsSeniorCitizen: false,
      AddedBy: 1,
      updatedBy: 1,
      RegDate: [(new Date()).toISOString()],
      RegTime: [(new Date()).toISOString()],
      Photo: [''],
      PinNo: [''],
      IsHealthCard: 0
    });
  }
  createAdmissionForm() {
    return this.formBuilder.group({
      AdmissionId: '',
      RegId: '',
      AdmissionDate: "2024-08-10",
      AdmissionTime: "2024-09-18T11:24:02.655Z",
      PatientTypeId: 1,
      HospitalID: 230,
      DocNameId: 130,
      RefDocNameId: 2320,
      WardId: 30,
      Bedid: 80,
      DischargeDate: "2024-08-10",
      DischargeTime: "2024-09-18T11:24:02.655Z",
      IsDischarged: 0,
      IsBillGenerated: 0,
      CompanyId: 310,
      TariffId: 310,
      ClassId: 310,
      DepartmentId: 810,
      RelativeName: "SHAM",
      RelativeAddress: "string",
      PhoneNo: "11211111",
      MobileNo: "string",
      RelationshipId: 0,
      AddedBy: 20,
      IsMlc: true,
      MotherName: "string",
      AdmittedDoctor1: 20,
      AdmittedDoctor2: 110,
      RefByTypeId: 0,
      RefByName: 0,
      SubTpaComId: 0,
      PolicyNo: "string",
      AprovAmount: 12110,
      compDOd: "2024-08-10",
      IsOpToIpconv: true,
      RefDoctorDept: "string",
      AdmissionType: 1
    });
  }

  wardForm() {
    return this.formBuilder.group({
      RoomId: '',
      BedId: ['', [Validators.required]],
      ClassId: ['', [Validators.required]],
    });
  }

  otherForm() {
    return this.formBuilder.group({
      RelativeName: '',
      RelativeAddress: '',
      RelatvieMobileNo: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      RelationshipId: '',
      IsMLC: [false],
      OPIPChange: [false],
      IsCharity: [false],
      IsSenior: [false],
      Citizen: [false],
      Emergancy: [false],
      template: [false]
    });
  }
  createSearchForm() {
    return this.formBuilder.group({
      regRadio: ['registration'],
      RegId: [{ value: '', disabled: this.isRegSearchDisabled }]
    });
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
        { name: "required", Message: "mobileNo Name is required" }
      ],
      PhoneNo: [
        { name: "required", Message: "Phone is required" }
      ],
      aadharCardNo: [
        { name: "required", Message: "aadharCardNo is required" }
      ],

      maritalStatusId: [
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
      HospitalId:[
        { name: "required", Message: "HospitalId Name is required" }
      ]
    };
  }





  ///New Admission 
  //Radio btn
  onChangeReg(event) {
    if (event.value == 'registration') {
      this.Regflag = false;
      this.personalFormGroup.get('RegId').reset();
      this.personalFormGroup.get('RegId').disable();
      // this.isRegSearchDisabled = true;
      this.registerObj = new AdmissionPersonlModel({});
      this.personalFormGroup.reset();

      this.personalFormGroup = this.createPesonalForm();
      this.admissionFormGroup = this.createAdmissionForm();
      this.wardFormGroup = this.wardForm();
      this.otherFormGroup = this.otherForm();

      this.Regdisplay = false;
      this.showtable = false;

    } else {
      this.Regdisplay = true;
      this.Regflag = true;
      this.searchFormGroup.get('RegId').enable();
      // this.isRegSearchDisabled = false;

      this.personalFormGroup = this.createPesonalForm();
      this.personalFormGroup.markAllAsTouched();


      this.showtable = true;
    }

    const todayDate = new Date();
    const dob = new Date(this.currentDate);
    const timeDiff = Math.abs(Date.now() - dob.getTime());
    this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
    this.registerObj.AgeDay = Math.abs(todayDate.getDate() - dob.getDate());
    this.registerObj.DateofBirth = this.currentDate;
    this.personalFormGroup.get('DateOfBirth').setValue(this.currentDate);

  }
  //register patient list

  getSearchList() {
    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegId').value}%` || '%'
    }
    if (this.searchFormGroup.get('RegId').value.length >= 1) {
      this._AdmissionService.getRegistrationList(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        console.log(this.filteredOptions)
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }
  }


  //Date 
  dateStyle?: string = 'Date';

  onBedChange(value) {
    this.bedObj = value;
  }

  AdmittedRegId: any = 0;
  chekAdmittedpatient(obj) {

    this.AdmittedRegId = obj.RegId;

    let Query = "select isnull(RegID,0) as RegID from Admission where RegID =  " + this.AdmittedRegId + " and Admissionid not in(select Admissionid from Discharge) "
    console.log(Query)
    this._AdmissionService.getRegIdDetailforAdmission(Query).subscribe(data => {
      this.registerObj = data[0];
      console.log(this.registerObj);
      if (this.registerObj != undefined) {
        this.AdmittedRegId = 0;
        Swal.fire("selected patient is already admitted!!..")
        this.onReset();
        this.personalFormGroup.get('RegId').reset();
        // this.regno.nativeElement.focus();
      } else {
        this.getSelectedObj(obj);
      }
    });

  }
  getSelectedObj(obj) {
    this.registerObj = new AdmissionPersonlModel({});
    obj.AgeDay = obj.AgeDay.trim();
    obj.AgeMonth = obj.AgeMonth.trim();
    obj.AgeYear = obj.AgeYear.trim();
    this.registerObj = obj;
    console.log(this.registerObj);
    // this.PatientName = obj.PatientName;
    // this.RegId = obj.RegId;
    // this.RegNo = obj.RegNo;
    // this.vReligionId = obj.ReligionId;
    // this.vAreaId = obj.AreaId
    // this.vMaritalStatusId = obj.MaritalStatusId;
  
  }
 
  onNewSave() {

    if ((!this.personalFormGroup.invalid && !this.admissionFormGroup.invalid && !this.wardFormGroup.invalid && !this.otherFormGroup.invalid)) {

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
    }
  }

  CompanyId: any = 0;
  SubCompanyId: any = 0;
  OnSaveAdmission() {
    if (this.patienttype != 2) {
      this.CompanyId = 0;
      this.SubCompanyId = 0;
    } else if (this.patienttype == 2) {

      this.CompanyId = this.admissionFormGroup.get('CompanyId').value.value;
      this.SubCompanyId = this.admissionFormGroup.get('SubCompanyId').value.value;

      if ((this.CompanyId == 0 || this.CompanyId == undefined || this.SubCompanyId == 0)) {
        this.toastr.warning('Please select Company.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    // if (!this.personalFormGroup.invalid && !this.admissionFormGroup.invalid && !this.wardFormGroup.invalid && !this.otherFormGroup.invalid) {
    if (this.searchFormGroup.get('regRadio').value == "registration") {
      //Api
      this.isLoading = 'submit';
      let submissionObj = {};
      let regInsert = {};
      let admissionNewInsert = {};

      // this.VisitFormGroup.get("regId").setValue(this.registerObj.regId)
      // this.VisitFormGroup.get("patientOldNew").setValue(2)


      let submitData = {
        "AdmissionReg": this.personalFormGroup.value,
        "ADMISSION": this.admissionFormGroup.value
      };
      console.log(submitData);

      let BedStatusUpdate = {};
      BedStatusUpdate['BedId'] = this.wardFormGroup.get('BedId').value.value ? this.wardFormGroup.get('BedId').value.value : 0;

      submissionObj['bedStatusUpdate'] = BedStatusUpdate;

      console.log(submissionObj);
      this._AdmissionService.AdmissionNewInsert(submissionObj).subscribe(response => {

        if (response) {
          this.toastr.success('Admission save Successfully !', 'Congratulations !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.getAdmittedPatientCasepaperview(response, true);
          this.onReset();
        } else {
          this.toastr.success('Admission not saved', 'error', {
            toastClass: 'tostr-tost custom-toast-success',
          });
        }
        this.isLoading = '';
      });


    }
      else { 

  
        let submitData = {
          "AdmissionReg": this.personalFormGroup.value,
          "ADMISSION": this.admissionFormGroup.value
        };
        console.log(submitData);
      
        this._AdmissionService.InsertNewAdmission(submitData).subscribe((response) => {
          this.toastr.success(response.message); 
          this.onClose();
          this._matDialog.closeAll();
          this.getAdmittedPatientCasepaperview(response, true);
          this.onReset();

        }, (error) => {
          this.toastr.error(error.message);
        });

     }
    
  }


  onClose() {

    this.searchFormGroup.get('RegId').reset();
    this.searchFormGroup.get('RegId').disable();
    this.isCompanySelected = false;
    // this.admissionFormGroup.get('CompanyId').setValue(this.CompanyList[-1]);
    this.admissionFormGroup.get('CompanyId').clearValidators();
    this.admissionFormGroup.get('SubCompanyId').clearValidators();
    this.admissionFormGroup.get('CompanyId').updateValueAndValidity();
    this.admissionFormGroup.get('SubCompanyId').updateValueAndValidity();
    this.patienttype = 1;
    this.personalFormGroup.get('CityId').reset();
  }
  onReset() {
    // this._AdmissionService.mySaveForm.reset();
    this.personalFormGroup.get('RegId').reset();
    this.personalFormGroup.get('RegId').disable();

    if (this.searchFormGroup.get('regRadio').value == "registration")
      this.searchFormGroup.get('RegId').disable();
    else
      this.searchFormGroup.get('RegId').enable();


    this.registerObj = new AdmissionPersonlModel({});
    this.personalFormGroup.reset();

    this.personalFormGroup = this.createPesonalForm();
    this.personalFormGroup.markAllAsTouched();

    this.admissionFormGroup = this.createAdmissionForm();
    this.admissionFormGroup.markAllAsTouched();

    this.wardFormGroup = this.wardForm();
    this.wardFormGroup.markAllAsTouched();

    this.otherFormGroup = this.otherForm();
    this.otherFormGroup.markAllAsTouched()

    // this.admissionFormGroup.get('CompanyId').setValue(this.CompanyList[-1]);
    this.admissionFormGroup.get('CompanyId').clearValidators();
    this.admissionFormGroup.get('SubCompanyId').clearValidators();
    this.admissionFormGroup.get('CompanyId').updateValueAndValidity();
    this.admissionFormGroup.get('SubCompanyId').updateValueAndValidity();


  }
  AdList: boolean = false;
  SpinLoading: boolean = false;
  getAdmittedPatientCasepaperview(AdmissionId, flag) {
    
    let AdmissionID
    if (flag) {
      AdmissionID = AdmissionId
    } else {
      AdmissionID = AdmissionId.AdmissionID
    }

    setTimeout(() => {
      this.SpinLoading = true;
      this.AdList = true;
      this._AdmissionService.getAdmittedPatientCasepaaperView(
        AdmissionID
      ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Admission Paper  Viewer"
            }
          });

        matDialog.afterClosed().subscribe(result => {
          this.AdList = false;
          
        });
      });

    }, 100);
  }

  onChangePrefix(e) {
    this.ddlGender.SetSelection(e.sexId);
}

onChangestate(e) {
    this.ddlCountry.SetSelection(e.stateId);
}

onChangecity(e) {
    this.ddlState.SetSelection(e.cityId);
    this.ddlCountry.SetSelection(e.stateId);
}

dateTimeObj: any;
getDateTime(dateTimeObj) {
  console.log('dateTimeObj==', dateTimeObj);
  this.dateTimeObj = dateTimeObj;
}





}

