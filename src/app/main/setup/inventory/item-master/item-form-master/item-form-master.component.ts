import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { ItemMasterService } from "../item-master.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ItemMaster, ItemMasterComponent } from "../item-master.component";
import { ToastrService } from "ngx-toastr";
import { ItemGenericMasterComponent } from "../../item-generic-master/item-generic-master.component";
import { AirmidDropDownComponent } from "app/main/shared/componets/airmid-dropdown/airmid-dropdown.component";

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
    menuId = 0;

    // new api
    autocompleteModeItemType: string = "ItemType";
    autocompleteModeItemCategory: string = "ItemCategory";
    autocompleteModeItemGenericName: string = "ItemGeneric";
    autocompleteModeItemClass: string = "ItemClass";
    autocompleteModeCurrency: string = "Currency";
    autocompleteModePurchaseUOM: string = "UnitOfMeasurment";
    autocompleteModeStockUOM: string = "UnitOfMeasurment";
    autocompleteModeCompany: string = "Company";
    autocompleteModeStore: string = "Store";
    autocompleteModeDrugType: string = "ItemDrugType";
    autocompleteModeMenu: string = "ItemManufacture";

    registerObj = new ItemMaster({});
    @ViewChild('ddlStore') ddlStore: AirmidDropDownComponent;
    ItemId: any = 0;
    vchkactive: any = true;
    grid: any;
    vHSNCode: any;
    vCGST:any;
    vIGST:any;
    vSGST:any;

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
        
        if(this.data){
            console.log(this.data)
            this.ItemId = this.data.itemID
            this.vHSNCode = this.data.hsNcode
            this.vchkactive = this.data.isActive
            this.vCGST=this.data.cgst
            this.vSGST=this.data.sgst
            this.vIGST=this.data.igst
        }
        if ((this.data?.itemID ?? 0) > 0) {
            this._itemService.getstoreById(this.data.itemID).subscribe((response) => {
                this.registerObj = response;
                console.log(response)
                this.ddlStore.SetSelection(this.registerObj.mAssignItemToStores);

            }, (error) => {
                this.toastr.error(error.message);
            });
        }
    }

    onSave(row: any = null) {
        let that = this;

        const dialogRef = this._matDialog.open(ItemGenericMasterComponent,
            {
                width: '80%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    removestore(item) {
        let removedIndex = this.itemForm.value.mAssignItemToStores.findIndex(x => x.storeId == item.storeId);
        this.itemForm.value.mAssignItemToStores.splice(removedIndex, 1);
        this.ddlStore.SetSelection(this.itemForm.value.mAssignItemToStores.map(x => x.storeId));
    }

   

    // selectChangeItemType(obj: any) {
    //     this.itemId = obj.value;
    // }
    // selectChangeItemCategory(obj: any) {
    //     this.categoryId = obj.value;
    // }
    // selectChangeItemGenericName(obj: any) {
    //     this.genericId = obj.value;
    // }
    // selectChangeItemClass(obj: any) {
    //     this.classId = obj.value;
    // }
    // selectChangeCurrency(obj: any) {
    //     this.currencyId = obj.value;
    // }
    // selectChangePurchaseUOM(obj: any) {
    //     this.purchaseId = obj.value;
    // }
    // selectChangeStockUOM(obj: any) {
    //     this.stockId = obj.value;
    // }
    // selectChangeCompany(obj: any) {
    //     this.companyId = obj.value
    // }
    // selectChangeStore(obj: any) {
    //     this.storeId = obj.value
    // }
    // selectChangeDrugType(obj: any) {
    //     this.drugId = obj.value
    // }
    // selectChangeMenu(obj: any) {
    //     this.menuId = obj.value
    // }

    gstPerArray:any=[
        {gstPer :0},
        {gstPer :2.5},
        {gstPer :6},
        {gstPer :9},
        {gstPer :14},
    ]

    validateGST(fieldValue, fieldName) {
        if (parseFloat(fieldValue) > 0) {
            if (!this.gstPerArray.some(item => item.gstPer == parseFloat(fieldValue))) {
                this.toastr.warning(`Please enter ${fieldName} percentage as 2.5%, 6%, 9% or 14%`, 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return false;
            }
        }
        return true;
    }
    
    gstPerChecking() {
        if (!this.validateGST(this.vCGST, 'CGST')) return;
        if (!this.validateGST(this.vSGST, 'SGST')) return;
        if (!this.validateGST(this.vIGST, 'IGST')) return;
    }    

    onSubmit() {
debugger

        if (!this.itemForm.invalid) {
            console.log("Item JSON :-", this.itemForm.value);
        
            const formData = { ...this.itemForm.value };
        const transformedStores = (formData.mAssignItemToStores || []).map((store: any) => {
            return {
                assignId: 0,
                StoreId: store.storeId,
                itemId: 0
            };
        });

        formData.mAssignItemToStores = transformedStores;

        console.log("Item JSON :-", formData);

            if (this.ItemId) {

                formData.itemID=this.ItemId
                
                this._itemService.updateItemMaster(formData).subscribe(
                    (data) => {
                        this.toastr.success(data.message);
                        this.onClear(true);
                    },
                    (error) => {
                        this.toastr.error(error.message);
                    }
                );
            } else {
                this._itemService.insertItemMaster(formData).subscribe(
                    (data) => {
                        this.toastr.success(data.message);
                        this.onClear(true);
                    },
                    (error) => {
                        this.toastr.error(error.message);
                    }
                );
            }
        }
        
        else {
            let invalidFields = [];

            if (this.itemForm.invalid) {
                for (const controlName in this.itemForm.controls) {
                if (this.itemForm.controls[controlName].invalid) {
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

            // this.toastr.warning('please check from is invalid', 'Warning !', {
            //     toastClass: 'tostr-tost custom-toast-warning',
            // });
            // return;
        }
    }

    onClear(val: boolean) {
        // this.itemForm.reset();
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
                { name: "required", Message: "Conversion Factor is required" },
                { name: "maxlength", Message: "Conversion Factor should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
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
                { name: "required", Message: "Drig Type is required" }
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
        };
    }

}
