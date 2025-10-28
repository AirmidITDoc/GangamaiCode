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
  selector: 'app-new-ot-post-operation',
  templateUrl: './new-ot-post-operation.component.html',
  styleUrls: ['./new-ot-post-operation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewOtPostOperationComponent {
  postOperationForm: FormGroup;
  vSelectedOption: any = "OP";

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
  opIpType: number;
  RegId: string;
  registerObj: any;
  registerObj1 = new OtReqInsert({});

  dsDetailList = new MatTableDataSource<OtReqInsert>();
  dsattendentDetailList = new MatTableDataSource<OtReqInsert>();
  Chargelist: any[] = [];
  Chargelist1: any[] = [];
  surgeryTypeNames: string[] = ["Normal", "Emergency"];
  autocompleteModeOTTable: String = "OttableMaster";
  autocompleteModeLocation: string = "Location";
  addDiagnolist: any = [];

  displayedColumns1: string[] = [
    'surgeryType',
    'surgeryName',
    'duration',
    'fromTime',
    'toTime',
    'surgeryDt',
    'surgeryAmt',
    'discPer',
    'ConcAmt',
    'InfectivePer',
    'infectiveAmt',
    'netAmt',
    'Action'
  ];

  displayedColumns2: string[] = [
    'resourceType',
    'attendentType',
    'attendent',
    'fromTime',
    'toTime',
    'priceType',
    'base',
    'basePer',
    'grossAmt',
    // 'Action'
  ]

  constructor(public _OTPostOperationService: OtPreoperationService,
    public dialogRef: MatDialogRef<NewOtPostOperationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public _AdmissionService: AdmissionService,
    public datePipe: DatePipe,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.postOperationForm = this._OTPostOperationService.createOtPostOperationForm();
    this.postOperationForm.markAllAsTouched();

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
      this.postOperationForm.patchValue(this.registerObj);
    }
    this.postOperationForm.get("doctorTypeId")?.setValue(this.registerObj.categoryId)
  }

  calculateAmt() {
    const surgeryAmt = +this.postOperationForm.get('surgeryAmt')?.value || 0;
    const discPer = +this.postOperationForm.get('DiscPer')?.value || 0;
    const infectivePer = +this.postOperationForm.get('InfectivePer')?.value || 0;

    const concAmt = +((surgeryAmt * discPer) / 100).toFixed(2);
    const infectiveAmt = +(((surgeryAmt - concAmt) * infectivePer) / 100).toFixed(2);
    const netAmt = +(surgeryAmt - concAmt + infectiveAmt).toFixed(2);

    this.postOperationForm.patchValue({
      concAmt,
      InfectiveAmt: infectiveAmt,
      netAmt
    });
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
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj)
  }

  selectChangeDiagnosis(selectedChips: string[]) {
    this.addDiagnolist = selectedChips;
    this.postOperationForm.get('Diagnosis')?.setValue(this.addDiagnolist);
  }

  //////////////////////// details part start ////////////////////////////

  onAdd() {
    if (!this.postOperationForm.get("surgeryType")?.value) {
      this.toastr.warning('Please select a surgery Type', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.postOperationForm.get("surgeryId")?.value) {
      this.toastr.warning('Please select a Surgery', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.postOperationForm.get("duration")?.value) {
      this.toastr.warning('Please enter Duration', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.postOperationForm.get("fromTime")?.value) {
      this.toastr.warning('Please enter From time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.postOperationForm.get("toTime")?.value) {
      this.toastr.warning('Please enter To time', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    debugger

    let newEntry = {
      surgeryType: this.postOperationForm.get('surgeryType').value,
      surgeryId: this.postOperationForm.get('surgeryId').value,//
      surgeryName: this.surgName,
      duration: this.postOperationForm.get('duration').value,
      fromTime: this.postOperationForm.get('fromTime').value,
      toTime: this.postOperationForm.get('toTime').value,
      surgeryDt: this.postOperationForm.get('Surgerydate').value,
      surgeryAmt: this.postOperationForm.get('surgeryAmt').value,
      discPer: this.postOperationForm.get('DiscPer').value,
      ConcAmt: this.postOperationForm.get('concAmt').value,
      InfectivePer: this.postOperationForm.get('InfectivePer').value,
      infectiveAmt: this.postOperationForm.get('InfectiveAmt').value,
      netAmt: this.postOperationForm.get('netAmt').value,
    };
    // this.Chargelist.push(newEntry);
    if (this.editIndex !== null) {
      this.Chargelist[this.editIndex] = newEntry;
      this.editIndex = null;
    } else {
      this.Chargelist.push(newEntry);
    }
    this.dsDetailList.data = [...this.Chargelist];
    this.dsattendentDetailList.data = [...this.Chargelist1];

    this.postOperationForm.patchValue({
      surgeryType: '',
      surgeryId: '',
      duration: '',
      fromTime: '',
      toTime: '',
      surgeryDt: '',
      surgeryAmt: '',
      DiscPer: '',
      concAmt: '',
      InfectivePer: '',
      InfectiveAmt: '',
      netAmt: '',
    });

    this.surgName = '';
    this.surgeonName = '';
    this.AnthName = '';
  }

  deleteTableRow(event, element) {

    let index = this.Chargelist.indexOf(element);
    if (index >= 0) {
      this.Chargelist.splice(index, 1);
      this.dsDetailList.data = [];
      this.dsDetailList.data = this.Chargelist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  onEdit(contact: any) {
    debugger
    console.log("Editing row:", contact);

    // Patch values into the form
    this.postOperationForm.patchValue({
      surgeryType: contact.surgeryType ?? '',
      surgeryId: contact.surgeryId ?? '',
      duration: contact.duration ?? '',
      fromTime: contact.fromTime ?? '',
      toTime: contact.toTime ?? '',
      surgeryDt: contact.surgeryDt ?? '',
      surgeryAmt: contact.surgeryAmt ?? '',
      DiscPer: contact.discPer ?? '',
      concAmt: contact.ConcAmt ?? '',
      InfectivePer: contact.InfectivePer ?? '',
      InfectiveAmt: contact.infectiveAmt ?? '',
      netAmt: contact.netAmt ?? '',
    });

    // Set display names if you have them separately
    this.surgName = contact.surgeryName ?? '';
    this.surgeonName = contact.surgeonName ?? '';
    this.AnthName = contact.anestheticsName ?? '';

    // Remove this contact from list so it can be re-added after editing
    const index = this.Chargelist.indexOf(contact);
    if (index > -1) {
      this.Chargelist.splice(index, 1);
      this.dsDetailList.data = [...this.Chargelist];
    }
  }

  selectChangeSurgery(obj: any) {
    this.surgName = obj.text
  }

  //////////////////////// details part end ////////////////////////////

  //////////////////////// PartOfBody start ////////////////////////////
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

  //////////////////////// PartOfBody end ////////////////////////////

  onSubmit() {

  }

  onClear(val: boolean) {
    this.dialogRef.close(val);
    this.postOperationForm.get('opIpType').setValue('OP')
  }

  onChangeDuration(event: any) {
    // debugger
    const durationHours = parseFloat(this.postOperationForm.get('duration')?.value); // e.g. 1.5
    const startTime = this.postOperationForm.get('fromTime')?.value; // "HH:mm"

    if (durationHours && startTime) {
      const [sh, sm] = startTime.split(':').map(Number);

      const startMinutes = sh * 60 + sm;
      const durationMinutes = Math.round(durationHours * 60);

      const endMinutes = startMinutes + durationMinutes;
      const eh = Math.floor(endMinutes / 60) % 24;
      const em = endMinutes % 60;

      const endTime = `${this.pad(eh)}:${this.pad(em)}`;
      this.postOperationForm.get('toTime')?.setValue(endTime);
    }
  }

  onChangeTimefrom(event: any) {
    const duration = this.postOperationForm.get('duration')?.value;
    const startTime = this.postOperationForm.get('fromTime')?.value;

    if (duration) {
      this.onChangeDuration(null); // reuse logic for calculating end time
    } else {
      const endTime = this.postOperationForm.get('toTime')?.value;
      if (endTime) {
        this.calculateDuration(startTime, endTime);
      }
    }
  }

  onChangeTimeto(event: any) {
    const startTime = this.postOperationForm.get('fromTime')?.value;
    const endTime = this.postOperationForm.get('toTime')?.value;

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
    this.postOperationForm.get('duration')?.setValue(duration);
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }
}
