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
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { BrowseOPDBill } from 'app/main/opd/browse-opbill/browse-opbill.component';
import { element } from 'protractor';

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
  filteredOptionssearchDoctor: Observable<string[]>;
  isUserSelected: boolean = false;
  isSearchdoctorSelected: boolean = false;

  FlagUserSelected: boolean = false;
  FlagVisitSelected: boolean = false;
  FlagPaymentIdSelected: boolean = false;
  FlagRefundIdSelected: boolean = false;
  FlagDoctorIDSelected: boolean = false;
  DepartmentList:any=[];
  optionsDep:any=[]; 
  filteredOptionsDep: Observable<string[]>;
  FlagDepartmentSelected:boolean=false;
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
OPBILL=true;
OPcreditBILL=true;
  displayedColumns = [
    'ReportName'
  ];

  dataSource = new MatTableDataSource<ReportDetail>();
  constructor(
    
    public _OPReportsService: OPReportsService,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    public datePipe: DatePipe,
     private reportDownloadService: ExcelDownloadService,
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
    if (this._ActRoute.url == "/reports/opmisreports") 
    this.Reportsection='OP MIS Reports'
    if (this._ActRoute.url == "/reports/opbillingreport") 
      this.Reportsection='OP Billing'
    this.bindReportData();
    this.GetUserList();
    this.getDoctorList();
    this.getDepartmentList();
    this.filteredOptionsUser = this._OPReportsService.userForm.get('UserId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterUser(value)),

    );
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
    debugger
    this.ReportName = el.ReportName;
    this.ReportID = el.ReportId;
    if (this.ReportName == 'Registration Report') {
      this.FlagVisitSelected=false
      this.FlagPaymentIdSelected=false
      this.FlagDoctorIDSelected=false;
      this.FlagDepartmentSelected = false;
      } 
    if (this.ReportName == 'AppoitnmentList Report') {
      this.FlagVisitSelected=false
      this.FlagPaymentIdSelected=false
      this.FlagDoctorIDSelected=true;
      this.FlagDepartmentSelected = false;
      } 
   else if (this.ReportName == 'DoctorWise Visit Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagDepartmentSelected = false;
      // this.FlagPaymentSelected = false;

    } else if (this.ReportName == 'c') {
      this.FlagUserSelected = true;
      this.FlagDoctorIDSelected=false;
      // this.FlagPaymentSelected = false;
      this.FlagDepartmentSelected = false;
    } 
    else if (this.ReportName == 'Department Wise count summury') {
      // this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagDepartmentSelected = true;

    } else if (this.ReportName == 'DoctorWise Visit Count Summary') {
      // this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorIDSelected=true;
      this.FlagDepartmentSelected = false;
    } else if (this.ReportName == 'Reference doctor wise Report') {
      this.FlagDepartmentSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorIDSelected=false;
    }else if (this.ReportName == 'Department Wise Count Summary') {
      // this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagDepartmentSelected = true;
    }else if (this.ReportName == 'DoctorWise Visit Count Summary') {
      // this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorIDSelected=false;
    }else if (this.ReportName == 'Appointment List with Service Availed') {
      // this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagDepartmentSelected = false;
    } else if (this.ReportName == 'Cross Consultation Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorIDSelected=false;
      this.FlagDepartmentSelected = false;
      // this.FlagPaymentSelected = false;

    }
    else if (this.ReportName == 'Doctor Wise new and Old Patient Report') {
      // this.FlagPaymentSelected = true;
      this.FlagUserSelected = false;
      this.FlagDepartmentSelected = false;
      this.FlagDoctorIDSelected=false;
    } 

    //op Billing
    if (this.ReportName == 'OP Daily Collection') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = false;
      this.FlagDepartmentSelected = false;

    }else if (this.ReportName == 'OP Bill Report') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = false;
      this.FlagDepartmentSelected = false;

    }
    else if (this.ReportName == 'Bill Summary Report') {
      this.FlagUserSelected = false;
     this.OPBILL = false;
    this.FlagBillNoSelected = false;
    this.FlagDepartmentSelected = false;

    } 
    else if (this.ReportName == 'OP Bill Balance Report') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.OPcreditBILL=false;
      this.FlagDepartmentSelected = false;
    } 
     
    else if (this.ReportName == 'Refund of Bill Reports') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected=false
      this.FlagRefundIdSelected = false;
      this.FlagDepartmentSelected = false;

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
      this.FlagDepartmentSelected = false;
    }
     else if (this.ReportName == 'OP DAILY COLLECTION USERWISE') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagDepartmentSelected = false;

    }

    //OPMIS
    if (this.ReportName == 'Day wise OPD Count Details') {
      this.FlagVisitSelected=false
      this.FlagPaymentIdSelected=false
      this.FlagDepartmentSelected = false;
     
    } 
    if (this.ReportName == 'Day wise OPD Count Summary') {
      this.FlagVisitSelected=false
      this.FlagPaymentIdSelected=false
      this.FlagDepartmentSelected = false;
      
    } 
    else if (this.ReportName == 'Department wise OPD Count ') {
      this.FlagVisitSelected=false
      this.FlagPaymentIdSelected=false
      // this.viewgetOPPayemntPdf();
      this.FlagRefundIdSelected = false;
      this.FlagDepartmentSelected = false;
      
    } 
    
    else if (this.ReportName == 'Department wise OPD Count Summary') {
      this.FlagUserSelected = false;
      // this.FlagPaymentSelected = false;
      this.FlagDepartmentSelected = false;

    } else if (this.ReportName == 'Dr. Wise OPD Count Detail') {
      this.FlagUserSelected = false;
      this.FlagDoctorIdSelected = true;
      this.FlagDepartmentSelected = false;

    } 
    else if (this.ReportName == 'Dr. Wise OPD Count Summary') {
      this.FlagDoctorIdSelected = true;
      this.FlagDepartmentSelected = false;
      this.FlagUserSelected = false;

    } else if (this.ReportName == 'Dr. Wise OPD Collection  Details ') {
      // this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagDepartmentSelected = false;
    } else if (this.ReportName == 'Dr. Wise OPD Collection  Summary ') {
      // this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagDepartmentSelected = false;

    } else if (this.ReportName == 'Department Wise OPD Collection Details') {
      this.FlagUserSelected = false;
      this.FlagDepartmentSelected = false;
      // this.FlagPaymentSelected = false;

    }
    else if (this.ReportName == 'Department Wise OPD Collection Summary') {
      // this.FlagPaymentSelected = true;
      this.FlagUserSelected = false;
      this.FlagDepartmentSelected = false;

    }
    else if (this.ReportName == 'Dept Service Group Wise Collection Details') {
      // this.FlagPaymentSelected = true;
      this.FlagUserSelected = false;
      this.FlagDepartmentSelected = false;

    }else if (this.ReportName == 'Dept Service Group Wise Collection Summary') {
      // this.FlagPaymentSelected = true;
      this.FlagUserSelected = false;
      this.FlagDepartmentSelected = false;

    }

    
    //Inventory
    if (this.ReportName == 'Item List') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagDepartmentSelected = false;

    }else if (this.ReportName == 'Supplier List') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagDepartmentSelected = false;
    }
    else if (this.ReportName == 'Indent Report') {
      this.FlagUserSelected = false;
    //  this.FlagPaymentSelected = false;
    this.FlagBillNoSelected = false;
    this.FlagDepartmentSelected = false;
    } 
    else if (this.ReportName == 'Monthly Purchase(GRN) Report') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagDepartmentSelected = false;
    } 
     
    else if (this.ReportName == 'GRN Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected=false
      this.FlagRefundIdSelected = false;
      this.FlagDepartmentSelected = false;
    } 
    else if (this.ReportName == 'GRN Return Report') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = true;
      this.FlagBillNoSelected=false;
      this.FlagDepartmentSelected = false;
    }
    else if (this.ReportName == 'Monthly Purchase(GRN) Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
      this.FlagDepartmentSelected = false;
    }
     else if (this.ReportName == 'Monthly Purchase(GRN) Report') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagDepartmentSelected = false;
    }
    else if (this.ReportName == 'GRN Wise Product Qty Report') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = true;
      this.FlagBillNoSelected=false;
      this.FlagDepartmentSelected = false;
    }
    else if (this.ReportName == 'GRN Purchase Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
      this.FlagDepartmentSelected = false;
    }
     else if (this.ReportName == 'Supplier Wise GRN List') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagDepartmentSelected = false;
    }
    else if (this.ReportName == 'Issue To Department') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = true;
      this.FlagBillNoSelected=false;
      this.FlagDepartmentSelected = false;
    }
    else if (this.ReportName == 'Issue To Department Item Wise') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
      this.FlagDepartmentSelected = false;
    }
     else if (this.ReportName == 'Return From Department') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagDepartmentSelected = false;
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
      this.FlagDepartmentSelected = false;
    }
     else if (this.ReportName == 'Material Consumption') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagDepartmentSelected = false;
    }
    else if (this.ReportName == 'Item Expiry Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
      this.FlagDepartmentSelected = false;
    }
     else if (this.ReportName == 'Current Stock Report') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagDepartmentSelected = false;
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
      this.FlagDepartmentSelected = false;
    }
    else if (this.ReportName == 'Current Stock Date Wise') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
      this.FlagDepartmentSelected = false;
    }
     else if (this.ReportName == 'Non-Moving Item List') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagDepartmentSelected = false;
    }
    else if (this.ReportName == 'Non-Moving Item Without Batch List') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagDepartmentSelected = false;
    }
    else if (this.ReportName == 'Patient Wise Material Consumption') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagDepartmentSelected = false;
      this.FlagBillNoSelected=false;
    }
     else if (this.ReportName == 'Last Purchase Rate Wise Consumtion') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagDepartmentSelected = false;

    }
    else if (this.ReportName == 'Item Count') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
      this.FlagDepartmentSelected = false;
    }
     else if (this.ReportName == 'Supplier Wise Debit Credit Note') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagDepartmentSelected = false;

    }   else if (this.ReportName == 'Stock Adjustment Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
      this.FlagDepartmentSelected = false;
    }
     else if (this.ReportName == 'Purchase Wise GRN Summary') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagDepartmentSelected = false;

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
    else if (this.ReportName == 'OP Bill Report') {
      this.viewgetOPBillReportPdf();
      
    }
     else if (this.ReportName == 'OP Daily COLLECTION UserWise') {
      this.viewOpDailyCollectionUserwisePdf();
    } 
    else if (this.ReportName == 'Bill Summary Report') {
      this.viewgetOPBillSummaryReportPdf();
    }
     else if (this.ReportName == 'OP Bill Balance Report') {
      this.viewgetCreditReportPdf();
    } 
    else if (this.ReportName == 'Refund of Bill Reports') {
    
      this.viewgetOPRefundofBillPdf();
    }


    
    
    

    //OPMIS
    if (this.ReportName == 'Day wise OPD Count Details') {
      this.viewgetDaywiseopdcountReportPdf();
    }
    else   if (this.ReportName == 'Day wise OPD Count Summary') {
      this.viewgetDaywiseopdcountsummaryReportPdf();
     
    }   else if (this.ReportName == 'Department wise OPD Count ') {
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
    debugger
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
debugger
    let DoctorID = 0;
    if (this._OPReportsService.userForm.get('DoctorID').value)
      DoctorID = this._OPReportsService.userForm.get('DoctorID').value.DoctorId


    this.sIsLoading = 'loading-data';
     setTimeout(() => {
       this.AdList = true;
       this._OPReportsService.getAppointmentListReport(DoctorID,
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
  let DepartmentId = 0;
  if (this._OPReportsService.userForm.get('DepartmentId').value)
    DepartmentId = this._OPReportsService.userForm.get('DepartmentId').value.DepartmentId

  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getdepartmentwisecountsummView(
    this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",DepartmentId
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
  let DoctorID = 0;
  if (this._OPReportsService.userForm.get('DoctorID').value)
    DoctorID = this._OPReportsService.userForm.get('DoctorID').value.DoctorId


  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._OPReportsService.getDocwisevisitsummaryView(
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
  let AddUserId = 0;
  if (this._OPReportsService.userForm.get('UserId').value)
    AddUserId = this._OPReportsService.userForm.get('UserId').value.UserId

    this.sIsLoading = 'loading-data';
    setTimeout(() => {
      // this.SpinLoading =true;
     this.AdList=true;
    this._OPReportsService.getOpBilldetail(
      this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      AddUserId
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
        this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
        
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
     
      this._OPReportsService.getOPcreditbalancelist(
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
            title: "Op Refund Of Bill Report Viewer"
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
    this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Doctor Wise OPD count Summary Viewer"
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
  
  this._OPReportsService.getDocwisenopdcolldetailtView(
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
          title: "Doctor Wise OPD Collection  Viewer"
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

  this._OPReportsService.getDoctorwisenopdcollsummarytView(
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
          title: "Doctor Wise OPD Collection Summary Viewer"
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
 
  this._OPReportsService.getDeptwiseopdcolldetailView(
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
          title: "Department Wise OPD Collection Detail  Viewer"
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
 
  this._OPReportsService.getDeptservicegroupcolldetailView(
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
          title: "Department wise Service Group wise Collection  Viewer"
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

  getSelectedObj(obj){
    this.UserId=obj.UserId;
  }


  getOptionTextUser(option) {
    return option && option.UserName ? option.UserName : '';
  }

  private _filterUser(value: any): string[] {
    if (value) {
      const filterValue = value && value.UserName ? value.UserName.toLowerCase() : value.toLowerCase();
      return this.UserList.filter(option => option.UserName.toLowerCase().includes(filterValue));
    }
  }

  getDepartmentList() {
    this._OPReportsService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      //console.log(this.DepartmentList)
      this.optionsDep = this.DepartmentList.slice();
      this.filteredOptionsDep = this._OPReportsService.userForm.get('DepartmentId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );

    });
  }

  private _filterDep(value: any): string[] {
    if (value) {
      const filterValue = value && value.DepartmentName ? value.DepartmentName.toLowerCase() : value.toLowerCase();
      return this.optionsDep.filter(option => option.DepartmentName.toLowerCase().includes(filterValue));
    }

  }

  getOptionTextDep(option) {
    return option && option.DepartmentName ? option.DepartmentName : '';
  }
  // private _filterUser(value: any): string[] {
  //   if (value) {
  //     const filterValue = value && value.UserName ? value.UserName.toLowerCase() : value.toLowerCase();
  //     return this.optionsUser.filter(option => option.UserName.toLowerCase().includes(filterValue));
  //   }
  // }

  // GetUserList() {
  //   var data = {
  //     "StoreId": this._loggedUser.currentUserValue.user.storeId
  //   }
  //   this._OPReportsService.getUserdetailList(data).subscribe(data => {
  //     this.UserList = data;
  //     this.optionsUser = this.UserList.slice();
  //     // console.log(this.UserList);
  //     this.filteredOptionsUser = this._OPReportsService.userForm.get('UserId').valueChanges.pipe(
  //       startWith(''),
  //       map(value => value ? this._filterUser(value) : this.UserList.slice()),
  //     );

  //   });
  //   const toSelect = this.UserList.find(c => c.UserId == this.UserId);
  //   this._OPReportsService.userForm.get('UserId').setValue(toSelect);

  // }
  // getOptionTextUser(option) {
  //   return option && option.UserName ? option.UserName : '';
  // }

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



  dsExcelData = new MatTableDataSource<BrowseOPDBill>()
  dsOpcreditbillBrowseList = new MatTableDataSource<BrowseOPDBill>()
  ExcelData:any=[];
  getExcelDate(){
    let DoctorID = 0;
    if (this._OPReportsService.userForm.get('DoctorID').value)
      DoctorID = this._OPReportsService.userForm.get('DoctorID').value.DoctorId
 
    let AddUserId = 0;
    if (this._OPReportsService.userForm.get('UserId').value)
      AddUserId = this._OPReportsService.userForm.get('UserId').value.UserId

    let DepartmentId = 0;
    if (this._OPReportsService.userForm.get('DepartmentId').value)
      DepartmentId = this._OPReportsService.userForm.get('DepartmentId').value.DepartmentId
  

    
   //OP Reports
    if (this.ReportName == 'Registration Report') {
      var data = {
        "FromDate": this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        "ToDate": this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
      }
      this._OPReportsService.getRegisterationList(data).subscribe(Visit => {
        this.dsExcelData.data = Visit as BrowseOPDBill[];
        console.log(this.dsExcelData.data)
        if(this.dsExcelData.data.length > 0)
          this.getExcelExportDate()
      }
      ); 
    }
    if (this.ReportName == 'AppoitnmentList Report') {
      let data = {
        "From_Dt": this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        "To_Dt": this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        "Doctor_Id":DoctorID
      }
      this._OPReportsService.geAppointmentList(data).subscribe(Visit => {
        this.dsExcelData.data = Visit as BrowseOPDBill[];
        console.log(this.dsExcelData.data)
        if(this.dsExcelData.data.length > 0)
          this.getExcelExportDate()
      }
      ); 
    } 
     else if (this.ReportName == 'DoctorWise Visit Report') {
      let data = {
        "FromDate": this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        "ToDate": this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
      }
      this._OPReportsService.getDoctorWiseVisitList(data).subscribe(Visit => {
        this.dsExcelData.data = Visit as BrowseOPDBill[];
        console.log(this.dsExcelData.data)
        if(this.dsExcelData.data.length > 0)
          this.getExcelExportDate()
      }
      ); 
    } else if (this.ReportName == 'Reference doctor wise Report') {
      let data = {
        "FromDate": this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        "ToDate": this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
      }
      this._OPReportsService.getRefDocWiseList(data).subscribe(Visit => {
        this.dsExcelData.data = Visit as BrowseOPDBill[];
        console.log(this.dsExcelData.data)
        if(this.dsExcelData.data.length > 0)
          this.getExcelExportDate()
      }
      ); 
    } 
    else if (this.ReportName == 'Department Wise Count Summary') {
      let data = {
        "FromDate": this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        "ToDate": this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',DepartmentId
      }
      this._OPReportsService.getDepartmentWiseList(data).subscribe(Visit => {
        this.dsExcelData.data = Visit as BrowseOPDBill[];
        console.log(this.dsExcelData.data)
        if(this.dsExcelData.data.length>0){
          this.dsExcelData.data.forEach(element=>{
            this.ExcelData.push(
              {
                DepartmentName:element.DepartmentName,
                Count:element.Lbl
              }
            ) 
          })
          this.dsExcelData.data = this.ExcelData
          this.getExcelExportDate()
        } 
    }); 
    } else if (this.ReportName == 'DoctorWise Visit Count Summary') {
      let data = {
        "FromDate": this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        "ToDate": this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',DoctorID
      }
      this._OPReportsService.getDocWiseCountList(data).subscribe(Visit => {
        this.dsExcelData.data = Visit as BrowseOPDBill[];
        console.log(this.dsExcelData.data)
        if(this.dsExcelData.data.length>0){
          this.dsExcelData.data.forEach(element=>{
            this.ExcelData.push(
              {
                DocName:element.DocName,
                Count:element.Lbl
              }
            ) 
          })
          this.dsExcelData.data = this.ExcelData
          this.getExcelExportDate()
        }  
    });
    } 
    else if (this.ReportName == 'Cross Consultation Report') {
      let data = {
        "FromDate": this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        "ToDate": this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
      }
      this._OPReportsService.getCrossConsultList(data).subscribe(Visit => {
        this.dsExcelData.data = Visit as BrowseOPDBill[];
        console.log(this.dsExcelData.data)
        if(this.dsExcelData.data.length > 0)
          this.getExcelExportDate()
      }
      );
    }
    else if (this.ReportName == 'Doctor Wise new and Old Patient Report') {
      let data = {
        "FromDate": this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        "ToDate": this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
      }
      this._OPReportsService.getDocWiseNewOldPatientList(data).subscribe(Visit => {
        this.dsExcelData.data = Visit as BrowseOPDBill[];
        console.log(this.dsExcelData.data)
        if(this.dsExcelData.data.length > 0)
          this.getExcelExportDate()
      }
      );
    } 
       //op billing 
       if (this.ReportName == 'OP Daily Collection') {
        let data = {
          "FromDate": this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
          "ToDate": this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
          "AddedById":AddUserId
        }
        this._OPReportsService.getOPDailyCollectionReport(data).subscribe(Visit => {
          this.dsExcelData.data = Visit as BrowseOPDBill[];
          console.log(this.dsExcelData.data)
          if(this.dsExcelData.data.length > 0)
            this.getExcelExportDate()
        }
        ); 
      } 
      else if (this.ReportName == 'OP Daily Collection Summary Reports') {
        let data = {
          "FromDate": this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
          "ToDate": this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900' 
        }
        this._OPReportsService.getOPDailyCollectionSummaryReport(data).subscribe(Visit => {
          this.dsExcelData.data = Visit as BrowseOPDBill[];
          console.log(this.dsExcelData.data)
          if(this.dsExcelData.data.length > 0)
            this.getExcelExportDate()
        }
        );
        
      }
      else if (this.ReportName == 'OP Bill Report') {
        let data = {
          "FromDate": this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
          "ToDate": this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
          "AddedById":AddUserId
        }
        this._OPReportsService.getOPBIllReport(data).subscribe(Visit => {
          this.dsExcelData.data = Visit as BrowseOPDBill[];
          console.log(this.dsExcelData.data)
          if(this.dsExcelData.data.length > 0)
            this.getExcelExportDate()
        }
        ); 
      }
       else if (this.ReportName == 'OP Daily COLLECTION UserWise') { 
      } 
      else if (this.ReportName == 'Bill Summary Report') {
        let data = {
          "FromDate": this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
          "ToDate": this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900' 
        }
        this._OPReportsService.getOPBIllSummaryReport(data).subscribe(Visit => {
          this.dsExcelData.data = Visit as BrowseOPDBill[];
          console.log(this.dsExcelData.data)
          if(this.dsExcelData.data.length > 0)
            this.getExcelExportDate()
        }
        );  
      }
       else if (this.ReportName == 'OP Bill Balance Report') {
        let data = {
          "FromDate": this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
          "ToDate": this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900' 
        }
        this._OPReportsService.getOPBIllBalReport(data).subscribe(Visit => {
          this.dsExcelData.data = Visit as BrowseOPDBill[];
          console.log(this.dsExcelData.data)
          if(this.dsExcelData.data.length > 0)
            this.getExcelExportDate()
        }
        ); 
      } 
      else if (this.ReportName == 'Refund of Bill Reports') {
        let data = {
          "FromDate": this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
          "ToDate": this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900' 
        }
        this._OPReportsService.getOPRefBillReport(data).subscribe(Visit => {
          this.dsExcelData.data = Visit as BrowseOPDBill[];
          console.log(this.dsExcelData.data)
          if(this.dsExcelData.data.length > 0)
            this.getExcelExportDate()
        }
        );
      }

      

    else if (this.ReportName == 'Appointment List with Service Availed') {
      let data = {
        "FromDate": this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        "ToDate": this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
      }
      this._OPReportsService.getAppoinListWithServList(data).subscribe(Visit => {
        this.dsExcelData.data = Visit as BrowseOPDBill[];
        console.log(this.dsExcelData.data)
        if(this.dsExcelData.data.length > 0)
          this.getExcelExportDate()
      }
      );
    }
          
    }
    getExcelExportDate() {  
      //Op Reports
      if (this.ReportName == 'Registration Report') {
        this.sIsLoading == 'loading-data'
        let exportHeaders = ['RegId', 'PatientName','Address','City','PinNo','Age','GenderName','MobileNo'];
        this.reportDownloadService.getExportJsonData(this.dsExcelData.data, exportHeaders, 'Registration Report');
        this.dsExcelData.data = [];
        this.sIsLoading = '';
      }
      if (this.ReportName == 'AppoitnmentList Report') {
        this.sIsLoading == 'loading-data'
        let exportHeaders = ['RegNo', 'VisitDate','PatientName','AgeYear','OPDNo','Doctorname','RefDocName','CompanyName'];
        this.reportDownloadService.getExportJsonData(this.dsExcelData.data, exportHeaders, 'AppoitnmentList Report');
        this.dsExcelData.data = [];
        this.sIsLoading = ''; 
      } 
       else if (this.ReportName == 'DoctorWise Visit Report') {
        this.sIsLoading == 'loading-data'
        let exportHeaders = ['RegId', 'VisitDate','PatientName','MobileNo','Address','DoctorName','RefDoctorName'];
        this.reportDownloadService.getExportJsonData(this.dsExcelData.data, exportHeaders, 'DoctorWise Visit Report');
        this.dsExcelData.data = [];
        this.sIsLoading = '';
      } else if (this.ReportName == 'Reference doctor wise Report') {
        this.sIsLoading == 'loading-data'
        let exportHeaders = ['RegId', 'PatientName','DoctorName','RefDoctorName'];
        this.reportDownloadService.getExportJsonData(this.dsExcelData.data, exportHeaders, 'Reference doctor wise Report');
        this.dsExcelData.data = [];
        this.sIsLoading = '';
      } 
      else if (this.ReportName == 'Department Wise Count Summary') {
        this.sIsLoading == 'loading-data'
        let exportHeaders = ['DepartmentName', 'Count'];
        this.reportDownloadService.getExportJsonData(this.dsExcelData.data, exportHeaders, 'Department Wise Count Summary');
        this.dsExcelData.data = [];
        this.ExcelData = [];
        this.sIsLoading = '';
      } else if (this.ReportName == 'DoctorWise Visit Count Summary') {
        this.sIsLoading == 'loading-data'
        let exportHeaders = ['DocName', 'Count'];
        this.reportDownloadService.getExportJsonData(this.dsExcelData.data, exportHeaders, 'DoctorWise Visit Count Summary');
        this.dsExcelData.data = [];
        this.ExcelData = [];
        this.sIsLoading = '';
      } 
      else if (this.ReportName == 'Cross Consultation Report') {
        this.sIsLoading == 'loading-data'
        let exportHeaders = ['RegNo', 'VisitDate','PatientName','DoctorName','OPDNo','DepartmentName'];
        this.reportDownloadService.getExportJsonData(this.dsExcelData.data, exportHeaders, 'Cross Consultation Report');
        this.dsExcelData.data = [];
        this.sIsLoading = '';
      }
      else if (this.ReportName == 'Doctor Wise new and Old Patient Report') {
        this.sIsLoading == 'loading-data'
        let exportHeaders = ['RegNo', 'PatientName','DepartmentName','DoctorName','OPDNo'];
        this.reportDownloadService.getExportJsonData(this.dsExcelData.data, exportHeaders, 'Doctor Wise new and Old Patient Report');
        this.dsExcelData.data = [];
        this.sIsLoading = '';
      } 
   //op billing 
   if (this.ReportName == 'OP Daily Collection') {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['Number', 'VisitDate','RegNo','PatientName','ReceiptNo','NetPayableAmt','CashPayAmount','ChequePayAmount','CardPayAmount','PayTMAmount','UserName'];
    this.reportDownloadService.getExportJsonData(this.dsExcelData.data, exportHeaders, 'OP Daily Collection');
    this.dsExcelData.data = [];
    this.sIsLoading = '';
  } 
  else if (this.ReportName == 'OP Daily Collection Summary Reports') {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['RegNo', 'PatientName','PBillNo','BillDate','TotalAmt','ConcessionAmt','NetPayableAmt','CashPayAmount','CardPayAmount','NEFTPayAmount','PayTMAmount','ConcessionReason','CompanyName'];
    this.reportDownloadService.getExportJsonData(this.dsExcelData.data, exportHeaders, 'OP Daily Collection Summary Reports');
    this.dsExcelData.data = [];
    this.sIsLoading = '';
    
  }
  else if (this.ReportName == 'OP Bill Report') {
    this.sIsLoading == 'loading-data'
        let exportHeaders = ['BillNo', 'BillDate','RegId','PatientName','BillAmt','ConcessionAmt','NetPayableAmt','PaidAmount','BalanceAmt','CashPay','ChequePay','CardPay','NeftPay','PayTMPay'];
        this.reportDownloadService.getExportJsonData(this.dsExcelData.data, exportHeaders, 'OP Bill Report');
        this.dsExcelData.data = [];
        this.sIsLoading = ''; 
  }
   else if (this.ReportName == 'OP Daily COLLECTION UserWise') {
    this.viewOpDailyCollectionUserwisePdf();
  } 
  else if (this.ReportName == 'Bill Summary Report') {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['BillNo','BillDate','RegNo','ServiceName','Price','Qty','TotalAmt','ConcessionAmt','PaidAmount','BalanceAmt'];
    this.reportDownloadService.getExportJsonData(this.dsExcelData.data, exportHeaders, 'Bill Summary Report');
    this.dsExcelData.data = [];
    this.sIsLoading = '';
  }
   else if (this.ReportName == 'OP Bill Balance Report') {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['RegId', 'BillNo','BillDate','PatientName','NetPayableAmt','PaidAmount','BalanceAmt','TotalAmt'];
    this.reportDownloadService.getExportJsonData(this.dsExcelData.data, exportHeaders, 'OP Bill Balance Report');
    this.dsExcelData.data = [];
    this.sIsLoading = '';
  } 
  else if (this.ReportName == 'Refund of Bill Reports') {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['RefundNo', 'RefundDate','RegNo','PatientName','RefundAmount'];
    this.reportDownloadService.getExportJsonData(this.dsExcelData.data, exportHeaders, 'Refund of Bill Reports');
    this.dsExcelData.data = [];
    this.sIsLoading = '';
  }






      else if (this.ReportName == 'Appointment List with Service Availed') {
        this.sIsLoading == 'loading-data'
        let exportHeaders = ['PBillNo', 'BillDate','RegNo','PatientName','ConcessionAmt','NetPayableAmt','PaidAmount','BalanceAmt','PayTMPay','AdvUsdPay'];
        this.reportDownloadService.getExportJsonData(this.dsExcelData.data, exportHeaders, 'Appointment List with Service Availed');
        this.dsExcelData.data = [];
        this.sIsLoading = '';
      }


    }
  
  

  
    exportOPcreditBillReportExcel(){
         
  debugger
      var data = {
        "FromDate": this.datePipe.transform(this._OPReportsService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        "ToDate": this.datePipe.transform(this._OPReportsService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
      }
      this._OPReportsService.getBrowseOPcreditBillsummaryList(data).subscribe(Visit => {
        this.dsOpcreditbillBrowseList.data = Visit as BrowseOPDBill[];
        console.log(this.dsOpcreditbillBrowseList.data)
        if( this.dsOpcreditbillBrowseList.data.length > 0)
          this.OpcreditbillsummaryExcel()
      }
      );
    
      
}


OpcreditbillsummaryExcel() {
  console.log(this.dsOpcreditbillBrowseList.data)
  let exportHeaders = ['BillNo', 'BillDate', 'RegId', 'VisitId', 'VisitDate', 'DoctorName', 'TotalAmt', 'ConcessionAmt', 'PaidAmount', 'BalanceAmt'];
  this.reportDownloadService.getExportJsonData(this.dsOpcreditbillBrowseList.data, exportHeaders, 'OP Credit Bill List Datewise');
  this.dsOpcreditbillBrowseList.data = [];
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