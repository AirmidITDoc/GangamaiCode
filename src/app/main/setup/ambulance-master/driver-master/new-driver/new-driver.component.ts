import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { DrivermasterService } from '../drivermaster.service';

@Component({
    selector: 'app-new-driver',
    templateUrl: './new-driver.component.html',
    styleUrls: ['./new-driver.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewDriverComponent {


    Driverdataform: FormGroup
    constructor(
        public _DrivermasterService: DrivermasterService,
        public toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<NewDriverComponent>,

    ) { }

    ngOnInit(): void {

        this.Driverdataform = this._DrivermasterService.createDriverForm();
        this.Driverdataform.markAllAsTouched();

        if ((this.data?.driverId ?? 0) > 0) {
            console.log(this.data);
            this.Driverdataform.get("driverId").setValue(this.data.driverId)
            this.Driverdataform.get("driverName").setValue(this.data.driverName)
            this.Driverdataform.get("address").setValue(this.data.address)
            this.Driverdataform.get("dateOfBirth").setValue(this.data.dateOfBirth)
            this.Driverdataform.get("mobileNo").setValue(this.data.mobileNo)
            this.Driverdataform.get("experience").setValue(this.data.experience)
            this.Driverdataform.get("licenceNo").setValue(this.data.licenceNo)
        }
    }



    onSubmit() {

        console.log(this.Driverdataform.value)
        debugger

        this.Driverdataform.get('cityId').setValue(this.CityId)
        if (!this.Driverdataform.invalid) {
            this._DrivermasterService.DriverInsert(this.Driverdataform.value).subscribe((response) => {
                this.dialogRef.close()
            });
        }
        else {
            const invalidFields = [];
            if (this.Driverdataform.invalid) {
                for (const controlName in this.Driverdataform.controls) {
                    if (this.Driverdataform.controls[controlName].invalid) {
                        invalidFields.push(`Driver Form: ${controlName}`);
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
    CityId = 0
    CityName = ''
    onChangecity(e) {
        console.log(e)
        this.CityId = e.cityId
        this.CityName = e.cityName

    }



    onClear(val: boolean) {
        this.Driverdataform.reset();
        this.dialogRef.close(val);
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



    onClose() {
        this.Driverdataform.reset();
        this.dialogRef.close();
    }


    getValidationMessages() {
        return {
            driverName: [
                { name: "required", Message: " Name is required" },
                { name: "maxlength", Message: " Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            address: [
                { name: "required", Message: "Address is required" },
                { name: "maxlength", Message: "Address should not be greater than 20 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            cityId: [
                { name: "required", Message: "city is required" },
            ],
            mobileNo: [{ name: "pattern", Message: "Only numbers allowed" },
            { name: "required", Message: "Mobile No is required" },
            { name: "minLength", Message: "10 digit required." },
            { name: "maxLength", Message: "More than 10 digits not allowed." }
            ],
            experience: [],
            licenceNo: []
        }
    }


}

