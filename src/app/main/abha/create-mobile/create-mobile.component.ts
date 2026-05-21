import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AbhaService } from '../abha.service';


@Component({
  selector: 'app-create-mobile',
  templateUrl: './create-mobile.component.html',
  styleUrls: ['./create-mobile.component.scss'],
})
export class CreateMobileComponent {
  loading = false;
  txnId = '';

  mobileForm: FormGroup;
  otpForm: FormGroup;
  profileForm: FormGroup;

  genders = [
    { v: 'M', l: 'Male' },
    { v: 'F', l: 'Female' },
    { v: 'O', l: 'Other' },
  ];

  constructor(
    private fb: FormBuilder,
    private abha: AbhaService,
    private snack: MatSnackBar,
    private router: Router
  ) {
    this.mobileForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    });
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      dayOfBirth: ['', [Validators.required, Validators.pattern(/^(0?[1-9]|[12]\d|3[01])$/)]],
      monthOfBirth: ['', [Validators.required, Validators.pattern(/^(0?[1-9]|1[0-2])$/)]],
      yearOfBirth: ['', [Validators.required, Validators.pattern(/^(19|20)\d{2}$/)]],
      gender: ['', Validators.required],
      email: ['', Validators.email],
      address: [''],
      pinCode: ['', Validators.pattern(/^\d{6}$/)],
      stateCode: [''],
      districtCode: [''],
    });
  }

  sendOtp() {
    if (this.mobileForm.invalid) return;
    this.loading = true;
    this.abha
      .mobileGenerateOtp({ mobile: this.mobileForm.value.mobile })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (r) => {
          this.txnId = r.txnId;
          this.snack.open('OTP sent', 'OK', { duration: 2500 });
        },
        error: (e) => this.snack.open(e?.error?.message || 'Failed to send OTP', 'OK', { duration: 4000 }),
      });
  }

  submit() {
    if (this.profileForm.invalid || this.otpForm.invalid) {
      this.snack.open('Please complete all required fields', 'OK', { duration: 3000 });
      return;
    }
    this.loading = true;
    this.abha
      .mobileEnrol({ txnId: this.txnId, otp: this.otpForm.value.otp, ...this.profileForm.value })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          sessionStorage.setItem('abha_token', res.tokens.token);
          sessionStorage.setItem('abha_profile', JSON.stringify(res.ABHAProfile));
          this.snack.open('ABHA created successfully', 'OK', { duration: 2500 });
          this.router.navigate(['/abha/profile']);
        },
        error: (e) => this.snack.open(e?.error?.message || 'Enrolment failed', 'OK', { duration: 4000 }),
      });
  }
}
