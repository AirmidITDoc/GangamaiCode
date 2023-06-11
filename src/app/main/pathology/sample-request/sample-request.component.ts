import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PathologyService } from '../pathology.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sample-request',
  templateUrl: './sample-request.component.html',
  styleUrls: ['./sample-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SampleRequestComponent implements OnInit {

  click: boolean = false;
  MouseEvent = true;

  myformSearch: FormGroup;
  isLoading = true;
  msg: any;
  step = 0;
  dataArray = {};
  sIsLoading: string = '';
  //isSampleCollection: boolean = true;


  setStep(index: number) {
    this.step = index;
  }
  SearchName: string;


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;



  dataSource = new MatTableDataSource<LabOrRadRequestList>();
  displayedColumns: string[] = [
    //  'checkbox',

    'RegNo',
    'PatientName',
    'AdmDate',
    'ReqDate',
    'WardName',
    'BedName',
    'IsTestCompted',
    'IsOnFileTest',


    // 'action'


  ];

  dataSource1 = new MatTableDataSource<NursingPathRadRequestList>();
  @ViewChild(MatPaginator) PathTestpaginator: MatPaginator;

  displayedColumns1: string[] = [
    //'checkbox',
    // 'VADate',
    'ReqDate',
    'ReqTime',
    'ServiceName',
    'AddedByName',
    'BillingUser',
    'AddedByDate',
    'IsStatus',
    'PBillNo',
    'IsPathology',
    'IsRadiology',
    'IsTestCompted'
  ];

  hasSelectedContacts: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private _httpClient: HttpClient,
    public _PathologyService: PathologyService,
    private _ActRoute: Router,
    // public dialogRef: MatDialogRef<PathologresultEntryComponent>,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
  ) { }

  ngOnInit(): void {
    this.getSampleLabOrRadRequestLists();

  }


  get f() { return this._PathologyService.myformSearch.controls; }


  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  getSampleLabOrRadRequestLists() {

    this.sIsLoading = 'loading-data';
    var m_data = {

      "FromDate": this.datePipe.transform(this._PathologyService.myformSearch.get("start").value, "MM-dd-yyyy"),
      "ToDate": this.datePipe.transform(this._PathologyService.myformSearch.get("end").value, "MM-dd-yyyy"),
      "Reg_No": (this._PathologyService.myformSearch.get("Reg_No").value) || 0,
      "Istype": (this._PathologyService.myformSearch.get("Istype").value) || 1,
      // "IsCompleted":1

    }
    console.log(m_data);
    this._PathologyService.getSampleLabOrRadRequestList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as LabOrRadRequestList[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
      this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });
  }

  onShow(event: MouseEvent) {
    // this.click = false;// !this.click;

    this.click = !this.click;
    // this. showSpinner = true;

    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data';

        this.getSampleLabOrRadRequestLists();
      }

    }, 50);
    this.MouseEvent = true;
    this.click = true;

  }

  onEdit(row, m) {
    console.log(m);
    var m_data = {

      "RequestId": m.RequestId || 14564,
      "IsPathOrRad": 1,

    }
    setTimeout(() => {
      //  this.sIsLoading = 'loading-data';
      this._PathologyService.getSampleNursingPathRadReqDetList(m_data).subscribe(Visit => {
        this.dataSource1.data = Visit as NursingPathRadRequestList[];
        this.dataSource1.sort = this.sort;
        this.dataSource1.paginator = this.paginator;
        console.log(m_data);
        this.sIsLoading = '';
        this.click = false;

      },
        error => {
          this.sIsLoading = '';
        });
    }, 50);


    // } 


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
    //       "Admission Date" :this.dataSource.data[i]["AdmDate"] ? this.dataSource.data[i]["AdmDate"]:"N/A",
    //       "Request Date" :this.dataSource.data[i]["ReqDate"] ? this.dataSource.data[i]["ReqDate"]:"N/A",
    //       "Patient Name" :this.dataSource.data[i]["PatientName"] ? this.dataSource.data[i]["PatientName"]:"N/A",
    //       "WardName" :this.dataSource.data[i]["WardName"] ? this.dataSource.data[i]["WardName"] :"N/A",
    //       "BedName" :this.dataSource.data[i]["BedName"] ? this.dataSource.data[i]["BedName"] : "N/A",
    //       "IsTestCompted" :this.dataSource.data[i]["IsTestCompted"] ? this.dataSource.data[i]["IsTestCompted"] :"N/A",
    //       "IsOnFileTest" :this.dataSource.data[i]["IsOnFileTest"] ? this.dataSource.data[i]["IsOnFileTest"] : "N/A",


    //     };
    //     excelData.push(singleEntry);
    //   }
    //   var fileName = "Sample-Request-List " + new Date() +".xlsx";
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
    //   debugger;
    //   let columnList=[];
    //   if(this.dataSource1.data.length == 0){
    //     // this.toastr.error("No Data Found");
    //     Swal.fire('Error !', 'No Data Found', 'error');
    //   }
    //   else{
    //     var excelData = [];
    //     var a=1;
    //     for(var i=0;i<this.dataSource1.data.length;i++){
    //       let singleEntry = {
    //         // "Sr No":a+i,
    //         "PBillNo" :this.dataSource1.data[i]["PBillNo"] ? this.dataSource1.data[i]["PBillNo"] :"N/A",
    //         "Request Date" :this.dataSource1.data[i]["ReqDate"] ? this.dataSource1.data[i]["ReqDate"]:"N/A",
    //         "Request Time" :this.dataSource1.data[i]["ReqTime"] ? this.dataSource1.data[i]["ReqTime"]:"N/A",
    //         "AddedByName" :this.dataSource1.data[i]["AddedByName"] ? this.dataSource1.data[i]["AddedByName"]:"N/A",
    //         "ServiceName" :this.dataSource1.data[i]["ServiceName"] ? this.dataSource1.data[i]["ServiceName"] :"N/A",
    //         "BillingUser" :this.dataSource1.data[i]["BillingUser"] ? this.dataSource1.data[i]["BillingUser"] : "N/A",
    //         "AddedByDate" :this.dataSource1.data[i]["AddedByDate"] ? this.dataSource1.data[i]["AddedByDate"] :"N/A",
    //         "IsStatus" :this.dataSource1.data[i]["IsStatus"] ? this.dataSource1.data[i]["IsStatus"] : "N/A",
    //         "IsPatholog" :this.dataSource1.data[i]["IsPatholog"] ? this.dataSource1.data[i]["IsPatholog"] : "N/A",
    //         "IsRadiology" :this.dataSource1.data[i]["IsRadiology"] ? this.dataSource1.data[i]["IsRadiology"] : "N/A",
    //         "IsTestCompted" :this.dataSource1.data[i]["IsTestCompted"] ? this.dataSource1.data[i]["IsTestCompted"] : "N/A",
    //       };
    //       excelData.push(singleEntry);
    //     }
    //     var fileName = "Nursing-Path/Rad-Details-List " + new Date() +".xlsx";
    //     if(exprtType =="Excel"){
    //       const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(excelData);
    //       var wscols = [];
    //       if(excelData.length > 0){ 
    //         var columnsIn = excelData[0]; 
    //         for(var key in columnsIn){
    //           let headerLength = {wch:(key.length+1)};
    //           let columnLength = headerLength;
    //           try{
    //             columnLength = {wch: Math.max(...excelData.map(o => o[key].length), 0)+1}; 
    //           }
    //           catch{
    //             columnLength = headerLength;
    //           }
    //           if(headerLength["wch"] <= columnLength["wch"]){
    //             wscols.push(columnLength)
    //           }
    //           else{
    //             wscols.push(headerLength)
    //           }
    //         } 
    //       }
    //       ws['!cols'] = wscols;
    //       const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    //       XLSX.writeFile(wb, fileName);
    //     }else{
    //       let doc = new jsPDF('p','pt', 'a4');
    //       doc.page = 0;
    //       var col=[];
    //       for (var k in excelData[0]) col.push(k);
    //         console.log(col.length)
    //       var rows = [];
    //       excelData.forEach(obj => {
    //         console.log(obj)
    //         let arr = [];
    //         col.forEach(col => {
    //           arr.push(obj[col]);
    //         });
    //         rows.push(arr);
    //       });

    //       doc.autoTable(col, rows,{
    //         margin:{left:5,right:5,top:5},
    //         theme:"grid",
    //         styles: {
    //           fontSize: 3
    //         }});
    //       doc.setFontSize(3);
    //       // doc.save("Indoor-Patient-List.pdf");
    //       window.open(URL.createObjectURL(doc.output("blob")))
    //     }
    //   }
    // }
  }

  private route: ActivatedRoute
  private router: Router
  onLABSave() {

    // console.log(this.dataSource.data);
    // console.log(this.dataSource1.data);

    this.sIsLoading = 'submit';


    // let PersonalDetail = {};
    // PersonalDetail['mobile'] = " ";// this.dataSource[0].mobile;
    // PersonalDetail['email'] = " ";
    // PersonalDetail['designation'] = " ";
    // PersonalDetail['fullName'] = this.dataSource.data[0].PatientName;
    // PersonalDetail['age'] = "",// this.dataSource[0].AgeYear.trim();
    // PersonalDetail['gender'] ="",// this.dataSource[0].gender;
    // PersonalDetail['area'] = " ";//this.dataSource[0].AgeYear;
    // PersonalDetail['city'] = " ";//this.dataSource[0].city;
    // PersonalDetail['patientType'] = 'IPD',//this.dataSource[0].paymentType;
    // PersonalDetail['labPatientId'] = " ",//this.dataSource[0].labPatientId;
    // PersonalDetail['pincode'] = " ";//this.dataSource[0].pincode;
    // PersonalDetail['patientId'] = this.dataSource.data[0].OP_IP_ID;
    // PersonalDetail['dob'] = " ";//this.dataSource[0].dob;
    // PersonalDetail['passportNo'] =" ";// this.dataSource[0].passportNo;
    // PersonalDetail['panNumber'] = " ";// this.dataSource[0].panNumber;
    // PersonalDetail['aadharNumber'] = " ";// this.dataSource[0].aadharNumber;
    // PersonalDetail['insuranceNo'] = " ";
    // PersonalDetail['nationalityethnicity'] = " ";
    // PersonalDetail['ethnicity'] = " ";
    // PersonalDetail['nationalIdentityNumber'] = " ";
    // PersonalDetail['workerCode'] = " ";
    // PersonalDetail['doctorCode'] = " ";

    // var m_data = {

    //   "mobile": "",
    //   "email": "",
    //   "designation": "Mrs.",
    //   "fullName": this.dataSource.data[0].PatientName,
    //   "age": "",
    //   "gender": "",
    //   "area": "",
    //   "city": "",
    //   "patientType": "IPD",
    //   "labPatientId": "HISPATIENTID",
    //   "pincode": " ",
    //   "patientId": "",
    //   "dob": "",
    //   "passportNo": "",
    //   "panNumber": "",
    //   "aadharNumber": "",
    //   "insuranceNo": "",
    //   "nationalityethnicity": "",
    //   "ethnicity": "",
    //   "nationalIdentityNumber": "",
    //   "workerCode": "w12",
    //   "doctorCode": ""
    // }



    let BillDetail = {};
    BillDetail['emergencyFlag'] = "0",
      BillDetail['billTotalAmount'] = " ";
    BillDetail['advance'] = " ";
    BillDetail['billDate'] = " ";
    BillDetail['paymentType'] = " ";
    BillDetail['referralName'] = " ";
    BillDetail['otherReferral'] = " ";
    BillDetail['sampleId'] = " ";
    BillDetail['orderNumber'] = " ";
    BillDetail['referralIdLH'] = " ";
    BillDetail['organisationName'] = " ";
    BillDetail['billConcession'] = "0",
      BillDetail['additionalAmount'] = "0",
      BillDetail['organizationIdLH'] = "440132",
      BillDetail['comments'] = " ";

    let testList = [];
    this.dataSource1.data.forEach((element) => {
      let testListInsertObj = {};
      testListInsertObj['testCode'] = element.ServiceName;
      testList.push(testListInsertObj);
    });
    BillDetail["testCode"] = testList;



    let paymentListarr = [];
    let paymentList = {};
    paymentList['paymentType'] = "CREDIT",
    paymentList['paymentAmount'] = " ";
    paymentList['chequeNo'] = " ";
    paymentList['issueBank'] = " ";
    paymentListarr.push(paymentList);


    BillDetail["paymentList"] = paymentListarr;

    let submitData = {
      "mobile": "",
      "email": "",
      "designation": "",
      "fullName": this.dataSource.data[0].PatientName,
      "age": "",
      "gender": "",
      "area": "",
      "city": "",
      "patientType": "IPD",
      "labPatientId": "HISPATIENTID",
      "pincode": " ",
      "patientId": "",
      "dob": "",
      "passportNo": "",
      "panNumber": "",
      "aadharNumber": "",
      "insuranceNo": "",
      "nationalityethnicity": "",
      "ethnicity": "",
      "nationalIdentityNumber": "",
      "workerCode": "w12",
      "doctorCode": "",
      "BillDetailarr": BillDetail
      // "paymentListarr": paymentListarr,

    };
    console.log(submitData);
    this._PathologyService.InsertLabDetail(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Lab Detail Send Successfully !', 'success').then((result) => {
        });
      } else {
        Swal.fire('Error !', 'Lab Detail  not Send', 'error');
      }
      this.sIsLoading = '';
    });
  }


  // Labsave() {
  //   debugger;
  //   let submitData = {

  //     "mobile": "",
  //     "email": "",
  //     "designation": "Mrs.",
  //     "fullName": "Test",
  //     "age": 81,
  //     "gender": "Female",
  //     "area": "",
  //     "city": "",
  //     "patientType": "IPD",
  //     "labPatientId": "123456",
  //     "pincode": " ",
  //     "patientId": "",
  //     "dob": "",
  //     "passportNo": "",
  //     "panNumber": "",
  //     "aadharNumber": "",
  //     "insuranceNo": "",
  //     "nationalityethnicity": "",
  //     "ethnicity": "",
  //     "nationalIdentityNumber": "",
  //     "workerCode": "w12",
  //     "doctorCode": "",
  //     "billDetails": {
  //       "emergencyFlag": "0",
  //       "billTotalAmount": "",
  //       "advance": "0",
  //       "billDate": "",
  //       "paymentType": "CREDIT",
  //       "referralName": " ",
  //       "otherReferral": "",
  //       "sampleId": "",
  //       "orderNumber": " ",
  //       "referralIdLH": "",
  //       "organisationName": "",
  //       "billConcession": "0",
  //       "additionalAmount": "0",
  //       "organizationIdLH": "440132",
  //       "comments": "CGHS",
  //       "testList": [
  //         {
  //           "testCode": "Blood Group & Rh Type"
  //         }
  //       ],
  //       "paymentList": [
  //         {
  //           "paymentType": "CREDIT",
  //           "paymentAmount": "",
  //           "chequeNo": "",
  //           "issueBank": ""
  //         }
  //       ]
  //     }

  //   }
  //   console.log(submitData);


  //   this._PathologyService.InsertLabDetail(submitData).subscribe(response => {
  //     if (response) {
  //       console.log(response);
  //       Swal.fire('Lab Detail Send Successfully !', 'success').then((result) => {
  //       });
  //     } else {
  //       Swal.fire('Error !', 'Lab Detail  not Send', 'error');
  //     }
  //     this.sIsLoading = '';
  //   });
  // }

}

