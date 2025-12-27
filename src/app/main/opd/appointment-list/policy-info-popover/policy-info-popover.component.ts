import { Component, ViewEncapsulation, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { OperatorComparer,gridModel } from 'app/core/models/gridRequest';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';

@Component({
  selector: 'app-policy-info-popover',
  templateUrl: './policy-info-popover.component.html',
  styleUrls: ['./policy-info-popover.component.scss']
})
export class PolicyInfoPopoverComponent implements OnInit {
  @Input() patientData: any;

  policyFormGroup: FormGroup;
  policyHistory: any[] = [];
  isLoading: boolean = false;
  vOPDNo: any = 0;
  vIPDNo: any = 0;
  OpdIpdID: any;
  registerObj = new CompanyDetails({});
  
  @ViewChild('grid') grid: AirmidTableComponent;
  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private _AdmissionService: AdmissionService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.policyFormGroup = this.createCompanyInfoForm();
    this.policyFormGroup.markAllAsTouched()

    console.log("company data:", this.patientData)
    this.registerObj = this.patientData
    this.OpdIpdID = this.registerObj.admissionId ?? this.registerObj.visitId
    this.vOPDNo = this.registerObj.opdNo
    this.vIPDNo = this.registerObj.ipdno

    if (this.patientData) {
      this.policyFormGroup.patchValue({
        policyNo: this.patientData.policyNo || '',
        approvedAmount: this.patientData.approvedAmount || 0,
        validDate: this.patientData.validDate || new Date()
      });
      this.loadPolicyHistory();
    }
    this.getfilterdata();
  }
  // ngAfterViewInit() {
  //   this.getfilterdata();
  // }

  createCompanyInfoForm() {
    return this.formBuilder.group({
      patientPolicyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opipid: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      opiptype: [0],
      policyNo: ['', [Validators.required]],
      policyValidateDate: [new Date(), [Validators.required, this._FormvalidationserviceService.validDateValidator()]],
      approvedAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }

  loadPolicyHistory() {
    // Load policy history for this patient
    const admissionId = this.patientData?.visitId || this.patientData?.admissionId;
    if (admissionId) {
      this.isLoading = true;
      // Since there's no specific API for policy history, we'll show empty table
      // The actual policy info is saved via CompanyInfoUpdate API
      this.policyHistory = [];
      this.isLoading = false;
    }
  }

  // onSave() {
  //   if (this.policyFormGroup.invalid) {
  //     this.toastr.warning('Please fill all required fields.', 'Warning');
  //     return;
  //   }

  //   const admissionId = this.patientData?.visitId || this.patientData?.admissionId;
  //   this.policyFormGroup.get('admissionId').setValue(admissionId);

  //   const formData = { ...this.policyFormGroup.value };
  //   // Remove validDate from submission as per original component
  //   delete formData.validDate;

  //   this._AdmissionService.CompanyInfoUpdate(formData).subscribe(
  //     (response: any) => {
  //       // Don't show success toastr if API response already has a message
  //       if (!response?.message) {
  //         this.toastr.success('Policy Information saved successfully.', 'Success');
  //       }
  //       this.loadPolicyHistory();
  //       // Reset form after successful save
  //       this.policyFormGroup.reset({
  //         policyNo: '',
  //         approvedAmount: 0,
  //         validDate: new Date(),
  //         admissionId: admissionId
  //       });
  //     },
  //     (error) => {
  //       const errorMessage = error?.error?.message || error?.message || 'Error saving policy information.';
  //       this.toastr.error(errorMessage, 'Error');
  //     }
  //   );
  // }

  CompanyInfoSave() {
    const currentDate = this.policyFormGroup.get('policyValidateDate').value;
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    this.policyFormGroup.get('policyValidateDate').setValue(formattedDate)

    this.policyFormGroup.get('opipid').setValue(this.OpdIpdID)
    if (this.vIPDNo)
      this.policyFormGroup.get('opiptype').setValue(1)

    console.log(this.policyFormGroup.value)

    if (!this.policyFormGroup.invalid) {
      console.log(this.policyFormGroup.value)
      this._AdmissionService.CompanyInfoUpdate(this.policyFormGroup.value).subscribe((response) => {
        console.log(response)
        this.getfilterdata();
        this.onClose();
      });
    } else {
      let invalidFields = [];

      if (this.policyFormGroup.invalid) {
        for (const controlName in this.policyFormGroup.controls) {
          if (this.policyFormGroup.controls[controlName].invalid) {
            invalidFields.push(`CompanyInfo Form: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }
    }
  }

  onClose() {
    this.policyFormGroup.reset({
      patientPolicyId: 0,
      opipid: this.OpdIpdID,
      opiptype: [0],
      policyNo: 0,
      policyValidateDate: new Date(),
      approvedAmount: 0,
    });
  }

  onValidDateChange(event: any) {
    const selectedDate = new Date(event.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      this.toastr.warning('Valid Date cannot be earlier than today.', 'Warning!',
        { toastClass: 'tostr-tost custom-toast-warning' }
      );
      this.policyFormGroup.get('policyValidateDate')?.setValue('');
    }
  }

  allColumns = [
    { heading: "Policy No", key: "policyNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Policy Limit", key: "approvedAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Valid Date", key: "policyValidateDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
    { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, callback: (data: any) => {
            this.OnEdit(data) // EDIT Records
          }
        }, {
          action: gridActions.delete, callback: (data: any) => {
            this._AdmissionService.deactivatePolicyTheStatus(data.patientPolicyId).subscribe((response: any) => {
              this.getfilterdata()
            });
          }
        }]
    }
  ]

  gridConfig: gridModel = {
    apiUrl: "PatientPolicy/List",
    columnsList: this.allColumns,
    sortField: "PatientPolicyId",
    sortOrder: 0,
    filters: [
      { fieldName: "Opipid", fieldValue: "0", opType: OperatorComparer.Contains }
    ]
  }

  getfilterdata() {
    this.gridConfig = {
      apiUrl: "PatientPolicy/List",
      columnsList: this.allColumns,
      sortField: "PatientPolicyId",
      sortOrder: 0,
      filters: [
        { fieldName: "Opipid", fieldValue: String(this.OpdIpdID), opType: OperatorComparer.Contains }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  OnEdit(row) {
    console.log(row)
    this.policyFormGroup.patchValue(row)
  }
}

export class CompanyDetails {
  PolicyNo: any;
  MemberNo: any;
  companyId: any;
  regNo: any;
  admissionDate: any;
  admissionTime: any;
  ipdno: any;
  patientName: any;
  genderName: any;
  ageDay: any;
  ageMonth: any;
  ageYear: any;
  doctorname: any;
  roomName: any;
  bedName: any;
  refDocName: any;
  departmentName: any;
  companyName: any;
  tariffName: any;
  patientType: any;
  policyNo: any;
  claimNo: any;
  estimateAmount: any;
  BillToTpa: any;
  InvestigationPaid: any;
  approvedAmount: any;
  ApprovBYTpa: any;
  NetAmtRefund: any;
  PathAmt: any;
  DisallowAmt: any;
  RefundAmt: any;
  RadiAmt: any;
  DiscByTpa: any;
  PharmacyAmt: any;
  DiscByManagement: any;
  MedicalAmt: any;
  RecoverAmtbyPatient: any;
  PolicyLimit: any;
  policyValidateDate: any;
  alentry: any;
  dateApproved: any;
  comments: any;
  amt: any;
  isActive: any;
  ApprovedAmt: any;

  ClaimNo: any;
  CompBillNo: any;
  CompBillDate: any;
  CompDiscount: any;
  CompDisDate: any;
  C_BillNo: any;
  C_FinalBillAmt: any;
  C_DisallowedAmt: any;
  HDiscAmt: any;
  C_OutsideInvestAmt: any;
  RecoveredByPatient: any;
  H_ChargeAmt: any;
  H_AdvAmt: any;
  H_BillId: any;
  H_BillDate: any;
  H_BillNo: any;
  H_TotalAmt: any;
  H_DiscAmt: any;
  H_NetAmt: any;
  H_PaidAmt: any;
  H_BalAmt: any;
  CompanyId: any;
  admissionId: any
  visitId: any;
  vistDateTime: any;
  opdNo: any;
  /**
   * Constructor
   *
   * @param CompanyDetails
   */

  constructor(CompanyDetails) {
    {
      this.PolicyNo = CompanyDetails.PolicyNo || '';
      this.MemberNo = CompanyDetails.MemberNo || '';
      this.companyId = CompanyDetails.companyId || 0
      this.regNo = CompanyDetails.regNo || 0
      this.admissionDate = CompanyDetails.admissionDate || new Date()
      this.ipdno = CompanyDetails.ipdno || 0
      this.patientName = CompanyDetails.patientName || ''
      this.genderName = CompanyDetails.genderName || ''
      this.ageDay = CompanyDetails.ageDay || ''
      this.ageMonth = CompanyDetails.ageMonth || ''
      this.ageYear = CompanyDetails.ageYear || ''
      this.doctorname = CompanyDetails.doctorname || ''
      this.roomName = CompanyDetails.roomName || ''
      this.bedName = CompanyDetails.bedName || ''
      this.refDocName = CompanyDetails.refDocName || ''
      this.departmentName = CompanyDetails.departmentName || ''
      this.companyName = CompanyDetails.companyName || ''
      this.tariffName = CompanyDetails.tariffName || ''
      this.patientType = CompanyDetails.patientType || ''
      this.policyNo = CompanyDetails.policyNo || 0
      this.claimNo = CompanyDetails.claimNo || 0
      this.estimateAmount = CompanyDetails.estimateAmount || 0
      this.BillToTpa = CompanyDetails.BillToTpa || 0
      this.InvestigationPaid = CompanyDetails.InvestigationPaid || 0
      this.approvedAmount = CompanyDetails.approvedAmount || 0
      this.ApprovBYTpa = CompanyDetails.ApprovBYTpa || 0
      this.NetAmtRefund = CompanyDetails.NetAmtRefund || 0
      this.PathAmt = CompanyDetails.PathAmt || 0
      this.DisallowAmt = CompanyDetails.DisallowAmt || 0
      this.RefundAmt = CompanyDetails.RefundAmt || 0
      this.PolicyLimit = CompanyDetails.PolicyLimit || 0
      this.policyValidateDate = CompanyDetails.policyValidateDate || '1900-01-01'
      this.dateApproved = CompanyDetails.dateApproved || '1900-01-01'
      this.alentry = CompanyDetails.alentry || ''
      this.comments = CompanyDetails.comments || ''
      this.amt = CompanyDetails.amt || ''
      this.isActive = CompanyDetails.isActive || ''
      this.ApprovedAmt = CompanyDetails.ApprovedAmt || ''

      this.RadiAmt = CompanyDetails.RadiAmt || 0
      this.DiscByTpa = CompanyDetails.DiscByTpa || 0
      this.PharmacyAmt = CompanyDetails.PharmacyAmt || 0
      this.DiscByManagement = CompanyDetails.DiscByManagement || 0
      this.MedicalAmt = CompanyDetails.MedicalAmt || 0
      this.RecoverAmtbyPatient = CompanyDetails.RecoverAmtbyPatient || 0

      this.ClaimNo = CompanyDetails.ClaimNo || '';
      this.CompBillNo = CompanyDetails.CompBillNo || '';
      this.CompBillDate = CompanyDetails.CompBillDate || '';
      this.CompDiscount = CompanyDetails.CompDiscount || '';
      this.CompDisDate = CompanyDetails.CompDisDate || '';
      this.C_BillNo = CompanyDetails.C_BillNo || '';
      this.C_FinalBillAmt = CompanyDetails.C_FinalBillAmt || '';
      this.C_DisallowedAmt = CompanyDetails.C_DisallowedAmt || '';
      this.HDiscAmt = CompanyDetails.HDiscAmt || '';
      this.C_OutsideInvestAmt = CompanyDetails.C_OutsideInvestAmt || '';
      this.RecoveredByPatient = CompanyDetails.RecoveredByPatient || '';
      this.H_ChargeAmt = CompanyDetails.H_ChargeAmt || '';
      this.H_AdvAmt = CompanyDetails.H_AdvAmt || '';
      this.H_BillId = CompanyDetails.H_BillId || '';
      this.H_BillDate = CompanyDetails.H_BillDate || '';
      this.H_BillNo = CompanyDetails.H_BillNo || '';
      this.H_TotalAmt = CompanyDetails.H_TotalAmt || '';
      this.H_DiscAmt = CompanyDetails.H_DiscAmt || '';
      this.H_NetAmt = CompanyDetails.H_NetAmt || '';
      this.H_PaidAmt = CompanyDetails.H_PaidAmt || '';
      this.H_BalAmt = CompanyDetails.H_BalAmt || '';
      this.CompanyId = CompanyDetails.CompanyId || '';
      this.admissionId = CompanyDetails.admissionId || '';
      this.approvedAmount = CompanyDetails.approvedAmount || '';
      this.visitId = CompanyDetails.visitId || '';
      this.vistDateTime = CompanyDetails.vistDateTime || '';
      this.opdNo = CompanyDetails.opdNo || '';
      // this.AreaName = CompanyDetails.AreaName || '';
      // this.AadharCardNo = CompanyDetails.AadharCardNo || '';
      // this.PanCardNo = CompanyDetails.PanCardNo || '';
    }
  }
}
