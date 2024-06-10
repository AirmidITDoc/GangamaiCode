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
    debugger
    if (this._ActRoute.url == "/reports/opreports") 
      this.Reportsection='OP Reports'
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
   debugger
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
    }else if (this.ReportName == 'Appoinment List with servise Availed') {
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
      this.FlagUserSelected = false;
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
    else if (this.ReportName == 'OP DAILY COLLECTION') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = true;
      this.FlagBillNoSelected=false;
    }
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
    } else if (this.ReportName == 'Appoinment List with servise Availed') {
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
      this.viewOpDailyCollectionPdf();
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
viewOpDailyCollectionPdf() {
  let AddUserId = 0;
  let DoctorId =0
  this.sIsLoading = 'loading-data';
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