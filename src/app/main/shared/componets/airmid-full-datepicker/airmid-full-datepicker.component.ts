import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Optional, Output, Self } from '@angular/core';
import {
    FormControl,
    FormGroup,
    NgControl,
    Validators
} from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'airmid-full-datepicker',
    templateUrl: './airmid-full-datepicker.component.html',
    styleUrls: ['./airmid-full-datepicker.component.scss']
    ,
    host: {
        '(focusout)': 'onTouched()',
    },
})
export class AirmidFullDatepickerComponent implements

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
    @Input() maxLength: number = 50;
    @Input() validations: [] = [];
    @Input() label: string = "";
    @Input() type: string = "text";
    @Input() keyup: Event;
    @Input() appearance: string = "outline";
    @Input() readonly: boolean = false;
    @Input() width: number = 100;
    @Input() isRangePicker: boolean = false;
    @Input() format: string = "MM/dd/yyyy"
    @Output() dateChange = new EventEmitter<any>();
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
    id = `input-control-${++AirmidFullDatepickerComponent.nextId}`;

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

        const isValid = this.formGroup.controls[this.formControlName].valid;
        if(isValid){
            this.formGroup.controls[this.formControlName].setValue($event.value);
            this.dateChange.emit(this.datePipe.transform($event.value, this.format));
        }
    }

    writeValue(value: string | null): void {
        this.control.setValue(value);
    }


    ngOnInit() {
        const control = this.formGroup.controls[this.formControlName];
        if (control) {
            control.setValidators([Validators.required]);
            control.updateValueAndValidity();
        }

    }
}
