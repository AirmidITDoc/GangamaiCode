import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { ManufactureMasterService } from "./manufacture-master.service";
import { NewManufactureComponent } from "./new-manufacture/new-manufacture.component";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";

@Component({
    selector: "app-manufacture-master",
    templateUrl: "./manufacture-master.component.html",
    styleUrls: ["./manufacture-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ManufactureMasterComponent implements OnInit {
 IsAdd: boolean = this.permissionService.getPermission(permissionCodes.ItemManufactureMaster, permissionType.Add);
    
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    manufName: any = "";
        allcolumns = [
           { heading: "ManuFatcure Name", key: "manufName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Manufacture ShortName", key: "manufShortName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        // action: gridActions.edit, callback: (data: any) => {
                        //     this.onSave(data);
                        // }
                         action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.ItemManufactureMaster, permissionType.Edit), callback: (data: any) => {
                                                    this.onSave(data);
                                                }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._ManufactureMasterService.deactivateTheStatus(data.manufId).subscribe((response: any) => {
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
       
      allfilters = [
            { fieldName: "manufName", fieldValue: "", opType: OperatorComparer.StartsWith },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
     gridConfig: gridModel = {
            permissionCode: permissionCodes.ItemManufactureMaster,
        apiUrl: "ManufactureMaster/List",
        columnsList: this.allcolumns,
        sortField: "ManufName",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(public _ManufactureMasterService: ManufactureMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService, public permissionService: PagePermissionService) { }
        
    ngOnInit(): void { }
 
    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(NewManufactureComponent,
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

}