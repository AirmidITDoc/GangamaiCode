import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { DatePipe } from '@angular/common';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { MatTableDataSource } from '@angular/material/table';
import { OtReqInsert } from '../../ot-request/ot-request.component';
import { TheaterInService } from '../theater-in.service';

@Component({
  selector: 'app-new-theater-in',
  templateUrl: './new-theater-in.component.html',
  styleUrls: ['./new-theater-in.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewTheaterInComponent {
  theaterInForm: FormGroup;
  autocompleteModeDepartment: String = "Department";
  autocompleteModeSiteDescriptionId: String = "SiteDescription";
  autocompleteModeSurgeryCategory: String = "SurgeryCategory";
  autocompleteModeDoctorSurgeon: String = "DoctorSurgion";
  autocompleteModeSurgeryMaster: String = "SurgeryMaster";
  autocompleteModeDoctorType: string = "DoctorType";
  autocompleteModeConDoctor: String = "ConDoctor";
  autocompleteModeAnesthesiatypes: string = "Anesthesiatypes"
  autocompleteModeRefDoctor: String = "RefDoctor";
  autocompleteModeOTTable: String = "OttableMaster";
  autocompleteModeLocation: string = "Location";

  vRegNo: any;
  vPatientName: any;
  vbookingId: any;
  vOPDNo: any;
  vIPDNo: any;
  screenFromString = 'Common-form';
  opIpId: any;
  surgId: any;
  surgName: any;
  surgeonId: any;
  surgeonName: any;
  anestypeId: any;
  anesthesiaType: any;
  AnthId: any;
  AnthName: any;
  AnthId1: any;
  AnthName1: any;
  editIndex: number | null = null;
  editIndex1: number | null = null;
  dateTimeObj: any;
  opTime: any;
  opendTime: any;
  displayedColumns: string[] = [
    'surgeryType',
    'surgeryName',
    'duration',
    'fromTime',
    'toTime',
    'isprimary',
    'surgeon',
    'anesthesia',
    'Action'
  ];

  displayedColumns1: string[] = [
    'surgeon',
    'anesthesia',
    'Action'
  ];

  @ViewChild('surgeonList') surgeonList: AirmidDropDownComponent;
  opIpType: number;
  RegId: string;
  registerObj: any;
  registerObj1 = new OtReqInsert({});
  BloodGroupNames: string[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  dssurgeryDetailList = new MatTableDataSource<OtReqInsert>();
  dsattendentDetailList = new MatTableDataSource<OtReqInsert>();
  Chargelist: any[] = [];
  Chargelist1: any[] = [];
  opstartTime: any;
  opTheaterInTime: any;
  addDiagnolist: any = [];
  vSelectedOption: any = "OP";

  constructor(
    public _TheaterinService: TheaterInService,
    public dialogRef: MatDialogRef<NewTheaterInComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.theaterInForm = this._TheaterinService.createTheaterInForm();
    this.theaterInForm.markAllAsTouched();

    if ((this.data?.otBookingId) > 0) {
      this.registerObj = this.data
      this.vbookingId = this.registerObj.otBookingId
      this.opIpId = this.registerObj.visitId
      this.vRegNo = this.registerObj.regNo
      this.vOPDNo = this.registerObj.opdNo
      this.vIPDNo = this.registerObj.opdNo
      this.vPatientName = this.registerObj.patientName
      if (this.registerObj.opIpType == 0) {
        this.vSelectedOption = "OP"
      }
      else {
        this.vSelectedOption = "IP"
      }

      console.log(this.registerObj)
      this.theaterInForm.patchValue(this.registerObj);
    }
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

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj)
  }

  onChangeTheaterInTime(event: any) {
    let time = event.target.value;
    if (time && time.length >= 5) {
      time = time.substring(0, 5);
    }
    console.log("Time changed:", time); // "11:51"
    this.opTheaterInTime = time
    this.theaterInForm.get('theaterInTime')?.setValue(time, { emitEvent: false });
  }

  onChangeTime(event: any) {
    let time = event.target.value;
    if (time && time.length >= 5) {
      time = time.substring(0, 5);
    }
    console.log("Time changed:", time); // "11:51"
    this.opTime = time
    this.theaterInForm.get('estimateTime')?.setValue(time, { emitEvent: false });
  }

  onChangeStartTime(event: any) {
    let time = event.target.value;
    if (time && time.length >= 5) {
      time = time.substring(0, 5);
    }
    console.log("Time changed:", time); // "11:51"
    this.opstartTime = time
    this.theaterInForm.get('startTime')?.setValue(time, { emitEvent: false });
  }

  onChangeEndTime(event: any) {
    let time = event.target.value;
    if (time && time.length >= 5) {
      time = time.substring(0, 5);
    }
    console.log("Time changed:", time); // "11:51"
    this.opendTime = time
    this.theaterInForm.get('endTime')?.setValue(time, { emitEvent: false });
  }

  selectChangeDiagnosis(selectedChips: string[]) {
    this.addDiagnolist = selectedChips;
    this.theaterInForm.get('Diagnosis')?.setValue(this.addDiagnolist);
  }

  selectChangeSurgery(obj: any) {
    this.surgName = obj.text
  }
  selectChangeSurgeon(obj: any) {
    this.surgeonName = obj.text
  }
  selectChangeAnesth(obj: any) {
    this.AnthName = obj.text
  }
  selectChangeanesthesiaType(obj: any) {
    this.anesthesiaType = obj.text
  }
  selectChangeAnesth1(obj: any) {
    this.AnthName1 = obj.text
  }


  /////////////////////////////// surgery detail part /////////////////////////////

  previewUrl: string | ArrayBuffer | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Optional: use device camera directly
  openCamera() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // opens back camera on mobile
    input.onchange = (event: any) => this.onFileSelected(event);
    input.click();
  }

  /////////////////////////////// surgery detail part end /////////////////////////////

  onSubmit() { }

  onClear(val: boolean) {
    this.dialogRef.close(val);
    // this.theaterInForm.get('opIpType').setValue('OP')
  }

  onChangeDuration(event: any) {
    // debugger
    const durationHours = parseFloat(this.theaterInForm.get('duration')?.value); // e.g. 1.5
    const startTime = this.theaterInForm.get('fromTime')?.value; // "HH:mm"

    if (durationHours && startTime) {
      const [sh, sm] = startTime.split(':').map(Number);

      const startMinutes = sh * 60 + sm;
      const durationMinutes = Math.round(durationHours * 60);

      const endMinutes = startMinutes + durationMinutes;
      const eh = Math.floor(endMinutes / 60) % 24;
      const em = endMinutes % 60;

      const endTime = `${this.pad(eh)}:${this.pad(em)}`;
      this.theaterInForm.get('toTime')?.setValue(endTime);
    }
  }

  onChangeTimefrom(event: any) {
    const duration = this.theaterInForm.get('duration')?.value;
    const startTime = this.theaterInForm.get('fromTime')?.value;

    if (duration) {
      this.onChangeDuration(null); // reuse logic for calculating end time
    } else {
      const endTime = this.theaterInForm.get('toTime')?.value;
      if (endTime) {
        this.calculateDuration(startTime, endTime);
      }
    }
  }

  onChangeTimeto(event: any) {
    const startTime = this.theaterInForm.get('fromTime')?.value;
    const endTime = this.theaterInForm.get('toTime')?.value;

    if (startTime && endTime) {
      this.calculateDuration(startTime, endTime);
    }
  }

  calculateDuration(startTime: string, endTime: string) {
    // debugger
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    let durationMinutes = endMinutes - startMinutes;
    if (durationMinutes < 0) durationMinutes += 24 * 60; // handle next-day wrap

    const dh = Math.floor(durationMinutes / 60);
    const dm = durationMinutes % 60;

    const duration = `${this.pad(dh)}:${this.pad(dm)}`;
    this.theaterInForm.get('duration')?.setValue(duration);
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }
}
