import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { RequestforlabtestService } from './requestforlabtest.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewRequestforlabComponent } from './new-requestforlab/new-requestforlab.component';
import { Subscription } from 'rxjs';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import Swal from 'sweetalert2';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-requestforlabtest',
  templateUrl: './requestforlabtest.component.html',
  styleUrls: ['./requestforlabtest.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RequestforlabtestComponent implements OnInit {

  displayedColumns: string[] = [ 
    'RegNo', 
    'PatientName',  
    'WardName',
    'RequestType',
    'IsOnFileTest', 
    'action',
  ]

  displayColumns: string[] =[ 
    'IsStatus', 
    'IsComplted',
    'ReqDate',
    'ReqTime',
    'ServiceName',
    'AddedByName',
    'BillingUser',
    'AddedByDate',
    'PBillNo'
  ]

  
  hasSelectedContacts: boolean;
  SpinLoading:boolean=false;
  sIsLoading: string = "";
  dsrequestList = new MatTableDataSource<RequestList>();
  dsrequestdetList=new MatTableDataSource<RequestdetList>();

  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(public _RequestforlabtestService:RequestforlabtestService,
    public datePipe: DatePipe, 
    private _matDialog:MatDialog,
    public toastr: ToastrService,
    private _fuseSidebarService: FuseSidebarService,
    private dialog:MatDialog,
    private reportDownloadService: ExcelDownloadService,
    ) { }

  ngOnInit(): void {
    this.getRequesttList();
  }
  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getRequesttList(){
    var vdata={
      FromDate: this.datePipe.transform(this._RequestforlabtestService.mySearchForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
      ToDate: this.datePipe.transform(this._RequestforlabtestService.mySearchForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
      Reg_No: this._RequestforlabtestService.mySearchForm.get('RegNo').value || 0
    }
    console.log(vdata);
    this._RequestforlabtestService.getRequesttList(vdata).subscribe(data =>{
      this.dsrequestList.data = data as RequestList[];
      this.dsrequestList.sort = this.sort;
      this.dsrequestList.paginator = this.paginator;
      console.log(this.dsrequestList.data);
    })
  }
  getRequestdetList(Param){
   debugger
    var vdata={
      RequestId: Param.RequestId
    }
    this._RequestforlabtestService.getRequestdetList(vdata).subscribe(data =>{
      this.dsrequestdetList.data = data as RequestdetList[];
      this.dsrequestdetList.sort = this.sort;
      this.dsrequestdetList.paginator = this.paginator;
       console.log(this.dsrequestdetList.data);
    })
  }
  ChkNewReq:any=1
  Openpopup(){
    // this.dialog.open(UpdateGRNComponent,
    //   {
    //   width:'70vw',
    //   height:'95vh',
    //   panelClass: 'new-request-dialog'
    // });
    
    
    const dialogRef = this._matDialog.open(NewRequestforlabComponent,
      {
        width:'70vw',
        height:'95vh',
        data: { 
          ChkNewReq: this.ChkNewReq
      } 
      });
    dialogRef.afterClosed().subscribe(result => {
      this.getRequesttList();
    });
  }




  // onSelect(Parama){
  //   console.log(Parama.RequestId);
  //   this.getRequestdetList(Parama.RequestId)
  // }
  PresItemlist:any =[];
  deleteTableRow(element) {
    if(!element.IsClosed){
    // if (this.key == "Delete") {
      let index = this.PresItemlist.indexOf(element);
      if (index >= 0) {
        this.PresItemlist.splice(index, 1);
        this.dsrequestList.data = [];
        this.dsrequestList.data = this.PresItemlist;
      }
      Swal.fire('Success !', 'ItemList Row Deleted Successfully', 'success');

// debugger
      let query = "update T_HLabRequest set IsCancelled=1 where RequestId=" + element.RequestId + "";
      this._RequestforlabtestService.Canclerequest(query).subscribe((resData: any) => {
        
      });
    }
    else{
      Swal.fire('Billed Prescription can not Delete !');

    } 
  }


  viewgetLabrequestReportPdf(row) {
    debugger
    setTimeout(() => {
      this.SpinLoading =true;
    //  this.AdList=true;
    this._RequestforlabtestService.getLabrequestview(
      row.RequestId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Lab Request Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
    }); 
    },100);
  } 
  
  reportPrintObjList: RequestList[] = [];
  printTemplate: any;
  reportPrintObj: RequestList;
  reportPrintObjTax: RequestList;
  subscriptionArr: Subscription[] = [];
  @ViewChild('LabRequiestTemplate') LabRequiestTemplate:ElementRef;

 
  exportReportPdf() {
    let actualData = [];
    this.dsrequestList.data.forEach(e => {
      var tempObj = [];
      tempObj.push(e.RegNo);
      tempObj.push(e.PatientName);
      tempObj.push(e.WardName);
      tempObj.push(e.RequestType);
      tempObj.push(e.IsOnFileTest);
     
      actualData.push(tempObj);
    });
    let headers = [['RegNo','PatientName', 'WardName', 'RequestType', 'IsOnFileTest','IsCancelled']];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'IP Lab request');
  }

  exportIpLabrequestReportExcel(){
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['RegNo','PatientName', 'WardName', 'RequestType', 'IsOnFileTest','IsCancelled'];
    this.reportDownloadService.getExportJsonData(this.dsrequestList.data, exportHeaders, 'Ip Lab request List Datewise');
    this.dsrequestList.data = [];
    this.sIsLoading = '';
  }
  
  LabDataList:any=[];
//   LabReportView(contact) {

//     console.log(contact) 
//     this.LabDataList.push(
//       {
//         PathReportID :  contact.PathReportID, 
//       });
//       console.log(this.LabDataList)
//     let pathologyDelete = [];
//     this.LabDataList.forEach((element) => { 
//         let pathologyDeleteObj = {};
//         pathologyDeleteObj['pathReportId'] = element.PathReportID
//         pathologyDelete.push(pathologyDeleteObj);
//     }); 
 
//     let submitData = {
//         "printInsert": pathologyDelete,
//     };
//     console.log(submitData);
//     this._RequestforlabtestService.PathPrintResultentryInsert(submitData).subscribe(response => {
//       console.log(response);
//         if (response) {
//             this.viewgetPathologyTestReportPdf(contact.OP_IP_Type)
//             this.LabDataList = [];
//         }
//     }); 
// }
viewgetPathologyTestReportPdf(contact) {
 

  setTimeout(() => {
      this.SpinLoading = true; 
      this._RequestforlabtestService.getPathTestReport(contact.OP_IP_Type).subscribe(res => {
          const dialogRef = this._matDialog.open(PdfviewerComponent,
              {
                  maxWidth: "85vw",
                  height: '750px',
                  width: '100%',
                  data: {
                      base64: res["base64"] as string,
                      title: "pathology Test Report Viewer"
                  }
              });
          dialogRef.afterClosed().subscribe(result => { 
              this.SpinLoading = false;
          });
      });

  }, 100);
}



viewgetPathologyTemplateReportPdf(contact) {
  debugger
  // if(contact.IsTemplateTest == '1'){
    this._RequestforlabtestService.getPathologyTempReport(contact.PathReportID,contact.OP_IP_Type).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Pathology Template Report Viewer"
          }
        });
    });
  // }
  // else{
  //   this.LabDataList.push(
  //     {
  //       PathReportID :  contact.PathReportID, 
  //     });
  //     console.log(this.LabDataList)
  //   let pathologyDelete = [];
  //   this.LabDataList.forEach((element) => { 
  //       let pathologyDeleteObj = {};
  //       pathologyDeleteObj['pathReportId'] = element.PathReportID
  //       pathologyDelete.push(pathologyDeleteObj);
  //   });  
  //   let submitData = {
  //       "printInsert": pathologyDelete,
  //   };
  //   console.log(submitData);
  //   this._RequestforlabtestService.PathPrintResultentryInsert(submitData).subscribe(response => {
  //       if (response) {
  //           this.viewgetPathologyTestReportPdf1(contact.OP_IP_Type)
  //       }
  //   }); 
  // } 
}
viewgetPathologyTestReportPdf1(OP_IP_Type) {

setTimeout(() => {
    this.SpinLoading = true; 
    this._RequestforlabtestService.getPathTestReport(OP_IP_Type).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
            {
                maxWidth: "85vw",
                height: '750px',
                width: '100%',
                data: {
                    base64: res["base64"] as string,
                    title: "pathology Test Report Viewer"
                }
            });
        dialogRef.afterClosed().subscribe(result => { 
            this.SpinLoading = false;
        });
    });

}, 100);
}
}
export class RequestList{
  RegNo :any;
  PatientName: string;
  WardName:any;
  Vst_Adm_Date:any;
  Age:any;
  RequestType:any;
  TariffName:any;
  CompanyName:any;
  RefDocName:any;
  GenderName:any;
  AdmittedDocName:any;
  Price:any;
  AgeYear:any;
  RoomName:any;
  BillDate:any;
  BillTime:any;
  ReqDate:any;
  RequestId:any;
  IsOnFileTest:any;

