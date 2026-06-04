import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AadhaarGenerateOtpResponse, AbhaOtpVerify, AbhaProfile } from '../../abha-model';
import { AbhaService } from '../../abha.service';
import { AbhaValidators } from '../../abha.validators';

/**
 * Two-step flow:
 *   1. Aadhaar Number entry → POST /v3/profile/login/request/otp (loginHint=aadhaar)
 *   2. 6-digit OTP entry → POST /v3/profile/login/verify
 */
@Component({
    selector: 'app-verify-by-aadhaar',
    templateUrl: './verify-by-aadhaar.component.html',
    styleUrls: ['./method-shared.scss']
})
export class VerifyByAadhaarComponent implements OnInit {
    @Output() verified = new EventEmitter<AbhaProfile>();

    step: 1 | 2 = 1;
    aadhaarForm!: FormGroup;
    otpForm!: FormGroup;

    loading = false;
    resendRemaining = 2;
    txnId = '';

    demoAadhaar: string;
    demoOtp: string;

    constructor(
        private fb: FormBuilder,
        private abhaService: AbhaService,
        private snack: MatSnackBar
    ) {
        // this.demoAadhaar = svc.DEMO_AADHAAR;
        // this.demoOtp = svc.DEMO_OTP;
    }

    ngOnInit(): void {
        this.aadhaarForm = this.fb.group({
            aadhaar: ['', [Validators.required, AbhaValidators.aadhaar]]
        });
        this.otpForm = this.fb.group({
            otp: ['', [Validators.required, AbhaValidators.otp]]
        });
    }

    onAadhaarInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const d = input.value.replace(/\D/g, '').slice(0, 12);
        if (input.value !== d) {
            input.value = d;
            this.aadhaarForm.get('aadhaar')?.setValue(d);
        }
    }

    onOtpInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const d = input.value.replace(/\D/g, '').slice(0, 6);
        if (input.value !== d) {
            input.value = d;
            this.otpForm.get('otp')?.setValue(d);
        }
    }

    sendOtp(): void {
        if (this.aadhaarForm.invalid) {
            this.aadhaarForm.markAllAsTouched();
            return;
        }
        this.loading = true;
        this.abhaService.requestAadharOtp({ AadhaarNumber: this.aadhaarForm.value.aadhaar })
            .subscribe((r: AadhaarGenerateOtpResponse) => {
                if (r.txnId) {
                    this.txnId = r.txnId;
                    this.step = 2;
                    this.snack.open(r.message, 'OK', { duration: 2500 });
                }
                else {
                    this.snack.open(r.message, 'OK', { duration: 2500 });
                }
                this.loading = false;
            });
    }

    verifyOtp(): void {
        if (this.otpForm.invalid) {
            this.otpForm.markAllAsTouched();
            return;
        }
        this.loading = true;
        this.abhaService.verifyAadharOtp({ otp: this.otpForm.value.otp, txnId: this.txnId })
            .subscribe((r: AbhaOtpVerify) => {
                if (r.txnId) {
                    if (r.authResult === 'success' && r.accounts) {
                        this.snack.open(r.message, 'OK', { duration: 1800 });
                        // this.verified.emit(r.accounts);
                    } else {
                        this.otpForm.get('otp')?.setErrors({ invalid: r.message });
                        this.snack.open(r.message, 'OK', { duration: 3000 });
                    }
                }
                else {
                    this.snack.open(r.message, 'OK', { duration: 2500 });
                }
                this.loading = false;
            });
    }

    resendOtp(): void {
        if (this.resendRemaining <= 0) return;
        this.resendRemaining--;
        this.sendOtp();
    }

    goBackToStep1(): void {
        this.step = 1;
        this.otpForm.reset();
    }
}
