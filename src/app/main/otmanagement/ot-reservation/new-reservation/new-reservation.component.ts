import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { OtReservationService } from '../ot-reservation.service';


@Component({
  selector: 'app-new-reservation',
  templateUrl: './new-reservation.component.html',
  styleUrls: ['./new-reservation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewReservationComponent implements OnInit {

  requestForm: FormGroup;

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
     public toastr: ToastrService) { }
    
 
   ngOnInit(): void {
     this.requestForm = this._OtReservationService.createRequestForm();
     this.requestForm.markAllAsTouched();
     
     if ((this.data?.countryId??0) > 0) 
         {
             this.isActive=this.data.isActive
             this.requestForm.patchValue(this.data);
         }
 }
 
 onChangeReg(event) {
     if (event.value == 'registration') {
       this.Regflag = false;
       this.personalFormGroup.get('RegId').reset();
       this.personalFormGroup.get('RegId').disable();
       // this.isRegSearchDisabled = true;
      // this.registerObj1 = new AdmissionPersonlModel({});
       this.personalFormGroup.reset();
       this.Patientnewold = 1;
 
       this.personalFormGroup = this._AdmissionService.createPesonalForm();
       this.admissionFormGroup = this._AdmissionService.createAdmissionForm();
       this.Regdisplay = false;
 
     } else {
       this.Regdisplay = true;
       this.Regflag = true;
       this.searchFormGroup.get('RegId').enable();
       this.personalFormGroup = this._AdmissionService.createPesonalForm();
       this.Patientnewold = 2;
 
     }
 
     this.personalFormGroup.markAllAsTouched();
     this.admissionFormGroup.markAllAsTouched();
   }
  getSelectedObjIP(obj) {

    if ((obj.regID ?? 0) > 0) {
      console.log("Admitted patient:", obj)
      this.vRegNo = obj.regNo
      this.vDoctorName = obj.doctorName
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vDepartment = obj.departmentName
      this.vOPDNo = obj.ipdNo
      this.vAge = obj.age
      this.vMobNo = obj.refDocName
      this.vTariffName = obj.tariffName
      this.vCompanyName = obj.companyName
     
    }
  }
   onSubmit() {
     if (!this.requestForm.invalid) {
             console.log(this.requestForm.value)
             this._OtReservationService.requestSave(this.requestForm.value).subscribe((response) => {
                 this.onClear(true);
             });
         } {
             let invalidFields = [];
             if (this.requestForm.invalid) {
                 for (const controlName in this.requestForm.controls) {
                     if (this.requestForm.controls[controlName].invalid) {
                         invalidFields.push(`request Form: ${controlName}`);
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
 
     getValidationMessages() {
       return {
           countryName: [
               { name: "required", Message: "Country Name is required" },
               { name: "maxlength", Message: "Country Name should not be greater than 50 char." },
               { name: "pattern", Message: "Special char not allowed." }
           ]
       };
   }
 onClose() {
    this.ref.close();
  }
 onClear(val: boolean) {
     this.requestForm.reset();
     this.dialogRef.close(val);
 }
}





