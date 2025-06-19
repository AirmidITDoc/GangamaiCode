import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

/**
 * AirmidTimePickerComponent
 * 
 * A customizable time picker component that supports both template-driven and reactive forms.
 * 
 * @example
 * // Reactive Forms Usage
 * <airmid-time-picker
 *   formControlName="selectedTime"
 *   label="Appointment Time"
 *   [mode]="'12h'"
 *   [isDisabled]="false"
 *   (timeChange)="onTimeChange($event)">
 * </airmid-time-picker>
 * 
 * // Template-driven Forms Usage
 * <airmid-time-picker
 *   [(ngModel)]="timeValue"
 *   label="Select Time"
 *   [appearance]="'outline'"
 *   [width]="50">
 * </airmid-time-picker>
 * 
 * @Input Properties
 * - label: string - The label text for the time picker (default: 'Select Time')
 * - mode: '12h' | '24h' - Time format mode (default: '12h')
 * - isDisabled: boolean - Disable the time picker (default: false)
 * - appearance: string - Mat form field appearance ('outline' | 'fill' | 'standard') (default: 'outline')
 * - width: number - Width of the component in percentage (default: 100)
 * - placeholder: string - Placeholder text when empty
 * - readonly: boolean - Makes the input readonly (default: false)
 * 
 * @Important Notes
 * 1. Do not use formControlName and ngModel together
 * 2. When using with reactive forms, import ReactiveFormsModule
 * 3. When using with template-driven forms, import FormsModule
 * 
 */
@Component({
  selector: 'airmid-time-picker',
  templateUrl: './airmid-time-picker.component.html',
  styleUrls: ['./airmid-time-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AirmidTimePickerComponent),
      multi: true
    }
  ]
})
export class AirmidTimePickerComponent implements ControlValueAccessor, OnInit {

  @Input() label: string = 'Select Time'; // Label for the field
  @Input() mode: '12h' | '24h' = '12h'; // Time format mode
  @Input() isDisabled: boolean = false; // Disable picker

  // Add new Input properties similar to textbox
  @Input() appearance: string = 'outline';
  @Input() width: number;
  @Input() readonly: boolean = false;
  @Input() placeholder: string = '';
  /* Minimum time to pick from */
  @Input() minDate: Date;

  /* Maximum time to pick from */
  @Input() maxDate: Date;
  @Input() formGroup: FormGroup;
  @Input() formControlName: string;
  @Output() timeChange = new EventEmitter<string>();
  @Output() change = new EventEmitter<any>();
  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<FocusEvent>();
  @Output() focus = new EventEmitter<FocusEvent>();
  @Output() keyup = new EventEmitter<KeyboardEvent>();
  @Output() keydown = new EventEmitter<KeyboardEvent>();
  @Output() click = new EventEmitter<MouseEvent>();
  @Output() input = new EventEmitter<Event>();

  timeValue: string = '';

  private onTouched = () => { };

  ngOnInit(): void {
    if (this.formGroup && this.formControlName) {
      const control = this.formGroup.controls[this.formControlName];
      if (control) {
        control.setValidators([
          Validators.required,
        ]);
        control.updateValueAndValidity();
      }
    }
  }

  writeValue(value: string): void {
    this.timeValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onTimeSelected(event: string) {
    this.timeValue = event;
    this.timeChange.emit(event);
  }
  onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.change.emit(input.value);
  }
  onFocus(event: FocusEvent) {
    this.focus.emit(event);
  }

  onKeyUp(event: KeyboardEvent) {
    this.keyup.emit(event);
  }

  onKeyDown(event: KeyboardEvent) {
    this.keydown.emit(event);
  }

  onClick(event: MouseEvent) {
    this.click.emit(event);
  }

  onInput(event: Event) {
    this.input.emit(event);
  }
  onValueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }
}
