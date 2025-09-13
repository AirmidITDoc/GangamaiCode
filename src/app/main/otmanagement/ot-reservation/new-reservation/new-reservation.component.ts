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

  vRegNo: any;
  vPatientName: any;
  vOPDNo: any;
  vTariffName: any;
  vCompanyName: any;
  vDoctorName: any;
  vAge: any;
  vGenderName: any;
  vAgeMonth: any;
  vAgeDay: any;
  vDepartment: any;
  vMobNo: any;
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

    if ((this.data?.otreservationId) > 0) {
      this.registerObj = this.data
      console.log(this.registerObj)
      this.vRegNo = this.registerObj.regNo
      this.vOPDNo = this.registerObj.opdNo
      this.vIPDNo = this.registerObj.ipdNo
      this.vPatientName = this.registerObj.patientName
      this.vAge = this.registerObj.ageYear
      this.vAgeMonth = this.registerObj.ageMonth
      this.vAgeDay = this.registerObj.ageDay
      this.vDepartment = this.registerObj.departmentName
      this.vMobNo = this.registerObj.mobileNo
      this.vDoctorName = this.registerObj.doctorName
      this.vTariffName = this.registerObj.tariffName
      this.vCompanyName = this.registerObj.companyName
      this.votbookingId = this.registerObj.otBookingId
      this.opIpId = this.registerObj.opIpId
      this.vInstruction = this.registerObj.instruction

      if (this.registerObj.opIpType == 0) {
        this.vSelectedOption = "OP"
      }
      else {
        this.vSelectedOption = "IP"
      }
      this.reservationForm.patchValue(this.registerObj);
      this.reservationForm.get("anestheticsDr")?.setValue(this.registerObj?.anestheticsDrID)
      this.reservationForm.get("anestheticsDr1")?.setValue(this.registerObj?.anestheticsDrID1)
      this.reservationForm.get("unBooking")?.setValue(false)

    }

    if (this.registerObj?.opstartTime) {
      const date = new Date(this.registerObj.opstartTime);
      if (!isNaN(date.getTime())) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

        setTimeout(() => {
          this.reservationForm.get('opstartTime')?.setValue(formattedTime);
        });
      }
    }

    if (this.registerObj?.opendTime) {
      const date = new Date(this.registerObj.opendTime);
      if (!isNaN(date.getTime())) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

        setTimeout(() => {
          this.reservationForm.get('opendTime')?.setValue(formattedTime);
        });
      }
    }

    if (this.registerObj?.duration) {
      const date = new Date(this.registerObj.otRequestTime);

      if (!isNaN(date.getTime())) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

        setTimeout(() => {
          this.reservationForm.get('duration')?.setValue(formattedTime);
        });
      }
    }
    this.reservationForm.get("this.isCancelledDate")?.setValue('1900-01-01')

    /////// calendar code ///////
    if (this.data) {
      console.log("CalenderData:", this.data)

      if (this.data?.startTime) {
        const date = new Date(this.data.startTime);
        if (!isNaN(date.getTime())) {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');

          const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

          setTimeout(() => {
            this.reservationForm.get('opstartTime')?.setValue(formattedTime);
          });
        }
      }

      if (this.data?.endTime) {
        const date = new Date(this.data.endTime);
        if (!isNaN(date.getTime())) {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');

          const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

          setTimeout(() => {
            this.reservationForm.get('opendTime')?.setValue(formattedTime);
          });
        }
      }
      this.reservationForm.get('ottableId').setValue(this.data?.otTableId);
      this.reservationForm.get('duration').setValue(this.data?.duration);

    }
  }

  patientInfoReset() {
    this.reservationForm.get('opIpId').setValue('');
    this.reservationForm.get('opIpId').reset();
    this.vRegNo = '';
    this.vPatientName = '';
    this.vIPDNo = '';
    this.vDoctorName = '';
    this.vTariffName = '';
    this.vCompanyName = '';
    this.vGenderName = '';
    this.vAge = '';
    this.vAgeDay = '';
    this.vAgeMonth = '';
    this.vDepartment = '';
    this.vMobNo = '';
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
      this.vIPDNo = obj.ipdNo
      this.vAge = obj.age
      this.vAgeMonth = obj.ageMonth
      this.vAgeDay = obj.ageDay
      this.vGenderName = obj.genderName
      this.vTariffName = obj.tariffName
      this.vCompanyName = obj.companyName
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
      this.vOPDNo = obj.opdNo
      this.vAge = obj.age
      this.vAgeMonth = obj.ageMonth
      this.vAgeDay = obj.ageDay
      this.vGenderName = obj.genderName
      this.vTariffName = obj.tariffName
      this.vCompanyName = obj.companyName
      let nameField = obj.formattedText;
      let extractedName = nameField.split('|')[0].trim();
      this.vPatientName = extractedName;
      this.opIpId = obj.visitId;
      this.vMobNo = obj.mobileNo;
    }
  }

  opstartTime: any;
  opendTime: any;
  optime: any;

  // onChangeTime(event: any) {
  //   debugger
  //   const duration = this.reservationForm.get('duration')?.value; // "HH:mm"
  //   const startTime = this.reservationForm.get('opstartTime')?.value; // "HH:mm"

  //   if (duration && startTime) {
  //     const [dh, dm] = duration.split(':').map(Number);
  //     const [sh, sm] = startTime.split(':').map(Number);

  //     // convert everything to minutes
  //     const startMinutes = sh * 60 + sm;
  //     const durationMinutes = dh * 60 + dm;

  //     const endMinutes = startMinutes + durationMinutes;

  //     // convert back to HH:mm
  //     const eh = Math.floor(endMinutes / 60) % 24;
  //     const em = endMinutes % 60;
  //     const endTime = `${this.pad(eh)}:${this.pad(em)}`;

  //     this.reservationForm.get('opendTime')?.setValue(endTime);
  //   }
  // }
  onChangeTime(event: any) {
    debugger
    const durationHours = parseFloat(this.reservationForm.get('duration')?.value); // e.g. 1.5
    const startTime = this.reservationForm.get('opstartTime')?.value; // "HH:mm"

    if (durationHours && startTime) {
      const [sh, sm] = startTime.split(':').map(Number);

      const startMinutes = sh * 60 + sm;
      const durationMinutes = Math.round(durationHours * 60);

      const endMinutes = startMinutes + durationMinutes;
      const eh = Math.floor(endMinutes / 60) % 24;
      const em = endMinutes % 60;

      const endTime = `${this.pad(eh)}:${this.pad(em)}`;
      this.reservationForm.get('opendTime')?.setValue(endTime);
    }
  }

  onChangeTimeStart(event: any) {
    const duration = this.reservationForm.get('duration')?.value;
    const startTime = this.reservationForm.get('opstartTime')?.value;

    if (duration) {
      this.onChangeTime(null); // reuse logic for calculating end time
    } else {
      const endTime = this.reservationForm.get('opendTime')?.value;
      if (endTime) {
        this.calculateDuration(startTime, endTime);
      }
    }
  }

  onChangeTimeEnd(event: any) {
    const startTime = this.reservationForm.get('opstartTime')?.value;
    const endTime = this.reservationForm.get('opendTime')?.value;

    if (startTime && endTime) {
      this.calculateDuration(startTime, endTime);
    }
  }

  calculateDuration(startTime: string, endTime: string) {
    debugger
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    let durationMinutes = endMinutes - startMinutes;
    if (durationMinutes < 0) durationMinutes += 24 * 60; // handle next-day wrap

    const dh = Math.floor(durationMinutes / 60);
    const dm = durationMinutes % 60;

    const duration = `${this.pad(dh)}:${this.pad(dm)}`;
    this.reservationForm.get('duration')?.setValue(duration);
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }


  onSubmit() {
    let opdate = this.datePipe.transform(this.reservationForm.get('opdate')?.value, 'yyyy-MM-dd');
    const durationtime = this.reservationForm.get('duration')?.value;
    let combineddurationTime: string | null = null;
    if (opdate && durationtime) {
      combineddurationTime = durationtime;
    }
    const starttime = this.reservationForm.get('opstartTime')?.value;
    let combinedDateStartTime: string | null = null;
    if (opdate && starttime) {
      combinedDateStartTime = `${opdate}T${starttime}:00`;
    }
    const endtime = this.reservationForm.get('opendTime')?.value;
    let combinedDateEndTime: string | null = null;
    if (opdate && endtime) {
      combinedDateEndTime = `${opdate}T${endtime}:00`;
    }

    this.reservationForm.get('reservationDate').setValue(this.datePipe.transform(this.dateTimeObj?.date, 'yyyy-MM-dd'));
    this.reservationForm.get('reservationTime').setValue(this.dateTimeObj?.time);
    this.reservationForm.get('duration')?.setValue(combineddurationTime);
    this.reservationForm.get('opstartTime')?.setValue(combinedDateStartTime);
    this.reservationForm.get('opendTime')?.setValue(combinedDateEndTime);
    this.reservationForm.get('opdate').setValue(this.datePipe.transform(this.reservationForm.get('opdate').value, 'yyyy-MM-dd'));
    this.reservationForm.get('opIpId').setValue(this.opIpId);
    this.reservationForm.get('otrequestId').setValue(Number(this.votbookingId ?? 0));

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

        if (selectedData?.otRequestTime) {
          const date = new Date(selectedData.otRequestTime);
          if (!isNaN(date.getTime())) {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');

            const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

            setTimeout(() => {
              this.reservationForm.get('opstartTime')?.setValue(formattedTime);
            });
          }
        }

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

  onEnterKey(event: KeyboardEvent) {
    event.preventDefault();

    const form = (event.target as HTMLElement).closest('form');
    if (!form) return;

    const focusable = Array.from(
      form.querySelectorAll<HTMLElement>(
        'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute('disabled') && !el.hasAttribute('readonly'));

    const index = focusable.indexOf(event.target as HTMLElement);
    if (index > -1 && index < focusable.length - 1) {
      focusable[index + 1].focus();
    }
  }

}





