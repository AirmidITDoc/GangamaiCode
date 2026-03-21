import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { ConfigService } from "app/core/services/config.service";
import { AirmidDropDownComponent } from "app/main/shared/componets/airmid-dropdown/airmid-dropdown.component";
import { ToastrService } from "ngx-toastr";
import { CompanyMaster } from "../company-master.component";
import { CompanyMasterService } from "../company-master.service";

@Component({
    selector: "app-company-master-list",
    templateUrl: "./company-master-list.component.html",
    styleUrls: ["./company-master-list.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CompanyMasterListComponent implements OnInit {

    companyForm: FormGroup;
    companyFormDemo: FormGroup;
    isActive: boolean = true;
    autocompleteModetypeName: string = "CompanyType";
    autocompleteModetariff: string = "Tariff";
    autocompleteModeofpayment: string = "PaymentMode";
    autocompleteModecity: string = "City";
    autocompleteModestate: string = "State";
    autocompleteModecountry: string = "Country";
    registerObj = new CompanyMaster({});
    @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
    CityName = ""
    Is5_Digit_Pincode_Id: boolean = false;

    constructor(
        public _CompanyMasterService: CompanyMasterService,
        public dialogRef: MatDialogRef<CompanyMasterListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
        public _configue: ConfigService,
    ) { }

    ngOnInit(): void {

        // this.companyForm = this._CompanyMasterService.createCompanymasterForm();
        // this.companyForm.markAllAsTouched();

        this.companyFormDemo = this._CompanyMasterService.createCompanymasterFormDemo();
        this.companyFormDemo.markAllAsTouched();

        if ((this.data?.companyId ?? 0) > 0) {

            this.isActive = this.data.isActive
            if (this.data.city)
                // this.data.city=this.data.city.trim();

                // this.companyForm.get("cityId").setValue(this.data.cityId)
                // this.companyForm.get("mobileNo").setValue(this.data.mobileNo)
                debugger
            setTimeout(() => {
                this._CompanyMasterService.getCompanyById(this.data.companyId).subscribe((response) => {
                    this.registerObj = response;
                    console.log(this.registerObj)

                    // if (response) {
                    //     this.companyForm.get("traiffId").setValue(this.registerObj.traiffId)
                    //     this.companyForm.get("companyId").setValue(this.registerObj.companyId)
                    // }
                });
            }, 500);
        }
        const rawValue = this?._configue?.configParams?.Is9_Digit_NationalId || "";
        const [id, val] = rawValue.includes(":") ? rawValue.split(":") : [null, null];
        this.Is5_Digit_Pincode_Id = id === "1";
    }

    onChangecity(e) {
        this.CityName = e.cityName;
        this._CompanyMasterService.getstateId(e.stateId).subscribe((Response) => {
            console.log(Response);
            setTimeout(() => {
                this.ddlCountry.SetSelection(Response.countryId); // Country dropdown
                this.companyFormDemo.get('stateId')?.setValue(Response.stateId); // State form control
            });
        });
    }

    onChangestate(e) {
    }

    onSubmit() {

        if (!this.companyFormDemo.invalid) {
            console.log(this.companyFormDemo.value)
            if ((this.data?.companyId ?? 0) > 0)
                this.companyFormDemo.get("companyId").setValue(this.registerObj.companyId)

            this._CompanyMasterService.companyMasterSave(this.companyFormDemo.value).subscribe((response) => {
                this.dialogRef.close()
            });
        } else {
            const invalidFields = [];
            if (this.companyFormDemo.invalid) {
                for (const controlName in this.companyFormDemo.controls) {
                    if (this.companyFormDemo.controls[controlName].invalid) {
                        invalidFields.push(`company Form: ${controlName}`);
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
        this.companyForm.reset();
        this.dialogRef.close(val);
    }

    onClose() {
        this.companyForm.reset();
        this.dialogRef.close();
    }


    getValidationMessages() {
        const maxLen = this.Is5_Digit_Pincode_Id ? 5 : 6;
        return {
            companyName: [
                { name: "required", Message: "Company Name is required" },
                { name: "maxlength", Message: "Company name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            shortName: [
                { name: "required", Message: "Company Name is required" },
                { name: "maxlength", Message: "Company name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            traiffId: [
                { name: "required", Message: "Tariff Name is required" }
            ],
            city: [
                { name: "required", Message: "City Name is required" }
            ],
            mobileNo: [
                { name: "required", Message: "Mobile Number is required" },
                { name: "maxlength", Message: "Number be not be greater than 10 digits" },
                { name: "pattern", Message: "Only Digits allowed." }
            ],
            phoneNo: [
                { name: "required", Message: "Phone Number is required" },
                { name: "maxlength", Message: "Number be not be greater than 10 digits" },
                { name: "pattern", Message: "Only Digits allowed." }
            ],
            // pinNo: [
            //     { name: "required", Message: "Pin Code is required" },
            //     { name: "maxlength", Message: "Pincode must be greater than 2 digits" },
            //     { name: "pattern", Message: "Only Digits allowed." }
            // ],
            pinNo: [,
                { name: "required", Message: "Pin / Country ID is required" },
                { name: "minLength", Message: `${maxLen} digits required.` },
                { name: "maxLength", Message: `More than ${maxLen} digits not allowed.` }
            ],
            address: [
                { name: "required", Message: "Address is required" },
                { name: "maxlength", Message: "Address must be between 1 and 100 characters." },
                { name: "pattern", Message: "Secial Char allowed." }
            ],
            compTypeId: [
                { name: "required", Message: "Company Type Name is required" }
            ],
            stateId: [],
            contactNumber: []
        };
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
}
