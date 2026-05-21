import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AbhaService } from '../abha.service';
import { CreateAbhaResult } from '../abha-model';


@Component({
    selector: 'app-create-aadhaar',
    templateUrl: './create-aadhaar.component.html',
    styleUrls: ['./create-aadhaar.component.scss'],
})
export class CreateAadhaarComponent {
    loading = false;
    txnId = '';
    mobileNeedsOtp = false;
    maskedAadhaarMobile = '';

    aadhaarForm: FormGroup;
    aadhaarOtpForm: FormGroup;
    mobileOtpForm: FormGroup;
    consent = false;

    constructor(
        private fb: FormBuilder,
        private abha: AbhaService,
        private snack: MatSnackBar,
        private router: Router
    ) {
        this.aadhaarForm = this.fb.group({
            aadhaar: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
        });
        this.aadhaarOtpForm = this.fb.group({
            otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
            mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
        });
        this.mobileOtpForm = this.fb.group({
            otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
        });
    }

    // ---- step 1 ----
    sendAadhaarOtp() {
        if (this.aadhaarForm.invalid || !this.consent) {
            this.snack.open('Enter a valid 12-digit Aadhaar and accept consent', 'OK', { duration: 3000 });
            return;
        }
        this.loading = true;
        this.abha.aadhaarGenerateOtp({ AadhaarNumber: this.aadhaarForm.value.aadhaar })
            .pipe(finalize(() => (this.loading = false)))
            .subscribe((r) => {
                if (r.txnId) {
                    this.txnId = r.txnId;
                    this.maskedAadhaarMobile = r.message || '';
                    this.snack.open('OTP sent to Aadhaar-linked mobile', 'OK', { duration: 2500 });
                }
                else {
                    this.snack.open(r.message, 'OK', { duration: 2500 });
                }
            });
    }

    // ---- step 2 ----
    verifyAadhaarOtp() {
        if (this.aadhaarOtpForm.invalid) return;
        this.loading = true;
        const { otp, mobile } = this.aadhaarOtpForm.value;
        this.abha
            .aadhaarVerifyOtp({ txnId: this.txnId, otp, mobile })
            .pipe(finalize(() => (this.loading = false))).subscribe((r) => {
                if (r.txnId) {
                    this.txnId = r.txnId;
                    if (r.newMobileOtpRequired) {
                        this.mobileNeedsOtp = true;
                        this.snack.open('OTP sent to new mobile number', 'OK', { duration: 2500 });
                    } else {
                        this.enrol();
                    }
                }
            });
    }

    // ---- step 2a ----
    verifyMobileOtp() {
        if (this.mobileOtpForm.invalid) return;
        this.loading = true;
        this.abha
            .aadhaarVerifyMobileOtp({ txnId: this.txnId, otp: this.mobileOtpForm.value.otp })
            .pipe(finalize(() => (this.loading = false)))
            .subscribe({
                next: () => this.enrol(),
                error: (e) => this.snack.open(e?.error?.message || 'Invalid mobile OTP', 'OK', { duration: 4000 }),
            });
    }

    // ---- step 3 ----
    private enrol() {
        this.loading = true;
        this.abha
            .aadhaarEnrol(this.txnId)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe({
                next: (res: CreateAbhaResult) => {
                    // store tokens (sessionStorage shown — swap for your auth store)
                    sessionStorage.setItem('abha_token', res.tokens.token);
                    sessionStorage.setItem('abha_profile', JSON.stringify(res.ABHAProfile));
                    this.snack.open('ABHA created successfully', 'OK', { duration: 2500 });
                    this.router.navigate(['/abha/profile']);
                },
                error: (e) => this.snack.open(e?.error?.message || 'Enrolment failed', 'OK', { duration: 4000 }),
            });
    }
}
