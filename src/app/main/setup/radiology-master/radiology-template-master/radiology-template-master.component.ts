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

@Component({
  selector: 'app-radiology-template-master',
  templateUrl: './radiology-template-master.component.html',
  styleUrls: ['./radiology-template-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RadiologyTemplateMasterComponent implements OnInit {
  editorConfig: AngularEditorConfig = {
    // color:true,
    editable: true,
    spellcheck: true,
    height: '20rem',
    minHeight: '20rem',
    translate: 'yes',
    placeholder: 'Enter text here...',
    enableToolbar: true,
    showToolbar: true,

  };


  resultsLength=0;
  RadiologytemplateMasterList: any;
  isLoading = true;
  msg: any;
  reportdata: any = [];
  dataArray = {};
  sIsLoading: string = '';
  hasSelectedContacts: boolean;
  menuActions: Array<string> = [];
  screenFromString = 'opd-casepaper';
  vTemplateName: any;
  vTemplateDesc: any;
  vTemplateId: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('reportDiv') reportDiv: ElementRef;
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  dataSource = new MatTableDataSource<RadioPatientList>();
  dataSource1 = new MatTableDataSource<RadioPatientList>();
  tempList = new MatTableDataSource<RadioPatientList>();
  currentStatus=0;
  displayedColumns: string[] = [

    'TemplateId',
    'TemplateName',
    // 'TemplateDesc',
    'IsActive',
    'action'
  ];

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
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

    this.getRadiologytemplateMasterList();
    if (this._ActRoute.url == '/radiology/radiology-order-list') {
      this.menuActions.push('Template Details');
    }
  }

  onSearch() {
    this.getRadiologytemplateMasterList();
  }
  onSearchClear() {
    this._radiologytemplateService.myformSearch.reset({
      TemplateNameSearch: "",
      IsDeletedSearch: "2",
    });
    this.getRadiologytemplateMasterList();
  }

  
  getRadiologytemplateMasterList() {
    this.sIsLoading = 'loading-data';
    var m_data = {
      "TemplateName": this._radiologytemplateService.myformSearch.get("TemplateNameSearch").value + '%' || '%',
      "Start": (this.paginator?.pageIndex ?? 0),
      "Length": (this.paginator?.pageSize ?? 35)
    }
    this._radiologytemplateService.getRadiologytemplateMasterList1(m_data).subscribe(data => {
      this.dataSource.data = data as RadioPatientList[];
      this.dataSource1.data = data as RadioPatientList[];
      this.dataSource.data = data["Table1"] ?? [] as RadioPatientList[];
      console.log(this.dataSource.data)
      this.resultsLength =  this.dataSource.data.length 
      this.sIsLoading = this.dataSource.data.length == 0 ? 'no-data' : '';
    }, error => this.isLoading = false)
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  onClear() {
    this._radiologytemplateService.myform.reset({ IsDeleted: 'false' });
    this._radiologytemplateService.initializeFormGroup();
  }

  onSubmit() {
    if (!this._radiologytemplateService.myform.get("TemplateId").value) {
      let insertRadiologyTemp = {};
      insertRadiologyTemp['templateName'] = this._radiologytemplateService.myform.get("TemplateName").value;
      insertRadiologyTemp['templateDesc'] = this._radiologytemplateService.myform.get("TemplateDesc").value;
      insertRadiologyTemp['addedBy'] = this.accountService.currentUserValue.user.id;

      let submitData = {};
      submitData['insertRadiologyTemplateMaster'] = insertRadiologyTemp

      console.log(submitData);
      this._radiologytemplateService.insertRadiologyTemplateMaster(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });

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
        });
      });
    }
    else {
      let updateRadiologyTemp = {};
      updateRadiologyTemp['templateId'] = this._radiologytemplateService.myform.get("TemplateId").value
      updateRadiologyTemp['templateName'] = this._radiologytemplateService.myform.get("TemplateName").value;
      updateRadiologyTemp['templateDesc'] = this._radiologytemplateService.myform.get("TemplateDesc").value;
      updateRadiologyTemp['updatedBy'] = this.accountService.currentUserValue.user.id;

      let submitData = {};
      submitData['updateRadiologyTemplateMaster'] = updateRadiologyTemp

      console.log(submitData);
      this._radiologytemplateService.updateRadiologyTemplateMaster(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });

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
      });
    }
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
      this.getRadiologytemplateMasterList();
    });
  }

  onAdd() {
    const dialogRef = this._matDialog.open(RadiologyTemplateFormComponent,
      {
        maxWidth: "80%",
        width: "80%",
        height: "95%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getRadiologytemplateMasterList();
    });
  }
  toggle(val: any) {
    if (val == "2") {
        this.currentStatus = 2;
    } else if (val == "1") {
        this.currentStatus = 1;
    }
    else {
        this.currentStatus = 0;

    }
}
  onFilterChange() {
       
    if (this.currentStatus == 1) {
        this.tempList.data = []
        this.dataSource1.data= this.dataSource.data
        for (let item of this.dataSource1.data) {
            if (item.IsActive) this.tempList.data.push(item)
  
        }
  debugger
        this.dataSource.data = [];
        this.dataSource.data = this.tempList.data;
    }
    else if (this.currentStatus == 0) {
        this.dataSource1.data= this.dataSource.data
        this.tempList.data = []
  
        for (let item of this.dataSource1.data) {
            if (!item.IsActive) this.tempList.data.push(item)
  
        }
        this.dataSource.data = [];
        this.dataSource.data = this.tempList.data;
    }
    else {
        this.dataSource.data= this.dataSource1.data
        this.tempList.data = this.dataSource.data;
    }
  
  
  }

  onDeactive(row) {

    Swal.fire({
      title: 'Confirm Status',
      text: 'Are you sure you want to Change Status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Change Status!'
    }).then((result) => {
      let Query;
      if (result.isConfirmed) {
        if (row.IsActive) {
          Query =
            "Update M_Radiology_TemplateMaster set IsActive=0 where TemplateId="+ row.TemplateId;
          console.log(Query);
        } else {
          Query =
            "Update M_Radiology_TemplateMaster set IsActive=1 where TemplateId="+ row.TemplateId;
        }
        console.log(Query)
        this._radiologytemplateService.deactivateTheStatus(Query)
        .subscribe((data) => {
          if(data)
         Swal.fire('Changed!', 'Template Status has been Changed.', 'success');
          this.getRadiologytemplateMasterList();
          
        }, (error) => {
          Swal.fire('Error!', 'Failed to deactivate category.', 'error');
        });
      }
    });

    this.getRadiologytemplateMasterList();
  }
  onBlur(e: any) {
    this.vTemplateDesc = e.target.innerHTML;
  }

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
