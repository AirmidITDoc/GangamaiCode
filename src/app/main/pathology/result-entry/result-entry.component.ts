import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ResultEntryService } from './result-entry.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MatSort } from '@angular/material/sort';
import { ResultEntryOneComponent } from './result-entry-one/result-entry-one.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { PathTemplateViewComponent } from './path-template-view/path-template-view.component';
import { ResultEntrytwoComponent } from './result-entrytwo/result-entrytwo.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';

@Component({
  selector: 'app-result-entry',
  templateUrl: './result-entry.component.html',
  styleUrls: ['./result-entry.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ResultEntryComponent implements OnInit {
  SpinLoading: boolean = false;


  displayedColumns: string[] = [

    'Date',
    'Time',
    'RegNo',
    'PatientName',
    'DoctorName',
    'PatientType',
    'PBillNo',
    'GenderName',
    'AgeYear',
    'PathDues'

  ];


  reportPrintObjList: SampleDetailObj[] = [];
  reportPrintObjs: SampleDetailObj;
  currentDate = new Date();
  click: boolean = false;
  printTemplate: any;
  MouseEvent = true;
  screenFromString = 'opd-casepaper';
  PatientTypeList: any = [];
  myformSearch: FormGroup;
  isLoading = true;
  msg: any;
  step = 0;
  dataArray = {};
  sIsLoading: string = '';
  isSampleCollection: boolean = true;
  ServiceIdList: any = [];
  PathReportID: any;
  PathTestId: any
  subscriptionArr: Subscription[] = [];
  reportPrintObj: Templateprintdetail;
  SBillNo: any;
  SOPIPtype: any;
  SFromDate: any;
  PatientName: any;
  OPD_IPD: any;
  Age: any;
  PatientType: any;

  setStep(index: number) {
    this.step = index;
  }
  SearchName: string;


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;



  dataSource = new MatTableDataSource<PatientList>();


  dataSource1 = new MatTableDataSource<SampleList>();
  @ViewChild(MatPaginator) PathTestpaginator: MatPaginator;

  displayedColumns1: string[] = [
    'checkbox',
    'IsTemplateTest',
    'TestName',
    'IsCompleted',
    'Age',
    'SampleCollectionTime',
    'SampleNo',
    'DoctorName',
    'action'

  ];

  hasSelectedContacts: boolean;
  constructor(

    private formBuilder: FormBuilder,
    public _SampleService: ResultEntryService,
    private _ActRoute: Router,
    // public dialogRef: MatDialogRef<PathologresultEntryComponent>,
    public datePipe: DatePipe,
    private reportDownloadService: ExcelDownloadService,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    private accountService: AuthenticationService,
    private _fuseSidebarService: FuseSidebarService,
  ) { }


  ngOnInit(): void {
    this.getPatientsList();
  }

  // validation
  get f() { return this._SampleService.myformSearch.controls; }


  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  getView(contact) {
    console.log(contact);

    let XX = {
      Adm_Visit_docId: contact.Adm_Visit_docId,
      AgeYear: contact.AgeYear,
      CategoryName: contact.CategoryName,
      ChargeId: contact.ChargeId,
      DOA: contact.DOA,
      DOT: contact.DOT,
      DoctorName: contact.DoctorName,
      GenderName: contact.GenderName,
      IsCompleted: contact.IsCompleted,
      IsPrinted: contact.IsPrinted,
      IsSampleCollection: contact.IsSampleCollection,
      IsTemplateTest: contact.IsTemplateTest,
      IsVerifySign: contact.IsVerifySign,
      OPD_IPD_ID: contact.OPD_IPD_ID,
      OPD_IPD_Type: contact.OPD_IPD_Type,
      OP_IP_No: contact.OP_IP_No,
      PBillNo: contact.PBillNo,
      PathReportID: contact.PathReportID,
      PathTestID: contact.PathTestID,
      PatientName: contact.PatientName,
      PatientType: contact.PatientType,
      RegNo: contact.RegNo,
      SampleCollectionTime: contact.SampleCollectionTime,
      SampleNo: contact.SampleNo,
      ServiceId: contact.ServiceId,
      ServiceName: contact.ServiceName,
      VADate: contact.VADate,
      VATime: contact.VATime,
      Visit_Adm_ID: contact.Visit_Adm_ID


    };

    this.advanceDataStored.storage = new Templateprintdetail(XX);
    if (contact.IsTemplateTest) {
      const dialogRef = this._matDialog.open(PathTemplateViewComponent,
        {
          maxWidth: "80vw",
          maxHeight: "100vh", width: '100%', height: "100%"
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
      });
    }
    else {
      const dialogRef = this._matDialog.open(ResultEntryOneComponent,
        {
          maxWidth: "80vw",
          maxHeight: "100vh", width: '100%', height: "100%"
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
      });
    }
  }

  onClose() {
    // this.dialogRef.close();
  }

  onSubmit() { }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }



  onShow(event: MouseEvent) {
    // this.click = false;// !this.click;
    this.click = !this.click;
    // this. showSpinner = true;

    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data';

        this.getPatientsList();
      }

    }, 50);
    this.MouseEvent = true;
    this.click = true;

  }


  onClear() {

    this._SampleService.myformSearch.get('FirstNameSearch').reset();
    this._SampleService.myformSearch.get('LastNameSearch').reset();
    this._SampleService.myformSearch.get('RegNoSearch').reset();
    this._SampleService.myformSearch.get('StatusSearch').reset();
    this._SampleService.myformSearch.get('PatientTypeSearch').reset();
  }

  showdoc() {
    // const dialogRef = this._matDialog.open(NursingNoteComponent,
    //   {
    //     maxWidth: "85vw",
    //     height: '780px',
    //     width: '100%',

    //   });
  }


  onRowSelect(e) {
    console.log(e);
  }

  getPatientsList() {

    this.dataSource1.data = [];
    this.sIsLoading = 'loading-data';
    var m_data = {
      "F_Name": (this._SampleService.myformSearch.get("FirstNameSearch").value).trim() + '%' || '%',
      "L_Name": (this._SampleService.myformSearch.get("LastNameSearch").value).trim() + '%' || '%',
      "Reg_No": (this._SampleService.myformSearch.get("RegNoSearch").value) || 0,
      "From_Dt": this.datePipe.transform(this._SampleService.myformSearch.get("start").value, "yyyy-MM-dd ") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._SampleService.myformSearch.get("end").value, "yyyy-MM-dd") || '01/01/1900',
      "IsCompleted": parseInt(this._SampleService.myformSearch.get("StatusSearch").value) || 0,
      "OP_IP_Type": parseInt(this._SampleService.myformSearch.get("PatientTypeSearch").value) || 0,
    }
