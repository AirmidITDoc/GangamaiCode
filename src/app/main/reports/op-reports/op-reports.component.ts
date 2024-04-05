import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OPReportsService } from './opreports.service';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-op-reports',
  templateUrl: './op-reports.component.html',
  styleUrls: ['./op-reports.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OpReportsComponent implements OnInit {

 
  UserList: any = [];
  DoctorList: any = [];
  sIsLoading: string = '';
  currentDate = new Date();
 
    ReportID: any;
 
  filteredOptionsUser: Observable<string[]>;
  filteredOptionsDoctorMode: Observable<string[]>;
  isUserSelected: boolean = false;
  isSearchdoctorSelected: boolean = false;

  FlagUserSelected: boolean = false;
  FlagVisitSelected: boolean = false;
  FlagPaymentIdSelected: boolean = false;
  FlagRefundIdSelected: boolean = false;

  optionsUser: any[] = [];
  optionsPaymentMode: any[] = [];
  PaymentMode: any;
 
  ReportName: any;
  
  SpinLoading: boolean = false;
  AdList: boolean = false;
  FromDate: any;
  Todate: any;
  UserId: any = 0;
  UserName: any;
  IsLoading: boolean = false;
  searchDoctorList: any = [];
  optionsSearchDoc: any[] = [];


  displayedColumns = [
    'ReportName'
  ];

  dataSource = new MatTableDataSource<ReportDetail>();
  constructor(
    // this.dataSource.data = TREE_DATA;
    public _OPReportsService: OPReportsService,
    
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    public datePipe: DatePipe,
        private _loggedUser: AuthenticationService,
    private formBuilder: FormBuilder
  ) {
    this.UserId = this._loggedUser.currentUserValue.user.id;
    this.UserName = this._loggedUser.currentUserValue.user.userName;
    console.log(this.UserId)
  }


  ngOnInit(): void {
    this.bindReportData();
   
    // const toSelect = this.UserList.find(c => c.UserId == this.UserId);
    // this._OPReportsService.userForm.get('UserId').setValue(toSelect);

  }

  bindReportData() {
    // let qry = "SELECT * FROM ReportConfigMaster WHERE IsActive=1 AND IsDeleted=0 AND ReportType=1";
var data={
  ReportSection:"OP Reports"
}
    this._OPReportsService.getDataByQuery(data).subscribe(data => {
      this.dataSource.data = data as any[];

    });
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  ReportSelection(el) {
    this.ReportName = el.ReportName;
    this.ReportID = el.ReportId;

    if (this.ReportName == 'Patient Appointment Detail') {
      this.FlagVisitSelected=true
      this.FlagPaymentIdSelected=false
      // this.viewgetPatientAppointmentReportPdf();
    
    } 
    else if (this.ReportName == 'OP Payment Receipt') {
      this.FlagVisitSelected=false
      this.FlagPaymentIdSelected=true
      // this.viewgetOPPayemntPdf();
      
    } 
     else if (this.ReportName == 'OP RefundofBill') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected=false
      this.FlagRefundIdSelected = true;

    } 
    // else if (this.ReportName == 'OP IP COMMAN COLLECTION') {
    //   this.FlagUserSelected = true;
    //   this.FlagPaymentSelected = false;

    // } else if (this.ReportName == 'OP IP BILL SUMMARY') {
    //   this.FlagUserSelected = true;
    //   this.FlagPaymentSelected = false;

    // } 
    // else if (this.ReportName == 'Sales Return Summary Report') {
    //   this.FlagPaymentSelected = false;
    //   this.FlagUserSelected = false;

    // } else if (this.ReportName == 'Sales Return PatientWise Report') {
    //   this.FlagPaymentSelected = false;
    //   this.FlagUserSelected = false;
    // } else if (this.ReportName == 'Sales Credit Report') {
    //   this.FlagPaymentSelected = false;
    //   this.FlagUserSelected = false;

    // } else if (this.ReportName == 'Pharmacy Daily Collection Summary Day & User Wise') {
    //   this.FlagUserSelected = true;
    //   this.FlagPaymentSelected = false;

    // }
    // else if (this.ReportName == 'Sales Cash Book Report') {
    //   this.FlagPaymentSelected = true;
    //   this.FlagUserSelected = false;

    // }
  }


  getPrint() {
    if (this.ReportName == 'Patient Appointment Detail') {
      this.viewgetPatientAppointmentReportPdf();
     
    } 
    else if (this.ReportName == 'OP Payment Receipt') {
      this.viewgetOPPayemntPdf();
     
    } 
    else if (this.ReportName == 'OP RefundofBill') {
      this.viewgetOPRefundofBillPdf();
    }
    // else if (this.ReportName == 'OP IP BILL SUMMARY') {
    //   this.viewgetOPIPBillSummaryReportPdf();
    // }
    //  else if (this.ReportName == 'Sales Return Summary Report') {
    //   this.viewgetSalesReturnReportPdf();
    // } 
    // else if (this.ReportName == 'Sales Return PatientWise Report') {
    //   this.viewgetSalesReturnPatientwiseReportPdf();
    // } else if (this.ReportName == 'Sales Credit Report') {
    //   this.viewgetSalesCreditReportPdf();
    // } else if (this.ReportName == 'Pharmacy Daily Collection Summary Day & User Wise') {
    //   this.viewgetPharCollsummDayuserwiseReportPdf();
    // }
    // else if (this.ReportName == 'Sales Cash Book Report') {
    //   this.viewgetSalesCashBookReportPdf();
    // }
    // else if (this.ReportName == 'Purchase Order') {
    //   this.viewgetPurchaseorderReportPdf();
    // }
  }



  viewgetPatientAppointmentReportPdf() {
    
    let VisitId =this._OPReportsService.userForm.get('VisitId').value || 0;
  
     // this.sIsLoading = 'loading-data';
     setTimeout(() => {
       this.AdList = true;
       this._OPReportsService.getAppointmentReport(
         VisitId
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Appointment  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           this.AdList = false;
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }


   

viewgetOPPayemntPdf() {
 let PaymentId=this._OPReportsService.userForm.get('PaymentId').value ||0;
  setTimeout(() => {

  this._OPReportsService.getOpPaymentview(
  PaymentId
  ).subscribe(res => {
    const dialogRef = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Op Payment Receipt Viewer"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = '';
      });
     
  });
 
  },100);
}
viewgetOPRefundofBillPdf() {
  // this.sIsLoading = 'loading-data';
  let RefundId=this._OPReportsService.userForm.get('RefundId').value ||0;
  setTimeout(() => {
  
  this._OPReportsService.getOpRefundview(
    RefundId
  ).subscribe(res => {
    const dialogRef = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Op Refund Of Bill Receipt Viewer"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
       
      });
      dialogRef.afterClosed().subscribe(result => {
        
        this.sIsLoading = '';
      });
  });
 
  },100);
}

  userChk(option) {
    this.UserId = option.UserID || 0;
    this.UserName = option.UserName;
  }

  PaymentModeChk(option) {
    this.PaymentMode = option.PaymentMode;
  }

  onClose() { }



}


export class ReportDetail {
  ReportName: any;
  ReportId: any;
  constructor(ReportDetail) {
    this.ReportName = ReportDetail.ReportName || '';
    this.ReportId = ReportDetail.ReportId || '';
  }
}