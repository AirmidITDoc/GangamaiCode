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
import { TemplateReportComponent } from './template-report/template-report.component';
// import { RadioPatientList } from '../radiology/radiologyorder-list/radiologyorder-list.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { RadioPatientList } from 'app/main/radiology/radiology-order-list/radiology-order-list.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MAT_TAB_GROUP, MatTabGroup } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import Swal from 'sweetalert2';

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
  displayedColumns: string[] = [

    'TemplateId',
    'TemplateName',
    'TemplateDesc',
    'IsDeleted',
    'action'
  ];

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  constructor(public _radiologytemplateService: RadiologyTemplateMasterService,
    private accountService: AuthenticationService,
    public notification: NotificationServiceService,
    public _matDialog: MatDialog,

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

    }
    //console.log(m_data);
    this._radiologytemplateService.getRadiologytemplateMasterList1(m_data).subscribe(Menu => {
      this.dataSource.data = Menu as RadioPatientList[];
      //console.log(this.dataSource)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';

    }, error => this.isLoading = false)
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
    var m_data = {
      "TemplateId": row.TemplateId,
      "TemplateName": row.TemplateName,
      "TemplateDesc": row.TemplateDesc,
      "IsDeleted": JSON.stringify(row.IsDeleted),
      "UpdatedBy": row.UpdatedBy,
    }
    console.log(m_data);
    this._radiologytemplateService.populateForm(m_data);
    const dialogRef = this._matDialog.open(RadiologyTemplateFormComponent,
      {
        maxWidth: "80%",
        width: "80%",
        height: "85%",
        data: {
          Obj: row,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getRadiologytemplateMasterList();
    });
  }
  // row:any;
  // openTab(row, tabGroup: MatTabGroup): void {
  //   this.vTemplateName = row.TemplateName;
  //   this.vTemplateDesc = row.TemplateDesc;
  //   this.vTemplateId   = row.templateId;

  //   const tabIndex = row === 'tab1' ? 0 : 1;
  //   tabGroup.selectedIndex = tabIndex;

  //   console.log(row)

  //   this.getRadiologytemplateMasterList();

  // }

  onAdd() {
    const dialogRef = this._matDialog.open(RadiologyTemplateFormComponent,
      {
        maxWidth: "80%",
        width: "80%",
        height: "85%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getRadiologytemplateMasterList();
    });
  }





  getRecord(contact, m): void {
    ;
    console.log(contact, m);

    if (m == "Template Details") {

      let xx = {
        RegNo: contact.RegNo,
        AdmissionID: contact.VisitId,
        PatientName: contact.PatientName,
        Doctorname: contact.ConsultantDoctor,
        AdmDateTime: contact.AdmissionTime,
        AgeYear: contact.AgeYear,
        //  PatientType: contact.PatientType,

      };
      this.advanceDataStored.storage = new AdvanceDetailObj(xx);
      console.log(this.advanceDataStored.storage);
      const dialogRef = this._matDialog.open(RadiologyTemplateFormComponent,
        {
          maxWidth: "70vw",
          maxHeight: "90vh", width: '100%', height: "100%"
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);

      });
    }
  }

  onDeactive(TemplateId) {
    this.confirmDialogRef = this._matDialog.open(
      FuseConfirmDialogComponent,
      {
        disableClose: false,
      }
    );
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to deactive?";
    this.confirmDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let Query =
          "Update M_Radiology_TemplateMaster set IsDeleted=1 where TemplateId=" +
          TemplateId;

        console.log(Query);
        this._radiologytemplateService.deactivateTheStatus(Query)
          .subscribe((data) => (this.msg = data));
        this.getRadiologytemplateMasterList();
      }
      this.confirmDialogRef = null;
      this.getRadiologytemplateMasterList();
    });
  }
  onBlur(e: any) {
    this.vTemplateDesc = e.target.innerHTML;
  }
  OnPrintPop(TemplateId) {

    var m_data = { "TemplateId": TemplateId, }
    // console.log(m_data);
    this._radiologytemplateService.populatePrintForm(m_data);
    const dialogRef = this._matDialog.open(TemplateReportComponent,
      {
        maxWidth: "95vw",
        maxHeight: "95vh", width: '100%', height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getRadiologytemplateMasterList();
    });
  }

  //   print() {
  //     let printContents = document.getElementById('tempReport').innerHTML;
  //     let originalContents = document.body.innerHTML;
  //     document.body.innerHTML = printContents;
  //     window.print();
  //     window.close();
  // }

  printTemplate: any;
  templateHeading: any;

  PrintData(TemplateId) {
    // debugger;
    var D_data = {
      "TemplateId": TemplateId,
    }
    this._radiologytemplateService.Print(D_data).subscribe(report => {
      this.reportdata = report;
      console.log(this.reportdata);
      this.printTemplate = report[0].TemplateDesc;
      this.templateHeading = report[0].TemplateName
      this.print();
    });
  }

  print() {
    // HospitalName, HospitalAddress, AdvanceNo, PatientName
    let popupWin, printContents;
    // printContents =this.printTemplate; // document.getElementById('print-section').innerHTML;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    // popupWin.document.open();
    popupWin.document.write(` <html>
    <head><style type="text/css">`);
    popupWin.document.write(`
          table th, table td {
          border:1px solid #bdbdbd;
          padding:0.5em;
        }
        `);
    popupWin.document.write(`
    </style>
        <title></title>
    </head>
    `);
    popupWin.document.write(`
      <div>${this.templateHeading}</div>
    `);
    popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
    </html>`);
    popupWin.document.close();
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
