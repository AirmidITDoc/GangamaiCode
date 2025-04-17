import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PaymentmodechangesforpharmacyService } from './paymentmodechangesfor-pharmacy.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { EditPaymentmodeComponent } from './edit-paymentmode/edit-paymentmode.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { MatRadioChange } from '@angular/material/radio';
import { BillDateUpdateComponent } from '../cancellation/bill-date-update/bill-date-update.component';

@Component({
  selector: 'app-paymentmodechangesfor-pharmacy',
  templateUrl: './paymentmodechangesfor-pharmacy.component.html',
  styleUrls: ['./paymentmodechangesfor-pharmacy.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PaymentmodechangesforPharmacyComponent implements OnInit {
  //   displayedColumns:string[] = [
  //     'Type',
  //     'Date',
  //     'ReceiptNo',
  //     'SalesNo',
  //     'PatientName',
  //     'PaidAmount',
  //     'CashAmt',
  //     'ChequeAmt',
  //     'CardAmt',
  //     'NeftPay',
  //      'PayAtm',
  //      'action',
  //   ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public _PaymentmodechangeforpharmacyService: PaymentmodechangesforpharmacyService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  gridConfig: any;
  

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplateSale') actionButtonTemplateSale!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('ColorCodeIp') ColorCodeIp!: TemplateRef<any>;
  @ViewChild('ColorCodeSale') ColorCodeSale!: TemplateRef<any>;

  ngOnInit(): void {
    this.gridConfig = this.gridConfigSales;

    this._PaymentmodechangeforpharmacyService.userFormGroup.get('Radio')?.valueChanges.subscribe((value) => {
      console.log("Radio changed to:", value);
      this.gridConfig = value === '0' ? this.gridConfigSales : this.gridConfigIpPhy;
    });

    console.log("GridConfig:", this.gridConfig)
  }

  ngAfterViewInit() {
    // Assign the template to the column dynamically
    this.gridConfigSales.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateSale; 
    this.gridConfigSales.columnsList.find(col => col.key === 'oP_IP_Type')!.template = this.ColorCodeSale; 
    this.gridConfigIpPhy.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;  
    this.gridConfigIpPhy.columnsList.find(col => col.key === 'oP_IP_Type')!.template = this.ColorCodeIp; 
}

f_name: any = ""
regNo: any = "0"
l_name: any = ""
SalesNo: any = "0"
fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

pf_name: any = ""
pregNo: any = "0"
pl_name: any = ""
pSalesNo: any = "0"
pfromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
ptoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

onNameFieldChange(): void {
  debugger
  const selectedType = this._PaymentmodechangeforpharmacyService.userFormGroup.get('Radio')?.value;

  if (selectedType === '0' || selectedType === 0) {
    this.onChangeopd();
  } else if (selectedType === '1' || selectedType === 1) {
    this.onChange();
  }
}

allColumns=[
  { heading: "-", key: "oP_IP_Type", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
  { heading: "PayDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 150,type:6 },
  { heading: "ReceiptNo", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
  { heading: "SalesNo", key: "salesNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
  { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
  { heading: "PaidAmount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', width: 100 },
  { heading: "CashAmount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 },
  { heading: "ChequeAmount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 },
  { heading: "CardAmount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 },
  { heading: "NEFTPay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 },
  { heading: "PayATM", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 },
  {
    heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
    template: this.actionButtonTemplateSale  // Assign ng-template to the column
}
]

allFilters=[
  { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
  { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
  { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals }, //year from 2021 to 2025
  { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
  { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
  { fieldName: "SalesNo", fieldValue: "0", opType: OperatorComparer.StartsWith }
]

  gridConfigSales: gridModel = {
    apiUrl: "paymentpharmacy/BrowsePharmacyPayReceiptList",
    columnsList: this.allColumns,
    sortField: "PaymentId",
    sortOrder: 0,
    filters: this.allFilters
  }
  
  onChangeopd() {
    this.fromDate = this.datePipe.transform(this._PaymentmodechangeforpharmacyService.userFormGroup.get('startdate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this._PaymentmodechangeforpharmacyService.userFormGroup.get('enddate').value, "yyyy-MM-dd")
    this.f_name = this._PaymentmodechangeforpharmacyService.userFormGroup.get('FirstName').value + "%"
    this.l_name = this._PaymentmodechangeforpharmacyService.userFormGroup.get('LastName').value + "%"
    this.regNo = this._PaymentmodechangeforpharmacyService.userFormGroup.get('RegNo').value || "0"
    this.SalesNo = this._PaymentmodechangeforpharmacyService.userFormGroup.get('SalesNo').value || "0"
    this.getfilteropd();
}

getfilteropd() {
  debugger    
  this.gridConfigSales = {
      apiUrl: "paymentpharmacy/BrowsePharmacyPayReceiptList",
      columnsList: this.allColumns,
      sortField: "PaymentId",
      sortOrder: 0,
      filters: [{ fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
      { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
      { fieldName: "SalesNo", fieldValue: this.SalesNo, opType: OperatorComparer.Equals }
      ]
  }
  this.grid.gridConfig = this.gridConfigSales;
  this.grid.bindGridData();
  console.log("opd:",this.gridConfigSales)
}

Clearfilteropd(event) {
  debugger
  console.log(event)
  if (event == 'FirstName')
      this._PaymentmodechangeforpharmacyService.userFormGroup.get('FirstName').setValue("")
  else
      if (event == 'LastName')
          this._PaymentmodechangeforpharmacyService.userFormGroup.get('LastName').setValue("")
  if (event == 'RegNo')
      this._PaymentmodechangeforpharmacyService.userFormGroup.get('RegNo').setValue("")
  if (event == 'SalesNo')
      this._PaymentmodechangeforpharmacyService.userFormGroup.get('SalesNo').setValue("")

  this.onNameFieldChange();
}

allColumns1=[

  { heading: "-", key: "oP_IP_Type", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
  { heading: "PayDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 150,type:6 },
  { heading: "ReceiptNo", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
  { heading: "SalesNo", key: "salesNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
  { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
  { heading: "PaidAmount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', width: 100 },
  { heading: "CashAmount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 },
  { heading: "ChequeAmount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 },
  { heading: "CardAmount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 },
  { heading: "NEFTPay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 },
  { heading: "PayATM", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 },
  {
    heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
    template: this.actionButtonTemplateSale  // Assign ng-template to the column
}
]
allFilters1=[
  { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
  { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
  { fieldName: "FromDate", fieldValue: this.pfromDate, opType: OperatorComparer.Equals }, //year from 2021 to 2025
  { fieldName: "ToDate", fieldValue: this.ptoDate, opType: OperatorComparer.Equals },
  { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
  { fieldName: "SalesNo", fieldValue: "0", opType: OperatorComparer.StartsWith }
]

  gridConfigIpPhy: gridModel = {
    apiUrl: "Administration/BrowseIPAdvPayPharReceiptList1",
    columnsList: this.allColumns1,
    sortField: "PaymentId",
    sortOrder: 0,
    filters: this.allFilters1
  }

  onChange() {
    this.pfromDate = this.datePipe.transform(this._PaymentmodechangeforpharmacyService.userFormGroup.get('startdate').value, "yyyy-MM-dd")
    this.ptoDate = this.datePipe.transform(this._PaymentmodechangeforpharmacyService.userFormGroup.get('enddate').value, "yyyy-MM-dd")
    this.pf_name = this._PaymentmodechangeforpharmacyService.userFormGroup.get('FirstName').value + "%"
    this.pl_name = this._PaymentmodechangeforpharmacyService.userFormGroup.get('LastName').value + "%"
    this.pregNo = this._PaymentmodechangeforpharmacyService.userFormGroup.get('RegNo').value || "0"
    this.pSalesNo = this._PaymentmodechangeforpharmacyService.userFormGroup.get('SalesNo').value || "0"
    this.getfilter();
}

getfilter() {
  debugger    
  this.gridConfigIpPhy = {
      apiUrl: "Administration/BrowseIPAdvPayPharReceiptList1",
      columnsList: this.allColumns1,
      sortField: "PaymentId",
      sortOrder: 0,
      filters: [{ fieldName: "F_Name", fieldValue: this.pf_name, opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: this.pl_name, opType: OperatorComparer.Contains },
      { fieldName: "FromDate", fieldValue: this.pfromDate, opType: OperatorComparer.Equals },
      { fieldName: "ToDate", fieldValue: this.ptoDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: this.pregNo, opType: OperatorComparer.Equals },
      { fieldName: "SalesNo", fieldValue: this.pSalesNo, opType: OperatorComparer.Equals }
      ]
  }
  this.grid.gridConfig = this.gridConfigIpPhy;
  this.grid.bindGridData();
  console.log("hhh:",this.gridConfigIpPhy)
}

// Clearfilter(event) {
//   debugger
//   console.log(event)
//   if (event == 'FirstName')
//       this._PaymentmodechangeforpharmacyService.userFormGroup.get('FirstName').setValue("")
//   else
//       if (event == 'LastName')
//           this._PaymentmodechangeforpharmacyService.userFormGroup.get('LastName').setValue("")
//   if (event == 'RegNo')
//       this._PaymentmodechangeforpharmacyService.userFormGroup.get('RegNo').setValue("")
//   if (event == 'SalesNo')
//       this._PaymentmodechangeforpharmacyService.userFormGroup.get('SalesNo').setValue("")

//   this.onChange();
// }

onRadioChange(event: MatRadioChange) {
  debugger
  const selectedValue = event.value;
  if (selectedValue === '0' || selectedValue === 0) {
    this.onChangeopd();
  } else if (selectedValue === '1' || selectedValue === 1) {
    this.onChange();
  }
}

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    let that = this;
    // const dialogRef = this._matDialog.open( NewcreateUserComponent, 
    //     {
    //         maxHeight: '95vh',
    //         width: '90%',
    //         data: row
    //     });
    // dialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //         that.grid.bindGridData();
    //     }
    // });
  }

  OnUpdate(row){
const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    let that = this;
    const dialogRef = this._matDialog.open( BillDateUpdateComponent, 
        {
            maxHeight: "35vh",
            maxWidth: '90vh',
            width: '100%',
            data: row
        });
    dialogRef.afterClosed().subscribe(result => {
        // if (result) {
            this.grid.bindGridData();
        // }
    });
  }
  
  sIsLoading: string = '';
  isLoading = true;
  dateTimeObj: any;


  dsPaymentPharmacyList = new MatTableDataSource<PaymentPharmayList>();

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  
  onEdit(m) {
    console.log(m)
    let xx = {
      UserId: m.UserId,
      FirstName: m.FirstName,
      LastName: m.LastName,
      UserLoginName: m.UserLoginName,
      IsActive: m.IsActive,
      AddedBy: m.AddedBy,
      RoleName: m.RoleName,
      RoleId: m.RoleId,
      UserName: m.UserName,
      StoreId: m.StoreId,
      StoreName: m.StoreName,
      IsDoctorType: m.IsDoctorType,
      DoctorID: m.DoctorID,
      DoctorName: m.DoctorName,
      IsPOVerify: m.IsPOVerify,
      IsGRNVerify: m.IsGRNVerify,
      IsCollection: m.IsCollection,
      IsBedStatus: m.IsBedStatus,
      IsCurrentStk: m.IsCurrentStk,
      IsPatientInfo: m.IsPatientInfo,
      IsDateInterval: m.IsDateInterval,
      IsDateIntervalDays: m.IsDateIntervalDays,
      MailId: m.MailId,
      MailDomain: m.MailDomain,
      AddChargeIsDelete: m.AddChargeIsDelete,
      IsIndentVerify: m.IsIndentVerify,
      IsInchIndVfy: m.IsInchIndVfy,
    };
    this.advanceDataStored.storage = new PaymentPharmayList(xx);
    const dialogRef = this._matDialog.open(EditPaymentmodeComponent,
      {
        height: "85%",
        width: '75%',
        data: {
          registerObj: m,
          FromName: "Pharma-PaymentModeChange"
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.grid.bindGridData();
    });
  }
  BillDate() {
    Swal.fire('Api Error !', 'Bill Date Update!')
  }

}
export class PaymentPharmayList {
  Date: Number;
  ReceiptNo: number;
  SalesNo: number;
  patientName: string;
  paidAmount: number;
  cashPayAmount: number;
  chequePayAmount: number;
  ChequeNo: any;
  ChequeBankName: any;
  cardPayAmount: number;
  CardNo: any;
  CardBankName: any;
  neftPayAmount: any;
  NEFTNo: any;
  NEFTBankName: any;
  payTMAmount: any;
  PayTMTranNo: any;
  // PaymentId: any;
  TarrifName: any;
  NetAmount: any;
  paymentId:any;
  billNo:any;
  CashAmt: any;
  ChequeAmt: any;
  CardAmt: any;
  NeftPay: any;
  receiptNo:any;
  advanceUsedAmount:any;
advanceId:any;
refundId:any;
transactionType:any;
remark:any
addBy:any
chequeDate:any
cardDate:any
  // PaidAmount:any;

  constructor(PaymentPharmayList) {
    {
      this.Date = PaymentPharmayList.Date || 0;
      this.ReceiptNo = PaymentPharmayList.ReceiptNo || 0;
      this.SalesNo = PaymentPharmayList.SalesNo || 0;
      this.patientName = PaymentPharmayList.patientName || "";
      this.paidAmount = PaymentPharmayList.paidAmount || 0;
      this.cashPayAmount = PaymentPharmayList.cashPayAmount || 0;
      this.chequePayAmount = PaymentPharmayList.chequePayAmount || 0;
      this.ChequeNo = PaymentPharmayList.ChequeNo || 0;
      this.ChequeBankName = PaymentPharmayList.ChequeBankName || 0;
      this.cardPayAmount = PaymentPharmayList.cardPayAmount || 0;
      this.CardBankName = PaymentPharmayList.CardBankName || '';
      this.CardNo = PaymentPharmayList.CardNo || 0;
      this.neftPayAmount = PaymentPharmayList.neftPayAmount || 0;
      this.NEFTNo = PaymentPharmayList.NEFTNo || 0;
      this.NEFTBankName = PaymentPharmayList.NEFTBankName || '';
      this.paymentId=PaymentPharmayList.paymentId || 0;
      this.billNo=PaymentPharmayList.billNo || 0;
      this.receiptNo=PaymentPharmayList.receiptNo || 0;
      this.chequeDate=PaymentPharmayList.chequeDate || 0;
      this.cardDate=PaymentPharmayList.cardDate || 0;

      this.advanceUsedAmount=PaymentPharmayList.advanceUsedAmount || 0;
      this.advanceId=PaymentPharmayList.advanceId || 0;
      this.refundId=PaymentPharmayList.refundId || 0;
      this.transactionType=PaymentPharmayList.transactionType || 0;
      this.remark=PaymentPharmayList.remark || 0;
      this.addBy=PaymentPharmayList.addBy || 0;
      // this.PaymentId = PaymentPharmayList.PaymentId || 0;
      this.payTMAmount = PaymentPharmayList.payTMAmount || 0;
      this.PayTMTranNo = PaymentPharmayList.PayTMTranNo || 0;
      this.TarrifName = PaymentPharmayList.TarrifName || 0;
      this.NetAmount = PaymentPharmayList.NetAmount || 0;
      this.CashAmt = PaymentPharmayList.CashAmt || 0;
      this.ChequeAmt = PaymentPharmayList.ChequeAmt || 0;
      this.CardAmt = PaymentPharmayList.CardAmt || 0;
      this.NeftPay = PaymentPharmayList.NeftPay || 0;
      // this.PaidAmount = PaymentPharmayList.PaidAmount || 0;
    }
  }
}

