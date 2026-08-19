import { Component, EventEmitter, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AadhaarGenerateOtpResponse, AbhaOtpVerify, AbhaProfile, VerifyResponse } from '../../abha-model';
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
    @Output() verified = new EventEmitter<VerifyResponse>();

    step: 1 | 2 = 1;
    aadhaarForm!: FormGroup;
    otpForm!: FormGroup;

    loading = false;
    hideOtp = true;
    resendRemaining = 2;
    txnId = '';
    msg = "";

    countdown = '01:00';
    timeLeft = 60;
    timer: any;
    canResend = false;
    resendAttempts = 0;
    otpExpired = false;
    @Output() sessionExpired = new EventEmitter<void>();
    showSuccessPopup = false;
    accessToken = '';
    showCreateAbhaLink = false;
    private readonly NO_ABHA_MSG = 'No ABHA user registered with this Aadhaar number.';

    constructor(
        private fb: FormBuilder,
        private abhaService: AbhaService,
        private snack: MatSnackBar
    ) {
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('txnId changed:', changes['txnId']?.currentValue);

        if (changes['txnId']?.currentValue) {
            this.startTimer();
        }

        console.log("Aadhar number:", this.aadhaarForm.value.aadhaar);
    }

    ngOnInit(): void {
        this.aadhaarForm = this.fb.group({
            aadhaar: ['', [Validators.required, AbhaValidators.aadhaar]]
        });
        this.otpForm = this.fb.group({
            otp: ['', [Validators.required, AbhaValidators.otp]]
        });
    }

    onAadhaarInput(event: any): void {
        const input = event.target.value.replace(/\D/g, '').slice(0, 12);

        this.aadhaarForm.get('aadhaar')?.setValue(input, { emitEvent: false });

        if (input.length === 12) {
            if (!this.isValidAadhaar(input)) {
                this.aadhaarForm.get('aadhaar')?.setErrors({
                    aadhaar: 'Aadhaar Number is not valid.'
                });
            } else {
                this.aadhaarForm.get('aadhaar')?.setErrors(null);
            }
        }
    }

    isValidAadhaar(aadhaar: string): boolean {

        const d = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
            [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
            [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
            [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
            [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
            [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
            [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
            [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
            [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        ];

        const p = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
            [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
            [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
            [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
            [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
            [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
            [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
        ];

        if (!/^\d{12}$/.test(aadhaar)) {
            return false;
        }

        let c = 0;

        const reversed = aadhaar.split('').reverse();

        for (let i = 0; i < reversed.length; i++) {
            c = d[c][p[i % 8][+reversed[i]]];
        }

        return c === 0;
    }

    // onAadhaarInput(event: Event): void {
    //     const input = event.target as HTMLInputElement;
    //     const d = input.value.replace(/\D/g, '').slice(0, 12);
    //     if (input.value !== d) {
    //         input.value = d;
    //         this.aadhaarForm.get('aadhaar')?.setValue(d);
    //     }
    // }

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
        this.abhaService.requestAadharOtp({ aadhaarNumber: this.aadhaarForm.value.aadhaar })
            .subscribe((r: AadhaarGenerateOtpResponse) => {
                if (r.txnId) {
                    this.txnId = r.txnId;
                    this.msg = r.message;
                    this.step = 2;
                    // this.resendAttempts++;
                    this.snack.open(r.message, 'OK', { duration: 2500 });
                    this.startTimer();
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
        this.showCreateAbhaLink = false;
        this.abhaService.verifyAadharOtp({ otp: this.otpForm.value.otp, txnId: this.txnId })
            .subscribe((r: AbhaOtpVerify) => {
                if (r.txnId) {
                    if (r.authResult === 'success' && r.accounts) {
                        this.snack.open(r.message, 'OK', { duration: 1800 });
                        this.accessToken = r.token;
                        // this.verified.emit({ accesstoken: r.token, isAddress: false });
                        this.showSuccessPopup = true;
                    } else {
                        this.otpForm.get('otp')?.setErrors({ invalid: r.message });
                        this.snack.open(r.message, 'OK', { duration: 3000 });
                    }
                }
                else {
                    this.snack.open(r.message, 'OK', { duration: 2500 });
                    if (r.message?.trim() === this.NO_ABHA_MSG) {
                            this.showCreateAbhaLink = true;
                        }
                }
                this.loading = false;
            });
    }

    closeSuccessPopup() {
        this.showSuccessPopup = false;
        this.verified.emit({ accesstoken: this.accessToken, isAddress: false });
    }

    get maxAttemptsReached(): boolean {
        return this.resendAttempts >= 2;
    }

    resendOtp(): void {
        // if (this.resendRemaining <= 0) return;
        // this.resendRemaining--;
        this.otpExpired = false;
        if (this.resendAttempts >= 2) {
            return;
        }
        this.resendAttempts++;

        this.aadhaarForm.get('otp')?.reset();
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

     onCreateAbhaClick(): void {
        console.log('Create ABHA link clicked');
        this.abhaService.requestCreateAbha();
    }
}
