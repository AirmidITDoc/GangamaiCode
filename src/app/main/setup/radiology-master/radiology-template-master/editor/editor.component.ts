import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RadiologyTemplateMasterService } from '../radiology-template-master.service';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  msg: any;
  selectedAdvanceObj: AdvanceDetailObj;
  screenFromString = 'opd-casepaper';

  templatelist : any =[];

  Doctorlist : any =[];

 //maritalstatus filter
 public templateFilterCtrl: FormControl = new FormControl();
 public filteredtemplate: ReplaySubject<any> = new ReplaySubject<any>(1);

  //maritalstatus filter
  public DoctorFilterCtrl: FormControl = new FormControl();
  public filtereddoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();

  
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
    public _radiologytemplateService: RadiologyTemplateMasterService,
    private accountService: AuthenticationService,
    public notification: NotificationServiceService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<EditorComponent>,
  ) { }
  
  ngOnInit(): void {
   
   
    this.getTemplateList();
   // this.getDoctorList();


    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;

    }

    // this.templateFilterCtrl.valueChanges
    // .pipe(takeUntil(this._onDestroy))
    // .subscribe(() => {
    //   this.filterPrefix();
    // });

  this.DoctorFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterDoctor();
    });

  }

  
   // doctor filter code
   private filterDoctor() {

    if (!this.Doctorlist) {
      return;
    }
    // get the search keyword
    let search = this.DoctorFilterCtrl.value;
    if (!search) {
      this.filtereddoctor.next(this.Doctorlist.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filtereddoctor.next(
      this.Doctorlist.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );
  }


// doctorlist
  // getDoctorList() {
  //   this._radiologytemplateService.getdoctorCombo().subscribe(data => {
  //     this.Doctorlist = data;
  //     console.log(this.Doctorlist);
  //     this.filtereddoctor.next(this.Doctorlist.slice());
  //   });
  // }

  getTemplateList() {
    let Id=1;
   // this._radiologytemplateService.gettemplateCombo(Id).subscribe(data => { this.templatelist = data; })
  }

   onSubmit() {
  //   debugger;
  //   if (this._radiologytemplateService.myform.valid) {
  //     if (!this._radiologytemplateService.myform.get("TemplateId").value) {
  //       var m_data = {
  //         insertRadiologyTemplateMaster: {
  //           "RadReportID": this._radiologytemplateService.myform.get("RadReportID").value || 1,
  //           "ReportDate": this._radiologytemplateService.myform.get("ReportDate").value || '11/01/2022',
  //           "ReportTime": this._radiologytemplateService.myform.get("ReportTime").value || '11/01/2022',
  //           "IsCompleted":'false',// (this._radiologytemplateService.myform.get("IsCompleted").value).trim(),
  //           "IsPrinted":'false',//Boolean(JSON.parse(this._radiologytemplateService.myform.get("IsPrinted").value)),
  //           "RadResultDr1": this._radiologytemplateService.myform.get("DoctorId").value.DoctorId ,
  //           "RadResultDr2": this._radiologytemplateService.myform.get("DoctorId").value.DoctorId,
  //           "RadResultDr3": this._radiologytemplateService.myform.get("DoctorId").value.DoctorId,
  //           "SuggestionNotes":this._radiologytemplateService.myform.get("Suggatationnote").value || '',
  //           "AdmVisitDoctorID": this._radiologytemplateService.myform.get("DoctorId").value.DoctorId,
  //           "RefDoctorID": this._radiologytemplateService.myform.get("DoctorId").value.DoctorId || 1,
  //           "ResultEntry": 'Clear',//Boolean(JSON.parse(this._radiologytemplateService.myform.get("SuggestionNotes").value)),
            
  //         }
  //       }
  //       // console.log(m_data);
  //       this._radiologytemplateService.insertRadiologyTemplateMaster(m_data).subscribe(data => {
  //         this.msg = data;
  //       });
  //       this.notification.success('Record added successfully')
  //     }      
  //     else {
  //       var m_dataUpdate = {
  //         radiologyReportHeaderUpdate: {
  //           "RadReportID": this._radiologytemplateService.myform.get("RadReportID").value || 1,
  //           "ReportDate": this._radiologytemplateService.myform.get("ReportDate").value || '11/01/2022',
  //           "ReportTime": this._radiologytemplateService.myform.get("ReportTime").value || '11/01/2022',
  //           "IsCompleted":'false',// (this._radiologytemplateService.myform.get("IsCompleted").value).trim(),
  //           "IsPrinted":'false',//Boolean(JSON.parse(this._radiologytemplateService.myform.get("IsPrinted").value)),
  //           "RadResultDr1": this._radiologytemplateService.myform.get("DoctorId").value.DoctorId ,
  //           "RadResultDr2": this._radiologytemplateService.myform.get("DoctorId").value.DoctorId,
  //           "RadResultDr3": this._radiologytemplateService.myform.get("DoctorId").value.DoctorId,
  //           "SuggestionNotes":this._radiologytemplateService.myform.get("Suggatationnote").value || '',
  //           "AdmVisitDoctorID": this._radiologytemplateService.myform.get("DoctorId").value.DoctorId,
  //           "RefDoctorID": this._radiologytemplateService.myform.get("DoctorId").value.DoctorId || 1,
  //           "ResultEntry": 'Clear',//Boolean(JSON.parse(this._radiologytemplateService.myform.get("SuggestionNotes").value)),
            

  //         }
  //       }
  //       console.log(m_dataUpdate);
  //       this._radiologytemplateService.updateRadiologyTemplateMaster(m_dataUpdate).subscribe(data => {
  //         this.msg = data;
  //       });
  //       this.notification.success('Record updated successfully')
  //     }
  //     this.onClose();
  //   }
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

  onPrint() {
    let popupWin, printContents;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
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
      <div>${this._radiologytemplateService.myform.get("TemplateName").value}</div>
    `);
    popupWin.document.write(`<body onload="window.print();window.close()">${this._radiologytemplateService.myform.get("TemplateDesc").value}</body>
    </html>`);
    popupWin.document.close();
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

}

export class RadiologyPatienInsert{
  RadReportID:number;
  ReportDate: Date;
  ReportTime: Date;
  IsCompleted: boolean;
  IsPrinted: boolean;
  RadResultDr1: number;
  RadResultDr2:number;
  RadResultDr3: number;
  SuggestionNotes:String;
  AdmVisitDoctorID:number;
  RefDoctorID:number;
  ResultEntry: string;
  

  
  constructor(RadiologyPatienInsert) {
    
    this.RadReportID = RadiologyPatienInsert.RadReportID || '';
    this.ReportDate = RadiologyPatienInsert.ReportDate;
    this.ReportTime = RadiologyPatienInsert.ReportTime || '';
    this.IsCompleted = RadiologyPatienInsert.IsCompleted;
    this.IsPrinted = RadiologyPatienInsert.IsPrinted;
    this.RadResultDr1= RadiologyPatienInsert.RadResultDr1;
    this.RadResultDr2= RadiologyPatienInsert.RadResultDr2;
    this.RadResultDr3 = RadiologyPatienInsert.RadResultDr3 || '0';
    this.SuggestionNotes = RadiologyPatienInsert.SuggestionNotes || '';
    this.AdmVisitDoctorID = RadiologyPatienInsert.AdmVisitDoctorID || '0';
    this.RefDoctorID = RadiologyPatienInsert.RefDoctorID || '';
    this.ResultEntry= RadiologyPatienInsert.ResultEntry;
        
  }
}