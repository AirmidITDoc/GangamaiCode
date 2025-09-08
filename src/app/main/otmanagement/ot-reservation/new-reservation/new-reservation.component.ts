import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { OtReservationService } from '../ot-reservation.service';
import { DatePipe } from '@angular/common';
import { OtrequestlistComponent } from '../otrequestlist/otrequestlist.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';


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
  tOtbookingRequestsForm: FormGroup;

  opIpType: boolean = false;
  opIpId: any;
  RegId: string;
  registerObj: any;
  personalFormGroup: FormGroup;
  Regflag: boolean = false;
  Patientnewold: any = 1;
  admissionFormGroup: FormGroup;
  Regdisplay: boolean = false;
  searchFormGroup: FormGroup;
  vInstruction: any;
  votbookingId: any = ""

  vSelectedOption: any = 'OP';

  isActive: boolean = true;

  autocompleteModestatus: string = "State";
  autocompleteModeSurgery: String = "SurgeryMaster";
  autocompleteModeConDoctor: String = "ConDoctor";
  autocompleteModeRefDoctor: String = "RefDoctor";
  autocompleteModeOTTable: String = "OttableMaster";
  autocompleteModeAnesthesiatypes: string = "Anesthesiatypes";

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
  vGenderName: any;
  //vAdmissionTime: any;
  vAgeMonth: any;
  vAgeDay: any;
  vDepartment: any;
  vMobNo: any;
  //vPatientType: any;
  //vDOA: any;
  //vstoreId: any = '';
  //vAdmissionID: any;
  vIPDNo: any;


  constructor(public _OtReservationService: OtReservationService,
    public dialogRef: MatDialogRef<NewReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<NewReservationComponent>,
    public _AdmissionService: AdmissionService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private _formBuilder: FormBuilder,
    public datePipe: DatePipe,
    private _matDialog: MatDialog,
    public toastr: ToastrService) { }


  ngOnInit(): void {
    this.reservationForm = this._OtReservationService.createReservationForm();
    this.reservationForm.markAllAsTouched();

    this.tOtbookingRequestsForm = this._OtReservationService.tOtbookingRequestsForm();

    this.requestArray.push(this.createRequestsForm());


    if (this.registerObj?.opstartTime)
      (this.registerObj?.opendTime)
    {
      const date = new Date(this.registerObj.opstartTime);
      if (!isNaN(date.getTime())) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

        setTimeout(() => {
          this.reservationForm.get('opstartTime')?.setValue(formattedTime);
          this.reservationForm.get('opendTime')?.setValue(formattedTime);
        });

        console.log("Raw from backend:", this.registerObj.otRequestTime);
        console.log("Formatted:", formattedTime);
        console.log("Control value after patch:", this.reservationForm.get('opstartTime')?.value);
      }
    }

    if ((this.data?.otreservationId) > 0) {
      this.registerObj = this.data
      console.log(this.registerObj)
      this.vRegNo = this.registerObj.regNo
      this.vOPDNo = this.registerObj.opdNo
      this.vIPDNo = this.registerObj.ipdNo
      this.vPatientName = this.registerObj.patientName
      this.vAge = this.registerObj.ageYear
      this.vDepartment = this.registerObj.departmentName
      this.vMobNo = this.registerObj.mobileNo
      this.vDoctorName = this.registerObj.doctorName
      this.vTariffName = this.registerObj.tariffName
      this.vCompanyName = this.registerObj.companyName
      this.votbookingId = this.registerObj.otBookingId

      if (this.registerObj.opIpType == 0) {
        this.vSelectedOption = "OP"
      }
      else {
        this.vSelectedOption = "IP"
      }

      console.log(this.registerObj)
      //this.isActive=this.data.isActive
      this.reservationForm.patchValue(this.registerObj);
    }
    this.reservationForm.get("this.isCancelledDate")?.setValue('1900-01-01')
  }

  createRequestsForm(item: any = {}): FormGroup {
    return this._formBuilder.group({
      otbookingId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otrequestId: [1, [this._FormvalidationserviceService.onlyNumberValidator()]]  // fixed as 1
    });
  }

  get requestArray(): FormArray {
    return this.reservationForm.get('tOtbookingRequests') as FormArray;
  }

  patientInfoReset() {
    this.reservationForm.get('opIpId').setValue('');
    this.reservationForm.get('opIpId').reset();
    this.vRegNo = '';
    this.vPatientName = '';
    // this.vAdmissionDate = '';
    // this.vAdmissionTime = '';
    this.vIPDNo = '';
    this.vDoctorName = '';
    this.vTariffName = '';
    this.vCompanyName = '';
    // this.vRoomName = '';
    // this.vBedName = '';
    this.vGenderName = '';
    this.vAge = '';
    this.vAgeDay = '';
    this.vAgeMonth = '';
    this.vDepartment = '';
    this.vMobNo = '';

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
      this.vIPDNo = obj.ipdNo
      this.vAge = obj.age
      this.vAgeMonth = obj.ageMonth
      this.vAgeDay = obj.ageDay
      this.vGenderName = obj.genderName
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
      console.log("Visit Patient:", obj)
      this.vRegNo = obj.regNo
      this.vDoctorName = obj.doctorName
      this.vDepartment = obj.departmentName
      //   this.vAdmissionDate = obj.admissionDate
      //   this.vAdmissionTime = obj.admissionTime
      this.vOPDNo = obj.opdNo
      this.vAge = obj.age
      this.vAgeMonth = obj.ageMonth
      this.vAgeDay = obj.ageDay
      this.vGenderName = obj.genderName
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
  onChangeTimeStart(event: any) {
    let time = event.target.value;
    if (time && time.length >= 5) {
      time = time.substring(0, 5);
    }
    console.log("Time changed:", time); // "11:51"
    this.reservationForm.get('opstartTime')?.setValue(time, { emitEvent: false });
  }

  onChangeTimeEnd(event: any) {
    let time = event.target.value;
    if (time && time.length >= 5) {
      time = time.substring(0, 5);
    }
    console.log("Time changed:", time); // "11:51"
    this.reservationForm.get('opendTime')?.setValue(time, { emitEvent: false });
  }

  onSubmit() {
    this.reservationForm.get('reservationDate').setValue(this.datePipe.transform(this.dateTimeObj?.date, 'yyyy-MM-dd'));
    this.reservationForm.get('reservationTime').setValue(this.dateTimeObj?.time);
    this.reservationForm.get('opdate').setValue(this.datePipe.transform(this.reservationForm.get('opdate').value, 'yyyy-MM-dd'));
    this.requestArray.at(0).get('otbookingId')?.setValue(this.votbookingId ?? 0);
    this.reservationForm.get('opIpId').setValue(this.opIpId);

    if (!this.reservationForm.invalid) {
      if (this.reservationForm.get('opIpType').value == 'IP') { this.reservationForm.get('opIpType').setValue(true) }
      else { this.reservationForm.get('opIpType').setValue(false) }
      console.log(this.reservationForm.value)
      this._OtReservationService.reservationSave(this.reservationForm.value).subscribe((response) => {
        console.log(response)
        this.OnPrint(response)
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
      console.log("Back Side data:", selectedData)
      if (selectedData) {
        this.vRegNo = selectedData.regNo
        this.vOPDNo = selectedData.opdNo
        this.vIPDNo = selectedData.ipdNo
        this.vPatientName = selectedData.patientName
        this.vAge = selectedData.ageYear
        this.vDepartment = selectedData.departmentName
        this.vMobNo = selectedData.mobileNo
        this.vDoctorName = selectedData.doctorName
        this.vTariffName = selectedData.tariffName
        this.vCompanyName = selectedData.companyName
        this.opIpId = selectedData.opIpId
        this.opIpType = selectedData.opIpType
        if (selectedData.opIpType == 0) {
          this.vSelectedOption = "OP"
        }
        else {
          this.vSelectedOption = "IP"
        }
        this.votbookingId = selectedData.otBookingId

        this.reservationForm.patchValue({
          surgeonId: selectedData.surgeonId,
          surgeryId: selectedData.surgeryId,
        });
      }
    });
  }

  OnPrint(Param) {
    const param = {
      searchFields: [
        {
          fieldName: "OTReservationId",
          fieldValue: String(Param.OTReservationId),
          opType: "Equals"
        },
        {
          fieldName: "OPIPType",
          fieldValue: String(Param.opIpType),
          opType: "Equals"
        }
      ],
      mode: "OTReservationReport"
    };

    console.log(param);

    this._OtReservationService.getReportView(param).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent, {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "OtReservation Report Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {

      });
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
      anestheticsDr: [
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





