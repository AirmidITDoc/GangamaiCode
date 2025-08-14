import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { OPIPPatientModel } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { OTManagementServiceService } from '../ot-management-service.service';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-ot-note',
  templateUrl: './ot-note.component.html',
  styleUrls: ['./ot-note.component.scss']
})
export class OTNoteComponent  {

   OTNoteform: FormGroup;
 opIpType: number;
 opIpId: any;

       vSelectedOption: any = "OP";


 vRegNo: any;
vPatientName: any;
vDoctorName: any;
vTariffName: any;
vCompanyName: any;
vAge: any;
vAgeDay: any;
vAgeMonth: any;
vDepartment: any;
vMobNo: any;
vOPDNo: any;
vIPDNo: any;

autocompleteModestatus: string = "State";
  autocompleteModeSurgery: String = "SurgeryMaster";
   autocompleteModeConDoctor: String = "ConDoctor";
    autocompleteModeRefDoctor: String = "RefDoctor";
     autocompleteModeOTTable: String = "OttableMaster";

//       constructor( 
//           @Inject(MAT_DIALOG_DATA) public data: any,
         
//           ) { }
//            ngOnInit(): void {
//     // this.reservationForm = this._OtReservationService.createReservationForm();
//      this.OTNoteform.markAllAsTouched();
     
//      if ((this.data?.countryId??0) > 0) 
//          {
//              //this.isActive=this.data.isActive
//              this.OTNoteform.patchValue(this.data);
//          }
//  }
 
 onChangeReg(event) {
    if (event.value == 'OP') {
      this.opIpType = 0;
      this.opIpId = "";
    }
    else if (event.value == 'IP') {
      this.opIpType = 1;
      this.opIpId = "";
    }
    this.patientInfoReset();
  }

  patientInfoReset() {
    this.OTNoteform.get('opIpId').setValue('');
    this.OTNoteform.get('opIpId').reset();
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
    this.vAgeDay='';
    this.vAgeMonth='';
    this.vDepartment = '';
    this.vMobNo='';
   // this.vDOA = ''
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
       this.vIPDNo = obj.ipdNo
      this.vAge = obj.age
       this.vAgeMonth = obj.ageMonth
       this.vAgeDay = obj.ageDay
    //   this.vGenderName = obj.genderName
    //   this.vRefDocName = obj.refDocName
    //   this.vRoomName = obj.roomName
    //   this.vBedName = obj.bedName
    //   this.vPatientType = obj.patientType
      this.vTariffName = obj.tariffName
      this.vCompanyName = obj.companyName
    //   this.vDOA = obj.admissionDate
      this.opIpId = obj.admissionID;
      this.vMobNo = obj.mobileNo;
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
     this.vAgeMonth = obj.ageMonth
       this.vAgeDay = obj.ageDay
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
       this.vMobNo = obj.mobileNo;
    }
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
}

