import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { RadiologyTemplateFormComponent } from './radiology-template-form/radiology-template-form.component';
import { RadiologyTemplateMasterService } from './radiology-template-master.service';

import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';


@Component({
    selector: 'app-radiology-template-master',
    templateUrl: './radiology-template-master.component.html',
    styleUrls: ['./radiology-template-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class RadiologyTemplateMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    templateName: any = "";
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.RadiologyTemplateMaster, permissionType.Add);

    allcolumns = [
        { heading: "Template Name", key: "templateName", width: 300, sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Template Description ", key: "templateDesc", width: 500, sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "AddedBy", key: "username", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "UpdatedBy", key: "updatedbyname", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.RadiologyTemplateMaster, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.RadiologyTemplateMaster, permissionType.Delete), callback: (data: any) => {
                        this._TemplateServieService.deactivateTheStatus(data.templateId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ]

    allfilters = [
        { fieldName: "templateName", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        permissionCode: permissionCodes.RadiologyTemplateMaster,
        apiUrl: "RadiologyTemplate/List",
        columnsList: this.allcolumns,
        sortField: "TemplateName",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(
        public _TemplateServieService: RadiologyTemplateMasterService,
        public _matDialog: MatDialog, public permissionService: PagePermissionService,
        public toastr: ToastrService,

    ) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(RadiologyTemplateFormComponent,
            {
                maxHeight: '95vh',
                width: '100%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }
}