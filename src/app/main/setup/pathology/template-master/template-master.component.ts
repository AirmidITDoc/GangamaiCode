import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { TemplateFormComponent } from './template-form/template-form.component';
import { TemplateServieService } from './template-servie.service';

import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';


@Component({
    selector: 'app-template-master',
    templateUrl: './template-master.component.html',
    styleUrls: ['./template-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TemplateMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
 templateName: any = "";
     IsAdd: boolean = this.permissionService.getPermission(permissionCodes.TemplateMaster, permissionType.Add);
  
       allcolumns =  [
            { heading: "Template Name", key: "templateName", width: 300, sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Template Desc", key: "templateDesc", width: 500, sort: true, align: 'left', emptySign: 'NA' },
            // { heading: "UserName", key: "username", sort: true, align: 'left', emptySign: 'NA' },
            // { heading: "Updated By", key: "updatedbyname", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                      action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.TemplateMaster, permissionType.Edit), callback: (data: any) => {
                                             this.onSave(data);
                                         }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._TemplateServieService.deactivateTheStatus(data.templateId).subscribe((response: any) => {
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
      
         allfilters =  [
            { fieldName: "templateName", fieldValue: "", opType: OperatorComparer.StartsWith },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
     gridConfig: gridModel = {
          permissionCode: permissionCodes.TemplateMaster,
        apiUrl: "PathologyTemplate/List",
        columnsList: this.allcolumns,
        sortField: "templateId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(
        public _TemplateServieService: TemplateServieService,
        public _matDialog: MatDialog, public permissionService: PagePermissionService,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {

    }
   
    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(TemplateFormComponent,
            {
                maxWidth: "96%",
                width: '95%',
                height: '95%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }
}