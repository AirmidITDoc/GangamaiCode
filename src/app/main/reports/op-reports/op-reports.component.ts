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
  Reportsection='OP Reports';
// Reportsection='Inventory Reports';
  FlagDoctorIdSelected: boolean = false;


FlagDoctorSelected: boolean = false;
FlagBillNoSelected: boolean = false;

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
    
    if (this._ActRoute.url == "/reports/opreports") 
      this.Reportsection='OP Reports'
    if (this._ActRoute.url == "/reports/opreports") 
    this.Reportsection='OP MIS Reports'
   
    // if (this._ActRoute.url == "/reports/ipreport") 
    //   this.Reportsection='IP Reports'
    // if (this._ActRoute.url == "/reports/pharmacyreport") 
    //   this.Reportsection='Pharm Reports'
    // if (this._ActRoute.url == "/reports/ipbillingreport") 
    //   this.Reportsection='IPBilling Reports'
    if (this._ActRoute.url == "/reports/opbillingreport") 
      this.Reportsection='OP Billing'
    this.bindReportData();
  }

  bindReportData() {
   
var data={
  ReportSection:this.Reportsection
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
    if (this.ReportName == 'Registration Report') {
      this.FlagVisitSelected=false
      this.FlagPaymentIdSelected=false
      } 
    if (this.ReportName == 'AppoitnmentList Report') {
      this.FlagVisitSelected=false
      this.FlagPaymentIdSelected=false
      } 
   else if (this.ReportName == 'DoctorWise Visit Report') {
      this.FlagUserSelected = false;
      // this.FlagPaymentSelected = false;

    } else if (this.ReportName == 'c') {
      this.FlagUserSelected = true;
      // this.FlagPaymentSelected = false;

    } 
    else if (this.ReportName == 'Department Wise count summury') {
      // this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;

    } else if (this.ReportName == 'DoctorWise Visit Count Summary') {
      // this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
    } else if (this.ReportName == 'Reference doctor wise Report') {
      // this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
    }else if (this.ReportName == 'Department Wise Count Summary') {
      // this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
    }else if (this.ReportName == 'DoctorWise Visit Count Summary') {
      // this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
    }else if (this.ReportName == 'Appointment List with Service Availed') {
      // this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;

    } else if (this.ReportName == 'Cross Consultation Report') {
      this.FlagUserSelected = false;
      // this.FlagPaymentSelected = false;

    }
    else if (this.ReportName == 'Doctor Wise new and Old Patient Report') {
      // this.FlagPaymentSelected = true;
      this.FlagUserSelected = false;

    } 

    //op Billing
    if (this.ReportName == 'OP Daily Collection') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = false;

    }else if (this.ReportName == 'OP Bill Receipt') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Bill Summary Report') {
      this.FlagUserSelected = false;
    //  this.FlagPaymentSelected = false;
    this.FlagBillNoSelected = false;

    } 
    else if (this.ReportName == 'Credit Reports') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
    } 
     
    else if (this.ReportName == 'Refund of Bill Reports') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected=false
      this.FlagRefundIdSelected = false;

    } 
    // else if (this.ReportName == 'OP DAILY COLLECTION') {
    //   this.FlagUserSelected = true;
    //   this.FlagDoctorSelected = true;
    //   this.FlagBillNoSelected=false;
    // }
    else if (this.ReportName == 'OP Daily Collection Summary Reports') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
    }
     else if (this.ReportName == 'OP DAILY COLLECTION USERWISE') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }

    //OPMIS
    if (this.ReportName == 'Day wise OPD Count Details') {
      this.FlagVisitSelected=false
      this.FlagPaymentIdSelected=false
     
    } 
    if (this.ReportName == 'Day wise OPD Count Summary') {
      this.FlagVisitSelected=false
      this.FlagPaymentIdSelected=false
      
    } 
    else if (this.ReportName == 'Department wise OPD Count') {
      this.FlagVisitSelected=false
      this.FlagPaymentIdSelected=false
      // this.viewgetOPPayemntPdf();
      this.FlagRefundIdSelected = false;
      
    } 
    
    else if (this.ReportName == 'Department wise OPD Count Summary') {
      this.FlagUserSelected = false;
      // this.FlagPaymentSelected = false;

    } else if (this.ReportName == 'Dr. Wise OPD Count Detail') {
      this.FlagUserSelected = false;
      this.FlagDoctorIdSelected = true;

    } 
    else if (this.ReportName == 'Dr. Wise OPD Count Summary') {
      this.FlagDoctorIdSelected = true;
      this.FlagUserSelected = false;

    } else if (this.ReportName == 'Dr. Wise OPD Collection  Details ') {
      // this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
    } else if (this.ReportName == 'Dr. Wise OPD Collection  Summary ') {
      // this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;

    } else if (this.ReportName == 'Department Wise OPD Collection Details') {
      this.FlagUserSelected = false;
      // this.FlagPaymentSelected = false;

    }
    else if (this.ReportName == 'Department Wise OPD Collection Summary') {
      // this.FlagPaymentSelected = true;
      this.FlagUserSelected = false;

    }
    else if (this.ReportName == 'Dept Service Group Wise Collection Details') {
      // this.FlagPaymentSelected = true;
      this.FlagUserSelected = false;

    }else if (this.ReportName == 'Dept Service Group Wise Collection Summary') {
      // this.FlagPaymentSelected = true;
      this.FlagUserSelected = false;

    }

    
    //Inventory
    if (this.ReportName == 'Item List') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }else if (this.ReportName == 'Supplier List') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Indent Report') {
      this.FlagUserSelected = false;
    //  this.FlagPaymentSelected = false;
    this.FlagBillNoSelected = false;

    } 
    else if (this.ReportName == 'Monthly Purchase(GRN) Report') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
    } 
     
    else if (this.ReportName == 'GRN Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected=false
      this.FlagRefundIdSelected = false;

    } 
    else if (this.ReportName == 'GRN Return Report') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = true;
      this.FlagBillNoSelected=false;
    }
    else if (this.ReportName == 'Monthly Purchase(GRN) Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
    }
     else if (this.ReportName == 'Monthly Purchase(GRN) Report') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'GRN Wise Product Qty Report') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = true;
      this.FlagBillNoSelected=false;
    }
    else if (this.ReportName == 'GRN Purchase Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
    }
     else if (this.ReportName == 'Supplier Wise GRN List') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Issue To Department') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = true;
      this.FlagBillNoSelected=false;
    }
    else if (this.ReportName == 'Issue To Department Item Wise') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
    }
     else if (this.ReportName == 'Return From Department') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Purchase Order') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = true;
      this.FlagBillNoSelected=false;
    }
    else if (this.ReportName == 'Material Consumption Monthly Summary') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
    }
     else if (this.ReportName == 'Material Consumption') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Item Expiry Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
    }
     else if (this.ReportName == 'Current Stock Report') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Closing Current Stock Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
    }
     else if (this.ReportName == 'Item Wise Supplier List') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Current Stock Date Wise') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
    }
     else if (this.ReportName == 'Non-Moving Item List') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Non-Moving Item Without Batch List') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Patient Wise Material Consumption') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
    }
     else if (this.ReportName == 'Last Purchase Rate Wise Consumtion') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Item Count') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
    }
     else if (this.ReportName == 'Supplier Wise Debit Credit Note') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }   else if (this.ReportName == 'Stock Adjustment Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
    }
     else if (this.ReportName == 'Purchase Wise GRN Summary') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    
  }


  getPrint() {
   
    if (this.ReportName == 'Registration Report') {
      this.viewgetRegistrationlistReportPdf();
    }
    if (this.ReportName == 'AppoitnmentList Report') {
      this.viewgetAppointmentlistReportPdf();
     
    } 
     else if (this.ReportName == 'DoctorWise Visit Report') {
      this.viewgetDoctorwisevisitReportPdf();
    } else if (this.ReportName == 'Reference doctor wise Report') {
      this.viewgetRefDoctorwisevisitReportPdf();
    } 
    else if (this.ReportName == 'Department Wise Count Summary') {
      this.viewgetDeptwisecountsummaryReportPdf();
    } else if (this.ReportName == 'DoctorWise Visit Count Summary') {
      this.viewgetDocwisevisitcountsummaryReportPdf();
    } else if (this.ReportName == 'Appointment List with Service Availed') {
      this.viewgetApplistwithserviceavailedReportPdf();
    }
    else if (this.ReportName == 'Cross Consultation Report') {
      this.getCrossConsultationview();
    }
    else if (this.ReportName == 'Doctor Wise new and Old Patient Report') {
      this.viewgetDocwisenewoldpatientReportPdf();
    }
   

    //op billing 
    if (this.ReportName == 'OP Daily Collection') {
      this.viewOpDailyCollectionuserwisePdf();
    } 
    else if (this.ReportName == 'OP Daily Collection Summary Reports') {
      this.viewOpDailyCollectionSummaryPdf();
      
    }
    else if (this.ReportName == 'OP Bill Receipt') {
      this.viewgetOPBillReportPdf();
      
    }
     else if (this.ReportName == 'OP Daily COLLECTION UserWise') {
      this.viewOpDailyCollectionUserwisePdf();
    } 
    else if (this.ReportName == 'Bill Summary Report') {
      this.viewgetOPBillSummaryReportPdf();
    }
     else if (this.ReportName == 'Credit Reports') {
      this.viewgetCreditReportPdf();
    } 
    else if (this.ReportName == 'Refund of Bill Reports') {
    
      this.viewgetOPRefundofBillPdf();
    }


    
    
    //Inventory
    if (this.ReportName == 'Current Stock Report') {
      this.viewInvCurrentstockPdf();
    } 
    else if (this.ReportName == 'Current Stock Date Wise') {
      this.viewCurrentstockdatewisePdf();
      
    }
    else if (this.ReportName == 'Item Expiry Report') {
      this.viewgetItemexpiryPdf();
      
    }
     else if (this.ReportName == 'Non-Moving Item List') {
      this.viewNonMovingItemPdf();
    } 
    else if (this.ReportName == 'Indent Report') {
      this.viewgetIndentPdf();
    }
     else if (this.ReportName == 'Material Consumption') {
      this.viewgetMaterialConsumptionPdf();
    } 
    else if (this.ReportName == 'Issue To Department') {
    
      this.viewgetIssuetodeptPdf();
    }
    else if (this.ReportName == 'Return From Department') {
      this.viewgetReturnfromdeptPdf();
    } 
    else if (this.ReportName == 'Issue To Department') {
    
      this.viewgetIssuetodeptPdf();
    }
    else if (this.ReportName == 'Patient Wise Material Consumption') {
      this.viewgetMaterialConsumptionPdf();
    } 
    else if (this.ReportName == 'GRN Report') {
      this.viewgetGRNReportPdf();
    } 
    else if (this.ReportName == 'Purchase Order') {
      this.viewgetItemwisePurchasePdf();
    } 


    //OPMIS
    if (this.ReportName == 'Day wise OPD Count Details') {
      this.viewgetDaywiseopdcountReportPdf();
    }
    else   if (this.ReportName == 'Day wise OPD Count Summary') {
      this.viewgetDaywiseopdcountsummaryReportPdf();
     
    }   else if (this.ReportName == 'Department wise OPD Count') {
      this.viewgetDeptwiseopdcountPdf();
     
    } 
     else if (this.ReportName == 'Department wise OPD Count Summary') {
      this.viewgetDeptwiseopdcountsummaryReportPdf();
    } 
    else if (this.ReportName == 'Dr. Wise OPD Count Detail') {
      this.viewgetDoctorwiseopdcountdetailReportPdf();
    } else if (this.ReportName == 'Dr. Wise OPD Count Summary') {
      this.viewgetDocwiseopdcountsummaryReportPdf();
    } else if (this.ReportName == 'Dr. Wise OPD Collection  Details ') {
      this.viewgetDoctorwiseopdcolledetailReportPdf();
    }
    else if (this.ReportName == 'Dr. Wise OPD Collection  Summary ') {
      this.getDocwiseopdcollsummaryview();
    }
    else if (this.ReportName == 'Department Wise OPD Collection Details') {
      this.viewgetDeptwiseopdcolldetailReportPdf();
    } else if (this.ReportName == 'Department Wise OPD Collection Summary') {
      this.viewgetDeptwiseopdcollesummaryReportPdf();
    }
    else if (this.ReportName == 'Dept Service Group Wise Collection Details') {
      this.getDeptservicegroupwisecolldetailview();
    }
    else if (this.ReportName == 'Dept Service Group Wise Collection Summary') {
      this.getDeptservicegroupwisecollsummaryview();
    }
  }


  
  viewgetRegistrationlistReportPdf() {
    this.sIsLoading = 'loading-data';
   
     setTimeout(() => {
       this.AdList = true;
       this._OPReportsService.getRegistrationlistReport(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Registration List Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           this.AdList = false;
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }


  viewgetAppointmentlistReportPdf() {
    this.sIsLoading = 'loading-data';
     setTimeout(() => {
       this.AdList = true;
       this._OPReportsService.getAppointmentListReport(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Appointment List Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           this.AdList = false;
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }

  

getCrossConsultationview() {
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getCrossConsultationreportView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Cross Consultation Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}

viewgetRefDoctorwisevisitReportPdf(){
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
  //   this.SpinLoading =true;
  let VisitId
  this._OPReportsService.getRefDoctorwisevisitView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Ref Doctor Wise Visit  Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);
}
viewgetDoctorwisevisitReportPdf() {
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
  //   this.SpinLoading =true;
  let VisitId
  this._OPReportsService.getDoctorwisevisitView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Doctor Wise Visit  Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}

viewgetDeptwisecountsummaryReportPdf() {
  debugger
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getdepartmentwisecountsummView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Department wise count Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}
viewgetDocwisevisitcountsummaryReportPdf() {
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getDocwisevisitsummaryView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Doctor Wise Visit count Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}
viewgetApplistwithserviceavailedReportPdf() {
  this.sIsLoading = 'loading-data';
  setTimeout(() => {

  this._OPReportsService.getAppointmentlistwithserviceavailedView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Appointment list With Service Availed Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}
viewgetDocwisenewoldpatientReportPdf() {
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getDocwisenewoldpatientView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Doctor Wise New Old Patient List Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}


//opbilling
viewOpDailyCollectionuserwisePdf() {
  let AddUserId = 0;
  let DoctorId =0
  this.sIsLoading = 'loading-data';
  if (this._OPReportsService.userForm.get('UserId').value)
    AddUserId = this._OPReportsService.userForm.get('UserId').value.UserId
  
  setTimeout(() => {
    
    this.AdList = true;
    
    this._OPReportsService.getOpDailyCollectionuserwise(
      this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      AddUserId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '1000px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "OP Daily Collection Viewer"
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        this.AdList = false;
        this.sIsLoading = '';
      });
    });

  }, 100);
}


viewOpDailyCollectionSummaryPdf() {
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
    
    this.AdList = true;
    
    this._OPReportsService.getOpDailyCollectionsummary(
      this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
     
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '1000px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "OP Daily Collection Summary Viewer"
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        this.AdList = false;
        this.sIsLoading = '';
      });
    });

  }, 100);
}


