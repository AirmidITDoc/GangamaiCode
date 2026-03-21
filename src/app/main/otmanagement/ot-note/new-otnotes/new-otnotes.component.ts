import { DatePipe } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { otNote } from '../ot-note.component';
import { OtNoteService } from '../ot-note.service';

@Component({
    selector: 'app-new-otnotes',
    templateUrl: './new-otnotes.component.html',
    styleUrls: ['./new-otnotes.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewOtnotesComponent {

    OTNoteform: FormGroup;
    opIpType: number;
    opIpId: any;
    vOPDNo: any;
    vIPDNo: any;
    vSelectedOption: any = "OP";
    vRegNo: any;
    vPatientName: any;
    VsurgeryName: any;
    // vDescription:any;
    vDescription = "Incision:<br><br>OperativeDiagnosis:<br><br>OperativeFindings:<br><br>OperativeProcedure:<br><br>ExtraProPerformed:<br><br>ClosureTechnique:<br><br>PostOpertiveInstru:<br><br>DetSpecimenForLab:"
    registerObj = new otNote({});

    autocompleteModestatus: string = "State";
    autocompleteModeSurgery: string = "SurgeryMaster";
    autocompleteModeConDoctor: string = "ConDoctor";
    autocompleteModeRefDoctor: string = "RefDoctor";
    autocompleteModeOTTable: string = "OttableMaster";

    constructor(
        public _otNoteService: OtNoteService,
        private accountService: AuthenticationService,
        public _matDialog: MatDialog,
        private toastr: ToastrService,
        public datePipe: DatePipe,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit(): void {
        this.OTNoteform = this._otNoteService.createOtNoteForm();
        this.OTNoteform.markAllAsTouched();

        this.OTNoteform.get('description').setValue("Incision:<br><br>OperativeDiagnosis:<br><br>OperativeFindings:<br><br>OperativeProcedure:<br><br>ExtraProPerformed:<br><br>ClosureTechnique:<br><br>PostOpertiveInstru:<br><br>DetSpecimenForLab:")

        if ((this.data?.otreservationId) > 0) {
            this.registerObj = this.data
            this.OTNoteform.get('surgeryId').setValue(this.registerObj?.surgeryId)
            this.OTNoteform.get('surgeonId').setValue(this.registerObj?.surgeonId)
            this.OTNoteform.get('surgeonId1').setValue(this.registerObj?.surgeonId1)
            this.OTNoteform.get('anesthetishId').setValue(this.registerObj?.anestheticsDrID)
            this.OTNoteform.get('anesthetishId1').setValue(this.registerObj?.anestheticsDrID1)
            // this.OTNoteform.get('anesthetishId2').setValue(this.registerObj?.surgeonId1)
            console.log(this.registerObj)
        }
        if (this.registerObj.opIpType == true) {
            this.vSelectedOption = "IP"
            this.vIPDNo = this.registerObj.ipdNo
        } else {
            this.vSelectedOption = "OP"
            this.vOPDNo = this.registerObj.opdNo
        }
    }

    patientInfoReset() {
        this.vRegNo = '';
        this.vPatientName = '';
        this.registerObj = new otNote({});
    }

    onEditorValueChange(content: string) {
        this.OTNoteform.get('description')?.setValue(content);
    }

    selectChangeSurgery(obj: any) {
        this.VsurgeryName = obj.text
    }

    onSubmit() {
        // let row, IncisionNew, OPeDignosis, OperFinding, OperProcuder, Extperformed, Closertech, PostOperat, DetSpecLab
        // let discription = this.OTNoteform.get('description').value
        // let ID = discription.split('<br><br>')
        // ID.forEach(element => {
        //   row = element.split(':')
        //   if (row[0] == 'Incision') {
        //     IncisionNew = row[1]
        //   }
        //   if (row[0] == 'OperativeDiagnosis') {
        //     OPeDignosis = row[1]
        //   }
        //   if (row[0] == 'OperativeFindings') {
        //     OperFinding = row[1]
        //   }
        //   if (row[0] == 'OperativeProcedure') {
        //     OperProcuder = row[1]
        //   }
        //   if (row[0] == 'ExtraProPerformed') {
        //     Extperformed = row[1]
        //   }
        //   if (row[0] == 'ClosureTechnique') {
        //     Closertech = row[1]
        //   }
        //   if (row[0] == 'PostOpertiveInstru') {
        //     PostOperat = row[1]
        //   }
        //   if (row[0] == 'DetSpecimenForLab') {
        //     DetSpecLab = row[1]
        //   }
        // })
        const description = this.OTNoteform.get('description')?.value || '';
        const ID = description.split('<br><br>');

        let row: string[];

        let IncisionNew = '', OPeDignosis = '', OperFinding = '', OperProcuder = '',
            Extperformed = '', Closertech = '', PostOperat = '', DetSpecLab = '';

        ID.forEach(element => {
            // Remove HTML tags and trim
            element = element.replace(/<\/?[^>]+(>|$)/g, '').trim();

            row = element.split(':');
            if (row.length < 2) return;

            const key = row[0].trim();
            const value = row[1].trim();

            if (key === 'Incision') {
                IncisionNew = value;
            }
            if (key === 'OperativeDiagnosis') {
                OPeDignosis = value;
            }
            if (key === 'OperativeFindings') {
                OperFinding = value;
            }
            if (key === 'OperativeProcedure') {
                OperProcuder = value;
            }
            if (key === 'ExtraProPerformed') {
                Extperformed = value;
            }
            if (key === 'ClosureTechnique') {
                Closertech = value;
            }
            if (key === 'PostOpertiveInstru') {
                PostOperat = value;
            }
            if (key === 'DetSpecimenForLab') {
                DetSpecLab = value;
            }
        });

        this.OTNoteform.patchValue({
            incision: IncisionNew,
            operativeDiagnosis: OPeDignosis,
            operativeFindings: OperFinding,
            operativeProcedure: OperProcuder,
            extraProPerformed: Extperformed,
            closureTechnique: Closertech,
            postOpertiveInstru: PostOperat,
            detSpecimenForLab: DetSpecLab
        });

        this.OTNoteform.get('otdate')?.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
        this.OTNoteform.get('surgeryName')?.setValue(this.VsurgeryName ?? this.registerObj.surgeryName);
        // this.OTNoteform.get('incision')?.setValue(IncisionNew);
        // this.OTNoteform.get('operativeDiagnosis')?.setValue(OPeDignosis);
        // this.OTNoteform.get('operativeFindings')?.setValue(OperFinding);
        // this.OTNoteform.get('operativeProcedure')?.setValue(OperProcuder);
        // this.OTNoteform.get('extraProPerformed')?.setValue(Extperformed);
        // this.OTNoteform.get('closureTechnique')?.setValue(Closertech);
        // this.OTNoteform.get('postOpertiveInstru')?.setValue(PostOperat);
        // this.OTNoteform.get('detSpecimenForLab')?.setValue(DetSpecLab);
        this.OTNoteform.get('fromTime')?.setValue(this.registerObj.opstartTime);
        this.OTNoteform.get('toTime')?.setValue(this.registerObj.opendTime);
        this.OTNoteform.get('otreservationId')?.setValue(this.registerObj.otreservationId);

        // console.log(this.OTNoteform.value)
        if (!this.OTNoteform.invalid) {

            this.OTNoteform.removeControl('description')
            console.log(this.OTNoteform.value)
            this._otNoteService.otNoteSave(this.OTNoteform.value).subscribe((response) => {
                this.OnPrint(response)
                this.onClose();
            });
        } {
            const invalidFields = [];
            if (this.OTNoteform.invalid) {
                for (const controlName in this.OTNoteform.controls) {
                    if (this.OTNoteform.controls[controlName].invalid) {
                        invalidFields.push(`OT Note Form: ${controlName}`);
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

    onClose() {
        this.OTNoteform.reset();
        this._matDialog.closeAll();
        this.OTNoteform.get('description').setValue("Incision:<br><br>OperativeDiagnosis:<br><br>OperativeFindings:<br><br>OperativeProcedure:<br><br>ExtraProPerformed:<br><br>ClosureTechnique:<br><br>PostOpertiveInstru:<br><br>DetSpecimenForLab:")
        this.patientInfoReset();
    }

    OnPrint(e) {

    }

    getValidationMessages() {
        return {
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
}
