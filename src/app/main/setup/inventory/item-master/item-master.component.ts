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
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";

@Component({
    selector: "app-item-master",
    templateUrl: "./item-master.component.html",
    styleUrls: ["./item-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemMasterComponent implements OnInit {
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.ItemMaster, permissionType.Add);
       
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
    location = ''
    Tostore = this.accountService.currentUserValue.user.storeId


    autocompletestore: string = "Store";
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplatehigh') actionsTemplatehigh!: TemplateRef<any>;
    @ViewChild('actionsTemplatenarcotic') actionsTemplatenarcotic!: TemplateRef<any>;
    @ViewChild('actionsTemplateisH1Drug') actionsTemplateisH1Drug!: TemplateRef<any>;

    @ViewChild('actionsTemplateisEmgerency') actionsTemplateisEmgerency!: TemplateRef<any>;


    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'isHighRisk')!.template = this.actionsTemplatehigh;
        this.gridConfig.columnsList.find(col => col.key === 'isEmgerency')!.template = this.actionsTemplateisEmgerency;
        this.gridConfig.columnsList.find(col => col.key === 'isH1Drug')!.template = this.actionsTemplateisH1Drug;
        this.gridConfig.columnsList.find(col => col.key === 'isNarcotic')!.template = this.actionsTemplatenarcotic;

    }

    allColumns = [
        // { heading: "Code", key: "itemID", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Drug Type", key: "isHighRisk", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 90 },
        { heading: "", key: "isEmgerency", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        { heading: "", key: "isH1Drug", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        { heading: "", key: "isNarcotic", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        { heading: "Hsncode", key: "hsNcode", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Type Name", key: "itemTypeName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Category Name", key: "itemCategoryName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Generic Name", key: "itemGenericName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Item Class", key: "itemClassName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Puchase UOM", key: "puchaseUOM", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Stock UOM", key: "stockUOM", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Conv Factor", key: "conversionFactor", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Currency", key: "currencyName", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "Min Qty", key: "minQty", sort: true, align: 'left', emptySign: 'NA', width: 80  },
        { heading: "Max Qty", key: "maxQty", sort: true, align: 'left', emptySign: 'NA', width: 80  },
        { heading: "ReOrder", key: "reOrder", sort: true, align: 'left', emptySign: 'NA', width: 80  },
        { heading: "CGST", key: "cgst", sort: true, align: 'left', emptySign: 'NA', width: 80  },
        { heading: "SGST", key: "sgst", sort: true, align: 'left', emptySign: 'NA', width: 80  },
        { heading: "IGST", key: "igst", sort: true, align: 'left', emptySign: 'NA' , width: 80 },
        { heading: "Manufacture Name", key: "manufName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Dose Name", key: "doseName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Location", key: "prodLocation", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA' },

        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]

    allFilters = [
        { fieldName: "ItemName", fieldValue: "%", opType: OperatorComparer.Equals },
        { fieldName: "StoreID", fieldValue: String(this.Tostore), opType: OperatorComparer.Equals },
        { fieldName: "CatId", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "GenericId", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "ProdLocation", fieldValue: "%", opType: OperatorComparer.Equals },
        { fieldName: "ManufId", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "DrugTypeId", fieldValue: "0", opType: OperatorComparer.Equals }


    ]

    gridConfig: gridModel = {
         permissionCode: permissionCodes.ItemMaster,
        apiUrl: "ItemMaster/ItemMasterList",
        columnsList: this.allColumns,
        sortField: "ItemID",
        sortOrder: 0,
        filters: this.allFilters
    }


    constructor(
        public _itemService: ItemMasterService, private accountService: AuthenticationService,
        public _matDialog: MatDialog,
        public toastr: ToastrService, public permissionService: PagePermissionService
    ) { }

    ngOnInit(): void {
        this.myformSearch = this._itemService.createSearchForm();
    }

    StoreView(value) {

        if (value.value !== 0)
            this.Tostore = value.value
        else
            this.Tostore = "0"

        this.onChangeFirst();
    }

    Catlist(value) {

        if (value.value !== 0)
            this.catId = value.value
        else
            this.catId = "0"

        this.onChangeFirst();
    }


    Genericlist(value) {

        if (value.value !== 0)
            this.gerericId = value.value
        else
            this.gerericId = "0"

        this.onChangeFirst();
    }


    druglist(value) {
        console.log(value)
        if (value.value !== 0)
            this.drugtypeId = value.value
        else
            this.drugtypeId = "0"
        this.onChangeFirst();
    }


    Manulist(value) {
        console.log(value)
        if (value.value !== 0)
            this.ManufId = value.value
        else
            this.ManufId = "0"
        this.onChangeFirst();
    }


    Clearfilter(event) {

        console.log(event)
        if (event == 'ItemNameSearch')
            this.myformSearch.get('ItemNameSearch').setValue("")

        if (event == 'ProdLocation')
            this.myformSearch.get('ProdLocation').setValue("")

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
                { fieldName: "ProdLocation", fieldValue: this.location, opType: OperatorComparer.Equals },
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

        const that = this;
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
        debugger
        this._itemService.deactivateTheStatus(obj.itemID).subscribe((response: any) => {
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
    hsncode: string;
    cgst: any;
    sgst: any;
    igst: any;
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
    content:any;
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
            this.cgst = ItemMaster.cgst || 0;
            this.sgst = ItemMaster.sgst || 0;
            this.igst = ItemMaster.igst || 0;
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
            this.content = ItemMaster.content ||''
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