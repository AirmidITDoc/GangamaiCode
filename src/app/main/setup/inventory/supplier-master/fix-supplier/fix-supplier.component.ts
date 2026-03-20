import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { ToastrService } from 'ngx-toastr';
import { SupplierMaster, SupplierMasterComponent } from '../supplier-master.component';
import { SupplierMasterService } from '../supplier-master.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-fix-supplier',
    templateUrl: './fix-supplier.component.html',
    styleUrls: ['./fix-supplier.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class FixSupplierComponent implements OnInit {
    supplierForm: FormGroup;

    submitted = false;
    @ViewChild('ddlStore') ddlStore: AirmidDropDownComponent;
    registerObj = new SupplierMaster({});
    msg: any;
    msmflag: boolean = false;
    CityId: any;
    vchkactive: any = true;
    isActive: boolean = true;
    // new API
    SupplierId: any = 0;
    vtaluka: any;

    autocompleteModecity: string = "City";
    autocompleteModestate: string = "State";
    autocompleteModecountry: string = "Country";
    autocompleteModeofpayment: string = "PaymentMode";
    autocompleteModetermofpayment: string = "TermofPayment";
    autocompleteModeoftaluka: string = "Taluka"
    autocompleteModeofBank: string = 'Bank'
    @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;

    constructor(
        public _supplierService: SupplierMasterService,
        public toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _loggedService: AuthenticationService,
        private datepipe: DatePipe,
        public dialogRef: MatDialogRef<SupplierMasterComponent>
    ) { }

    vAddress: any;

    ngOnInit(): void {
        this.supplierForm = this._supplierService.createSuppliermasterForm();
        this.supplierForm.markAllAsTouched();

        if ((this.data?.supplierId ?? 0) > 0) {

            this.isActive = this.data.isActive;
            this._supplierService.getsupplierId(this.data.supplierId).subscribe((response) => {
                this.registerObj = response;
                console.log(this.registerObj)
                this.SupplierId = this.registerObj.supplierId
                this.supplierForm.get('supplierName')?.setValue(this.registerObj.supplierName.trim());
                this.supplierForm.get('mobile')?.setValue(this.registerObj.mobile.trim());
                this.supplierForm.get('phone')?.setValue(this.registerObj.phone.trim());
                this.supplierForm.get('address')?.setValue(this.registerObj.address.trim());
                this.supplierForm.get('panNo')?.setValue(this.registerObj.panNo.trim());
                this.supplierForm.get('pinCode')?.setValue(this.registerObj.pinCode.trim());
                this.supplierForm.get('fax')?.setValue(this.registerObj.fax.trim());
                this.supplierForm.get('Freight')?.setValue(this.registerObj.freight);
                this.supplierForm.get('email')?.setValue(this.registerObj.email.trim());
                this.supplierForm.get('CreditPeriod')?.setValue(this.registerObj.creditPeriod.trim());
                this.supplierForm.get('gstNo')?.setValue(this.registerObj.gstNo.trim());
                this.supplierForm.get('ContactPerson')?.setValue(this.registerObj.contactPerson.trim());
                this.supplierForm.get('bankNo')?.setValue(this.registerObj.bankNo);
                // this.supplierForm.get('bankNo')?.setValue(this.registerObj.bankNo.trim());
                this.supplierForm.get('licNo')?.setValue(this.registerObj.licNo.trim());
                this.supplierForm.get('dlno')?.setValue(this.registerObj.dlNo);
                this.supplierForm.get('taxNature')?.setValue(this.registerObj.taxNature);
                this.supplierForm.get('branch')?.setValue(this.registerObj.branch);
                this.supplierForm.get('openingBalance')?.setValue(this.registerObj.openingBalance);
                this.ddlStore.SetSelection(this.registerObj.mAssignSupplierToStores);

            }, (error) => {
                this.toastr.error(error.message);
            });
        }
    }

    onChangeMsm(event) {

        if (event.checked == true)
            this.msmflag = true;
        else
            this.msmflag = false;
    }

    removestore(item) {
        const removedIndex = this.supplierForm.value.mAssignSupplierToStores.findIndex(x => x.storeId == item.storeId);
        this.supplierForm.value.mAssignSupplierToStores.splice(removedIndex, 1);
        this.ddlStore.SetSelection(this.supplierForm.value.mAssignSupplierToStores.map(x => x.storeId));
    }

    onChangecity(e) {

        this.registerObj.stateId = e.stateId
        this._supplierService.getstateId(e.stateId).subscribe((Response) => {
            console.log(Response)
            this.ddlCountry.SetSelection(Response.countryId);
        });
    }

    bankId = 0
    bankName = ''
    selectChangemodeofBank(obj: any) {
        this.bankId = obj.value
        this.bankName = obj.text
    }

    talukaId = 0
    selectChangemodeoftaluka(obj: any) {
        this.talukaId = obj.value
    }

    onChangestate(e) {
    }

    onSubmit() {

        const msmNoControl = this.supplierForm.controls['MSMNo'];
        if (this.msmflag === false) {
            // msmNoControl.setValidators([Validators.required]);
        } else {
            msmNoControl.clearValidators();
        }
        //   msmNoControl.updateValueAndValidity();

        if (this.supplierForm.valid) {
            const formData = { ...this.supplierForm.value };

            const transformedStores = (formData.mAssignSupplierToStores || []).map((store: any) => ({
                assignId: 0,
                StoreId: store.storeId,
                SupplierId: 0
            }));

            formData.mAssignSupplierToStores = transformedStores;

            formData.supplierId = this.SupplierId;
            formData.bankName = this.bankName;
            formData.expDate = this.datepipe.transform(this.supplierForm.get('expDate').value, 'yyyy-MM-dd')
            formData.modeofPayment = Number(formData.modeofPayment);
            formData.termofPayment = Number(formData.termofPayment);

            console.log("After transformation:", formData);

            this._supplierService.SupplierSave(formData).subscribe((response) => {
                this.onClear(true);
            });

        } else {

            const invalidFields: string[] = [];

            Object.keys(this.supplierForm.controls).forEach((controlName) => {
                const control = this.supplierForm.controls[controlName];
                if (control.invalid) {
                    invalidFields.push(controlName);
                }
            });

            if (invalidFields.length > 0) {
                invalidFields.forEach((field) => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
                });
            }
        }
    }


    onClear(val: boolean) {
        this.supplierForm.reset();
        this.dialogRef.close(val);
    }
    onClose() {
        this.supplierForm.reset();
        this.dialogRef.close();
    }

    // new API

    cityId = 0;
    cityName = '';
    stateId = 0;
    countryId = 0;
    modeOfPaymentId = 0;
    termOfPaymentId = 0;
    storeId = 0;
    supplierId = 0;


    keyPressAlphanumeric(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    getValidationMessages() {
        return {
            supplierName: [
                { name: "required", Message: "Supplier Name is required" },
                { name: "pattern", Message: "Only Characters Allowed" },
            ],
            mobile: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "required", Message: "Mobile No is required" },
                { name: "maxLength", Message: "More than 10 digits not allowed." }
            ],
            phone: [
                { name: "required", Message: "LandLine No is required" },
                { name: "pattern", Message: "Only Numbers Allowed" },
            ],
            address: [
                { name: "required", Message: "Address is required" },
                { name: "pattern", Message: "Only Characters Allowed" },
            ],
            cityId: [
                { name: "required", Message: "City is required" },
            ],
            stateId: [
                { name: "required", Message: "State is required" },
            ],
            countryId: [
                { name: "required", Message: "Country is required" },
            ],
            panNo: [
                { name: "required", Message: "Pan No is required" },
                { name: "pattern", Message: "Only Numbers & Characters Allowed" },
            ],
            fax: [
            ],
            email: [
                { name: "required", Message: "Email is required" },
                { name: "pattern", Message: "Only Numbers & Characters Allowed" },
            ],
            Freight: [
            ],
            CreditPeriod: [
                { name: "required", Message: "Credit Period is required" },
            ],
            modeofPayment: [
                { name: "required", Message: "Mode Of Payment is required" },
            ],
            termofPayment: [
                { name: "required", Message: "Terms Of Payment is required" },
            ],
            gstNo: [
                { name: "required", Message: "GST is required" },
                { name: "maxLength", Message: "More than 15 digits not allowed." }
            ],
            mAssignSupplierToStores: [
                { name: "required", Message: "Store is required" }
            ],
            taxNature: [],
            licNo: [],
            dlno: [],
            taluka: [],
            bankId: [],
            branch: [],
            bankNo: [],
            ifsccode: [],
        };
    }
}
