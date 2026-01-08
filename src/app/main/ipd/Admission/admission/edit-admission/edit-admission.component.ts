///
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AdmissionPersonlModel, Bed, RegInsert } from '../admission.component';
import { AdmissionService } from '../admission.service';


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
  patienttype: any;

  isCompanySelected: boolean = false;
  Regflag: boolean = false;
  showtable: boolean = false;
  Regdisplay: boolean = false;
  noOptionFound: boolean = false;
  isRegSearchDisabled: boolean = true;

  reportPrintObj: AdmissionPersonlModel;
  printTemplate: any;
  registerObj1 = new AdmissionPersonlModel({});
  // registerObj2 = new AdmissionPersonlModel({});
  registerObj = new RegInsert({});
  bedObj = new Bed({});
  newRegSelected: any = 'registration';
  filteredOptionsRegSearch: Observable<string[]>;
  currentDate = new Date();
  public now: Date = new Date();
  isLoading: string = '';
  screenFromString = 'admission-form';
  autocompleteModehospital: string = "Hospital";

  constructor(public _AdmissionService: AdmissionService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<EditAdmissionComponent>,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    public toastr: ToastrService,
    public _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private commonService: PrintserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;

  autocompleteModepatienttype: string = "PatientType";
  autocompleteModetariff: string = "Tariff";
  autocompleteModeDepartment: string = "Department";
  autocompleteModeRefDoctor: string = "RefDoctor";
  autocompleteModeDoctor: string = "ConDoctor";
  autocompleteModeCompany: string = "Company";
  autocompleteModerelationship: string = "Relationship";
  autocompleteModeSubCompany: string = "SubCompany";

  ngOnInit(): void {
    this.admissionFormGroup = this.createEditAdmissionForm();
    this.admissionFormGroup.markAllAsTouched();

    if (this.data) {
      console.log(this.data)
      setTimeout(() => {
        this._AdmissionService.getDoctorsByDepartment(this.data.departmentId).subscribe((data: any) => {
          this.ddlDoctor.options = data;
          this.ddlDoctor.bindGridAutoComplete();
        });
      }, 500);
    }

   
    if ((this.data?.regId ?? 0) > 0) {
      setTimeout(() => {
        this._AdmissionService.getRegistraionById(this.data.regId).subscribe((response) => {
          this.registerObj = response;
          console.log(response)
        });

        this._AdmissionService.getAdmissionById(this.data.admissionId).subscribe((response) => {
          this.registerObj1 = response;
          console.log(response)
          if (this.registerObj1) {
            
            this.registerObj1.phoneNo = this.registerObj1.phoneNo.trim()
            this.registerObj1.mobileNo = this.registerObj1.mobileNo.trim()
            if (this.registerObj1.patientTypeId !== 1) {
              this.isCompanySelected = true
              this.admissionFormGroup.get("DepartmentId").setValue(this.registerObj1.departmentId
              )
              this.admissionFormGroup.get("CompanyId").setValue(this.registerObj1.companyId || 0)
            
            }
              this.admissionFormGroup.get("isMlc").setValue(this.registerObj1.isMlc)
              this.admissionFormGroup.get("ischarity").setValue(this.registerObj1.ischarity)
          }

        });
      }, 500);
    }
    this.admissionFormGroup = this.createEditAdmissionForm();

    this.admissionFormGroup.get("DocNameId").setValue(this.data.docNameId)
    console.log(this.accountService.currentUserValue.user)
    this.admissionFormGroup.get("hospitalId").setValue(this.accountService.currentUserValue.user.unitId)
    this.AdmissionFormSet()
    this.admissionFormGroup.get("hospitalId").setValue(this.accountService.currentUserValue.user.unitId)
   
  }

  createEditAdmissionForm() {
    
    return this._formBuilder.group({
        AdmissionId: 0,
        RegId: 0,
        AdmissionDate: [this.registerObj1?.admissionDate],
        AdmissionTime: [this.registerObj1?.admissionTime],
        PatientTypeId:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        hospitalId: [this.accountService.currentUserValue.user.unitId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        DocNameId:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        RefDocNameId: 0,
        DischargeDate: "1900-01-01",
        DischargeTime: "1900-01-01T11:24:02.655Z",
        IsDischarged:[this.registerObj1?.isDischarged],
        IsBillGenerated: [this.registerObj1?.isBillGenerated],
        CompanyId:[0],
        TariffId:[this.registerObj1?.tariffId || 0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        ClassId:[this.registerObj1?.classId || 0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        wardId:[this.registerObj1?.wardId || 0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        bedId:[this.registerObj1?.bedId || 0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        DepartmentId:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        RelativeName:this.registerObj1?.relativeName || '',
        RelativeAddress: this.registerObj1?.relativeAddress || '',
        PhoneNo: [ this.registerObj1?.phoneNo || '0',[
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
        MobileNo: [this.registerObj1?.mobileNo, [
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
        ]],
        RelationshipId:[this.registerObj1?.relationshipId || 0],
        AddedBy:this.accountService.currentUserValue.userId,
        isMlc: [false],
        ischarity: [false],
        MotherName: [this.registerObj1?.motherName || ''],
        AdmittedDoctor1:[this.registerObj1?.admittedDoctor1 || 0],
        AdmittedDoctor2:[this.registerObj1?.admittedDoctor2 || 0],
        RefByTypeId: [this.registerObj1?.refByTypeId || 0],
        RefByName:[this.registerObj1?.refByName || 0],
        SubTpaComId:[this.registerObj1?.subTpaComId || 0],
        PolicyNo:[this.registerObj1?.policyNo],
        AprovAmount:[this.registerObj1?.aprovAmount],
        compDOd: [(new Date()).toISOString()],
        IsOpToIpconv: [this.registerObj1?.isOpToIpconv || ''],
        RefDoctorDept: [this.registerObj1?.refDoctorDept || ''],
        AdmissionType:[this.registerObj1?.admittedDoctor2 || ''],
        convertId:0 
    });
}


AdmissionFormSet(){
  this.admissionFormGroup.reset({
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

}
  selectChangedepartment(obj: any) {
    this._AdmissionService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
      this.ddlDoctor.options = data;
      this.ddlDoctor.bindGridAutoComplete();
    });
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
    // this.admissionFormGroup.get('AdmissionDate').setValue(this.datePipe.transform(this.admissionFormGroup.get('AdmissionDate').value, 'yyyy-MM-dd'))
    debugger
const rawDate = this.registerObj1.admissionTime;
const [datePart, timePart] = rawDate.split(' ');
const [day, month, year] = datePart.split('-');
const isoDate = `${year}-${month}-${day}T${timePart}`;
const inputDate = new Date(isoDate);

  this.admissionFormGroup.get('AdmissionDate').setValue(this.datePipe.transform(this.registerObj1.admissionDate, 'yyyy-MM-dd'))
 this.admissionFormGroup.get('AdmissionTime')?.setValue(
  this.datePipe.transform(inputDate, 'yyyy-MM-dd hh:mm:ss a')
); 
    console.log(this.admissionFormGroup.value)

    if (this.isCompanySelected && this.admissionFormGroup.get('CompanyId').value == 0) {
      this.toastr.warning('Please select valid Company ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  console.log(this.registerObj)
 console.log( this.admissionFormGroup.value)

 this.admissionFormGroup.get('DischargeDate').setValue(this.datePipe.transform(this.registerObj1.dischargeDate, 'yyyy-MM-dd'))
    this.admissionFormGroup.get('DischargeTime').setValue(this.registerObj1.dischargeTime)
    this.admissionFormGroup.get('IsDischarged').setValue(this.registerObj1.isDischarged)
    this.admissionFormGroup.get('IsBillGenerated').setValue(this.registerObj1.isBillGenerated)
    this.admissionFormGroup.get('CompanyId').setValue(this.admissionFormGroup.get('CompanyId').value || 0)
    this.admissionFormGroup.get('RelativeAddress').setValue(this.admissionFormGroup.get('RelativeAddress').value || '')
    this.admissionFormGroup.get('PhoneNo').setValue(this.admissionFormGroup.get('PhoneNo').value || '')
    this.admissionFormGroup.get('MobileNo').setValue(this.registerObj1.mobileNo)
    this.admissionFormGroup.get('RelationshipId').setValue(this.admissionFormGroup.get('RelationshipId').value || 0)
    this.admissionFormGroup.get('AddedBy').setValue(this.registerObj1.addedBy)
    this.admissionFormGroup.get('isMlc').setValue(this.admissionFormGroup.get('isMlc').value),
    this.admissionFormGroup.get('MotherName').setValue(this.registerObj1.motherName)
    this.admissionFormGroup.get('RefByTypeId').setValue(this.registerObj1.refByTypeId)
    this.admissionFormGroup.get('RefByName').setValue(this.registerObj1.refByName)
    this.admissionFormGroup.get('SubTpaComId').setValue(this.registerObj1.subTpaComId)
    this.admissionFormGroup.get('PolicyNo').setValue(this.registerObj1.policyNo)
    this.admissionFormGroup.get('AprovAmount').setValue(this.registerObj1.aprovAmount)
    this.admissionFormGroup.get('compDOd').setValue(this.registerObj1.compDod)
     this.admissionFormGroup.get('IsOpToIpconv').setValue(this.registerObj1.isOpToIpconv)
    this.admissionFormGroup.get('RefDoctorDept').setValue(this.registerObj1.refDoctorDept)
   this.admissionFormGroup.get('AdmissionType').setValue(this.registerObj1.admissionType)
    this.admissionFormGroup.get('ischarity').setValue(this.admissionFormGroup.get('ischarity').value)
    this.admissionFormGroup.get('convertId').setValue(this.registerObj1.converId || 0)
    this.admissionFormGroup.get('RefDocNameId').setValue(this.registerObj1.refDocNameId || 0)
  
  delete this.registerObj.regNo


     if (!this.admissionFormGroup.invalid) {
    
      let submitData = {
        "admissionReg": this.registerObj,// this.personalFormGroup.value,
        "admission": this.admissionFormGroup.value
      };
      console.log(this.admissionFormGroup.value);

      this._AdmissionService.AdmissionUpdate(this.registerObj1.admissionId, this.admissionFormGroup.value).subscribe(response => {
        this.getAdmittedPatientCasepaperview(response);
        this._matDialog.closeAll();
      });
    } else {
      let invalidFields = [];

      if (this.admissionFormGroup.invalid) {
        for (const controlName in this.admissionFormGroup.controls) {
          if (this.admissionFormGroup.controls[controlName].invalid) {
            invalidFields.push(`Admission Form: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }

    }

  }
  getAdmittedPatientCasepaperview(AdmissionId) {
    this.commonService.Onprint("AdmissionId", AdmissionId, "IpCasepaperReport");
  }

  getValidationMessages() {
    return {
      RegId: [],
      AdmittedDoctor1: [
        { name: "required", Message: "AdmittedDoctor1 is required" }
      ],
      AdmittedDoctor2: [
        { name: "required", Message: "AdmittedDoctor2 is required" }
      ],
      RefDocNameId: [
        { name: "pattern", Message: "Ref.DocName allowed" },

      ],
      CompanyId: [
        { name: "pattern", Message: "Company Only numbers allowed" },

      ],
      SubTpaComId: [
        { name: "pattern", Message: "Only numbers allowed" },
      ],
      RelativeName: [
        { name: "required", Message: "RelativeName is required" }
      ],
      RelativeAddress: [
        { name: "required", Message: "RelativeAddress is required" }
      ],

      RelationshipId: [
        { name: "required", Message: "Relationship is required" }
      ],
      DepartmentId: [
        { name: "required", Message: "Department is required" }
      ],
      DocNameId: [
        { name: "required", Message: "DocName Name is required" }
      ],
      TariffId: [
        { name: "required", Message: "Tariff Name is required" }
      ],
      PatientTypeId: [
        { name: "required", Message: "PatientType Name is required" }
      ],
      HospitalId: [
        { name: "required", Message: "Hospital Name is required" }
      ],
      phoneNo: [
        { name: "required", Message: "Relatvie MobileNo  is required" }
      ],
      docNameId: [
        { name: "required", Message: "Doctor Name is required" }
      ],
    };
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

  onIsMLCChange(event: any) {
    
  this.admissionFormGroup.patchValue({ isMlc: event.checked });
}

 onISCharChange(event: any) {
  this.admissionFormGroup.patchValue({ ischarity: event.checked });
}


  OnClose() {
    this._matDialog.closeAll();
  }
 
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  onReset() {
    this.admissionFormGroup = this._AdmissionService.createAdmissionForm();
    this.isCompanySelected = false;
    // this.admissionFormGroup.get('CompanyId').setValue(this.CompanyList[-1]);
    this.admissionFormGroup.get('CompanyId').clearValidators();
    this.admissionFormGroup.get('SubCompanyId').clearValidators();
    this.admissionFormGroup.get('CompanyId').updateValueAndValidity();
    this.admissionFormGroup.get('SubCompanyId').updateValueAndValidity();
  }

}