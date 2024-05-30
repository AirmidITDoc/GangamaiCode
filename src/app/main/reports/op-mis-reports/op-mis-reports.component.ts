import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { OPReportsService } from '../op-reports/opreports.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-op-mis-reports',
  templateUrl: './op-mis-reports.component.html',
  styleUrls: ['./op-mis-reports.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OPMISReportsComponent implements OnInit {

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
  ReportSection:"OP MIS Reports"
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
    if (this.ReportName == 'Day wise OPD Count Details') {
      this.FlagVisitSelected=false
      this.FlagPaymentIdSelected=false
      this.viewgetDaywiseopdcountReportPdf();
    
    } 
    if (this.ReportName == 'Day wise OPD Count Summary') {
      this.FlagVisitSelected=false
      this.FlagPaymentIdSelected=false
      this.viewgetDaywiseopdcountsummaryReportPdf();
    
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
      // this.FlagPaymentSelected = false;

    } 
    else if (this.ReportName == 'Dr. Wise OPD Count Summary') {
      // this.FlagPaymentSelected = false;
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
  }


  getPrint() {
  

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
    else if (this.ReportName == 'Dr. Wise OPD Collection  Summary') {
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
  debugger
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
  this._OPReportsService.getRegisteredPatientCasepaaperView(
    VisitId
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Admission Paper  Viewer"
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
  //   this.SpinLoading =true;
  let VisitId
  this._OPReportsService.getdepartmentwisecountsummView(
    VisitId
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
viewgetDocwiseopdcountsummaryReportPdf() {
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
  //   this.SpinLoading =true;
  let VisitId
  this._OPReportsService.getDocwisevisitsummaryView(
    VisitId
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
  //   this.SpinLoading =true;
  let VisitId
  this._OPReportsService.getAppointmentlistwithserviceavailedView(
    VisitId
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
  //   this.SpinLoading =true;
  let VisitId
  this._OPReportsService.getDocwisenewoldpatientView(
    VisitId
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
  debugger
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