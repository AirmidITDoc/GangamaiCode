import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HsncodeserviceService } from './hsncodeservice.service';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { NewHsncodeComponent } from './new-hsncode/new-hsncode.component';
import { MatDialog } from '@angular/material/dialog';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';

@Component({
  selector: 'app-hsncode-maser',
  templateUrl: './hsncode-maser.component.html',
  styleUrls: ['./hsncode-maser.component.scss']
})
export class HSNCODEMaserComponent {
 IsAdd: boolean = this.permissionService.getPermission(permissionCodes.ItemCategoryMaster, permissionType.Add);

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    itemCategoryName: any = "";

    allcolumns = [
        { heading: "HSNCODE", key: "hsncodeName", sort: true, align: 'left', emptySign: 'NA' },
         { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                   
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.ItemCategoryMaster, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this._HsncodeserviceService.deactivateTheStatus(data.itemCategoryId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        } 
    ]

    allfilters = [
        { fieldName: "hsncodeName", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        permissionCode: permissionCodes.ItemCategoryMaster,
        apiUrl: "ItemCategoryMaster/List",
        columnsList: this.allcolumns,
        sortField: "hsncodeId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(
        public _HsncodeserviceService: HsncodeserviceService,
        public _matDialog: MatDialog,
        public toastr: ToastrService, public permissionService: PagePermissionService
    ) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewHsncodeComponent,
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
