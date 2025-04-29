import { Component, ElementRef, Inject, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { BehaviorSubject, Subscription } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { RegInsert } from '../../registration/registration.component';
import { AppointmentlistService } from '../appointmentlist.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { debug } from 'console';
import { OpPaymentNewComponent } from '../../op-search-list/op-payment-new/op-payment-new.component';
import { debugPort } from 'process';
import { VisitMaster1 } from '../appointment-list.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { SearchInforObj } from '../../op-search-list/opd-search-list/opd-search-list.component';
import { AppointmentBillService } from './appointment-bill.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { OpPaymentComponent } from '../../op-search-list/op-payment/op-payment.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-appointment-billing',
  templateUrl: './appointment-billing.component.html',
  styleUrls: ['./appointment-billing.component.scss'],
  animations: fuseAnimations
})
export class AppointmentBillingComponent implements OnInit, OnDestroy {
  public subscription: Array<Subscription> = [];

  //new
  ServiceList: any = [];
  CreditedtoDoctor: any;
  IsPathology: any;
  IsRadiology: any;
  isLoading: String = '';
  vIsPackage: any;
  vPrice = '0';
  vQty: any;
  vChargeTotalAmount: any = 0;
  vDoctor: any;
  SrvcName1: any = ""
  vCahrgeNetAmount: any;
  serviceId: any;
  VchargeDiscPer: any;
  vchargeDisAmount: any;
  DoctornewId: any;
  ChargesDoctorname: any;
  vClassName: any;
  filteredOptionsService: any;
  vFinalConcessionAmt: any;
  FinalNetAmt: any;
  vFinalconcessionDiscPer: any;
  vFinalTotalAmt: any;
  patientDetail: any = new RegInsert({});
  patientDetail1 = new VisitMaster1({});
  RegId = 0

  vOPIPId = 0;
  vOPDNo: any;
  vTariffId: any = 0;
  vClassId: any = 0;
  currentDate = new Date();
  PatientName: any;
  totalAmtOfNetAmt: any;
  vFinalnetPaybleAmt: any = 0;
  className = "OPD";
  savebtn: boolean = true;
  screenFromString = 'Common-form';

  //calculation
  CompanyId: any;
  netPaybleAmt1: any;
  flagSubmit: boolean;
  RegNo: any;
  Doctorname: any;
  CompanyName: any;
  DepartmentName: any;
  AgeYear: any;
  balanceamt: number;
  vMobileNo: any;
  paidamt: any
  Paymentdataobj: PaymentInsert[] = [];
  ConcessionId = 0;
  ConcessionReason = "";
  Regstatus: boolean = true;
  Consessionres: boolean = false;
  autocompleteModeCashcounter: string = "CashCounter";
  autocompleteModedeptdoc: string = "ConDoctor";
  autocompleteModeService: string = "Service";
  autocompleteModeConcession: string = "Concession";

  public dataSource = new MatTableDataSource<any>();


  public searchForm!: FormGroup;
  public chargeForm!: FormGroup;
  public totalChargeForm!: FormGroup;

  public isServiceSelected = false;
  public isDiscountApplied = false;
  public isDoctor = false;
  public isUpdating = false;

  public displayedChargeColumns: string[] = ['ServiceName', 'Price', 'Qty', 'TotalAmount', 'DiscountPer', 'DiscountAmount', 'NetAmount', 'DoctorName', 'ClassName', 'ChargesAddedName', 'Action'];
  public displayedPackageColumns: string[] = ['PackageName', 'ServiceName', 'Price', 'Qty', 'TotalAmount', 'DiscountPer', 'DiscountAmount', 'NetAmount', 'DoctorName', 'ClassName', 'ChargesAddedName', 'Action'];
  public displayedPrescriptionColumns = ['ServiceName', 'Qty', 'Price', 'TotalAmt'];
  //   public dataSource = new MatTableDataSource<ChargesList>();
  public dsChargeList = new MatTableDataSource<ChargesList>();
  public dsPackageList = new MatTableDataSource<ChargesList>();
  public dsServiceList = new MatTableDataSource<ChargesList>();
  public chargeList: ChargesList[] = [];
  public packageList: ChargesList[] = [];
  public serviceList: ChargesList[] = [];
  public isModal = false;
  selectedAdvanceObj: SearchInforObj;
  dateTimeObj: any;

