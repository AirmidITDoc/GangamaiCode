import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTabChangeEvent } from '@angular/material/tabs';
import { fuseAnimations } from '@fuse/animations';
import { Color, gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { RegInsert } from '../../registration/registration.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { OPListService } from '../oplist.service';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { ConfigService } from 'app/core/services/config.service';

@Component({
  selector: 'app-reviewcompany-bill',
  templateUrl: './reviewcompany-bill.component.html',
  styleUrls: ['./reviewcompany-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ReviewcompanyBillComponent {
  public OpBillForm!: FormGroup;
  OPFooterForm: FormGroup;
  patientDetail: any = new RegInsert({});
  public chargeList: ChargesList[] = [];
  public packageList: ChargesList[] = [];
  public dsChargeList = new MatTableDataSource<ChargesList>();
  public dsPackageList = new MatTableDataSource<ChargesList>();
  dateTimeObj: any
  PacakgeList: any = [];
  TotalPrice: any = 0;
  ExclusionAmt: any = 0;
  InclusionAmt: any = 0;
  savebtn: boolean = true;
  ConcessionId = 0;
  ConcessionReason = ""
  vOPIPId = 0;
  vTariffId = 0;
  vhospitalId = 0;
  vClassId: any = 0;
  currentDate = new Date();
  PatientName: any;
  className = "OPD";
  RegNo: any;
  Doctorname: any;
  CompanyName: any;
  DepartmentName: any;
  vPrice = '0';
  vQty: any;


  public isDiscountApplied = false;
  Consessionres: boolean = false;
  // 'Status', 'ServiceCode',
  public displayedChargeColumns: string[] =
    ['ServiceName', 'Price', 'Qty', 'TotalAmount', 'DiscountPer', 'DiscountAmount', 'NetAmount', 'DoctorName', 'ClassName', 'ChargesAddedName', 'Exclucion', 'Action'];
  public displayedColumnspackage: string[] =
    ['IsCheck', 'ServiceNamePackage', 'ServiceName', 'Price', 'Qty', 'TotalAmt', 'DoctorName', 'DiscAmt', 'NetAmount'];

  constructor(private _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public _OPListService: OPListService,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    public _ConfigService: ConfigService,
    public dialogRef: MatDialogRef<ReviewcompanyBillComponent>
  ) { };

  ngOnInit() {
    this.OPFooterForm = this.CreateOPFooter();
    this.OPFooterForm.markAllAsTouched();
    this.OpBillForm = this.createTotalChargeForm();

    if (this.data) {
      console.log(this.data)
      this.patientDetail = this.data;
      this.getPrevCompanyBillList(this.patientDetail)
    }
  }

  CreateOPFooter() {
    return this.formBuilder.group({
      totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      totalDiscountPer: [0, [Validators.min(0), Validators.max(100), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionAmt: [0, [Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionReasonId: [0, this._FormvalidationserviceService.onlyNumberValidator()],
      netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
    })
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  createTotalChargeForm(): FormGroup {
    return this.formBuilder.group({
      //bill header  
      billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdipdid: [this.vOPIPId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      regNo: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      patientName: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      ipdno: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      ageYear: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      ageMonth: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      ageDays: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      wardId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      bedId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      patientType: [false],
      companyName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      companyAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      patientAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      paidAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      balanceAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      billDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
      opdipdType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      addedBy: [this.accountService.currentUserValue.userId],
      totalAdvanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      billTime: [this.datePipe.transform(new Date(), 'shortTime'), [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      concessionReasonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isSettled: true,
      isPrinted: true,
      isFree: true,
      companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      tariffId: [this.vTariffId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      interimOrFinal: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      companyRefNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      concessionAuthorizationName: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      speTaxPer: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      speTaxAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      compDiscAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      discComments: [0, [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],//need to set concession reason
      cashCounterId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],//need to set cashCounterId
      createdBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      addCharges: this.formBuilder.array([]),

      // ✅ Fixed: should be FormArray
      billDetails: this.formBuilder.array([]),

      // ✅ Fixed: should be FormArray
      packcagecharges: this.formBuilder.array([]),

      //Payment form
      payments: this.formBuilder.group({
        paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        receiptNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        paymentDate: [''],
        paymentTime: [''],
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
        neftpayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        neftbankMaster: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        neftdate: ['1999-01-01'],
        payTmamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        payTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        payTmdate: ['1999-01-01'],
        tdsamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        unitId: [this.accountService.currentUserValue.user.unitId],
        wfamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      })
    });
  }
  CreateAddchargeform(item: any): FormGroup {
    return this.formBuilder.group({
      chargesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      opdIpdType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdIpdId: [this.vOPIPId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceId: [item?.ServiceId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      price: [item?.Price, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      qty: [item?.Qty, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      totalAmt: [item?.TotalAmt, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionPercentage: [item?.DiscPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionAmount: [item?.DiscAmt ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      netAmount: [item?.NetAmount, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      doctorId: [item?.DoctorId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorName: [item?.DoctorName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      docPercentage: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      docAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      hospitalAmt: [item?.NetAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
      refundAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      isComServ: [false],
      isPrintCompSer: [false],
      isGenerated: [true],
      addedBy: [this.accountService.currentUserValue.userId],
      isCancelled: [false],
      isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isCancelledDate: ['1999-01-01'],
      isPathology: [item?.IsPathology ? true : false],
      isRadiology: [item?.IsRadiology ? true : false],
      isPackage: [Number(item?.IsPackage ?? 0) === 1],
      wardId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      bedId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceCode: [item?.serviceCode || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      serviceName: [item?.ServiceName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      companyServiceName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      isInclusionExclusion: [item?.isInclusionExclusion || false,],
      isHospMrk: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      packageMainChargeID: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isSelfOrCompanyService: [false],
      packageId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesTime: this.datePipe.transform(new Date(), 'shortTime'),
      classId: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
      tariffId: [this.vTariffId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      createdBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }
  createBillDetails(item: any): FormGroup {
    return this.formBuilder.group({
      billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesId: [item?.ServiceId, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }
  Createpacakgechargeform(item: any): FormGroup {
    return this.formBuilder.group({
      chargesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      opdIpdType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdIpdId: [this.vOPIPId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceId: [item?.serviceId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      price: [item?.price, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      qty: [item?.Qty, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      totalAmt: [item?.TotalAmt, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionPercentage: [item?.DiscPer ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionAmount: [item?.DiscAmt ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      netAmount: [item?.NetAmount, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      doctorId: [item?.doctorId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorName: [item?.doctorName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      docPercentage: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      docAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      hospitalAmt: [item?.NetAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
      refundAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isComServ: [false],
      isPrintCompSer: [false],
      salesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isGenerated: [false],
      addedBy: [this.accountService.currentUserValue.userId],
      isCancelled: [false],
      isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isCancelledDate: ['1999-01-01'],
      isPathology: [item?.IsPathology ? true : false],
      isRadiology: [item?.IsRadiology ? true : false],
      isPackage: [true],
      wardId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      bedId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceCode: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      serviceName: [item?.serviceName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      companyServiceName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      isInclusionExclusion: [false],
      isHospMrk: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      packageMainChargeID: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isSelfOrCompanyService: [false],
      packageId: [item?.PackageServiceId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesTime: this.datePipe.transform(new Date(), 'shortTime'),
      classId: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
      tariffId: [this.vTariffId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      createdBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]]
    });
  }
  // Getters
  get ChargeddetailsArray(): FormArray {
    return this.OpBillForm.get('addCharges') as FormArray;
  }
  get BillDetailsArray(): FormArray {
    return this.OpBillForm.get('billDetails') as FormArray;
  }
  get packcagechargesArray(): FormArray {
    return this.OpBillForm.get('packcagecharges') as FormArray;
  }

  deleteCharge(index: number, element) {
    this.chargeList.splice(index, 1);
    this.dsChargeList.data = this.chargeList;
    this.calculateTotalAmount();
    if (!this.chargeList.length) {
      this.isDiscountApplied = false;
    }
    Swal.fire({
      title: 'ChargeList Row Deleted Successfully',
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Ok!"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (element.IsPackage == '1' && element.ServiceId) {
          this.PacakgeList = this.PacakgeList.filter(item => item.PackageServiceId != element.ServiceId)
          this.dsPackageList.data = this.PacakgeList;
        }
      }
    });
  }

  calculateTotalAmount(): void {
   debugger
    let totalSum = this.chargeList.reduce((sum, charge) => sum + (+charge.TotalAmt), 0);
    let totalDiscount = this.chargeList.reduce((sum, charge) => sum + (+charge.DiscAmt), 0);
    let totalNet = totalSum - totalDiscount;

    this.OPFooterForm.patchValue({
      totalAmt: totalSum,
      concessionAmt: Math.round(totalDiscount),
      netPayableAmt: Math.round(totalNet)
    }, { emitEvent: false });

    const Exclusionlist = this.chargeList.filter(i => i.isInclusionExclusion === true)
    const Inclusionlist = this.chargeList.filter(i => i.isInclusionExclusion !== true)
    this.ExclusionAmt = Exclusionlist.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    this.InclusionAmt = Inclusionlist.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);

  }
  getPrevCompanyBillList(Obj) {
    debugger
    var param = {
      "searchFields": [
        {
          "fieldName": "BillNo",
          "fieldValue": String(Obj.billNo),
          "opType": "Equals"
        }
      ],
      "mode": "GetBillDetails"
    }
    this._OPListService.getCompanyBillList(param).subscribe(data => {
      this.dsChargeList.data = data as ChargesList[]
      if(this.dsChargeList.data.length){
       
         this.chargeList= this.dsChargeList.data
            this.calculateTotalAmount();
      }
    })
  }
  BillSave() {
    Swal.fire({
      title: 'Confirm Save',
      text: 'Are you sure you want to save this Company Bill?',
      icon: 'warning', // or 'question'
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Blue
      cancelButtonColor: '#d33',     // Red
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // this.OnSave(); // Call your save function
      }
    });
  }
  OnSave() {
    if (this.OPFooterForm.get('concessionAmt').value > 0 && this.Consessionres) {
      if (!this.OPFooterForm.get('concessionReasonId').value) {
        this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    const formattedDate = this.datePipe.transform(this.OpBillForm.get('billDate').value, "yyyy-MM-dd");
    const formattedTime = this.datePipe.transform(new Date(), "HH:mm:ss");
    this.OpBillForm.get('billDate').setValue(formattedDate);
    this.OpBillForm.get('billTime').setValue(formattedDate + ' ' + formattedTime);
    this.OpBillForm.get('opdipdid')?.setValue(this.vOPIPId)
    this.OpBillForm.get('tariffId')?.setValue(this.vTariffId)
    this.OpBillForm.get('regNo')?.setValue(this.patientDetail?.regNo)
    this.OpBillForm.get('patientName')?.setValue(this.PatientName)
    this.OpBillForm.get('ipdno')?.setValue(this.patientDetail?.opdNo)
    this.OpBillForm.get('ageYear')?.setValue(Number(this.patientDetail?.ageYear) || 0)
    this.OpBillForm.get('ageMonth')?.setValue(Number(this.patientDetail?.ageMonth) || 0)
    this.OpBillForm.get('ageDays')?.setValue(Number(this.patientDetail?.ageDays) || 0)
    this.OpBillForm.get('doctorId')?.setValue(this.patientDetail?.doctorId || 0)
    this.OpBillForm.get('doctorName')?.setValue(this.patientDetail?.doctorname || '')
    this.OpBillForm.get('patientType')?.setValue(this.patientDetail?.companyId ? true : false)
    this.OpBillForm.get('companyName')?.setValue(this.patientDetail?.companyName || '')
    this.OpBillForm.get('companyAmt')?.setValue(this.ExclusionAmt)
    this.OpBillForm.get('patientAmt')?.setValue(this.InclusionAmt)
    this.OpBillForm.get('totalAmt')?.setValue(this.OPFooterForm.get('totalAmt')?.value)
    this.OpBillForm.get('concessionAmt')?.setValue(this.OPFooterForm.get('concessionAmt')?.value)
    this.OpBillForm.get('netPayableAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
    this.OpBillForm.get('concessionReasonId')?.setValue(this.ConcessionId)
    this.OpBillForm.get('discComments')?.setValue(this.ConcessionReason)
    // this.OpBillForm.get('cashCounterId')?.setValue(this.searchForm.get('CashCounterID')?.value)
    this.OpBillForm.get('cashCounterId')?.setValue(1)
    if (!this.OpBillForm.invalid) {
      this.ChargeddetailsArray.clear();
      this.BillDetailsArray.clear();
      this.dsChargeList.data.forEach(item => {
        this.ChargeddetailsArray.push(this.CreateAddchargeform(item as ChargesList));
        this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));


        if (item.IsPackage == 1) {
          this.packcagechargesArray.clear();
          this.dsPackageList.data.forEach(item => {
            this.packcagechargesArray.push(this.Createpacakgechargeform(item as ChargesList));

          });
        }
      });

      console.log("form values", this.OpBillForm.value)
      const [ThermalPrint, ThermalPrintValue] = this._ConfigService.configParams.ThermalPrint.split(":");


      this.OpBillForm.get('paidAmt').setValue(0)
      this.OpBillForm.get('balanceAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
      this.OpBillForm.removeControl('payments')
      console.log(this.OpBillForm.value)
      this._OPListService.UpdateCompanyBilling(this.OpBillForm.value).subscribe(response => {
        // if (ThermalPrint != 1) {
        //   this.viewgetOPBillReportPdf(response)
        // } else {
        //   this.viewgetOPBillThermalReportPdf(response)
        // }
        this._matDialog.closeAll();
        this.savebtn = true
        if (response)
          this.resetform();
      });
    }


    else {
      let invalidFields = [];
      if (this.OpBillForm.invalid) {
        for (const controlName in this.OpBillForm.controls) {
          const control = this.OpBillForm.get(controlName);

          if (control instanceof FormGroup || control instanceof FormArray) {
            for (const nestedKey in control.controls) {
              if (control.get(nestedKey)?.invalid) {
                invalidFields.push(`OP Bill Data : ${controlName}.${nestedKey}`);
              }
            }
          } else if (control?.invalid) {
            invalidFields.push(`OpBill From: ${controlName}`);
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
  resetform() {
    this.chargeList = [];
    this.dsChargeList.data = []
    this.patientDetail = [];
    this.patientDetail.tariffId = 1;
    this.patientDetail.ClassId = 1;
    // this.searchForm.get('regId').setValue('')
    this.OPFooterForm.reset({
      totalAmt: 0,
      totalDiscountPer: 0,
      concessionAmt: 0,
      netPayableAmt: 0,
      concessionReasonId: 0,
    });
    this.OPFooterForm.get('paymentType').setValue('CashPay')
  }


  onPriceOrQtyChange(row: ChargesList = null): void {
    if (!row) return;

    row.Price = Math.abs(row.Price);
    row.Qty = Math.abs(row.Qty);

    const totalAmount = row.Price * row.Qty;

    // If discount percentage exists, recalculate discount amount
    if (row.DiscPer) {
      row.DiscAmt = parseFloat(((totalAmount * row.DiscPer) / 100).toFixed(2));
    }
    row.TotalAmt = totalAmount;
    row.NetAmount = totalAmount - row.DiscAmt;

    this.calculateTotalAmount();
  }
  onDiscountPerChange(row: ChargesList): void {
    if (!row) return;
    let discountPer = +row.DiscPer || 0;
    const totalAmount = (+row.Price || 0) * (+row.Qty || 0);

    if (discountPer < 0 || discountPer > 100) {
      discountPer = 0; // Reset if out of range
      row.DiscPer = 0;
      this.toastrService.error("Enter discount % between 0-100");
    }

    this.Consessionres = true
    if (discountPer == 0) {
      this.Consessionres = false
      this.OPFooterForm.get("concessionReasonId").setValue(0)
    }

    row.DiscAmt = parseFloat(((totalAmount * discountPer) / 100).toFixed(2));
    row.TotalAmt = totalAmount;
    row.NetAmount = totalAmount - row.DiscAmt;

    this.calculateTotalAmount();
  }
  onDiscountAmtChange(row: ChargesList): void {
    if (!row) return;
    let discountAmt = +row.DiscAmt || 0;
    const totalAmount = (+row.Price || 0) * (+row.Qty || 0);

    if (discountAmt < 0 || discountAmt > totalAmount) {
      row.DiscAmt = 0;
      discountAmt = 0;
      this.toastrService.error("Discount must be between 0 and the total amount.");
    }

    this.Consessionres = true
    if (discountAmt == 0) {
      this.Consessionres = false
      this.OPFooterForm.get("concessionReasonId").setValue(0)
    }
    row.DiscPer = totalAmount ? parseFloat(((discountAmt / totalAmount) * 100).toFixed(2)) : 0;
    row.TotalAmt = totalAmount;
    row.NetAmount = totalAmount - discountAmt;

    this.calculateTotalAmount();
  }
  updateTotalDiscountAmt(): void {

    const totalDiscountPer = +this.OPFooterForm.get("totalDiscountPer").value;
    if (totalDiscountPer == 0)
      this.OPFooterForm.get("concessionReasonId").setValue(0)
    if (totalDiscountPer < 0 || totalDiscountPer > 100) {
      this.OPFooterForm.get("totalDiscountPer").setValue(0);
      this.OPFooterForm.get("concessionAmt").setValue(0);
      this.Consessionres = false;

      this.toastrService.error("Discount must be between 0 to 100.");
      return;
    }
    this.Consessionres = totalDiscountPer !== 0;
    if (!this.isDiscountApplied) {
      const totalAmount = +this.OPFooterForm.get("totalAmt").value;
      const discountAmount = (totalAmount * totalDiscountPer) / 100;
      const netAmount = totalAmount - discountAmount;
      this.OPFooterForm.patchValue({
        concessionAmt: Math.round(discountAmount),
        netPayableAmt: Math.round(netAmount)
      }, { emitEvent: false });
    }

  }
  updateTotalDiscountPer(): void {


    const totalDiscountAmount = +this.OPFooterForm.get("concessionAmt").value;
    const totalChargeAmount = +(this.OPFooterForm.get("totalAmt").value);

    if (totalDiscountAmount == 0)
      this.OPFooterForm.get("concessionReasonId").setValue(0)

    if (totalDiscountAmount < 0 || totalDiscountAmount > totalChargeAmount) {
      this.OPFooterForm.get("totalDiscountPer").setValue(0);
      this.OPFooterForm.get("concessionAmt").setValue(0);
      this.Consessionres = false;
      this.toastrService.error("Discount must be between 0 and the total amount.");
      return;
    }
    this.Consessionres = totalDiscountAmount !== 0;
    if (!this.isDiscountApplied) {
      // const disountPer = Number(totalChargeAmount ? ((totalDiscountAmount / totalChargeAmount) * 100).toFixed(2) : "0.00");

      const disountPer = Math.ceil(Number(totalChargeAmount ? ((totalDiscountAmount / totalChargeAmount) * 100).toFixed(2) : "0.00"));
      const netAmount = totalChargeAmount - totalDiscountAmount;
      this.OPFooterForm.patchValue({
        totalDiscountPer: disountPer,
        netPayableAmt: netAmount.toFixed(2)
      }, { emitEvent: false });
    }

  }


  getValidationMessages() {
    return {
      CashCounterID: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      price: [
        { name: "pattern", Message: "only Number allowed." },
        { name: "min", Message: "Enter valid price." }
      ],
      qty: [
        { name: "required", Message: "Qty required!", },
        { name: "pattern", Message: "only Number allowed.", },
        { name: "min", Message: "Enter valid qty.", }
      ],
      totalAmount: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      totalNetAmount: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      DoctorID: [
        { name: "pattern", Message: "only Char allowed." }
      ],
      discountPer: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      discountAmount: [{ name: "pattern", Message: "only Number allowed." }],
      netAmount: [{ name: "pattern", Message: "only Number allowed." }],
      tariffId: [
        { name: "pattern", Message: "only Char allowed." }
      ],
    }
  }
}

export class ChargesList {
  ChargesId: number;
  ServiceId: number;
  serviceId: number;
  ServiceName: String;
  Price: any;
  Qty: any;
  isInclusionExclusion: any;
  serviceCode: any;
  TotalAmt: number;
  DiscPer: number;
  DiscAmt: number;
  NetAmount: number;
  DoctorId: number;
  ChargeDoctorName: String;
  ChargesDate: Date;
  IsPathology: any;
  IsRadiology: any;
  ClassId: number;
  ClassName: string;
  ChargesAddedName: string;
  PackageId: any;
  PackageServiceId: any;
  IsPackage: any;
  PacakgeServiceName: any;
  BillwiseTotalAmt: any;
  DoctorName: any;
  OpdIpdId: any;
  serviceName: any;

  doctorName: any;
  doctorId: any;
  isPathology: any;
  isRadiology: any;
  pacakgeServiceName: any;
  packageServiceId: any;
  price: any;
  packageId: any;
  ConcessionPercentage: any = 0;
  userName: any;
  constructor(ChargesList) {
    this.ChargesId = ChargesList.ChargesId || '';
    this.ServiceId = ChargesList.ServiceId || '';
    this.serviceId = ChargesList.serviceId || '';
    this.ServiceName = ChargesList.ServiceName || '';
    this.Price = ChargesList.Price || '';
    this.Qty = ChargesList.Qty || '';
    this.TotalAmt = ChargesList.TotalAmt || '';
    this.DiscPer = ChargesList.DiscPer || '';
    this.DiscAmt = ChargesList.DiscAmt || '';
    this.NetAmount = ChargesList.NetAmount || '';
    this.DoctorId = ChargesList.DoctorId || 0;
    this.DoctorName = ChargesList.DoctorName || '';
    this.ChargeDoctorName = ChargesList.ChargeDoctorName || '';
    this.ChargesDate = ChargesList.ChargesDate || '';
    this.IsPathology = ChargesList.IsPathology || '';
    this.IsRadiology = ChargesList.IsRadiology || '';
    this.ClassId = ChargesList.ClassId || 0;
    this.ClassName = ChargesList.ClassName || '';
    this.ChargesAddedName = ChargesList.ChargesAddedName || '';
    this.PackageId = ChargesList.PackageId || 0;
    this.PackageServiceId = ChargesList.PackageServiceId || 0;
    this.IsPackage = ChargesList.IsPackage || 0;
    this.PacakgeServiceName = ChargesList.PacakgeServiceName || '';
    this.OpdIpdId = ChargesList.OpdIpdId || '';
    this.serviceName = ChargesList.serviceName || ''
    this.ConcessionPercentage = ChargesList.ConcessionPercentage || 0;
    this.pacakgeServiceName = ChargesList.pacakgeServiceName || '';
    this.packageServiceId = ChargesList.packageServiceId || 0;
    this.price = ChargesList.price || 0;
    this.packageId = ChargesList.packageId || '';
    this.doctorName = ChargesList.doctorName || 0;
    this.doctorId = ChargesList.doctorId || 0;
    this.serviceCode = ChargesList.serviceCode || 0;
    this.isInclusionExclusion = ChargesList.isInclusionExclusion || '';
    this.isPathology = ChargesList.isPathology || 0;
    this.isRadiology = ChargesList.isRadiology || 0;
    this.userName = ChargesList.userName || '';
  }
}