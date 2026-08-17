import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbhaService } from '../../abha.service';
import { AadhaarGenerateOtpResponse, AadhaarVerifyOtpResponse } from '../../abha-model';
import { MatDialog } from '@angular/material/dialog';

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
    countdown1 = '01:00';
    timeLeft1 = 60;
    timeLeft = 60;
    timer: any;
    timer1: any;
    canResend = false;
    canResend1 = false;
    resendAttempts = 0;
    resendAttempts1 = 0;
    otpExpired = false;
    otpExpired1 = false;
    @Output() sessionExpired = new EventEmitter<void>();
    @Output() sessionExpired1 = new EventEmitter<void>();
    @Input() aadhaarNumber!: string;
    showSuccessPopup = false;
    accessToken: any;
    @ViewChild('OtpForm') OtpForm!: TemplateRef<any>;

    constructor(private abhaService: AbhaService, private snack: MatSnackBar,
        public _matDialog: MatDialog,
    ) {
        //this.demoOtp = this.abhaService.DEMO_OTP;
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('txnId changed:', changes['txnId']?.currentValue);

        if (changes['txnId']?.currentValue) {
            this.startTimer();
        }
        this.startTimer1();

        console.log("Aadhar number:", this.aadhaarNumber);
    }

    ngOnInit(): void {
        this.form.get('mobile')?.setValidators([
            Validators.required,
            this.lastFourDigitsMatchValidator()
        ]);
        this.form.get('mobile')?.updateValueAndValidity();
    }

    private getLastFourDigits(value: string): string {
        const digitsOnly = (value || '').replace(/\D/g, '');
        return digitsOnly.slice(-4);
    }

    private lastFourDigitsMatchValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const enteredValue: string = control.value || '';
            if (!enteredValue) return null; // let 'required' handle empty case

            const enteredLast4 = this.getLastFourDigits(enteredValue);
            const maskedLast4 = this.getLastFourDigits(this.maskedAadhaarMobile);

            // only compare once user has typed at least 4 digits
            if (enteredLast4.length < 4) return null;

            if (enteredLast4 !== maskedLast4) {
                return { mismatch: 'Mobile number does not match' };
            }
            return null;
        };
    }

    onMobileInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        // allow digits only
        const cleaned = input.value.replace(/\D/g, '').slice(0, 10);
        if (input.value !== cleaned) {
            input.value = cleaned;
            this.form.get('mobile')?.setValue(cleaned);
        }
        // re-run validation on every keystroke since validator was set once with a snapshot value
        this.form.get('mobile')?.updateValueAndValidity();
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

    LinkMobile(row: any = null): void {
        console.log(row)
        const dialogRef = this._matDialog.open(this.OtpForm, {
            width: '30%',
            height: '25%'
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    linkBtnVerify() {

    }

    get maxAttemptsReached1(): boolean {
        return this.resendAttempts >= 2;
    }

    startTimer1() {
        clearInterval(this.timer1);
        this.canResend1 = false;
        this.otpExpired1 = false;
        this.timeLeft1 = 60;

        this.updateCounter1();

        this.timer1 = setInterval(() => {
            if (this.timeLeft1 > 0) {
                this.timeLeft1--;
                this.updateCounter1();
            } else {
                clearInterval(this.timer1);
                this.otpExpired1 = true;
                if (this.resendAttempts1 >= 2) {
                    this.sessionExpired1.emit();
                } else {
                    this.canResend1 = true;
                }
            }
        }, 1000);
    }

    updateCounter1() {
        const min = Math.floor(this.timeLeft1 / 60);
        const sec = this.timeLeft1 % 60;
        this.countdown1 =
            `${min}:${sec < 10 ? '0' + sec : sec}`;
    }

    onOtpInput1(event: Event): void {
        const input = event.target as HTMLInputElement;
        const cleaned = input.value.replace(/\D/g, '').slice(0, 6);
        if (input.value !== cleaned) {
            input.value = cleaned;
            this.form.get('aadhaarOtp1')?.setValue(cleaned);
        }
    }

    resendOtp1(): void {

        if (this.resendAttempts1 >= 2) {
            return;
        }
        this.form.get('aadhaarOtp1')?.reset();
        // this.onSendOtp();
    }
}