console.log(m_data)
    this._SampleService.getPatientList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as PatientList[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
      this.click = false;
      console.log(this.dataSource.data);
    },
      error => {
        this.sIsLoading = '';
      });
  }

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  
  onSearchClear() {
    this._SampleService.myformSearch.reset({ RegNoSearch: '', FirstNameSearch: '', LastNameSearch: '', PatientTypeSearch: '', StatusSearch: '' });
  }

  // for sampledetails tablemyformSearch
  onEdit(m) {

    console.log(m);

    this.PatientName = m.PatientName;
    this.OPD_IPD = m.OP_IP_No
    this.Age = m.AgeYear
    this.PatientType = m.PatientType

    this.SBillNo = m.BillNo;
    this.SOPIPtype = m.OPD_IPD_Type;
    this.SFromDate = this.datePipe.transform(m.PathDate, "yyyy-MM-dd ");

    // debugger
    var m_data = {
      "BillNo": m.BillNo,
      "OP_IP_Type": m.OPD_IPD_Type,
      "From_Dt": this.datePipe.transform(m.PathDate, "yyyy-MM-dd"),
    }
    console.log(m_data);
    //  setTimeout(() => {
    this._SampleService.getSampleList(m_data).subscribe(Visit => {
      this.dataSource1.data = Visit as SampleList[];
      console.log(this.dataSource1.data);

      this.dataSource1.sort = this.sort;
      this.dataSource1.paginator = this.paginator;
      this.sIsLoading = '';
      this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });

  }

  SearchTest($event) {
// debugger
    var m_data = {
      "BillNo": this.SBillNo,
      "OP_IP_Type": this.SOPIPtype,
      "IsCompleted": this._SampleService.myformSearch.get("TestStatusSearch").value || 0,
      // "From_Dt": this.datePipe.transform(this.SFromDate, "yyyy-MM-dd "),
    }
    console.log(m_data);
    //  setTimeout(() => {
    this._SampleService.getTestList(m_data).subscribe(Visit => {
      this.dataSource1.data = Visit as SampleList[];
      console.log(this.dataSource1.data);

      // if (this.dataSource1.data[0].IsCompleted) {

      // }

      this.dataSource1.sort = this.sort;
      this.dataSource1.paginator = this.paginator;
      this.sIsLoading = '';
      this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });
  }

  // for sample detail table to resultentry page
  onresultentry(m) {
    console.log(m);
    let xx = {
      RegNo: m.RegNo,
      AdmissionID: m.VisitId,
      // PatientName: m.PatientName,
      Doctorname: m.DoctorName,
      AdmDocId: m.Adm_Visit_docId,
      AdmDateTime: m.DOA,
      // AgeYear: m.AgeYear,
      WardName: m.WardName,
      PathReportID: m.PathReportID,
      TestId: m.PathTestID,
      PathTemplateId: m.PathTemplateId,
      ServiceId: m.ServiceId,
      CategoryID: m.CategoryID,
      TemplateDesc: m.TemplateDesc,
      PathResultDr1: m.PathResultDr1,

      PatientName: this.PatientName,
      OP_IP_No: this.OPD_IPD,
      AgeYear: this.Age,
      PatientType: this.PatientType

    };
    this.advanceDataStored.storage = new SampleDetailObj(xx);
    // this.ServiceIdList.push(m.ServiceId);
    console.log(m);
    // debugger
    if (m.IsTemplateTest == 1) {
      this.advanceDataStored.storage = new SampleDetailObj(xx);
      const dialogRef = this._matDialog.open(ResultEntrytwoComponent,
        {
          maxWidth: "90%",
          height: '95%',
          width: '100%',
          data: {
            "OP_IP_Type": m.OPD_IPD_Type,
            "OPD_IPD_ID": m.OPD_IPD_ID,
            "ServiceId": m.ServiceId,
            "IsCompleted": m.IsCompleted,
            "PathReportID": m.PathReportID,
            "TestId": m.PathTestID,
            "PathTemplateId": m.PathTemplateId,
            "CategoryID": m.CategoryID,
            "SampleDetailObj": m.SampleDetailObj,
            "DoctorId": m.PathResultDr1,
            "PathTestID": m.PathTestID,
            "TemplateDesc": m.TemplateDesc
          }
        });


      dialogRef.afterClosed().subscribe(result => {
        console.log('Pathology Template  Saved ..', result);
      });
    }
    else {
      this.advanceDataStored.storage = new SampleDetailObj(xx);
      const dialogRef = this._matDialog.open(ResultEntryOneComponent,
        {
          maxWidth: "95vw",
          height: '670px',
          width: '100%',
          data: {
            "RegNo": m.RegNo,
            "OP_IP_Type": m.OPD_IPD_Type,
            "OPD_IPD_ID": m.OPD_IPD_ID,
            "ServiceId": m.ServiceId,
            "IsCompleted": m.IsCompleted,
            "PathReportID": m.PathReportID,
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('PathologyResult Saved ..', result);
      });
    }
  }

  convertToWord(e) {
    // this.numberInWords= converter.toWords(this.mynumber);
    // return converter.toWords(e);
  }

 

  AdList: boolean = false;
  viewgetPathologyTemplateReportPdf(obj) {
    setTimeout(() => {
      this.SpinLoading = true;
      this.AdList = true;
      this._SampleService.getPathTempReport(
        53473, 1
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pathology Template  Viewer"
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            this.AdList=false;
            this.SpinLoading = false;
          });
      });

    }, 100);
  }



  viewgetPathologyTestReportPdf(PathReportId,obj) {
    debugger
    setTimeout(() => {
      this.SpinLoading = true;
      this.AdList = true;
      this._SampleService.getPathTestReport(
        20740,2
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "pathology Test  Viewer"
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            this.AdList=false;
            this.SpinLoading = false;
          });
      });

    }, 100);
  }

  // getPrintPathologyReport(el) {

  //   var D_data = {
  //     "OP_IP_Type": 1,// el.OPD_IPD_Type

  //   }
  //   // trucate pathology Record
  //   let TruncateQuery = "Truncate Table Temp_PathReportId"
  //   this._SampleService.getInsertStatementQuery(TruncateQuery).subscribe((resData: any) => {
  //     var m = resData;
  //   });

  //   // Insert pathology Id for report
  //   let InsertQuery = "insert into Temp_PathReportId (PathReportId) values ('" + el.PathReportID + "')"
  //   this._SampleService.getInsertStatementQuery(InsertQuery).subscribe((resData: any) => {
  //     var m = resData;
  //   });

  //   let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
  //   this.subscriptionArr.push(
  //     this._SampleService.getPathologyPrint(D_data).subscribe(res => {
  //       this.reportPrintObjList = res as SampleDetailObj[];
  //       console.log(this.reportPrintObjList);
  //       this.reportPrintObjs = res[0] as SampleDetailObj;

  //       this.getTemplateMultiple();


  //     })
  //   );
  //   // }
  //   // else{}
  // }

  // // PRINT 
  // prints() {
  //   // HospitalName, HospitalAddress, AdvanceNo, PatientName
  //   let popupWin, printContents;
  //   // printContents =this.printTemplate; // document.getElementById('print-section').innerHTML;

  //   popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
  //   // popupWin.document.open();
  //   popupWin.document.write(` <html>
  //   <head><style type="text/css">`);
  //   popupWin.document.write(`
  //     </style>
  //         <title></title>
  //     </head>
  //   `);
  //   popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
  //   </html>`);
  //   popupWin.document.close();
  // }



  onExport(exprtType) {
    // // debugger;
    // let columnList=[];
    // if(this.dataSource.data.length == 0){
    //   // this.toastr.error("No Data Found");
    //   Swal.fire('Error !', 'No Data Found', 'error');
    // }
    // else{
    //   var excelData = [];
    //   var a=1;
    //   for(var i=0;i<this.dataSource.data.length;i++){
    //     let singleEntry = {
    //       // "Sr No":a+i,
    //       "RegNo" :this.dataSource.data[i]["RegNo"] ? this.dataSource.data[i]["RegNo"] :"N/A",
    //       "OPD_IPD_ID" :this.dataSource.data[i]["OPD_IPD_ID"],
    //       "Admission Date" :this.dataSource.data[i]["DOA"] ? this.dataSource.data[i]["DOA"]:"N/A",
    //       "Admission Time" :this.dataSource.data[i]["DOT"] ? this.dataSource.data[i]["DOT"]:"N/A",
    //       "Patient Name" :this.dataSource.data[i]["PatientName"] ? this.dataSource.data[i]["PatientName"]:"N/A",
    //       "PatientType" :this.dataSource.data[i]["PatientType"] ? this.dataSource.data[i]["PatientType"] :"N/A",
    //       "PBillNo" :this.dataSource.data[i]["PBillNo"] ? this.dataSource.data[i]["PBillNo"] : "N/A",
    //       "GenderName" :this.dataSource.data[i]["GenderName"] ? this.dataSource.data[i]["GenderName"] :"N/A",
    //       "AgeYear" :this.dataSource.data[i]["AgeYear"] ? this.dataSource.data[i]["AgeYear"] : "N/A",


    //     };
    //     excelData.push(singleEntry);
    //   }
    //   var fileName = "Pathology-ResultEntry-List " + new Date() +".xlsx";
    //   if(exprtType =="Excel"){
    //     const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(excelData);
    //     var wscols = [];
    //     if(excelData.length > 0){ 
    //       var columnsIn = excelData[0]; 
    //       for(var key in columnsIn){
    //         let headerLength = {wch:(key.length+1)};
    //         let columnLength = headerLength;
    //         try{
    //           columnLength = {wch: Math.max(...excelData.map(o => o[key].length), 0)+1}; 
    //         }
    //         catch{
    //           columnLength = headerLength;
    //         }
    //         if(headerLength["wch"] <= columnLength["wch"]){
    //           wscols.push(columnLength)
    //         }
    //         else{
    //           wscols.push(headerLength)
    //         }
    //       } 
    //     }
    //     ws['!cols'] = wscols;
    //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    //     XLSX.writeFile(wb, fileName);
    //   }else{
    //     let doc = new jsPDF('p','pt', 'a4');
    //     doc.page = 0;
    //     var col=[];
    //     for (var k in excelData[0]) col.push(k);
    //       console.log(col.length)
    //     var rows = [];
    //     excelData.forEach(obj => {
    //       console.log(obj)
    //       let arr = [];
    //       col.forEach(col => {
    //         arr.push(obj[col]);
    //       });
    //       rows.push(arr);
    //     });

    //     doc.autoTable(col, rows,{
    //       margin:{left:5,right:5,top:5},
    //       theme:"grid",
    //       styles: {
    //         fontSize: 3
    //       }});
    //     doc.setFontSize(3);
    //     // doc.save("Indoor-Patient-List.pdf");
    //     window.open(URL.createObjectURL(doc.output("blob")))
    //   }
    // }
  }


  onExport1(exprtType) {
    // // debugger;
    // let columnList=[];
    // if(this.dataSource1.data.length == 0){
    //   // this.toastr.error("No Data Found");
    //   Swal.fire('Error !', 'No Data Found', 'error');
    // }
    // else{
    //   var excelData = [];
    //   var a=1;
    //   for(var i=0;i<this.dataSource1.data.length;i++){
    //     let singleEntry = {
    //       // "Sr No":a+i,
    //       "ServiceName" :this.dataSource1.data[i]["ServiceName"] ? this.dataSource1.data[i]["ServiceName"] :"N/A",
    //       "IsCompleted" :this.dataSource1.data[i]["IsCompleted"],
    //       "IsSampleCollection" :this.dataSource1.data[i]["IsSampleCollection"] ? this.dataSource1.data[i]["IsSampleCollection"]:"N/A",
    //       "SampleCollectionTime" :this.dataSource1.data[i]["SampleCollectionTime"] ? this.dataSource1.data[i]["SampleCollectionTime"]:"N/A",
    //       "PathTestID" :this.dataSource1.data[i]["PathTestID"] ? this.dataSource1.data[i]["PathTestID"]:"N/A",


    //     };
    //     excelData.push(singleEntry);
    //   }
    //   var fileName = "Pathology-TestDetails " + new Date() +".xlsx";
    //   if(exprtType =="Excel"){
    //     const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(excelData);
    //     var wscols = [];
    //     if(excelData.length > 0){ 
    //       var columnsIn = excelData[0]; 
    //       for(var key in columnsIn){
    //         let headerLength = {wch:(key.length+1)};
    //         let columnLength = headerLength;
    //         try{
    //           columnLength = {wch: Math.max(...excelData.map(o => o[key].length), 0)+1}; 
    //         }
    //         catch{
    //           columnLength = headerLength;
    //         }
    //         if(headerLength["wch"] <= columnLength["wch"]){
    //           wscols.push(columnLength)
    //         }
    //         else{
    //           wscols.push(headerLength)
    //         }
    //       } 
    //     }
    //     ws['!cols'] = wscols;
    //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    //     XLSX.writeFile(wb, fileName);
    //   }else{
    //     let doc = new jsPDF('p','pt', 'a4');
    //     doc.page = 0;
    //     var col=[];
    //     for (var k in excelData[0]) col.push(k);
    //       console.log(col.length)
    //     var rows = [];
    //     excelData.forEach(obj => {
    //       console.log(obj)
    //       let arr = [];
    //       col.forEach(col => {
    //         arr.push(obj[col]);
    //       });
    //       rows.push(arr);
    //     });

    //     doc.autoTable(col, rows,{
    //       margin:{left:5,right:5,top:5},
    //       theme:"grid",
    //       styles: {
    //         fontSize: 3
    //       }});
    //     doc.setFontSize(3);
    //     // doc.save("Indoor-Patient-List.pdf");
    //     window.open(URL.createObjectURL(doc.output("blob")))
    //   }
    // }
  }
 
  exportResultentryReportExcel(){
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['Date', 'Time', 'RegNo', 'PatientName', 'DoctorName', 'PatientType', 'PBillNo','GenderName','AgeYear','PathDues'];
    this.reportDownloadService.getExportJsonData(this.dataSource.data, exportHeaders, 'Result Entry');
    this.dataSource.data = [];
    this.sIsLoading = '';
  }

  exportReportPdf() {
    let actualData = [];
    this.dataSource.data.forEach(e => {
      var tempObj = [];
      tempObj.push(e.DOA);
      tempObj.push(e.DOT);
      // tempObj.push(e.DVisitDate);
      tempObj.push(e.RegNo);
      tempObj.push(e.DoctorName);
      tempObj.push(e.PatientType);
      tempObj.push(e.PBillNo);
      tempObj.push(e.GenderName);
      tempObj.push(e.AgeYear);
      // tempObj.push(e.PathAmount);
      actualData.push(tempObj);
    });
    let headers = [['Date', 'Time', 'RegNo', 'DoctorName', 'PatientType', 'PBillNo', 'GenderName','AgeYear','PathAmount']];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'Result Entry');
  }
}


