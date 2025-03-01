import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { ReportDetail } from '../common-report/common-report.component';
import { OPReportsService } from '../op-reports/opreports.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  filteredOptionssearchDoctor: Observable<string[]>;
  isUserSelected: boolean = false;
  isSearchstoreSelected: boolean = false;
  FlagStoreSelected: boolean = false;
  FlagDoctorIDSelected: boolean = false;
  FlagUserSelected: boolean = false;
  FlagReportTypeSelected: boolean = false;
  ReportName: any;
  SpinLoading: boolean = false;
  sIsLoading: string = '';
  ReportID:any=0
  DoctorList: any = [];
  optionsSurgeon: any[] = [];
  searchFormGroup: FormGroup;  
  DoctoreListfilteredOptions: any;  
  noOptionFound: boolean = false;
  PatientListfilteredOptions: any;
  isPatientSelected: boolean = false;
  FlagPatientSelected:boolean=false;
  RegId:any;
  StoreId:any;
  PatientName: any = '';
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
    this.getDoctorList();
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
    console.log(el)
     this.ReportName = el.ReportName;
     this.ReportID = el.ReportId;
     
     if (this.ReportName == 'Sales Profit Summary Report') {
      this.FlagStoreSelected = true;
     }else if (this.ReportName == 'Sales Profit Bill Report') {
       this.FlagStoreSelected = true;
       this.FlagUserSelected = false;
       this.FlagReportTypeSelected= false;
       this.FlagDoctorIDSelected=false;
      this.FlagPatientSelected=true;
       this.clearField();
     }
     else if (this.ReportName == 'Sales Profit Item Wise Summary Report') {
       this.FlagUserSelected = false;
       this.FlagStoreSelected = true;
       this.FlagReportTypeSelected= false;
       this.FlagDoctorIDSelected=false;
      this.FlagPatientSelected=false;
       this.clearField();
     } 
   
     else if (this.ReportName == 'Purchase GST Report Supplier Wise-GST%') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
      this.FlagDoctorIDSelected=false;
      this.FlagPatientSelected=false;
             this.clearField();
    } 
    else if (this.ReportName == 'Purchase GST Report Supplier Wise-Without GST%') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= true;
      this.FlagDoctorIDSelected=false;
      this.FlagPatientSelected=false;
             this.clearField();
    } 
    else if (this.ReportName == 'Purchase GST Report Date Wise') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= true;
      this.FlagDoctorIDSelected=false;      
      this.FlagPatientSelected=false;
      this.clearField();
    } 
    else if (this.ReportName == 'Purchase GST Report - Summary') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
      this.FlagDoctorIDSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
    } 
    else if (this.ReportName == 'Purchase Retum GST Report Date Wise') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
      this.FlagDoctorIDSelected=false;
      this.FlagPatientSelected=false; 
             this.clearField();
    } 
    else if (this.ReportName == 'Purchase Return GST Report - Summary') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
      this.FlagDoctorIDSelected=false;
      this.FlagPatientSelected=false; 
             this.clearField();
    } 
    else if (this.ReportName == 'Purchase GST Summary') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
      this.FlagDoctorIDSelected=false;
      this.FlagPatientSelected=false;
             this.clearField();
    } 
    else if (this.ReportName == 'Sales GST Report') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= true;
      this.FlagDoctorIDSelected=false;
      this.FlagPatientSelected=false; 
             this.clearField();
    } 
    else if (this.ReportName == 'Sales GST Date Wise Report') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
      this.FlagDoctorIDSelected=false;
      this.FlagPatientSelected=false;
             this.clearField();
    } 
    else if (this.ReportName == 'Sales Return GST Report') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= true;
      this.FlagDoctorIDSelected=false;
      this.FlagPatientSelected=false;
             this.clearField();
    } 
    else if (this.ReportName == 'Sales Return GST Date Wise Report') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= true;
      this.FlagDoctorIDSelected=false;   
      this.FlagPatientSelected=false;   
      this.clearField();
    } 
    else if (this.ReportName == 'Sales GST Summary Consolidated') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
      this.FlagDoctorIDSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
      
    } 
    else if (this.ReportName == 'HSN Code Wise Report') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
      this.FlagDoctorIDSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
    } 
    else if (this.ReportName == 'GST B2CS Report') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
      this.FlagDoctorIDSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
    } 
    else if (this.ReportName == 'GST B2GS Report Consolidated') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
      this.FlagDoctorIDSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
    }   else if (this.ReportName == 'GSTR2A Purchase Report') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
      this.FlagDoctorIDSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
    } 
    else if (this.ReportName == 'GSTR2A Supplier Wise Purchase Report') {
      this.FlagUserSelected = false;
      this.FlagStoreSelected = true;
      this.FlagReportTypeSelected= false;
      this.FlagDoctorIDSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
    }
    else if(this.ReportName == "Dr Wise Profit Detail Report"){
      this.FlagUserSelected = false;
      this.FlagStoreSelected = false;
      this.FlagReportTypeSelected= false;
      this.FlagDoctorIDSelected=true;
      this.FlagPatientSelected=false;
      this.clearField();
    } 
    else if(this.ReportName == "Dr Wise Profit Summary Report"){
      this.FlagUserSelected = false;
      this.FlagStoreSelected = false;
      this.FlagReportTypeSelected= false;
      this.FlagDoctorIDSelected=true;
      this.FlagPatientSelected=false;
      this.clearField();
    } 
    }


    getPrint() {
   debugger
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
      this.viewpurchasereport();
     } 
     else if (this.ReportName == 'Purchase GST Report Date Wise') {
      this.viewgetpurchasegstdatewisePdf();
     } 
     else if (this.ReportName == 'Purchase GST Report - Summary') {
      this.viewgetpurchasegstsummaryPdf();
     } 
     else if (this.ReportName == 'Purchase Retum GST Report Date Wise') {
      this.viewgetpurchasereturngstdatewisePdf();
     } 
     else if (this.ReportName == 'Purchase Return GST Report - Summary') {
      this.viewgetpurchasereturnsummaryPdf();
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
    //  this.viewgetSalesreturngstPdf();

      this.viewsalesgstreturn();
     } 
    //  else if (this.ReportName == 'Sales Return GST Date Wise Report') {
    //   //this.viewgetSalesreturngstdatewisePdf();

    //   this.viewsalesgstreturn();
    //  } 
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
     else if (this.ReportName == "Dr Wise Profit Detail Report"){
      this.DrWiseProfitDetailReport();
     }
     else if (this.ReportName == "Dr Wise Profit Summary Report"){
      this.DrWiseProfitSummeryReport();
     }

    }


    viewSalesprofitsummaryPdf() {
      debugger
      // let storeId=0;
      // if (this._GstReportService.userForm.get('StoreId').value.StoreId)
      //   storeId = this._GstReportService.userForm.get('StoreId').value.StoreId
      let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }
  
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
            this.clearField();
          });
      });
     
      },100);
    
    }
    
    
    viewsalesprofitbillPdf() {
      debugger
      this.sIsLoading = 'loading-data';

      // let storeId =this._loggedUser.currentUserValue.user.storeId;
      // if (this._GstReportService.userForm.get('StoreId').value.StoreId)
      //   storeId = this._GstReportService.userForm.get('StoreId').value.StoreId

      let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }

      let regId =0;
      if (this.RegId){
        regId = this.RegId
      }
  
  
      setTimeout(() => {
     
      this._GstReportService.getSalesprofitbillReport(
        this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
        storeId,regId
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
            this.clearField();
          });
      });
     
      },100);
    
    }
  
    viewgetprofititemwisesummaryPdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }
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
             this.clearField();
           });
         });
   
       }, 100);
     }
  
     viewgetpurchasesupplierwisegstPdf() {
      debugger
      this.sIsLoading = 'loading-data';
   
      let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }
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
             this.clearField();
           });
         });
   
       }, 100);
     }
     
     viewpurchasereport(){
      if(this._GstReportService.userForm.get("ReportType").value=='0')
        this.viewgetpurchasesupplierwisewithoutgstdetailPdf()
      else
      this.viewgetpurchasesupplierwisewithoutgstsummaryPdf()
     }

     
     viewgetpurchasesupplierwisewithoutgstdetailPdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }
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
                 title: "Purchase Supplier Wise Without GST Report Detail Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
             this.clearField();
           });
         });
   
       }, 100);
     }

     viewgetpurchasesupplierwisewithoutgstsummaryPdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }
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
                 title: "Purchase Supplier Wise Without GST Report Summary Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
             this.clearField();
           });
         });
   
       }, 100);
     }
     viewgetpurchasegstdatewisePdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId=0;
      if(this.StoreId){
        storeId=this.StoreId
      }
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
             this.clearField();
           });
         });
   
       }, 100);
     }

     viewgetpurchasegstsummaryPdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }
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
             this.clearField();
           });
         });
   
       }, 100);
     }

     viewgetpurchasereturnsummaryPdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }
       setTimeout(() => {
       
         this._GstReportService.getpurchasereturngstsummaryReport(
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
                 title: "Purchase Return Summary  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
             this.clearField();
           });
         });
   
       }, 100);
     }

     viewgetpurchasereturngstdatewisePdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId=0;
      if(this.StoreId){
        storeId=this.StoreId
      }
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
                 title: "Purchase Return Date Wise Report"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
             this.clearField();
           });
         });
   
       }, 100);
     }

 

     viewgetSalesGstreportPdf() {
      this.sIsLoading = 'loading-data';
   debugger
   let storeId=0;
   if(this.StoreId){
     storeId=this.StoreId
   }
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
                 title: "Sales GST Detail Report  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
             this.clearField();
           });
         });
   
       }, 100);
     }

     
     viewgetSalesGstdatewisereportPdf() {
      this.sIsLoading = 'loading-data';
   debugger
   let storeId=0;
   if(this.StoreId){
     storeId=this.StoreId
   }
       setTimeout(() => {
       
         this._GstReportService.getSalesGstdatewiseReport(
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
                 title: "Sales GST Summary Report  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
           });
         });
   
       }, 100);
     }

     viewsalesgstreturn(){
      debugger
      if(this._GstReportService.userForm.get("ReportType").value=='0')
        this.viewgetSalesreturngstPdf()
      else
      this.viewgetSalesreturngstdatewisePdf()
     }


     viewgetSalesreturngstPdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }
       setTimeout(() => {
       
         this._GstReportService.getSalesreturnReport(
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
                 title: "SalesReturn Report  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
             this.clearField();
           });
         });
   
       }, 100);
     }

     viewgetSalesreturngstdatewisePdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }
       setTimeout(() => {
       
         this._GstReportService.getSalesreturndatewiseReport(
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
                 title: "Sales Return Date wise Report  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
             this.clearField();
           });
         });
   
       }, 100);
     }


     viewgetHSMCodewisePdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId=0;
      if(this.StoreId){
        storeId=this.StoreId
      }
       setTimeout(() => {
       
         this._GstReportService.getHSNcodewiseReport(
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
                 title: "HSN Code Report  Viewer"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
             this.clearField();
           });
         });
   
       }, 100);
     }


     
     viewgetGSTB2CsPdf() {
      this.sIsLoading = 'loading-data';
   
      let storeId=0;
      if(this.StoreId){
        storeId=this.StoreId
      }
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
             this.clearField();
           });
         });
   
       }, 100);
     }

     

     viewgeGSTRAZpurchasePdf() {
      debugger
      this.sIsLoading = 'loading-data';
   
      let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }
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
             this.clearField();
           });
         });
   
       }, 100);
     }

     viewgeGSTRAZsuppwelierwisepurchasePdf() {
      debugger
      this.sIsLoading = 'loading-data';
   
      let storeId=0;
      if(this.StoreId){
        storeId=this.StoreId
      }
       setTimeout(() => {
       
         this._GstReportService.geGSTR2ASupplierwiseReport(
          this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",storeId
         ).subscribe(res => {
          debugger
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
             this.clearField();
           });
         });
   
       }, 100);
     }

     DrWiseProfitDetailReport() {
      debugger
      this.sIsLoading = 'loading-data';
   
      let doctorId =0;
      if (this._GstReportService.userForm.get('DoctorId').value)
        doctorId = this._GstReportService.userForm.get('DoctorId').value.DoctorId
  
       setTimeout(() => {
       debugger
         this._GstReportService.geDrWiseProfitDetailReport(
          this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",doctorId
         ).subscribe(res => {
          debugger
           const dialogRef = this._matDialog.open(PdfviewerComponent,
             {
               maxWidth: "85vw",
               height: '750px',
               width: '100%',
               data: {
                 base64: res["base64"] as string,
                 title: "Dr Wise Profit Detail Report"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
             this.clearField();
           });
         });
   
       }, 100);
     }

     DrWiseProfitSummeryReport() {
      debugger
      this.sIsLoading = 'loading-data';
   
      let doctorId =0;
      if (this._GstReportService.userForm.get('DoctorId').value)
        doctorId = this._GstReportService.userForm.get('DoctorId').value.DoctorId
  
       setTimeout(() => {
       debugger
         this._GstReportService.geDrWiseProfitSummeryReport(
          this.datePipe.transform(this._GstReportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._GstReportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",doctorId
         ).subscribe(res => {
          debugger
           const dialogRef = this._matDialog.open(PdfviewerComponent,
             {
               maxWidth: "85vw",
               height: '750px',
               width: '100%',
               data: {
                 base64: res["base64"] as string,
                 title: "Dr Wise Profit Summary Report"
               }
             });
           dialogRef.afterClosed().subscribe(result => {
             
             this.sIsLoading = '';
             this.clearField();

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

  getOptionTextsearchDoctor(option){
    return option && option.Doctorname ? option.Doctorname : '';
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
  getSelectedPharobjNew(obj){
    console.log("storeId:",obj)
    this.StoreId=obj.StoreId;
  }

  clearField(){
    this._GstReportService.userForm.reset();
    this._GstReportService.userForm.get('startdate').setValue(new Date());
    this._GstReportService.userForm.get('enddate').setValue(new Date());
    this._GstReportService.userForm.get('DoctorId').setValue('');
    this._GstReportService.userForm.get('StoreId').setValue('');
    this._GstReportService.userForm.get('RegID').setValue('');
    this.RegId='';
    this.StoreId='';
  }

  getDoctorList() {
    debugger
    var m_data = {
      "Keywords": `${this._GstReportService.userForm.get('DoctorId').value}%`
    }
    console.log("ggggg:", m_data)
    this._GstReportService.getDoctorMaster(m_data).subscribe(data => {
      this.DoctorList = data;
      console.log(this.DoctorList)
      // this.DoctoreListfilteredOptions = data;
      this.optionsSurgeon = this.DoctorList.slice();
      this.filteredOptionssearchDoctor = this._GstReportService.userForm.get('DoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoctor(value) : this.DoctorList.slice()),
      );
    }); 

  }
  private _filterDoctor(value: any): string[] {
    debugger
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsSurgeon.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }
  
  getSearchList() {
    debugger
    var m_data = {
      "Keyword": `${this._GstReportService.userForm.get('RegID').value}%`
    }
    console.log(m_data)
    this._GstReportService.getPatientRegisterListSearch(m_data).subscribe(data => {
      this.PatientListfilteredOptions = data;
      if (this.PatientListfilteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    }); 
  } 

  getSelectedObjNew(obj) {
    console.log("djfhfka:",obj)
    this.RegId=obj.RegId;
    this.PatientName = obj.PatientName;
  } 

  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
}
  private _filterSearchstore(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
      return this.optionsSearchstore.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    }

  }

  onClose(){}
}
