import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
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

@Component({
  selector: 'app-company-information',
  templateUrl: './company-information.component.html',
  styleUrls: ['./company-information.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CompanyInformationComponent implements OnInit {
  companyFormGroup: FormGroup;
  dateTimeObj: any;
  screenFromString = 'Common-form';
  // registerObj: AdmissionPersonlModel;
  AdmissionID: any;
  dsCompanyList = new MatTableDataSource<CompanyDetails>();
  Chargelist: any = [];
  displayedColumns: string[] = [
    'EstimateAmt',
    'ApprovedAmt',
    'Alentry',
    'ValidDate',
    'Remark',
    'Active',
    'Action'
  ]

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

  ngOnInit(): void {
    this.companyFormGroup = this.createCompanyForm();
    this.companyFormGroup.markAllAsTouched();

    console.log("company data:", this.data.registerObj)
    this.registerObj = this.data.registerObj
    if ((this.data?.companyId) > 0) {
      this._AdmissionService.getCompanyIdDetail(this.data.companyId).subscribe(res => {
        // this.registerObj = res
        console.log("company get data:", res);
      });
    }

    // date validation
    this.companyFormGroup.get('validDate')?.valueChanges.subscribe(selectedDate => {
      if (selectedDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // remove time portion
        const chosen = new Date(selectedDate);
        chosen.setHours(0, 0, 0, 0);

        if (chosen < today) {
          this.toastr.warning('Valid Date cannot be earlier than today.', 'Warning!',
            { toastClass: 'tostr-tost custom-toast-warning' }
          );
          this.companyFormGroup.get('validDate')?.setValue(null);
        }
      }
    });
  }

 getActiveApprovedAmtTotal(): number {
  return this.dsCompanyList.data
    .filter(row => row.isActive)
    .reduce((sum, row) => sum + (Number(row.ApprovedAmt) || 0), 0);
}

  createCompanyForm() {
    return this.formBuilder.group({
      PolicyNo: ['',[Validators.required,this._FormvalidationserviceService.onlyNumberValidator()]],
      PolicyLimit: ['',[Validators.required,this._FormvalidationserviceService.onlyNumberValidator()]],
      validDate: [new Date()],
      dateApproved: [new Date()],
      reason: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      amt: '',
      Alentry: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      ApprovalAmt: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      EstimatAmt: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

      MemberNo: [''],
      ClaimNo: [''],
      BillToTpa: '',
      PAdvance: '',
      ApprovBYTpa: '',
      InvestigationPaid: '',
      DisallowAmt: '',
      NetAmtRefund: '',
      PathAmt: '',
      DiscByTpa: '',
      RefundAmt: '',
      RadiAmt: '',
      DiscByManagement: '',
      PharmacyAmt: '',
      RecoverAmtbyPatient: '',
      MedicalAmt: ''
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

  onActiveChange(element: any) {
    console.log('IsActive changed:', element);
  }

  onAdd() {
    if (!this.companyFormGroup.invalid) {
      this.dsCompanyList.data = [];
      const selectedDate = this.companyFormGroup.get('dateApproved').value;
      const formattedDate = selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : '';
      
      this.Chargelist.push(
        {
          EstimateAmt: this.companyFormGroup.get('EstimatAmt').value || '',
          ApprovedAmt: this.companyFormGroup.get('ApprovalAmt').value || '',
          Alentry: this.companyFormGroup.get('Alentry').value || '',
          ValidDate: formattedDate,
          Remark: this.companyFormGroup.get('reason').value || ''
        });
      this.dsCompanyList.data = this.Chargelist
      this.companyFormGroup.get('EstimatAmt').reset('');
      this.companyFormGroup.get('ApprovalAmt').reset('');
      this.companyFormGroup.get('Alentry').reset('');
      this.companyFormGroup.get('dateApproved').reset(new Date());
      this.companyFormGroup.get('reason').reset('');
    } else {
      let invalidFields = [];
      if (this.companyFormGroup.invalid) {
        for (const controlName in this.companyFormGroup.controls) {
          if (this.companyFormGroup.controls[controlName].invalid) {
            invalidFields.push(`Company Form: ${controlName}`);
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

  Save() {
    var m_data = {
      "companyUpdate": {
        "AdmissionId": this.AdmissionID,
        "policyNo": this.companyFormGroup.get('PolicyNo').value || "",
        "claimNo": this.companyFormGroup.get('ClaimNo').value || "",
        "estimatedAmount": this.companyFormGroup.get('EstimatAmt').value || 0,
        "approvedAmount": this.companyFormGroup.get('ApprovBYTpa').value || 0,
        "hosApreAmt": this.companyFormGroup.get('ApprovalAmt').value || 0,
        "pathApreAmt": this.companyFormGroup.get('PathAmt').value || 0,
        "PharApreAmt": this.companyFormGroup.get('PharmacyAmt').value || 0,
        "radiApreAmt": this.companyFormGroup.get('RadiAmt').value || 0,
        "c_DisallowedAmt": this.companyFormGroup.get('DisallowAmt').value || 0,
        "compDiscount": this.companyFormGroup.get('DiscByTpa').value || 0,
        "hDiscAmt": this.companyFormGroup.get('DiscByManagement').value || 0,
        "c_OutsideInvestAmt": this.companyFormGroup.get('InvestigationPaid').value || 0,
        "recoveredByPatient": this.companyFormGroup.get('RecoverAmtbyPatient').value || 0,
        "medicalApreAmt": this.companyFormGroup.get('MedicalAmt').value.SubCompanyId || 0,
        "C_FinalBillAmt": this.companyFormGroup.get('BillToTpa').value || 0

      }

    }
    console.log(m_data)

    this._AdmissionService.CompanyUpdate(m_data).subscribe(response => {
      this.toastr.success(response.message);
      // this.viewgetIPPayemntPdf(response)
      // this._matDialog.closeAll();

    }, (error) => {
      this.toastr.error(error.message);
    });
  }


  getCompanydetailview(AdmissionId) {
    // this.sIsLoading = 'loading-data';

    // setTimeout(() => {

    //   this._AdmissionService.getCompanyDetailsView(
    //     AdmissionId
    //   ).subscribe(res => {
    //     const matDialog = this._matDialog.open(PdfviewerComponent,
    //       {
    //         maxWidth: "85vw",
    //         height: '750px',
    //         width: '100%',
    //         data: {
    //           base64: res["base64"] as string,
    //           title: "Company Detail Viewer"
    //         }
    //       });

    //     matDialog.afterClosed().subscribe(result => {
    //       // this.AdList = false;
    //       // this.sIsLoading = ' ';
    //     });
    //   });

    // }, 100);

  }


  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClose() {
    this.dialogRef.close();
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
  EstimatAmt: any;
  BillToTpa: any;
  InvestigationPaid: any;
  ApprovalAmt: any;
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
  validDate: any;
  Alentry: any;
  dateApproved: any;
  reason: any;
  amt: any;
  isActive:any;
ApprovedAmt:any;

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
      this.EstimatAmt = CompanyDetails.EstimatAmt || 0
      this.BillToTpa = CompanyDetails.BillToTpa || 0
      this.InvestigationPaid = CompanyDetails.InvestigationPaid || 0
      this.ApprovalAmt = CompanyDetails.ApprovalAmt || 0
      this.ApprovBYTpa = CompanyDetails.ApprovBYTpa || 0
      this.NetAmtRefund = CompanyDetails.NetAmtRefund || 0
      this.PathAmt = CompanyDetails.PathAmt || 0
      this.DisallowAmt = CompanyDetails.DisallowAmt || 0
      this.RefundAmt = CompanyDetails.RefundAmt || 0
      this.PolicyLimit = CompanyDetails.PolicyLimit || 0
      this.validDate = CompanyDetails.validDate || '1900-01-01'
      this.dateApproved = CompanyDetails.dateApproved || '1900-01-01'
      this.Alentry = CompanyDetails.Alentry || ''
      this.reason = CompanyDetails.reason || ''
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
      // this.ReligionId = CompanyDetails.ReligionId || '';
      // this.AreaId = CompanyDetails.AreaId || '';
      // this.VillageId = CompanyDetails.VillageId || '';
      // this.TalukaId = CompanyDetails.TalukaId || '';
      // this.PatientWeight = CompanyDetails.PatientWeight || '';
      // this.AreaName = CompanyDetails.AreaName || '';
      // this.AadharCardNo = CompanyDetails.AadharCardNo || '';
      // this.PanCardNo = CompanyDetails.PanCardNo || '';
    }
  }
}