export class PatientList {
  DOA: Date;
  DOT: Date;
  RegNo: any;
  PatientName: String;
  PBillNo: number;
  PatientType: number;
  DoctorName: String;
  AgeYear: any;
  GenderName: String;

  constructor(PatientList) {
    this.DOA = PatientList.DOA || '0';
    this.DOT = PatientList.DOT;
    this.RegNo = PatientList.RegNo;
    this.PatientName = PatientList.PatientName;
    this.PBillNo = PatientList.PBillNo;
    this.PatientType = PatientList.PatientType || '0';
    this.DoctorName = PatientList.DoctorName || 1;
    this.AgeYear = PatientList.AgeYear || 0;
    this.GenderName = PatientList.GenderName;


  }

}

export class SampleList {
  VADate: Date;
  ServiceName: String;
  IsSampleCollection: boolean;
  SampleCollectionTime: Date;
  PathTestID: any;
  IsVerifySign: boolean;
  TemplateDesc: String;
  IsCompleted: boolean;
  constructor(SampleList) {
    this.VADate = SampleList.VADate || '';
    this.ServiceName = SampleList.ServiceName || '';
    this.IsSampleCollection = SampleList.IsSampleCollection || 0;
    this.SampleCollectionTime = SampleList.SampleCollectionTime || '';
    this.PathTestID = SampleList.PathTestID || 0;
    this.IsVerifySign = SampleList.IsVerifySign || 0;
    this.TemplateDesc = SampleList.TemplateDesc || '';
    this.IsCompleted = SampleList.IsCompleted || 0;
  }

}

