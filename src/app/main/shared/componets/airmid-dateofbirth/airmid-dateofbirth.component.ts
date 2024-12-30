import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'airmid-dateofbirth',
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
    constructor() { }
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
    }
    onChangeDateofBirth(DateOfBirth) {
        if (DateOfBirth) {
            const todayDate = new Date();
            const dob = new Date(DateOfBirth);
            const timeDiff = Math.abs(Date.now() - dob.getTime());
            this.ageYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
            this.ageMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
            this.ageDay = Math.abs(todayDate.getDate() - dob.getDate());
            this.value = DateOfBirth;
            this.formGroup.get('DateOfBirth').setValue(DateOfBirth);
        }
    }
    ngOnInit(): void {
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.value?.firstChange && changes.value?.currentValue) {
            this.onChangeDateofBirth(changes.value.currentValue);
        }
    }

}
