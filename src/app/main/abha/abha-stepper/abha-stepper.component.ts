import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbhaService } from '../abha.service';
import { AbhaValidators } from '../abha.validators';
import { AadhaarGenerateOtpResponse, AadhaarVerifyOtpResponse, AbhaProfile, CONSENT_ITEMS } from '../abha-model';

@Component({
    selector: 'app-abha-stepper',
    templateUrl: './abha-stepper.component.html',
    styleUrls: ['./abha-stepper.component.scss']
})
export class AbhaStepperComponent implements OnInit {
    @ViewChild('stepper') stepper!: MatStepper;

    // Form groups per step
    aadhaarForm!: FormGroup;
    otpForm!: FormGroup;
    mobileForm!: FormGroup;
    addressForm!: FormGroup;

    // Final profile (after creation)
    isAbhaCreated = false;

    // Doctor name (logged-in)
    // doctorName = 'Dr. Anita Sharma';
    maskedAadhaarMobile = "";
    token = "";
    existingAddress = "";
    txnId = '';
    aadhaarNumber = '';
    constructor(
        private fb: FormBuilder,
        private abhaService: AbhaService,
        private snack: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.initForms();
    }

    private initForms(): void {
        // Step 1
        this.aadhaarForm = this.fb.group({
            aadhaarNumber: ['', [Validators.required, AbhaValidators.aadhaar]],
            beneficiaryName: ['', [Validators.required, AbhaValidators.beneficiaryName]],
            consents: this.fb.array(
                CONSENT_ITEMS.map(() => false),
                AbhaValidators.allConsentsAccepted()
            )
        });

        // Step 2
        this.otpForm = this.fb.group({
            aadhaarOtp: ['', [Validators.required, AbhaValidators.otp]],
            mobile: ['', [Validators.required, AbhaValidators.mobile]]
        });

        // Step 3
        this.mobileForm = this.fb.group({
            mobileNumber: ['', [Validators.required, AbhaValidators.mobile]]
        });

        // Step 4
        this.addressForm = this.fb.group({
            addressOption: [null, Validators.required],
            customAbhaAddress: [''],
            selectedSuggestion: ['']
        });
    }

    /** Called by Aadhaar step when OTP sent — advance stepper. */
    onAadhaarOtpSent(r: AadhaarGenerateOtpResponse): void {
        this.aadhaarNumber = this.aadhaarForm.get('aadhaarNumber')?.value; //to show aadharnum in otp step

        this.txnId = r.txnId;
        this.maskedAadhaarMobile = r.message || '';
        this.snack.open('OTP sent to Aadhaar-linked mobile', 'OK', { duration: 2500 });
        this.stepper.next();
        // this.abhaService.updateData({
        //   aadhaarNumber: this.aadhaarForm.value.aadhaarNumber,
        //   beneficiaryName: this.aadhaarForm.value.beneficiaryName,
        //   consents: this.aadhaarForm.value.consents
        // });
        // this.stepper.next();
    }

    /** Called by OTP step on verify success. */
    onOtpVerified(r: AadhaarVerifyOtpResponse): void {
        this.txnId = r.txnId;
        //this.abhaService.updateData({ aadhaarOtp: this.otpForm.value.aadhaarOtp });
        // if (r.isNew) {
        //   this.isNewAddressDisabled = false;
        this.existingAddress = r.abhaProfile.phrAddress[0] ?? "";
        this.token = r.tokens.token;
        this.stepper.next();
        // }
        // else {
        //     this.isAbhaCreated=true;
        //     this.isNewAddressDisabled = true;
        //     this.token=r.tokens.token;
        //     this.stepper.selectedIndex = 2;
        // }
    }

    /** Called by Mobile step on next. */
    onMobileNext(): void {

        // this.abhaService.updateData({
        //   mobileNumber: this.mobileForm.value.mobileNumber,
        //   isAadhaarLinkedMobile:
        //     this.mobileForm.value.mobileNumber === this.abhaService.AADHAAR_LINKED_MOBILE
        // });
        this.stepper.next();
    }

    /** Called by Address step on create. */
    onAbhaCreate(abhaAddress: string): void {
        // this.abhaService.updateData({
        //   addressOption: this.addressForm.value.addressOption,
        //   customAbhaAddress: this.addressForm.value.customAbhaAddress,
        //   selectedSuggestion: this.addressForm.value.selectedSuggestion
        // });
        debugger
        this.abhaService.createAbha({ TxnId: this.txnId, AbhaAddress: abhaAddress }).subscribe(() => {
            this.isAbhaCreated = true;
            this.stepper.next();
            this.snack.open('ABHA created successfully!', 'OK', {
                duration: 3000,
                panelClass: ['success-snack']
            });
        });
    }

    /** Restart whole flow. */
    resetFlow(): void {
        //this.abhaService.resetData();
        this.isAbhaCreated = false;
        this.aadhaarForm.reset();
        (this.aadhaarForm.get('consents') as FormArray).controls.forEach((c) =>
            c.setValue(false)
        );
        this.otpForm.reset();
        this.mobileForm.reset();
        this.addressForm.reset();
        this.stepper.reset();
    }

    consentItems = CONSENT_ITEMS;
    onSessionExpired(): void {

        this.snack.open('OTP session expired. Please generate a new OTP.', 'OK', {
            duration: 3000
        });

        this.txnId = '';

        this.aadhaarForm.reset();
        this.otpForm.reset();

        this.consentItems.forEach(item => {
            item.children?.forEach(child => {
                child.checked = false;
            });
        });

        // this.stepper.reset();   // Goes back to Step 1
    }
}
