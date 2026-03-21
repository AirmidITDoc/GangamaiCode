import { DatePipe } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { OtReserInsert } from '../ot-reservation.component';
import { OtReservationService } from '../ot-reservation.service';


@Component({
    selector: 'app-ot-operative-note',
    templateUrl: './ot-operative-note.component.html',
    styleUrls: ['./ot-operative-note.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class OtOperativeNoteComponent {

    OperativeFormSave: FormGroup;
    registerObj2 = new OtReserInsert({});
    registerObj1 = new OtReserInsert({});
    registerObj3 = new otOperNote({});
    vreservationId: any;
    opIpId: any;
    opiptype: any;
    vRegNo: any;
    vOPDNo: any;
    vIPDNo: any;
    vPatientName: any;
    vTemplateDesc: any;
    Tempdesc: any;
    OTOperativeNotesId: any;
    isItemIdSelected: boolean = false;

    constructor(public _OtReservationService: OtReservationService,
        public _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        public toastr: ToastrService,
        private accountService: AuthenticationService,
        public dialogRef: MatDialogRef<OtOperativeNoteComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private commonService: PrintserviceService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        public datePipe: DatePipe) { }

    ngOnInit(): void {
        this.OperativeFormSave = this.operativeForm();
        this.OperativeFormSave.markAllAsTouched();

        console.log(this.data)

        if ((this.data?.otReservationId) > 0) {
            this.registerObj1 = this.data
            console.log(this.registerObj1)
            this.vRegNo = this.registerObj1.regNo
            this.vOPDNo = this.registerObj1.opdNo
            this.vIPDNo = this.registerObj1.opdNo
            this.vPatientName = this.registerObj1.patientName
            this.opiptype = this.registerObj1.opIpType
            this.opIpId = this.registerObj1.opIpId

            if (this.data.otReservationId) {
                setTimeout(() => {
                    this._OtReservationService.getotReservationById(this.data.otReservationId).subscribe((response) => {
                        this.registerObj2 = response;
                        console.log("Get Data:", this.registerObj2)
                        this.vreservationId = this.registerObj2.otreservationId
                        this.opIpId = this.registerObj2.opipid
                    });
                }, 500);

                setTimeout(() => {
                    this._OtReservationService.getotOperativeById(this.data.otReservationId).subscribe((response) => {
                        this.registerObj3 = response;
                        console.log("Get Operative Data:", this.registerObj2)
                        this.OTOperativeNotesId = this.registerObj3.operativeNotesId
                        this.vTemplateDesc = this.registerObj3.operativeNotes
                    });
                }, 500);
            }
        }
    }

    operativeForm(): FormGroup {
        return this._formBuilder.group({
            operativeNotesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            otreservationId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            opipid: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            opiptype: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            operativeNotes: ['', [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],

            // extra field      
            TemplateId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        });
    }

    onChangetemp(e) {
        console.log(e)
        this.Tempdesc = e.templateDescription
        if (e.templateId > 0)
            this.isItemIdSelected = true
    }

    onAddTemplate(e) {
        this.vTemplateDesc = this.Tempdesc
    }

    OnSave() {
        this.OperativeFormSave.get('otreservationId').setValue(this.vreservationId)
        this.OperativeFormSave.get('opiptype').setValue(this.opiptype)
        this.OperativeFormSave.get('opipid').setValue(this.opIpId)
        this.OperativeFormSave.get('operativeNotesId').setValue(this.OTOperativeNotesId || 0)

        if (!this.OperativeFormSave.invalid) {
            this.OperativeFormSave.removeControl('TemplateId')
            console.log(this.OperativeFormSave.value)
            this._OtReservationService.operativeSave(this.OperativeFormSave.value).subscribe((response) => {
                this.OnPrint(response);
                this.onClear(true);
            });
        } {
            const invalidFields = [];
            if (this.OperativeFormSave.invalid) {
                for (const controlName in this.OperativeFormSave.controls) {
                    if (this.OperativeFormSave.controls[controlName].invalid) {
                        invalidFields.push(`Form: ${controlName}`);
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

    OnPrint(Param) {
        const param = {
            searchFields: [
                {
                    fieldName: "OperativeNotesId",
                    fieldValue: String(Param),
                    opType: "Equals"
                },
                {
                    fieldName: "OPIPType",
                    fieldValue: String(this.opiptype),
                    opType: "Equals"
                }
            ],
            mode: "OTOperativeNotesReport"
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

    onClose() {
        this.OperativeFormSave.reset();
        this._matDialog.closeAll();
    }

    onClear(val: boolean) {
        this.OperativeFormSave.reset();
        this.dialogRef.close(val);
    }
}

export class otOperNote {
    operativeNotesId: any;
    operativeNotes: any;

    /**
     * Constructor
     *
     * @param otOperNote
     */

    constructor(otOperNote) {
        {
            this.operativeNotesId = otOperNote.operativeNotesId || ''
            this.operativeNotes = otOperNote.operativeNotes || ''
            // this.isPrimary = OtReserInsert.isPrimary || ''
            // this.isPrimary = OtReserInsert.isPrimary || ''
        }
    }
}