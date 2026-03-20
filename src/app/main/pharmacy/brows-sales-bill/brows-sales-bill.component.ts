import { DatePipe } from '@angular/common';
import { Component, ComponentRef, ElementRef, HostListener, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import * as converter from 'number-to-words';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { Printsal } from '../sales/sales.component';
import { SalesService } from '../sales/sales.service';
import { BrowsSalesBillService } from './brows-sales-bill.service';
const jsPDF = require('jspdf');
// require('jspdf-autotable'); 
import { Router } from '@angular/router';
import { Color, gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { IPSearchListService } from 'app/main/ipd/ip-search-list/ip-search-list.service';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { OpPaymentVimalComponent } from 'app/main/opd/op-search-list/op-payment-vimal/op-payment-vimal.component';
import { IpPaymentInsert } from 'app/main/ipd/ip-search-list/ip-advance/ip-advance.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';


import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';

import { ComponentPortal } from '@angular/cdk/portal';
import { SMSDetailsPopupOverComponent } from 'app/main/shared/componets/email-send/smsdetails-popup-over/smsdetails-popup-over.component';
import { WhatsappDetPopUpOverComponent } from 'app/main/shared/componets/email-send/whatsapp-det-pop-up-over/whatsapp-det-pop-up-over.component';
import { Subscription } from 'rxjs';
import { ConfigService } from 'app/core/services/config.service';
import { permissionCodes } from 'app/main/shared/model/permission.model';


@Component({
  selector: 'app-brows-sales-bill',
  templateUrl: './brows-sales-bill.component.html',
  styleUrls: ['./brows-sales-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BrowsSalesBillComponent implements OnInit {
  isLoadingStr: string = '';
  @ViewChild('billTemplate') billTemplate: ElementRef;
  @ViewChild('billTemplate2') billTemplate2: ElementRef;
  @ViewChild('billSalesReturn') billSalesReturn: ElementRef;

  @ViewChild('Salescollectiontemplate') Salescollectiontemplate: ElementRef;
  imgDataSource = new MatTableDataSource<any>();
  reportPrintObjList: Printsal[] = [];
  printTemplate: any;
  reportPrintObj: Printsal;
  reportPrintObjTax: Printsal;
  subscriptionArr: Subscription[] = [];
  currentDate = new Date();
  ExMobile: any = "";
  Filepath: any;
  loadingRow: number | null = null
  IsLoading: boolean = false;
  UTRNO: any;
  rowid: any = [];
  TotalAmt: any = 0;
  sIsLoading: any = '';
  AdList: boolean = false;
  type = " ";
  Creditflag: boolean = false;
  menuActions: Array<string> = [];


  // sales lsit
  FromDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
  ToDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
  StoreId1 = this._BrowsSalesBillService.userForm.get('StoreId').value || 0;
  isShowDetailTable: boolean = false;
  OpIpType: any = "0";
  salesNo: any = "0";
  regNo: any = "0";
  firstName: any = "%";
  LastName: any = "%";

  //sales return list
  From_Date = this.datePipe.transform(new Date(), "yyyy-MM-dd")
  To_Date = this.datePipe.transform(new Date(), "yyyy-MM-dd")
  Store_Id = this._BrowsSalesBillService.userForm.get('StoreId').value || 0;
  isShowDetailTableRetrun: boolean = false;
  OpIp_Type: any = "0";
  sales_No: any = "0";
  reg_No: any = "0";
  first_Name: any = "%";
  Last_Name: any = "%";

  currency: any = '';
  //Patient list
  Fr_Date = '' //this.datePipe.transform(new Date(), "yyyy-MM-dd")
  T_Date = '' // this.datePipe.transform(new Date(), "yyyy-MM-dd")   
  sales_No_pt: any = "0";
  reg_No_Pt: any = "0";
  first_N: any = "%";
  Last_N: any = "%";
  middle_N: any = "%";
  ipdno: any = "0";
  status: any = "0";
  salesForm: FormGroup;
  constructor(
    public _AdmissionService: IPSearchListService,
    public _BrowsSalesBillService: BrowsSalesBillService,
    public _BrowsSalesService: SalesService,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private _ActRoute: Router,
    public _formBuilder: FormBuilder,
    public _FormvalidationserviceService: FormvalidationserviceService, public _whatsppService: WhatsAppEmailService,
    private overlay: Overlay,
    public _ConfigService: ConfigService
  ) { }

  ngOnInit(): void {
    this.PharmaSettlementfrom = this.createSettlementform();
    if (this._ActRoute.url == '/pharmacy/browsesalesbill') {
      this.menuActions.push('Patient Ledger');
      this.menuActions.push("Patient Statement");
      this.menuActions.push("Patient Sales Summary");
      this.menuActions.push("Patient Sales Detail");
    }

    this.salesForm = this._BrowsSalesBillService.SearchFilter();
    ///.getsaleslist();
    this.onChangeFirst();
    this.onChangeFirst_Retrun();

    //this is for curreny symbol
    const [CurrencyId, CurrencyValue] = this._ConfigService.configParams.CurrencyValue.split(":");
    this.currency = CurrencyValue
  }

  autocompletestore: string = "Store";
  @ViewChild('grid') grid: AirmidTableComponent;
  @ViewChild('grid1') grid1: AirmidTableComponent;
  @ViewChild('grid2') grid2: AirmidTableComponent;
  @ViewChild('grid3') grid3: AirmidTableComponent;
  @ViewChild('grid4') grid4: AirmidTableComponent;

  gridConfig1: gridModel = new gridModel();


  //Sales 
  @ViewChild('patientTypetemp') patientTypetemp!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('isPrintTemplate') isPrintTemplate!: TemplateRef<any>;
  @ViewChild('patientTypePaidType') patientTypePaidType!: TemplateRef<any>;
  @ViewChild('patientPurBill') patientPurBill!: TemplateRef<any>;
  @ViewChild('editablePatientName') editablePatientName!: TemplateRef<any>;

  //Sales Return
  @ViewChild('patientTypetempReturn') patientTypetempReturn!: TemplateRef<any>;
  @ViewChild('actionButtonTemplateRetrun') actionButtonTemplateRetrun!: TemplateRef<any>;

  //patient list
  @ViewChild('isPatientTemplate') isPatientTemplate!: TemplateRef<any>;
  @ViewChild('isPatientPrintTemplate') isPatientPrintTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'Status')!.template = this.patientTypetemp;
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'isPrint')!.template = this.isPrintTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'paidType')!.template = this.patientTypePaidType;
    this.gridConfig.columnsList.find(col => col.key === 'isPurBill')!.template = this.patientPurBill;
    this.gridConfig.columnsList.find(col => col.key === 'patientName')!.template = this.editablePatientName;
    //Sales Return
    this.gridConfig2.columnsList.find(col => col.key === 'Status')!.template = this.patientTypetempReturn;
    this.gridConfig2.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateRetrun;
    //patient list
    this.gridConfig4.columnsList.find(col => col.key === 'Status')!.template = this.isPatientTemplate;
    this.gridConfig4.columnsList.find(col => col.key === 'action')!.template = this.isPatientPrintTemplate;
  }

  //Sales header list columns
  BrowseHColumns = [
    {
      heading: "-", key: "Status", align: "right", sticky: true, type: gridColumnTypes.template,
      template: this.patientTypetemp, width: 100,
    },
    {
      heading: "--", key: "isPrint", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40,
      template: this.isPrintTemplate
    },
    {
      heading: "Type", key: "paidType", align: 'right', width: 45, sticky: true, type: gridColumnTypes.template,
      template: this.patientTypePaidType
    },
    {
      heading: "IsPurBill", key: "isPurBill", align: 'right', width: 60, sticky: true, type: gridColumnTypes.template,
      template: this.patientPurBill
    },
    { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Time", key: "time", sort: true, align: 'left', emptySign: 'NA', width: 90 },
    { heading: "Sales No", key: "salesNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },

    {
      heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300, type: gridColumnTypes.template,
      template: this.editablePatientName
    },
    { heading: "IPD No", key: "ipno", sort: true, align: 'left', emptySign: 'NA', width: 130 },

    { heading: "Total Amt", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },
    { heading: "Disc Amt", key: "discAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },

    { heading: "Net Amt", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },

    { heading: "Paid Amt", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },

    { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["balanceAmount"] > 0 ? Color.RED : "" },
    // { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },
    { heading: "GST Amt", key: "vatAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },

    // { heading: "Paid Type", key: "paidType",align: 'right', width: 70,sticky: true,type: gridColumnTypes.template,
    //    template: this.patientTypePaidType
    // },

    {
      heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]
  //Sales detail list columns
  BrowseDetColumns = [
    { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 300, },
    { heading: "Batch No", key: "batchNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Batch ExpDate", key: "batchExpDate", sort: true, align: 'left', emptySign: 'NA', width: 180, type: 9 },
    { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "Unit MRP", key: "unitMRP", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },
    { heading: "Total Amt", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },
    { heading: "Disc%", key: "discPer", sort: true, align: 'left', emptySign: 'NA', width: 100, type: gridColumnTypes.amount },
    { heading: "Disc Amt", key: "discAmount", sort: true, align: 'left', emptySign: 'NA', width: 100, type: gridColumnTypes.amount },
    { heading: "Gross Amt", key: "grossAmount", sort: true, align: 'left', emptySign: 'NA', width: 100, type: gridColumnTypes.amount },
    { heading: "GST%", key: "vatPer", sort: true, align: 'left', emptySign: 'NA', width: 100, type: gridColumnTypes.amount },
    { heading: "CGST%", key: "cgstPer", sort: true, align: 'left', emptySign: 'NA', width: 100, type: gridColumnTypes.amount },
    { heading: "SGST%", key: "sgstPer", sort: true, align: 'left', emptySign: 'NA', width: 100, type: gridColumnTypes.amount },
    { heading: "IGST%", key: "igstPer", sort: true, align: 'left', emptySign: 'NA', width: 100, type: gridColumnTypes.amount },

  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.Sales,
    apiUrl: "Sales/salesbrowselist",
    columnsList: this.BrowseHColumns,
    sortField: "SalesId",
    sortOrder: 0,
    filters: [
      { fieldName: "LName", fieldValue: "%", opType: OperatorComparer.Equals },
      { fieldName: "FName", fieldValue: "%", opType: OperatorComparer.Equals },
      { fieldName: "FromDt", fieldValue: this.FromDate, opType: OperatorComparer.Equals },
      { fieldName: "ToDt", fieldValue: this.ToDate, opType: OperatorComparer.Equals },
      { fieldName: "StoreId", fieldValue: String(this.StoreId1), opType: OperatorComparer.Equals },
      { fieldName: "RegNo", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "SalesNo", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "OPIPType", fieldValue: "3", opType: OperatorComparer.Equals }
    ],
  }

  onChangeFirst() {
    debugger
    this.isShowDetailTable = false;
    this.firstName = this._BrowsSalesBillService.userForm.get('F_Name').value + "%"
    this.LastName = this._BrowsSalesBillService.userForm.get('L_Name').value + "%"
    this.StoreId1 = this._BrowsSalesBillService.userForm.get('StoreId').value || "0"
    this.FromDate = this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd")
    this.ToDate = this.datePipe.transform(this._BrowsSalesBillService.userForm.get('enddate').value, "yyyy-MM-dd")
    this.regNo = this._BrowsSalesBillService.userForm.get('RegNo').value || "0"
    this.salesNo = this._BrowsSalesBillService.userForm.get('SalesNo').value || "0"
    this.OpIpType = this._BrowsSalesBillService.userForm.get('OP_IP_Type').value || "0"
    if (this.FromDate && this.ToDate) {
      this.getSaleslistdata();
    }
  }
  getSaleslistdata() {
    debugger
    this.gridConfig = {
      apiUrl: "Sales/salesbrowselist",
      columnsList: this.BrowseHColumns,
      sortField: "SalesId",
      sortOrder: 0,
      filters: [
        { fieldName: "LName", fieldValue: this.LastName, opType: OperatorComparer.Equals },
        { fieldName: "FName", fieldValue: this.firstName, opType: OperatorComparer.Equals },
        { fieldName: "StoreId", fieldValue: String(this.StoreId1), opType: OperatorComparer.Equals },
        { fieldName: "FromDt", fieldValue: this.FromDate, opType: OperatorComparer.Equals },
        { fieldName: "ToDt", fieldValue: this.ToDate, opType: OperatorComparer.Equals },
        { fieldName: "RegNo", fieldValue: this.regNo, opType: OperatorComparer.Equals },
        { fieldName: "SalesNo", fieldValue: this.salesNo, opType: OperatorComparer.Equals },
        { fieldName: "OPIPType", fieldValue: this.OpIpType, opType: OperatorComparer.Equals }
      ],
    }
    // this.grid.gridConfig = this.gridConfig;
    // this.grid.bindGridData();

    this.getsaleslist();
  }
  chargelist: any = [];
  getsaleslist() {
    debugger
    const vdata = {
      "first": 0,
      "rows": 10000,
      "sortField": "SalesId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "LName", "fieldValue": this.LastName, "opType": OperatorComparer.Equals },
        { "fieldName": "FName", "fieldValue": this.firstName, "opType": OperatorComparer.Equals },
        { "fieldName": "StoreId", "fieldValue": String(this.StoreId1), "opType": OperatorComparer.Equals },
        { "fieldName": "FromDt", "fieldValue": this.FromDate, "opType": OperatorComparer.Equals },
        { "fieldName": "ToDt", "fieldValue": this.ToDate, "opType": OperatorComparer.Equals },
        { "fieldName": "RegNo", "fieldValue": this.regNo, "opType": OperatorComparer.Equals },
        { "fieldName": "SalesNo", "fieldValue": this.salesNo, "opType": OperatorComparer.Equals },
        { "fieldName": "OPIPType", "fieldValue": this.OpIpType, "opType": OperatorComparer.Equals }
      ],
      "Columns": [],
      "exportType": "JSON"
    }
    this._BrowsSalesBillService.getSalesBrowseList(vdata).subscribe(response => {
      this.chargelist = response.data
      console.log(this.chargelist)

      if (this.chargelist.length) {
        this.gettotalshowingonPage(this.chargelist);
      }
    })

  }
  finalTotalAmt: any = 0;
  finalDiscAmt: any = 0;
  finalNetAmt: any = 0;
  finalPaidAmt: any = 0;
  finalBalanceAmt: any = 0;
  gettotalshowingonPage(element) {
    this.finalTotalAmt = (element.reduce((sum, { totalAmount }) => sum += +(totalAmount || 0), 0)).toFixed(2);
    this.finalDiscAmt = (element.reduce((sum, { discAmount }) => sum += +(discAmount || 0), 0)).toFixed(2);
    this.finalNetAmt = (element.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0)).toFixed(2);
    this.finalPaidAmt = (element.reduce((sum, { paidAmount }) => sum += +(paidAmount || 0), 0)).toFixed(2);
    this.finalBalanceAmt = (element.reduce((sum, { balanceAmount }) => sum += +(balanceAmount || 0), 0)).toFixed(2);
  }


  getsalesdetaillist(event) {
    console.log(event)

    this.gridConfig1 = {
      apiUrl: "Sales/SalesBrowseDetailList",
      columnsList: this.BrowseDetColumns,
      sortField: "SalesId",
      sortOrder: 0,
      filters: [
        { fieldName: "SalesID", fieldValue: String(event.salesId), opType: OperatorComparer.Equals },
        { fieldName: "OP_IP_Type", fieldValue: String(event.oP_IP_Type), opType: OperatorComparer.Equals }
      ]
    };
    this.isShowDetailTable = true;
    setTimeout(() => {
      this.grid1.gridConfig = this.gridConfig1;
      this.grid1.bindGridData();
    }, 500);
  }


  selectChangeStore(value) {
    if (value.value !== 0)
      this.StoreId1 = value.value
    else
      this.StoreId1 = "0"

    this.onChangeFirst();
  }
  editPatientName(row: any) {
    row.originalPatientName = row.patientName;  // backup original in case of cancel
    row.isEditing = true;
  }
  savePatientName(row: any) {
    debugger
    row.isEditing = false;
    const vadat = {
      "extMobileNo": row?.extMobileNo || 0,
      "externalPatientName": row?.patientName || '',
      "extAddress": row?.extAddress || '',
      "doctorName": row?.doctorName || '',
      "salesId": row?.salesId,
    }
    console.log(vadat)
    this._BrowsSalesBillService.UpdateExtpatientName(vadat).subscribe(Response => {
      this.grid1.bindGridData();
    })
  }
  cancelEdit(row: any) {
    row.patientName = row.originalPatientName;
    row.isEditing = false;
  }

  ///tab 2 return
  //Sales return header list columns
  SalesReturnHColumns = [
    {
      heading: "", key: "Status", align: "right", width: 40, sticky: true, type: gridColumnTypes.template,
      template: this.patientTypetempReturn
    },
    { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 180 },
    { heading: "Sales Retrun No", key: "salesReturnNo", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },

    { heading: "Total Amt", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },
    { heading: "Disc Amt", key: "discAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },


    { heading: "Net Amt", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },
    { heading: "Paid Amt", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },
    // { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },

    { heading: "Balance Amount", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["balanceAmount"] > 0 ? Color.RED : "" },

    { heading: "GST Amt", key: "vatAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },

    { heading: "Type", key: "label", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    {
      heading: "Action", key: "action", align: "right", width: 160, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplateRetrun  // Assign ng-template to the column
    }
  ]

  gridConfig3: gridModel = new gridModel();
  gridConfig2: gridModel = {
    permissionCode: permissionCodes.Sales,
    apiUrl: "SalesReturn/SalesReturnBrowseList",
    columnsList: this.SalesReturnHColumns,
    sortField: "SalesReturnId",
    sortOrder: 0,
    filters: [
      { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Equals },
      { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Equals },
      { fieldName: "StoreId", fieldValue: String(this.Store_Id), opType: OperatorComparer.Equals },
      { fieldName: "From_Dt", fieldValue: this.From_Date, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.To_Date, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "SalesNo", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "OP_IP_Type", fieldValue: "0", opType: OperatorComparer.Equals }
    ],
    row: 25
  }

  ///tab 3 return
  //patient  list columns 
  PatientlistColumns = [
    { heading: "", key: "Status", sort: true, align: 'left', type: gridColumnTypes.template, width: 50, template: this.isPatientTemplate },

    { heading: "DOA", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 200 },
    { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "IPD No", key: "ipdno", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Doctor Name", key: "doctorname", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Ref Doc Name", key: "refDocName", sort: true, align: 'left', emptySign: 'NA', width: 250 },

    { heading: "Patient Type", key: "patientType", sort: true, align: 'left', width: 120 },
    { heading: "Ward Name | BedNo", key: "roomName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    // { heading: "Bed Name", key: "bedName", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "Class Name", key: "className", sort: true, align: 'left', emptySign: 'NA', width: 220 },
    {
      heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template, width: 100,
      template: this.isPatientPrintTemplate  // Assign ng-template to the column
    }
  ]


  gridConfig4: gridModel = {
    apiUrl: "Admission/AdmissionList",
    columnsList: this.PatientlistColumns,
    sortField: "AdmissionId",
    sortOrder: 1,
    filters: [
      { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "Doctor_Id", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "From_Dt", fieldValue: this.Fr_Date, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.T_Date, opType: OperatorComparer.Equals },
      { fieldName: "Admtd_Dschrgd_All", fieldValue: this.status, opType: OperatorComparer.Equals },
      { fieldName: "M_Name", fieldValue: "%", opType: OperatorComparer.Contains },
      { fieldName: "IPNo", fieldValue: "0", opType: OperatorComparer.Equals },
    ],
    row: 150
  }
  isChecked: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  //Sales Retrun list 
  onChangeFirst_Retrun() {

    this.isShowDetailTableRetrun = false;
    this.first_Name = this._BrowsSalesBillService.formReturn.get('F_Name').value + "%"
    this.Last_Name = this._BrowsSalesBillService.formReturn.get('L_Name').value + "%"
    this.Store_Id = this._BrowsSalesBillService.formReturn.get('StoreId').value
    this.From_Date = this.datePipe.transform(this._BrowsSalesBillService.formReturn.get('startdate1').value, "yyyy-MM-dd")
    this.To_Date = this.datePipe.transform(this._BrowsSalesBillService.formReturn.get('enddate1').value, "yyyy-MM-dd") || this.datePipe.transform(new Date(), "yyyy-MM-dd")
    this.reg_No = this._BrowsSalesBillService.formReturn.get('RegNo').value || "0"
    this.sales_No = this._BrowsSalesBillService.formReturn.get('SalesNo').value || "0"
    this.OpIp_Type = this._BrowsSalesBillService.formReturn.get('OP_IP_Type_Return').value || "0"
    this.getSalesRetrunlistdata();
  }
  getSalesRetrunlistdata() {
    debugger
    this.gridConfig2 = {
      apiUrl: "SalesReturn/SalesReturnBrowseList",
      columnsList: this.SalesReturnHColumns,
      sortField: "SalesReturnId",
      sortOrder: 0,
      filters: [
        { fieldName: "F_Name", fieldValue: this.first_Name, opType: OperatorComparer.Equals },
        { fieldName: "L_Name", fieldValue: this.Last_Name, opType: OperatorComparer.Equals },
        { fieldName: "StoreId", fieldValue: String(this.Store_Id), opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.From_Date, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.To_Date, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: this.reg_No, opType: OperatorComparer.Equals },
        { fieldName: "SalesNo", fieldValue: this.sales_No, opType: OperatorComparer.Equals },
        { fieldName: "OP_IP_Type", fieldValue: this.OpIp_Type, opType: OperatorComparer.Equals }
      ],
    }

    this.getsalesreturnlist()
  }


  //Sales return
  retchargelist: any = [];
  getsalesreturnlist() {
    debugger
    const vdata = {
      "first": 0,
      "rows": 10000,
      "sortField": "SalesReturnId",
      "sortOrder": 0,
      "filters": [
        { fieldName: "F_Name", fieldValue: this.first_Name, opType: OperatorComparer.Equals },
        { fieldName: "L_Name", fieldValue: this.Last_Name, opType: OperatorComparer.Equals },
        { fieldName: "StoreId", fieldValue: String(this.Store_Id), opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.From_Date, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.To_Date, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: this.reg_No, opType: OperatorComparer.Equals },
        { fieldName: "SalesNo", fieldValue: this.sales_No, opType: OperatorComparer.Equals },
        { fieldName: "OP_IP_Type", fieldValue: this.OpIp_Type, opType: OperatorComparer.Equals }
      ],
      "Columns": [],
      "exportType": "JSON"
    }
    this._BrowsSalesBillService.getSalesReturnBrowseList(vdata).subscribe(response => {
      this.retchargelist = response.data
      console.log(this.retchargelist)

      if (this.retchargelist.length) {
        this.getReturntotalshowingonPage(this.retchargelist);
      }
    })

  }

  RetfinalTotalAmt: any = 0;
  RetfinalDiscAmt: any = 0;
  RetfinalNetAmt: any = 0;
  RetfinalPaidAmt: any = 0;
  RetfinalBalanceAmt: any = 0;
  getReturntotalshowingonPage(element) {
    console.log(element)
    this.RetfinalTotalAmt = (element.reduce((sum, { totalAmount }) => sum += +(totalAmount || 0), 0)).toFixed(2);
    this.RetfinalDiscAmt = (element.reduce((sum, { discAmount }) => sum += +(discAmount || 0), 0)).toFixed(2);
    this.RetfinalNetAmt = (element.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0)).toFixed(2);
    this.RetfinalPaidAmt = (element.reduce((sum, { paidAmount }) => sum += +(paidAmount || 0), 0)).toFixed(2);
    this.RetfinalBalanceAmt = (element.reduce((sum, { balanceAmount }) => sum += +(balanceAmount || 0), 0)).toFixed(2);
  }
  selectChangeStoreRetrun(value) {
    if (value.value !== 0)
      this.Store_Id = value.value
    else
      this.Store_Id = "0"

    this.onChangeFirst_Retrun();
  }
  getsalesReturndetaillist(event) {
    console.log(event)
    this.isShowDetailTableRetrun = true;
    this.gridConfig3 = {
      apiUrl: "SalesReturn/salesReturnBrowseDetaillist",
      columnsList: this.BrowseDetColumns,
      sortField: "SalesReturnId",
      sortOrder: 0,
      filters: [
        { fieldName: "SalesReturnId", fieldValue: String(event.salesReturnId), opType: OperatorComparer.Equals }
      ],
    }
    this.grid3.gridConfig = this.gridConfig3;
    this.grid3.bindGridData();
  }

  /// Patient list  
  apiUrl: any = '';
  onChangeFirstPatient() {
    debugger
    if (this._BrowsSalesBillService.SalesPatientForm.get('IsDischarge').value == false) {
      this.apiUrl = "Admission/AdmissionList"
      this.status = "0"
      this.Fr_Date = "1900-01-01"
      this.T_Date = "1900-01-01"
    } else {
      this.apiUrl = "Admission/AdmissionDischargeList"
      this.status = "1"
      this.Fr_Date = this.datePipe.transform(this._BrowsSalesBillService.SalesPatientForm.get('startdate1').value, "yyyy-MM-dd") || "1900-01-01"
      this.T_Date = this.datePipe.transform(this._BrowsSalesBillService.SalesPatientForm.get('enddate1').value, "yyyy-MM-dd") || "1900-01-01"

    }
    this.first_N = this._BrowsSalesBillService.SalesPatientForm.get('F_Name').value + "%"
    this.middle_N = this._BrowsSalesBillService.SalesPatientForm.get('M_Name').value + "%"
    this.Last_N = this._BrowsSalesBillService.SalesPatientForm.get('L_Name').value + "%"
    this.reg_No_Pt = this._BrowsSalesBillService.SalesPatientForm.get('RegNo').value || "0"
    this.ipdno = this._BrowsSalesBillService.SalesPatientForm.get('IPDNo').value || "0"
    this.getPatientlistdata();
  }

  getPatientlistdata() {
    debugger
    this.gridConfig4 = {
      // permissionCode: permissionCodes.Sales,
      apiUrl: this.apiUrl,
      columnsList: this.PatientlistColumns,
      sortField: "AdmissionId",
      sortOrder: 0,
      filters: [
        { fieldName: "F_Name", fieldValue: this.first_N, opType: OperatorComparer.Equals },
        { fieldName: "L_Name", fieldValue: this.Last_N, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: this.reg_No_Pt, opType: OperatorComparer.Equals },
        { fieldName: "Doctor_Id", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.Fr_Date, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.T_Date, opType: OperatorComparer.Equals },
        { fieldName: "Admtd_Dschrgd_All", fieldValue: this.status, opType: OperatorComparer.Equals },
        { fieldName: "M_Name", fieldValue: this.middle_N, opType: OperatorComparer.Contains },
        { fieldName: "IPNo", fieldValue: this.ipdno, opType: OperatorComparer.Equals }
      ],
    }
    // this.grid4.gridConfig = this.gridConfig4;
    // this.grid4.bindGridData();
  }
  getchangeDate() {
    debugger
    if (this._BrowsSalesBillService.SalesPatientForm.get('IsDischarge').value != false) {
      this.apiUrl = "Admission/AdmissionDischargeList"
      this.Fr_Date = this.datePipe.transform(this._BrowsSalesBillService.SalesPatientForm.get('startdate1').value, "yyyy-MM-dd") || "1900-01-01"
      this.T_Date = this.datePipe.transform(this._BrowsSalesBillService.SalesPatientForm.get('enddate1').value, "yyyy-MM-dd") || "1900-01-01"
      this.status = '1'
    }
    this.first_N = this._BrowsSalesBillService.SalesPatientForm.get('F_Name').value + "%"
    this.middle_N = this._BrowsSalesBillService.SalesPatientForm.get('M_Name').value + "%"
    this.Last_N = this._BrowsSalesBillService.SalesPatientForm.get('L_Name').value + "%"
    this.reg_No_Pt = this._BrowsSalesBillService.SalesPatientForm.get('RegNo').value || "0"
    this.ipdno = this._BrowsSalesBillService.SalesPatientForm.get('IPDNo').value || "0"
    this.getPatientlistdata();
  }

  onChangeDiscahrge(event) {
    debugger
    if (this._BrowsSalesBillService.SalesPatientForm.get('IsDischarge').value == false) {
      this._BrowsSalesBillService.SalesPatientForm.get('startdate1').setValue('')
      this._BrowsSalesBillService.SalesPatientForm.get('enddate1').setValue('')
      this.Fr_Date = "1900-01-01"
      this.T_Date = "1900-01-01"
      this.status = '0'
      this.apiUrl = "Admission/AdmissionList"
    } else {
      this._BrowsSalesBillService.SalesPatientForm.get('startdate1').setValue(new Date())
      this._BrowsSalesBillService.SalesPatientForm.get('enddate1').setValue(new Date())
      this.Fr_Date = this.datePipe.transform(this._BrowsSalesBillService.SalesPatientForm.get('startdate1').value, "yyyy-MM-dd") || "1900-01-01"
      this.T_Date = this.datePipe.transform(this._BrowsSalesBillService.SalesPatientForm.get('enddate1').value, "yyyy-MM-dd") || "1900-01-01"
      this.status = '1'
      this.apiUrl = "Admission/AdmissionDischargeList"
    }
    this.getPatientlistdata();
  }

  getValidationMessages() {
    return {
      RegNo: [
        // { name: "required", Message: "SupplierId is required" }
      ],
      IPDNo: [
        // { name: "required", Message: "SupplierId is required" }
      ],
      F_Name: [
        // { name: "required", Message: "Item Name is required" }
      ],
      M_Name: [
        // { name: "required", Message: "Batch No is required" }
      ],
      L_Name: [
        // { name: "required", Message: "Invoice No is required" }
      ],
      SalesNo: [
        // { name: "required", Message: "Invoice No is required" }
      ],
      StoreId: [
        // { name: "required", Message: "Invoice No is required" }
      ]

    };
  }

  IsDischarge: any;
  onChangeIsactive(SiderOption) {
    this.IsDischarge = SiderOption.checked;
    if (SiderOption.checked == true) {
      this._AdmissionService.myFilterform.get('IsDischarge').setValue(1);
      this._AdmissionService.myFilterform.get('start').setValue((new Date()).toISOString());
      this._AdmissionService.myFilterform.get('end').setValue((new Date()).toISOString());
      //this.getAdmittedPatientList();
    }
    else {
      this._AdmissionService.myFilterform.get('IsDischarge').setValue(0);
      this._AdmissionService.myFilterform.get('start').setValue(''),
        this._AdmissionService.myFilterform.get('end').setValue('')
      //this.getAdmittedPatientList();
    }
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
  // OnPayment(contact) {
  //   const currentDate = new Date();
  //   const datePipe = new DatePipe('en-US');
  //   const formattedTime = datePipe.transform(currentDate, 'shortTime');
  //   const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
  //   console.log(contact)
  //   let PatientHeaderObj = {};

  //   PatientHeaderObj['Date'] = formattedDate,
  //     PatientHeaderObj['PatientName'] = contact.PatientName;
  //   PatientHeaderObj['RegNo'] = contact.RegNo;
  //   PatientHeaderObj['OPD_IPD_Id'] = contact.IPNO;
  //   PatientHeaderObj['billNo'] = contact.SalesId;
  //   PatientHeaderObj['NetPayAmount'] = Math.round(contact.BalanceAmount);

  //   const dialogRef = this._matDialog.open(OpPaymentComponent,
  //     {
  //       maxWidth: "80vw",
  //       height: '650px',
  //       width: '80%',
  //       data: {
  //         vPatientHeaderObj: PatientHeaderObj,
  //         FromName: "OP-Pharma-SETTLEMENT",
  //         advanceObj: PatientHeaderObj,
  //       }
  //     });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(result)

  //     if (result.IsSubmitFlag == true) {
  //       let updateBillobj = {};
  //       updateBillobj['salesID'] = contact.SalesId;
  //       updateBillobj['salRefundAmt'] = 0;
  //       updateBillobj['balanceAmount'] = result.submitDataPay.ipPaymentInsert.BalanceAmt;

  //       let UpdateAdvanceDetailarr = [];
  //       if (UpdateAdvanceDetailarr.length == 0) {
  //         let update_T_PHAdvanceDetailObj = {};
  //         update_T_PHAdvanceDetailObj['AdvanceDetailID'] = 0,
  //           update_T_PHAdvanceDetailObj['UsedAmount'] = 0,
  //           update_T_PHAdvanceDetailObj['BalanceAmount'] = 0,
  //           UpdateAdvanceDetailarr.push(update_T_PHAdvanceDetailObj);
  //       }

  //       let update_T_PHAdvanceHeaderObj = {};
  //       update_T_PHAdvanceHeaderObj['AdvanceId'] = 0,
  //         update_T_PHAdvanceHeaderObj['AdvanceUsedAmount'] = 0,
  //         update_T_PHAdvanceHeaderObj['BalanceAmount'] = 0

  //       let Data = {
  //         "salesPaymentSettlement": result.submitDataPay.ipPaymentInsert,
  //         "update_Pharmacy_BillBalAmountSettlement": updateBillobj,
  //         "update_T_PHAdvanceDetailSettlement": UpdateAdvanceDetailarr,
  //         "update_T_PHAdvanceHeaderSettlement": update_T_PHAdvanceHeaderObj
  //       };
  //       console.log(Data);

  //       this._BrowsSalesBillService.InsertSalessettlement(Data).subscribe(response => {
  //         if (response) {
  //           this.toastr.success('Sales Credit Payment Successfully !', 'Success', {
  //             toastClass: 'tostr-tost custom-toast-error',
  //           });
  //           //this.getSalesList();  
  //         }
  //         else {
  //           this.toastr.error('Sales Credit Payment  not saved !', 'error', {
  //             toastClass: 'tostr-tost custom-toast-error',
  //           });
  //         }
  //       });
  //     }
  //   });
  // }
  PharmaSettlementfrom: FormGroup;
  createSettlementform() {
    return this._formBuilder.group({
      // payment in array
      payment: this._formBuilder.array([]),
      // Current stock in array
      saless: this._formBuilder.array([]),
      // sales return details in array
      advanceDetail: this._formBuilder.array([]),
      //Advacne header  
      advanceHeader: this._formBuilder.group({
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceUsedAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        balanceAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      }),
      //New Payments
      // ✅ Fixed: should be FormArray
      tPayments: this._formBuilder.array([]),
    });
  }
  createAdvanceDetails(element: any): FormGroup {
    return this._formBuilder.group({
      advanceDetailID: [element?.AdvanceDetailID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      usedAmount: [element?.UsedAmount ?? 0, [, this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      balanceAmount: [element?.BalanceAmount ?? 0, [, this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }
  createsaless(element: any): FormGroup {
    return this._formBuilder.group({
      salesID: [element?.salesID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      balanceAmount: [element?.balanceAmount ?? 0, [, this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      refundAmt: [element?.refundAmt ?? 0]
    });
  }
  createSettlmentPyament(element: any): FormGroup {
    return this._formBuilder.group({
      paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      billNo: [element?.billNo, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      paymentDate: [element?.paymentDate, [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      paymentTime: [element?.paymentTime, [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      cashPayAmount: [element?.cashPayAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      chequePayAmount: [element?.chequePayAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      chequeNo: [element?.chequeNo, [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      bankName: [element?.bankName, [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      chequeDate: [element?.chequeDate ?? ''],
      cardPayAmount: [element?.cardPayAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      cardNo: [element?.cardNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      cardBankName: [element?.cardBankName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      cardDate: [element?.cardDate ?? ''],
      advanceUsedAmount: [element?.advanceUsedAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      advanceId: [element?.advanceId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      transactionType: [element?.transactionType, [this._FormvalidationserviceService.onlyNumberValidator()]],
      remark: [element?.remark ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      addBy: [this._loggedService.currentUserValue.userId],
      isCancelled: [false],
      isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isCancelledDate: ['1999-01-01'],
      opdipdType: [3, [this._FormvalidationserviceService.onlyNumberValidator()]],
      neftpayAmount: [element?.neftpayAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      neftno: [element?.neftno ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      neftbankMaster: [element?.neftbankMaster ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      neftdate: [element?.neftdate ?? ''],
      payTmamount: [element?.payTmamount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      payTmtranNo: [element?.payTmtranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      payTmdate: [element?.payTmdate ?? ''],
      tdsamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      wfamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      unitId: [this._loggedService.currentUserValue.user.unitId, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
    });
  }
  CreateModePaymentform(item: any): FormGroup {
    return this._formBuilder.group({
      paymentId: [item?.paymentId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      unitId: [item?.unitId ?? this._loggedService.currentUserValue.user.unitId],
      billNo: [item?.billNo ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdipdtype: [item?.opdipdtype ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      paymentDate: [item?.paymentDate ?? ''],
      paymentTime: [item?.paymentTime ?? ''],
      payAmount: [item?.payAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      tranNo: [item?.tranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      bankName: [item?.bankName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      validationDate: [item?.validationDate ?? ''],
      advanceUsedAmount: [item?.advanceUsedAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      comments: [item?.comments ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      payMode: [item?.payMode ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      onlineTranNo: [item?.onlineTranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      onlineTranResponse: [item?.onlineTranResponse ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      companyId: [item?.companyId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      advanceId: [item?.advanceId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      refundId: [item?.refundId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      cashCounterId: [item?.cashCounterId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      transactionType: [item?.transactionType ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isSelfOrcompany: [item?.isSelfOrcompany ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      tranMode: ['PHAR', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      createdBy: [item?.createdBy ?? this._loggedService.currentUserValue.userId],
      transactionLabel: [item?.transactionLabel ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
    });
  }
  // Getters 
  get ModeOfPaymentsArray(): FormArray {
    return this.PharmaSettlementfrom.get('tPayments') as FormArray;
  }
  // Getters 
  get AdvanceDetailsArray(): FormArray {
    return this.PharmaSettlementfrom.get('advanceDetail') as FormArray;
  }
  get salessArray(): FormArray {
    return this.PharmaSettlementfrom.get('saless') as FormArray;
  }
  get PaymentArray(): FormArray {
    return this.PharmaSettlementfrom.get('payment') as FormArray;
  }
  OnPayment(contact) {
    debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    const PatientHeaderObj = {};
    PatientHeaderObj['Date'] = formattedDate;
    PatientHeaderObj['PatientName'] = contact?.patientName || '';
    PatientHeaderObj['AdvanceAmount'] = Math.round(contact?.balanceAmount);
    PatientHeaderObj['NetPayAmount'] = Math.round(contact?.balanceAmount);
    PatientHeaderObj['BillNo'] = contact?.salesId || 0;
    PatientHeaderObj['OPD_IPD_Id'] = contact?.opipid || 0;
    PatientHeaderObj['RegNo'] = contact?.regNo || 0;
    PatientHeaderObj['CashcounterId'] = contact?.cashCounterID || 0;
    PatientHeaderObj['CompanyName'] = contact?.companyName || '';
    PatientHeaderObj['CompanyId'] = contact?.companyId || 0;
    PatientHeaderObj['TransactionLabel'] = 'SALES_SETTLEMENT';
    if (contact?.oP_IP_Type == 1)
      PatientHeaderObj['IPDNo'] = contact?.ipno;
    else
      PatientHeaderObj['OPDNo'] = contact?.patientName;

    const dialogRef = this._matDialog.open(OpPaymentVimalComponent,
      {
        maxWidth: "80vw",
        height: '800px',
        width: '75%',
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "IP-Pharma-SETTLEMENT",
          advanceObj: PatientHeaderObj,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      debugger
      if (result && result.IsSubmitFlag) {
        let UpdateAdvanceDetailarr1: IpPaymentInsert[] = [];
        UpdateAdvanceDetailarr1 = result.submitDataAdvancePay;

        const SalesDataArray = [];
        SalesDataArray.push({ salesID: contact?.salesId, balanceAmount: result?.BalAmt ?? 0, refundAmt: 0 })

        this.AdvanceDetailsArray.clear();
        UpdateAdvanceDetailarr1.forEach(item => {
          this.AdvanceDetailsArray.push(this.createAdvanceDetails(item));
        });

        this.salessArray.clear();
        SalesDataArray.forEach(item => {
          this.salessArray.push(this.createsaless(item));
        });

        let AdvanceBalAmt = 0;
        let AdvanceUsedAmt = 0;
        if (UpdateAdvanceDetailarr1.length > 0) {
          UpdateAdvanceDetailarr1.forEach(element => {
            AdvanceUsedAmt = AdvanceUsedAmt + element.UsedAmount
            AdvanceBalAmt = AdvanceBalAmt + element.BalanceAmount
            this.PharmaSettlementfrom.get('advanceHeader.advanceId')?.setValue(element.AdvanceId)
            this.PharmaSettlementfrom.get('advanceHeader.advanceUsedAmount')?.setValue(AdvanceUsedAmt)
            this.PharmaSettlementfrom.get('advanceHeader.balanceAmount')?.setValue(AdvanceBalAmt)
          })
        }
        console.log(this.PharmaSettlementfrom.value);

        let PaymentArray: IpPaymentInsert[] = [];
        PaymentArray = result.submitDataPay.ipPaymentInsert;
        this.PaymentArray.clear();
        this.PaymentArray.push(this.createSettlmentPyament(PaymentArray));

        this.ModeOfPaymentsArray.clear();
        result.submitDataPay.ipModePaymentInsert.forEach(item => {
          this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item));
        });

        console.log(this.PharmaSettlementfrom.value);
        this._BrowsSalesBillService.InsertSalessettlement(this.PharmaSettlementfrom.value).subscribe(response => {
          this.grid.bindGridData();
        });
      }
    });
  }

  getPrint(el) {
    const D_data = {
      "SalesID": el.SalesId,// 
      "OP_IP_Type": el.OP_IP_Type
    }
    let printContents;
    this.subscriptionArr.push(
      this._BrowsSalesService.getSalesPrint(D_data).subscribe(res => {
        this.reportPrintObjList = res as Printsal[];
        console.log(this.reportPrintObjList);
        this.reportPrintObj = res[0] as Printsal;
        this.getTemplate();
      })
    );
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {

    if (event.keyCode === 114) {
      // this. selectRow(event,this.dssaleList1.data);
      // this.getWhatsappshareSales(this.rowid);
    }
  }
  // getPrint2(el) {
  //   //
  //   if (el.PaidType == 'Credit' && el.IsRefundFlag == false) {
  //     this.type = "Credit"
  //     this.Creditflag = true;
  //   } else if (!(el.PaidType == 'Credit' && el.IsRefundFlag == false)) {
  //     this.type = " "
  //     this.Creditflag = false;
  //   }
  //   var D_data = {
  //     "SalesID": el.SalesId,// 
  //     "OP_IP_Type": el.OP_IP_Type
  //   }

  //   let printContents;

  // }
  OnPaitentFinalPrint(element) {
    setTimeout(() => {
      const param = {
        "searchFields": [
          { "fieldName": "OPIPId", "fieldValue": String(element.opipid), "opType": "13" },
          { "fieldName": "OPIPType", "fieldValue": String(0), "opType": "13" }
        ],
        "mode": "PatientBillStatement"
      }
      this._BrowsSalesBillService.getReportView(param).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Patient Statement" + " " + "Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
        });
      });
    }, 100);
  }
  viewgetSalesBillReportPdf(response) {
    console.log(response)
    setTimeout(() => {
      const param = {
        "searchFields": [
          {
            "fieldName": "SalesID",
            "fieldValue": String(response.salesId
            ),
            "opType": "Equals"
          },
          {
            "fieldName": "OP_IP_Type",
            "fieldValue": String(response.oP_IP_Type),
            "opType": "Equals"
          }
        ],
        "mode": "PharamcySalesBill"
      }

      this._BrowsSalesBillService.getReportView(param).subscribe(res => {

        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Sales Bill" + " " + "Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
        });
      });
    }, 100);
  }
  // dialogData :any
  // viewgetSalesBillReportPdf(response) {
  //   console.log(response);

  //   setTimeout(() => {
  //     let param = {
  //       "searchFields": [
  //         {
  //           "fieldName": "SalesID",
  //           "fieldValue": String(response.salesId),
  //           "opType": "Equals"
  //         },
  //         {
  //           "fieldName": "OP_IP_Type",
  //           "fieldValue": String(response.oP_IP_Type),
  //           "opType": "Equals"
  //         }
  //       ],
  //       "mode": "PharamcySalesBill"
  //     };

  //     this._BrowsSalesBillService.getReportView(param).subscribe(res => {

  //       const matDialog = this._matDialog.open(PdfviewerComponent, {
  //         maxWidth: "85vw",
  //         height: '750px',
  //         width: '100%',
  //         data: {
  //           base64: res["base64"] as string,
  //           title: "Sales Bill" + " " + "Viewer"
  //         }
  //       });

  //       matDialog.afterOpened().subscribe(() => {
  //         // Trigger the print dialog after the PDF is rendered inside the dialog
  //         this.printPDF();
  //       });

  //       matDialog.afterClosed().subscribe(result => {
  //         // Handle dialog closure if needed
  //       });
  //     });
  //   }, 100);
  // }

  // printPDF() {
  //   // Assuming you are using a method to display PDF within the dialog, 
  //   // you may have an instance of the PDF viewer. Here's one approach using window.print().

  //   const printWindow = window.open('', '_blank');
  //   if (printWindow) {
  //     const base64PDF = this.dialogData.base64;
  //     printWindow.document.write(`
  //       <html>
  //         <head><title>Print PDF</title></head>
  //         <body>
  //           <embed src="data:application/pdf;base64,${base64PDF}" type="application/pdf" width="100%" height="100%"></embed>
  //         </body>
  //       </html>
  //     `);
  //     printWindow.document.close(); // Necessary to finish the HTML document
  //     printWindow.onload = () => {
  //       printWindow.print(); // Trigger the print dialog when the PDF is loaded
  //     };
  //   }
  // }


  viewgetSalesreturnBillReportPdf(response) {
    console.log(response)
    debugger
    setTimeout(() => {
      const param = {
        "searchFields": [
          {
            "fieldName": "SalesID",
            "fieldValue": String(response.salesReturnId),
            "opType": "Equals"
          },
          {
            "fieldName": "OP_IP_Type",
            "fieldValue": String(response.oP_IP_Type),
            "opType": "Equals"
          }
        ],
        "mode": "PharamcySalesReturn"
      }

      this._BrowsSalesBillService.getReportView(param).subscribe(res => {

        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Sales Return Bill" + " " + "Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
        });
      });
    }, 100);
  }
  // viewSalesPdf(el) {
  //   // 
  //   this.sIsLoading = 'loading-data';
  //   setTimeout(() => {
  //     // this.SpinLoading =true;
  //     this.AdList = true;
  //     this._BrowsSalesBillService.getPdfSales(el.SalesId, el.OP_IP_Type).subscribe(res => {
  //       const dialogRef = this._matDialog.open(PdfviewerComponent,
  //         {
  //           maxWidth: "85vw",
  //           height: '750px',
  //           width: '100%',
  //           data: {
  //             base64: res["base64"] as string,
  //             title: "Pharma sales bill viewer"
  //           }
  //         });
  //       dialogRef.afterClosed().subscribe(result => {
  //         this.AdList = false;
  //         this.sIsLoading = '';
  //       });
  //     });

  //   }, 100);
  // }

  // ViewSalesRetPdf(el) {
  //   this.sIsLoading = true;
  //   setTimeout(() => {

  //     this.AdList = true;
  //     this._BrowsSalesBillService.getSalesReturnPdf(el.salesReturnId, el.oP_IP_Type).subscribe(res => {
  //       const dialogRef = this._matDialog.open(PdfviewerComponent,
  //         {
  //           maxWidth: "85vw",
  //           height: '750px',
  //           width: '100%',
  //           data: {
  //             base64: res["base64"] as string,
  //             title: "Pharma sales bill viewer"
  //           }
  //         });
  //       dialogRef.afterClosed().subscribe(result => {
  //         this.AdList = false;
  //         this.sIsLoading = ' ';
  //       });
  //     });

  //   }, 100);
  // }

  // getPrint3(el) {

  //   var D_data = {
  //     "SalesID": el.SalesId,// 
  //     "OP_IP_Type": el.OP_IP_Type
  //   }

  //   let printContents;
  //   this.subscriptionArr.push(
  //     this._BrowsSalesService.getSalesPrint(D_data).subscribe(res => {

  //       this.reportPrintObjList = res as Printsal[];
  //       console.log(this.reportPrintObjList);

  //       this.reportPrintObj = res[0] as Printsal;
  //       console.log(this.reportPrintObj);
  //       this.getTemplateTax2();


  //     })
  //   );
  // }

  getTemplateTax() {

    const query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=37';
    this._BrowsSalesService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      const keysArray = ['PatientName', 'RegNo', 'IP_OP_Number', 'DoctorName', 'SalesNo', 'Date', 'Time', 'ItemName', 'OP_IP_Type', 'GenderName', 'AgeYear', 'BatchNo', 'BatchExpDate', 'UnitMRP', 'Qty', 'TotalAmount', 'GrossAmount', 'NetAmount', 'VatPer', 'VatAmount', 'DiscAmount', 'ConcessionReason', 'PaidAmount', 'BalanceAmount', 'UserName', 'HSNCode', 'CashPayAmount', 'CardPayAMount', 'ChequePayAmount', 'PayTMAmount', 'NEFTPayAmount', 'GSTPer', 'GSTAmt', 'CGSTAmt', 'CGSTPer', 'SGSTPer', 'SGSTAmt', 'IGSTPer', 'IGSTAmt', 'ManufShortName', 'StoreNo', 'StoreName', 'DL_NO', 'GSTIN', 'CreditReason', 'CompanyName', 'HTotalAmount', 'ExtMobileNo'];
      // ;
      for (let i = 0; i < keysArray.length; i++) {
        const reString = "{{" + keysArray[i] + "}}";
        const re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      let strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        console.log(this.reportPrintObjList);
        const objreportPrint = this.reportPrintObjList[i - 1];
        const PackValue = '1200'
        // <div style="display:flex;width:60px;margin-left:20px;">
        //     <div>`+ i + `</div> 
        // </div>

        const strabc = `<hr style="border-color:white" >
        <div style="display:flex;margin:8px 0">
        <div style="display:flex;width:20px;margin-left:20px;">
            <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
        </div>
      
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.HSNcode + `</div> 
        </div>
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.ManufShortName + `</div> 
        </div>
        <div style="display:flex;width:240px;text-align:left;margin-left:10px;">
            <div>`+ objreportPrint.ItemName + `</div> 
        </div>
         <div style="display:flex;width:60px;text-align:left;">
            <div>`+ objreportPrint.Qty + `</div> 
        </div>
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.BatchNo + `</div> 
         </div>
        <div style="display:flex;width:90px;text-align:left;margin-left:10px;">
        <div>`+ this.datePipe.transform(objreportPrint.BatchExpDate, 'dd/MM/yyyy') + `</div> 
        </div>
        <div style="display:flex;width:80px;text-align:left;margin-left:20px;">
        <div>`+ objreportPrint.UnitMRP + `</div> 
        </div>
        <div style="display:flex;width:100px;margin-left:10px;text-align:left;">
            <div>`+ '₹' + objreportPrint.TotalAmount.toFixed(2) + `</div> 
        </div>
        </div>`;
        strrowslist += strabc;
      }
      const objPrintWordInfo = this.reportPrintObjList[0];

      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.NetAmount));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      // this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.Time));
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);

      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      console.log(this.printTemplate);

      setTimeout(() => {
        this.print2();
      }, 1000);
    });


  }
  getTemplateTax2() {

    const query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=37';
    this._BrowsSalesService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      const keysArray = ['PatientName', 'RegNo', 'IP_OP_Number', 'DoctorName', 'SalesNo', 'Date', 'Time', 'ItemName', 'OP_IP_Type', 'GenderName', 'AgeYear', 'BatchNo', 'BatchExpDate', 'UnitMRP', 'Qty', 'TotalAmount', 'GrossAmount', 'NetAmount', 'VatPer', 'VatAmount', 'DiscAmount', 'ConcessionReason', 'PaidAmount', 'BalanceAmount', 'UserName', 'HSNCode', 'CashPayAmount', 'CardPayAMount', 'ChequePayAmount', 'PayTMAmount', 'NEFTPayAmount', 'GSTPer', 'GSTAmt', 'CGSTAmt', 'CGSTPer', 'SGSTPer', 'SGSTAmt', 'IGSTPer', 'IGSTAmt', 'ManufShortName', 'StoreNo', 'StoreName', 'DL_NO', 'GSTIN', 'CreditReason', 'CompanyName', 'HTotalAmount', 'ExtMobileNo'];
      // ;
      for (let i = 0; i < keysArray.length; i++) {
        const reString = "{{" + keysArray[i] + "}}";
        const re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      let strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        console.log(this.reportPrintObjList);
        const objreportPrint = this.reportPrintObjList[i - 1];
        const PackValue = '1200'
        // <div style="display:flex;width:60px;margin-left:20px;">
        //     <div>`+ i + `</div> 
        // </div>

        const strabc = `<hr style="border-color:white" >
        <div style="display:flex;margin:8px 0">
        <div style="display:flex;width:20px;margin-left:20px;">
            <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
        </div>
      
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.HSNcode + `</div> 
        </div>
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.ManufShortName + `</div> 
        </div>
        <div style="display:flex;width:240px;text-align:left;margin-left:10px;">
            <div>`+ objreportPrint.ItemName + `</div> 
        </div>
         <div style="display:flex;width:60px;text-align:left;">
            <div>`+ objreportPrint.Qty + `</div> 
        </div>
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.BatchNo + `</div> 
         </div>
        <div style="display:flex;width:90px;text-align:left;margin-left:10px;">
        <div>`+ this.datePipe.transform(objreportPrint.BatchExpDate, 'dd/MM/yyyy') + `</div> 
        </div>
        <div style="display:flex;width:80px;text-align:left;margin-left:20px;">
        <div>`+ objreportPrint.UnitMRP + `</div> 
        </div>
        <div style="display:flex;width:100px;margin-left:10px;text-align:left;">
            <div>`+ '₹' + objreportPrint.TotalAmount.toFixed(2) + `</div> 
        </div>
        </div>`;
        strrowslist += strabc;
      }
      const objPrintWordInfo = this.reportPrintObjList[0];

      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.NetAmount));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      // this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.Time));
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);

      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      console.log(this.printTemplate);

      setTimeout(() => {
        this.print3();
      }, 1000);
    });


  }

  getTemplateSalesReturn() {

    const query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=37';
    this._BrowsSalesService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      const keysArray = ['PatientName', 'RegNo', 'IP_OP_Number', 'DoctorName', 'SalesNo', 'Date', 'Time', 'ItemName', 'OP_IP_Type', 'GenderName', 'AgeYear', 'BatchNo', 'BatchExpDate', 'UnitMRP', 'Qty', 'TotalAmount', 'GrossAmount', 'NetAmount', 'VatPer', 'VatAmount', 'DiscAmount', 'ConcessionReason', 'PaidAmount', 'BalanceAmount', 'UserName', 'HSNCode', 'CashPayAmount', 'CardPayAMount', 'ChequePayAmount', 'PayTMAmount', 'NEFTPayAmount', 'GSTPer', 'GSTAmt', 'CGSTAmt', 'CGSTPer', 'SGSTPer', 'SGSTAmt', 'IGSTPer', 'IGSTAmt', 'ManufShortName', 'StoreNo', 'StoreName', 'DL_NO', 'GSTIN', 'CreditReason', 'CompanyName', 'HTotalAmount', 'ExtMobileNo'];
      // ;
      for (let i = 0; i < keysArray.length; i++) {
        const reString = "{{" + keysArray[i] + "}}";
        const re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      let strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        console.log(this.reportPrintObjList);
        const objreportPrint = this.reportPrintObjList[i - 1];
        const PackValue = '1200'
        // <div style="display:flex;width:60px;margin-left:20px;">
        //     <div>`+ i + `</div> 
        // </div>

        const strabc = `<hr style="border-color:white" >
        <div style="display:flex;margin:8px 0">
        <div style="display:flex;width:20px;margin-left:20px;">
            <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
        </div>
      
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.HSNcode + `</div> 
        </div>
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.ManufShortName + `</div> 
        </div>
        <div style="display:flex;width:240px;text-align:left;margin-left:10px;">
            <div>`+ objreportPrint.ItemName + `</div> 
        </div>
         <div style="display:flex;width:60px;text-align:left;">
            <div>`+ objreportPrint.Qty + `</div> 
        </div>
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.BatchNo + `</div> 
         </div>
        <div style="display:flex;width:90px;text-align:left;margin-left:10px;">
        <div>`+ this.datePipe.transform(objreportPrint.BatchExpDate, 'dd/MM/yyyy') + `</div> 
        </div>
        <div style="display:flex;width:80px;text-align:left;margin-left:20px;">
        <div>`+ objreportPrint.UnitMRP + `</div> 
        </div>
        <div style="display:flex;width:100px;margin-left:10px;text-align:left;">
            <div>`+ '₹' + objreportPrint.TotalAmount.toFixed(2) + `</div> 
        </div>
        </div>`;
        strrowslist += strabc;
      }
      const objPrintWordInfo = this.reportPrintObjList[0];

      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.NetAmount));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      // this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.Time));
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);

      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      console.log(this.printTemplate);

      setTimeout(() => {
        this.printSalesReturn();
      }, 1000);
    });


  }

  getTemplate(old = true) {

    const query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=36';
    this._BrowsSalesService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      const keysArray = ['PatientName', 'RegNo', 'IP_OP_Number', 'DoctorName', 'SalesNo', 'Date', 'Time', 'ItemName', 'OP_IP_Type', 'GenderName', 'AgeYear', 'BatchNo', 'BatchExpDate', 'UnitMRP', 'Qty', 'TotalAmount', 'GrossAmount', 'NetAmount', 'VatPer', 'VatAmount', 'DiscAmount', 'ConcessionReason', 'PaidAmount', 'BalanceAmount', 'UserName', 'HSNCode', 'CashPayAmount', 'CardPayAMount', 'ChequePayAmount', 'PayTMAmount', 'NEFTPayAmount', 'GSTPer', 'GSTAmt', 'CGSTAmt', 'CGSTPer', 'SGSTPer', 'SGSTAmt', 'IGSTPer', 'IGSTAmt', 'ManufShortName', 'StoreNo', 'StoreName', 'DL_NO', 'GSTIN', 'CreditReason', 'CompanyName', 'HTotalAmount', 'ExtMobileNo'];
      // ;
      for (let i = 0; i < keysArray.length; i++) {
        const reString = "{{" + keysArray[i] + "}}";
        const re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      let strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        console.log(this.reportPrintObjList);
        const objreportPrint = this.reportPrintObjList[i - 1];
        const PackValue = '1200'
        // <div style="display:flex;width:60px;margin-left:20px;">
        //     <div>`+ i + `</div> 
        // </div>

        const strabc = `<hr style="border-color:white" >
      <div style="display:flex;margin:8px 0">
      <div style="display:flex;width:40px;margin-left:20px;">
          <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
      </div>
    
      <div style="display:flex;width:90px;text-align:center;">
      <div>`+ objreportPrint.HSNcode + `</div> 
      </div>
      <div style="display:flex;width:90px;text-align:center;">
      <div>`+ objreportPrint.ManufShortName + `</div> 
      </div>
      <div style="display:flex;width:240px;text-align:left;margin-left:10px;">
          <div>`+ objreportPrint.ItemName + `</div> 
      </div>
       <div style="display:flex;width:60px;text-align:left;">
          <div>`+ objreportPrint.Qty + `</div> 
      </div>
      <div style="display:flex;width:90px;text-align:center;">
      <div>`+ objreportPrint.BatchNo + `</div> 
       </div>
      <div style="display:flex;width:90px;text-align:left;margin-left:10px;">
      <div>`+ this.datePipe.transform(objreportPrint.BatchExpDate, 'dd/MM/yyyy') + `</div> 
      </div>
      <div style="display:flex;width:80px;text-align:left;margin-left:20px;">
      <div>`+ objreportPrint.UnitMRP + `</div> 
      </div>
      <div style="display:flex;width:100px;margin-left:10px;text-align:left;">
          <div>`+ '₹' + objreportPrint.TotalAmount.toFixed(2) + `</div> 
      </div>
      </div>`;
        strrowslist += strabc;
      }
      const objPrintWordInfo = this.reportPrintObjList[0];

      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.NetAmount));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      // this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.Time));
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);

      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      console.log(this.printTemplate);

      setTimeout(() => {
        old ? this.print() : this.print2();
      }, 1000);
    });


  }

  convertToWord(e) {

    return converter.toWords(e);
  }

  transform2(value: string) {
    const datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
  }

  print() {

    let popupWin, printContents;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');

    popupWin.document.write(` <html>
  <head><style type="text/css">`);
    popupWin.document.write(`
    </style>
        <title></title>
    </head>
  `);
    popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
  </html>`);

    popupWin.document.close();
  }

  printSalescollection() {
    let popupWin, printContents;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');

    popupWin.document.write(` <html>
  <head><style type="text/css">`);
    popupWin.document.write(`
    </style>
    <style type="text/css" media="print">
  @page { size: portrait; }
</style>
        <title></title>
    </head>
  `);
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.Salescollectiontemplate.nativeElement.innerHTML}</body>
  <script>
    var css = '@page { size: portrait; }',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');
    style.type = 'text/css';
    style.media = 'print';

    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  </script>
  </html>`);
    // popupWin.document.write(`<body style="margin:0;font-size: 16px;">${this.printTemplate}</body>
    // </html>`);

    // popupWin.document.close();
  }
  print2() {
    let popupWin, printContents;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');

    popupWin.document.write(` <html>
  <head><style type="text/css">`);
    popupWin.document.write(`
    </style>
    <style type="text/css" media="print">
  @page { size: portrait; }
</style>
        <title></title>
    </head>
  `);
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.billTemplate.nativeElement.innerHTML}</body>
  <script>
    var css = '@page { size: portrait; }',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');
    style.type = 'text/css';
    style.media = 'print';

    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  </script>
  </html>`);
    // popupWin.document.write(`<body style="margin:0;font-size: 16px;">${this.printTemplate}</body>
    // </html>`);

    // popupWin.document.close();
  }
  print3() {
    let popupWin, printContents;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');

    popupWin.document.write(` <html>
  <head><style type="text/css">`);
    popupWin.document.write(`
    </style>
    <style type="text/css" media="print">
  @page { size: portrait; }
</style>
        <title></title>
    </head>
  `);
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.billTemplate2.nativeElement.innerHTML}</body>
  <script>
    var css = '@page { size: portrait; }',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');
    style.type = 'text/css';
    style.media = 'print';

    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  </script>
  </html>`);
    // popupWin.document.write(`<body style="margin:0;font-size: 16px;">${this.printTemplate}</body>
    // </html>`);

    popupWin.document.close();
  }

  getSalesRetPrint(el) {
    const D_data = {
      "SalesID": el.SalesReturnId,
      "OP_IP_Type": el.OP_IP_Type,
    }
    let printContents;
    this.subscriptionArr.push(
      this._BrowsSalesService.getSalesReturnPrint(D_data).subscribe(res => {
        this.reportPrintObjList = res as Printsal[];
        // console.log(this.reportPrintObjList);
        setTimeout(() => {
          this.printSalesReturn();
        }, 1000);
      })
    );
  }
  printSalesReturn() {
    let popupWin, printContents;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');

    popupWin.document.write(` <html>
  <head><style type="text/css">`);
    popupWin.document.write(`
    </style>
    <style type="text/css" media="print">
  @page { size: portrait; }
</style>
        <title></title>
    </head>
  `);
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.billSalesReturn.nativeElement.innerHTML}</body>
  <script>
    var css = '@page { size: portrait; }',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');
    style.type = 'text/css';
    style.media = 'print';

    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  </script>
  </html>`);
    // popupWin.document.write(`<body style="margin:0;font-size: 16px;">${this.printTemplate}</body>
    // </html>`);

    popupWin.document.close();
  }

  CreateFormData(obj: any, formData: FormData, subKeyStr = '') {
    for (const i in obj) {
      const value = obj[i]; let subKeyStrTrans = i;
      if (subKeyStr) {
        if (i.indexOf(' ') > -1 || !isNaN(parseInt(i)))
          subKeyStrTrans = subKeyStr + '[' + i + ']';
        else
          subKeyStrTrans = subKeyStr + '.' + i;
      }
      if (typeof (value) === 'object' && !(value instanceof Date) && !(value instanceof File)) {
        this.CreateFormData(value, formData, subKeyStrTrans);
      }
      else {
        formData.append(subKeyStrTrans, value ?? '');
      }
    }
  }

  loadingarry: any = [];
  // getWhatsappshareSales(el) {

  //   var m_data = {
  //     "insertWhatsappsmsInfo": {
  //       "mobileNumber": el.RegNo,
  //       "smsString": "Dear" + el.PatientName + ",Your Sales Bill has been successfully completed. UHID is " + el.SalesNo + " For, more deatils, call 08352249399. Thank You, JSS Super Speciality Hospitals, Near S-Hyper Mart, Vijayapur " || '',
  //       "isSent": 0,
  //       "smsType": 'Sales',
  //       "smsFlag": 0,
  //       "smsDate": this.currentDate,
  //       "tranNo": el.SalesId,
  //       "PatientType": 2,//el.PatientType,
  //       "templateId": 0,
  //       "smSurl": "info@gmail.com",
  //       "filePath": this.Filepath || '',
  //       "smsOutGoingID": 0

  //     }
  //   }
  //   console.log(m_data);
  //   this._BrowsSalesBillService.InsertWhatsappSales(m_data).subscribe(response => {
  //     if (response) {
  //       Swal.fire('Congratulations !', 'WhatsApp Sms  Data  save Successfully !', 'success').then((result) => {
  //         if (result.isConfirmed) {
  //           this._matDialog.closeAll();

  //         }
  //       });
  //     } else {
  //       Swal.fire('Error !', 'Whatsapp Sms Data  not saved', 'error');
  //     }

  //   });
  //   this.IsLoading = false;
  //   el.button.disbled = false;
  // }

  // getWhatsappshareSalesReturn(el) {
  //   // 
  //   var m_data = {
  //     "insertWhatsappsmsInfo": {
  //       "mobileNumber": el.RegNo,
  //       "smsString": "Dear" + el.PatientName + ",Your Sales Bill has been successfully completed. UHID is " + el.SalesNo + " For, more deatils, call 08352249399. Thank You, JSS Super Speciality Hospitals, Near S-Hyper Mart, Vijayapur " || '',
  //       "isSent": 0,
  //       "smsType": 'SalesReturn',
  //       "smsFlag": 0,
  //       "smsDate": this.currentDate,
  //       "tranNo": el.SalesReturnId,
  //       "PatientType": 2,//el.PatientType,
  //       "templateId": 0,
  //       "smSurl": "info@gmail.com",
  //       "filePath": this.Filepath || '',
  //       "smsOutGoingID": 0

  //     }
  //   }
  //   console.log(m_data);
  //   this._BrowsSalesBillService.InsertWhatsappSalesReturn(m_data).subscribe(response => {
  //     if (response) {
  //       Swal.fire('Congratulations !', 'WhatsApp  Data  save Successfully !', 'success').then((result) => {
  //         if (result.isConfirmed) {
  //           this._matDialog.closeAll();

  //         }
  //       });
  //     } else {
  //       Swal.fire('Error !', 'Whatsapp Sms Data  not saved', 'error');
  //     }

  //   });
  //   this.IsLoading = false;
  //   el.button.disbled = false;
  // }


  expPrint(el, xls) {
    // 
    const D_data = {
      "SalesID": el.SalesId,// 
      "OP_IP_Type": el.OP_IP_Type
    }


    this.subscriptionArr.push(
      this._BrowsSalesService.getSalesPrint(D_data).subscribe(res => {

        this.reportPrintObjList = res as Printsal[];
        if (this.reportPrintObjList.length > 0) {
          console.log(this.reportPrintObjList);
          this.onExport(this.reportPrintObjList, el, xls);
        }
      })
    );


  }

  onExport(reportPrintObjList, el, exprtType) {
    // 
    // setTimeout(() => {
    //   this.expPrint(el);
    // }, 1000);
    this.reportPrintObjList = reportPrintObjList;

    const columnList = [];
    if (this.reportPrintObjList.length == 0) {
    }
    else {
      const excelData = [];
      // let str = {

      //   "Sales Final BILL": "\\n"

      // };
      // excelData.push(str);

      // let str1 = {
      //   "Bill NO -": "\\n",
      //   "": el.SalesId
      // };
      // excelData.push(str1);

      const a = 1;
      for (let i = 0; i < this.reportPrintObjList.length; i++) {
        this.TotalAmt = (parseFloat(this.reportPrintObjList[i]["TotalAmount"]) + parseFloat(this.TotalAmt)).toFixed(2);

        const singleEntry = {
          "": "",
          "Sr No": a + i,
          "HSN": this.reportPrintObjList[i]["HSNcode"] ? this.reportPrintObjList[i]["HSNcode"] : "N/A",
          "ItemName ": this.reportPrintObjList[i]["ItemName"] ? this.reportPrintObjList[i]["ItemName"] : "N/A",
          "BatchNo": this.reportPrintObjList[i]["BatchNo"] ? this.reportPrintObjList[i]["BatchNo"] : "N/A",
          "BatchExpDate": this.datePipe.transform(this.reportPrintObjList[i]["BatchExpDate"], 'dd/m/yyy') ? this.datePipe.transform(this.reportPrintObjList[i]["BatchExpDate"], 'dd/m/yyy') : "N/A",
          "Qty": this.reportPrintObjList[i]["Qty"] ? this.reportPrintObjList[i]["Qty"] : "N/A",
          "UnitMRP": this.reportPrintObjList[i]["UnitMRP"] ? this.reportPrintObjList[i]["UnitMRP"] : "N/A",
          "TotalAmount": this.reportPrintObjList[i]["TotalAmount"] ? this.reportPrintObjList[i]["TotalAmount"] : "N/A"

        };
        excelData.push(singleEntry);
      }
      excelData.concat('/n');

      const singleEntry1 = {

        "": this.TotalAmt ? this.TotalAmt : "N/A"

      };
      excelData.push(singleEntry1);

      const fileName = "Sales Bill " + el.SalesId + ".xlsx";
      if (exprtType == "Excel") {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
        const wscols = [];
        if (excelData.length > 0) {
          const columnsIn = excelData[0];
          console.log(columnsIn);
          for (var key in columnsIn) {
            const headerLength = { wch: (key.length + 1) };
            let columnLength = headerLength;
            try {
              columnLength = { wch: Math.max(...excelData.map(o => o[key].length), 0) + 1 };
            }
            catch {
              columnLength = headerLength;
            }
            if (headerLength["wch"] <= columnLength["wch"]) {
              wscols.push(columnLength)
            }
            else {
              wscols.push(headerLength)
            }
          }
        }
        ws['!cols'] = wscols;
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, fileName);
      }
      else {
        const doc = new jsPDF('p', 'pt', 'a4');
        doc.page = 0;
        const col = [];
        for (const k in excelData[0]) col.push(k);
        console.log(col.length)
        const rows = [];
        excelData.forEach(obj => {
          console.log(obj)
          const arr = [];
          col.forEach(col => {
            arr.push(obj[col]);
          });
          rows.push(arr);
        });

        doc.autoTable(col, rows, {
          margin: { left: 20, right: 20, top: 50 },
          theme: "grid",
          styles: { fillColor: [205, 110, 210] },
          columnStyles: { 0: { halign: 'center', fillColor: [0, 255, 0] } }, // Cells in first column centered and green

          // styles: {
          //   fontSize: 3,
          //   textColor:20
          // }
        });
        doc.setFontSize(3);
        // doc.save("Indoor-Patient-List.pdf");
        window.open(URL.createObjectURL(doc.output("blob")))
      }
    }
  }


  getRecord(contact, m): void {

    if (m == "Patient Ledger") {
      // let Regdata;
      // this._AdmissionService.getRegdata(contact.RegID).subscribe(data => {
      //   Regdata = data as RegInsert[];

      // },
      //   error => {
      //     this.sIsLoading = '';
      //   });

      // const dialogRef = this._matDialog.open(RegAdmissionComponent,
      //   {
      //     maxWidth: '95vw',

      //     height: '900px', width: '100%',
      //     data: {
      //       PatObj: Regdata
      //     }
      //   });

      // dialogRef.afterClosed().subscribe(result => {
      //   console.log('The dialog was closed - Insert Action', result);
      // });
    } else if (m == 'Patient Statement') {
      //this.viewSalesstatement(contact);
    } else if (m == 'Patient Sales Summary') {

    } else if (m == 'Patient Sales Detail') {

    }
  }
  WhatsSalesRetPdf(el) {

  }

  printpatient() {

  }
  printsalesDetails(contact) {
    debugger
    setTimeout(() => {
      const param = {
        "searchFields": [
          { "fieldName": "OP_IP_ID", "fieldValue": String(contact?.admissionId || 0), "opType": "13" },
          { "fieldName": "StoreId", "fieldValue": String(this._loggedService.currentUserValue?.user?.storeId), "opType": "13" }
        ],
        "mode": "PharmacySalesDetails"
      }
      this._BrowsSalesBillService.getReportView(param).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pharmacy Sales Details viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
        });
      });

    }, 100);
  }

  printsalesPatientstatement(contact) {
    setTimeout(() => {
      const param = {
        "searchFields": [
          { "fieldName": "OP_IP_ID", "fieldValue": String(contact?.admissionId || 0), "opType": "13" },
          { "fieldName": "StoreId", "fieldValue": String(this._loggedService.currentUserValue?.user?.storeId), "opType": "13" }
        ],
        "mode": "PharmacyPatientStatement"
      }
      this._BrowsSalesBillService.getReportView(param).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Patient Statement viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
        });
      });

    }, 100);
  }


  //whatsapp
  private overlayRef: OverlayRef | null = null;
  private EmailOverlayRef: OverlayRef | null = null;
  private whatsappOverlayRef: OverlayRef | null = null;
  private hoverTimeout: any = null;
  private patientCloseTimeout: any = null;
  private doctorCloseTimeout: any = null;

  openEmailDetailsPopover(event: MouseEvent, patientData: any) {
    event.stopPropagation();

    // Clear any existing timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    // Add small delay to prevent flickering
    this.hoverTimeout = setTimeout(() => {
      // Close any existing patient popover
      if (this.EmailOverlayRef) {
        this.EmailOverlayRef.dispose();
        this.EmailOverlayRef = null;
      }

      const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(event.target as HTMLElement)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
          }
        ]);

      this.EmailOverlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close(),
        hasBackdrop: false,
      });

      const portal = new ComponentPortal(SMSDetailsPopupOverComponent);
      const componentRef: ComponentRef<SMSDetailsPopupOverComponent> = this.EmailOverlayRef.attach(portal);


      console.log(patientData)
      patientData.billNo = patientData.salesId
      patientData.patientName = patientData.patientName
      patientData.regNo = patientData.regNo
      patientData.mobileNo = patientData.mobileNo
      patientData.emailId = patientData.emailId

      componentRef.instance.patientData = patientData;

      // Handle mouse events on the overlay element
      const overlayElement = this.EmailOverlayRef.overlayElement;
      overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
      overlayElement.addEventListener('mouseleave', () => this.closeEmailDetailsPopover());
    }, 300); // 300ms delay before showing popover
  }
  closeEmailDetailsPopover() {
    // Clear timeout if popover hasn't opened yet
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    // Clear any existing close timeout
    if (this.patientCloseTimeout) {
      clearTimeout(this.patientCloseTimeout);
    }

    // Add delay before closing to allow moving mouse to popover
    this.patientCloseTimeout = setTimeout(() => {
      if (this.EmailOverlayRef) {
        this.EmailOverlayRef.dispose();
        this.EmailOverlayRef = null;
      }
    }, 200);
  }
  openWhatsappDetailsPopover(event: MouseEvent, patientData: any) {
    event.stopPropagation();

    // Clear any existing timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    // Add small delay to prevent flickering
    this.hoverTimeout = setTimeout(() => {
      // Close any existing patient popover
      if (this.whatsappOverlayRef) {
        this.whatsappOverlayRef.dispose();
        this.whatsappOverlayRef = null;
      }

      const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(event.target as HTMLElement)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
          }
        ]);

      this.whatsappOverlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close(),
        hasBackdrop: false,
      });

      const portal = new ComponentPortal(WhatsappDetPopUpOverComponent);
      const componentRef: ComponentRef<WhatsappDetPopUpOverComponent> = this.whatsappOverlayRef.attach(portal);

debugger
      console.log(patientData)
      patientData.billNo = patientData.salesId
     
      componentRef.instance.patientData = patientData;

      // Handle mouse events on the overlay element
      const overlayElement = this.whatsappOverlayRef.overlayElement;
      overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
      overlayElement.addEventListener('mouseleave', () => this.closeWhatsappDetailsPopover());
    }, 300); // 300ms delay before showing popover
  }
  closeWhatsappDetailsPopover() {
    // Clear timeout if popover hasn't opened yet
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    // Clear any existing close timeout
    if (this.patientCloseTimeout) {
      clearTimeout(this.patientCloseTimeout);
    }

    // Add delay before closing to allow moving mouse to popover
    this.patientCloseTimeout = setTimeout(() => {
      if (this.whatsappOverlayRef) {
        this.whatsappOverlayRef.dispose();
        this.whatsappOverlayRef = null;
      }
    }, 200);
  }
  keepPatientPopoverOpen() {
    // Clear close timeout when hovering over popover
    if (this.patientCloseTimeout) {
      clearTimeout(this.patientCloseTimeout);
      this.patientCloseTimeout = null;
    }
  }
  Onmessage(data) { }

 
  //salesReturn
  openEmailDetailsPopover1(event: MouseEvent, patientData: any) {
    event.stopPropagation();

    // Clear any existing timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    // Add small delay to prevent flickering
    this.hoverTimeout = setTimeout(() => {
      // Close any existing patient popover
      if (this.EmailOverlayRef) {
        this.EmailOverlayRef.dispose();
        this.EmailOverlayRef = null;
      }

      const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(event.target as HTMLElement)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
          }
        ]);

      this.EmailOverlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close(),
        hasBackdrop: false,
      });

      const portal = new ComponentPortal(SMSDetailsPopupOverComponent);
      const componentRef: ComponentRef<SMSDetailsPopupOverComponent> = this.EmailOverlayRef.attach(portal);


      console.log(patientData)
      patientData.billNo = patientData.SalesReturnId
      // patientData.patientName = patientData.patientName
      // patientData.regNo = parseInt(patientData.regNo)
      // patientData.mobileNo = patientData.mobileNo
      // patientData.emailId = patientData.emailId

      componentRef.instance.patientData = patientData;

      // Handle mouse events on the overlay element
      const overlayElement = this.EmailOverlayRef.overlayElement;
      overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen1());
      overlayElement.addEventListener('mouseleave', () => this.closeEmailDetailsPopover1());
    }, 300); // 300ms delay before showing popover
  }
  closeEmailDetailsPopover1() {
    // Clear timeout if popover hasn't opened yet
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    // Clear any existing close timeout
    if (this.patientCloseTimeout) {
      clearTimeout(this.patientCloseTimeout);
    }

    // Add delay before closing to allow moving mouse to popover
    this.patientCloseTimeout = setTimeout(() => {
      if (this.EmailOverlayRef) {
        this.EmailOverlayRef.dispose();
        this.EmailOverlayRef = null;
      }
    }, 200);
  }
  openWhatsappDetailsPopover1(event: MouseEvent, patientData: any) {
    event.stopPropagation();

    // Clear any existing timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    // Add small delay to prevent flickering
    this.hoverTimeout = setTimeout(() => {
      // Close any existing patient popover
      if (this.whatsappOverlayRef) {
        this.whatsappOverlayRef.dispose();
        this.whatsappOverlayRef = null;
      }

      const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(event.target as HTMLElement)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
          }
        ]);

      this.whatsappOverlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close(),
        hasBackdrop: false,
      });

      const portal = new ComponentPortal(WhatsappDetPopUpOverComponent);
      const componentRef: ComponentRef<WhatsappDetPopUpOverComponent> = this.whatsappOverlayRef.attach(portal);


      console.log(patientData)
      patientData.billNo = patientData.salesReturnId
    
      componentRef.instance.patientData = patientData;

      // Handle mouse events on the overlay element
      const overlayElement = this.whatsappOverlayRef.overlayElement;
      overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen1());
      overlayElement.addEventListener('mouseleave', () => this.closeWhatsappDetailsPopover1());
    }, 300); // 300ms delay before showing popover
  }
  closeWhatsappDetailsPopover1() {
    // Clear timeout if popover hasn't opened yet
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    // Clear any existing close timeout
    if (this.patientCloseTimeout) {
      clearTimeout(this.patientCloseTimeout);
    }

    // Add delay before closing to allow moving mouse to popover
    this.patientCloseTimeout = setTimeout(() => {
      if (this.whatsappOverlayRef) {
        this.whatsappOverlayRef.dispose();
        this.whatsappOverlayRef = null;
      }
    }, 200);
  }
  keepPatientPopoverOpen1() {
    // Clear close timeout when hovering over popover
    if (this.patientCloseTimeout) {
      clearTimeout(this.patientCloseTimeout);
      this.patientCloseTimeout = null;
    }
  }
  Onmessage1(data) { }

    getWhatsappshareSalesBill(el) {
    console.log(el);
    debugger
    this._whatsppService.OnWhatsAppMsgSent({
      mobileNo: el.mobileNo,
      patientName: el.patientName,
      billNo: el.salesId,
      smsType: "SalesReceipt",
      patientId: el.regNo
    })
  }

  OnemailSales(contact) {
    const dialogRef = this._matDialog.open(EmailSendComponent,
      {
        maxWidth: "100%",
        height: '75%',
        width: '55%',
        data: {
          Obj: contact,
          emailType: 'SalesReceipt'
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });
  }



  getWhatsappsharesalesrefund(el) {
    console.log(el);
    debugger
    this._whatsppService.OnWhatsAppMsgSent({
      mobileNo: el.mobileNo,
      patientName: el.patientName,
      billNo: el.salesReturnId,
      smsType: "SalesReturnReceipt",
      patientId: el.regNo
    })
  }

  Onemasalesrefund(contact) {
    const dialogRef = this._matDialog.open(EmailSendComponent,
      {
        maxWidth: "100%",
        height: '75%',
        width: '55%',
        data: {
          Obj: contact,
          emailType: 'SalesReturnReceipt'
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });
  }
}

export class SaleList {
  Date: number;
  SalesNo: number;
  RegNo: number;
  PatientName: string;
  BalAmt: number;
  PaidAmt: number;
  PaidType: number;
  IPNo: any;


  constructor(SaleList) {
    {
      this.Date = SaleList.Date || 0;
      this.SalesNo = SaleList.SalesNo || 0;
      this.RegNo = SaleList.RegNo || 0;
      this.PatientName = SaleList.PatientName || '';
      this.BalAmt = SaleList.BalAmt || 0;
      this.PaidAmt = SaleList.PaidAmt || 0;
      this.PaidType = SaleList.PaidType || 0;
      this.IPNo = SaleList.IPNo || 0;
    }
  }
}

export class SalesDetList {

  ItemName: string;
  BatchNo: number;
  Expdate: number;
  Qty: string;
  MRP: number;
  TotalMRP: number;
  GST: number;
  CGST: any;
  SGST: any;
  IGST: any;

  constructor(SalesDetList) {
    {
      this.ItemName = SalesDetList.ItemName || '';
      this.BatchNo = SalesDetList.BatchNo || 0;
      this.Expdate = SalesDetList.Expdate || 0;
      this.Qty = SalesDetList.Qty || 0;
      this.MRP = SalesDetList.MRP || 0;
      this.TotalMRP = SalesDetList.TotalMRP || 0;
      this.GST = SalesDetList.GST || 0;
      this.CGST = SalesDetList.CGST || 0;
      this.SGST = SalesDetList.SGST || 0;
      this.IGST = SalesDetList.IGST || 0;
    }
  }
}

export class SalesReturnList {
  SalesDate: number;
  SalesNo: number;
  RegNo: number;
  PatientName: string;
  BalAmt: number;
  PaidAmt: number;
  Type: number;



  constructor(SalesReturnList) {
    {
      this.SalesDate = SalesReturnList.SalesDate || 0;
      this.SalesNo = SalesReturnList.SalesNo || 0;
      this.RegNo = SalesReturnList.RegNo || 0;
      this.PatientName = SalesReturnList.PatientName || '';
      this.BalAmt = SalesReturnList.BalAmt || 0;
      this.PaidAmt = SalesReturnList.PaidAmt || 0;
      this.Type = SalesReturnList.Type || 0;

    }
  }

}
export class SalesReturnDetList {

  ItemName: string;
  BatchNo: number;
  Expdate: number;
  Qty: string;
  MRP: number;
  TotalMRP: number;
  GSTAmount: number;
  CGST: any;
  SGST: any;
  IGST: any;

  constructor(SalesReturnDetList) {
    {
      this.ItemName = SalesReturnDetList.ItemName || '';
      this.BatchNo = SalesReturnDetList.BatchNo || 0;
      this.Expdate = SalesReturnDetList.Expdate || 0;
      this.Qty = SalesReturnDetList.Qty || 0;
      this.MRP = SalesReturnDetList.MRP || 0;
      this.TotalMRP = SalesReturnDetList.TotalMRP || 0;
      this.GSTAmount = SalesReturnDetList.GSTAmount || 0;
      this.CGST = SalesReturnDetList.CGST || 0;
      this.SGST = SalesReturnDetList.SGST || 0;
      this.IGST = SalesReturnDetList.IGST || 0;
    }
  }

}
