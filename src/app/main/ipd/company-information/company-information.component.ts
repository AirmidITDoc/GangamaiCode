import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { AdmissionPersonlModel } from '../Admission/admission/admission.component';
import { AdmissionService } from '../Admission/admission/admission.service';
import { AdvanceDataStored } from '../advance';
import { MatTableDataSource } from '@angular/material/table';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';

@Component({
  selector: 'app-company-information',
  templateUrl: './company-information.component.html',
  styleUrls: ['./company-information.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CompanyInformationComponent implements OnInit {
  companyInformationFormGroup: FormGroup;
  companyApprovalFormGroup: FormGroup;
  dateTimeObj: any;
  screenFromString = 'Common-form';
  // registerObj: AdmissionPersonlModel;
  OpdIpdID: any;
  visitId: any;
  dsCompanyList = new MatTableDataSource<CompanyDetails>();
  Chargelist: any = [];
  vOPDNo: any = 0;
  vIPDNo: any = 0;
  displayedColumns: string[] = [
    'EstimateAmt',
    'ApprovedAmt',
    'Alentry',
    'ValidDate',
    'Remark',
    'Active',
    'Action'
  ]

  @ViewChild('grid') grid: AirmidTableComponent;
  constructor(
    public _AdmissionService: AdmissionService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private router: Router,
    private dialogRef: MatDialogRef<CompanyInformationComponent>,
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  registerObj = new CompanyDetails({});
  vSelectedOption: any;

  ngOnInit(): void {
    this.companyApprovalFormGroup = this.createCompanyAprrovalForm();
    this.companyApprovalFormGroup.markAllAsTouched();

    this.companyInformationFormGroup = this.createCompanyInfoForm();
    this.companyInformationFormGroup.markAllAsTouched()

    console.log("company data:", this.data.registerObj)
    this.registerObj = this.data.registerObj
    this.OpdIpdID = this.registerObj.admissionId ?? this.registerObj.visitId
    this.vOPDNo = this.registerObj.opdNo
    this.vIPDNo = this.registerObj.ipdno
    if (this.vOPDNo)
      this.vSelectedOption == this.vOPDNo
    else
      this.vSelectedOption == this.vIPDNo
    this.companyInformationFormGroup.patchValue(this.registerObj)

    if ((this.data?.companyId) > 0) {
      this._AdmissionService.getCompanyIdDetail(this.data.companyId).subscribe(res => {
        // this.registerObj = res
        console.log("company get data:", res);
      });
    }

    // date validation
    // this.companyApprovalFormGroup.get('policyValidateDate')?.valueChanges.subscribe(selectedDate => {
    //   if (selectedDate) {
    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0); // remove time portion
    //     const chosen = new Date(selectedDate);
    //     chosen.setHours(0, 0, 0, 0);

    //     if (chosen < today) {
    //       this.toastr.warning('Valid Date cannot be earlier than today.', 'Warning!',
    //         { toastClass: 'tostr-tost custom-toast-warning' }
    //       );
    //       this.companyApprovalFormGroup.get('policyValidateDate')?.setValue(null);
    //     }
    //   }
    // });

    this.getfilterdata();
  }

  getActiveApprovedAmtTotal(): number {
    return this.dsCompanyList.data
      .filter(row => row.isActive)
      .reduce((sum, row) => sum + (Number(row.ApprovedAmt) || 0), 0);
  }

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

  createCompanyAprrovalForm() {
    return this.formBuilder.group({
      id: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      admissionId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      estimateAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      approvedAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      alentry: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      dateApproved: [new Date(), [Validators.required, this._FormvalidationserviceService.validDateValidator()]],
      comments: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
    });
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

  allColumns = [
    { heading: "Estimate Amt", key: "estimateAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Approved Amt", key: "approvedAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Al Entry", key: "alentry", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Valid Date", key: "dateApproved", sort: true, align: 'left', emptySign: 'NA', type: 6 },
    { heading: "Remark", key: "comments", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, callback: (data: any) => {
            this.OnEdit(data) // EDIT Records
          }
        }, {
          action: gridActions.delete, callback: (data: any) => {
            this._AdmissionService.deactivateTheStatus(data.id).subscribe((response: any) => {
              this.getfilterdata()
            });
          }
        }]
    }
  ]

  gridConfig: gridModel = {
    apiUrl: "CompanyTPAApproval/List",
    columnsList: this.allColumns,
    sortField: "Id",
    sortOrder: 0,
    filters: [
      { fieldName: "AdmissionId", fieldValue: "0", opType: OperatorComparer.Contains }
    ]
  }

  getfilterdata() {
    this.gridConfig = {
      apiUrl: "CompanyTPAApproval/List",
      columnsList: this.allColumns,
      sortField: "Id",
      sortOrder: 0,
      filters: [
        { fieldName: "AdmissionId", fieldValue: String(this.OpdIpdID), opType: OperatorComparer.Contains }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  onActiveChange(element: any) {
    console.log('IsActive changed:', element);
  }

  // onAdd() {
  //   if (!this.companyApprovalFormGroup.invalid) {
  //     this.dsCompanyList.data = [];
  //     const selectedDate = this.companyApprovalFormGroup.get('dateApproved').value;
  //     const formattedDate = selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : '';

  //     this.Chargelist.push(
  //       {
  //         EstimateAmt: this.companyApprovalFormGroup.get('estimateAmount').value || '',
  //         ApprovedAmt: this.companyApprovalFormGroup.get('approvedAmount').value || '',
  //         Alentry: this.companyApprovalFormGroup.get('alentry').value || '',
  //         ValidDate: formattedDate,
  //         Remark: this.companyApprovalFormGroup.get('comments').value || ''
  //       });
  //     this.dsCompanyList.data = this.Chargelist
  //     this.companyApprovalFormGroup.get('estimateAmount').reset('');
  //     this.companyApprovalFormGroup.get('approvedAmount').reset('');
  //     this.companyApprovalFormGroup.get('alentry').reset('');
  //     this.companyApprovalFormGroup.get('dateApproved').reset(new Date());
  //     this.companyApprovalFormGroup.get('comments').reset('');
  //   } else {
  //     let invalidFields = [];
  //     if (this.companyApprovalFormGroup.invalid) {
  //       for (const controlName in this.companyApprovalFormGroup.controls) {
  //         if (this.companyApprovalFormGroup.controls[controlName].invalid) {
  //           invalidFields.push(`Company Form: ${controlName}`);
  //         }
  //       }
  //     }

  //     if (invalidFields.length > 0) {
  //       invalidFields.forEach(field => {
  //         this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
  //         );
  //       });
  //     }
  //   }
  // }

  onValidDateChange(event: any) {
    const selectedDate = new Date(event.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      this.toastr.warning('Valid Date cannot be earlier than today.', 'Warning!',
        { toastClass: 'tostr-tost custom-toast-warning' }
      );
      this.companyInformationFormGroup.get('policyValidateDate')?.setValue('');
    }
  }

  onDateApprovedChange(event: any) {
    const selectedDate = new Date(event.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize

    if (selectedDate > today) {
      this.toastr.warning('Future date is not allowed! Please select today or past date.', 'Warning!',
        { toastClass: 'tostr-tost custom-toast-warning' }
      );
      this.companyApprovalFormGroup.get('dateApproved')?.setValue('');
    }
  }

  OnEdit(row) {
    console.log(row)
    this.companyApprovalFormGroup.patchValue(row)
  }

  CompanyApprovalSave() {
    const currentDate = this.companyApprovalFormGroup.get('dateApproved').value;
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    this.companyApprovalFormGroup.get('dateApproved').setValue(formattedDate)
    this.companyApprovalFormGroup.get('admissionId').setValue(this.OpdIpdID)
    console.log(this.companyApprovalFormGroup.value)

    if (!this.companyApprovalFormGroup.invalid) {
      console.log(this.companyApprovalFormGroup.value)
      this._AdmissionService.CompanyApprovalInsert(this.companyApprovalFormGroup.value).subscribe((response) => {
        console.log(response)
        this.getfilterdata();
        this.onClose();
      });
    } else {
      let invalidFields = [];

      if (this.companyApprovalFormGroup.invalid) {
        for (const controlName in this.companyApprovalFormGroup.controls) {
          if (this.companyApprovalFormGroup.controls[controlName].invalid) {
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

  deleteTableRow(event, element) {
    let index = this.Chargelist.indexOf(element);
    if (index >= 0) {
      this.Chargelist.splice(index, 1);
      this.dsCompanyList.data = [];
      this.dsCompanyList.data = this.Chargelist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  CompanyInfoSave() {

    const currentDate = this.companyInformationFormGroup.get('policyValidateDate').value;
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    this.companyInformationFormGroup.get('policyValidateDate').setValue(formattedDate)

    this.companyInformationFormGroup.get('opipid').setValue(this.OpdIpdID)
    if (this.vIPDNo)
      this.companyInformationFormGroup.get('opiptype').setValue(1)

    console.log(this.companyInformationFormGroup.value)

    if (!this.companyInformationFormGroup.invalid) {
      console.log(this.companyInformationFormGroup.value)
      this._AdmissionService.CompanyInfoUpdate(this.companyInformationFormGroup.value).subscribe((response) => {
        console.log(response)
      });
    } else {
      let invalidFields = [];

      if (this.companyInformationFormGroup.invalid) {
        for (const controlName in this.companyInformationFormGroup.controls) {
          if (this.companyInformationFormGroup.controls[controlName].invalid) {
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

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClose() {
    // this.dialogRef.close();
    this.companyApprovalFormGroup.reset();
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