import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { ToastrService } from "ngx-toastr"; 
import { SupplierwiseRateDefineService } from "./supplierwise-rate-define.service";
import { NewRateDefineComponent } from "./new-rate-define/new-rate-define.component";
import { AuthenticationService } from "app/core/services/authentication.service";

@Component({
  selector: 'app-supplierwise-rate-define',
  templateUrl: './supplierwise-rate-define.component.html',
  styleUrls: ['./supplierwise-rate-define.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SupplierwiseRateDefineComponent { 
    StoreId:any=0;
    autocompleteSupplier: string = "SupplierMaster"
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent; 
    ///IsAdd: boolean = this.permissionService.getPermission(permissionCodes.UnitOfMeasurement, permissionType.Add);

   
    allcolumns = [
        { heading: "Supplier Name", key: "SupplierName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                { 
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.UnitOfMeasurement, permissionType.Edit), callback: (data: any) => {
                        this.onNewRate(data);
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this._SupplierwiseRateDefineService.deactivateTheStatus(data.defId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ]

    allfilters = [
        { fieldName: "SupplierName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "ItemName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "IsActive", fieldValue: "0", opType: OperatorComparer.StartsWith }
    ]

    gridConfig: gridModel = {
        //permissionCode: permissionCodes.UnitOfMeasurement,
        apiUrl: "ItemWiseSupplierRate/ItemWiseSupplierRateLis",
        columnsList: this.allcolumns,
        sortField: "DefId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(
      public _SupplierwiseRateDefineService: SupplierwiseRateDefineService,
      public _matDialog: MatDialog,
      public toastr: ToastrService, 
       public _loggedAccountService : AuthenticationService,
      public permissionService: PagePermissionService) { }

    ngOnInit(): void { 
        this.StoreId = this._loggedAccountService.currentUserValue.user.storeId
    }

    onNewRate(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewRateDefineComponent,
            {
                maxWidth: "50vw",
                maxHeight: '50%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

}