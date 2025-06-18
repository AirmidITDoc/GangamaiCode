import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { RadiologyTemplateFormComponent } from './radiology-template-form/radiology-template-form.component';
import { RadiologyTemplateMasterService } from './radiology-template-master.service';

import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';


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

       allcolumns =  [
            { heading: "Code", key: "templateId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "TemplateName", key: "templateName", width: 200, sort: true, align: 'left', emptySign: 'NA' },
            { heading: "TemplateDesc", key: "templateDesc", width: 200, sort: true, align: 'left', emptySign: 'NA' },
            { heading: "AddedBy", key: "username", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UpdatedBy", key: "updatedbyname", sort: true, align: 'left', emptySign: 'NA' },
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
        ]
       
       allfilters = [
            { fieldName: "templateName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
     gridConfig: gridModel = {
        apiUrl: "RadiologyTemplate/List",
        columnsList: this.allcolumns,
        sortField: "TemplateName",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(
        public _TemplateServieService: RadiologyTemplateMasterService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,

    ) { }

    ngOnInit(): void { }
     //filters addedby avdhoot vedpathak date-28/05/2025
    // Clearfilter(event) {
    //     console.log(event)
    //     if (event == 'TemplateNameSearch')
    //         this._TemplateServieService.myformSearch.get('TemplateNameSearch').setValue("")

    //     this.onChangeFirst();
    // }

    // onChangeFirst() {
    //     this.templateName = this._TemplateServieService.myformSearch.get('TemplateNameSearch').value
    //     this.getfilterdata();
    // }

    // getfilterdata() {
    //     debugger
    //     let isActive = this._TemplateServieService.myformSearch.get("IsDeletedSearch").value || "";
    //     this.gridConfig = {
    //         apiUrl: "RadiologyTemplate/List",
    //         columnsList: this.allcolumns,
    //         sortField: "TemplateName",
    //         sortOrder: 0,
    //         filters: [
    //             { fieldName: "templateName", fieldValue: this.templateName, opType: OperatorComparer.Contains },
    //             { fieldName: "isActive", fieldValue: isActive, opType: OperatorComparer.Equals }
    //         ]
    //     }
    //     // this.grid.gridConfig = this.gridConfig;
    //     // this.grid.bindGridData();
    //     console.log("GridConfig:", this.gridConfig);

    // if (this.grid) {
    //     this.grid.gridConfig = this.gridConfig;
    //     this.grid.bindGridData();
    // } else {
    //     console.error("Grid is undefined!");
    // }
    // }
    onSave(row: any = null) {
        
        let that = this;
        const dialogRef = this._matDialog.open(RadiologyTemplateFormComponent,
            {
                maxWidth: "90vw",
                maxHeight: '90%',
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