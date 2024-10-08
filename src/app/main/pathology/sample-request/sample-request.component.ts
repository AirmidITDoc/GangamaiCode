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
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';

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
  RequestId:any=0;
  Ispathradio=0;

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
    private reportDownloadService: ExcelDownloadService,
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
  
    console.log(this._PathologyService.myformSearch.get("StatusSearch").value)
    
    var m_data = {

      "FromDate": this.datePipe.transform(this._PathologyService.myformSearch.get("start").value, "MM-dd-yyyy"),
      "ToDate": this.datePipe.transform(this._PathologyService.myformSearch.get("end").value, "MM-dd-yyyy"),
      "Reg_No": this._PathologyService.myformSearch.get("Reg_No").value || 0,
      "Istype": parseInt(this._PathologyService.myformSearch.get("Istype").value) || 1,
      "IsCompleted": parseInt(this._PathologyService.myformSearch.get("StatusSearch").value) || 0,

    }
    console.log(m_data);
    this._PathologyService.getSampleLabOrRadRequestList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as LabOrRadRequestList[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      
      this.click = false;
    },
      error => {
        
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
  onClear(){}

  onShow(event: MouseEvent) {
    
    this.click = !this.click;
   
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
    this.sampledetaillist(row);
    this.RequestId=m.RequestId
  }

  toggle(val: any) {
    if (val == "1") {
        this.Ispathradio = 1;
    } else if (val == "2") {
        this.Ispathradio = 2;
    }
    else {
        this.Ispathradio = 3;

    }
}
onFilterChange(){
  var m_data = {

    "RequestId": this.RequestId,
    "IsPathOrRad":this.Ispathradio,// parseInt(this._PathologyService.myformSearch.get("IsPathOrRad").value) || 1

  }
  setTimeout(() => {
  
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
}
  sampledetaillist(m){
    debugger
    var m_data = {

      "RequestId": this.RequestId,
      "IsPathOrRad": parseInt(this._PathologyService.myformSearch.get("IsPathOrRad").value) || 1

    }
    setTimeout(() => {
    
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
  }

  exportSamplerequstReportExcel(){
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['RegNo', 'PatientName', 'AdmDate', 'ReqDate', 'WardName','BedName','IsTestCompted','IsOnFileTest'];
    this.reportDownloadService.getExportJsonData(this.dataSource.data, exportHeaders, 'Sample Request');
    this.dataSource.data = [];
    this.sIsLoading = '';
  }

  exportReportPdf() {
    let actualData = [];
    this.dataSource.data.forEach(e => {
      var tempObj = [];
      tempObj.push(e.RegNo);
      tempObj.push(e.PatientName);
      tempObj.push(e.AdmDate);
      tempObj.push(e.ReqDate);
      tempObj.push(e.WardName);
      tempObj.push(e.BedName);
      tempObj.push(e.IsTestCompted);
      tempObj.push(e.IsOnFileTest);
      
      // tempObj.push(e.PathAmount);
      actualData.push(tempObj);
    });
    let headers = [['RegNo','PatientName', 'AdmDate', 'ReqDate', 'WardName', 'BedName','IsTestCompted', 'IsOnFileTest' ]];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'Sample Request');
  }


  
    exportSamplerequstdetailReportExcel(){
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['ReqDate', 'ReqTime', 'ServiceName', 'AddedByName', 'IsStatus','PBillNo','IsPathology','IsRadiology','IsTestCompted'];
    this.reportDownloadService.getExportJsonData(this.dataSource1.data, exportHeaders, 'Sample Request Detail');
    this.dataSource1.data = [];
    this.sIsLoading = '';
  }

  exportdetailReportPdf() {
    let actualData = [];
    this.dataSource1.data.forEach(e => {
      var tempObj = [];
      tempObj.push(e.ReqDate);
      tempObj.push(e.ReqTime);
      tempObj.push(e.ServiceName);
      tempObj.push(e.AddedByName);
      tempObj.push(e.IsStatus);
      tempObj.push(e.PBillNo);
      tempObj.push(e.IsPathology);
      tempObj.push(e.IsRadiology);
      // tempObj.push(e.IsTestCompted);
      actualData.push(tempObj);
    });
    let headers = [['ReqDate','ReqTime', 'ServiceName','AddedByName',  'IsStatus', 'PBillNo','IsPathology', 'IsRadiology','IsTestCompted' ]];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'Sample Request Detail');
  }




  private route: ActivatedRoute
  private router: Router
  // onLABSave() {

  //   // console.log(this.dataSource.data);
  //   // console.log(this.dataSource1.data);

  //   this.sIsLoading = 'submit';



  //   let BillDetail = {};
  //   BillDetail['emergencyFlag'] = "0",
  //     BillDetail['billTotalAmount'] = " ";
  //   BillDetail['advance'] = " ";
  //   BillDetail['billDate'] = " ";
  //   BillDetail['paymentType'] = " ";
  //   BillDetail['referralName'] = " ";
  //   BillDetail['otherReferral'] = " ";
  //   BillDetail['sampleId'] = " ";
  //   BillDetail['orderNumber'] = " ";
  //   BillDetail['referralIdLH'] = " ";
  //   BillDetail['organisationName'] = " ";
  //   BillDetail['billConcession'] = "0",
  //     BillDetail['additionalAmount'] = "0",
  //     BillDetail['organizationIdLH'] = "440132",
  //     BillDetail['comments'] = " ";

  //   let testList = [];
  //   this.dataSource1.data.forEach((element) => {
  //     let testListInsertObj = {};
  //     testListInsertObj['testCode'] = element.ServiceName;
  //     testList.push(testListInsertObj);
  //   });
  //   BillDetail["testCode"] = testList;



  //   let paymentListarr = [];
  //   let paymentList = {};
  //   paymentList['paymentType'] = "CREDIT",
  //   paymentList['paymentAmount'] = " ";
  //   paymentList['chequeNo'] = " ";
  //   paymentList['issueBank'] = " ";
  //   paymentListarr.push(paymentList);


  //   BillDetail["paymentList"] = paymentListarr;

  //   let submitData = {
  //     "mobile": "",
  //     "email": "",
  //     "designation": "",
  //     "fullName": this.dataSource.data[0].PatientName,
  //     "age": "",
  //     "gender": "",
  //     "area": "",
  //     "city": "",
  //     "patientType": "IPD",
  //     "labPatientId": "HISPATIENTID",
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
  //     "BillDetailarr": BillDetail
  //     // "paymentListarr": paymentListarr,

  //   };
  //   console.log(submitData);
  //   this._PathologyService.InsertLabDetail(submitData).subscribe(response => {
  //     if (response) {
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
  IsTestCompted:any;
  BedName:any;
  ReqDate:any;

  constructor(LabOrRadRequestList) {
    this.RegNo = LabOrRadRequestList.RegNo;
    this.PatientName = LabOrRadRequestList.PatientName;
    this.AdmDate = LabOrRadRequestList.AdmDate || '0';
    this.WardName = LabOrRadRequestList.WardName;
    this.IsOnFileTest = LabOrRadRequestList.IsOnFileTest || '0';
    this.OP_IP_ID = LabOrRadRequestList.OP_IP_ID || '0';
    this.AgeYear = LabOrRadRequestList.AgeYear || '0';
    this.IsTestCompted = LabOrRadRequestList.IsTestCompted || '0';
    this.BedName = LabOrRadRequestList.BedName || '';
    this.ReqDate = LabOrRadRequestList.ReqDate || '';


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
  IsPathology: any;
  IsRadiology: any;
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
    this.IsPathology = NursingPathRadRequestList.IsPathology || 0;
    this.IsRadiology = NursingPathRadRequestList.IsRadiology || 0;
  }

}

