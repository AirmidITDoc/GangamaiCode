import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { SupplierMaster, SupplierMasterComponent } from '../supplier-master.component';
import { SupplierMasterService } from '../supplier-master.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormGroup, Validators } from '@angular/forms';

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
    vtaluka:any;

    autocompleteModecity: string = "City";
    autocompleteModestate: string = "State";
    autocompleteModecountry: string = "Country";
    autocompleteModeofpayment: string = "PaymentMode";
    autocompleteModetermofpayment: string = "TermofPayment";
    autocompleteModeoftaluka:string="Taluka"
    autocompleteModeofBank:string='Bank'
    @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;

    constructor(
        public _supplierService: SupplierMasterService,
        public toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _loggedService: AuthenticationService,
        public dialogRef: MatDialogRef<SupplierMasterComponent>
    ) { }

    vAddress:any;

    ngOnInit(): void {
        this.supplierForm = this._supplierService.createSuppliermasterForm();
        this.supplierForm.markAllAsTouched();
        
        if(this.data){
            console.log(this.data)
            this.SupplierId = this.data.supplierId
            this.supplierForm.get('supplierName')?.setValue(this.data.supplierName.trim());
            this.supplierForm.get('mobile')?.setValue(this.data.mobile.trim());
            this.supplierForm.get('phone')?.setValue(this.data.phone.trim());
            this.supplierForm.get('address')?.setValue(this.data.address.trim());
            this.supplierForm.get('panNo')?.setValue(this.data.panNo.trim());

            this.supplierForm.get('email')?.setValue(this.data.email.trim());
            this.supplierForm.get('CreditPeriod')?.setValue(this.data.creditPeriod.trim());
            this.supplierForm.get('gstNo')?.setValue(this.data.gstNo.trim());
            this.supplierForm.get('ContactPerson')?.setValue(this.data.contactPerson.trim());
        }

        if ((this.data?.supplierId ?? 0) > 0) {

            this.isActive = this.data.isActive;
            this._supplierService.getsupplierId(this.data.supplierId).subscribe((response) => {
                this.registerObj = response;
                console.log(this.registerObj)
                this.ddlStore.SetSelection(this.registerObj.mAssignSupplierToStores);

            }, (error) => {
                this.toastr.error(error.message);
            });
        }
    }

    onChangeMsm(event) {
        
        if(event.checked==true)
        this.msmflag=true;
       else
       this.msmflag=false;
      }

    removestore(item) {
        let removedIndex = this.supplierForm.value.mAssignSupplierToStores.findIndex(x => x.storeId == item.storeId);
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

    bankId=0
    bankName=''
    selectChangemodeofBank(obj:any){
        this.bankId=obj.value
        this.bankName=obj.text
    }

    talukaId=0
    selectChangemodeoftaluka(obj:any){
        this.talukaId=obj.value
    }

    onChangestate(e) {
    }

    onSubmit() {
        debugger
        // const isPhar = this.supplierForm.get('isPharStore')?.value;
                if (this.msmflag=false) {
                    this.supplierForm.get('MSMNo')?.setValidators([Validators.required]);
                } else {
                    this.supplierForm.get('MSMNo')?.clearValidators();
                }        
                this.supplierForm.get('MSMNo')?.updateValueAndValidity();

       if(!this.supplierForm.invalid){
        const formData = { ...this.supplierForm.value };
        const transformedStores = (formData.mAssignSupplierToStores || []).map((store: any) => {
            return {
                assignId: 0,
                StoreId: store.storeId,
                SupplierId: 0
            };
        });

        formData.mAssignSupplierToStores = transformedStores;

        // const id=this.supplierForm.get('supplierId').setValue(this.SupplierId)
        formData.supplierId = this.SupplierId;
        formData.bankName = this.bankName;

        console.log("After transformation:", formData);

        this._supplierService.SupplierSave(formData).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
        }, (error) => {
            this.toastr.error(error.message);
        });

        this.onClose();
       } else {
        let invalidFields = [];

        if (this.supplierForm.invalid) {
            for (const controlName in this.supplierForm.controls) {
            if (this.supplierForm.controls[controlName].invalid) {
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

    onChangeMode(event) {

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

    selectChangecity(obj: any) {
        console.log(obj);
        this.cityId = obj.value
        this.cityName = obj.text
    }
    selectChangestate(obj: any) {
        console.log(obj);
        this.stateId = obj
    }

    selectChangecountry(obj: any) {
        console.log(obj);
        this.countryId = obj
    }
    selectChangemodeofpayment(obj: any) {
        this.modeOfPaymentId = obj.value;
    }
    selectChangetermofpayment(obj: any) {
        this.termOfPaymentId = obj.value;
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
                { name: "required", Message: "Phone No is required" },
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
                // { name: "pattern", Message: "Only numbers allowed" },
                // { name: "required", Message: "Fax No is required" },
                // { name: "maxLength", Message: "More than 10 digits not allowed." }
            ],
            email: [
                { name: "required", Message: "Email is required" },
                { name: "pattern", Message: "Only Numbers & Characters Allowed" },
            ],
            Freight: [
                // { name: "pattern", Message: "Only Numbers allowed" },
                // { name: "required", Message: "Freight is required" },
                // { name: "maxLength", Message: "More than 10 digits not allowed." }
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
            taxNature:[],
            licNo:[],
            dlno:[],
            taluka:[],
            bankId:[],
            branch:[],
            bankNo:[],
            ifsccode:[],
        };
    }
}
