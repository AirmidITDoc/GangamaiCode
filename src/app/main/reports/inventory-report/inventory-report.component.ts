import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OPReportsService } from '../op-reports/opreports.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ReportDetail } from '../common-report/common-report.component';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { fuseAnimations } from '@fuse/animations';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ConcessionReasonMasterModule } from 'app/main/setup/billing/concession-reason-master/concession-reason-master.module';


export interface MonthYear {
  value: string;
  viewValue: string;
}

const moment = _rollupMoment || _moment;

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'MM/YYYY',
//   },
//   display: {
//     dateInput: 'MM/YYYY',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };
@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    // { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
 
})
export class InventoryReportComponent implements OnInit {

  monthList: MonthYear[] = [
    {value: '1', viewValue: 'Jan'},
    {value: '2', viewValue: 'Feb'},
    {value: '3', viewValue: 'Mar'},
    {value: '4', viewValue: 'Apr'},
    {value: '5', viewValue: 'May'},
    {value: '6', viewValue: 'Jun'},
    {value: '7', viewValue: 'Jul'},
    {value: '8', viewValue: 'Aug'},
    {value: '9', viewValue: 'Sep'},
    {value: '10', viewValue: 'Oct'},
    {value: '11', viewValue: 'Nov'},
    {value: '12', viewValue: 'Dec'},
  ];

  UserId:any=0;
  UserName:any=''
  UserList:any=[];
  StoreList:any=[];
  StoreList1:any=[];

  ItemList:any=[];
  filteredOptionsUser: Observable<string[]>;
  isUserSelected: boolean = false;
  FlagUserSelected: boolean = false;
  FlagDoctorSelected: boolean = false;
  FlagBillNoSelected: boolean = false;
  FlagMonthSelected: boolean = false;
  ReportName: any;
  SpinLoading: boolean = false;
  sIsLoading: string = '';
  ReportID:any=0

  filteredOptionsstore: Observable<string[]>;
  filteredOptionsstore1: Observable<string[]>;
  isSearchstoreSelected: boolean = false;
  isSearchstore1Selected: boolean = false;
  isItemIdSelected: boolean = false;
  FlagStoreSelected: boolean = false;
  FlagDaterangeSelected: boolean = true;
  FlagStore1Selected: boolean = false;
  FlagItemSelected: boolean = false;
  FlagdrugtypeSelected: boolean = false;
  FlagReportTypeSelected: boolean = false;
  optionsSearchstore: any[] = [];
  optionsSearchstore1: any[] = [];
  optionsSearchItem: any[] = [];
  filteredOptionssupplier:any;
  noOptionFoundsupplier:any;
  isSupplierIdSelected:boolean=false;
  FlagSupplierSelected: boolean = false;
  FlagnonmovedaySelected: boolean = false;
  FlagIdSelected: boolean = false;
  filteredOptionsItem:any;



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
    this.getSearchItemList()
    this.filteredOptionsUser = this._OPReportsService.userForm.get('UserId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterUser(value)),

    );
  }
