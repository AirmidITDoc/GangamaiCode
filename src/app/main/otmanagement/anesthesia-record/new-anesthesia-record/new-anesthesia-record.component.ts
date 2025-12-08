import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { Otanesthesia } from '../anesthesia-record.component';


@Component({
  selector: 'app-new-anesthesia-record',
  templateUrl: './new-anesthesia-record.component.html',
  styleUrls: ['./new-anesthesia-record.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewAnesthesiaRecordComponent {
  anesthRecordFinalForm: FormGroup
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
  registerObj2 = new Otanesthesia({});
  vanesthesiaId: any = 0;
  otreservationId = 0

  vAnethStartDt: any = new Date()
  vAnethEndDt: any = new Date()
  vRecoveryStartDt: any = new Date()
  vRecoveryEndDt: any = new Date()
  isDatePckrDisabled: boolean = false;
  constructor(public _anesthesiaRecordService: AnesthesiaRecordService,
    public dialogRef: MatDialogRef<NewAnesthesiaRecordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog, private _formBuilder: UntypedFormBuilder,
    public datePipe: DatePipe, private _FormvalidationserviceService: FormvalidationserviceService,
    public toastr: ToastrService) { }


  ngOnInit(): void {
    this.anesthRecordForm = this.createAnesthRecordForm();
    this.anesthRecordForm.markAllAsTouched();


    this.anesthRecordFinalForm = this.createanesthRecordFinalForm();
    this.tOtAnesthesiaPreOpdiagnosesArray.push(this.createtOtAnesthesiaPreOpdiagnosesInsert())

    const formatTime = (datetime: string) => datetime ? new Date(datetime).toTimeString().slice(0, 5) : '';

    if ((this.data?.otReservationId) > 0) {
      this.registerObj1 = this.data
      console.log(this.registerObj1)
      this.vRegNo = this.registerObj1.regNo
      this.vOPDNo = this.registerObj1.opdNo
      this.vIPDNo = this.registerObj1.opdNo
      this.otreservationId = this.registerObj1.otReservationId

      this.opIpId = this.registerObj1.opIpId



      this.vPatientName = this.registerObj1.patientName

      if (this.otreservationId) {
        setTimeout(() => {
          this._anesthesiaRecordService.getAnesthesiaById(this.otreservationId).subscribe((response) => {
            this.registerObj2 = response;
            console.log(response)

            if (this.registerObj2.anesthesiaId) {
              this.vAnethStartDt = this.registerObj2.anesthesiaStartDate
              this.vAnethEndDt = this.registerObj2.anesthesiaEndDate
              this.vRecoveryStartDt = this.registerObj2.recoveryStartDate
              this.vRecoveryEndDt = this.registerObj2.recoveryEndDate

              debugger
              this.anesthRecordForm.get('AnethStartDt').setValue(this.datePipe.transform(this.registerObj2.anesthesiaStartDate, 'yyyy-MM-dd'));
              this.anesthRecordForm.get('AnethStartTime').setValue(this.datePipe.transform(this.registerObj2.anesthesiaStartTime, "HH:mm:ss"));

              this.anesthRecordForm.get('AnethEndDt').setValue(this.datePipe.transform(this.registerObj2.anesthesiaEndDate, 'yyyy-MM-dd'));
              this.anesthRecordForm.get('AnethEndTime').setValue(this.datePipe.transform(this.registerObj2.anesthesiaEndTime, "HH:mm:ss"));

              this.anesthRecordForm.get('RecoveryStartDt').setValue(this.datePipe.transform(this.registerObj2.recoveryStartDate, 'yyyy-MM-dd'));
              this.anesthRecordForm.get('AnethEndTime').setValue(this.datePipe.transform(this.registerObj2.recoveryStartTime, "HH:mm:ss"));

              this.anesthRecordForm.get('RecoveryEndDt').setValue(this.datePipe.transform(this.registerObj2.recoveryEndDate, 'yyyy-MM-dd'));
              this.anesthRecordForm.get('AnethEndTime').setValue(this.datePipe.transform(this.registerObj2.recoveryEndTime, "HH:mm:ss"));

              console.log("Get Data:", this.registerObj2)
              this.vanesthesiaId = this.registerObj2.anesthesiaId

            }
          });
        }, 500);
      }

      this.anesthRecordForm.patchValue(this.registerObj1);
    }
  }

  createAnesthRecordForm(): FormGroup {
    const now = new Date();
    const defaultTime = now.toTimeString().slice(0, 5);
    return this._formBuilder.group({
      AnethStartDt: [(new Date()).toISOString(), Validators.required],
      AnethStartTime: [defaultTime],
      AnethEndDt: [(new Date()).toISOString(), Validators.required],
      AnethEndTime: [defaultTime],
      RecoveryStartDt: [(new Date()).toISOString(), Validators.required],
      RecoveryStartTime: [defaultTime],
      RecoveryEndDt: [(new Date()).toISOString(), Validators.required],
      RecoveryEndTime: [defaultTime],
      anestypeId: [0],
      Diagnosis: [[]],
      notes: [],
    });
  }

  createanesthRecordFinalForm() {
    const now = new Date();
    const defaultTime = now.toTimeString().slice(0, 5);
    return this._formBuilder.group({
      anesthesiaId: [this.vanesthesiaId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otreservationId: [this.otreservationId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      anesthesiaDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
      anesthesiaTime: [defaultTime, [Validators.required]], // [this.datePipe.transform(new Date(), 'shortTime'), [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      anesthesiaNo: [""],
      opipid: [this.opIpId],
      opiptype: 1,
      anesthesiaStartDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
      anesthesiaStartTime: [defaultTime, [Validators.required]], //[this.datePipe.transform(new Date(), 'shortTime'), [this._FormvalidationserviceService.allowEmptyStringValidator()]],

      anesthesiaEndDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
      anesthesiaEndTime: [defaultTime, [Validators.required]], // [this.datePipe.transform(new Date(), 'shortTime'), [this._FormvalidationserviceService.allowEmptyStringValidator()]],

      recoveryStartDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
      recoveryStartTime: [defaultTime, [Validators.required]], // [this.datePipe.transform(new Date(), 'shortTime'), [this._FormvalidationserviceService.allowEmptyStringValidator()]],

      recoveryEndDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
      recoveryEndTime: [defaultTime, [Validators.required]], // [this.datePipe.transform(new Date(), 'shortTime'), [this._FormvalidationserviceService.allowEmptyStringValidator()]],


      anesthesiaType: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      anesthesiaNotes: [''],

      tOtAnesthesiaPreOpdiagnoses: this._formBuilder.array([]),


    });
  }


  createtOtAnesthesiaPreOpdiagnosesInsert(element: any = {}, index: number = 0): FormGroup {
    console.log(element)
    return this._formBuilder.group({
      otanesthesiaPreOpdiagnosisId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      anesthesiaId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      descriptionName: [element.descriptionName],
      descriptionType: [element.descriptionType],

    });
  }
  get tOtAnesthesiaPreOpdiagnosesArray(): FormArray {
    return this.anesthRecordFinalForm.get('tOtAnesthesiaPreOpdiagnoses') as FormArray;
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj)
  }
  // myFilter = (d: Date | null): boolean => {
  //   return this.isDisableFuture ? d <= new Date() : true;
  // };
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
  vNotes = 'RS'
  onChangeAnethStartDth(Date1) {

    this.vAnethStartDt = this.datePipe.transform(Date1, "yyyy-MM-dd")
    console.log(Date1)
  }

  onChangeAnethEndDt(Date1: Date) {

    this.vAnethEndDt = this.datePipe.transform(Date1, "yyyy-MM-dd")
    console.log(Date1)
  }

  onChangeRecoveryStartDtt(Date1: Date) {

    this.vRecoveryStartDt = this.datePipe.transform(Date1, "yyyy-MM-dd")
    console.log(Date1)
  }

  onChangeRecoveryEndDt(Date1: Date) {

    this.vRecoveryEndDt = this.datePipe.transform(Date1, "yyyy-MM-dd")
    console.log(Date1)
  }
  onSubmit() {
    // const formattedDate = this.datePipe.transform(this.AdmissionTaskForm.get('AdmissionDate').value, "yyyy-MM-dd");
    //   const formattedTime = this.datePipe.transform(this.AdmissionTaskForm.get('AdmissionTime').value, "HH:mm:ss");


    // console.log(this.vAnethStartDt)
    // console.log(this.anesthRecordForm.get('AnethStartDt').value)

    // const formattedDate1 = this.datePipe.transform(this.vAnethStartDt, "yyyy-MM-dd");
    // const formattedDate2 = this.datePipe.transform(this.vAnethEndDt, "yyyy-MM-dd");

    // const formattedDate3 = this.datePipe.transform(this.vRecoveryStartDt, "yyyy-MM-dd");

    // const formattedDate4 = this.datePipe.transform(this.vRecoveryEndDt, "yyyy-MM-dd");

    // const formattedTime1 = this.anesthRecordForm.get('AnethStartTime').value;

    debugger
    this.anesthRecordFinalForm.get('otreservationId').setValue(this.otreservationId);
    this.anesthRecordFinalForm.get('opipid').setValue(this.opIpId);
    this.anesthRecordFinalForm.get('anesthesiaType')?.setValue(this.anesthRecordForm.get('anestypeId').value || 0);
    this.anesthRecordFinalForm.get('anesthesiaNotes').setValue(this.vNotes);
    this.anesthRecordFinalForm.get('anesthesiaId').setValue(this.vanesthesiaId);



    // this.anesthRecordFinalForm.get('otpreOperationTime').setValue(formattedTime);
    console.log(this.anesthRecordFinalForm.value)
    this.anesthRecordFinalForm.get('anesthesiaStartDate').setValue(this.vAnethStartDt);
    this.anesthRecordFinalForm.get('anesthesiaStartTime').setValue(this.anesthRecordForm.get('AnethStartTime').value);

    this.anesthRecordFinalForm.get('anesthesiaEndDate').setValue(this.vAnethEndDt);
    this.anesthRecordFinalForm.get('anesthesiaEndTime').setValue(this.anesthRecordForm.get('AnethEndTime').value);


    this.anesthRecordFinalForm.get('recoveryStartDate').setValue(this.vRecoveryStartDt);
    this.anesthRecordFinalForm.get('recoveryStartTime').setValue(this.anesthRecordForm.get('RecoveryStartTime').value);

    this.anesthRecordFinalForm.get('recoveryEndDate').setValue(this.vRecoveryEndDt);
    this.anesthRecordFinalForm.get('recoveryEndTime').setValue(this.anesthRecordForm.get('RecoveryEndTime').value);


    console.log(this.anesthRecordFinalForm.value)

    if (!this.anesthRecordFinalForm.invalid) {

      this.tOtAnesthesiaPreOpdiagnosesArray.clear();
      this.addDiagnolist.forEach(item => {
        this.tOtAnesthesiaPreOpdiagnosesArray.push(this.createtOtAnesthesiaPreOpdiagnosesInsert(item));
      });

      console.log(this.anesthRecordFinalForm.value)
      debugger
      this._anesthesiaRecordService.InsertOTAnesthesia(this.anesthRecordFinalForm.value).subscribe(response => {
        // this.viewgetIndentReportPdf(response)
        this._matDialog.closeAll();
      });
    } else {
      const invalidFields = this.collectErrors(this.anesthRecordFinalForm);
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
        });
        return;
      }
    }
  }

  collectErrors(formGroup: FormGroup | FormArray, parentKey: string = ''): string[] {
    let errors: string[] = [];
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (control instanceof FormGroup || control instanceof FormArray) {
        // go deeper
        errors = errors.concat(this.collectErrors(control, newKey));
      } else {
        if (control?.invalid) {
          errors.push(newKey);
        }
      }
    });
    return errors;
  }



  onClear(val: boolean) {
    this.dialogRef.close(val);
    this.anesthRecordForm.get('opIpType').setValue('OP')
  }
}