export class LabOrRadRequestList {

  RegNo: any;
  PatientName: String;
  AdmDate: Date;
  WardName: string;
  IsOnFileTest: boolean;
  OP_IP_ID: any;
  AgeYear: any;

  constructor(LabOrRadRequestList) {
    this.RegNo = LabOrRadRequestList.RegNo;
    this.PatientName = LabOrRadRequestList.PatientName;
    this.AdmDate = LabOrRadRequestList.AdmDate || '0';
    this.WardName = LabOrRadRequestList.WardName;
    this.IsOnFileTest = LabOrRadRequestList.IsOnFileTest || '0';
    this.OP_IP_ID = LabOrRadRequestList.OP_IP_ID || '0';
    this.AgeYear = LabOrRadRequestList.AgeYear || '0';


  }

}

export class NursingPathRadRequestList {
  ReqDate: Date;
  ReqTime: Date;
  ServiceName: string;
  AddedByName: string;
  BillingUser: string;
  AddedByDate: Date;
  IsStatus: number;
  PBillNo: number;
  ServiceId: any;

  constructor(NursingPathRadRequestList) {
    this.ReqDate = NursingPathRadRequestList.ReqDate || '';
    this.ReqTime = NursingPathRadRequestList.ReqTime || '';
    this.ServiceName = NursingPathRadRequestList.ServiceName || 0;
    this.AddedByName = NursingPathRadRequestList.AddedByName || '';
    this.BillingUser = NursingPathRadRequestList.BillingUser || '';
    this.AddedByDate = NursingPathRadRequestList.AddedByDate || '';
    this.IsStatus = NursingPathRadRequestList.IsStatus || 0;
    this.PBillNo = NursingPathRadRequestList.PBillNo || 0;
    this.ServiceId = NursingPathRadRequestList.ServiceId || 0;
  }

}

