import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { OtRequestService } from '../ot-request.service';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';


@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewRequestComponent implements OnInit {
  requestForm: FormGroup;

   personalFormGroup: FormGroup;
    Regflag: boolean = false;
     Patientnewold: any = 1;
     admissionFormGroup: FormGroup;
      Regdisplay: boolean = false;
       searchFormGroup: FormGroup;


       vSelectedOption: any = 'OP';
    
   isActive:boolean=true;
  autocompleteModeDepartment: String = "Department";
   autocompleteModeSiteDescriptionId: String = "SiteDescription";
 autocompleteModeSurgeryCategory: String = "SurgeryCategory";
autocompleteModeDoctorSurgeon: String = "DoctorSurgion";
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


   screenFromString = 'Common-form';

   constructor( public _OtRequestService: OtRequestService,
     public dialogRef: MatDialogRef<NewRequestComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     private ref: MatDialogRef<NewRequestComponent>,
     public _AdmissionService: AdmissionService,
     public toastr: ToastrService) { }
    
 
   ngOnInit(): void {
     this.requestForm = this._OtRequestService.createRequestForm();
     this.requestForm.markAllAsTouched();
     
     if ((this.data?.otbookingId??0) > 0) 
         {
             //this.isActive=this.data.isActive
             this.requestForm.patchValue(this.data);
         }
 }
 
 dateTimeObj: any;
    getDateTime(dateTimeObj) {
       
        this.dateTimeObj = dateTimeObj;
         console.log(this.dateTimeObj)
    }
 onChangeReg(event) {
     if (event.value == 'registration') {
      // this.Regflag = false;
       //this.personalFormGroup.get('RegId').reset();
       //this.personalFormGroup.get('RegId').disable();
       // this.isRegSearchDisabled = true;
      // this.registerObj1 = new AdmissionPersonlModel({});
       //this.personalFormGroup.reset();
      // this.Patientnewold = 1;
 
      // this.personalFormGroup = this._AdmissionService.createPesonalForm();
       //this.admissionFormGroup = this._AdmissionService.createAdmissionForm();
      // this.Regdisplay = false;
 
     } else {
      // this.Regdisplay = true;
      // this.Regflag = true;
      // this.searchFormGroup.get('RegId').enable();
     //  this.personalFormGroup = this._AdmissionService.createPesonalForm();
      // this.Patientnewold = 2;
 
     }
 
     //this.personalFormGroup.markAllAsTouched();
     this.requestForm.markAllAsTouched();
   }
  getSelectedObjOT(obj) {


    if ((obj.regID ?? 0) > 0) {
     
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
             this._OtRequestService.requestSave(this.requestForm.value).subscribe((response) => {
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
           DepartmentName: [
               { name: "required", Message: "Department Name is required" },
               { name: "maxlength", Message: "Department Name should not be greater than 50 char." },
               { name: "pattern", Message: "Special char not allowed." }
           ],
           SurgeryCategory: [
               { name: "required", Message: "SurgeryCategory  is required" },
               { name: "maxlength", Message: "SurgeryCategory  should not be greater than 50 char." },
               { name: "pattern", Message: "Special char not allowed." }
           ],
           Site: [
               { name: "required", Message: "Site Name is required" },
               { name: "maxlength", Message: "Site Name should not be greater than 50 char." },
               { name: "pattern", Message: "Special char not allowed." }
           ],
           SurgeryProcedure: [
               { name: "required", Message: "SurgeryProcedure Name is required" },
               { name: "maxlength", Message: "SurgeryProcedure Name should not be greater than 50 char." },
               { name: "pattern", Message: "Special char not allowed." }
           ],
           SurgeonName: [
               { name: "required", Message: "Surgeon Name is required" },
               { name: "maxlength", Message: "Surgeon Name should not be greater than 50 char." },
               { name: "pattern", Message: "Special char not allowed." }
           ],
  
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