  constructor(private _matDialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    private commonService: PrintserviceService,
    public _AppointmentlistService: AppointmentBillService,
       private accountService: AuthenticationService,
       public toastr: ToastrService,
         private _FormvalidationserviceService :FormvalidationserviceService,
    private formBuilder: FormBuilder, private toastrService: ToastrService,
    @Optional() public dialogRef: MatDialogRef<AppointmentBillingComponent>
  ) { };
  ApiURL: any;
  @ViewChild('regIdfocus') regIdfocus: ElementRef;
  ngOnInit() {
    this.isModal = !!this.dialogRef;
    console.log("DATA : ", this.advanceDataStored.storage);
    this.patientDetail.tariffId=1
    this.patientDetail.classId=1
    this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + 1 + "&ClassId=" + 2 + "&ServiceName="
    if (this.data) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.patientDetail = this.selectedAdvanceObj;
      // this.PatientName = this.patientDetail.patientName
      this.patientDetail.formattedText = this.patientDetail.patientName
      this.patientDetail.doctorName = this.patientDetail.doctorname
      this.vOPIPId = this.patientDetail.visitId
      this.savebtn = false
      // console.log("DATA : ", this.patientDetail);
    }

    this.searchForm = this.createSearchForm();
    this.chargeForm = this.createChargeForm();
    this.totalChargeForm = this.createTotalChargeForm();

    this.dsChargeList = new MatTableDataSource(this.chargeList);
    this.dsPackageList = new MatTableDataSource(this.packageList);
    this.dsServiceList = new MatTableDataSource(this.serviceList);

