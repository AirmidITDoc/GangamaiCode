import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ItemFormMasterComponent } from "./item-form-master/item-form-master.component";
import { ItemMasterService } from "./item-master.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatAccordion } from "@angular/material/expansion";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import { AuthenticationService } from "app/core/services/authentication.service";
import { ToastrService } from "ngx-toastr";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes, gridActions } from "app/core/models/tableActions";
import { StockAdjustmentService } from "app/main/inventory/stock-adjustment/stock-adjustment.service";

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
        { heading: "Code", key: "ItemID", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "ItemName", key: "ItemName", sort: true, align: 'left', emptySign: 'NA',width :90 },
        { heading: "ItemTypeName", key: "ItemTypeName", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "ItemCategoryName", key: "ItemCategoryName", sort: true, align: 'left', emptySign: 'NA',width :80 },
        { heading: "ItemGenericName", key: "ItemGenericName", sort: true, align: 'left', emptySign: 'NA',width :80 },
        { heading: "ItemClassName", key: "ItemClassName", sort: true, align: 'left', emptySign: 'NA',width :80 },
        { heading: "UnitofMeasurementName", key: "UnitofMeasurementName", sort: true, align: 'left', emptySign: 'NA',width :90 },
        { heading: "StockUOMId", key: "StockUOMId", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "ConversionFactor", key: "ConversionFactor", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "CurrencyName", key: "CurrencyName", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "TaxPer", key: "TaxPer", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "MinQty", key: "MinQty", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "MaxQty", key: "MaxQty", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "ReOrder", key: "ReOrder", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "HSNcode", key: "HSNcode", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "CGST", key: "CGST", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "SGST", key: "SGST", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "IGST", key: "IGST", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "ManufName", key: "ManufName", sort: true, align: 'left', emptySign: 'NA',width :80 },
        { heading: "ProdLocation", key: "ProdLocation", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "AddedByName", key: "AddedByName", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "IsNursingFlag", key: "IsNursingFlag", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "IsNursingFlag", key: "IsNursingFlag", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
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
            { fieldName: "StoreId", fieldValue: "2", opType: OperatorComparer.Equals },
            { fieldName: "ItemId", fieldValue: "14645", opType: OperatorComparer.Equals },
            // { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            // { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
   
    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(ItemFormMasterComponent,
            {
                maxWidth: "95%",
                height: '95%',
                width: '70%',
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

    isLoading = true;
    msg: any;
    step = 0;

    setStep(index: number) {
        this.step = index;
    }
    SearchName: string;
    sIsLoading: string = ''; 
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('paginator', { static: true }) public paginator: MatPaginator;

    DSItemMasterList = new MatTableDataSource<ItemMaster>();

    constructor(
        public _itemService: ItemMasterService,
        private _loggedService: AuthenticationService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {
        // this.getItemMasterList();
    }

    onSearchClear() {
        this._itemService.myformSearch.reset({
            ItemNameSearch: "",
            IsDeletedSearch: "2",
        });
        // this.getItemMasterList();
    }

    onClear() {
        this._itemService.myform.reset({ IsDeleted: "false" });
        this._itemService.initializeFormGroup();
    }

    onSearch() {
        // this.getItemMasterList();
    }
    chargeslist:any=[];
    // getItemMasterList() {
    //     this.sIsLoading = '';
    //     var m_data = {
    //         ItemName:this._itemService.myformSearch.get("ItemNameSearch").value + "%" || "%",
    //         StoreID: this._loggedService.currentUserValue.storeId
    //     };
    //     console.log(m_data)
    //     this._itemService.getItemMasterList(m_data).subscribe((data) => {
    //             this.DSItemMasterList.data = data as ItemMaster[];  
    //             this.DSItemMasterList.sort = this.sort;
    //             this.DSItemMasterList.paginator = this.paginator; 
    //             console.log(this.DSItemMasterList.data)
    //         },
    //         (error) => (this.isLoading = false)
    //     );
    // }

    onEdit(row) {
        var m_data = {
            ItemID: row.ItemID,
            //  ItemShortName: row.ItemShortName.trim(),
            ItemName: row.ItemName,
            ItemTypeID: row.ItemTypeID,
            ItemCategoryId: row.ItemCategoryId,
            ItemGenericNameId: row.ItemGenericNameId,
            ItemClassId: row.ItemClassId,
            PurchaseUOMId: row.PurchaseUOMId,
            StockUOMId: row.StockUOMId,
            ConversionFactor: row.ConversionFactor,
            CurrencyId: row.CurrencyId,
            TaxPer: row.TaxPer,
            IsDeleted: JSON.stringify(row.Isdeleted),
            UpdatedBy: row.UpdatedBy,
            IsBatchRequired: JSON.stringify(row.IsBatchRequired),
            MinQty: row.MinQty,
            MaxQty: row.MaxQty,
            ReOrder: row.ReOrder,
            IsNursingFlag: JSON.stringify(row.IsNursingFlag),
            HSNcode: row.HSNcode,
            CGST: row.CGST,
            SGST: row.SGST,
            IGST: row.IGST,
            IsNarcotic: JSON.stringify(row.IsNarcotic),
            ManufId: row.ManufId,
            ProdLocation: row.ProdLocation,
            IsH1Drug: JSON.stringify(row.IsH1Drug),
            IsScheduleH: JSON.stringify(row.IsScheduleH),
            IsHighRisk: JSON.stringify(row.IsHighRisk),
            IsScheduleX: JSON.stringify(row.IsScheduleX),
            IsLASA: JSON.stringify(row.IsLASA),
            IsEmgerency: JSON.stringify(row.IsEmgerency),
            //StoreId: row.StoreId,
            
        };

        this._itemService.populateForm(m_data);

        const dialogRef = this._matDialog.open(ItemFormMasterComponent, {
            maxWidth: "95vw",
            maxHeight: "80vh",
            width: "100%",
            height: "100%",
            data : {
                registerObj : row,
              }
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            // this.getItemMasterList();
        });
    }
    // confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    onDeactive(ItemID) {
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage =
            "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            if (result) {
                let Query =
                    "Update M_ItemMaster set Isdeleted=0 where ItemID=" +
                    ItemID;
                console.log(Query);
                this._itemService
                    .deactivateTheStatus(Query)
                    .subscribe((data) => (this.msg = data));
                // this.getItemMasterList();
            }
            this.confirmDialogRef = null;
        });
    }

    onAdd() {
        const dialogRef = this._matDialog.open(ItemFormMasterComponent, {
            maxWidth: "95vw",
            maxHeight: "80vh",
            width: "100%",
            height: "100%",
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            // this.getItemMasterList();
        });
    }
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
        }
    }
}
//Store master
// export class StoreMaster {
//     ItemID: number;
//     StoreId: number;
//     constructor(StoreMaster) {
//         {
//             this.StoreId = StoreMaster.StoreId || "";
//             this.ItemID = StoreMaster.ItemID || "";
//         }
//     }
// }
