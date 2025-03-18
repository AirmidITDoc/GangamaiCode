import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { PreviousDeptListComponent } from './previous-dept-list/previous-dept-list.component';
import { map, Observable, ReplaySubject, startWith, Subject, Subscription } from 'rxjs';
import { RegInsert } from '../../registration/registration.component';
import { FormBuilder, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import Swal from 'sweetalert2';
import { MatSelect } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from 'app/core/services/config.service';
import { ToastrService } from 'ngx-toastr';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { AppointmentlistService } from '../appointmentlist.service';
import { SSL_OP_NO_TLSv1_1 } from 'constants';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { Router } from '@angular/router';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { PatientvitalInformationComponent } from '../new-appointment/patientvital-information/patientvital-information.component';
import { VisitMaster1 } from '../appointment-list.component';
import { debug } from 'console';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
  selector: 'app-update-reg-patient-info',
  templateUrl: './update-reg-patient-info.component.html',
  styleUrls: ['./update-reg-patient-info.component.scss']
})
export class UpdateRegPatientInfoComponent {

  OnChangeDobType(e) {
    this.dateStyle = e.value;
  }

  dateStyle?: string = 'Date';
  personalFormGroup: FormGroup;
  VisitFormGroup: FormGroup;
  searchFormGroup: FormGroup;
  currentDate = new Date();

  registerObj = new RegInsert({});
  isCompanySelected: boolean = false;
  IsPhoneAppflag: boolean = true;

  VisitTime: String;
  registration: any;
  Patientnewold: any = 1;

  vhealthCardNo: any;
  Healthcardflag: boolean = false;
  vDays: any = 0;
  HealthCardExpDate: any;
  followUpDate: string;
  patienttype: any = 1;

    patientDetail = new RegInsert({});
    patientDetail1 = new VisitMaster1({});

  screenFromString = 'admission-form';
  @ViewChild('attachments') attachment: any;
  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
  @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
  @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;


  menuActions: Array<string> = [];

  // New Api
  autocompleteModeprefix: string = "Prefix";
  autocompleteModegender: string = "Gender";
  autocompleteModearea: string = "Area";
  autocompleteModecity: string = "City";
  autocompleteModestate: string = "State";
  autocompleteModecountry: string = "Country";
  autocompleteModemstatus: string = "MaritalStatus";
  autocompleteModereligion: string = "Religion";

  autocompleteModeunit: string = "Hospital";
  autocompleteModepatienttype: string = "PatientType";
  autocompleteModetariff: string = "Tariff";
  autocompleteModecompany: string = "Company";
  autocompleteModesubcompany: string = "SubCompany";
  autocompletedepartment: string = "Department";
  autocompleteModedeptdoc: string = "ConDoctor";
  autocompleteModerefdoc: string = "RefDoctor";
  autocompleteModepurpose: string = "Purpose";


  constructor(
    public _AppointmentlistService: AppointmentlistService,

    public dialogRef: MatDialogRef<UpdateRegPatientInfoComponent>,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    private _fuseSidebarService: FuseSidebarService,
    public _WhatsAppEmailService: WhatsAppEmailService,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    public matDialog: MatDialog,
      private accountService: AuthenticationService,
    private commonService: PrintserviceService,
    public toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any

  ) {

  }
  ngOnInit(): void {

    this.personalFormGroup = this._AppointmentlistService.createPesonalForm();
    this.VisitFormGroup = this._AppointmentlistService.createVisitdetailForm();
    this.personalFormGroup.markAllAsTouched();
    this.VisitFormGroup.markAllAsTouched();

     console.log(this.data)
      if ((this.data.regId ?? 0) > 0) {
      setTimeout(() => {
          this._AppointmentlistService.getRegistraionById(this.data.regId).subscribe((response) => {
            this.registerObj = response;
           console.log(this.registerObj)
          });}, 500);

        // setTimeout(() => {

        //   this._AppointmentlistService.getVisitById(this.data.visitId).subscribe(data => {
        //     this.patientDetail1 = data;
        //     console.log(data)
        //     console.log(this.patientDetail1)
        //   });
        // }, 1000);
      
      }
      this.getLastDepartmetnNameList(this.registerObj)

    }
  
 

