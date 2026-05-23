import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbhaService } from '../../abha.service';

@Component({
  selector: 'app-otp-step',
  templateUrl: './otp-step.component.html',
  styleUrls: ['./otp-step.component.scss']
})
export class OtpStepComponent implements OnInit {
  @Input() form!: FormGroup;
  @Output() verified = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Input() maskedAadhaarMobile="";

  loading = false;
  resendAttemptsRemaining = 2;
  maskedMobile = '******3210';
  demoOtp: string;

  constructor(private abhaService: AbhaService, private snack: MatSnackBar) {
    //this.demoOtp = this.abhaService.DEMO_OTP;
  }

  ngOnInit(): void {}

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
    const otp = this.form.value.aadhaarOtp;
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

  onResend(): void {
    if (this.resendAttemptsRemaining <= 0) {
      this.snack.open('No resend attempts remaining.', 'OK', { duration: 2500 });
      return;
    }
    this.resendAttemptsRemaining -= 1;
    this.snack.open(`OTP resent. ${this.resendAttemptsRemaining} attempt(s) remaining.`, 'OK', {
      duration: 2500
    });
  }

  onBack(): void {
    this.back.emit();
  }
}
