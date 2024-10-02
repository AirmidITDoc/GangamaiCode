import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PrescriptionService } from './prescription.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NewPrescriptionComponent } from './new-prescription/new-prescription.component';
import { Subscription } from 'rxjs';
import { Validators } from '@angular/forms';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { SampleRequestComponent } from 'app/main/pathology/sample-request/sample-request.component';
import { SampleCollectionComponent } from 'app/main/pathology/sample-collection/sample-collection.component';
import { ResultEntryComponent } from 'app/main/pathology/result-entry/result-entry.component';
import { RadiologyOrderListComponent } from 'app/main/radiology/radiology-order-list/radiology-order-list.component';
import Swal from 'sweetalert2';
import { CertificateComponent } from 'app/main/Mrd/certificate/certificate.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { PrescriptionretList, PrescriptionretdetList } from '../prescription-return/prescription-return.component';
import { NewPrescriptionreturnComponent } from '../prescription-return/new-prescriptionreturn/new-prescriptionreturn.component';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],  
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrescriptionComponent implements OnInit {
  sIsLoading: string = "";
  hasSelectedContacts: boolean;
  SpinLoading:boolean=false;
  PType:any;
  currentDate = new Date();

  displayedColumns: string[] = [ 
    'RegNo',
    'PatientName',
    'Vst_Adm_Date',
    'Date',
    'StoreName',
    'CompanyName', 
    'action',
  ]

  dscPrescriptionDetList:string[] = [
    'Status',
    'ItemName',
    'Qty',
    // 'TotalQty'
  ]

  displayedColumns1: string[] = [
   
    'Date',
    'RegNo',
    'PatientName',
    'Vst_Adm_Date',
    'StoreName',
    'IPMedID',
    'action',
  ]

  displayColumns: string[] =[
    'ItemName',
    'BatchNo',
    'Qty'
  ]

  dsprescritionList = new MatTableDataSource<PrescriptionList>();
  dsprescriptiondetList = new MatTableDataSource<PrescriptiondetList>();

  dsprescritionretList = new MatTableDataSource<PrescriptionretList>();
  dsprescriptionretdetList=new MatTableDataSource<PrescriptionretdetList>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
  
  constructor(
    public _PrescriptionService:PrescriptionService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public _WhatsAppEmailService: WhatsAppEmailService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private reportDownloadService: ExcelDownloadService,
    private dialog:MatDialog
  ) { }


  

  ngOnInit(): void {
    this.getPrescriptionList();
    this.getPriscriptionretList();
  }

    // toggle sidebar
  toggleSidebar(name): void {
      this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  getPrescriptionList(){
    var vdata={
      FromDate: this.datePipe.transform(this._PrescriptionService.mysearchform.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
      ToDate: this.datePipe.transform(this._PrescriptionService.mysearchform.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
      Reg_No: this._PrescriptionService.mysearchform.get('RegNo').value || 0,
   
    }
     console.log(vdata);
    this._PrescriptionService.getPrecriptionlistmain(vdata).subscribe(data =>{
        this.dsprescritionList.data = data as PrescriptionList[];
        this.dsprescritionList.sort = this.sort;
        this.dsprescritionList.paginator = this.paginator;
        console.log(this.dsprescritionList.data);
    })
  }
 
  getPrescriptiondetList(Param){
    debugger
    var vdata={
      IPMedID: Param.IPMedID

    }
    this._PrescriptionService.getPrecriptiondetlist(vdata).subscribe(data =>{
      this.dsprescriptiondetList.data = data as PrescriptiondetList[];
      this.dsprescriptiondetList.sort = this.sort;
      this.dsprescriptiondetList.paginator = this.paginator;
       console.log(this.dsprescriptiondetList.data);
    })
  }

  //window
  OpenNewPrescription(){ 
    const dialogRef = this._matDialog.open(NewPrescriptionComponent,
      {
        height: '90vh',
        width: '70vw'
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getPrescriptionList();
    });
  }

  keyPressCharater(event){
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  onChangePrescriptionType(event) {
    if (event.value == 'Pending') {
      this.PType = 0;
      this.getPrescriptionList();
    }
    else{
      this.PType = 1;
      this.getPrescriptionList();
    }
  }


  
  PresItemlist:any =[];
  deleteTableRow(element) {
    debugger
    if(!element.IsClosed){
    // if (this.key == "Delete") {
      let index = this.PresItemlist.indexOf(element);
      if (index >= 0) {
        this.PresItemlist.splice(index, 1);
        this.dsprescritionList.data = [];
        this.dsprescritionList.data = this.PresItemlist;
      }
      Swal.fire('Success !', ' Row Deleted Successfully', 'success');

    }
    else{
      Swal.fire('Row can not Delete ..!');

    }
  }



  reportPrintObjList: PrescriptionList[] = [];
  printTemplate: any;
  reportPrintObj: PrescriptionList;
  reportPrintObjTax: PrescriptionList;
  subscriptionArr: Subscription[] = [];
  @ViewChild('PrescriptionTemplate') PrescriptionTemplate:ElementRef;





  viewgetIpprescriptionReportPdf(row) {
    debugger
    setTimeout(() => {
      this.SpinLoading =true;
    //  this.AdList=true;
    this._PrescriptionService.getIpPrescriptionview(
      row.IPMedID,row.OPD_IPD_Type
      
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '850px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "IP Prescription Viewer"
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


  // getPrint(){
    
  //   var m_data = {                   
  //     'PatientType': 1,
  //     'OP_IP_ID ':149
  //   }
  //  console.log(m_data);
  //   this._PrescriptionService.getPrintPrecriptionlist(m_data).subscribe(data => {
  //       this.reportPrintObjList = data as PrescriptionList[];
        
  //       this.reportPrintObj = data[0] as PrescriptionList;
        
  //       setTimeout(() => {
  //         this.print3();
  //       }, 1000);
      
  //     })

  // }


 
  // print3() {
  //   let popupWin, printContents;
   
  //   popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
    
  //   popupWin.document.write(` <html>
  //   <head><style type="text/css">`);
  //   popupWin.document.write(`
  //     </style>
  //     <style type="text/css" media="print">
  //   @page { size: portrait; }
  // </style>
  //         <title></title>
  //     </head>
  //   `);
  //   popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.PrescriptionTemplate.nativeElement.innerHTML}</body>
  //   <script>
  //     var css = '@page { size: portrait; }',
  //     head = document.head || document.getElementsByTagName('head')[0],
  //     style = document.createElement('style');
  //     style.type = 'text/css';
  //     style.media = 'print';
  
  //     if (style.styleSheet){
  //         style.styleSheet.cssText = css;
  //     } else {
  //         style.appendChild(document.createTextNode(css));
  //     }
  //     head.appendChild(style);
  //   </script>
  //   </html>`);
  //   // popupWin.document.write(`<body style="margin:0;font-size: 16px;">${this.printTemplate}</body>
  //   // </html>`);
    
  //   popupWin.document.close();
  // }

  exportReportPrescriptionPdf() {
    let actualData = [];
    this.dsprescritionList.data.forEach(e => {
      var tempObj = [];
      tempObj.push(e.RegNo);
      tempObj.push(e.Vst_Adm_Date);
      tempObj.push(e.PatientName);
      tempObj.push(e.Date);
      tempObj.push(e.StoreName);
      tempObj.push(e.CompanyName);
     
      actualData.push(tempObj);
    });
    let headers = [['RegNo', 'Vst_Adm_Date', 'PatientName', 'Date', 'StoreName', 'CompanyName']];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'IP prescription List');
  }

  exportIpprescriptionReportExcel(){
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['RegNo', 'Vst_Adm_Date', 'PatientName', 'Date', 'StoreName', 'CompanyName'];
    this.reportDownloadService.getExportJsonData(this.dsprescritionList.data, exportHeaders, 'Ip prescription List Datewise');
    this.dsprescritionList.data = [];
    this.sIsLoading = '';
  }

  ///Prescription retrun
  
  onChangePrescriptionRetType(event) {
    if (event.value == 'Pending') {
      this.PType = 0;
      this.getPriscriptionretList();
    }
    else{
      this.PType = 1;
      this.getPriscriptionretList();
    }
  }


  getPriscriptionretList(){
    debugger
    var vdata={
      FromDate:this.datePipe.transform(this._PrescriptionService.mypreretunForm.get('startdate').value,"MM/dd/yyyy") || '01/2/2023',
      ToDate:this.datePipe.transform(this._PrescriptionService.mypreretunForm.get('enddate').value,"MM/dd/yyyy") || '01/2/2023',
      Reg_No: this._PrescriptionService.mypreretunForm.get('RegNo').value || 0,
      // Type :this.PType || 0
    }
    console.log(vdata)
    this._PrescriptionService.getPriscriptionretList(vdata).subscribe(data =>{
      this.dsprescritionretList.data = data as PrescriptionretList[];
      this.dsprescritionretList.sort = this.sort;
      this.dsprescritionretList.paginator = this.paginator;
     // console.log(this.dsprescritionretList.data);
  })
  }

  getPreiscriptionretdetList(Param){
    var vdata={
      PresReId: Param
    }
    this._PrescriptionService.getPreiscriptionretdetList(vdata).subscribe(data =>{
      this.dsprescriptionretdetList.data = data as PrescriptionretdetList[];
      this.dsprescriptionretdetList.sort = this.sort;
      this.dsprescriptionretdetList.paginator = this.paginator;
       //console.log(this.dsprescriptionretdetList.data);
    })
  }

  onSelect(Parama){
     console.log(Parama.PresReId);
    this.getPreiscriptionretdetList(Parama.PresReId)
  }

  //window
  OpenNewPrescriptionret(){
    this.dialog.open(NewPrescriptionreturnComponent,{
        height: '85vh',
        width: '70vw'
    })
  }

  exportReportPdf() {
    let actualData = [];
    this.dsprescritionretList.data.forEach(e => {
      var tempObj = [];
      tempObj.push(e.Date);
      tempObj.push(e.RegNo);
      tempObj.push(e.PatientName);
      tempObj.push(e.Vst_Adm_Date);
      tempObj.push(e.StoreName);
      tempObj.push(e.IPMedID);
     
      actualData.push(tempObj);
    });
    let headers = [['Date', 'RegNo', 'PatientName', 'Vst_Adm_Date', 'StoreName', 'IPMedID']];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'IP Prescription Return List');
  }

  exportIpprescriptionReturnReportExcel(){
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['Date', 'RegNo', 'PatientName', 'Vst_Adm_Date', 'StoreName', 'IPMedID'];
    this.reportDownloadService.getExportJsonData(this.dsprescritionretList.data, exportHeaders, 'Ip prescription  Return List Datewise');
    this.dsprescritionretList.data = [];
    this.sIsLoading = '';
  }



  viewgetIpprescriptionreturnReportPdf(row) {
    debugger
    setTimeout(() => {
      this.SpinLoading =true;
    this._PrescriptionService.getIpPrescriptionreturnview(row.PresReId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '850px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "IP Prescription Return Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.SpinLoading = false;
        });
        dialogRef.afterClosed().subscribe(result => {
          this.SpinLoading = false;
        });
    });
   
    },100);
  }

  getWhatsappshareSales(el, vmono) {
    if (vmono != '' && vmono != '0') {
      var m_data = {
        "insertWhatsappsmsInfo": {
          "mobileNumber": vmono || 0,
          "smsString": '',
          "isSent": 0,
          "smsType": 'IPPrescription',
          "smsFlag": 0,
          "smsDate": this.currentDate,
          "tranNo": el,
          "PatientType": 2,//el.PatientType,
          "templateId": 0,
          "smSurl": "info@gmail.com",
          "filePath": '',
          "smsOutGoingID": 0
        }
      }
      this._WhatsAppEmailService.InsertWhatsappSales(m_data).subscribe(response => {
        if (response) {
          this.toastr.success('Prescription Sent on WhatsApp Successfully.', 'Save !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
        } else {
          this.toastr.error('API Error!', 'Error WhatsApp!', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
  }
    deleteTablePreturnRow(element) {
    if(!element.IsClosed){
    // if (this.key == "Delete") {
      let index = this.PresItemlist.indexOf(element);
      if (index >= 0) {
        this.PresItemlist.splice(index, 1);
        this.dsprescritionretList.data = [];
        this.dsprescritionretList.data = this.PresItemlist;
      }
      Swal.fire('Success !', ' Row Deleted Successfully', 'success');

    }
    else{
      Swal.fire('Row can not Delete Billed Prescription!');

    }
  }

}



export class PrescriptionList{
  RegNo :any;
  PatientName: string;
  Date:any;
  Vst_Adm_Date:any;
  StoreName:any;
  PreNo:any;
  OPD_IPD_IP:any;
  AgeYear:any;
  GenderName:any;
  VisitDate:any;
  ConsultantDocName:any;
  DrugName:any;
  PrecriptionId:any;
  TotalQty:any;
  PDate:any;
  IPPreId:any;
  WardName:any;
  CompanyName:any;
  

  constructor(PrescriptionList) {
    this.RegNo=PrescriptionList.RegNo || 0;
    this.PatientName=PrescriptionList.PatientName || '';
    this.Date=PrescriptionList.Date  || '01/01/1900';
    this.Vst_Adm_Date=PrescriptionList.Vst_Adm_Date || '01/01/1900';
    this.StoreName=PrescriptionList.StoreName || '01/01/1900';
    this.PreNo=PrescriptionList.PreNo || '';
    this.CompanyName=PrescriptionList.CompanyName || '01/01/1900';

  }
}

export class PrescriptiondetList{
  ItemName: any;
  Qty:number;

  constructor(PrescriptiondetList){
    this.ItemName=PrescriptiondetList.ItemName;
    this.Qty=PrescriptiondetList.Qty;
  }
}
