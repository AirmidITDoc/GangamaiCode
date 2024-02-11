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
import { SampleDetailComponent } from './sample-detail/sample-detail.component';
import { SampleList, SampledetailtwoComponent } from './sampledetailtwo/sampledetailtwo.component';
import { fuseAnimations } from '@fuse/animations';
import { NursingPathRadRequestList } from '../sample-request/sample-request.component';
import Swal from 'sweetalert2';

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
    //'checkbox',
    'DOA',
    'DOT',
    'RegNo',
    'PatientName',
    'DoctorName',
    'PBillNo',
    'PatientType',
    'WardName',
    'buttons'

  ];

  displayedColumns1: string[] = [
    // 'checkbox',
    'VADate',
    'VATime',
    'ServiceName',
    'IsSampleCollection',
    'SampleCollectionTime',
    // 'IsCompleted',
    // 'action'
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
      "From_Dt": this.datePipe.transform(this._SampleService.myformSearch.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt": this.datePipe.transform(this._SampleService.myformSearch.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      "IsCompleted": parseInt(this._SampleService.myformSearch.get("StatusSearch").value) || 0,
      "OP_IP_Type": parseInt(this._SampleService.myformSearch.get("PatientTypeSearch").value) || 1,

    }
    console.log(m_data);
    this._SampleService.getPatientSamplesList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as PatientList[];
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

  onEdit(row): void {
    ;
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
  debugger
    this._SampleService.getSampleDetailsList(m_data).subscribe(Visit => {
      this.dataSource1.data = Visit as SampleList[];
      console.log(this.dataSource1.data);
      this.dataSource1.sort = this.sort;
      this.dataSource1.paginator = this.paginator;
      this.sIsLoading = '';

    },
      error => {
        this.sIsLoading = '';
      });
  

    // if (row.checked) {
    //   let xx = {
    //     RegNo: m.RegNo,
    //     AdmissionID: m.VisitId,
    //     PatientName: m.PatientName,
    //     Doctorname: m.DoctorName,
    //     AdmDateTime: m.DOA,
    //     AgeYear: m.AgeYear,
    //     WardName: m.WardName,

    //   };
    //   this.advanceDataStored.storage = new AdvanceDetailObj(xx);

    //   const dialogRef = this._matDialog.open(SampleDetailComponent,
    //     {
    //       maxWidth: "80vw",
    //       maxHeight: "80vh",
    //       width: '100%',
    //       height: "100%",
    //       data: {
    //         BillNo: m.BillNo,
    //         OP_IP_Type: m.PatientType,
    //         From_dt: m.PathDate,

    //       }

    //     });

    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log('The dialog was closed - Insert Action', result);

    //   });
    // }

    // this.getSampledetailList();
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


  getRecord(contact) {

    // console.log(contact);

    let xx = {
      RegNo: contact.RegNo,
      AdmissionID: contact.VisitId,
      PatientName: contact.PatientName,
      Doctorname: contact.DoctorName,
      AdmDateTime: contact.DOA,
      AgeYear: contact.AgeYear,
      WardName: contact.WardName,

    };
    this.advanceDataStored.storage = new AdvanceDetailObj(xx);

    const dialogRef = this._matDialog.open(SampleDetailComponent,
      {
        maxWidth: "90vw",
        maxHeight: "90vh", width: '100%', height: "100%",
        data: {
          BillNo: contact.BillNo,
          OP_IP_Type: contact.PatientType,
          From_dt: contact.PathDate,

        }

      });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed - Insert Action', result);

    });
  }





  // onEditNew(row, m): void {
  //   ;

  //   if (row.checked) {
  //     let xx = {
  //       RegNo: m.RegNo,
  //       AdmissionID: m.VisitId,
  //       PatientName: m.PatientName,
  //       Doctorname: m.DoctorName,
  //       AdmDateTime: m.DOA,
  //       AgeYear: m.AgeYear,
  //       WardName: m.WardName,

  //     };
  //     this.advanceDataStored.storage = new AdvanceDetailObj(xx);

  //     const dialogRef = this._matDialog.open(SampledetailtwoComponent,
  //       {
  //         maxWidth: "85vw",
  //         height: '480px',
  //         width: '100%',
  //         data: {
  //           BillNo: m.BillNo,
  //           OP_IP_Type: m.PatientType,
  //           From_dt: m.PathDate,

  //         }

  //       });

  //     dialogRef.afterClosed().subscribe(result => {
  //       console.log('The dialog was closed - Insert Action', result);

  //     });
  //   }

  // }


  getSampleRecords(contact) {

    let xx = {
      RegNo: contact.RegNo,
      AdmissionID: contact.VisitId,
      PatientName: contact.PatientName,
      Doctorname: contact.DoctorName,
      AdmDateTime: contact.DOA,
      AgeYear: contact.AgeYear,
      WardName: contact.WardName,

    };
    this.advanceDataStored.storage = new AdvanceDetailObj(xx);

    const dialogRef1 = this._matDialog1.open(SampledetailtwoComponent,
      {
        maxWidth: "85vw",
        height: '520px',
        width: '100%',
        data: {
          BillNo: contact.BillNo,
          OP_IP_Type: contact.PatientType,
          From_dt: contact.PathDate

        }

      });

    dialogRef1.afterClosed().subscribe(result => {
      // console.log('The dialog was closed - Insert Action', result);

    });
  }
  onExport(exprtType) {
  }



  onExport1(exprtType) {
    debugger;
    //   let columnList=[];
    //   if(this.dataSource.data.length == 0){
    //     // this.toastr.error("No Data Found");
    //     Swal.fire('Error !', 'No Data Found', 'error');
    //   }
    //   else{
    //     var excelData = [];
    //     var a=1;
    //     for(var i=0;i<this.dataSource.data.length;i++){
    //       let singleEntry = {
    //         // "Sr No":a+i,
    //         "RegNo" :this.dataSource.data[i]["RegNo"] ? this.dataSource.data[i]["RegNo"] :"N/A",
    //         "PBillNo" :this.dataSource.data[i]["PBillNo"],
    //         "Admission Date" :this.dataSource.data[i]["DOA"] ? this.dataSource.data[i]["DOA"]:"N/A",
    //         "Admission Time" :this.dataSource.data[i]["DOT"] ? this.dataSource.data[i]["DOT"]:"N/A",
    //         "Patient Name" :this.dataSource.data[i]["PatientName"] ? this.dataSource.data[i]["PatientName"]:"N/A",
    //         "PatientType" :this.dataSource.data[i]["PatientType"] ? this.dataSource.data[i]["PatientType"] :"N/A",
    //         "WardName" :this.dataSource.data[i]["WardName"] ? this.dataSource.data[i]["WardName"] : "N/A",


    //       };
    //       excelData.push(singleEntry);
    //     }
    //     var fileName = "Sample-Collection-List " + new Date() +".xlsx";
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

  // }


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


