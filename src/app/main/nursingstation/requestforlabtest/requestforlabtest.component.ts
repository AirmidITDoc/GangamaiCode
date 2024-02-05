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

@Component({
  selector: 'app-requestforlabtest',
  templateUrl: './requestforlabtest.component.html',
  styleUrls: ['./requestforlabtest.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RequestforlabtestComponent implements OnInit {

  hasSelectedContacts: boolean;
  SpinLoading:boolean=false;
  displayedColumns: string[] = [
    'action',
    'RegNo',
    'PatientName',
    'Age',
    'Vst_Adm_Date',
    'WardName',
    'RequestType',
    // 'TariffName',
    // 'CompanyName'
  ]

  displayColumns: string[] =[
    'ReqDate',
    'ReqTime',
    'ServiceName',
    'AddedByName',
    'AddBilingUser',
    'BillDateTime',
    'IsStatus',
    'PBillNo',
    'IsComplted'
  ]

  dsrequestList = new MatTableDataSource<RequestList>();
  dsrequestdetList=new MatTableDataSource<RequestdetList>();

  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(public _RequestforlabtestService:RequestforlabtestService,
    public datePipe: DatePipe,
    
    private _matDialog:MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    private dialog:MatDialog
    
    ) { }

  ngOnInit(): void {
    this.getRequesttList();
  }
     // toggle sidebar
     toggleSidebar(name): void {
      this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
 

  Openpopup(){
    this.dialog.open(NewRequestforlabComponent,{
      width:'80%',
      height:'800px',
      panelClass: 'new-request-dialog'
    })
  }
  getRequesttList(){
    var vdata={
      FromDate: this.datePipe.transform(this._RequestforlabtestService.mySearchForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
      ToDate: this.datePipe.transform(this._RequestforlabtestService.mySearchForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
      Reg_No: this._RequestforlabtestService.mySearchForm.get('RegNo').value || 0
    }
    //console.log(vdata);
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

  // onSelect(Parama){
  //   console.log(Parama.RequestId);
  //   this.getRequestdetList(Parama.RequestId)
  // }


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

  getPrint(){
      var m_data = {
        // FromDate: this.datePipe.transform(this._RequestforlabtestService.mySearchForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
        // ToDate: this.datePipe.transform(this._RequestforlabtestService.mySearchForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
        // Reg_No: this._RequestforlabtestService.mySearchForm.get('RegNo').value || 0
        'RequestId': 73612
      }
     console.log(m_data);
      this._RequestforlabtestService.getPrintRequesttList(m_data).subscribe(data => {
          this.reportPrintObjList = data as RequestList[];
          
          this.reportPrintObj = data[0] as RequestList;
          
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
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.LabRequiestTemplate.nativeElement.innerHTML}</body>
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

  constructor(RequestList) {
    this.RegNo=RequestList.RegNo || 0;
    this.PatientName=RequestList.PatientName || '';
    this.WardName=RequestList.WardName  || ' ';
    this.Vst_Adm_Date=RequestList.Vst_Adm_Date || '01/01/1900';
    this.Age=RequestList.Age || 0;
    this.RequestType=RequestList.RequestType || '';
    this.TariffName=RequestList.TariffName || '';
    this.CompanyName=RequestList.CompanyName || '';
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
