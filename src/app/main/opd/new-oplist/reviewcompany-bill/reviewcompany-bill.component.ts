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
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-reviewcompany-bill',
  templateUrl: './reviewcompany-bill.component.html',
  styleUrls: ['./reviewcompany-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ReviewcompanyBillComponent { 
  OpBillEditSaveForm:FormGroup;
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
    autocompleteModeConcession: string = "Concession"; 
  vPrice = '0';
  vQty: any;
 
  public isDiscountApplied = false;
  Consessionres: boolean = false;
  // 'Status', 'ServiceCode',
  public displayedChargeColumns: string[] =
    ['Status','ServiceCode','ServiceName', 'Price', 'Qty', 'TotalAmount', 'DiscountPer', 'DiscountAmount', 'NetAmount', 'DoctorName',
      //  'ClassName', 'ChargesAddedName',  
    'Exclucion'];
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
  ) {this.OpBillEditSaveForm = this.createTotalChargeForm();};

  ngOnInit() {
    this.OPFooterForm = this.CreateOPFooter();
    this.OPFooterForm.markAllAsTouched();

    if (this.data) {
      console.log(this.data)
      this.patientDetail = this.data;
      this.getPrevCompanyBillList(this.patientDetail)
    }
 
  }
   
  CreateOPFooter() {
    return this.formBuilder.group({
      remark:[''],
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
      billUpdates:this.formBuilder.group({
      billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      paidAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      balanceAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      companyAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      patientAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      speTaxPer: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      speTaxAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]], 
      concessionReasonId:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      discComments:['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      modifiedBy:[this.accountService.currentUserValue.userId],
      }),
      // ✅ Fixed: should be FormArray
      ipAddChargesBill: this.formBuilder.array([]), 
    });
  } 
  CreateAddchargeform(item: any): FormGroup {
    return this.formBuilder.group({
      chargesDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      billNo: [item?.billNo, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      price: [item?.price, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      qty: [item?.qty, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      totalAmt: [item?.totalAmt, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionPercentage: [item?.concessionPercentage || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionAmount: [item?.concessionAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      netAmount: [item?.netAmount, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      addedBy: [this.accountService.currentUserValue.userId],  
      chargesTime: this.datePipe.transform(new Date(), 'shortTime'), 
      isInclusionExclusion: [item?.isInclusionExclusion || false,],
      chargesId: [item?.chargesId, [this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  } 
  // Getters 
  get IPaddchargeArray(): FormArray {
    return this.OpBillEditSaveForm.get('ipAddChargesBill') as FormArray;
  }
 
  getPrevCompanyBillList(Obj) { 
    var param = { 
  "first": 0,
  "rows": 100,
  "sortField": "ServiceId",
  "sortOrder": 0,
  "filters": [
    {"fieldName": "BillNo","fieldValue":  String(Obj.billNo),"opType": "Equals"}],
  "exportType": "JSON",
  "columns": [{ "data": "string","name": "string"}] 
    } 
    console.log(param)
    this._OPListService.getCompanyBillList(param).subscribe(response => {
     console.log(response)
      this.dsChargeList.data = response.data as ChargesList[]
      console.log(this.dsChargeList.data)
      if(this.dsChargeList.data.length){ 
         this.chargeList= this.dsChargeList.data
            this.calculateTotalAmount();
      }
    })
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
    let totalSum = this.chargeList.reduce((sum, charge) => sum + (+charge.totalAmt), 0);
    let DiscPerSum = this.chargeList.reduce((sum, charge) => sum + (+charge.concessionPercentage), 0);
    let totalDiscount = this.chargeList.reduce((sum, charge) => sum + (+charge.concessionAmount), 0);
    let totalNet = totalSum - totalDiscount;

    this.OPFooterForm.patchValue({
      totalAmt: totalSum,
      concessionAmt: Math.round(totalDiscount),
      totalDiscountPer: DiscPerSum,
      netPayableAmt: Math.round(totalNet),
    }, { emitEvent: false });

    const Exclusionlist = this.chargeList.filter(i => i.isInclusionExclusion === true)
    const Inclusionlist = this.chargeList.filter(i => i.isInclusionExclusion !== true)
    this.ExclusionAmt = Exclusionlist.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0);
    this.InclusionAmt = Inclusionlist.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0);
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
        this.OnSave(); // Call your save function
      }
    });
  }
  OnSave() {
    debugger 
    const [ThermalPrint, ThermalPrintValue] = this._ConfigService.configParams.ThermalPrint.split(":");
    const formValue = this.OPFooterForm.value
    this.OpBillEditSaveForm.get('billUpdates').patchValue({
      billNo:this.patientDetail?.billNo || 0,
      totalAmt: formValue?.totalAmt || 0,
      concessionAmt: formValue?.concessionAmt || 0,
      netPayableAmt: formValue?.netPayableAmt || 0,
      companyAmt: this.ExclusionAmt || 0,
      patientAmt: this.InclusionAmt || 0,
      balanceAmt: formValue?.netPayableAmt || 0,
      concessionReasonId: this.ConcessionId || 0,
      discComments: formValue?.remark || '',
    })
    console.log("form values", this.OpBillEditSaveForm.value)
    if (this.OpBillEditSaveForm.valid) {
      this.IPaddchargeArray.clear(); 
      this.dsChargeList.data.forEach(item => {
      const formObj = this.CreateAddchargeform(item as ChargesList);  
       formObj.patchValue({ opdIpdId: formValue?.IsPurchaseWsie || false});  
        this.IPaddchargeArray.push(formObj);   
      }); 
      console.log("form values", this.OpBillEditSaveForm.value)
      this._OPListService.UpdateCompanyBilling(this.OpBillEditSaveForm.value).subscribe(response => {
        this._matDialog.closeAll();
        this.savebtn = true
        if (response)
          this.resetform();
        if (ThermalPrint != 1) {
          this.viewgetOPBillReportPdf(response)
        } else {
          this.viewgetOPBillThermalReportPdf(response)
        }
      });
    } 
    else {
      let invalidFields = [];
      if (this.OpBillEditSaveForm.invalid) {
        for (const controlName in this.OpBillEditSaveForm.controls) {
          const control = this.OpBillEditSaveForm.get(controlName);

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
    this.OPFooterForm.reset({
      totalAmt: 0,
      totalDiscountPer: 0,
      concessionAmt: 0,
      netPayableAmt: 0,
      concessionReasonId: 0,
    }); 
  } 
      viewgetOPBillReportPdf(element) {
        this.commonService.Onprint("BillNo", element, "OpBillReceipt");
    }
    viewgetOPBillThermalReportPdf(element) {
        this.commonService.Onprint("BillNo", element, "OpBillReceiptT");
    }
  onPriceOrQtyChange(row: ChargesList = null): void {
    if (!row) return;

    row.price = Math.abs(row.price);
    row.qty = Math.abs(row.qty);

    const totalAmount = row.price * row.qty;

    // If discount percentage exists, recalculate discount amount
    if (row.concessionPercentage) {
      row.concessionAmount = parseFloat(((totalAmount * row.concessionPercentage) / 100).toFixed(2));
    }
    row.totalAmt = totalAmount;
    row.netAmount = totalAmount - row.concessionAmount;

    this.calculateTotalAmount();
  }
  selectChangeConcession(event) {
    this.ConcessionId = event.value
    this.ConcessionReason = event.text
  }
  onDiscountPerChange(row: ChargesList): void {
    if (!row) return;
    let discountPer = +row.concessionPercentage || 0;
    const totalAmount = (+row.price || 0) * (+row.qty || 0);

    if (discountPer < 0 || discountPer > 100) {
      discountPer = 0; // Reset if out of range
      row.concessionPercentage = 0;
      this.toastrService.error("Enter discount % between 0-100");
    }

    this.Consessionres = true
    if (discountPer == 0) {
      this.Consessionres = false
      this.OPFooterForm.get("concessionReasonId").setValue(0)
    }

    row.concessionAmount = parseFloat(((totalAmount * discountPer) / 100).toFixed(2));
    row.totalAmt = totalAmount;
    row.netAmount = totalAmount - row.concessionAmount;

    this.calculateTotalAmount();
  }
  onDiscountAmtChange(row: ChargesList): void {
    if (!row) return;
    let discountAmt = +row.concessionAmount || 0;
    const totalAmount = (+row.price || 0) * (+row.qty || 0);

    if (discountAmt < 0 || discountAmt > totalAmount) {
      row.concessionAmount = 0;
      discountAmt = 0;
      this.toastrService.error("Discount must be between 0 and the total amount.");
    }

    this.Consessionres = true
    if (discountAmt == 0) {
      this.Consessionres = false
      this.OPFooterForm.get("concessionReasonId").setValue(0)
    }
    row.concessionPercentage = totalAmount ? parseFloat(((discountAmt / totalAmount) * 100).toFixed(2)) : 0;
    row.totalAmt = totalAmount;
    row.netAmount = totalAmount - discountAmt;

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
      remark: [
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
  qty: any;
  isInclusionExclusion: any;
  serviceCode: any;
  totalAmt: number;
  DiscPer: number;
  DiscAmt: number;
  netAmount: number;
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
  concessionPercentage: any = 0;
  concessionAmount:any;
  userName: any;
  constructor(ChargesList) {
    this.ChargesId = ChargesList.ChargesId || '';
    this.ServiceId = ChargesList.ServiceId || '';
    this.serviceId = ChargesList.serviceId || '';
    this.ServiceName = ChargesList.ServiceName || '';
    this.price = ChargesList.price || '';
    this.qty = ChargesList.qty || '';
    this.totalAmt = ChargesList.totalAmt || '';
    this.DiscPer = ChargesList.DiscPer || '';
    this.DiscAmt = ChargesList.DiscAmt || '';
    this.netAmount = ChargesList.netAmount || '';
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
    this.concessionAmount = ChargesList.concessionAmount || 0;
    this.PackageServiceId = ChargesList.PackageServiceId || 0;
    this.IsPackage = ChargesList.IsPackage || 0;
    this.PacakgeServiceName = ChargesList.PacakgeServiceName || '';
    this.OpdIpdId = ChargesList.OpdIpdId || '';
    this.serviceName = ChargesList.serviceName || ''
    this.concessionPercentage = ChargesList.concessionPercentage || 0;
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