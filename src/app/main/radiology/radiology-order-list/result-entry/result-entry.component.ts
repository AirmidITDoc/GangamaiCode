import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
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
  vTemplateDesc: any = "";
  screenFromString = 'opd-casepaper';
  isresultdrSelected: boolean = false;
  templatelist: any = [];
  Doctorlist: any = [];
  currentDate = new Date();
  ResultEntry: any;
  SuggestionNotes: any;
  vsuggation: any;
  DoctorId: any;
  printTemplate: any;
  subscriptionArr: Subscription[] = [];
  TemplateList: any = [];
  optionsTemplate: any[] = [];

  isTemplateNameSelected: boolean = false;
  filteredOptionsisTemplate: Observable<string[]>;
  vTemplateName: any = 0;
  TemplateId: any = 0;

  regObj: any;
  PatientName: any;
  MobileNo: any;
  DepartmentName: any;
  AgeMonth: any;
  AgeDay: any;
  GenderName: any;
  RefDocName: any;
  WardName: any;
  RegNo: any;
  vOPIPId: any;
  VisitId: any;
  RegId: any;
  Doctorname: any;
  vOPDIPdNo: any;
  AgeYear: any;
  PatientType: any;
  Tarrifname: any;
  CompanyName: any;
  vClassId: any;
  Lbl: any;
  DOA: any;
  DOT: any;

  autocompleteModeTemplate: string = "RadioTemplate";

  private _onDestroy = new Subject<void>();
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

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
      this.TemplateId == this.selectedAdvanceObj.TemplateId;
      console.log(this.selectedAdvanceObj)
    }
  }

  ngOnInit(): void {
    this.getTemplateList(); 
    if (this.advanceDataStored.storage) {
      // this.getUpdatetemplate();
    }
    if (this.data) {
      this.regObj = this.data
      console.log(this.regObj)
      this.RegNo = this.regObj.regNo
      this.vOPIPId = this.regObj.visitId
      this.VisitId = this.regObj.visitId
      this.RegId = this.regObj.regId
      this.PatientName = this.regObj.patientName
      this.Doctorname = this.regObj.doctorName
      this.vOPDIPdNo = this.regObj.oP_IP_No
      this.AgeYear = this.regObj.ageYear
      this.AgeMonth = this.regObj.ageMonth
      this.AgeDay = this.regObj.ageDay
      this.GenderName = this.regObj.genderName
      this.DepartmentName = this.regObj.departmentName
      this.PatientType = this.regObj.patientType
      this.Tarrifname = this.regObj.tariffName
      this.CompanyName = this.regObj.companyName
      this.RefDocName = this.regObj.refDocName
      this.vClassId = this.regObj.classId
      this.Lbl = this.regObj.lbl
      this.DOA = this.regObj.doa
      this.DOT = this.regObj.dot
      this.WardName = this.regObj.wardName
    }
  }

  Tempdesc: any;
  isSelected: boolean = false;

  selectChangeTemplateName(row) {
    console.log("Template:", row)
    this.Tempdesc = row.templateDesc
    if (row.templateId)
      this.isSelected = true
  }

  onAddTemplate(e) {
    this.vTemplateDesc = this.Tempdesc
  }

    getTemplateList() {
      if (this.data) {
        this._radiologytemplateService.gettemplateId(this.TemplateId).subscribe(data => {
          console.log(data)
          this._radiologytemplateService.myform.get('TemplateName').setValue(data.templateId);
        this.vTemplateDesc = data.Tempdesc
        });

      }
  }

  onSubmit() {
    debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');

    if (this._radiologytemplateService.myform.get("TemplateName")?.value == '') {
      this.toastr.warning('Please select valid Template ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._radiologytemplateService.myform.get("ResultEntry")?.value == '') {
      this.toastr.warning('Please Enter Result Entry ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (this.regObj.radReportId) {

      var m_dataUpdate = {
        "radReportId": this.regObj.radReportId || 0,
        "reportDate": formattedDate,
        "reportTime": formattedTime,
        "isCompleted": true,
        "isPrinted": true,
        "radResultDr1": this._radiologytemplateService.myform.get("DoctorId").value || 0,
        "radResultDr2": 0,
        "radResultDr3": 0,
        "suggestionNotes": this._radiologytemplateService.myform.get("suggestionNotes").value || '',
        "admVisitDoctorId": 0,
        "refDoctorId": this._radiologytemplateService.myform.get("DoctorId").value || 1,
        "resultEntry": this._radiologytemplateService.myform.get("ResultEntry")?.value || 'abc',
      }
      console.log(m_dataUpdate);
      this._radiologytemplateService.RadiologyUpdate(m_dataUpdate).subscribe(data => {

        if (data) {
          Swal.fire('Congratulations !', 'Radiology Template Updated Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this.dialogRef.close();
              // this.grid.bindGridData();
              this._radiologytemplateService.myform.get('TemplateDesc').reset();
              // this.viewgetRadioloyTemplateReportPdf(this.regObj.radReportId);
            }
          });
        } else {
          Swal.fire('Error !', 'Radiology not saved', 'error');
        }
      });
    }
  }


  viewgetRadioloyTemplateReportPdf(obj) {
    // 
    this._radiologytemplateService.getRadiologyTempReport(
      obj, 0
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

    this._radiologytemplateService.populateForm(row);
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