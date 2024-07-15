import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RadiologyPrint } from '../radiology-order-list.component';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RadioloyOrderlistService } from '../radioloy-orderlist.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
  //Template filter
  public templateFilterCtrl: FormControl = new FormControl();
  public filteredtemplate: ReplaySubject<any> = new ReplaySubject<any>(1);

  //doctor filter
  public DoctorFilterCtrl: FormControl = new FormControl();
  public filtereddoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

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
    // public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    // public datePipe: DatePipe,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<ResultEntryComponent>,
  ) {  }

  ngOnInit(): void { 
    this.getTemplateList();
    this.getDoctorList(); 
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj)
      
    } 
    if (this.selectedAdvanceObj.RadReportId) { 
      this.getUpdatetemplate();
    } 
  }
getUpdatetemplate(){
  var m_data = {
    "RadReportId": this.selectedAdvanceObj.RadReportId, 
  }
  this._radiologytemplateService.getRtrvtemplate(m_data).subscribe(Visit => {
    this.regobj = Visit as RadiologyPatienInsert; 
    console.log(this.regobj); 
    this.vTemplateDesc = this.regobj[0].ResultEntry;
    this.SuggestionNotes = this.regobj[0].SuggestionNotes;
    this.DoctorId = this.regobj[0].RadResultDr1;
  });
}
  onBlur(e:any){
    this.vTemplateDesc=e.target.innerHTML;
  } 
  getDoctorList() {
    this._radiologytemplateService.getdoctorCombo().subscribe(data => {
      this.Doctorlist = data;
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


  getTemplateList() {
    let Id = 1;
    this._radiologytemplateService.gettemplateCombo(Id).subscribe(data => { this.templatelist = data; })
  }

  onSubmit() {
   if(this.vTemplateDesc == '' || this.vTemplateDesc == null || this.vTemplateDesc == undefined){
    this.toastr.warning('Enter Template Details', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
   }
   console.log(this._radiologytemplateService.myform.get("ResultEntry").value)
   const domParser = new DOMParser();
  const htmlElement = domParser.parseFromString(this._radiologytemplateService.myform.get("ResultEntry").value, 'text/html');
 
   console.log(htmlElement)
  
      if (!this.selectedAdvanceObj.RadReportId) {
        var m_data = {
          insertRadiologyTemplateMaster: {
            "RadReportID":0, 
            "ReportDate": this._radiologytemplateService.myform.get("ReportDate").value || '11/01/2022',
            "ReportTime": this._radiologytemplateService.myform.get("ReportTime").value || '11/01/2022',
            "IsCompleted":'true', 
            "IsPrinted":'true', 
            "RadResultDr1": this._radiologytemplateService.myform.get("DoctorId").value.DoctorId ,
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
            "ReportDate": this.dateTimeObj.date || '11/01/2022',
            "ReportTime":  this.dateTimeObj.time || '11/01/2022', 
            "IsCompleted": true, 
            "IsPrinted": true, 
            "RadResultDr1": this._radiologytemplateService.myform.get("DoctorId").value.DoctorId || 0,
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
    debugger
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
  


  onEdit(row) {
    var m_data = {
      // "TemplateId": row.TemplateId,
      // "TemplateName": row.TemplateName.trim(),
      // "TemplateDesc": row.TemplateDesc.trim(),
      // "IsDeleted": JSON.stringify(row.IsDeleted),
      // "UpdatedBy": row.UpdatedBy,
    }
    this._radiologytemplateService.populateForm(m_data);
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
    this._radiologytemplateService.myform.reset();
    // this.dialogRef.close();
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