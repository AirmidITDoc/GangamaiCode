import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AadhaarGenerateOtpResponse, AbhaOtpVerify, AbhaProfile } from '../../abha-model';
import { OtpSystem } from '../../abha-verify.model';
import { AbhaService } from '../../abha.service';
import { AbhaValidators } from '../../abha.validators';

/**
 * Two-step flow:
 *   1. ABHA Number entry → POST /v3/profile/login/request/otp
 *   2. 6-digit OTP entry → POST /v3/profile/login/verify
 *
 * `otpSystem` controls whether OTP is sent to:
 *   - 'abdm'    → ABHA-linked mobile
 *   - 'aadhaar' → Aadhaar-linked mobile (UIDAI)
 */
@Component({
    selector: 'app-verify-by-abha-otp',
    templateUrl: './verify-by-abha-otp.component.html',
    styleUrls: ['./method-shared.scss']
})
export class VerifyByAbhaOtpComponent implements OnInit {
    @Input() otpSystem: OtpSystem = 'abdm';
    @Output() verified = new EventEmitter<AbhaProfile>();

    step: 1 | 2 = 1;
    abhaForm!: FormGroup;
    otpForm!: FormGroup;

    loading = false;
    resendRemaining = 2;
    txnId = '';
    channelLabel = '';
    demoAbha: string;
    demoOtp: string;

    constructor(private fb: FormBuilder, private abhaService: AbhaService, private snack: MatSnackBar) {
        // this.demoAbha = '91-3315-3072-4730';
        // this.demoOtp = svc.DEMO_OTP;
    }

    ngOnInit(): void {
        this.abhaForm = this.fb.group({
            abhaNumber: ['', [Validators.required, AbhaValidators.abhaNumber]]
        });
        this.otpForm = this.fb.group({
            otp: ['', [Validators.required, AbhaValidators.otp]]
        });
        this.channelLabel =
            this.otpSystem === 'aadhaar' ? 'Aadhaar-linked mobile' : 'ABHA-linked mobile';
    }

    get title(): string {
        return this.otpSystem === 'aadhaar'
            ? 'Verify via ABHA Number — Aadhaar OTP'
            : 'Verify via ABHA Number — ABHA OTP';
    }

    // Restrict & auto-format ABHA number input
    onAbhaInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const digits = input.value.replace(/\D/g, '').slice(0, 14);
        const formatted = digits.length > 0 ? this.formatLive(digits) : '';
        if (input.value !== formatted) {
            input.value = formatted;
            this.abhaForm.get('abhaNumber')?.setValue(formatted);
        }
    }

    private formatLive(d: string): string {
        if (d.length <= 2) return d;
        if (d.length <= 6) return `${d.slice(0, 2)}-${d.slice(2)}`;
        if (d.length <= 10) return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6)}`;
        return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6, 10)}-${d.slice(10, 14)}`;
    }

    onOtpInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const d = input.value.replace(/\D/g, '').slice(0, 6);
        if (input.value !== d) {
            input.value = d;
            this.otpForm.get('otp')?.setValue(d);
        }
    }

    // ============== Send OTP ==============
    sendOtp(): void {
        if (this.abhaForm.invalid) {
            this.abhaForm.markAllAsTouched();
            return;
        }
        this.loading = true;
        const raw = AbhaValidators.normalizeAbhaNumber(this.abhaForm.value.abhaNumber);
        if (this.otpSystem === 'aadhaar')
            this.abhaService.requestAbhaAadharOtp({ AadhaarNumber: raw })
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
        else
            this.abhaService.requestAbhaOtp({ AadhaarNumber: raw })
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

    // ============== Verify OTP ==============
    verifyOtp(): void {
        if (this.otpForm.invalid) {
            this.otpForm.markAllAsTouched();
            return;
        }
        this.loading = true;
        if (this.otpSystem === 'aadhaar')
            this.abhaService.verifyAbhaAadharOtp({ otp: this.otpForm.value.otp, txnId: this.txnId })
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
        else
            this.abhaService.verifyAbhaOtp({ otp: this.otpForm.value.otp, txnId: this.txnId })
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
        this.snack.open(`OTP resent. ${this.resendRemaining} attempt(s) remaining.`, 'OK', {
            duration: 2000
        });
    }

    goBackToStep1(): void {
        this.step = 1;
        this.otpForm.reset();
    }
}
