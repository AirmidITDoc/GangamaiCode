import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { AbhaService } from '../../abha.service';
import { AbhaValidators } from '../../abha.validators';

@Component({
    selector: 'app-abha-address-step',
    templateUrl: './abha-address-step.component.html',
    styleUrls: ['./abha-address-step.component.scss']
})
export class AbhaAddressStepComponent implements OnInit {
    @Input() form!: FormGroup;
    @Input() beneficiaryName: string = '';
    @Output() create = new EventEmitter<void>();
    @Output() back = new EventEmitter<void>();

    defaultAddress = '91822696409055@sbx';
    existingAddress = 'rahul.k1992';
    takenAbhaAddress: string;

    loading = false;
    suggestionsLoading = false;
    suggestions: string[] = [];

    availability: { available: boolean | null; message: string } = {
        available: null,
        message: ''
    };

    constructor(
        private abhaService: AbhaService,
        private snack: MatSnackBar
    ) {
        //this.takenAbhaAddress = this.abhaService.TAKEN_ABHA_ADDRESS;
    }

    ngOnInit(): void {
        // React to addressOption changes
        this.form.get('addressOption')?.valueChanges.subscribe((opt) => {
            this.applyOptionValidators(opt);
            if (opt === 'suggestion' && this.suggestions.length === 0) {
                this.loadSuggestions();
            }
        });

        // Live availability check for custom address
        // this.form
        //     .get('customAbhaAddress')
        //     ?.valueChanges.pipe(
        //         debounceTime(350),
        //         distinctUntilChanged(),
        //         switchMap((val: string) => {
        //             this.availability = { available: null, message: '' };
        //             if (!val || this.form.get('customAbhaAddress')?.invalid) {
        //                 return of(null);
        //             }
        //             //return this.abhaService.checkAbhaAddressAvailability(val);
        //         })
        //     )
        //     .subscribe((res) => {
        //         if (res) {
        //             this.availability = { available: res.available, message: res.message };
        //             if (!res.available) {
        //                 this.form.get('customAbhaAddress')?.setErrors({
        //                     ...this.form.get('customAbhaAddress')?.errors,
        //                     taken: true
        //                 });
        //             }
        //         }
        //     });
    }

    private applyOptionValidators(option: string): void {
        const custom = this.form.get('customAbhaAddress');
        const suggestion = this.form.get('selectedSuggestion');
        custom?.clearValidators();
        suggestion?.clearValidators();
        this.availability = { available: null, message: '' };

        if (option === 'custom') {
            custom?.setValidators([Validators.required, AbhaValidators.abhaAddress]);
        } else if (option === 'suggestion') {
            suggestion?.setValidators([Validators.required]);
        }
        custom?.updateValueAndValidity();
        suggestion?.updateValueAndValidity();
    }

    loadSuggestions(): void {
        this.suggestionsLoading = true;
        // this.abhaService.getAddressSuggestions(this.beneficiaryName).subscribe((res) => {
        //     this.suggestions = res;
        //     this.suggestionsLoading = false;
        // });
    }

    selectSuggestion(s: string): void {
        this.form.patchValue({ selectedSuggestion: s });
    }

    /** Rule pills (visual indicators of which rules pass) */
    ruleMet(rule: string): boolean {
        const val: string = this.form.value.customAbhaAddress || '';
        if (!val) return false;

        switch (rule) {
            case 'length':
                return val.length >= 8 && val.length <= 18;
            case 'alphanumeric':
                return /^[a-zA-Z0-9._]+$/.test(val) && /[a-zA-Z]/.test(val);
            case 'symbols': {
                const d = (val.match(/\./g) || []).length;
                const u = (val.match(/_/g) || []).length;
                return d <= 1 && u <= 1;
            }
            case 'edges':
                return !/^[._]/.test(val) && !/[._]$/.test(val);
        }
        return false;
    }

    onCustomInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        // Allow only alphanumeric, dot, underscore
        const cleaned = input.value.replace(/[^a-zA-Z0-9._]/g, '').slice(0, 18);
        if (input.value !== cleaned) {
            input.value = cleaned;
            this.form.get('customAbhaAddress')?.setValue(cleaned);
        }
    }

    get canCreate(): boolean {
        const opt = this.form.value.addressOption;
        if (!opt) return false;
        if (opt === 'existing' || opt === 'default') return true;
        if (opt === 'custom') {
            return (
                this.form.get('customAbhaAddress')?.valid === true &&
                this.availability.available === true
            );
        }
        if (opt === 'suggestion') {
            return !!this.form.value.selectedSuggestion;
        }
        return false;
    }

    onCreate(): void {
        if (!this.canCreate) {
            this.form.markAllAsTouched();
            return;
        }
        this.loading = true;
        // The service-level createAbha is invoked from parent; just emit
        setTimeout(() => {
            this.loading = false;
            this.create.emit();
        }, 200);
    }

    onBack(): void {
        this.back.emit();
    }
}
