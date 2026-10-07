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
            this.myForm.get('surgeryName').setValue(this.data.surgeryName)
            this.myForm.patchValue(this.data);
            console.log("Surgery ID : ", this.data.surgeryId)
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

    // selectedItems = [];
    // selectChangeServiceName(row) {
    //     const selectedData = Array.isArray(row) ? row : [row];
    //     this.selectedItems = selectedData.map(item => ({ serviceId: item.serviceId }));
    // }

    selectChangeServiceName(event: any): void {
        // console.log('Selected Surgery:', event);
    }

    onSubmit() {
           
        if (!this.myForm.invalid) {

            const formValues = {
                ...this.myForm.value,
                surgeryId: this.SurgeryId
            };

            console.log('Form values:', formValues);
            // Calculate Total Duration
            const expectedSurgeryTime = Number(formValues.expectedSurgeryTime) || 0;
            const preparationTime = Number(formValues.preparationTime) || 0;
            const cleaningTurnaroundTime = Number(formValues.cleaningTurnaroundTime) || 0;

            formValues.totalDuration = expectedSurgeryTime + preparationTime + cleaningTurnaroundTime;

            console.log('API Payload:', formValues);

            this._SurgeryMasterService.surgerySave(formValues).subscribe((response) => {
                this.onClear(true);
            });
        } {
            const invalidFields = [];
            if (this.myForm.invalid) {
                for (const controlName in this.myForm.controls) {
                    if (this.myForm.controls[controlName].invalid) {
                        invalidFields.push(`Surgery Form: ${controlName}`);
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
                { name: "required", Message: "surgery Name is required" }
            ],
            surgeryCategoryId: [
                { name: "required", Message: "surgeryCategory is required" }
            ],
            departmentId: [
                { name: "required", Message: "department is required" }
            ],
            surgeryAmount: [
                { name: "required", Message: "amount is required" }
            ],
            ottemplateId: [
                { name: "required", Message: "Table is required" }
            ],
            siteDescId: [
                { name: "required", Message: "Surgery Type is required" }
            ],
            departmentName: [
                {
                    name: "required", Message: "department Name is required"
                },
                { name: "maxlength", Message: "department Name should not be greater than 50 char." },
                { name: "pattern", Message: "Only char allowed." }
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
