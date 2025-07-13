import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { SubTpaCompanyMaster } from '../subtpa-company-master.component';
import { SubtpaCompanyMasterService } from '../subtpa-company-master.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';

@Component({
    selector: 'app-new-subtap',
    templateUrl: './new-subtap.component.html',
    styleUrls: ['./new-subtap.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewSubtapComponent implements OnInit {

    subTpaForm: FormGroup;
    isActive: boolean = true;
    typeId = 0;
    cityId = 0;
    cityName = '';
    autocompleteModetypeName: string = "CompanyType";
    autocompleteModecompanyName: string = "Company";
    autocompleteModecity: string = "City";
    autocompleteModestate: string = "State";
    autocompleteModecountry: string = "Country";
    regobj = new SubTpaCompanyMaster({})
    @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
    CityName = ""

    constructor(
        public _subTpaServiceMaster: SubtpaCompanyMasterService,
        public toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<NewSubtapComponent>,

    ) { }

    ngOnInit(): void {

        this.subTpaForm = this._subTpaServiceMaster.createsubtpacompanyForm();
        this.subTpaForm.markAllAsTouched();

        if ((this.data?.subCompanyId ?? 0) > 0) {
            console.log(this.data);
            this.isActive = this.data.isActive;
            this.regobj = this.data
            this.regobj.phoneNo=this.data.phoneNo.trim()
             this.regobj.faxNo=this.data.faxNo.trim()
             this.subTpaForm.get("cityId").setValue(this.regobj.cityId)
             this.subTpaForm.get("stateId").setValue(this.regobj.stateId)
             this.subTpaForm.get("countryId").setValue(this.regobj.countryId)
        }
    }


    onChangecity(e) {
        this.CityName = e.cityName;
        this._subTpaServiceMaster.getstateId(e.stateId).subscribe((Response) => {
            console.log(Response);
            setTimeout(() => {
                this.ddlCountry.SetSelection(Response.countryId); // Country dropdown
                this.subTpaForm.get('stateId')?.setValue(Response.stateId); // State form control
            });
        });
    }

    onChangestate(e) {
    }

    onSubmit() {
debugger
console.log(this.subTpaForm.value)
        if (!this.subTpaForm.invalid) {
            console.log("SubTpa Json:", this.subTpaForm.value);
            this._subTpaServiceMaster.subTpaCompanyMasterInsert(this.subTpaForm.value).subscribe((response) => {
                this.dialogRef.close()
            });
        }
        else {
            let invalidFields = [];
            if (this.subTpaForm.invalid) {
                for (const controlName in this.subTpaForm.controls) {
                    if (this.subTpaForm.controls[controlName].invalid) {
                        invalidFields.push(`SubTpa Form: ${controlName}`);
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


    onClear(val: boolean) {
        this.subTpaForm.reset();
        this.dialogRef.close(val);
    }
    keyPressCharater(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/^\d*\.?\d*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    selectChangetypeName(obj: any) {
        this.typeId = obj.value;
    }

    selectChangecity(obj: any) {

        this.cityId = obj.value
        this.cityName = obj.text
    }

    onClose() {
        this.subTpaForm.reset();
        this.dialogRef.close();
    }

    getValidationMessages() {
        return {
            companyName: [
                { name: "required", Message: "Company Name is required" },
                { name: "maxlength", Message: "Company Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
             companyShortName: [
                { name: "required", Message: "Company Name is required" },
                { name: "maxlength", Message: "Company Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            compTypeId: [
                { name: "required", Message: "Company Type Name is required" },
            ],
            city: [
                { name: "required", Message: "City Name is required" },
            ],
            address: [
                { name: "required", Message: "Address is required" },
                { name: "maxlength", Message: "Address must be between 1 and 100 characters." },
                { name: "pattern", Message: "Secial Char allowed." }
            ],
            pinNo: [
                { name: "required", Message: "PinCode is required" },
                { name: "maxlength", Message: "Pincode must be 6. digits" },
                { name: "pattern", Message: "Only Digits allowed." }
            ],
            phoneNo: [
                { name: "required", Message: "Phone Number is required" },
                { name: "pattern", Message: "Only Digits allowed." }
            ],
            faxNo: [
                { name: "required", Message: "faxNo Number is required" },
                { name: "pattern", Message: "Only Digits allowed." }
            ]
        }
    }


}
