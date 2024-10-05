import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { RadiologyPrint } from '../radiology-order-list.component';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RadioloyOrderlistService } from '../radioloy-orderlist.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { DatePipe } from '@angular/common';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
// import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-result-entry',
  templateUrl: './result-entry.component.html',
  styleUrls: ['./result-entry.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ResultEntryComponent implements OnInit {
 
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
  filteredrefdr: Observable<string[]>;
  optionsDoc1: any[] = [];
  msg: any;
  vsuggation:any;
  selectedAdvanceObj: RadiologyPrint;
  public iframe: object = { enable: true };
  public height: number = 410;
  reportPrintObj: RadiologyPrint;
  regobj: RadiologyPatienInsert;
  vTemplateDesc:any="";
  screenFromString = 'opd-casepaper';
  isresultdrSelected: boolean = false;
  templatelist: any = [];
  Doctorlist: any = [];
  currentDate = new Date();
  ResultEntry: any;
  SuggestionNotes: any;
  DoctorId: any;
  printTemplate: any;
  subscriptionArr: Subscription[] = [];
  TemplateList:any=[];
  optionsTemplate: any[] = [];

  isTemplateNameSelected: boolean = false;
 filteredOptionsisTemplate: Observable<string[]>;
 vTemplateName: any = 0;
 TemplateId: any = 0;
 
  
  private _onDestroy = new Subject<void>();

  dataSource = new MatTableDataSource<RadiologyPatienInsert>();

  public tools: object = {
    type: 'MultiRow',
    items: ['Undo', 'Redo', '|',
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'SubScript', 'SuperScript', '|',
      'LowerCase', 'UpperCase', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'CreateTable', '|',
      'CreateLink', 'Image', '|',
      'Indent', 'Outdent', '|',
      'ClearFormat', '|', 'FullScreen',
      // 'SourceCode',
    ]
  };
  constructor(
    public _radiologytemplateService: RadioloyOrderlistService,
    private accountService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<ResultEntryComponent>,
  ) { 
   
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.TemplateId== this.selectedAdvanceObj.TemplateId;
      console.log(this.selectedAdvanceObj )
      this.getUpdatetemplate(); 
    }
    this.getDoctorList()
    this.getTemplateList();
    
   }

  ngOnInit(): void { 
  
  
  }
  RefDoctorID:any;
// getUpdatetemplate(){
//   var m_data = {
//     "RadReportId": this.selectedAdvanceObj.RadReportId, 
//   }
//   this._radiologytemplateService.getRtrvtemplate(m_data).subscribe(Visit => {
//     this.regobj = Visit as RadiologyPatienInsert; 
//     console.log(this.regobj); 
//     this.vTemplateDesc = this.regobj[0].ResultEntry;
//     this.SuggestionNotes = this.regobj[0].SuggestionNotes;
//     this.DoctorId = this.regobj[0].RadResultDr1;
//     this.RefDoctorID = this.regobj[0].RefDoctorID;
//     console.log(this.RefDoctorID); 
  
//   }); 
// }   



