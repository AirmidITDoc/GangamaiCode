import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { StoreFormMasterComponent } from "./store-form-master/store-form-master.component";
import { StoreMasterService } from "./store-master.service";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";

@Component({
    selector: "app-store-master",
    templateUrl: "./store-master.component.html",
    styleUrls: ["./store-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class StoreMasterComponent implements OnInit {
    constructor(public _StoreMasterService: StoreMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService,) { }
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "StoreMaster/List",
        columnsList: [
            { heading: "Code", key: "storeId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Short Name", key: "storeShortName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Store Name", key: "storeName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Indent Prefix", key: "indentPrefix", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Indent No", key: "indentNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Purchase Prefix", key: "purchasePrefix", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Purchase No", key: "purchaseNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "GRN Prefix", key: "grnPrefix", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "GRN No", key: "grnNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "GRN Return Prefix", key: "grnreturnNoPrefix", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "GRN Ret No", key: "grnreturnNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Issue To Dept Prefix", key: "issueToDeptPrefix", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Issue To Dept no", key: "issueToDeptNo", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Return From Dept Prefix", key: "returnFromDeptNoPrefix", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Return From Dept No", key: "returnFromDeptNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "User Name", key: "username", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._StoreMasterService.deactivateTheStatus(data.currencyId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "storeId",
        sortOrder: 0,
        filters: [
            { fieldName: "storeName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(StoreFormMasterComponent,
            {
                maxWidth: "90vw",
                maxHeight: '95vh',
                width: '90%',
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
    header:any;
    IsDeletedSearch: number;
    pharSalCountId:any;
    pharSalRecCountId:any;
    pharSalReturnCountId:any;
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
            this.returnFromDeptNoPrefix =StoreMaster.returnFromDeptNoPrefix || "";
            this.returnFromDeptNo = StoreMaster.returnFromDeptNo || "";
            this.isDeleted = StoreMaster.isDeleted || "true";
            this.addedBy = StoreMaster.addedBy || 0;
            this.updatedBy = StoreMaster.updatedBy || 0;
           this.header=StoreMaster.header || '';
            this.IsDeletedSearch = StoreMaster.IsDeletedSearch || "";
            this.pharSalCountId = StoreMaster.pharSalCountId || 0;
            this.pharSalRecCountId=StoreMaster.pharSalRecCountId || 0;
             this.pharSalReturnCountId = StoreMaster.pharSalReturnCountId || 0;
        }
    }
}