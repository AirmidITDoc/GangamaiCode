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

@Component({
  selector: 'app-sales-return-bill-settlement',
  templateUrl: './sales-return-bill-settlement.component.html',
  styleUrls: ['./sales-return-bill-settlement.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SalesReturnBillSettlementComponent implements OnInit {
  userFormGroup: FormGroup;
  MutliSettlemForm: FormGroup;
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
  dsPaidItemList1 = new MatTableDataSource<PaidItemList>();

  constructor(
    public _SelseSettelmentservice: SalesReturnBillSettlementService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    public toastr: ToastrService,
    public _formBuilder: FormBuilder,
    public _FormvalidationserviceService: FormvalidationserviceService
  ) { }

  ngOnInit(): void {
    this.userFormGroup = this.CreateUseFrom();
    this.MutliSettlemForm = this.CreateMultipleFrom();
    this.PharmaSettlementfrom = this.createSettlementform();
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
        advanceUsedAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
        balanceAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      })
    });
  } 
    createAdvanceDetails(element: any): FormGroup {
    return this._formBuilder.group({
      advanceDetailID: [element?.AdvanceDetailID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      usedAmount: [element?.UsedAmount ?? 0, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      balanceAmount: [element?.BalanceAmount ?? 0, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  } 
  createsaless(element: any): FormGroup {
    return this._formBuilder.group({
      salesID: [element?.salesID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      balanceAmount: [element?.balanceAmount ?? 0, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      refundAmt: [element?.refundAmt ?? 0]
    });
  }
  createSettlmentPyament(element: any): FormGroup {
    return this._formBuilder.group({
      paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      billNo: [element?.billNo, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      paymentDate: [element?.paymentDate, [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      paymentTime: [element?.paymentTime, [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      cashPayAmount: [element?.cashPayAmount ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chequePayAmount: [element?.chequePayAmount ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chequeNo: [element?.chequeNo, [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      bankName: [element?.bankName, [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      chequeDate: [element?.chequeDate ?? ''],
      cardPayAmount: [element?.cardPayAmount ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      cardNo: [element?.cardNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      cardBankName: [element?.cardBankName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      cardDate: [element?.cardDate ?? ''],
      advanceUsedAmount: [element?.advanceUsedAmount ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      advanceId: [element?.advanceId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      transactionType: [element?.transactionType, [this._FormvalidationserviceService.onlyNumberValidator()]],
      remark: [element?.remark ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      addBy: [this._loggedService.currentUserValue.userId],
      isCancelled: [false],
      isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isCancelledDate: ['1999-01-01'],
      opdipdType: [3, [this._FormvalidationserviceService.onlyNumberValidator()]],
      neftpayAmount: [element?.neftpayAmount ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      neftno: [element?.neftno ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      neftbankMaster: [element?.neftbankMaster ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      neftdate: [element?.neftdate ?? ''],
      payTmamount: [element?.payTmamount ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      payTmtranNo: [element?.payTmtranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      payTmdate: [element?.payTmdate ?? ''],
    });  
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
  onChangePatientType(event) {
    if (event.value == 'OP') {
      this.RegId = '';
      this.userFormGroup.get('MobileNo').clearValidators();
      this.userFormGroup.get('MobileNo').updateValueAndValidity();
      this.userFormGroup.get('RegID').setValue('a');
    } else if (event.value == 'IP') {
      this.RegId = '';
      this.userFormGroup.get('MobileNo').clearValidators();
      this.userFormGroup.get('MobileNo').updateValueAndValidity();
      this.userFormGroup.get('RegID').setValue('a');
    } else {
      this.userFormGroup.get('MobileNo').reset();
      this.userFormGroup.get('MobileNo').setValidators([Validators.required]);
      this.userFormGroup.get('MobileNo').enable();
      this.userFormGroup.get('RegID').setValue('%');
      this.userFormGroup.updateValueAndValidity();
    }
    this.PatientInformRest();
    this.getdata();
    this.MutliSettlemForm.reset();
  }
  getSelectedObjRegIP(obj) {
    console.log(obj);
    let IsDischarged = 0;
    IsDischarged = obj.isDischarged;
    if (IsDischarged == 1) {
      Swal.fire('Selected Patient is already discharged');
      this.RegId = '';
    } else {
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
    }
    this.getdata();
  }
  getSelectedObjOp(obj) {
    console.log(obj)
    this.DoctorNamecheck = true;
    this.IPDNocheck = true;
    this.OPDNoCheck = false;
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
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    let PatientHeaderObj = {};
    PatientHeaderObj['Date'] = formattedDate;
    PatientHeaderObj['PatientName'] = contact?.patientName;
    PatientHeaderObj['AdvanceAmount'] = Math.round(contact?.balanceAmount);
    PatientHeaderObj['NetPayAmount'] = Math.round(contact?.balanceAmount);
    PatientHeaderObj['BillNo'] = contact?.salesId;
    PatientHeaderObj['OPD_IPD_Id'] = this.OP_IP_Id;
    PatientHeaderObj['RegNo'] = contact?.regNo;
    PatientHeaderObj['DoctorName'] = this.DoctorName;
    PatientHeaderObj['DepartmentName'] = contact?.departmentName;
    PatientHeaderObj['Age'] = contact?.age;
    if (this.userFormGroup.get('PatientType').value == '1')
      PatientHeaderObj['IPDNo'] = this.IPDNo;
    else
      PatientHeaderObj['OPDNo'] = this.OPDNo;

    const dialogRef = this._matDialog.open(OpPaymentVimalComponent,
      {
        maxWidth: "85vw",
        height: '700px',
        width: '100%',
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
      
        console.log(this.PharmaSettlementfrom.value);
        this._SelseSettelmentservice.InsertSalessettlement(this.PharmaSettlementfrom.value).subscribe(response => { 
            this.MutliSettlemForm.reset(); 
            this.grid.bindGridData();
        });
      }
    });
  }

  ///Multiple settlement section start --------------------
  onChangePatientTypeMultiple(event) {
    if (event.value == 'OP') {
      this.RegId = '';
      this.MutliSettlemForm.get('MobileNo').clearValidators();
      this.MutliSettlemForm.get('MobileNo').updateValueAndValidity();
      this.MutliSettlemForm.get('RegID').setValue('a');
    } else if (event.value == 'IP') {
      this.RegId = '';
      this.MutliSettlemForm.get('MobileNo').clearValidators();
      this.MutliSettlemForm.get('MobileNo').updateValueAndValidity();
      this.MutliSettlemForm.get('RegID').setValue('a');
    } else {
      this.MutliSettlemForm.get('MobileNo').reset();
      this.MutliSettlemForm.get('MobileNo').setValidators([Validators.required]);
      this.MutliSettlemForm.get('MobileNo').enable();
      this.MutliSettlemForm.get('RegID').setValue('%');
      this.MutliSettlemForm.updateValueAndValidity();
    }
    this.PatientInformRest();
    this.getdataMultiple();
    this.userFormGroup.reset();
  }

  getSelectedObjIPMultiple(obj) {
    console.log(obj);
    let IsDischarged = 0;
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
    this.DoctorNamecheck = true;
    this.IPDNocheck = true;
    this.OPDNoCheck = false;
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
    let opiptype = this.MutliSettlemForm.get('PatientType').value
    this.gridConfig1 = {
      apiUrl: "Sales/PharSalesSettlemet",
      columnsList: this.AllColumnsMultiple,
      sortField: "SalesId",
      sortOrder: 0,
      filters: [
        { fieldName: "RegId", fieldValue: String(this.mRegId), opType: OperatorComparer.Contains },
        { fieldName: "OP_IP_ID", fieldValue: String(this.OP_IP_Id), opType: OperatorComparer.Contains },
        { fieldName: "OP_IP_Type", fieldValue: opiptype, opType: OperatorComparer.Contains },
      ],
          row: 25
    }
    this.grid1.gridConfig = { ...this.gridConfig1 }; // Use a new object reference
    this.grid1.bindGridData(); // Only refresh the OPPayment grid 

  }
  vNetAmount: any = 0;
  vBalanceAmount: any = 0;
  vPaidAmount: any = 0;
  SelectedList: any = [];
  tableElementChecked(event, element) { 
    if (event.checked) {
      console.log(element)
      this.SelectedList.push(element)
      this.vNetAmount += element.netAmount
      this.vPaidAmount += element.paidAmount
      this.vBalanceAmount += Math.round(element.balanceAmount)
    }
    else {
      let index = this.SelectedList.indexOf(element);
      if (index >= 0) {
        this.SelectedList.splice(index, 1);
      }
      this.vNetAmount -= element.netAmount
      this.vPaidAmount -= element.paidAmount
      this.vBalanceAmount -= element.balanceAmount
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
        maxWidth: "95vw",
        height: '650px',
        width: '85%',
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
           this.userFormGroup.reset(); 
           this.grid1.bindGridData(); 
        });
      }
    });
  }
  MultiplePaySave1() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    console.log(this.SelectedList)
    let PatientHeaderObj = {};
    PatientHeaderObj['Date'] = formattedDate;
    PatientHeaderObj['PatientName'] = this.PatientName;
    PatientHeaderObj['AdvanceAmount'] = Math.round(this.MutliSettlemForm.get('FinalBalanceAmt').value);
    PatientHeaderObj['NetPayAmount'] = Math.round(this.MutliSettlemForm.get('FinalBalanceAmt').value);
    PatientHeaderObj['IPDNo'] = this.IPDNo;
    PatientHeaderObj['RegNo'] = this.RegNo;
    // PatientHeaderObj['OP_IP_Type'] = contact.OP_IP_Type;
    const dialogRef = this._matDialog.open(OpPaymentVimalComponent,
      {
        maxWidth: "95vw",
        height: '650px',
        width: '85%',
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "IP-Pharma-SETTLEMENT"
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)

      if (result.IsSubmitFlag == true) {
        let updateBillobj = {};
        updateBillobj['salesID'] = 1// contact.SalesId;
        updateBillobj['salRefundAmt'] = 0;
        updateBillobj['balanceAmount'] = result.BalAmt || 0;// result.submitDataPay.ipPaymentInsert.balanceAmountController //result.BalAmt;


        let UpdateAdvanceDetailarr1 = [];

        UpdateAdvanceDetailarr1 = result.submitDataAdvancePay;

        let UpdateAdvanceDetailarr = [];
        let UsedHeaderAmt = 0;
        if (result.submitDataAdvancePay.length > 0) {
          result.submitDataAdvancePay.forEach((element) => {
            let update_T_PHAdvanceDetailObj = {};
            update_T_PHAdvanceDetailObj['AdvanceDetailID'] = element.AdvanceDetailID;
            update_T_PHAdvanceDetailObj['UsedAmount'] = element.UsedAmount;
            this.UsedAmt1 = (parseInt(this.UsedAmt1) + parseInt(element.UsedAmount));
            update_T_PHAdvanceDetailObj['BalanceAmount'] = element.BalanceAmount;
            this.BalanceAm1 = (parseInt(this.BalanceAm1) + parseInt(element.BalanceAmount));
            UpdateAdvanceDetailarr.push(update_T_PHAdvanceDetailObj);
          });
        }
        else {
          let update_T_PHAdvanceDetailObj = {};
          update_T_PHAdvanceDetailObj['AdvanceDetailID'] = 0,
            update_T_PHAdvanceDetailObj['UsedAmount'] = 0,
            update_T_PHAdvanceDetailObj['BalanceAmount'] = 0,
            UpdateAdvanceDetailarr.push(update_T_PHAdvanceDetailObj);
        }

        let update_T_PHAdvanceHeaderObj = {};
        if (result.submitDataAdvancePay.length > 0) {
          update_T_PHAdvanceHeaderObj['AdvanceId'] = UpdateAdvanceDetailarr1[0]['AdvanceId'],
            update_T_PHAdvanceHeaderObj['AdvanceUsedAmount'] = this.UsedAmt1,
            update_T_PHAdvanceHeaderObj['BalanceAmount'] = this.BalanceAm1
        }
        else {
          update_T_PHAdvanceHeaderObj['AdvanceId'] = 0,
            update_T_PHAdvanceHeaderObj['AdvanceUsedAmount'] = 0,
            update_T_PHAdvanceHeaderObj['BalanceAmount'] = 0
        }

        let Data = {
          "salesPaymentSettlement": result.submitDataPay.ipPaymentInsert,
          "update_Pharmacy_BillBalAmountSettlement": updateBillobj,
          "update_T_PHAdvanceDetailSettlement": UpdateAdvanceDetailarr,
          "update_T_PHAdvanceHeaderSettlement": update_T_PHAdvanceHeaderObj
        };
        console.log(Data);
        this._SelseSettelmentservice.InsertSalessettlement(Data).subscribe(response => {
          if (response) {
            this._matDialog.closeAll();
            this.UsedAmt1 = 0;
            this.BalanceAm1 = 0;
          }
        });
      }
    });
  }
  OnReset() {
    this.userFormGroup.reset();
    this.MutliSettlemForm.reset(); 
    this.PatientInformRest();
    this.userFormGroup.get('RegID').setValue('a');
    this.MutliSettlemForm.get('RegID').setValue('a');
    this.userFormGroup.get('PatientType').setValue('1');
    this.MutliSettlemForm.get('PatientType').setValue('1');
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
    console.log(contact)
    let PatientInfo = this.registerObj
    const dialogRef = this._matDialog.open(DiscountAfterFinalBillComponent,
      {
        maxWidth: "100%",
        height: '72%',
        width: '60%',
        data: {
          Obj: contact, PatientInfo
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
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
      ]
    };
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
}

export class PaidItemList {

  SalesDate: number;
  PillNo: number;
  RegNo: number;
  BillAmt: any;
  conAmount: any;
  NetPayAmount: any;
  PaidAmount: number;
  BalanceAmt: number;
  RefundAmt: any;

  constructor(PaidItemList) {
    {
      this.SalesDate = PaidItemList.SalesDate || 0;
      this.PillNo = PaidItemList.PillNo || 0;
      this.RegNo = PaidItemList.RegNo || 0;
      this.BillAmt = PaidItemList.BillAmt || 0;
      this.conAmount = PaidItemList.conAmount || 0;
      this.NetPayAmount = PaidItemList.NetPayAmount || 0;
      this.PaidAmount = PaidItemList.PaidAmount || 0;
      this.BalanceAmt = PaidItemList.BalanceAmt || 0;
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

