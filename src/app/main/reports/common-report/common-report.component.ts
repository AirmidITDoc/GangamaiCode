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
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-common-report',
  templateUrl: './common-report.component.html',
  styleUrls: ['./common-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CommonReportComponent implements OnInit {
  filteredOptionssearchDoctor: Observable<string[]>;



  UserList: any = [];
  DoctorList: any = [];
  sIsLoading: string = '';
  currentDate = new Date();
 
    ReportID: any;
 
  filteredOptionsUser: Observable<string[]>;
  filteredOptionsDoctorMode: Observable<string[]>;
  filteredOptionsDep: Observable<string[]>;
  isDepartmentSelected
  isUserSelected: boolean = false;
  isSearchdoctorSelected: boolean = false;

  FlagUserSelected: boolean = false;
  FlagVisitSelected: boolean = false;
  FlagPaymentIdSelected: boolean = false;
  FlagRefundIdSelected: boolean = false;
  FlagDoctorIDSelected: boolean = false;
  FlaggroupIdSelected: boolean = false;
  FlagServiceIdSelected: boolean = false;
  FlagDepartmentSelected: boolean = false;


  optionsUser: any[] = [];
  optionsPaymentMode: any[] = [];
  optionsDep: any[] = [];
  PaymentMode: any;
  DepartmentList:any=[];
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
    this.getDoctorList();
    this.GetUserList();
    this.getDepartmentList();
    this.getServiceListCombobox();
 
    this.filteredOptionsUser = this._OPReportsService.userForm.get('UserId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterUser(value)),

    );


  }

  bindReportData() {
    
var data={
  ReportSection:"COMMON REPORT"
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
    if (this.ReportName == 'Doctor Wise Patient Count Report') {
      this.FlagDoctorIDSelected=true;
      this.FlagVisitSelected=false;
      this.FlagPaymentIdSelected=false
     
    } 
    if (this.ReportName == 'Reference Doctor Wise Patient Count Report') {
      this.FlagVisitSelected=false;
      this.FlagPaymentIdSelected=false
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
     
    } 
    else if (this.ReportName == 'Concession Report') {
      this.FlagVisitSelected=false
      this.FlagPaymentIdSelected=false
      this.FlagDoctorIDSelected=true;
      this.FlagRefundIdSelected = false;
      this.FlagUserSelected = false;
    } 
    
    else if (this.ReportName == 'Daily Collection Report') {
      this.FlagUserSelected = true;
      this.FlagVisitSelected=false;
      // this.FlagPaymentSelected = false;
      this.FlagDoctorIDSelected=true;
      this.FlagRefundIdSelected = false;
      

    } else if (this.ReportName == 'Daily Collection Summary Report') {
      this.FlagUserSelected = true;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
    } 
    else if (this.ReportName == 'Group wise Collection Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;

    } else if (this.ReportName == 'Group wise Summary Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
      
    } else if (this.ReportName == 'Group Wise Revenue Summary Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
      
    } else if (this.ReportName == 'Credit Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
    }
    else if (this.ReportName == 'Patient Ledger') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
    }
    else if (this.ReportName == 'Service Wise Report without Bill') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
      
    }else if (this.ReportName == 'Service Wise Report with Bill') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
    }
    else if (this.ReportName == 'Service Wise Report') {
      this.FlagUserSelected = true;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
      this.FlagServiceIdSelected=false;
      this.FlagDepartmentSelected=true;
    }else if (this.ReportName == 'Bill Summary With TCS Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
    }
    else if (this.ReportName == 'Ref By Patient List') {
      this.FlagPaymentIdSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagServiceIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagUserSelected = false;
      
    }else if (this.ReportName == 'Cancel Charges List') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
    }
    else if (this.ReportName == 'Service Wise Report without Bill') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
    }else if (this.ReportName == 'Doctor and Department Wise Monthly Collection Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
    }
    else if (this.ReportName == 'IP Company Wise Bill Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
    }else if (this.ReportName == 'IP Company Wise Credit Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
      
    }
    else if (this.ReportName == 'IP Discharge & Bill Generation Pending Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
    }else if (this.ReportName == 'IP Bill Generation Payment Due report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
    }
    else if (this.ReportName == 'Collection Summary Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
    }else if (this.ReportName == 'Bill Summary Report for 2 Lakh Amount') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
    }else if (this.ReportName == 'Bill Summary Report OPD & IPD') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
    }else if(this.ReportName=='Doctor (Visit/Admitted) WISE GROUP REPORT'){
      this.FlagDoctorIDSelected=true;
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected=false;
    }
  }


  getPrint() {
  

    if (this.ReportName == 'Doctor Wise Patient Count Report') {
      this.viewgetDocwisepatientcountReportPdf();
    }
    else   if (this.ReportName == 'Reference Doctor Wise Patient Count Report') {
      this.viewgetRefDocwisepatientcountReportPdf();
     
    }   else if (this.ReportName == 'Concession Report') {
      this.viewgetConcessionReportPdf();
     
    } 

     else if (this.ReportName == 'Daily Collection Report') {
      this.viewgetDailyCollectionReportPdf();
    } 
    else if (this.ReportName == 'Daily Collection Summary Report') {
      this.viewgetDailycollsummaryReportPdf();
    } else if (this.ReportName == 'Group wise Collection Report') {
      this.viewgetGroupwisecollReportPdf();
    } else if (this.ReportName == 'Group wise Summary Report') {
      this.viewgetGroupwisesummaryReportPdf();
    }
    else if (this.ReportName == 'Group Wise Revenue Summary Report') {
      this.ViewgetGroupwiserevenusummaryview();
    }

    
    else if (this.ReportName == 'Credit Report') {
      this.viewgetCreditReportPdf();
    } else if (this.ReportName == 'Patient Ledger') {
      this.viewgetPatientLedgerReportPdf();
    }
    else if (this.ReportName == 'Service Wise Report without Bill') {
      this.ViewgeServicewisereportwithoutbillview();
    }
    else if (this.ReportName == 'Service Wise Report with Bill') {
      this.getServicewisereportwithbillview();
    }
    else if (this.ReportName == 'Service Wise Report') {
      this.viewgetServicewiseReportPdf();
    }
    else if (this.ReportName == 'Bill Summary With TCS Report') {
      this.ViewgetBillSummwithTCSview();
    }
    else if (this.ReportName == 'Ref By Patient List') {
      this.viewgetRefbypatientPdf();
    } else if (this.ReportName == 'Cancel Charges List') {
      this.viewgetCanclechargelistPdf();
    }
    else if (this.ReportName == 'Doctor and Department Wise Monthly Collection Report') {
      this.ViewgetDocdeptwisemonthlycollview();
    }
    else if (this.ReportName == 'IP Company Wise Bill Report') {
      this.getIpcompanywisebill();
    }
    else if (this.ReportName == 'IP Company Wise Credit Report') {
      this.viewgetCompanywisecreditPdf();
    } else if (this.ReportName == 'IP Discharge & Bill Generation Pending Report') {
      this.viewgetIpdischargebillgenependingPdf();
    }
    else if (this.ReportName == 'IP Bill Generation Payment Due report') {
      this.ViewgetIpbillgenepaymentdueview();
    }
    else if (this.ReportName == 'Collection Summary Report') {
      this.getCollectionsummaryview();
    }
    else if (this.ReportName == 'Bill Summary Report for 2 Lakh Amount') {
      this.Viewgetbillgenefor2lakhamtview();
    }
    else if (this.ReportName == 'Bill Summary Report OPD & IPD') {
      this.getBillsummaryforopdipdview();
    }else if (this.ReportName == 'Doctor (Visit/Admitted) WISE GROUP REPORT') {
      this.getDoctorvisitAdminwisegroupview();
    }


  }



  viewgetDocwisepatientcountReportPdf() {
   debugger
  
   let DoctorID = 0;
   if (this._OPReportsService.userForm.get('DoctorID').value)
    DoctorID = this._OPReportsService.userForm.get('DoctorID').value.DoctorID

   
     setTimeout(() => {
       this.AdList = true;
       this._OPReportsService.getdocwisepatinetcountReport(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
        DoctorID
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Doctor Wise Patient Count Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           this.AdList = false;
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }

  

   viewgetRefDocwisepatientcountReportPdf() {
 
  setTimeout(() => {

  this._OPReportsService.getRefdocwisepatientcountReport(
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
          title: "Ref Dosctor wise Patient Count Viewer"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = '';
      });
     
  });
 
  },100);
}


