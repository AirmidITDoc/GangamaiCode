import { DatePipe } from '@angular/common';
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { OtReserInsert } from '../../ot-reservation/ot-reservation.component';
import { Otanesthesia } from '../anesthesia-record.component';
import { AnesthesiaRecordService } from '../anesthesia-record.service';


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
    anethstartTime: any;
    anethendTime: any;
    revocerystartTime: any;
    revoceryendTime: any;
    vAnethStartDt: any = new Date()
    vAnethEndDt: any = new Date()
    vRecoveryStartDt: any = new Date()
    vRecoveryEndDt: any = new Date()
    isDatePckrDisabled: boolean = false;
    vanestypeId = 0
    addDiagnolist: any = [];
    RtrvDescriptionList: any = [];
    AllTypeDescription: any = []
    OPIPType = 0

    @ViewChild('ddlDiagnosis') ddlDiagnosis: AirmidDropDownComponent;

    constructor(public _anesthesiaRecordService: AnesthesiaRecordService,
        public dialogRef: MatDialogRef<NewAnesthesiaRecordComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _matDialog: MatDialog, private _formBuilder: UntypedFormBuilder,
        public datePipe: DatePipe, private _FormvalidationserviceService: FormvalidationserviceService, private commonService: PrintserviceService,
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
            this.vanesthesiaId = this.registerObj1.anesthesiaId
            this.opIpId = this.registerObj1.opIpId
            this.vPatientName = this.registerObj1.patientName
            this.OPIPType = this.registerObj1.opIpType

            if (this.vanesthesiaId) {
                setTimeout(() => {
                    this._anesthesiaRecordService.getAnesthesiaById(this.vanesthesiaId).subscribe((response) => {
                        this.registerObj2 = response;
                        console.log(response)
                        if (response) {
                            this.vNotes = this.registerObj2.anesthesiaNotes

                            debugger
                            this.anesthRecordForm.get('AnethStartDt').setValue(this.datePipe.transform(this.registerObj2.anesthesiaStartDate, 'yyyy-MM-dd'));
                            this.anesthRecordForm.get('AnethEndDt').setValue(this.datePipe.transform(this.registerObj2.anesthesiaEndDate, 'yyyy-MM-dd'));
                            this.anesthRecordForm.get('RecoveryStartDt').setValue(this.datePipe.transform(this.registerObj2.recoveryStartDate, 'yyyy-MM-dd'));
                            this.anesthRecordForm.get('RecoveryEndDt').setValue(this.datePipe.transform(this.registerObj2.recoveryEndDate, 'yyyy-MM-dd'));



                            const datetimeString = this.registerObj2.anesthesiaStartTime;
                            const [datePart, timePart] = datetimeString.split(' ');
                            const [hours, minutes /*, seconds */] = timePart.split(':');
                            const timeValue = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;  // '11:11'
                            this.anesthRecordForm.get('AnethStartTime')?.setValue(timeValue);
                            const datetimeString1 = this.registerObj2.anesthesiaEndTime
                            const [datePart1, timePart1] = datetimeString1.split(' ');
                            const [hours1, minutes1 /*, seconds */] = timePart1.split(':');
                            const timeValue1 = `${hours1.padStart(2, '0')}:${minutes1.padStart(2, '0')}`;  // '11:11'
                            this.anesthRecordForm.get('AnethEndTime')?.setValue(timeValue1);
                            const datetimeString2 = this.registerObj2.recoveryStartTime;
                            const [datePart2, timePart2] = datetimeString2.split(' ');
                            const [hours2, minutes2 /*, seconds */] = timePart2.split(':');
                            const timeValue2 = `${hours2.padStart(2, '0')}:${minutes2.padStart(2, '0')}`;  // '11:11'
                            this.anesthRecordForm.get('RecoveryStartTime')?.setValue(timeValue2);
                            const datetimeString3 = this.registerObj2.recoveryEndTime;
                            const [datePart3, timePart3] = datetimeString3.split(' ');
                            const [hours3, minutes3 /*, seconds */] = timePart3.split(':');
                            const timeValue3 = `${hours3.padStart(2, '0')}:${minutes3.padStart(2, '0')}`;  // '11:11'
                            this.anesthRecordForm.get('RecoveryEndTime')?.setValue(timeValue3);



                            this.anesthRecordForm.get('anestypeId').setValue(this.registerObj2.anesthesiaType);
                            this.vanestypeId = this.registerObj2.anesthesiaType

                            console.log("Get Data:", this.anesthRecordForm.value)


                        }
                    });
                }, 500);
            }


            this.getdiagnosisList(this.registerObj2);
        }
    }

    createAnesthRecordForm(): FormGroup {
        const now = new Date();
        const defaultTime = now.toTimeString().slice(0, 5);
        return this._formBuilder.group({
            AnethStartDt: [(new Date()).toISOString(), Validators.required],
            AnethStartTime: ['', [Validators.required]],
            AnethEndDt: [(new Date()).toISOString(), Validators.required],
            AnethEndTime: ['', [Validators.required]],
            RecoveryStartDt: [(new Date()).toISOString(), Validators.required],
            RecoveryStartTime: ['', [Validators.required]],
            RecoveryEndDt: [(new Date()).toISOString(), Validators.required],
            RecoveryEndTime: ['', [Validators.required]],
            anestypeId: [0],
            Diagnosis: [[]],
            notes: '',
        });
    }

    createanesthRecordFinalForm() {
        const now = new Date();
        const defaultTime = now.toTimeString().slice(0, 5);
        return this._formBuilder.group({
            anesthesiaId: [this.vanesthesiaId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
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


    selectChangeDiagnosis(selectedChips: string[]) {
        this.addDiagnolist = selectedChips;
        this.anesthRecordForm.get('Diagnosis')?.setValue(this.addDiagnolist);
    }


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

    onSubmit() {

        this.anesthRecordFinalForm.get('otreservationId').setValue(this.otreservationId);
        this.anesthRecordFinalForm.get('opipid').setValue(this.opIpId);
        this.anesthRecordFinalForm.get('anesthesiaType')?.setValue(this.anesthRecordForm.get('anestypeId').value || 0);
        this.anesthRecordFinalForm.get('anesthesiaNotes').setValue(this.vNotes);


        this.anesthRecordFinalForm.get('anesthesiaId').setValue(this.vanesthesiaId);

        // this.anesthRecordFinalForm.get('otpreOperationTime').setValue(formattedTime);
        console.log(this.anesthRecordFinalForm.value)
        this.anesthRecordFinalForm.get('anesthesiaStartDate').setValue(this.datePipe.transform(this.anesthRecordForm.get('AnethStartDt').value, "yyyy-MM-dd"));
        this.anesthRecordFinalForm.get('anesthesiaStartTime').setValue(this.anesthRecordForm.get('AnethStartTime').value);

        this.anesthRecordFinalForm.get('anesthesiaEndDate').setValue(this.datePipe.transform(this.anesthRecordForm.get('AnethEndDt').value, "yyyy-MM-dd"));
        this.anesthRecordFinalForm.get('anesthesiaEndTime').setValue(this.anesthRecordForm.get('AnethEndTime').value);


        this.anesthRecordFinalForm.get('recoveryStartDate').setValue(this.datePipe.transform(this.anesthRecordForm.get('RecoveryStartDt').value, "yyyy-MM-dd"));
        this.anesthRecordFinalForm.get('recoveryStartTime').setValue(this.anesthRecordForm.get('RecoveryStartTime').value);

        this.anesthRecordFinalForm.get('recoveryEndDate').setValue(this.datePipe.transform(this.anesthRecordForm.get('RecoveryEndDt').value, "yyyy-MM-dd"));
        this.anesthRecordFinalForm.get('recoveryEndTime').setValue(this.anesthRecordForm.get('RecoveryEndTime').value);


        console.log(this.anesthRecordFinalForm.value)

        if (!this.anesthRecordFinalForm.invalid) {

            this.tOtAnesthesiaPreOpdiagnosesArray.clear();
            this.addDiagnolist.forEach(item => {
                this.tOtAnesthesiaPreOpdiagnosesArray.push(this.createtOtAnesthesiaPreOpdiagnosesInsert(item));
            });

            console.log(this.anesthRecordFinalForm.value)

            this._anesthesiaRecordService.InsertOTAnesthesia(this.anesthRecordFinalForm.value).subscribe(response => {
                console.log(response)
                this.viewgetAnethesiaReportPdf(response)
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

    viewgetAnethesiaReportPdf(element) {
        console.log(element)
        debugger
        const param = {
            searchFields: [
                {
                    fieldName: "OPIPID",
                    fieldValue: String(this.opIpId),
                    opType: "Equals"
                },
                {
                    fieldName: "OPIPType",
                    fieldValue: String(this.OPIPType),
                    opType: "Equals"
                }
            ],
            mode: "OTAnaesthesiaRecord"
        };
        this._anesthesiaRecordService.getReportView(param).subscribe(res => {
            const matDialog = this._matDialog.open(PdfviewerComponent, {
                maxWidth: "85vw",
                height: '750px',
                width: '100%',
                data: {
                    base64: res["base64"] as string,
                    title: "OTAnaesthesia Report Viewer"
                }
            });

            matDialog.afterClosed().subscribe(result => {

            });
        });
        // this.commonService.Onprint("AnesthesiaId", element.AnesthesiaId, "OTAnaesthesiaRecord");

    }

    // viewgetAnethesiaReportPdf(AnesthesiaId) {
    //   this.commonService.Onprint("AnesthesiaId", AnesthesiaId, "OTAnaesthesiaRecord");

    // }
    getdiagnosisList(obj) {
        this.addDiagnolist = [];

        this._anesthesiaRecordService.getAnesthesiaById(this.vanesthesiaId).subscribe((response) => {

            console.log(response.tOtAnesthesiaPreOpdiagnoses)

            if (response && Array.isArray(response.tOtAnesthesiaPreOpdiagnoses)) {
                this.RtrvDescriptionList = response.tOtAnesthesiaPreOpdiagnoses;

                // let Diagnosis = this.RtrvDescriptionList.filter(item => item.descriptionType === 'Diagnosis');
                // if (Diagnosis.length > 0) {
                this.RtrvDescriptionList.forEach(element => {
                    this.addDiagnolist.push(
                        {
                            otanesthesiaPreOpdiagnosisId: element.otanesthesiaPreOpdiagnosisId,
                            descriptionName: element.descriptionName,
                            descriptionType: 'Diagnosis'
                        }
                    )
                })
                console.log(this.addDiagnolist)
                this.anesthRecordForm.get('Diagnosis').setValue(this.addDiagnolist);
                console.log("DIAGNOSIS DATA:", this.anesthRecordForm.get('Diagnosis').value)
                // }
            }
        });
    }
    onClear(val: boolean) {
        this.dialogRef.close(val);
        this.anesthRecordForm.get('opIpType').setValue('OP')
    }
}
