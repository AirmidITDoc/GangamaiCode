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
import { TemplateReportComponent } from 'app/main/setup/pathology/templatemaster/template-report/template-report.component';
import { RadiologyTemplateMasterService } from '../radiology-template-master.service';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { RadioPatientList } from 'app/main/radiology/radiology-order-list/radiology-order-list.component';

@Component({
  selector: 'app-radiology-template-form',
  templateUrl: './radiology-template-form.component.html',
  styleUrls: ['./radiology-template-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RadiologyTemplateFormComponent implements OnInit {

  msg:any;
  
  selectedAdvanceObj: AdvanceDetailObj;
  hasSelectedContacts: boolean;
  screenFromString = 'OP-billing';
  RadiologytemplateMasterList: any;
  isLoading = true;
  reportdata: any = [];
  dataArray= {};
  sIsLoading: string = '';
  vTemplateName:any;
  vTemplateDesc:any;
  registerObj:any;
  
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('reportDiv') reportDiv: ElementRef;

  // editorConfig: AngularEditorConfig = {
  //   editable: true,
  //   spellcheck: true,
  //   height: 'auto',
  //   minHeight: '0',
  //   maxHeight: 'auto',
  //   width: 'auto',
  //   minWidth: '0',
  //   translate: 'yes',
  //   enableToolbar: true,
  //   showToolbar: true,
  //   placeholder: 'Enter text here...',
  //   defaultParagraphSeparator: '',
  //   defaultFontName: '',
  //   defaultFontSize: '',
  //   fonts: [
  //     { class: 'arial', name: 'Arial' },
  //     { class: 'times-new-roman', name: 'Times New Roman' },
  //     { class: 'calibri', name: 'Calibri' },
  //     { class: 'comic-sans-ms', name: 'Comic Sans MS' }
  //   ],
  //   customClasses: [
  //     {
  //       name: 'quote',
  //       class: 'quote',
  //     },
  //     {
  //       name: 'redText',
  //       class: 'redText'
  //     },
  //     {
  //       name: 'titleText',
  //       class: 'titleText',
  //       tag: 'h1',
  //     },
  //   ],
  //   uploadUrl: 'v1/image',
  //   uploadWithCredentials: false,
  //   sanitize: true,
  //   toolbarPosition: 'top',
  //   toolbarHiddenButtons: [
  //     ['bold', 'italic'],
  //     ['fontSize']
  //   ]
  // };

  // editordoc = {};
  // editor: Editor;
  // toolbar: Toolbar = [
  //   ['bold', 'italic'],
  //   ['underline', 'strike'],
  //   ['code', 'blockquote'],
  //   ['ordered_list', 'bullet_list'],
  //   [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  //   ['link', 'image'],
  //   ['text_color', 'background_color'],
  //   ['align_left', 'align_center', 'align_right', 'align_justify'],
  // ];
  dataSource = new MatTableDataSource<RadiologytemplateMaster>();
  constructor(public _radiologytemplateService: RadiologyTemplateMasterService,
    private accountService: AuthenticationService,
    public notification:NotificationServiceService,
    public dialogRef: MatDialogRef<RadiologyTemplateFormComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private advanceDataStored: AdvanceDataStored,
    private _fuseSidebarService: FuseSidebarService,
    ) { }

    
  ngOnInit(): void {
    if (this.data) {
      this.registerObj = this.data.registerObj; 
     this.vTemplateName = this.registerObj.TemplateName;
      this.vTemplateDesc = this.registerObj.TemplateDesc;
  }

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;

    }
  }

  onSubmit() {
    if (this._radiologytemplateService.myform.valid) {
      if (!this._radiologytemplateService.myform.get("TemplateId").value) {
        var m_data = {
          insertRadiologyTemplateMaster: {
            "TemplateName": (this._radiologytemplateService.myform.get("TemplateName").value).trim(),
            "TemplateDesc": (this._radiologytemplateService.myform.get("TemplateDesc").value).trim(),
            "IsDeleted": Boolean(JSON.parse(this._radiologytemplateService.myform.get("IsDeleted").value)),
            "AddedBy": this.accountService.currentUserValue.user.id,

          }
        }
        // console.log(m_data);
        this._radiologytemplateService.insertRadiologyTemplateMaster(m_data).subscribe(data => {
          this.msg = data;
        });
        this.notification.success('Record added successfully')
      }
      else {
        var m_dataUpdate = {
          updateRadiologyTemplateMaster: {
            "TemplateId": this._radiologytemplateService.myform.get("TemplateId").value,
            "TemplateName": this._radiologytemplateService.myform.get("TemplateName").value,
            "TemplateDesc": (this._radiologytemplateService.myform.get("TemplateDesc").value).trim(),
            "IsDeleted": Boolean(JSON.parse(this._radiologytemplateService.myform.get("IsDeleted").value)),
            "UpdatedBy": this.accountService.currentUserValue.user.id,

          }
        }
        this._radiologytemplateService.updateRadiologyTemplateMaster(m_dataUpdate).subscribe(data => {
          this.msg = data;
        });
        this.notification.success('Record updated successfully')
      }
      this.onClose();
    }
  }
  onEdit(row) {
    var m_data = {
      "TemplateId": row.TemplateId,
      "TemplateName": row.TemplateName.trim(),
      "TemplateDesc": row.TemplateDesc.trim(),
      "IsDeleted": JSON.stringify(row.IsDeleted),
      "UpdatedBy": row.UpdatedBy,
    }
    this._radiologytemplateService.populateForm(m_data);
  }


  dateTimeObj: any;
  getDateTime(dateTimeObj) {
     this.dateTimeObj = dateTimeObj;
  }
  
  onClear() {
    this._radiologytemplateService.myform.reset();
  }
  
  onClose() {
    this._radiologytemplateService.myform.reset();
    this.dialogRef.close();
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

  
  getRadiologytemplateMasterList() {
    this._radiologytemplateService.getRadiologytemplateMasterList().subscribe(Menu => {
      this.dataSource.data = Menu as RadiologytemplateMaster[];
      this.isLoading = false;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, error => this.isLoading = false)
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
  TestName:String;
  ConsultantDoctor: any;
  CategoryName:String;
  AgeYear:number;
  GenderName:String;
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
          this.IsDeleted= RadiologytemplateMaster.IsDeleted;

          this.RadDate = RadiologytemplateMaster.RadDate || '';
          this.RadTime = RadiologytemplateMaster.RadTime;
          this.RegNo = RadiologytemplateMaster.RegNo;
          this.PatientName= RadiologytemplateMaster.PatientName;
          this.PBillNo= RadiologytemplateMaster.PBillNo;
          this.PatientType = RadiologytemplateMaster.PatientType || '0';
          this.ConsultantDoctor = RadiologytemplateMaster.ConsultantDoctor || '';
          this.TestName = RadiologytemplateMaster.TestName || '0';
          this.CategoryName = RadiologytemplateMaster.CategoryName || '';
          this.AgeYear= RadiologytemplateMaster.AgeYear;
          this.GenderName= RadiologytemplateMaster.GenderName;
      }
  }
}
