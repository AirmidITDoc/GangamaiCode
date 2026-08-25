
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { AirmidDropDownComponent } from "app/main/shared/componets/airmid-dropdown/airmid-dropdown.component";
import { ToastrService } from "ngx-toastr";
import { ItemGenericMasterComponent } from "../../item-generic-master/item-generic-master.component";
import { NewManufactureComponent } from "../../manufacture-master/new-manufacture/new-manufacture.component";
import { ItemMaster, ItemMasterComponent } from "../item-master.component";
import { ItemMasterService } from "../item-master.service";
import { ItemWiseSupplierRateComponent } from "../item-wise-supplier-rate/item-wise-supplier-rate.component";

@Component({
    selector: "app-item-form-master",
    templateUrl: "./item-form-master.component.html",
    styleUrls: ["./item-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemFormMasterComponent implements OnInit {

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
    @ViewChild('ddlDrug') ddlDrug: AirmidDropDownComponent;
    ItemId: any = 0;
    vchkactive: any = true;
    grid: any;
    vHSNCode: any;
    vCGST: any;
    vIGST: any;
    vSGST: any;
    VisValidContent: any = false;

    constructor(
        public _itemService: ItemMasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ItemMasterComponent>
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
            this.drugName = this.data?.drugTypeName || '';

            if (this.data.igst == 0)
                this.itemForm.get('cgst').setValue(this.data.taxPer)
            else
                this.itemForm.get('igst').setValue(this.data.taxPer)

        }
        if ((this.data?.itemID ?? 0) > 0) {
            this._itemService.getstoreById(this.data.itemID).subscribe((response) => {

                this.registerObj = response;

                this.registerObj.mAssignItemToDrugs =
                    response.mAssignItemToDrugs.map((x: any) => ({
                        itemDrugTypeId: x.drugId
                    }));

                this.ddlStore.SetSelection(this.registerObj.mAssignItemToStores);

                this.ddlDrug.SetSelection(this.registerObj.mAssignItemToDrugs);
            });
        }
    }



    onHSNChange(event: any) {
        const upper = event.target.value.toUpperCase();
        this.itemForm.get('hsNcode')?.setValue(upper, { emitEvent: false });
    }

    onNewItemWiseSupprate(row: any = null) {
        const that = this;

        const dialogRef = this._matDialog.open(ItemWiseSupplierRateComponent,
            {
                height: '85%',
                width: '80%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();
        });
    }

    AddNewManufactur(row: any = null) {
        const that = this;
        const dialogRef = this._matDialog.open(NewManufactureComponent,
            {
                height: '45%',
                width: '80%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    showDoseDropdownRefresh = true;
    onSave(row: any = null) {
        const that = this;

        const dialogRef = this._matDialog.open(ItemGenericMasterComponent,
            {
                width: '80%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            // that.grid.bindGridData();
            //  Force re-render of dropdown to reload internal data
            this.showDoseDropdownRefresh = false;
            setTimeout(() => {
                this.showDoseDropdownRefresh = true;
            }, 100);
        });
    }

    removestore(item) {
        const removedIndex = this.itemForm.value.mAssignItemToStores.findIndex(x => x.storeId == item.storeId);
        this.itemForm.value.mAssignItemToStores.splice(removedIndex, 1);
        this.ddlStore.SetSelection(this.itemForm.value.mAssignItemToStores.map(x => x.storeId));
    }

    removeDrug(item) {
        const removedIndex = this.itemForm.value.mAssignItemToDrugs.findIndex(x => x.itemDrugTypeId == item.itemDrugTypeId);
        this.itemForm.value.mAssignItemToDrugs.splice(removedIndex, 1);
        this.ddlDrug.SetSelection(this.itemForm.value.mAssignItemToDrugs.map(x => x.itemDrugTypeId));
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

            const transformedDrugs = (formData.mAssignItemToDrugs || []).map((drug: any) => ({
                assignId: 0,
                drugId: drug.itemDrugTypeId,
                itemId: this.ItemId
            }));

            formData.mAssignItemToDrugs = transformedDrugs;

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
                formData.drugTypeName = this.drugName;
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


    onClear(val: boolean) {
        this.dialogRef.close(val);
    }

    onChangeMode($event: any) {
        throw new Error('Method not implemented.');
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

            itemTypeId: [
                { name: "required", Message: "Item Type is required" }
            ],
            itemCategaryId: [
                { name: "required", Message: "Item Category is required" }
            ],
            itemGenericNameId: [
                { name: "required", Message: "Item Generic Name is required" }
            ],
            itemClassId: [
                { name: "required", Message: "Item Class is required" }
            ],
            currencyId: [
                { name: "required", Message: "Currency ID is required" }
            ],
            purchaseUomid: [
                { name: "required", Message: "Unit Of Measurement ID is required" }
            ],
            stockUomid: [
                { name: "required", Message: "Stock Unit Of Measurement ID is required" }
            ],
            conversionFactor: [
                { name: "required", Message: "Conversion Factor or packing is required" },
                { name: "maxlength", Message: "Conversion Factor should not be greater than 5 char." },
                { name: "pattern", Message: "Only NUMBER allowed." }
            ],
            reOrder: [
                { name: "required", Message: "ReOrder is required" },
                // { name: "maxlength", Message: "ReOrder should not be greater than 50 char." },
                { name: "pattern", Message: "Only NUMBER allowed." }
            ],
            cgst: [
                { name: "required", Message: "C-GST required" },
                { name: "maxlength", Message: "CGST should not be greater than 15 digits." },
                { name: "pattern", Message: "Only Numbers allowed." }
            ],
            sgst: [
                { name: "required", Message: "S-GST is required" },
                { name: "maxlength", Message: "SGST should not be greater than 15 digits." },
                { name: "pattern", Message: "Only Numbers allowed." }
            ],
            igst: [
                { name: "required", Message: "I-GST is required" },
                { name: "maxlength", Message: "IGST should not be greater than 15 digits." },
                { name: "pattern", Message: "Only Numbers allowed." }
            ],
            minQty: [
                { name: "required", Message: "Min-Qty is required" },
                { name: "maxlength", Message: "MinQty should not be greater than 50 digits." },
                { name: "pattern", Message: "Only Numbers allowed." }
            ],
            maxQty: [
                { name: "required", Message: "Max-Qty is required" },
                { name: "maxlength", Message: "MaxQty should not be greater than 50 digits." },
                { name: "pattern", Message: "Only Numbers allowed." }
            ],
            prodLocation: [
                { name: "required", Message: "Storage Location is required" },
                { name: "maxlength", Message: "storeName  should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            drugType: [
                //{ name: "required", Message: "Drig Type is required" }
            ],
            manufId: [
                { name: "required", Message: "Manufactured ID is required" }
            ],
            itemCompnayId: [
                { name: "required", Message: "Company Name is required" }
            ],
            mAssignItemToStores: [
                { name: "required", Message: "Store Name is required" }
            ],
            localLanguageName:[]
        };
    }

}
