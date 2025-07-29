import { Component, ElementRef, Inject, OnDestroy, OnInit, Optional, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import {  Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { OpPaymentComponent } from '../../op-search-list/op-payment/op-payment.component'; 
import { RegInsert } from '../../registration/registration.component'; 
import { AppointmentBillService } from './appointment-bill.service'; 
import { PacakgeList } from 'app/main/setup/billing/service-master/editpackage/editpackage.component';
import { PackageDetailsComponent } from './package-details/package-details.component';

@Component({
  selector: 'app-appointment-billing',
  templateUrl: './appointment-billing.component.html',
  styleUrls: ['./appointment-billing.component.scss'],
  animations: fuseAnimations
})
export class AppointmentBillingComponent implements OnInit, OnDestroy {
  public displayedChargeColumns: string[] =
    ['Status','ServiceName', 'Price', 'Qty', 'TotalAmount', 'DiscountPer', 'DiscountAmount', 'NetAmount', 'DoctorName', 'ClassName', 'ChargesAddedName', 'Action'];
  public displayedColumnspackage: string[] =
    ['IsCheck', 'ServiceNamePackage', 'ServiceName','Price', 'Qty', 'TotalAmt', 'DoctorName', 'DiscAmt', 'NetAmount'];
  public displayedPrescriptionColumns =
    ['ServiceName', 'Qty', 'Price', 'TotalAmt']; 

  //new
   doctorName: any
  IsPathology: any;
  IsRadiology: any; 
  vIsPackage: any; 
  dateTimeObj: any   
  RegNo: any;
  Doctorname: any;
  CompanyName: any;
  DepartmentName: any;
  vPrice = '0';
  vQty: any;  
    ApiURL: any='';
  SrvcName1: any = "" 
  serviceId: any;    
  patientDetail: any = new RegInsert({});  
  vOPIPId = 0;  
  vTariffId = 0;  
  vhospitalId = 0;  
  vClassId: any = 0; 
  currentDate = new Date();
  PatientName: any;  
  className = "OPD"; 
  screenFromString = 'Common-form';  
  AgeYear: any;   
  ConcessionId = 0;
  ConcessionReason = "";
  Regstatus: boolean = true;
  Consessionres: boolean = false;
 savebtn: boolean = true;
  autocompleteModeCashcounter: string = "CashCounter";
  autocompleteModetariff: string = "Tariff";
  autocompleteModedeptdoc: string = "ConDoctor";
  autocompleteModeService: string = "Service";
  autocompleteModeConcession: string = "Concession";

  public dataSource = new MatTableDataSource<any>(); 
  public subscription: Array<Subscription> = [];
  public searchForm!: FormGroup;
  public chargeForm!: FormGroup;
  public OpBillForm!: FormGroup; 
  public OPFooterForm :FormGroup;
  public isModal = false; 
  public isServiceSelected = false;
  public isDiscountApplied = false;
  public isDoctor = false;
  public isUpdating = false;
  serviceSelct = false

  @ViewChild('serviceTable') serviceTable!: TemplateRef<any>;
  public dsChargeList = new MatTableDataSource<ChargesList>();
  public dsPackageList = new MatTableDataSource<ChargesList>();
  public dsServiceList = new MatTableDataSource<ChargesList>();
  public chargeList: ChargesList[] = [];
  public packageList: ChargesList[] = [];
  public serviceList: ChargesList[] = []; 

  constructor(private _matDialog: MatDialog, 
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    private commonService: PrintserviceService,
    public _AppointmentlistService: AppointmentBillService,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private formBuilder: FormBuilder,
     private toastrService: ToastrService,
    @Optional() public dialogRef: MatDialogRef<AppointmentBillingComponent>
  ) { };

  @ViewChild('regIdfocus') regIdfocus: ElementRef;
  ngOnInit() {
    this.isModal = !!this.dialogRef; 
    this.searchForm = this.createSearchForm();
    this.chargeForm = this.createChargeForm();
    this.OpBillForm = this.createTotalChargeForm();
    this.OPFooterForm = this.CreateOPFooter(); 
    this.OPFooterForm.markAllAsTouched();
    if (this.data) { 
      this.patientDetail = this.advanceDataStored.storage;
    this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + this.patientDetail.tariffId + "&ClassId=" + this.patientDetail.classId + "&ServiceName="
      console.log("Data",this.patientDetail)
      this.patientDetail.formattedText = this.patientDetail.patientName
      this.patientDetail.doctorName = this.patientDetail.doctorname 
      this.PatientName = this.patientDetail.patientName
      this.DepartmentName = this.patientDetail.departmentName
      this.AgeYear = this.patientDetail.ageYear
      this.Doctorname = this.patientDetail.doctorname 
      this.vOPIPId = this.patientDetail.visitId;  
      this.vTariffId = this.patientDetail.tariffId;
      this.vhospitalId = this.patientDetail.hospitalId;
       this.vClassId  = this.patientDetail.classId 
      this.savebtn = false 
      this.searchForm.get('TariffId').setValue(this.patientDetail.tariffId)  
    } 


    this.dsChargeList = new MatTableDataSource(this.chargeList);
    this.dsPackageList = new MatTableDataSource(this.packageList);
    this.dsServiceList = new MatTableDataSource(this.serviceList);

    this.setupFormListener(); 
  } 
  private setupFormListener(): void {
    this.handleChange('price', () => this.calculateTotalCharge());
    this.handleChange('qty', () => this.calculateTotalCharge());
    this.handleChange('discountPer', () => this.updateDiscountAmount());
    this.handleChange('discountAmount', () => this.updateDiscountPercentage());
    this.handleChange('totalDiscountPer', () => this.updateTotalDiscountAmt(), this.OPFooterForm);
    this.handleChange('concessionAmt', () => this.updateTotalDiscountPer(), this.OPFooterForm);
  }
  openServiceTable(): void {
    this._matDialog.open(this.serviceTable, {
      width: '50%',
      height: '60%',
    })
  }
  calculateTotalCharge(row: any = null): void {
    let qty = +this.chargeForm.get("qty").value;
    let price = +this.chargeForm.get("price").value;
    let total = 0
    if (qty > 0 && price > 0) {
      total = qty * price;
    } 
    this.chargeForm.patchValue({
      totalAmount: total,
      netAmount: total  // Set net amount initially
    }, { emitEvent: false }); // Prevent infinite loop

    this.updateDiscountAmount();
    this.updateDiscountPercentage();
  }
  // Trigger when discount percentage change
  updateDiscountAmount(row: any = null): void {
    if (this.isUpdating) return; // Stop recursion
    this.isUpdating = true;

    const perControl = this.chargeForm.get("discountPer");
    if (!perControl.valid) {
      this.chargeForm.get("discountAmount").setValue(0);
      this.chargeForm.get("discountPer").setValue(0);
      this.isUpdating = false;
      this.toastrService.error("Enter discount % between 0-100");
      return;
    }
    let percentage = perControl.value;
    let totalAmount = this.chargeForm.get("totalAmount").value;

    // let discountAmount = this.getFixedDecimal(totalAmount * percentage / 100);
    // let netAmount = this.getFixedDecimal(totalAmount - discountAmount);
    let discountAmount = parseFloat((totalAmount * percentage / 100).toFixed(2));
    let netAmount = parseFloat((totalAmount - discountAmount).toFixed(2));

    this.chargeForm.patchValue({
      discountAmount: discountAmount,
      netAmount: netAmount
    }, { emitEvent: false }); // Prevent infinite loop

    this.isUpdating = false; // Reset flag
  } 
  // Trigger when discount amount change
  updateDiscountPercentage(): void {
    if (this.isUpdating) return;
    this.isUpdating = true;

    let discountAmount = this.chargeForm.get("discountAmount").value;
    let totalAmount = this.chargeForm.get("totalAmount").value;

    if (discountAmount < 0 || discountAmount > totalAmount) {
      this.chargeForm.get("discountAmount").setValue(0);
      this.chargeForm.get("discountPer").setValue(0);
      this.isUpdating = false;
      this.toastrService.error("Discount must be between 0 and the total amount.");
      return;
    } 
    // let percent = this.getFixedDecimal(totalAmount ? (discountAmount / totalAmount) * 100 : 0);
    // let netAmount = this.getFixedDecimal(totalAmount - discountAmount);

    let percent = Number(totalAmount ? ((discountAmount / totalAmount) * 100).toFixed(2) : "0.00");
    let netAmount = Number((totalAmount - discountAmount).toFixed(2));
    this.chargeForm.patchValue({
      discountPer: percent,
      netAmount: netAmount
    }, { emitEvent: false }); // Prevent infinite loop

    this.isUpdating = false; // Reset flag
  }
  handleChange(key: string, callback: () => void, form: FormGroup = this.chargeForm) {
    this.subscription.push(form.get(key).valueChanges.subscribe(value => {
      callback();
    }));
  }
  getFixedDecimal(value: number) {
    return Number(value.toFixed(2));
  } 
  // Form creation Pending section
  createSearchForm() {
    return this.formBuilder.group({
      regId: [''],
      CashCounterID: [1],
      TariffId:[this.patientDetail.tariffId]
    });
  }  
  createChargeForm() {
    return this.formBuilder.group({
      serviceName: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      qty: [1, [Validators.required, Validators.min(1)]],
      totalAmount: [0,],
      discountPer: [0, [Validators.min(0), Validators.max(100)]],
      discountAmount: [0, [Validators.required, Validators.min(0)]],
      netAmount: [0, [Validators.min(0)]],
      DoctorID: [0]
    });
  } 
    //Footer Form
  CreateOPFooter(){
    return this.formBuilder.group({
      totalAmt: [0,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
      totalDiscountPer: [0, [Validators.min(0), Validators.max(100),this._FormvalidationserviceService.onlyNumberValidator()]],
      concessionAmt: [0, [Validators.min(0),this._FormvalidationserviceService.onlyNumberValidator()]],
      concessionReasonId: [0,this._FormvalidationserviceService.onlyNumberValidator()], 
      netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
      paymentType: ['CashPay'], 
    })
  }
  createTotalChargeForm():FormGroup{
    return this.formBuilder.group({ 
      //bill header  
        billNo: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        opdipdid: [this.vOPIPId,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
        totalAmt: [0,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
        concessionAmt: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        netPayableAmt: [0,[this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        paidAmt: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        balanceAmt: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        billDate: ['',[this._FormvalidationserviceService.allowEmptyStringValidator(),this._FormvalidationserviceService.validDateValidator()]],
        opdipdType: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        addedBy: [this.accountService.currentUserValue.userId],
        totalAdvanceAmount: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        billTime: ['',[this._FormvalidationserviceService.allowEmptyStringValidator()]],
        concessionReasonId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        isSettled: true,
        isPrinted: true,
        isFree: true,
        companyId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        tariffId: [this.vTariffId,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
        unitId: [this.vhospitalId,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
        interimOrFinal: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        companyRefNo: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        concessionAuthorizationName: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        speTaxPer: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        speTaxAmt: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        compDiscAmt: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        discComments: [0,[this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],//need to set concession reason
        cashCounterId: [0,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],//need to set cashCounterId
        addCharges: this.formBuilder.array([]), 

      // ✅ Fixed: should be FormArray
      billDetails: this.formBuilder.array([]),

      // ✅ Fixed: should be FormArray
      packcagecharges: this.formBuilder.array([]), 

      //Payment form
      Payments: this.formBuilder.group({
        paymentId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        billNo: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        receiptNo:  ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        paymentDate: ['',[this._FormvalidationserviceService.allowEmptyStringValidator()]],
        paymentTime: ['',[this._FormvalidationserviceService.allowEmptyStringValidator()]],
        cashPayAmount: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        chequePayAmount: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        chequeNo: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        bankName: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        chequeDate: ['1999-01-01'],
        cardPayAmount: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        cardNo: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        cardBankName: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        cardDate: ['1999-01-01'],
        advanceUsedAmount: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        refundId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        transactionType: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        remark: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        addBy: [this.accountService.currentUserValue.userId],
        isCancelled: [false],
        isCancelledBy: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelledDate: ['1999-01-01'],
        neftpayAmount: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        neftno: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        neftbankMaster: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        neftdate: ['1999-01-01'],
        payTmamount: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        payTmtranNo: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        payTmdate: ['1999-01-01'],
        tdsamount: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      })
    });
  }  
  CreateAddchargeform(item: any): FormGroup {
    return this.formBuilder.group({
      chargesId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesDate:this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      opdIpdType: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      opdIpdId: [this.vOPIPId,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceId: [item?.ServiceId,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
      price: [item?.Price,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
      qty: [item?.Qty,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
      totalAmt: [item?.TotalAmt,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
      concessionPercentage: [item?.DiscPer ?? 0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      concessionAmount: [item?.DiscAmt ?? 0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      netAmount: [item?.NetAmount,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorId: [item?.DoctorId ?? 0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      docPercentage: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      docAmt: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      hospitalAmt: [item?.NetAmount,[this._FormvalidationserviceService.onlyNumberValidator()]],
      isGenerated: [false],
      addedBy: [this.accountService.currentUserValue.userId],
      isCancelled: [false],
      isCancelledBy: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      isCancelledDate: ['1999-01-01'],
      isPathology: [ item?.IsPathology ? true : false],
      isRadiology: [ item?.IsRadiology ? true : false],
      isPackage:[Number(item?.IsPackage?? 0) === 1],
      packageMainChargeID: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      isSelfOrCompanyService: [false],
      packageId: [ 0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesTime: this.datePipe.transform(new Date(), 'shortTime'),
      classId: [1,[this._FormvalidationserviceService.onlyNumberValidator()]],
      tariffId: [this.vTariffId ?? 0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      billNo: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }
  createBillDetails(item: any): FormGroup {
    return this.formBuilder.group({
      billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesId: [item?.ServiceId, [, this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  } 
  Createpacakgechargeform(item: any): FormGroup {
    return this.formBuilder.group({
      chargesId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesDate:this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      opdIpdType: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      opdIpdId: [this.vOPIPId,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceId: [item?.serviceId,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
      price: [item?.price,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
      qty: [item?.Qty,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
      totalAmt: [item?.TotalAmt,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
      concessionPercentage: [item?.DiscPer ?? 0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      concessionAmount: [item?.DiscAmt ?? 0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      netAmount: [item?.NetAmount,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorId: [item?.doctorId ?? 0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      docPercentage: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      docAmt: [0,[this._FormvalidationserviceService.onlyNumberValidator()]], 
      hospitalAmt: [item?.NetAmount,[this._FormvalidationserviceService.onlyNumberValidator()]],
      isGenerated: [false],
      addedBy: [this.accountService.currentUserValue.userId],
      isCancelled: [false],
      isCancelledBy: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      isCancelledDate: ['1999-01-01'],
      isPathology: [ item?.IsPathology ? true : false],
      isRadiology: [ item?.IsRadiology ? true : false],
      isPackage: [true],
      packageMainChargeID: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      isSelfOrCompanyService: [false],
      packageId: [item?.PackageServiceId ?? 0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      billNo: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
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
 
  getdocdetail(event) {
    this.doctorName = event.text
  }
  onAddCharges(): void { 
    const serviceNameValue = this.chargeForm.get('serviceName')?.value;
    if (!serviceNameValue || serviceNameValue === '%' || this.serviceSelct == false) {
      this.toastrService.warning('Please select a valid service name.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.chargeForm.valid) { 
      const formValue = this.chargeForm.value;
      if (this.chargeForm.value.discountPer > 0)
        this.Consessionres = true
      // Calculate total amount, discount amount, and net amount
      const totalAmount = formValue.price * formValue.qty;
      const discountAmount = (totalAmount * formValue.discountPer) / 100;
      const netAmount = totalAmount - discountAmount;
      debugger
      if (totalAmount > 0) {
        const newRow = {
          ServiceId: formValue.serviceName.serviceId,
          ServiceName: formValue.serviceName.serviceName,
          Price: formValue.price,
          Qty: formValue.qty,
          TotalAmt: totalAmount,
          DiscPer: formValue.discountPer || 0,
          DiscAmt: discountAmount || 0,
          NetAmount: netAmount,
          DoctorName: this.doctorName || '-',
          ClassName: this.className || '-',
          DoctorId: formValue.DoctorID,
          ChargesAddedName: this.accountService.currentUserValue.userName,
          IsPathology: this.IsPathology,
          IsRadiology: this.IsRadiology,
          IsPackage: this.vIsPackage, 
        }; 
        if (!this.isDiscountApplied && discountAmount > 0) {
          this.isDiscountApplied = true;
          this.Consessionres = true
        }
        const newCharge = new ChargesList(newRow);
        newCharge.DiscAmt = newCharge.DiscAmt || 0;
        newCharge.DiscPer = newCharge.DiscPer || 0;
        this.chargeList.push(newCharge);
        this.dsChargeList.data = this.chargeList;
        this.calculateTotalAmount();
        this.serviceSelct = false
        this.resetForm();
        this.chargeForm.get("qty").setValue(1);
        const serviceNameElement = document.querySelector(`[name='serviceName']`) as HTMLElement;
        if (serviceNameElement) {
          serviceNameElement.focus();
        }
      } else {
        Swal.fire({
          title: 'Message',
          text: "Please Enter Service Detail.. !",
          icon: "warning"
        });
      }
    }
  } 
  resetForm(): void {
    this.chargeForm.reset({
      serviceName: "a",
      price: 0,
      qty: 0,
      totalAmount: 0,
      discountPer: 0,
      discountAmount: 0,
      netAmount: 0,
      DoctorID: 0,
      DoctorName: ''
    }); 
    this.doctorName = '';
  } 
  deleteCharge(index: number,element) {
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
          this.PacakgeList  = this.PacakgeList.filter(item=>item.PackageServiceId != element.ServiceId)  
          this.dsPackageList.data = this.PacakgeList; 
        }  
      }
    });
  } 
  getRtevPackageDetList(obj) {
    var vdata =
    {
      "first": 0,
      "rows": 10,
      "sortField": "ServiceId",
      "sortOrder": 0,
      "filters": [{ "fieldName": "ServiceId", "fieldValue": String(obj.serviceId), "opType": "Equals" }],
      "exportType": "JSON",
      "columns": [{ "data": "string", "name": "string" }]
    }
    console.log(vdata)
    this._AppointmentlistService.getRtevPackageDetList(vdata).subscribe(data => {
      this.dsPackageList.data = data.data as ChargesList[];
      this.dsPackageList.data.forEach(element => {
        this.PacakgeList.push(
          {
            serviceId: element.packageServiceId,
            serviceName: element.serviceName,
            price: element.price || 0,
            Qty: 1,
            TotalAmt: (element.price * 1) || 0,
            ConcessionPercentage: 0,
            DiscAmt: 0,
            NetAmount: (element.price * 1) || 0,
            isPathology: element.isPathology,
            isRadiology: element.isRadiology,
            packageId: element.packageId,
            PackageServiceId: element.serviceId,
            pacakgeServiceName: element.pacakgeServiceName,
            doctorName: element.doctorName,
            doctorId: element.doctorId
          })
      })
      this.dsPackageList.data = this.PacakgeList
    });
  }
  EditedPackageService:any=[];
  OriginalPackageService:any = [];
  TotalPrice:any = 0; 
  PacakgeList:any=[];
  getPacakgeDetail(contact) {  
    const dialogRef = this._matDialog.open(PackageDetailsComponent,
      {
        maxWidth: "100%",
        height: '75%',
        width: '70%',
        data: {
          Obj: contact,
          PatientDet: this.patientDetail
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      debugger
      console.log('The dialog was closed - Insert Action', result);
      if (result) {
        this.dsPackageList.data = result
        console.log(this.dsPackageList.data)
        this.dsPackageList.data.forEach(element => {
          this.PacakgeList = [];
          if (element.BillwiseTotalAmt > 0) {
            this.TotalPrice = element.BillwiseTotalAmt;
            console.log(this.TotalPrice)
          } else {
            this.TotalPrice = parseInt(this.TotalPrice) + parseInt(element.Price);
            console.log(this.TotalPrice)
          }
          this.OriginalPackageService = this.dsChargeList.data.filter(item => item.ServiceId !== element.PackageServiceId)
          this.EditedPackageService = this.dsChargeList.data.filter(item => item.ServiceId === element.PackageServiceId)
          console.log(this.OriginalPackageService)
          console.log(this.EditedPackageService)
        });
        let price = 0;
        let TotalAmt = 0;
        let NetAmount = 0;
        this.dsPackageList.data.forEach(element => {
          if (element.BillwiseTotalAmt > 0){
            price = 0;
            TotalAmt = 0;
            NetAmount = 0;
          } else{
             price = element.Price
            TotalAmt = element.TotalAmt
            NetAmount = element.NetAmount
          } 
          this.PacakgeList.push(
            {
              serviceId: element.ServiceId,
              serviceName: element.ServiceName,
              price: price || 0,
              Qty: element.Qty || 1,
              TotalAmt: TotalAmt || 0,
              ConcessionPercentage: element.ConcessionPercentage || 0,
              DiscAmt: element.DiscAmt || 0,
              NetAmount: NetAmount || 0,
              isPathology: element.IsPathology || 0,
              isRadiology: element.IsRadiology || 0,
              packageId: element.PackageId || 0,
              PackageServiceId: element.PackageServiceId || 0,
              pacakgeServiceName: element.PacakgeServiceName || '',
              doctorName: element.DoctorName || '',
              doctorId: element.DoctorId || 0
            });
          this.dsPackageList.data = this.PacakgeList;
        });
        if (this.EditedPackageService.length) {
          this.EditedPackageService.forEach(element => {
            this.OriginalPackageService.push(
              {
                ChargesId: 0,// this.serviceId,
                ServiceId: element.ServiceId,
                ServiceName: element.ServiceName,
                Price: this.TotalPrice || 0,
                Qty: element.Qty || 0,
                TotalAmt: (parseFloat(element.Qty) * parseFloat(this.TotalPrice)) || 0,
                DiscPer: element.DiscPer || 0,
                DiscAmt: element.DiscAmt || 0,
                NetAmount: (parseFloat(element.Qty) * parseFloat(this.TotalPrice)) || 0,
                ClassId: 1,
                DoctorId: element.DoctornewId,
                DoctorName: element.DoctorName,
                ChargesDate: this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
                IsPathology: element.IsPathology,
                IsRadiology: element.IsRadiology,
                IsPackage: element.IsPackage,
                ClassName: element.ClassName,
                ChargesAddedName: this.accountService.currentUserValue.user.id || 1,
              });
            this.dsChargeList.data = this.OriginalPackageService;
            this.chargeList = this.dsChargeList.data
          });
        }
        this.TotalPrice = 0;
      }
      this.calculateTotalAmount();
    })
  }
  getAmount(key: string): number {
    const control = this.OPFooterForm.get(key);
    return control ? control.value : 0;
  } 
  // Calculation of total amount.
  calculateTotalAmount(): void { 
    let totalSum = this.chargeList.reduce((sum, charge) => sum + (+charge.TotalAmt), 0);
    let totalDiscount = this.chargeList.reduce((sum, charge) => sum + (+charge.DiscAmt), 0);
    let totalNet = totalSum - totalDiscount;

    this.OPFooterForm.patchValue({
      totalAmt: totalSum,
      concessionAmt: Math.round(totalDiscount),
      netPayableAmt: Math.round(totalNet)
    }, { emitEvent: false });
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
    if (this.isUpdating) return; // Stop recursion
    this.isUpdating = true;
    const totalDiscountPer = +this.OPFooterForm.get("totalDiscountPer").value;
    if (totalDiscountPer == 0)
      this.OPFooterForm.get("concessionReasonId").setValue(0)
    if (totalDiscountPer < 0 || totalDiscountPer > 100) {
      this.OPFooterForm.get("totalDiscountPer").setValue(0);
      this.OPFooterForm.get("concessionAmt").setValue(0);

      this.isUpdating = false;
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
    this.isUpdating = false;
  }
  updateTotalDiscountPer(): void {

    debugger
    if (this.isUpdating) return; // Stop recursion
    this.isUpdating = true;

    const totalDiscountAmount = +this.OPFooterForm.get("concessionAmt").value;
    const totalChargeAmount = +(this.OPFooterForm.get("totalAmt").value);

    if (totalDiscountAmount == 0)
      this.OPFooterForm.get("concessionReasonId").setValue(0)

    if (totalDiscountAmount < 0 || totalDiscountAmount > totalChargeAmount) {
      this.OPFooterForm.get("totalDiscountPer").setValue(0);
      this.OPFooterForm.get("concessionAmt").setValue(0);
      this.isUpdating = false;
      this.Consessionres = false;
      this.toastrService.error("Discount must be between 0 and the total amount.");
      return;
    }
    this.Consessionres = totalDiscountAmount !== 0;
    if (!this.isDiscountApplied) {
      // const disountPer = Number(totalChargeAmount ? ((totalDiscountAmount / totalChargeAmount) * 100).toFixed(2) : "0.00");
    
     const disountPer = Math.ceil (Number(totalChargeAmount ? ((totalDiscountAmount / totalChargeAmount) * 100).toFixed(2) : "0.00"));
      const netAmount = totalChargeAmount - totalDiscountAmount;
      this.OPFooterForm.patchValue({
        totalDiscountPer: disountPer,
        netPayableAmt: netAmount.toFixed(2)
      }, { emitEvent: false });
    }
    this.isUpdating = false;
  } 
  getSelectedserviceObj(obj) {
    const isItemAlreadyAdded = this.dsChargeList.data.some((element) => element.ServiceId === obj.serviceId);
    if (isItemAlreadyAdded) {
      Swal.fire({
        title: 'Message',
        text: "Selected Service already available in the list",
        icon: "warning"
      });
      this.resetForm();
      this.chargeForm.get("qty").setValue(1);
      const serviceNameElement = document.querySelector(`[name='serviceName']`) as HTMLElement;
      if (serviceNameElement) {
        serviceNameElement.focus();
      }
      return;  // Exit the function early
    } else {
      console.log(obj)
      this.SrvcName1 = obj.serviceName;
      this.serviceId = obj.serviceId;
      this.vPrice = obj.classRate;
      this.vQty = 1; 
      this.IsPathology = obj.isPathology;
      this.IsRadiology = obj.isRadiology;
      this.vIsPackage = obj.isPackage; 
      if (obj?.creditedtoDoctor == true) {
        this.isDoctor = true;
        this.chargeForm.get('DoctorID').reset();
        this.chargeForm.get('DoctorID').setValidators([Validators.required]);
        this.chargeForm.get('DoctorID').enable(); 
      } else {
        this.isDoctor = false;
        this.chargeForm.get('DoctorID').reset();
        this.chargeForm.get('DoctorID').clearValidators();
        this.chargeForm.get('DoctorID').updateValueAndValidity();
        this.chargeForm.get('DoctorID').disable();
      } 
      this.serviceSelct = true
    }
    this.getRtevPackageDetList(obj) 
  } 
  getSelectedObj(obj) {
    console.log(obj)
    this.patientDetail = obj 
    this.PatientName = this.patientDetail.formattedText
    this.DepartmentName = this.patientDetail.departmentName
    this.AgeYear = this.patientDetail.ageYear
    this.Doctorname = this.patientDetail.doctorName
    this.RegNo = this.patientDetail.regNo 
    this.vOPIPId = this.patientDetail.visitId 
    this.vTariffId = this.patientDetail.tariffId;
    this.vhospitalId = this.patientDetail.hospitalId;  
    this.searchForm.get('TariffId').setValue(this.patientDetail.tariffId) 
    this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + this.patientDetail.tariffId + "&ClassId=" + this.patientDetail.classId + "&ServiceName="

    if (this.vOPIPId > 0)
      this.savebtn = false
    this.Regstatus = false 
  } 
getSelectedTariffObj(event){
    this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + event.value + "&ClassId=" + this.patientDetail.classId + "&ServiceName="
}
  BillSave() {
    if (this.OPFooterForm.get('concessionAmt').value > 0 && this.Consessionres) {
      if (!this.OPFooterForm.get('concessionReasonId').value) {
        this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    } 
    this.OpBillForm.get('opdipdid')?.setValue(this.vOPIPId)
    this.OpBillForm.get('tariffId')?.setValue(this.vTariffId)
    this.OpBillForm.get('unitId')?.setValue(this.vhospitalId)
    this.OpBillForm.get('totalAmt')?.setValue(this.OPFooterForm.get('totalAmt')?.value)
    this.OpBillForm.get('concessionAmt')?.setValue(this.OPFooterForm.get('concessionAmt')?.value)
    this.OpBillForm.get('netPayableAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
    this.OpBillForm.get('billDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
    this.OpBillForm.get('billTime').setValue(this.dateTimeObj.time)
    this.OpBillForm.get('concessionReasonId')?.setValue(this.ConcessionId)
    this.OpBillForm.get('discComments')?.setValue(this.ConcessionReason)
    this.OpBillForm.get('cashCounterId')?.setValue(this.searchForm.get('CashCounterID')?.value)
 
    if (this.OpBillForm.valid) {
 debugger
      this.ChargeddetailsArray.clear();
      this.BillDetailsArray.clear(); 
      this.dsChargeList.data.forEach(item => {
      this.ChargeddetailsArray.push(this.CreateAddchargeform(item as ChargesList));
      this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));


      if(item.IsPackage == 1){
      this.packcagechargesArray.clear(); 
      this.dsPackageList.data.forEach(item => {
      this.packcagechargesArray.push(this.Createpacakgechargeform(item as ChargesList)); 
      //  this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));
      }); 
    }
      }); 
 
      console.log("form values", this.OpBillForm.value)

      if (this.OPFooterForm.get('paymentType').value == 'PayOption') { 
        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
        PatientHeaderObj['PatientName'] = this.patientDetail.patientName;
        PatientHeaderObj['RegNo'] = this.RegNo;
        PatientHeaderObj['DoctorName'] = this.Doctorname;
        PatientHeaderObj['CompanyName'] = this.CompanyName;
        PatientHeaderObj['DepartmentName'] = this.DepartmentName;
        PatientHeaderObj['OPD_IPD_Id'] = this.vOPIPId;
        PatientHeaderObj['Age'] = this.AgeYear;
        PatientHeaderObj['NetPayAmount'] = Math.round(this.OPFooterForm.get('netPayableAmt').value);
        const dialogRef = this._matDialog.open(OpPaymentComponent,
          {
            maxWidth: "90vw",
            height: '650px',
            width: '80%',
            data: {
              vPatientHeaderObj: PatientHeaderObj,
              FromName: "OP-Bill",
              advanceObj: PatientHeaderObj,
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          if (result && result.IsSubmitFlag == true) {
             console.log( this.OpBillForm.value) 
              console.log(result.submitDataPay.ipPaymentInsert) 
            this.OpBillForm.get('Payments').setValue(result.submitDataPay.ipPaymentInsert)
            console.log( this.OpBillForm.value) 
            this._AppointmentlistService.InsertOPBilling(this.OpBillForm.value).subscribe(response => {
              this.viewgetOPBillReportPdf(response)
              this.resetform();
              this._matDialog.closeAll();
              this.savebtn = true
            });
          }
        });
      }
      else if (this.OPFooterForm.get('paymentType').value == 'CashPay') {//Cash pay  
    this.OpBillForm.get('balanceAmt').setValue(0)
    this.OpBillForm.get('paidAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
    this.OpBillForm.get('Payments.cashPayAmount')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
    this.OpBillForm.get('Payments.paymentDate')?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
    this.OpBillForm.get('Payments.paymentTime')?.setValue(this.dateTimeObj.time)
      console.log( this.OpBillForm.value)  
        this._AppointmentlistService.InsertOPBilling(this.OpBillForm.value).subscribe(response => {
          this.viewgetOPBillReportPdf(response)
          this._matDialog.closeAll();
          this.savebtn = true
          this.resetform();
        });
      }
      else if (this.OPFooterForm.get('paymentType').value == 'CreditPay') {//Credit pay 
      this.OpBillForm.get('paidAmt').setValue(0)
      this.OpBillForm.get('balanceAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
       this.OpBillForm.removeControl('Payments')
        console.log( this.OpBillForm.value)   
      this._AppointmentlistService.InsertOPBillingCredit(this.OpBillForm.value).subscribe(response => {
        this.viewgetCreditOPBillReportPdf(response)
        this._matDialog.closeAll();
        this.savebtn = true
        if (response)
          this.resetform();
      });
    }
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
   this.searchForm.get('regId').setValue('')
    this.OPFooterForm.reset({
      totalAmt: 0,
      totalDiscountPer: 0,
      concessionAmt: 0,
      netPayableAmt: 0,
      concessionReasonId: 0, 
    });
    this.OPFooterForm.get('paymentType').setValue('CashPay') 
  } 
  viewgetCreditOPBillReportPdf(element) {
    this.commonService.Onprint("BillNo", element, "OpBillReceipt");
  }
  viewgetOPBillReportPdf(element) {
    this.commonService.Onprint("BillNo", element, "OpBillReceipt");
  } 
  selectChangeConcession(event) {
    this.ConcessionId = event.value
    this.ConcessionReason = event.text
  } 
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
    ngOnDestroy(): void {
    if (this.subscription.length > 0) {
      this.subscription.forEach(s => s.unsubscribe());
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
  ConcessionPercentage: any;
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
    this.ConcessionPercentage = ChargesList.ConcessionPercentage || ''
    this.pacakgeServiceName = ChargesList.pacakgeServiceName || '';
    this.packageServiceId = ChargesList.packageServiceId || 0;
    this.price = ChargesList.price || 0;
    this.packageId = ChargesList.packageId || '';
    this.doctorName = ChargesList.doctorName || 0;
    this.doctorId = ChargesList.doctorId || 0;
    this.isPathology = ChargesList.isPathology || 0;
    this.isRadiology = ChargesList.isRadiology || 0;
  }
}
export class PaymentInsert {
  PaymentId: number;
  BillNo: number;
  ReceiptNo: String;
  PaymentDate: any;
  PaymentTime: any;
  CashPayAmount: number;
  ChequePayAmount: number;
  ChequeNo: String;
  BankName: String;
  ChequeDate: any;
  CardPayAmount: number;
  CardNo: String;
  CardBankName: String;
  CardDate: any;
  AdvanceUsedAmount: number;
  AdvanceId: number;
  RefundId: number;
  TransactionType: number;
  Remark: String;
  AddBy: number;
  IsCancelled: Boolean;
  IsCancelledBy: number;
  IsCancelledDate: any;
  CashCounterId: number;
  IsSelfORCompany: number;
  CompanyId: number;
  NEFTPayAmount: any;
  NEFTNo: String;
  NEFTBankMaster: String;
  NEFTDate: any;
  PayTMAmount: number;
  PayTMTranNo: String;
  PayTMDate: any;

  /**
  * Constructor
  *
  * @param PaymentInsertObj
  */
  constructor(PaymentInsertObj) {
    {
      this.PaymentId = PaymentInsertObj.PaymentId || 0;
      this.BillNo = PaymentInsertObj.BillNo || 0;
      this.ReceiptNo = PaymentInsertObj.ReceiptNo || 0;
      this.PaymentDate = PaymentInsertObj.PaymentDate || '';
      this.PaymentTime = PaymentInsertObj.PaymentTime || '';
      this.CashPayAmount = PaymentInsertObj.CashPayAmount || 0;
      this.ChequePayAmount = PaymentInsertObj.ChequePayAmount || 0;
      this.ChequeNo = PaymentInsertObj.ChequeNo || '';
      this.BankName = PaymentInsertObj.BankName || '';
      this.ChequeDate = PaymentInsertObj.ChequeDate || '';
      this.CardPayAmount = PaymentInsertObj.CardPayAmount || 0;
      this.CardNo = PaymentInsertObj.CardNo || 0;
      this.CardBankName = PaymentInsertObj.CardBankName || '';
      this.CardDate = PaymentInsertObj.CardDate || '';
      this.AdvanceUsedAmount = PaymentInsertObj.AdvanceUsedAmount || 0;
      this.AdvanceId = PaymentInsertObj.AdvanceId || 0;
      this.RefundId = PaymentInsertObj.RefundId || 0;
      this.TransactionType = PaymentInsertObj.TransactionType || 0;
      this.Remark = PaymentInsertObj.Remark || '';
      this.AddBy = PaymentInsertObj.AddBy || 0;
      this.IsCancelled = PaymentInsertObj.IsCancelled || false;
      this.IsCancelledBy = PaymentInsertObj.IsCancelledBy || 0;
      this.IsCancelledDate = PaymentInsertObj.IsCancelledDate || '';
      this.IsCancelledDate = PaymentInsertObj.IsCancelledDate || '';
      this.CashCounterId = PaymentInsertObj.CashCounterId || 0;
      this.IsSelfORCompany = PaymentInsertObj.IsSelfORCompany || 0;
      this.CompanyId = PaymentInsertObj.CompanyId || 0;
      this.NEFTPayAmount = PaymentInsertObj.NEFTPayAmount || 0;
      this.NEFTNo = PaymentInsertObj.NEFTNo || '';
      this.NEFTBankMaster = PaymentInsertObj.NEFTBankMaster || '';
      this.NEFTDate = PaymentInsertObj.NEFTDate || '';
      this.PayTMAmount = PaymentInsertObj.PayTMAmount || 0;
      this.PayTMTranNo = PaymentInsertObj.PayTMTranNo || '';
      this.PayTMDate = PaymentInsertObj.PayTMDate || '';
    }

  }
}
