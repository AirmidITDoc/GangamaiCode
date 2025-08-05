import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { OtReservationService } from '../ot-reservation.service';
import { DatePipe } from '@angular/common';
import { OtrequestlistComponent } from '../otrequestlist/otrequestlist.component';


@Component({
  selector: 'app-new-reservation',
  templateUrl: './new-reservation.component.html',
  styleUrls: ['./new-reservation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewReservationComponent implements OnInit {

  reservationForm: FormGroup;
     screenFromString = 'Common-form';

  opIpType: boolean = false;
      opIpId: any;
       RegId: string;


   personalFormGroup: FormGroup;
    Regflag: boolean = false;
     Patientnewold: any = 1;
     admissionFormGroup: FormGroup;
      Regdisplay: boolean = false;
       searchFormGroup: FormGroup;
vInstruction: any;

       vSelectedOption: any = 'OP';
    
   isActive:boolean=true;
 
 autocompleteModestatus: string = "State";
   // vClassId: any = 0;
  vRegNo: any;
  vPatientName: any;
  //vAdmissionDate: any;
  vOPDNo: any;
  vTariffName: any;
  vCompanyName: any;
  vDoctorName: any;
  //vRoomName: any;
  //vBedName: any;
  vAge: any;
  //vGenderName: any;
  //vAdmissionTime: any;
  //vAgeMonth: any;
  //vAgeDay: any;
  vDepartment: any;
  vMobNo: any;
  //vPatientType: any;
  //vDOA: any;
  //vstoreId: any = '';
  //vAdmissionID: any;

   constructor( public _OtReservationService: OtReservationService,
     public dialogRef: MatDialogRef<NewReservationComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     private ref: MatDialogRef<NewReservationComponent>,
     public _AdmissionService: AdmissionService,
     public datePipe: DatePipe,
     private _matDialog: MatDialog,
     public toastr: ToastrService) { }
    
 
   ngOnInit(): void {
     this.reservationForm = this._OtReservationService.createReservationForm();
     this.reservationForm.markAllAsTouched();
     
     if ((this.data?.countryId??0) > 0) 
         {
             this.isActive=this.data.isActive
             this.reservationForm.patchValue(this.data);
         }
 }

  patientInfoReset() {
    this.reservationForm.get('opIpId').setValue('');
    this.reservationForm.get('opIpId').reset();
    this.vRegNo = '';
    this.vPatientName = '';
    // this.vAdmissionDate = '';
    // this.vAdmissionTime = '';
    // this.vIPDNo = '';
    this.vDoctorName = '';
    this.vTariffName = '';
    this.vCompanyName = '';
    // this.vRoomName = '';
    // this.vBedName = '';
    // this.vGenderName = '';
    this.vAge = '';
    this.vDepartment = '';
   // this.vDOA = ''
  }
 dateTimeObj: any;
    getDateTime(dateTimeObj) {
       
        this.dateTimeObj = dateTimeObj;
         console.log(this.dateTimeObj)
    }
 onChangeReg(event) {
    if (event.value == 'OP') {
      this.opIpType = false;
      this.opIpId = "";
    }
    else if (event.value == 'IP') {
      this.opIpType = true;
      this.opIpId = "";
    }
    this.patientInfoReset();
  }
  getSelectedObjIP(obj) {

    if ((obj.regID ?? 0) > 0) {
      console.log("Admitted patient:", obj)
      this.vRegNo = obj.regNo
      this.vDoctorName = obj.doctorName
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vDepartment = obj.departmentName
    //   this.vAdmissionDate = obj.admissionDate
    //   this.vAdmissionTime = obj.admissionTime
    //   this.vIPDNo = obj.ipdNo
      this.vAge = obj.age
    //   this.vAgeMonth = obj.ageMonth
    //   this.vAgeDay = obj.ageDay
    //   this.vGenderName = obj.genderName
    //   this.vRefDocName = obj.refDocName
    //   this.vRoomName = obj.roomName
    //   this.vBedName = obj.bedName
    //   this.vPatientType = obj.patientType
      this.vTariffName = obj.tariffName
      this.vCompanyName = obj.companyName
    //   this.vDOA = obj.admissionDate
      this.opIpId = obj.admissionID;
    }
  }
  getSelectedObjOP(obj) {

    if ((obj.regId ?? 0) > 0) {
      console.log("Visit Patient:", obj)
      this.vRegNo = obj.regNo
      this.vDoctorName = obj.doctorName
      this.vDepartment = obj.departmentName
    //   this.vAdmissionDate = obj.admissionDate
    //   this.vAdmissionTime = obj.admissionTime
      this.vOPDNo = obj.opdNo
      this.vAge = obj.age
    //   this.vAgeMonth = obj.ageMonth
    //   this.vAgeDay = obj.ageDay
    //   this.vGenderName = obj.genderName
    //   this.vRefDocName = obj.refDocName
    //   this.vRoomName = obj.roomName
    //   this.vBedName = obj.bedName
    //   this.vPatientType = obj.patientType
      this.vTariffName = obj.tariffName
      this.vCompanyName = obj.companyName
      let nameField = obj.formattedText;
      let extractedName = nameField.split('|')[0].trim();
      this.vPatientName = extractedName;
      this.opIpId = obj.visitId;
    }
  }
 onSubmit() {
    if (this.reservationForm.get('opIpType').value == 'IP') 
        { this.reservationForm.get('opIpType').setValue(true) }
    else { this.reservationForm.get('opIpType').setValue(false)  }

    this.reservationForm.get('reservationDate').setValue(this.datePipe.transform(this.dateTimeObj?.date, 'yyyy-MM-dd'));
  this.reservationForm.get('reservationTime').setValue(this.dateTimeObj?.time);
      this.reservationForm.get('opdate').setValue(this.datePipe.transform(this.dateTimeObj?.date, 'yyyy-MM-dd'));
   this.reservationForm.get('opstartTime').setValue(this.dateTimeObj?.time);
  this.reservationForm.get('opendTime').setValue(this.dateTimeObj?.time);

  
  this.reservationForm.get('opIpId').setValue(this.opIpId);
//   this.reservationForm.get('isCancelledDateTime')?.setValue('1900-01-01');

     if (!this.reservationForm.invalid) {
             console.log(this.reservationForm.value)
             this._OtReservationService.reservationSave(this.reservationForm.value).subscribe((response) => {
                 this.onClear(true);
             });
         } {
             let invalidFields = [];
             if (this.reservationForm.invalid) {
                 for (const controlName in this.reservationForm.controls) {
                     if (this.reservationForm.controls[controlName].invalid) {
                         invalidFields.push(`reservation Form: ${controlName}`);
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

 onOTRequest(): void {
  const dialogRef = this._matDialog.open(OtrequestlistComponent, {
    width: '80%',
    height: '80%',
    panelClass: 'custom-dialog'
  });


  dialogRef.afterClosed().subscribe(selectedData => {
    if (selectedData) {
     
      this.reservationForm.patchValue({
        patientName: selectedData.patientName,
        surgeonId: selectedData.surgeonId,
        categoryId: selectedData.categoryId,
       
      });
    }
  });
}

 
     getValidationMessages() {
       return {
           SurgeryName: [
               { name: "required", Message: "Surgery Name is required" },
               { name: "maxlength", Message: "Surgery Name should not be greater than 50 char." },
               { name: "pattern", Message: "Special char not allowed." }
           ],
           SurgeronName1: [
               { name: "required", Message: "Surgeron Name 1 is required" },
               { name: "maxlength", Message: "Surgeron Name 1 should not be greater than 50 char." },
               { name: "pattern", Message: "Special char not allowed." }
           ],
           SurgeronName2: [
               { name: "required", Message: "Surgeron Name 2 is required" },
               { name: "maxlength", Message: "Country Name should not be greater than 50 char." },
               { name: "pattern", Message: "Special char not allowed." }
           ],
           Anathesiadoctor1: [
               { name: "required", Message: "Anathesia doctor 1 Name is required" },
               { name: "maxlength", Message: "Anathesia doctor 1 Name should not be greater than 50 char." },
               { name: "pattern", Message: "Special char not allowed." }
           ],
           Anathesiadoctor2: [
               { name: "required", Message: "Anathesia doctor 2 Name is required" },
               { name: "maxlength", Message: "Anathesia doctor 2 Name should not be greater than 50 char." },
               { name: "pattern", Message: "Special char not allowed." }
           ],
           OTTable: [
               { name: "required", Message: "OT Table Name is required" },
               { name: "maxlength", Message: "OT Table Name should not be greater than 50 char." },
               { name: "pattern", Message: "Special char not allowed." }
           ],
           AnathesiaType: [
               { name: "required", Message: "Anathesia Type is required" },
               { name: "maxlength", Message: "Anathesia Type should not be greater than 50 char." },
               { name: "pattern", Message: "Special char not allowed." }
           ],
       };
   }
 onClose() {
    this.ref.close();
  }
 onClear(val: boolean) {
     this.reservationForm.reset();
     this.dialogRef.close(val);
 }
}





