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


@Component({
  selector: 'app-radiology-template-master',
  templateUrl: './radiology-template-master.component.html',
  styleUrls: ['./radiology-template-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RadiologyTemplateMasterComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  gridConfig: gridModel = {
      apiUrl: "RadiologyTemplate/List",
      columnsList: [
          { heading: "Code", key: "templateId", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "Template Name", key: "templateName", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "Template Desc", key: "templateDesc", sort: true, align: 'left', emptySign: 'NA' },
          
          { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
          {
              heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                  {
                      action: gridActions.edit, callback: (data: any) => {
                          this.onSave(data) // EDIT Records
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
  constructor(public _radiologytemplateService: RadiologyTemplateMasterService,
    private accountService: AuthenticationService,
    public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    private _ActRoute: Router,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
  ) { }
  registerObj: any;
  ngOnInit(): void {

  }

  onSearch() {
  
  }
  onSearchClear() {
    this._radiologytemplateService.myformSearch.reset({
      TemplateNameSearch: "",
      IsDeletedSearch: "2",
    });
  
  }

  

  onEdit(row) {
    console.log(row)
    this._radiologytemplateService.populateForm(row);
    const dialogRef = this._matDialog.open(RadiologyTemplateFormComponent,
      {
        maxWidth: "80%",
        width: "80%",
        height: "95%",
        data: {
          Obj: row,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    
    });
  }

  onSave(row:any = null) {
    const dialogRef = this._matDialog.open(RadiologyTemplateFormComponent,
    {
        maxWidth: "95vw",
        height: '95%',
        width: '90%',
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
            this._radiologytemplateService.deactivateTheStatus(templateId).subscribe((response: any) => {
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
  onBlur(e: any) {
    //this.vTemplateDesc = e.target.innerHTML;
  }

}


export class RadiologytemplateMaster {

  templateId: Date;
  templateName: Date;
  templateDesc: String;
  isActive:any;
  RadDate: Date;
  RadTime: Date;
  RegNo: any;
  PatientName: String;
  PatientType: number;
  TestName: String;
  ConsultantDoctor: any;
  CategoryName: String;
  AgeYear: number;
  GenderName: String;
  PBillNo: number;




  /**
   * Constructor
   *
   * @param RadiologytemplateMaster
   */
  constructor(RadiologytemplateMaster) {
    {

      this.templateId = RadiologytemplateMaster.templateId || '';
      this.templateName = RadiologytemplateMaster.templateName;
      this.templateDesc = RadiologytemplateMaster.templateDesc;
      this.isActive = RadiologytemplateMaster.isActive;

      this.RadDate = RadiologytemplateMaster.RadDate || '';
      this.RadTime = RadiologytemplateMaster.RadTime;
      this.RegNo = RadiologytemplateMaster.RegNo;
      this.PatientName = RadiologytemplateMaster.PatientName;
      this.PBillNo = RadiologytemplateMaster.PBillNo;
      this.PatientType = RadiologytemplateMaster.PatientType || '0';
      this.ConsultantDoctor = RadiologytemplateMaster.ConsultantDoctor || '';
      this.TestName = RadiologytemplateMaster.TestName || '0';
      this.CategoryName = RadiologytemplateMaster.CategoryName || '';
      this.AgeYear = RadiologytemplateMaster.AgeYear;
      this.GenderName = RadiologytemplateMaster.GenderName;
    }
  }
}
