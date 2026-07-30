import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { RegistrationService } from 'app/main/opd/registration/registration.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AbhaService } from '../abha.service';
import { AadhaarGenerateOtpResponse } from '../abha-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentlistService } from 'app/main/opd/appointment-list/appointmentlist.service';

@Component({
  selector: 'app-abha-link',
  templateUrl: './abha-link.component.html',
  styleUrls: ['./abha-link.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AbhaLinkComponent {

  abhaForm: FormGroup;
  isProfileData = false
  dateofBirth: any;
  loading = false;
  visitDet: any;
  regNo: any;
  patientName: any;

  constructor(
    private abhaService: AbhaService,
    public _registerService: RegistrationService,
    public _AppointmentlistService: AppointmentlistService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datePipe: DatePipe,
    private snack: MatSnackBar,
    private accountService: AuthenticationService,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) { }

  ngOnInit(): void {

    this.abhaForm = this.createAbhaform();
    this.abhaForm.markAllAsTouched();

    if ((this.data?.abhaTranId ?? 0) > 0) {
      this.isProfileData = true;
      this.regNo = this.data.regNo
      this.patientName = this.data.patientName
      setTimeout(() => {
        this._registerService.getAbhaById(this.data.abhaTranId).subscribe((response) => {
          console.log('Get ABHA DATA', response)
          this.dateofBirth = response.yearOfBirth
          this.abhaForm.patchValue({
            abhaAddress: response.abhaAddress,
            abhaNumber: response.abhaNumber,
            abhaFullName: response.abhaFullName,
            gender: response.gender
          });
        });
      }, 500);
      this._AppointmentlistService.getVisitById(this.data.visitId).subscribe((response) => {
        this.visitDet = response
        console.log('Visit Details', this.visitDet)
      });
    }
  }

  createAbhaform() {
    return this._formBuilder.group({
      abhaTranId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      regId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      abhaNumber: [''],
      abhaFullName: [''],
      abhaAddress: [''],
      gender: [''],
      yearOfBirth: [''],
      verified: [0],
      isActive: [0],
      verifiedDateTime: [new Date()],
      createdBy: this.accountService.currentUserValue.userId
    });
  }

  onSubmit() {
    this.loading = true;
    this.abhaService.GenerateToken({
      abhaNumber: Number(this.abhaForm.value.abhaNumber.replace(/-/g, '')),
      abhaAddress: this.abhaForm.value.abhaAddress,
      name: this.abhaForm.value.abhaFullName,
      gender: this.abhaForm.value.gender.trim(),
      yearOfBirth: new Date(this.dateofBirth).getFullYear(),
      hipId: "AIRMIDABHA",
      xCmId: "sbx"
    })

      .subscribe((r: AadhaarGenerateOtpResponse) => {
        if (r.txnId) {
          this.snack.open(r.message, 'OK', { duration: 2500 });
        }
        else {
          this.snack.open(r.message, 'OK', { duration: 2500 });
        }
        this.loading = false;
      });
    console.log("Generate Token:", this.abhaForm)
  }

  onLink() {
    this.loading = true;
    const payload = {
      abhaNumber: `${this.regNo}${this.visitDet.visitDate.split('T')[0].replace(/-/g, '')}`,
      abhaAddress: this.abhaForm.value.abhaAddress,
      patient: [
        {
          referenceNumber: this.regNo, //`${this.regNo}${this.visitDet.visitDate.split('T')[0].replace(/-/g, '')}`, //"UHID + VISIT_DATE"
          display: this.patientName, //`${this.patientName} - ${this.visitDet.opdno.replace(/\//g,'')}`, //"PatientName + VISIT_OPDNO"
          careContexts: [
            {
              referenceNumber: this.visitDet.opdno,//`${this.regNo}${this.visitDet.opdno.replace(/\//g,'')}`, //"UHID + VISIT_OPDNO" removed date bec opdno also have date
              display: "Prescription"
            }
          ],
          hiType: "Prescription",
          count: 1
        }
      ],
      hipId: "AIRMIDABHA",
      linkToken: "", // Token received from Generate Link Token API
      xCmId: "sbx"
    };

    console.log("Link Token Payload:", payload);

    this.abhaService.LinkToken(payload).subscribe((r: AadhaarGenerateOtpResponse) => {
      if (r.txnId) {
        this.snack.open(r.message, 'OK', { duration: 2500 });
      }
      else {
        this.snack.open(r.message, 'OK', { duration: 2500 });
      }
      this.loading = false;
    });
    // console.log("Link Token Payload:", this.abhaForm)
  }
}
