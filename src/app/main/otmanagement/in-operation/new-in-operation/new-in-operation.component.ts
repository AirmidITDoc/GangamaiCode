import { Component, EventEmitter, Inject, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { DatePipe } from '@angular/common';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { OtReqInsert } from '../../ot-request/ot-request.component';
import { MatTableDataSource } from '@angular/material/table';
import { InOperationService } from '../in-operation.service';

@Component({
  selector: 'app-new-in-operation',
  templateUrl: './new-in-operation.component.html',
  styleUrls: ['./new-in-operation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewInOperationComponent {
  inOperForm: FormGroup;
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
  vsurgeryType: any = "1";
  isActive: boolean = true;
  vSelectedOption: any = 'OP';
  vRegNo: any;
  vPatientName: any;
  vOPDNo: any;
  vIPDNo: any;
  registerObj1 = new OtReqInsert({});
  surgName: any;
  surgeonName: any;
  editIndex: number | null = null;
  AnthName: any;
  anesthesiaType: any;
  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  isTimeChanged: boolean = false;
  isDatePckrDisabled: boolean = false;
  movedatetime: any;
  timeflag = 0
  minDate: Date;

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
  autocompleteModeSurgeryMaster: String = "SurgeryMaster";
  autocompleteModeConDoctor: String = "ConDoctor";
  autocompleteModeRefDoctor: String = "RefDoctor";
  autocompleteModeOTTable: String = "OttableMaster";
  autocompleteModeLocation: string = "Location";
  autocompleteModeAnesthesiatypes: string = "Anesthesiatypes"
  autocompleteModeSurgeryCategory: String = "SurgeryCategory";
  dssurgeryDetailList = new MatTableDataSource<OtReqInsert>();
  Chargelist: any[] = [];
  dsattendentDetailList = new MatTableDataSource<OtReqInsert>();
  Chargelist1: any[] = [];
  surgeryTypeNames: string[] = ["Normal", "Emergency"];

  constructor(public _inOpearionService: InOperationService,
    public dialogRef: MatDialogRef<NewInOperationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<NewInOperationComponent>,
    public _AdmissionService: AdmissionService,
    public datePipe: DatePipe,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.inOperForm = this._inOpearionService.createInOperationForm();
    this.inOperForm.markAllAsTouched();

    if ((this.data?.otreservationId) > 0) {
      this.registerObj = this.data
      console.log(this.registerObj)
      this.vRegNo = this.registerObj.regNo
      this.vOPDNo = this.registerObj.opdNo
      this.vIPDNo = this.registerObj.ipdNo
      this.vPatientName = this.registerObj.patientName
      this.votbookingId = this.registerObj.otBookingId
      this.opIpId = this.registerObj.opIpId
      this.vInstruction = this.registerObj.instruction

      if (this.registerObj.opIpType == 0) {
        this.vSelectedOption = "OP"
      }
      else {
        this.vSelectedOption = "IP"
      }
      this.inOperForm.patchValue(this.registerObj);
    }
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

  patientInfoReset() {
    this.inOperForm.get('opIpId').setValue('');
    this.inOperForm.get('opIpId').reset();
    this.vRegNo = '';
    this.vPatientName = '';
    this.vIPDNo = '';
    this.registerObj1 = new OtReqInsert({});
  }

  getSelectedObjIP(obj) {
    if ((obj.regID ?? 0) > 0) {
      this.registerObj1 = obj
      console.log("Admitted patient:", this.registerObj1)
      this.vRegNo = obj.regNo
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vIPDNo = obj.ipdNo
      this.opIpId = obj.admissionID;
    }
  }

  getSelectedObjOP(obj) {
    if ((obj.regId ?? 0) > 0) {
      this.registerObj1 = obj
      console.log("Visite Patient:", this.registerObj1)
      this.vRegNo = obj.regNo
      this.vOPDNo = obj.opdNo
      let nameField = obj.formattedText;
      let extractedName = nameField.split('|')[0].trim();
      this.vPatientName = extractedName;
      this.opIpId = obj.visitId;
    }
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
  addDiagnolist: any = [];
  selectChangeDiagnosis(selectedChips: string[]) {
    this.addDiagnolist = selectedChips;
    this.inOperForm.get('preOperDiagnosis')?.setValue(this.addDiagnolist);
  }
  selectChangeanesthesiaType(obj: any) {
    this.anesthesiaType = obj.text
  }

  onChangeDuration(event: any) {
    // debugger
    const durationHours = parseFloat(this.inOperForm.get('duration')?.value); // e.g. 1.5
    const startTime = this.inOperForm.get('fromTime')?.value; // "HH:mm"

    if (durationHours && startTime) {
      const [sh, sm] = startTime.split(':').map(Number);

      const startMinutes = sh * 60 + sm;
      const durationMinutes = Math.round(durationHours * 60);

      const endMinutes = startMinutes + durationMinutes;
      const eh = Math.floor(endMinutes / 60) % 24;
      const em = endMinutes % 60;

      const endTime = `${this.pad(eh)}:${this.pad(em)}`;
      this.inOperForm.get('toTime')?.setValue(endTime);
    }
  }

  onChangeTimefrom(event: any) {
    const duration = this.inOperForm.get('duration')?.value;
    const startTime = this.inOperForm.get('fromTime')?.value;

    if (duration) {
      this.onChangeDuration(null); // reuse logic for calculating end time
    } else {
      const endTime = this.inOperForm.get('toTime')?.value;
      if (endTime) {
        this.calculateDuration(startTime, endTime);
      }
    }
  }

  onChangeTimeto(event: any) {
    const startTime = this.inOperForm.get('fromTime')?.value;
    const endTime = this.inOperForm.get('toTime')?.value;

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
    this.inOperForm.get('duration')?.setValue(duration);
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  onClear(val: boolean) {
    this.inOperForm.reset();
    this.dialogRef.close(val);
  }


  /////////////////////////////// surgery detail part /////////////////////////////
  onAdd() {
    if (!this.inOperForm.get("surgeryType")?.value) {
      this.toastr.warning('Please select a surgery Type', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperForm.get("surgeryId")?.value) {
      this.toastr.warning('Please select a Surgery', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperForm.get("duration")?.value) {
      this.toastr.warning('Please enter Duration', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperForm.get("fromTime")?.value) {
      this.toastr.warning('Please enter From time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperForm.get("toTime")?.value) {
      this.toastr.warning('Please enter To time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperForm.get("surgeonId")?.value) {
      this.toastr.warning('Please select a Surgeon', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.inOperForm.get("anestheticsDr")?.value) {
      this.toastr.warning('Please select a AnestheticsDr', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    debugger

    let newEntry = {
      surgeryType: this.inOperForm.get('surgeryType').value,
      surgeryId: this.inOperForm.get('surgeryId').value,//
      surgeryName: this.surgName,
      duration: this.inOperForm.get('duration').value,
      fromTime: this.inOperForm.get('fromTime').value,
      toTime: this.inOperForm.get('toTime').value,
      isprimary: this.inOperForm.get('isprimary').value,
      surgeonId: this.inOperForm.get('surgeonId').value,//
      surgeonName: this.surgeonName,
      anestheticsId: this.inOperForm.get('anestheticsDr').value, //
      anestheticsName: this.AnthName,
    };
    // this.Chargelist.push(newEntry);
    if (this.editIndex !== null) {
      this.Chargelist[this.editIndex] = newEntry;
      this.editIndex = null;
    } else {
      this.Chargelist.push(newEntry);
    }
    this.dssurgeryDetailList.data = [...this.Chargelist];

    //  Also add surgeon & anesthetist to second table (attendants) ---
    // if (this.surgeonName) {
    //   let surgeonEntry = {
    //     anestypeId: null,
    //     anesthesiaType: "Surgeon",
    //     anestheticsId1: newEntry.surgeonId,
    //     anestheticsName1: this.surgeonName
    //   };
    //   this.Chargelist1.push(surgeonEntry);
    // }

    // if (this.AnthName) {
    //   let anesthetistEntry = {
    //     anestypeId: null,
    //     anesthesiaType: "Anesthetist",
    //     anestheticsId1: newEntry.anestheticsId,
    //     anestheticsName1: this.AnthName
    //   };
    //   this.Chargelist1.push(anesthetistEntry);
    // }

    this.dsattendentDetailList.data = [...this.Chargelist1];

    this.inOperForm.patchValue({
      surgeryType: '',
      surgeryId: '',
      duration: '',
      fromTime: '',
      toTime: '',
      isprimary: false,
      surgeonId: '',
      anestheticsDr: ''
    });

    this.surgName = '';
    this.surgeonName = '';
    this.AnthName = '';
  }

  deleteTableRow(event, element) {

    let index = this.Chargelist.indexOf(element);
    if (index >= 0) {
      this.Chargelist.splice(index, 1);
      this.dssurgeryDetailList.data = [];
      this.dssurgeryDetailList.data = this.Chargelist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  onEdit(contact: any) {
    debugger
    console.log("Editing row:", contact);

    // Patch values into the form
    this.inOperForm.patchValue({
      surgeryType: contact.surgeryType ?? '',
      surgeryId: contact.surgeryId ?? '',
      duration: contact.duration ?? '',
      fromTime: contact.fromTime ?? '',
      toTime: contact.toTime ?? '',
      isprimary: contact.isprimary ?? false,
      surgeonId: contact.surgeonId ?? '',
      anestheticsDr: contact.anestheticsId ?? ''
    });

    // Set display names if you have them separately
    this.surgName = contact.surgeryName ?? '';
    this.surgeonName = contact.surgeonName ?? '';
    this.AnthName = contact.anestheticsName ?? '';

    // Remove this contact from list so it can be re-added after editing
    const index = this.Chargelist.indexOf(contact);
    if (index > -1) {
      this.Chargelist.splice(index, 1);
      this.dssurgeryDetailList.data = [...this.Chargelist];
    }
  }

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

  onSubmit() {

  }

  onChangeDate(value: any) {
    // debugger;
    if (value) {
      const inputDate = new Date(value);

      const dateOfReg = new Date(Date.UTC(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
      ));
      const [datePart, timePart] = dateOfReg
        .toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        .split(',')
        .map(part => part.trim());

      this.eventEmitForParent(datePart, timePart);
      const isoDateString = dateOfReg.toISOString();
      this.inOperForm.get('theaterinDt').setValue(isoDateString);
    }
  }

   onChangeTime(event: any) {
    this.timeflag = 1;

    if (event) {
      const selectedTime = new Date(event);

      const localeString = selectedTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const [datePart, timePart] = localeString.split(',').map(part => part.trim());

      this.isTimeChanged = true;
      this.movedatetime = timePart;

      this.inOperForm.get('theaterintime').setValue(selectedTime);

      this.eventEmitForParent(datePart, timePart);
    }
  }

  
  onChangeOutDate(value: any) {
    // debugger;
    if (value) {
      const inputDate = new Date(value);

      const dateOfReg = new Date(Date.UTC(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
      ));
      const [datePart, timePart] = dateOfReg
        .toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        .split(',')
        .map(part => part.trim());

      this.eventEmitForParent(datePart, timePart);
      const isoDateString = dateOfReg.toISOString();
      this.inOperForm.get('theateroutDt').setValue(isoDateString);
    }
  }

   onChangeOutTime(event: any) {
    this.timeflag = 1;

    if (event) {
      const selectedTime = new Date(event);

      const localeString = selectedTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const [datePart, timePart] = localeString.split(',').map(part => part.trim());

      this.isTimeChanged = true;
      this.movedatetime = timePart;

      this.inOperForm.get('theaterouttime').setValue(selectedTime);

      this.eventEmitForParent(datePart, timePart);
    }
  }

  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }
}
