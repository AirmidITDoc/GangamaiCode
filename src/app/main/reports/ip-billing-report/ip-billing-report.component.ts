import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { IPBillingService } from './ipbilling.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-ip-billing-report',
  templateUrl: './ip-billing-report.component.html',
  styleUrls: ['./ip-billing-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IpBillingReportComponent implements OnInit {

  
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
  FlagDoctorSelected: boolean = false;

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
    public _IPBillingService: IPBillingService,
    
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
    this.GetUserList();
    this.getDoctorList();
    const toSelect = this.UserList.find(c => c.UserId == this.UserId);
    this._IPBillingService.userForm.get('UserId').setValue(toSelect);

  }

  bindReportData() {
    // let qry = "SELECT * FROM ReportConfigMaster WHERE IsActive=1 AND IsDeleted=0 AND ReportType=1";
var data={
  ReportSection:"IPBilling Reports"
}
    this._IPBillingService.getDataByQuery(data).subscribe(data => {
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

   if (this.ReportName == 'IP DAILY COLLECTION') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = false;

    } else if (this.ReportName == 'OP IP COMMAN COLLECTION') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = true;

    } else if (this.ReportName == 'OP IP BILL SUMMARY') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = false;

    } 
    // else if (this.ReportName == 'Sales Return Summary Report') {
    //   this.FlagDoctorSelected = false;
    //   this.FlagUserSelected = false;

    // } else if (this.ReportName == 'Sales Return PatientWise Report') {
    //   this.FlagDoctorSelected = false;
    //   this.FlagUserSelected = false;
    // } else if (this.ReportName == 'Sales Credit Report') {
    //   this.FlagDoctorSelected = false;
    //   this.FlagUserSelected = false;

    // } else if (this.ReportName == 'Pharmacy Daily Collection Summary Day & User Wise') {
    //   this.FlagUserSelected = true;
    //   this.FlagDoctorSelected = false;

    // }
    // else if (this.ReportName == 'Sales Cash Book Report') {
    //   this.FlagDoctorSelected = true;
    //   this.FlagUserSelected = false;

    // }
  }


  getOptionTextUser(option) {
    return option && option.UserName ? option.UserName : '';
  }

  getOptionTextPaymentMode(option) {
    this.PaymentMode = option.PaymentMode;
    return option && option.PaymentMode ? option.PaymentMode : '';
  }


  private _filterUser(value: any): string[] {
    if (value) {
      const filterValue = value && value.UserName ? value.UserName.toLowerCase() : value.toLowerCase();
      return this.optionsUser.filter(option => option.UserName.toLowerCase().includes(filterValue));
    }
  }

  GetUserList() {
    var data = {
      "StoreId": this._loggedUser.currentUserValue.user.storeId
    }
    this._IPBillingService.getUserdetailList(data).subscribe(data => {
      this.UserList = data;
      this.optionsUser = this.UserList.slice();
      // console.log(this.UserList);
      this.filteredOptionsUser = this._IPBillingService.userForm.get('UserId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterUser(value) : this.UserList.slice()),
      );

    });
    const toSelect = this.UserList.find(c => c.UserId == this.UserId);
    this._IPBillingService.userForm.get('UserId').setValue(toSelect);

  }

  getOptionTextsearchDoctor(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }

  getDoctorList() {
    this._IPBillingService.getDoctorList().subscribe(data => {
      this.DoctorList = data;
       this.optionsSearchDoc = this.DoctorList.slice();
      this.filteredOptionsDoctorMode = this._IPBillingService.userForm.get('DoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSearchdoc(value) : this.DoctorList.slice()),
      );
    });
  }

 private _filterSearchdoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsSearchDoc.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }
  getPrint() {
   if (this.ReportName == 'IP DAILY COLLECTION') {
      this.viewIPDailyCollectionPdf();
    } else if (this.ReportName == 'OP IP COMMAN COLLECTION') {
      this.viewgetOPIPCommanReportPdf();
    } else if (this.ReportName == 'OP IP BILL SUMMARY') {
      this.viewgetOPIPBillSummaryReportPdf();
    }
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




  viewIPDailyCollectionPdf() {

    let AddUserId = 0;
    if (this._IPBillingService.userForm.get('UserId').value)
      
    AddUserId = this._IPBillingService.userForm.get('UserId').value.UserId

    setTimeout(() => {
      // this.sIsLoading = 'loading-data';
      this.AdList = true;
     
      this._IPBillingService.getIPDailyCollection(
        this.datePipe.transform(this._IPBillingService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        this.datePipe.transform(this._IPBillingService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        AddUserId
        
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "IP Daily Collection Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
        });
      });

    }, 100);
  }

  viewgetOPIPCommanReportPdf() {
    let AddUserId = 0;

      if (this._IPBillingService.userForm.get('UserId').value)
        
      AddUserId = this._IPBillingService.userForm.get('UserId').value.UserId

      let DoctorId = 0;
    
      if (this._IPBillingService.userForm.get('DoctorId').value)
        
        DoctorId = this._IPBillingService.userForm.get('DoctorId').value.DoctorID


    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
      
      this._IPBillingService.getOPIPCommanCollectionSummary(
        this.datePipe.transform(this._IPBillingService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        this.datePipe.transform(this._IPBillingService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        AddUserId,DoctorId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "OP IP Comman Report"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = ' ';
        });

      });

    }, 100);
  }

  viewgetOPIPBillSummaryReportPdf() {

    let AddUserId = 0;
    if (this._IPBillingService.userForm.get('UserId').value)
      AddUserId = this._IPBillingService.userForm.get('UserId').value.UserId

    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
     
      this._IPBillingService.getOPIPBillSummary(
        this.datePipe.transform(this._IPBillingService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        this.datePipe.transform(this._IPBillingService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
       
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "OPIP Bill Summary Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
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



}


export class ReportDetail {
  ReportName: any;
  ReportId: any;
  constructor(ReportDetail) {
    this.ReportName = ReportDetail.ReportName || '';
    this.ReportId = ReportDetail.ReportId || '';
  }
}