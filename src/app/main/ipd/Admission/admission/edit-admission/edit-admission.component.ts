///
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdmissionService } from '../admission.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe, Time } from '@angular/common';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Router } from '@angular/router';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { RegistrationService } from 'app/main/opd/registration/registration.service';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import {  AdmissionPersonlModel, Bed, RegInsert } from '../admission.component';
import { Console } from 'console';


@Component({
  selector: 'app-edit-admission',
  templateUrl: './edit-admission.component.html',
  styleUrls: ['./edit-admission.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EditAdmissionComponent implements OnInit {
personalFormGroup: FormGroup;
  admissionFormGroup: FormGroup;
  wardFormGroup: FormGroup;
  otherFormGroup: FormGroup;
  searchFormGroup: FormGroup;
 

  options = [];
  msg: any = [];
  optionRegSearch: any[] = [];
  subscriptionArr: Subscription[] = [];

  
 
  filteredOptions: any;
  registration: any;
  matDialogRef: any;
  patienttype:any;
  capturedImage: any;

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

  reportPrintObj: AdmissionPersonlModel;
  printTemplate: any;
  selectedAdvanceObj: AdvanceDetailObj;
  registerObj = new AdmissionPersonlModel({});
  registerObj1=new RegInsert({});
  bedObj = new Bed({});
  newRegSelected: any = 'registration';
  filteredOptionsRegSearch: Observable<string[]>;

 
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
    public dialogRef: MatDialogRef<EditAdmissionComponent>,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  
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
  autocompleteModerelationship: string = "Relationship";
  autocompleteModehospital: string = "Hospital";

  ngOnInit(): void {
    this.isAlive = true;
    this.admissionFormGroup = this.createAdmissionForm();
    this.otherFormGroup = this.otherForm();
    this.searchFormGroup=this.createSearchForm();

    if (this.data) {
      console.log(this.data)
      this.registerObj = this.data.row;
      
    }

  }


 
  createAdmissionForm() {
    return this.formBuilder.group({
      AdmissionId: 0,
      RegId: 0,
      AdmissionDate:  [(new Date()).toISOString()],
      AdmissionTime:  [(new Date()).toISOString()],
      PatientTypeId: 1,
      HospitalID: 0,
      DocNameId: 0,
      RefDocNameId: 0,
      WardId: 0,
      Bedid: 0,
      DischargeDate: "2024-08-10",
      DischargeTime: "2024-09-18T11:24:02.655Z",
      IsDischarged: 0,
      IsBillGenerated: 0,
      CompanyId: 0,
      TariffId: 0,
      ClassId: 0,
      DepartmentId: 0,
      RelativeName: "",
      RelativeAddress: "string",
      PhoneNo: "",
      MobileNo: "",
      RelationshipId: 0,
      AddedBy: 1,
      IsMlc: true,
      MotherName: "",
      AdmittedDoctor1: 0,
      AdmittedDoctor2: 0,
      RefByTypeId: 0,
      RefByName: 0,
      SubTpaComId: 0,
      PolicyNo: "string",
      AprovAmount: 0,
      compDOd: [(new Date()).toISOString()],
      IsOpToIpconv: true,
      RefDoctorDept: "string",
      AdmissionType: 1
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
  CompanyId=0;
  SubCompanyId=0;
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

    // if (!this.admissionFormGroup.invalid &&  !this.otherFormGroup.invalid) {
    
      let submitData = {
        "AdmissionReg": this.personalFormGroup.value,
        "ADMISSION": this.admissionFormGroup.value
      };
      console.log(submitData);

          this._AdmissionService.AdmissionNewInsert(submitData).subscribe(response => {
        this.toastr.success(response.message);
        this.onClear();
    }, (error) => {
        this.toastr.error(error.message);
      
      });

    
  }
  Close(){}
  onClear(){}


dateTimeObj: any;
getDateTime(dateTimeObj) {
  console.log('dateTimeObj==', dateTimeObj);
  this.dateTimeObj = dateTimeObj;
}

onReset() {
   this.admissionFormGroup = this.createAdmissionForm();
   this.otherFormGroup = this.otherForm();
 
  this.isCompanySelected = false;
  // this.admissionFormGroup.get('CompanyId').setValue(this.CompanyList[-1]);
  this.admissionFormGroup.get('CompanyId').clearValidators();
  this.admissionFormGroup.get('SubCompanyId').clearValidators();
  this.admissionFormGroup.get('CompanyId').updateValueAndValidity();
  this.admissionFormGroup.get('SubCompanyId').updateValueAndValidity();


}

}