import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
// import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { RadiologyTemplateMasterService } from '../radiology-template-master.service';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { RadioPatientList } from 'app/main/radiology/radiology-order-list/radiology-order-list.component';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-radiology-template-form',
  templateUrl: './radiology-template-form.component.html',
  styleUrls: ['./radiology-template-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RadiologyTemplateFormComponent implements OnInit {
  editorConfig: AngularEditorConfig = {
    // color:true,
    editable: true,
    spellcheck: true,
    height: '35rem',
    minHeight: '35rem',
    translate: 'yes',
    placeholder: 'Enter text here...',
    enableToolbar: true,
    showToolbar: true,

  };
  onBlur(e: any) {
    this.vTemplateDesc = e.target.innerHTML;
  }
  msg: any;
  selectedAdvanceObj: AdvanceDetailObj;
  hasSelectedContacts: boolean;
  screenFromString = 'OP-billing';
  RadiologytemplateMasterList: any;
  isLoading = true;
  reportdata: any = [];
  dataArray = {};
  sIsLoading: string = '';
  vTemplateName: any;
  vTemplateDesc: any;
  registerObj: any;
  vTemplateId: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('reportDiv') reportDiv: ElementRef;


  constructor(
    public _radiologytemplateService: RadiologyTemplateMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<RadiologyTemplateFormComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private advanceDataStored: AdvanceDataStored,
    public toastr: ToastrService,


  ) { }


  ngOnInit(): void {
    if (this.data.Obj) {

      this.registerObj = this.data.Obj;
      this.vTemplateId = this.registerObj.TemplateId;
      this.vTemplateName = this.registerObj.TemplateName;
      this.vTemplateDesc = this.registerObj.TemplateDesc;
      console.log(this.registerObj)
    }

  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  onClose() {
    this._radiologytemplateService.myform.reset();
    this.dialogRef.close();
  }
  onClear() {
    this._radiologytemplateService.myform.reset();
  }
  onSubmit() {
    if (!this._radiologytemplateService.myform.get("TemplateId").value) {
      let insertRadiologyTemp = {};
      insertRadiologyTemp['templateName'] = this._radiologytemplateService.myform.get("TemplateName").value;
      insertRadiologyTemp['templateDesc'] = this._radiologytemplateService.myform.get("TemplateDesc").value;
      insertRadiologyTemp['TemplateDescInHTML'] = this._radiologytemplateService.myform.get("TemplateDesc").value;
      insertRadiologyTemp['Isdeleted'] = this._radiologytemplateService.myform.get("IsDeleted").value ||1;
      insertRadiologyTemp['addedBy'] = this.accountService.currentUserValue.user.id;

      let submitData = {};
      submitData['insertRadiologyTemplateMaster'] = insertRadiologyTemp

      console.log(submitData);
      this._radiologytemplateService.insertRadiologyTemplateMaster(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this._matDialog.closeAll();
          this.onClear();
        } else {
          this.toastr.error('Template Master Master Data not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
        // this.isLoading = '';
      }, error => {
        this.toastr.error('New Template Order Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        }); this._matDialog.closeAll();
      });
    }
    else {
      let updateRadiologyTemp = {};
      updateRadiologyTemp['templateId'] = this.registerObj.TemplateId
      updateRadiologyTemp['templateName'] = this._radiologytemplateService.myform.get("TemplateName").value;
      updateRadiologyTemp['templateDesc'] = this._radiologytemplateService.myform.get("TemplateDesc").value;
      updateRadiologyTemp['TemplateDescInHTML'] = this._radiologytemplateService.myform.get("TemplateDesc").value;
      updateRadiologyTemp['Isdeleted'] = this._radiologytemplateService.myform.get("IsDeleted").value ||1;
      updateRadiologyTemp['updatedBy'] = this.accountService.currentUserValue.user.id;

      let submitData = {};
      submitData['updateRadiologyTemplateMaster'] = updateRadiologyTemp

      console.log(submitData);
      this._radiologytemplateService.updateRadiologyTemplateMaster(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this._matDialog.closeAll();
          this.onClear();
        } else {
          this.toastr.error('Template Master Master Data not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
        // this.isLoading = '';
      }, error => {
        this.toastr.error('New Template Order Data not Updated !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }); this._matDialog.closeAll();
    }
  }


  OnPrintPop(TemplateId) { }


}


export class RadiologytemplateMaster {

  TemplateId: Date;
  TemplateName: Date;
  TemplateDesc: any;
  IsDeleted: String;

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

      this.TemplateId = RadiologytemplateMaster.TemplateId || '';
      this.TemplateName = RadiologytemplateMaster.TemplateName;
      this.TemplateDesc = RadiologytemplateMaster.TemplateDesc;
      this.IsDeleted = RadiologytemplateMaster.IsDeleted;

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