export class SampleDetailObj {
  RegNo: Number;
  AdmissionID: Number;
  PatientName: string;
  AdmDocId: number;
  Doctorname: string;
  AdmDateTime: string;
  AgeDay: number;
  AgeMonth: number;
  AgeYear: number;
  ClassId: number;
  TariffName: String;
  TariffId: number;
  PathReportID: any;
  TestId: any;
  PathTemplateId: any;
  PrintTestName: any;
  CategoryID: any;
  ReportDate: any;
  PrintParameterName: string;
  NormalRange: any;
  ResultValue: any;
  VisitTime: any;
  VisitDate: any;
  Age: number;
  GenderName: any;
  ConsultantDocName: string;
  OP_IP_Type: number;
  Adm_Visit_Time: any;
  TemplateDesc: any;
  Path_ConsultantDocname: any;
  RoomName: any;
  BedName: any;
  PathDate: any;
  PathTime: any;
  PathResultDr1: any;
  PathTestID: any;

  /**
  * Constructor
  *
  * @param SampleDetailObj
  */
  constructor(SampleDetailObj) {
    {
      this.RegNo = SampleDetailObj.RegNo || 0;
      this.AdmissionID = SampleDetailObj.AdmissionID || '';
      this.PatientName = SampleDetailObj.PatientName || '';
      this.Doctorname = SampleDetailObj.Doctorname || '';
      this.AdmDateTime = SampleDetailObj.AdmDateTime || '';
      this.AgeDay = SampleDetailObj.AgeDay || '';
      this.AgeMonth = SampleDetailObj.AgeMonth || '';
      this.AgeYear = SampleDetailObj.AgeYear || '';
      this.ClassId = SampleDetailObj.ClassId || '';
      this.TariffName = SampleDetailObj.TariffName || '';
      this.TariffId = SampleDetailObj.TariffId || '';
      this.PathReportID = SampleDetailObj.PathReportID || '';
      this.TestId = SampleDetailObj.TestId || 0;
      this.PathTemplateId = SampleDetailObj.PathTemplateId || 0;
      this.CategoryID = SampleDetailObj.CategoryID || 0;
      this.AdmDocId = SampleDetailObj.AdmDocId || 0;
      this.PrintParameterName = SampleDetailObj.PrintParameterName || '';
      this.NormalRange = SampleDetailObj.NormalRange || '';
      this.ResultValue = SampleDetailObj.ResultValue || '';
      this.VisitTime = SampleDetailObj.VisitTime || '';
      this.VisitDate = SampleDetailObj.VisitDate || '';
      this.OP_IP_Type = SampleDetailObj.OP_IP_Type || 0;
      this.ConsultantDocName = SampleDetailObj.ConsultantDocName || '';
      this.Adm_Visit_Time = SampleDetailObj.Adm_Visit_Time || '';
      this.ReportDate = SampleDetailObj.ReportDate || '';
      this.TemplateDesc = SampleDetailObj.TemplateDesc || '';
      this.PrintTestName = SampleDetailObj.PrintTestName || '';
      this.Path_ConsultantDocname = SampleDetailObj.Path_ConsultantDocname || '';
      this.PathResultDr1 = SampleDetailObj.PathResultDr1 || 0;
      this.BedName = SampleDetailObj.BedName || '';
      this.RoomName = SampleDetailObj.RoomName || '';
      this.PathDate = SampleDetailObj.PathDate || '';
      this.PathTime = SampleDetailObj.PathTime || '';
      this.PathTestID = SampleDetailObj.PathTestID || 0;
    }
  }
}


