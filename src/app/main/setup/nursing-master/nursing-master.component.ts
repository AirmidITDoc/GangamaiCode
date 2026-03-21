import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { NursingMasterService } from './nursing-master.service';
import { NursingTemplateComponent } from './nursing-template/nursing-template.component';

@Component({
    selector: 'app-nursing-master',
    templateUrl: './nursing-master.component.html',
    styleUrls: ['./nursing-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NursingMasterComponent {
    msg: any;
    consentName: any = "";
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.Nursing, permissionType.Add);
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    allColumns = [
        // { heading: "Code", key: "nursingId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Template Name", key: "nursTempName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Template Desc ", key: "templateDesc", sort: true, align: 'left', emptySign: 'NA', width: 400 },
        { heading: "isActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.Nursing, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.Nursing, permissionType.Delete), callback: (data: any) => {
                        this._NursingService.deactivateTheStatus(data.nursingId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        }
    ]
    allFilters = [
        { fieldName: "nursTempName", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        permissionCode: permissionCodes.Nursing,
        apiUrl: "Nursing/NursingTemplateList",
        columnsList: this.allColumns,
        sortField: "NursingId",
        sortOrder: 0,
        filters: this.allFilters
    }

    constructor(
        public _NursingService: NursingMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog, public permissionService: PagePermissionService
    ) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const dialogRef = this._matDialog.open(NursingTemplateComponent,
            {
                maxWidth: "90vw",
                maxHeight: '85%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.grid.bindGridData();
            }
        });
    }
}
