import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
import { fuseAnimations } from '@fuse/animations';
import { OtNoteService } from './ot-note.service';

@Component({
  selector: 'app-ot-note',
  templateUrl: './ot-note.component.html',
  styleUrls: ['./ot-note.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class OTNoteComponent {

  OTNoteform: FormGroup;
  opIpType: number;
  opIpId: any;
  vSelectedOption: any = "OP";
  vRegNo: any;
  vPatientName: any;
  // vDescription:any;
  vDescription = "Incision:<br><br>OperativeDiagnosis:<br><br>OperativeFindings:<br><br>OperativeProcedure:<br><br>ExtraProPerformed:<br><br>ClosureTechnique:<br><br>PostOpertiveInstru:<br><br>DetSpecimenForLab:"
  registerObj = new otNote({});

  autocompleteModestatus: string = "State";
  autocompleteModeSurgery: String = "SurgeryMaster";
  autocompleteModeConDoctor: String = "ConDoctor";
  autocompleteModeRefDoctor: String = "RefDoctor";
  autocompleteModeOTTable: String = "OttableMaster";

  constructor(
    public _otNoteService: OtNoteService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.OTNoteform = this._otNoteService.createOtNoteForm();
    this.OTNoteform.markAllAsTouched();
  }

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
    this.registerObj = new otNote({});
  }

  getSelectedObjIP(obj) {
    if ((obj.regID ?? 0) > 0) {
      this.registerObj = obj
      console.log("Admitted patient:", this.registerObj)
      this.vRegNo = obj.regNo
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.opIpId = obj.admissionID;
    }
  }
  getSelectedObjOP(obj) {
    if ((obj.regId ?? 0) > 0) {
      this.registerObj = obj
      console.log("Visite patient:", this.registerObj)
      this.vRegNo = obj.regNo
      let nameField = obj.formattedText;
      let extractedName = nameField.split('|')[0].trim();
      this.vPatientName = extractedName;
      this.opIpId = obj.visitId;
    }
  }

  onEditorValueChange(content: string) {
    this.OTNoteform.get('description')?.setValue(content);
  }

  onSubmit() {

  }

  onClose() {
    this.OTNoteform.reset();
    // this.dialogRef.close(); 
    this._matDialog.closeAll();
    this.OTNoteform.get('opIpType').setValue('IP')
    this.OTNoteform.get('description').setValue("Incision:<br><br>OperativeDiagnosis:<br><br>OperativeFindings:<br><br>OperativeProcedure:<br><br>ExtraProPerformed:<br><br>ClosureTechnique:<br><br>PostOpertiveInstru:<br><br>DetSpecimenForLab:")
    this.vDescription = "Incision:<br><br>OperativeDiagnosis:<br><br>OperativeFindings:<br><br>OperativeProcedure:<br><br>ExtraProPerformed:<br><br>ClosureTechnique:<br><br>PostOpertiveInstru:<br><br>DetSpecimenForLab:"
    this.patientInfoReset();
  }

  getValidationMessages() {
    return {
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

export class otNote {
  RegId: Number;
  regId: Number;
  RegID: Number;
  PatientName: string;
  patientName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  address: string;
  city: string;
  PinNo: string;
  regNo: string;
  RegNo: string;
  Age: any;
  age: any;
  genderId: any;
  phoneNo: string;
  MobileNo: string;
  mobileNo: string;
  AgeDay: any;
  ageYear: any;
  ageMonth: any;
  ageDay: any;
  countryId: number;
  stateId: number;
  CityId: number;
  cityId: number;
  MaritalStatusId: number;
  maritalStatusId: number;
  IsCharity: Boolean;
  ReligionId: number;
  religionId: number;
  AreaId: number;
  areaId: number;
  VillageId: number;
  TalukaId: number;
  PatientWeight: number;
  AreaName: string;
  AadharCardNo: string;
  aadharCardNo: string;
  PanCardNo: string;
  currentDate = new Date();
  AdmissionID: any;
  VisitId: any;
  isSeniorCitizen: boolean
  doctorName: any;
  departmentName: any;
  UnitId: any;
  billNo: any;
  departmentId: any;
  doctorId: any;
  campId: any;
  emgId: any
  ipdNo: any;
  opdNo: any;
  genderName: any;
  admissionDate: any;
  refDoctorName: any;
  bedName: any;
  roomName: any;
  patientType: any;
  tariffName: any;
  companyName: any;

  constructor(OtNoteInsert) {
    {
      this.RegId = OtNoteInsert.RegId || 0;
      this.regId = OtNoteInsert.regId || 0;
      this.RegID = OtNoteInsert.RegID || 0;
      this.patientName = OtNoteInsert.patientName;
      this.firstName = OtNoteInsert.firstName || '';
      this.middleName = OtNoteInsert.middleName || '%';
      this.lastName = OtNoteInsert.lastName || '';
      this.FirstName = OtNoteInsert.FirstName || '';
      this.MiddleName = OtNoteInsert.MiddleName || '';
      this.LastName = OtNoteInsert.LastName || '';
      this.RegNo = OtNoteInsert.RegNo || '';
      this.regNo = OtNoteInsert.regNo || '';
      this.PinNo = OtNoteInsert.PinNo || '';
      this.Age = OtNoteInsert.Age || '';
      this.genderId = OtNoteInsert.genderId || 0;
      this.phoneNo = OtNoteInsert.phoneNo || '';
      this.MobileNo = OtNoteInsert.MobileNo || '';
      this.mobileNo = OtNoteInsert.mobileNo || '';
      this.AgeDay = OtNoteInsert.AgeDay || '0';
      this.ageYear = OtNoteInsert.ageYear || '';
      this.ageMonth = OtNoteInsert.ageMonth || '';
      this.ageDay = OtNoteInsert.ageDay || '';
      this.countryId = OtNoteInsert.countryId || 0;
      this.stateId = OtNoteInsert.stateId || 0;
      this.CityId = OtNoteInsert.CityId || 0;
      this.cityId = OtNoteInsert.cityId || 0;
      this.MaritalStatusId = OtNoteInsert.MaritalStatusId || 0;
      this.IsCharity = OtNoteInsert.IsCharity || false;
      this.ReligionId = OtNoteInsert.ReligionId || 0;
      this.religionId = OtNoteInsert.religionId || 0;
      this.AreaId = OtNoteInsert.AreaId || 0;
      this.areaId = OtNoteInsert.areaId || 0;
      this.VillageId = OtNoteInsert.VillageId || '';
      this.TalukaId = OtNoteInsert.TalukaId || '';
      this.PatientWeight = OtNoteInsert.PatientWeight || '';
      this.AreaName = OtNoteInsert.AreaName || '';
      this.AadharCardNo = OtNoteInsert.AadharCardNo || '';
      this.aadharCardNo = OtNoteInsert.aadharCardNo || '';
      this.PanCardNo = OtNoteInsert.PanCardNo || '';
      this.AdmissionID = OtNoteInsert.AdmissionID || '';
      this.VisitId = OtNoteInsert.VisitId || 0;
      this.isSeniorCitizen = OtNoteInsert.isSeniorCitizen || 0
      this.maritalStatusId = OtNoteInsert.maritalStatusId || 0;
      this.doctorName = OtNoteInsert.doctorName || "";
      this.departmentName = OtNoteInsert.departmentName || "";
      this.UnitId = OtNoteInsert.UnitId || 0;
      this.billNo = OtNoteInsert.billNo || 0;
      this.departmentId = OtNoteInsert.departmentId || 0;
      this.doctorId = OtNoteInsert.doctorId || 0;
      this.campId = OtNoteInsert.campId || 0;
      this.emgId = OtNoteInsert.emgId || 0
      this.ipdNo = OtNoteInsert.ipdNo || ''
      this.opdNo = OtNoteInsert.opdNo || ''
      this.genderName = OtNoteInsert.genderName || ''
      this.admissionDate = OtNoteInsert.admissionDate || ''
      this.refDoctorName = OtNoteInsert.refDoctorName || ''
      this.bedName = OtNoteInsert.bedName || 0
      this.roomName = OtNoteInsert.roomName || ''
      this.patientType = OtNoteInsert.patientType || ''
      this.tariffName = OtNoteInsert.tariffName || ''
      this.companyName = OtNoteInsert.companyName || ''
    }
  }
}
