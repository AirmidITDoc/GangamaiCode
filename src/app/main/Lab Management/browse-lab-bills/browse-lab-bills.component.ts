import { DatePipe } from '@angular/common';
import { Component, ComponentRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { MatTabChangeEvent } from '@angular/material/tabs';
import { fuseAnimations } from '@fuse/animations';
import { Color, gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'app/core/services/config.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SMSDetailsPopupOverComponent } from 'app/main/shared/componets/email-send/smsdetails-popup-over/smsdetails-popup-over.component';
import { WhatsappDetPopUpOverComponent } from 'app/main/shared/componets/email-send/whatsapp-det-pop-up-over/whatsapp-det-pop-up-over.component';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { BrowseLabBillsService } from './browse-lab-bills.service';
import { ReviewcompanyBillComponent } from 'app/main/opd/new-oplist/reviewcompany-bill/reviewcompany-bill.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { permissionCodes } from 'app/main/shared/model/permission.model';


@Component({
  selector: 'app-browse-lab-bills',
  templateUrl: './browse-lab-bills.component.html',
  styleUrls: ['./browse-lab-bills.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class BrowseLabBillsComponent {
  myFilterbillform: FormGroup;
  myFilterpayform: FormGroup;
  myFilterrefundform: FormGroup;
  menuActions: Array<string> = [];

  @ViewChild('opBillGrid', { static: false }) grid: AirmidTableComponent;
  @ViewChild('opPaymentGrid', { static: false }) grid1: AirmidTableComponent;
  @ViewChild('opRefundGrid', { static: false }) grid2: AirmidTableComponent;

  hasSelectedContacts: boolean;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  vMobileNo: any;
  vbalanceamt: any;
  vpaidamt: any;
  vOPIPId = 0;
  f_name: any = ""
  regNo: any = "0"
  l_name: any = ""
  CompanyId = 0
  PBillNo: any = "%"
  autocompleteModecompany: string = "Company";
  autocompleteModecompany1: string = "Company";
  autocompleteModeunit: string = "Hospital";
  pf_name: any = ""
  pregNo: any = "0"
  pl_name: any = ""
  precptNo = "0"
  pPBillNo: any = "%"

  rf_name: any = ""
  rregNo: any = "0"
  rl_name: any = ""
  rPBillNo: any = "%"
  rrefundNo = "0"
  rfromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  rtoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  OpSettlementForm: FormGroup

  pfromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  ptoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  UnitId: any = this.accountService.currentUserValue.user.unitId;
  isSuperAdmin: any = this.accountService.currentUserValue.user.isAdminMultiview;

  @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
  @ViewChild('actionsTemplate2') actionsTemplate2!: TemplateRef<any>;
  @ViewChild('actionsTemplate3') actionsTemplate3!: TemplateRef<any>;
  @ViewChild('actionsTemplate4') actionsTemplate4!: TemplateRef<any>;

  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate1') actionButtonTemplate1!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate2') actionButtonTemplate2!: TemplateRef<any>;

  allOBillfilters = [
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals },
    { fieldName: "CompanyId", fieldValue: '0', opType: OperatorComparer.Equals },
    { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
  ];

  allOPbillcolumns = [
    { heading: "", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template, emptySign: 'NA', width: 45 },
    { heading: "", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    { heading: "", key: "refundAmount1", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    { heading: "", key: "balanceAmt1", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    { heading: "BillDate", key: "billTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 8 },
    { heading: "PBillNo", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Age", key: "patientAge", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Total Amount", key: "totalAmt", sort: true, align: 'right', emptySign: 'NA', type: gridColumnTypes.amount }, // It is just example of apply color based on condition
    { heading: "Disc Amount", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Paid Amount", key: "paidAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Balance Amount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["balanceAmt"] > 0 ? Color.RED : "" },
    { heading: "Cash Pay", key: "cashPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Cheque Pay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Card Pay", key: "cardPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Adv Used Pay", key: "advUsedPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Online Pay", key: "onlinePay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "PayCount", key: "payCount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["refundAmount"] > 0 ? Color.RED : "" },
    { heading: "Cash Counter Name", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "VisitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
    { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Ref DoctorName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Unit Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    // { heading: "DepartmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    {
      heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate
    }  // Assign ng-template to the column

  ];


  allOPpaymentfilters = [
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "From_Dt", fieldValue: this.pfromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.ptoDate, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Contains },
    { fieldName: "ReceiptNo", fieldValue: "0", opType: OperatorComparer.Contains },
    { fieldName: "CompanyId", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
  ];

  allOPpaymentcolumns = [
    { heading: "Date", key: "paymentTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 200 },
    { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "ReceiptNo", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Age", key: "ageYear", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Bill Amount", key: "billAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Balance Amount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Paid Amount", key: "paidAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "CashPay", key: "cashAmount", sort: true, align: "center", type: gridColumnTypes.amount },
    { heading: "ChequePay", key: "chequeAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "CardPay", key: "cardAmount", sort: true, align: "center", type: gridColumnTypes.amount },
    { heading: "AdvUsedPay", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "OnlinePay", key: "onlineAmount", sort: true, align: "center", type: gridColumnTypes.amount },
    { heading: "Transaction Type", key: "transactionLabel", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "VisitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Ref DoctorName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "UnitName", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "CompanyName", key: "companyName", sort: true, align: "center", width: 200 },
    { heading: "UserName", key: "userName", sort: true, align: "center", width: 200 },
    {
      heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate1
    },

  ];

  allOPRefundFilters = [
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "From_Dt", fieldValue: this.rfromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.rtoDate, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
    { fieldName: "RefundNo", fieldValue: "0", opType: OperatorComparer.Contains },
    { fieldName: "CompanyId", fieldValue: "0", opType: OperatorComparer.Equals },
  ]

  allOPRefundColumns = [
    { heading: "RefundDate", key: "refundTime", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "RefundNo", key: "refundNo", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "PaymentDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 150 },
    { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Bill Amount", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "RefDoctorName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "UnitName", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "PatientType", key: "patientType", sort: true, align: "center" },
    { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "CompanyName", key: "companyName", sort: true, align: "center", width: 200 },
    {
      heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate2
    },
  ]

  ngAfterViewInit() {
    // Assign the template to the column dynamically
    this.gridConfig.columnsList.find(col => col.key === 'patientType')!.template = this.actionsTemplate1;
    this.gridConfig.columnsList.find(col => col.key === 'isCancelled')!.template = this.actionsTemplate2;
    this.gridConfig.columnsList.find(col => col.key === 'refundAmount1')!.template = this.actionsTemplate3;
    this.gridConfig.columnsList.find(col => col.key === 'balanceAmt1')!.template = this.actionsTemplate4;
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    this.gridConfig1.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate1;
    this.gridConfig2.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate2;
  }


  gridConfig: gridModel = {
    permissionCode: permissionCodes.ExternalInvestigation,
    apiUrl: "LabBrowseList/LabBillList",
    columnsList: this.allOPbillcolumns,
    sortField: "BillDate",
    sortOrder: 0,
    filters: this.allOBillfilters
  }

  gridConfig1: gridModel = {
    permissionCode: permissionCodes.ExternalInvestigation,
    apiUrl: "LabBrowseList/LabPaymentList",
    columnsList: this.allOPpaymentcolumns,
    sortField: "BillDate",
    sortOrder: 0,
    filters: this.allOPpaymentfilters
  }


  gridConfig2: gridModel = {
    permissionCode: permissionCodes.ExternalInvestigation,
    apiUrl: "LabBrowseList/LabRefundList",
    columnsList: this.allOPRefundColumns,
    sortField: "BillDate",
    sortOrder: 0,
    filters: this.allOPRefundFilters
  }

  constructor(public _OPListService: BrowseLabBillsService, public _matDialog: MatDialog,
    public toastr: ToastrService, public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public _ConfigService: ConfigService,
    public _accountService: AuthenticationService,
    public _whatsppService: WhatsAppEmailService,
    public _FormvalidationserviceService: FormvalidationserviceService,
    private overlay: Overlay,
    public formBuilder: UntypedFormBuilder,
    public accountService: AuthenticationService,
  ) { }


  ngOnInit(): void {
    this.myFilterbillform = this._OPListService.myFilterbillbrowseform();
    this.myFilterbillform.get('UnitId').setValue(this.accountService.currentUserValue.user.unitId)
    this.myFilterpayform = this._OPListService.myFilterpaymentbrowseform();
    this.myFilterrefundform = this._OPListService.myFilterrefundbrowseform();
    this.OpSettlementForm = this.CreateOPSettlementForm();


    this.menuActions.push("Bill Print-Package Info");
    this.menuActions.push("Bill Print");
  }

  isActionEnabled(element: any): boolean {
    return (
      (element.patientType === 'Self' && element.isVerifySign === true) ||
      (element.patientType !== 'Self' && element.isVerifySign === false)
    );
  }

  getVerificationTooltip(element: any): string {
    return this.isActionEnabled(element)
      ? ''
      : 'Verification is pending';
  }

  ListViewUnit1(value) {
    console.log(value)
    if (value.value !== 0)
      this.UnitId = value.value
    else
      this.UnitId = 0

    this.onChangeOPBill();
  }

  ListViewUnit2(value) {
    console.log(value)
    if (value.value !== 0)
      this.UnitId = value.value
    else
      this.UnitId = 0

    this.onChangeOPPayment();
  }

  ListViewUnit3(value) {
    console.log(value)
    if (value.value !== 0)
      this.UnitId = value.value
    else
      this.UnitId = 0

    this.onChangeOPRefund();
  }

  CreateOPSettlementForm() {
    return this.formBuilder.group({
      opCreditPayment: this.formBuilder.group({
        paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        // receiptNo:['0'],
        paymentDate: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
        paymentTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
        cashPayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        chequePayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        chequeNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        bankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        chequeDate: ['1999-01-01'],
        cardPayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        cardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        cardBankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        cardDate: ['1999-01-01'],
        advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        transactionType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        addBy: [this.accountService.currentUserValue.userId],
        isCancelled: [false],
        isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelledDate: ['1999-01-01'],
        opdipdType: [0],
        neftpayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        neftbankMaster: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        neftdate: ['1999-01-01'],
        payTmamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        payTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        payTmdate: ['1999-01-01'],
        tdsamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.onlyNumberValidator()]],
        wfamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }),
      //bill update 
      billUpdate: this.formBuilder.group({
        billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        balanceAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      }),
      //New Payments
      // ✅ Fixed: should be FormArray
      tPayments: this.formBuilder.array([]),
    })
  }

  CreateModePaymentform(item: any): FormGroup {
    return this.formBuilder.group({
      paymentId: [item?.paymentId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      unitId: [item?.unitId ?? this.accountService.currentUserValue.user.unitId],
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
      tranMode: [item?.tranMode ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      createdBy: [item?.createdBy ?? this.accountService.currentUserValue.userId],
      transactionLabel: [item?.transactionLabel ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
    });
  }

  get ModeOfPaymentsArray(): FormArray {
    return this.OpSettlementForm.get('tPayments') as FormArray;
  }

  viewgetOPPayemntPdf(data, status) {
    if (status == true)
      this.commonService.Onprint("PaymentId", data.paymentId, "OPLabPaymentReceipt");
    else
      this.commonService.Onprint("PaymentId", data.paymentId, "OPLabPaymentReceipt");
  }
  getWhatsappsharePaymentReceipt(Id, Mobile) { }


  viewgetOPRefundBillReportPdf(data) {

    this.commonService.Onprint("RefundId", data.refundId, "LabRefundReceipt");
  }
  getWhatsappshareRefundBill(Id) { }

  OnPrint(element) {
    const [ThermalPrint, ThermalPrintValue] = this._ConfigService.configParams.ThermalPrint.split(":");
    if (ThermalPrint != 1) {
      this.commonService.Onprint("BillNo", element.billNo, "LabBillReceipt");
    } else {
      // Use thermal print with preview - shows preview first, then auto-prints
      this.commonService.OnThermalPrint("BillNo", element.billNo, "LabBillReceiptT");
    }
  }

  OnCompanyBill(element) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur();
    const dialogRef = this._matDialog.open(ReviewcompanyBillComponent, {
      maxWidth: "95vw",
      height: "95vh",
      width: "100%",
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });
  }

  OngetRecord(element, m) {

    console.log('Third action clicked for:', element);
    const [ThermalPrint, ThermalPrintValue] = this._ConfigService.configParams.ThermalPrint.split(":");
    // if (m == "Bill Print"){
    //       if (ThermalPrint != 1) {
    //              this.commonService.Onprint("BillNo", element.billNo, "LabBillReceipt");
    //             } else {
    //               this.commonService.Onprint("BillNo", element.billNo, "LabBillReceiptT");
    //             } 
    // }
    // else 
    if (m == "Bill Print-Package Info")
      this.commonService.Onprint("BillNo", element.billNo, "OPBillWithPackagePrint");
    else if (m == "Bill Print")
      this.commonService.Onprint("BillNo", element.billNo, "LabBillReceipt");
  }


  openPaymentpopup(contact) {
    console.log(contact)
    let PatientHeaderObj = {};
    PatientHeaderObj['Date'] = this.datePipe.transform(contact.billDate, 'MM/dd/yyyy') || '01/01/1900',
      PatientHeaderObj['RegNo'] = contact.labRequestNo;
    PatientHeaderObj['PatientName'] = contact.patientName;
    PatientHeaderObj['OPD_IPD_Id'] = contact.labPatientId;
    PatientHeaderObj['Age'] = contact.ageYear;
    PatientHeaderObj['DepartmentName'] = contact.departmentName;
    PatientHeaderObj['billNo'] = contact.billNo || 0;
    PatientHeaderObj['DoctorName'] = contact.doctorName;
    PatientHeaderObj['TariffName'] = contact.tariffName;
    PatientHeaderObj['CompanyName'] = contact.companyName;
    PatientHeaderObj['NetPayAmount'] = contact.balanceAmt;
    PatientHeaderObj['TransactionLabel'] = 'LAB_SETTLEMENT';
    // this.vMobileNo = contact.mobileNo;
    const dialogRef = this._matDialog.open(OpPaymentComponent,
      {
        maxWidth: "80vw",
        width: '70%',
        maxHeight: "90vw",
        height: '90%',
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "LAB-SETTLEMENT"
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result.IsSubmitFlag == true) {
        this.OpSettlementForm.get('billUpdate.billNo').setValue(contact.billNo)
        this.OpSettlementForm.get('billUpdate.balanceAmt').setValue(result.BillBalanceAmount)
        this.OpSettlementForm.get('opCreditPayment').setValue(result.submitDataPay.ipPaymentInsert)

        this.ModeOfPaymentsArray.clear();
        result.submitDataPay.ipModePaymentInsert.forEach(item => {
          this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item));
        });

        debugger
        if (this.OpSettlementForm.valid) {
          console.log(this.OpSettlementForm.value)
          console.log(result.submitDataPay.ipPaymentInsert)

          this._OPListService.InsertLabBillingsettlement(this.OpSettlementForm.value).subscribe(response => {
            this.viewgetOPPayemntPdf(response, true);
            this.grid.bindGridData();
          });
        } else {
          let invalidFields = []
          if (this.OpSettlementForm.invalid) {
            for (const controlName in this.OpSettlementForm.controls) {
              const control = this.OpSettlementForm.get(controlName);
              if (control instanceof FormGroup || control instanceof FormArray) {
                for (const nestedKey in control.controls) {
                  if (control.get(nestedKey)?.invalid) {
                    invalidFields.push(`OP Settlement Data: ${controlName}.${nestedKey}`);
                  }
                }
              } else if (control?.invalid) {
                invalidFields.push(`OPSettlement From: ${controlName}`);
              }
            }
          }
          if (invalidFields.length > 0) {
            invalidFields.forEach(field => {
              this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
              );
            });
            return
          }
        }
      }
    });
  }

  onTabChange(event: MatTabChangeEvent) {
    console.log('Selected Tab Index:', event.index);
    console.log('Selected Tab Label:', event.tab.textLabel);

    // Add custom logic here
    if (event.index === 1) {
      this.grid.gridConfig = this.gridConfig
      console.log('Tab 1 is selected');
      this.grid.bindGridData();

    }
    if (event.index === 2) {
      this.grid.gridConfig = this.gridConfig1
      console.log('Tab 2 is selected');
      this.grid.bindGridData();

    }
    if (event.index === 3) {
      this.grid.gridConfig = this.gridConfig2
      console.log('Tab 3 is selected');
      this.grid.bindGridData();

    }
  }

  onChangeOPBill() {
    // debugger
    this.fromDate = this.datePipe.transform(this.myFilterbillform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilterbillform.get('enddate').value, "yyyy-MM-dd")
    this.f_name = this.myFilterbillform.get('FirstName').value + "%"
    this.l_name = this.myFilterbillform.get('LastName').value + "%"
    this.regNo = this.myFilterbillform.get('RegNo').value || "0"
    this.PBillNo = this.myFilterbillform.get('PBillNo').value || "%"
    this.CompanyId = this.myFilterbillform.get('CompanyId').value || "0"
    this.UnitId = this.myFilterbillform.get('UnitId').value || "0"

    this.getfilterdataOpBill();
  }

  getfilterdataOpBill() {

    this.gridConfig = {
      apiUrl: "LabBrowseList/LabBillList",
      columnsList: this.allOPbillcolumns,
      sortField: "BillDate",
      sortOrder: 0,
      filters: [{ fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
      { fieldName: "PBillNo", fieldValue: this.PBillNo, opType: OperatorComparer.Equals },
      { fieldName: "CompanyId", fieldValue: this.CompanyId, opType: OperatorComparer.Equals },
      { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  ClearfilterOPbill(event) {
    console.log(event)
    if (event == 'FirstName')
      this.myFilterbillform.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this.myFilterbillform.get('LastName').setValue("")
    if (event == 'RegNo')
      this.myFilterbillform.get('RegNo').setValue("")
    if (event == 'PBillNo')
      this.myFilterbillform.get('PBillNo').setValue("")

    this.onChangeOPBill();
  }

  ListView(value) {
    console.log(value)
    if (value.value !== 0)
      this.CompanyId = value.value
    else
      this.CompanyId = 0

    this.onChangeOPBill();
  }

  CompanyId1 = 0
  ListView1(value) {
    console.log(value)
    if (value.value !== 0)
      this.CompanyId1 = value.value
    else
      this.CompanyId1 = 0

    this.onChangeOPPayment();
  }

  CompanyId2 = 0
  ListView2(value) {
    console.log(value)
    if (value.value !== 0)
      this.CompanyId2 = value.value
    else
      this.CompanyId2 = 0

    this.onChangeOPRefund();
  }

  onChangeOPPayment() {
    this.pfromDate = this.datePipe.transform(this.myFilterpayform.get('fromDate').value, "yyyy-MM-dd")
    this.ptoDate = this.datePipe.transform(this.myFilterpayform.get('enddate').value, "yyyy-MM-dd")
    this.pf_name = this.myFilterpayform.get('FirstName').value + "%"
    this.pl_name = this.myFilterpayform.get('LastName').value + "%"
    this.pregNo = this.myFilterpayform.get('RegNo').value || "0"
    this.pPBillNo = this.myFilterpayform.get('PBillNo').value || "0"
    this.precptNo = this.myFilterpayform.get('ReceiptNo').value || "0"
    this.CompanyId1 = this.myFilterpayform.get('CompanyId').value || "0"
    this.UnitId = this.myFilterpayform.get('UnitId').value || "0"
    this.getfilterdataOpPayment();
  }

  getfilterdataOpPayment() {
    this.gridConfig1 = {
      apiUrl: "LabBrowseList/LabPaymentList",
      columnsList: this.allOPpaymentcolumns,
      sortField: "BillDate",
      sortOrder: 0,
      filters: [{ fieldName: "F_Name", fieldValue: this.pf_name, opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: this.pl_name, opType: OperatorComparer.Contains },
      { fieldName: "From_Dt", fieldValue: this.pfromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.ptoDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: this.pregNo, opType: OperatorComparer.Equals },
      { fieldName: "PBillNo", fieldValue: this.pPBillNo, opType: OperatorComparer.Equals },
      { fieldName: "ReceiptNo", fieldValue: this.precptNo, opType: OperatorComparer.Contains },
      { fieldName: "CompanyId", fieldValue: this.CompanyId1, opType: OperatorComparer.Equals },
      { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
      ]
    }

    this.grid1.gridConfig = { ...this.gridConfig1 }; // Use a new object reference
    this.grid1.bindGridData(); // Only refresh the OPPayment grid
  }

  ClearfilterOPpayment(event) {
    console.log(event)
    if (event == 'FirstName')
      this.myFilterpayform.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this.myFilterpayform.get('LastName').setValue("")
    if (event == 'RegNo')
      this.myFilterpayform.get('RegNo').setValue("")
    if (event == 'PBillNo')
      this.myFilterpayform.get('PBillNo').setValue("")
    if (event == 'ReceiptNo')
      this.myFilterpayform.get('ReceiptNo').setValue("")

    this.onChangeOPPayment();
  }


  onChangeOPRefund() {
    this.rfromDate = this.datePipe.transform(this.myFilterrefundform.get('fromDate').value, "yyyy-MM-dd")
    this.rtoDate = this.datePipe.transform(this.myFilterrefundform.get('enddate').value, "yyyy-MM-dd")
    this.rf_name = this.myFilterrefundform.get('FirstName').value + "%"
    this.rl_name = this.myFilterrefundform.get('LastName').value + "%"
    this.rregNo = this.myFilterrefundform.get('RegNo').value || "0"
    this.UnitId = this.myFilterrefundform.get('UnitId').value || "0"
    this.rrefundNo = this.myFilterrefundform.get('RefundNo').value || "0"
    this.CompanyId2 = this.myFilterrefundform.get('CompanyId').value || "0"
    this.getfilterdataOPRefund();
  }

  getfilterdataOPRefund() {
    this.gridConfig2 = {
      apiUrl: "LabBrowseList/LabRefundList",
      columnsList: this.allOPRefundColumns,
      sortField: "BillDate",
      sortOrder: 0,
      filters: [
        { fieldName: "F_Name", fieldValue: this.rf_name, opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: this.rl_name, opType: OperatorComparer.Contains },
        { fieldName: "From_Dt", fieldValue: this.rfromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.rtoDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: this.rregNo, opType: OperatorComparer.Equals },
        { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
        { fieldName: "RefundNo", fieldValue: this.rrefundNo, opType: OperatorComparer.Contains },
        { fieldName: "CompanyId", fieldValue: this.CompanyId2, opType: OperatorComparer.Equals },
      ]
    }
    this.grid2.gridConfig = { ...this.gridConfig2 }; // Use a new object reference
    this.grid2.bindGridData(); // Only refresh the OPRefund grid        

  }

  ClearfilterOPRefund(event) {
    console.log(event)
    if (event == 'FirstName')
      this.myFilterrefundform.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this.myFilterrefundform.get('LastName').setValue("")
    if (event == 'RegNo')
      this.myFilterrefundform.get('RegNo').setValue("")
    if (event == 'RefundNo')
      this.myFilterrefundform.get('RefundNo').setValue("")

    this.onChangeOPRefund();
  }
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
  ngOnDestroy() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
    if (this.EmailOverlayRef) {
      this.EmailOverlayRef.dispose();
    }
    if (this.whatsappOverlayRef) {
      this.whatsappOverlayRef.dispose();
    }
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    if (this.patientCloseTimeout) {
      clearTimeout(this.patientCloseTimeout);
    }
    if (this.doctorCloseTimeout) {
      clearTimeout(this.doctorCloseTimeout);
    }
  }
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  Onmessage(data) { }

  getWhatsappshareBill(el) {
    console.log(el);
    this._whatsppService.OnWhatsAppMsgSent({
      mobileNo: el.mobileNo,
      patientName: el.patientName,
      billNo: el.billNo,
      smsType: "OPBill",
      patientId: el.regNo
    })
  }

  Onemail(contact) {
    const dialogRef = this._matDialog.open(EmailSendComponent,
      {
        maxWidth: "100%",
        height: '75%',
        width: '55%',
        data: {
          Obj: contact,
          emailType: 'OPBill'
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });
  }
}

export class BrowseOPDBill {
  BillNo: Number;

  RegId: number;
  RegNo: number;
  PatientName: string;
  FirstName: string;
  Middlename: string;
  LastName: string;

  TotalAmt: number;
  ConcessionAmt: number;
  NetPayableAmt: number;
  BillDate: any;
  IPDNo: number;
  ServiceName: String;
  Price: number;
  price: number;
  Qty: number;
  ChargesTotalAmount: number;
  NetAmount: number;
  PaidAmount: number;
  HospitalName: string;
  HospitalAddress: string;
  Phone: number;
  EmailId: any;
  ChargesDoctorName: string;
  TotalBillAmount: number;
  ConsultantDocName: string;
  DepartmentName: string;
  IsCancelled: boolean;
  OPD_IPD_Type: number;
  PBillNo: string;
  BDate: Date;
  VisitDate: Date;
  BalanceAmt: number;
  AddedByName: string;
  Department: any;
  Address: any;
  MobileNo: any;
  CashCounterID: number;
  //NEFTPayAmount:number;
  /**
   * Constructor
   *
   * @param BrowseOPDBill
   */
  constructor(BrowseOPDBill) {
    {
      this.BillNo = BrowseOPDBill.BillNo || '';
      this.RegId = BrowseOPDBill.RegId || '';
      this.RegNo = BrowseOPDBill.RegNo || '';
      this.PatientName = BrowseOPDBill.PatientName || '';
      this.FirstName = BrowseOPDBill.FirstName || '';
      this.Middlename = BrowseOPDBill.MiddleName || '';
      this.LastName = BrowseOPDBill.LastName || '';

      this.TotalAmt = BrowseOPDBill.TotalAmt || '';
      this.ConcessionAmt = BrowseOPDBill.ConcessionAmt || '';
      this.NetPayableAmt = BrowseOPDBill.NetPayableAmt || '';
      this.BillDate = BrowseOPDBill.BillDate || '';
      this.IPDNo = BrowseOPDBill.IPDNo || '';
      this.IsCancelled = BrowseOPDBill.IsCancelled || '';
      this.OPD_IPD_Type = BrowseOPDBill.OPD_IPD_Type || '';
      this.PBillNo = BrowseOPDBill.PBillNo || '';
      this.BDate = BrowseOPDBill.BDate || '';
      this.PaidAmount = BrowseOPDBill.PaidAmount || '';
      this.BalanceAmt = BrowseOPDBill.BalanceAmt || '';
      this.ServiceName = BrowseOPDBill.ServiceName || '';
      this.Price = BrowseOPDBill.Price || '';
      this.price = BrowseOPDBill.price || '';
      this.Qty = BrowseOPDBill.Qty || '';
      this.ChargesTotalAmount = BrowseOPDBill.ChargesTotalAmount || '';
      this.NetAmount = BrowseOPDBill.NetAmount || '';
      this.HospitalName = BrowseOPDBill.HospitalName || '';
      this.HospitalAddress = BrowseOPDBill.HospitalAddress || '';
      this.ChargesTotalAmount = BrowseOPDBill.ChargesTotalAmount || '';
      this.Phone = BrowseOPDBill.Phone || '';
      this.EmailId = BrowseOPDBill.EmailId || '';
      this.ConsultantDocName = BrowseOPDBill.ConsultantDocName || '';
      this.DepartmentName = BrowseOPDBill.DepartmentName || '';
      this.TotalBillAmount = BrowseOPDBill.TotalBillAmount || '';
      this.ChargesDoctorName = BrowseOPDBill.ChargesDoctorName || '';
      this.VisitDate = BrowseOPDBill.VisitDate || '';
      this.AddedByName = BrowseOPDBill.AddedByName || '';
      this.TotalAmt = BrowseOPDBill.TotalAmt || '';

      this.Address = BrowseOPDBill.Address || '';
      this.Department = BrowseOPDBill.Department || '';
      this.MobileNo = BrowseOPDBill.MobileNo || '';
      this.CashCounterID = BrowseOPDBill.CashCounterID || 0
    }
  }

}

