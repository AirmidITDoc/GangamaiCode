import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdmissionService } from '../Admission/admission/admission.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from '../advance';

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


  Save(){

  }


  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClose(){
this.dialogRef.close();
  }
}
