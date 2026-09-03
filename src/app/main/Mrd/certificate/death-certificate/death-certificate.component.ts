import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, MinValidator } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MrdService } from '../../mrd.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-death-certificate',
  templateUrl: './death-certificate.component.html',
  styleUrls: ['./death-certificate.component.scss']
})
export class DeathCertificateComponent {

  screenFromString = 'Common-form';
  dateTimeObj: any;
  today = new Date();
  deathCertificateForm: FormGroup;

  ////////////// search variables /////////////
  patientDetailsObj: any = {};

  vPatientName: any;
  vDOA: any;
  vRefDocName: any;
  vPatientType: any;
  vTariffName: any;
  vCompanyName: any;
  vRoomName: any;
  vBedName: any;
  vgender: any;
  vopIpId: any;
  vRegNo: any;

  IpFilterDisable = false;
  ////////////// search variables /////////////

  vCertificateID: any;

  constructor(private _formBuilder: FormBuilder, private _FormvalidationserviceService: FormvalidationserviceService,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<DeathCertificateComponent>,
    public _mrdService: MrdService, public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.deathCertificateForm = this.createDeathCertificateForm();
    this.deathCertificateForm.markAllAsTouched();

    console.log("death data info", this.data);
    console.log("certificateId", this.data.docId);

    if (this.data.docId > 0) {
      this.vCertificateID = this.data.docId;
      console.log("edit ID", this.vCertificateID)

      setTimeout(() => {

        this._mrdService.getAdmissionById(this.data.opIpId).subscribe((response) => {

          console.log("djgfdfsh", response)

          this._mrdService.getRegistraionById(response.regId).subscribe((response) => {
            this.vPatientName =
              (response.firstName || '') + ' ' +
              (response.middleName || '') + ' ' +
              (response.lastName || '');

            this.vRegNo = response.regNo
            this.vgender = response.genderName;
            this.vDOA = response.admissionDate;
            this.vRefDocName = response.refDocName;
            this.vPatientType = response.patientType;
            this.vTariffName = response.tariffName;
            this.vCompanyName = response.companyName;
            this.vRoomName = response.roomName;
            this.vBedName = response.bedName;
            this.vopIpId = response.admissionID;
          });

        });
      }, 100);

      // Convert API time to HH:mm for the time field
      let formattedTimeOfDeath = '';

      if (this.data.timeOfDeath) {
        const date = new Date(this.data.timeOfDeath);
        formattedTimeOfDeath =
          this.datePipe.transform(date, 'HH:mm') || '';
      }

      this.deathCertificateForm.patchValue({
        ...this.data,
        timeOfDeath: formattedTimeOfDeath,
        // certificateId: this.data.docId
      });
    }
  }



  createDeathCertificateForm(): FormGroup {
    return this._formBuilder.group({
      certificateId: [0],
      // certificateNo: 'CERT-0001',
      certificateDate: [new Date()],
      certificateTime: '',
      opIpId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      opIpType: [true],
      dateofDeath: ['', [Validators.required]],
      timeOfDeath: '',
      causeofDeath: ['', [Validators.required]],
      placeOfDeath: [''],
      responsiblePersonName: [''],
      smcno: [''],
      diagnsis: ['']
    });
  }

  getSelectedObjIP(obj: any): void {
    if ((obj?.regID ?? 0) > 0) {

      this.patientDetailsObj = obj;

      this.vPatientName =
        (obj.firstName || '') + ' ' +
        (obj.middleName || '') + ' ' +
        (obj.lastName || '');

      this.vRegNo = obj.regNo
      this.vgender = obj.genderName
      this.vDOA = obj.admissionDate;
      this.vRefDocName = obj.refDocName;
      this.vPatientType = obj.patientType;
      this.vTariffName = obj.tariffName;
      this.vCompanyName = obj.companyName;
      this.vRoomName = obj.roomName;
      this.vBedName = obj.bedName;
      this.vopIpId = obj.admissionID;

      console.log('Search Patient Info:', this.patientDetailsObj);
    }
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  onClose(val: boolean) {
    this.deathCertificateForm.reset();
    this.dialogRef.close(val);
  }


  onSubmit(): void {

    const opIpId = this.deathCertificateForm.get('opIpId')?.value;

    if (this.deathCertificateForm.get('dateofDeath')?.value > this.today) {
      this.toastr.warning('Enter Proper Death Date', 'warning !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    }

    if (!this.deathCertificateForm.get("timeOfDeath")?.value) {
      this.toastr.warning('Please enter time of Death', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }


    // debugger

    //certificate date
    const certificateDateValue = this.deathCertificateForm.get('certificateDate')?.value;
    const certificateDate = this.datePipe.transform(certificateDateValue, "yyyy-MM-dd'T'00:00:00");
    this.deathCertificateForm.get('certificateDate').setValue(certificateDate);


    //certificate time
    const certificateDateTime = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd');
    const certificateTime = this.dateTimeObj.time.trim();
    const dateTime = new Date(`${certificateDateTime} ${certificateTime}`);
    const formattedCertificateTime = this.datePipe.transform(dateTime, "yyyy-MM-dd'T'HH:mm:ss");
    this.deathCertificateForm.get('certificateTime')?.setValue(formattedCertificateTime);

    //death date
    const dateOfDeath = this.deathCertificateForm.get('dateofDeath')?.value;
    const formattedDateOfDeath = this.datePipe.transform(dateOfDeath, "yyyy-MM-dd'T'00:00:00");
    this.deathCertificateForm.get('dateofDeath')?.setValue(formattedDateOfDeath);


    //death time
    const timeOfDeath = this.deathCertificateForm.get('timeOfDeath')?.value?.trim();
    const formattedDate = this.datePipe.transform(dateOfDeath, 'yyyy-MM-dd');
    const formattedTimeOfDeath = `${formattedDate}T${timeOfDeath}:00`;
    this.deathCertificateForm.get('timeOfDeath')?.setValue(formattedTimeOfDeath);

    this.deathCertificateForm.get('opIpId').setValue(this.vopIpId);


    if (this.deathCertificateForm.valid) {
      console.log("After Submit", this.deathCertificateForm.value)

      this.deathCertificateForm.get('certificateId').setValue(this.vCertificateID ?? 0);
      this._mrdService.deathCertificateSave(this.deathCertificateForm.value).subscribe({
        next: (response) => {
          // console.log('API Response:', response);
          this.onClose(true);
        },
        error: (err) => {
          console.error('Error:', err);
        },
        complete: () => {
          console.log('Request complete');
        }
      });
    } else {
      const invalidFields = [];

      if (this.deathCertificateForm.invalid) {
        for (const controlName in this.deathCertificateForm.controls) {
          if (this.deathCertificateForm.controls[controlName].invalid) {
            invalidFields.push(`Death Certificate Form: ${controlName}`);
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
}
