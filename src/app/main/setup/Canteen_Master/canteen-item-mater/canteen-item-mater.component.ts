
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AuthenticationService } from "app/core/services/authentication.service";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { ToastrService } from "ngx-toastr";
import { ItemmasterService } from "./itemmaster.service";
import { NewItemComponent } from "./new-item/new-item.component";


@Component({
  selector: 'app-canteen-item-mater',
  templateUrl: './canteen-item-mater.component.html',
  styleUrls: ['./canteen-item-mater.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CanteenItemMaterComponent {
//  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.ItemMaster, permissionType.Add);

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
    @ViewChild('actionsTemplateactive') actionsTemplateactive!: TemplateRef<any>;
    @ViewChild('actionsTemplatebatch') actionsTemplatebatch!: TemplateRef<any>;
    // @ViewChild('actionsTemplateisH1Drug') actionsTemplateisH1Drug!: TemplateRef<any>;

    // @ViewChild('actionsTemplateisEmgerency') actionsTemplateisEmgerency!: TemplateRef<any>;


    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'Isdeleted')!.template = this.actionsTemplateactive;
        // this.gridConfig.columnsList.find(col => col.key === 'isBatchRequired')!.template = this.actionsTemplatebatch;
        // this.gridConfig.columnsList.find(col => col.key === 'isH1Drug')!.template = this.actionsTemplateisH1Drug;
        // this.gridConfig.columnsList.find(col => col.key === 'isNarcotic')!.template = this.actionsTemplatenarcotic;

    }

    allColumns = [
        { heading: "", key: "Isdeleted", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        // { heading: "", key: "isBatchRequired", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
         { heading: "Name", key: "itemShortName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
       
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "EPrice", key: "empPrice", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "Conv Factor", key: "conversionFactor", sort: true, align: 'left', emptySign: 'NA', width: 100 },
         { heading: "CGST", key: "cgst", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "SGST", key: "sgst", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "IGST", key: "igst", sort: true, align: 'left', emptySign: 'NA', width: 80 },
           { heading: "Location", key: "prodLocation", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA' },

        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]

 ItemName: any = "2";
    allFilters = [
        { fieldName: "Itemid", fieldValue: this.ItemName, opType: OperatorComparer.StartsWith },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]

    gridConfig: gridModel = {
        // permissionCode: permissionCodes.ItemMaster,
        apiUrl: "CanteenMatster/List",
        columnsList: this.allColumns,
        sortField: "Itemid",
        sortOrder: 0,
        filters: this.allFilters
    }


    constructor(
        public _itemService: ItemmasterService, private accountService: AuthenticationService,
        public _matDialog: MatDialog,
        public toastr: ToastrService, public permissionService: PagePermissionService
    ) { }

    ngOnInit(): void {
        this.myformSearch = this._itemService.createSearchForm();
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
        // this.catId = this.myformSearch.get('CatId').value || "0"
        // this.gerericId = this.myformSearch.get('GenericId').value || "0"
        // this.drugtypeId = this.myformSearch.get('DrugTypeId').value || "0"
        // this.ManufId = this.myformSearch.get('ManufId').value || "0"
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
        const dialogRef = this._matDialog.open(NewItemComponent,
            {
               maxWidth: "50vw",
                maxHeight: '50%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();

        });
    }


    delitem(obj) {
    
        this._itemService.deactivateTheStatus(obj.itemId).subscribe((response: any) => {
            this.grid.bindGridData();
        });
    }
}


// export class ItemMaster {
//     itemID: any;
//               itemShortName:any;
//               itemName:any;
//               itemCategaryId:any;
//               purchaseUOMId:any;
//               conversionFactor:any;
//               isdeleted:any;
//               isBatchRequired:any;
//               cGST:any;
//               sGST:any;
//               iGST:any;
//               prodLocation:any;
//               price:any;
//               empPrice:any;
// /**
//      * Constructor
//      *
//      * @param ItemMaster
//      */
//     constructor(ItemMaster) {
//         {
//             this.itemID = ItemMaster.itemID || 0;
//             this.itemShortName = ItemMaster.itemShortName || '';
//             this.itemName = ItemMaster.itemName || '';

//             this.itemCategaryId = ItemMaster.itemCategaryId || 0;
//             this.purchaseUOMId = ItemMaster.purchaseUOMId || 0;
//             this.conversionFactor = ItemMaster.conversionFactor || 0;
//             this.isdeleted = ItemMaster.isdeleted || false;

//             this.isBatchRequired = ItemMaster.isBatchRequired || false;
//             this.cGST = ItemMaster.cGST || 0;

//             this.sGST = ItemMaster.sGST || 0;
//             this.iGST = ItemMaster.iGST || 0;
//             this.prodLocation = ItemMaster.prodLocation || '';
//             this.price = ItemMaster.price || 0;
//             this.empPrice = ItemMaster.empPrice || 0
           
//         }
//     }
// }