import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, HostBinding, Input, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import {
    ControlValueAccessor,
    UntypedFormControl,
    UntypedFormGroup,
    NG_VALUE_ACCESSOR,
    NgControl,
    Validators
} from "@angular/forms";
import { MatFormFieldControl } from "@angular/material/form-field";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-airmid-datepicker',
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
 
     control = new UntypedFormControl();
     stateChanges: Subject<void> = new Subject();
     @Input() formGroup: UntypedFormGroup;
     @Input() formControlName:string;
     @Input() maxLength: number = 50;
     @Input() validations: [] = [];
     @Input() label: string = "";
     @Input() type:string="text";
     @Input() keyup:Event;
     @Input() appearance:string="outline";
     @Input() readonly:boolean=false;
     @Input() width:number=100;
     @Input()
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
 
     constructor(@Optional() @Self() public ngControl: NgControl | null) {
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
 
     writeValue(value: string | null): void {
         this.control.setValue(value);
     }
 
     
     ngOnInit() {
       
     }
 }
 