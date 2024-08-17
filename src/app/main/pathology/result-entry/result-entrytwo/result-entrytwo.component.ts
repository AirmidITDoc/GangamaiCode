import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { SampleDetailObj, Templateprintdetail } from '../result-entry.component';
import { Observable, Subscription } from 'rxjs';
import { ResultEntryService } from '../result-entry.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  vTemplateName: any = 0;
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
  sIsLoading: string = '';
  isTemplateNameSelected: boolean = false;
 filteredOptionsisTemplate: Observable<string[]>;
 
 TemplateDesc:any;
  otherForm: FormGroup;
  reportIdData:any;
  TemplateId:any=0;
  vTemplateDesc:any="";
  OP_IPType:any;
  constructor(
    public _SampleService: ResultEntryService,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
     public dialogRef: MatDialogRef<ResultEntrytwoComponent>,
  ) {
    dialogRef.disableClose = true;
  
    if(this.data){
      this.selectedAdvanceObj1 = this.data;
       
      console.log( this.selectedAdvanceObj1)
      this.OP_IPType=this.selectedAdvanceObj1.OPD_IPD_Type
      this.reportIdData =this.selectedAdvanceObj1.PathReportID
      this.getTemplateList();
  

      if (this.OP_IPType == 1)
        this.getTemplatedetailIP();
      else
        this.getTemplatedetailOP();
    }
    // this.getTemplatelist();

   }

  ngOnInit(): void {
    this.otherForm = this.formBuilder.group({
      TemplateName:['',Validators.required],
      ResultEntry:['',Validators.required],
      TemplateId:[0]
    
    });
   
        this.filteredOptionsisTemplate = this.otherForm.get('TemplateName').valueChanges.pipe(
          startWith(''),
          map(value => this._filterTemplate(value)),
      );
      this.getTemplateList();
    }
   

    getTemplatedetailIP() {
      this.sIsLoading = 'loading-data';
      let SelectQuery = "select * from T_PathologyReportTemplateDetails  where PathReportId in(" + this.reportIdData + ")"
      console.log(SelectQuery);
      this._SampleService.getPathologyTemplateforIP(SelectQuery).subscribe(Visit => {
        this.vTemplateDesc= Visit[0]["TemplateResultInHTML"];
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
        this.TemplateId=Visit[0]["PathTemplateId"];
        console.log( this.TemplateId)
        this.getTemplatelist();
        }
      },
        error => {
          this.sIsLoading = '';
        });
    }

 
  onSubmit() {
    
    if ((this.vTemplateName == '' || this.vTemplateName == null || this.vTemplateName == undefined)) {
      this.toastr.warning('Please select valid Template ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(this.otherForm.get("ResultEntry").value ==''){
      this.toastr.warning('Please Enter Result Entry ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  
    let pathologyTemplateDeleteObj = {};
    pathologyTemplateDeleteObj['pathReportId'] = this.selectedAdvanceObj1.PathReportID;
    this.isLoading = 'submit';
    
    let pathologyTemplateInsertObj = {};
        
    pathologyTemplateInsertObj['PathReportId'] = this.selectedAdvanceObj1.PathReportID ;
    pathologyTemplateInsertObj['PathTemplateId']= this.otherForm.get("TemplateName").value.TemplateId || 0;
    pathologyTemplateInsertObj['PathTemplateDetailsResult']= this.vTemplateDesc,//this.otherForm.get("ResultEntry").value.trim(),
    pathologyTemplateInsertObj['TemplateResultInHTML']=this.vTemplateDesc,// this.otherForm.get("ResultEntry").value.trim(),
    pathologyTemplateInsertObj['TestId'] = this.selectedAdvanceObj1.PathTestID || 0;
   
    let pathologyTemplateUpdateObj = {};
   
    pathologyTemplateUpdateObj['PathReportID'] =this.selectedAdvanceObj1.PathReportID;
    pathologyTemplateUpdateObj['ReportDate'] =this.datePipe.transform(this.currentDate, "MM-dd-yyyy"),
    pathologyTemplateUpdateObj['ReportTime'] =  this.datePipe.transform(this.currentDate, "MM-dd-yyyy hh:mm"),
    pathologyTemplateUpdateObj['IsCompleted'] = 1;
    pathologyTemplateUpdateObj['IsPrinted'] = 1;
    pathologyTemplateUpdateObj['PathResultDr1'] = 0;
    pathologyTemplateUpdateObj['PathResultDr3'] = 0;
    pathologyTemplateUpdateObj['IsTemplateTest'] = 1;
    pathologyTemplateUpdateObj['SuggestionNotes'] =  "";
    pathologyTemplateUpdateObj['AdmVisitDoctorID'] = 0;
    pathologyTemplateUpdateObj['RefDoctorID'] =  0;
   
    const pathologyTemplateDelete = new PthologyresulDelt(pathologyTemplateDeleteObj);
    const pathologyTemplateUpdate = new PthologyresulUp(pathologyTemplateUpdateObj); 

     let PatientHeaderObj = {};

     PatientHeaderObj['ReportDate'] =this.datePipe.transform(this.currentDate, "MM-dd-yyyy"),
     PatientHeaderObj['ReportTime'] =  this.datePipe.transform(this.currentDate, "MM-dd-yyyy hh:mm"),
   
          console.log('==============================  Advance Amount ===========');
          let submitData = {
            "deletePathologyReportTemplateDetails": pathologyTemplateDelete,
            "insertPathologyReportTemplateDetails": pathologyTemplateInsertObj,
            "updatePathTemplateReportHeader": pathologyTemplateUpdate
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
        
   // });
  }


  
  viewgetPathologyTemplateReportPdf(PathReportID) {
    debugger
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


  getTemplateList() {
    var mdata={
        Id:this.selectedAdvanceObj1.ServiceId
        
    }
    this._SampleService.getTemplateCombo(mdata).subscribe(data => {
      this.TemplateList = data;
      this.optionsTemplate = this.TemplateList.slice();
      this.filteredOptionsisTemplate = this.otherForm.get('TemplateName').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterTemplate(value) : this.TemplateList.slice()),
      );

    });
  }

  getTemplatelist() {
    var mdata={
      Id:this.selectedAdvanceObj1.ServiceId
      
  }
    this._SampleService.getTemplateCombo(mdata).subscribe(data => {
        this.TemplateList = data;
        debugger
        if (this.data) {
          const ddValue = this.TemplateList.filter(c => c.PathTemplateId == this.TemplateId);
          this.otherForm.get('TemplateName').setValue(ddValue[0]);
          this.otherForm.updateValueAndValidity();
          return;
      }
    });
}

private _filtertemplate(value: any): string[] {
  if (value) {
      const filterValue = value && value.TemplateName ? value.TemplateName.toLowerCase() : value.toLowerCase();
      return this.TemplateList.filter(option => option.TemplateName.toLowerCase().includes(filterValue));
  }
}

  private _filterTemplate(value: any): string[] {
    if (value) {
      const filterValue = value && value.TemplateName ? value.TemplateName.toLowerCase() : value.toLowerCase();

      return this.optionsTemplate.filter(option => option.TemplateName.toLowerCase().includes(filterValue));
    }
  }

  
  getOptionTextTemplate(option) {

    return option && option.TemplateName ? option.TemplateName : '';
  }

  onAddTemplate(){
 
    this.vTemplateDesc=this.otherForm.get('TemplateName').value.TemplateDescInHTML || ''
 
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