export class Templateprintdetail {
  Adm_Visit_docId: Number;
  AgeYear: number;
  CategoryName: String;
  ChargeId: number;
  DOA: Date;
  DOT: Date;
  DoctorName: string;
  GenderName: String;
  IsCompleted: boolean;
  IsPrinted: boolean;
  IsSampleCollection: boolean;
  IsTemplateTest: boolean;
  IsVerifySign: boolean;
  OPD_IPD_ID: number;
  OPD_IPD_Type: number;
  OP_IP_No: number;
  PBillNo: number;
  PathReportID: number;
  PathTestID: any;
  PatientName: string;
  PatientType: String;
  RegNo: number;
  SampleCollectionTime: Date;
  SampleNo: string;
  ServiceId: number;
  ServiceName: String;
  VADate: Date;
  VATime: Date;
  Visit_Adm_ID: any;
  ReportDate: Date;
  PathTemplateDetailsResult: any;
  /**
   * Constructor
   *
   * @param Templateprintdetail
   */
  constructor(Templateprintdetail) {
    {
      this.Adm_Visit_docId = Templateprintdetail.Adm_Visit_docId || '';
      this.AgeYear = Templateprintdetail.AgeYear || '';
      this.CategoryName = Templateprintdetail.CategoryName || '';
      this.ChargeId = Templateprintdetail.ChargeId || '';
      this.DOA = Templateprintdetail.DOA || '';
      this.DOT = Templateprintdetail.DOT || '';
      this.DoctorName = Templateprintdetail.DoctorName || '';
      this.GenderName = Templateprintdetail.GenderName || '';
      this.IsPrinted = Templateprintdetail.IsPrinted || '';
      this.IsSampleCollection = Templateprintdetail.IsSampleCollection || '';
      this.IsTemplateTest = Templateprintdetail.IsTemplateTest || '';

      this.IsVerifySign = Templateprintdetail.IsVerifySign || '';
      this.OPD_IPD_ID = Templateprintdetail.OPD_IPD_ID || '';
      this.OPD_IPD_Type = Templateprintdetail.OPD_IPD_Type || '';
      this.OP_IP_No = Templateprintdetail.OP_IP_No || '';
      this.PBillNo = Templateprintdetail.PBillNo || '';
      this.PathReportID = Templateprintdetail.PathReportID || '';

      this.PathTestID = Templateprintdetail.PathTestID || '';

      this.PatientName = Templateprintdetail.PatientName || '';
      this.PatientType = Templateprintdetail.PatientType || '';
      this.RegNo = Templateprintdetail.RegNo || '';
      this.SampleCollectionTime = Templateprintdetail.SampleCollectionTime || '';
      this.SampleNo = Templateprintdetail.SampleNo || '';
      this.ServiceId = Templateprintdetail.ServiceId || '';
      this.ServiceName = Templateprintdetail.ServiceName || '';
      this.VADate = Templateprintdetail.VADate || '';
      this.VATime = Templateprintdetail.VATime || '';
      this.Visit_Adm_ID = Templateprintdetail.Visit_Adm_ID || '';
      this.ReportDate = Templateprintdetail.ReportDate || '';
      this.PathTemplateDetailsResult = Templateprintdetail.PathTemplateDetailsResult || '';
    }
  }

}

//
