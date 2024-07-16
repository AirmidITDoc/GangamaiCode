import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SampleCollectionService } from './sample-collection.service';
import { MatDialog } from '@angular/material/dialog';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AdvanceDetailObj } from 'app/main/opd/appointment/appointment.component'; 
import { SampleList, SampledetailtwoComponent } from './sampledetailtwo/sampledetailtwo.component';
import { fuseAnimations } from '@fuse/animations';
import { NursingPathRadRequestList } from '../sample-request/sample-request.component';
import Swal from 'sweetalert2';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';

@Component({
  selector: 'app-sample-collection',
  templateUrl: './sample-collection.component.html',
  styleUrls: ['./sample-collection.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SampleCollectionComponent implements OnInit {

  click: boolean = false;
  MouseEvent = true;
  screenFromString = 'opd-casepaper';
  PatientTypeList: any = [];
  myformSearch: FormGroup;
  isLoading = true;
  msg: any;
  step = 0;
  sIsLoading: string = '';
  menuActions: Array<string> = [];
  hasSelectedContacts: boolean;
  dateTimeObj: any;
  setStep(index: number) {
    this.step = index;
  }
  SearchName: string;


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // @ViewChild(MatSort) sort1: MatSort;
  // @ViewChild(MatPaginator) paginator1: MatPaginator;

  dataSource = new MatTableDataSource<PatientList>();

  dataSource1 = new MatTableDataSource<SampleList>();

  displayedColumns: string[] = [
    'OP_Ip_Type',
    'DOA',
    // 'DOT',
    'RegNo',
    'PatientName',
    'DoctorName',
    'PBillNo',
    'PatientType',
    'CompanyName', 
    'WardName',
    'buttons' 
  ];

  displayedColumns1: string[] = [  
    'IsSampleCollection',
    'ServiceName',
    //'IsPrinted',
    'SampleCollectionTime', 
  ]; 

  constructor( 
    private formBuilder: FormBuilder,
    public _SampleService: SampleCollectionService,
    private _ActRoute: Router,
    public _matDialog: MatDialog,
    public _matDialog1: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    private _fuseSidebarService: FuseSidebarService,
    private reportDownloadService: ExcelDownloadService
  ) { }
  ngOnInit(): void {
    this.getPatientsList(); 
  }

  get f() { return this._SampleService.myformSearch.controls }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  onClose() {
    // this.dialogRef.close();
  } 
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

    }, 1000);
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

  getPatientsList() {
    this.sIsLoading = 'loading-data';
    var m_data = {
      "F_Name": (this._SampleService.myformSearch.get("FirstNameSearch").value).trim() + '%' || '%',
      "L_Name": (this._SampleService.myformSearch.get("LastNameSearch").value).trim() + '%' || '%',
      "Reg_No": (this._SampleService.myformSearch.get("RegNoSearch").value) || 0,
      "From_Dt":  this.datePipe.transform(this._SampleService.myformSearch.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt": this.datePipe.transform(this._SampleService.myformSearch.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      "IsCompleted":this._SampleService.myformSearch.get("StatusSearch").value || 0,
      "OP_IP_Type": this._SampleService.myformSearch.get("PatientTypeSearch").value || 0, 
    }
    console.log(m_data);
    this._SampleService.getPatientSamplesList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as PatientList[];
      console.log(this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
      this.click = false;
    },
      error => {
        this.sIsLoading = '';
      }); 
  }
 
  onSearchClear() {
    this._SampleService.myformSearch.reset({ RegNoSearch: '', FirstNameSearch: '', LastNameSearch: '', PatientTypeSearch: '', StatusSearch: '' });
  }

  onEdit(row) { 
    console.log(row) 
    let OPIP
    if (this._SampleService.myformSearch.get("PatientTypeSearch").value == '1') {
    
      OPIP = 1;
    }
    else {
      OPIP = 0;
    }

    var m_data = {
      "BillNo": row.BillNo,
      "BillDate": this.datePipe.transform(row.PathDate, "yyyy-MM-dd"),
      "OP_IP_Type": OPIP
    }
  console.log(m_data);
  // debugger
    this._SampleService.getSampleDetailsList(m_data).subscribe(Visit => {
      this.dataSource1.data = Visit as SampleList[];
      console.log(this.dataSource1.data);
      this.dataSource1.sort = this.sort;
      this.dataSource1.paginator = this.paginator;
      // this.sIsLoading = '';

    },
      error => {
        this.sIsLoading = '';
      }); 
  }




  onLABSave() { 
    this.sIsLoading = 'submit'; 
    let BillDetail = {};
    BillDetail['emergencyFlag'] = "0",
      BillDetail['billTotalAmount'] = "";
    BillDetail['advance'] = "0";
    BillDetail['billDate'] = "";
    BillDetail['paymentType'] = "CREDIT";
    BillDetail['referralName'] = " ";
    BillDetail['otherReferral'] = "";
    BillDetail['sampleId'] = "";
    BillDetail['orderNumber'] = " ";
    BillDetail['referralIdLH'] = "";
    BillDetail['organisationName'] = "";
    BillDetail['billConcession'] = "0",
      BillDetail['additionalAmount'] = "0",
      BillDetail['organizationIdLH'] = "440132",
      BillDetail['comments'] = "CGHS";

    let testList = [];
    this.dataSource1.data.forEach((element) => {
      let testListInsertObj = {};
      testListInsertObj['testCode'] = element.ServiceName;
      testList.push(testListInsertObj);
    });
    BillDetail["testList"] = testList; 

    let paymentListarr = [];
    let paymentList = {};
    paymentList['paymentType'] = "CREDIT",
      paymentList['paymentAmount'] = "";
    paymentList['chequeNo'] = "";
    paymentList['issueBank'] = "";
    paymentListarr.push(paymentList);


    BillDetail["paymentList"] = paymentListarr;

    let submitData = {
      "mobile": "",
      "email": "",
      "designation": "Mr.",
      "fullName": "AirmidTest",//this.dataSource.data[0].PatientName,
      "age": 81,
      "gender": "Female",
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
      "billDetails": BillDetail


    };
    console.log(submitData);
    this._SampleService.InsertLabDetail(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Lab Detail Send Successfully !', 'success').then((result) => {
        });
      } else {
        Swal.fire('Error !', 'Lab Detail  not Send', 'error');
      }
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

  getSampleRecords(contact) {
    console.log(contact)
    let xx = {
      RegNo: contact.RegNo,
      AdmissionID: contact.VisitId,
      PatientName: contact.PatientName,
      Doctorname: contact.DoctorName,
      AdmDateTime: contact.DOA,
      AgeYear: contact.AgeYear,
      WardName: contact.WardName,

    };
    this.advanceDataStored.storage = new AdvanceDetailObj(contact);

    const dialogRef1 = this._matDialog1.open(SampledetailtwoComponent,
      {
        maxWidth: "70vw",
        height: '80vh',
        width: '100%',
        data: {
          // BillNo: contact.BillNo,
          // OP_IP_Type: contact.PatientType,
          // From_dt: contact.PathDate,
          regobj:contact
        } 
      });

    dialogRef1.afterClosed().subscribe(result => {
      // console.log('The dialog was closed - Insert Action', result);
      this.getPatientsList();
    });
  }
 

  exportSamplecollectionReportExcel(){
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['Date', 'Time', 'RegNo', 'PatientName', 'DoctorName', 'PatientType', 'PBillNo','WardName'];
    this.reportDownloadService.getExportJsonData(this.dataSource.data, exportHeaders, 'Sample Collection');
    this.dataSource.data = [];
    this.sIsLoading = '';
  }

  exportReportPdf() {
    let actualData = [];
    this.dataSource.data.forEach(e => {
      var tempObj = [];
      tempObj.push(e.DOA);
      tempObj.push(e.DOT);
      tempObj.push(e.RegNo);
      tempObj.push(e.PatientName);
      tempObj.push(e.DoctorName);
      tempObj.push(e.PatientType);
      tempObj.push(e.PBillNo);
      tempObj.push(e.WardName);
      
      // tempObj.push(e.PathAmount);
      actualData.push(tempObj);
    });
    let headers = [['Date', 'Time', 'RegNo','PatientName', 'DoctorName', 'PatientType', 'PBillNo', 'WardName']];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'Sample Collection');
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
  WardName: String;

  constructor(PatientList) {
    this.DOA = PatientList.DOA || '0';
    this.DOT = PatientList.DOT;
    this.RegNo = PatientList.RegNo;
    this.PatientName = PatientList.PatientName;
    this.PBillNo = PatientList.PBillNo;
    this.PatientType = PatientList.PatientType || '0';
    this.DoctorName = PatientList.DoctorName || 1;
    this.WardName = PatientList.WardName;

  }

}


