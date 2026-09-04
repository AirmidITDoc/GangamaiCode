import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, MinValidator } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MrdService } from '../../mrd.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';

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
  vCertificateID: any;
  showOpIpControls = true;
  registerObj = new AdmissionPersonlModel({});

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

    if (this.data?.opIpId) { // used to hide OPIPControls search textbox
      this.showOpIpControls = false;
    }

    if (this.data.docId > 0) {
      this.vCertificateID = this.data.docId;

      setTimeout(() => {

        // this._mrdService.getAdmissionById(this.data.opIpId).subscribe((response) => {
        //   this.registerObj = response;
        //   console.log("getAdmissionById", response)

        //   this._mrdService.getRegistraionById(response.regId).subscribe((response) => {
        //     console.log("getRegistraionById", response)
        //     this.vPatientName =
        //       (response.firstName || '') + ' ' +
        //       (response.middleName || '') + ' ' +
        //       (response.lastName || '');

        //     this.vRegNo = response.regNo
        //     this.vgender = response.genderId;
        //     this.vDOA = response.regDate;
        //     this.vTariffName = response.tariffId;
        //     this.vCompanyName = response.companyId;
        //     this.vopIpId = response.admissionID;
        //   })

        //All form deatils
        this._mrdService.getDeathDetailsById(this.data.docId).subscribe((response) => {
          console.log("Infooooooooooooooooooo", response)

          // Convert API time to HH:mm for the time field
          let formattedTimeOfDeath = '';

          if (response.timeOfDeath) {
            const date = new Date(response.timeOfDeath);
            formattedTimeOfDeath =
              this.datePipe.transform(date, 'HH:mm') || '';
          }
          this.vopIpId = this.data.opIpId;
          this.deathCertificateForm.patchValue({
            opIpId: this.data.opIpId,
            dateofDeath: response.dateofDeath,
            timeOfDeath: formattedTimeOfDeath,
            causeofDeath: response.causeofDeath,
            placeOfDeath: response.placeOfDeath,
            responsiblePersonName: response.responsiblePersonName,
            smcno: response.smcno,
            diagnsis: response.diagnsis
          });
        })

        // });


      }, 100);

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