vYear:any=0;
vMonth:any=0;
vDay:any=0;
  Year = new FormControl(moment());
  date = new FormControl(moment());


  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.vYear=ctrlValue


    this.vYear=this.datePipe.transform(ctrlValue, "yyyy")
    console.log(this.vYear)
  }

  chosenMonthHandler(normalizedMonth: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    this.vMonth=ctrlValue
    console.log(this.vMonth)
  }



  onEntermonth(event){
    this.vMonth=event.value
console.log(event.value)
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
      this.StoreList1 = data;
      this.optionsSearchstore = this.StoreList.slice();
      this.optionsSearchstore1 = this.StoreList.slice();
      this.filteredOptionsstore = this._OPReportsService.userForm.get('StoreId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSearchstore(value) : this.StoreList.slice()),
      );
      this.filteredOptionsstore1 = this._OPReportsService.userForm.get('StoreId1').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSearchstore1(value) : this.StoreList1.slice()),
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
      return this.optionsSearchstore1.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    }

  }

  ReportSelection(el) {
    this.ReportName = el.ReportName;
    this.ReportID = el.ReportId;
    //Inventory
    if (this.ReportName == 'Item List') {
      
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = false;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
      this.FlagDaterangeSelected=true;
    }else if (this.ReportName == 'Supplier List') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = false;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = true;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagDaterangeSelected=false;
      this.FlagReportTypeSelected= false;
    }
    else if (this.ReportName == 'Indent Report') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = true;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
      this.FlagDaterangeSelected=true;
    } 
    else if (this.ReportName == 'Monthly Purchase(GRN) Report') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = false;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
      this.FlagDaterangeSelected=true;
    } 
     
    else if (this.ReportName == 'GRN Report') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= true;
      this.FlagDaterangeSelected=true;
    } 
    else if (this.ReportName == 'GRN Return Report') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = true;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
      this.FlagDaterangeSelected=true;
    }
    else if (this.ReportName == 'GRN Report - NABH') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = true;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
      this.FlagDaterangeSelected=true;
    }
    
    else if (this.ReportName == 'GRN Wise Product Qty Report') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
      this.FlagDaterangeSelected=true;
    }
    else if (this.ReportName == 'GRN Purchase Report') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
    }
     else if (this.ReportName == 'Supplier Wise GRN List') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = true;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
    }
    else if (this.ReportName == 'Issue To Department') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = true;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=true;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
    }
    else if (this.ReportName == 'Issue To Department Item Wise') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = true;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=true;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
    }
     else if (this.ReportName == 'Return From Department') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = true;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
    }
    else if (this.ReportName == 'Purchase Order') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = true;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
    }
    else if (this.ReportName == 'Material Consumption Monthly Summary') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
    }
     else if (this.ReportName == 'Material Consumption') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
    }
    else if (this.ReportName == 'Item Expiry Report') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=true;
      this.FlagdrugtypeSelected=false;
      this.FlagDaterangeSelected=false;
      this.FlagReportTypeSelected= false;
    }
     else if (this.ReportName == 'Current Stock Report') {
      this.FlagBillNoSelected = false;
      this.FlagUserSelected = false;
      this.FlagDoctorSelected = false;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=true;
      this.FlagDaterangeSelected=false;
      this.FlagStore1Selected = false;
      this.FlagStoreSelected = true;
      this.FlagSupplierSelected = false;
      this.FlagReportTypeSelected= false;
    }
   
     else if (this.ReportName == 'Item Wise Supplier List') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = true;
      this.FlagItemSelected=true;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
    }
    else if (this.ReportName == 'Current Stock Date Wise') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
      this.FlagDaterangeSelected=true;
    }
     else if (this.ReportName == 'Non-Moving Item List') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = true;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
      this.FlagDaterangeSelected=true;
    }
    else if (this.ReportName == 'Non-Moving Item Without Batch List') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = true;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
      this.FlagDaterangeSelected=true;
    }
    else if (this.ReportName == 'Patient Wise Material Consumption') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=false;
      this.FlagIdSelected=true;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
    }
     else if (this.ReportName == 'Last Purchase Rate Wise Consumtion') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = false;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=true;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
      this.FlagDaterangeSelected=true;
    }
    else if (this.ReportName == 'Item Count') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=true;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
      this.FlagDaterangeSelected=true;
    }
     else if (this.ReportName == 'Supplier Wise Debit Credit Note') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = true;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
    }   else if (this.ReportName == 'Stock Adjustment Report') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
    }
     else if (this.ReportName == 'Purchase Wise GRN Summary') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = false;
      this.FlagStore1Selected = false;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
    }   else if (this.ReportName == 'Issue To Department Monthly Summary') {
      this.FlagUserSelected = false;
      this.FlagnonmovedaySelected = false;
      this.FlagDoctorSelected = false;
      this.FlagStoreSelected = true;
      this.FlagStore1Selected = true;
      this.FlagSupplierSelected = false;
      this.FlagItemSelected=false;
      this.FlagIdSelected=false;
      this.FlagMonthSelected=false;
      this.FlagdrugtypeSelected=false;
      this.FlagReportTypeSelected= false;
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
      this.viewGrnReport();
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
    else if (this.ReportName == 'Issue To Department Monthly Summary') {
      this.viewgetIssutodeptmonthlysummaryPdf();
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

    let SupplierName ='%'

    if (this._OPReportsService.userForm.get('SupplierName').value)
      SupplierName = this._OPReportsService.userForm.get('SupplierName').value.SupplierName
    
    let StoreId =0

    if (this._OPReportsService.userForm.get('StoreId').value)
     StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
    
    
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
   
    this._OPReportsService.getSupplierlistReport(SupplierName,StoreId     
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

    // if (this._OPReportsService.userForm.get('SupplierName').value)
    //   SupplierId = this._OPReportsService.userForm.get('SupplierName').value.SupplierId
    
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
debugger
    if (this._OPReportsService.userForm.get('StoreId').value)
     StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId || 0
    
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
    debugger
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
    let StoreId =0;
   

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
    debugger
   let ExpMonth =this.vMonth;
   let ExpYear = this.vYear;
   let StoreId =0

   if (this._OPReportsService.userForm.get('StoreId').value)
    StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
   
    this.sIsLoading = 'loading-data';
   
     setTimeout(() => {
     
       this._OPReportsService.getItemExpirylistReport(
        ExpMonth,ExpYear,StoreId
       
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
    let IsNarcotic=0;
    let ish1Drug=0;
    let isScheduleH=0;
    let IsHighRisk=0;
    let IsScheduleX=0;

    let StoreId=0;

   if (this._OPReportsService.userForm.get('StoreId').value)
    StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
   
   if (this._OPReportsService.userForm.get('IsNarcotic').value)
  IsNarcotic =1
  else
  IsNarcotic =0
   if (this._OPReportsService.userForm.get('ish1Drug').value)
    ish1Drug = 1
  else
  ish1Drug = 0
   if (this._OPReportsService.userForm.get('isScheduleH').value)
    isScheduleH = 1
  else
  isScheduleH = 0
   if (this._OPReportsService.userForm.get('IsHighRisk').value)
    IsHighRisk = 1
  else
  IsHighRisk = 0
   if (this._OPReportsService.userForm.get('IsScheduleX').value)
    IsScheduleX = 1
  else
  IsScheduleX = 0
   debugger
    
    
     this.sIsLoading = 'loading-data';
    
      setTimeout(() => {
      
        this._OPReportsService.getCurrentstocklistReport(
       StoreId,IsNarcotic,ish1Drug,isScheduleH,IsHighRisk,IsScheduleX
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
 


viewGrnReport(){
  debugger
  if(this._OPReportsService.userForm.get("ReportType").value=='0')
    this.viewgetGRNReportdetailPdf()
  else
  this.viewgetGRNReportsummaryPdf()
}


   
viewgetGRNReportdetailPdf() {
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

  viewgetGRNReportsummaryPdf() {
    let StoreId =0

    if (this._OPReportsService.userForm.get('StoreId').value)
     StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
    
    let SupplierId =0

    if (this._OPReportsService.userForm.get('SupplierName').value)
      SupplierId = this._OPReportsService.userForm.get('SupplierName').value.SupplierId
    

    setTimeout(() => {
      this.SpinLoading = true;
      this._OPReportsService.getGRNReportsummarylist(
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
   let Id=0
   if (this._OPReportsService.userForm.get('Id').value)
    Id = this._OPReportsService.userForm.get('Id').value
   
   let StoreId =0

    if (this._OPReportsService.userForm.get('StoreId').value)
     StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
    

     setTimeout(() => {
     
       this._OPReportsService.getMaterialConsumptionlistReport(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",Id,StoreId
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
    if (this._OPReportsService.userForm.get('ItemId').value)
      ItemId = this._OPReportsService.userForm.get('ItemId').value.ItemID
     
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
    if (this._OPReportsService.userForm.get('ItemId').value)
      ItemId = this._OPReportsService.userForm.get('ItemId').value.ItemID
     
    let StoreId =0

    if (this._OPReportsService.userForm.get('StoreId').value)
     StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
    
    let SupplierId =0

    if (this._OPReportsService.userForm.get('SupplierName').value)
      SupplierId = this._OPReportsService.userForm.get('SupplierName').value.SupplierId
    
    setTimeout(() => {
      this.SpinLoading = true;
      this._OPReportsService.getItemwisesupplierlistview(StoreId,SupplierId,ItemId,
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
              title: "Item Wise Supplier List  Viewer"
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
    if (this._OPReportsService.userForm.get('ItemId').value)
      ItemId = this._OPReportsService.userForm.get('ItemId').value.ItemID
     
   
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
    debugger
    let StoreId =0
    // let SupplierName=''
    // if (this._OPReportsService.userForm.get('SupplierName').value)
    //   SupplierName = this._OPReportsService.userForm.get('SupplierName').value.SupplierName

    if (this._OPReportsService.userForm.get('StoreId').value)
      StoreId = this._OPReportsService.userForm.get('StoreId').value.StoreId
    
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

  viewgetIssutodeptmonthlysummaryPdf() {
    let StoreId1 =0
    let StoreId2 =0
debugger
    if (this._OPReportsService.userForm.get('StoreId').value)
     StoreId1 = this._OPReportsService.userForm.get('StoreId').value.StoreId
    
    if (this._OPReportsService.userForm.get('StoreId1').value)
      StoreId2 = this._OPReportsService.userForm.get('StoreId1').value.StoreId
     

    setTimeout(() => {
      this.SpinLoading = true;
      this._OPReportsService.getIssuetodeptmonthlysummaryview(
        this.datePipe.transform(this._OPReportsService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
       this.datePipe.transform(this._OPReportsService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",StoreId1,StoreId2
        
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '850px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Issue to Dept Monthly Summary"
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


  private _filtersearchItem(value: any): string[] {
    if (value) {
      const filterValue = value && value.ItemName ? value.ItemName.toLowerCase() : value.toLowerCase();
      return this.ItemList.filter(option => option.ItemName.toLowerCase().includes(filterValue));
    }
  }
getSearchItemList() {   
      var m_data = {
        "ItemName": `${this._OPReportsService.userForm.get('ItemId').value}%`,
      //  "StoreId": this._loggedUser.currentUserValue.user.storeId
      }
    
      this._OPReportsService.getItemlist(m_data).subscribe(data => {
         this.ItemList = data;
       this.optionsSearchItem = this.ItemList.slice();
      this.filteredOptionsItem = this._OPReportsService.userForm.get('ItemId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filtersearchItem(value) : this.ItemList.slice()),
      );
    });
    }

    getOptionItemText(option) {
      return option && option.ItemName ? option.ItemName : '';
    } 
    getSelectedObjItem(obj) {
     // console.log(obj)
    //  this.ItemId = obj.ItemId;
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