viewgetOPBillReportPdf() {
  let  BillNo=this._OPReportsService.userForm.get('BillNo').value ||0;
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
      // this.SpinLoading =true;
     this.AdList=true;
    this._OPReportsService.getOpBillReceipt(
   BillNo
    ).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "OP BILL Viewer"
          }
        });
        matDialog.afterClosed().subscribe(result => {
          this.AdList=false;
          this.sIsLoading = '';
        });
    });
   
    },100);
  }

  
  viewOpDailyCollectionUserwisePdf() {
    this.sIsLoading = 'loading-data';
    let AddUserId = 0;
    let DoctorId =0

    if (this._OPReportsService.userForm.get('UserId').value)
      AddUserId = this._OPReportsService.userForm.get('UserId').value.UserId
    
    if (this._OPReportsService.userForm.get('DoctorId').value)
      DoctorId = this._OPReportsService.userForm.get('DoctorId').value.DoctorID

    setTimeout(() => {
      
      this.AdList = true;
      
      this._OPReportsService.getOpDailyCollection(
        this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        AddUserId,DoctorId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '1000px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "OP Daily Collection User Wise Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
        });
      });

    }, 100);
  }
  viewgetOPBillSummaryReportPdf() {

    let AddUserId = 0;
    if (this._OPReportsService.userForm.get('UserId').value)
      AddUserId = this._OPReportsService.userForm.get('UserId').value.UserId

    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
     
      this._OPReportsService.getOPBillSummary(
        this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        AddUserId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "OP Bill Summary Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
        });
      });

    }, 100);
  }
 
  viewgetCreditReportPdf() {
    this.sIsLoading = 'loading-data';
  
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
     
      this._OPReportsService.getOPcreditlist(
        this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "OP Credit List  Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
        });
      });

    }, 100);
  }
  viewgetOPRefundofBillPdf() {
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
    
    this._OPReportsService.getOpRefundofbillview(
      this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
      this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
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


  //inventory
  viewInvCurrentstockPdf() {
    this.sIsLoading = 'loading-data';
   
   let ItemName ='%'
 let StoreId =0
     setTimeout(() => {
       this.AdList = true;
       this._OPReportsService.getCurrentstockReport(
        ItemName,StoreId
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Current Stock Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           this.AdList = false;
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }

   viewCurrentstockdatewisePdf() {
    this.sIsLoading = 'loading-data';
   let StoreId =0;
     setTimeout(() => {
       this.AdList = true;
       this._OPReportsService.getCurrentstockdatewiseReport(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        StoreId
        // ? this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Current Stock Date Wise Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           this.AdList = false;
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }
   viewgetItemexpiryPdf() {
   let ExpMonth =0
   let ExpYear =0
   let StoreID =0


    this.sIsLoading = 'loading-data';
   
     setTimeout(() => {
       this.AdList = true;
       this._OPReportsService.getItemExpiryReport(
        ExpMonth,ExpYear,StoreID
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Item Expiry Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           this.AdList = false;
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }

  
   viewNonMovingItemPdf() {
    this.sIsLoading = 'loading-data';
   let NonMovingDay =0
    let StoreId =0
     setTimeout(() => {
       this.AdList = true;
       this._OPReportsService.getNonmovinglistReport(
        NonMovingDay,StoreId
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Non Moving Item List Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           this.AdList = false;
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }



   viewgetIndentPdf() {
    this.sIsLoading = 'loading-data';
   
   let IndentId =0

     setTimeout(() => {
       this.AdList = true;
       this._OPReportsService.getIndentwiseReport(
        IndentId
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Indent Wise Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           this.AdList = false;
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }
 
   
   viewgetMaterialConsumptionPdf() {
    this.sIsLoading = 'loading-data';
   let MaterialConsumptionId=0
     setTimeout(() => {
       this.AdList = true;
       this._OPReportsService.getMaterialConsumptionReport(
        MaterialConsumptionId
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Material Consumption Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           this.AdList = false;
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }
   viewgetIssuetodeptPdf() {
   let IssueId =0
  
    this.sIsLoading = 'loading-data';
   
     setTimeout(() => {
       this.AdList = true;
       this._OPReportsService.getIssuetodeptReport(
        IssueId
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Issue To Department Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           this.AdList = false;
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }

  
   viewgetReturnfromdeptPdf() {
    this.sIsLoading = 'loading-data';
   
    let ReturnId =0
     setTimeout(() => {
       this.AdList = true;
       this._OPReportsService.getReturnfromdeptReport(
        ReturnId
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Return From Department Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           this.AdList = false;
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }


   viewgetGRNReportPdf() {
    let GRNID=0
    setTimeout(() => {
      this.SpinLoading = true;
      this._OPReportsService.getGRNreportview(
        GRNID
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '850px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "GRN REPORT Viewer"
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

    }, 100);
  }


  

  
  viewgetItemwisePurchasePdf() {
    let StoreId=0
    setTimeout(() => {
      this.SpinLoading = true;
      this._OPReportsService.getItemwisepurchaseview(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900" ,
        StoreId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '850px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Item Wise Purchase Viewer"
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

    }, 100);
  }



  //OPMIS
  
  viewgetDaywiseopdcountReportPdf() {
    this.sIsLoading = 'loading-data';
     setTimeout(() => {
       this.AdList = true;
       this._OPReportsService.getdaywiseopdcountdetailReport(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Day Wise OPD Count Detail  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           this.AdList = false;
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }

  

   viewgetDaywiseopdcountsummaryReportPdf() {
    this.sIsLoading = 'loading-data';
  setTimeout(() => {

  this._OPReportsService.getdaywiseopdcountsummaryReport(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
  ).subscribe(res => {
    const dialogRef = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Day wise OPD Count Summary Viewer"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = '';
      });
     
  });
 
  },100);
}


viewgetDeptwiseopdcountPdf() {
  
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getDeptwiseopdcountView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Dept Wise OPD Count Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}


viewgetDoctorwiseopdcountdetailReportPdf() {
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
  //   this.SpinLoading =true;
  let VisitId
  this._OPReportsService.getDrwiseopdcountdetailView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Doctorwise Department Count Detail Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}


viewgetDeptwiseopdcountsummaryReportPdf() {
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getDeptwiseopdcountsummaryView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Department wise Count Summary  Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}


viewgetDocwiseopdcountsummaryReportPdf() {
  debugger
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
  //   this.SpinLoading =true;
  let DoctorID=this._OPReportsService.userForm.get("DoctorID").value || 0
  this._OPReportsService.getDocwisevisitCountsummaryView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",DoctorID
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Doctor Wise Vissit count Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}
viewgetDoctorwiseopdcolledetailReportPdf() {
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
  
  this._OPReportsService.getDocwisenopdcollsummarytView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Appointment list With Service Availed Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}
getDocwiseopdcollsummaryview() {
  this.sIsLoading = 'loading-data';
  setTimeout(() => {

  this._OPReportsService.getDocwisenopdcollsummarytView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Doctor Wise New Old Patient Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}

viewgetDeptwiseopdcolldetailReportPdf(){
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getDeptwiseopdcollsummaryView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Department Wise OPD Collection Summary  Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);
}

viewgetDeptwiseopdcollesummaryReportPdf(){
  
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getDeptwiseopdcollsummaryView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Department Wise OPD Collection Summary  Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);
}
getDeptservicegroupwisecolldetailview(){
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getDeptservicegroupcollsummaryView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Department wise Group wise Collection  Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);
}
getDeptservicegroupwisecollsummaryview(){
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getDeptservicegroupcollsummaryView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Department wise Group wise Collection Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
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