import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { ItemMasterService } from "../item-master.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ItemMaster, ItemMasterComponent} from "../item-master.component";
import { ToastrService } from "ngx-toastr";
import { ItemGenericMasterComponent } from "../../item-generic-master/item-generic-master.component";
import { AirmidAutocompleteComponent } from "app/main/shared/componets/airmid-autocomplete/airmid-autocomplete.component";

@Component({
    selector: "app-item-form-master",
    templateUrl: "./item-form-master.component.html",
    styleUrls: ["./item-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemFormMasterComponent implements OnInit {


    itemForm:FormGroup;
    isActive:boolean=true;
    Saveflag: boolean= false;


    // new api
    autocompleteModeItemType:string="ItemType";
    autocompleteModeItemCategory:string="ItemCategory";
    autocompleteModeItemGenericName:string="ItemGeneric";
    autocompleteModeItemClass:string="ItemClass";
    autocompleteModeCurrency:string="Currency";
    autocompleteModePurchaseUOM:string="UnitofMeasure";
    autocompleteModeStockUOM:string="UnitofMeasure";
    autocompleteModeCompany:string="Company";
    autocompleteModeStore:string="Store";
    autocompleteModeDrugType:string="DrugType";
    autocompleteModeMenu:string="ItemManufacture";

    registerObj = new ItemMaster({});

    vchkactive: any=true;
    grid: any;


    constructor(
        public _itemService: ItemMasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ItemMasterComponent>
    ) { }
    @ViewChild('ddlStore') ddlStore: AirmidAutocompleteComponent;
    ItemId:any=0;
    ngOnInit(): void {
        this.itemForm=this._itemService.createItemmasterForm();

       console.log(this.data)
        if (this.data.itemID > 0) {
 
            this._itemService.getstoreById(this.data.itemID).subscribe((response) => {
              this.registerObj = response;
              this.ItemId = this.registerObj.itemId 
              
              this.ddlStore.SetSelection(this.registerObj.mAssignItemToStores);
    
            }, (error) => {
              this.toastr.error(error.message);
            });
          }   else {
            this.itemForm.reset();
        }
    }

    onSave(row: any = null) {
        let that = this;

        const dialogRef = this._matDialog.open(ItemGenericMasterComponent,
            {
                maxWidth: "85%",
                height: '85%',
                width: '90%',
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

      
    itemId=0;
    categoryId=0;
    genericId=0;
    classId=0;
    currencyId=0;
    purchaseId=0;
    stockId=0;
    companyId=0;
    storeId=0;
    drugId=0;
    menuId=0;

    selectChangeItemType(obj: any){
        this.itemId=obj.value;
    }
    selectChangeItemCategory(obj: any){
        this.categoryId=obj.value;
    }
    selectChangeItemGenericName(obj: any){
        this.genericId=obj.value;
    }
    selectChangeItemClass(obj: any){
        this.classId=obj.value;
    }
    selectChangeCurrency(obj: any){
        this.currencyId=obj.value;
    }
    selectChangePurchaseUOM(obj: any){
        this.purchaseId=obj.value;
    }
    selectChangeStockUOM(obj: any){
        this.stockId=obj.value;
    }
    selectChangeCompany(obj: any){
        this.companyId=obj.value
    }
    selectChangeStore(obj: any){
        this.storeId=obj.value
    }
    selectChangeDrugType(obj: any){
        this.drugId=obj.value
    }
    selectChangeMenu(obj: any){
        this.menuId=obj.value
    }

    onSubmit() {
                debugger
                console.log("Item JSON :-", this.itemForm.value);

            // if (!this.itemForm.invalid) 
            // {
                this.Saveflag = true;

               
                this._itemService.insertItemMaster(this.itemForm.value).subscribe((data) => {
               
                this.toastr.success(data.message);
                 this.onClear(true);
                }, (error) => {
                  this.toastr.error(error.message);
                });
            // } 
            // else {
            //     this.toastr.warning('please check from is invalid', 'Warning !', {
            //         toastClass: 'tostr-tost custom-toast-warning',
            //       });
            //       return;
            // }
        }

        onClear(val: boolean) 
        {
            this.itemForm.reset();
            this.dialogRef.close(val);
        }

        getValidationMessages() {
            return {
                hsNcode: [
                    { name: "required", Message: "HSN Code is required" },
                    { name: "pattern", Message: "Only Numbers allowed." }
                ],
                itemName:[
                    { name: "required", Message: "Item Name is required" },
                    { name: "maxlength", Message: "Item Name should not be greater than 50 char." },
                    { name: "pattern", Message: "Special char not allowed." }
                ],
                itemShortName:[
                    // { name: "required", Message: "Item Name is required" },
                    // { name: "maxlength", Message: "Item Name should not be greater than 50 char." },
                    { name: "pattern", Message: "Special char not allowed." }
                ],
                
                itemTypeId:[
                    { name: "required", Message: "Item Type is required" }
                ],
                itemCategaryId:[
                    { name: "required", Message: "Item Category is required" }
                ],
                itemGenericNameId:[
                    { name: "required", Message: "Item Generic Name is required" }
                ],
                itemClassId:[
                    { name: "required", Message: "Item Class is required" }
                ],
                currencyId:[
                    { name: "required", Message: "Currency ID is required" }
                ],
                purchaseUomid: [
                    { name: "required", Message: "Unit Of Measurement ID is required" }
                ],
                stockUomid:[
                    { name: "required", Message: "Stock Unit Of Measurement ID is required" }
                ],
                conversionFactor:[
                    { name: "required", Message: "Conversion Factor is required" },
                    { name: "maxlength", Message: "Conversion Factor should not be greater than 50 char." },
                    { name: "pattern", Message: "Special char not allowed." }
                ],
                reOrder:[
                    { name: "required", Message: "ReOrder is required" },
                    { name: "maxlength", Message: "ReOrder should not be greater than 50 char." },
                    { name: "pattern", Message: "Special char not allowed." }
                ],
                cgst:[
                    { name: "required", Message: "C-GST required" },
                    { name: "maxlength", Message: "CGST should not be greater than 15 digits." },
                    { name: "pattern", Message: "Only Numbers allowed." }
                ],
                sgst:[
                    { name: "required", Message: "S-GST is required" },
                    { name: "maxlength", Message: "SGST should not be greater than 15 digits." },
                    { name: "pattern", Message: "Only Numbers allowed." }
                ],
                igst:[
                    { name: "required", Message: "I-GST is required" },
                    { name: "maxlength", Message: "IGST should not be greater than 15 digits." },
                    { name: "pattern", Message: "Only Numbers allowed." }
                ],
                minQty:[
                    { name: "required", Message: "Min-Qty is required" },
                    { name: "maxlength", Message: "MinQty should not be greater than 50 digits." },
                    { name: "pattern", Message: "Only Numbers allowed." }
                ],
                maxQty:[
                    { name: "required", Message: "Max-Qty is required" },
                    { name: "maxlength", Message: "MaxQty should not be greater than 50 digits." },
                    { name: "pattern", Message: "Only Numbers allowed." }
                ],
                prodLocation:[
                    { name: "required", Message: "Storage Location is required" },
                    { name: "maxlength", Message: "storeName  should not be greater than 50 char." },
                    { name: "pattern", Message: "Special char not allowed." }
                ],
                drugType:[
                    { name: "required", Message: "Drig Type is required" }
                ],
                manufId:[
                    { name: "required", Message: "Manufactured ID is required" }
                ],
                itemCompnayId:[
                    { name: "required", Message: "Company Name is required" }
                ],
                storeId:[
                    { name: "required", Message: "Store Name is required" }
                ],
            };
        }

        onChangeMode($event: any)
        {
            throw new Error('Method not implemented.');
        }            
}
