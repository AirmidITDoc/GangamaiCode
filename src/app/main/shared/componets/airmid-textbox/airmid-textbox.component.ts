import { Component, Input, OnInit, forwardRef } from "@angular/core";
import {
    ControlValueAccessor,
    FormControl,
    FormGroup,
    NG_VALUE_ACCESSOR,
    Validators
} from "@angular/forms";

@Component({
    selector: "airmid-textbox",
    templateUrl: "./airmid-textbox.component.html",
    styleUrls: ["./airmid-textbox.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AirmidTextboxComponent),
            multi: true,
        },
    ],
})
export class AirmidTextboxComponent implements OnInit {
    constructor() { }
    @Input() label: string = ""; // Dynamic placeholder
    @Input() placeholder: string = "Enter text"; // Dynamic placeholder
    @Input() maxLength: number = 50; // Maximum length
    @Input() formGroup: FormGroup;
    @Input() fieldName: string = '';
    @Input() validations: [] = [];
    @Input() disabled: boolean = false;

    //control: FormControl = new FormControl(""); // Form control to manage value

    // onChange: any = () => {};
    onTouched: any = () => { };

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
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    // Set component's disabled state
    // setDisabledState?(isDisabled: boolean): void {
    //     isDisabled ? this.control.disable() : this.control.enable();
    // }

    // Handle custom validation if required is enabled
    ngOnInit() {
        debugger
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
