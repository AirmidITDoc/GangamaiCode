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
      @ViewChild('grid') grid: AirmidTableComponent;
    ///IsAdd: boolean = this.permissionService.getPermission(permissionCodes.UnitOfMeasurement, permissionType.Add);

   
    allcolumns = [
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Supplier Name", key: "supplierName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
       // { heading: "Supplie Rate", key: "supplierRate", type: gridColumnTypes.status, align: "center" },
        { heading: "Supplie Rate", key: "supplierRate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },
        { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA' , width: 250},
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
        }  
    ]
    // {
    //     "defId": 10,
    //     "itemId": 11,
    //     "supplierId": 1,
    //     "supplierRate": 211,
    //     "itemName": "",
    //     "supplierName": "Ashutosh",
    //     "userName": ""
    //   },

    gridConfig: gridModel = { 
        apiUrl: "ItemWiseSupplierRate/ItemWiseSupplierRateList",
        columnsList: this.allcolumns,
        sortField: "DefId",
        sortOrder: 0,
        filters:  [
        { fieldName: "SupplierName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "ItemName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "IsActive", fieldValue: "0", opType: OperatorComparer.Equals }
    ]
    } 
    constructor(
      public _SupplierwiseRateDefineService: SupplierwiseRateDefineService,
      public _matDialog: MatDialog,
      public toastr: ToastrService, 
      public _loggedAccountService : AuthenticationService,
      public permissionService: PagePermissionService) 
      { }

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
    itemId:any=''
    SupplierId:any=''
getSelectedObjextitem(obj){
    console.log(obj) 
        if (obj.value !== 0)
        this.itemId = obj.itemId || 0; 
        else
        this.itemId = 0;  

}
getSelectedObjextSupplier(obj){
    debugger
      console.log(obj)
        if (obj.value !== 0)
        this.SupplierId = obj.value || 0; 
        else
        this.SupplierId = 0;  

   this.getbindData();   
}
getbindData(){
   // this.Status =this.
      this.gridConfig = { 
        apiUrl: "ItemWiseSupplierRate/ItemWiseSupplierRateList",
        columnsList: this.allcolumns,
        sortField: "DefId",
        sortOrder: 0,
        filters:  [
        { fieldName: "SupplierId", fieldValue: String(this.SupplierId), opType: OperatorComparer.StartsWith },
        { fieldName: "ItemId", fieldValue: String(this.itemId), opType: OperatorComparer.StartsWith },
        { fieldName: "IsActive", fieldValue: "0", opType: OperatorComparer.Equals }
    ]
    } 
     setTimeout(() => {
            this.grid.gridConfig = this.gridConfig;
            this.grid.bindGridData();
        }, 500);
}
}