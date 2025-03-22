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

      // this.getTemplateList();
      // this.getPathresultdoctorList();
      // this.getPathresultDoctorList()
      if (this.OP_IPType == 1)
        this.getTemplatedetailIP();
      else
        this.getTemplatedetailOP();
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

    getTemplatedetailIP() {
      this.sIsLoading = 'loading-data';
      let SelectQuery = "select * from T_PathologyReportTemplateDetails  where PathReportId in(" + this.reportIdData + ")"
      console.log(SelectQuery);
      this._SampleService.getPathologyTemplateforIP(SelectQuery).subscribe(Visit => {
        this.vTemplateDesc= Visit[0]["TemplateResultInHTML"];
        // this.PathResultDr1 = Visit[0]["PathResultDr1"];
        // this.vsuggation = Visit[0]["SuggestionNote"];
      this.TemplateId=Visit[0]["PathTemplateId"];
      
      },
        error => {
          this.sIsLoading = '';
        });
    }
  
    getTemplatedetailOP() {
      this.sIsLoading = 'loading-data';
      let SelectQuery = "select * from T_PathologyReportTemplateDetails  where PathReportId in(" + this.reportIdData + ")"
      console.log(SelectQuery)
      this._SampleService.getPathologyTemplateforOP(SelectQuery).subscribe(Visit => {
       if(Visit){
        this.vTemplateDesc= Visit[0]["TemplateResultInHTML"];
        // this.PathResultDr1 = Visit[0]["PathResultDr1"];
        // this.vsuggation = Visit[0]["SuggestionNote"];
        this.TemplateId=Visit[0]["PathTemplateId"];
        console.log( this.TemplateId)
        // this.getTemplatelist();
        }
      },
        error => {
          this.sIsLoading = '';
        });
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

    if (this.otherForm.get("TemplateName")?.value == '') {
      this.toastr.warning('Please select valid Template ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
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

  let tPathologyReportDetails1 = [];
  this.dataSource.data.forEach((element) => {
    
    let tPathologyReportDetails = {};
    tPathologyReportDetails['pathReportDetId'] = element.PathReportId //element1.PathReportId;
    tPathologyReportDetails['pathReportId'] = element.CategoryId || 0;
    tPathologyReportDetails['categoryId'] = element.TestId || 0;
    tPathologyReportDetails['testId'] = element.SubTestId || 0;
    tPathologyReportDetails['subTestId'] = element.ParameterId || 0;
    tPathologyReportDetails['parameterId'] = element.ResultValue || ' ';
    tPathologyReportDetails['resultValue'] = element.UnitId || 1;
    tPathologyReportDetails['unitId'] = element.NormalRange || '';
    tPathologyReportDetails['normalRange'] = element.PrintOrder || 0;
    tPathologyReportDetails['printOrder'] = element.PIsNumeric || 0;
    tPathologyReportDetails['pisNumeric'] = element.CategoryName || '';
    tPathologyReportDetails['categoryName'] = element.TestName || '';
    tPathologyReportDetails['testName'] = element.SubTestName || '';
    tPathologyReportDetails['subTestName'] = element.ParameterName || '';
    tPathologyReportDetails['parameterName'] = element.UnitName || '';
    tPathologyReportDetails['unitName'] = this.selectedAdvanceObj1.PatientName || '';
    tPathologyReportDetails['patientName'] = this.selectedAdvanceObj1.RegNo;
    tPathologyReportDetails['regNo'] = parseFloat(element.MinValue) || 0;
    tPathologyReportDetails['sampleId'] = parseFloat(element.MaxValue) || 0;
    tPathologyReportDetails['minValue'] = element.SampleID || '';
    tPathologyReportDetails['maxValue'] = parseFloat(element.MinValue) || 0;
    tPathologyReportDetails['paraBoldFlag'] = parseFloat(element.MaxValue) || 0;
    tPathologyReportDetails['pathReport'] = element.SampleID || '';

    tPathologyReportDetails['ParaBoldFlag'] = element.ParaBoldFlag || '';

    tPathologyReportDetails1.push(tPathologyReportDetails);
});

let tPathologyReportTemplateDetails1 = [];
this.dataSource.data.forEach((element) => {
  
  let tPathologyReportTemplateDetails = {};
  tPathologyReportTemplateDetails['pathReportDetId'] = element.PathReportId || 0 //element1.PathReportId;
  tPathologyReportTemplateDetails['pathReportId'] = element.CategoryId || 0;
  tPathologyReportTemplateDetails['categoryId'] = element.TestId || 0;
  tPathologyReportTemplateDetails['testId'] = element.SubTestId || 0;
  tPathologyReportTemplateDetails['subTestId'] = element.ParameterId || 0;
  tPathologyReportTemplateDetails['parameterId'] = element.ResultValue || ' ';
  tPathologyReportTemplateDetails['resultValue'] = element.UnitId || 1;

  tPathologyReportTemplateDetails['ParaBoldFlag'] = element.ParaBoldFlag || '';

  tPathologyReportTemplateDetails1.push(tPathologyReportTemplateDetails);
});

    let pathologyReportTemplate = {
      "pathReportId": this.reportIdData,
      "pathTemplateId": this.TemplateId || 0,
      "pathTemplateDetailsResult": this.Tempdesc || "string",
      "testId": this.selectedAdvanceObj1.pathTestID || 0,
      "templateResultInHTML": this.Tempdesc || "string",
      "pathReport": {
          "pathReportId": this.reportIdData,
          "pathDate": formattedDate,
          "pathTime": formattedTime,
          "opdIpdType": this.OP_IPType,
          "opdIpdId": this.selectedAdvanceObj1.visit_Adm_ID,
          "pathTestId": this.selectedAdvanceObj1.pathTestID,
          "pathResultDr1": this.PathResultDr1 || 0,
          "pathResultDr2": 0,
          "pathResultDr3": 0,
          "isCancelled": 0,
          "isCancelledBy": 0,
          "isCancelledDate": formattedDate,
          "addedBy": 0,
          "updatedBy": 0,
          "chargeId": 0,
          "isCompleted": true,
          "isPrinted": true,
          "reportDate": formattedDate,
          "reportTime": formattedTime,
          "sampleNo": "string",
          "sampleCollectionTime": this.selectedAdvanceObj1.sampleCollectionTime, // formattedTime,
          "isSampleCollection": this.selectedAdvanceObj1.isSampleCollection || true, //true,
          "isTemplateTest": this.selectedAdvanceObj1.isTemplateTest || 0, 
          "testType": true,
          "suggestionNotes": "string",
          "admVisitDoctorId": 0,
          "refDoctorId": 0,
          "isVerifySign": true,
          "isVerifyid": 0,
          "isVerifyedDate": formattedDate,
          "tPathologyReportDetails": tPathologyReportDetails1,
          "tPathologyReportTemplateDetails": tPathologyReportTemplateDetails1,
        }
    }
    let pathologyReportHeader= {
            "pathReportID": 0,
            "reportDate": formattedDate,
            "reportTime": formattedTime,
            "isCompleted": true,
            "isPrinted": true,
            "pathResultDr1": 0,
            "pathResultDr2": 0,
            "pathResultDr3": 0,
            "isTemplateTest": 0,
            "suggestionNotes": "string",
            "admVisitDoctorID": 0,
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
                 this.viewgetPathologyTemplateReportPdf(this.selectedAdvanceObj1.PathReportID);
                }
              });
            } else {
              Swal.fire('Error !', 'Pathology Template data not saved', 'error');
            }
            this.isLoading = '';
          });
        
  }
  
  viewgetPathologyTemplateReportPdf(PathReportID) {
    
    this._SampleService.getPathologyTempReport(PathReportID,this.selectedAdvanceObj1.OPD_IPD_Type).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Pathology Template Report Viewer"
          }
        });
    });
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

//   getPathresultdoctorList() {
//     this._SampleService.getPathologyDoctorCombo().subscribe(data => {
//         this.PathologyDoctorList = data;
//         this.optionsDoc3 = this.PathologyDoctorList.slice();
//         this.filteredresultdr = this.otherForm.get('PathResultDoctorId').valueChanges.pipe(
//             startWith(''),
//             map(value => value ? this._filterdoc3(value) : this.PathologyDoctorList.slice()),
//         );
//     });
// }

// getPathresultDoctorList() {

//     this._SampleService.getPathologyDoctorCombo().subscribe(data => {
//         this.PathologyDoctorList = data;
//         if (this.data) {
            
//             const ddValue = this.PathologyDoctorList.filter(c => c.DoctorId == this.PathResultDr1);
//             this.otherForm.get('PathResultDoctorId').setValue(ddValue[0]);
//             this.otherForm.updateValueAndValidity();
//             return;
//         }
//     });
// }
// private _filterdoc3(value: any): string[] {
//     if (value) {
//         const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
//         return this.PathologyDoctorList.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
//     }
// }

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
// getOptionTextresultdr(option) {
//   return option && option.Doctorname ? option.Doctorname : '';
// }
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

