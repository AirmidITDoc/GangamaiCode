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
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplateSale') actionButtonTemplateSale!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('ColorCodeIp') ColorCodeIp!: TemplateRef<any>;
  @ViewChild('ColorCodeSale') ColorCodeSale!: TemplateRef<any>;

  ngOnInit(): void {
    this.gridConfig = this.gridConfigIpPhy;

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

  gridConfigSales: gridModel = {
    apiUrl: "paymentpharmacy/BrowsePharmacyPayReceiptList",
    columnsList: [
      { heading: "-", key: "oP_IP_Type", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
      { heading: "PayDate", key: "paydate", sort: true, align: 'left', emptySign: 'NA', width: 80,type:9 },
      { heading: "ReceiptNo", key: "receiptno", sort: true, align: 'left', emptySign: 'NA', width: 100 },
      { heading: "SalesNo", key: "salesno", sort: true, align: 'left', emptySign: 'NA', width: 100 },
      { heading: "PatientName", key: "patientname", sort: true, align: 'left', emptySign: 'NA', width: 100 },
      { heading: "PaidAmount", key: "paidamount", sort: true, align: 'left', emptySign: 'NA', width: 100 },
      { heading: "CashAmount", key: "cashamount", sort: true, align: 'left', emptySign: 'NA', width: 50 },
      { heading: "ChequeAmount", key: "chequeamount", sort: true, align: 'left', emptySign: 'NA', width: 60 },
      { heading: "CardAmount", key: "cardamount", sort: true, align: 'left', emptySign: 'NA', width: 50 },
      { heading: "NEFTPay", key: "neftpay", sort: true, align: 'left', emptySign: 'NA', width: 50 },
      { heading: "PayATM", key: "payatm", sort: true, align: 'left', emptySign: 'NA', width: 50 },
      {
        heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
        template: this.actionButtonTemplateSale  // Assign ng-template to the column
    }
    ],
    sortField: "PaymentId",
    sortOrder: 0,
    filters: [
      { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
      { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
      { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals }, //year from 2021 to 2025
      { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "SalesNo", fieldValue: "0", opType: OperatorComparer.StartsWith },
      { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals },
    ],
    row: 25
  }

  gridConfigIpPhy: gridModel = {
    apiUrl: "Administration/BrowseIPAdvPayPharReceiptList1",
    columnsList: [
      { heading: "-", key: "oP_IP_Type", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
      { heading: "PayDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 200, type:6 },
      { heading: "ReceiptNo", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA'},
      { heading: "SalesNo", key: "salesNo", sort: true, align: 'left', emptySign: 'NA'},
      { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
      { heading: "PaidAmount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA'},
      { heading: "CashAmount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA'},
      { heading: "ChequeAmount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA'},
      { heading: "CardAmount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA'},
      { heading: "NEFTPay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA'},
      { heading: "PayATM", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA'},
      {
        heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
        template: this.actionButtonTemplate  // Assign ng-template to the column
    }
    ],
    sortField: "PaymentId",
    sortOrder: 0,
    filters: [
      { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
      { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
      { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals }, //year from 2021 to 2025
      { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "SalesNo", fieldValue: "0", opType: OperatorComparer.StartsWith },
      { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals },
    ],
    row: 25
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
  getSearchList() {
    if (this._PaymentmodechangeforpharmacyService.userFormGroup.get('Radio').value == '1') {
      this.getSalesList();
    } else {
      this.getIPPharAdvanceList();
    }
  }
  getIPPharAdvanceList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
      'F_Name': this._PaymentmodechangeforpharmacyService.userFormGroup.get('FirstName').value || '%',
      'L_Name': this._PaymentmodechangeforpharmacyService.userFormGroup.get('LastName').value || '%',
      'FromDate': this.datePipe.transform(this._PaymentmodechangeforpharmacyService.userFormGroup.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      'ToDate': this.datePipe.transform(this._PaymentmodechangeforpharmacyService.userFormGroup.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      'Reg_No': this._PaymentmodechangeforpharmacyService.userFormGroup.get('RegNo').value || 0,
      'SalesNo': this._PaymentmodechangeforpharmacyService.userFormGroup.get('SalesNo').value || 0,
    }
    this._PaymentmodechangeforpharmacyService.getIpPharAdvanceList(vdata).subscribe(data => {
      this.dsPaymentPharmacyList.data = data as PaymentPharmayList[];
      console.log(this.dsPaymentPharmacyList.data)
      this.dsPaymentPharmacyList.sort = this.sort;
      this.dsPaymentPharmacyList.paginator = this.paginator;

      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  getSalesList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
      'F_Name': this._PaymentmodechangeforpharmacyService.userFormGroup.get('FirstName').value || '%',
      'L_Name': this._PaymentmodechangeforpharmacyService.userFormGroup.get('LastName').value || '%',
      'FromDate': this.datePipe.transform(this._PaymentmodechangeforpharmacyService.userFormGroup.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      'ToDate': this.datePipe.transform(this._PaymentmodechangeforpharmacyService.userFormGroup.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      'Reg_No': this._PaymentmodechangeforpharmacyService.userFormGroup.get('RegNo').value || 0,
      'SalesNo': this._PaymentmodechangeforpharmacyService.userFormGroup.get('SalesNo').value || 0,
      // 'StoreId':this._PaymentmodechangeforpharmacyService.userFormGroup.get('StoreId').value.storeid || 0,
    }
    this._PaymentmodechangeforpharmacyService.getSalesNoList(vdata).subscribe(data => {
      this.dsPaymentPharmacyList.data = data as PaymentPharmayList[];
      this.dsPaymentPharmacyList.sort = this.sort;
      this.dsPaymentPharmacyList.paginator = this.paginator;
      console.log(this.dsPaymentPharmacyList.data)
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
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
      this.getSalesList();
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

