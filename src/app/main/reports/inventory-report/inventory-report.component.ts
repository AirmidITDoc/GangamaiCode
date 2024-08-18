import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OPReportsService } from '../op-reports/opreports.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ReportDetail } from '../common-report/common-report.component';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InventoryReportComponent implements OnInit {

  UserId:any=0;
  UserName:any=''
  UserList:any=[];
  StoreList:any=[];
  filteredOptionsUser: Observable<string[]>;
  isUserSelected: boolean = false;
  FlagUserSelected: boolean = false;
  FlagDoctorSelected: boolean = false;
  FlagBillNoSelected: boolean = false;
  ReportName: any;
  SpinLoading: boolean = false;
  sIsLoading: string = '';
  ReportID:any=0

  filteredOptionsstore: Observable<string[]>;
  filteredOptionsstore1: Observable<string[]>;
  isSearchstoreSelected: boolean = false;
  isSearchstore1Selected: boolean = false;
  FlagStoreSelected: boolean = false;
  FlagStore1Selected: boolean = false;
  optionsSearchstore: any[] = [];
  filteredOptionssupplier:any;
  noOptionFoundsupplier:any;
  isSupplierIdSelected:boolean=false;
  FlagSupplierSelected: boolean = false;
  FlagnonmovedaySelected: boolean = false;
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
    this.GetUserList();
    this.gePharStoreList();
    
    this.filteredOptionsUser = this._OPReportsService.userForm.get('UserId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterUser(value)),

    );
  }

  bindReportData() {
   var data={
  ReportSection:'Inventory Reports'
  }
    this._OPReportsService.getDataByQuery(data).subscribe(data => {
      this.dataSource.data = data as any[];

    });
  }

  
  getOptionTextsearchstore1(option) {
    return option && option.StoreName ? option.StoreName : '';
  }
  getOptionTextsearchstore(option) {
    return option && option.StoreName ? option.StoreName : '';
  }

  gePharStoreList() {
    this._OPReportsService.getStoreList().subscribe(data => {
      this.StoreList = data;
      this.optionsSearchstore = this.StoreList.slice();
      this.filteredOptionsstore = this._OPReportsService.userForm.get('StoreId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSearchstore(value) : this.StoreList.slice()),
      );
      this.filteredOptionsstore1 = this._OPReportsService.userForm.get('StoreId1').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSearchstore1(value) : this.StoreList.slice()),
      );
    });
  }

  private _filterSearchstore(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
      return this.optionsSearchstore.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    }

  }
  private _filterSearchstore1(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
      return this.optionsSearchstore.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    }

  }

  ReportSelection(el) {
    this.ReportName = el.ReportName;
    this.ReportID = el.ReportId;
    //Inventory
    if (this.ReportName == 'Item List') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }else if (this.ReportName == 'Supplier List') {
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
      this.FlagStoreSelected=true
      this.FlagSupplierSelected = true;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
    } 
    else if (this.ReportName == 'GRN Return Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = true;
      this.FlagBillNoSelected=false;
      this.FlagStoreSelected=true
      this.FlagSupplierSelected=true
    }
    else if (this.ReportName == 'GRN Report - NABH') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
      this.FlagStoreSelected=true
    }
    //  else if (this.ReportName == 'Monthly Purchase(GRN) Report') {
    //   this.FlagBillNoSelected = true;
    //   this.FlagUserSelected = false;
    //   this.FlagDoctorSelected = false;

    // }
    else if (this.ReportName == 'GRN Wise Product Qty Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
      this.FlagStoreSelected=true
      this.FlagSupplierSelected=true
    }
    else if (this.ReportName == 'GRN Purchase Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
      this.FlagStoreSelected=true
    }
     else if (this.ReportName == 'Supplier Wise GRN List') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected=true
      this.FlagSupplierSelected=true
    }
    else if (this.ReportName == 'Issue To Department') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
      this.FlagStoreSelected=true
      this.FlagStore1Selected=true
    }
    else if (this.ReportName == 'Issue To Department Item Wise') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
    }
     else if (this.ReportName == 'Return From Department') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Purchase Order') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
      this.FlagStoreSelected=true
    }
    else if (this.ReportName == 'Material Consumption Monthly Summary') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
      this.FlagStore1Selected=true
      this.FlagStoreSelected=true
    }
     else if (this.ReportName == 'Material Consumption') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Item Expiry Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
    }
     else if (this.ReportName == 'Current Stock Report') {
      this.FlagBillNoSelected = true;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Closing Current Stock Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
    }
     else if (this.ReportName == 'Item Wise Supplier List') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;

    }
    else if (this.ReportName == 'Current Stock Date Wise') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
    }
     else if (this.ReportName == 'Non-Moving Item List') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStore1Selected=true;
      this.FlagnonmovedaySelected=true;
    }
    else if (this.ReportName == 'Non-Moving Item Without Batch List') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected=true;
      this.FlagnonmovedaySelected=true;
    }
    else if (this.ReportName == 'Patient Wise Material Consumption') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
      this.FlagStoreSelected=false;
      this.FlagSupplierSelected=false;
    }
     else if (this.ReportName == 'Last Purchase Rate Wise Consumtion') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected=false;
      this.FlagSupplierSelected=false;
    }
    else if (this.ReportName == 'Item Count') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
      this.FlagStoreSelected=true;
      this.FlagSupplierSelected=false;
    }
     else if (this.ReportName == 'Supplier Wise Debit Credit Note') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected=true;
      this.FlagSupplierSelected=true;

    }   else if (this.ReportName == 'Stock Adjustment Report') {
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagBillNoSelected=false;
      this.FlagStore1Selected=false;
      this.FlagSupplierSelected=false;
    }
     else if (this.ReportName == 'Purchase Wise GRN Summary') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStore1Selected=false;
      this.FlagStoreSelected=false;
      this.FlagSupplierSelected=false;
    }

  }


  getPrint() {
   
    if (this.ReportName == 'Item List') {
      this.viewItemListPdf();
    } else if (this.ReportName == 'Supplier List') {
      this.viewSupplierListPdf();
    } 
    else if (this.ReportName == 'Indent Report') {
      this.viewgetIndentPdf();
    }
    else if (this.ReportName == 'Monthly Purchase(GRN) Report') {
      this.viewgetMonthlypurchaseGrnPdf();
    }
    else if (this.ReportName == 'GRN Report') {
      this.viewgetGRNReportPdf();
    } 
    else if (this.ReportName == 'GRN Report - NABH') {
      this.viewgetGRNReportNABHPdf();
    } 
    else if (this.ReportName == 'GRN Return Report') {
      this.viewgetGRNReturnReportPdf();
    } 
   else if (this.ReportName == 'GRN Wise Product Qty Report') {
      this.viewGRNwiseprodqtyPdf();
    } 
    else if (this.ReportName == 'GRN Purchase Report') {
      this.viewGRNpurchasereportPdf();
    } 
    else if (this.ReportName == 'Supplier Wise GRN List') {
      this.viewSupplierwiseGRNreportPdf();
    } 
    else if (this.ReportName == 'Issue To Department') {
    
      this.viewgetIssuetodeptPdf();
    }
    else if (this.ReportName == 'Issue To Department Item Wise') {
    
      this.viewgetIssuetodeptitemwisePdf();
    }
    else if (this.ReportName == 'Material Consumption Monthly Summary') {
      this.viewMaterialconsumptionmonthlysummaryPdf();
      
    }
    else if (this.ReportName == 'Current Stock Date Wise') {
      this.viewCurrentstockdatewisePdf();
      
    }
    else if (this.ReportName == 'Item Expiry Report') {
      this.viewgetItemexpiryPdf();
      
    }
    else if (this.ReportName == 'Current Stock Report') {
      this.viewgetCurrentStockPdf();
      
    }
     else if (this.ReportName == 'Non-Moving Item List') {
      this.viewNonMovingItemPdf();
    } 
   
     else if (this.ReportName == 'Material Consumption') {
      this.viewgetMaterialConsumptionPdf();
    } 
   
    else if (this.ReportName == 'Return From Department') {
      this.viewgetReturnfromdeptPdf();
    } 
   
    else if (this.ReportName == 'Patient Wise Material Consumption') {
      this.viewgetMaterialConsumptionPdf();
    } 
    
    else if (this.ReportName == 'Purchase Order') {
      this.viewgetItemwisePurchasePdf();
    }  else if (this.ReportName == 'Purchase Wise GRN Summary') {
      this.viewgetPurchasewisegrnsummaryPdf();
    }  else if (this.ReportName == 'Stock Adjustment Report') {
      this.viewgetStockadjustmentPdf();
    }  else if (this.ReportName == 'Supplier Wise Debit Credit Note') {
      this.viewgetSupplierwisedebitcardnotePdf();
    } else if (this.ReportName == 'Item Wise Supplier List') {
      this.viewgetItemwisesupplierlistPdf();
    } else if (this.ReportName == 'Non-Moving Item Without Batch List') {
      this.viewgetnonmoveItemwithoutbatchPdf();
    } else if (this.ReportName == 'Last Purchase Rate Wise Consumtion') {
      this.viewgetLastpurchasewiseconsumptionPdf();
    }  else if (this.ReportName == 'Item Count') {
      this.viewgetItemcountPdf();
    } 



  }


  
  //inventory

  viewItemListPdf() {
    debugger
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
   
    this._OPReportsService.getItemlistReport(
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
            title: "Item List report Viewer"
          }
        });
  
        matDialog.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.sIsLoading = ' ';
        });
    });
   
    },100);
  
  }
  
  
  viewSupplierListPdf() {
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
   
    this._OPReportsService.getSupplierlistReport(
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
            title: "Supplier List report Viewer"
          }
        });
  
        matDialog.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.sIsLoading = ' ';
        });
    });
   
    },100);
  
  }

  viewgetMonthlypurchaseGrnPdf() {
    this.sIsLoading = 'loading-data';
 
     setTimeout(() => {
     
       this._OPReportsService.getMonthlypurchaseGRNReport(
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
               title: "Monthly Purchase GRN Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }

   
   viewgetGRNReportNABHPdf() {
    let StoreId =0

    if (this._OPReportsService.userForm.get('StoreId').value)
     StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
    
     setTimeout(() => {
     
       this._OPReportsService.getGRNReportNABH(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
      this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",StoreId
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: " GRN Report NABH  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }

   

   viewgetGRNReturnReportPdf() {
    this.sIsLoading = 'loading-data';
    let StoreId =0

    if (this._OPReportsService.userForm.get('StoreId').value)
     StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
    
    let SupplierId =0

    if (this._OPReportsService.userForm.get('SupplierName').value)
      SupplierId = this._OPReportsService.userForm.get('SupplierName').value.SupplierId
    
     setTimeout(() => {
     
       this._OPReportsService.getGRNReturnReport(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
      this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",StoreId,SupplierId
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: " GRN Return Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }

   
   viewGRNwiseprodqtyPdf() {
    this.sIsLoading = 'loading-data';
    
    let StoreId =0

    if (this._OPReportsService.userForm.get('StoreId').value)
     StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
    
    let SupplierId =0

    if (this._OPReportsService.userForm.get('SupplierName').value)
      SupplierId = this._OPReportsService.userForm.get('SupplierName').value.SupplierId
    
     setTimeout(() => {
     
       this._OPReportsService.getGRNwiseprodqtyReport(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
      this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",StoreId,SupplierId
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "GRN Wise Product Qty Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }

   

   viewGRNpurchasereportPdf() {
    this.sIsLoading = 'loading-data';
    let StoreId =0

    if (this._OPReportsService.userForm.get('StoreId').value)
     StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
    
     setTimeout(() => {
     
       this._OPReportsService.getGRNpurchaseReport(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
      this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",StoreId
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "GRN Purchase Order Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }


   
   viewSupplierwiseGRNreportPdf() {
    this.sIsLoading = 'loading-data';
 
    let StoreId =0

    if (this._OPReportsService.userForm.get('StoreId').value)
     StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
    
    let SupplierId =0

    if (this._OPReportsService.userForm.get('SupplierName').value)
      SupplierId = this._OPReportsService.userForm.get('SupplierName').value.SupplierId
    
     setTimeout(() => {
     
       this._OPReportsService.getSupplierwiseGRNReport(StoreId,SupplierId,
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
               title: "Supplier Wise GRN  Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }

   

   viewgetIssuetodeptitemwisePdf() {
    this.sIsLoading = 'loading-data';
    let StoreId =0

    if (this._OPReportsService.userForm.get('StoreId').value)
     StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
    
    let StoreId1 =0

    if (this._OPReportsService.userForm.get('StoreId1').value)
      StoreId1 = this._OPReportsService.userForm.get('StoreId1').value.StoreId
    
     setTimeout(() => {
     
       this._OPReportsService.getIssuetodeptitemwiseReport(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",StoreId,StoreId1,0
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Issue To Department Item Wise Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }
   
   

   viewMaterialconsumptionmonthlysummaryPdf() {
    this.sIsLoading = 'loading-data';
   
    let StoreId1 =0

    if (this._OPReportsService.userForm.get('StoreId1').value)
     StoreId1 = this._OPReportsService.userForm.get('StoreId1').value.StoreId
    
     setTimeout(() => {
     
       this._OPReportsService.getMaterialconsumptionmonthsummaryReport(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",StoreId1
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Material Consumption Monthly Summary Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }

   viewCurrentstockdatewisePdf() {
    this.sIsLoading = 'loading-data';
    let StoreId =0

   if (this._OPReportsService.userForm.get('StoreId').value)
    StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
   
     setTimeout(() => {
     
       this._OPReportsService.getCurrentstockdatewiseReport(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        StoreId,
         this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
           this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900"
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Current Stock Date Wise Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }
   viewgetItemexpiryPdf() {
   let ExpMonth =0
   let ExpYear =0
   let StoreId =0

   if (this._OPReportsService.userForm.get('StoreId').value)
    StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
   


    this.sIsLoading = 'loading-data';
   
     setTimeout(() => {
     
       this._OPReportsService.getItemExpirylistReport(
        ExpMonth,ExpYear,StoreId,
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
               title: "Item Expiry Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }

   
   viewgetCurrentStockPdf() {
 
     this.sIsLoading = 'loading-data';
    
      setTimeout(() => {
      
        this._OPReportsService.getCurrentstocklistReport(
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
                title: "Current Stock Report  Viewer"
              }
            });
          dialogRef.afterClosed().subscribe(result => {
            
            this.sIsLoading = '';
          });
        });
  
      }, 100);
    }
   viewNonMovingItemPdf() {
    this.sIsLoading = 'loading-data';
   let NonMovingDay =0
   let StoreId =0

   if (this._OPReportsService.userForm.get('StoreId').value)
    StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
 

   if (this._OPReportsService.userForm.get('NonMoveday').value)
    NonMovingDay = this._OPReportsService.userForm.get('NonMoveday').value
   
     setTimeout(() => {
     
       this._OPReportsService.getNonmovinglistReport(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
         this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900" ,
        NonMovingDay,StoreId
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Non Moving Item List Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }

   viewgetnonmoveItemwithoutbatchPdf() {
    this.sIsLoading = 'loading-data';
   let NonMovingDay =0
   let StoreId =0

   if (this._OPReportsService.userForm.get('StoreId').value)
    StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
 

   if (this._OPReportsService.userForm.get('NonMoveday').value)
    NonMovingDay = this._OPReportsService.userForm.get('NonMoveday').value
   
     setTimeout(() => {
     
       this._OPReportsService.getNonmovingitemwithoutbatchlistReport(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
         this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900" ,
        NonMovingDay,StoreId
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Non Moving Item Without Batch List Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }


   viewgetIndentPdf() {
    this.sIsLoading = 'loading-data';
   
     setTimeout(() => {
     
       this._OPReportsService.getIndentlistReport(
         this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
      this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",0,0
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Indent List Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }
 
   
   viewgetGRNReportPdf() {
    let StoreId =0

    if (this._OPReportsService.userForm.get('StoreId').value)
     StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
    
    let SupplierId =0

    if (this._OPReportsService.userForm.get('SupplierName').value)
      SupplierId = this._OPReportsService.userForm.get('SupplierName').value.SupplierId
    

    setTimeout(() => {
      this.SpinLoading = true;
      this._OPReportsService.getGRNReportlist(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",StoreId,SupplierId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '850px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "GRN REPORT Viewer"
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

    }, 100);
  }

  viewgetIssuetodeptPdf() {
   
    let StoreId =0

    if (this._OPReportsService.userForm.get('StoreId').value)
     StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
    
    let StoreId1 =0

    if (this._OPReportsService.userForm.get('StoreId1').value)
      StoreId1 = this._OPReportsService.userForm.get('StoreId1').value.StoreId
    
     this.sIsLoading = 'loading-data';
    
      setTimeout(() => {
      
        this._OPReportsService.getIssuetodeptlistReport(
            this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
           this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",StoreId,StoreId1,0
        ).subscribe(res => {
          const dialogRef = this._matDialog.open(PdfviewerComponent,
            {
              maxWidth: "85vw",
              height: '750px',
              width: '100%',
              data: {
                base64: res["base64"] as string,
                title: "Issue To Department Report  Viewer"
              }
            });
          dialogRef.afterClosed().subscribe(result => {
            
            this.sIsLoading = '';
          });
        });
  
      }, 100);
    }

    
   viewgetReturnfromdeptPdf() {
    this.sIsLoading = 'loading-data';
    let StoreId =0

    if (this._OPReportsService.userForm.get('StoreId').value)
     StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
    
    let StoreId1 =0

    if (this._OPReportsService.userForm.get('StoreId1').value)
      StoreId1 = this._OPReportsService.userForm.get('StoreId1').value.StoreId
    
     setTimeout(() => {
     
       this._OPReportsService.getReturnfromdeptlistReport(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",StoreId,StoreId1,
       ).subscribe(res => {
         const dialogRef = this._matDialog.open(PdfviewerComponent,
           {
             maxWidth: "85vw",
             height: '750px',
             width: '100%',
             data: {
               base64: res["base64"] as string,
               title: "Return From Department Report  Viewer"
             }
           });
         dialogRef.afterClosed().subscribe(result => {
           
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }
   viewgetMaterialConsumptionPdf() {
    this.sIsLoading = 'loading-data';
   let MaterialConsumptionId=0
     setTimeout(() => {
     
       this._OPReportsService.getMaterialConsumptionlistReport(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",0
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
           
           this.sIsLoading = '';
         });
       });
 
     }, 100);
   }
 
  
  viewgetItemwisePurchasePdf() {
    let StoreId =0

    if (this._OPReportsService.userForm.get('StoreId').value)
     StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
    
    let SupplierId =0

    if (this._OPReportsService.userForm.get('SupplierName').value)
      SupplierId = this._OPReportsService.userForm.get('SupplierName').value.SupplierId
    
    setTimeout(() => {
      this.SpinLoading = true;
      this._OPReportsService.getItemwisepurchaseview(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900" ,SupplierId,StoreId
        
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '850px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Item Wise Purchase Viewer"
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

    }, 100);
  }

  

  viewgetItemcountPdf() {
    let ItemId=0
    let StoreId =0

    if (this._OPReportsService.userForm.get('StoreId1').value)
     StoreId = this._OPReportsService.userForm.get('StoreId1').value.StoreId
    
  
    setTimeout(() => {
      this.SpinLoading = true;
      this._OPReportsService.getItemcountlistview(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900" ,ItemId,StoreId
        
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '850px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Item Wise Count Viewer"
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

    }, 100);
  }
  viewgetItemwisesupplierlistPdf() {
    let ItemId=0
    let StoreId =0

    if (this._OPReportsService.userForm.get('StoreId').value)
     StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
    
    let SupplierId =0

    if (this._OPReportsService.userForm.get('SupplierName').value)
      SupplierId = this._OPReportsService.userForm.get('SupplierName').value.SupplierId
    
    setTimeout(() => {
      this.SpinLoading = true;
      this._OPReportsService.getItemwisesupplierlistview(SupplierId,StoreId,ItemId,
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900" 
        
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '850px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Item Wise Purchase Viewer"
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

    }, 100);
  }

  viewgetLastpurchasewiseconsumptionPdf() {
    let ItemId=0
   
    setTimeout(() => {
      this.SpinLoading = true;
      this._OPReportsService.getLastpurchasewiseconsumptionview(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",ItemId, 
        
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '850px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Last Purchase Wise Consumption Viewer"
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

    }, 100);
  }
  viewgetPurchasewisegrnsummaryPdf() {
    
    setTimeout(() => {
      this.SpinLoading = true;
      this._OPReportsService.getpurchasewisesummaryview(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900" 
        
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '850px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Purchase Wise Summary  Viewer"
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

    }, 100);
  }

  
  
  viewgetStockadjustmentPdf() {
    let StoreId =0

    if (this._OPReportsService.userForm.get('StoreId1').value)
     StoreId = this._OPReportsService.userForm.get('StoreId1').value.StoreId
    
    setTimeout(() => {
      this.SpinLoading = true;
      this._OPReportsService.getStockadjustmentview(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",StoreId
        
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '850px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Stock Adjustment Viewer"
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

    }, 100);
  }

  
  
  viewgetSupplierwisedebitcardnotePdf() {
    let StoreId =0

    if (this._OPReportsService.userForm.get('StoreId').value)
     StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
    
    let SupplierId =0

    if (this._OPReportsService.userForm.get('SupplierName').value)
      SupplierId = this._OPReportsService.userForm.get('SupplierName').value.SupplierId
    

    setTimeout(() => {
      this.SpinLoading = true;
      this._OPReportsService.getSupplierwisedebitcardnoteview(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",SupplierId,StoreId
        
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '850px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Supplier Wise Debit Note Viewer"
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

    }, 100);
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


  getSuppliernameList() {
    var m_data = {
      'SupplierName': `${this._OPReportsService.userForm.get('SupplierName').value}%`
    }
    this._OPReportsService.getSupplierList(m_data).subscribe(data => {
      this.filteredOptionssupplier = data;
      if (this.filteredOptionssupplier.length == 0) {
        this.noOptionFoundsupplier = true;
      } else {
        this.noOptionFoundsupplier = false;
      }
    })
  }
  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';
  }
  onClose(){}

}
