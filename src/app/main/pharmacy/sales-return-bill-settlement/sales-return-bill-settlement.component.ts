import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { OpPaymentVimalComponent } from 'app/main/opd/op-search-list/op-payment-vimal/op-payment-vimal.component';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DiscountAfterFinalBillComponent } from './discount-after-final-bill/discount-after-final-bill.component';
import { SalesReturnBillSettlementService } from './sales-return-bill-settlement.service';
import { Color, gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { addBusinessDays } from 'date-fns';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { IpPaymentInsert } from 'app/main/ipd/ip-search-list/ip-advance/ip-advance.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { element } from 'protractor';

@Component({
  selector: 'app-sales-return-bill-settlement',
  templateUrl: './sales-return-bill-settlement.component.html',
  styleUrls: ['./sales-return-bill-settlement.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SalesReturnBillSettlementComponent implements OnInit {
    displayedColumns = [ 
    'Status',
    'date',
    'salesNo',
    'regNo',
    'patientName',
    'totalAmount',
    'discPer',
    'discAmount',
    'netAmount',
    'paidAmount',
    'refundAmt',
    'balanceAmount',
    'Action'
  ];
   
  userFormGroup: FormGroup;
  MutliSettlemForm: FormGroup;
  globleDiscFrom:FormGroup;
  chargelist:any=[];
  RegNo: any;
  TariffName: any;
  CompanyName: any;
  registerObj: any;
  PatientName: any;
  RegId: any = '';
  OP_IP_Id: any;
  DoctorName: any;
  BedName: any;
  OPDNo: any;
  IPDNo: any
  DoctorNamecheck: boolean = false;
  IPDNocheck: boolean = false;
  OPDNoCheck: boolean = false; 
  vglobledisc: boolean = false;
  WardName: any = ''
  mRegNo: any;
  mTariffName: any;
  mPatientName: any;
  mDoctorName: any;
  mBedName: any;
  mOPDNo: any;
  mIPDNo: any
  mWardName: any = ''
  mRegId: any = '' 
   autocompleteModeConcession: string = "Concession";
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('grid', { static: false }) grid: AirmidTableComponent;
  @ViewChild('grid1', { static: false }) grid1: AirmidTableComponent;

  @ViewChild('actionsTemplateCompany') actionsTemplateCompany!: TemplateRef<any>;
  @ViewChild('actionsTemplateCompanyMulti') actionsTemplateCompanyMulti!: TemplateRef<any>;
  @ViewChild('actionButtonTemplatePay') actionButtonTemplatePay!: TemplateRef<any>;
  @ViewChild('actionButtonTemplatePayMulti') actionButtonTemplatePayMulti!: TemplateRef<any>;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'patientType')!.template = this.actionsTemplateCompany;
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplatePay;
    this.gridConfig1.columnsList.find(col => col.key === 'patientType')!.template = this.actionsTemplateCompanyMulti;
    this.gridConfig1.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplatePayMulti;
  }
  AllColumns = [
    {
      heading: "-", key: "patientType", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
      template: this.actionsTemplateCompany, width: 40
    },
    { heading: "Sales Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Sales No", key: "salesNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Total Amt", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Discount Amt", key: "discAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Net Amt", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Paid Amt", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Refund Amt", key: "refundAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["balanceAmount"] > 0 ? Color.RED : "" },
    {
      heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplatePay  // Assign ng-template to the column
    }
  ]
  gridConfig: gridModel = {
    apiUrl: "Sales/PharSalesSettlemet",
    columnsList: this.AllColumns,
    sortField: "SalesId",
    sortOrder: 0,
    filters: [
      { fieldName: "RegId", fieldValue: '0', opType: OperatorComparer.Contains },
      { fieldName: "OP_IP_ID", fieldValue: '0', opType: OperatorComparer.Contains },
      { fieldName: "OP_IP_Type", fieldValue: '0', opType: OperatorComparer.Contains },
    ],
    row: 25
  }

  AllColumnsMultiple = [
    {
      heading: "-", key: "patientType", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
      template: this.actionsTemplateCompanyMulti, width: 40
    },
    { heading: "Sales Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Sales No", key: "salesNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Total Amt", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Discount Amt", key: "discAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Net Amt", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Paid Amt", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount }, 
    { heading: "Refund Amt", key: "refundAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["balanceAmount"] > 0 ? Color.RED : "" },
    {
      heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplatePayMulti  // Assign ng-template to the column
    }
  ]
  gridConfig1: gridModel = {
    apiUrl: "Sales/PharSalesSettlemet",
    columnsList: this.AllColumnsMultiple,
    sortField: "SalesId",
    sortOrder: 0,
    filters: [
      { fieldName: "RegId", fieldValue: '0', opType: OperatorComparer.Contains },
      { fieldName: "OP_IP_ID", fieldValue: '0', opType: OperatorComparer.Contains },
      { fieldName: "OP_IP_Type", fieldValue: '0', opType: OperatorComparer.Contains },
    ],
    row: 25
  }
  dsPaidItemList = new MatTableDataSource<PaidItemList>();
  dssalesbillListMultiple = new MatTableDataSource<PaidItemList>(); 

  constructor(
    public _SelseSettelmentservice: SalesReturnBillSettlementService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    public toastr: ToastrService,
    public _formBuilder: FormBuilder,
     private commonService: PrintserviceService,
    public _FormvalidationserviceService: FormvalidationserviceService
  ) { }

  ngOnInit(): void {
    this.userFormGroup = this.CreateUseFrom();
    this.MutliSettlemForm = this.CreateMultipleFrom();
    this.PharmaSettlementfrom = this.createSettlementform();
    this.globleDiscFrom = this.CreateApplyglobeDiscForm();
  }
  CreateUseFrom() {
    return this._formBuilder.group({
      RegID: [''],
      PatientType: ['1'],
      MobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10),]],
    });
  }
  CreateMultipleFrom() {
    return this._formBuilder.group({
      RegID: [''],
      PatientType: ['1'],
      MobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10),]],
      FinalNetAmt: 0,
      FinalPaidAmt: 0,
      FinalBalanceAmt: 0,
      globledisc:[false],
      globlediscPer:[0],
      ConcessionId:[0]
    });
  }

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
      tranMode: [item?.tranMode ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      createdBy: [item?.createdBy ?? this._loggedService.currentUserValue.userId],
      transactionLabel: [item?.transactionLabel ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
    });
  }
  // Getters 
  get ModeOfPaymentsArray(): FormArray {
    return this.PharmaSettlementfrom.get('tPayments') as FormArray;
    }
  get AdvanceDetailsArray(): FormArray {
    return this.PharmaSettlementfrom.get('advanceDetail') as FormArray;
  }
  get salessArray(): FormArray {
    return this.PharmaSettlementfrom.get('saless') as FormArray;
  }
  get PaymentArray(): FormArray {
    return this.PharmaSettlementfrom.get('payment') as FormArray;
  }
  onChangePatientType(event) {
    if (event.value == 'OP') {
      this.RegId = '';
      this.userFormGroup.get('MobileNo').clearValidators();
      this.userFormGroup.get('MobileNo').updateValueAndValidity();
      this.userFormGroup.get('RegID').setValue('');
    } else if (event.value == 'IP') {
      this.RegId = '';
      this.userFormGroup.get('MobileNo').clearValidators();
      this.userFormGroup.get('MobileNo').updateValueAndValidity();
      this.userFormGroup.get('RegID').setValue('');
    } else {
      this.userFormGroup.get('MobileNo').reset();
      this.userFormGroup.get('MobileNo').setValidators([Validators.required]);
      this.userFormGroup.get('MobileNo').enable();
      this.userFormGroup.get('RegID').setValue('');
      this.userFormGroup.updateValueAndValidity();
    }
    this.PatientInformRest();
    this.getdata(); 
  }
  getSelectedObjRegIP(obj) { 
    this.registerObj =obj  
      this.DoctorNamecheck = true;
      this.IPDNocheck = true;
      this.OPDNoCheck = false;
      this.RegId = obj.regID,
        this.OP_IP_Id = obj.admissionID,
        this.RegNo = obj.regNo;
      this.PatientName = obj.firstName + ' ' + obj.lastName;
      this.IPDNo = obj.ipdNo;
      this.DoctorName = obj.doctorName;
      this.TariffName = obj.tariffName;
      this.WardName = obj.roomName;
      this.BedName = obj.bedName;
     this.getdata();
  }
  getSelectedObjOp(obj) { 
     this.registerObj =obj
    this.DoctorNamecheck = true;
    this.IPDNocheck = false;
    this.OPDNoCheck = true;
    this.RegId = obj.regId,
      this.OP_IP_Id = obj.visitId,
      this.RegNo = obj.regNo;
    this.PatientName = obj.firstName + ' ' + obj.lastName;
    this.OPDNo = obj.opdNo;
    this.DoctorName = obj.doctorName;
    this.TariffName = obj.tariffName;
    this.getdata();
  }
  getdata() { 
    debugger
    let opiptype = this.userFormGroup.get('PatientType').value
    this.gridConfig = {
      apiUrl: "Sales/PharSalesSettlemet",
      columnsList: this.AllColumns,
      sortField: "SalesId",
      sortOrder: 0,
      filters: [
        { fieldName: "RegId", fieldValue: String(this.RegId), opType: OperatorComparer.Contains },
        { fieldName: "OP_IP_ID", fieldValue: String(this.OP_IP_Id), opType: OperatorComparer.Contains },
        { fieldName: "OP_IP_Type", fieldValue: opiptype, opType: OperatorComparer.Contains },
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }
  openPaymentpopup(contact) {
    debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    let PatientHeaderObj = {};
    PatientHeaderObj['Date'] = formattedDate;
    PatientHeaderObj['PatientName'] = contact?.patientName || '';
    PatientHeaderObj['AdvanceAmount'] = Math.round(contact?.balanceAmount);
    PatientHeaderObj['NetPayAmount'] = Math.round(contact?.balanceAmount);
    PatientHeaderObj['BillNo'] = contact?.salesId || 0;
    PatientHeaderObj['OPD_IPD_Id'] = this.OP_IP_Id || 0;
    PatientHeaderObj['RegNo'] = contact?.regNo || 0;
    PatientHeaderObj['DoctorName'] = this.DoctorName || '';
    PatientHeaderObj['DepartmentName'] = contact?.departmentName || '';
    PatientHeaderObj['Age'] = contact?.age || 0; 
    PatientHeaderObj['CompanyName'] = contact?.companyName || '';  
    PatientHeaderObj['CompanyId'] = contact?.companyId || 0;  
    PatientHeaderObj['TransactionLabel'] = 'SALES_SETTLEMENT'; 
    if (this.userFormGroup.get('PatientType').value == '1')
      PatientHeaderObj['IPDNo'] = this.IPDNo;
    else
      PatientHeaderObj['OPDNo'] = this.OPDNo;

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

        let SalesDataArray =[];
        SalesDataArray.push({salesID: contact?.salesId, balanceAmount: result?.BalAmt ?? 0 ,refundAmt: 0 }) 

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
        this._SelseSettelmentservice.InsertSalessettlement(this.PharmaSettlementfrom.value).subscribe(response => { 
            this.MutliSettlemForm.reset();  
            // this.viewgetIPPayemntPdf(response) 
            // this.OnSalessettlemtnprint(this.OP_IP_Id,this._loggedService.currentUserValue.user.storeId) 
            this.grid.bindGridData(); 
        });
      }
    });
  }


   viewgetIPPayemntPdf(paymentId) { 
        this.commonService.Onprint("PaymentId", paymentId, "IpPaymentReceipt");
    } 
  ///Multiple settlement section start --------------------
  onChangePatientTypeMultiple(event) {
    if (event.value == 'OP') {
      this.RegId = '';
      this.MutliSettlemForm.get('MobileNo').clearValidators();
      this.MutliSettlemForm.get('MobileNo').updateValueAndValidity();
      this.MutliSettlemForm.get('RegID').setValue('');
    } else if (event.value == 'IP') {
      this.RegId = '';
      this.MutliSettlemForm.get('MobileNo').clearValidators();
      this.MutliSettlemForm.get('MobileNo').updateValueAndValidity();
      this.MutliSettlemForm.get('RegID').setValue('');
    } else {
      this.MutliSettlemForm.get('MobileNo').reset();
      this.MutliSettlemForm.get('MobileNo').setValidators([Validators.required]);
      this.MutliSettlemForm.get('MobileNo').enable();
      this.MutliSettlemForm.get('RegID').setValue('');
      this.MutliSettlemForm.updateValueAndValidity();
    }
    this.PatientInformRest();
    this.getdataMultiple();
    
  } 
  getSelectedObjIPMultiple(obj) {
    console.log(obj);
    let IsDischarged = 0;
     this.registerObj =obj
    IsDischarged = obj.isDischarged;
    if (IsDischarged == 1) {
      Swal.fire('Selected Patient is already discharged');
      this.mRegId = '';
    } else {
      this.DoctorNamecheck = true;
      this.IPDNocheck = true;
      this.OPDNoCheck = false;
      this.mRegId = obj.regID,
        this.OP_IP_Id = obj.admissionID,
        this.mRegNo = obj.regNo;
      this.mPatientName = obj.firstName + ' ' + obj.lastName;
      this.mIPDNo = obj.ipdNo;
      this.mDoctorName = obj.doctorName;
      this.mTariffName = obj.tariffName;
      this.mWardName = obj.roomName;
      this.mBedName = obj.bedName;
    }
    this.getdataMultiple();
  }
  getSelectedObjOpMultiple(obj) {
    console.log(obj)
     this.registerObj =obj
    this.DoctorNamecheck = true;
    this.IPDNocheck = false;
    this.OPDNoCheck = true;
    this.mRegId = obj.regId,
      this.OP_IP_Id = obj.visitId,
      this.mRegNo = obj.regNo;
    this.mPatientName = obj.firstName + ' ' + obj.lastName;
    this.mOPDNo = obj.opdNo;
    this.mDoctorName = obj.doctorName;
    this.mTariffName = obj.tariffName;
    this.getdataMultiple();
  }
  getdataMultiple() { 
 this.SelectedList = [];
    let opiptype = this.MutliSettlemForm.get('PatientType')?.value || 0 
  var vdata= {
  "first": 0,
  "rows": 25,
  "sortField": "SalesId",
  "sortOrder": 0,
  "filters": [ {"fieldName": "RegId", "fieldValue":  String(this.mRegId), "opType": "Contains" },
    {"fieldName": "OP_IP_ID", "fieldValue":String(this.OP_IP_Id), "opType": "Contains" },
    {"fieldName": "OP_IP_Type", "fieldValue": opiptype, "opType": "Contains" },
  ],
  "exportType": "JSON",
  "columns": [   {  "data": "string",  "name": "string"  }  ]
}
this._SelseSettelmentservice.SalesBillList(vdata).subscribe((response)=>{
  this.dssalesbillListMultiple.data = response.data
  this.chargelist = response.data
  this.dssalesbillListMultiple.sort = this.sort
  this.dssalesbillListMultiple.paginator = this.paginator
}) 

  }
  vNetAmount: any = 0;
  vBalanceAmount: any = 0;
  vPaidAmount: any = 0;
  SelectedList: any = [];
  tableElementChecked(event, element) { 
    debugger
    if (event.checked) { 
      this.SelectedList.push(element)
      this.vNetAmount += Math.round(+element.netAmount)
      this.vPaidAmount += Math.round(+element.paidAmount)
      this.vBalanceAmount += Math.round(+element.balanceAmount)
    }
    else {
      let index = this.SelectedList.indexOf(element);
      if (index >= 0) {
        this.SelectedList.splice(index, 1);
      }
      this.vNetAmount -=  Math.round(+element.netAmount)
      this.vPaidAmount -= Math.round(+element.paidAmount)
      this.vBalanceAmount -= Math.round(+element.balanceAmount)
    }
    console.log(this.SelectedList)
    this.MutliSettlemForm.patchValue({
      FinalNetAmt: this.vNetAmount,
      FinalPaidAmt: this.vPaidAmount,
      FinalBalanceAmt: this.vBalanceAmount,
    })
  }
    BalanceAm1: any = 0;
  UsedAmt1: any = 0; 
    MultiplePaySave() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    if(!this.dssalesbillListMultiple.data.length){
        this.toastr.warning('Please check, Table is empty.', 'Warning')
        return
    }
     if(!this.SelectedList.length){
        this.toastr.warning('Please selecte check box', 'Warning')
        return
    }
    console.log(this.SelectedList) 

     let PatientHeaderObj = {};
    PatientHeaderObj['Date'] = formattedDate;
    PatientHeaderObj['PatientName'] = this.mPatientName;
     PatientHeaderObj['NetPayAmount'] = Math.round(this.MutliSettlemForm.get('FinalBalanceAmt').value); 
    PatientHeaderObj['OPD_IPD_Id'] = this.OP_IP_Id;
    PatientHeaderObj['RegNo'] = this.mRegNo;
    PatientHeaderObj['DoctorName'] = this.mDoctorName;   
    if (this.userFormGroup.get('PatientType').value == '1')
      PatientHeaderObj['OPD_IPD_Id'] = this.mIPDNo;
    else
      PatientHeaderObj['OPD_IPD_Id'] = this.mOPDNo; 
    const dialogRef = this._matDialog.open(OpPaymentComponent,
      {
        maxWidth: "80vw",
            height: '800px',
            width: '75%',
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "IP-Pharma-Multiple-SETTLEMENT",
          ArrayList : this.SelectedList
        }
      });
    dialogRef.afterClosed().subscribe(result => {
         console.log(result)
      debugger
      if (result && result.IsSubmitFlag) { 

        let SalesDataArray =[];  
        this.SelectedList.forEach(item => {
           SalesDataArray.push({salesID: item?.salesId, balanceAmount: result?.BalAmt ?? 0 ,refundAmt: 0 }) 
        });  
         this.salessArray.clear();
          SalesDataArray.forEach(item => {
          this.salessArray.push(this.createsaless(item));
        }); 
       
        console.log(this.PharmaSettlementfrom.value); 
          let PaymentArray: IpPaymentInsert[] = [];
          PaymentArray = result.submitDataPay.ipPaymentInsert;
          this.PaymentArray.clear(); 
          PaymentArray.forEach(element => {
          this.PaymentArray.push(this.createSettlmentPyament(element));  
          });
      
         console.log(this.PharmaSettlementfrom.value);
        this._SelseSettelmentservice.InsertSalessettlement(this.PharmaSettlementfrom.value).subscribe(response => { 
           this.getdataMultiple()
           this.userFormGroup.reset();  
        });
      }
    });
  } 
  OnReset() {
    this.vglobledisc = false;
    this.userFormGroup.reset();
    this.MutliSettlemForm.reset(); 
    this.PatientInformRest();
    this.userFormGroup.get('RegID').setValue('');
    this.MutliSettlemForm.get('RegID').setValue('');
    this.userFormGroup.get('PatientType').setValue('1');
    this.MutliSettlemForm.get('PatientType').setValue('1');
     this.getdataMultiple()
  }
  PatientInformRest() {
    this.PatientName = '';
    this.IPDNo = '';
    this.RegNo = '';
    this.DoctorName = '';
    this.TariffName = '';
    this.OPDNo = '';
    this.OP_IP_Id = '';
    this.RegId = '';
    this.WardName = '';
    this.BedName = '';
    this.mRegNo = '';
    this.mTariffName = '';
    this.mPatientName = '';
    this.mDoctorName = '';
    this.mBedName = '';
    this.mOPDNo = '';
    this.mIPDNo = '';
    this.mWardName = '';
    this.mRegId = '';
  } 
  getDiscFinalBill(contact) {
    const dialogRef = this._matDialog.open(DiscountAfterFinalBillComponent,
      {
        maxWidth: "100%",
        height: '55%',
        width: '45%',
        data: {
          Obj: contact,
          PatientObj: this.registerObj
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.grid.bindGridData();
    });
  } 
  getValidationMessages() {
    return {
      MobileNo: [
        // { name: "required", Message: "MobileNo is required" }
      ],
      FinalPaidAmt: [
        // { name: "required", Message: "FinalPaidAmt is required" }
      ],
      FinalBalanceAmt: [
        // { name: "required", Message: "FinalBalanceAmt is required" }
      ],
      FinalNetAmt: [
        // { name: "required", Message: "FinalNetAmt is required" }
      ],
       globlediscPer: [
        // { name: "required", Message: "globlediscPer is required" }
      ],
       ConcessionId: [
        // { name: "required", Message: "ConcessionId is required" }
      ]
    };
  }
  onChangeglobledisc(event){
    if(event.checked == true){
      this.vglobledisc = true; 
     }else{
      this.vglobledisc = false;
      this.MutliSettlemForm.get('globlediscPer').reset();
      this.MutliSettlemForm.get('ConcessionId').reset();  
     }
      this.vNetAmount = 0;
      this.vPaidAmount = 0;
      this.vBalanceAmount = 0; 
      this.MutliSettlemForm.patchValue({
      FinalNetAmt: this.vNetAmount,
      FinalPaidAmt: this.vPaidAmount,
      FinalBalanceAmt: this.vBalanceAmount,
    })
    this.getdataMultiple();
  }
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
    //print  
    OnSalessettlemtnprint(SalesID, OP_IP_Type) {
      setTimeout(() => {
        let param = {
          "searchFields": [
            { "fieldName": "OP_IP_ID", "fieldValue": String(SalesID), "opType": "13" },
            { "fieldName": "StoreId", "fieldValue": String(OP_IP_Type), "opType": "13" }
          ],
          "mode": "PharmacyPatientStatement"
        }
        this._SelseSettelmentservice.getReportView(param).subscribe(res => {
          const matDialog = this._matDialog.open(PdfviewerComponent,
            {
              maxWidth: "85vw",
              height: '750px',
              width: '100%',
              data: {
                base64: res["base64"] as string,
                title: "Sales Settlement" + " " + "Viewer"
              }
            });
          matDialog.afterClosed().subscribe(result => {
          });
        });
      }, 100);
    }
        vCheckBox:boolean=false;
  getDischargedList(event) {
    if (event.checked == true) {
      this.vCheckBox = true;
      this.OnReset()
    }
    else
    this.vCheckBox = false;
    this.userFormGroup.get('RegID').setValue('');
  } 
  CreateApplyglobeDiscForm(){
    return this._formBuilder.group({ 
        sales: this._formBuilder.array([]) 
    })
  }
  CreateApplydiscDet(item :any){
    return this._formBuilder.group({  
      salesId:[item?.salesId,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
      netAmount:[item?.netAmount,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      discAmount:[item?.discAmount,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      balanceAmount: [item?.balanceAmount,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionReasonId:[item?.concessionReasonId,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
    }) 
  }
    get applydiscgloblearray(): FormArray {
    return this.globleDiscFrom.get('sales') as FormArray;
  } 
  templist:any=[];
  onApplyDiscount() {
    const formvalue = this.MutliSettlemForm.value
    if (!this.dssalesbillListMultiple.data.length) {
      this.toastr.warning('Please check table is blank', 'Warning')
      return
    }
    this.templist = this.dssalesbillListMultiple.data; 
      const globlediscPer = formvalue?.globlediscPer || 0;
    if (globlediscPer > 0 && globlediscPer <= 100) {
      this.templist = this.templist.map(element => {
        let discamt1 = 0;
        let discountAmt = '0';
        let netAmt = '0';

        const globlediscPer = formvalue?.globlediscPer || 0;
        // if ((element?.discAmount || 0) > 0) {
        //   discamt1 = Math.round(((element?.balanceAmount) * globlediscPer) / 100);
        //   discountAmt = Math.round(parseFloat(element?.discAmount) + discamt1).toFixed(2);
        //   netAmt = Math.round(parseFloat(element?.balanceAmount) - discamt1).toFixed(2);
        // } else {
          discountAmt = Math.round(((element?.totalAmount) * globlediscPer) / 100).toFixed(2);
          netAmt = Math.round((element?.totalAmount) - parseFloat(discountAmt)).toFixed(2);
        //}
        // Return updated element to rebuild the list
        return {
          ...element,
          discAmount: discountAmt,
          netAmount: netAmt,
          balanceAmount: netAmt,
          discper:globlediscPer
        };
      });
    } else {
      this.templist = this.chargelist
      this.vNetAmount = 0;
      this.vPaidAmount = 0;
      this.vBalanceAmount = 0; 
      this.MutliSettlemForm.patchValue({
      FinalNetAmt: this.vNetAmount,
      FinalPaidAmt: this.vPaidAmount,
      FinalBalanceAmt: this.vBalanceAmount,
    })
    }
    // Assign updated list back
    this.dssalesbillListMultiple.data = this.templist;  
  } 

  OnSaveGlobelDisc() {
    const formvalue = this.MutliSettlemForm.value
    if (!this.dssalesbillListMultiple.data.length) {
      this.toastr.warning('Please check table is blank', 'Warning')
      return
    }
    if (!(formvalue?.globlediscPer || 0)) {
      this.toastr.warning('Please add discount %', 'Warning')
      return
    }
    if (!(formvalue?.ConcessionId || 0)) {
      this.toastr.warning('Please select concession reason', 'Warning')
      return
    }
    this.dssalesbillListMultiple.data = this.dssalesbillListMultiple.data.map(element => ({
      ...element,
      concessionReasonId: formvalue?.ConcessionId
    }));

    if (this.globleDiscFrom.valid) {
      this.applydiscgloblearray.clear();
      this.dssalesbillListMultiple.data.forEach(element => {
        this.applydiscgloblearray.push(this.CreateApplydiscDet(element))
      });
      console.log(this.globleDiscFrom.value)
      this._SelseSettelmentservice.ApplyglobleDisc(this.globleDiscFrom.value).subscribe(response => {
        this.getdataMultiple();
        this.vglobledisc = false;
        this.MutliSettlemForm.get('globlediscPer').reset();
        this.MutliSettlemForm.get('ConcessionId').reset();
      })
    } else {
      let invalidFields = [];
      if (this.globleDiscFrom.invalid) {
        for (const controlName in this.globleDiscFrom.controls) {
          const control = this.globleDiscFrom.get(controlName);
          if (control instanceof FormGroup || control instanceof FormArray) {
            for (const nestedKey in control.controls) {
              if (control.get(nestedKey)?.invalid) {
                invalidFields.push(`Globle Discount Date: ${controlName}.${nestedKey}`);
              }
            }
          } else if (control?.invalid) {
            invalidFields.push(`Globle Discount From: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
          );
        });
      }
    }
  }
 
      getCellCalculation(item: PaidItemList): void {
          let discPer = +item?.discper;
          let totalMrp = +item?.totalAmount;
  
          if (discPer < 0 || discPer > 100) {
              this.toastr.error('Enter discount between 0 - 100', 'Warning !', {
                  toastClass: 'tostr-tost custom-toast-warning',
              });
              item.discper = 0;
              item.discAmount = 0;
              item.netAmount  = item.totalAmount ;
              item.balanceAmount = item.netAmount ;
              return;
          }
          item.discAmount = ((totalMrp * discPer) / 100).toFixed(2);
          item.netAmount  = (totalMrp - item.discAmount).toFixed(2);
          item.balanceAmount = item.netAmount;
      }


     // it allowed only Digit 
     keyPressDigitsOnly(event) {
         var inp = String.fromCharCode(event.keyCode);
         if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
             return true;
         } else {
             event.preventDefault();
             return false;
         }
     }
         // it allowed only Digit & decimal
     keyPressDigitDecimalOnly(event) {
         var inp = String.fromCharCode(event.keyCode);
         if (/^\d*\.?\d*$/.test(inp)) {
             return true;
         } else {
             event.preventDefault();
             return false;
         }
     } 
}

export class PaidItemList {

  salesId: any;
  regNo: any;
  totalAmount: any;
  discAmount: any;
  netAmount: any;
  paidAmount: any;
  balanceAmount: any;
 opipid:any; 
  salesNo:any;   
  regId:any;     
    patientName:any;
      refundAmt: any; 
  date: any;
  discper:any;

  constructor(PaidItemList) {
    {
      this.date = PaidItemList.date || 0;
      this.patientName = PaidItemList.patientName || '';
      this.salesId = PaidItemList.salesId || 0;
      this.regNo = PaidItemList.regNo || 0;
      this.totalAmount = PaidItemList.totalAmount || 0;
      this.discAmount = PaidItemList.discAmount || 0;
      this.netAmount = PaidItemList.netAmount || 0;
      this.paidAmount = PaidItemList.paidAmount || 0;
      this.balanceAmount = PaidItemList.balanceAmount || 0; 
      this.refundAmt = PaidItemList.refundAmt || 0;
      this.opipid = PaidItemList.opipid || 0;
      this.salesNo = PaidItemList.salesNo || 0;
      this.regId = PaidItemList.regId || 0;
    }
  }
}
export class CreditItemList {

  SalesDate: number;
  PillNo: number;
  RegNo: number;
  BillAmt: any;
  conAmount: any;
  NetPayAmount: any;
  PaidAmount: number;
  BalanceAmt: number;
  RefundAmt: any;
  FinalAmt: any;

  constructor(CreditItemList) {
    {
      this.SalesDate = CreditItemList.SalesDate || 0;
      this.PillNo = CreditItemList.PillNo || 0;
      this.RegNo = CreditItemList.RegNo || 0;
      this.BillAmt = CreditItemList.BillAmt || 0;
      this.conAmount = CreditItemList.conAmount || 0;
      this.NetPayAmount = CreditItemList.NetPayAmount || 0;
      this.PaidAmount = CreditItemList.PaidAmount || 0;
      this.BalanceAmt = CreditItemList.BalanceAmt || 0;
      this.FinalAmt = CreditItemList.FinalAmt || 0;
    }
  }
}

