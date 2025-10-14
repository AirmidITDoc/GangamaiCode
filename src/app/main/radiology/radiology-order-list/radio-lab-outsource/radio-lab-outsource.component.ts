import { Component, Inject } from '@angular/core';
import { RadioloyOrderlistService } from '../radioloy-orderlist.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-radio-lab-outsource',
  templateUrl: './radio-lab-outsource.component.html',
  styleUrls: ['./radio-lab-outsource.component.scss']
})
export class RadioLabOutsourceComponent {

  LabFormGroup: FormGroup;
  dateTimeObj: any;
  screenFromString = 'advance';
  outSourceId = 0;
  outSourceLabName: any;
  outSourceStatus=1;
  date: any;
  date1: any;
  LabName='';
  vradReportId: any;
  autocompleteModeoutsource: string = "OutsourceLab";
  constructor(
    public _RadioloyOrderlistService: RadioloyOrderlistService,
    private formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<RadioLabOutsourceComponent>,
    private router: Router
  ) {

  }
  Reportdatestatus=false
  ngOnInit(): void {
    console.log(this.data);
    this.LabFormGroup = this.createLabForm();
    this.LabFormGroup.markAllAsTouched();
     var now = new Date();
     var now1 = new Date()
debugger
    if (this.data) {
      this.vradReportId = this.data.radReportId
      this.outSourceId = this.data.outSourceId || 0;
      this.outSourceLabName = this.data.outSourceLabName;
      this.outSourceStatus = this.data.outSourceStatus ;
     if(this.outSourceId>0){
      this.Reportdatestatus=true
      this.date1 = now1.toISOString().slice(0, 16);
     }
    }
   
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
     now1.setMinutes(now1.getMinutes() - now1.getTimezoneOffset());
    // this.date = now.toISOString().slice(0, 16);

    debugger
    if(this.data.outSourceSampleSentDateTime!=undefined)
    this.date= new Date(this.data.outSourceSampleSentDateTime).toISOString().slice(0,16)
else
   this.date= new Date().toISOString().slice(0,16)
    // this.date1 = now1.toISOString().slice(0, 16);

   
  }


  createLabForm() {
    return this.formBuilder.group({
      radReportId: [this.vradReportId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      outSourceId: [this.outSourceId],
      outSourceLabName: [ this.LabName, [Validators.required]],
      outSourceSampleSentDateTime: [''],
      outSourceStatus: [1],
      outSourceReportCollectedDateTime: ['1900-01-01 00:00:00.000'],
      outSourceCreatedBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      outSourceCreatedDateTime: [new Date().toISOString()],
      outSourceModifiedby: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      outSourceModifiedDateTime: [new Date().toISOString()],
    });
  }

    onChangeLab(e) {
      console.log(e)
    this.outSourceId=e.value
    this.LabName = e.text
    }

  onSubmit() {
    
    if (this.LabFormGroup.get('outSourceStatus').value)
      this.LabFormGroup.get('outSourceStatus').setValue(1)
    else
      this.LabFormGroup.get('outSourceStatus').setValue(0)
    this.LabFormGroup.get('outSourceLabName').setValue(this.LabName)
    
debugger
    if(this.outSourceId==0)
       this.LabFormGroup.get('outSourceReportCollectedDateTime').setValue("01/01/1900")

      else
         this.LabFormGroup.get('outSourceReportCollectedDateTime').setValue(this.date1)

    console.log(this.LabFormGroup.value)
    if (!this.LabFormGroup.invalid) {

      this._RadioloyOrderlistService.updatelabourMaster(this.LabFormGroup.value).subscribe((response) => {
        this._matDialog.closeAll()
      });
    } else {
      let invalidFields = [];

      if (this.LabFormGroup.invalid) {
        for (const controlName in this.LabFormGroup.controls) {
          if (this.LabFormGroup.controls[controlName].invalid) {
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
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }


  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClose() {
    this.dialogRef.close();
  }

}

