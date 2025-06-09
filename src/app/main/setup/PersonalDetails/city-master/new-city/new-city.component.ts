import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { CityMasterService } from '../city-master.service';

@Component({
    selector: 'app-new-city',
    templateUrl: './new-city.component.html',
    styleUrls: ['./new-city.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewCityComponent implements OnInit {

    cityForm: FormGroup;
    stateId = 0;
    cityId = 0;
    cityName = '';
    isActive: boolean = true;
    autocompleteModestatus: string = "State";

    constructor(
        public _CityMasterService: CityMasterService,
        public dialogRef: MatDialogRef<NewCityComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.cityForm = this._CityMasterService.createCityForm();
        this.cityForm.markAllAsTouched();
        if ((this.data?.cityId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.cityForm.patchValue(this.data);
        }
    }

    onSubmit() {
        if (!this.cityForm.invalid) {
            console.log(this.cityForm.value)
            this._CityMasterService.cityMasterSave(this.cityForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.cityForm.invalid) {
                for (const controlName in this.cityForm.controls) {
                    if (this.cityForm.controls[controlName].invalid) {
                        invalidFields.push(`City Form: ${controlName}`);
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

    getValidationMessages() {
        return {
            stateId: [
                { name: "required", Message: "State Name is required" }
            ],
            cityName: [
                { name: "required", Message: "City Name is required" },
                { name: "pattern", Message: "Only char allowed." }
            ],
        }
    }

    onClear(val: boolean) {
        this.cityForm.reset();
        this.dialogRef.close(val);
    }
}