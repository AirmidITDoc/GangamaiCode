import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { SupplierMaster, SupplierMasterComponent } from '../supplier-master.component';
import { SupplierMasterService } from '../supplier-master.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-fix-supplier',
    templateUrl: './fix-supplier.component.html',
    styleUrls: ['./fix-supplier.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class FixSupplierComponent implements OnInit
{
   supplierForm: FormGroup;
     
       submitted = false;
       @ViewChild('ddlStore') ddlStore: AirmidDropDownComponent;
       registerObj = new SupplierMaster({});
     
     
       msg: any;
       msmflag: boolean = false;
       CityId: any;
       vchkactive: any = true;
     
       // new API
     
       autocompleteModecity: string = "City";
       autocompleteModestate: string = "State";
       autocompleteModecountry: string = "Country";
       autocompleteModeofpayment: string = "PaymentMode";
       autocompleteModetermofpayment: string = "TermofPayment";
     
       constructor(
         public _supplierService: SupplierMasterService,
         public toastr: ToastrService,
         @Inject(MAT_DIALOG_DATA) public data: any,
         private _loggedService: AuthenticationService,
         public dialogRef: MatDialogRef<SupplierMasterComponent>
       ) {
     
       }
     
       ngOnInit(): void {
         this.supplierForm = this._supplierService.createSuppliermasterForm();
     
                 
         if (this.data.supplierId > 0) {
           
           this._supplierService.getsupplierId(this.data.supplierId).subscribe((response) => {
               this.registerObj = response;
               console.log(this.registerObj )
               this.ddlStore.SetSelection(this.registerObj.mAssignSupplierToStores);
             
           }, (error) => {
               this.toastr.error(error.message);
           });
       }
       }
       
     
       removestore(item) {
         let removedIndex = this.supplierForm.value.mAssignSupplierToStores.findIndex(x => x.storeId == item.storeId);
         this.supplierForm.value.mAssignSupplierToStores.splice(removedIndex, 1);
         this.ddlStore.SetSelection(this.supplierForm.value.mAssignSupplierToStores.map(x => x.storeId));
     }

    
       onSubmit() {
     
            console.log(this.supplierForm.value);
            this._supplierService.SupplierSave(this.supplierForm.value).subscribe((response) => {
               this.toastr.success(response.message);
               this.onClear(true);
            }, (error) => {
               this.toastr.error(error.message);
            });
           
         this.onClose();
         
       }
     
     
     
     
       onChangeMsm(event) {
         
         if (event.checked == true)
           this.msmflag = true;
         else
           this.msmflag = false;
       }
     
       onChangeMode(event) {
     
       }
     
   
       onClear(val: boolean) 
        {
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
       bankId = 0;
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
            supplierName:[
                { name: "required", Message: "Supplier Name is required" },
                { name: "pattern", Message: "Only Characters Allowed" },
            ],
            mobile: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "required", Message: "Mobile No is required" },
                { name: "maxLength", Message: "More than 10 digits not allowed." }
            ],
            phone:[
                { name: "required", Message: "Phone No is required" },
                { name: "pattern", Message: "Only Numbers Allowed" },
            ],
            address:[
                { name: "required", Message: "Address is required" },
                { name: "pattern", Message: "Only Characters Allowed" },
            ],
            cityId:[
                { name: "required", Message: "City is required" },
            ],
            stateId:[
                { name: "required", Message: "State is required" },
            ],
            countryId:[
                { name: "required", Message: "Country is required" },
            ],
            panNo:[
                { name: "required", Message: "Pan No is required" },
                { name: "pattern", Message: "Only Numbers & Characters Allowed" },
            ],
            fax:[
                // { name: "pattern", Message: "Only numbers allowed" },
                // { name: "required", Message: "Fax No is required" },
                // { name: "maxLength", Message: "More than 10 digits not allowed." }
            ],
            email:[
                { name: "required", Message: "Email is required" },
                { name: "pattern", Message: "Only Numbers & Characters Allowed" },
            ],
            Freight:[
                // { name: "pattern", Message: "Only Numbers allowed" },
                // { name: "required", Message: "Freight is required" },
                // { name: "maxLength", Message: "More than 10 digits not allowed." }
            ],
            CreditPeriod:[
                { name: "required", Message: "Credit Period is required" },
            ],
            modeofPayment:[
                { name: "required", Message: "Mode Of Payment is required" },
            ],
            termofPayment:[
                { name: "required", Message: "Terms Of Payment is required" }, 
            ],
            gstNo:[
                { name: "required", Message: "GST is required" },
                { name: "maxLength", Message: "More than 15 digits not allowed." }
            ],
            storeId:[],
        };
    }
}
