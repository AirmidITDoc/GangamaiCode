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
import { AnesthesiaRecordService } from '../anesthesia-record.service';
import { OtReserInsert } from '../../ot-reservation/ot-reservation.component';


@Component({
  selector: 'app-new-anesthesia-record',
  templateUrl: './new-anesthesia-record.component.html',
  styleUrls: ['./new-anesthesia-record.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewAnesthesiaRecordComponent {
  screenFromString = 'Common-form';
  dateTimeObj: any;
  vSelectedOption: any = "OP";
  vRegNo: any;
  vPatientName: any;
  vOPDNo: any;
  vIPDNo: any;
  opIpId: any;
  anesthRecordForm: FormGroup;
  autocompleteModeAnesthesiatypes: string = "Anesthesiatypes"
  registerObj1 = new OtReserInsert({});
  registerObj2 = new OtReserInsert({});
  vreservationId:any;

  constructor(public _anesthesiaRecordService: AnesthesiaRecordService,
    public dialogRef: MatDialogRef<NewAnesthesiaRecordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService) { }


  ngOnInit(): void {
    this.anesthRecordForm = this._anesthesiaRecordService.createAnesthRecordForm();
    this.anesthRecordForm.markAllAsTouched();

    if ((this.data?.otReservationId) > 0) {
      this.registerObj1 = this.data
      console.log(this.registerObj1)
      this.vRegNo = this.registerObj1.regNo
      this.vOPDNo = this.registerObj1.opdNo
      this.vIPDNo = this.registerObj1.opdNo
      this.vPatientName = this.registerObj1.patientName

      if (this.data.otReservationId) {
        setTimeout(() => {
          this._anesthesiaRecordService.getotReservationById(this.data.otReservationId).subscribe((response) => {
            this.registerObj2 = response;
            console.log("Get Data:", this.registerObj2)
            this.vreservationId = this.registerObj2.otreservationId
            this.opIpId = this.registerObj2.opipid
          });
        }, 500);
      }

      this.anesthRecordForm.patchValue(this.registerObj1);
    }
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj)
  }

  addDiagnolist: any = [];
  selectChangeDiagnosis(selectedChips: string[]) {
    this.addDiagnolist = selectedChips;
    this.anesthRecordForm.get('Diagnosis')?.setValue(this.addDiagnolist);
  }

  anethstartTime: any;
  anethendTime: any;
  revocerystartTime: any;
  revoceryendTime: any;
  onChangeAnethStartTime(event: any) {
    let time = event.target.value;
    if (time && time.length >= 5) {
      time = time.substring(0, 5);
    }
    console.log("Time changed:", time); // "11:51"
    this.anethstartTime = time
    this.anesthRecordForm.get('AnethStartTime')?.setValue(time, { emitEvent: false });
  }

  onChangeAnethEndTime(event: any) {
    let time = event.target.value;
    if (time && time.length >= 5) {
      time = time.substring(0, 5);
    }
    console.log("Time changed:", time); // "11:51"
    this.anethendTime = time
    this.anesthRecordForm.get('AnethEndTime')?.setValue(time, { emitEvent: false });
  }

  onChangeRecoveryStartTime(event: any) {
    let time = event.target.value;
    if (time && time.length >= 5) {
      time = time.substring(0, 5);
    }
    console.log("Time changed:", time); // "11:51"
    this.revocerystartTime = time
    this.anesthRecordForm.get('RecoveryStartTime')?.setValue(time, { emitEvent: false });
  }

  onChangeRecoveryEndTime(event: any) {
    let time = event.target.value;
    if (time && time.length >= 5) {
      time = time.substring(0, 5);
    }
    console.log("Time changed:", time); // "11:51"
    this.revoceryendTime = time
    this.anesthRecordForm.get('RecoveryEndTime')?.setValue(time, { emitEvent: false });
  }

  onSubmit() { }

  onClear(val: boolean) {
    this.dialogRef.close(val);
    this.anesthRecordForm.get('opIpType').setValue('OP')
  }
}
