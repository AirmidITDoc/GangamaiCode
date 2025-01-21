import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OPReportsService } from './opreports.service';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
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

  ReportFormGroup: FormGroup;
  autocompleteModeReport: string = "Report";
  ReportName = '';
  reportId = 0;

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


  SpinLoading: boolean = false;
  AdList: boolean = false;
  FromDate: any;
  Todate: any;
  UserId: any = 0;
  UserName: any;
  IsLoading: boolean = false;
  searchDoctorList: any = [];
  optionsSearchDoc: any[] = [];
  Reportsection = 'OP Reports';
  // Reportsection='Inventory Reports';
  FlagDoctorIdSelected: boolean = false;


  FlagDoctorSelected: boolean = false;
  FlagBillNoSelected: boolean = false;

  displayedColumns = [
    'ReportName'
  ];

  dataSource = new MatTableDataSource<ReportDetail>();

  // autocompleteMode: string = "Report";
  public autocompleteOptions: any[] = [
    { text: 'Registration Report', value: 'A' },
    { text: 'AppoitnmentList Report', value: '1' },
    { text: 'DoctorWise Visit Report', value: 'B' },
    { text: 'Department Wise count summury', value: 'C' },
    { text: 'DoctorWise Visit Count Summary', value: 'D' },
    { text: 'Reference doctor wise Report', value: 'E' },
    { text: 'Department Wise Count Summary', value: 'F' },
    { text: 'DoctorWise Visit Count Summary', value: 'G' },
    { text: 'Appointment List with Service Availed', value: 'H' },
    { text: 'Cross Consultation Report', value: 'I' },
    { text: 'Doctor Wise new and Old Patient Report', value: 'J' },
    { text: 'OP Daily Collection', value: 'K' },
    { text: 'OP Bill Report', value: 'L' },
    { text: 'Bill Summary Report', value: 'M' },
    { text: 'Refund of Bill Reports', value: 'N' },
    { text: 'OP Daily Collection Summary Reports', value: 'O' },
    { text: 'OP DAILY COLLECTION USERWISE', value: 'P' },
    // { text: 'Bank Q (Germany)', value: 'Q' },
    // { text: 'Bank R (Germany)', value: 'R' }
  ];

  constructor(

    public _OPReportsService: OPReportsService,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    public datePipe: DatePipe,
    private _loggedUser: AuthenticationService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.UserId = this._loggedUser.currentUserValue.userId;
    this.UserName = this._loggedUser.currentUserValue.userName;
    console.log(this.UserId)
  }


  ngOnInit(): void {
    this.ReportFormGroup = this._OPReportsService.CreateReport();
    if (this._ActRoute.url == "/reports/opreports")
      this.Reportsection = 'OP Reports'
    if (this._ActRoute.url == "/reports/opmisreports")
      this.Reportsection = 'OP MIS Reports'
    if (this._ActRoute.url == "/reports/opbillingreport")
      this.Reportsection = 'OP Billing'
    // this.bindReportData();
    this.GetUserList();


    this.filteredOptionsUser = this._OPReportsService.userForm.get('UserId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterUser(value)),

    );
  }
 

  bindReportData() {

    var data = {
      ReportSection: this.Reportsection
    }
    this._OPReportsService.getDataByQuery(data).subscribe(data => {
      this.dataSource.data = data as any[];

    });
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getValidationMessages() {
    return {
      ReportName: []
    }
  }
  selectChange(el) {
    this.ReportName = el.text;
    this.ReportID = el.value;
    this.ReportFormGroup.get("ReportName").setValue(this.ReportName)

    debugger
    if (this.ReportName == 'Registration Report') {
      this.FlagVisitSelected = false
      this.FlagPaymentIdSelected = false
    }
    if (this.ReportName == 'AppoitnmentList Report') {
      this.FlagVisitSelected = false
      this.FlagPaymentIdSelected = false
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
    } else if (this.ReportName == 'Department Wise Count Summary') {
      // this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
    } else if (this.ReportName == 'DoctorWise Visit Count Summary') {
      // this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
    } else if (this.ReportName == 'Appointment List with Service Availed') {
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

    } else if (this.ReportName == 'OP Bill Report') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Bill Summary Report') {
      this.FlagUserSelected = false;
      //  this.FlagPaymentSelected = false;
      this.FlagBillNoSelected = false;

    }
    else if (this.ReportName == 'Bill Summary Report') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
    }

    else if (this.ReportName == 'Refund of Bill Reports') {
      this.FlagUserSelected = false;
      this.FlagPaymentIdSelected = false
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
      this.FlagBillNoSelected = false;
    }
    else if (this.ReportName == 'OP DAILY COLLECTION USERWISE') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }

    //OPMIS
    if (this.ReportName == 'Day wise OPD Count Details') {
      this.FlagVisitSelected = false
      this.FlagPaymentIdSelected = false

    }
    if (this.ReportName == 'Day wise OPD Count Summary') {
      this.FlagVisitSelected = false
      this.FlagPaymentIdSelected = false

    }
    else if (this.ReportName == 'Department wise OPD Count ') {
      this.FlagVisitSelected = false
      this.FlagPaymentIdSelected = false
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

    } else if (this.ReportName == 'Dept Service Group Wise Collection Summary') {
      // this.FlagPaymentSelected = true;
      this.FlagUserSelected = false;

    }


    //Inventory
    if (this.ReportName == 'Item List') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    } else if (this.ReportName == 'Supplier List') {
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
      this.FlagPaymentIdSelected = false
      this.FlagRefundIdSelected = false;

    }
    else if (this.ReportName == 'GRN Return Report') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = true;
      this.FlagBillNoSelected = false;
    }
    else if (this.ReportName == 'Monthly Purchase(GRN) Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected = false;
    }
    else if (this.ReportName == 'Monthly Purchase(GRN) Report') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'GRN Wise Product Qty Report') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = true;
      this.FlagBillNoSelected = false;
    }
    else if (this.ReportName == 'GRN Purchase Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected = false;
    }
    else if (this.ReportName == 'Supplier Wise GRN List') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Issue To Department') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = true;
      this.FlagBillNoSelected = false;
    }
    else if (this.ReportName == 'Issue To Department Item Wise') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected = false;
    }
    else if (this.ReportName == 'Return From Department') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Purchase Order') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = true;
      this.FlagBillNoSelected = false;
    }
    else if (this.ReportName == 'Material Consumption Monthly Summary') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected = false;
    }
    else if (this.ReportName == 'Material Consumption') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Item Expiry Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected = false;
    }
    else if (this.ReportName == 'Current Stock Report') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Closing Current Stock Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected = false;
    }
    else if (this.ReportName == 'Item Wise Supplier List') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Current Stock Date Wise') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected = false;
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
      this.FlagBillNoSelected = false;
    }
    else if (this.ReportName == 'Last Purchase Rate Wise Consumtion') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Item Count') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected = false;
    }
    else if (this.ReportName == 'Supplier Wise Debit Credit Note') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    } else if (this.ReportName == 'Stock Adjustment Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected = false;
    }
    else if (this.ReportName == 'Purchase Wise GRN Summary') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }

  }


  getPrint() {

    if (this.ReportName == 'Registration Report') {
      this.viewgetlistReportPdf("RegistrationReport");
    }
    if (this.ReportName == 'AppoitnmentList Report') {
      this.viewgetlistReportPdf("AppointmentListReport");
    }
    else if (this.ReportName == 'DoctorWise Visit Report') {
          this.viewgetlistReportPdf("DoctorWiseVisitReport");
    } else if (this.ReportName == 'Reference doctor wise Report') {
    this.viewgetlistReportPdf("RefDoctorWiseReport");
    }
    else if (this.ReportName == 'Department Wise count summury') {
    this.viewgetlistReportPdf("DepartmentWisecountSummury");
    } else if (this.ReportName == 'DoctorWise Visit Count Summary') {
    this.viewgetlistReportPdf("DoctorWiseVisitReport");
    } else if (this.ReportName == 'Appointment List with Service Availed') {
    this.viewgetlistReportPdf("OPAppoinmentListWithServiseAvailed");
    }
    else if (this.ReportName == 'Cross Consultation Report') {
    this.viewgetlistReportPdf("CrossConsultationReport");
    }
    else if (this.ReportName == 'Doctor Wise new and Old Patient Report') {
    this.viewgetlistReportPdf("OPDoctorWiseNewOldPatientReport");
    }


    //op billing 
    if (this.ReportName == 'OP Daily Collection') {
     this.viewgetlistReportPdf("OPDailyCollectionReport");
    }
    else if (this.ReportName == 'OP Daily Collection Summary Reports') {
     this.viewgetlistReportPdf("OPCollectionSummary");
    }
    else if (this.ReportName == 'OP Bill Report') {
     this.viewgetlistReportPdf("BillReportSummary");
    }
    else if (this.ReportName == 'OP Daily COLLECTION UserWise') {
    this.viewgetlistReportPdf("OPDailyCollectionReport");
    }
    else if (this.ReportName == 'Bill Summary Report') {
      this.viewgetlistReportPdf("BillReportSummarySummary");
    }
    else if (this.ReportName == 'OP Bill Balance Report') {
      this.viewgetlistReportPdf("OPDBillBalanceReport");
    }
    else if (this.ReportName == 'Refund of Bill Reports') {
      this.viewgetlistReportPdf("OPDRefundOfBill");
    }






    //OPMIS
  //   if (this.ReportName == 'Day wise OPD Count Details') {
  //     this.viewgetDaywiseopdcountReportPdf();
  //   }
  //   else if (this.ReportName == 'Day wise OPD Count Summary') {
  //     this.viewgetDaywiseopdcountsummaryReportPdf();

  //   } else if (this.ReportName == 'Department wise OPD Count ') {
  //     this.viewgetDeptwiseopdcountPdf();

  //   }
  //   else if (this.ReportName == 'Department wise OPD Count Summary') {
  //     this.viewgetDeptwiseopdcountsummaryReportPdf();
  //   }
  //   else if (this.ReportName == 'Dr. Wise OPD Count Detail') {
  //     this.viewgetDoctorwiseopdcountdetailReportPdf();
  //   } else if (this.ReportName == 'Dr. Wise OPD Count Summary') {
  //     this.viewgetDocwiseopdcountsummaryReportPdf();
  //   } else if (this.ReportName == 'Dr. Wise OPD Collection  Details ') {
  //     this.viewgetDoctorwiseopdcolledetailReportPdf();
  //   }
  //   else if (this.ReportName == 'Dr. Wise OPD Collection  Summary ') {
  //     this.getDocwiseopdcollsummaryview();
  //   }
  //   else if (this.ReportName == 'Department Wise OPD Collection Details') {
  //     this.viewgetDeptwiseopdcolldetailReportPdf();
  //   } else if (this.ReportName == 'Department Wise OPD Collection Summary') {
  //     this.viewgetDeptwiseopdcollesummaryReportPdf();
  //   }
  //   else if (this.ReportName == 'Dept Service Group Wise Collection Details') {
  //     this.getDeptservicegroupwisecolldetailview();
  //   }
  //   else if (this.ReportName == 'Dept Service Group Wise Collection Summary') {
  //     this.getDeptservicegroupwisecollsummaryview();
  //   }
  }



  viewgetlistReportPdf(mode) {
    debugger
    setTimeout(() => {

      let param = {
        "searchFields": [
          {
            "fieldName": "FromDate",
            "fieldValue": this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value,"dd-MM-yyyy"),//"10-01-2024",
            "opType": "13"
          },
          {
            "fieldName": "ToDate",
            "fieldValue": this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value,"MM-dd-yyyy"),//"12-12-2024",
            "opType": "13"
          }
        ],
        "mode": mode
      }

      console.log(param)
      this._OPReportsService.getPatientListView(param).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: mode + " " + "Viewer"

            }

          });

        matDialog.afterClosed().subscribe(result => {

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
  GetUserList() {
    var data = {
      "StoreId": this._loggedUser.currentUserValue.storeId
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

  getSelectedObj(obj) {
    this.UserId = obj.UserId;
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



  // private _filterUser(value: any): string[] {
  //   if (value) {
  //     const filterValue = value && value.UserName ? value.UserName.toLowerCase() : value.toLowerCase();
  //     return this.optionsUser.filter(option => option.UserName.toLowerCase().includes(filterValue));
  //   }
  // }

  // GetUserList() {
  //   var data = {
  //     "StoreId": this._loggedUser.currentUserValue.storeId
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