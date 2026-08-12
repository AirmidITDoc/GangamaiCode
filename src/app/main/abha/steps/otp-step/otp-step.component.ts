import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbhaService } from '../../abha.service';
import { AadhaarGenerateOtpResponse, AadhaarVerifyOtpResponse } from '../../abha-model';

@Component({
    selector: 'app-otp-step',
    templateUrl: './otp-step.component.html',
    styleUrls: ['./otp-step.component.scss']
})
export class OtpStepComponent implements OnInit {
    @Input() form!: FormGroup;
    @Output() verified = new EventEmitter<AadhaarVerifyOtpResponse>();
    @Output() back = new EventEmitter<void>();
    @Input() maskedAadhaarMobile = "";
    @Input() txnId = "";

    loading = false;
    hideOtp = true;
    resendAttemptsRemaining = 2;
    maskedMobile = '******3210';
    demoOtp: string;

    countdown = '01:00';
    timeLeft = 60;
    timer: any;
    canResend = false;
    resendAttempts = 0;
    otpExpired = false;
    @Output() sessionExpired = new EventEmitter<void>();
    @Input() aadhaarNumber!: string;
    showSuccessPopup = false;
    accessToken: any;

    constructor(private abhaService: AbhaService, private snack: MatSnackBar) {
        //this.demoOtp = this.abhaService.DEMO_OTP;
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('txnId changed:', changes['txnId']?.currentValue);

        if (changes['txnId']?.currentValue) {
            this.startTimer();
        }

        console.log("Aadhar number:", this.aadhaarNumber);
    }

    ngOnInit(): void {
        // this.startTimer();
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
                // if (this.resendAttempts < 2) {
                //     this.canResend = true;
                // }

            }

        }, 1000);
    }

    updateCounter() {

        const min = Math.floor(this.timeLeft / 60);

        const sec = this.timeLeft % 60;

        this.countdown =
            `${min}:${sec < 10 ? '0' + sec : sec}`;

    }

    onOtpInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const cleaned = input.value.replace(/\D/g, '').slice(0, 6);
        if (input.value !== cleaned) {
            input.value = cleaned;
            this.form.get('aadhaarOtp')?.setValue(cleaned);
        }
    }

    onVerify(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.loading = true;
        const otp = this.form.value;
        this.abhaService.aadhaarVerifyOtp({ txnId: this.txnId, otp: otp.aadhaarOtp, mobile: otp.mobile }).subscribe((r) => {
            if (r.txnId) {
                this.txnId = r.txnId;
                this.snack.open(r.message, 'OK', { duration: 2000 });
                // this.verified.emit(r);
                this.accessToken = r;
                this.showSuccessPopup = true;

                // if (r.newMobileOtpRequired) {
                //     this.mobileNeedsOtp = true;
                //     this.snack.open('OTP sent to new mobile number', 'OK', { duration: 2500 });
                //     //  this.stepper.next();
                // } else {
                //     this.enrol();
                // }
            }
            else {
                this.snack.open(r.message, 'Error', { duration: 2000 });
            }
            this.loading = false;
        });
        // this.abhaService.verifyOtp(otp).subscribe((res) => {
        //   this.loading = false;
        //   if (res.success) {
        //     this.snack.open(res.message, 'OK', { duration: 2000 });
        //     this.verified.emit();
        //   } else {
        //     this.form.get('aadhaarOtp')?.setErrors({ invalid: res.message });
        //     this.snack.open(res.message, 'OK', { duration: 3000 });
        //   }
        // });
    }

    closeSuccessPopup() {
        this.showSuccessPopup = false;

        if (this.accessToken) {
            this.verified.emit(this.accessToken);
        }
    }

    get maxAttemptsReached(): boolean {
        return this.resendAttempts >= 2;
    }

    onResend(): void {

        this.otpExpired = false;
        if (this.resendAttemptsRemaining <= 0) {
            this.snack.open('No resend attempts remaining.', 'OK', { duration: 2500 });
            return;
        }
        this.resendAttemptsRemaining -= 1;
        this.snack.open(`OTP resent. ${this.resendAttemptsRemaining} attempt(s) remaining.`, 'OK', {
            duration: 2500
        });
    }

    // added by raksha on 8/7/26
    resendOtp(): void {

        if (this.resendAttempts >= 2) {
            return;
        }

        // this.resendAttempts++;

        this.form.get('aadhaarOtp')?.reset();

        this.onSendOtp();
    }
    onSendOtp(): void {
        // debugger
        // if (this.form.get('mobile')?.invalid) {
        //     this.form.get('mobile')?.markAsTouched();
        //     return;
        // }
        this.loading = true;
        this.abhaService.aadhaarGenerateOtp({ aadhaarNumber: this.aadhaarNumber })
            .subscribe((r: AadhaarGenerateOtpResponse) => {
                if (r.txnId) {
                    this.txnId = r.txnId;
                    // this.step = 2;
                    this.resendAttempts++;
                    this.snack.open(r.message, 'OK', { duration: 2500 });
                    this.startTimer();
                }
                else {
                    this.snack.open(r.message, 'OK', { duration: 2500 });
                }
                this.loading = false;
            });
    }

    onBack(): void {
        this.back.emit();
    }
}
