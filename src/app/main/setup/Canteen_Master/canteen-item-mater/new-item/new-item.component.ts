import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { AirmidDropDownComponent } from "app/main/shared/componets/airmid-dropdown/airmid-dropdown.component";
import { ToastrService } from "ngx-toastr";
import { ItemmasterService } from "../itemmaster.service";
// import { ItemMaster } from "../canteen-item-mater.component";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";
import { AuthenticationService } from "app/core/services/authentication.service";


@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewItemComponent {

    itemForm: FormGroup;
    isActive: boolean = true;

    itemId = 0;
    categoryId = 0;
   
    
    autocompleteModeGSTTypesValues: string = "GSTTypes";
    autocompleteModeGSTTypesValues1: string = "GSTTypes";
    autocompleteModeItemType: string = "ItemType";
    autocompleteModeItemCategory: string = "ItemCategory";
   
    // registerObj = new ItemMaster({});
    
    ItemId: any = 0;
    vchkactive: any = true;
    grid: any;
    
    vCGST: any;
    vIGST: any;
    vSGST: any;
    
    constructor(  public _itemService: ItemmasterService,
        public toastr: ToastrService,     private _formBuilder: UntypedFormBuilder,
        public _matDialog: MatDialog,  private _loggedService: AuthenticationService,
        @Inject(MAT_DIALOG_DATA) public data: any, private _FormvalidationserviceService: FormvalidationserviceService,
        public dialogRef: MatDialogRef<NewItemComponent>
      
    ) { }

    ngOnInit(): void {
        this.itemForm = this.createItemmasterForm();
        this.itemForm.markAllAsTouched();

      if ((this.data?.itemId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.itemForm.patchValue(this.data);
        }
      
    }

  createItemmasterForm(): FormGroup {
          return this._formBuilder.group({
              itemId: [0],
              itemShortName: ['', [Validators.required, Validators.maxLength(50)]],
              itemName: ['', [Validators.required]],
              itemCategaryId:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
              purchaseUomid:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
              conversionFactor:[''],
              isdeleted:false,
              isBatchRequired:false,
              cgst:[0],
              sgst:[0],
              igst:[0],
              prodLocation:[''],
              price:[0, [Validators.required]],
              empPrice:[0],
                addedby: this._loggedService.currentUserValue.userId,
            upDatedBy: this._loggedService.currentUserValue.userId,
           
          });
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

    getchangegstper(rate: any): void {
        
        console.log(this.itemForm.value);

        if (Number(rate?.value) > 0) {
           
            this.itemForm.get('igst').setValue(0);
            this.itemForm.get('igst').clearValidators();
            this.itemForm.get('igst').updateValueAndValidity();
            this.itemForm.get('igst').disable();
        } else {
            this.itemForm.get('igst').enable();
            this.itemForm.get('igst').reset(0);
        }
        console.log(this.itemForm.value);

    }

    getchangeIgstper(rate: any): void {
        
        if (Number(rate?.text) > 0) {
          
            this.itemForm.get('cgst').reset();
            this.itemForm.get('cgst').clearValidators();
            this.itemForm.get('cgst').updateValueAndValidity();
            this.itemForm.get('cgst').disable();

        } else {
            this.itemForm.get('cgst').enable();
            this.itemForm.get('cgst').reset();
        }
        console.log(this.itemForm.value);

    }


    onSubmit() {
        if (this.itemForm.valid) {
           
            console.log(this.itemForm.value)
            // const formData = { ...this.itemForm.value };

            // if (parseFloat(formData.cgst) > 0) {
            //     formData.sgst = formData.cgst
            //     formData.igst = 0
            // } else if (formData.igst > 0) {
            //     formData.cgst = 0
            //     formData.sgst = 0
            // }


            console.log("Transformed Item JSON :-", this.itemForm.value);
            this._itemService.insertItemMaster(this.itemForm.value).subscribe((data) => {
                    this.onClear(true);
                });
            
        } else {
            const invalidFields: string[] = [];

            Object.keys(this.itemForm.controls).forEach((controlName) => {
                const control = this.itemForm.controls[controlName];
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

 getValidationMessages() {
        return {
            prodLocation: [
                { name: "required", Message: "prodLocation is required" },
                // { name: "pattern", Message: "Only Numbers allowed." }
            ],
            price: [
                { name: "required", Message: "price is required" },
                // { name: "maxlength", Message: "Item Name should not be greater than 50 char." },
                // { name: "pattern", Message: "Special char not allowed." }
            ],
            empPrice: [
                { name: "required", Message: "empPrice is required" },
                // { name: "maxlength", Message: "Item Name should not be greater than 50 char." },
                // { name: "pattern", Message: "Special char not allowed." }
            ],
            itemName:[],
            itemShortName:[[]],
            cgst:[],
            sgst:[],
        }
    }
    onClear(val: boolean) {
        this.dialogRef.close(val);
    }
  }