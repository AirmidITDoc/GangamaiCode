import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { SupplierMaster, SupplierMasterComponent } from '../supplier-master.component';
import { SupplierMasterService } from '../supplier-master.service';
import { Subject } from 'rxjs';
import { AirmidAutocompleteComponent } from 'app/main/shared/componets/airmid-autocomplete/airmid-autocomplete.component';
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
       @ViewChild('ddlStore') ddlStore: AirmidAutocompleteComponent;
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

    Saveflag: boolean = false;
       onSubmit() {
     
            this.Saveflag = true;
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
            
            supplierName:[],
            SupplierType:[],
            mobile:[],
            phone:[],
            address:[],
            cityId:[],
            stateId:[],
            countryId:[],
            panNo:[],
            fax:[],
            email:[],
            Freight:[],
            CreditPeriod:[],
            modeofPayment:[],
            termofPayment:[],
            gstNo:[],
            storeId:[],

        }
    }
}
