import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdmissionService } from '../Admission/admission/admission.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from '../advance';
import { AdvanceDetailObj } from '../ip-search-list/ip-search-list.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company-information',
  templateUrl: './company-information.component.html',
  styleUrls: ['./company-information.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CompanyInformationComponent implements OnInit {
  companyFormGroup:FormGroup;
  dateTimeObj: any;
  screenFromString = 'discharge';
  selectedAdvanceObj: AdvanceDetailObj;
  registerObj1: AdvanceDetailObj;
  AdmissionID:any;
  constructor(
    public _AdmissionService: AdmissionService,
    public datePipe: DatePipe,
    private router: Router,
    private dialogRef: MatDialogRef<CompanyInformationComponent>,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,

    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
  

  ) { }


  ngOnInit(): void {
    this.companyFormGroup = this.createCompanyForm();
     
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj);
      this.registerObj1 = this.selectedAdvanceObj;
      this.AdmissionID= this.registerObj1.AdmissionID
      console.log(this.registerObj1);
    
  
    }
    this.companyFormGroup = this.createCompanyForm();
  }



  createCompanyForm() {

    return this.formBuilder.group({
      PolicyNo:[''],
      MemberNo:[''],
      ClaimNo:[''],
      BillToTpa:'',
      PAdvance:'',
      EstimatAmt:'',
      ApprovBYTpa:'',
      InvestigationPaid:'',
      AppHospitalAmt:'',
      DisallowAmt:'',
      NetAmtRefund:'',
      PathAmt:'',
      DiscByTpa:'',
      RefundAmt:'',
      RadiAmt:'',
      DiscByManagement:'',
      PharmacyAmt:'',
      RecoverAmtbyPatient:'',
      MedicalAmt:''     
      
      
    });

  }

  keyPressCharater(event){
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

 
  Save(){
    var m_data = {
      "companyUpdate":{
        "AdmissionId": this.AdmissionID,// this.companyFormGroup.get('AdmissionId').value || 0,
        "policyNo": this.companyFormGroup.get('PolicyNo').value || "",
        "claimNo": this.companyFormGroup.get('ClaimNo').value || "",
         "estimatedAmount": this.companyFormGroup.get('EstimatAmt').value || 0,
         "approvedAmount":this.companyFormGroup.get('ApprovBYTpa').value || 0,
        "hosApreAmt":this.companyFormGroup.get('AppHospitalAmt').value || 0,
        "pathApreAmt": this.companyFormGroup.get('PathAmt').value || 0,
        "PharApreAmt": this.companyFormGroup.get('PharmacyAmt').value || 0,
        "radiApreAmt": this.companyFormGroup.get('RadiAmt').value  || 0,
        "c_DisallowedAmt": this.companyFormGroup.get('DisallowAmt').value || 0,
        "compDiscount": this.companyFormGroup.get('DiscByTpa').value || 0,
        "hDiscAmt": this.companyFormGroup.get('DiscByManagement').value || 0,
        "c_OutsideInvestAmt": this.companyFormGroup.get('InvestigationPaid').value || 0,
        "recoveredByPatient" : this.companyFormGroup.get('RecoverAmtbyPatient').value || 0,
        "medicalApreAmt" :this.companyFormGroup.get('MedicalAmt').value.SubCompanyId || 0,
        "C_FinalBillAmt": this.companyFormGroup.get('BillToTpa').value || 0,
       
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

  onClose(){
this.dialogRef.close();
  }
}
