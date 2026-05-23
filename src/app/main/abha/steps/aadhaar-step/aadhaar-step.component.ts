import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AadhaarGenerateOtpResponse, CONSENT_ITEMS } from '../../abha-model';
import { AbhaService } from '../../abha.service';

@Component({
    selector: 'app-aadhaar-step',
    templateUrl: './aadhaar-step.component.html',
    styleUrls: ['./aadhaar-step.component.scss']
})
export class AadhaarStepComponent implements OnInit {
    @Input() form!: FormGroup;
    @Output() otpSent = new EventEmitter<AadhaarGenerateOtpResponse>();

    consentItems = CONSENT_ITEMS;
    loading = false;
    demoAadhaar: string;

    constructor(private abhaService: AbhaService, private snack: MatSnackBar) {
    }

    ngOnInit(): void { }

    get consentsArray(): FormArray {
        return this.form.get('consents') as FormArray;
    }

    get acceptedCount(): number {
        return this.consentsArray.value.filter((v: boolean) => v).length;
    }

    toggleConsent(index: number): void {
        const ctrl = this.consentsArray.at(index);
        ctrl.setValue(!ctrl.value);
        ctrl.markAsTouched();
        this.consentsArray.updateValueAndValidity();
    }

    /** Replace {beneficiary name} placeholder in last consent with the entered name. */
    getConsentText(index: number): string {
        const text = this.consentItems[index];
        if (index === this.consentItems.length - 1) {
            const name = this.form.value.beneficiaryName?.trim();
            return name ? text.replace('(beneficiary name)', `(${name})`) : text;
        }
        return text;
    }

    /** Restrict Aadhaar input to digits only. */
    onAadhaarInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const cleaned = input.value.replace(/\D/g, '').slice(0, 12);
        if (input.value !== cleaned) {
            input.value = cleaned;
            this.form.get('aadhaarNumber')?.setValue(cleaned);
        }
    }

    onSendOtp(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.consentsArray.controls.forEach((c) => c.markAsTouched());
            return;
        }
        this.loading = true;
        this.abhaService.aadhaarGenerateOtp({ AadhaarNumber: this.form.value.aadhaarNumber })
            .subscribe((r) => {
                if (r.txnId) {
                    this.otpSent.emit(r);
                }
                else {
                    this.snack.open(r.message, 'OK', { duration: 2500 });
                }
                this.loading=false;
            });
        // this.abhaService.sendAadhaarOtp(aadhaar).subscribe((res) => {
        //     this.loading = false;
        //     if (res.success) {
        //         if (res.isExistingUser) {
        //             this.snack.open(res.message, 'OK', { duration: 4000 });
        //         } else {
        //             this.snack.open(res.message, 'OK', { duration: 2500 });
        //         }
        //         this.otpSent.emit();
        //     }
        // });
    }

    // Helpers for template
    hasError(controlName: string, errorKey: string): boolean {
        const ctrl = this.form.get(controlName);
        return !!(ctrl && ctrl.touched && ctrl.errors && ctrl.errors[errorKey]);
    }

    getErrorMessage(controlName: string): string {
        const ctrl = this.form.get(controlName);
        if (!ctrl || !ctrl.errors || !ctrl.touched) return '';
        if (ctrl.errors['required']) return 'This field is required';
        if (ctrl.errors['aadhaar']) return ctrl.errors['aadhaar'];
        if (ctrl.errors['name']) return ctrl.errors['name'];
        return 'Invalid value';
    }
}
