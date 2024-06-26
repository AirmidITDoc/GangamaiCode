import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

import { Observable } from 'rxjs';

import { IPReportService } from './ipreport.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { L } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-ip-report',
  templateUrl: './ip-report.component.html',
  styleUrls: ['./ip-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IpReportComponent implements OnInit {

 
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
  FlagAdmissionIdSelected: boolean = false;
  FlagAdvanceIdSelected: boolean = false;
  FlagRequestIdSelected: boolean = false;

  FlagPaymentIdSelected: boolean = false;
  FlagMaterialConsumptionIdSelected: boolean = false;
  FlagWardIdSelected: boolean = false;
  FlagCompanyIdSelected: boolean = false;


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
    public _IPReportService: IPReportService,
    
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
    this._IPReportService.userForm.get('UserId').setValue(toSelect);

  }

  bindReportData() {
    // let qry = "SELECT * FROM ReportConfigMaster WHERE IsActive=1 AND IsDeleted=0 AND ReportType=1";
var data={
  ReportSection:"IP Reports"//"IP Reports"
}
    this._IPReportService.getDataByQuery(data).subscribe(data => {
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
    if (this.ReportName == 'Admitted Patient List') {
            this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
    } else if (this.ReportName == 'IP Patient CasePaper') {
      
      this.FlagAdmissionIdSelected=true
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;


    } else if (this.ReportName == 'IPD Admission List Company Wise Details') {
      
      this.FlagAdmissionIdSelected=true
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;


    }
    else if (this.ReportName == 'IPD Admission List Company Wise Summary') {
      
      this.FlagAdmissionIdSelected=true
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;


    }
    else if (this.ReportName == 'IPD Current Admitted List') {
      
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;


    }
    else if (this.ReportName == 'IPD Current Admitted - Ward Wise Charges') {
      
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
      this.FlagWardIdSelected = true;
      this.FlagCompanyIdSelected=true;


    } 
    else if (this.ReportName == 'Department Wise Count Summary') {
      
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;


    } 
    else if (this.ReportName == 'Doctor Wise Count Summary') {
      
      this.FlagAdmissionIdSelected=true
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;


    } 
   
    else if (this.ReportName == 'IPD Current Ref Admitted List') {
      
      this.FlagAdmissionIdSelected=true
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;


    } 
    else if (this.ReportName == 'IPD Discharge Type Wise') {
      
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = true;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;


    } 
    else if (this.ReportName == 'IPD Discharge Type Company Wise') {
      
      this.FlagAdmissionIdSelected=true
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;


    }  else if (this.ReportName == 'IPD RefDoctor Wise') {
      
      this.FlagAdmissionIdSelected=true
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;


    }
    else if (this.ReportName == 'IPD Discharge Details') {
      
      this.FlagAdmissionIdSelected=true
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;


    }
    else if (this.ReportName == 'IPD Discharge Report with Mark Status') {
      
      this.FlagAdmissionIdSelected=true
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;


    }
    else if (this.ReportName == 'IPD Discharge Report with Bill Summary') {
      
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;


    }
    else if (this.ReportName == 'OP to IP Converted List With Service availed') {
      
      this.FlagAdmissionIdSelected=false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;


    }

   else if (this.ReportName == 'IP Advance Receipt') {
      
      this.FlagAdmissionIdSelected=false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      
      this.FlagAdvanceIdSelected = true;
      this.FlagRequestIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
    }
     else if (this.ReportName == 'IP Lab Request Report') {
      
      this.FlagRequestIdSelected=true
      this.FlagAdmissionIdSelected=false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      
      this.FlagAdvanceIdSelected = false;
      this.FlagPaymentIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
    } 
    else if (this.ReportName == 'IP Settlement Receipt') {
      
      this.FlagPaymentIdSelected=true;
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=false;
    } else if (this.ReportName == 'Material Consumption Report') {
      
      this.FlagPaymentIdSelected=false;
      this.FlagAdmissionIdSelected=false
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      
      this.FlagAdvanceIdSelected = false;
      this.FlagRequestIdSelected = false;
      this.FlagMaterialConsumptionIdSelected=true;
    } 



    //IPMIS
  if (this.ReportName == 'Date wise Admission Count') {
      this.FlagDoctorSelected = false;
      this.FlagUserSelected = false;

    } else if (this.ReportName == 'Month Wise Admission Count') {
      this.FlagDoctorSelected = false;
      this.FlagUserSelected = false;
    } else if (this.ReportName == 'Date wise Dr wise Admission Count Detail') {
      this.FlagDoctorSelected = false;
      this.FlagUserSelected = false;

    } else if (this.ReportName == 'Date wise Dr wise Admission Count Summary') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Date wise Department Wise Admission Count Detail') {
      this.FlagDoctorSelected = false;
      this.FlagUserSelected = false;

    }
   else if (this.ReportName == 'Date wise Department Wise Admission Count Summary') {
    this.FlagDoctorSelected = false;
    this.FlagUserSelected = false;
  } else if (this.ReportName == 'Doctor wise collection Detail') {
    this.FlagDoctorSelected = false;
    this.FlagUserSelected = false;

  } else if (this.ReportName == 'Doctor wise collection Summary') {
    this.FlagUserSelected = false;
    this.FlagDoctorSelected = false;

  }
  else if (this.ReportName == 'Department wise collection Detail') {
    this.FlagDoctorSelected = false;
    this.FlagUserSelected = false;

  }
  else if (this.ReportName == 'Department wise collection Summary') {
    this.FlagDoctorSelected = false;
    this.FlagUserSelected = false;
  } else if (this.ReportName == 'Company wise admission count Detail') {
    this.FlagDoctorSelected = false;
    this.FlagUserSelected = false;

  } else if (this.ReportName == 'Company wise admission Summary') {
    this.FlagUserSelected = false;
    this.FlagDoctorSelected = false;

  }
  else if (this.ReportName == 'Company wise Bill detail Report') {
    this.FlagDoctorSelected = false;
    this.FlagUserSelected = false;

  } else if (this.ReportName == 'Company Wise Bill summary report') {
    this.FlagDoctorSelected = false;
    this.FlagUserSelected = false;

  } else if (this.ReportName == 'Company wise Credit Report Detail') {
    this.FlagUserSelected = false;
    this.FlagDoctorSelected = false;

  }
  else if (this.ReportName == 'Company wise Credit Report Summary') {
    this.FlagDoctorSelected = false;
    this.FlagUserSelected = false;

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
    this._IPReportService.getUserdetailList(data).subscribe(data => {
      this.UserList = data;
      this.optionsUser = this.UserList.slice();
      // console.log(this.UserList);
      this.filteredOptionsUser = this._IPReportService.userForm.get('UserId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterUser(value) : this.UserList.slice()),
      );

    });
    const toSelect = this.UserList.find(c => c.UserId == this.UserId);
    this._IPReportService.userForm.get('UserId').setValue(toSelect);

  }

  getOptionTextsearchDoctor(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }

  getDoctorList() {
    this._IPReportService.getDoctorList().subscribe(data => {
      this.DoctorList = data;
       this.optionsSearchDoc = this.DoctorList.slice();
      this.filteredOptionsDoctorMode = this._IPReportService.userForm.get('DoctorId').valueChanges.pipe(
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
   if (this.ReportName == 'Admitted Patient List') {
      this.getAdmittedPatientListview();
    } else if (this.ReportName == 'IP Patient CasePaper') {
      this.getAdmittedPatientCasepaperview();
      
    } 
    else if (this.ReportName == 'IP Advance Receipt') {
      this.viewgetIPAdvanceReportPdf();
      
    } 
     else if (this.ReportName == 'IPD Admission List Company Wise Details') {
      this.getAdmissionlistcompanywiseview();
      
    } else if (this.ReportName == 'IPD Admission List Company Wise Summary') {
      this.viewgetAdmlistcompanywisesummaryReportPdf();
      
    }
     else if (this.ReportName == 'IPD Current Admitted List') {
      this.viewgetCurrentadmittedReportPdf();
    } 
    else if (this.ReportName == 'IPD Current Admitted - Ward Wise Charges') {
      this.getCurrentadmitwardwisechargsview();
    } else if (this.ReportName == 'Department Wise Count Summary') {
      this.getDeptwisecountsummarypdf();
      
    } 
    else if (this.ReportName == 'Doctor Wise Count Summary') {
      this.viewgetDoctorwisecountsummaryReportPdf();
    }
    else if (this.ReportName == 'IPD Current Ref Admitted List') {
      this.viewgetCurrRefdocAdmitlistReportPdf();
    }
    else if (this.ReportName == 'IPD Discharge Type Wise') {
      this.viewgetDischargeTypewiseReportPdf();
    }
    else if (this.ReportName == 'IPD Discharge Type Company Wise') {
      this.viewgetDischargetypecompanywisePdf();
    }
    else if (this.ReportName == 'IPD Discharge Type Company Wise Count') {
      this.viewgetDisctypecompanywisecountPdf();
    }
    else if (this.ReportName == 'IPD RefDoctor Wise') {
      this.viewgetRefDoctorwiseReportPdf();
    }
    else if (this.ReportName == 'IPD Discharge Details') {
      this.viewgetDischargedetailReportPdf();
    }
    else if (this.ReportName == 'IPD Discharge Report with Mark Status') {
      this.viewgetDischareRptwithmarkstatusPdf();
    }
    else if (this.ReportName == 'IPD Discharge Report with Bill Summary') {
      this.viewgetDischargerptwithbillsummaryPdf();
    }
    else if (this.ReportName == 'OP to IP Converted List With Service availed') {
      this.viewgetOPTOIPConwithserviceavaliedPdf();
    }
    else if (this.ReportName == 'IPD Current Admitted - Ward Wise Charges') {
      this.viewgetIpdcurAdmitwardwisechargesReportPdf();
    } else if (this.ReportName == 'IP Lab Request Report') {
      this.viewgetLabrequestReportPdf();
    }
    else if (this.ReportName == 'IP Settlement Receipt') {
      this.getIpPaymentReceiptview();
    } else if (this.ReportName == 'Material Consumption Report') {
      this.viewgetMaterialConsumptionPdf();
    }
    else if (this.ReportName == ' IPD Discharge Type Wise') {
      this.viewgetDischaregTypewisePdf();
    }
   

    //IPMIS
    if (this.ReportName == 'Date wise Admission Count') {
      this.viewDatewiseAdmissioncountPdf();
    }
    else if (this.ReportName == 'Month Wise Admission Count') {
      this.viewmonthwiseAdmissioncountPdf();
    } else if (this.ReportName == 'Date wise Dr wise Admission Count Detail') {
      this.viewDatewisedrwiseAdmissioncountPdf();
    }
    else if (this.ReportName == 'Date wise Dr wise Admission Count Summary') {
      this.viewDatewisedrwiseAdmissioncountsummaryPdf();
    } else if (this.ReportName == 'Date wise Department Wise Admission Count Detail') {
      this.viewDatewisedeptwiseadmissioncountPdf();
    }
    else if (this.ReportName == 'Date wise Department Wise Admission Count Summary') {
      this.viewDatewisedeptwiseadmissioncountsummaryPdf();
    }
    else if (this.ReportName == 'Doctor wise collection Detail') {
      this.getDoctorwisecolldetailview();
    } else if (this.ReportName == 'Doctor wise collection Summary') {
      this.getDoctorwisecollsummaryview();
    }
    else if (this.ReportName == 'Department wise collection Detail') {
      this.viewDeptwisecolldetailPdf();
    }
    else if (this.ReportName == 'Department wise collection Summary') {
      this.viewDeptwisecollSummaryPdf();
    } else if (this.ReportName == 'Company wise admission count Detail') {
      this.viewCompanywiseAdmissioncountPdf();
    }
    else if (this.ReportName == 'Company wise admission Summary') {
      this.viewCompanywiseAdmissioncountsummaryPdf();
    } else if (this.ReportName == 'Company wise Bill detail Report') {
      this.viewCompanywisebilldetailPdf();
    }
    else if (this.ReportName == 'Company Wise Bill summary report') {
      this.viewCompanywisebillsummaryPdf();
    } else if (this.ReportName == 'Company wise Credit Report Detail') {
      this.viewCompanywisecreditPdf();
    }
    else if (this.ReportName == 'Company wise Credit Report Summary') {
      this.viewCompanywisecreditsummaryPdf();
    }
  }



  getAdmittedPatientListview() {
    // this.sIsLoading = 'loading-data';
    
    setTimeout(() => {
      
     this.AdList=true;
    this._IPReportService.getAdmittedPatientListView(
     
      this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
      this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
      0,0,
      ).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Admission List  Viewer"
          }
        });

        matDialog.afterClosed().subscribe(result => {
          this.AdList=false;
          this.sIsLoading = ' ';
        });
    });
   
    },100);

  }

  
  getAdmittedPatientCasepaperview() {
   debugger

    let AdmissionID=this._IPReportService.userForm.get('AdmissionID').value || 0;
    
    setTimeout(() => {
      this.SpinLoading =true;
     this.AdList=true;
    this._IPReportService.getAdmittedPatientCasepaaperView(
      AdmissionID
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
          this.AdList=false;
          this.sIsLoading = ' ';
        });
    });
   
    },100);

  }

  
