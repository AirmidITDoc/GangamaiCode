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
// import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-result-entry',
  templateUrl: './result-entry.component.html',
  styleUrls: ['./result-entry.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ResultEntryComponent implements OnInit {
  // editor: Editor;
  // html: '';
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
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<ResultEntryComponent>,
  ) {
    // dialogRef.disableClose = true;
  }

  ngOnInit(): void {

//  this.editor = new Editor();
    this.getTemplateList();
    this.getDoctorList();


    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj)
    }

    if (this.selectedAdvanceObj.RadReportId) {
      debugger;   
      var m_data = {
        "RadReportId": this.selectedAdvanceObj.RadReportId,

      }
      this._radiologytemplateService.getRtrvtemplate(m_data).subscribe(Visit => {
        this.regobj = Visit as RadiologyPatienInsert;

        console.log(this.regobj);

        this.ResultEntry = this.regobj[0].ResultEntry;
        this.SuggestionNotes = this.regobj[0].SuggestionNotes;
        this.DoctorId = this.regobj[0].RadResultDr1;
      });
    }

  
  }

  onBlur(e:any){
    this.vTemplateDesc=e.target.innerHTML;
  }

  // doctorlist
  // getDoctorList() {
  //   this._radiologytemplateService.getdoctorCombo().subscribe(data => {
  //     this.Doctorlist = data;
  //     this.filtereddoctor.next(this.Doctorlist.slice());
  //   });
  // }

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
   debugger;
  
      if (!this.selectedAdvanceObj.RadReportId) {
        var m_data = {
          insertRadiologyTemplateMaster: {
            "RadReportID":0,// this._radiologytemplateService.myform.get("RadReportID").value || 1,
            "ReportDate": this._radiologytemplateService.myform.get("ReportDate").value || '11/01/2022',
            "ReportTime": this._radiologytemplateService.myform.get("ReportTime").value || '11/01/2022',
            "IsCompleted":'true',// (this._radiologytemplateService.myform.get("IsCompleted").value).trim(),
            "IsPrinted":'true',//Boolean(JSON.parse(this._radiologytemplateService.myform.get("IsPrinted").value)),
            "RadResultDr1": this._radiologytemplateService.myform.get("DoctorId").value.DoctorId ,
            "RadResultDr2":0,// this._radiologytemplateService.myform.get("DoctorId").value.DoctorId,
            "RadResultDr3":0,// this._radiologytemplateService.myform.get("DoctorId").value.DoctorId,
            "SuggestionNotes": this._radiologytemplateService.myform.get("Suggatationnote").value || '',
            "AdmVisitDoctorID":0,// this._radiologytemplateService.myform.get("DoctorId").value.DoctorId,
            "RefDoctorID": this._radiologytemplateService.myform.get("DoctorId").value.DoctorId || 1,
            "ResultEntry": this._radiologytemplateService.myform.get("ResultEntry").value || '',


          }
        }
        // console.log(m_data);
        this._radiologytemplateService.insertRadiologyTemplateMaster(m_data).subscribe(data => {
          this.msg = data;
          if (data) {
            Swal.fire('Congratulations !', 'Radiology Template Inserted Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._radiologytemplateService.myform.get('TemplateDesc').reset();
                this.dialogRef.close();
                // this.getPrint(this.selectedAdvanceObj.RadReportId);
              }

            });
          } else {
            Swal.fire('Error !', 'Appoinment not saved', 'error');
          }
        });
        // this.notification.success('Record added successfully')
      
       }
       
      else {
        debugger
        var m_dataUpdate = {
          radiologyReportHeaderUpdate: {
            "RadReportID": this.selectedAdvanceObj.RadReportId || 0,// this._radiologytemplateService.myform.get("this.RadReportId").value || 1,
            "ReportDate": this.dateTimeObj.date || '11/01/2022',
            "ReportTime":  this.dateTimeObj.time || '11/01/2022',//this.regobj[0].ReportTime || '11/01/2022',
            "IsCompleted": true,// (this._radiologytemplateService.myform.get("IsCompleted").value).trim(),
            "IsPrinted": true,//Boolean(JSON.parse(this._radiologytemplateService.myform.get("IsPrinted").value)),
            "RadResultDr1": this._radiologytemplateService.myform.get("DoctorId").value.DoctorId || 0,
            "RadResultDr2": 10,// this._radiologytemplateService.myform.get("DoctorId").value.DoctorId,
            "RadResultDr3": 20,// this._radiologytemplateService.myform.get("DoctorId").value.DoctorId,
            "SuggestionNotes": this._radiologytemplateService.myform.get("SuggestionNotes").value || '',
            "AdmVisitDoctorID": 20,// this._radiologytemplateService.myform.get("DoctorId").value.DoctorId,
            "RefDoctorID": 10,// this._radiologytemplateService.myform.get("DoctorId").value.DoctorId || 1,
            "ResultEntry": this._radiologytemplateService.myform.get("ResultEntry").value || '',

          }
        }
        console.log(m_dataUpdate);
        this._radiologytemplateService.RadiologyUpdate(m_dataUpdate).subscribe(data => {
          console.log(data);
          if (data) {
            Swal.fire('Congratulations !', 'Radiology Template Updated Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this.dialogRef.close();
                this._radiologytemplateService.myform.get('TemplateDesc').reset();
                // this.getPrint(this.selectedAdvanceObj.RadReportId);
              }

            });
          } else {
            Swal.fire('Error !', 'Appoinment not saved', 'error');
          }

        });
      }

    
  }

  getPrint(el) {
    debugger;
    var D_data = {
      "RadReportId": el,//82371,
      "OP_IP_Type": 1,//this.selectedAdvanceObj.OP_IP_Type
    }
   
let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
this.subscriptionArr.push(
  this._radiologytemplateService.getRadiologyPrint(D_data).subscribe(res => {
    if(res){
    this.reportPrintObj = res[0] as RadiologyPrint;
    console.log(this.reportPrintObj);
   }
  
    this.getTemplate();
        
  })
);
  }

  // Select * from lvw_Retrieve_PathologyResultIPPatientUpdate where PathReportId in(760617)

  getTemplate() {
    let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=7';
    this._radiologytemplateService.getTemplate(query).subscribe((resData: any) => {
      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['AdmissionDate','RegNo','RadiologyDocName','ReportDate','ResultEntry','PatientName','SuggestionNotes','GenderName','AgeYear','RadReportId','PrintTestName','CategoryName']; // resData[0].TempKeys;
        for (let i = 0; i < keysArray.length; i++) {
          let reString = "{{" + keysArray[i] + "}}";
          let re = new RegExp(reString, "g");
          this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
        }
        this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
        // this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
        setTimeout(() => {
          this.print();
        }, 1000);
    });
  }
  
  // transform2(value: string) {
  //   var datePipe = new DatePipe("en-US");
  //   value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
  //   return value;
  // }
  
  

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


  //Editoe error so comment
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
      <div>${this._radiologytemplateService.myform.get("TemplateName").value}</div>
    `);
    popupWin.document.write(`<body onload="window.print();window.close()">${this._radiologytemplateService.myform.get("TemplateDesc").value}</body>
    </html>`);
    popupWin.document.close();
  }

  print() {

    let popupWin, printContents;
    // printContents =this.printTemplate; // document.getElementById('print-section').innerHTML;
    
    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
    // popupWin.document.open();
    popupWin.document.write(` <html>
    <head><style type="text/css">`);
    popupWin.document.write(`
      </style>
          <title></title>
      </head>
    `);
    popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
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