getUpdatetemplate() {
  
  // var mdata={
  // "Id":595//this.selectedAdvanceObj.ServiceId, 
  // }

  // this._radiologytemplateService.getRtrvtemplate(mdata).subscribe(data => {
  //     this.TemplateList = data[0];
  //     this.vTemplateDesc = this.TemplateList.ResultEntry;
  //     this.SuggestionNotes = this.TemplateList.SuggestionNotes;
  //     this.TemplateId= this.TemplateList.RadReportId;
  //     this.DoctorId = this.TemplateList.RadResultDr1;
  //     this.RefDoctorID = this.TemplateList.RefDoctorID;
  //     debugger
  //   //   if (this.data) {
  //   //     const ddValue = this.TemplateList.filter(c => c.RadReportId== this.TemplateId);
  //       this._radiologytemplateService.myform.get('TemplateName').setValue(this.TemplateId);
  //       this._radiologytemplateService.myform.updateValueAndValidity();
  //   //     return;
  //   // }
  // });

  var mdata={
    Id: 595//this.selectedAdvanceObj.ServiceId

}
this._radiologytemplateService.getTemplateCombo(mdata).subscribe(data => {
  this.TemplateList = data;
  debugger
  this.vTemplateDesc = this.TemplateList[0]["TemplateDesc"];
      this.SuggestionNotes = this.TemplateList.SuggestionNotes;
      this.TemplateId= this.TemplateList[0]["TemplateId"];
      // this.DoctorId = this.TemplateList.RadResultDr1;
      // this.RefDoctorID = this.TemplateList.RefDoctorID;
 
});
}

  getDoctorList() {
    this._radiologytemplateService.getdoctorCombo().subscribe(data => {
      this.Doctorlist = data;
      //console.log(this.Doctorlist); 
      this.optionsDoc1 = this.Doctorlist.slice();
      this.filteredrefdr = this._radiologytemplateService.myform.get('DoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterdoc1(value) : this.Doctorlist.slice()),
      ); 
    });
  } 
  private _filterdoc1(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.optionsDoc1.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    } 
  } 
  getOptionTextRefdr(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }

  onBlur(e:any){
    this.vTemplateDesc=e.target.innerHTML;
  } 

  


  onSubmit() {
    
    if ((this.vTemplateName == '' || this.vTemplateName == null || this.vTemplateName == undefined)) {
      this.toastr.warning('Please select valid Template ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(this._radiologytemplateService.myform.get("ResultEntry").value ==''){
      this.toastr.warning('Please Enter Result Entry ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  
   
      if (!this.selectedAdvanceObj.RadReportId) {
        var m_data = {
          insertRadiologyTemplateMaster: {
            "RadReportID":0, 
            "ReportDate": this.datePipe.transform(this.currentDate, "MM-dd-yyyy"),
            "ReportTime":this.datePipe.transform(this.currentDate, "MM-dd-yyyy hh:mm"),
            "IsCompleted":'true', 
            "IsPrinted":'true', 
            "RadResultDr1":10005,// this._radiologytemplateService.myform.get("DoctorId").value.DoctorId || 10005,
            "RadResultDr2":0, 
            "RadResultDr3":0, 
            "SuggestionNotes": this._radiologytemplateService.myform.get("Suggatationnote").value || '',
            "AdmVisitDoctorID":0, 
            "RefDoctorID": this._radiologytemplateService.myform.get("DoctorId").value.DoctorId || 1,
            "ResultEntry": this._radiologytemplateService.myform.get("ResultEntry").value || '', 
          }
        }
        console.log(m_data);
        this._radiologytemplateService.insertRadiologyTemplateMaster(m_data).subscribe(data => {
          this.msg = data;
          if (data) {
            Swal.fire('Congratulations !', 'Radiology Template Inserted Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._radiologytemplateService.myform.get('TemplateDesc').reset();
                this.dialogRef.close();
                this.viewgetRadioloyTemplateReportPdf(data);
              }

            });
          } else {
            Swal.fire('Error !', 'Appoinment not saved', 'error');
          }
        });  
       }
       
      else { 
        var m_dataUpdate = {
          radiologyReportHeaderUpdate: {
            "RadReportID": this.selectedAdvanceObj.RadReportId || 0, 
            "ReportDate": this.datePipe.transform(this.currentDate, "MM-dd-yyyy"),
            "ReportTime":this.datePipe.transform(this.currentDate, "MM-dd-yyyy hh:mm"),
            "IsCompleted": true, 
            "IsPrinted": true, 
            "RadResultDr1":10005,// this._radiologytemplateService.myform.get("DoctorId").value.DoctorId || 0,
            "RadResultDr2": 0, 
            "RadResultDr3": 0, 
            "SuggestionNotes": this._radiologytemplateService.myform.get("SuggestionNotes").value || '',
            "AdmVisitDoctorID":  0, 
            "RefDoctorID":  this._radiologytemplateService.myform.get("DoctorId").value.DoctorId || 1,
            "ResultEntry": this._radiologytemplateService.myform.get("ResultEntry").value || '',

          }
        }
        console.log(m_dataUpdate);
        this._radiologytemplateService.RadiologyUpdate(m_dataUpdate).subscribe(data => {
         
          if (data) {
            Swal.fire('Congratulations !', 'Radiology Template Updated Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this.dialogRef.close();
                this._radiologytemplateService.myform.get('TemplateDesc').reset();
                this.viewgetRadioloyTemplateReportPdf(this.selectedAdvanceObj.RadReportId);
              } 
            });
          } else {
            Swal.fire('Error !', 'Appoinment not saved', 'error');
          } 
        });
      } 
  }

 
  viewgetRadioloyTemplateReportPdf(obj) {
    // debugger
    this._radiologytemplateService.getRadiologyTempReport(
      obj,0
      ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Radiology Template  Viewer"
          }
        });
    });
  }
  


  getTemplateList() {
    var mdata={
        Id: 595//this.selectedAdvanceObj.ServiceId

    }
    this._radiologytemplateService.getTemplateCombo(mdata).subscribe(data => {
      this.TemplateList = data;
      this.optionsTemplate = this.TemplateList.slice();
      this.filteredOptionsisTemplate = this._radiologytemplateService.myform.get('TemplateName').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterTemplate(value) : this.TemplateList.slice()),
      );

    });
    if (this.data) {
      const ddValue = this.TemplateList.filter(c => c.TemplateId == this.TemplateId);
      this._radiologytemplateService.myform.get('TemplateName').setValue(ddValue[0]);
      this._radiologytemplateService.myform.updateValueAndValidity();
      return;
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

  onEdit(row) {
   
    this._radiologytemplateService.populateForm(row);
  }

  onAddTemplate(){
 
    this.vTemplateDesc=this._radiologytemplateService.myform.get('TemplateName').value.TemplateDescInHTML || ''
 
  }
 
  onAdd() {
    this.onClear();
    // const dialogRef = this._matDialog.open(EditorComponent,
    //   {
    //     maxWidth: "90vw",
    //     maxHeight: "95vh",
    //     width: '100%',
    //     height: "95%"
    //   });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed - Insert Action', result);
    //   // this.getRadiologytemplateMasterList();
    // });
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClear() {
    this._radiologytemplateService.myform.reset();
  }

  onClose() {
    // this._radiologytemplateService.myform.reset();
    this.dialogRef.close();
  }

}

export class RadiologyPatienInsert {
  RadReportID: number;
  ReportDate: Date;
  ReportTime: Date;
  IsCompleted: boolean;
  IsPrinted: boolean;
  RadResultDr1: number;
  RadResultDr2: number;
  RadResultDr3: number;
  SuggestionNotes: String;
  AdmVisitDoctorID: number;
  RefDoctorID: number;
  ResultEntry: string;



  constructor(RadiologyPatienInsert) {

    this.RadReportID = RadiologyPatienInsert.RadReportID || '';
    this.ReportDate = RadiologyPatienInsert.ReportDate;
    this.ReportTime = RadiologyPatienInsert.ReportTime || '';
    this.IsCompleted = RadiologyPatienInsert.IsCompleted;
    this.IsPrinted = RadiologyPatienInsert.IsPrinted;
    this.RadResultDr1 = RadiologyPatienInsert.RadResultDr1;
    this.RadResultDr2 = RadiologyPatienInsert.RadResultDr2;
    this.RadResultDr3 = RadiologyPatienInsert.RadResultDr3 || '0';
    this.SuggestionNotes = RadiologyPatienInsert.SuggestionNotes || '';
    this.AdmVisitDoctorID = RadiologyPatienInsert.AdmVisitDoctorID || '0';
    this.RefDoctorID = RadiologyPatienInsert.RefDoctorID || '';
    this.ResultEntry = RadiologyPatienInsert.ResultEntry;

  }
}