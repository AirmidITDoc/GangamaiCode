import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdmissionService } from '../Admission/admission/admission.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from '../advance';
import { AdvanceDetailObj } from '../ip-search-list/ip-search-list.component';
import Swal from 'sweetalert2';
import { AdmissionPersonlModel } from '../Admission/admission/admission.component';

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
  screenFromString = 'discharge';
  selectedAdvanceObj: AdmissionPersonlModel;
  registerObj: AdmissionPersonlModel;
  AdmissionID: any;
 
  constructor(
    public _AdmissionService: AdmissionService,
    public datePipe: DatePipe,
    private router: Router,
    private dialogRef: MatDialogRef<CompanyInformationComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,

    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,


  ) {
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj);
     
      this.AdmissionID = this.selectedAdvanceObj.AdmissionID
      
    } }

    registerObj1 =new CompanyDetails({});

  ngOnInit(): void {
    this.companyFormGroup = this.createCompanyForm();

    if (this.data) {
      this.registerObj1 = this.data.registerObj;
    let Query = "Select * from Admission where  AdmissionID=" + this.AdmissionID + " ";
    this._AdmissionService.getCompanyIdDetail(Query).subscribe(data => {
      this.registerObj1 = data[0];
      console.log(this.registerObj1);
    });

    
    }
    this.companyFormGroup = this.createCompanyForm();
  }



  createCompanyForm() {

    return this.formBuilder.group({
      PolicyNo: [''],
      MemberNo: [''],
      ClaimNo: [''],
      BillToTpa: '',
      PAdvance: '',
      EstimatAmt: '',
      ApprovBYTpa: '',
      InvestigationPaid: '',
      AppHospitalAmt: '',
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

  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }


  Save() {
    var m_data = {
      "companyUpdate": {
        "AdmissionId": this.AdmissionID,
        "policyNo": this.companyFormGroup.get('PolicyNo').value || "",
        "claimNo": this.companyFormGroup.get('ClaimNo').value || "",
        "estimatedAmount": this.companyFormGroup.get('EstimatAmt').value || 0,
        "approvedAmount": this.companyFormGroup.get('ApprovBYTpa').value || 0,
        "hosApreAmt": this.companyFormGroup.get('AppHospitalAmt').value || 0,
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
      if (response) {
        Swal.fire('Congratulations !', 'Company Data Updated Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();

          }
        });
      } else {
        Swal.fire('Error !', 'Company Data  not Updated', 'error');
      }
      // this.isLoading = '';

    });
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
  
  AprovAmount
  CompDOD
  IsPharClearance
  IPNumber
  EstimatedAmount
  ApprovedAmount
  HosApreAmt
  PathApreAmt
  PharApreAmt
  RadiApreAmt
  PharDisc

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
  CompanyId:any;
  /**
   * Constructor
   *
   * @param CompanyDetails
   */

  constructor(CompanyDetails) {
    {
      this.PolicyNo = CompanyDetails.PolicyNo || '';
      this.MemberNo = CompanyDetails.MemberNo || '';

      this.AprovAmount = CompanyDetails.AprovAmount || '';
      this.CompDOD = CompanyDetails.CompDOD || '';
      this.IsPharClearance = CompanyDetails.IsPharClearance || '';
      this.IPNumber = CompanyDetails.IPNumber || '';
      this.EstimatedAmount = CompanyDetails.EstimatedAmount || '';
      this.ApprovedAmount = CompanyDetails.ApprovedAmount || '';
      this.HosApreAmt = CompanyDetails.HosApreAmt || '';
      this.PathApreAmt = CompanyDetails.PathApreAmt || '';
      this.PharApreAmt = CompanyDetails.PharApreAmt || '';
      this.RadiApreAmt = CompanyDetails.RadiApreAmt || '';
      this.PharDisc = CompanyDetails.HDiscAmt || '';

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
      this.H_BillNo = CompanyDetails. H_BillNo || '';
      this.H_TotalAmt = CompanyDetails. H_TotalAmt || '';
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