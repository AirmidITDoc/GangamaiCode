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
  FlagAdvanceDetailIDSelected: boolean = false;
  FlagBillSelected: boolean = false;
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
  

   if (this.ReportName == 'Advance Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceDetailIDSelected=true;
      this.FlagBillSelected=false;
      this.FlagRefundIdSelected=false;

    } else if (this.ReportName == 'IP Bill Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceDetailIDSelected=false;
      this.FlagBillSelected=true;
      this.FlagRefundIdSelected=false;
    }else if (this.ReportName == 'OP IP Bill Summary') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceDetailIDSelected=false;
      this.FlagBillSelected=false;
      this.FlagRefundIdSelected=false;

    }  else if (this.ReportName == 'Bill Summary Report') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceDetailIDSelected=false;
      this.FlagBillSelected=false;

    } 
    if (this.ReportName == 'Credit Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceDetailIDSelected=false;
      this.FlagBillSelected=false;
      this.FlagRefundIdSelected=false;

    } else if (this.ReportName == 'Refund of Advance Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagRefundIdSelected=true;

    } else if (this.ReportName == 'Refund of Bill Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagRefundIdSelected=true;
    } 
    else if (this.ReportName == 'IP Daily Collection Report') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = false;

    } else if (this.ReportName == 'IP Discharge & Bill Generation Pending Report') {
      this.FlagUserSelected = true;
      this.FlagDoctorSelected = false;

    } else if (this.ReportName == 'IP Bill Generation Payment Due report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    } 

    
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
     if (this.ReportName == 'Advance Report') {
      this.viewgetAdvanceReportPdf();
    } 
    else if (this.ReportName == 'IP Bill Report') {
      this.viewgetBillReportPdf();
    } else if (this.ReportName == 'Bill Summary Report') {
      this.viewgetBillSummaryReportPdf();
    }
    else if (this.ReportName == 'OP IP Bill Summary') {
      this.viewgetBillSummaryReportPdf();
    }
    
    else if (this.ReportName == 'Credit Report') {
      this.viewgetCreditReportPdf();
    }
    else if (this.ReportName == 'Refund of Advance Report') {
      this.viewgetRefundofadvanceReportPdf();
    }
    else if (this.ReportName == 'Refund of Bill Report') {
      this.viewgetRefundofbillReportPdf();
    }
   if (this.ReportName == 'IP Daily Collection Report') {
      this.viewIPDailyCollectionPdf();
    } else if (this.ReportName == 'IP Discharge & Bill Generation Pending report') {
      this.viewgetDiscbillgeneratingpendingReportPdf();
    } else if (this.ReportName == 'IP Bill Generation Payment Due Report') {
      this.viewgetBillgenepaymentdueReportPdf();
    }
    else if (this.ReportName == 'IP Discharge & Bill Generation Pending Report') {
      this.viewgetIpdischargebillgenependingPdf();
    }else if (this.ReportName == 'IP Bill Generation Payment Due report') {
      this.ViewgetIpbillgenepaymentdueview();
    }
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

  viewgetCreditReportPdf(){
   
  this._IPBillingService.getCreditReceipt(
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
          title: "Ip Credit  Viewer"
        }
      });
  });
  }

viewgetAdvanceReportPdf() {
let AdvanceDetailID=this._IPBillingService.userForm.get('AdvanceDetailID').value || 0;
  this._IPBillingService.getViewAdvanceReceipt(
    AdvanceDetailID
  ).subscribe(res => {
    const dialogRef = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Advance Viewer"
        }
      });
  });
}


viewgetBillReportPdf() {
let BillNo=this._IPBillingService.userForm.get('BillNo').value || 0;
  this._IPBillingService.getIpFinalBillReceipt(
    BillNo
  ).subscribe(res => {
    const dialogRef = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Ip Bill  Viewer"
        }
      });
  });
}




viewgetBillSummaryReportPdf(){

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


viewgetRefundofadvanceReportPdf() {
  setTimeout(() => {
    let RefundId=this._IPBillingService.userForm.get('RefundId').value || 0;
    this.sIsLoading = 'loading-data';
    //  this.AdList=true;
    this._IPBillingService.getRefundofAdvanceview(
      RefundId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Refund Of Advance  Viewer"
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = '';
        // this.SpinLoading = false;
      });

    });

  }, 100);
}

viewgetRefundofbillReportPdf(){
  setTimeout(() => {
   let RefundId=this._IPBillingService.userForm.get('RefundId').value || 0;
    this.sIsLoading = 'loading-data';
  //  this.AdList=true;
  this._IPBillingService.getRefundofbillview(
    RefundId
  ).subscribe(res => {
    const dialogRef = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Refund Of Bill  Viewer"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = '';
        // this.SpinLoading = false;
      });
    
  });
 
  },100);
}



viewgetDiscbillgeneratingpendingReportPdf(){
  setTimeout(() => {
   
    this.sIsLoading = 'loading-data';
  //  this.AdList=true;
  this._IPBillingService.getDischargeBillgeneratependingview(
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
          title: "Discharge Bill Generate Pending Report View"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.sIsLoading = '';
        // this.SpinLoading = false;
      });
    
  });
 
  },100);
}
viewgetBillgenepaymentdueReportPdf(){
  setTimeout(() => {
   
     this.sIsLoading = 'loading-data';
   //  this.AdList=true;
   this._IPBillingService.getBillgeneratepaymentdueview(
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
           title: "Bill Generated Payment Due Report View"
         }
       });
       dialogRef.afterClosed().subscribe(result => {
         // this.AdList=false;
         this.sIsLoading = '';
         // this.SpinLoading = false;
       });
     
   });
  
   },100);
}
 

viewgetIpdischargebillgenependingPdf(){
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
 
  this._IPBillingService.getIdischargebillgenependingView(
    this.datePipe.transform(this._IPBillingService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPBillingService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
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
 
  this._IPBillingService.getIpbillgenepaymentdueView(
    this.datePipe.transform(this._IPBillingService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPBillingService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
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