import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDetailObj, ChargesList } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { LabPatientList, LabRequest } from '../lab-patient-reg.component';
import { LabPatientRegService } from '../lab-patient-reg.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { ConfigService } from 'app/core/services/config.service';

@Component({
  selector: 'app-new-lab-patient-reg',
  templateUrl: './new-lab-patient-reg.component.html',
  styleUrls: ['./new-lab-patient-reg.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewLabPatientRegComponent {
  myForm: FormGroup
  searchFormGroup: FormGroup
  LabBillfinalform: FormGroup
  chargeForm: FormGroup
  OpBillForm: FormGroup
  OPFooterForm: FormGroup

  screenFromString = 'Common-Form';
  registerObj = new LabPatientList({});
  RegId = 0;
  CityName = ""
  vRegNo: any;
  vTariffId: any = 1;
  vClassId: any = 1;
  vRegId: any;
  isServiceIdSelected: boolean = false;
  isDoctor: boolean = false;

  autocompleteModepatienttype: string = "PatientType";
  autocompleteModegender: string = "Gender";
  autocompleteModecountry: string = "Country";
  autocompleteModeDepartment: string = "Department";
  autocompleteModerefdoc: string = "RefDoctor";
  dsLabRequest2 = new MatTableDataSource<LabRequest>();
  // dstable1 = new MatTableDataSource<LabRequest>();

  public dstable1 = new MatTableDataSource<ChargesList>();


  chargeslist: any = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dateTimeObj: any;
  minDate = new Date();
  selectedPatient: any;
  selectedMobile: any;

  vOPIPId = 0
  regNo = 0;
  PatientName: any;
  opdNo = "0";
  ageYear: any;
  ageMonth: any;
  ageDays: any;
  ageDay = 0;
  doctorId = 0;
  doctorname = '';
  companyId = 0;
  companyName = '';
  ExclusionAmt = '';
  InclusionAmt = '';
  ConcessionId = 0;
  ConcessionReason = '';
  departmentname = '';
  IsPathology: any;
  IsRadiology: any;
  vIsPackage: any;

  public chargeList: ChargesList[] = [];

  savebtn: boolean = true;

  displayedServiceColumns: string[] = [
    'ServiceName',
    'Action'
  ]

  displayedServiceselected: string[] = [
    'ServiceName',
    'Price',
    'buttons'
  ]

  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
  @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
  @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;

  constructor(public _labPatientRegService: LabPatientRegService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewLabPatientRegComponent>,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public _formbuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private accountService: AuthenticationService,
    public toastr: ToastrService, public _ConfigService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.myForm = this.CreateMyForm();
    this.myForm.markAllAsTouched();
    this.getServiceList();

    this.LabBillfinalform = this.createFinalFormView()
    //  this.chargeForm = this.createChargeForm();
    this.OpBillForm = this.createTotalChargeForm();
    this.OPFooterForm = this.CreateOPFooter();
  }

  createFinalFormView() {
    {
      return this._formbuilder.group({
        labPatientRegistration: '',
        opBillIngModels: ''
      })
    }
  }

  CreateMyForm() {
    return this._formbuilder.group({
      labPatientId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      regDate: [new Date()],
      regTime: [],
      unitId: this.accountService.currentUserValue.user.unitId,
      prefixId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      middleName: ['', [Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$"), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      lastName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$")]],
      genderId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      dateofBirth: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      ageYear: ['', [Validators.maxLength(3), Validators.pattern("^[0-9]*$")]],
      ageMonth: ['', [Validators.pattern("^[0-9]*$")]],
      ageDay: ['', [Validators.pattern("^[0-9]*$")]],
      address: ['', [Validators.maxLength(100), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      cityId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      stateId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      countryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      patientTypeId: [1],
      tariffId: [1], // need to ask sir what value to pass
      classId: [1],
      departmentId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      doctorId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      refDocId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      // extra fields
      mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      regId: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      IsPathRad: ['1'],
      ServiceId: [''],
      totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      totalDiscountPer: [0, [Validators.min(0), Validators.max(100), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      discountAmt: [0, [Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      paymentType: ['CashPay'],
      patientName: [''],
      createdBy: this.accountService.currentUserValue.userId
    })
  }

  //Footer Form
  CreateOPFooter() {
    return this._formbuilder.group({
      totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      totalDiscountPer: [0, [Validators.min(0), Validators.max(100), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionAmt: [0, [Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionReasonId: [0, this._FormvalidationserviceService.onlyNumberValidator()],
      netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      paymentType: ['CashPay'],
    })
  }
  createTotalChargeForm(): FormGroup {
    return this._formbuilder.group({
      //bill header  
      billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdipdid: [this.vOPIPId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      regNo: ["0", [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      patientName: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      ipdno: ["", [this._FormvalidationserviceService.allowEmptyStringValidator()]],
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
      opdipdType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
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
      cashCounterId: ["1", [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],//need to set cashCounterId
      createdBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      addCharges: this._formbuilder.array([]),

      // ✅ Fixed: should be FormArray
      billDetails: this._formbuilder.array([]),

      // ✅ Fixed: should be FormArray
      packcagecharges: this._formbuilder.array([]),

      //Payment form
      payments: this._formbuilder.group({
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
    debugger
    return this._formbuilder.group({
      chargesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      opdIpdType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdIpdId: [this.vOPIPId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceId: [item?.ServiceId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      price: [item?.Price, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      qty: [1, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      totalAmt: [item?.TotalAmt, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      concessionPercentage: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
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
      serviceCode: [item?.ServiceId || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
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
    return this._formbuilder.group({
      billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesId: [parseInt(item?.ServiceId), [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }
  get ChargeddetailsArray(): FormArray {
    return this.OpBillForm.get('addCharges') as FormArray;
  }
  get BillDetailsArray(): FormArray {
    return this.OpBillForm.get('billDetails') as FormArray;
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getSelectedObjextPatient(event: any): void {
    console.log("Patient Data:", event);

    if (event) {
      const fullName = event.patientName?.trim() || '';
      this.PatientName = event.patientName?.trim() || ''
    
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
        // this.myForm.get('patientName').setValue(firstName)
      const middleName = nameParts[1] || '';
      const lastName = nameParts[1] || '';
      this.myForm.patchValue({
        // firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        mobileNo: event.extMobileNo ?? '',
      });

      this.selectedPatient = event;
    }
    const extAddressNameElement = document.querySelector(`[name='middleName']`) as HTMLElement;
    if (extAddressNameElement) {
      extAddressNameElement.focus();
    }
  }

 

  getServiceList() {
    let ServiceName = this.myForm.get("ServiceId").value + "%" || "%";
    let IsPathRad = this.myForm.get("IsPathRad").value || "1"
    var param = {
      "first": 0,
      "rows": 10,
      "sortField": "ServiceId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "ServiceName",
          "fieldValue": ServiceName,
          "opType": "Equals"
        },
        {
          "fieldName": "TariffId",
          "fieldValue": String(this.vTariffId),
          "opType": "Equals"
        },
        {
          "fieldName": "IsPathRad",
          "fieldValue": String(IsPathRad),
          "opType": "Equals"
        },
        {
          "fieldName": "ClassId",
          "fieldValue": String(this.vClassId),
          "opType": "Equals"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }

    this._labPatientRegService.getserviceList(param).subscribe(Menu => {

      this.dsLabRequest2.data = Menu.data as LabRequest[];
      this.dsLabRequest2.sort = this.sort;
      this.dsLabRequest2.paginator = this.paginator;
      
    });

  }

  //   onSaveEntry(row) {
  //     let doctorid = 0;
  //     const formValue = this.myForm.value

  // debugger
  //     this.dstable1.data = [];
  //     if (this.chargeslist && this.chargeslist.length > 0) {
  //       debugger
  //       let duplicateItem = this.chargeslist.filter((ele, index) => ele.ServiceId === row.serviceId);
  //       if (duplicateItem && duplicateItem.length == 0) {
  //         this.onAddCharges(row);
  //         return;
  //       }

  //       this.dstable1.data = this.chargeslist;
  //       this.dstable1.sort = this.sort;
  //       this.dstable1.paginator = this.paginator;
  //     } else if (this.chargeslist && this.chargeslist.length == 0) {
  //       // this.addChargList(row);
  //       this.onAddCharges(row)
  //     }
  //     else {
  //       this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
  //         toastClass: 'tostr-tost custom-toast-warning',
  //       });
  //       return;
  //     }
  //   }

  onSaveEntry(row) {
    let doctorid = 0;
    const formValue = this.myForm.value

    debugger
    // this.dstable1.data = [];
    const isDuplicate = this.dstable1.data.some(item => item.ServiceId === row.serviceId);
    if (!isDuplicate) {
      this.onAddCharges(row)
    }
    else {
      this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }


  // addChargList(row) {
  //   this.chargeslist.push(
  //     {
  //       ServiceId: row.serviceId,
  //       ServiceName: row.serviceName,
  //       Price: row.price || 0
  //     });

  //   console.log(this.chargeslist);
  //   this.updateCalculation();
  //   this.dstable1.data = this.chargeslist;
  //   this.dstable1.sort = this.sort;
  //   this.dstable1.paginator = this.paginator;
  // }

  updateCalculation() {

    const total = this.chargeList.reduce((sum, item) => sum + (item.Price || 0), 0);
    const discPer = Number(this.myForm.get('totalDiscountPer')?.value) || 0;
// this.myForm.get('discountAmt').value
    const discountAmt = (total * discPer) / 100;
    const netAmt = total - discountAmt;

    this.myForm.patchValue({
      totalAmt: total,
      discountAmt: discountAmt,
      netPayableAmt: netAmt
    });
  }
  ///

  onAddCharges(row): void {

    if (this.myForm.get("IsPathRad").value == '1')
      this.IsPathology = true
    else
      this.IsRadiology = true

    const formValue = this.myForm.value;
    
    const totalAmount = row.price * 1;
    const discountAmount = formValue.discountAmt;//(totalAmount * formValue.discountPer) / 100;
    const netAmount = totalAmount - discountAmount;

    if (totalAmount > 0) {
      const newRow = {
        ServiceId: row.serviceId,
        ServiceName: row.serviceName,
        Price: row.price || 0,
        Qty: 0,
        TotalAmt: totalAmount,
        DiscPer: 0,
        DiscAmt: discountAmount || 0,
        NetAmount: netAmount,
        DoctorName: this.doctorname || '-',
        ClassName: 1,//this.className || '-',
        DoctorId: this.myForm.get('doctorId').value,
        ChargesAddedName: this.accountService.currentUserValue.userName,
        IsPathology: this.IsPathology,
        IsRadiology: this.IsRadiology,
        IsPackage: 0,
        serviceCode: 0,//formValue.serviceName.companyCode, 
        isInclusionExclusion: 1,//formValue.serviceName.isInclusionOrExclusion
      };

      const newCharge = new ChargesList(newRow);
      newCharge.DiscAmt = newCharge.DiscAmt || 0;
      newCharge.DiscPer = newCharge.DiscPer || 0;
      this.chargeList.push(newCharge);
      this.dstable1.data = this.chargeList;
      this.updateCalculation();

    } else {
      Swal.fire({
        title: 'Message',
        text: "Please Enter Service Detail.. !",
        icon: "warning"
      });

    }
  }

  deleteTableRow(element) {
    this.chargeslist = this.dstable1.data;
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dstable1.data = [];
      this.dstable1.data = this.chargeslist;

      if (this.chargeslist.length === 0) {
        this.myForm.patchValue({
          totalAmt: 0,
          totalDiscountPer: 0,
          discountAmt: 0,
          netPayableAmt: 0
        });
      } else {
        this.updateCalculation();
      }
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  chkChange() {
    if (this.registerObj.dateOfBirth > this.minDate) {
      this.toastr.warning('Enter Proper Birth Date', 'warning !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    }
  }

  onChangePrefix(e) {
    this.ddlGender.SetSelection(e.sexId);
  }

  onChangecity(e) {
    this.CityName = e.cityName
    this.registerObj.stateId = e.stateId
    this._labPatientRegService.getstateId(e.stateId).subscribe((Response) => {
      this.ddlState.SetSelection(Response.stateId)
      this.ddlCountry.SetSelection(Response.countryId);
    });
  }
  departmentId = 0
  selectChangedepartment(obj: any) {
    console.log(obj)
    this.departmentId = obj.value
    this.departmentname = obj.text
    if (obj.value) {
      this._labPatientRegService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
        this.ddlDoctor.options = data;
        this.ddlDoctor.bindGridAutoComplete();
      });
    }
    else {
      this._labPatientRegService.getDoctorsByDepartment(obj.departmentId).subscribe((data: any) => {
        // 
        this.ddlDoctor.options = data;
        // this.ddlDoctor.bindGridAutoComplete();
        const incomingDoctorId = obj.doctorId;
        console.log("Id:", incomingDoctorId)
        setTimeout(() => {
          this.ddlDoctor.bindGridAutoComplete();
          if (incomingDoctorId) {
            const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
            if (matchedDoctor) {
              this.ddlDoctor.SetSelection(matchedDoctor.value);
              // this.myForm.get('doctorId')?.setValue(matchedDoctor.value);
            }
          }
        }, 100);
      });
    }
  }

  allowOnlyDigits(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only digits (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    // Prevent entering more than 10 digits
    const input = event.target as HTMLInputElement;
    if (input.value.length >= 10) {
      event.preventDefault();
      return false;
    }
    return true;
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

  BillSave() {
    Swal.fire({
      title: 'Confirm Save',
      text: 'Are you sure you want to save this OPD bill?',
      icon: 'warning', // or 'question'
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Blue
      cancelButtonColor: '#d33',     // Red
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {

        this.myForm.get('firstName').setValue(this.myForm.get('patientName').value.patientName)
        console.log(this.myForm.value)
        if (!this.myForm.invalid)
          this.OnSave();
        else {
          let invalidFields = [];
          if (this.myForm.invalid) {
            for (const controlName in this.myForm.controls) {
              const control = this.myForm.get(controlName);

              if (control instanceof FormGroup || control instanceof FormArray) {
                for (const nestedKey in control.controls) {
                  if (control.get(nestedKey)?.invalid) {
                    invalidFields.push(`Lab Register Bill Data : ${controlName}.${nestedKey}`);
                  }
                }
              } else if (control?.invalid) {
                invalidFields.push(`Lab Register Bill From: ${controlName}`);
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
  OnSave() {


    const formattedDate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd");
    const formattedTime = formattedDate + this.dateTimeObj.time;

    this.myForm.get('regDate').setValue(formattedDate);
    this.myForm.get('regTime').setValue(formattedTime);

    if (this.selectedPatient) {
      const fullName = this.selectedPatient.patientName?.trim() || '';
      const nameParts = fullName.split(' ');

      const firstNameControl = this.myForm.get('patientName');
      const lastNameControl = this.myForm.get('lastName');
      const mobileControl = this.myForm.get('mobileNo');

      if (this.myForm.get('patientName')) {
        // 
        const firstName = fullName.split(' ')[0] || '';
        this.myForm.get('firstName').setValue(firstName)
      }
      if (!lastNameControl?.value) {
        const lastName = nameParts.slice(1).join(' ');
        lastNameControl?.setValue(lastName || '');
      }
      if (!mobileControl?.value) {
        mobileControl?.setValue(this.selectedPatient.extMobileNo || '');
      }
    } else {
      this.myForm.get('firstName').setValue(this.myForm.get('patientName').value)
    }

    console.log(this.myForm.value)


    let DateOfBirth1 = this.myForm.get('dateofBirth')?.value;
    if (DateOfBirth1) {
      const todayDate = new Date();
      const dob = new Date(DateOfBirth1);
      let ageYear = (todayDate.getFullYear() - dob.getFullYear());
      let ageMonth = (todayDate.getMonth() - dob.getMonth());
      let ageDay = (todayDate.getDate() - dob.getDate());

      this.ageYear = ageYear
      this.ageMonth = ageMonth
      this.ageDay = ageDay

      if (ageDay < 0) {
        (ageMonth)--;
        const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
        ageDay += previousMonth.getDate();
      }

      if (ageMonth < 0) {
        ageYear--;
        ageMonth += 12;
      }
      if (
        (!ageYear || ageYear == 0) &&
        (!ageMonth || ageMonth == 0) &&
        (!ageDay || ageDay == 0)
      ) {
        this.toastr.warning('Please select the birthdate or enter the age of the patient.', 'Warning!', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      this.myForm.get('ageYear')?.setValue(String(ageYear), { emitEvent: false });
      this.myForm.get('ageMonth')?.setValue(String(ageMonth), { emitEvent: false });
      this.myForm.get('ageDay')?.setValue(String(ageDay), { emitEvent: false });
      this.myForm.get('genderId').setValue(parseInt(this.myForm.get('genderId').value))
      this.myForm.get('stateId').setValue(parseInt(this.myForm.get('stateId').value))
      this.myForm.get('countryId').setValue(parseInt(this.myForm.get('countryId').value))
      this.myForm.get('departmentId').setValue(parseInt(this.myForm.get('departmentId').value))
      this.myForm.get('refDocId').setValue(parseInt(this.myForm.get('refDocId').value))
    }

    const formValue = { ...this.myForm.value };
    const controlsToRemove = ['patientName', 'regId', 'IsPathRad', 'ServiceId', 'totalAmt', 'totalDiscountPer', 'discountAmt', 'netPayableAmt', 'paymentType'];
    controlsToRemove.forEach(key => delete formValue[key]);
       console.log(formValue)


    // Bill data
    const formattedDate1 = this.datePipe.transform(this.OpBillForm.get('billDate').value, "yyyy-MM-dd");
    const formattedTime1 = this.datePipe.transform(new Date(), "HH:mm:ss");
    debugger
    this.OpBillForm.get('billDate').setValue(formattedDate1);
    this.OpBillForm.get('billTime').setValue(formattedDate1 + ' ' + formattedTime1);
    this.OpBillForm.get('opdipdid')?.setValue(0)
    this.OpBillForm.get('tariffId')?.setValue(this.vTariffId)
    this.OpBillForm.get('regNo')?.setValue(this.regNo)
    this.OpBillForm.get('patientName')?.setValue(this.PatientName)
    this.OpBillForm.get('ipdno')?.setValue(this.opdNo)
    this.OpBillForm.get('ageYear')?.setValue(Number(this.ageYear) || 0)
    this.OpBillForm.get('ageMonth')?.setValue(Number(this.ageMonth) || 0)
    this.OpBillForm.get('ageDays')?.setValue(Number(this.ageDays) || 0)
    this.OpBillForm.get('doctorId')?.setValue(this.myForm.get('doctorId').value || 0)
    this.OpBillForm.get('doctorName')?.setValue(this.doctorname || '')
    this.OpBillForm.get('patientType')?.setValue(this.companyId ? true : false)
    this.OpBillForm.get('companyName')?.setValue(this.companyName || '')
    this.OpBillForm.get('companyAmt')?.setValue(0)
    this.OpBillForm.get('patientAmt')?.setValue(this.myForm.get('netPayableAmt')?.value)
    this.OpBillForm.get('totalAmt')?.setValue(this.myForm.get('totalAmt')?.value)
    this.OpBillForm.get('concessionAmt')?.setValue(this.myForm.get('discountAmt')?.value)
    this.OpBillForm.get('netPayableAmt')?.setValue(this.myForm.get('netPayableAmt')?.value)
    this.OpBillForm.get('concessionReasonId')?.setValue(this.ConcessionId)
    this.OpBillForm.get('discComments')?.setValue(this.ConcessionReason)


    // this.OpBillForm.get('cashCounterId')?.setValue(this.searchForm.get('CashCounterID')?.value)
    console.log("form values", this.OpBillForm.value)

    console.log("form values", this.LabBillfinalform.value)
    if (this.OpBillForm.invalid) {

      this.ChargeddetailsArray.clear();
      this.BillDetailsArray.clear();

      this.dstable1.data.forEach(item => {
        this.ChargeddetailsArray.push(this.CreateAddchargeform(item as ChargesList));
        this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));

      });

      console.log("form values", this.OpBillForm.value)
      // const [ThermalPrint, ThermalPrintValue] = this._ConfigService.configParams.ThermalPrint.split(":");

      if (this.myForm.get('paymentType').value == 'PayOption') {
        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
          PatientHeaderObj['PatientName'] = this.PatientName; // this.patientDetail.patientName;
        PatientHeaderObj['RegNo'] = this.regNo;
        PatientHeaderObj['DoctorName'] = this.doctorname;
        PatientHeaderObj['CompanyName'] = this.companyName;
        PatientHeaderObj['DepartmentName'] = this.departmentname;
        PatientHeaderObj['OPD_IPD_Id'] = this.vOPIPId;
        PatientHeaderObj['Age'] = this.ageYear;
        PatientHeaderObj['NetPayAmount'] = Math.round(this.myForm.get('netPayableAmt').value);
        const dialogRef = this._matDialog.open(OpPaymentComponent,
          {
            maxWidth: "80vw",
            height: '750px',
            width: '80%',
            data: {
              vPatientHeaderObj: PatientHeaderObj,
              FromName: "OP-Bill",
              advanceObj: PatientHeaderObj,
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          if (result && result.IsSubmitFlag == true) {
            console.log(this.OpBillForm.value)
            console.log(result.submitDataPay.ipPaymentInsert)
            console.log(result.BillBalanceAmount)
            this.OpBillForm.get('balanceAmt').setValue(result.BillBalanceAmount || 0)
            this.OpBillForm.get('payments').setValue(result.submitDataPay.ipPaymentInsert)
            console.log(this.OpBillForm.value)

            this.LabBillfinalform.get('labPatientRegistration').setValue(formValue)
            this.LabBillfinalform.get('opBillIngModels').setValue(this.OpBillForm.value)



            this._labPatientRegService.InsertLabRegBilling(this.LabBillfinalform.value).subscribe(response => {
              //        if (ThermalPrint != 1) {
              //             this.viewgetOPBillReportPdf(response)
              //       } else {
              //             this.viewgetOPBillThermalReportPdf(response)
              //       } 
              //  this.resetform();
              this._matDialog.closeAll();
              this.savebtn = true
            });
          }
        });
      }
      else if (this.myForm.get('paymentType').value == 'CashPay') {//Cash pay  
        this.OpBillForm.get('balanceAmt').setValue(0)
        this.OpBillForm.get('paidAmt')?.setValue(this.myForm.get('netPayableAmt')?.value)
        this.OpBillForm.get('payments.cashPayAmount')?.setValue(Number(this.myForm.get('netPayableAmt')?.value))
        this.OpBillForm.get('payments.paymentDate')?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
        this.OpBillForm.get('payments.paymentTime')?.setValue(this.dateTimeObj.time)
        debugger
        console.log(this.OpBillForm.value)
        this.LabBillfinalform.get('labPatientRegistration').setValue(formValue)
        this.LabBillfinalform.get('opBillIngModels').setValue(this.OpBillForm.value)

        console.log(this.LabBillfinalform.value)

        this._labPatientRegService.InsertLabRegBilling(this.LabBillfinalform.value).subscribe(response => {
          //  if (ThermalPrint != 1) {
          //       this.viewgetOPBillReportPdf(response)
          // } else {
          //       this.viewgetOPBillThermalReportPdf(response)
          // } 
          this._matDialog.closeAll();
          this.savebtn = true
          // this.resetform();
        });
      }
      else if (this.myForm.get('paymentType').value == 'CreditPay') {//Credit pay 
        this.OpBillForm.get('paidAmt').setValue(0)
        this.OpBillForm.get('balanceAmt')?.setValue(this.myForm.get('netPayableAmt')?.value)
        this.OpBillForm.removeControl('payments')

        this.LabBillfinalform.get('labPatientRegistration').setValue(formValue)
        this.LabBillfinalform.get('opBillIngModels').setValue(this.OpBillForm.value)


        console.log(this.LabBillfinalform.value)


        this._labPatientRegService.InsertlabregCredit(this.LabBillfinalform.value).subscribe(response => {
          // if (ThermalPrint != 1) {
          //       this.viewgetOPBillReportPdf(response)
          // } else {
          //       this.viewgetOPBillThermalReportPdf(response)
          // } 
          this._matDialog.closeAll();
          this.savebtn = true
          // if (response)
          // this.resetform();
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
   
    this.OPFooterForm.reset({
      totalAmt: 0,
      totalDiscountPer: 0,
      concessionAmt: 0,
      netPayableAmt: 0,
      concessionReasonId: 0,
    });
    this.OPFooterForm.get('paymentType').setValue('CashPay')
  }
  // onNewSave() {
  //   const formattedDate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd");
  //   const formattedTime = formattedDate + this.dateTimeObj.time;

  //   this.myForm.get('regDate').setValue(formattedDate);
  //   this.myForm.get('regTime').setValue(formattedTime);

  //   if (this.selectedPatient) {
  //     const fullName = this.selectedPatient.patientName?.trim() || '';
  //     const nameParts = fullName.split(' ');

  //     const firstNameControl = this.myForm.get('patientName');
  //     const lastNameControl = this.myForm.get('lastName');
  //     const mobileControl = this.myForm.get('mobileNo');

  //     if (this.myForm.get('patientName')) {
  //       // 
  //       const firstName = fullName.split(' ')[0] || '';
  //       this.myForm.get('firstName').setValue(firstName)
  //     }
  //     if (!lastNameControl?.value) {
  //       const lastName = nameParts.slice(1).join(' ');
  //       lastNameControl?.setValue(lastName || '');
  //     }
  //     if (!mobileControl?.value) {
  //       mobileControl?.setValue(this.selectedPatient.extMobileNo || '');
  //     }
  //   }else{
  //     this.myForm.get('firstName').setValue(this.myForm.get('patientName').value)
  //   }

  //   console.log(this.myForm.value)

  //   if (!this.myForm.invalid) {
  //     
  //     let DateOfBirth1 = this.myForm.get('dateofBirth')?.value;
  //     if (DateOfBirth1) {
  //       const todayDate = new Date();
  //       const dob = new Date(DateOfBirth1);
  //       let ageYear = (todayDate.getFullYear() - dob.getFullYear());
  //       let ageMonth = (todayDate.getMonth() - dob.getMonth());
  //       let ageDay = (todayDate.getDate() - dob.getDate());

  //       if (ageDay < 0) {
  //         (ageMonth)--;
  //         const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
  //         ageDay += previousMonth.getDate();
  //       }

  //       if (ageMonth < 0) {
  //         ageYear--;
  //         ageMonth += 12;
  //       }
  //       if (
  //         (!ageYear || ageYear == 0) &&
  //         (!ageMonth || ageMonth == 0) &&
  //         (!ageDay || ageDay == 0)
  //       ) {
  //         this.toastr.warning('Please select the birthdate or enter the age of the patient.', 'Warning!', {
  //           toastClass: 'tostr-tost custom-toast-warning',
  //         });
  //         return;
  //       }
  //       this.myForm.get('ageYear')?.setValue(String(ageYear), { emitEvent: false });
  //       this.myForm.get('ageMonth')?.setValue(String(ageMonth), { emitEvent: false });
  //       this.myForm.get('ageDay')?.setValue(String(ageDay), { emitEvent: false });
  //     }

  //     this.labTestArray.clear();
  //     if (this.dstable1.data.length === 0) {
  //       this.toastr.warning('Data is not available in list ,please add data in the list.', 'Warning');
  //       return;
  //     }
  //     this.dstable1.data.forEach(item => {
  //       this.labTestArray.push(this.createLabTestReqArrayForm(item));
  //     });

  //     const formValue = { ...this.myForm.value };
  //     const controlsToRemove = ['patientName','mobileNo', 'regId', 'IsPathRad', 'ServiceId', 'totalAmt', 'totalDiscountPer', 'discountAmt', 'netPayableAmt', 'paymentType'];
  //     controlsToRemove.forEach(key => delete formValue[key]);

  //     console.log(formValue)
  //     this._labPatientRegService.labPatientSave(formValue).subscribe((response) => {
  //       // this.OnPrint(response)
  //       this.onClose();
  //     });
  //   } else {
  //     let invalidFields: string[] = [];

  //     const validateFormGroup = (formGroup: FormGroup | FormArray, parentKey: string = '') => {
  //       Object.keys(formGroup.controls).forEach(key => {
  //         const control = formGroup.get(key);
  //         const fieldKey = parentKey ? `${parentKey}.${key}` : key;

  //         if (control instanceof FormGroup || control instanceof FormArray) {
  //           validateFormGroup(control, fieldKey);
  //         } else {
  //           if (control?.invalid) {
  //             invalidFields.push(fieldKey);
  //           }
  //         }
  //       });
  //     };

  //     validateFormGroup(this.myForm);

  //     if (invalidFields.length > 0) {
  //       invalidFields.forEach(field => {
  //         this.toastr.warning(`Please check this field "${field}"`, 'Warning!');
  //       });
  //       return;
  //     }
  //   }
  // }
  chkDoctor(event) {
    console.log(event)
    this.doctorname = event.text
  }
  onClose() {
    this.myForm.reset();
    this.dialogRef.close();
  }
}
// Set NODE_OPTIONS="--max-old-space-size=8192"
