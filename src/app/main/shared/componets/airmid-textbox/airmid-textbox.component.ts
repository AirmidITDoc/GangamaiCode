import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Optional, Output, Self } from "@angular/core";
import {
    ControlValueAccessor,
    FormControl,
    FormGroup,
    NgControl
} from "@angular/forms";
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
export class AirmidTextboxComponent implements ControlValueAccessor, OnInit, OnDestroy {
    static nextId: number = 0;

    private _disabled: boolean = false;
    private _focused: boolean = false;
    private _placeholder: string = '';
    private _required: boolean = false;
    private destroy: Subject<void> = new Subject();

    control = new FormControl();
    stateChanges: Subject<void> = new Subject();
    @Output() keyup = new EventEmitter<any>();
    @Output() change = new EventEmitter<any>();
    @Output() valueChange = new EventEmitter<string>();
    @Input() formGroup: FormGroup;
    @Input() formControlName: string;
    @Input() maxLength: number = 200;
    @Input() validations: [] = [];
    @Input() label: string = "";
    @Input() type: string = "text";
    @Input() appearance: string = "outline";
    @Input() readonly: boolean = false;
    @Input() width: number = 100;
    @Input() isMovable = true;
    @Input() min:number = -Infinity;
    @Input() max:number = 99999;


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
    get activeErrors(): string[] {
        try {
            if (!this.formGroup || this.formGroup[this.formControlName] || !this.validations || this.validations.length <= 0) {
                return [];
            }
            // Find active validation 
            return this.validations
                .filter((validation: any) => this.formGroup.controls[this.formControlName].hasError(validation.name.toLowerCase()))
                .map((validation: any) => validation.Message);
        } catch (error) {
            console.log("Textbox Error => ", error);
        }

    }
    constructor(
        @Optional() @Self() public ngControl: NgControl | null,
        private el: ElementRef
    ) {
        if (ngControl) {
            this.ngControl.valueAccessor = this;
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
        this.value = value;
    }
    onValueChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.valueChange.emit(input.value);
    }
    onKeyUp(event: KeyboardEvent): void {
        this.keyup.emit(event);
    }
    focusNextInput(formControlName: string): void {
        const modalElement = document.querySelector("mat-dialog-container");
        const parentElement = modalElement ? modalElement : document.body;

        const inputFields = Array.from(parentElement.querySelectorAll("mat-form-field input"));
        const currentIndex = inputFields.findIndex(i => i.getAttribute('name') === formControlName);

        // Find current field and focus the next one 
        if (currentIndex !== -1 && currentIndex < inputFields.length - 1) {

            // Focus to the next input element
            (inputFields[currentIndex + 1] as HTMLInputElement).focus();
        }
    }
    onChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.change.emit(input.value);
    }

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
