import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { RadiologyTemplateFormComponent } from './radiology-template-form/radiology-template-form.component';
import { RadiologyTemplateMasterService } from './radiology-template-master.service';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';


@Component({
    selector: 'app-radiology-template-master',
    templateUrl: './radiology-template-master.component.html',
    styleUrls: ['./radiology-template-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class RadiologyTemplateMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;


    gridConfig: gridModel = {
        apiUrl: "RadiologyTemplate/List",
        columnsList: [
            { heading: "Code", key: "templateId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Template Name", key: "templateName", width: 200, sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Template Desc", key: "templateDesc", width: 200, sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Added By", key: "username", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Updated By", key: "updatedbyname", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._TemplateServieService.deactivateTheStatus(data.templateId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "TemplateName",
        sortOrder: 0,
        filters: [
            { fieldName: "templateName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
    constructor(
        public _TemplateServieService: RadiologyTemplateMasterService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,

    ) { }

    ngOnInit(): void {

    }
    onSave(row: any = null) {
        
        let that = this;
        const dialogRef = this._matDialog.open(RadiologyTemplateFormComponent,
            {
                maxWidth: "85vw",
                height: '75%',
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