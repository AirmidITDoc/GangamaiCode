import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Subscription } from 'rxjs';
import { RadioloyOrderlistService } from './radioloy-orderlist.service';
import { ResultEntryComponent } from './result-entry/result-entry.component';
import { RadiologyTemplateReportComponent } from './radiology-template-report/radiology-template-report.component';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-radiology-order-list',
  templateUrl: './radiology-order-list.component.html',
  styleUrls: ['./radiology-order-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RadiologyOrderListComponent implements OnInit {

  click: boolean = false;
  MouseEvent = true;
  CategoryList: any = [];
  screenFromString = 'opd-casepaper';
  PatientTypeList: any = [];
  myFilterform: FormGroup;
  isLoading = true;
  msg: any;
  step = 0;
  dataArray = {};
  sIsLoading: string = '';
  hasSelectedContacts: boolean;
  menuActions: Array<string> = [];
  reportdata: any = [];
  templateHeading: any;
  currentDate = new Date();
  reportPrintObj: RadiologyPrint;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  SBillNo: any;
  SOPIPtype: any;
  SFromDate: any;

  setStep(index: number) {
    this.step = index;
  }
  SearchName: string;


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  dataSource = new MatTableDataSource<RadioPatientList>();
  displayedColumns: string[] = [
    'IsCompleted',
    'PatientType', 
    'RadDate',
    'RegNo',
    'PatientName',
    'DoctorName', 
    'AgeGender',
    'ServiceName',
    'PBillNo',
    'MobileNo',
    'CompanyName',
    'RefDoctorName',
    'action'

  ];

  dataSource1 = new MatTableDataSource<RadioPatientList>();
  displayedColumns1: string[] = [
    'checkbox',
    // 'VADate',
    'ServiceName',
    'IsCompleted',
    'IsSampleCollection',
    // 'SampleCollectionTime',
    'RadTestID',
    'action',
    // 'IsVerifySign',
    // 'IsTemplateTest'
    // 'PathReportID',
    // 'buttons' 
  ];

  constructor(

    private formBuilder: FormBuilder,
    public _RadiologyOrderListService: RadioloyOrderlistService,
    private _ActRoute: Router,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    public _SampleService: RadioloyOrderlistService,
    private accountService: AuthenticationService,
    private _fuseSidebarService: FuseSidebarService,
  ) { }

  ngOnInit(): void {
    this.getcaterorylist();
    this.getRadiologyPatientsList();


    // if (this._ActRoute.url == '/radiology/radiology-order-list')
    //   {
    //         this.menuActions.push('Template Details');

    //   }
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }


  getcaterorylist() {
    this._RadiologyOrderListService.getCategoryNameCombo().subscribe(data => this.CategoryList = data);
  }

  onClose() {
    //  this.dialogRef.close();
  }

  SearchTest() {
    var m_data = {
      "BillNo": this.SBillNo,
      "OP_IP_Type": this.SOPIPtype,
      "IsCompleted": this._SampleService.myformSearch.get("TestStatusSearch").value || 0,
      // "From_Dt": this.datePipe.transform(this.SFromDate, "yyyy-MM-dd "),
    }
    console.log(m_data);
    //  setTimeout(() => {
    this._SampleService.getTestList(m_data).subscribe(Visit => {
      this.dataSource1.data = Visit as RadioPatientList[];
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

  onSubmit() { }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }



  onShow(event: MouseEvent) { 
    this.click = !this.click;  
    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data'; 
        this.getRadiologyPatientsList();
      }

    }, 500);
    this.MouseEvent = true;
    this.click = true; 
  }


  onClear() {

    this._RadiologyOrderListService.myformSearch.get('FirstNameSearch').reset();
    this._RadiologyOrderListService.myformSearch.get('LastNameSearch').reset();
    this._RadiologyOrderListService.myformSearch.get('RegNoSearch').reset();
    this._RadiologyOrderListService.myformSearch.get('StatusSearch').reset();
    this._RadiologyOrderListService.myformSearch.get('PatientTypeSearch').reset();
    this._RadiologyOrderListService.myformSearch.get('CategoryId').reset();
  }



  getRadiologyPatientsList() {
    this.sIsLoading = 'loading-data';
    var m_data = {
      "F_Name": (this._RadiologyOrderListService.myformSearch.get("FirstNameSearch").value).trim() + '%' || '%',
      "L_Name": (this._RadiologyOrderListService.myformSearch.get("LastNameSearch").value).trim() + '%' || '%',
      "Reg_No": this._RadiologyOrderListService.myformSearch.get("RegNoSearch").value || 0,
      "From_Dt": this.datePipe.transform(this._RadiologyOrderListService.myformSearch.get("start").value, "MM-dd-yyyy") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._RadiologyOrderListService.myformSearch.get("end").value, "MM-dd-yyyy") || '01/01/1900',
      "IsCompleted": this._RadiologyOrderListService.myformSearch.get("StatusSearch").value || 0,
      "OP_IP_Type": this._RadiologyOrderListService.myformSearch.get("PatientTypeSearch").value || 0,
      "CategoryId": this._RadiologyOrderListService.myformSearch.get("CategoryId").value || 0,
    }
    console.log(m_data);
    this._RadiologyOrderListService.getRadiologyOrderList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as RadioPatientList[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource.data);
      this.sIsLoading = '';
      this.click = false;

    },
      error => {
        this.sIsLoading = '';
      });

  }

  onSearchClear() {
    this._RadiologyOrderListService.myformSearch.reset({ RegNoSearch: '', FirstNameSearch: '', LastNameSearch: '', PatientTypeSearch: '', StatusSearch: '' });
  }

  getRecord(contact): void {
    console.log(contact);
    let xx = {
      RegNo: contact.RegNo,
      AdmissionID: contact.VisitId,
      PatientName: contact.PatientName,
      Doctorname: contact.ConsultantDoctor,
      AdmDateTime: contact.AdmissionTime,
      AgeYear: contact.AgeYear,
      RadReportId: contact.RadReportId,
      RadTestID: contact.RadTestID, 
      PatientType: contact.PatientType,
      GenderName: contact.GenderName,
      AdmissionDate: contact.AdmissionDate,
      CategoryName: contact.CategoryName,
      ChargeId: contact.ChargeId,
      ConsultantDoctor: contact.ConsultantDoctor,
      OPD_IPD_ID: contact.OPD_IPD_ID,
      OPDNo: contact.OP_IP_Number,
      PBillNo: contact.PBillNo,
      RadDate: contact.RadDate,
      ServiceName: contact.ServiceName,
      TestName: contact.TestName,
      OP_IP_Type: contact.OP_IP_Type,
    };
    this.advanceDataStored.storage = new RadiologyPrint(xx);
    const dialogRef = this._matDialog.open(ResultEntryComponent,
      {
        maxWidth: "90%",
        height: '95%',
        width: '100%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getRadiologyPatientsList();
    });
  }

  getView(contact) {
    debugger;
    console.log(contact);
    let xx = {
      RegNo: contact.RegNo,
      PatientName: contact.PatientName,
      PatientType: contact.PatientType,
      GenderName: contact.GenderName,
      AdmissionDate: contact.AdmissionDate,
      AgeYear: contact.AgeYear,
      CategoryName: contact.CategoryName,
      ChargeId: contact.ChargeId,
      ConsultantDoctor: contact.ConsultantDoctor,
      OPDNo: contact.OPD_IPD_ID,
      OP_IP_Number: contact.OP_IP_Number,
      PBillNo: contact.PBillNo,
      RadDate: contact.RadDate,
      RadReportId: contact.RadReportId,
      RadTestID: contact.RadTestID,
      ServiceName: contact.ServiceName,
      TestName: contact.TestName,
      OP_IP_Type: contact.OPD_IPD_Type,
      // Visit_Adm_ID: contact.PBillNo,

    };

    this.advanceDataStored.storage = new RadiologyPrint(xx);

    const dialogRef = this._matDialog.open(RadiologyTemplateReportComponent,
      {
        maxWidth: "95vw",
        maxHeight: "130vh", width: '100%', height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      //  this.getRadiologytemplateMasterList();
    });
  }



  onEdit(row, m) {

    this.SBillNo = m.PBillNo;
    this.SOPIPtype = m.OPD_IPD_Type;
    this.SFromDate = this.datePipe.transform(m.PathDate, "yyyy-MM-dd ");
    console.log(m);
    debugger;
    var m_data = {
      "BillNo": m.PBillNo,
      "OP_IP_Type": m.OPD_IPD_Type,
      // "From_Dt": this.datePipe.transform(m.PathDate, "yyyy-MM-dd"),
    }
    console.log(m_data);
    //  setTimeout(() => {
    this._SampleService.getRadioTestDetails(m_data).subscribe(Visit => {
      this.dataSource1.data = Visit as RadioPatientList[];
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

  // onAdd() {
  //   this.onClear();
  //   const dialogRef = this._matDialog.open(EditorComponent,
  //     {
  //       maxWidth: "90vw",
  //       maxHeight: "95vh",
  //       width: '100%',
  //       height: "95%"
  //     });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed - Insert Action', result);
  //     // this.getRadiologytemplateMasterList();
  //   });
  // }


  PrintData(TemplateId) {
    debugger;
    var D_data = {
      "TemplateId": TemplateId,
    }
    this._RadiologyOrderListService.Print(D_data).subscribe(report => {
      this.reportdata = report;
      console.log(this.reportdata);
      this.printTemplate = report[0].TemplateDesc;
      this.templateHeading = report[0].TemplateName
      this.print();
    });
  }

  getTemplate() {
    let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=7';
    this._RadiologyOrderListService.getTemplate(query).subscribe((resData: any) => {
      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['RegNo', 'RadiologyDocName', 'ReportDate', 'ResultEntry', 'PatientName', 'SuggestionNotes', 'GenderName', 'AgeYear', 'RadReportId', 'PrintTestName', 'CategoryName', 'IPDNo', 'AgeDay', 'AgeMonth']; // resData[0].TempKeys;
      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      setTimeout(() => {
        this.print();
      }, 1000);
    });
  }

  transform2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
  }

  getPrint(el) {
    debugger;
    // console.log(el);
    var D_data = {

      "RadReportId": 94377,//el.RadReportId,//87385
      "OP_IP_Type": 0,//el.OPD_IPD_Type
    }

    let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
    this.subscriptionArr.push(
      this._RadiologyOrderListService.getRadiologyPrint(D_data).subscribe(res => {
        if (res) {
          this.reportPrintObj = res[0] as RadiologyPrint;
          console.log(this.reportPrintObj);
        }

        this.getTemplate();

      })
    );
  }


  viewgetRadioloyTemplateReportPdf(obj) {
    debugger
    this._RadiologyOrderListService.getRadiologyTempReport(
      obj.RadReportId,0
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

  onExport(exprtType) {
    // debugger;
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
    //       "Radiology Date" :this.dataSource.data[i]["RadDate"] ? this.dataSource.data[i]["RadDate"]:"N/A",
    //       "Radiology Time" :this.dataSource.data[i]["RadTime"] ? this.dataSource.data[i]["RadTime"]:"N/A",
    //       "ConsultantDoctor Name" :this.dataSource.data[i]["ConsultantDoctor"] ? this.dataSource.data[i]["ConsultantDoctor"]:"N/A",
    //       "PatientType" :this.dataSource.data[i]["PatientType"] ? this.dataSource.data[i]["PatientType"] :"N/A",
    //       "AgeDay" :this.dataSource.data[i]["AgeDay"] ? this.dataSource.data[i]["AgeDay"] : "N/A",
    //       "AgeMonth" :this.dataSource.data[i]["AgeMonth"] ? this.dataSource.data[i]["AgeMonth"] :"N/A",
    //       "AgeYear" :this.dataSource.data[i]["AgeYear"] ? this.dataSource.data[i]["AgeYear"] : "N/A",
    //       "GenderName'" :this.dataSource.data[i]["GenderName'"] ? this.dataSource.data[i]["GenderName'"] :"N/A",
    //       "PBillNo" :this.dataSource.data[i]["PBillNo"] ? this.dataSource.data[i]["PBillNo"] : "N/A",


    //     };
    //     excelData.push(singleEntry);
    //   }
    //   var fileName = "Radiology-Order-List " + new Date() +".xlsx";
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
}


export class RadioPatientList {
  RadDate: Date;
  RadTime: Date;
  RegNo: any;
  PatientName: String;
  PatientType: number;
  TestName: String;
  ConsultantDoctor: any;
  CategoryName: String;
  AgeYear: number;
  GenderName: String;
  PBillNo: number;
  OPD_IPD_ID: any;


  constructor(RadioPatientList) {
    this.RadDate = RadioPatientList.RadDate || '';
    this.RadTime = RadioPatientList.RadTime;
    this.RegNo = RadioPatientList.RegNo;
    this.PatientName = RadioPatientList.PatientName;
    this.PBillNo = RadioPatientList.PBillNo;
    this.PatientType = RadioPatientList.PatientType || '0';
    this.ConsultantDoctor = RadioPatientList.ConsultantDoctor || '';
    this.TestName = RadioPatientList.TestName || '0';
    this.CategoryName = RadioPatientList.CategoryName || '';
    this.AgeYear = RadioPatientList.AgeYear;
    this.GenderName = RadioPatientList.GenderName;
    this.OPD_IPD_ID = RadioPatientList.OPD_IPD_ID || '';
  }

}

export class Templateinfo {

  RegNo: Number;
  AdmissionID: Number;
  PatientName: string;
  Doctorname: string;
  AdmDateTime: string;
  AgeYear: number;
  RadReportId: number;
  RadTestID: String;


  /**
  * Constructor
  *
  * @param Templateinfo
  */
  constructor(Templateinfo) {
    {
      this.RegNo = Templateinfo.RegNo || '';
      this.AdmissionID = Templateinfo.AdmissionID || '';
      this.PatientName = Templateinfo.PatientName || '';
      this.Doctorname = Templateinfo.Doctorname || '';
      this.AdmDateTime = Templateinfo.AdmDateTime || '';
      this.AgeYear = Templateinfo.AgeYear || '';
      this.RadReportId = Templateinfo.RadReportId || '';
      this.RadTestID = Templateinfo.RadTestID || '';

    }
  }
}


export class RadiologyPrint {
  RegNo: Number;
  AdmissionID: Number;
  PatientName: string;
  Doctorname: string;
  AdmDateTime: string;
  AgeYear: number;
  RadReportId: number;
  RadTestID: String; 
  RadDate: Date;
  RadTime: Date; 
  PatientType: any;
  TestName: String;
  ConsultantDoctor: any;
  CategoryName: String; 
  GenderName: String;
  PBillNo: number;
  AdmissionDate: Date;
  VisitDate: Date;
  VisitTime: Date;
  OPDNo: number;
  IPDNo: number;
  ReportDate: Date;
  ReportTime: Date;
  ResultEntry: String;
  RadiologyDocName: string;
  SuggestionNotes: string;
  UserName: string;
  PrintTestName: string;
  Education: string;
  AgeDay: any;
  ChargeId: number;
  ServiceName: String;
  OP_IP_Type: any;

  constructor(RadiologyPrint) {
    this.RadDate = RadiologyPrint.RadDate || '';
    this.RadTime = RadiologyPrint.RadTime;
    this.RegNo = RadiologyPrint.RegNo;
    this.PatientName = RadiologyPrint.PatientName;
    this.PBillNo = RadiologyPrint.PBillNo;
    this.PatientType = RadiologyPrint.PatientType || '0';
    this.ConsultantDoctor = RadiologyPrint.ConsultantDoctor || '';
    this.TestName = RadiologyPrint.TestName || '0';
    this.CategoryName = RadiologyPrint.CategoryName || '';
    this.AgeYear = RadiologyPrint.AgeYear;
    this.GenderName = RadiologyPrint.GenderName;
    this.AdmissionDate = RadiologyPrint.AdmissionDate || '';
    this.VisitDate = RadiologyPrint.VisitDate || '';
    this.VisitTime = RadiologyPrint.VisitTime;
    this.OPDNo = RadiologyPrint.OPDNo;
    this.IPDNo = RadiologyPrint.IPDNo;
    this.ReportDate = RadiologyPrint.ReportDate;
    this.ReportTime = RadiologyPrint.ReportTime || '';
    this.ResultEntry = RadiologyPrint.ResultEntry || '';
    this.RadiologyDocName = RadiologyPrint.RadiologyDocName || '0';
    this.SuggestionNotes = RadiologyPrint.SuggestionNotes || '';
    this.UserName = RadiologyPrint.UserName;
    this.RadReportId = RadiologyPrint.RadReportId;

    this.PrintTestName = RadiologyPrint.PrintTestName;
    this.ChargeId = RadiologyPrint.ChargeId;
    this.Education = RadiologyPrint.Education;
    this.AgeDay = RadiologyPrint.AgeDay;
    this.ServiceName = RadiologyPrint.ServiceName;
    this.OP_IP_Type = RadiologyPrint.OP_IP_Type;


    this.AdmissionID = RadiologyPrint.AdmissionID || '';

    this.Doctorname = RadiologyPrint.Doctorname || '';
    this.AdmDateTime = RadiologyPrint.AdmDateTime || '';

    this.RadTestID = RadiologyPrint.RadTestID || '';

  }

}