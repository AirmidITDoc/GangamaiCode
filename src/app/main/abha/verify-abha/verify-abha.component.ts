import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AbhaLoginMethod } from '../abha-model';
import { AbhaService } from '../abha.service';

@Component({
  selector: 'app-verify-abha',
  templateUrl: './verify-abha.component.html',
  styleUrls: ['./verify-abha.component.scss'],
})
export class VerifyAbhaComponent {
  loading = false;
  txnId = '';

  methods: { v: AbhaLoginMethod; l: string; placeholder: string; pattern: RegExp; maxLen: number }[] = [
    { v: 'mobile',       l: 'Mobile number',  placeholder: 'e.g. 9876543210',     pattern: /^[6-9]\d{9}$/,            maxLen: 10 },
    { v: 'aadhaar',      l: 'Aadhaar number', placeholder: '12-digit Aadhaar',    pattern: /^\d{12}$/,                maxLen: 12 },
    { v: 'abha-number',  l: 'ABHA number',    placeholder: 'XX-XXXX-XXXX-XXXX',   pattern: /^\d{2}-?\d{4}-?\d{4}-?\d{4}$/, maxLen: 17 },
    { v: 'abha-address', l: 'ABHA address',   placeholder: 'yourname@sbx',        pattern: /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]+$/, maxLen: 64 },
  ];

  identifierForm: FormGroup;
  otpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private abha: AbhaService,
    private snack: MatSnackBar,
    private router: Router
  ) {
    this.identifierForm = this.fb.group({
      method: ['mobile', Validators.required],
      value: ['', Validators.required],
    });
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });

    this.identifierForm.get('method')!.valueChanges.subscribe(() => {
      this.identifierForm.get('value')!.reset('');
      this.txnId = '';
    });
  }

  get currentMethod() {
    return this.methods.find((m) => m.v === this.identifierForm.value.method)!;
  }

  sendOtp() {
    const m = this.currentMethod;
    const v = this.identifierForm.value.value as string;
    if (!m.pattern.test(v)) {
      this.snack.open(`Invalid ${m.l.toLowerCase()}`, 'OK', { duration: 3000 });
      return;
    }
    this.loading = true;
    this.abha
      .loginGenerateOtp({ method: m.v, value: v })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (r) => {
          this.txnId = r.txnId;
          this.snack.open('OTP sent', 'OK', { duration: 2500 });
        },
        error: (e) => this.snack.open(e?.error?.message || 'Failed to send OTP', 'OK', { duration: 4000 }),
      });
  }

  verify() {
    if (this.otpForm.invalid) return;
    this.loading = true;
    this.abha
      .loginVerifyOtp({
        txnId: this.txnId,
        otp: this.otpForm.value.otp,
        method: this.identifierForm.value.method,
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          sessionStorage.setItem('abha_token', res.tokens.token);
          sessionStorage.setItem('abha_profile', JSON.stringify(res.ABHAProfile));
          this.snack.open('Logged in', 'OK', { duration: 2000 });
          this.router.navigate(['/abha/profile']);
        },
        error: (e) => this.snack.open(e?.error?.message || 'Invalid OTP', 'OK', { duration: 4000 }),
      });
  }
}
