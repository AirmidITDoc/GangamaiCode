import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormGroupName, Validators } from '@angular/forms';
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
import { element } from 'protractor';
import { forEach } from 'lodash';


@Component({
  selector: 'app-reviewcompany-bill',
  templateUrl: './reviewcompany-bill.component.html',
  styleUrls: ['./reviewcompany-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ReviewcompanyBillComponent {
  OpBillEditSaveForm: FormGroup;
  OPFooterForm: FormGroup;
  CompanyUpdateForm: FormGroup;
  Doceditform: FormGroup;
  chargeForm!: FormGroup;
  isWaiting = false;
  autocompleteModedeptdoc: string = "ConDoctor";
  screenFromString = 'Pharmacy-form';
  patientDetail: any = new RegInsert({});
  public chargeList: ChargesList[] = [];
  public packageList: ChargesList[] = [];
  public dsChargeList = new MatTableDataSource<ChargesList>();
  public dsPackageList = new MatTableDataSource<ChargesList>();
  public dsbillList = new MatTableDataSource<ChargesList>();
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
  Lable: any = '';
  Doctorname: any;
  CompanyName: any;
  DepartmentName: any;
  autocompleteModeConcession: string = "Concession";
  autocompleteModecompany: string = "Company";
  autocompleteModeGroup: string = "GroupName";
  vPrice = '0';
  vQty: any;
  currency: any = '';
  OPDIPDID: any = 0;
  opD_IPD_Type: any = 1;
  BillNo: any;
  ReturnList: any = [];
  IsBillreview = false
  doctorName: any
  public isDiscountApplied = false;
  Consessionres: boolean = false;
  IsPathology: any;
  IsRadiology: any;
  vIsPackage: any;
  serviceSelct = false
  public isDoctor = false;
  chkIsEditable: boolean = true;

  SrvcName1: any = ""
  serviceId: any;
  ApiURL: any = '';
  countdown: number = 180; // 3 minutes
  countdownColorClass = 'green';
  public isUpdating = false;
  public subscription: Array<Subscription> = [];

  public displayedChargeColumns: string[] =
    ['Status', 'ServiceCode', 'ServiceName', 'Price', 'Qty', 'TotalAmount', 'DiscountPer', 'DiscountAmount', 'NetAmount', 'DoctorName',
      //  'ClassName', 'ChargesAddedName',  
      'Exclucion', 'Approved',
      'buttons'
    ];
  public displayedColumnspackage: string[] =
    ['IsCheck', 'ServiceNamePackage', 'ServiceName', 'Price', 'Qty', 'TotalAmt', 'DoctorName', 'DiscAmt', 'NetAmount'];
  public displayedbillColumns: string[] = ['Label', 'BillNo', 'NetAmount', 'BalanceAmt'];

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
    //  private _loggedService: AuthenticationService,
    public _ConfigService: ConfigService,
    public dialogRef: MatDialogRef<ReviewcompanyBillComponent>
  ) { this.OpBillEditSaveForm = this.createTotalChargeForm(); };

  ngOnInit() {
    console.log(this.accountService.currentUserValue.user.isBillReview)
    this.IsBillreview = this.accountService.currentUserValue.user.isBillReview

    this.OPFooterForm = this.CreateOPFooter();
    this.OPFooterForm.markAllAsTouched();
    this.salesUpdateForm = this.CreateSalesUpdateForm();
    this.CompanyForm = this.CreateCompanyForm()
    this.CompanyUpdateForm = this.CreateCompanyUpdateForm();
    this.chargeForm = this.createChargeForm();

    this.createDocForm()
    if (this.data) {

      console.log(this.data)
      debugger
      this.patientDetail = this.data?.Obj;
      this.ApiURL = "VisitDetail/search-GetServiceListwithTraiff?TariffId=" + 1 + "&ClassId=" + 1 + "&SrvcName="

      this.OPDIPDID = this.data?.Obj?.opdipdid || 0
      this.opD_IPD_Type = this.data?.OPIPType || 0
      this.Lable = 'Bill'
      this.BillNo = this.patientDetail?.billNo

       this.getBilllist();
      this.getPrevCompanyBillList(this.patientDetail?.billNo, 'Bill')
     
    }

   // this.setupFormListener();
    // this.startCountdown();

    //this is for curreny symbol
    const [CurrencyId, CurrencyValue] = this._ConfigService.configParams.CurrencyValue.split(":");
    this.currency = CurrencyValue

  }

  private setupFormListener(): void {
    this.handleChange('price', () => this.calculateTotalCharge());
    this.handleChange('qty', () => this.calculateTotalCharge());
    this.handleChange('discountPer', () => this.updateDiscountAmount());
    this.handleChange('discountAmount', () => this.updateDiscountPercentage());
    // this.handleChange('totalDiscountPer', () => this.updateTotalDiscountAmt(), this.OPFooterForm);
    // this.handleChange('concessionAmt', () => this.updateTotalDiscountPer(), this.OPFooterForm);
  }

  handleChange(key: string, callback: () => void, form: FormGroup = this.chargeForm) {
    this.subscription.push(form.get(key).valueChanges.subscribe(value => {
      callback();
    }));
  }

  startCountdown() {
    const interval = setInterval(() => {
      this.countdown--;
      // Update color dynamically
      if (this.countdown > 120) {
        this.countdownColorClass = 'green';
      } else if (this.countdown > 60) {
        this.countdownColorClass = 'orange';
      } else {
        this.countdownColorClass = 'red';
      }
      if (this.countdown <= 0) {
        clearInterval(interval);
        this.isWaiting = false;
      }

    }, 1000);
  }
  CreateOPFooter() {
    return this.formBuilder.group({
      remark: [''],
      totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      totalDiscountPer: [0, [Validators.min(0), Validators.max(100), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionAmt: [0, [Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionReasonId: [0, this._FormvalidationserviceService.onlyNumberValidator()],
      netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
    })
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
      DoctorID: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      GroupId: [0],
      serviceDate: [new Date().toISOString()]
    });
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  createTotalChargeForm(): FormGroup {
    return this.formBuilder.group({
      // ✅ Fixed: should be FormArray
      ipAddChargesBill: this.formBuilder.array([]),

      //bill header  
      billUpdates: this.formBuilder.group({
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
        concessionReasonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        discComments: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        modifiedBy: [this.accountService.currentUserValue.userId],
      })
    });
  }



  CreateAddchargeform(item: any): FormGroup {
    console.log(item)
    return this.formBuilder.group({
      chargesDate: [item?.chargesDate || this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
      billNo: [item?.billNo || this.BillNo, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      price: [item?.price, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      qty: [item?.qty, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      totalAmt: [item?.totalAmt, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionPercentage: [item?.concessionPercentage || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionAmount: [item?.concessionAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      netAmount: [item?.netAmount, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      addedBy: [this.accountService.currentUserValue.userId],
      chargesTime: this.datePipe.transform(new Date(), 'shortTime'),
      isInclusionExclusion: [item?.isInclusionExclusion || false,],
      chargesId: [item?.chargesId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isApprovedByCamp: [item?.isApprovedByCamp || false,],
      doctorId: [item?.doctorId || 0,],
      doctorName: [item?.doctorName || '',],
      serviceId: [item?.serviceId || 0],
      serviceName: [item?.serviceName || ''],
      opdIpdId: [this.OPDIPDID],
      opdIpdType: [this.opD_IPD_Type],
      unitId: [this.accountService.currentUserValue.user.unitId || 1],

    });
  }
  // Getters 
  get IPaddchargeArray(): FormArray {
    return this.OpBillEditSaveForm.get('ipAddChargesBill') as FormArray;
  }
  salesUpdateForm: FormGroup
  CreateSalesUpdateForm() {
    return this.formBuilder.group({
      salesHeader: this.formBuilder.group({
        salesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        totalAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        vatAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        discAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        netAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        balanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        storeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]]
      }),
      salesDetails: this.formBuilder.array([]),
      currentStockUpdate: this.formBuilder.array([]),
    })
  }
  // Getters 
  get SalesUpDetArray(): FormArray {
    return this.salesUpdateForm.get('salesDetails') as FormArray;
  }
  get SalesCurrentstkArray(): FormArray {
    return this.salesUpdateForm.get('currentStockUpdate') as FormArray;
  }
  CreateSalesdetform(item: any): FormGroup {
    return this.formBuilder.group({
      salesId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      salesDetId: [item?.chargesId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      itemId: [item?.serviceId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      qty: [item?.qty, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      unitMrp: [item?.price, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      totalAmount: [item?.totalAmt || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
    });
  }
  CreateSalesCurrentstkform(item: any): FormGroup {
    return this.formBuilder.group({
      itemId: [item?.serviceId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      issueQty: [item?.reutrnQty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      storeId: [item?.storeId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(),]],
      istkId: [item?.stockId || 0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }
  CompanyForm: FormGroup;
  CreateCompanyForm() {
    return this.formBuilder.group({
      govtCompanyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      govtApprovedAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      companyApprovedId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      companyApprovedAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      referenceNo: [''],
      referenceNo_1: ['']
    })
  }
  CreateCompanyUpdateForm() {
    return this.formBuilder.group({
      billGovtUpdates: this.formBuilder.group({
        govtCompanyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        govtApprovedAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        companyApprovedId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        companyApprovedAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        billNo: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        govtRefNo: [''],
        compRefNo: ['']
      }),
    })
  }
  CompanyAmtSave() {
    debugger
    const formValue = this.CompanyForm.value
    if (!((formValue?.govtCompanyId && formValue?.govtApprovedAmt && formValue?.referenceNo) || (formValue?.companyApprovedId && formValue?.companyApprovedAmt && formValue?.referenceNo_1))) {
      this.toastr.warning('Select Company & Enter Amount', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return
    }
    if (!(this.BillNo || 0)) {
      this.toastr.warning('Please check Bill No is Invalid', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return
    }
    this.CompanyUpdateForm.get('billGovtUpdates').patchValue({
      billNo: this.BillNo || 0,
      govtCompanyId: formValue?.govtCompanyId || 0,
      govtApprovedAmt: formValue?.govtApprovedAmt || 0,
      companyApprovedId: formValue?.companyApprovedId || 0,
      companyApprovedAmt: formValue?.companyApprovedAmt || 0,
      govtRefNo: String(formValue?.referenceNo) || '',
      compRefNo: String(formValue?.referenceNo_1) || '',
    })
    this._OPListService.UpdateGovernAmt(this.CompanyUpdateForm.value).subscribe(response => {
      this._matDialog.closeAll();
      this.savebtn = true
      this.resetform();
    })

  }

  createDocForm() {
    this.Doceditform = this.formBuilder.group({
      EditDoctor: [''],

    });
  }

  BillDetailsObj: any;
  getBillDetlist(element) {
    this.BillDetailsObj = element
    this.Lable = element.Lbl || '';
    this.BillNo = element.BillNo
    this.getPrevCompanyBillList(element.BillNo, element.Lbl)
  }
  getPrevCompanyBillList(billNo, Label) {
    debugger
    var param = {
      "first": 0,
      "rows": 999,
      "sortField": "ServiceId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "BillNo", "fieldValue": String(billNo), "opType": "Equals" },
        { "fieldName": "Label", "fieldValue": String(Label), "opType": "Equals" },
        { "fieldName": "OPIPType", "fieldValue": String(this.opD_IPD_Type), "opType": "Equals" },

      ],
      "exportType": "JSON",
      "columns": [{ "data": "string", "name": "string" }]
    }
    console.log(param)
    if (Label == 'Bill') {
      this._OPListService.getCompanyBillList(param).subscribe(response => {
        this.dsChargeList.data = response.data as ChargesList[]
        console.log(response.data)
        this.chargeList = this.dsChargeList.data
        this.calculateTotalAmount();
      })
    } else {
      this._OPListService.getSalesBillDetList(param).subscribe(response => {
        this.dsChargeList.data = response.data as ChargesList[]
        this.chargeList = this.dsChargeList.data
        this.calculateTotalAmount();
        this.dsChargeList.data.forEach(row => {
          row.originalQty = row.qty;     // max allowed
          row.previousQty = row.qty;
          row.reutrnQty = row.qty;
        });
      })
    }
  }
  FinalBillBalAmt: any = 0;
  CompanyApprovedAmt: any = 0;
  AdjustmentAmt: any = 0;
  getBilllist() {
    debugger
    //ps_rtrv_BillList
    if (this.OPDIPDID == '' || this.OPDIPDID == null || this.OPDIPDID == undefined || this.OPDIPDID == 0) {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return
    }
    const Filters = [
      { "fieldName": "OPIPId", "fieldValue": String(this.OPDIPDID), "opType": "Equals" },
      { "fieldName": "OPIPType", "fieldValue": String(this.opD_IPD_Type), "opType": "Equals" },
    ]
    var param = {
      "searchFields": Filters,
      "mode": "BillList"
    }
    this._OPListService.getAllBillList(param).subscribe(response => {
      console.log('response', response)
      this.dsbillList.data = response
      if (this.dsbillList.data.length) {
        this.FinalBillBalAmt = (this.dsbillList.data.reduce((sum, { BalanceAmt }) => sum += +(BalanceAmt || 0), 0)).toFixed(2);
        this.CompanyApprovedAmt = this.dsbillList.data[0]?.ApprovedAmount || 0
        if (this.FinalBillBalAmt > this.CompanyApprovedAmt) {
          this.AdjustmentAmt = ((this.FinalBillBalAmt || 0) - (this.CompanyApprovedAmt || 0)).toFixed(2);
        } else {
          this.AdjustmentAmt = 0;
        }
        const GovApprovedamt = this.dsbillList.data.map(x => x.GovtApprovedAmt).find(x => typeof x === 'number' && x > 0);
        const GovtRefNo = this.dsbillList.data.map(x => x.GovtRefNo).find(x => typeof x === 'string' && x.trim() !== '');
        const GovtCompanyId = this.dsbillList.data.map(x => x.GovtCompanyId).find(x => typeof x === 'number' && x > 0);
        const ComApprovedamt = this.dsbillList.data.map(x => x.CompanyApprovedAmt).find(x => typeof x === 'number' && x > 0);
        const CompanyRefNo = this.dsbillList.data.map(x => x.CompRefNo).find(x => typeof x === 'string' && x.trim() !== '');
        const CompanyamtID = this.dsbillList.data.map(x => x.CompanyApprovedId).find(x => typeof x === 'number' && x > 0);

        this.CompanyForm.patchValue({
          govtCompanyId: GovtCompanyId || 0,
          govtApprovedAmt: GovApprovedamt || 0,
          referenceNo: GovtRefNo || '',
          companyApprovedId: CompanyamtID || 0,
          companyApprovedAmt: ComApprovedamt || 0,
          referenceNo_1: CompanyRefNo || ''
        });
      }
    })
  }


  calculateTotalAmount(): void {
    let totalSum = this.chargeList.reduce((sum, charge) => sum + (+charge.totalAmt), 0);
    let DiscPerSum = this.chargeList.reduce((sum, charge) => sum + (+charge.concessionPercentage), 0);
    let totalDiscount = this.chargeList.reduce((sum, charge) => sum + (+charge.concessionAmount), 0);
    let totalNet = totalSum - totalDiscount;



    this.OPFooterForm.patchValue({
      totalAmt: totalSum.toFixed(2),
      concessionAmt: Number(totalDiscount.toFixed(2)),
      totalDiscountPer: DiscPerSum.toFixed(2),
      netPayableAmt: Number(Math.round(totalNet).toFixed(2)),


    }, { emitEvent: false });

    debugger
    if (this.OPFooterForm.get('concessionAmt').value > 0) {
      this.Consessionres = true
    } else {
      this.Consessionres = false
    }


    const Exclusionlist = this.chargeList.filter(i => i.isInclusionExclusion === true)
    const Inclusionlist = this.chargeList.filter(i => i.isInclusionExclusion !== true)
    this.ExclusionAmt = Exclusionlist.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0).toFixed(2);
    this.InclusionAmt = Inclusionlist.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0).toFixed(2);
  }
  BillSave() {

    if (!this.dsChargeList.data.length) {
      this.toastr.warning('Please check list is empty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
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
        if (this.Lable == 'Pharmacy') {
          this.OnSaveSalesupdate();
        } else {
          this.OnSave(); // Call your save function
        }
      }
    });
  }
  OnSave() {
    debugger
    const [ThermalPrint, ThermalPrintValue] = this._ConfigService.configParams.ThermalPrint.split(":");
    const formValue = this.OPFooterForm.value
    this.OpBillEditSaveForm.get('billUpdates').patchValue({
      billNo: this.BillNo || 0,
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
        console.log(item)
        debugger
        const formObj = this.CreateAddchargeform(item as ChargesList);
        // formObj.patchValue({ opdIpdId: formValue?.IsPurchaseWsie || false });
        formObj.patchValue({ doctorId: item.doctorId || 0 });
        formObj.patchValue({ doctorName: item.doctorName || '' });
        formObj.patchValue({ chargesDate: this.datePipe.transform(item?.chargesDate, 'yyyy-MM-dd')
          // this.datePipe.transform(this.chargeForm.get('serviceDate').value, 'yyyy-MM-dd') 
        });

        this.IPaddchargeArray.push(formObj);
      });
      console.log("form values", this.OpBillEditSaveForm.value)
      this._OPListService.UpdateCompanyBilling(this.OpBillEditSaveForm.value).subscribe(response => {
        this._matDialog.closeAll();
        this.savebtn = true
        this.resetform();
      });

//       {
//     "serviceId": 2195,
//     "serviceName": "Clinical Officer Consultation ",
//     "price": 3000,
//     "qty": 1,
//     "totalAmt": 3000,
//     "concessionPercentage": 0,
//     "concessionAmount": 0,
//     "netAmount": 3000,
//     "doctorId": 3,
//     "doctorName": "Alice  Moraa",
//     "isPathology": 0,
//     "isRadiology": 0,
//     "isPackage": 0,
//     "billNo": 11509,
//     "isInclusionExclusion": false,
//     "chargesId": 14958,
//     "chargesDate": "2026-01-21T00:00:00",
//     "chargesTime": "2026-01-21T14:40:00",
//     "stockId": 0,
//     "storeId": 0
// }
    }
    else {
      let invalidFields = [];
      if (this.OpBillEditSaveForm.invalid) {
        for (const controlName in this.OpBillEditSaveForm.controls) {
          const control = this.OpBillEditSaveForm.get(controlName);

          if (control instanceof FormGroup || control instanceof FormArray) {
            for (const nestedKey in control.controls) {
              if (control.get(nestedKey)?.invalid) {
                invalidFields.push(`Bill Data : ${controlName}.${nestedKey}`);
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
  OnSaveSalesupdate() {
    debugger
    const formValue = this.OPFooterForm.value
    this.salesUpdateForm.get('salesHeader').patchValue({
      salesId: this.BillDetailsObj?.BillNo || 0,
      totalAmount: formValue?.totalAmt || 0,
      vatAmount: 0,
      discAmount: formValue?.concessionAmt || 0,
      netAmount: formValue?.netPayableAmt || 0,
      balanceAmount: formValue?.netPayableAmt || 0
    })
    let storeId = 0;
    this.SalesUpDetArray.clear();
    this.SalesCurrentstkArray.clear();
    if (this.salesUpdateForm.valid) {
      this.SalesUpDetArray.clear();
      this.dsChargeList.data.forEach(item => {
        const formObj = this.CreateSalesdetform(item as ChargesList);
        formObj.patchValue({ salesId: this.BillDetailsObj?.BillNo || 0 });
        storeId = item?.storeId || 0
        this.SalesUpDetArray.push(formObj);
      });

      this.SalesCurrentstkArray.clear();
      this.dsChargeList.data.forEach(item => {
        this.SalesCurrentstkArray.push(this.CreateSalesCurrentstkform(item as ChargesList))
      })

      this.salesUpdateForm.get('salesHeader.storeId').setValue(storeId)
      console.log("form values", this.salesUpdateForm.value)
      if (this.opD_IPD_Type == 0) {
        this._OPListService.UpdateSalesBilling(this.salesUpdateForm.get('salesHeader.salesId')?.value, this.salesUpdateForm.value).subscribe(response => {
        });
      } else {
        this._OPListService.UpdateSalesInPatient(this.salesUpdateForm.get('salesHeader.salesId')?.value, this.salesUpdateForm.value).subscribe(response => {
        });
      }
      this._matDialog.closeAll();
      this.savebtn = true
      this.resetform();
    }
    else {
      let invalidFields = [];
      if (this.salesUpdateForm.invalid) {
        for (const controlName in this.salesUpdateForm.controls) {
          const control = this.salesUpdateForm.get(controlName);

          if (control instanceof FormGroup || control instanceof FormArray) {
            for (const nestedKey in control.controls) {
              if (control.get(nestedKey)?.invalid) {
                invalidFields.push(`Sales Bill Data : ${controlName}.${nestedKey}`);
              }
            }
          } else if (control?.invalid) {
            invalidFields.push(`Sales Bill From: ${controlName}`);
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
  deletecharges(contact) {
    debugger
    if (contact?.isCompleted === true) {
      this.toastr.warning(
        'The lab test has already been completed. This service cannot be deleted.',
        'Warning!',
        { toastClass: 'tostr-tost custom-toast-warning' }
      );
    }

    Swal.fire({
      title: 'Do you want to cancel the Service ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!"

    }).then((flag) => {
      if (flag.isConfirmed) {
        let Chargescancle = {};
        Chargescancle['chargesId'] = contact.chargesId;
        Chargescancle['isCancelledBy'] = this.accountService.currentUserValue.userId;

        let submitData = {
          "deleteCharges": Chargescancle
        };
        console.log(submitData);
        this._OPListService.AddchargesDelete(submitData).subscribe(response => {
          this.getPrevCompanyBillList(this.BillNo, this.Lable);
          this.calculateTotalAmount();

          setTimeout(() => {
            this.OnSave();
          }, 2500);
        });
      }
    });

  }
  resetform() {
    this.chargeList = [];
    this.dsChargeList.data = []
    this.patientDetail = [];
    this.BillNo = 0;
    this.Lable = '';
    this.OPFooterForm.reset({
      totalAmt: 0,
      totalDiscountPer: 0,
      concessionAmt: 0,
      netPayableAmt: 0,
      concessionReasonId: 0
    });
  }
  viewgetOPBillReportPdf(element) {
    this.commonService.Onprint("BillNo", element, "OpBillReceipt");
  }
  viewgetOPBillThermalReportPdf(element) {
    this.commonService.Onprint("BillNo", element, "OpBillReceiptT");
  }
  onPriceOrQtyChange(event: any, row: ChargesList = null): void {
    debugger
    if (!row) return;

    if (row.qty && this.Lable == 'Pharmacy') {
      if (row.qty > row.originalQty) {
        this.toastr.warning(`Qty should not be greater than current ${row.originalQty} Qty`, 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        // reset to previous/original qty
        setTimeout(() => {
          row.qty = row.previousQty;
        });
        return;
      }
    }
    if (row.qty < row.originalQty) {
      row.reutrnQty = row.previousQty - row.qty;
    } else {
      row.reutrnQty = 0;
    }

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
      govtCompanyId: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      govtApprovedAmt: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      companyApprovedId: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      companyApprovedAmt: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      referenceNo: [
        {
          name: "required", Message: "required."
        }
      ],
      referenceNo_1: [
        {
          name: "required", Message: "required."
        }
      ],
      DoctorId: [
        {
          name: "required", Message: "required."
        }
      ],
    }
  }

  //doc
  EditDoctor: boolean = false;
  DocenableEditing(row: ChargesList) {
    // if (row.CreditedtoDoctor == 1) {
    //     this.toastr.warning('Doctor option unavailable for the selected service!', 'warning', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return
    // }
    row.EditDoctor = true;
    row.doctorName = '';
  }
  DoctorisableEditing(row: ChargesList) {
    debugger
    row.EditDoctor = false;
    this.Doceditform.get('EditDoctor').setValue('')
  }
  SelectedDocName: any = [];
  DropDownValue(Obj, contact) {

    console.log(Obj)
    if (Obj.value) {
      contact.doctorId = Obj.value || 0
      contact.doctorName = Obj.text || 0
      contact.EditDoctor = false
    }
  }
  validateGovtAmount() {
    debugger
    const govtAmt = Number(this.CompanyForm.get('govtApprovedAmt')?.value || 0);
    const CompanyAmt = Number(this.CompanyForm.get('companyApprovedAmt')?.value || 0);

    if (govtAmt) {
      if (govtAmt > this.FinalBillBalAmt) {
        this.toastr.warning('Approval Amt cannot be greater than Balance amount');
        // Optional: reset value
        this.CompanyForm.get('govtApprovedAmt')?.setValue(this.FinalBillBalAmt);
      }
    }
    if (CompanyAmt) {
      if (CompanyAmt > this.FinalBillBalAmt) {
        this.toastr.warning('Approval Amt cannot be greater than Balance amount');
        // Optional: reset value
        this.CompanyForm.get('companyApprovedAmt')?.setValue(this.FinalBillBalAmt);
      }
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
  onAddCharges(): void {

    const isItemAlreadyAdded = this.dsChargeList.data.some((element) => element.ServiceId === this.chargeForm.get('serviceName')?.value.serviceId);
    if (isItemAlreadyAdded) {
      Swal.fire({
        title: 'Message',
        text: "Selected Service already available in the list",
        icon: "warning"
      });
      return;
    }
    const serviceNameValue = this.chargeForm.get('serviceName')?.value;
    if (serviceNameValue?.serviceId == 0 || this.serviceSelct == false || serviceNameValue?.serviceId == '' || serviceNameValue?.serviceId == null || serviceNameValue?.serviceId == undefined) {
      this.toastrService.warning('Please select a valid service name.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.chargeForm.get('DoctorID').value == "0") {
      this.toastrService.warning('Please select a valid doctor name.', 'Warning !', {
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
          serviceId: formValue.serviceName.serviceId,
          serviceName: formValue.serviceName.serviceName,
          price: formValue.price,
          qty: formValue.qty,
          totalAmt: totalAmount,
          discPer: formValue.discountPer || 0,
          discAmt: discountAmount || 0,
          netAmount: netAmount,
          doctorName: this.doctorName || '-',
          className: this.className || '-',
          doctorId: formValue.DoctorID,
          chargesAddedName: this.accountService.currentUserValue.userName,
          isPathology: this.IsPathology,
          isRadiology: this.IsRadiology,
          isPackage: this.vIsPackage,
          serviceCode: formValue.serviceName.companyCode,
          isInclusionExclusion: formValue.serviceName.isInclusionOrExclusion
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
  getdocdetail(event) {
    this.doctorName = event.text
  }
  getSelectedserviceObj(obj) {

    console.log(obj)
    this.SrvcName1 = obj.serviceName;
    this.serviceId = obj.serviceId;
    this.vQty = 1;
    this.IsPathology = obj.isPathology;
    this.IsRadiology = obj.isRadiology;
    this.vIsPackage = obj.isPackage;
    this.chargeForm.patchValue({
      price: obj.price,
      netAmount: obj.price * this.vQty
    })
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
    if (obj?.isEditable == true) {
      this.chkIsEditable = false;
    } else {
      this.chkIsEditable = true;
    }
    this.serviceSelct = true
    // }
    // this.getRtevPackageDetList(obj)
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
  resetForm(): void {
    this.chargeForm.reset({
      serviceName: '',
      price: 0,
      qty: 0,
      totalAmount: 0,
      discountPer: 0,
      discountAmount: 0,
      netAmount: 0,
      DoctorID: 0,
      DoctorName: '',
      serviceDate: new Date()
    });
    this.doctorName = '';
  }

}

export class ChargesList {
  ChargesId: number;
  ServiceId: number;
  serviceId: number;
  ServiceName: String;
  qty: any;
  storeId: any = 0;
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
  BalanceAmt: any;
  doctorName: any;
  doctorId: any;
  isPathology: any;
  isRadiology: any;
  pacakgeServiceName: any;
  packageServiceId: any;
  price: any;
  packageId: any;
  concessionPercentage: any = 0;
  concessionAmount: any;
  userName: any;
  DateApproved: any;
  ApprovedAmount: any;
  originalQty: any;
  previousQty: any;
  reutrnQty: any;
  GovtCompanyId: any;
  GovApprovedamt: any;
  GovtRefNo: any;
  CompanyApprovedId: any;
  CompanyApprovedAmt: any;
  CompRefNo: any;
  GovtApprovedAmt: any;
  EditDoctor: any
  chargesDate:Date;

  constructor(ChargesList) {
    this.ChargesId = ChargesList.ChargesId || 0;
    this.ServiceId = ChargesList.ServiceId || '';
    this.chargesDate = ChargesList.chargesDate || '';
    this.serviceId = ChargesList.serviceId || '';
    this.ServiceName = ChargesList.ServiceName || '';
    this.price = ChargesList.price || '';
    this.qty = ChargesList.qty || '';
    this.totalAmt = ChargesList.totalAmt || '';
    this.DiscPer = ChargesList.DiscPer || '';
    this.DiscAmt = ChargesList.DiscAmt || '';
    this.netAmount = ChargesList.netAmount || '';
    this.DoctorId = ChargesList.DoctorId || 0;
    this.storeId = ChargesList.storeId || 0;
    this.DateApproved = ChargesList.DateApproved || '';
    this.ApprovedAmount = ChargesList.ApprovedAmount || 0;
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
    this.originalQty = ChargesList.originalQty || 0;
    this.packageId = ChargesList.packageId || '';
    this.doctorName = ChargesList.doctorName || 0;
    this.doctorId = ChargesList.doctorId || 0;
    this.serviceCode = ChargesList.serviceCode || 0;
    this.isInclusionExclusion = ChargesList.isInclusionExclusion || '';
    this.isPathology = ChargesList.isPathology || 0;
    this.BalanceAmt = ChargesList.BalanceAmt || 0;
    this.isRadiology = ChargesList.isRadiology || 0;
    this.userName = ChargesList.userName || '';
    this.previousQty = ChargesList.previousQty || 0;
    this.reutrnQty = ChargesList.reutrnQty || 0;
    this.GovApprovedamt = ChargesList.GovApprovedamt || 0;
    this.GovtCompanyId = ChargesList.GovtCompanyId || 0;
    this.GovtRefNo = ChargesList.GovtRefNo || '';
    this.CompanyApprovedId = ChargesList.CompanyApprovedId || 0;
    this.CompanyApprovedAmt = ChargesList.CompanyApprovedAmt || 0;
    this.CompRefNo = ChargesList.CompRefNo || '';
    this.GovtApprovedAmt = ChargesList.GovtApprovedAmt || 0;
    this.EditDoctor = ChargesList.EditDoctor || 0;

  }
}