import { Component, Inject, OnInit } from '@angular/core';
import { Templateprintdetail } from '../result-entry.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ResultEntryService } from '../result-entry.service';

@Component({
  selector: 'app-path-template-view',
  templateUrl: './path-template-view.component.html',
  styleUrls: ['./path-template-view.component.scss']
})
export class PathTemplateViewComponent implements OnInit {

  
  selectedAdvanceObj: Templateprintdetail;
 Today :any;

rptData: any;
reportPrintObj: Templateprintdetail;
SummaryData:any=[];  
  
subscriptionArr: Subscription[] = [];
printTemplate: any;


mynumber:number=0;
outputWords=''

  constructor(
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    public _SampleService: ResultEntryService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
     private accountService: AuthenticationService,) { 
      this.rptData = data;
      // console.log(this.rptData);
  
    }



  ngOnInit(): void {
    this.Today = [(new Date()).toISOString()];
    
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
    //  console.log(this.selectedAdvanceObj);
    }
   
    this.getPrint(this.selectedAdvanceObj);
  }

  convertToWord(e){
    // this.numberInWords= converter.toWords(this.mynumber);
    //  return converter.toWords(e);
       }
   
    
   
  getPrint(el) {
     debugger;
     var OPIPType;
     if(el.PatientType=="OP")
     OPIPType =0;
     else OPIPType=1;
 
      var D_data = {
            "PathReportID":el.PathReportID,// 743674,//el,//82371,
             "OP_IP_Type":OPIPType,//el.OPD_IPD_Type,     
          }
     console.log(D_data);
      this._SampleService.getPathTemplatePrint(D_data).subscribe(res => {
        this.reportPrintObj = res as Templateprintdetail;
        // this.SummaryData = res as BrowseIpdreturnadvanceReceipt;
         console.log(this.reportPrintObj);
      });
    }
    
    
  
  print() {
    
    let popupWin, printContents;
      
    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
    // popupWin.document.open();
    popupWin.document.write(` <html>
    <head><style type="text/css">`);
    popupWin.document.write(`
      </style>
          <title></title>
      </head>
    `);
    popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
    </html>`);
    popupWin.document.close();
  }
   
  onClose() {
   
    this._matDialog.closeAll();
  }
  

}