    this.setupFormListener();

  }

  private setupFormListener(): void {
    this.handleChange('serviceName', () => this.filterServiceName());
    this.handleChange('price', () => this.calculateTotalCharge());
    this.handleChange('qty', () => this.calculateTotalCharge());
    this.handleChange('discountPer', () => this.updateDiscountAmount());
    this.handleChange('discountAmount', () => this.updateDiscountPercentage());
    this.handleChange('totalDiscountPer', () => this.updateTotalDiscountAmt(), this.totalChargeForm);
    this.handleChange('totalDiscountAmount', () => this.updateTotalDiscountPer(), this.totalChargeForm);
  }

  calculateTotalCharge(row: any = null): void {
    let qty = +this.chargeForm.get("qty").value;
    let price = +this.chargeForm.get("price").value;

    // if (qty <= 0 || price <= 0) return;

    // let total = qty * price;

    let total = 0
    if (qty > 0 && price > 0){
      total = qty * price;
    }  

    this.chargeForm.patchValue({
      totalAmount: total,
      netAmount: total  // Set net amount initially
    }, { emitEvent: false }); // Prevent infinite loop

    this.updateDiscountAmount();
    this.updateDiscountPercentage();

  }

  filterServiceName(): void {
    // const serviceNameValue = this.chargeForm.get('serviceName')?.value || '';
    // const filterValue = serviceNameValue.toLowerCase();
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

  createChargeFormArray() {
    return this.formBuilder.group({
      rows: this.formBuilder.array([this.createChargeForm()])
    });
  }
  // Create a FormGroup for each row in the FormArray
  createChargeForm() {
    return this.formBuilder.group({
      serviceName: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0),this._FormvalidationserviceService.inputFieldValidator()]],
      qty: [1, [Validators.required, Validators.min(1)]],
      totalAmount: [0,],
      discountPer: [0, [Validators.min(0), Validators.max(100)]],
      discountAmount: [0, [Validators.required, Validators.min(0)]],
      netAmount: [0, [Validators.min(0)]],
      DoctorID: [0]
    });
  }
  createTotalChargeForm() {
    // This all total amounts are calclated based on total data...
    return this.formBuilder.group({
      totalAmount: [0],
      totalDiscountPer: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      totalDiscountAmount: [0, [Validators.required, Validators.min(0)]],
      totalNetAmount: [0, [Validators.min(0)]],
      paymentType: ['CashPay'],
      concessionId: [0]

    });
  }
  doctorName: any
  getdocdetail(event) {
    this.doctorName = event.text
  }
  onAddCharges(): void {

    const serviceNameValue = this.chargeForm.get('serviceName').value;
    if (!serviceNameValue || this.serviceSelct == false) {
      this.toastrService.warning('Please select valid Service Name', 'Warning !', {
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
    const control = this.totalChargeForm.get(key);
    return control ? control.value : 0;
  }

  // Calculation of total amount.
  calculateTotalAmount(): void {
    let totalSum = this.chargeList.reduce((sum, charge) => sum + (+charge.TotalAmt), 0);
    let totalDiscount = this.chargeList.reduce((sum, charge) => sum + (+charge.DiscAmt), 0);
    let totalNet = totalSum - totalDiscount;

    this.totalChargeForm.patchValue({
      totalAmount: totalSum,
      totalDiscountAmount: Math.round(totalDiscount),
      totalNetAmount: Math.round(totalNet)
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
    if (discountPer == 0){
      this.Consessionres = false
      this.totalChargeForm.get("concessionId").setValue(0)
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
    if (discountAmt == 0){
      this.Consessionres = false
      this.totalChargeForm.get("concessionId").setValue(0)
    }
    row.DiscPer = totalAmount ? parseFloat(((discountAmt / totalAmount) * 100).toFixed(2)) : 0;
    row.TotalAmt = totalAmount;
    row.NetAmount = totalAmount - discountAmt;

    this.calculateTotalAmount();
  }
  updateTotalDiscountAmt(): void {
    if (this.isUpdating) return; // Stop recursion
    this.isUpdating = true;
debugger
    const totalDiscountPer = +this.totalChargeForm.get("totalDiscountPer").value;
    if(totalDiscountPer==0)
      this.totalChargeForm.get("concessionId").setValue(0)
    if (totalDiscountPer < 0 || totalDiscountPer > 100 ) {
      this.totalChargeForm.get("totalDiscountPer").setValue(0);
      this.totalChargeForm.get("totalDiscountAmount").setValue(0);

      this.isUpdating = false;
      this.Consessionres = false;
     
      this.toastrService.error("Discount must be between 0 to 100.");
      return;
    }
    this.Consessionres = totalDiscountPer !== 0;
    if (!this.isDiscountApplied) {
      const totalAmount = +this.totalChargeForm.get("totalAmount").value;
      const discountAmount = (totalAmount * totalDiscountPer) / 100;
      const netAmount = totalAmount - discountAmount;
      this.totalChargeForm.patchValue({
        totalDiscountAmount: Math.round(discountAmount),
        totalNetAmount: Math.round(netAmount)
      }, { emitEvent: false });
    }
    this.isUpdating = false;
  }
  updateTotalDiscountPer(): void {
    if (this.isUpdating) return; // Stop recursion
    this.isUpdating = true;

    const totalDiscountAmount = +this.totalChargeForm.get("totalDiscountAmount").value;
    const totalChargeAmount = +this.totalChargeForm.get("totalAmount").value;

    if(totalDiscountAmount==0)
      this.totalChargeForm.get("concessionId").setValue(0)
    
    if (totalDiscountAmount < 0 || totalDiscountAmount > totalChargeAmount) {
      this.totalChargeForm.get("totalDiscountPer").setValue(0);
      this.totalChargeForm.get("totalDiscountAmount").setValue(0);
      this.isUpdating = false;
      this.Consessionres = false;
      this.toastrService.error("Discount must be between 0 and the total amount.");
      return;
    }
    this.Consessionres = totalDiscountAmount !== 0;
    if (!this.isDiscountApplied) {
      const disountPer = Number(totalChargeAmount ? ((totalDiscountAmount / totalChargeAmount) * 100).toFixed(2) : "0.00");
      const netAmount = totalChargeAmount - totalDiscountAmount;
      this.totalChargeForm.patchValue({
        totalDiscountPer: disountPer,
        totalNetAmount: netAmount.toFixed(2)
      }, { emitEvent: false });
    }
    this.isUpdating = false;
  }

  onSubmit(): void {
    if (this.totalChargeForm.valid && this.chargeList.length > 0) {
      console.log("FORM: ", { chargeList: this.chargeList, paymentDetail: this.totalChargeForm.value });
      // Pending task
    }
  }
  ngOnDestroy(): void {
    if (this.subscription.length > 0) {
      this.subscription.forEach(s => s.unsubscribe());
    }
  }

  // getApiUrl(): string {
  //   const url = `VisitDetail/GetServiceListwithTraiff?TariffId=${this.patientDetail.tariffId}&ClassId=${this.patientDetail.classId}&ServiceName=`;
  //   console.log('Generated API URL:', url);  // Add this line for debugging
  //   return url;
  // }
  serviceSelct = false
  
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
      this.vPrice = obj.classRate;
      this.vQty = 1;
      this.vChargeTotalAmount = obj.price;
      this.vCahrgeNetAmount = obj.price;
      this.serviceId = obj.serviceId;
      this.IsPathology = obj.isPathology;
      this.IsRadiology = obj.isRadiology;
      this.vIsPackage = obj.isPackage;
      this.CreditedtoDoctor = obj.creditedtoDoctor;
      if (this.CreditedtoDoctor == true) {
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
    this.vOPIPId = obj.visitId
    if (this.vOPIPId > 0)
      this.savebtn = false
    this.Regstatus = false
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
  // onScroll() {
  //   // this.nextPage$.next();
  // }

  onsave() {
    
    if (this.totalChargeForm.get('concessionId').value == 0 && this.Consessionres) {
      if(!this.totalChargeForm.get('concessionId').value){
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
        if (this.totalChargeForm.get('paymentType').value == 'CreditPay')
          this.saveCreditbill();
        else
          this.BillSave();
      }
    })

    this.searchForm.get("regId").setValue("")
    this.patientDetail = []
  }


  saveCreditbill() {
        let Billdetsarr = [];
    this.dsChargeList.data.forEach((element) => {
      let BillDetailsInsertObj = {};
      BillDetailsInsertObj['BillNo'] = 0;
      BillDetailsInsertObj['ChargesId'] = element.ServiceId;
      Billdetsarr.push(BillDetailsInsertObj);
    });

    let InsertAdddetArr = [];
    this.dsChargeList.data.forEach((element) => {
      let IsPathology, IsRadiology
      if (element.IsPathology)
        IsPathology = true
      if (element.IsRadiology)
        IsRadiology = true
      let InsertAddChargesObj = {};
      InsertAddChargesObj['chargesId'] = 0,
        InsertAddChargesObj['ChargesDate'] = this.datePipe.transform(this.currentDate, "yyyy-MM-dd"),
        InsertAddChargesObj['opdIpdType'] = 0,
        InsertAddChargesObj['OpdIpdId'] = this.vOPIPId,
        InsertAddChargesObj['serviceId'] = element.ServiceId,
        InsertAddChargesObj['price'] = element.Price,
        InsertAddChargesObj['qty'] = element.Qty,
        InsertAddChargesObj['totalAmt'] = element.TotalAmt,
        InsertAddChargesObj['concessionPercentage'] = element.DiscPer || 0,
        InsertAddChargesObj['concessionAmount'] = Math.round(element.DiscAmt) || 0,
        InsertAddChargesObj['netAmount'] = element.NetAmount,
        InsertAddChargesObj['doctorId'] = element.DoctorId || 0,
        InsertAddChargesObj['docPercentage'] = 0,
        InsertAddChargesObj['docAmt'] = 0,
        InsertAddChargesObj['hospitalAmt'] = element.NetAmount,
        InsertAddChargesObj['isGenerated'] = false,
        InsertAddChargesObj['addedBy'] =this.accountService.currentUserValue.userId,
        InsertAddChargesObj['isCancelled'] = false,
        InsertAddChargesObj['isCancelledBy'] = 0,
        InsertAddChargesObj['isCancelledDate'] = "1900-01-01",
        InsertAddChargesObj['isPathology'] = IsPathology || false,
        InsertAddChargesObj['isRadiology'] = IsRadiology || false,
        InsertAddChargesObj['isPackage'] = false,//element.IsPackage,
        InsertAddChargesObj['packageMainChargeID'] = 0,
        InsertAddChargesObj['isSelfOrCompanyService'] = false,
        InsertAddChargesObj['packageId'] = 0,
        InsertAddChargesObj['BillNo'] = 0,
        InsertAddChargesObj['chargesTime'] = this.datePipe.transform(this.currentDate, "HH:mm:ss"),
        InsertAddChargesObj['classId'] = this.vClassId,

        InsertAdddetArr.push(InsertAddChargesObj);
    })

    let submitData = {
      BillNo: 0,
      opdipdid: this.vOPIPId,
      TotalAmt: this.totalChargeForm.get('totalAmount').value || 0,
      ConcessionAmt: Math.round(this.totalChargeForm.get('totalDiscountAmount').value) || 0,
      NetPayableAmt: Math.round(this.totalChargeForm.get('totalNetAmount').value) || 0,
      PaidAmt: 0,
      BalanceAmt: this.totalChargeForm.get('totalNetAmount').value,
      BillDate: this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
      OPDIPDType: 0,
      AddedBy: 1,
      TotalAdvanceAmount: 0,
      BillTime: this.dateTimeObj.time,
      ConcessionReasonId: this.ConcessionId,
      IsSettled: true,
      IsPrinted: true,
      IsFree: true,
      CompanyId: 0,
      TariffId: this.vTariffId || 0,
      UnitId: 1,
      InterimOrFinal: 0,
      CompanyRefNo: 0,
      ConcessionAuthorizationName: 0,
      SpeTaxPer: 0,
      SpeTaxAmt: 0,
      CompDiscAmt: Math.round(this.totalChargeForm.get('totalDiscountAmount').value) || 0,
      DiscComments: this.ConcessionReason,
      CashCounterId: this.searchForm.get('CashCounterID').value || 0,
      "addCharges": InsertAdddetArr,
      "billDetails": Billdetsarr,

    };
    console.log(submitData);
    this._AppointmentlistService.InsertOPBillingCredit(submitData).subscribe(response => {
      this.toastrService.success(response.message);
      this.viewgetCreditOPBillReportPdf(response)
      this._matDialog.closeAll();
      this.savebtn = true
      if (response)
        this.resetform();
    }, (error) => {
      this.toastrService.error(error.message);
    });

  }


  BillSave() {
    
    let InsertAdddetArr = [];
    this.dsChargeList.data.forEach((element) => {
      let IsPathology, IsRadiology
      if (element.IsPathology)
        IsPathology = true
      if (element.IsRadiology)
        IsRadiology = true

      let InsertAddChargesObj = {};
      InsertAddChargesObj['chargesId'] = 0,
        InsertAddChargesObj['ChargesDate'] = this.datePipe.transform(this.currentDate, "yyyy-MM-dd"),
        InsertAddChargesObj['opdIpdType'] = 0,
        InsertAddChargesObj['OpdIpdId'] = this.vOPIPId,
        InsertAddChargesObj['serviceId'] = element.ServiceId,
        InsertAddChargesObj['price'] = element.Price,
        InsertAddChargesObj['qty'] = element.Qty,
        InsertAddChargesObj['totalAmt'] = element.TotalAmt,
        InsertAddChargesObj['concessionPercentage'] = element.DiscPer || 0,
        InsertAddChargesObj['concessionAmount'] = Math.round(element.DiscAmt) || 0,
        InsertAddChargesObj['netAmount'] = element.NetAmount,
        InsertAddChargesObj['doctorId'] = element.DoctorId || 0,
        InsertAddChargesObj['docPercentage'] = 0,
        InsertAddChargesObj['docAmt'] = 0,
        InsertAddChargesObj['hospitalAmt'] = element.NetAmount,
        InsertAddChargesObj['isGenerated'] = false,
        InsertAddChargesObj['addedBy'] = this.accountService.currentUserValue.userId,
        InsertAddChargesObj['isCancelled'] = false,
        InsertAddChargesObj['isCancelledBy'] = 0,
        InsertAddChargesObj['isCancelledDate'] = "1900-01-01",
        InsertAddChargesObj['isPathology'] = IsPathology || false,
        InsertAddChargesObj['isRadiology'] = IsRadiology || false,
        InsertAddChargesObj['isPackage'] = false,//element.IsPackage,
        InsertAddChargesObj['packageMainChargeID'] = 0,
        InsertAddChargesObj['isSelfOrCompanyService'] = false,
        InsertAddChargesObj['packageId'] = 0,
        InsertAddChargesObj['BillNo'] = 0,
        InsertAddChargesObj['chargesTime'] = this.datePipe.transform(this.currentDate, "HH:mm:ss"),
        InsertAddChargesObj['classId'] = this.vClassId,
        InsertAdddetArr.push(InsertAddChargesObj);
    });


    let Billdetsarr = [];
    this.dsChargeList.data.forEach((element) => {

      let BillDetailsInsertObj = {};
      BillDetailsInsertObj['BillNo'] = 0;
      BillDetailsInsertObj['ChargesId'] = element.ServiceId;
      Billdetsarr.push(BillDetailsInsertObj);
    });
    //Patient info 
    let PatientHeaderObj = {};
    PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
      PatientHeaderObj['PatientName'] = this.PatientName;
    PatientHeaderObj['RegNo'] = this.RegNo;
    PatientHeaderObj['DoctorName'] = this.Doctorname;
    PatientHeaderObj['CompanyName'] = this.CompanyName;
    PatientHeaderObj['DepartmentName'] = this.DepartmentName;
    PatientHeaderObj['OPD_IPD_Id'] = this.vOPDNo;
    PatientHeaderObj['Age'] = this.AgeYear;
    PatientHeaderObj['NetPayAmount'] = Math.round(this.totalChargeForm.get('totalNetAmount').value);

    if (this.totalChargeForm.get('paymentType').value == 'PayOption') {
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

        this.flagSubmit = result.IsSubmitFlag
        
        if (this.flagSubmit == true) {
          this.Paymentdataobj = result.submitDataPay.ipPaymentInsert;
          let submitData = {
            BillNo: 0,
            opdipdid: this.vOPIPId,
            TotalAmt: this.totalChargeForm.get('totalAmount').value || 0,
            ConcessionAmt: Math.round(this.totalChargeForm.get('totalDiscountAmount').value) || 0,
            NetPayableAmt: Math.round(this.totalChargeForm.get('totalNetAmount').value) || 0,
            PaidAmt: Math.round(this.totalChargeForm.get('totalNetAmount').value) || 0,
            BalanceAmt: 0,
            BillDate: this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
            OPDIPDType: 0,
            AddedBy: 1,
            TotalAdvanceAmount: 0,
            BillTime: this.dateTimeObj.time,
            ConcessionReasonId: this.ConcessionId,
            IsSettled: true,
            IsPrinted: true,
            IsFree: true,
            CompanyId: 0,
            TariffId: this.vTariffId || 0,
            UnitId: 1,
            InterimOrFinal: 0,
            CompanyRefNo: 0,
            ConcessionAuthorizationName: 0,
            SpeTaxPer: 0,
            SpeTaxAmt: 0,
            CompDiscAmt: Math.round(this.totalChargeForm.get('totalDiscountAmount').value) || 0,
            DiscComments: this.ConcessionReason,
            CashCounterId: this.searchForm.get('CashCounterID').value || 0,
            "addCharges": InsertAdddetArr,
            "billDetails": Billdetsarr,
            "Payments": this.Paymentdataobj// result.submitDataPay.ipPaymentInsert,
          }
          console.log(submitData);
          this._AppointmentlistService.InsertOPBilling(submitData).subscribe(response => {
            this.toastrService.success(response.message);
                      this.viewgetOPBillReportPdf(response)
            if (response)
              this.resetform();
            this._matDialog.closeAll();
            this.savebtn = true
          }, (error) => {
            this.toastrService.error(error.message);
          });

        }
      });
    }
    else if (this.totalChargeForm.get('paymentType').value == 'CashPay') {//Cash pay

      let Paymentobj = {};
      Paymentobj['PaymentId'] = 0;
      Paymentobj['BillNo'] = 0;
      Paymentobj['PaymentDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
        Paymentobj['PaymentTime'] = this.dateTimeObj.time || '01/01/1900',
        Paymentobj['CashPayAmount'] = Math.round(this.totalChargeForm.get('totalNetAmount').value) || 0;
      Paymentobj['ChequePayAmount'] = 0;
      Paymentobj['ChequeNo'] = "0";
      Paymentobj['BankName'] = "";
      Paymentobj['ChequeDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
        Paymentobj['CardPayAmount'] = 0;
      Paymentobj['CardNo'] = "0";
      Paymentobj['CardBankName'] = "";
      Paymentobj['CardDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
        Paymentobj['AdvanceUsedAmount'] = 0;
      Paymentobj['AdvanceId'] = 0;
      Paymentobj['RefundId'] = 0;
      Paymentobj['TransactionType'] = 0;
      Paymentobj['Remark'] = "Cashpayment";
      Paymentobj['AddBy'] = 1,
        Paymentobj['IsCancelled'] = false;
      Paymentobj['IsCancelledBy'] = 0;
      Paymentobj['IsCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
        Paymentobj['NEFTPayAmount'] = 0;
      Paymentobj['NEFTNo'] = "0";
      Paymentobj['NEFTBankMaster'] = "";
      Paymentobj['NEFTDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
        Paymentobj['PayTMAmount'] = 0;
      Paymentobj['PayTMTranNo'] = "0";
      Paymentobj['PayTMDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
        Paymentobj['tdsAmount'] = 0;

      let submitData = {
        BillNo: 0,
        opdipdid: this.vOPIPId,
        TotalAmt: this.totalChargeForm.get('totalAmount').value || 0,
        ConcessionAmt: Math.round(this.totalChargeForm.get('totalDiscountAmount').value) || 0,
        NetPayableAmt: Math.round(this.totalChargeForm.get('totalNetAmount').value) || 0,
        PaidAmt: Math.round(this.totalChargeForm.get('totalNetAmount').value) || 0,
        BalanceAmt: 0,// this.totalChargeForm.get('FinalNetAmt').value,
        BillDate: this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
        opdipdType: 0,
        AddedBy: 1,
        TotalAdvanceAmount: 0,
        BillTime: this.dateTimeObj.time,
        ConcessionReasonId: this.ConcessionId,
        IsSettled: true,
        IsPrinted: true,
        IsFree: true,
        CompanyId: 0,
        TariffId: this.vTariffId || 0,
        UnitId: 1,
        InterimOrFinal: 0,
        CompanyRefNo: 0,
        ConcessionAuthorizationName: 0,
        SpeTaxPer: 0,
        SpeTaxAmt: 0,
        CompDiscAmt: Math.round(this.totalChargeForm.get('totalDiscountAmount').value) || 0,
        DiscComments: this.ConcessionReason,
        CashCounterId: this.searchForm.get('CashCounterID').value || 0,

        "AddCharges": InsertAdddetArr,
        "BillDetails": Billdetsarr,
        "Payments": Paymentobj,
      };
      console.log(submitData);
      this._AppointmentlistService.InsertOPBilling(submitData).subscribe(response => {
        this.toastrService.success(response.message);

        this.viewgetOPBillReportPdf(response)
        // this.totalChargeForm.reset();
        this._matDialog.closeAll();
        this.savebtn = true
        if (response)
          this.resetform();

      }, (error) => {
        this.toastrService.error(error.message);
      });

    }

  }

  resetform() {
    this.chargeList = [];
    this.dsChargeList.data = []
    this.patientDetail = [];
    this.patientDetail.tariffId = 1;
    this.patientDetail.ClassId = 1;
      
    this.totalChargeForm.reset({
      totalAmount: 0,
      totalDiscountPer: 0,
      totalDiscountAmount: 0,
      totalNetAmount: 0,
      concessionId: 0,
     
    });
    this.totalChargeForm.get('paymentType').setValue('CashPay')

  }
  viewgetCreditOPBillReportPdf(element) {
  this.commonService.Onprint("BillNo", element, "OpBillReceipt");
  }
  viewgetOPBillReportPdf(element) {
  this.commonService.Onprint("BillNo", element, "OpBillReceipt");
  }

  selectChangeConcession(event){
    this.ConcessionId=event.value
    this.ConcessionReason=event.text
  }
  onClose() { }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
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
  IsPathology: boolean;
  IsRadiology: boolean;
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
