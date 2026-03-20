import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatRadioChange } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { DateUpdateComponent } from './date-update/date-update.component';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
import { PaymentmodechangesService } from './paymentmodechanges.service';
import { NewedipamodeComponent } from './newedipamode/newedipamode.component';
import { permissionCodes } from 'app/main/shared/model/permission.model';

@Component({
  selector: 'app-paymentmodechanges',
  templateUrl: './paymentmodechanges.component.html',
  styleUrls: ['./paymentmodechanges.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PaymentmodechangesComponent implements OnInit {

  gridConfig: any;
  f_name: any = ""
  regNo: any = "0"
  l_name: any = ""
  PBillNo: any = "0"
  ReceiptNo: any = "0"
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  f_name1: any = ""
  regNo1: any = "0"
  l_name1: any = ""
  PBillNo1: any = "0"
  ReceiptNo1: any = "0"
  fromDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")



  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild(AirmidTableComponent) grid1: AirmidTableComponent;

  @ViewChild('actionButtonTemplateIP') actionButtonTemplateIP!: TemplateRef<any>;
  @ViewChild('ColorCodeIp') ColorCodeIp!: TemplateRef<any>;

  @ViewChild('actionButtonTemplateOP') actionButtonTemplateOP!: TemplateRef<any>;
  @ViewChild('ColorCodeOP') ColorCodeOP!: TemplateRef<any>;


  @ViewChild('actionButtonTemplateIPAdv') actionButtonTemplateIPAdv!: TemplateRef<any>;
  @ViewChild('ColorCodeIPAdv') ColorCodeIPAdv!: TemplateRef<any>;


  @ViewChild('actionButtonTemplateIP1') actionButtonTemplateIP1!: TemplateRef<any>;
  @ViewChild('ColorCodeIp') ColorCodeIp1!: TemplateRef<any>;

  @ViewChild('actionButtonTemplateOP1') actionButtonTemplateOP1!: TemplateRef<any>;
  @ViewChild('ColorCodeOP') ColorCodeOP1!: TemplateRef<any>;


  @ViewChild('actionButtonTemplateIPAdv1') actionButtonTemplateIPAdv1!: TemplateRef<any>;
  @ViewChild('ColorCodeIPAdv1') ColorCodeIPAdv1!: TemplateRef<any>;

  ngAfterViewInit() {
    this.gridConfigOP.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateOP;
    this.gridConfigOP.columnsList.find(col => col.key === 'label')!.template = this.ColorCodeOP;

    this.gridConfigIP.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateIP;
    this.gridConfigIP.columnsList.find(col => col.key === 'label')!.template = this.ColorCodeIp;

    this.gridConfigIPAdv.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateIPAdv;
    this.gridConfigIPAdv.columnsList.find(col => col.key === 'label')!.template = this.ColorCodeIPAdv;

    this.gridConfigtPay.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateOP1;
    this.gridConfigtPay.columnsList.find(col => col.key === 'label')!.template = this.ColorCodeOP1;

    // this.gridConfigtPay.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateIP1;
    // this.gridConfigtPay.columnsList.find(col => col.key === 'label')!.template = this.ColorCodeIp1;

    // this.gridConfigtPay.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateIPAdv1;
    // this.gridConfigtPay.columnsList.find(col => col.key === 'label')!.template = this.ColorCodeIPAdv1;



  }


  allopdColumns = [
    { heading: "-", key: "label", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
    { heading: "Pay Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 6 },
    { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },

    { heading: "Receipt No", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Bill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "UHID No ", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Bill Amount", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Paid Amount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "NEFT Pay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Pay ATM", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplateOP
    }
  ]

  allopdFilters = [
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "ReceiptNo", fieldValue: "0", opType: OperatorComparer.Equals }
  ]

  gridConfigOP: gridModel = {
    permissionCode: permissionCodes.Paymentmodechanges,
    apiUrl: "paymentpharmacy/OPDPaymentReceiptList",
    columnsList: this.allopdColumns,
    sortField: "RegNo",
    sortOrder: 0,
    filters: this.allopdFilters
  }

  onChangeopd() {
    this.fromDate = this.datePipe.transform(this._PaymentmodechangesService.UseFormGroup.get('startdate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this._PaymentmodechangesService.UseFormGroup.get('enddate').value, "yyyy-MM-dd")
    this.f_name = this._PaymentmodechangesService.UseFormGroup.get('FirstName').value + "%"
    this.l_name = this._PaymentmodechangesService.UseFormGroup.get('LastName').value + "%"
    this.regNo = this._PaymentmodechangesService.UseFormGroup.get('RegNo').value || "0"
    this.PBillNo = this._PaymentmodechangesService.UseFormGroup.get('PBillNo').value || "0"
    this.ReceiptNo = this._PaymentmodechangesService.UseFormGroup.get('ReceiptNo').value || "0"
    this.getfilteropd();
  }

  getfilteropd() {

    this.gridConfig = {
      apiUrl: "paymentpharmacy/OPDPaymentReceiptList",
      columnsList: this.allopdColumns,
      sortField: "RegNo",
      sortOrder: 0,
      filters: [{ fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
      { fieldName: "PBillNo", fieldValue: this.PBillNo, opType: OperatorComparer.Equals },
      { fieldName: "ReceiptNo", fieldValue: this.ReceiptNo, opType: OperatorComparer.Equals }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
    console.log("opd:", this.gridConfig)
  }

  Clearfilteropd(event) {

    console.log(event)
    if (event == 'FirstName')
      this._PaymentmodechangesService.UseFormGroup.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this._PaymentmodechangesService.UseFormGroup.get('LastName').setValue("")
    if (event == 'RegNo')
      this._PaymentmodechangesService.UseFormGroup.get('RegNo').setValue("")
    if (event == 'PBillNo')
      this._PaymentmodechangesService.UseFormGroup.get('PBillNo').setValue("")
    if (event == 'ReceiptNo')
      this._PaymentmodechangesService.UseFormGroup.get('ReceiptNo').setValue("")

    this.onNameFieldChange();
  }

  // IP Receipt
  if_name: any = ""
  iregNo: any = "0"
  il_name: any = ""
  iPBillNo: any = "%"
  iReceiptNo: any = "%"
  ifromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  itoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  allipdColumns = [
    { heading: "-", key: "label", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
    { heading: "Pay Date", key: "payDate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },
    { heading: "Receipt No", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Bill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "UHID No ", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Bill Amt", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Paid Amount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "NEFT Pay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Pay ATM", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplateIP  // Assign ng-template to the column
    }
  ]
  allipdFilters = [
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "From_Dt", fieldValue: this.ifromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.itoDate, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals },
    { fieldName: "ReceiptNo", fieldValue: "%", opType: OperatorComparer.Equals }
  ]

  gridConfigIP: gridModel = {
     permissionCode: permissionCodes.Paymentmodechanges,
    apiUrl: "paymentpharmacy/IPDPaymentReceiptList",
    columnsList: this.allipdColumns,
    sortField: "PaymentId",
    sortOrder: 0,
    filters: this.allipdFilters
  }

  onChangeipd() {
    this.ifromDate = this.datePipe.transform(this._PaymentmodechangesService.UseFormGroup.get('startdate').value, "yyyy-MM-dd")
    this.itoDate = this.datePipe.transform(this._PaymentmodechangesService.UseFormGroup.get('enddate').value, "yyyy-MM-dd")
    this.if_name = this._PaymentmodechangesService.UseFormGroup.get('FirstName').value + "%"
    this.il_name = this._PaymentmodechangesService.UseFormGroup.get('LastName').value + "%"
    this.iregNo = this._PaymentmodechangesService.UseFormGroup.get('RegNo').value || "0"
    this.iPBillNo = this._PaymentmodechangesService.UseFormGroup.get('PBillNo').value || "%"
    this.iReceiptNo = this._PaymentmodechangesService.UseFormGroup.get('ReceiptNo').value || "%"
    this.getfilteripd();
  }

  getfilteripd() {

    this.gridConfigIP = {
      apiUrl: "paymentpharmacy/IPDPaymentReceiptList",
      columnsList: this.allipdColumns,
      sortField: "PaymentId",
      sortOrder: 0,
      filters: [{ fieldName: "F_Name", fieldValue: this.if_name, opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: this.il_name, opType: OperatorComparer.Contains },
      { fieldName: "From_Dt", fieldValue: this.ifromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.itoDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: this.iregNo, opType: OperatorComparer.Equals },
      { fieldName: "PBillNo", fieldValue: this.iPBillNo, opType: OperatorComparer.Equals },
      { fieldName: "ReceiptNo", fieldValue: this.iReceiptNo, opType: OperatorComparer.Equals }
      ]
    }
    this.grid.gridConfig = this.gridConfigIP;
    this.grid.bindGridData();
    console.log("ipd:", this.gridConfigIP)
  }


  af_name: any = ""
  aregNo: any = "0"
  al_name: any = ""
  aPBillNo: any = "0"
  aReceiptNo: any = "0"
  afromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  atoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  allAdColumns = [
    { heading: "-", key: "label", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
    { heading: "Pay Date", key: "payDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
    { heading: "Receipt No", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Bill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "UHID No ", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Bill Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Paid Amount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "NEFT Pay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Pay ATM", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplateIPAdv
    }
  ]
  allAdFilters = [
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "From_Dt", fieldValue: this.afromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.atoDate, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "ReceiptNo", fieldValue: "0", opType: OperatorComparer.Equals }
  ]
  gridConfigIPAdv: gridModel = {
     permissionCode: permissionCodes.Paymentmodechanges,
    apiUrl: "paymentpharmacy/IPAdvPaymentReceiptList",
    columnsList: this.allAdColumns,
    sortField: "PaymentId",
    sortOrder: 0,
    filters: this.allAdFilters
  }

  onChangeAd() {
    this.afromDate = this.datePipe.transform(this._PaymentmodechangesService.UseFormGroup.get('startdate').value, "yyyy-MM-dd")
    this.atoDate = this.datePipe.transform(this._PaymentmodechangesService.UseFormGroup.get('enddate').value, "yyyy-MM-dd")
    this.af_name = this._PaymentmodechangesService.UseFormGroup.get('FirstName').value + "%"
    this.al_name = this._PaymentmodechangesService.UseFormGroup.get('LastName').value + "%"
    this.aregNo = this._PaymentmodechangesService.UseFormGroup.get('RegNo').value || "0"
    this.aPBillNo = this._PaymentmodechangesService.UseFormGroup.get('PBillNo').value || "0"
    this.aReceiptNo = this._PaymentmodechangesService.UseFormGroup.get('ReceiptNo').value || "0"
    this.getfilterAd();
  }

  getfilterAd() {

    this.gridConfigIP = {
      apiUrl: "paymentpharmacy/IPAdvPaymentReceiptList",
      columnsList: this.allAdColumns,
      sortField: "PaymentId",
      sortOrder: 0,
      filters: [{ fieldName: "F_Name", fieldValue: this.af_name, opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: this.al_name, opType: OperatorComparer.Contains },
      { fieldName: "From_Dt", fieldValue: this.afromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.atoDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: this.aregNo, opType: OperatorComparer.Equals },
      { fieldName: "PBillNo", fieldValue: this.aPBillNo, opType: OperatorComparer.Equals },
      { fieldName: "ReceiptNo", fieldValue: this.aReceiptNo, opType: OperatorComparer.Equals }
      ]
    }
    this.grid.gridConfig = this.gridConfigIPAdv;
    this.grid.bindGridData();
    console.log("Ad:", this.gridConfigIPAdv)
  }

  sIsLoading: string = '';
  isLoading = true;

  dsPaymentChanges = new MatTableDataSource<PaymentChange>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public _PaymentmodechangesService: PaymentmodechangesService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.gridConfig = this.gridConfigOP;

    this._PaymentmodechangesService.UseFormGroup.get('Radio')?.valueChanges.subscribe((value) => {
      if (value === '0') {
        this.gridConfig = this.gridConfigOP;
      } else if (value === '1') {
        this.gridConfig = this.gridConfigIP;
      } else if (value === '2') {
        this.gridConfig = this.gridConfigIPAdv;
      }
    });
  }

  onNameFieldChange(): void {

    const selectedType = this._PaymentmodechangesService.UseFormGroup.get('Radio')?.value;

    if (selectedType === '0' || selectedType === 0) {
      this.onChangeopd();
    } else if (selectedType === '1' || selectedType === 1) {
      this.onChangeipd();
    } else if (selectedType === '2' || selectedType === 2) {
      this.onChangeAd()
    }
  }

  onRadioChange(event: MatRadioChange) {

    const selectedValue = event.value;
    if (selectedValue === '0' || selectedValue === 0) {
      this.onChangeopd();
    } else if (selectedValue === '1' || selectedValue === 1) {
      this.onChangeipd();
    } else if (selectedValue === '2' || selectedValue === 2) {
      this.onChangeAd();
    }
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onEdit(row) {
    console.log(row)
    const dialogRef = this._matDialog.open(EditPaymentComponent,
      {
        height: "99%",
        width: '80%',
        data: {
          registerObj: row,
          FromName: "IP-PaymentModeChange"
        },

      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.grid.bindGridData();

    });
  }


  onEdit1(row) {
    console.log(row)
    const dialogRef = this._matDialog.open(NewedipamodeComponent,
      {
        height: "85%",
        width: '80%',
        data: {
          registerObj: row,
          FromName: "IP-PaymentModeChange"
        },

      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.grid.bindGridData();

    });
  }
  PaymentDate(contact, ID) {
    console.log(contact)
    const dialogRef = this._matDialog.open(DateUpdateComponent,
      {
        maxHeight: "35vh",
        maxWidth: '90vh',
        width: '100%',
        // data: contact
        data: {
          registerObj: contact,
          FromName: ID
        },
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
       this.grid1.bindGridData();
      console.log('The dialog was closed - Insert Action', result);

    });
  }
  //tPay
  alltPayColumns = [
    { heading: "-", key: "label", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
    { heading: "Pay Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 100, type: 6 },
    { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },

    { heading: "Receipt No", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Bill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "UHID No ", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Bill Amount", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Paid Amount", key: "payAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    // { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    // { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    // { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    // { heading: "NEFT Pay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    // { heading: "Pay ATM", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplateOP1
    }
  ]

  alltPayFilters = [
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "From_Dt", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate1, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "ReceiptNo", fieldValue: "0", opType: OperatorComparer.Equals }
  ]

  gridConfigtPay: gridModel = {
    apiUrl: "PaymentMode/OPBillListForPaymentModeChangeList",
    columnsList: this.alltPayColumns,
    sortField: "RegNo",
    sortOrder: 0,
    filters: this.alltPayFilters
  }

  onChangetPay() {
    debugger
    this.fromDate1 = this.datePipe.transform(this._PaymentmodechangesService.tpayFormGroup.get('startdate').value, "yyyy-MM-dd")
    this.toDate1 = this.datePipe.transform(this._PaymentmodechangesService.tpayFormGroup.get('enddate').value, "yyyy-MM-dd")
    this.f_name1 = this._PaymentmodechangesService.tpayFormGroup.get('FirstName').value + "%"
    this.l_name1 = this._PaymentmodechangesService.tpayFormGroup.get('LastName').value + "%"
    this.regNo1 = this._PaymentmodechangesService.tpayFormGroup.get('RegNo').value || "0"
    this.PBillNo1 = this._PaymentmodechangesService.tpayFormGroup.get('PBillNo').value || "0"
    this.ReceiptNo1 = this._PaymentmodechangesService.tpayFormGroup.get('ReceiptNo').value || "0"
    this.getfiltertPay();
  }

  getfiltertPay() {
    debugger
    this.gridConfigtPay = {
      apiUrl: "PaymentMode/OPBillListForPaymentModeChangeList",
      columnsList: this.alltPayColumns,
      sortField: "RegNo",
      sortOrder: 0,
      filters: [{ fieldName: "F_Name", fieldValue: this.f_name1, opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: this.l_name1, opType: OperatorComparer.Contains },
      { fieldName: "From_Dt", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate1, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: this.regNo1, opType: OperatorComparer.Equals },
      { fieldName: "PBillNo", fieldValue: this.PBillNo1, opType: OperatorComparer.Equals },
      { fieldName: "ReceiptNo", fieldValue: this.ReceiptNo1, opType: OperatorComparer.Equals }
      ]
    }
    this.grid1.gridConfig = this.gridConfigtPay;
    this.grid1.bindGridData();
    console.log("opd:", this.gridConfig)
  }

  ClearfiltertPay(event) {

    console.log(event)
    if (event == 'FirstName')
      this._PaymentmodechangesService.tpayFormGroup.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this._PaymentmodechangesService.tpayFormGroup.get('LastName').setValue("")
    if (event == 'RegNo')
      this._PaymentmodechangesService.tpayFormGroup.get('RegNo').setValue("")
    if (event == 'PBillNo')
      this._PaymentmodechangesService.tpayFormGroup.get('PBillNo').setValue("")
    if (event == 'ReceiptNo')
      this._PaymentmodechangesService.tpayFormGroup.get('ReceiptNo').setValue("")

    this.onNameFieldChange();
  }



}

export class tPaymentChange {
  paymentId: any
  billNo: any
  receiptNo: any
  paymentDate: any
  payAmount: any
  payMode: any
  tranNo: any
  bankName: any
  validationDate: any
  advanceUsedAmount: any
  onlineTranNo: any
  onlineTranResponse: any
  payMode1: any
  // 'advanceId',
  // 'refundId',
  cashCounterId: any
  transactionType: any
  isSelfORCompany: any
  tranMode: any
  comments: any
  opdipdType: any
  patientName: any
  vCardCheckStatus: any

  constructor(tPaymentChange) {
    {

      this.paymentId = tPaymentChange.paymentId || 0;
      this.billNo = tPaymentChange.billNo || 0;
      this.receiptNo = tPaymentChange.receiptNo || '';
      this.paymentDate = tPaymentChange.paymentDate || '';
      this.payAmount = tPaymentChange.payAmount || "";
      this.payMode = tPaymentChange.payMode || '';
      this.tranNo = tPaymentChange.tranNo || '';
      this.bankName = tPaymentChange.bankName || '';
      this.validationDate = tPaymentChange.validationDate || '';
      this.advanceUsedAmount = tPaymentChange.advanceUsedAmount || 0;
      this.onlineTranNo = tPaymentChange.onlineTranNo || '';

      this.onlineTranResponse = tPaymentChange.onlineTranResponse || 0;
      this.cashCounterId = tPaymentChange.cashCounterId || 0;
      this.transactionType = tPaymentChange.transactionType || '';
      this.isSelfORCompany = tPaymentChange.isSelfORCompany || "";
      this.tranMode = tPaymentChange.tranMode || '';
      this.comments = tPaymentChange.comments || '';
      this.opdipdType = tPaymentChange.opdipdType || 0;
      this.patientName = tPaymentChange.patientName || '';
      this.payMode1 = tPaymentChange.payMode1 || '';
      this.vCardCheckStatus = tPaymentChange.vCardCheckStatus || true;



    }
  }

}


export class PaymentChange {
  PayDate: any;
  BillNo: any;
  RegNo: number;
  PatientName: string;
  BillAmt: any;
  PaidAmt: any;
  CashAmt: number;
  ChequeAmt: any;
  CardAmt: number;
  User: any;

  Date: number;
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
  paymentId: any;
  billNo: any;
  NeftPay: any;
  receiptNo: any;
  advanceUsedAmount: any;
  advanceId: any;
  refundId: any;
  transactionType: any;
  remark: any
  addBy: any
  chequeDate: any
  cardDate: any
  pBillNo: any
  cashCounterId: any

  isSelfOrcompany: any
  chCashPayAmount: any
  chChequePayAmount: any
  chCardPayAmount: any
  chAdvanceUsedAmount: any
  chNeftpayAmount: any
  chPayTmamount: any
  tranMode: any
  companyId: any
  wfamount: any;
  tdsamount: any
  strId: any
  opdipdtype: any
  PaymentId: any
  Neftdate: any

  bankName: any
  tranNo: any
  onlineTranNo: any
  payMode1: any
  currentDate = new Date().toISOString()
  salesId: any

  constructor(PaymentChange) {
    {
      this.PayDate = PaymentChange.PayDate || 0;
      this.BillNo = PaymentChange.BillNo || 0;
      this.RegNo = PaymentChange.RegNo || 0;
      this.PatientName = PaymentChange.PatientName || "";
      this.BillAmt = PaymentChange.BillAmt || 0;
      this.PaidAmt = PaymentChange.PaidAmt || 0;
      this.ChequeAmt = PaymentChange.ChequeAmt || 0;
      this.ChequeAmt = PaymentChange.ChequeAmt || 0;
      this.CardAmt = PaymentChange.CardAmt || 0;
      this.User = PaymentChange.User || '';

      this.Date = PaymentChange.Date || 0;
      this.ReceiptNo = PaymentChange.ReceiptNo || 0;
      this.SalesNo = PaymentChange.SalesNo || 0;
      this.patientName = PaymentChange.patientName || "";
      this.paidAmount = PaymentChange.paidAmount || 0;
      this.cashPayAmount = PaymentChange.cashPayAmount || 0;
      this.chequePayAmount = PaymentChange.chequePayAmount || 0;
      this.ChequeNo = PaymentChange.ChequeNo || 0;
      this.ChequeBankName = PaymentChange.ChequeBankName || 0;
      this.cardPayAmount = PaymentChange.cardPayAmount || 0;
      this.CardBankName = PaymentChange.CardBankName || '';
      this.CardNo = PaymentChange.CardNo || 0;
      this.neftPayAmount = PaymentChange.neftPayAmount || 0;
      this.NEFTNo = PaymentChange.NEFTNo || 0;
      this.NEFTBankName = PaymentChange.NEFTBankName || '';
      this.paymentId = PaymentChange.paymentId || 0;
      this.billNo = PaymentChange.billNo || 0;
      this.receiptNo = PaymentChange.receiptNo || 0;
      this.chequeDate = PaymentChange.chequeDate || this.currentDate;
      this.cardDate = PaymentChange.cardDate || this.currentDate;

      this.advanceUsedAmount = PaymentChange.advanceUsedAmount || 0;
      this.advanceId = PaymentChange.advanceId || 0;
      this.refundId = PaymentChange.refundId || 0;
      this.transactionType = PaymentChange.transactionType || 0;
      this.remark = PaymentChange.remark || 0;
      this.addBy = PaymentChange.addBy || 0;
      this.PaymentId = PaymentChange.PaymentId || 0;
      this.payTMAmount = PaymentChange.payTMAmount || 0;
      this.PayTMTranNo = PaymentChange.PayTMTranNo || 0;
      this.TarrifName = PaymentChange.TarrifName || 0;
      this.NetAmount = PaymentChange.NetAmount || 0;
      this.CashAmt = PaymentChange.CashAmt || 0;
      this.ChequeAmt = PaymentChange.ChequeAmt || 0;
      this.CardAmt = PaymentChange.CardAmt || 0;
      this.NeftPay = PaymentChange.NeftPay || 0;
      this.pBillNo = PaymentChange.pBillNo || 0;
      this.cashCounterId = PaymentChange.cashCounterId || 0;
      this.chChequePayAmount = PaymentChange.chChequePayAmount || 0;
      this.chCashPayAmount = PaymentChange.chCashPayAmount || 0;
      this.chCardPayAmount = PaymentChange.chCardPayAmount || 0;
      this.chAdvanceUsedAmount = PaymentChange.chAdvanceUsedAmount || 0;
      this.chNeftpayAmount = PaymentChange.chNeftpayAmount || 0;
      this.chPayTmamount = PaymentChange.chPayTmamount || 0;
      this.tranMode = PaymentChange.tranMode || '';
      this.companyId = PaymentChange.companyId || 0;
      this.wfamount = PaymentChange.wfamount || 0;
      this.tdsamount = PaymentChange.tdsamount || 0;
      this.Neftdate = PaymentChange.Neftdate || this.currentDate;
      this.strId = PaymentChange.strId || 0;
      this.opdipdtype = PaymentChange.opdipdtype || 1;
      this.bankName = PaymentChange.bankName || '';
      this.tranNo = PaymentChange.tranNo || '';
      this.onlineTranNo = PaymentChange.onlineTranNo || '';
      this.payMode1 = PaymentChange.payMode1 || '';
this.salesId = PaymentChange.salesId || 0;



    }
  }

}
