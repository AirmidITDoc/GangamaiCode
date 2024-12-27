import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ItemFormMasterComponent } from "./item-form-master/item-form-master.component";
import { ItemMasterService } from "./item-master.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes, gridActions } from "app/core/models/tableActions";

@Component({
    selector: "app-item-master",
    templateUrl: "./item-master.component.html",
    styleUrls: ["./item-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemMasterComponent implements OnInit {

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedContacts: boolean;
    autocompleteModestoreName: string="StoreName";
   
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
    apiUrl: "ItemMaster/ItemMasterList",
    columnsList: [
        { heading: "Code", key: "itemID", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "ItemName", key: "itemName", sort: true, align: 'left', emptySign: 'NA',width :200 },
        { heading: "ItemTypeName", key: "itemTypeName", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "ItemShortName", key: "itemShortName", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "ItemTypeID", key: "itemTypeID", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "ItemCategaryId", key: "itemCategaryId", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "ItemCategoryName", key: "itemCategoryName", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "ItemClassId", key: "itemClassId", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "ItemClassName", key: "itemClassName", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "ItemGenericNameId", key: "itemGenericNameId", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "ItemGenericName", key: "itemGenericName", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "PurchaseUOMId", key: "purchaseUOMId", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "PuchaseUOM", key: "puchaseUOM", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "StockUOMId", key: "stockUOMId", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "StockUOM", key: "stockUOM", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "ConversionFactor", key: "conversionFactor", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "CurrencyId", key: "currencyId", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "CurrencyName", key: "currencyName", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "TaxPer", key: "taxPer", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "IsBatchRequired", key: "isBatchRequired", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "MinQty", key: "minQty", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "MaxQty", key: "maxQty", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "ReOrder", key: "reOrder", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "StoreName", key: "storeName", sort: true, align: 'left', emptySign: 'NA',width :200 },
        { heading: "StoreId", key: "storeId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "HsNcode", key: "hsNcode", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Cgst", key: "cgst", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Sgst", key: "sgst", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Igst", key: "igst", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "ManufId", key: "manufId", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "IsNarcotic", key: "isNarcotic", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "ProdLocation", key: "prodLocation", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "IsH1Drug", key: "isH1Drug", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "IsScheduleH", key: "isScheduleH", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "IsHighRisk", key: "isHighRisk", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "IsScheduleX", key: "isScheduleX", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "IsLASA", key: "isLASA", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsEmgerency", key: "isEmgerency", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "DrugType", key: "drugType", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "DrugTypeName", key: "drugTypeName", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "ItemCompnayId", key: "itemCompnayId", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.confirmDialogRef = this._matDialog.open(
                                FuseConfirmDialogComponent,
                                {
                                    disableClose: false,
                                }
                            );
                            this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                            this.confirmDialogRef.afterClosed().subscribe((result) => {
                                if (result) {
                                    let that = this;
                                    this._itemService.deactivateTheStatus(data.stockId).subscribe((response: any) => {
                                    this.toastr.success(response.message);
                                    that.grid.bindGridData();
                                    });
                                }
                                this.confirmDialogRef = null;
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "ItemID",
        sortOrder: 0,
        filters: [
            { fieldName: "ItemName", fieldValue: "%", opType: OperatorComparer.Equals },
            { fieldName: "StoreID", fieldValue: "2", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
   
    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(ItemFormMasterComponent,
            {
                maxWidth: "95%",
                height: '85%',
                width: '85%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    storeId=0;
    selectChangestoreName(obj:any){
        this.storeId=obj.value;
      }

    constructor(
        public _itemService: ItemMasterService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void { }   
}


export class ItemMaster {
    ItemID: number;
    itemID: number;
    itemId: number;
    itemShortName: string;
    itemName: string;
    itemTypeID: number;
    itemCategoryId: number;
    itemGenericNameId: number;
    itemClassId: number;
    purchaseUOMId: number;
    stockUOM: number;
    conversionFactor: string;
    currencyId: number;
    taxPer: number;
    Isdeleted: boolean;
    Addedby: number;
    UpdatedBy: number;
    isBatchRequired: boolean;
    minQty: number;
    maxQty: number;
    reOrder: number;
    isNursingFlag: boolean;
    hsNcode: string;
    cgst: number;
    sgst: number;
    igst: number;
    IsNarcotic: boolean;
    ManufId: number;
    manufId:any;
    prodLocation: string;
    isH1Drug: boolean;
    isScheduleH: boolean;
    isHighRisk: boolean;
    isScheduleX: boolean;
    isLASA: boolean;
    isEmgerency: boolean;
    AddedByName: string;
    IsDeletedSearch: number;
    maxDisc:any;
    storagelocation:any;
    companyId:any;
    drugType :any;
    drugTypeName :any;
    itemCompnayId:any;
    position:any;
    mAssignItemToStores:any[];

    /**
     * Constructor
     *
     * @param ItemMaster
     */
    constructor(ItemMaster) {
        {
            this.ItemID = ItemMaster.ItemID || 0;
            this.itemID = ItemMaster.itemID || 0;
            this.itemId = ItemMaster.itemId || 0;
            
               this.itemShortName = ItemMaster.itemShortName || "";
            this.itemName = ItemMaster.itemName || "";
            this.itemTypeID = ItemMaster.itemTypeID || "";
            this.itemCategoryId = ItemMaster.itemCategoryId || "";
            this.itemGenericNameId = ItemMaster.itemGenericNameId || "";
            this.itemClassId = ItemMaster.itemClassId || "";
            this.purchaseUOMId = ItemMaster.purchaseUOMId || "";
            this.stockUOM = ItemMaster.stockUOM || "";
            this.conversionFactor = ItemMaster.conversionFactor || "";
            this.currencyId = ItemMaster.currencyId || "";
            this.taxPer = ItemMaster.taxPer || "";
            this.Isdeleted = ItemMaster.Isdeleted || "true";
            this.Addedby = ItemMaster.Addedby || "";
            this.UpdatedBy = ItemMaster.UpdatedBy || "";
            this.isBatchRequired = ItemMaster.isBatchRequired || "false";
            this.minQty = ItemMaster.minQty || "";
            this.maxQty = ItemMaster.maxQty || "";
            this.reOrder = ItemMaster.reOrder || "";
            this.isNursingFlag = ItemMaster.isNursingFlag || "false";
            this.hsNcode = ItemMaster.hsNcode || "";
            this.cgst = ItemMaster.cgst || "";
            this.sgst = ItemMaster.sgst || "";
            this.igst = ItemMaster.igst || "";
            this.manufId = ItemMaster.manufId || 0;
            this.IsNarcotic = ItemMaster.IsNarcotic || "false";
            this.prodLocation = ItemMaster.prodLocation || "";
            this.isH1Drug = ItemMaster.isH1Drug || "false";
            this.isScheduleH = ItemMaster.isScheduleH || "false";
            this.isHighRisk = ItemMaster.isHighRisk || "false";
            this.isScheduleX = ItemMaster.isScheduleX || "false";
            this.isLASA = ItemMaster.isLASA || "false";
            this.isEmgerency = ItemMaster.isEmgerency || "false";
            this.AddedByName = ItemMaster.AddedByName || "";
            this.IsDeletedSearch = ItemMaster.IsDeletedSearch || "";
            this.maxDisc=ItemMaster.maxDisc || 0
            this.storagelocation=ItemMaster.storagelocation ||""
            this.companyId=ItemMaster. ompanyId ||""
            this.drugType=ItemMaster.drugType ||""
            this.drugTypeName=ItemMaster.DrugTypeName ||""
            this.itemCompnayId=ItemMaster.itemCompnayId || 0
            
            this.mAssignItemToStores=ItemMaster.mAssignItemToStores||[];

        }
    }
}

