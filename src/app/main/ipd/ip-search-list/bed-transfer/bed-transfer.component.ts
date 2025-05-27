import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { AdmissionPersonlModel, RegInsert } from '../../Admission/admission/admission.component';
import { AdvanceDataStored } from '../../advance';
import { IPSearchListComponent } from '../ip-search-list.component';
import { IPSearchListService } from '../ip-search-list.service';

@Component({
  selector: 'app-bed-transfer',
  templateUrl: './bed-transfer.component.html',
  styleUrls: ['./bed-transfer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BedTransferComponent implements OnInit {
  Bedtransfer: FormGroup;
  
  screenFromString = 'admission-form';
  currentDate = new Date();
  dateTimeObj: any;

  vWardId: any = 0;
  vBedId: any = 0;
  vClassId: any = 0;
  AdmissionId = 0

  menuActions: Array<string> = [];
  advanceAmount: any = 0;

  autocompleteroom: string = "Room";
  autocompleteclass: string = "Class";
  autocompletebed: string = "Bed";
  registerObj1 = new AdmissionPersonlModel({});
  registerObj = new RegInsert({});
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
  @ViewChild('ddlClassName') ddlClassName: AirmidDropDownComponent;


  constructor(public _IpSearchListService: IPSearchListService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
     private _FormvalidationserviceService: FormvalidationserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<IPSearchListComponent>,
    private _formBuilder: UntypedFormBuilder
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.registerObj1 = this.data
      console.log("Data:", this.registerObj1);
      this.Bedtransfer = this.bedsaveForm();
      this.Bedtransfer.markAllAsTouched();

      this.AdmissionId = this.data.admissionId;
      // this.Bedtransfer.get("toWardId").setValue(this.registerObj1.wardId)
      // this.Bedtransfer.get("toBedId").setValue(this.registerObj1.bedId)
      // this.Bedtransfer.get("toClassId").setValue(this.registerObj1.classId)
    }

    if ((this.data?.regId ?? 0) > 0) {
      setTimeout(() => {
        this._IpSearchListService.getRegistraionById(this.data.regId).subscribe((response) => {
          this.registerObj = response;
        });

        this._IpSearchListService.getAdmissionById(this.data.admissionId).subscribe((response) => {
          this.registerObj1 = response;
          if (this.registerObj1) {
            this.registerObj1.phoneNo = this.registerObj1.phoneNo.trim()
            this.registerObj1.mobileNo = this.registerObj1.mobileNo.trim()
            this.registerObj1.admissionTime = this.datePipe.transform(this.registerObj1.admissionTime, 'hh:mm:ss a')
            this.registerObj1.dischargeTime = this.datePipe.transform(this.registerObj1.dischargeTime, 'hh:mm:ss a')
          }
          console.log(this.registerObj1)
        });
      }, 500);
    }
   
  }
  onChangeWard(e) {
    this.ddlClassName.SetSelection(e.classId);
    }
  

  bedsaveForm(): FormGroup {
    return this._formBuilder.group({
      transferId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      admissionId: this.registerObj1.admissionId,
      fromDate: [(new Date()).toISOString()],
      fromTime: [(new Date()).toISOString()],
      fromWardId: [this.registerObj1.wardId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      fromBedId:[this.registerObj1.bedId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      fromClassId:[this.registerObj1.classId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      toDate: [(new Date()).toISOString()],
      toTime: [(new Date()).toISOString()],
      toWardId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      toBedId:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      toClassId:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      remark: "",
      addedBy:[this.accountService.currentUserValue.userId,this._FormvalidationserviceService.notEmptyOrZeroValidator()],
      isCancelled: 0,
      isCancelledBy: 0
    });
  }


  selectChangedepartment(obj: any) {
   this._IpSearchListService.getbedbyRoom(obj.value).subscribe((data: any) => {
        this.ddlDoctor.options = data;
        this.ddlDoctor.bindGridAutoComplete();
    });
}


  onBedtransfer() {
   console.log(this.Bedtransfer.value)
  if(!this.Bedtransfer.invalid){
    var m_data = {
      "bedTransfer": this.Bedtransfer.value,
      "bedTofreed": { bedId: this.data.bedId },
      "bedUpdate": { bedId: parseInt(this.Bedtransfer.get("toBedId").value)}, 
      "admssion": {
        "admissionId": this.AdmissionId,
        "bedId": this.Bedtransfer.get("toBedId").value,//this.vBedId,
        "wardId": this.Bedtransfer.get("toWardId").value,// this.vWardId,
        "classId": this.Bedtransfer.get("toClassId").value//this.vClassId,
      }
    }

    console.log(m_data);

    this._IpSearchListService.BedtransferUpdate(m_data).subscribe((response) => {
      this.toastr.success(response.message);
      this._matDialog.closeAll()
      // this.onClear(true);
    }, (error) => {
      this.toastr.error(error.message);
    });
  }
  else {
    let invalidFields = [];

    if (this.Bedtransfer.invalid) {
      for (const controlName in this.Bedtransfer.controls) {
        if (this.Bedtransfer.controls[controlName].invalid) {
          invalidFields.push(`Bed Transfer Form: ${controlName}`);
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

  onClear(val: boolean) {
    this.Bedtransfer.reset();

  }
  onClose() {
    this.dialogRef.close();
  }

  getValidationMessages() {
    return {
      toWardId: [
        { name: "required", Message: "Room Name is required" }
      ],
      toBedId: [
        { name: "required", Message: "Bed Name is required" }
      ],
      ClassId: [
        { name: "required", Message: "Class Name is required" }
      ]
    };
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

}

