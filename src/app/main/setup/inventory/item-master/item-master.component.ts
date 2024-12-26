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
                height: '75%',
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
    //  ItemShortName: string;
    ItemName: string;
    ItemTypeID: number;
    ItemCategoryId: number;
    ItemGenericNameId: number;
    ItemClassId: number;
    PurchaseUOMId: number;
    StockUOMId: number;
    ConversionFactor: string;
    CurrencyId: number;
    TaxPer: number;
    Isdeleted: boolean;
    Addedby: number;
    UpdatedBy: number;
    IsBatchRequired: boolean;
    MinQty: number;
    MaxQty: number;
    ReOrder: number;
    IsNursingFlag: boolean;
    HSNcode: string;
    CGST: number;
    SGST: number;
    IGST: number;
    IsNarcotic: boolean;
    ManufId: number;
    ProdLocation: string;
    IsH1Drug: boolean;
    IsScheduleH: boolean;
    IsHighRisk: boolean;
    IsScheduleX: boolean;
    IsLASA: boolean;
    IsEmgerency: boolean;
    AddedByName: string;
    IsDeletedSearch: number;
    MaxDisc:any;
    Storagelocation:any;
    CompanyId:any;
    DrugType :any;
    DrugTypeName :any;
    ItemCompnayId:any;
    position:any;
    mAssignItemToStores:any[];

    /**
     * Constructor
     *
     * @param ItemMaster
     */
    constructor(ItemMaster) {
        {
            this.ItemID = ItemMaster.ItemID || "";
            //    this.ItemShortName = ItemMaster.ItemShortName || "";
            this.ItemName = ItemMaster.ItemName || "";
            this.ItemTypeID = ItemMaster.ItemTypeID || "";
            this.ItemCategoryId = ItemMaster.ItemCategoryId || "";
            this.ItemGenericNameId = ItemMaster.ItemGenericNameId || "";
            this.ItemClassId = ItemMaster.ItemClassId || "";
            this.PurchaseUOMId = ItemMaster.PurchaseUOMId || "";
            this.ConversionFactor = ItemMaster.ConversionFactor || "";
            this.CurrencyId = ItemMaster.CurrencyId || "";
            this.TaxPer = ItemMaster.TaxPer || "";
            this.Isdeleted = ItemMaster.Isdeleted || "true";
            this.Addedby = ItemMaster.Addedby || "";
            this.UpdatedBy = ItemMaster.UpdatedBy || "";
            this.IsBatchRequired = ItemMaster.IsBatchRequired || "false";
            this.MinQty = ItemMaster.MinQty || "";
            this.MaxQty = ItemMaster.MaxQty || "";
            this.ReOrder = ItemMaster.ReOrder || "";
            this.IsNursingFlag = ItemMaster.IsNursingFlag || "false";
            this.HSNcode = ItemMaster.HSNcode || "";
            this.CGST = ItemMaster.CGST || "";
            this.SGST = ItemMaster.SGST || "";
            this.IGST = ItemMaster.IGST || "";
            this.IsNarcotic = ItemMaster.IsNarcotic || "false";
            this.ProdLocation = ItemMaster.ProdLocation || "";
            this.IsH1Drug = ItemMaster.IsH1Drug || "false";
            this.IsScheduleH = ItemMaster.IsScheduleH || "false";
            this.IsHighRisk = ItemMaster.IsHighRisk || "false";
            this.IsScheduleX = ItemMaster.IsScheduleX || "false";
            this.IsLASA = ItemMaster.IsLASA || "false";
            this.IsEmgerency = ItemMaster.IsEmgerency || "false";
            this.AddedByName = ItemMaster.AddedByName || "";
            this.IsDeletedSearch = ItemMaster.IsDeletedSearch || "";
            this.MaxDisc=ItemMaster.MaxDisc || 0
            this.Storagelocation=ItemMaster.Storagelocation ||""
            this.CompanyId=ItemMaster.CompanyId ||""
            this.DrugType=ItemMaster.DrugType ||""
            this.DrugTypeName=ItemMaster.DrugTypeName ||""
            this.ItemCompnayId=ItemMaster.ItemCompnayId || 0
            
            this.mAssignItemToStores=ItemMaster.mAssignItemToStores||[];

        }
    }
}

