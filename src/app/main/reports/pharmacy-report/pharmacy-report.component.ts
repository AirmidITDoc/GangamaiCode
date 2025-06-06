import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PharmacyreportService } from './pharmacyreport.service';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BrowsSalesBillService } from 'app/main/pharmacy/brows-sales-bill/brows-sales-bill.service';
import { SalesService } from 'app/main/pharmacy/sales/sales.service';
import { IndentList, Printsal } from 'app/main/pharmacy/sales/sales.component';
import { Observable, Subscription } from 'rxjs';
import * as converter from 'number-to-words';
import { PrintPreviewService } from 'app/main/shared/services/print-preview.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { map, startWith } from 'rxjs/operators';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';


@Component({
  selector: 'app-pharmacy-report',
  templateUrl: './pharmacy-report.component.html',
  styleUrls: ['./pharmacy-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PharmacyReportComponent implements OnInit {
  @ViewChild('SalescollectiontSummaryemplate') SalescollectiontSummaryemplate: ElementRef;
  @ViewChild('SalesPatientwiseTemplate') SalesPatientwiseTemplate: ElementRef;
  @ViewChild('SalesDailycollectiontemplate') SalesDailycollectiontemplate: ElementRef;
  @ViewChild('SalesReturntemplate') SalesReturntemplate: ElementRef;
  @ViewChild('billTemplate') billTemplate: ElementRef;
  StoreList: any = [];
  UserList: any = [];
  PaymentList: any = [];
  drugtypeList: any = [];
  searchDoctorList: any = [];
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
  TotalCashpay: any = 0;
  TotalCardpay: any = 0;
  TotalChequepay: any = 0;
  TotalNeftpay: any = 0;
  TotalPayTmpay: any = 0;
  TotalBalancepay: any = 0;
  TotalAdvUsed: any = 0;
  TotalNETAmount: any = 0;
  TotalPaidAmount: any = 0;
  TotalBillAmount: any = 0;
  filteredOptionsUser: Observable<string[]>;
  filteredOptionsPaymentmode: Observable<string[]>;
  filteredOptionsItem:any;
  filteredOptionsDrugtype: Observable<string[]>;
  filteredOptionsStore: Observable<string[]>;
  PatientListfilteredOptions: any;
  filteredOptionssearchDoctor: Observable<string[]>;
  isUserSelected: boolean = false;
  isPaymentSelected: boolean = false;  
  isPatientSelected: boolean = false;
  isItemIdSelected: boolean = false;
  isDugtypeSelected: boolean = false;
  isSearchdoctorSelected: boolean = false;
  FlagUserSelected: boolean = false;
  FlagPaymentSelected: boolean = false;
  FlagStoreSelected: boolean = false;
  FlagRegNoSelected: boolean = false;
  FlagDrugTypeIdSelected: boolean = false;
  FlagItemSelected: boolean = false;
  FlagPatientSelected:boolean=false;
  optionsUser: any[] = [];
  optionsSearchDoc: any[] = [];
  optionsPaymentMode: any[] = [];
  optionsdrugtype: any[] = [];
  PaymentMode: any;
  TotalAmount: any = 0;
  TotalVatAmount: any = 0;
  TotalDiscAmount: any = 0;
  TotalCGST: any = 0;
  TotalSGST: any = 0;
  TotalIGST: any = 0;
  ReportName: any;
  SalesNetAmount: any = 0;
  SalesReturnNetAmount: any = 0;
  SalesDiscAmount: any = 0;
  SalesReturnDiscAmount: any = 0;
  SalesBillAmount: any = 0;
  SalesReturnBillAmount: any = 0;
  SalesPaidAmount: any = 0;
  SalesReturnPaidAmount: any = 0;
  SalesBalAmount: any = 0;
  SalesReturnBalAmount: any = 0;
  OPIPType:any;
  SalesCashAmount: any = 0;
  SalesReturnCashAmount: any = 0;
  noOptionFound: boolean = false;
  TotalBalAmount: any = 0;
  TotalCashAmount: any = 0;
  SpinLoading: boolean = false;
  AdList: boolean = false;
  FromDate: any;
  Todate: any;
  UserId: any = 0;
  UserName: any;
  IsLoading: boolean = false;
  FlagDoctorIDSelected: boolean = false;
  RegId:any;
  PatientName: any = '';
  StoreId:any;
  FlaOPIPTypeSelected: boolean = false;

  displayedColumns = [
    'ReportName'
  ];

  dataSource = new MatTableDataSource<ReportDetail>();
  constructor(
    // this.dataSource.data = TREE_DATA;
    public _PharmacyreportService: PharmacyreportService,
    public _PrintPreviewService: PrintPreviewService,

     private reportDownloadService: ExcelDownloadService,
    // public _PharmacyreportService: SalesService,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    public datePipe: DatePipe,
    // public _PharmacyreportService: BrowsSalesBillService,
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
    this.getDrugTypeList();
    this.getDoctorList();
    this.GetPaymentModeList();
    this.getSearchItemList()
    const toSelect = this.UserList.find(c => c.UserId == this.UserId);
    this._PharmacyreportService.userForm.get('UserId').setValue(toSelect);

  }

  gePharStoreList() {
   
    this._PharmacyreportService.getStoreList().subscribe(data => {
     this.StoreList = data;
      this.filteredOptionsStore = this._PharmacyreportService.userForm.get('StoreId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterstore(value) : this.StoreList.slice()),
      );
    });
  }
  getSelectedPharobjNew(obj){
    console.log("storeId:",obj)
    this.StoreId=obj.StoreId;
  }


  private _filterstore(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
      return this.StoreList.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    }
  }

  getOptionstoreText(option) {
    return option && option.StoreName ? option.StoreName : '';
  }

  getSearchList() {
    debugger
    var m_data = {
      "Keyword": `${this._PharmacyreportService.userForm.get('RegID').value}`
    }
    console.log(m_data)
    this._PharmacyreportService.getPatientRegisterListSearch(m_data).subscribe(data => {
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

  getOptionDrugtypeText(option) {
    return option && option.DrugTypeName ? option.DrugTypeName : '';
  }

  
  getDrugTypeList() {

    this._PharmacyreportService.getDrugTypeCombo().subscribe(data => {
        this.drugtypeList = data;
        this.filteredOptionsDrugtype = this._PharmacyreportService.userForm.get('DrugTypeId').valueChanges.pipe(
            startWith(''),
            map(value => value ? this._filterDrugType(value) : this.drugtypeList.slice()),
        );
              
    });

}
  private _filterDrugType(value: any): string[] {
    if (value) {
      const filterValue = value && value.DrugTypeName ? value.DrugTypeName.toLowerCase() : value.toLowerCase();
      return this.drugtypeList.filter(option => option.DrugTypeName.toLowerCase().includes(filterValue));
    }
  }



  getOptionTextsearchDoctor(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }

  getDoctorList() {
    debugger
    var m_data = {
      "Keywords": `${this._PharmacyreportService.userForm.get('DoctorID').value}%`
    }
    console.log("ggggg:", m_data)
    this._PharmacyreportService.getDoctorMaster(m_data).subscribe(data => {
      this.searchDoctorList = data;
      console.log(this.searchDoctorList)
      this.optionsSearchDoc = this.searchDoctorList.slice();
      this.filteredOptionssearchDoctor = this._PharmacyreportService.userForm.get('DoctorID').valueChanges.pipe(
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


  bindReportData() {
    // let qry = "SELECT * FROM ReportConfigMaster WHERE IsActive=1 AND IsDeleted=0 AND ReportType=1";
var data={
  ReportSection:"Pharm Reports"
}
    this._PharmacyreportService.getDataByQuery(data).subscribe(data => {
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

    if (this.ReportName == 'Pharmacy Daily Collection') {
      this.FlagUserSelected = true;
      this.FlagPaymentSelected = false;
      this.FlagRegNoSelected=false;
      this.FlagDrugTypeIdSelected=false;
      this.FlagItemSelected=false;
      this.FlagDoctorIDSelected=false;
      this.FlagStoreSelected=true;
      this.FlaOPIPTypeSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
    } else if (this.ReportName == 'Pharmacy Daily Collection Summary') {
      this.FlagUserSelected = true;
      this.FlagPaymentSelected = false;
      this.FlagRegNoSelected=false;
      this.FlagDrugTypeIdSelected=false;
      this.FlagItemSelected=false;
      this.FlagStoreSelected=true;
      this.FlagDoctorIDSelected=false;
      this.FlaOPIPTypeSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
    } else if (this.ReportName == 'Sales Summary Report') {
      this.FlagUserSelected = true;
      this.FlagPaymentSelected = false;
      this.FlagRegNoSelected=false;
      this.FlagDrugTypeIdSelected=false;
      this.FlagItemSelected=false;
      this.FlagStoreSelected=true;
      this.FlagDoctorIDSelected=false;
      this.FlaOPIPTypeSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
    } else if (this.ReportName == 'Sales Patient Wise Report') {
      this.FlagUserSelected = true;
      this.FlagPaymentSelected = false;
      this.FlagRegNoSelected=false;
      this.FlagDrugTypeIdSelected=false;
      this.FlagItemSelected=false;
      this.FlagStoreSelected=true;
      this.FlagDoctorIDSelected=false;
      this.FlaOPIPTypeSelected=false;
      this.FlagPatientSelected=true;
      this.clearField();
    } else if (this.ReportName == 'Sales Return Summary Report') {
      this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagRegNoSelected=false;
      this.FlagDrugTypeIdSelected=false;
      this.FlagItemSelected=false;
      this.FlagStoreSelected=true;
      this.FlagDoctorIDSelected=false;
      this.FlaOPIPTypeSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
    } else if (this.ReportName == 'Sales Return PatientWise Report') {
      this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagRegNoSelected=false;
      this.FlagDrugTypeIdSelected=false;
      this.FlagItemSelected=false;
      this.FlagStoreSelected=true;
      this.FlagDoctorIDSelected=false;
      this.FlaOPIPTypeSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
    } else if (this.ReportName == 'Sales Credit Report') {
      this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagRegNoSelected=false;
      this.FlagDrugTypeIdSelected=false;
      this.FlagItemSelected=false;
      this.FlagStoreSelected=true;
      this.FlagDoctorIDSelected=false;
      this.FlaOPIPTypeSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
    } else if (this.ReportName == 'Pharmacy Daily Collection Summary Day & User Wise') {
      this.FlagUserSelected = true;
      this.FlagPaymentSelected = false;
      this.FlagRegNoSelected=false;
      this.FlagDrugTypeIdSelected=false;
      this.FlagItemSelected=false;
      this.FlagStoreSelected=true;
      this.FlagDoctorIDSelected=false;
      this.FlaOPIPTypeSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
    }
    else if (this.ReportName == 'Sales Cash Book Report') {
      this.FlagPaymentSelected = true;
      this.FlagUserSelected = false;
      this.FlagRegNoSelected=false;
      this.FlagDrugTypeIdSelected=false;
      this.FlagItemSelected=false;
      this.FlagStoreSelected=true;
      this.FlagDoctorIDSelected=false;
      this.FlaOPIPTypeSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
    } else if (this.ReportName == 'Sales SCHEDULEH1 Report') {
      this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagDrugTypeIdSelected=true;
      this.FlagRegNoSelected=false;
      this.FlagStoreSelected=true;
      this.FlagItemSelected=false;
      this.FlagDoctorIDSelected=false;
      this.FlaOPIPTypeSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
          } else if (this.ReportName == 'SCHEDULEH1 SalesSummary Report') {
      this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagDrugTypeIdSelected=true;
      this.FlagRegNoSelected=false;
      this.FlagStoreSelected=true;
      this.FlagItemSelected=false;
      this.FlagDoctorIDSelected=false;
      this.FlaOPIPTypeSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
    } else if (this.ReportName == 'SalesH1 DrugCount Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentSelected = false;
      this.FlagRegNoSelected=false;
      this.FlagDrugTypeIdSelected=false;
      this.FlagStoreSelected=true;
      this.FlagItemSelected=false;
      this.FlagDoctorIDSelected=false;
      this.FlaOPIPTypeSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
    }
    else if (this.ReportName == 'ItemWise DailySales Report') {
      this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagRegNoSelected=true;
      this.FlagDrugTypeIdSelected=false;
      this.FlagStoreSelected=true;
      this.FlagItemSelected=true;
      this.FlagDoctorIDSelected=false;
      this.FlaOPIPTypeSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
    }
    else if (this.ReportName == 'WardWise HighRisk Drug Report') {
      this.FlagUserSelected = false;
      this.FlagPaymentSelected = false;
      this.FlagRegNoSelected=false;
      this.FlagDrugTypeIdSelected=false;
      this.FlagStoreSelected=true;
      this.FlagItemSelected=false;
      this.FlagDoctorIDSelected=false;
      this.FlaOPIPTypeSelected=false;
      this.FlagPatientSelected=false;
      this.clearField();
    }
    else if (this.ReportName == 'Purchase Re-Order List Report') {
      this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagRegNoSelected=false;
      this.FlagDrugTypeIdSelected=false;
      this.FlagStoreSelected=true;
      this.FlagItemSelected=false;
      this.FlagDoctorIDSelected=false;
      this.FlaOPIPTypeSelected=false;
      this.FlagPatientSelected=false;
          this.clearField();
    }else if (this.ReportName == 'Pharmacy BillSummary Report') {
      this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagRegNoSelected=false;
      this.FlagDrugTypeIdSelected=false;
      this.FlagStoreSelected=true;
      this.FlagItemSelected=false;
      this.FlagDoctorIDSelected=false;
      this.FlaOPIPTypeSelected=false;
      this.FlagPatientSelected=false;
          this.clearField();
    }else if(this.ReportName == 'Doctor Wise Profit Report'){
      this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagRegNoSelected=false;
      this.FlagDrugTypeIdSelected=false;
      this.FlagStoreSelected=false;
      this.FlagItemSelected=false;
      this.FlagDoctorIDSelected=true;
      this.FlaOPIPTypeSelected=false;
      this.FlagPatientSelected=false;
          this.clearField();
    }else if(this.ReportName == 'Dr Wise Sales Report'){
      this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagRegNoSelected=false;
      this.FlagDrugTypeIdSelected=false;
      this.FlagStoreSelected=true;
      this.FlagItemSelected=false;
      this.FlagDoctorIDSelected=true;
      this.FlaOPIPTypeSelected=true;
      this.FlagPatientSelected=false;
          this.clearField();
    }else if(this.ReportName == 'Dr Wise Profit Detail Report'){
      this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagRegNoSelected=false;
      this.FlagDrugTypeIdSelected=false;
      this.FlagStoreSelected=true;
      this.FlagItemSelected=false;
      this.FlagDoctorIDSelected=true;
      this.FlaOPIPTypeSelected=true;
      this.FlagPatientSelected=false;
          this.clearField();
    }else if(this.ReportName == 'Dr Wise Profit Summary Report'){
      this.FlagPaymentSelected = false;
      this.FlagUserSelected = false;
      this.FlagRegNoSelected=false;
      this.FlagDrugTypeIdSelected=false;
      this.FlagStoreSelected=false;
      this.FlagItemSelected=false;
      this.FlagDoctorIDSelected=true;
      this.FlaOPIPTypeSelected=true;
      this.FlagPatientSelected=false;
          this.clearField();
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
    this._PharmacyreportService.getUserdetailList(data).subscribe(data => {
      this.UserList = data;
      this.optionsUser = this.UserList.slice();
      console.log(this.UserList);
      this.filteredOptionsUser = this._PharmacyreportService.userForm.get('UserId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterUser(value) : this.UserList.slice()),
      );

    });
    const toSelect = this.UserList.find(c => c.UserId == this.UserId);
    this._PharmacyreportService.userForm.get('UserId').setValue(toSelect);

  }

  GetPaymentModeList() {
    debugger
    this._PharmacyreportService.getPaymentModeList().subscribe(data => {
      this.PaymentList = data;
      this.optionsPaymentMode = this.PaymentList.slice();
      console.log(this.PaymentList);
      this.filteredOptionsPaymentmode = this._PharmacyreportService.userForm.get('PaymentMode').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterUser(value) : this.PaymentList.slice()),
      );

    });
    this._PharmacyreportService.userForm.get('PaymentMode').setValue(this.PaymentList[0]);
  }

  getSearchItemList() {   
    debugger
    var m_data = {
      "ItemName": `${this._PharmacyreportService.userForm.get('ItemId').value}%`,
    //  "StoreId": this._loggedUser.currentUserValue.user.storeId
    }
  this._PharmacyreportService.getItemlist(m_data).subscribe(data => {
      this.filteredOptionsItem = data;
      console.log(data)
    });
  }

  getOptionItemText(option) {
    return option && option.ItemName ? option.ItemName : '';
  } 
  getSelectedObjItem(obj) {
   // console.log(obj)
  //  this.ItemId = obj.ItemId;
  }

  getPrint() {
    if (this.ReportName == 'Pharmacy Daily Collection') {
      this.viewparmacyDailyCollectionPdf();
    } else if (this.ReportName == 'Pharmacy Daily Collection Summary') {
      this.viewDailyCollectionSummaryPdf();
    } else if (this.ReportName == 'Sales Summary Report') {
      this.viewgetsalesSummaryReportPdf();
    } else if (this.ReportName == 'Sales Patient Wise Report') {
      this.viewgetSalesPatientWiseReportPdf();
    // } else if (this.ReportName == 'Sales Return Summary Report') {
    //   this.viewgetSalesReturnReportPdf();
    } else if (this.ReportName == 'Sales Return Summary Report') {
      this.viewgetSalesReturnsummaryReportPdf();
    } else if (this.ReportName == 'Sales Return PatientWise Report') {
      this.viewgetSalesReturnPatientwiseReportPdf();
    } else if (this.ReportName == 'Sales Credit Report') {
      this.viewgetSalesCreditReportPdf();
    } else if (this.ReportName == 'Pharmacy Daily Collection Summary Day & User Wise') {
      this.viewgetPharCollsummDayuserwiseReportPdf();
    }
    else if (this.ReportName == 'Sales Cash Book Report') {
      this.viewgetSalesCashBookReportPdf();
    }
    else if (this.ReportName == 'Sales SCHEDULEH1 Report') {
      this.viewgetSCHEDULEH1ReportPdf();
    }
    else if (this.ReportName == 'SCHEDULEH1 SalesSummary Report') {
      this.viewgetSCHEDULEH1SalesSummaryReportPdf();
    }
    else if (this.ReportName == 'SalesH1 DrugCount Report') {
      this.viewgetSalesH1DrugCountReportPdf();
    }
    else if (this.ReportName == 'ItemWise DailySales Report') {
      this.viewgetItemWiseDailySalesReportPdf();
    }
    else if (this.ReportName == 'WardWise HighRisk Drug Report') {
      this.viewgetHighRiskDrugReportPdf();
    }
    else if (this.ReportName == 'Purchase Re-Order List Report') {
      this.viewgetPurchaseReOrderListReportPdf();
    }
    else if (this.ReportName == 'Pharmacy BillSummary Report') {
      this.viewgetPharmacyBillSummaryReportPdf();
    }
    else if (this.ReportName == 'Doctor Wise Profit Report') {
      this.viewgetPharmDoctorProfitDReportPdf();
    }
    else if (this.ReportName == 'Dr Wise Sales Report') {
      this.viewgetDrwisesalesReportPdf();
    }
    else if (this.ReportName == 'Dr Wise Profit Detail Report') {
      this.viewgetDrwiseprofitdetailReportPdf();
    }
    else if (this.ReportName == 'Dr Wise Profit Summary Report') {
      this.viewgetDrwiseprofitsummaryReportPdf();
    }
  }

  dsExcelExportData = new MatTableDataSource<IndentList>()
  ExcelData:any=[];
  getExcelData(){
    let DoctorID = 0;
    if (this._PharmacyreportService.userForm.get('DoctorID').value)
      DoctorID = this._PharmacyreportService.userForm.get('DoctorID').value.DoctorId

    let StoreId=0;
    if (this._PharmacyreportService.userForm.get('StoreId').value)
      StoreId = this._PharmacyreportService.userForm.get('StoreId').value.StoreId

    let AddUserId = 0;
    if (this._PharmacyreportService.userForm.get('UserId').value)
      AddUserId = this._PharmacyreportService.userForm.get('UserId').value.UserId
 
    let ItemId=0;
    if (this._PharmacyreportService.userForm.get('ItemId').value)
      ItemId = this._PharmacyreportService.userForm.get('ItemId').value.ItemID 
  
    let RegNo=0;
    if (this._PharmacyreportService.userForm.get('RegNo').value)
      RegNo = this._PharmacyreportService.userForm.get('RegNo').value
    
    let DrugTypeId=0;
     if (this._PharmacyreportService.userForm.get('DrugTypeId').value)
        DrugTypeId = this._PharmacyreportService.userForm.get('DrugTypeId').value.ItemDrugTypeId


 
    if (this.ReportName == 'Pharmacy Daily Collection') {
      let vdata = { 
        'FromDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        'ToDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", 
        'StoreId': StoreId,
        'AddedById':AddUserId
      }               
      this._PharmacyreportService.getSalesDailyCollectionlist(vdata).subscribe(res => {
        this.dsExcelExportData.data = res as IndentList[]
        console.log(this.dsExcelExportData.data)
        if(this.dsExcelExportData.data.length>0){
          this.exportIPBillReportExcel();
        }
      });                  
    } else if (this.ReportName == 'Pharmacy Daily Collection Summary') {
      let vdata = { 
        'FromDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        'ToDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", 
        'StoreId': StoreId ,
        'AddedById':AddUserId
      }                  
      this._PharmacyreportService.getSalesDailyCollectionSummarylist(vdata).subscribe(res => {
        this.dsExcelExportData.data = res as IndentList[]
        console.log(this.dsExcelExportData.data)
        if(this.dsExcelExportData.data.length>0){
          this.exportIPBillReportExcel();
        }
      });  
    } else if (this.ReportName == 'Sales Summary Report') {
      this.viewgetsalesSummaryReportPdf();
    } else if (this.ReportName == 'Sales Patient Wise Report') {
      this.viewgetSalesPatientWiseReportPdf();
    // } 
    // else if (this.ReportName == 'Sales Return Summary Report') {
    //   this.viewgetSalesReturnReportPdf();
    } else if (this.ReportName == 'Sales Return Summary Report') {
      this.viewgetSalesReturnsummaryReportPdf();
    } else if (this.ReportName == 'Sales Return PatientWise Report') {
      this.viewgetSalesReturnPatientwiseReportPdf();
    } else if (this.ReportName == 'Sales Credit Report') { 
      this.viewgetSalesCreditReportPdf(); 
    } else if (this.ReportName == 'Pharmacy Daily Collection Summary Day & User Wise') {
      let vdata = { 
        'FromDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        'ToDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", 
        'StoreId': StoreId ,
        'AddedById':AddUserId
      }                  
      this._PharmacyreportService.getSalesDailyColleSummryUserwiselist(vdata).subscribe(res => {
        this.dsExcelExportData.data = res as IndentList[]
        console.log(this.dsExcelExportData.data)
        if(this.dsExcelExportData.data.length>0){
          this.exportIPBillReportExcel();
        }
      });  
    }
    else if (this.ReportName == 'Sales Cash Book Report') {
      let vdata = { 
        'FromDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        'ToDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", 
        'StoreId': StoreId ,
        'PaymentMode':this._PharmacyreportService.userForm.get('PaymentMode').value
      }                  
      this._PharmacyreportService.getSalesCashBooklist(vdata).subscribe(res => {
        this.dsExcelExportData.data = res as IndentList[]
        console.log(this.dsExcelExportData.data)
        if(this.dsExcelExportData.data.length>0){
          this.exportIPBillReportExcel();
        }
      });  
    }
    else if (this.ReportName == 'Sales SCHEDULEH1 Report') {
      let vdata = { 
        'FromDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        'ToDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", 
        'StoreId': StoreId,
        'DrugTypeId':DrugTypeId, 
      }               
      this._PharmacyreportService.getScheduleH1SalesSummryReportlist(vdata).subscribe(res => {
        this.dsExcelExportData.data = res as IndentList[]
        console.log(this.dsExcelExportData.data)
        if(this.dsExcelExportData.data.length>0){
          this.exportIPBillReportExcel();
        }
      }); 
    }
    else if (this.ReportName == 'SCHEDULEH1 SalesSummary Report') {
      let vdata = { 
        'FromDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        'ToDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", 
        'StoreId': StoreId,
        'DrugTypeId':DrugTypeId, 
      }               
      this._PharmacyreportService.getScheduleH1SalesSummryReportlist(vdata).subscribe(res => {
        this.dsExcelExportData.data = res as IndentList[]
        console.log(this.dsExcelExportData.data)
        if(this.dsExcelExportData.data.length>0){
          this.exportIPBillReportExcel();
        }
      });   
    }
    else if (this.ReportName == 'SalesH1 DrugCount Report') {
      let vdata = { 
        'FromDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        'ToDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", 
        'StoreId': StoreId 
      }               
      this._PharmacyreportService.getSalesH1DrugCountlist(vdata).subscribe(res => {
        this.dsExcelExportData.data = res as IndentList[]
        console.log(this.dsExcelExportData.data)
        if(this.dsExcelExportData.data.length>0){
          this.exportIPBillReportExcel();
        }
      }); 
    }
    else if (this.ReportName == 'ItemWise DailySales Report') {
      let vdata = { 
        'FromDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        'ToDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", 
        'StoreId': StoreId,
        'ItemId':ItemId,
        'RegNo':RegNo
      }               
      this._PharmacyreportService.getItemWiseDailyReportlist(vdata).subscribe(res => {
        this.dsExcelExportData.data = res as IndentList[]
        console.log(this.dsExcelExportData.data)
        if(this.dsExcelExportData.data.length>0){
          this.exportIPBillReportExcel();
        }
      });  
    }
    else if (this.ReportName == 'WardWise HighRisk Drug Report') {
      let vdata = { 
        'FromDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        'ToDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", 
        'StoreId': StoreId
      }               
      this._PharmacyreportService.getWardWiseHighRiskDrugReportlist(vdata).subscribe(res => {
        this.dsExcelExportData.data = res as IndentList[]
        console.log(this.dsExcelExportData.data)
        if(this.dsExcelExportData.data.length>0){
          this.exportIPBillReportExcel();
        }
      });  
    }
    else if (this.ReportName == 'Purchase Re-Order List Report') {
      let vdata = { 
        'FromDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        'ToDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", 
        'StoreID': StoreId
      }               
      this._PharmacyreportService.getPurchaseOrderlist(vdata).subscribe(res => {
        this.dsExcelExportData.data = res as IndentList[]
        console.log(this.dsExcelExportData.data)
        if(this.dsExcelExportData.data.length>0){
          this.exportIPBillReportExcel();
        }
      });   
    }
    else if (this.ReportName == 'Pharmacy BillSummary Report') {
      let vdata = { 
        'FromDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        'ToDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900", 
        'StoreId': StoreId
      }               
      this._PharmacyreportService.getPharmacybillsummryReportlist(vdata).subscribe(res => {
        this.dsExcelExportData.data = res as IndentList[]
        console.log(this.dsExcelExportData.data)
        if(this.dsExcelExportData.data.length>0){
          this.exportIPBillReportExcel();
        }
      });  
    } 
    else if (this.ReportName == 'Dr Wise Sales Report') {
      let vdata = {
        'DoctorId': DoctorID,
        'FromDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("startdate").value, "MM-dd-yyyy") || "01/01/1900",
        'ToDate': this.datePipe.transform(this._PharmacyreportService.userForm.get("enddate").value, "MM-dd-yyyy") || "01/01/1900",
        'OP_IP_Type': this._PharmacyreportService.userForm.get("OPIPType").value,
        'StoreId': StoreId
      }               
      this._PharmacyreportService.getDoctorWiseSalesReportlist(vdata).subscribe(res => {
        this.dsExcelExportData.data = res as IndentList[]
        console.log(this.dsExcelExportData.data)
        if(this.dsExcelExportData.data.length>0){
          this.exportIPBillReportExcel();
        }
      });   
    } 
  
 
  }
  exportIPBillReportExcel(){
    if (this.ReportName == 'Pharmacy Daily Collection') {
      this.sIsLoading == 'loading-data'
      let exportHeaders = ['PaymentDate','SalesNo','RegNo','PatientName','NetAmount','CashPayAmount','ChequePayAmount','CardPayAmount','NEFTPayAmount','PayTMAmount','AdvanceUsedAmount','BalanceAmount'];
      this.reportDownloadService.getExportJsonData(this.dsExcelExportData.data, exportHeaders, 'Pharmacy Daily Collection');
      this.dsExcelExportData.data = [];
      this.sIsLoading = '';
    } else if (this.ReportName == 'Pharmacy Daily Collection Summary') {
      this.sIsLoading == 'loading-data'
      let exportHeaders = ['TotalBillAmount','DiscAmount','NetAmount','BalAmount','PaidAmount','CashPay','CardPay','ChequePay','NEFTPay','OnlinePay','NetAmount'];
      this.reportDownloadService.getExportJsonData(this.dsExcelExportData.data, exportHeaders, 'Pharmacy Daily Collection Summary');
      this.dsExcelExportData.data = [];
      this.sIsLoading = '';
    } else if (this.ReportName == 'Sales Summary Report') {
      this.viewgetsalesSummaryReportPdf();
    } else if (this.ReportName == 'Sales Patient Wise Report') {
      this.viewgetSalesPatientWiseReportPdf();
    // } else if (this.ReportName == 'Sales Return Summary Report') {
    //   this.viewgetSalesReturnReportPdf();
    } else if (this.ReportName == 'Sales Return Summary Report') {
      this.viewgetSalesReturnsummaryReportPdf();
    } else if (this.ReportName == 'Sales Return PatientWise Report') {
      this.viewgetSalesReturnPatientwiseReportPdf();
    } else if (this.ReportName == 'Sales Credit Report') {
      this.viewgetSalesCreditReportPdf();
    } else if (this.ReportName == 'Pharmacy Daily Collection Summary Day & User Wise') {
      this.sIsLoading == 'loading-data'
      let exportHeaders = ['PaymentDate','UserName','TotalBillAmount','NetAmount','BalAmount','PaidAmount','CashPay','CardPay','ChequePay','NEFTPay','OnlinePay'];
      this.reportDownloadService.getExportJsonData(this.dsExcelExportData.data, exportHeaders, 'Pharmacy Daily Collection Summary Day & User Wise');
      this.dsExcelExportData.data = [];
      this.sIsLoading = '';
    }
    else if (this.ReportName == 'Sales Cash Book Report') {
      this.viewgetSalesCashBookReportPdf();
    }
    else if (this.ReportName == 'Sales SCHEDULEH1 Report') {
      this.sIsLoading == 'loading-data'
      let exportHeaders = ['PatientName','Address','DoctorName','ItemName','Qty','TotalAmount','SalesNo','Date'];
      this.reportDownloadService.getExportJsonData(this.dsExcelExportData.data, exportHeaders, 'Sales SCHEDULEH1 Report');
      this.dsExcelExportData.data = [];
      this.sIsLoading = '';
    }
    else if (this.ReportName == 'SCHEDULEH1 SalesSummary Report') {
      this.sIsLoading == 'loading-data'
      let exportHeaders = ['Date','SalesNo','PatientName','BatchNo','Qty','TotalAmount','DiscAmount','NetAmount'];
      this.reportDownloadService.getExportJsonData(this.dsExcelExportData.data, exportHeaders, 'SCHEDULEH1 SalesSummary Report');
      this.dsExcelExportData.data = [];
      this.sIsLoading = '';
    }
    else if (this.ReportName == 'SalesH1 DrugCount Report') {
      this.viewgetSalesH1DrugCountReportPdf();
    }
    else if (this.ReportName == 'ItemWise DailySales Report') {
      this.sIsLoading == 'loading-data'
      let exportHeaders = ['PatientName','RegNo','SalesNo','Qty','Date','Time','Type','label'];
      this.reportDownloadService.getExportJsonData(this.dsExcelExportData.data, exportHeaders, 'ItemWise DailySales Report');
      this.dsExcelExportData.data = [];
      this.sIsLoading = '';
    }
    else if (this.ReportName == 'WardWise HighRisk Drug Report') {
      this.viewgetHighRiskDrugReportPdf();
    }
    else if (this.ReportName == 'Purchase Re-Order List Report') {
      this.viewgetPurchaseReOrderListReportPdf();
    }
    else if (this.ReportName == 'Pharmacy BillSummary Report') {
      this.viewgetPharmacyBillSummaryReportPdf();
    } 
    else if (this.ReportName == 'Dr Wise Sales Report') {
      this.sIsLoading == 'loading-data'
      let exportHeaders = ['Date','RegNo','PatientName','OPIPNo','SalesNo','NetAmount'];
      this.reportDownloadService.getExportJsonData(this.dsExcelExportData.data, exportHeaders, 'Dr Wise Sales Report');
      this.dsExcelExportData.data = [];
      this.sIsLoading = '';
    } 
  }
  viewparmacyDailyCollectionPdf() {
    debugger
    let AddUserId = 0;
    if (this._PharmacyreportService.userForm.get('UserId').value)
      AddUserId = this._PharmacyreportService.userForm.get('UserId').value.UserId

    // let storeId =this._loggedUser.currentUserValue.user.storeId;
    // if (this._PharmacyreportService.userForm.get('StoreId').value.StoreId)
    //   storeId = this._PharmacyreportService.userForm.get('StoreId').value.StoreId
    let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }

    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
      
      this._PharmacyreportService.getPharmacyDailyCollectionNew(
        this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        storeId , AddUserId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '1000px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pharma Daily Collection Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
          this.clearField();
        });
      });

    }, 100);
  }


  viewDailyCollectionSummaryPdf() {
    let AddUserId = 0;
    if (this._PharmacyreportService.userForm.get('UserId').value)
      
    AddUserId = this._PharmacyreportService.userForm.get('UserId').value.UserId

    // let storeId =this._loggedUser.currentUserValue.user.storeId;
    // if (this._PharmacyreportService.userForm.get('StoreId').value.StoreId)
    //   storeId = this._PharmacyreportService.userForm.get('StoreId').value.StoreId
    let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }

    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
     
      this._PharmacyreportService.getSalesDailyCollectionSummary(
        this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       storeId,AddUserId
        
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pharma Daily Collection Summary Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
          this.clearField();
        });
      });

    }, 100);
  }

  viewgetPharCollsummDayuserwiseReportPdf() {
    let AddUserId = 0;
      if (this._PharmacyreportService.userForm.get('UserId').value)
        
      AddUserId = this._PharmacyreportService.userForm.get('UserId').value.UserId

    //   let storeId =this._loggedUser.currentUserValue.user.storeId;
    // if (this._PharmacyreportService.userForm.get('StoreId').value.StoreId)
    //   storeId = this._PharmacyreportService.userForm.get('StoreId').value.StoreId
    let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }

    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
      
      this._PharmacyreportService.getSalesDailyCollectionSummaryDayuserwise(
        this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        storeId,AddUserId
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
          this.clearField();
        });

      });

    }, 100);
  }

  viewgetsalesSummaryReportPdf() {

    debugger
    let AddUserId = 0;
    if (this._PharmacyreportService.userForm.get('UserId').value)
      AddUserId = this._PharmacyreportService.userForm.get('UserId').value.UserId

    // let storeId =this._loggedUser.currentUserValue.user.storeId;
    // if (this._PharmacyreportService.userForm.get('StoreId').value.StoreId)
    //   storeId = this._PharmacyreportService.userForm.get('StoreId').value.StoreId
    let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }

    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
     
      this._PharmacyreportService.getSalesDetailSummary(
        this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
         0, 0, AddUserId,storeId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pharma Sales Summary Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
          this.clearField();
        });
      });

    }, 100);
  }
  viewgetSalesPatientWiseReportPdf() {
    debugger
    let regId =0;
      if (this.RegId){
        regId = this.RegId
      }

    this.AdList = true;
    let AddUserId = 0;
    if (this._PharmacyreportService.userForm.get('UserId').value)
      
    AddUserId = this._PharmacyreportService.userForm.get('UserId').value.UserId

    let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }
    // if(this._PharmacyreportService.userForm.get('StoreId').value)
    //   storeId=this._PharmacyreportService.userForm.get('StoreId').value.storeId

    setTimeout(() => {
      this.sIsLoading = 'loading-data';
    
      let Frdate=this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
      let Todate =  this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'

      
      
      this._PharmacyreportService.getSalesDetail_Patientwise(Frdate,Todate,    
        0, 0, AddUserId, storeId,regId
      ).subscribe(res => {
        
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pharma Daily Collection Summary Patient Wise Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = ' ';
          this.clearField();
          // this.resetPage();
        });
      });

    }, 100);
  }


  viewgetSalesReturnsummaryReportPdf() {
    let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
      this._PharmacyreportService.getSalesReturnsummary(
        this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', 0, 0,
        storeId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Sales Return Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
          this.clearField();
        });
      });

    }, 100);
  }
  viewgetSalesReturnPatientwiseReportPdf() {
    let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
      let frdate= this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
      let Todate =this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
   debugger
      this._PharmacyreportService.getSalesReturnPatientwise(frdate,Todate,0, 0,
      storeId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Sales Return Patient Wise Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
          this.clearField();
        });
      });

    }, 100);
  }

  viewgetSalesCreditReportPdf() {
    let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
      this._PharmacyreportService.getSalesCredit(
        this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', 0, 0, 0,
        storeId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Sales Credit Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
          this.clearField();
        });
      });

    }, 100);
  }



  viewgetSalesCashBookReportPdf() {
    let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;

      this._PharmacyreportService.getSalesCashBook(
        this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd") || '01/01/1900',
        this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd") || '01/01/1900', this.PaymentMode,
        storeId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Sales Cash Book"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
          this.clearField();
        });
      });

    }, 100);
  }

  
  viewgetSCHEDULEH1ReportPdf(){
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
debugger
      let DrugTypeId=0;
      if (this._PharmacyreportService.userForm.get('DrugTypeId').value)
        DrugTypeId = this._PharmacyreportService.userForm.get('DrugTypeId').value.ItemDrugTypeId
      
      let StoreId=0;
      if (this._PharmacyreportService.userForm.get('StoreId').value)
        StoreId = this._PharmacyreportService.userForm.get('StoreId').value.StoreId
      
     
      this._PharmacyreportService.getSchduleh1Book(
        this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd") || '01/01/1900',
        this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd") || '01/01/1900', DrugTypeId,
       StoreId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "SCHDULE H1 Report"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
          this.clearField();
        });
      });

    }, 100);
  }
  viewgetSCHEDULEH1SalesSummaryReportPdf(){
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
     
      let DrugTypeId=0;
     if (this._PharmacyreportService.userForm.get('DrugTypeId').value)
        DrugTypeId = this._PharmacyreportService.userForm.get('DrugTypeId').value.ItemDrugTypeId
      
      let StoreId=0;
      if (this._PharmacyreportService.userForm.get('StoreId').value)
        StoreId = this._PharmacyreportService.userForm.get('StoreId').value.StoreId
      

      this._PharmacyreportService.getSchsuleh1salesummaryBook(
        this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd") || '01/01/1900',
        this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd") || '01/01/1900',DrugTypeId,
        StoreId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "SCHDULEH1 Sales Summary Book"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
          this.clearField();
        });
      });

    }, 100);
  }
  viewgetSalesH1DrugCountReportPdf(){
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
     
      let StoreId=0;
      if (this._PharmacyreportService.userForm.get('StoreId').value)
        StoreId = this._PharmacyreportService.userForm.get('StoreId').value.StoreId
      
      this._PharmacyreportService.getSalesh1drugcount(
        this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd") || '01/01/1900',
        this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd") || '01/01/1900',
        StoreId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Sales H1 Drug Count"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
          this.clearField();
        });
      });

    }, 100);
  }
  viewgetItemWiseDailySalesReportPdf(){
    
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;

     
      let ItemId=0;
      if (this._PharmacyreportService.userForm.get('ItemId').value)
        ItemId = this._PharmacyreportService.userForm.get('ItemId').value.ItemID
       
    
      let RegNo=0;
      if (this._PharmacyreportService.userForm.get('RegNo').value)
        RegNo = this._PharmacyreportService.userForm.get('RegNo').value
       
       let StoreId=0;
       if (this._PharmacyreportService.userForm.get('StoreId').value)
         StoreId = this._PharmacyreportService.userForm.get('StoreId').value.StoreId
       debugger
       
      this._PharmacyreportService.getItemwisedailysales(
        this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd") || '01/01/1900',
        this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd") || '01/01/1900', ItemId,RegNo,
        StoreId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Item Wise Daily sales"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
          this.clearField();
        });
      });

    }, 100);
  }
  viewgetHighRiskDrugReportPdf(){
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
     
       let StoreId=0;
       if (this._PharmacyreportService.userForm.get('StoreId').value)
         StoreId = this._PharmacyreportService.userForm.get('StoreId').value.StoreId
       
      this._PharmacyreportService.getHighriskdrug(
        this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd") || '01/01/1900',
        this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd") || '01/01/1900',
       StoreId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Ward Wise Risck Drug"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
          this.clearField();
        });
      });

    }, 100);
  }
  viewgetPurchaseReOrderListReportPdf(){
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
      
       let StoreId=0;
       if (this._PharmacyreportService.userForm.get('StoreId').value)
         StoreId = this._PharmacyreportService.userForm.get('StoreId').value.StoreId
       
      this._PharmacyreportService.getPurchaseorderlist(StoreId,
        this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd") || '01/01/1900',
        this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd") || '01/01/1900'
       
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Purchase Order List"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
          this.clearField();
        });
      });

    }, 100);
  }
  viewgetPharmacyBillSummaryReportPdf(){
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
    
       let StoreId=0;
       if (this._PharmacyreportService.userForm.get('StoreId').value)
         StoreId = this._PharmacyreportService.userForm.get('StoreId').value.StoreId
       
      this._PharmacyreportService.getPharmacybillsummary(StoreId,
        this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd") || '01/01/1900',
        this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd") || '01/01/1900'
        
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pharmacy Bill Summary"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
          this.clearField();
        });
      });

    }, 100);
  }

  
  viewgetPharmDoctorProfitDReportPdf(){
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
    
      let DoctorID = 0;
      if (this._PharmacyreportService.userForm.get('DoctorID').value)
        DoctorID = this._PharmacyreportService.userForm.get('DoctorID').value.DoctorId
  
      this._PharmacyreportService.getPharmacyDrprofit(
        this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd") || '01/01/1900',
        this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd") || '01/01/1900',DoctorID
        
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pharmacy Doctor Profit"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
          this.clearField();
        });
      });

    }, 100);
  }

     
  

  viewgetDrwisesalesReportPdf() {

    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;

      debugger

      let DoctorID = 0;
      if (this._PharmacyreportService.userForm.get('DoctorID').value)
        DoctorID = this._PharmacyreportService.userForm.get('DoctorID').value.DoctorId

      let storeId = 0;
      if (this.StoreId) {
        storeId = this.StoreId
      }

      this.OPIPType = parseInt(this._PharmacyreportService.userForm.get('OPIPType').value)

      this._PharmacyreportService.getDrwisesales(
        this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd") || '01/01/1900',
        this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd") || '01/01/1900',
        storeId, DoctorID, this.OPIPType

      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pharmacy Doctor Wise Sales Report"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
          this.clearField();
        });
      });

    }, 100);
  }

   
  viewgetDrwiseprofitdetailReportPdf(){
    
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
    
      // let storeId =this._loggedUser.currentUserValue.user.storeId;
      // if (this._PharmacyreportService.userForm.get('StoreId').value.StoreId)
      //   storeId = this._PharmacyreportService.userForm.get('StoreId').value.StoreId

      this.OPIPType= parseInt(this._PharmacyreportService.userForm.get('OPIPType').value)
      debugger

      let DoctorID = 0;
      if (this._PharmacyreportService.userForm.get('DoctorID').value)
        DoctorID = this._PharmacyreportService.userForm.get('DoctorID').value.DoctorId

      let storeId=0;
    if(this.StoreId){
      storeId=this.StoreId
    }
  
      this._PharmacyreportService.getDrwiseprofitdetail(
        this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd") || '01/01/1900',
        this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd") || '01/01/1900',storeId,DoctorID,this.OPIPType
        
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pharmacy Doctor Profit Detail Report"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
          this.clearField();
        });
      });

    }, 100);
  }

   
  viewgetDrwiseprofitsummaryReportPdf(){
    
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this.AdList = true;
    this.OPIPType= parseInt(this._PharmacyreportService.userForm.get('OPIPType').value)
 
      let DoctorID = 0;
      if (this._PharmacyreportService.userForm.get('DoctorID').value)
        DoctorID = this._PharmacyreportService.userForm.get('DoctorID').value.DoctorId
      debugger
      this._PharmacyreportService.getdrwiseperofitsummary(
        this.datePipe.transform(this._PharmacyreportService.userForm.get('startdate').value, "yyyy-MM-dd") || '01/01/1900',
        this.datePipe.transform(this._PharmacyreportService.userForm.get('enddate').value, "yyyy-MM-dd") || '01/01/1900',DoctorID,this.OPIPType
        
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pharmacy Doctor Profit Summary Report"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
          this.clearField();
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
  clearField(){
    this._PharmacyreportService.userForm.reset();
    this._PharmacyreportService.userForm.get('startdate').setValue(new Date());
    this._PharmacyreportService.userForm.get('enddate').setValue(new Date());
    this._PharmacyreportService.userForm.get('StoreId').setValue('');
    this._PharmacyreportService.userForm.get('ItemId').setValue('');
    this._PharmacyreportService.userForm.get('RegID').setValue('');
    this._PharmacyreportService.userForm.get("UserId").setValue('');
    this.RegId='';
    this.StoreId='';
    this._PharmacyreportService.userForm.get("OPIPType").setValue('2');
  }
  // resetPage() {
  //   this._PharmacyreportService.userForm.reset();
  //   this.AdList = false;
  //   this.sIsLoading = '';
  // }
  onClose() { }


  convertToWord(e) {

    return converter.toWords(e);
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