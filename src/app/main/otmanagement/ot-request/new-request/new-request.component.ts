import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { OtRequestService } from '../ot-request.service';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { DatePipe } from '@angular/common';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';


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


       vSelectedOption: any = "OP";
    
   isActive:boolean=true;
  autocompleteModeDepartment: String = "Department";
   autocompleteModeSiteDescriptionId: String = "SiteDescription";
 autocompleteModeSurgeryCategory: String = "SurgeryCategory";
autocompleteModeDoctorSurgeon: String = "DoctorSurgion";
autocompleteModeSurgeryMaster: String = "SurgeryMaster";
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
    opIpId: any;
  
    @ViewChild('surgeonList') surgeonList: AirmidDropDownComponent;

   constructor( public _OtRequestService: OtRequestService,
     public dialogRef: MatDialogRef<NewRequestComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     private ref: MatDialogRef<NewRequestComponent>,
     public _AdmissionService: AdmissionService,
         public datePipe: DatePipe,
     public toastr: ToastrService) { }
    
 
   ngOnInit(): void {
     this.requestForm = this._OtRequestService.createRequestForm();
     this.requestForm.markAllAsTouched();
     
     if ((this.data?.otbookingId??0) > 0) 
         {
             //this.isActive=this.data.isActive
             this.requestForm.patchValue(this.data);
         }
          this.requestForm.get("this.isCancelledDate")?.setValue('1900-01-01')
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
        console.log(obj)
     
      this.vRegNo = obj.regNo
      this.vDoctorName = obj.doctorName
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vDepartment = obj.departmentName
      this.vOPDNo = obj.ipdNo
      this.vAge = obj.age
      this.vMobNo = obj.refDocName
      this.vTariffName = obj.tariffName
      this.vCompanyName = obj.companyName
      this.opIpId = obj
     
    }
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
      console.log("Visite Patient:", obj)
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
    if (this.requestForm.get('opIpType').value == 'IP') 
        { this.requestForm.get('opIpType').setValue(1) }
    else { this.requestForm.get('opIpType').setValue(0)  }

    this.requestForm.get('otbookingDate').setValue(this.datePipe.transform(this.dateTimeObj?.date, 'yyyy-MM-dd'));
  this.requestForm.get('otbookingTime').setValue(this.dateTimeObj?.time);
  this.requestForm.get('opIpId').setValue(this.opIpId);
//   this.requestForm.get('isCancelledDateTime')?.setValue('1900-01-01');

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
 selectChangedepartment(obj: any){
  const departmentId = obj?.value;

  if (departmentId) {
    this._OtRequestService.getSurgeonsByDepartment(departmentId).subscribe((data: any[]) => {
      this.surgeonList.options = data ;
       this.surgeonList.bindGridAutoComplete();
      // Do NOT reset surgeonId — retain selected value even if not found in filtered list
    });
  } else {
    this.surgeonList.options = [];
    // Optionally retain surgeonId here too — no reset
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
            SurgeryType: [
               { name: "required", Message: "SurgeryType Name is required" },
               { name: "maxlength", Message: "SurgeryType Name should not be greater than 50 char." },
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





