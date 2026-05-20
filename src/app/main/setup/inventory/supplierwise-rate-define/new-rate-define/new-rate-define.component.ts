import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr'; 
import { SupplierwiseRateDefineService } from '../supplierwise-rate-define.service';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
  selector: 'app-new-rate-define',
  templateUrl: './new-rate-define.component.html',
  styleUrls: ['./new-rate-define.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewRateDefineComponent implements OnInit { 
    DefineForm: FormGroup;
    isActive: boolean = true; 
     autocompleteSupplier: string = "SupplierMaster"
     StoreId:any=0;

    constructor(
        public _SupplierwiseRateDefineService: SupplierwiseRateDefineService,
        public dialogRef: MatDialogRef<NewRateDefineComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
        public _loggedAccountService : AuthenticationService
    ) { }

    ngOnInit(): void { 
        debugger
      this.StoreId = this._loggedAccountService.currentUserValue.user.storeId
        this.DefineForm = this._SupplierwiseRateDefineService.CreateRateDefineForm();
        this.DefineForm.markAllAsTouched();
        if ((this.data?.defId ?? 0) > 0) {
         const itemlist = [];
            itemlist.push(
                {
                    "itemId": this.data?.itemId || 0,
                    "itemName": this.data?.itemName || '',
                    "formattedText": this.data?.itemName || '' + " | " + this.data?.itemId || 0,
                }
            )
            this.isActive = this.data.isActive
            this.DefineForm.patchValue({
                defId: this.data?.defId || 0,
                itemId:itemlist[0] || 0,
                supplierId: this.data?.supplierId || 0,
                supplierRate: this.data?.supplierRate || 0,
            }); 
        }
    }
 
    Clearfilter(event) { 
        console.log(event)
        if (event == 'Itemid')
            this.DefineForm.get('itemId').setValue("") 
    }
    onSubmit() {
      const fromValues = this.DefineForm.value
      this.DefineForm.get('itemId').setValue(fromValues.itemId?.itemId)  
        if (!this.DefineForm.invalid) {
            console.log('Payload :',this.DefineForm.value) 
            this._SupplierwiseRateDefineService.SupplierWsieRateDefineSave(this.DefineForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            const invalidFields = [];
            if (this.DefineForm.invalid) {
                for (const controlName in this.DefineForm.controls) {
                    if (this.DefineForm.controls[controlName].invalid) {
                        invalidFields.push(`unit Form: ${controlName}`);
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
        this.DefineForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            itemId: [
                { name: "required", Message: "ItemName Name is required" }, 
            ],
             supplierId: [
                { name: "required", Message: "Supplier Name is required" }
            ],
             supplierRate: [
                { name: "required", Message: "Supplier Rate is required" }
            ]
        };
    }
}