import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Optional, Output, Self } from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    FormGroup,
    NG_VALUE_ACCESSOR,
    NgControl,
    Validators
} from "@angular/forms";
import { MatFormFieldControl } from "@angular/material/form-field";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DatePipe } from '@angular/common';

@Component({
    selector: 'airmid-datepicker',
    templateUrl: './airmid-datepicker.component.html',
    styleUrls: ['./airmid-datepicker.component.scss']
    ,
    host: {
        '(focusout)': 'onTouched()',
    },
})
export class AirmidDatepickerComponent implements

    OnInit,
    OnDestroy {
    static nextId: number = 0;

    private _disabled: boolean = false;
    private _focused: boolean = false;
    private _placeholder: string = '';
    private _required: boolean = false;
    private destroy: Subject<void> = new Subject();

    control = new FormControl();
    stateChanges: Subject<void> = new Subject();
    @Input() formGroup: FormGroup;
    @Input() formControlName: string;
    @Input() formStartControlName: string;
    @Input() formEndControlName: string;
    @Input() maxLength: number = 50;
    @Input() validations: [] = [];
    @Input() label: string = "";
    @Input() type: string = "text";
    @Input() keyup: Event;
    @Input() appearance: string = "outline";
    @Input() readonly: boolean = false;
    @Input() width: number = 100;
    @Input() isRangePicker: boolean = false;
    @Input() format: string = "yyyy-MM-dd"
    @Output() dateChange = new EventEmitter<any>();
    @Output() fromValueChange = new EventEmitter<string>();
    @Output() toValueChange = new EventEmitter<string>();
    date = new Date();

    minDate = new Date();
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    @Input()
    get placeholder(): string {
        return this._placeholder ?? this.label;
    }
    set placeholder(value: string) {
        this._placeholder = value;
        this.stateChanges.next();
    }
    @Input()
    get required(): boolean {
        return this._required;
    }
    set required(value: boolean) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }

    @Input()
    get value(): string {
        return this.control.value;
    }
    set value(value: string) {
        this.control.setValue(value);
        this.stateChanges.next();
    }
    @Input()
    get fromValue(): string {
        return this.control.value;
    }
    set fromValue(value: string) {
        this.control.setValue(value);
        this.stateChanges.next();
    }
    @Input()
    get toValue(): string {
        return this.control.value;
    }
    set toValue(value: string) {
        this.control.setValue(value);
        this.stateChanges.next();
    }

    @HostBinding('attr.aria-describedby')
    describedBy: string = '';

    @HostBinding()
    id = `input-control-${++AirmidDatepickerComponent.nextId}`;

    @HostBinding('class.floating')
    get shouldLabelFloat(): boolean {
        return this.focused || !this.empty;
    }
    get focused(): boolean {
        return this._focused;
    }
    set focused(value: boolean) {
        this._focused = value;
        this.stateChanges.next();
    }
    get empty(): boolean {
        return !this.control.value;
    }
    get errorState(): boolean {
        return this.ngControl.control !== null ? !!this.ngControl.control : false;
    }

    constructor(@Optional() @Self() public ngControl: NgControl | null, public datePipe: DatePipe) {
        if (ngControl) {
            // Set the value accessor directly (instead of providing NG_VALUE_ACCESSOR) to avoid running into a circular import
            this.ngControl.valueAccessor = this;
            ngControl.valueAccessor = this;
        }
    }



    ngOnDestroy(): void {
        this.destroy.next();
        this.destroy.complete();
        this.stateChanges.complete();
    }

    onTouched(): void { }

    registerOnChange(onChange: (value: string | null) => void): void {
        this.control.valueChanges.pipe(takeUntil(this.destroy)).subscribe(onChange);
    }

    registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
    }

    setDescribedByIds(ids: string[]): void {
        this.describedBy = ids.join(' ');
    }

    setDisabledState(shouldDisable: boolean): void {
        if (shouldDisable) {
            this.control.disable();
        } else {
            this.control.enable();
        }

        this.disabled = shouldDisable;
    }

    onContainerClick(event: MouseEvent): void {
        // if ((event.target as Element).tagName.toLowerCase() !== 'input') {
        //   this.focusMonitor.focusVia(this.areaRef.nativeElement, 'mouse');
        // }
    }

    public onDateChange($event) {
        
        //this.formGroup.controls[this.formControlName].setValue($event.value);
        this.formGroup.controls[this.formControlName].setValue(this.datePipe.transform($event.value, this.format));
        this.dateChange.emit(this.datePipe.transform($event.value, this.format));
    }
    public onStartDateChange($event) {
        this.formGroup.controls[this.formStartControlName].setValue($event.value);
        this.dateChange.emit(this.datePipe.transform($event.value, this.format));
        this.fromValueChange.emit(this.datePipe.transform($event.value, this.format));
    }
    public onEndDateChange($event) {
        this.formGroup.controls[this.formEndControlName].setValue($event.value);
        this.dateChange.emit(this.datePipe.transform($event.value, this.format));
        this.toValueChange.emit(this.datePipe.transform($event.value, this.format));
    }

    writeValue(value: string | null): void {
        this.control.setValue(value);
    }


    ngOnInit() {
        if (!this.isRangePicker) {
            let date = this.datePipe.transform(this.formGroup.controls[this.formControlName].value, this.format);
            this.formGroup.controls[this.formControlName].setValue(date);
        }
    }
}