  onSaveRegistered() {
    this.VisitFormGroup.get("regId").setValue(this.registerObj.regId)
    this.VisitFormGroup.get("patientOldNew").setValue(2)
    if (!this.personalFormGroup.invalid && !this.VisitFormGroup.invalid) {

      if (this.isCompanySelected && this.VisitFormGroup.get('CompanyId').value == 0) {
        this.toastr.warning('Please select valid Company ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }

      this.personalFormGroup.get('RegDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
      this.personalFormGroup.get('RegTime').setValue(this.dateTimeObj.time)
      this.VisitFormGroup.get('visitDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
      this.VisitFormGroup.get('visitTime').setValue(this.dateTimeObj.time)

    let submitData = {
      "registration": this.personalFormGroup.value,
      "visit": this.VisitFormGroup.value
    };
    console.log(submitData);

    this._AppointmentlistService.RregisteredappointmentSave(submitData).subscribe((response) => {
      this.toastr.success(response.message);
      let Res=response.message
      let ID=Res.split('.')
      let visitId=ID[1]
      this.OnViewReportPdf(visitId)
      this.onClear(true);
      this._matDialog.closeAll();
    }, (error) => {
      this.toastr.error(error.message);
    });

  }
  // this.grid.Bind
  }

  OnViewReportPdf(element) {
    
    console.log('Third action clicked for:', element);
    this.commonService.Onprint("VisitId", element, "AppointmentReceipt");
  }



  onChangePatient(value) {
    
    var mode = "Company"
    if (value.text == "Company") {
      this._AppointmentlistService.getMaster(mode, 1);
      this.VisitFormGroup.get('CompanyId').setValidators([Validators.required]);
      this.isCompanySelected = true;
      this.patienttype = 2;
    } else if (value.text != "Company") {
      this.isCompanySelected = false;
      this.VisitFormGroup.get('CompanyId').clearValidators();
      this.VisitFormGroup.get('SubCompanyId').clearValidators();
      this.VisitFormGroup.get('CompanyId').updateValueAndValidity();
      this.VisitFormGroup.get('SubCompanyId').updateValueAndValidity();
      this.patienttype = 1;
    }
}

  VitalInfo(contact) {
      
    console.log(contact)
    // this.advanceDataStored.storage = new SearchInforObj(xx);
    const dialogRef = this._matDialog.open(PatientvitalInformationComponent,
      {
        maxWidth: '80%',
        height: '58%',
        data: {
          registerObj: contact,
        },
      });

    dialogRef.afterClosed().subscribe(result => {

    });

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

      console.log(result)
      
this.VisitFormGroup.get("DepartmentId").setValue(this.PrevregisterObj.departmentId)
this.patientDetail1.doctorID=this.PrevregisterObj.consultantDocId

    });
  }

  chkHealthcard(event) {
    if (event.checked) {
      this.Healthcardflag = true;
      this.personalFormGroup.get('HealthCardNo').setValidators([Validators.required]);
    } else {
      this.Healthcardflag = false;
      this.personalFormGroup.get('HealthCardNo').reset();
      this.personalFormGroup.get('HealthCardNo').clearValidators();
      this.personalFormGroup.get('HealthCardNo').updateValueAndValidity();
    }
  }


  onChangePrefix(e) {
    this.ddlGender.SetSelection(e.sexId);
  }

  onChangestate(e) {
    console.log(e)
    // this.ddlCountry.SetSelection(e.stateId);
  }

  onChangecity(e) {
    this.ddlState.SetSelection(e.cityId);
    this.ddlCountry.SetSelection(e.stateId);
  }


  selectChangedepartment(obj: any) {
    
    console.log(obj)
    this._AppointmentlistService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
      this.ddlDoctor.options = data;
      this.ddlDoctor.bindGridAutoComplete();
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
      CompanyId: [
        { name: "required", Message: "Company Name is required" }
      ],
      SubCompanyId: [
        { name: "required", Message: "SubCompany Name is required" }
      ],
      bedId: [
        { name: "required", Message: "bedId Name is required" }
      ],
      wardId: [
        { name: "required", Message: "wardId Name is required" }
      ],


    };
  }
  onClear(val: boolean) {
    this.personalFormGroup.reset();
    this.dialogRef.close(val);
  }

  onClose() {
    this.dialogRef.close();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

}
