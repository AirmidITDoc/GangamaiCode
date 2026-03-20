import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { ResultEntryService } from '../result-entry.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { DatePipe } from '@angular/common';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Router } from '@angular/router';
import { E } from '@angular/cdk/keycodes';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-report-verify-details',
  templateUrl: './report-verify-details.component.html',
  styleUrls: ['./report-verify-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ReportVerifyDetailsComponent {


  VerifyFormGroup: FormGroup;
  dateTimeObj: any;
  screenFromString = 'advance';
  vPathReportId = 0;
  IsVerified = true
  date: any;
  VerifyPersonName: any;
  constructor(
    public _SampleService: ResultEntryService,
    private formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<ReportVerifyDetailsComponent>,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    console.log(this.data);
    this.VerifyFormGroup = this.createverifyForm();
    this.VerifyFormGroup.markAllAsTouched();

    if (this.data) {
      debugger
      this.vPathReportId = this.data.pathReportId

      this.IsVerified = this.data.isVerified || true

    }
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.date = now.toISOString().slice(0, 16);
  }

  createverifyForm() {
    return this.formBuilder.group({

      pathReportId: [this.vPathReportId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      isVerifyid: [true, Validators.required],
      // verifyPersonName: ['', Validators.required],
      // IsVerifySign: ['', Validators.required],
      isVerifyedDate: ['', [Validators.required]],
      // address: ['', [Validators.required]],

    });
  }

  onSubmit() {
    debugger
    console.log(this.VerifyFormGroup.value)

    if (this.VerifyFormGroup.get('isVerifyid').value)
      this.VerifyFormGroup.get('isVerifyid').setValue(1)
    else
      this.VerifyFormGroup.get('isVerifyid').setValue(0)

    if (!this.VerifyFormGroup.invalid) {

      this._SampleService.PathReportverifyMaster(this.VerifyFormGroup.value).subscribe((response) => {
        this._matDialog.closeAll()
      });
    } else {
      const invalidFields = [];

      if (this.VerifyFormGroup.invalid) {
        for (const controlName in this.VerifyFormGroup.controls) {
          if (this.VerifyFormGroup.controls[controlName].invalid) {
            invalidFields.push(`Lab Form: ${controlName}`);
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

  keyPressAlphanumeric(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }


  pad(n: number) {
    return n < 10 ? '0' + n : n;
  }

  getValidationMessages() {
    return {
      mlcno: [
        { name: "required", Message: "mlcno is required" }
      ],
      authorityName: [
        { name: "required", Message: "authorityName is required" }
      ],
      buckleNo: [
        { name: "required", Message: "buckleNo is required" }
      ],
      policeStation: [
        { name: "required", Message: "policeStation is required" }
      ]
    };
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClose() {
    this.dialogRef.close();
  }

}
