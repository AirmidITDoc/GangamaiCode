import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-reviewcompany-bill',
  templateUrl: './reviewcompany-bill.component.html',
  styleUrls: ['./reviewcompany-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ReviewcompanyBillComponent {

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
  public isDiscountApplied = false;
  Consessionres: boolean = false;
  public displayedChargeColumns: string[] =
    ['Status', 'ServiceCode', 'ServiceName', 'Price', 'Qty', 'TotalAmount', 'DiscountPer', 'DiscountAmount', 'NetAmount', 'DoctorName', 'ClassName', 'ChargesAddedName', 'Exclucion', 'Action'];
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
    public dialogRef: MatDialogRef<ReviewcompanyBillComponent>
  ) { };

  ngOnInit() {
    this.OPFooterForm = this.CreateOPFooter();
    this.OPFooterForm.markAllAsTouched();
    if (this.data) {
      console.log(this.data)
      this.patientDetail = this.data;
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

  BillSave() { }

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