viewgetIPAdvanceReportPdf() {
  let AdvanceDetailID=this._IPReportService.userForm.get('AdvanceDetailID').value || 0;
    setTimeout(() => {
      this.SpinLoading =true;
     this.AdList=true;
     
    this._IPReportService.getViewAdvanceReceipt(
   AdvanceDetailID
    ).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Ip advance Viewer"
          }
        });
        matDialog.afterClosed().subscribe(result => {
          this.AdList=false;
          this.SpinLoading = false;
        });
    });
   
    },100)
  }
 
  
  viewgetLabrequestReportPdf() {
    debugger
    let RequestId=this._IPReportService.userForm.get('RequestId').value || 0;
    setTimeout(() => {
      this.SpinLoading =true;
    //  this.AdList=true;
    this._IPReportService.getLabrequestview(
      RequestId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Lab Request Viewer"
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
   
    },100);
  }

  getIpPaymentReceiptview() {
    let PaymentId=this._IPReportService.userForm.get('PaymentId').value || 0;
    setTimeout(() => {
      this.SpinLoading =true;
    //  this.AdList=true;
    this._IPReportService.getIpPaymentReceiptView(
    PaymentId
      ).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "IP Payment Receipt Viewer"
          }
        });
  
        matDialog.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
    });
   
    },100);
  
   
  }

  getMaterialConsumptionpdf() {
    let MaterialConsumptionId=this._IPReportService.userForm.get('MaterialConsumptionId').value || 0;
    setTimeout(() => {
      this.SpinLoading =true;
    //  this.AdList=true;
    this._IPReportService.getMaterialconsumptionView(
      MaterialConsumptionId
      ).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Material Consumption Viewer"
          }
        });
  
        matDialog.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
    });
   
    },100);
  
   
  }



  viewgetCurrentadmittedReportPdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getAdmittedPatientListView(
      
       this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       0,0,
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Admission List  Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }

  
  getAdmissionlistcompanywiseview(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getAdmittedPatientListCompanywiseView(
      
       this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
     
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Admission List Company Wise Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetAdmlistcompanywisesummaryReportPdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getAdmittedPatientListCompanywisesummaryView(
      
       this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
     
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Admission List Company Wise Summary  Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  getCurrentadmitwardwisechargsview(){
    this.SpinLoading =true;
    setTimeout(() => {
      let DoctorId=this._IPReportService.userForm.get('DoctorId').value || 0
      let  WardId=this._IPReportService.userForm.get('WardId').value || 0
      let CompanyId=this._IPReportService.userForm.get('CompanyId').value || 0
      this.AdList=true;
     this._IPReportService.getCurrAdmitwardwisechargesView(
      DoctorId, WardId,CompanyId
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Admission List Ward Wise Charges Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  getDeptwisecountsummarypdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getDeptwisecountsummaryView(
      
       this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Department Wise  Count Summary  Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetDoctorwisecountsummaryReportPdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getDoctwisecountsummaryView(
      
       this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
      
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Doctor Wise  Count Summary  Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetCurrRefdocAdmitlistReportPdf(){
    this.SpinLoading =true;
    setTimeout(() => {
      let DoctorId=this._IPReportService.userForm.get('DoctorId').value || 0
      this.AdList=true;
     this._IPReportService.getCurrRefDoctAdmitlistView(
      DoctorId
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Current RefDoctor Wise Admitted List Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetDischargeTypewiseReportPdf(){
    this.SpinLoading =true;
    let DoctorId=this._IPReportService.userForm.get('DoctorId').value.DoctorID || 0
    let DischargeTypeId=0
    setTimeout(() => {
      
      this.AdList=true;
     this._IPReportService.getDischargetypewiseView(DoctorId,
      this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       DischargeTypeId
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Discharge Type Wise List Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetDisctypecompanywisecountPdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getDischargetypewisecompanycountView(
      
      //  this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
      //  this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       0,
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Discharge Type Wise Company Count List Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetRefDoctorwiseReportPdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getRefdocwiseView(
      
      //  this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
      //  this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       0,
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Ref Doctor Wise List Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetDischargedetailReportPdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getDischargedetailView(
      
      //  this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
      //  this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       0,
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Discharge Detail Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetDischareRptwithmarkstatusPdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getDischargedetailwithmarkView(
      
       this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Discharge Detail With Mark Status Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetDischargerptwithbillsummaryPdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getDischargedetailwithbillsummaryView(
      
       this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Discharge Detail With Bill Summary Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetOPTOIPConwithserviceavaliedPdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getOptoIPconwithserviceavailedView(
      
       this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "OP To IP Converted List with Service Avalied Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  viewgetDischargetypecompanywisePdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getDischargetypecompanywiseView(
      
      //  this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
      //  this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       0,
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Discharge Type Company Wise  Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }

  viewgetIpdcurAdmitwardwisechargesReportPdf(){
    setTimeout(() => {
      this.SpinLoading =true;
      this.AdList=true;
     this._IPReportService.getIpcurrAdmitwardwisedischargeView(
      
      //  this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
      //  this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
       0,
       ).subscribe(res => {
       const matDialog = this._matDialog.open(PdfviewerComponent,
         {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Current Admitted Ward wise Discharge Viewer"
           }
         });
 
         matDialog.afterClosed().subscribe(result => {
           this.AdList=false;
           this.sIsLoading = ' ';
         });
     });
    
     },100);
  }
  

  
  viewgetMaterialConsumptionPdf() {
    this.sIsLoading = 'loading-data';
   let MaterialConsumptionId=0
     setTimeout(() => {
       this.AdList = true;
       this._IPReportService.getMaterialConsumptionReport(
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

   
   viewgetDischaregTypewisePdf() {
    this.sIsLoading = 'loading-data';
   let DoctorId=0
   let DischargeTypeId=0
setTimeout(() => {
       this.AdList = true;
       this._IPReportService.getDischargetypewiseReport(
        DoctorId,
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
        DischargeTypeId
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "IPD Discharge Type Wise Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           this.AdList = false;
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }


//IPMIS


viewDatewiseAdmissioncountPdf() {
  this.SpinLoading =true;
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getDatewiseAdmissioncountView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Date Wise Admission Count Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}



viewmonthwiseAdmissioncountPdf() {
  // this.sIsLoading = 'loading-data';
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getMonthwiseAdmissioncountView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Month Wise Admission Count Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}


viewDatewisedrwiseAdmissioncountPdf() {
  // this.sIsLoading = 'loading-data';
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getdatedrwiseAdmissioncountView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Date Wise Doctor Wise Admission Count Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}



viewDatewisedrwiseAdmissioncountsummaryPdf() {
  // this.sIsLoading = 'loading-data';
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getdatedrwiseAdmissioncountsummaryView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Date Wise Doctor Wise Admission Count Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}



viewDatewisedeptwiseadmissioncountPdf() {
  // this.sIsLoading = 'loading-data';
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getdatedrwisedeptwiseAdmissioncountdetailView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Date Wise Department Wise Admission Count Detail Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}



getDoctorwisecolldetailview() {
  // this.sIsLoading = 'loading-data';
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getdoctorwisecolldetailView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Doctor Wise Collection Detail Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}


viewDatewisedeptwiseadmissioncountsummaryPdf() {
  // this.sIsLoading = 'loading-data';
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getdatedrwisedeptwiseAdmissioncountsummaryView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Date Wise Department Wise Admission Count Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}




getDoctorwisecollsummaryview() {
  // this.sIsLoading = 'loading-data';
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getDoctorwisecollsummaryView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Doctor Wise Collection Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}

viewDeptwisecolldetailPdf() {
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getDeptwisecolldetailView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Department Wise Collection Detail Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}

viewDeptwisecollSummaryPdf() {
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getDeptwisecollsummaryView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Department Wise Collection Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}

viewCompanywiseAdmissioncountPdf() {
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getCompanywiseAdmissioncountView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Company Wise Admission Count Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}


viewCompanywiseAdmissioncountsummaryPdf() {
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getCompanywiseAdmissioncountsummaryView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Company Wise Admission Count Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}

viewCompanywisebilldetailPdf() {
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getCompanywisebilldetailView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Company Wise Bill Detail Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}

viewCompanywisebillsummaryPdf() {
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getCompanywisebillsummaryView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Company Wise Bill Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}



viewCompanywisecreditPdf() {
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getCompanywisecreditView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Company Wise Credit Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = ' ';
      });
  });
 
  },100);

}


viewCompanywisecreditsummaryPdf() {
  
  setTimeout(() => {
    
   this.AdList=true;
  this._IPReportService.getCompanywisecreditsummaryView(
   
    this.datePipe.transform(this._IPReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
    this.datePipe.transform(this._IPReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
   
    ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Company Wise Credit Summary Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
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