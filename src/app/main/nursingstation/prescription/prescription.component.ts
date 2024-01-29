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

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],  
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrescriptionComponent implements OnInit {

  hasSelectedContacts: boolean;
  SpinLoading:boolean=false;
  displayedColumns: string[] = [
    'action',
    'RegNo',
    'PatientName',
    'Vst_Adm_Date',
    'Date',
    'StoreName',
    'PreNo'
  ]

  dscPrescriptionDetList:string[] = [
    'ItemName',
    'Qty'
  ]

   
  dsprescritionList = new MatTableDataSource<PrescriptionList>();
  dsprescriptiondetList = new MatTableDataSource<PrescriptiondetList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
  
  constructor(
    public _PrescriptionService:PrescriptionService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private dialog:MatDialog
  ) { }


  

  ngOnInit(): void {
    this.getPrescriptionList();
  }

    // toggle sidebar
  toggleSidebar(name): void {
      this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  //window
  OpenNewPrescription(){
    this.dialog.open(NewPrescriptionComponent,{
      width:'98%',
      height:'750px'
      
    })
  }

  getPrescriptionList(){
    var vdata={
      FromDate: this.datePipe.transform(this._PrescriptionService.mysearchform.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
      ToDate: this.datePipe.transform(this._PrescriptionService.mysearchform.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
      Reg_No: this._PrescriptionService.mysearchform.get('RegNo').value || 0
    }
    // console.log(vdata);
    this._PrescriptionService.getPrecriptionlist(vdata).subscribe(data =>{
        this.dsprescritionList.data = data as PrescriptionList[];
        this.dsprescritionList.sort = this.sort;
        this.dsprescritionList.paginator = this.paginator;
        console.log(this.dsprescritionList.data);
    })
  }

  getPrescriptiondetList(Param){
    var vdata={
      IPMedID: Param

    }
    this._PrescriptionService.getPrecriptiondetlist(vdata).subscribe(data =>{
      this.dsprescriptiondetList.data = data as PrescriptiondetList[];
      this.dsprescriptiondetList.sort = this.sort;
      this.dsprescriptiondetList.paginator = this.paginator;
       console.log(this.dsprescriptiondetList.data);
    })
  }

  onSelect(Parama){
     console.log(Parama.IPMedID);
    this.getPrescriptiondetList(Parama.IPMedID)
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
      row.OP_IP_ID,0
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
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


  getPrint(){
    
    var m_data = {                   
      'PatientType': 1,
      'OP_IP_ID ':149
    }
   console.log(m_data);
    this._PrescriptionService.getPrintPrecriptionlist(m_data).subscribe(data => {
        this.reportPrintObjList = data as PrescriptionList[];
        
        this.reportPrintObj = data[0] as PrescriptionList;
        
        setTimeout(() => {
          this.print3();
        }, 1000);
      
      })

  }


 
  print3() {
    let popupWin, printContents;
   
    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
    
    popupWin.document.write(` <html>
    <head><style type="text/css">`);
    popupWin.document.write(`
      </style>
      <style type="text/css" media="print">
    @page { size: portrait; }
  </style>
          <title></title>
      </head>
    `);
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.PrescriptionTemplate.nativeElement.innerHTML}</body>
    <script>
      var css = '@page { size: portrait; }',
      head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');
      style.type = 'text/css';
      style.media = 'print';
  
      if (style.styleSheet){
          style.styleSheet.cssText = css;
      } else {
          style.appendChild(document.createTextNode(css));
      }
      head.appendChild(style);
    </script>
    </html>`);
    // popupWin.document.write(`<body style="margin:0;font-size: 16px;">${this.printTemplate}</body>
    // </html>`);
    
    popupWin.document.close();
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
  
  

  constructor(PrescriptionList) {
    this.RegNo=PrescriptionList.RegNo || 0;
    this.PatientName=PrescriptionList.PatientName || '';
    this.Date=PrescriptionList.Date  || '01/01/1900';
    this.Vst_Adm_Date=PrescriptionList.Vst_Adm_Date || '01/01/1900';
    this.StoreName=PrescriptionList.StoreName || '01/01/1900';
    this.PreNo=PrescriptionList.PreNo || '01/01/1900';
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
