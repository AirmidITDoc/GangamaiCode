import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { AirmidDropDownComponent } from "app/main/shared/componets/airmid-dropdown/airmid-dropdown.component";
import { ToastrService } from "ngx-toastr";
import { ItemmasterService } from "../itemmaster.service";
import { ItemMaster } from "../canteen-item-mater.component";


@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.scss']
})
export class NewItemComponent {

    itemForm: FormGroup;
    isActive: boolean = true;

    itemId = 0;
    categoryId = 0;
    genericId = 0;
    classId = 0;
    currencyId = 0;
    purchaseId = 0;
    stockId = 0;
    companyId = 0;
    storeId = 0;
    drugId = 0;
    drugName = ''
    menuId = 0;


    autocompleteModeGSTTypesValues: string = "GSTTypes";
    autocompleteModeGSTTypesValues1: string = "GSTTypes";
    autocompleteModeItemType: string = "ItemType";
    autocompleteModeItemCategory: string = "ItemCategory";
    autocompleteModeItemGenericName: string = "ItemGeneric";
    autocompleteModeItemClass: string = "ItemClass";
    autocompleteModeCurrency: string = "Currency";
    autocompleteModePurchaseUOM: string = "UnitOfMeasurment";
    autocompleteModeStockUOM: string = "UnitOfMeasurment";
    // autocompleteModeCompany: string = "Company";
    autocompleteModeItemCompany: string = "ItemCompanyMaster"
    autocompleteModeStore: string = "Store";
    autocompleteModeDrugType: string = "ItemDrugType";
    autocompleteModeMenu: string = "ItemManufacture";

    registerObj = new ItemMaster({});
    @ViewChild('ddlStore') ddlStore: AirmidDropDownComponent;
    ItemId: any = 0;
    vchkactive: any = true;
    grid: any;
    vHSNCode: any;
    vCGST: any;
    vIGST: any;
    vSGST: any;
    VisValidContent: any = false;

    constructor(
        public _itemService: ItemmasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<NewItemComponent>
    ) { }

    ngOnInit(): void {
        this.itemForm = this._itemService.createItemmasterForm();
        this.itemForm.markAllAsTouched();

        if (this.data) {
            console.log(this.data)
            this.ItemId = this.data.itemID
            this.vHSNCode = this.data.hsNcode
            this.vchkactive = this.data.isActive
            this.vCGST = this.data.cgst
            this.vSGST = this.data.sgst
            this.vIGST = this.data.igst
            this.VisValidContent = this.data.isValidContent
        }
      
    }



    onHSNChange(event: any) {
        const upper = event.target.value.toUpperCase();
        this.itemForm.get('hsNcode')?.setValue(upper, { emitEvent: false });
    }

 
    selectChangeDrugType(obj: any) {
        this.drugId = obj.value
        this.drugName = obj.text
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
        debugger
        console.log(this.itemForm.value);

        if (Number(rate?.value) > 0) {
            this.itemForm.patchValue({
                sgst: Number((rate.value) / 2),
                taxPer: Number(rate.value)

            })
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
        debugger
        if (Number(rate?.text) > 0) {
            this.itemForm.patchValue({
                taxPer: Number(rate.value)

            })
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
            // const formData = this.itemForm.getRawValue() as ItemMaster;
            //  console.log(formData)
            if (!this.itemForm.get('hsNcode').value) {
                this.itemForm.get('hsNcode').setValue('0')
            }
            console.log(this.itemForm.value)
            const formData = { ...this.itemForm.value };

            const transformedStores = (formData.mAssignItemToStores || []).map((store: any) => ({
                assignId: 0,
                StoreId: store.storeId,
                itemId: this.ItemId
            }));

            formData.mAssignItemToStores = transformedStores;


            if (parseFloat(formData.sgst) > 0) {
                formData.cgst = formData.sgst
                formData.igst = 0
            } else if (formData.igst > 0) {
                formData.cgst = 0
                formData.sgst = 0
            }


            console.log("Transformed Item JSON :-", formData);

            if (this.ItemId != 0) {
                formData.itemID = this.ItemId;
                console.log(formData)
                this._itemService.updateItemMaster(formData).subscribe((data) => {
                    this.onClear(true);
                });
            } else if (this.ItemId == 0) {
                formData.drugTypeName = this.drugName;
                console.log(formData)
                this._itemService.insertItemMaster(formData).subscribe((data) => {
                    this.onClear(true);
                });
            }
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
            hsNcode: [
                { name: "required", Message: "HSN Code is required" },
                { name: "pattern", Message: "Only Numbers allowed." }
            ],
            itemName: [
                { name: "required", Message: "Item Name is required" },
                { name: "maxlength", Message: "Item Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            itemShortName: [
                { name: "required", Message: "Item Short Name is required" },
                { name: "maxlength", Message: "Item Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
        }
    }
    onClear(val: boolean) {
        this.dialogRef.close(val);
    }
  }