import { Component, EventEmitter, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AadhaarGenerateOtpResponse, AbhaOtpVerify, AbhaProfile, Account, GENDER_LABELS, VerifyResponse, VerifyUserResponse } from '../../abha-model';
import { LinkedAccount } from '../../abha-verify.model';
import { AbhaValidators } from '../../abha.validators';
import { AbhaService } from '../../abha.service';

/**
 * Three-step flow:
 *   1. Mobile entry → POST /v3/profile/login/request/otp (loginHint=mobile)
 *   2. OTP entry → POST /v3/profile/login/verify
 *      - If a single ABHA is linked, success with full profile (skip step 3)
 *      - If multiple ABHAs are linked, returns accounts[] → show picker
 *   3. Pick ABHA → POST /v3/profile/login/verify/user → full profile
 */
@Component({
    selector: 'app-verify-by-mobile',
    templateUrl: './verify-by-mobile.component.html',
    styleUrls: ['./method-shared.scss', './verify-by-mobile.component.scss']
})
export class VerifyByMobileComponent implements OnInit {
    @Output() verified = new EventEmitter<VerifyResponse>();

    step: 1 | 2 | 3 | 4 = 1;
    mobileForm!: FormGroup;
    otpForm!: FormGroup;
    pickForm!: FormGroup;

    loading = false;
    hideOtp = true;
    resendRemaining = 2;
    findtxnId = '';
    txnId = '';
    accounts: Account[] = [];

    demoMobileSingle: string;
    demoMobileMulti: string;
    demoOtp: string;
    genderLabels = GENDER_LABELS;

    countdown = '01:00';
    timeLeft = 60;
    timer: any;
    canResend = false;
    resendAttempts = 0;
    otpExpired = false;
    @Output() sessionExpired = new EventEmitter<void>();
    mobileNo:any;

    constructor(
        private fb: FormBuilder,
        private abhaService: AbhaService,
        private snack: MatSnackBar
    ) {
        // this.demoMobileSingle = svc.DEMO_MOBILE_SINGLE;
        // this.demoMobileMulti = svc.DEMO_MOBILE_MULTI;
        // this.demoOtp = svc.DEMO_OTP;
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('txnId changed:', changes['txnId']?.currentValue);

        if (changes['txnId']?.currentValue) {
            this.startTimer();
        }
        
    }

    ngOnInit(): void {
        this.mobileForm = this.fb.group({
            mobile: ['', [Validators.required, AbhaValidators.mobile]]
        });
        this.otpForm = this.fb.group({
            otp: ['', [Validators.required, AbhaValidators.otp]]
        });
        this.pickForm = this.fb.group({
            ABHANumber: ['', Validators.required]
        });
    }

    onMobileInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const d = input.value.replace(/\D/g, '').slice(0, 10);
        if (input.value !== d) {
            input.value = d;
            this.mobileForm.get('mobile')?.setValue(d);
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

    // ============== Step 1: Find List ==============
    abhaCards: any[] = [];
    findABHA(): void {
        if (this.mobileForm.invalid) {
            this.mobileForm.markAllAsTouched();
            return;
        }
        this.mobileNo=this.mobileForm.value.mobile
        this.loading = true;
        this.abhaService.findAbha({ mobile: this.mobileForm.value.mobile })
            .subscribe((r: AadhaarGenerateOtpResponse) => {
                console.log("Search DATA:", r)
                if (Array.isArray(r)) {
                    // Success response
                    if (r.length > 0 && r[0].txnId) {
                        this.findtxnId = r[0].txnId;
                        this.abhaCards = r[0].ABHA;
                        this.step = 2;
                    } else {
                        this.snack.open('Transaction ID not found.', 'OK', { duration: 2500 });
                    }
                } else {
                    // Error response
                    this.snack.open(r.message, 'OK', { duration: 2500 });
                }
                this.loading = false;
            });
    }

    // ============== Step 2: Send OTP ==============
    selectedAbha: any;
    sendOtp(data?: any): void {
        // save the selected card for resend otp use
        if (data) {
            this.selectedAbha = data;
        }
        this.loading = true;
        this.abhaService.requestOTPfindAbha({ txnId: this.findtxnId, aadhaarNumber: String(this.selectedAbha.index), otpType: 1 })
            .subscribe((r: AadhaarGenerateOtpResponse) => {
                console.log("send Otp reponse:", r)
                if (r.txnId) {
                    this.txnId = r.txnId;
                    this.step = 3;
                    this.snack.open(r.message, 'OK', { duration: 2500 });
                    this.startTimer();
                }
                else {
                    this.snack.open(r.message, 'OK', { duration: 2500 });
                }
                this.loading = false;
            });
    }

    // sendOtp(): void {
    //     if (this.mobileForm.invalid) {
    //         this.mobileForm.markAllAsTouched();
    //         return;
    //     }
    //     this.loading = true;
    //     this.abhaService.requestMobileOtp({ AadhaarNumber: this.mobileForm.value.mobile })
    //         .subscribe((r: AadhaarGenerateOtpResponse) => {
    //             if (r.txnId) {
    //                 this.txnId = r.txnId;
    //                 this.step = 3;
    //                 this.snack.open(r.message, 'OK', { duration: 2500 });
    //                 this.startTimer();
    //             }
    //             else {
    //                 this.snack.open(r.message, 'OK', { duration: 2500 });
    //             }
    //             this.loading = false;
    //         });
    // }

    // ============== Step 3: Verify OTP ==============
    verifyOtp(): void {
        if (this.otpForm.invalid) {
            this.otpForm.markAllAsTouched();
            return;
        }
        this.loading = true;
        this.abhaService.verifyMobileOtp({ otp: this.otpForm.value.otp, txnId: this.txnId })
            .subscribe((r: AbhaOtpVerify) => {
                if (r.txnId) {
                    if (r.authResult !== 'success') {
                        this.otpForm.get('otp')?.setErrors({ invalid: r.message });
                        this.snack.open(r.message, 'OK', { duration: 3000 });
                        return;
                    }

                    // Single account → emit directly
                    if ((!r.accounts || r.accounts.length <= 1)) {
                        this.snack.open('Verified — single ABHA found.', 'OK', { duration: 1800 });
                        this.verified.emit({ accesstoken: r.token, isAddress: false });
                        return;
                    }

                    // Multiple accounts → go to picker
                    this.accounts = r.accounts || [];
                    this.step = 3;
                    this.snack.open(r.message, 'OK', { duration: 3000 });
                }
                else {
                    this.snack.open(r.message, 'OK', { duration: 2500 });
                }
                this.loading = false;
            });
    }

    // ============== Step 4: Verify User (picked account) ==============
    pickAccount(abhaNumber: string): void {
        this.pickForm.patchValue({ ABHANumber: abhaNumber });
    }

    verifyUser(): void {
        if (this.pickForm.invalid) {
            this.snack.open('Please select an ABHA account to continue.', 'OK', {
                duration: 2500
            });
            return;
        }
        this.loading = true;
        this.abhaService.verifyUser({ ABHANumber: this.pickForm.value.ABHANumber, txnId: this.txnId })
            .subscribe((r: VerifyUserResponse) => {
                if (r.token) {
                    this.verified.emit({ accesstoken: r.token, isAddress: false });
                    //this.snack.open(r.message, 'OK', { duration: 2500 });
                }
                else {
                    //  this.snack.open(r.message, 'OK', { duration: 2500 });
                }
                this.loading = false;
            });
    }

    // resendOtp(): void {
    //     if (this.resendRemaining <= 0) return;
    //     this.resendRemaining--;
    //     this.sendOtp();
    // }

    resendOtp(): void {
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

    goBackToStep2(): void {
        this.step = 2;
        this.pickForm.reset();
    }

    /** UI helper — get a friendly label for gender */
    genderLabel(g: string): string {
        return this.genderLabels[g] || g;
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
