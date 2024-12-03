import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { EditorComponent } from './editor/editor.component';
import { RadiologyTemplateFormComponent } from './radiology-template-form/radiology-template-form.component';
import { RadiologyTemplateMasterService } from './radiology-template-master.service';

import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { RadioPatientList } from 'app/main/radiology/radiology-order-list/radiology-order-list.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MAT_TAB_GROUP, MatTabGroup } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import Swal from 'sweetalert2';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
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
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  
  
  gridConfig: gridModel = {
      apiUrl: "RadiologyTemplate/List",
      columnsList: [
          { heading: "Code", key: "templateId",width: 150, sort: true, align: 'left', emptySign: 'NA' },
          { heading: "Template Name", key: "templateName",width: 400, sort: true, align: 'left', emptySign: 'NA' },
          { heading: "Template Desc", key: "templateDesc",width: 400, sort: true, align: 'left', emptySign: 'NA' },
          
          { heading: "IsDeleted", key: "isActive",width: 100, type: gridColumnTypes.status, align: "center" },
          {
            heading: "Action", key: "action",width: 100, align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this.confirmDialogRef = this._matDialog.open(
                            FuseConfirmDialogComponent,
                            {
                                disableClose: false,
                            }
                        );
                        this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                        this.confirmDialogRef.afterClosed().subscribe((result) => {
                            if (result) {
                                let that = this;
                                this._TemplateServieService.deactivateTheStatus(data.templateId).subscribe((response: any) => {
                                    this.toastr.success(response.message);
                                    that.grid.bindGridData();
                                });
                            }
                            this.confirmDialogRef = null;
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ],
    sortField: "templateId",
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
    debugger
    let that = this;
    const dialogRef = this._matDialog.open(RadiologyTemplateFormComponent,
        {
            maxWidth: "85vw",
            height: '95%',
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