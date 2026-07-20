import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AadhaarGenerateOtpResponse, CONSENT_ITEMS, ConsentItem } from '../../abha-model';
import { AbhaService } from '../../abha.service';
import { AuthenticationService } from 'app/core/services/authentication.service';

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

    constructor(private abhaService: AbhaService, private snack: MatSnackBar,
        private accountService: AuthenticationService,
    ) {
    }

    ngOnInit(): void { }

    get consentsArray(): FormArray {
        return this.form.get('consents') as FormArray;
    }

    // get acceptedCount(): number {
    //     return this.consentsArray.value.filter((v: boolean) => v).length;
    // }

    get totalConsentCount(): number {
        return this.consentItems.reduce(
            (count, item) => count + 1 + (item.children?.length || 0),
            0
        );
    }

    get acceptedCount(): number {
        const parentCount = this.consentsArray.controls.filter(c => c.value).length;

        const childCount = this.consentItems.reduce((count, item) => {
            return count + (item.children?.filter(child => child.checked).length || 0);
        }, 0);

        return parentCount + childCount;
    }

    toggleConsent(index: number): void {
        const ctrl = this.consentsArray.at(index);
        ctrl.setValue(!ctrl.value);
        ctrl.markAsTouched();
        this.consentsArray.updateValueAndValidity();
    }

    get allConsentsAccepted(): boolean {
        const parentsAccepted = this.consentsArray.controls.every(control => control.value);

        const childrenAccepted = this.consentItems.every(item =>
            !item.children || item.children.every(child => child.checked)
        );

        return parentsAccepted && childrenAccepted;
    }
    // changed by raksha on 8/7/26
    /** Replace {beneficiary name} placeholder in last consent with the entered name. */
    getConsentText(child: ConsentItem): string {
        let text = child.text;

        const userName = this.accountService.currentUserValue.userName;
        if (userName) {
            text = text.replace(
                '(name of healthcare worker- depending on the username used for logging in into the system)',
                `(${userName})`
            );
        }

        const name = this.form.value.beneficiaryName?.trim();
        if (name) {
            text = text.replace('(beneficiary name)', `(${name})`);
        }

        return text;
    }
    // getConsentText(index: number): string {
    //     // let text = this.consentItems[index];
    //     let text = this.consentItems[index].text;

    //     // Replace healthcare worker name by login user name
    //     const userName = this.accountService.currentUserValue.userName;
    //     if (userName) {
    //         text = text.replace(
    //             '(name of healthcare worker- depending on the username used for logging in into the system)',
    //             `(${userName})`
    //         );
    //     }

    //     if (index === this.consentItems.length - 1) {
    //         const name = this.form.value.beneficiaryName?.trim();
    //         return name ? text.replace('(beneficiary name)', `(${name})`) : text;
    //     }
    //     return text;
    // }

    // added by raksha on 8/7/26
    /** Restrict Aadhaar input to digits only. */
    onAadhaarInput(event: any): void {
        const input = event.target.value.replace(/\D/g, '').slice(0, 12);

        this.form.get('aadhaarNumber')?.setValue(input, { emitEvent: false });

        if (input.length === 12) {
            if (!this.isValidAadhaar(input)) {
                this.form.get('aadhaarNumber')?.setErrors({
                    aadhaar: 'Aadhaar Number is not valid.'
                });
            } else {
                this.form.get('aadhaarNumber')?.setErrors(null);
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
    //     const cleaned = input.value.replace(/\D/g, '').slice(0, 12);
    //     if (input.value !== cleaned) {
    //         input.value = cleaned;
    //         this.form.get('aadhaarNumber')?.setValue(cleaned);
    //     }
    // }

    onSendOtp(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.consentsArray.controls.forEach((c) => c.markAsTouched());
            return;
        }
        this.loading = true;
        this.abhaService.aadhaarGenerateOtp({ aadhaarNumber: this.form.value.aadhaarNumber })
            .subscribe((r) => {
                if (r.txnId) {
                    this.otpSent.emit(r);
                }
                else {
                    this.snack.open(r.message, 'OK', { duration: 2500 });
                }
                this.loading = false;
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
