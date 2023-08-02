import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NursingstationService } from '../nursingstation.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { NewLabrequestComponent } from './new-labrequest/new-labrequest.component';
import { OPIPPatientModel } from '../patient-vist/patient-vist.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-lanrequest-pathradio',
  templateUrl: './lanrequest-pathradio.component.html',
  styleUrls: ['./lanrequest-pathradio.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LanrequestPathradioComponent implements OnInit {

 // @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  sIsLoading: string = '';
  searchFormGroup: FormGroup;
  click: boolean = false;
  MouseEvent = true;
  patientName:any;
  OPIPNo:any;
Data1:any;
dataarray:{}
  
  displayedColumns: string[] = [
    //  'checkbox',
    'RegNo',
    'PatientName',
    'WardName',
    'BedName',
    'RequestType',
    'IsOnFileTest',
    'action'
  ];
  dataSource = new MatTableDataSource<LabRequest>();
  displayedColumns1: string[] = [
    //  'checkbox',

    'ReqDate',
    'ReqTime',
    'ServiceName',
    'AddedByName',
    'BillingUser',
    'AddedByDate',
    // 'AddedByTime',
    'IsStatus',
    'PBillNo',
    'IsTestCompted'
    // 'action'
  ];
  dataSource1 = new MatTableDataSource<LabRequestDetail>();
  
  // @ViewChild(MatPaginator) PathTestpaginator: MatPaginator;
  
  constructor( private formBuilder: FormBuilder,
    public _nursingStationService: NursingstationService,
    // private _IpSearchListService: IpSearchListService,
    private _ActRoute: Router,
    // public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    private accountService: AuthenticationService,
    private _fuseSidebarService: FuseSidebarService,) { }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();

    var m_data = {
    
      // "FromDate": '2022-03-28 00:00:00.000',// this.datePipe.transform(this.searchFormGroup.get("start").value, "yyyy-MM-dd ") || '2022-03-28 00:00:00.000',
      // "ToDate": '2022-03-28 00:00:00.000',// this.datePipe.transform(this.searchFormGroup.get("end").value, "yyyy-MM-dd") || '2022-03-28 00:00:00.000',
      // "Reg_No": (this.searchFormGroup.get("Reg_No").value) || 0
    }
    this.Data1=m_data;
    this._nursingStationService.getLabRequestList(this.Data1).subscribe(Visit => {
      this.dataSource.data = Visit as LabRequest[];
      console.log(this.dataSource.data);
      this.sIsLoading = '';
      this.click = false;
      },
        error => {
          this.sIsLoading = '';
        });

    this.getLabRequestNursingList();
    // this.onEdit();
  }

  createSearchForm() {
    return this.formBuilder.group({
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      Reg_No: ['']
    });
  }

  getLabRequestNursingList() {

  debugger
   this.sIsLoading = 'loading-data';
   var m_data = {
    
     "FromDate": '2022-11-04 00:00:00.000',// this.datePipe.transform(this.searchFormGroup.get("start").value, "yyyy-MM-dd ") || '2022-03-28 00:00:00.000',
     "ToDate": '2022-11-04 00:00:00.000',// this.datePipe.transform(this.searchFormGroup.get("end").value, "yyyy-MM-dd") || '2022-03-28 00:00:00.000',
     "Reg_No": (this.searchFormGroup.get("Reg_No").value) || 0
   }
   console.log(m_data);
   this._nursingStationService.getLabRequestList(m_data).subscribe(Visit => {
     this.dataSource.data = Visit as LabRequest[];
     console.log(this.dataSource.data);
     this.sIsLoading = '';
     this.click = false;
     },
       error => {
         this.sIsLoading = '';
       });
   }


     ongetdetails(m) {
      debugger;
      console.log(m);
      this.patientName=m.PatientName;
      this.OPIPNo=m.OP_IP_ID;
    var m_data = {
      "RequestId":  m.RequestId
      
    }
    console.log(m_data);
    //  setTimeout(() => {
    this._nursingStationService.getLabrequestDetailList(m_data).subscribe(Visit => {
      this.dataSource1.data = Visit as LabRequestDetail[];
      console.log(this.dataSource1.data);
      // this.dataSource1.sort = this.sort;
      // this.dataSource1.paginator = this.paginator;
      this.sIsLoading = '';
      // this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });
    //  }, 50);


    // } 

  }

  onEdit(m) {
    debugger;
    console.log(m);
   
  var m_data = {
    "RequestId":  m.RequestId,
    "PatientName":m.PatientName,
    "OPD_IPD_ID":m.OP_IP_ID,
    "RegNo":m.RegNo,
    "OP_IP_Type":m.OP_IP_Type,
    "BedName":m.BedName,
    "WardName":m.WardName,
    // "RegNo":m.RegNo,
    // "OP_IP_Type":m.OP_IP_Type

  }
  console.log(m_data);
  //  setTimeout(() => {
    this.advanceDataStored.storage = new AdvanceDetailObj(m_data);
    // this._IpSearchListService.populateForm(m_data);
    const dialogRef = this._matDialog.open(NewLabrequestComponent, 
      {  
        maxWidth: '80%',
        height: '85%',
        width: '100%'
        
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      
    });

}
  getPrint(){
    
  }
  NewTestRequest() {
    const dialogRef = this._matDialog.open(NewLabrequestComponent,
      {
        maxWidth: '80%',
        height: '85%',
        width: '100%',
        // height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
         // this.getAdmittedPatientList();
    });
  }
  

  
  onShow(event: MouseEvent) {
    // this.click = false;// !this.click;
    this.click = !this.click;
    // this. showSpinner = true;

    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data';

        this.getLabRequestNursingList();
      }

    }, 50);
    this.MouseEvent = true;
    this.click = true;

  }
  getRecord(row) {
    
    console.log(row);
    var m_data = {
      
      "PatientName":this.patientName,
      "IP_OP_Number": this.OPIPNo
   }
      console.log(m_data)
    this.advanceDataStored.storage = new OPIPPatientModel(m_data);
    const dialogRef = this._matDialog.open(NewLabrequestComponent, 
         { 
          maxWidth: "85vw",
          height: '560px',
          width: '100%',
       });
       dialogRef.afterClosed().subscribe(result => {
         console.log('The dialog was closed - Insert Action', result);
         var m_data = {
    
          "FromDate": '2022-03-28 00:00:00.000',
          "ToDate": '2022-03-28 00:00:00.000',
          "Reg_No": (this.searchFormGroup.get("Reg_No").value) || 0
        }
        this.Data1=m_data;
        this._nursingStationService.getLabRequestList(this.Data1).subscribe(Visit => {
          this.dataSource.data = Visit as LabRequest[];
          console.log(this.dataSource.data);
          this.sIsLoading = '';
          this.click = false;
          },
            error => {
              this.sIsLoading = '';
            });
      });
    }
   
    onClose(){
      // this.dialogRef.close();
    }
  
  onClear() {

    this.searchFormGroup.get('start').reset();
    this.searchFormGroup.get('end').reset();
    this.searchFormGroup.get('Reg_No').reset();
    
  }

  onExport(exprtType){
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
    //       "Reg No" :this.dataSource.data[i]["RegNo"],
    //       "Patient Name" :this.dataSource.data[i]["PatientName"] ? this.dataSource.data[i]["PatientName"]:"N/A",
    //       "WardName" :this.dataSource.data[i]["WardName"] ? this.dataSource.data[i]["WardName"] :"N/A",
    //       "BedName" :this.dataSource.data[i]["BedName"] ? this.dataSource.data[i]["BedName"] : "N/A",
    //       "RequestType" :this.dataSource.data[i]["RequestType"] ? this.dataSource.data[i]["RequestType"]:"N/A",
    //       "IsOnFileTest" :this.dataSource.data[i]["IsOnFileTest"] ? this.dataSource.data[i]["IsOnFileTest"]:"N/A",
         
    //     };
    //     excelData.push(singleEntry);
    //   }
    //   var fileName = "LabRequest_PathRadio " + new Date() +".xlsx";
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



export class LabRequest {
  RegNo: any;
  PatientName: String;
  // DoctorName: String;
  WardName: String;
  RequestType: any;
  IsOnFileTest: boolean;

  constructor(LabRequest) {
    this.RegNo = LabRequest.RegNo || 0;
    this.PatientName = LabRequest.PatientName || '';
    // this.DoctorName = LabRequest.DoctorName || '';
    this.WardName = LabRequest.WardName || '';
    this.RequestType = LabRequest.RequestType || 0;
    this.IsOnFileTest = LabRequest.IsOnFileTest || 0;

  }}
 
 
  export class LabRequestDetail {
    ReqDate: Date;
    ReqTime: Date;
    ServiceName: String;
    AddedByName: any;
    BillingUser: any;
    AddedByDate: Date;
    AddedByTime: Date;
    IsStatus:boolean;
    PBill:any;
    IsTestCompted: boolean;
  
    constructor(LabRequestDetail) {
      this.ReqDate = LabRequestDetail.ReqDate || '';
      this.ReqTime = LabRequestDetail.ReqTime || '';
      this.ServiceName = LabRequestDetail.ServiceName || '';
      this.AddedByName = LabRequestDetail.AddedByName || '';
      this.BillingUser = LabRequestDetail.BillingUser || 0;
      this.AddedByDate = LabRequestDetail.AddedByDate || '';
      this.AddedByTime = LabRequestDetail.AddedByTime || '';
      this.PBill = LabRequestDetail.PBill || '';

      this.IsStatus = LabRequestDetail.IsStatus || 0;
      this.IsTestCompted = LabRequestDetail.IsTestCompted || 0;
  
    }}

function ViewChild(MatSort: any) {
  throw new Error('Function not implemented.');
}


// export NODE_OPTIONS="--max-old-space-size=7168" # Increases to 7 GB
// export NODE_OPTIONS="--max-old-space-size=8192" # Increases to 8 GB