  constructor(RequestList) {
    this.RegNo=RequestList.RegNo || 0;
    this.PatientName=RequestList.PatientName || '';
    this.WardName=RequestList.WardName  || ' ';
    this.Vst_Adm_Date=RequestList.Vst_Adm_Date || '01/01/1900';
    this.Age=RequestList.Age || 0;
    this.RequestType=RequestList.RequestType || '';
    this.TariffName=RequestList.TariffName || '';
    this.CompanyName=RequestList.CompanyName || '';
    this.RequestId =RequestList.RequestId || 0
    this.IsOnFileTest =RequestList.IsOnFileTest || 0
  }
}

export class RequestdetList{
  ReqDate: any;
  ReqTime: any;
  ServiceName:any;
  AddedByName:any;
  AddBilingUser:any;
  BillDateTime:any;
  IsStatus:any;
  PBillNo:any;
  IsComplted:any;
   
   

  constructor(RequestdetList){
    this.ReqDate=RequestdetList.ReqDate || 0;
    this.ReqTime=RequestdetList.ReqTime || 0;
    this.ServiceName=RequestdetList.ServiceName ||  '';
    this.AddedByName=RequestdetList.AddedByName ||  '';
    this.AddBilingUser=RequestdetList.AddBilingUser ||  '';
    this.BillDateTime=RequestdetList.BillDateTime ||  0;
    this.IsStatus=RequestdetList.IsStatus ||  0;
    this.PBillNo=RequestdetList.PBillNo ||  0;
    this.IsComplted=RequestdetList.IsComplted ||  0;
 
    }
}
