import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ItemFormMasterComponent } from "./item-form-master/item-form-master.component";
import { ItemMasterService } from "./item-master.service";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatAccordion } from "@angular/material/expansion";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector: "app-item-master",
    templateUrl: "./item-master.component.html",
    styleUrls: ["./item-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemMasterComponent implements OnInit {
    isLoading = true;
    msg: any;
    step = 0;

    setStep(index: number) {
        this.step = index;
    }
    SearchName: string;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatAccordion) accordion: MatAccordion;

    displayedColumns: string[] = [
        "ItemID",
        "ItemShortName",
        "ItemName",
        "ItemTypeName",
        "ItemCategoryName",
        "ItemGenericName",
        "ItemClassName",
        "UnitofMeasurementName",
        "StockUOMId",
        "ConversionFactor",
        "CurrencyName",
        "TaxPer",
        "MinQty",
        "MaxQty",
        "ReOrder",
        "HSNcode",
        "CGST",
        "SGST",
        "IGST",
        "ManufName",
        "ProdLocation",
        "AddedByName",
        "IsNursingFlag",
        "IsBatchRequired",
        "IsNarcotic",
        "IsH1Drug",
        "IsScheduleH",
        "IsHighRisk",
        "IsScheduleX",
        "IsLASA",
        "IsEmgerency",
        "IsDeleted",
        "action",
    ];

    DSItemMasterList = new MatTableDataSource<ItemMaster>();

    constructor(
        public _itemService: ItemMasterService,

        public _matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getItemMasterList();
    }

    onSearchClear() {
        this._itemService.myformSearch.reset({
            ItemNameSearch: "",
            IsDeletedSearch: "2",
        });
    }

    onClear() {
        this._itemService.myform.reset({ IsDeleted: "false" });
        this._itemService.initializeFormGroup();
    }

    onSearch() {
        this.getItemMasterList();
    }

    getItemMasterList() {
        var m_data = {
            ItemName: "%",
            StoreID: 1,
        };
        this._itemService.getItemMasterList(m_data).subscribe(
            (Menu) => {
                this.DSItemMasterList.data = Menu as ItemMaster[];
                this.isLoading = false;
                this.DSItemMasterList.sort = this.sort;
                this.DSItemMasterList.paginator = this.paginator;
            },
            (error) => (this.isLoading = false)
        );
    }

    onEdit(row) {
        var m_data = {
            ItemID: row.ItemID,
            ItemShortName: row.ItemShortName.trim(),
            ItemName: row.ItemName.trim(),
            ItemTypeID: row.ItemTypeID,
            ItemCategoryId: row.ItemCategoryId,
            ItemGenericNameId: row.ItemGenericNameId,
            ItemClassId: row.ItemClassId,
            PurchaseUOMId: row.PurchaseUOMId,
            StockUOMId: row.StockUOMId,
            ConversionFactor: row.ConversionFactor.trim(),
            CurrencyId: row.CurrencyId,
            TaxPer: row.TaxPer,
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
            IsBatchRequired: JSON.stringify(row.IsBatchRequired),
            MinQty: row.MinQty,
            MaxQty: row.MaxQty,
            ReOrder: row.ReOrder,
            IsNursingFlag: JSON.stringify(row.IsNursingFlag),
            HSNcode: row.HSNcode.trim(),
            CGST: row.CGST,
            SGST: row.SGST,
            IGST: row.IGST,
            IsNarcotic: JSON.stringify(row.IsNarcotic),
            ManufId: row.ManufId,
            ProdLocation: row.ProdLocation.trim(),
            IsH1Drug: JSON.stringify(row.IsH1Drug),
            IsScheduleH: JSON.stringify(row.IsScheduleH),
            IsHighRisk: JSON.stringify(row.IsHighRisk),
            IsScheduleX: JSON.stringify(row.IsScheduleX),
            IsLASA: JSON.stringify(row.IsLASA),
            IsEmgerency: JSON.stringify(row.IsEmgerency),
            StoreId: row.StoreId,
        };

        this._itemService.populateForm(m_data);

        const dialogRef = this._matDialog.open(ItemFormMasterComponent, {
            maxWidth: "80vw",
            maxHeight: "95vh",
            width: "100%",
            height: "100%",
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getItemMasterList();
        });
    }

    onAdd() {
        const dialogRef = this._matDialog.open(ItemFormMasterComponent, {
            maxWidth: "80vw",
            maxHeight: "95vh",
            width: "100%",
            height: "100%",
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getItemMasterList();
        });
    }
}
export class ItemMaster {
    ItemID: number;
    ItemShortName: string;
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
    IsDeleted: boolean;
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
    /**
     * Constructor
     *
     * @param ItemMaster
     */
    constructor(ItemMaster) {
        {
            this.ItemID = ItemMaster.ItemID || "";
            this.ItemShortName = ItemMaster.ItemShortName || "";
            this.ItemName = ItemMaster.ItemName || "";
            this.ItemTypeID = ItemMaster.ItemTypeID || "";
            this.ItemCategoryId = ItemMaster.ItemCategoryId || "";
            this.ItemGenericNameId = ItemMaster.ItemGenericNameId || "";
            this.ItemClassId = ItemMaster.ItemClassId || "";
            this.PurchaseUOMId = ItemMaster.PurchaseUOMId || "";
            this.ConversionFactor = ItemMaster.ConversionFactor || "";
            this.CurrencyId = ItemMaster.CurrencyId || "";
            this.TaxPer = ItemMaster.TaxPer || "";
            this.IsDeleted = ItemMaster.IsDeleted || "false";
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
        }
    }
}
//Store master
export class StoreMaster {
    ItemID: number;
    StoreId: number;
    constructor(StoreMaster) {
        {
            this.StoreId = StoreMaster.StoreId || "";
            this.ItemID = StoreMaster.ItemID || "";
        }
    }
}
