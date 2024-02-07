import { Component, Inject, OnInit } from '@angular/core';
import { RadiologyPrint } from '../radiology-order-list.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { DatePipe } from '@angular/common';
import { RadioloyOrderlistService } from '../radioloy-orderlist.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-radiology-template-report',
  templateUrl: './radiology-template-report.component.html',
  styleUrls: ['./radiology-template-report.component.scss']
})
export class RadiologyTemplateReportComponent implements OnInit {

  selectedAdvanceObj: RadiologyPrint;
  reportPrintObj: RadiologyPrint;
   Today :any;
   OPIPType:any;
 constructor(  private advanceDataStored: AdvanceDataStored,
   public datePipe: DatePipe,
   public _matDialog: MatDialog,
   @Inject(MAT_DIALOG_DATA) public data: any,
   public _radiologyorderListService: RadioloyOrderlistService,
   private accountService: AuthenticationService,) { }

 ngOnInit(): void {
   debugger;
   this.Today = [(new Date()).toISOString()];
   if (this.advanceDataStored.storage) {
     this.selectedAdvanceObj = this.advanceDataStored.storage;
    
    if(this.selectedAdvanceObj.PatientType)
    this.OPIPType =1;
    else this.OPIPType=0;
    
   }

   debugger;
   console.log(this.selectedAdvanceObj);
   this.getPrint(this.selectedAdvanceObj.RadReportId);
 }

 
 getPrint(el) {
  debugger;
   var D_data = {
         "RadReportId": el,
          "OP_IP_Type":this.OPIPType,     
       }
  console.log(D_data);
   this._radiologyorderListService.getRadiologyPrint(D_data).subscribe(res => {
     this.reportPrintObj = res as RadiologyPrint;
     // this.SummaryData = res as BrowseIpdreturnadvanceReceipt;
    console.log(this.reportPrintObj);
   });
 }


 
 viewgetPathologyTemplateReportPdf(obj) {
    
  this._radiologyorderListService.getRadiologyTempReport(
    1,1
    ).subscribe(res => {
    const dialogRef = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Radiology Template  Viewer"
        }
      });
  });
}



 onClose() {
   
   this._matDialog.closeAll();
 }

}