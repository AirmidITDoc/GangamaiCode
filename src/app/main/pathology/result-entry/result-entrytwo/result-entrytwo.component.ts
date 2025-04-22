import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { SampleDetailObj, Templateprintdetail } from '../result-entry.component';
import { Observable, Subscription } from 'rxjs';
import { ResultEntryService } from '../result-entry.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-result-entrytwo',
  templateUrl: './result-entrytwo.component.html',
  styleUrls: ['./result-entrytwo.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ResultEntrytwoComponent implements OnInit {
   editorConfig: AngularEditorConfig = {
          editable: true,
          spellcheck: true,
          height: '20rem',
          minHeight: '20rem',
          translate: 'yes',
          placeholder: 'Enter text here...',
          enableToolbar: true,
          showToolbar: true,
      
        };
                 
    onBlur(e: any) {
      this.vTemplateDesc = e.target.innerHTML;
      throw new Error('Method not implemented.');
    }
    
  isresultdrSelected: boolean = false;
  vTemplateName: any = 0;
  vPathResultDoctorId: any = 0;
  isLoading: string = '';
  msg: any;
  currentDate: Date = new Date();
  selectedAdvanceObj1: AdmissionPersonlModel;
  screenFromString = 'opd-casepaper';
  printTemplate:any;
  PathReportID: any;
  PathTestId: any
  TemplateList:any=[];
  optionsTemplate: any[] = [];
  optionsDoc3: any[] = [];
  PathologyDoctorList:any=[];
  sIsLoading: string = '';
  isTemplateNameSelected: boolean = false;
 filteredOptionsisTemplate: Observable<string[]>;
 filteredresultdr: Observable<string[]>;
 TemplateDesc:any;
  otherForm: FormGroup;
  reportIdData:any;
  TemplateId:any=0;
  vTemplateDesc:any="";
  OP_IPType:any;
  PathResultDr1: any;
  vsuggation: any = '';

  autocompleteModeDoctor: string = "ConDoctor";
  autocompleteModeTemplate: string = "RadioTemplate";

  constructor(
    public _SampleService: ResultEntryService,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    private formBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
     public dialogRef: MatDialogRef<ResultEntrytwoComponent>,
  ) {
    dialogRef.disableClose = true;
  
    if(this.data){
      this.selectedAdvanceObj1 = this.data;
       
      console.log( this.selectedAdvanceObj1)
      this.OP_IPType=this.selectedAdvanceObj1.patientType === 'OP' ? '0' : '1';
      this.reportIdData =this.selectedAdvanceObj1.pathReportId
      this.PathResultDr1=this.selectedAdvanceObj1.adm_Visit_docId //PathResultDr1 ask to sir

      if (this.OP_IPType == 1)
        this.getTemplatedetailIP(this.selectedAdvanceObj1);
      else
        this.getTemplatedetailOP(this.selectedAdvanceObj1);
    }
   
   }

  ngOnInit(): void {
    this.otherForm = this.formBuilder.group({
      TemplateName:['',Validators.required],
      ResultEntry:['',Validators.required],
      TemplateId:[0],
      suggestionNotes:[''],
      PathResultDoctorId:['']
    
    });
   
    }
    
    @ViewChild('PathResultDoctorId') PathResultDoctorId: ElementRef;
   
    public onEnterSugg(event): void {
        if (event.which === 13) {
            this.PathResultDoctorId.nativeElement.focus();
        }
    }

    PathReportId = 0
  templateObj: any;
    getTemplatedetailIP(row) {
      debugger
      console.log("data:", row)
    this.PathReportId = row.pathReportId
      if ((this.PathReportId ?? 0) > 0) {
        setTimeout(() => {
          this._SampleService.getPathTemplateById(this.PathReportId).subscribe((response) => {
            this.templateObj = response;
            console.log("all data:", this.templateObj)
            this.vTemplateDesc=this.templateObj.pathTemplateDetailsResult
          });
        }, 500);
      }
    }
  
    getTemplatedetailOP(row) {
      debugger
      console.log("data:", row)
    this.PathReportId = row.pathReportId
      if ((this.PathReportId ?? 0) > 0) {
        setTimeout(() => {
          this._SampleService.getPathTemplateById(this.PathReportId).subscribe((response) => {
            this.templateObj = response;
            console.log("all data:", this.templateObj)
            this.vTemplateDesc=this.templateObj.pathTemplateDetailsResult
          });
        }, 500);
      }
    }

    VpathResultDr1=0
    selectChangeDoctorName(row){
      this.VpathResultDr1=row.value
    }

    // demo check
    dataSource: any = { data: [] };
 
  onSubmit() {
    debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');

    // if (this.otherForm.get("ResultEntry")?.value == '') {
    //   this.toastr.warning('Please select valid Template ', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    if (this.otherForm.get("PathResultDoctorId")?.value == '') {
      this.toastr.warning('Please select valid Pathalogist', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
  }
  if (this.otherForm.get("ResultEntry")?.value == '') {
    this.toastr.warning('Please Enter Result Entry ', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }

      let pathologyReportTemplate= {
        "pathReportId": this.reportIdData || 0,
        "pathTemplateId": this.TemplateId || 0,
        "pathTemplateDetailsResult":this.otherForm.get("ResultEntry").value || "string",  //this.Tempdesc
        "templateResultInHTML": this.otherForm.get("ResultEntry").value || "string",  //this.Tempdesc
        "testId":  this.selectedAdvanceObj1.pathTestID || 0,
        "suggestionNotes": this.otherForm.get("suggestionNotes").value || "string",
        "pathResultDr1": this.VpathResultDr1 || 0,
      }
      
      let pathologyReportHeader={
        "pathReportID": this.reportIdData || 0,
        "reportDate": formattedDate,
        "reportTime": formattedTime,
        "isCompleted": true,
        "isPrinted": true,
        "pathResultDr1": this.VpathResultDr1 || 0,
        "pathResultDr2": 0,
        "pathResultDr3": 0,
        "isTemplateTest": 0,
        "suggestionNotes": this.otherForm.get("suggestionNotes").value || "string",
        "admVisitDoctorID": this.selectedAdvanceObj1.adm_Visit_docId,
        "refDoctorID": 0
      }
    
    console.log('==============================  Advance Amount ===========');
    let submitData = {
      "pathologyReportTemplate": pathologyReportTemplate,
      "pathologyReportHeader": pathologyReportHeader
    };
        console.log(submitData);
      
          this._SampleService.PathTemplateResultentryInsert(submitData).subscribe(response => {
            
            if (response) {
              Swal.fire('Congratulations !', 'Pathology Template data saved Successfully !', 'success').then((result) => {
                if (result.isConfirmed) {
                 this.dialogRef.close();
                 this.viewgetPathologyTemplateReportPdf(this.selectedAdvanceObj1);
                }
              });
            } else {
              Swal.fire('Error !', 'Pathology Template data not saved', 'error');
            }
            this.isLoading = '';
          });
        
  }
  
  viewgetPathologyTemplateReportPdf(contact) {
    // debugger
    setTimeout(() => {
                let param = {
                        "searchFields": [
                            {
                                "fieldName": "PathReportId" ,
                                "fieldValue": String(contact.pathReportId),
                                "opType": "Equals"
                            },
                            {
                                "fieldName": "OP_IP_Type"   ,
                                "fieldValue": String(contact.opdipdtype),
                                "opType": "Equals"
                            }
                        ],
                        "mode": "PathologyReportTemplate"
                    }
    
              this._SampleService.getReportView(param).subscribe(res => {
                  
                    const matDialog = this._matDialog.open(PdfviewerComponent,
                        {
                            maxWidth: "85vw",
                            height: '750px',
                            width: '100%',
                            data: {
                                base64: res["base64"] as string,
                                title: "Template Report" + " "+ "Viewer"
                            }
                        });
                    matDialog.afterClosed().subscribe(result => {
                    });
                });
            }, 100);
    
    // this._SampleService.getPathologyTempReport(PathReportID,this.selectedAdvanceObj1.opdipdtype).subscribe(res => {
    //   const dialogRef = this._matDialog.open(PdfviewerComponent,
    //     {
    //       maxWidth: "85vw",
    //       height: '750px',
    //       width: '100%',
    //       data: {
    //         base64: res["base64"] as string,
    //         title: "Pathology Template Report Viewer"
    //       }
    //     });
    // });
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

  Tempdesc: any;
  isSelected: boolean = false;
  selectChangeTemplateName(row) {
    console.log("Template:", row)
    this.Tempdesc = row.templateDesc
    this.TemplateId=row.templateId
    if (row.templateId)
      this.isSelected = true
  }

  onAddTemplate() {
    this.vTemplateDesc = this.Tempdesc
  }

public onEnterPathResultDoctorId(event, value): void {

  if (event.which === 13) {
      console.log(value)
      if (value == undefined) {
          this.toastr.warning('Please Enter Valid Pathology Doctor .', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
      } 
  }
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

