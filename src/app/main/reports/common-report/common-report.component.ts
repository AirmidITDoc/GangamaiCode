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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-common-report',
  templateUrl: './common-report.component.html',
  styleUrls: ['./common-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CommonReportComponent implements OnInit {




  UserList: any = [];
  DoctorList: any = [];
  sIsLoading: string = '';
  currentDate = new Date();
  Servicelist: any = [];
  GroupList: any = [];
  ReportID: any;
  filteredOptions: Observable<string[]>;
  filteredOptionssearchDoctor: Observable<string[]>;
  filteredOptionsUser: Observable<string[]>;
  filteredOptionsDoctorMode: Observable<string[]>;
  filteredOptionsDep: Observable<string[]>;
  filteredOptionsCashCounter: Observable<string[]>;
  filteredOptionsGroup: Observable<string[]>;
  isDepartmentSelected
  isUserSelected: boolean = false;
  isSearchdoctorSelected: boolean = false;
  isCashCounterSelected: boolean = false;

  FlagUserSelected: boolean = false;
  FlagVisitSelected: boolean = false;
  FlagPaymentIdSelected: boolean = false;
  FlagRefundIdSelected: boolean = false;
  FlagDoctorIDSelected: boolean = false;
  FlaggroupIdSelected: boolean = false;
  FlagServiceIdSelected: boolean = false;
  FlagDepartmentSelected: boolean = false;
  FlaOPIPTypeSelected: boolean = false;
  FlaCashcounterSelected: boolean = false;
  FlagGroupSelected: boolean = false;
  optionsUser: any[] = [];
  optionsPaymentMode: any[] = [];
  optionsSearchgroup: any[] = [];
  optionsDep: any[] = [];
  optionsService: any[] = [];
  PaymentMode: any;
  DepartmentList: any = [];
  ServiceList: any = [];
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
  CashCounterList: any = [];

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
    this.getCashCounterComboList();
    this.getgroupList();
    this.filteredOptionsUser = this._OPReportsService.userForm.get('UserId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterUser(value)),

    );


  }

  bindReportData() {

    var data = {
      ReportSection: "COMMON REPORT"
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
      this.FlagDoctorIDSelected = true;
      this.FlagVisitSelected = false;
      this.FlagPaymentIdSelected = false
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    }
    if (this.ReportName == 'Reference Doctor Wise Patient Count Report') {
      this.FlagVisitSelected = false;
      this.FlagPaymentIdSelected = false
      this.FlagDoctorIDSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    }
    else if (this.ReportName == 'Concession Report') {
      this.FlagVisitSelected = false
      this.FlagPaymentIdSelected = false
      this.FlagDoctorIDSelected = true;
      this.FlagRefundIdSelected = false;
      this.FlagUserSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    }

    else if (this.ReportName == 'Daily Collection Report') {
      this.FlagUserSelected = true;
      this.FlagVisitSelected = false;
      // this.FlagPaymentSelected = false;
      this.FlagDoctorIDSelected = true;
      this.FlagRefundIdSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    } else if (this.ReportName == 'Daily Collection Summary Report') {
      this.FlagUserSelected = true;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    }
    else if (this.ReportName == 'Group wise Collection Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlagGroupSelected = true;
    } else if (this.ReportName == 'Group wise Summary Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = true;
    } else if (this.ReportName == 'Group Wise Revenue Summary Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    } else if (this.ReportName == 'Credit Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    }
    else if (this.ReportName == 'Patient Ledger') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = true;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    }
    else if (this.ReportName == 'Service Wise Report without Bill') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = true;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagServiceIdSelected = true;
    } else if (this.ReportName == 'Service Wise Report with Bill') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = true;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagServiceIdSelected = true;
      this.FlagGroupSelected = false;
    }
    else if (this.ReportName == 'Service Wise Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = true;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlagServiceIdSelected = true;
      this.FlagDepartmentSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;

    } else if (this.ReportName == 'Bill Summary With TCS Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    }
    else if (this.ReportName == 'Ref By Patient List') {
      this.FlagPaymentIdSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagServiceIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagUserSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    } else if (this.ReportName == 'Cancel Charges List') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    }
    else if (this.ReportName == 'Doctor and Department Wise Monthly Collection Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    }
    else if (this.ReportName == 'IP Company Wise Bill Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    } else if (this.ReportName == 'IP Company Wise Credit Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    }
    else if (this.ReportName == 'IP Discharge & Bill Generation Pending Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    } else if (this.ReportName == 'IP Bill Generation Payment Due report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    }
    else if (this.ReportName == 'Collection Summary Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    } else if (this.ReportName == 'Bill Summary Report for 2 Lakh Amount') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    } else if (this.ReportName == 'Bill Summary Report OPD & IPD') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagDoctorIDSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    } else if (this.ReportName == 'Doctor (Visit/Admitted) WISE GROUP REPORT') {
      this.FlagDoctorIDSelected = true;
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = false;
      this.FlaCashcounterSelected = false;
      this.FlagGroupSelected = false;
    } else if (this.ReportName === 'Cash Counter Wise Daily Collection') {
      this.FlagDoctorIDSelected = false;
      this.FlagUserSelected = true;
      this.FlagPaymentIdSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = true;
      this.FlaCashcounterSelected = true;
      this.FlagGroupSelected = false;
    } else if (this.ReportName === 'Cash Counter Wise Daily Collection Summary') {
      this.FlagDoctorIDSelected = false;
      this.FlagUserSelected = true;
      this.FlagPaymentIdSelected = false;
      this.FlagRefundIdSelected = false;
      this.FlagVisitSelected = false;
      this.FlaOPIPTypeSelected = true;
      this.FlaCashcounterSelected = true;
      this.FlagGroupSelected = false;
    }
  }


  getPrint() {


    if (this.ReportName == 'Doctor Wise Patient Count Report') {
      this.viewgetDocwisepatientcountReportPdf();
    }
    else if (this.ReportName == 'Reference Doctor Wise Patient Count Report') {
      this.viewgetRefDocwisepatientcountReportPdf();

    } else if (this.ReportName == 'Concession Report') {
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
      debugger
      let OPIPType
      if (this._OPReportsService.userForm.get('OPIPType').value)
        OPIPType = parseInt(this._OPReportsService.userForm.get('OPIPType').value) || 0
      if (!OPIPType)
        this.viewgetOpPatientLedgerReportPdf();
      else
        this.viewgetIpPatientLedgerReportPdf();
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
    } else if (this.ReportName == 'Doctor (Visit/Admitted) WISE GROUP REPORT') {
      this.getDoctorvisitAdminwisegroupview();
    } else if (this.ReportName == 'Cash Counter Wise Daily Collection') {
      this.getCashcounterwisedailycollectionview();
    } else if (this.ReportName == 'Cash Counter Wise Daily Collection Summary') {
      this.getCashcounterwisedailycollectionsummaryview();
    }


  }



  viewgetDocwisepatientcountReportPdf() {
    debugger

    let DoctorID = 0;
    if (this._OPReportsService.userForm.get('DoctorID').value)
      DoctorID = this._OPReportsService.userForm.get('DoctorID').value.DoctorId


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

    }, 100);
  }


  viewgetConcessionReportPdf() {
    let OP_IP_Type = 1;

    let DoctorID = 0;
    if (this._OPReportsService.userForm.get('DoctorID').value)
      DoctorID = this._OPReportsService.userForm.get('DoctorID').value.DoctorId

    this.sIsLoading = 'loading-data';
    setTimeout(() => {

      this._OPReportsService.getConcessionreportView(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", OP_IP_Type, DoctorID
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

    }, 100);

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
        this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", AddedById, DoctorId
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

    }, 100);

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

    }, 100);

  }

  viewgetGroupwisecollReportPdf() {
    this.sIsLoading = 'loading-data';
    let GroupId = 0;
    if (this._OPReportsService.userForm.get('GroupId').value)
      GroupId = this._OPReportsService.userForm.get('GroupId').value.GroupId



    setTimeout(() => {

      this._OPReportsService.getgroupwisecollView(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", GroupId
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

    }, 100);

  }
  viewgetGroupwisesummaryReportPdf() {
    this.sIsLoading = 'loading-data';
    let GroupId = 0;
    if (this._OPReportsService.userForm.get('GroupId').value)
      GroupId = this._OPReportsService.userForm.get('GroupId').value.GroupId
    debugger
    setTimeout(() => {

      this._OPReportsService.getgroupwisescollummaryView(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", GroupId
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

    }, 100);

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

    }, 100);

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

    }, 100);

  }

  viewgetOpPatientLedgerReportPdf() {
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
     
      this._OPReportsService.getOpPatientledgerView(
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
              title: "OP Patient Ledger Report Viewer"
            }
          });

        matDialog.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.sIsLoading = ' ';
        });
      });

    }, 100);
  }

  viewgetIpPatientLedgerReportPdf() {
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
     
      this._OPReportsService.getIpPatientledgerView(
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
              title: "IP Patient Ledger Report Viewer"
            }
          });

        matDialog.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.sIsLoading = ' ';
        });
      });

    }, 100);
  }

  ViewgeServicewisereportwithoutbillview() {

    let ServiceId = 0;
    if (this._OPReportsService.userForm.get('ServiceId').value)
      ServiceId = this._OPReportsService.userForm.get('ServiceId').value.ServiceId


    let DoctorID = 0;
    if (this._OPReportsService.userForm.get('DoctorID').value)
      DoctorID = this._OPReportsService.userForm.get('DoctorID').value.DoctorId
    if (ServiceId !== 0) {
      this.sIsLoading = 'loading-data';
      setTimeout(() => {
        //   this.SpinLoading =true;
        let VisitId
        this._OPReportsService.getservicewisereportwithoutbillView(ServiceId,
          this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
          this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", DoctorID
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

      }, 100);
    } else {
      Swal.fire("Ple select Service Name")
    }
  }
  getServicewisereportwithbillview() {

    debugger
    this.sIsLoading = 'loading-data';
    let ServiceId = 0;
    if (this._OPReportsService.userForm.get('ServiceId').value)
      ServiceId = this._OPReportsService.userForm.get('ServiceId').value.ServiceId


    let DoctorID = 0;
    if (this._OPReportsService.userForm.get('DoctorID').value)
      DoctorID = this._OPReportsService.userForm.get('DoctorID').value.DoctorId

    if (ServiceId != 0) {
      setTimeout(() => {

        this._OPReportsService.getServicewisereportwithbillView(ServiceId,
          this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
          this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", DoctorID
        ).subscribe(res => {
          const matDialog = this._matDialog.open(PdfviewerComponent,
            {
              maxWidth: "85vw",
              height: '750px',
              width: '100%',
              data: {
                base64: res["base64"] as string,
                title: "Service Wise Report With Bill Viewer"
              }
            });

          matDialog.afterClosed().subscribe(result => {
            // this.AdList=false;
            this.sIsLoading = ' ';
          });
        });

      }, 100);
    }
    else {
      Swal.fire("Ple select Service Name")
    }
  }
  viewgetServicewiseReportPdf() {
    debugger
    this.sIsLoading = 'loading-data';
    let ServiceId = 0;
    if (this._OPReportsService.userForm.get('ServiceId').value)
      ServiceId = this._OPReportsService.userForm.get('ServiceId').value.ServiceId

    let DoctorId = 0;
    if (this._OPReportsService.userForm.get('DoctorID').value)
      DoctorId = this._OPReportsService.userForm.get('DoctorID').value.DoctorId

    setTimeout(() => {

      this._OPReportsService.getServicewisereportView(ServiceId,
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", DoctorId
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

    }, 100);
  }
  ViewgetBillSummwithTCSview() {
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

    }, 100);
  }


  viewgetRefbypatientPdf() {
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

    }, 100);
  }
  viewgetCanclechargelistPdf() {
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

    }, 100);
  }
  ViewgetDocdeptwisemonthlycollview() {
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

    }, 100);
  }
  getIpcompanywisebill() {
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

    }, 100);
  }
  viewgetCompanywisecreditPdf() {
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

    }, 100);
  }

  viewgetIpdischargebillgenependingPdf() {
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

    }, 100);
  }
  ViewgetIpbillgenepaymentdueview() {
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

    }, 100);
  }
  getCollectionsummaryview() {
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

    }, 100);
  }

  Viewgetbillgenefor2lakhamtview() {
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

    }, 100);
  }

  getBillsummaryforopdipdview() {
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

    }, 100);
  }

  getDoctorvisitAdminwisegroupview() {
    this.sIsLoading = 'loading-data';
    let DoctorId = 0;
    DoctorId = this._OPReportsService.userForm.get('DoctorId').value.DoctorId || 0
    setTimeout(() => {

      this._OPReportsService.getdoctorvisitadmingroupwiseView(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", DoctorId
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

    }, 100);
  }

  getCashcounterwisedailycollectionsummaryview() {
    this.sIsLoading = 'loading-data';
    let OPIPType = 0;
    let CashcounterId = 0;
    let AddedById = 0;


    if (this._OPReportsService.userForm.get('UserId').value)
      AddedById = this._OPReportsService.userForm.get('UserId').value.UserId || 0

    if (this._OPReportsService.userForm.get('CashCounterID').value)
      CashcounterId = this._OPReportsService.userForm.get('CashCounterID').value.CashCounterId || 0


    if (this._OPReportsService.userForm.get('OPIPType').value)
      OPIPType = this._OPReportsService.userForm.get('OPIPType').value || 0
    setTimeout(() => {
      debugger
      this._OPReportsService.getcashcounterwisedailycollectionsummaryView(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", OPIPType, CashcounterId, AddedById
      ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Cash Counter  Wise Daily Collection SummaryReport Viewer"
            }
          });

        matDialog.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.sIsLoading = ' ';
        });
      });

    }, 100);
  }

  getCashcounterwisedailycollectionview() {
    this.sIsLoading = 'loading-data';
    let OPIPType = 0;
    let CashcounterId = 0;
    let AddedById = 0;

    if (this._OPReportsService.userForm.get('UserId').value)
      AddedById = this._OPReportsService.userForm.get('UserId').value.UserId || 0

    if (this._OPReportsService.userForm.get('CashCounterID').value)
      CashcounterId = this._OPReportsService.userForm.get('CashCounterID').value.CashCounterId || 0


    if (this._OPReportsService.userForm.get('OPIPType').value)
      OPIPType = parseInt(this._OPReportsService.userForm.get('OPIPType').value) || 0

    debugger
    setTimeout(() => {

      this._OPReportsService.getcashcounterwisedailycollectionView(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", OPIPType, CashcounterId, AddedById
      ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Cash Counter  Wise Daily Collection Report Viewer"
            }
          });

        matDialog.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.sIsLoading = ' ';
        });
      });

    }, 100);
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
      "StoreId": 0// this._loggedUser.currentUserValue.user.storeId
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



  getOptionTextgroup(option) {
    return option && option.GroupName ? option.GroupName : '';
  }

  getgroupList() {
    this._OPReportsService.getgroupList().subscribe(data => {
      this.GroupList = data;
      this.optionsSearchgroup = this.GroupList.slice();
      this.filteredOptionsGroup = this._OPReportsService.userForm.get('GroupId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filtersearchgroup(value) : this.GroupList.slice()),
      );
    });
  }

  private _filtersearchgroup(value: any): string[] {
    if (value) {
      const filterValue = value && value.GroupName ? value.GroupName.toLowerCase() : value.toLowerCase();
      return this.GroupList.filter(option => option.GroupName.toLowerCase().includes(filterValue));
    }
  }

  getServiceListCombobox() {

    // var m_data = {
    //   SrvcName: "%",
    //   TariffId: 0,
    //   ClassId: 0,
    // };
    // console.log(m_data)

    this._OPReportsService.getBillingServiceList().subscribe(data => {
      this.Servicelist = data;
      this.optionsService = this.Servicelist.slice();
      this.filteredOptions = this._OPReportsService.userForm.get('ServiceId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterService(value) : this.Servicelist.slice()),
      );
    });

  }
  private _filterService(value: any): string[] {
    if (value) {
      const filterValue = value && value.ServiceName ? value.ServiceName.toLowerCase() : value.toLowerCase();
      return this.Servicelist.filter(option => option.ServiceName.toLowerCase().includes(filterValue));
    }
  }


  getDepartmentList() {
    this._OPReportsService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDep = this.DepartmentList.slice();
      this.filteredOptionsDep = this._OPReportsService.userForm.get('DepartmentId').valueChanges.pipe(
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

  getCashCounterComboList() {
    this._OPReportsService.getCashcounterList().subscribe(data => {
      this.CashCounterList = data
      console.log(this.CashCounterList)
      this._OPReportsService.userForm.get('CashCounterID').setValue(this.CashCounterList[0])
      this.filteredOptionsCashCounter = this._OPReportsService.userForm.get('CashCounterID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCashCounter(value) : this.CashCounterList.slice()),
      );
    });
  }
  private _filterCashCounter(value: any): string[] {
    if (value) {
      const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
      return this.CashCounterList.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
    }
  }

  getOptionTextDep(option) {
    return option && option.departmentName ? option.departmentName : '';
  }

  getOptionText(option) {

    return option && option.ServiceName ? option.ServiceName : '';
  }


  getSelectedObj(obj) {
    this.UserId = obj.UserId;
  }

  getOptionTextCashCounter(option) {
    if (!option)
      return '';
    return option.CashCounterName;
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