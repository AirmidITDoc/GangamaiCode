import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { SampleDetailObj, Templateprintdetail } from '../result-entry.component';
import { Subscription } from 'rxjs';
import { ResultEntryService } from '../result-entry.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';

@Component({
  selector: 'app-result-entrytwo',
  templateUrl: './result-entrytwo.component.html',
  styleUrls: ['./result-entrytwo.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ResultEntrytwoComponent implements OnInit {
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

  
  isLoading: string = '';
  msg: any;
  selectedAdvanceObj: SampleDetailObj;
  selectedAdvanceObj1: AdmissionPersonlModel;
  screenFromString = 'opd-casepaper';
  printTemplate:any;
  PathReportID: any;
  PathTestId: any
  subscriptionArr: Subscription[] = [];
  reportPrintObj: Templateprintdetail;
  reportPrintObjList: SampleDetailObj[] = [];
  reportPrintObjs: SampleDetailObj ;

  
  // public iframe: object = { enable: true };
TemplateDesc:any;
  otherForm: FormGroup;
  private _matDialog: any;
  vTemplateDesc:any="";
  constructor(
    public _SampleService: ResultEntryService,
    private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
    private advanceDataStored: AdvanceDataStored,
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
     public dialogRef: MatDialogRef<ResultEntrytwoComponent>,
  ) {
    dialogRef.disableClose = true;
   }

  ngOnInit(): void {
    this.otherForm = this.formBuilder.group({
      TemplateName:['',Validators.required],
      TemplateDesc:['',Validators.required],
      TemplateId:[0]
    
    });

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.selectedAdvanceObj1 = this.advanceDataStored.storage;
      
      this.vTemplateDesc= this.selectedAdvanceObj.TemplateDesc;
    }
  }

  // onSubmit() {
  //   if (this._SampleService.myform.valid) {
  //     if (!this._SampleService.myform.get("TemplateId").value) {
  //       var m_data = {
  //         insertRadiologyTemplateMaster: {
  //           "TemplateName": (this._SampleService.myform.get("TemplateName").value).trim(),
  //           "TemplateDesc": (this._SampleService.myform.get("TemplateDesc").value).trim(),
  //           "IsDeleted": Boolean(JSON.parse(this._SampleService.myform.get("IsDeleted").value)),
  //           "AddedBy": this.accountService.currentUserValue.user.id,
            
  //         }
  //       }
  //       // console.log(m_data);
  //       // this._SampleService.insertRadiologyTemplateMaster(m_data).subscribe(data => {
  //       //   this.msg = data;
  //       // });
  //       this.notification.success('Record added successfully')
  //     }
  //     else {
  //       var m_dataUpdate = {
  //         updateRadiologyTemplateMaster: {
  //           "TemplateId": this._SampleService.myform.get("TemplateId").value,
  //           "TemplateName": this._SampleService.myform.get("TemplateName").value,
  //           "TemplateDesc": (this._SampleService.myform.get("TemplateDesc").value).trim(),
  //           "IsDeleted": Boolean(JSON.parse(this._SampleService.myform.get("IsDeleted").value)),
  //           "UpdatedBy": this.accountService.currentUserValue.user.id,

  //         }
  //       }
  //       // // this._SampleService.updateRadiologyTemplateMaster(m_dataUpdate).subscribe(data => {
  //       // //   this.msg = data;
  //       // });
  //       this.notification.success('Record updated successfully')
  //     }
  //     this.onClose();
  //   }
  // }
  onSubmit() {
    debugger;
    let pathologyTemplateDeleteObj = {};
    pathologyTemplateDeleteObj['pathReportID'] = this.selectedAdvanceObj.PathReportID;

    this.isLoading = 'submit';
    let Billdetsarr = [];
    
    // foreach(i:any i<10)
     {
    let pathologyTemplateInsertObj = {};
        
    pathologyTemplateInsertObj['PathReportId'] = this.selectedAdvanceObj.PathReportID ;
    pathologyTemplateInsertObj['PathTemplateId']= this.selectedAdvanceObj.PathTemplateId || 9;
    pathologyTemplateInsertObj['PathTemplateDetailsResult']= this.otherForm.get("TemplateDesc").value,
    pathologyTemplateInsertObj['TestId'] = this.selectedAdvanceObj.PathTestID || 11;
    Billdetsarr.push(pathologyTemplateInsertObj);
    }
    let pathologyTemplateUpdateObj = {};
   
    pathologyTemplateUpdateObj['PathReportID'] =this.selectedAdvanceObj.PathReportID;
    pathologyTemplateUpdateObj['ReportDate'] = this.dateTimeObj.date;
    pathologyTemplateUpdateObj['ReportTime'] = this.dateTimeObj.date;
    pathologyTemplateUpdateObj['IsCompleted'] = 0;
    pathologyTemplateUpdateObj['IsPrinted'] = 0;
    pathologyTemplateUpdateObj['PathResultDr1'] = 10;
    pathologyTemplateUpdateObj['PathResultDr3'] = 20;
    pathologyTemplateUpdateObj['IsTemplateTest'] = 1;
    pathologyTemplateUpdateObj['SuggestionNotes'] =  "Hello";
    pathologyTemplateUpdateObj['AdmVisitDoctorID'] = 30;
    pathologyTemplateUpdateObj['RefDoctorID'] =  30;
   
    const pathologyTemplateDelete = new PthologyresulDelt(pathologyTemplateDeleteObj);
    // const PthologyresultTemplateInsert = new PthologyresultInsert(pathologyTemplateInsertObj);
    const pathologyTemplateUpdate = new PthologyresulUp(pathologyTemplateUpdateObj); 

     let PatientHeaderObj = {};

     PatientHeaderObj['ReportDate'] = this.dateTimeObj.date;
     PatientHeaderObj['ReportTime'] = this.dateTimeObj.date;
    
   
    // this.dialogRef.afterClosed().subscribe(result => {
          console.log('==============================  Advance Amount ===========');
          let submitData = {
            "deletePathologyReportTemplateDetails": pathologyTemplateDelete,
            "insertPathologyReportTemplateDetails": Billdetsarr,
            "updatePathTemplateReportHeader": pathologyTemplateUpdate
          };
        console.log(submitData);
      
          this._SampleService.PathTemplateResultentryInsert(submitData).subscribe(response => {
            
            if (response) {
              Swal.fire('Congratulations !', 'Pathology Template data saved Successfully !', 'success').then((result) => {
                if (result.isConfirmed) {
                 this.dialogRef.close();
               // this.getPrint();
                }
              });
            } else {
              Swal.fire('Error !', 'Pathology Template data not saved', 'error');
            }
            this.isLoading = '';
          });
        
   // });
  }
  onBlur(e:any){
    this.vTemplateDesc=e.target.innerHTML;
  }
  onEdit(row) {
    var m_data = {
      "TemplateId": row.TemplateId,
      "TemplateName": row.TemplateName.trim(),
      "TemplateDesc": row.TemplateDesc.trim(),
      "IsDeleted": JSON.stringify(row.IsDeleted),
      "UpdatedBy": row.UpdatedBy,
    }
    this._SampleService.populateForm(m_data);
  }

  onPrint() {
    let popupWin, printContents;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
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
      <div>${this._SampleService.myform.get("TemplateName").value}</div>
    `);
    popupWin.document.write(`<body onload="window.print();window.close()">${this._SampleService.myform.get("TemplateDesc").value}</body>
    </html>`);
    popupWin.document.close();
  }

 

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
     this.dateTimeObj = dateTimeObj;
  }

  onClear() {
    this._SampleService.myform.reset();
  }

  onClose() {
    this._SampleService.myform.reset();
    this.dialogRef.close();
  }






}


export class PthologyresulUp {

  PathReportID: number;
  ReportDate :any;
  ReportTime:any;
  IsCompleted: boolean;
  IsPrinted:boolean;
  PathResultDr1 :any;
  PathResultDr2 :any;
  PathResultDr3 :any;
  IsTemplateTest :any;
  SuggestionNotes :any;
  AdmVisitDoctorID :any;
  RefDoctorID :any;
 
  constructor(pathologyTemplateUpdateObj) {
    this.PathReportID = pathologyTemplateUpdateObj.PathReportID || 0;
    this.ReportDate = pathologyTemplateUpdateObj.ReportDate || '';
    this.ReportTime = pathologyTemplateUpdateObj.ReportTime || '';
    this.IsCompleted = pathologyTemplateUpdateObj.IsCompleted || 0;
    this.IsPrinted = pathologyTemplateUpdateObj.IsPrinted || 0;
    this.PathResultDr1 = pathologyTemplateUpdateObj.PathResultDr1 || 0;
    this.PathResultDr2 = pathologyTemplateUpdateObj.PathResultDr2 || 0;
    this.PathResultDr3 = pathologyTemplateUpdateObj.PathResultDr3 || 0;
    this.IsTemplateTest = pathologyTemplateUpdateObj.IsTemplateTest || 0;
    this.SuggestionNotes = pathologyTemplateUpdateObj.SuggestionNotes || '';
    this.AdmVisitDoctorID = pathologyTemplateUpdateObj.AdmVisitDoctorID || 0;
    this.RefDoctorID = pathologyTemplateUpdateObj.RefDoctorID || 0;
  }

}


export class PthologyresultInsert {

  PathReportId : number;
  PathTemplateId : number;
  PathTemplateDetailsResult : any;
  TestId : any;
 
 
  constructor(pathologyTemplateInsertObj) {
 
    this.PathReportId = pathologyTemplateInsertObj.PathReportId || 0;
    this.PathTemplateId = pathologyTemplateInsertObj.PathTemplateId || 0;
    this.PathTemplateDetailsResult = pathologyTemplateInsertObj.PathTemplateDetailsResult || 0;
    this.TestId = pathologyTemplateInsertObj.TestId || 0;
   
  }

}


export class PthologyresulDelt {

  pathReportId: number;
 
  constructor(pathologyTemplateDeleteObj) {
    this.pathReportId = pathologyTemplateDeleteObj.pathReportId || 0;
  
  }

}

