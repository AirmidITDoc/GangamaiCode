import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { VisitMaster1 } from '../../appointment-list.component';
import { AppointmentlistService } from '../../appointmentlist.service';

@Component({
    selector: 'app-patientvital-information',
    templateUrl: './patientvital-information.component.html',
    styleUrls: ['./patientvital-information.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PatientvitalInformationComponent {

    RegId: any;
    vClassId: any = 0;
    CompanyId: any = 0;
    RegNo: any;
    PatientName: any;
    Doctorname: any;
    vOPDNo: any;
    AgeYear: any = 0;
    AgeMonth: any;
    AgeDay: any;
    GenderName: any;
    DepartmentName: any;
    PatientType: any;
    Tarrifname: any;
    CompanyName: any;
    RefDocName: any;
    advanceObj: any;
    MyFormGroup: FormGroup
    WellnessFormGroup: FormGroup

    vHeight = 0;
    vWeight = 0;
    vBSL = "0";
    vBMI = "0";
    vBP = "0";
    VisitId: any;
    vTemp = "0";
    vSpO2 = "0";
    vPulse = "0";

    vDoctorName: any;
    vRefDocName: any;
    vRegId: any;

    // registerObj1 = new VisitMaster1({});
    patientDetail1 = new VisitMaster1({});

    registerObj1: any = {};

    autocompleteModeActivityLevel: string = "ActivityLevel";
    autocompleteModeSmokingStatus: string = "SmokingStatus";

    constructor(
        public _OpAppointmentService: AppointmentlistService,
        private _formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<PatientvitalInformationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private accountService: AuthenticationService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {

        this.MyFormGroup = this.createMyForm();
        this.MyFormGroup.markAllAsTouched();

        this.WellnessFormGroup = this.createWellness();
        this.WellnessFormGroup.markAllAsTouched();

        // Set VisitId in Wellness form
        this.WellnessFormGroup.patchValue({
            opipid: this.VisitId
        });

        if (this.data) {
            console.log("Patient Details", this.data)
            this.registerObj1 = this.data
            this.VisitId = this.data.visitId


            this.vDoctorName = this.data.doctorname;
            this.vRefDocName = this.data.refDocName

            setTimeout(() => {
                this._OpAppointmentService.getVisitById(this.VisitId).subscribe(data => {
                    this.patientDetail1 = data;
                    console.log(data)
                    this.vHeight = data.height
                    this.vWeight = data.pweight
                    this.vBSL = data.bsl
                    this.vBMI = data.bmi
                    this.vBP = data.bp
                    this.vTemp = data.temp
                    this.vSpO2 = data.spO2
                    this.vPulse = data.pulse
                });

                this._OpAppointmentService.getWellnessDetailsById(this.VisitId).subscribe(data => {
                    if (data) {

                        this.WellnessFormGroup.patchValue({

                            wlsId: data.wlsId ?? 0,
                            opipid: data.opipid ?? this.VisitId,
                            opiptype: data.opiptype ?? 0,

                            stepCount: data.stepCount ?? 0,
                            caloriesBurned: data.caloriesBurned ?? 0,
                            sleepDuration: data.sleepDuration ?? 0,
                            activityLevel: data.activityLevel ?? 0,

                            bloodGlucose: data.bloodGlucose ?? 0,
                            fluidIntake: data.fluidIntake ?? 0,
                            mentalStatus: data.mentalStatus ?? '',
                            generalWellbeing: data.generalWellbeing ?? '',

                            lastMenstrualPeriod: data.lastMenstrualPeriod ?? null,
                            numberOfMenstrualPeriodsPerYear: data.numberOfMenstrualPeriodsPerYear ?? 0,
                            ageOfMenarche: data.ageOfMenarche ?? '',
                            ageOfMenopause: data.ageOfMenopause ?? '',

                            tobaccoSmokingStatus: data.tobaccoSmokingStatus ?? 0,
                            tobaccoChewingStatus: data.tobaccoChewingStatus ?? 0,
                            alcoholDrinkingStatus: data.alcoholDrinkingStatus ?? 0,
                            dietType: data.dietType ?? ''
                        });
                    }
                });
            }, 1000);
        }
    }

    pageTitle: string = 'Patient Vital Information';
    onTabChange(event: any): void {
        this.pageTitle = event.tab.textLabel === 'Vitals Information' ? 'Patient Vital Information': 'Patient Wellness Information';
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

    createMyForm() {
        return this._formBuilder.group({
            visitId: this.data.visitId,
            height: ['', [Validators.required, Validators.maxLength(20),
            this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.pattern("^[0-9]{1,3}$")]],
            pweight: ['', [Validators.required, Validators.maxLength(20),
            Validators.pattern("^[0-9]{1,3}$"), this._FormvalidationserviceService.allowEmptyStringValidator()]],
            bmi: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
            bsl: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
            spO2: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
            temp: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
            pulse: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
            bp: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
        });
    }

    createWellness(): FormGroup {
        return this._formBuilder.group({
            wlsId: 0,
            opipid: [this.VisitId ?? 0],
            opiptype: [0],

            stepCount: [0],
            caloriesBurned: [0],
            sleepDuration: [0],
            activityLevel: [0],

            bloodGlucose: [0],
            fluidIntake: [0],
            mentalStatus: [''],
            generalWellbeing: [''],

            lastMenstrualPeriod: [],
            numberOfMenstrualPeriodsPerYear: [0],
            ageOfMenarche: [''],
            ageOfMenopause: [''],

            tobaccoSmokingStatus: [0],
            tobaccoChewingStatus: [0],
            alcoholDrinkingStatus: [0],
            dietType: ['']
        });
    }

    getBMIcalculation() {
        // debugger
        if (this.vHeight > 0 && this.vWeight > 0) {
            const Height = (this.vHeight / 100)
            this.vBMI = String(Math.round((this.vWeight) / ((Height) * (Height))));
        }
        else if (this.vHeight <= 0) {
            this.vBMI = '0';

        }
        else if (this.vWeight <= 0) {
            this.vBMI = '0';

        }
    }

    onSave() {

        debugger
        if (!this.MyFormGroup.invalid) {
            const visitId = this.data.visitId
            // this.MyFormGroup.get('bmi').setValue(String(this.MyFormGroup.get('bmi')?.value)),
            this.MyFormGroup.get("bsl").setValue(this.vBSL || "")
            this.MyFormGroup.get("spO2").setValue(this.vSpO2 || "")
            this.MyFormGroup.get("pulse").setValue(this.vPulse || "")
            this.MyFormGroup.get("bp").setValue(this.vBP || "")
            this.MyFormGroup.get("temp").setValue(this.vTemp || "")
            console.log(this.MyFormGroup.value)
            this._OpAppointmentService.InsertVitalInfo(visitId, this.MyFormGroup.value).subscribe((response) => {
                this._matDialog.closeAll();
            });
        } else {
            const invalidFields: string[] = [];
            if (this.MyFormGroup.invalid) {
                for (const controlName in this.MyFormGroup.controls) {
                    if (this.MyFormGroup.controls[controlName].invalid) {
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

    onWellnessSave() {

        this.VisitId = this.data.visitId;

        // Set Visit ID
        this.WellnessFormGroup.patchValue({ opipid: this.VisitId });

        // Get form value
        const formValue = this.WellnessFormGroup.value;

        // Format Last Menstrual Period (added these code bcoz date taking one day earlier )
        const lastMenstrualPeriod = formValue.lastMenstrualPeriod;

        let formattedLastMenstrualPeriod = null;

        if (lastMenstrualPeriod instanceof Date) {

            const year = lastMenstrualPeriod.getFullYear();
            const month = String(lastMenstrualPeriod.getMonth() + 1).padStart(2, '0');

            const day = String(lastMenstrualPeriod.getDate()).padStart(2, '0');

            formattedLastMenstrualPeriod = `${year}-${month}-${day}`;
        }

        // Create API payload
        const formData = {
            ...formValue,
            lastMenstrualPeriod: formattedLastMenstrualPeriod
        };

        if (!this.WellnessFormGroup.invalid) {
            this._OpAppointmentService.InsertWellnessInfo(formData).subscribe(response => {
                this._matDialog.closeAll();
            });
        } else {

            const invalidFields: string[] = [];
            for (const controlName in this.WellnessFormGroup.controls) {
                if (this.WellnessFormGroup.controls[controlName].invalid) {
                    invalidFields.push(`Wellness Form: ${controlName}`);
                }
            }

            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
                });
            }
        }
    }


    onClose() {

        this.MyFormGroup.reset();
        this.WellnessFormGroup.reset();
        this._matDialog.closeAll();
    }

    onEnter(event: KeyboardEvent, nextInputId: string) {
        if (event.key === "Enter") {
            event.preventDefault();  // prevent form submit
            document.getElementById(nextInputId)?.focus();
        }
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
    // it allowed only Digit & decimal
    keyPressDigitDecimalOnly(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/^\d*\.?\d*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
}
