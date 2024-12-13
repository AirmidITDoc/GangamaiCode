import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { Component, HostBinding, Input, OnDestroy, OnInit, Optional, Self, forwardRef } from "@angular/core";
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

@Component({
    selector: "airmid-textbox",
    templateUrl: "./airmid-textbox.component.html",
    styleUrls: ["./airmid-textbox.component.scss"],
    // providers: [
    //     {
    //         provide: NG_VALUE_ACCESSOR,
    //         useExisting: forwardRef(() => AirmidTextboxComponent),
    //         multi: true,
    //     },
    // ],
    providers: [
        // {
        //     provide: MatFormFieldControl,
        //     useExisting: forwardRef(() => AirmidTextboxComponent),
        //     multi: true,
        // }
    ],
    host: {
        '(focusout)': 'onTouched()',
    },
})
export class AirmidTextboxComponent implements 
//ControlValueAccessor,
    //MatFormFieldControl<string>,
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
    @Input() formControlName:string;
    @Input() maxLength: number = 50;
    @Input() validations: [] = [];
    @Input() label: string = "";
    @Input() type:string="text";
    @Input() keyup:Event;
    @Input() appearance:string="outline";
    @Input() readonly:boolean=false;
    @Input() width:string="100%";
    @Input()
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
    id = `input-control-${++AirmidTextboxComponent.nextId}`;

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

    //   ngOnInit(): void {
    //   }

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

    //constructor() { }
    // @Input() label: string = ""; // Dynamic placeholder
    // @Input() placeholder: string = "Enter text"; // Dynamic placeholder
    // @Input() maxLength: number = 50; // Maximum length
    // @Input() formGroup: FormGroup;
    // @Input() fieldName: string = '';
    // @Input() validations: [] = [];
    // @Input() disabled: boolean = false;

    //control: FormControl = new FormControl(""); // Form control to manage value

    // onChange: any = () => {};
    //onTouched: any = () => { };

    // Called when Angular wants to write a value to the control
    // writeValue(value: any): void {
    //     this.control.setValue(value);
    // }

    // // Registers a callback function to be called when the control's value changes
    // registerOnChange(fn: any): void {
    //     this.onChange = fn;
    //     this.control.valueChanges.subscribe(fn); // Emit value changes
    // }

    // // Registers a callback function to be called when the control is touched
    // registerOnTouched(fn: any): void {
    //     this.onTouched = fn;
    // }

    // Set component's disabled state
    // setDisabledState?(isDisabled: boolean): void {
    //     isDisabled ? this.control.disable() : this.control.enable();
    // }

    // Handle custom validation if required is enabled
    ngOnInit() {
        //this.control.setValidators(this.formGroup.get(formControlName))
        // if (this.required) {
        //     this.control.setValidators([
        //         Validators.required,
        //         Validators.maxLength(this.maxLength),
        //     ]);
        // } else {
        //     this.control.setValidators([Validators.maxLength(this.maxLength)]);
        // }
    }
}
