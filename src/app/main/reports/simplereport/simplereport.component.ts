import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe, Time } from '@angular/common';
import { RegistrationService } from '../../opd/registration/registration.service';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { NewRegistrationComponent } from '../../opd/registration/new-registration/new-registration.component';
import { EditRegistrationComponent } from '../../opd/registration/edit-registration/edit-registration.component';
import { SimpleReportService } from './simplereport.service';
import { IndentList, Printsal } from 'app/main/pharmacy/sales/sales.component';
import { OPIPBillreportService } from '../opipbill-reports/opipbillreport.service';
import { SalesService } from 'app/main/pharmacy/sales/sales.service';
import { PrintPreviewService } from 'app/main/shared/services/print-preview.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-simplereport',
  templateUrl: './simplereport.component.html',
  styleUrls: ['./simplereport.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SimplereportComponent implements OnInit {
  
  // @ViewChild('SalescollectiontSummaryemplate') SalescollectiontSummaryemplate: ElementRef;
  // @ViewChild('SalesPatientwiseTemplate') SalesPatientwiseTemplate: ElementRef;
  // @ViewChild('SalesDailycollectiontemplate') SalesDailycollectiontemplate: ElementRef;
  // @ViewChild('SalesReturntemplate') SalesReturntemplate: ElementRef;
  // @ViewChild('billTemplate') billTemplate: ElementRef;

  UserList: any = [];
  DoctorList: any = [];
  sIsLoading: string = '';
  currentDate = new Date();
  reportPrintObjList: Printsal[] = [];
  reportPrintObjListTest: Printsal[] = [];
  reportPrintObjList2: Printsal[] = [];
  reportPrintObjList1: IndentList[] = [];
  printTemplate: any;
  reportPrintObj: Printsal;
  reportPrintObjTax: Printsal;
  subscriptionArr: Subscription[] = [];
  ReportID: any;
  
  filteredOptionsUser: Observable<string[]>;
  filteredOptionsDoctor: Observable<string[]>;

  isUserSelected: boolean = false;
  isDoctorSelected: boolean = false;

  FlagUserSelected: boolean = false;
  FlagDoctorSelected: boolean = false;

  optionsUser: any[] = [];
  optionsDoctor: any[] = [];

  optionsPaymentMode: any[] = [];
  
  SpinLoading: boolean = false;
  AdList: boolean = false;
  FromDate: any;
  Todate: any;
  UserId: any = 0;
  UserName: any;
  IsLoading: boolean = false;
  ReportName: any;

  vDoctorId:any=0;

  displayedColumns = [
    'ReportName'
  ];

  dataSource = new MatTableDataSource<ReportDetail>();
  constructor(
    // this.dataSource.data = TREE_DATA;
    public _OPIPBillreportService: OPIPBillreportService,
    public _PrintPreviewService: PrintPreviewService,

    public _BrowsSalesService: SalesService,
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
    this.GetDoctorList();
    const toSelect = this.UserList.find(c => c.UserId == this.UserId);
    this._OPIPBillreportService.userForm.get('UserId').setValue(toSelect);

    const toSelect1 = this.UserList.find(c => c.UserId == this.UserId);
    this._OPIPBillreportService.userForm.get('UserId').setValue(toSelect);


  }

  bindReportData() {
    // let qry = "SELECT * FROM ReportConfigMaster WHERE IsActive=1 AND IsDeleted=0 AND ReportType=1";

    this._OPIPBillreportService.getDataByQuery().subscribe(data => {
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

    if (this.ReportName == 'OP DAILY COLLECTION') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = true;
    } else if (this.ReportName == 'IP DAILY COLLECTION') {
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


  getOptionTextUser(option) {
    return option && option.UserName ? option.UserName : '';
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
    this._OPIPBillreportService.getUserdetailList(data).subscribe(data => {
      this.UserList = data;
      this.optionsUser = this.UserList.slice();
      console.log(this.UserList);
      this.filteredOptionsUser = this._OPIPBillreportService.userForm.get('UserId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterUser(value) : this.UserList.slice()),
      );

    });
    const toSelect = this.UserList.find(c => c.UserId == this.UserId);
    this._OPIPBillreportService.userForm.get('UserId').setValue(toSelect);

  }


  GetDoctorList() {
   
    this._OPIPBillreportService.getDoctorList().subscribe(data => {
      this.DoctorList = data;
      this.optionsDoctor = this.DoctorList.slice();
      console.log(this.DoctorList);
      this.filteredOptionsDoctor = this._OPIPBillreportService.userForm.get('DcotorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterUser(value) : this.DoctorList.slice()),
      );

    });
    const toSelect = this.DoctorList.find(c => c.DcotorId == this.vDoctorId);
    this._OPIPBillreportService.userForm.get('DcotorId').setValue(toSelect);

  }


  getPrint() {
    if (this.ReportName == 'OP DAILY COLLECTION') {
      this.viewOPDailyCollectionPdf();
    } else if (this.ReportName == 'IP DAILY COLLECTION') {
      this.viewIPDailyCollectionPdf();
    } else if (this.ReportName == 'OP IP COMMAN COLLECTION') {
      this.viewgetOPIPCommanReportPdf();
    } else if (this.ReportName == 'OP IP BILL SUMMARY') {
      this.viewgetOPIPBILLSummaryReportPdf();
    } 
    // else if (this.ReportName == 'Sales Return Summary Report') {
    //   this.viewgetSalesReturnReportPdf();
    // } else if (this.ReportName == 'Sales Return PatientWise Report') {
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



  viewOPDailyCollectionPdf() {
    let AddUserId = 0;
    if (this._OPIPBillreportService.userForm.get('UserId').value)
      AddUserId = this._OPIPBillreportService.userForm.get('UserId').value.UserId

    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
      
      this._OPIPBillreportService.getOPDailyCollection(
        this.datePipe.transform(this._OPIPBillreportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        this.datePipe.transform(this._OPIPBillreportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        AddUserId,this.vDoctorId  
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


  viewIPDailyCollectionPdf() {
    let AddUserId = 0;
    if (this._OPIPBillreportService.userForm.get('UserId').value)
      
    AddUserId = this._OPIPBillreportService.userForm.get('UserId').value.UserId

    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
     
      this._OPIPBillreportService.getIPDailyCollection(
        this.datePipe.transform(this._OPIPBillreportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        this.datePipe.transform(this._OPIPBillreportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        AddUserId
        
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "IP Daily Collection Summary Viewer"
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
      if (this._OPIPBillreportService.userForm.get('UserId').value)
        
      AddUserId = this._OPIPBillreportService.userForm.get('UserId').value.UserId

    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
      
      this._OPIPBillreportService.getOPIPCommanSummary(
        this.datePipe.transform(this._OPIPBillreportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        this.datePipe.transform(this._OPIPBillreportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        AddUserId,this.vDoctorId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pharma Daily Collection Summary Day & User Wise Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = ' ';
        });

      });

    }, 100);
  }

  viewgetOPIPBILLSummaryReportPdf() {

    debugger
    let AddUserId = 0;
    if (this._OPIPBillreportService.userForm.get('UserId').value)
      AddUserId = this._OPIPBillreportService.userForm.get('UserId').value.UserId

    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
     
      this._OPIPBillreportService.getOPIPBILLINgSummary(
        this.datePipe.transform(this._OPIPBillreportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        this.datePipe.transform(this._OPIPBillreportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
       
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "OP IP BILL Summary Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
        });
      });

    }, 100);
  }
  viewgetSalesPatientWiseReportPdf() {
    this.AdList = true;
    let AddUserId = 0;
    if (this._OPIPBillreportService.userForm.get('UserId').value)
      
    AddUserId = this._OPIPBillreportService.userForm.get('UserId').value.UserId
    // setTimeout(() => {
    //   this.sIsLoading = 'loading-data';
    
    //   let Frdate=this.datePipe.transform(this._OPIPBillreportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
    //   let Todate =  this.datePipe.transform(this._OPIPBillreportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
      
    //   this._OPIPBillreportService.getSalesDetail_Patientwise(Frdate,Todate,    
    //     0, 0, AddUserId, this._loggedUser.currentUserValue.user.storeId
    //   ).subscribe(res => {
        
    //     const dialogRef = this._matDialog.open(PdfviewerComponent,
    //       {
    //         maxWidth: "85vw",
    //         height: '750px',
    //         width: '100%',
    //         data: {
    //           base64: res["base64"] as string,
    //           title: "Pharma Daily Collection Summary Patient Wise Viewer"
    //         }
    //       });
    //     dialogRef.afterClosed().subscribe(result => {
    //       this.AdList = false;
    //       this.sIsLoading = ' ';
    //     });
    //   });

    // }, 100);
  }


  viewgetSalesReturnReportPdf() {
    // setTimeout(() => {
    //   this.sIsLoading = 'loading-data';
    //   this.AdList = true;
    //   this._OPIPBillreportService.getSalesReturn(
    //     this.datePipe.transform(this._OPIPBillreportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    //     this.datePipe.transform(this._OPIPBillreportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', 0, 0,
    //     this._loggedUser.currentUserValue.user.storeId
    //   ).subscribe(res => {
    //     const dialogRef = this._matDialog.open(PdfviewerComponent,
    //       {
    //         maxWidth: "85vw",
    //         height: '750px',
    //         width: '100%',
    //         data: {
    //           base64: res["base64"] as string,
    //           title: "Sales Return Viewer"
    //         }
    //       });
    //     dialogRef.afterClosed().subscribe(result => {
    //       this.AdList = false;
    //       this.sIsLoading = '';
    //     });
    //   });

    // }, 100);
  }
  viewgetSalesReturnPatientwiseReportPdf() {
  //   setTimeout(() => {
  //     this.sIsLoading = 'loading-data';
  //     this.AdList = true;
  //     let frdate= this.datePipe.transform(this._OPIPBillreportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
  //     let Todate =this.datePipe.transform(this._OPIPBillreportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
  //  debugger
  //     this._OPIPBillreportService.getSalesReturnPatientwise(frdate,Todate,0, 0,this._loggedUser.currentUserValue.user.storeId
  //     ).subscribe(res => {
  //       const dialogRef = this._matDialog.open(PdfviewerComponent,
  //         {
  //           maxWidth: "85vw",
  //           height: '750px',
  //           width: '100%',
  //           data: {
  //             base64: res["base64"] as string,
  //             title: "Sales Return Patient Wise Viewer"
  //           }
  //         });
  //       dialogRef.afterClosed().subscribe(result => {
  //         this.AdList = false;
  //         this.sIsLoading = '';
  //       });
  //     });

  //   }, 100);
  }

  viewgetSalesCreditReportPdf() {
    // setTimeout(() => {
    //   this.sIsLoading = 'loading-data';
    //   this.AdList = true;
    //   this._OPIPBillreportService.getSalesCredit(
    //     this.datePipe.transform(this._OPIPBillreportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    //     this.datePipe.transform(this._OPIPBillreportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', 0, 0, 0,
    //     this._loggedUser.currentUserValue.user.storeId
    //   ).subscribe(res => {
    //     const dialogRef = this._matDialog.open(PdfviewerComponent,
    //       {
    //         maxWidth: "85vw",
    //         height: '750px',
    //         width: '100%',
    //         data: {
    //           base64: res["base64"] as string,
    //           title: "Sales Credit Viewer"
    //         }
    //       });
    //     dialogRef.afterClosed().subscribe(result => {
    //       this.AdList = false;
    //       this.sIsLoading = '';
    //     });
    //   });

    // }, 100);
  }



  viewgetSalesCashBookReportPdf() {
    // setTimeout(() => {
    //   this.sIsLoading = 'loading-data';
    //   this.AdList = true;

    //   this._OPIPBillreportService.getSalesCashBook(
    //     this.datePipe.transform(this._OPIPBillreportService.userForm.get('startdate').value, "yyyy-MM-dd") || '01/01/1900',
    //     this.datePipe.transform(this._OPIPBillreportService.userForm.get('enddate').value, "yyyy-MM-dd") || '01/01/1900', this.PaymentMode,
    //     this._loggedUser.currentUserValue.user.storeId
    //   ).subscribe(res => {
    //     const dialogRef = this._matDialog.open(PdfviewerComponent,
    //       {
    //         maxWidth: "85vw",
    //         height: '750px',
    //         width: '100%',
    //         data: {
    //           base64: res["base64"] as string,
    //           title: "Sales Cash Book"
    //         }
    //       });
    //     dialogRef.afterClosed().subscribe(result => {
    //       this.AdList = false;
    //       this.sIsLoading = '';
    //     });
    //   });

    // }, 100);
  }

  userChk(option) {
    this.UserId = option.UserID || 0;
    this.UserName = option.UserName;
  }

  PaymentModeChk(option) {
    this.vDoctorId = option.DoctorId;
  }


   
  getOptionTextDoctor(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }
  onClose() { }


  convertToWord(e) {

   // return converter.toWords(e);
  }

  transform2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
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