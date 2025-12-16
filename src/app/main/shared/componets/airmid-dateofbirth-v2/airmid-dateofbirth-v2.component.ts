import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Optional, Self, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { BaseFormControlComponent } from '../base-form-control-component';

@Component({
    selector: 'app-airmid-dateofbirth-v2',
    templateUrl: './airmid-dateofbirth-v2.component.html',
    styleUrls: ['./airmid-dateofbirth-v2.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirmidDateofbirthV2Component extends BaseFormControlComponent implements OnInit {
    @Input() formGroup: FormGroup;
    @Input() formControlName: string;
    @Input() value: Date;
    @Input() dateStyle?: string;
    @Input() hideButtons: boolean = false;
    
    ageYear: number = 0;
    ageMonth: number = 0;
    ageDay: number = 0;
    control = new FormControl();
    private destroy: Subject<void> = new Subject();

    dateStyleOptions = [
        { value: 'Date', label: 'Date' },
        { value: 'Day', label: 'Day' },
        { value: 'Month', label: 'Month' },
        { value: 'Year', label: 'Year' }
    ];

    OnChangeDobType(value: string) {
        this.dateStyle = value;
        this.ageYear = 0;
        this.ageMonth = 0;
        this.ageDay = 0;
    }

    CalcDOB(mode: string, e: any) {
        let d = new Date();
        if (mode == "Day") {
            d.setDate(d.getDate() - Number(e.target.value));
            this.value = d;
            this.ageDay = Number(e.target.value);
        }
        else if (mode == "Month") {
            d.setMonth(d.getMonth() - Number(e.target.value));
            this.value = d;
            this.ageMonth = Number(e.target.value);
        }
        else if (mode == "Year") {
            d.setFullYear(d.getFullYear() - Number(e.target.value));
            this.value = d;
            this.ageYear = Number(e.target.value);
        }
        this.formGroup.controls[this.formControlName].setValue(d);

        if (this.ageYear > 110) {
            this.ageYear = 0;
            this.toastr.warning('Please Enter Valid BirthDate..', 'warning !', {
                toastClass: 'tostr-tost custom-toast-success',
            });
        }
    }

    minDate = new Date();

    onChangeDateofBirth(DateOfBirth: Date) {
        if (DateOfBirth > this.minDate) {
            this.toastr.warning('Enter Proper Birth Date..', 'warning !', {
                toastClass: 'tostr-tost custom-toast-success',
            });
            return;
        }
        if (DateOfBirth) {
            const todayDate = new Date();
            const dob = new Date(DateOfBirth);

            this.ageYear = todayDate.getFullYear() - dob.getFullYear();
            this.ageMonth = (todayDate.getMonth() - dob.getMonth());
            this.ageDay = (todayDate.getDate() - dob.getDate());

            if (this.ageDay < 0) {
                this.ageMonth--;
                const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
                this.ageDay += previousMonth.getDate();
            }

            if (this.ageMonth < 0) {
                this.ageYear--;
                this.ageMonth += 12;
            }
            this.value = DateOfBirth;
            this.formGroup.get('DateOfBirth').setValue(DateOfBirth);
            if (this.ageYear > 110) {
                this.toastr.warning('Please Enter Valid BirthDate..', 'warning !', {
                    toastClass: 'tostr-tost custom-toast-success',
                });
            }
        }
    }

    ngOnInit(): void {
        if (!this.dateStyle) {
            this.dateStyle = 'Date';
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.value?.firstChange && changes.value?.currentValue) {
            this.onChangeDateofBirth(changes.value.currentValue);
        }
    }

    onTouched(): void { }

    registerOnChange(onChange: (value: string | null) => void): void {
        this.control.valueChanges.pipe(takeUntil(this.destroy)).subscribe(onChange);
    }

    registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
    }

    writeValue(value: string | null): void {
        this.control.setValue(value);
    }

    constructor(@Optional() @Self() public ngControl: NgControl | null, public toastr: ToastrService, el: ElementRef) {
        super(el);
        if (ngControl) {
            this.ngControl.valueAccessor = this;
            ngControl.valueAccessor = this;
        }
    }

    ngOnDestroy(): void {
        this.destroy.next();
        this.destroy.complete();
    }
}

