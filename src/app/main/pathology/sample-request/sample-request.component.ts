import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
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
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';

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
  vOPIPId = 0;
  f_name:any = "" 
  regNo:any="0"
  l_name:any="" 
  Istype=1
  IsCompleted=1
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
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent; 
  @ViewChild('grid1') grid1: AirmidTableComponent;

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  allcolumns= [            
    { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA'},
    { heading: "Reg No", key: "regNo", sort: true, align: 'left', emptySign: 'NA'},
    { heading: "Patient Name", key: "patientname", sort: true, align: 'left', emptySign: 'NA'},
    { heading: "Adm Date", key: "admDate", sort: true, align: 'left', emptySign: 'NA'},
    { heading: "Store Name", key: "storeName", sort: true, align: 'left', emptySign: 'NA'},
    { heading: "IPMedID", key: "ipMedId", sort: true, align: 'left', emptySign: 'NA'},                 
  ];
      gridConfig: gridModel = {
          apiUrl: "PathlogySampleCollection/LabOrRadRequestPatientList",
          columnsList:this.allcolumns,
          sortField: "PresReId",
          sortOrder: 0,
          filters: [  
            { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "IsCompleted", fieldValue: "1", opType: OperatorComparer.Equals },
            { fieldName: "Istype", fieldValue: "2", opType: OperatorComparer.Equals }
          ]
      }
  constructor(
    private formBuilder: UntypedFormBuilder,
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
   this.myformSearch=this._PathologyService.createSampleRequstForm()
  }



  gridConfig1: gridModel = new gridModel();
  isShowDetailTable: boolean = false;

  getSelectedRow(row: any): void {
      let billNo = row.billNo;
      let inputDate = row.vaDate;
      let parts = inputDate.split(' ')[0].split('-');
      let date = `${parts[2]}-${parts[1]}-${parts[0]}`;
      let opipType = row.lbl === 'OP' ? 0 : 1;

      this.gridConfig1 = {
          apiUrl: "PathlogySampleCollection/LabOrRadRequestDetailList",
          columnsList: [
            { heading: "ReqDate", key: "date", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "ReqTime", key: "time", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "ServiceName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "AddedBy", key: "AddedBy", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "BillingUser", key: "BillingUser", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "AddedByDate", key: "AddedByDate", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "IsStatus", key: "IsStatus", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "PBillNo", key: "PBillNo", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "IsPathology", key: "IsPathology", sort: true, align: 'left', emptySign: 'NA'},
          ],
          sortField: "RequestId",
          sortOrder: 0,
          filters: [
              { fieldName: "RequestId", fieldValue: '1', opType: OperatorComparer.Equals },
              { fieldName: "IsPathOrRad", fieldValue: '1', opType: OperatorComparer.Equals }
          ]
      };

      this.isShowDetailTable = true;

      setTimeout(() => {
          this.grid1.gridConfig = this.gridConfig1;
          this.grid1.bindGridData();
      });
  }

  
  onChangeFirst() {
    this.fromDate = this.datePipe.transform(this.myformSearch.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myformSearch.get('enddate').value, "yyyy-MM-dd")
    this.f_name = this.myformSearch.get('FirstName').value + "%"
    this.l_name = this.myformSearch.get('LastName').value + "%"
    this.regNo = this.myformSearch.get('RegNo').value 
    this.Istype = this.myformSearch.get('Istype').value
    this.IsCompleted = this.myformSearch.get('IsCompleted').value 

    this.getfilterdata();
}

getfilterdata(){
debugger
this.gridConfig = {
  apiUrl: "PathlogySampleCollection/LabOrRadRequestPatientList",
    columnsList:this.allcolumns , 
    sortField: "PresReId",
    sortOrder: 0,
    filters:  [
      { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
      { fieldName: "IsCompleted", fieldValue: this.IsCompleted, opType: OperatorComparer.Equals },
      { fieldName: "Istype", fieldValue: this.Istype, opType: OperatorComparer.Equals }

    ]
}
this.grid.gridConfig = this.gridConfig;
this.grid.bindGridData(); 
}


Clearfilter(event) {
console.log(event)

if (event == 'RegNo')
    this.myformSearch.get('RegNo').setValue("")

this.onChangeFirst();
}
  onClear(){}

  onShow(event: MouseEvent) {
    
    this.click = !this.click;
   
    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data';

        // this.getSampleLabOrRadRequestLists();
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
   
  }

  exportReportPdf() {
  
  }


  
    exportSamplerequstdetailReportExcel(){
   
  }

  exportdetailReportPdf() {
  
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

