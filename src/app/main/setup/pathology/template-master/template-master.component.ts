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


@Component({
  selector: 'app-template-master',
  templateUrl: './template-master.component.html',
  styleUrls: ['./template-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class TemplateMasterComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  gridConfig: gridModel = {
      apiUrl: "PathologyTemplate/List",
      columnsList: [
          { heading: "Code", key: "templateId", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "Template Name", key: "templateName", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "Template Desc", key: "templateDesc", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
          {
              heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                  {
                      action: gridActions.edit, callback: (data: any) => {
                          this.onAdd(data) // EDIT Records
                      }
                  }, {
                      action: gridActions.delete, callback: (data: any) => {
                          this.onDeactive(data.templateId); // DELETE Records
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
      row:25
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
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  

onDeactive(templateId) {
  this.confirmDialogRef = this._matDialog.open(
      FuseConfirmDialogComponent,
      {
          disableClose: false,
      }
  );
  this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
  this.confirmDialogRef.afterClosed().subscribe((result) => {
      if (result) {
          this._TemplateServieService.deactivateTheStatus(templateId).subscribe((response: any) => {
              if (response.StatusCode == 200) {
                  this.toastr.success(response.Message);
                  // this.getGenderMasterList();
                  // How to refresh Grid.
              }
          });
      }
      this.confirmDialogRef = null;
  });
}

onAdd(row:any = null) {
  const dialogRef = this._matDialog.open(TemplateFormComponent,
  {
      maxWidth: "45vw",
      height: '35%',
      width: '70%',
      data: row
  });
  dialogRef.afterClosed().subscribe(result => {
      if(result){
          // this.getGenderMasterList();
          // How to refresh Grid.
      }
      console.log('The dialog was closed - Action', result);
  });
}
  onEdit(row) {
    console.log(row);

    console.log(row);
    this._TemplateServieService.populateForm(row);
    const dialogRef = this._matDialog.open(TemplateFormComponent, {
      maxWidth: "80%",
      width: "80%",
      height: "85%",
      data: {
        registerObj: row,
      }
    });
    dialogRef.afterClosed().subscribe((data) => {
    
    });
  }


  
  onSearch() {
   
  }
  onClear() {
    this._TemplateServieService.myform.reset({ IsDeleted: "false" });
    // this._TemplateServieService.initializeFormGroup();
  }
  onSearchClear() {
    this._TemplateServieService.myformSearch.reset({
      TemplateNameSearch: "",
      IsDeletedSearch: "2",
    });
   
  }


  

}


export class TemplateMaster {
  templateId: number;
  templateName: any;
  templateDesc: any;
  isActive:any;
  AddedBy:any;
  UpdatedBy:any;
  TemplateDescInHTML:any;
  /**
   * Constructor
   *
   * @param TemplateMaster
   */
  constructor(TemplateMaster) {
      {
          this.templateId = TemplateMaster.templateId || 0;
          this.templateName = TemplateMaster.templateName || "";
          this.templateDesc = TemplateMaster.templateDesc || "";
          this.isActive = TemplateMaster.isActive || 0;
          this.AddedBy = TemplateMaster.AddedBy || 0;
          this.UpdatedBy = TemplateMaster.UpdatedBy || 0;
          this.TemplateDescInHTML = TemplateMaster.TemplateDescInHTML || '';
      }
  }
}
