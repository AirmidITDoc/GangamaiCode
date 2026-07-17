import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AadhaarGenerateOtpResponse, AbhaOtpVerify, AbhaProfile, VerifyResponse } from '../../abha-model';
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
    selector: 'app-verify-by-abha-address',
    templateUrl: './verify-by-abha-address.component.html',
    styleUrls: ['./method-shared.scss']
})
export class VerifyByAbhaAddressComponent implements OnInit {
    @Input() otpSystem: OtpSystem = 'abdm';
    @Output() verified = new EventEmitter<VerifyResponse>();

    step: 1 | 2 | 3 = 1;
    abhaForm!: FormGroup;
    otpForm!: FormGroup;

    loading = false;
    hideOtp = true;
    resendRemaining = 2;
    txnId = '';
    channelLabel = '';
    msg: string;

    countdown = '01:00';
    timeLeft = 60;
    timer: any;
    canResend = false;
    resendAttempts = 0;
    otpExpired = false;
    @Output() sessionExpired = new EventEmitter<void>();

    constructor(private fb: FormBuilder, private abhaService: AbhaService, private snack: MatSnackBar) {
        // this.demoAbha = '91-3315-3072-4730';
        // this.demoOtp = svc.DEMO_OTP;
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('txnId changed:', changes['txnId']?.currentValue);

        if (changes['txnId']?.currentValue) {
            this.startTimer();
        }

        console.log("Abha number:", this.abhaForm.value.abhaNumber);
    }

    ngOnInit(): void {
        this.abhaForm = this.fb.group({
            abhaNumber: ['', [Validators.required]],
            otpType: ['', [Validators.required]]
        });
        this.otpForm = this.fb.group({
            otp: ['', [Validators.required, AbhaValidators.otp]]
        });
    }

    get title(): string {
        return this.abhaForm.value.otpType === 1
            ? 'Verify via ABHA Address — Aadhaar OTP'
            : 'Verify via ABHA Address';
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

    // ============== Step 1: Find ABHA Address ==============

    authMethods: string[] = [];
    searchData: any = {};
    findAbhaAddress(): void {
        if (this.abhaForm.get('abhaNumber')?.invalid) {
            this.abhaForm.get('abhaNumber')?.markAsTouched();
            return;
        }
        this.loading = true;
        this.abhaService.findAbhaAddress({ mobile: this.abhaForm.value.abhaNumber })
            .subscribe((r: AadhaarGenerateOtpResponse) => {
                console.log("Search DATA:", r)
                this.searchData = r
                if (r.healthIdNumber) {
                    this.authMethods = r.authMethods || [];
                    this.step = 2;
                    this.snack.open('', 'OK', { duration: 2500 });
                } else {
                    this.snack.open(r.message || 'Auth Type not found.', 'OK', { duration: 2500 });
                }
                this.loading = false;
            });
    }

    // ============== Send OTP ==============
    sendOtp(): void {
        if (this.abhaForm.get('otpType')?.invalid) {
            this.abhaForm.get('otpType')?.markAsTouched();
            return;
        }
        this.loading = true;
        // if (this.otpSystem === 'aadhaar')
        this.abhaService.requestAbhaOtp({ AadhaarNumber: this.searchData.abhaAddress, OtpType: 1 })
            .subscribe((r: AadhaarGenerateOtpResponse) => {
                if (r.txnId) {
                    this.channelLabel = this.abhaForm.value.otpType === 1 ? 'Aadhaar-linked mobile' : 'ABHA-linked mobile';
                    this.txnId = r.txnId;
                    this.step = 3;
                    this.snack.open(r.message, 'OK', { duration: 2500 });
                    this.startTimer();
                }
                else {
                    this.snack.open(r.message, 'OK', { duration: 2500 });
                }
                this.msg = r.message;
                this.loading = false;
            });
        // else
        //     this.abhaService.requestAbhaOtp({ AadhaarNumber: this.abhaForm.value.abhaNumber })
        //         .subscribe((r: AadhaarGenerateOtpResponse) => {
        //             if (r.txnId) {
        //                 this.txnId = r.txnId;
        //                 this.step = 2;
        //                 this.snack.open(r.message, 'OK', { duration: 2500 });
        //             }
        //             else {
        //                 this.snack.open(r.message, 'OK', { duration: 2500 });
        //             }
        //             this.loading = false;
        //         });
    }

    // ============== Verify OTP ==============
    verifyOtp(): void {
        if (this.otpForm.invalid) {
            this.otpForm.markAllAsTouched();
            return;
        }
        this.loading = true;
        // if (this.otpSystem === 'aadhaar')
        //     this.abhaService.verifyAbhaAadharOtp({ otp: this.otpForm.value.otp, txnId: this.txnId })
        //         .subscribe((r: AbhaOtpVerify) => {
        //             if (r.txnId) {
        //                 if (r.authResult === 'success' && r.accounts) {
        //                     this.snack.open(r.message, 'OK', { duration: 1800 });
        //                     this.verified.emit(r.token);
        //                 } else {
        //                     this.otpForm.get('otp')?.setErrors({ invalid: r.message });
        //                     this.snack.open(r.message, 'OK', { duration: 3000 });
        //                 }
        //             }
        //             else {
        //                 this.snack.open(r.message, 'OK', { duration: 2500 });
        //             }
        //             this.loading = false;
        //         });
        // else
        this.abhaService.verifyAbhaOtp({ otp: this.otpForm.value.otp, txnId: this.txnId, OtpType: this.abhaForm.value.otpType })
            .subscribe((r: AbhaOtpVerify) => {
                if (r.authResult === 'success' && r.accounts) {
                    this.snack.open(r.message, 'OK', { duration: 1800 });
                    this.verified.emit({ accesstoken: r.token, isAddress: true });
                } else {
                    this.otpForm.get('otp')?.setErrors({ invalid: r.message });
                    this.snack.open(r.message, 'OK', { duration: 3000 });
                }
                this.loading = false;
            });
    }

    // resendOtp(): void {
    //     if (this.resendRemaining <= 0) return;
    //     this.resendRemaining--;
    //     this.sendOtp();
    //     this.snack.open(`OTP resent. ${this.resendRemaining} attempt(s) remaining.`, 'OK', {
    //         duration: 2000
    //     });
    // }

    resendOtp(): void {
        // if (this.resendRemaining <= 0) return;
        // this.resendRemaining--;
        this.otpExpired = false;
        if (this.resendAttempts >= 2) {
            return;
        }
        this.resendAttempts++;

        this.otpForm.get('otp')?.reset();
        this.sendOtp();
    }

    goBackToStep1(): void {
        this.step = 1;
        this.otpForm.reset();
    }

    startTimer() {

        clearInterval(this.timer);

        this.canResend = false;
        this.otpExpired = false;
        this.timeLeft = 60;

        this.updateCounter();

        this.timer = setInterval(() => {

            if (this.timeLeft > 0) {

                this.timeLeft--;
                this.updateCounter();

            } else {

                clearInterval(this.timer);
                this.otpExpired = true;
                if (this.resendAttempts >= 2) {

                    this.sessionExpired.emit();

                } else {

                    this.canResend = true;
                }
            }

        }, 1000);
    }

    updateCounter() {

        const min = Math.floor(this.timeLeft / 60);

        const sec = this.timeLeft % 60;

        this.countdown =
            `${min}:${sec < 10 ? '0' + sec : sec}`;

    }
}
