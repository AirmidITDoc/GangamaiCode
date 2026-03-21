import { DatePipe } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { LanguageOption, SpeechRecognitionService } from 'app/main/shared/services/speech-recognition.service';
import { ToastrService } from 'ngx-toastr';
import { EmergencyList } from '../emergency.component';
import { EmergencyService } from '../emergency.service';

@Component({
    selector: 'app-emergency-history',
    templateUrl: './emergency-history.component.html',
    styleUrls: ['./emergency-history.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class EmergencyHistoryComponent {
    screenFromString = 'Common-form';
    dateTimeObj: any;
    registerObj = new EmergencyList({});
    registerObj1 = new EmergencyList({});
    historyForm: FormGroup
    addCheiflist: any[] = [];
    addDiagnolist: any = [];
    addExaminlist: any = [];
    languages: LanguageOption[] = [];
    selectedLang = 'en-US';
    emergencyId: any;
    retriveList: any = [];
    vTemp: any;
    vSpO2: any;
    vPulse: any;
    vBMI: any;
    vBP: any;
    vBSL: any;


    onBlur(e: any) {
        // this.vTemplateDesc = e.target.innerHTML;
        throw new Error('Method not implemented.');
    }

    constructor(
        public _EmergencyService: EmergencyService,
        private _loggedService: AuthenticationService,
        public datePipe: DatePipe,
        public _matDialog: MatDialog,
        public dialogRef: MatDialogRef<EmergencyHistoryComponent>,
        public toastr: ToastrService,
        private commonService: PrintserviceService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        public _frombuilder: UntypedFormBuilder,
        public speechService: SpeechRecognitionService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
        this.languages = this.speechService.supportedLanguages;

        this.historyForm = this.CreateMyForm()
        this.historyForm.markAllAsTouched()
        if (this.data) {
            this.registerObj = this.data
            this.emergencyId = this.registerObj.emgId
        }
        this.gethistory(this.registerObj);
        // this._EmergencyService.getEmergencyById(this.data.emgId).subscribe((res) => {
        //   this.registerObj = res;
        //   console.log(this.registerObj)
        // });
    }

    CreateMyForm() {
        return this._frombuilder.group({
            emgHistoryId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            emgId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
            height: ["", [Validators.required, Validators.maxLength(20),
            this._FormvalidationserviceService.allowEmptyStringValidator()]],
            pweight: ["", [Validators.required, Validators.maxLength(20),
            this._FormvalidationserviceService.allowEmptyStringValidator()]],
            bmi: ["", [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
            bsl: ["", [Validators.maxLength(20)]],
            spO2: ["", [Validators.maxLength(20)]],
            pulse: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
            bp: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
            temp: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
            chiefComplaint: ["", this._FormvalidationserviceService.allowEmptyStringValidatorOnly],
            diagnosis: [""],
            examination: [""],
            // mAssignChiefComplaint: [[], [this._FormvalidationserviceService.allowEmptyStringValidator]],
            // mAssignDiagnosis: [[], [this._FormvalidationserviceService.allowEmptyStringValidator]],
            // mAssignExamination: [[], [this._FormvalidationserviceService.allowEmptyStringValidator]],
            advice: [""]
        })
    }

    // showing color for vitals
    getVitalColorClass(vital: string, value: any): string {
        const num = parseFloat(value);
        switch (vital) {
            case 'BMI':
                if (num < 18.5) return 'orange'; // Yellow
                if (num <= 24.9) return 'green'; // Green
                return 'red'; // Red

            case 'SpO2':
                return num < 95 ? 'orange' : 'green';

            case 'Pulse':
                if (num < 60) return 'orange';
                if (num <= 100) return 'green';
                return 'red';

            case 'BP':
                if (!value || typeof value !== 'string' || !value.includes('/')) return '';
                const [sys, dia] = value.split('/').map(Number);
                if (sys < 90 || dia < 60) return 'orange';
                if (sys > 120 || dia > 80) return 'red';
                return 'green';

            case 'Temp':
                if (num < 97) return 'orange';
                if (num <= 99) return 'green';
                return 'red';

            default:
                return '';
        }
    }

    gethistory(obj) {
        const m_data2 = {
            "first": 0,
            "rows": 10,
            "sortField": "EmgId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "EmgId",
                    "fieldValue": String(obj.emgId),
                    "opType": "Equals"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }
        this._EmergencyService.retriveHistoryList(m_data2).subscribe(Visit => {
            const data = Visit?.data as EmergencyList[];

            if (data && data.length > 0) {
                this.registerObj1 = data[0];
                this.vDescription = this.registerObj1.chiefComplaint
                this.historyForm.patchValue({
                    height: this.registerObj1.height,
                    pweight: this.registerObj1.pweight,
                    bmi: this.registerObj1.bmi,
                    bsl: this.registerObj1.bsl,
                    spO2: this.registerObj1.spO2,
                    pulse: this.registerObj1.pulse,
                    bp: this.registerObj1.bp,
                    temp: this.registerObj1.temp,
                    // chiefComplaint: this.registerObj1.chiefComplaint,
                    diagnosis: this.registerObj1.diagnosis,
                    examination: this.registerObj1.examination
                });
            }
            console.log("History 0th record:", this.registerObj1);
        });
    }

    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    getBMIcalculation() {
        const height = this.historyForm.get('height')?.value;
        const weight = this.historyForm.get('pweight')?.value;

        if (height > 0 && weight > 0) {
            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);
            this.historyForm.get('bmi')?.setValue(Math.round(bmi));

        } else {
            this.historyForm.get('bmi')?.setValue(0);
            // this.toastr.warning('Please enter valid height (above 30 cm) and weight.');
        }
    }

    selectChangeChiefComplaint(selectedChips: string[]) {
        this.addCheiflist = selectedChips;
        this.historyForm.get('chiefComplaint')?.setValue(this.addCheiflist);
    }

    selectChangeDiagnosis(selectedChips: string[]) {
        this.addDiagnolist = selectedChips;
        this.historyForm.get('mAssignDiagnosis')?.setValue(this.addDiagnolist);
    }

    selectChangeExamination(selectedChips: string[]) {
        this.addExaminlist = selectedChips;
        this.historyForm.get('mAssignExamination')?.setValue(this.addExaminlist);
    }
    vDescription: any;
    onEditorValueChange(content: string) {
        console.log("Got from editor:", content);
        this.historyForm.get('chiefComplaint')?.setValue(content);
    }
    onSave() {
        if (!this.historyForm.invalid) {
            this.historyForm.get('emgHistoryId').setValue(this.registerObj1.emgHistoryId || 0)
            this.historyForm.get('emgId').setValue(this.emergencyId)
            // this.historyForm.get('advice').setValue(this.historyForm.get('advice').value || this.registerObj1.advice)
            this.historyForm.get('bmi').setValue(String(this.historyForm.get('bmi').value))
            this.historyForm.get('bp').setValue(String(this.historyForm.get('bp').value) ?? '')
            this.historyForm.get('bsl').setValue(String(this.historyForm.get('bsl').value) ?? '')
            this.historyForm.get('spO2').setValue(String(this.historyForm.get('spO2').value) ?? '')
            this.historyForm.get('pulse').setValue(String(this.historyForm.get('pulse').value) ?? '')
            this.historyForm.get('temp').setValue(String(this.historyForm.get('temp').value) ?? '')
            console.log(this.historyForm.value)
            this._EmergencyService.EmgHistorySave(this.historyForm.value).subscribe((res) => {
                this.OnViewReportPdf(res)
                this.onClose()
            })

        } else {
            const invalidFields: string[] = [];
            if (this.historyForm.invalid) {
                for (const controlName in this.historyForm.controls) {
                    if (this.historyForm.controls[controlName].invalid) {
                        invalidFields.push(`My Form: ${controlName}`);
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

    OnViewReportPdf(EmgId: any) {
        this.commonService.Onprint("EmgId", EmgId, "EmergencyPrescription");
    }

    onClose() {
        this.historyForm.reset();
        this.dialogRef.close();
    }

    /////////////////////////////// advice part ///////////////////////////////
    onLangChange() {
        if (this.speechService.isListening) {
            this.speechService.stopRecognition();
        }
    }
    onMicToggle() {
        this.speechService.toggleRecognition(this.selectedLang, (text: string) => {
            const currentText = this.historyForm.get('advice')?.value || '';
            const updated = currentText ? `${currentText} ${text}` : text;
            this.historyForm.get('advice')?.setValue(updated);
        });
    }

    keyPressAlphanumeric(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    keyPressCharater(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/^\d*\.?\d*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    keyPressOk(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/^[0-9!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
}
