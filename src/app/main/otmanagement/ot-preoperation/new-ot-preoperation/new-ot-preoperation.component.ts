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
import { OtPreoperationService } from '../ot-preoperation.service';

@Component({
  selector: 'app-new-ot-preoperation',
  templateUrl: './new-ot-preoperation.component.html',
  styleUrls: ['./new-ot-preoperation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewOtPreoperationComponent {
  preOperationForm: FormGroup;

  personalFormGroup: FormGroup;
  Regflag: boolean = false;
  Patientnewold: any = 1;
  admissionFormGroup: FormGroup;
  Regdisplay: boolean = false;
  searchFormGroup: FormGroup;

  vSelectedOption: any = "OP";
  vsurgeryType: any = "1";

  isActive: boolean = true;
  autocompleteModeSurgeryCategory: String = "SurgeryCategory";
  autocompleteModeDoctorSurgeon: String = "DoctorSurgion";
  autocompleteModeSurgeryMaster: String = "SurgeryMaster";
  autocompleteModeDoctorType: string = "DoctorType";
  autocompleteModeConDoctor: String = "ConDoctor";
  autocompleteModeAnesthesiatypes: string = "Anesthesiatypes"
  autocompleteModeRefDoctor: String = "RefDoctor";

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
  surgeryTypeNames: string[] = ["Normal", "Emergency"];
  autocompleteModeOTTable: String = "OttableMaster";
  autocompleteModeLocation: string = "Location";

  dssurgeryDetailList = new MatTableDataSource<OtReqInsert>();
  dsattendentDetailList = new MatTableDataSource<OtReqInsert>();
  Chargelist: any[] = [];
  Chargelist1: any[] = [];

  constructor(public _OTPreOperationService: OtPreoperationService,
    public dialogRef: MatDialogRef<NewOtPreoperationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    private ref: MatDialogRef<NewOtPreoperationComponent>,
    public _AdmissionService: AdmissionService,
    public datePipe: DatePipe,
    public toastr: ToastrService) { }


  ngOnInit(): void {
    this.preOperationForm = this._OTPreOperationService.createOtPreOperationForm();
    this.preOperationForm.markAllAsTouched();

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

      if (this.registerObj?.otRequestTime) {
        const date = new Date(this.registerObj.otRequestTime);

        if (!isNaN(date.getTime())) {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');

          const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

          setTimeout(() => {
            this.preOperationForm.get('otRequestTime')?.setValue(formattedTime);
          });

          console.log("Raw from backend:", this.registerObj.otRequestTime);
          console.log("Formatted:", formattedTime);
          console.log("Control value after patch:", this.preOperationForm.get('otRequestTime')?.value);
        }
      }

      console.log(this.registerObj)
      this.preOperationForm.patchValue(this.registerObj);
    }
    this.preOperationForm.get("this.isCancelledDate")?.setValue('1900-01-01')
    this.preOperationForm.get("doctorTypeId")?.setValue(this.registerObj.categoryId)
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

  patientInfoReset() {
    this.preOperationForm.get('opIpId').setValue('');
    this.preOperationForm.get('opIpId').reset();
    this.vRegNo = '';
    this.vPatientName = '';
    this.vIPDNo = '';

    this.registerObj1 = new OtReqInsert({});
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {

    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj)
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

  addDiagnolist: any = [];
  selectChangeDiagnosis(selectedChips: string[]) {
    this.addDiagnolist = selectedChips;
    this.preOperationForm.get('Diagnosis')?.setValue(this.addDiagnolist);
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
  onAdd() {
    if (!this.preOperationForm.get("surgeryType")?.value) {
      this.toastr.warning('Please select a surgery Type', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.preOperationForm.get("surgeryId")?.value) {
      this.toastr.warning('Please select a Surgery', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.preOperationForm.get("duration")?.value) {
      this.toastr.warning('Please enter Duration', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.preOperationForm.get("fromTime")?.value) {
      this.toastr.warning('Please enter From time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.preOperationForm.get("toTime")?.value) {
      this.toastr.warning('Please enter To time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.preOperationForm.get("surgeonId")?.value) {
      this.toastr.warning('Please select a Surgeon', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.preOperationForm.get("anestheticsDr")?.value) {
      this.toastr.warning('Please select a AnestheticsDr', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    debugger

    let newEntry = {
      surgeryType: this.preOperationForm.get('surgeryType').value,
      surgeryId: this.preOperationForm.get('surgeryId').value,//
      surgeryName: this.surgName,
      duration: this.preOperationForm.get('duration').value,
      fromTime: this.preOperationForm.get('fromTime').value,
      toTime: this.preOperationForm.get('toTime').value,
      isprimary: this.preOperationForm.get('isprimary').value,
      surgeonId: this.preOperationForm.get('surgeonId').value,//
      surgeonName: this.surgeonName,
      anestheticsId: this.preOperationForm.get('anestheticsDr').value, //
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

    this.preOperationForm.patchValue({
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
    this.preOperationForm.patchValue({
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

  /////////////////////////////// attendent detail part /////////////////////////////
  onAdd1() {
    debugger

    let newEntry = {
      anestypeId: this.preOperationForm.get('anestypeId').value,//
      anesthesiaType: this.anesthesiaType,
      anestheticsId1: this.preOperationForm.get('anestheticsDr1').value, //
      anestheticsName1: this.AnthName1,
    };
    // this.Chargelist.push(newEntry);
    if (this.editIndex1 !== null) {
      this.Chargelist1[this.editIndex1] = newEntry;
      this.editIndex1 = null;
    } else {
      this.Chargelist1.push(newEntry);
    }
    this.dsattendentDetailList.data = [...this.Chargelist1];

    this.preOperationForm.patchValue({
      anestypeId: '',
      anestheticsDr1: ''
    });
    this.anesthesiaType = '';
    this.AnthName1 = '';
  }

  deleteTableRow1(event, element) {

    let index = this.Chargelist1.indexOf(element);
    if (index >= 0) {
      this.Chargelist1.splice(index, 1);
      this.dsattendentDetailList.data = [];
      this.dsattendentDetailList.data = this.Chargelist1;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  onEdit1(contact: any) {
    debugger
    console.log("Editing row:", contact);

    // Patch values into the form
    this.preOperationForm.patchValue({
      anestypeId: contact.anestypeId ?? '',
      anestheticsDr1: contact.anestheticsId1 ?? ''
    });

    this.anesthesiaType = contact.anesthesiaType ?? '';
    this.AnthName1 = contact.anestheticsName1 ?? '';

    // Remove this contact from list so it can be re-added after editing
    const index = this.Chargelist1.indexOf(contact);
    if (index > -1) {
      this.Chargelist1.splice(index, 1);
      this.dsattendentDetailList.data = [...this.Chargelist1];
    }
  }

  /////////////////////////////// attendent detail part end/////////////////////////////

  onSubmit() { }

  onClear(val: boolean) {
    this.dialogRef.close(val);
    this.preOperationForm.get('opIpType').setValue('OP')
  }

  onChangeDuration(event: any) {
    // debugger
    const durationHours = parseFloat(this.preOperationForm.get('duration')?.value); // e.g. 1.5
    const startTime = this.preOperationForm.get('fromTime')?.value; // "HH:mm"

    if (durationHours && startTime) {
      const [sh, sm] = startTime.split(':').map(Number);

      const startMinutes = sh * 60 + sm;
      const durationMinutes = Math.round(durationHours * 60);

      const endMinutes = startMinutes + durationMinutes;
      const eh = Math.floor(endMinutes / 60) % 24;
      const em = endMinutes % 60;

      const endTime = `${this.pad(eh)}:${this.pad(em)}`;
      this.preOperationForm.get('toTime')?.setValue(endTime);
    }
  }

  onChangeTimefrom(event: any) {
    const duration = this.preOperationForm.get('duration')?.value;
    const startTime = this.preOperationForm.get('fromTime')?.value;

    if (duration) {
      this.onChangeDuration(null); // reuse logic for calculating end time
    } else {
      const endTime = this.preOperationForm.get('toTime')?.value;
      if (endTime) {
        this.calculateDuration(startTime, endTime);
      }
    }
  }

  onChangeTimeto(event: any) {
    const startTime = this.preOperationForm.get('fromTime')?.value;
    const endTime = this.preOperationForm.get('toTime')?.value;

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
    this.preOperationForm.get('duration')?.setValue(duration);
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }
}
