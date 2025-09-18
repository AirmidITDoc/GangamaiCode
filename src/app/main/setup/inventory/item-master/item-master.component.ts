import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { ItemFormMasterComponent } from "./item-form-master/item-form-master.component";
import { ItemMasterService } from "./item-master.service";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes, gridActions } from "app/core/models/tableActions";
import { FormGroup } from "@angular/forms";
import { AuthenticationService } from "app/core/services/authentication.service";
import { ItemGenericMasterComponent } from "../item-generic-master/item-generic-master.component";

@Component({
    selector: "app-item-master",
    templateUrl: "./item-master.component.html",
    styleUrls: ["./item-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemMasterComponent implements OnInit {
    hasSelectedContacts: boolean;
    autocompleteModestoreName: string = "StoreName";
    autocompleteModeItemCategory: string = "ItemCategory";
    autocompleteModeItemGenericName: string = "ItemGeneric";
    autocompleteModeDrugType: string = "ItemDrugType";
    autocompleteModeMenu: string = "ItemManufacture";
    myformSearch: FormGroup;
    itemName: any = "";
    catId = "0"
    gerericId = "0"
    drugtypeId = "0"
    ManufId = "0"
    location=''
        Tostore = this.accountService.currentUserValue.user.storeId


    autocompletestore: string = "Store";
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    }

    allColumns = [
        { heading: "Code", key: "itemID", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Hsncode", key: "hsNcode", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "TypeName", key: "itemTypeName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Category Name", key: "itemCategoryName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Generic Name", key: "itemGenericName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Item Class", key: "itemClassName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Puchase UOM", key: "puchaseUOM", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Stock UOM", key: "stockUOM", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Conversion Factor", key: "conversionFactor", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Currency", key: "currencyName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Min Qty", key: "minQty", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Max Qty", key: "maxQty", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "ReOrder", key: "reOrder", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "CGST", key: "cgst", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "SGST", key: "sgst", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IGST", key: "igst", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Manufacture Name", key: "manufId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Location", key: "prodLocation", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "User Name", key: "addedby", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsNursingFlaf", key: "isNursingFlag", sort: true, align: 'left', type: gridColumnTypes.status },
        { heading: "IsBatchRequired", key: "isBatchRequired", sort: true, align: 'left', type: gridColumnTypes.status },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]

    allFilters = [
        { fieldName: "ItemName", fieldValue: "%", opType: OperatorComparer.Equals },
        { fieldName: "StoreID", fieldValue:  String(this.Tostore), opType: OperatorComparer.Equals },
        { fieldName: "CatId", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "GenericId", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "ProdLocation", fieldValue: "%", opType: OperatorComparer.Equals },
        { fieldName: "ManufId", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "DrugTypeId", fieldValue: "0", opType: OperatorComparer.Equals }


    ]

    gridConfig: gridModel = {
        apiUrl: "ItemMaster/ItemMasterList",
        columnsList: this.allColumns,
        sortField: "ItemID",
        sortOrder: 0,
        filters: this.allFilters
    }


    constructor(
        public _itemService: ItemMasterService, private accountService: AuthenticationService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {
        this.myformSearch = this._itemService.createSearchForm();
    }


    ListView1(value) {
        console.log(value)
        if (value.value !== 0)
            this.Tostore = value.value
        else
            this.Tostore = "0"
        this.onChangeFirst();
    }

    Clearfilter(event) {

        console.log(event)
        if (event == 'ItemNameSearch')
            this.myformSearch.get('ItemNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {

        this.itemName = this.myformSearch.get('ItemNameSearch').value + "%"
        this.catId = this.myformSearch.get('CatId').value || "0"
        this.gerericId = this.myformSearch.get('GenericId').value || "0"
        this.drugtypeId = this.myformSearch.get('DrugTypeId').value || "0"
        this.ManufId = this.myformSearch.get('ManufId').value || "0"
         this.location = this.myformSearch.get('ProdLocation').value + "%"

        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        this.gridConfig = {
            apiUrl: "ItemMaster/ItemMasterList",
            columnsList: this.allColumns,
            sortField: "ItemID",
            sortOrder: 0,
            filters: [
                { fieldName: "ItemName", fieldValue: this.itemName, opType: OperatorComparer.Equals },
                { fieldName: "StoreID", fieldValue: String(this.Tostore), opType: OperatorComparer.Equals },
                { fieldName: "CatId", fieldValue: this.catId, opType: OperatorComparer.Equals },
                { fieldName: "GenericId", fieldValue: this.gerericId, opType: OperatorComparer.Equals },
                { fieldName: "ProdLocation", fieldValue:   this.location, opType: OperatorComparer.Equals },
                { fieldName: "ManufId", fieldValue: this.ManufId, opType: OperatorComparer.Equals },
                { fieldName: "DrugTypeId", fieldValue: this.drugtypeId, opType: OperatorComparer.Equals }

            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(ItemFormMasterComponent,
            {
                maxWidth: "95vw",
                width: '100%',
                height: "98vh",
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();

        });
    }


    delitem(obj) {
        this._itemService.deactivateTheStatus(obj.itemId).subscribe((response: any) => {
            // this.toastr.success(response.message);
            this.grid.bindGridData();
        });
    }
}


export class ItemMaster {
    ItemID: number;
    itemID: number;
    itemId: number;
    itemShortName: string;
    itemName: string;
    itemTypeID: number;
    itemTypeId: number;
    itemCategoryId: number;
    itemCategaryId: number;
    itemGenericNameId: number;
    itemClassId: number;
    purchaseUomid: number;
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
    hsncode: String;
    cgst: number;
    sgst: number;
    igst: number;
    IsNarcotic: boolean;
    ManufId: number;
    manufId: any;
    prodLocation: string;
    isH1Drug: boolean;
    isScheduleH: boolean;
    isHighRisk: boolean;
    isScheduleX: boolean;
    isLASA: boolean;
    isEmgerency: boolean;
    AddedByName: string;
    IsDeletedSearch: number;
    maxDisc: any;
    storagelocation: any;
    companyId: any;
    drugType: any;
    drugTypeName: any;
    itemCompnayId: any;
    position: any;
    mAssignItemToStores: any[];
    isActive: any;

    stockUomid: any;


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
            this.itemTypeID = ItemMaster.itemTypeID || 0;
            this.itemTypeId = ItemMaster.itemTypeId || 0;


            this.itemCategoryId = ItemMaster.itemCategoryId || 0;
            this.itemCategaryId = ItemMaster.itemCategaryId || 0;


            this.itemGenericNameId = ItemMaster.itemGenericNameId || 0;
            this.itemClassId = ItemMaster.itemClassId || 0;
            this.purchaseUomid = ItemMaster.purchaseUomid || 0;
            this.stockUOM = ItemMaster.stockUOM || 0;
            this.conversionFactor = ItemMaster.conversionFactor || "";
            this.currencyId = ItemMaster.currencyId || "";
            this.taxPer = ItemMaster.taxPer || "";
            this.Isdeleted = ItemMaster.Isdeleted || true;
            this.Addedby = ItemMaster.Addedby || "";
            this.UpdatedBy = ItemMaster.UpdatedBy || "";
            this.isBatchRequired = ItemMaster.isBatchRequired || false;
            this.minQty = ItemMaster.minQty || "";
            this.maxQty = ItemMaster.maxQty || "";
            this.reOrder = ItemMaster.reOrder || "";
            this.isNursingFlag = ItemMaster.isNursingFlag || false;
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
            this.maxDisc = ItemMaster.maxDisc || 0
            this.storagelocation = ItemMaster.storagelocation || ""
            this.companyId = ItemMaster.ompanyId || ""
            this.drugType = ItemMaster.drugType || ""
            this.drugTypeName = ItemMaster.DrugTypeName || ""
            this.itemCompnayId = ItemMaster.itemCompnayId || 0
            this.isActive = ItemMaster.isActiuve || true;
            this.mAssignItemToStores = ItemMaster.mAssignItemToStores || [];

            this.stockUomid = ItemMaster.stockUomid || 0
        }
    }
}

export class MAssignItemToStore {
    storeId: any;
    itemId: any;

    constructor(MAssignItemToStore) {
        {
            this.storeId = MAssignItemToStore.storeId || 0;
            this.itemId = MAssignItemToStore.itemId || 0;
        }
    }
}