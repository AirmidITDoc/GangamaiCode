import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { StoreFormMasterComponent } from "./store-form-master/store-form-master.component";
import { StoreMasterService } from "./store-master.service";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";

@Component({
    selector: "app-store-master",
    templateUrl: "./store-master.component.html",
    styleUrls: ["./store-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class StoreMasterComponent implements OnInit {
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.StoreMaster, permissionType.Add);
       
    myformSearch: FormGroup;
    storeName: any = "";
    type: any = "2"

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionsPharStore') actionsPharStore!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'isPharStore')!.template = this.actionsPharStore;
    }

    allColumns = [
        { heading: "-", key: "isPharStore", sort: true, align: 'left', type: gridColumnTypes.template, width: 60, sticky: true },
        { heading: "Code", key: "storeId", sort: true, align: 'left', emptySign: 'NA', width: 100, sticky: true },
        { heading: "Store ShortName", key: "storeShortName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Store Name", key: "storeName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Indent Prefix", key: "indentPrefix", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Indent No", key: "indentNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Purchase Prefix", key: "purchasePrefix", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Purchase No", key: "purchaseNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "GRN Prefix", key: "grnPrefix", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "GRN No", key: "grnNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "GRNReturn Prefix", key: "grnreturnNoPrefix", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "GRNRet No", key: "grnreturnNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "IssueToDept Prefix", key: "issueToDeptPrefix", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "IssueToDept No", key: "issueToDeptNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "RetFromDept Prefix", key: "returnFromDeptNoPrefix", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "RetFromDept No", key: "returnFromDeptNo", sort: true, align: 'left', emptySign: 'NA', width: 130 },
        { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 100 },
        {
            heading: "Action", key: "action", width: 100, align: "right", type: gridColumnTypes.action, actions: [
                {
                    // action: gridActions.edit, callback: (data: any) => {
                    //     this.onSave(data);
                    // }
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.StoreMaster, permissionType.Edit), callback: (data: any) => {
                            this.onSave(data);
                        }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this._StoreMasterService.deactivateTheStatus(data.storeId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ]

    allFilters = [
        { fieldName: "storeName", fieldValue: "", opType: OperatorComparer.StartsWith },
        // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]

    gridConfig: gridModel = {
        permissionCode: permissionCodes.StoreMaster,
        apiUrl: "StoreMaster/List",
        columnsList: this.allColumns,
        sortField: "storeId",
        sortOrder: 0,
        filters: this.allFilters
    }



    constructor(public _StoreMasterService: StoreMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService,public permissionService: PagePermissionService) { }

    ngOnInit(): void {
        this.myformSearch = this._StoreMasterService.createSearchForm();
    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(StoreFormMasterComponent,
            {
                maxWidth: "95vw",
                maxHeight: "98vh",
                width: '100%',
                height: "100%",
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

}


export class StoreMaster {
    storeId: number;
    storeShortName: string;
    storeName: string;
    indentPrefix: string;
    indentNo: string;
    purchasePrefix: string;
    purchaseNo: string;
    grnPrefix: string;
    grnNo: string;
    grnreturnNoPrefix: string;
    grnreturnNo: string;
    issueToDeptPrefix: string;
    issueToDeptNo: string;
    returnFromDeptNoPrefix: string;
    returnFromDeptNo: string;
    isDeleted: boolean;
    addedBy: number;
    updatedBy: number;
    header: any;
    IsDeletedSearch: number;
    pharSalCountId: any;
    pharSalRecCountId: any;
    pharSalReturnCountId: any;
    printStoreName: any
    hospitalMobileNo: any
    storeAddress: any
    pharAdvId: any
    pharAdvReptId: any
    pharAdvRefId: any
    pharAdvRefReptId: any
    hospitalEmailId: any
    printStoreUnitName: any
    workOrderPrefix: any
    workOrderNo: any
    termsAndCondition: any;
    /**
     * Constructor
     *
     * @param StoreMaster
     */
    constructor(StoreMaster) {
        {
            this.storeId = StoreMaster.storeId || 0;
            this.storeShortName = StoreMaster.storeShortName || "";
            this.storeName = StoreMaster.storeName || "";
            this.indentPrefix = StoreMaster.indentPrefix || "";
            this.indentNo = StoreMaster.indentNo || "";
            this.purchasePrefix = StoreMaster.purchasePrefix || "";
            this.purchaseNo = StoreMaster.purchaseNo || "";
            this.grnPrefix = StoreMaster.grnPrefix || "";
            this.grnNo = StoreMaster.grnNo || "";
            this.grnreturnNoPrefix = StoreMaster.grnreturnNoPrefix || "";
            this.grnreturnNo = StoreMaster.grnreturnNo || "";
            this.issueToDeptPrefix = StoreMaster.issueToDeptPrefix || "";
            this.issueToDeptNo = StoreMaster.issueToDeptNo || "";
            this.returnFromDeptNoPrefix = StoreMaster.returnFromDeptNoPrefix || "";
            this.returnFromDeptNo = StoreMaster.returnFromDeptNo || "";
            this.isDeleted = StoreMaster.isDeleted || "true";
            this.addedBy = StoreMaster.addedBy || 0;
            this.updatedBy = StoreMaster.updatedBy || 0;
            this.header = StoreMaster.header || '';
            this.IsDeletedSearch = StoreMaster.IsDeletedSearch || "";
            this.pharSalCountId = StoreMaster.pharSalCountId || 0;
            this.pharSalRecCountId = StoreMaster.pharSalRecCountId || 0;
            this.pharSalReturnCountId = StoreMaster.pharSalReturnCountId || 0;
            this.hospitalEmailId = StoreMaster.hospitalEmailId || ''
            this.printStoreUnitName = StoreMaster.printStoreUnitName || ''
            this.termsAndCondition = StoreMaster.termsAndCondition || ''
            this.printStoreName = StoreMaster.printStoreName || '';
            this.hospitalMobileNo = StoreMaster.hospitalMobileNo || '';
            this.storeAddress = StoreMaster.storeAddress || '';
            this.pharAdvId = StoreMaster.pharAdvId || 0
            this.pharAdvReptId = StoreMaster.pharAdvReptId || 0
            this.pharAdvRefId = StoreMaster.pharAdvRefId || 0
            this.pharAdvRefReptId = StoreMaster.pharAdvRefReptId || 0
            this.workOrderPrefix = StoreMaster.workOrderPrefix || 0
            this.workOrderNo = StoreMaster.workOrderNo || 0
        }

    }
}