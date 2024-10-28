import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { ReportDetail } from '../common-report/common-report.component';
import { OPReportsService } from '../op-reports/opreports.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { GstReportService } from './gst-report.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-gst-report',
  templateUrl: './gst-report.component.html',
  styleUrls: ['./gst-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class GSTReportComponent implements OnInit {

  UserId:any=0;
  UserName:any=''
  UserList:any=[];
  StoreList:any=[];
  filteredOptionsUser: Observable<string[]>;
  filteredOptionsstore: Observable<string[]>;
  isUserSelected: boolean = false;
  isSearchstoreSelected: boolean = false;
  FlagStoreSelected: boolean = false;
  FlagUserSelected: boolean = false;
  FlagReportTypeSelected: boolean = false;
  ReportName: any;
  SpinLoading: boolean = false;
  sIsLoading: string = '';
  ReportID:any=0

  optionsSearchstore: any[] = [];

  displayedColumns = [
    'ReportName'
  ];

  dataSource = new MatTableDataSource<ReportDetail>();
  
  constructor( public _GstReportService: GstReportService,
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
    this.gePharStoreList();
   // this.getStoreList();


    this.filteredOptionsUser = this._GstReportService.userForm.get('UserId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterUser(value)),

    );
  }


  bindReportData() {
    var data={
   ReportSection:'GST REPORT'
   }
     this._GstReportService.getDataByQuery(data).subscribe(data => {
       this.dataSource.data = data as any[];
 
     });
   }
 
   ReportSelection(el) {
     this.ReportName = el.ReportName;
     this.ReportID = el.ReportId;
     
     if (this.ReportName == 'Sales Profit Summary Report') {
      this.FlagStoreSelected = true;
     }else if (this.ReportName == 'Sales Profit Bill Report') {
       this.FlagStoreSelected = true;
       this.FlagUserSelected = false;
       this.FlagReportTypeSelected= false;
     }
     else if (this.ReportName == 'Sales Profit Item Wise Summary Report') {
       this.FlagUserSelected = false;
       this.FlagStoreSelected = true;
       this.FlagReportTypeSelected= false;
     } 
   
     else if (this.ReportName == 'Purchase GST Report Supplier Wise-GST%') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
    } 
    else if (this.ReportName == 'Purchase GST Report Supplier Wise-Without GST%') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
    } 
    else if (this.ReportName == 'Purchase GST Report Date Wise') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= true;
    } 
    else if (this.ReportName == 'Purchase GST Report - Summary') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
    } 
    else if (this.ReportName == 'Purchase Retum GST Report Date Wise Purchase Return GST Report - Summary') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
    } 
    else if (this.ReportName == 'Purchase GST Summary') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
    } 
    else if (this.ReportName == 'Sales GST Report') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= true;
    } 
    else if (this.ReportName == 'Sales GST Date Wise Report') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= true;
    } 
    else if (this.ReportName == 'Sales Return GST Report') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
    } 
    else if (this.ReportName == 'Sales Return GST Date Wise Report') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= true;
    } 
    else if (this.ReportName == 'Sales GST Summary Consolidated') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
    } 
    else if (this.ReportName == 'HSN Code Wise Report') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
    } 
    else if (this.ReportName == 'GST B2CS Report') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
    } 
    else if (this.ReportName == 'GST B2GS Report Consolidated') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
    }   else if (this.ReportName == 'GSTR2A Purchase Report') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
    } 
    else if (this.ReportName == 'GSTR2A Supplier Wise Purchase Report') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
    } 
    }


    getPrint() {
   
      if (this.ReportName == 'Sales Profit Summary Report') {
        this.viewSalesprofitsummaryPdf();
      } else if (this.ReportName == 'Sales Profit Bill Report') {
        this.viewsalesprofitbillPdf();
      } 
      else if (this.ReportName == 'Sales Profit Item Wise Summary Report') {
        this.viewgetprofititemwisesummaryPdf();
      }
     
      else if (this.ReportName == 'Purchase GST Report Supplier Wise-GST%') {
        this.viewgetpurchasesupplierwisegstPdf();
     } 
     else if (this.ReportName == 'Purchase GST Report Supplier Wise-Without GST%') {
      this.viewgetpurchasesupplierwisewithoutgstPdf();
     } 
     else if (this.ReportName == 'Purchase GST Report Date Wise') {
      this.viewgetpurchasegstdatewisePdf();
     } 
     else if (this.ReportName == 'Purchase GST Report - Summary') {
      this.viewgetpurchasegstsummaryPdf();
     } 
     else if (this.ReportName == 'Purchase Retum GST Report Date Wise Purchase Return GST Report - Summary') {
      this.viewgetpurchasereturngstdatewisePdf();
     } 
     else if (this.ReportName == 'Purchase GST Summary') {
      this.viewgetpurchasegstsummaryPdf();
     } 
     else if (this.ReportName == 'Sales GST Report') {
      this.viewgetSalesGstreportPdf();
     } 
     else if (this.ReportName == 'Sales GST Date Wise Report') {
      this.viewgetSalesGstdatewisereportPdf();
     } 
     else if (this.ReportName == 'Sales Return GST Report') {
      this.viewgetSalesreturngstPdf();
     } 
     else if (this.ReportName == 'Sales Return GST Date Wise Report') {
      this.viewgetSalesreturngstdatewisePdf();
     } 
     else if (this.ReportName == 'Sales GST Summary Consolidated') {
     // this.viewgetSalesreturngstsummconsolidatedPdf();
     } 
     else if (this.ReportName == 'HSN Code Wise Report') {
      this.viewgetHSMCodewisePdf();
     } 
     else if (this.ReportName == 'GST B2CS Report') {
      this.viewgetGSTB2CsPdf();
     } 
     else if (this.ReportName == 'GST B2GS Report Consolidated') {
     // this.viewgetGSTB2CsconsolidatedPdf();
     }   else if (this.ReportName == 'GSTR2A Purchase Report') {
      this.viewgeGSTRAZpurchasePdf();
     } 
     else if (this.ReportName == 'GSTR2A Supplier Wise Purchase Report') {
      this.viewgeGSTRAZsuppwelierwisepurchasePdf();
     } 

    }


    viewSalesprofitsummaryPdf() {
      debugger
      let storeId=0;
      if (this._GstReportService.userForm.get('StoreId').value.StoreId)
        storeId = this._GstReportService.userForm.get('StoreId').value.StoreId
  
      this.sIsLoading = 'loading-data';
      setTimeout(() => {
     
      this._GstReportService.getSalesprofitsummaryReport(
        this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",storeId
        ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Sales Profit Summary Report report Viewer"
            }
          });
    
          matDialog.afterClosed().subscribe(result => {
            // this.AdList=false;
            this.sIsLoading = ' ';
          });
      });
     
      },100);
    
    }
    
    
    viewsalesprofitbillPdf() {
      debugger
      this.sIsLoading = 'loading-data';
      let storeId =this._loggedUser.currentUserValue.user.storeId;
      if (this._GstReportService.userForm.get('StoreId').value.StoreId)
        storeId = this._GstReportService.userForm.get('StoreId').value.StoreId
  
      setTimeout(() => {
     
      this._GstReportService.getSalesprofitbillReport(
        this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",storeId
        ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Sales Profit Bill report Viewer"
            }
          });
    
          matDialog.afterClosed().subscribe(result => {
            // this.AdList=false;
            this.sIsLoading = ' ';
          });
      });
     
      },100);
    
    }
  
    viewgetprofititemwisesummaryPdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId =this._loggedUser.currentUserValue.user.storeId;
      if (this._GstReportService.userForm.get('StoreId').value.StoreId)
        storeId = this._GstReportService.userForm.get('StoreId').value.StoreId
  
       setTimeout(() => {
       
         this._GstReportService.getProfititemwisesummaryReport(
          this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",storeId
         ).subscribe(res => {
           const dialogRef = this._matDialog.open(PdfviewerComponent,
             {
               maxWidth: "85vw",
               height: '750px',
               width: '100%',
               data: {
                 base64: res["base64"] as string,
                 title: "Profit Item Wise Summaery Report  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
           });
         });
   
       }, 100);
     }
  
     viewgetpurchasesupplierwisegstPdf() {
      debugger
      this.sIsLoading = 'loading-data';
   
      let storeId =this._loggedUser.currentUserValue.user.storeId;
      if (this._GstReportService.userForm.get('StoreId').value.StoreId)
        storeId = this._GstReportService.userForm.get('StoreId').value.StoreId
  
       setTimeout(() => {
       
         this._GstReportService.getpurchasesupplierwiseReport(
          this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",storeId
         ).subscribe(res => {
           const dialogRef = this._matDialog.open(PdfviewerComponent,
             {
               maxWidth: "85vw",
               height: '750px',
               width: '100%',
               data: {
                 base64: res["base64"] as string,
                 title: "Purchase GST Report Supplier Wise  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
           });
         });
   
       }, 100);
     }
     viewgetpurchasesupplierwisewithoutgstPdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId =this._loggedUser.currentUserValue.user.storeId;
      if (this._GstReportService.userForm.get('StoreId').value.StoreId)
        storeId = this._GstReportService.userForm.get('StoreId').value.StoreId
  
       setTimeout(() => {
       
         this._GstReportService.getpurchasesupplierwisewithoutgstReport(
          this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",storeId
         ).subscribe(res => {
           const dialogRef = this._matDialog.open(PdfviewerComponent,
             {
               maxWidth: "85vw",
               height: '750px',
               width: '100%',
               data: {
                 base64: res["base64"] as string,
                 title: "Purchase Supplier Wise Without GST Report  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
           });
         });
   
       }, 100);
     }


     viewgetpurchasegstdatewisePdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId =this._loggedUser.currentUserValue.user.storeId;
      if (this._GstReportService.userForm.get('StoreId').value.StoreId)
        storeId = this._GstReportService.userForm.get('StoreId').value.StoreId
  
       setTimeout(() => {
       
         this._GstReportService.getpurchasedatewiseReport(
          this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",storeId
         ).subscribe(res => {
           const dialogRef = this._matDialog.open(PdfviewerComponent,
             {
               maxWidth: "85vw",
               height: '750px',
               width: '100%',
               data: {
                 base64: res["base64"] as string,
                 title: "Purchase Date Wise Report Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
           });
         });
   
       }, 100);
     }

     viewgetpurchasegstsummaryPdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId =this._loggedUser.currentUserValue.user.storeId;
      if (this._GstReportService.userForm.get('StoreId').value.StoreId)
        storeId = this._GstReportService.userForm.get('StoreId').value.StoreId
  
       setTimeout(() => {
       
         this._GstReportService.getpurchasegstsummaryReport(
          this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",storeId
         ).subscribe(res => {
           const dialogRef = this._matDialog.open(PdfviewerComponent,
             {
               maxWidth: "85vw",
               height: '750px',
               width: '100%',
               data: {
                 base64: res["base64"] as string,
                 title: "Purchase GST Summary  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
           });
         });
   
       }, 100);
     }

     viewgetpurchasereturnsummaryPdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId =this._loggedUser.currentUserValue.user.storeId;
      if (this._GstReportService.userForm.get('StoreId').value.StoreId)
        storeId = this._GstReportService.userForm.get('StoreId').value.StoreId
  
       setTimeout(() => {
       
         this._GstReportService.getpurchasereturngstsummaryReport(
          this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
         ).subscribe(res => {
           const dialogRef = this._matDialog.open(PdfviewerComponent,
             {
               maxWidth: "85vw",
               height: '750px',
               width: '100%',
               data: {
                 base64: res["base64"] as string,
                 title: "Purchase Return Summary  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
           });
         });
   
       }, 100);
     }

     viewgetpurchasereturngstdatewisePdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId =this._loggedUser.currentUserValue.user.storeId;
      if (this._GstReportService.userForm.get('StoreId').value.StoreId)
        storeId = this._GstReportService.userForm.get('StoreId').value.StoreId
  
       setTimeout(() => {
       
         this._GstReportService.getpurchasereturndatewiseReport(
          this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",storeId
         ).subscribe(res => {
           const dialogRef = this._matDialog.open(PdfviewerComponent,
             {
               maxWidth: "85vw",
               height: '750px',
               width: '100%',
               data: {
                 base64: res["base64"] as string,
                 title: "Purchase Return Date Wise  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
           });
         });
   
       }, 100);
     }

     viewgetSalesGstreportPdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId =this._loggedUser.currentUserValue.user.storeId;
      if (this._GstReportService.userForm.get('StoreId').value.StoreId)
        storeId = this._GstReportService.userForm.get('StoreId').value.StoreId
  
       setTimeout(() => {
       
         this._GstReportService.getSalesGstReport(
          this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",storeId
         ).subscribe(res => {
           const dialogRef = this._matDialog.open(PdfviewerComponent,
             {
               maxWidth: "85vw",
               height: '750px',
               width: '100%',
               data: {
                 base64: res["base64"] as string,
                 title: "Sales GST Report  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
           });
         });
   
       }, 100);
     }

     
     viewgetSalesGstdatewisereportPdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId =this._loggedUser.currentUserValue.user.storeId;
      if (this._GstReportService.userForm.get('StoreId').value.StoreId)
        storeId = this._GstReportService.userForm.get('StoreId').value.StoreId
  
       setTimeout(() => {
       
         this._GstReportService.getSalesGstdatewiseReport(
          this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
         ).subscribe(res => {
           const dialogRef = this._matDialog.open(PdfviewerComponent,
             {
               maxWidth: "85vw",
               height: '750px',
               width: '100%',
               data: {
                 base64: res["base64"] as string,
                 title: "Sales GST Date Wise Report  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
           });
         });
   
       }, 100);
     }

     
     viewgetSalesreturngstPdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId =this._loggedUser.currentUserValue.user.storeId;
      if (this._GstReportService.userForm.get('StoreId').value.StoreId)
        storeId = this._GstReportService.userForm.get('StoreId').value.StoreId
  
       setTimeout(() => {
       
         this._GstReportService.getSalesreturnReport(
          this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
         ).subscribe(res => {
           const dialogRef = this._matDialog.open(PdfviewerComponent,
             {
               maxWidth: "85vw",
               height: '750px',
               width: '100%',
               data: {
                 base64: res["base64"] as string,
                 title: "SalesReturn Report  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
           });
         });
   
       }, 100);
     }

     viewgetSalesreturngstdatewisePdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId =this._loggedUser.currentUserValue.user.storeId;
      if (this._GstReportService.userForm.get('StoreId').value.StoreId)
        storeId = this._GstReportService.userForm.get('StoreId').value.StoreId
  
       setTimeout(() => {
       
         this._GstReportService.getSalesreturndatewiseReport(
          this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
         ).subscribe(res => {
           const dialogRef = this._matDialog.open(PdfviewerComponent,
             {
               maxWidth: "85vw",
               height: '750px',
               width: '100%',
               data: {
                 base64: res["base64"] as string,
                 title: "Sales Return Date wise Report  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
           });
         });
   
       }, 100);
     }


     viewgetHSMCodewisePdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId =this._loggedUser.currentUserValue.user.storeId;
      if (this._GstReportService.userForm.get('StoreId').value.StoreId)
        storeId = this._GstReportService.userForm.get('StoreId').value.StoreId
  
       setTimeout(() => {
       
         this._GstReportService.getHSNcodewiseReport(
          this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
         ).subscribe(res => {
           const dialogRef = this._matDialog.open(PdfviewerComponent,
             {
               maxWidth: "85vw",
               height: '750px',
               width: '100%',
               data: {
                 base64: res["base64"] as string,
                 title: "HSN Code Report  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
           });
         });
   
       }, 100);
     }


     
     viewgetGSTB2CsPdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId =this._loggedUser.currentUserValue.user.storeId;
      if (this._GstReportService.userForm.get('StoreId').value.StoreId)
        storeId = this._GstReportService.userForm.get('StoreId').value.StoreId
  
       setTimeout(() => {
       
         this._GstReportService.geGSTB2cReport(
          this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
         ).subscribe(res => {
           const dialogRef = this._matDialog.open(PdfviewerComponent,
             {
               maxWidth: "85vw",
               height: '750px',
               width: '100%',
               data: {
                 base64: res["base64"] as string,
                 title: "GST B2C Report  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
           });
         });
   
       }, 100);
     }

     

     viewgeGSTRAZpurchasePdf() {
      debugger
      this.sIsLoading = 'loading-data';
   
      let storeId =this._loggedUser.currentUserValue.user.storeId;
      if (this._GstReportService.userForm.get('StoreId').value.StoreId)
        storeId = this._GstReportService.userForm.get('StoreId').value.StoreId
  
       setTimeout(() => {
       
         this._GstReportService.geGSTRAZPurchaseReport(
          this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",storeId
         ).subscribe(res => {
           const dialogRef = this._matDialog.open(PdfviewerComponent,
             {
               maxWidth: "85vw",
               height: '750px',
               width: '100%',
               data: {
                 base64: res["base64"] as string,
                 title: "GST RAZ Purchase Report  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
           });
         });
   
       }, 100);
     }

     viewgeGSTRAZsuppwelierwisepurchasePdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId =this._loggedUser.currentUserValue.user.storeId;
      if (this._GstReportService.userForm.get('StoreId').value.StoreId)
        storeId = this._GstReportService.userForm.get('StoreId').value.StoreId
  
       setTimeout(() => {
       
         this._GstReportService.geGSTR2ASupplierwiseReport(
          this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",storeId
         ).subscribe(res => {
           const dialogRef = this._matDialog.open(PdfviewerComponent,
             {
               maxWidth: "85vw",
               height: '750px',
               width: '100%',
               data: {
                 base64: res["base64"] as string,
                 title: "GST RAZ Supplier wise Report  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
           });
         });
   
       }, 100);
     }

  GetUserList() {
    var data = {
          "StoreId": this._loggedUser.currentUserValue.user.storeId
        }
    this._GstReportService.getUserdetailList(data).subscribe(data => {
      this.UserList = data;
      if (this.UserId) {
        const ddValue = this.UserList.filter(c => c.UserId == this.UserId);
        this._GstReportService.userForm.get('UserId').setValue(ddValue[0]);
        this._GstReportService.userForm.updateValueAndValidity();
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

  // gePharStoreList() {
   
  //   this._GstReportService.getStoreList().subscribe(data => {
  //     this.StoreList = data;
  //     // this._BrowsSalesBillService.userForm.get('StoreId').setValue(this.StoreList[0]);

  //   });
  // }

  getOptionTextsearchstore(option) {
    return option && option.StoreName ? option.StoreName : '';
  }

  gePharStoreList() {
    this._GstReportService.getStoreList().subscribe(data => {
      this.StoreList = data;
      this.optionsSearchstore = this.StoreList.slice();
      this.filteredOptionsstore = this._GstReportService.userForm.get('StoreId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSearchstore(value) : this.StoreList.slice()),
      );
    });
  }

  private _filterSearchstore(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
      return this.optionsSearchstore.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    }

  }

  onClose(){}
}
