import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TemplateServieService } from './template-servie.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatAccordion } from '@angular/material/expansion';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { TemplateFormComponent } from './template-form/template-form.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';


@Component({
  selector: 'app-template-master',
  templateUrl: './template-master.component.html',
  styleUrls: ['./template-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class TemplateMasterComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    

    gridConfig: gridModel = {
    apiUrl: "PathologyTemplate/List",
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
    public _TemplateServieService: TemplateServieService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private reportDownloadService: ExcelDownloadService,
    private _fuseSidebarService: FuseSidebarService,
  ) { }

  ngOnInit(): void {
   
  }
  onSave(row: any = null) {
    debugger
    let that = this;
    const dialogRef = this._matDialog.open(TemplateFormComponent,
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