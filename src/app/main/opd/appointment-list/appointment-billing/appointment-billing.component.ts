import { Component, ElementRef, Inject, OnDestroy, OnInit, Optional, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { OpPaymentComponent } from '../../op-search-list/op-payment/op-payment.component';
import { SearchInforObj } from '../../op-search-list/opd-search-list/opd-search-list.component';
import { RegInsert } from '../../registration/registration.component';
import { VisitMaster1 } from '../appointment-list.component';
import { AppointmentBillService } from './appointment-bill.service';
import { element } from 'protractor';

@Component({
  selector: 'app-appointment-billing',
  templateUrl: './appointment-billing.component.html',
  styleUrls: ['./appointment-billing.component.scss'],
  animations: fuseAnimations
})
export class AppointmentBillingComponent implements OnInit, OnDestroy {
  public displayedChargeColumns: string[] =
    ['ServiceName', 'Price', 'Qty', 'TotalAmount', 'DiscountPer', 'DiscountAmount', 'NetAmount', 'DoctorName', 'ClassName', 'ChargesAddedName', 'Action'];
  public displayedPackageColumns: string[] =
    ['PackageName', 'ServiceName', 'Price', 'Qty', 'TotalAmount', 'DiscountPer', 'DiscountAmount', 'NetAmount', 'DoctorName', 'ClassName', 'ChargesAddedName', 'Action'];
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
    ApiURL: any;
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
  savebtn: boolean = true;
  screenFromString = 'Common-form';  
  AgeYear: any;   
  ConcessionId = 0;
  ConcessionReason = "";
  Regstatus: boolean = true;
  Consessionres: boolean = false;

  autocompleteModeCashcounter: string = "CashCounter";
  autocompleteModedeptdoc: string = "ConDoctor";
  autocompleteModeService: string = "Service";
  autocompleteModeConcession: string = "Concession";

  public dataSource = new MatTableDataSource<any>(); 
  public subscription: Array<Subscription> = [];
  public searchForm!: FormGroup;
  public chargeForm!: FormGroup;
  public OpBillForm!: FormGroup; 
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
    console.log("DATA Billing Page : ", this.advanceDataStored.storage); 
    this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + this.patientDetail.tariffId + "&ClassId=" + this.patientDetail.classId + "&ServiceName="
    if (this.data) { 
      this.patientDetail = this.advanceDataStored.storage;
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
      this.savebtn = false 
    } 
    this.searchForm = this.createSearchForm();
    this.chargeForm = this.createChargeForm();
    this.OpBillForm = this.createTotalChargeForm();

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
    this.handleChange('totalDiscountPer', () => this.updateTotalDiscountAmt(), this.OpBillForm);
    this.handleChange('concessionAmt', () => this.updateTotalDiscountPer(), this.OpBillForm);
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
      CashCounterID: [1]
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
  createTotalChargeForm():FormGroup{
    return this.formBuilder.group({
      totalAmt: [0],
      totalDiscountPer: [0, [Validators.min(0), Validators.max(100)]],
      concessionAmt: [0, [Validators.min(0)]],
      concessionReasonId: [0], 
      netPayableAmt: [0, [Validators.min(0)]],
      paymentType: ['CashPay'], 

      //bill header 
      BillHeader: this.formBuilder.group({
        billNo: [0],
        opdipdid: [this.vOPIPId],
        totalAmt: [0],
        concessionAmt: [0],
        netPayableAmt: [0],
        paidAmt: [0],
        balanceAmt: [0],
        billDate: [''],
        opdipdType: [0],
        addedBy: [this.accountService.currentUserValue.userId],
        totalAdvanceAmount: [0],
        billTime: [''],
        concessionReasonId: [0],
        isSettled: true,
        isPrinted: true,
        isFree: true,
        companyId: [0],
        tariffId: [this.vTariffId],
        unitId: [this.vhospitalId],
        interimOrFinal: [0],
        companyRefNo: [0],
        concessionAuthorizationName: [0],
        speTaxPer: [0],
        speTaxAmt: [0],
        compDiscAmt: [0],
        discComments: [0],//need to set concession reason
        cashCounterId: [0],//need to set cashCounterId
        addCharges: this.formBuilder.array([]),
      }), 
      // ✅ Fixed: should be FormArray
     // addChargesDetails: this.formBuilder.array([]),
      // ✅ Fixed: should be FormArray
      billDetails: this.formBuilder.array([]),
      //Payment form
      payments: this.formBuilder.group({
        paymentId: [0],
        billNo: [0],
        receiptNo:  [''],
        paymentDate: [''],
        paymentTime: [''],
        cashPayAmount: [0],
        chequePayAmount: [0],
        chequeNo: [''],
        bankName: [''],
        chequeDate: ['1999-01-01'],
        cardPayAmount: [0],
        cardNo: [''],
        cardBankName: [''],
        cardDate: ['1999-01-01'],
        advanceUsedAmount: [0],
        advanceId: [0],
        refundId: [0],
        transactionType: 0,
        remark: [''],
        addBy: [this.accountService.currentUserValue.userId],
        isCancelled: [false],
        isCancelledBy: [0],
        isCancelledDate: ['1999-01-01'],
        neftpayAmount: [0],
        neftno: [''],
        neftbankMaster: [''],
        neftdate: ['1999-01-01'],
        payTmamount: [0],
        payTmtranNo: [''],
        payTmdate: ['1999-01-01'],
        tdsamount: [0],
      })
    });
  }  
  CreateAddchargeform(item: any): FormGroup {
    return this.formBuilder.group({
      chargesId: [0],
      chargesDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      opdIpdType: [0],
      opdIpdId: [this.vOPIPId],
      serviceId: [item?.ServiceId],
      price: [item?.Price],
      qty: [item?.Qty],
      totalAmt: [item?.TotalAmt],
      concessionPercentage: [item?.DiscPer ?? 0],
      concessionAmount: [item?.DiscAmt ?? 0],
      netAmount: [item?.NetAmount],
      doctorId: [item?.DoctorId ?? 0],
      docPercentage: [0],
      docAmt: [0],
      hospitalAmt: [item?.NetAmount],
      isGenerated: [false],
      addedBy: [this.accountService.currentUserValue.userId],
      isCancelled: [false],
      isCancelledBy: [0],
      isCancelledDate: ['1999-01-01'],
      isPathology: [ item?.IsPathology ? true : false],
      isRadiology: [ item?.IsRadiology ? true : false],
      isPackage: [false],
      packageMainChargeID: [0],
      isSelfOrCompanyService: [false],
      packageId: [0],
      chargesTime: this.datePipe.transform(new Date(), 'shortTime'),
      classId: [1],
      billNo: [0],
    });
  }
  createBillDetails(item: any): FormGroup {
    return this.formBuilder.group({
      billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesId: [item?.ServiceId, [, this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }
  // Getters
  get ChargeddetailsArray(): FormArray { 
    return this.OpBillForm.get('BillHeader.addCharges') as FormArray;
  }
  get BillDetailsArray(): FormArray { 
    return this.OpBillForm.get('billDetails') as FormArray;
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
  deleteCharge(index: number) {
    this.chargeList.splice(index, 1);
    this.dsChargeList.data = this.chargeList;
    this.calculateTotalAmount();
    if (!this.chargeList.length) {
      this.isDiscountApplied = false;
    }
  } 
  getAmount(key: string): number {
    const control = this.OpBillForm.get(key);
    return control ? control.value : 0;
  } 
  // Calculation of total amount.
  calculateTotalAmount(): void { 
    let totalSum = this.chargeList.reduce((sum, charge) => sum + (+charge.TotalAmt), 0);
    let totalDiscount = this.chargeList.reduce((sum, charge) => sum + (+charge.DiscAmt), 0);
    let totalNet = totalSum - totalDiscount;

    this.OpBillForm.patchValue({
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
      this.OpBillForm.get("concessionReasonId").setValue(0)
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
      this.OpBillForm.get("concessionReasonId").setValue(0)
    }
    row.DiscPer = totalAmount ? parseFloat(((discountAmt / totalAmount) * 100).toFixed(2)) : 0;
    row.TotalAmt = totalAmount;
    row.NetAmount = totalAmount - discountAmt;

    this.calculateTotalAmount();
  }
  updateTotalDiscountAmt(): void {
    if (this.isUpdating) return; // Stop recursion
    this.isUpdating = true;
    const totalDiscountPer = +this.OpBillForm.get("totalDiscountPer").value;
    if (totalDiscountPer == 0)
      this.OpBillForm.get("concessionReasonId").setValue(0)
    if (totalDiscountPer < 0 || totalDiscountPer > 100) {
      this.OpBillForm.get("totalDiscountPer").setValue(0);
      this.OpBillForm.get("concessionAmt").setValue(0);

      this.isUpdating = false;
      this.Consessionres = false;

      this.toastrService.error("Discount must be between 0 to 100.");
      return;
    }
    this.Consessionres = totalDiscountPer !== 0;
    if (!this.isDiscountApplied) {
      const totalAmount = +this.OpBillForm.get("totalAmt").value;
      const discountAmount = (totalAmount * totalDiscountPer) / 100;
      const netAmount = totalAmount - discountAmount;
      this.OpBillForm.patchValue({
        concessionAmt: Math.round(discountAmount),
        netPayableAmt: Math.round(netAmount)
      }, { emitEvent: false });
    }
    this.isUpdating = false;
  }
  updateTotalDiscountPer(): void {
    if (this.isUpdating) return; // Stop recursion
    this.isUpdating = true;

    const totalDiscountAmount = +this.OpBillForm.get("concessionAmt").value;
    const totalChargeAmount = +this.OpBillForm.get("totalAmt").value;

    if (totalDiscountAmount == 0)
      this.OpBillForm.get("concessionReasonId").setValue(0)

    if (totalDiscountAmount < 0 || totalDiscountAmount > totalChargeAmount) {
      this.OpBillForm.get("totalDiscountPer").setValue(0);
      this.OpBillForm.get("concessionAmt").setValue(0);
      this.isUpdating = false;
      this.Consessionres = false;
      this.toastrService.error("Discount must be between 0 and the total amount.");
      return;
    }
    this.Consessionres = totalDiscountAmount !== 0;
    if (!this.isDiscountApplied) {
      const disountPer = Number(totalChargeAmount ? ((totalDiscountAmount / totalChargeAmount) * 100).toFixed(2) : "0.00");
      const netAmount = totalChargeAmount - totalDiscountAmount;
      this.OpBillForm.patchValue({
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

    // Initialize form controls to set the value
   // this.OpBillForm = this.createTotalChargeForm(); 

    if (this.vOPIPId > 0)
      this.savebtn = false
    this.Regstatus = false
  } 
  onsave() { 
    if (!this.OpBillForm.invalid) {
      if (this.OpBillForm.get('concessionReasonId').value == 0 && this.Consessionres) {
        if (!this.OpBillForm.get('concessionReasonId').value) {
          this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      }
      Swal.fire({
        title: 'Do you want to Generate the Bill',
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Generate!"

      }).then((result) => {
        if (result.isConfirmed) {  
            this.BillSave();
        }
      })
      this.searchForm.get("regId").setValue("")
      this.patientDetail = []
    } 
  }
  BillSave() {
    this.OpBillForm.get('BillHeader.opdipdid')?.setValue(this.vOPIPId)
    this.OpBillForm.get('BillHeader.tariffId')?.setValue(this.vTariffId)
    this.OpBillForm.get('BillHeader.unitId')?.setValue(this.vhospitalId)
    this.OpBillForm.get('BillHeader.totalAmt')?.setValue(this.OpBillForm.get('totalAmt')?.value)
    this.OpBillForm.get('BillHeader.concessionAmt')?.setValue(this.OpBillForm.get('concessionAmt')?.value)
    this.OpBillForm.get('BillHeader.netPayableAmt')?.setValue(this.OpBillForm.get('netPayableAmt')?.value)
    this.OpBillForm.get('BillHeader.paidAmt')?.setValue(this.OpBillForm.get('netPayableAmt')?.value)
    this.OpBillForm.get('BillHeader.billDate')?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
    this.OpBillForm.get('BillHeader.billTime')?.setValue(this.dateTimeObj.time)
    this.OpBillForm.get('BillHeader.concessionReasonId')?.setValue(this.ConcessionId)
    this.OpBillForm.get('BillHeader.discComments')?.setValue(this.ConcessionReason)
    this.OpBillForm.get('BillHeader.cashCounterId')?.setValue(this.searchForm.get('CashCounterID')?.value)
 
    if (this.OpBillForm.valid) {
      this.ChargeddetailsArray.clear();
      this.BillDetailsArray.clear(); 
      this.dsChargeList.data.forEach(item => {
      this.ChargeddetailsArray.push(this.CreateAddchargeform(item as ChargesList));
      this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));
      });
      // this.OpBillForm.get('BillHeader.addCharges')?.setValue(this.ChargeddetailsArray?.value)
      console.log("form values", this.OpBillForm.value)

      if (this.OpBillForm.get('paymentType').value == 'PayOption') { 
        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
        PatientHeaderObj['PatientName'] = this.patientDetail.patientName;
        PatientHeaderObj['RegNo'] = this.RegNo;
        PatientHeaderObj['DoctorName'] = this.Doctorname;
        PatientHeaderObj['CompanyName'] = this.CompanyName;
        PatientHeaderObj['DepartmentName'] = this.DepartmentName;
        PatientHeaderObj['OPD_IPD_Id'] = this.vOPIPId;
        PatientHeaderObj['Age'] = this.AgeYear;
        PatientHeaderObj['NetPayAmount'] = Math.round(this.OpBillForm.get('netPayableAmt').value);
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
            let submitData = {
              "addCharges": this.OpBillForm.value.BillHeader,
              "billDetails": this.OpBillForm.value.billDetails,
              "Payments": result.submitDataPay.ipPaymentInsert
            }
            console.log(submitData);
            this._AppointmentlistService.InsertOPBilling(submitData).subscribe(response => {
              this.viewgetOPBillReportPdf(response)
              this.resetform();
              this._matDialog.closeAll();
              this.savebtn = true
            });
          }
        });
      }
      else if (this.OpBillForm.get('paymentType').value == 'CashPay') {//Cash pay 
    this.OpBillForm.get('payments.cashPayAmount')?.setValue(this.OpBillForm.get('netPayableAmt')?.value)
    this.OpBillForm.get('payments.paymentDate')?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
    this.OpBillForm.get('payments.paymentTime')?.setValue(this.dateTimeObj.time)
        let submitData = {
          "addCharges": this.OpBillForm.value.BillHeader,
          "billDetails": this.OpBillForm.value.billDetails,
          "Payments": this.OpBillForm.value.payments,
        };
        console.log(submitData);
        this._AppointmentlistService.InsertOPBilling(submitData).subscribe(response => {
          this.viewgetOPBillReportPdf(response)
          this._matDialog.closeAll();
          this.savebtn = true
          this.resetform();
        });
      }
    } else if (this.OpBillForm.get('paymentType').value == 'CreditPay') {//Credit pay 
      let submitData = {
        "addCharges": this.OpBillForm.value.BillHeader,
        "billDetails": this.OpBillForm.value.billDetails,
      };
      console.log(submitData);
      this._AppointmentlistService.InsertOPBillingCredit(submitData).subscribe(response => {
        this.viewgetCreditOPBillReportPdf(response)
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
                invalidFields.push(`Refund of Advance Date : ${controlName}.${nestedKey}`);
              }
            }
          } else if (control?.invalid) {
            invalidFields.push(`RefundOfAdvance From: ${controlName}`);
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

    this.OpBillForm.reset({
      totalAmt: 0,
      totalDiscountPer: 0,
      concessionAmt: 0,
      netPayableAmt: 0,
      concessionReasonId: 0,

    });
    this.OpBillForm.get('paymentType').setValue('CashPay')
  }
  // BillSaveold() {
  //   let InsertAdddetArr = [];
  //   this.dsChargeList.data.forEach((element) => {
  //     let IsPathology, IsRadiology
  //     if (element.IsPathology)
  //       IsPathology = true
  //     if (element.IsRadiology)
  //       IsRadiology = true

  //     let InsertAddChargesObj = {};
  //     InsertAddChargesObj['chargesId'] = 0,
  //       InsertAddChargesObj['ChargesDate'] = this.datePipe.transform(this.currentDate, "yyyy-MM-dd"),
  //       InsertAddChargesObj['opdIpdType'] = 0,
  //       InsertAddChargesObj['OpdIpdId'] = this.OpBillForm.get('OPIPId')?.value,
  //       InsertAddChargesObj['serviceId'] = element.ServiceId,
  //       InsertAddChargesObj['price'] = element.Price,
  //       InsertAddChargesObj['qty'] = element.Qty,
  //       InsertAddChargesObj['totalAmt'] = element.TotalAmt,
  //       InsertAddChargesObj['concessionPercentage'] = element.DiscPer || 0,
  //       InsertAddChargesObj['concessionAmount'] = Math.round(element.DiscAmt) || 0,
  //       InsertAddChargesObj['netAmount'] = element.NetAmount,
  //       InsertAddChargesObj['doctorId'] = element.DoctorId || 0,
  //       InsertAddChargesObj['docPercentage'] = 0,
  //       InsertAddChargesObj['docAmt'] = 0,
  //       InsertAddChargesObj['hospitalAmt'] = element.NetAmount,
  //       InsertAddChargesObj['isGenerated'] = false,
  //       InsertAddChargesObj['addedBy'] = this.accountService.currentUserValue.userId,
  //       InsertAddChargesObj['isCancelled'] = false,
  //       InsertAddChargesObj['isCancelledBy'] = 0,
  //       InsertAddChargesObj['isCancelledDate'] = "1900-01-01",
  //       InsertAddChargesObj['isPathology'] = IsPathology || false,
  //       InsertAddChargesObj['isRadiology'] = IsRadiology || false,
  //       InsertAddChargesObj['isPackage'] = false,//element.IsPackage,
  //       InsertAddChargesObj['packageMainChargeID'] = 0,
  //       InsertAddChargesObj['isSelfOrCompanyService'] = false,
  //       InsertAddChargesObj['packageId'] = 0,
  //       InsertAddChargesObj['BillNo'] = 0,
  //       InsertAddChargesObj['chargesTime'] = this.datePipe.transform(this.currentDate, "HH:mm:ss"),
  //       InsertAddChargesObj['classId'] = this.vClassId,
  //       InsertAdddetArr.push(InsertAddChargesObj);
  //   });


  //   let Billdetsarr = [];
  //   this.dsChargeList.data.forEach((element) => {

  //     let BillDetailsInsertObj = {};
  //     BillDetailsInsertObj['BillNo'] = 0;
  //     BillDetailsInsertObj['ChargesId'] = element.ServiceId;
  //     Billdetsarr.push(BillDetailsInsertObj);
  //   });
  //   //Patient info 
  //   debugger
  //   let PatientHeaderObj = {};
  //   PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
  //     PatientHeaderObj['PatientName'] = this.PatientName;
  //   PatientHeaderObj['RegNo'] = this.RegNo;
  //   PatientHeaderObj['DoctorName'] = this.Doctorname;
  //   PatientHeaderObj['CompanyName'] = this.CompanyName;
  //   PatientHeaderObj['DepartmentName'] = this.DepartmentName;
  //   PatientHeaderObj['OPD_IPD_Id'] = this.vOPIPId;
  //   PatientHeaderObj['Age'] = this.AgeYear;
  //   PatientHeaderObj['NetPayAmount'] = Math.round(this.OpBillForm.get('netPayableAmt').value);

  //   if (this.OpBillForm.get('paymentType').value == 'PayOption') {
  //     const dialogRef = this._matDialog.open(OpPaymentComponent,
  //       {
  //         maxWidth: "90vw",
  //         height: '650px',
  //         width: '80%',
  //         data: {
  //           vPatientHeaderObj: PatientHeaderObj,
  //           FromName: "OP-Bill",
  //           advanceObj: PatientHeaderObj,
  //         }
  //       });

  //     dialogRef.afterClosed().subscribe(result => {

  //       this.flagSubmit = result.IsSubmitFlag

  //       if (this.flagSubmit == true) {
  //         this.Paymentdataobj = result.submitDataPay.ipPaymentInsert;
  //         let submitData = {
  //           BillNo: 0,
  //           opdipdid: this.OpBillForm.get('OPIPId')?.value,
  //           TotalAmt: this.OpBillForm.get('totalAmt').value || 0,
  //           ConcessionAmt: Math.round(this.OpBillForm.get('concessionAmt').value) || 0,
  //           NetPayableAmt: Math.round(this.OpBillForm.get('netPayableAmt').value) || 0,
  //           PaidAmt: Math.round(this.OpBillForm.get('netPayableAmt').value) || 0,
  //           BalanceAmt: 0,
  //           BillDate: this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
  //           OPDIPDType: 0,
  //           AddedBy: this.accountService.currentUserValue.userId,
  //           TotalAdvanceAmount: 0,
  //           BillTime: this.dateTimeObj.time,
  //           ConcessionReasonId: this.ConcessionId,
  //           IsSettled: true,
  //           IsPrinted: true,
  //           IsFree: true,
  //           CompanyId: 0,
  //           TariffId: this.OpBillForm.get('tariffId')?.value,
  //           UnitId: this.OpBillForm.get('hospitalId')?.value,
  //           InterimOrFinal: 0,
  //           CompanyRefNo: 0,
  //           ConcessionAuthorizationName: 0,
  //           SpeTaxPer: 0,
  //           SpeTaxAmt: 0,
  //           CompDiscAmt: Math.round(this.OpBillForm.get('concessionAmt').value) || 0,
  //           DiscComments: this.ConcessionReason,
  //           CashCounterId: this.searchForm.get('CashCounterID').value || 0,
  //           "addCharges": InsertAdddetArr,
  //           "billDetails": Billdetsarr,
  //           "Payments": this.Paymentdataobj// result.submitDataPay.ipPaymentInsert,
  //         }
  //         console.log(submitData);
  //         this._AppointmentlistService.InsertOPBilling(submitData).subscribe(response => {
  //           this.toastrService.success(response.message);
  //           this.viewgetOPBillReportPdf(response)
  //           if (response)
  //             this.resetform();
  //           this._matDialog.closeAll();
  //           this.savebtn = true
  //         }, (error) => {
  //           this.toastrService.error(error.message);
  //         });

  //       }
  //     });
  //   }
  //   else if (this.OpBillForm.get('paymentType').value == 'CashPay') {//Cash pay

  //     let Paymentobj = {};
  //     Paymentobj['PaymentId'] = 0;
  //     Paymentobj['BillNo'] = 0;
  //     Paymentobj['PaymentDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
  //       Paymentobj['PaymentTime'] = this.dateTimeObj.time || '01/01/1900',
  //       Paymentobj['CashPayAmount'] = Math.round(this.OpBillForm.get('netPayableAmt').value) || 0;
  //     Paymentobj['ChequePayAmount'] = 0;
  //     Paymentobj['ChequeNo'] = "0";
  //     Paymentobj['BankName'] = "";
  //     Paymentobj['ChequeDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
  //       Paymentobj['CardPayAmount'] = 0;
  //     Paymentobj['CardNo'] = "0";
  //     Paymentobj['CardBankName'] = "";
  //     Paymentobj['CardDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
  //       Paymentobj['AdvanceUsedAmount'] = 0;
  //     Paymentobj['AdvanceId'] = 0;
  //     Paymentobj['RefundId'] = 0;
  //     Paymentobj['TransactionType'] = 0;
  //     Paymentobj['Remark'] = "Cashpayment";
  //     Paymentobj['AddBy'] = this.accountService.currentUserValue.userId,
  //       Paymentobj['IsCancelled'] = false;
  //     Paymentobj['IsCancelledBy'] = 0;
  //     Paymentobj['IsCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
  //       Paymentobj['NEFTPayAmount'] = 0;
  //     Paymentobj['NEFTNo'] = "0";
  //     Paymentobj['NEFTBankMaster'] = "";
  //     Paymentobj['NEFTDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
  //       Paymentobj['PayTMAmount'] = 0;
  //     Paymentobj['PayTMTranNo'] = "0";
  //     Paymentobj['PayTMDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
  //       Paymentobj['tdsAmount'] = 0;

  //     let submitData = {
  //       BillNo: 0,
  //       opdipdid: this.vOPIPId,
  //       TotalAmt: this.OpBillForm.get('totalAmt').value || 0,
  //       ConcessionAmt: Math.round(this.OpBillForm.get('concessionAmt').value) || 0,
  //       NetPayableAmt: Math.round(this.OpBillForm.get('netPayableAmt').value) || 0,
  //       PaidAmt: Math.round(this.OpBillForm.get('netPayableAmt').value) || 0,
  //       BalanceAmt: 0,// this.OpBillForm.get('FinalNetAmt').value,
  //       BillDate: this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
  //       opdipdType: 0,
  //       AddedBy: this.accountService.currentUserValue.userId,
  //       TotalAdvanceAmount: 0,
  //       BillTime: this.dateTimeObj.time,
  //       ConcessionReasonId: this.ConcessionId,
  //       IsSettled: true,
  //       IsPrinted: true,
  //       IsFree: true,
  //       CompanyId: 0,
  //       TariffId: this.OpBillForm.get('tariffId')?.value,
  //       UnitId: this.OpBillForm.get('hospitalId')?.value,
  //       InterimOrFinal: 0,
  //       CompanyRefNo: 0,
  //       ConcessionAuthorizationName: 0,
  //       SpeTaxPer: 0,
  //       SpeTaxAmt: 0,
  //       CompDiscAmt: Math.round(this.OpBillForm.get('concessionAmt').value) || 0,
  //       DiscComments: this.ConcessionReason,
  //       CashCounterId: this.searchForm.get('CashCounterID').value || 0,

  //       "AddCharges": InsertAdddetArr,
  //       "BillDetails": Billdetsarr,
  //       "Payments": Paymentobj,
  //     };
  //     console.log(submitData);
  //     this._AppointmentlistService.InsertOPBilling(submitData).subscribe(response => {
  //       this.viewgetOPBillReportPdf(response)
  //       this._matDialog.closeAll();
  //       this.savebtn = true
  //       if (response)
  //         this.resetform();

  //     }, (error) => {
  //       this.toastrService.error(error.message);
  //     });

  //   }

  // }
  // saveCreditbill() {
  //   let Billdetsarr = [];
  //   this.dsChargeList.data.forEach((element) => {
  //     let BillDetailsInsertObj = {};
  //     BillDetailsInsertObj['BillNo'] = 0;
  //     BillDetailsInsertObj['ChargesId'] = element.ServiceId;
  //     Billdetsarr.push(BillDetailsInsertObj);
  //   });

  //   let InsertAdddetArr = [];
  //   this.dsChargeList.data.forEach((element) => {
  //     let IsPathology, IsRadiology
  //     if (element.IsPathology)
  //       IsPathology = true
  //     if (element.IsRadiology)
  //       IsRadiology = true
  //     let InsertAddChargesObj = {};
  //     InsertAddChargesObj['chargesId'] = 0,
  //       InsertAddChargesObj['ChargesDate'] = this.datePipe.transform(this.currentDate, "yyyy-MM-dd"),
  //       InsertAddChargesObj['opdIpdType'] = 0,
  //       InsertAddChargesObj['OpdIpdId'] = this.OpBillForm.get('OPIPId')?.value,
  //       InsertAddChargesObj['serviceId'] = element.ServiceId,
  //       InsertAddChargesObj['price'] = element.Price,
  //       InsertAddChargesObj['qty'] = element.Qty,
  //       InsertAddChargesObj['totalAmt'] = element.TotalAmt,
  //       InsertAddChargesObj['concessionPercentage'] = element.DiscPer || 0,
  //       InsertAddChargesObj['concessionAmount'] = Math.round(element.DiscAmt) || 0,
  //       InsertAddChargesObj['netAmount'] = element.NetAmount,
  //       InsertAddChargesObj['doctorId'] = element.DoctorId || 0,
  //       InsertAddChargesObj['docPercentage'] = 0,
  //       InsertAddChargesObj['docAmt'] = 0,
  //       InsertAddChargesObj['hospitalAmt'] = element.NetAmount,
  //       InsertAddChargesObj['isGenerated'] = false,
  //       InsertAddChargesObj['addedBy'] = this.accountService.currentUserValue.userId,
  //       InsertAddChargesObj['isCancelled'] = false,
  //       InsertAddChargesObj['isCancelledBy'] = 0,
  //       InsertAddChargesObj['isCancelledDate'] = "1900-01-01",
  //       InsertAddChargesObj['isPathology'] = IsPathology || false,
  //       InsertAddChargesObj['isRadiology'] = IsRadiology || false,
  //       InsertAddChargesObj['isPackage'] = false,//element.IsPackage,
  //       InsertAddChargesObj['packageMainChargeID'] = 0,
  //       InsertAddChargesObj['isSelfOrCompanyService'] = false,
  //       InsertAddChargesObj['packageId'] = 0,
  //       InsertAddChargesObj['BillNo'] = 0,
  //       InsertAddChargesObj['chargesTime'] = this.datePipe.transform(this.currentDate, "HH:mm:ss"),
  //       InsertAddChargesObj['classId'] = this.vClassId,
  //       InsertAdddetArr.push(InsertAddChargesObj);
  //   })

  //   let submitData = {
  //     BillNo: 0,
  //     opdipdid: this.OpBillForm.get('OPIPId')?.value, //this.vOPIPId,
  //     TotalAmt: this.OpBillForm.get('totalAmt').value || 0,
  //     ConcessionAmt: Math.round(this.OpBillForm.get('concessionAmt').value) || 0,
  //     NetPayableAmt: Math.round(this.OpBillForm.get('netPayableAmt').value) || 0,
  //     PaidAmt: 0,
  //     BalanceAmt: this.OpBillForm.get('netPayableAmt').value,
  //     BillDate: this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
  //     OPDIPDType: 0,
  //     AddedBy: 1,
  //     TotalAdvanceAmount: 0,
  //     BillTime: this.dateTimeObj.time,
  //     ConcessionReasonId: this.ConcessionId,
  //     IsSettled: true,
  //     IsPrinted: true,
  //     IsFree: true,
  //     CompanyId: 0,
  //     TariffId: this.OpBillForm.get('tariffId')?.value,
  //     UnitId: this.OpBillForm.get('hospitalId')?.value,
  //     InterimOrFinal: 0,
  //     CompanyRefNo: 0,
  //     ConcessionAuthorizationName: 0,
  //     SpeTaxPer: 0,
  //     SpeTaxAmt: 0,
  //     CompDiscAmt: Math.round(this.OpBillForm.get('concessionAmt').value) || 0,
  //     DiscComments: this.ConcessionReason,
  //     CashCounterId: this.searchForm.get('CashCounterID').value || 0,
  //     "addCharges": InsertAdddetArr,
  //     "billDetails": Billdetsarr,

  //   };
  //   console.log(submitData);
  //   this._AppointmentlistService.InsertOPBillingCredit(submitData).subscribe(response => {
  //     this.viewgetCreditOPBillReportPdf(response)
  //     this._matDialog.closeAll();
  //     this.savebtn = true
  //     if (response)
  //       this.resetform();
  //   });

  // } 
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
        { name: "required", Message: "First Name is required" },

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
