import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Optional, Output, Self, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-airmid-dateofbirth',
    templateUrl: './airmid-dateofbirth.component.html',
    styleUrls: ['./airmid-dateofbirth.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirmidDateofbirthComponent implements OnInit {
    @Input() formGroup: FormGroup;
    @Input() formControlName: string;
    @Input() value: Date;
    dateStyle?: string = 'Date';
    ageYear: number = 0;
    ageMonth: number = 0;
    ageDay: number = 0;
    control = new FormControl();
    private destroy: Subject<void> = new Subject();
    OnChangeDobType(e) {
        this.dateStyle = e.value;
        this.ageYear = 0;
        this.ageMonth = 0;
        this.ageDay = 0;
    }
    CalcDOB(mode, e) {

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
            this.ageYear = 0
            Swal.fire("Please Enter Valid BirthDate..")
        }
    }
    minDate = new Date();
    onChangeDateofBirth(DateOfBirth: Date) {
        if (DateOfBirth > this.minDate) {
            Swal.fire("Enter Proper Birth Date.. ")
            return;
        }
        if (DateOfBirth) {
            const todayDate = new Date();
            const dob = new Date(DateOfBirth);
            const timeDiff = Math.abs(Date.now() - dob.getTime());
            // this.ageYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
            // this.ageMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
            // this.ageDay = Math.abs(todayDate.getDate() - dob.getDate());

            // this.ageYear =Math.((timeDiff / (1000 * 3600 * 24)) / 365.25);

            this.ageYear = todayDate.getFullYear() - dob.getFullYear();
            this.ageMonth = (todayDate.getMonth() - dob.getMonth());
            this.ageDay = (todayDate.getDate() - dob.getDate());

            if (this.ageDay < 0) {
                this.ageMonth--;
                const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
                this.ageDay += previousMonth.getDate(); // Days in previous month
                // this.ageDay =this.ageDay +1;
            }

            if (this.ageMonth < 0) {
                this.ageYear--;
                this.ageMonth += 12;
            }
            this.value = DateOfBirth;
            this.formGroup.get('DateOfBirth').setValue(DateOfBirth);
            if (this.ageYear > 110)
                Swal.fire("Please Enter Valid BirthDate..")
        }
    }
    ngOnInit(): void {
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
    constructor(@Optional() @Self() public ngControl: NgControl | null) {
        if (ngControl) {
            this.ngControl.valueAccessor = this;
            ngControl.valueAccessor = this;
        }
    }

}
