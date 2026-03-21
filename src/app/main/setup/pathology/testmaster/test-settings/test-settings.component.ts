import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";
import { ToastrService } from "ngx-toastr";
import { TestmasterService } from "../testmaster.service";


@Component({
    selector: 'app-test-settings',
    templateUrl: './test-settings.component.html',
    styleUrls: ['./test-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TestSettingsComponent {

    testSettingForm: FormGroup;
    autocompleteModeCategoryId: string = "PathCategory";
    autocompleteModeSpecimen: string = "PathSpecimenMaster"
    autocompleteModeSpecimenCon: string = "PathSpecimenConditionMaster"
    autocompleteModeSpecimenColor: string = "SpecimentColors"
    autocompleteModeSpecimenContainer: string = "PathSpecimenContainerMaster"
    autocompleteModeSpecimenCollection: string = "PathSpecimenCollectionMaster"
    autocompleteModeSpecimenPreser: string = "PathSpecimenPreservativeMaster"
    vconsentDetail: any;
    registerObj: any;

    constructor(
        public _TestmasterService: TestmasterService,
        public dialogRef: MatDialogRef<TestSettingsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
        private _formBuilder: UntypedFormBuilder,
        private _loggedService: AuthenticationService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.testSettingForm = this.createSettingForm();
        this.testSettingForm.markAllAsTouched();

        if (this.data.testId) {
            setTimeout(() => {
                this._TestmasterService.gettestInfoById(this.data.testId).subscribe((response) => {
                    this.registerObj = response;
                    this.testSettingForm.patchValue(this.registerObj)
                    console.log("test info:", this.registerObj)
                });
            }, 500);
        }
        this.testSettingForm.get('isConsentRequired')?.valueChanges.subscribe((isConsentRequired: boolean) => {

            const consentNameCtrl = this.testSettingForm.get('consentName');
            const consentTemplateCtrl = this.testSettingForm.get('consentDetail');

            if (isConsentRequired) {
                consentNameCtrl?.setValidators([Validators.required]);
                consentTemplateCtrl?.setValidators([Validators.required]);
            } else {
                consentNameCtrl?.clearValidators();
                consentTemplateCtrl?.clearValidators();

                consentNameCtrl?.setValue('');
                consentTemplateCtrl?.setValue('');
            }

            consentNameCtrl?.updateValueAndValidity();
            consentTemplateCtrl?.updateValueAndValidity();
        });
    }

    createSettingForm() {
        return this._formBuilder.group({
            testId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            specimenTypeId: [0],
            specimenColor: [0],
            specimenQty: [0, [Validators.maxLength(50)]],
            specimenConditionId: [0],
            containerTypeId: [0],
            collectionMethod: [0],
            // specimenSource: [''],
            noofContainer: [0],
            preservationUsed: [0],
            // transportInstruction: [''],

            isConsentRequired: [false, [Validators.required]],
            // consentName: [''],
            consentDetail: [''],
            barcodeLabel: [''],

            disease: [0],
            diseasePrecautionNote: [''],
            isNotifiable: [false],
            isInfectious: [false],

            isFastingRequired: [false, [Validators.required]],
            // methodologyId: [0],
            // reported: [''],
            testInformationTemplate: ['', [Validators.required]],
            // unit:[],
            isApprovedRequired: [false],

            tatday: [0],
            tathour: [0],
            tatmin: [0],
        })
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

    onEditorValueChange1(content: string) {
        this.testSettingForm.get('consentDetail')?.setValue(content);
    }

    onEditorValueChange2(content: string) {
        this.testSettingForm.get('testInformationTemplate')?.setValue(content);
    }

    invalidFields1 = [];
    onSubmit() {
        // debugger
        this.testSettingForm.get('testId').setValue(this.data.testId)
        console.log("json of Test:", this.testSettingForm.value)
        if (!this.testSettingForm.invalid) {
            console.log("json of Test:", this.testSettingForm.value)
            this._TestmasterService.TestInfoUpdate(this.testSettingForm.value).subscribe((response) => {
                this.onClose(true);
            });

        } else {
            this.invalidFields1 = [];

            // checks nested error 
            if (this.testSettingForm.invalid) {
                for (const controlName in this.testSettingForm.controls) {
                    const control = this.testSettingForm.get(controlName);

                    if (control instanceof FormGroup || control instanceof FormArray) {
                        for (const nestedKey in control.controls) {
                            if (control.get(nestedKey)?.invalid) {
                                this.invalidFields1.push(`Table Data : ${controlName}.${nestedKey}`);
                            }
                        }
                    } else if (control?.invalid) {
                        this.invalidFields1.push(`Insert Form: ${controlName}`);
                    }
                }
            }

            if (this.invalidFields1.length > 0) {
                this.invalidFields1.forEach(field => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
                    );
                });
            }
        }

    }


    onClose(val: boolean) {
        this.dialogRef.close(val);
    }
}
