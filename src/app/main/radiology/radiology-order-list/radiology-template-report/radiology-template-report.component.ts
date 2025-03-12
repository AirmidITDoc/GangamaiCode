import { Component, Inject, OnInit } from '@angular/core';
import { RadiologyPrint } from '../radiology-order-list.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { DatePipe } from '@angular/common';
import { RadioloyOrderlistService } from '../radioloy-orderlist.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';

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
   private commonService: PrintserviceService,
   @Inject(MAT_DIALOG_DATA) public data: any,
   public _radiologyorderListService: RadioloyOrderlistService,
   private accountService: AuthenticationService,) { }

 ngOnInit(): void {
   ;
   this.Today = [(new Date()).toISOString()];
   if (this.advanceDataStored.storage) {
     this.selectedAdvanceObj = this.advanceDataStored.storage;
    
    if(this.selectedAdvanceObj.PatientType)
    this.OPIPType =1;
    else this.OPIPType=0;
    
   }

   ;
   console.log(this.selectedAdvanceObj);
   this.viewgetPathologyTemplateReportPdf(this.selectedAdvanceObj.RadReportId);
 }

 
  viewgetPathologyTemplateReportPdf(data) {
    // this.commonService.Onprint("PathReportId",data.pathReportId,"OP_IP_Type",1,"RadiologyTemplateReport");
  }
  




 onClose() {
   
   this._matDialog.closeAll();
 }

}