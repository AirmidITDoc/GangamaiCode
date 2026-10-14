import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { SurgeryMasterService } from '../surgery-master.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-new-surgery-master',
    templateUrl: './new-surgery-master.component.html',
    styleUrls: ['./new-surgery-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewSurgeryMasterComponent implements OnInit {
    myForm: FormGroup;
    isActive: boolean = true;

    constructor(
        public _SurgeryMasterService: SurgeryMasterService,
        public dialogRef: MatDialogRef<NewSurgeryMasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
        public datePipe: DatePipe,
    ) { }

    @ViewChild('ddlLocation') ddlLocation: AirmidDropDownComponent;
    @ViewChild('ddlService') ddlService: AirmidDropDownComponent;

    autocompleteModeSurgeryCategory: string = "SurgeryCategory";
    autocompleteModeDepartment: string = "Department";
    autocompleteModeSiteDescription: string = "SiteDescription";
    autocompleteModeMOtSubSpecialty: string = "MOtSubSpecialtyMaster";
    autocompleteModeMTypesOfOTLevel: string = "TypesOfOTLevel";
    autocompleteModeService: string = "Service";

    isDatePckrDisabled: boolean = false;
    SurgeryId = 0;

    ngOnInit(): void {
        this.myForm = this._SurgeryMasterService.createSurgeryForm();
        this.myForm.markAllAsTouched();

        console.log("Data", this.data)
        if ((this.data?.surgeryId ?? 0) > 0) {
            // this.isActive = this.data.isActive
            this.SurgeryId = this.data.surgeryId
            this.myForm.get('gradeLevel').setValue(this.data.constantId)
            this.myForm.get('surgeryName').setValue(this.data.surgeryName)
            this.myForm.patchValue(this.data);
        }
    }
    onChangeOtTable(e) {
        this.ddlLocation.SetSelection(e.locationId);
    }

    onServiceChange(obj): void {
        const serviceId = obj?.value ?? obj;
        this.myForm.patchValue({
            serviceId: serviceId
        });
    }

    selectChangeServiceName(event: any): void {
        console.log("service event", event)
        // const serviceId = event?.value ?? event;
        const serviceId = event?.serviceId ?? event;
        this.myForm.patchValue({
            serviceId: serviceId
        });
    }

    selectChangeSubs(event: any): void {
        console.log("sub specialty event", event)
    }

    calculateTotalDuration(): void {

        const expectedSurgeryTime = Number(this.myForm.get('expectedSurgeryTime')?.value) || 0;
        const preparationTime = Number(this.myForm.get('preparationTime')?.value) || 0;
        const cleaningTurnaroundTime = Number(this.myForm.get('cleaningTurnaroundTime')?.value) || 0;

        const totalDuration = expectedSurgeryTime + preparationTime + cleaningTurnaroundTime;

        this.myForm.get('totalDuration')?.setValue(totalDuration, {
            emitEvent: false
        });
    }

    onSubmit() {

        if (!this.myForm.invalid) {

            const formValues = {
                ...this.myForm.value,
                surgeryId: this.SurgeryId,
                expectedSurgeryTime: this.myForm.value.expectedSurgeryTime || 0,
                preparationTime: this.myForm.value.preparationTime || 0,
                cleaningTurnaroundTime: this.myForm.value.cleaningTurnaroundTime || 0,
            };

            this._SurgeryMasterService.surgerySave(formValues).subscribe((response) => {
                this.onClear(true);
            });
        } else {
            const invalidFields = [];

            for (const controlName in this.myForm.controls) {
                if (this.myForm.controls[controlName].invalid) {
                    invalidFields.push(`Surgery Form: ${controlName}`);
                }
            }

            invalidFields.forEach(field => {
                this.toastr.warning(
                    `Field "${field}" is invalid.`,
                    'Warning'
                );
            });
        }
    }

    convertTimeToMinutes(value: any): number | null {
        if (!value) {
            return null;
        }

        const date = new Date(value);

        return date.getHours() * 60 + date.getMinutes();
    }

    getValidationMessages() {
        return {
            SurgeryName: [
                // { name: "required", Message: "surgery Name is required" }
            ],
            ShortName: [
                // { name: "required", Message: "Short Name is required" }
            ],
            departmentId: [
                // { name: "required", Message: "Department is required" }
            ],

            SurgeryType: [
                // { name: "required", Message: "Surgery Type is required" }
            ],
            SurgeryCategory: [
                // { name: "required", Message: "surgery Category is required" }
            ],
            Subspecialty: [
                // { name: "required", Message: "Subspecialty is required" }
            ]
        };
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

    onClear(val: boolean) {
        this.myForm.reset();
        this.dialogRef.close(val);
    }
}
