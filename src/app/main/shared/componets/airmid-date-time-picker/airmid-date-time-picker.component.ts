import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-airimd-date-time-picker',
  templateUrl: './airmid-date-time-picker.component.html',
  styleUrls: ['./airmid-date-time-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AirmidDateTimePickerComponent),
      multi: true
    }
  ]
})
export class AirmidDateTimePickerComponent {
  @Input() label: string = 'Select Date & Time';
  @Input() formGroup: FormGroup;
  @Input() formControlName: string;
  @Input() appearance: string = 'outline';
  @Input() readonly: boolean = false;
  @Input() width: number = 150;
  @Input() isDisabled: boolean = false;
  @Input() ngModel: Date;

  @Output() dateTimeChange = new EventEmitter<Date>();

  dateValue: Date | null = null;
  timeValue: Date;
  private onTouched = () => { };
  private onChange = (value: Date) => { };

  writeValue(value: Date): void {
    if (value) {
      this.dateValue = new Date(value);
      this.timeValue = new Date(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onDateChange(event: any) {
    if (event?.value) {
      this.dateValue = new Date(event.value);
      this.updateFormValue();
      this.emitDateTimeChange();
    }
  }

  onTimeChange(time: Date) {
    this.timeValue = time;
    this.updateFormValue();
    this.emitDateTimeChange();
  }

  private emitDateTimeChange() {
    if (!this.dateValue) {
      this.dateValue = new Date();
    }
    let hours = 0;
    let minutes = 0;
    if (this.timeValue) {
      hours = this.timeValue.getHours();
      minutes = this.timeValue.getMinutes();
    }
    this.dateValue.setHours(hours, minutes);
    this.dateTimeChange.emit(this.dateValue);
    this.onChange(this.dateValue);

  }

  private updateFormValue() {
    if (this.formGroup && this.formControlName && this.formGroup.controls[this.formControlName]) {
      this.formGroup.controls[this.formControlName].setValue(this.dateValue);
    }
    if (this.ngModel !== undefined) {
      this.ngModel = this.dateValue;
    }
  }
}