viewgetConcessionReportPdf() {
  let OP_IP_Type=1;
  
  let DoctorID = 0;
  if (this._OPReportsService.userForm.get('DoctorID').value)
   DoctorID = this._OPReportsService.userForm.get('DoctorID').value.DoctorID

  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getConcessionreportView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",OP_IP_Type,DoctorID
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Concession Report Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}


viewgetDailyCollectionReportPdf() {
  debugger
 
  let AddedById = 0;
  if (this._OPReportsService.userForm.get('UserId').value)
    AddedById = this._OPReportsService.userForm.get('UserId').value.UserId


  let DoctorId = 0;
  if (this._OPReportsService.userForm.get('DoctorId').value)
    DoctorId = this._OPReportsService.userForm.get('DoctorId').value.DoctorId

  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getCommonDailycollectionView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",AddedById,DoctorId
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Daily Collection Report Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}


viewgetDailycollsummaryReportPdf() {
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getDailycollsummaryView(
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
          title: "Daily Collection Summary Report  Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}

viewgetGroupwisecollReportPdf() {
  this.sIsLoading = 'loading-data';
  setTimeout(() => {

  let GroupId=this._OPReportsService.userForm.get('GroupId').value | 0
  this._OPReportsService.getgroupwisecollView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",GroupId
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Group wise Collection Report Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}
viewgetGroupwisesummaryReportPdf() {
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
    let GroupId=this._OPReportsService.userForm.get('GroupId').value | 0
  this._OPReportsService.getgroupwisescollummaryView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",GroupId
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Group Wise Collection Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}
ViewgetGroupwiserevenusummaryview() {
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
  //   this.SpinLoading =true;
  
  this._OPReportsService.getgroupwiserevenusummaryView(
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
          title: "Group Wise Revenu Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}
viewgetCreditReportPdf() {
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
  //   this.SpinLoading =true;
 
  this._OPReportsService.getCreditreportView(
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
          title: "Credit Report Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}

viewgetPatientLedgerReportPdf(){
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
  //   this.SpinLoading =true;
  let VisitId
  this._OPReportsService.getPatientledgerView(
    VisitId,1
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Patient Ledger Report Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);
}

ViewgeServicewisereportwithoutbillview(){
  let ServiceId=this._OPReportsService.userForm.get('ServiceId').value | 0;
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
  //   this.SpinLoading =true;
  let VisitId
  this._OPReportsService.getservicewisereportwithoutbillView(ServiceId,
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
          title: "Service Wise Report Without Bill Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100); 
}
getServicewisereportwithbillview(){
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
    let ServiceId=this._OPReportsService.userForm.get('ServiceId').value | 0
  this._OPReportsService.getServicewisereportwithbillView(ServiceId,
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
          title: "Service Wise Report Withh Bill Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);
}
viewgetServicewiseReportPdf(){
  this.sIsLoading = 'loading-data';
//  let GroupId=this._OPReportsService.userForm.get('GroupId').value || 0
//   let AddedById=this._OPReportsService.userForm.get('UserId').value.UserId || 0
//   let DoctorId=this._OPReportsService.userForm.get('DoctorID').value.DoctorID || 0
//   let ServiceId=this._OPReportsService.userForm.get('ServiceId').value
//   let DepartmentId=this._OPReportsService.userForm.get('DepartmentId').value.DepartmentId

  
  let ServiceId = 0;
  if (this._OPReportsService.userForm.get('ServiceId').value)
    ServiceId = this._OPReportsService.userForm.get('ServiceId').value.ServiceId


  
  setTimeout(() => {
 
  this._OPReportsService.getServicewisereportView(ServiceId,
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
          title: "Service Wise Report  Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);
}
ViewgetBillSummwithTCSview(){
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getBillsummarywithtcsView(
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
          title: "Bill Summary With TCS Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);
}


viewgetRefbypatientPdf(){
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getRefbypatientView(
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
          title: "Ref By Patient Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);
}
viewgetCanclechargelistPdf(){
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getCanclechargesView(
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
          title: "Cancle Change List Report  Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);
}
ViewgetDocdeptwisemonthlycollview(){
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getDoctorDeptwisemonthlycollectionView(
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
          title: "Doctor Dept Wise Monthly Collection  Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);
}
getIpcompanywisebill(){
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getIpcompanywisebillView(
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
          title: "IP Company Wise Bill  Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);
}
viewgetCompanywisecreditPdf(){
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getCompanywisecreditbillView(
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
          title: "Company Wise Credit Report  Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);
}

viewgetIpdischargebillgenependingPdf(){
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getIdischargebillgenependingView(
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
          title: "Ip Discharge Bill Generated Pending  Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);
}
ViewgetIpbillgenepaymentdueview(){
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getIpbillgenepaymentdueView(
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
          title: "Ip Bill Generated Pament Due  Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);
}
getCollectionsummaryview(){
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getCollectionsummaryView(
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
          title: "Collection Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);
}

Viewgetbillgenefor2lakhamtview(){
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getBillgenefor2lakhamtView(
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
          title: "Bill Generated For 2 Lakh Amt  Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);
}

getBillsummaryforopdipdview(){
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getBillsummaryopdipdView(
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
          title: "Bill Summary for OPD IPD Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);
}

getDoctorvisitAdminwisegroupview(){
  this.sIsLoading = 'loading-data';
  let DoctorId=this._OPReportsService.userForm.get('DoctorId').value.DoctorID || 0
  setTimeout(() => {
 
  this._OPReportsService.getdoctorvisitadmingroupwiseView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",DoctorId
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Doctor (Visist/Admitted )Group Wise Report Viewer"
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
  getOptionTextsearchDoctor(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }

getDoctorList() {
    this._OPReportsService.getDoctorMaster().subscribe(data => {
      this.searchDoctorList = data;
      this.optionsSearchDoc = this.searchDoctorList.slice();
      this.filteredOptionssearchDoctor = this._OPReportsService.userForm.get('DoctorID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSearchdoc(value) : this.searchDoctorList.slice()),
      );
    });
  }

  private _filterSearchdoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.optionsSearchDoc.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }

  }

  private _filterUser(value: any): string[] {
    if (value) {
      const filterValue = value && value.UserName ? value.UserName.toLowerCase() : value.toLowerCase();
      return this.UserList.filter(option => option.UserName.toLowerCase().includes(filterValue));
    }
  }

 

  GetUserList() {
    var data = {
          "StoreId": this._loggedUser.currentUserValue.user.storeId
        }
    this._OPReportsService.getUserdetailList(data).subscribe(data => {
      this.UserList = data;
      if (this.UserId) {
        const ddValue = this.UserList.filter(c => c.UserId == this.UserId);
        this._OPReportsService.userForm.get('UserId').setValue(ddValue[0]);
        this._OPReportsService.userForm.updateValueAndValidity();
        return;
      }
    });
  }
  filteredOptions: any;

  getServiceListCombobox() {
   
      var m_data = {
        SrvcName: "%",
        TariffId: 0,
        ClassId: 0,
      };
      console.log(m_data)
      
        this._OPReportsService.getBillingServiceList(m_data).subscribe(data => {
          this.filteredOptions = data;
        
        });
           
  }

  getDepartmentList() {
    this._OPReportsService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDep = this.DepartmentList.slice();
      this.filteredOptionsDep = this._OPReportsService.userForm.get('Departmentid').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );

    });
  }

  private _filterDep(value: any): string[] {
    if (value) {
      const filterValue = value && value.departmentName ? value.departmentName.toLowerCase() : value.toLowerCase();
      return this.optionsDep.filter(option => option.departmentName.toLowerCase().includes(filterValue));
    }

  }



  getOptionTextDep(option) {
    return option && option.departmentName ? option.departmentName : '';
  }

  getOptionText(option) {
    if (!option)
      return '';
    return option.ServiceName;

  }


  getSelectedObj(obj){
    this.UserId=obj.UserId;
  }


  getOptionTextUser(option) {
    return option && option.UserName ? option.UserName : '';
  }

}


export class ReportDetail {
  ReportName: any;
  ReportId: any;
  constructor(ReportDetail) {
    this.ReportName = ReportDetail.ReportName || '';
    this.ReportId = ReportDetail.ReportId || '';
  }
}