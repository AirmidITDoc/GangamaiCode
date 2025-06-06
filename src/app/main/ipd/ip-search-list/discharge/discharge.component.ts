import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { AdmissionPersonlModel, RegInsert } from '../../Admission/admission/admission.component';
import { AdvanceDataStored } from '../../advance';
import { AdvanceDetailObj } from '../ip-search-list.component';
import { IPSearchListService } from '../ip-search-list.service';
import { InitiateDischargeComponent } from './initiate-discharge/initiate-discharge.component';

@Component({
  selector: 'app-discharge',
  templateUrl: './discharge.component.html',
  styleUrls: ['./discharge.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DischargeComponent implements OnInit {
  DischargeForm: FormGroup;
  DischargeInsertForm: FormGroup;
  currentDate = new Date();
  screenFromString = 'discharge';

  DischargeId: any = 0;

  RtrvDischargeList: any = [];
  vComments: any;
  IsCancelled: any;
  dateTimeObj: any;
  vAdmissionId: any;
  vMode: any = 0;
  vDoctorId: any = 0;
  vDescType: any = 0;
  vBedId = 0;
  ChkConfigInitiate: boolean = false;
  isTimeChanged: boolean = false;
  dateTimeString: any;
  timeflag = 0
  public now: Date = new Date();
  minDate: Date;
  Today: Date = new Date();
  selectedAdvanceObj: AdvanceDetailObj;
  registerObj1 = new AdmissionPersonlModel({});
  registerObj = new RegInsert({});
  // dischargeTypeId = 0;
  // modeOfDischargeId = 0;
  autocompletcondoc: string = "ConDoctor";
  autocompletedichargetype: string = "DichargeType";
  autocompletemode: string = "ModeOfDischarge";

  constructor(
    public _IpSearchListService: IPSearchListService,
    private _formBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<DischargeComponent>,
    public toastr: ToastrService,
    public _ConfigService: ConfigService,
    private commonService: PrintserviceService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private accountService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
    }
    setInterval(() => {
      this.now = new Date();
      this.dateTimeString = this.now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      if (!this.isTimeChanged) {
        this.DischargeInsertForm.get('discharge.dischargeTime')?.setValue(this.now);
        if (this.DischargeInsertForm.get('discharge.dischargeTime'))
          this.DischargeInsertForm.get('discharge.dischargeTime')?.setValue(this.now);
      }
    }, 1);
  }

  ngOnInit(): void {
    this.DischargeForm = this.DischargesaveForm();
    this.DischargeForm.markAllAsTouched();
    this.DischargeInsertForm = this.DischargeinsertForm();
    this.DischargeInsertForm.markAllAsTouched();

    if (this.data) {
      console.log(this.data)
      this.vAdmissionId = this.data.admissionId;
      this.vBedId = this.data.bedId
      this.DischargeForm.get("dischargedDocId")?.setValue(this.data.docNameId)
      this.DischargeInsertForm.get("discharge.admissionId")?.setValue(this.data.admissionId)
      this.DischargeInsertForm.get("admission.admissionId")?.setValue(this.data.admissionId)
      this.DischargeInsertForm.get("bed.bedId")?.setValue(this.data.bedId)
      setTimeout(() => {
        this._IpSearchListService.getRegistraionById(this.data.regId).subscribe((response) => {
          this.registerObj = response;
        });
      }, 500);

      if (this.data.isDischarged === 1) {
        setTimeout(() => {
          this._IpSearchListService.getDischargeId(this.vAdmissionId).subscribe((response) => {
            console.log("DischargeID", response);
            this.DischargeId = response.dischargeId;
            this.DischargeForm.get("dischargedDocId")?.setValue(response.dischargedDocId)
          });
        }, 500);
      } else {
        this.DischargeId = 0;
      }

    }
    console.log(this._ConfigService.configParams.IsDischargeInitiateflow)
    if (this._ConfigService.configParams.IsDischargeInitiateflow == 1)
      this.ChkConfigInitiate = false
    else
      this.ChkConfigInitiate = true
    this.getchkConfigInitiate();
  }

  docName(event) {
    console.log(event)
  }

  selctdischargeType(event) {
    console.log(event)

  }
  modeOfDischarge(event) {
    console.log(event)
  }

  DischargesaveForm(): FormGroup {
    return this._formBuilder.group({
      dischargeId: this.DischargeId,
      dischargeTypeId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      dischargedDocId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      modeOfDischargeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }

  // changed by raksha date:6/6/25
  DischargeinsertForm(): FormGroup {
    return this._formBuilder.group({
      discharge: this._formBuilder.group({
        admissionId: [0, [
          Validators.required,
          this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator
        ]],
        dischargeDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), this._FormvalidationserviceService.validDateValidator()],
        dischargeTime: [this.datePipe.transform(new Date(), 'shortTime')],
        dischargeTypeId: [0], //validation applied in mainform
        dischargedDocId: [0], //validation applied in mainform
        dischargedRmoid: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        modeOfDischargeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        addedBy: [this.accountService.currentUserValue.userId, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
        modifiedBy: [this.accountService.currentUserValue.userId, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
        dischargeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }),

      admission: this._formBuilder.group({
        admissionId: [0, [
          Validators.required,
          this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator
        ]],
        dischargeDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        dischargeTime: this.datePipe.transform(new Date(), 'shortTime'),
        isDischarged: [1],
      }),

      bed: this._formBuilder.group({
        bedId: [0, [
          Validators.required,
          this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator
        ]]
      })
    });
  }

  onDischarge() {
    debugger
    this.DischargeInsertForm.get('discharge.dischargeTypeId')?.setValue(Number(this.DischargeForm.get("dischargeTypeId").value))
    this.DischargeInsertForm.get('discharge.dischargedDocId')?.setValue(Number(this.DischargeForm.get("dischargedDocId").value) || 0)
    this.DischargeInsertForm.get('discharge.modeOfDischargeId')?.setValue(Number(this.DischargeForm.get("modeOfDischargeId").value) || 0)
    this.DischargeInsertForm.get("discharge.dischargeDate")?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd')),
      this.DischargeInsertForm.get("discharge.dischargeTime")?.setValue(this.dateTimeObj.time)
    this.DischargeInsertForm.get("admission.dischargeDate")?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd')),
      this.DischargeInsertForm.get("admission.dischargeTime")?.setValue(this.dateTimeObj.time)

    if (!this.DischargeForm.invalid && !this.DischargeInsertForm.invalid) {

      if (this.data.isDischarged == 0) {
        (this.DischargeInsertForm.get('discharge') as FormGroup).removeControl('modifiedBy');
        console.log(this.DischargeInsertForm.value)

        this._IpSearchListService.DichargeInsert(this.DischargeInsertForm.value).subscribe((response) => {
          this.viewgetDischargeSlipPdf(response)
          this._matDialog.closeAll();
        });
      }
      else if (this.data.isDischarged == 1) {
        this.DischargeInsertForm.get('discharge.dischargeId')?.setValue(this.DischargeId);
        (this.DischargeInsertForm.get('discharge') as FormGroup).removeControl('admissionId');
        this.DischargeInsertForm.removeControl('bed')
        console.log(this.DischargeInsertForm.value)

        this._IpSearchListService.DichargeUpdate(this.DischargeInsertForm.value).subscribe((response) => {
          this.viewgetDischargeSlipPdf(response)
          this._matDialog.closeAll();
        });
      }
      this.DischargeForm.reset();
    } else {
      let invalidFields = [];

      if (this.DischargeForm.invalid) {
        for (const controlName in this.DischargeForm.controls) {
          if (this.DischargeForm.controls[controlName].invalid) {
            invalidFields.push(`Discharge Form: ${controlName}`);
          }
        }
      }
      if (this.DischargeInsertForm.invalid) {
        for (const controlName in this.DischargeInsertForm.controls) {
          const control = this.DischargeInsertForm.get(controlName);

          if (control instanceof FormGroup || control instanceof FormArray) {
            for (const nestedKey in control.controls) {
              if (control.get(nestedKey)?.invalid) {
                invalidFields.push(`Nested Data : ${controlName}.${nestedKey}`);
              }
            }
          } else if (control?.invalid) {
            invalidFields.push(`DischargeInsert Fomr: ${controlName}`);
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

  viewgetDischargeSlipPdf(data) {
    this.commonService.Onprint("AdmId", data, "IpDischargeReceipt");
  }
  getValidationMessages() {
    return {
      dischargeTypeId: [
        { name: "required", Message: "DischargeType Name is required" }
      ],
      dischargedDocId: [
        { name: "required", Message: "Doctor Name is required" }
      ],
      modeOfDischargeId: [
        // { name: "required", Message: "Mode Name is required" }
      ]
    };
  }

  onClose() {
    this.DischargeForm.reset();
    this.dialogRef.close();
  }

  vApproved_Cnt: any;
  vDeptCount: any;
  getchkConfigInitiate() {
    var data = {}
    this._IpSearchListService.getchkConfigInitiate(data).subscribe((data) => {
      console.log(data)
      if (data) {
        this.vApproved_Cnt = data[0]?.Approved_Cnt
        this.vDeptCount = data[0]?.DeptCount

      }
    })
  }


  DischargeInitiate() {
    if (this.selectedAdvanceObj.IsInitinatedDischarge == '1') {
      this.toastr.warning('selected patient already Initiated ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    const dialogRef = this._matDialog.open(InitiateDischargeComponent,
      {
        maxWidth: "50vw",
        height: '72%',
        width: '100%',
        data: {
          Obj: this.data
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    });
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
}

