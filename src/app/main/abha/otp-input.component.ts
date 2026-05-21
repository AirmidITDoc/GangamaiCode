import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-otp-input',
  template: `
    <div class="otp-wrap">
      <input
        *ngFor="let _ of cells; let i = index"
        #cell
        type="text"
        inputmode="numeric"
        maxlength="1"
        autocomplete="one-time-code"
        [value]="digits[i] || ''"
        [disabled]="disabled"
        (input)="onInput($event, i)"
        (keydown)="onKeyDown($event, i)"
        (paste)="onPaste($event)"
        class="otp-cell"
      />
    </div>
  `,
  styles: [
    `
      .otp-wrap {
        display: flex;
        gap: 8px;
        justify-content: center;
      }
      .otp-cell {
        width: 44px;
        height: 52px;
        font-size: 22px;
        text-align: center;
        border: 1px solid rgba(0, 0, 0, 0.23);
        border-radius: 6px;
        outline: none;
        transition: border-color 120ms;
      }
      .otp-cell:focus {
        border-color: #1976d2;
        border-width: 2px;
      }
      .otp-cell:disabled {
        background: #f5f5f5;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true,
    },
  ],
})
export class OtpInputComponent implements ControlValueAccessor, AfterViewInit {
  @Input() length = 6;
  @Output() completed = new EventEmitter<string>();

  @ViewChildren('cell') cellRefs!: QueryList<ElementRef<HTMLInputElement>>;

  cells: number[] = [];
  digits: string[] = [];
  disabled = false;

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    this.cells = Array(this.length).fill(0);
    this.digits = Array(this.length).fill('');
  }

  ngAfterViewInit() {
    // focus first cell on mount
    setTimeout(() => this.cellRefs.first?.nativeElement.focus());
  }

  // ---- CVA hooks ----
  writeValue(val: string): void {
    const safe = (val || '').replace(/\D/g, '').slice(0, this.length);
    this.digits = Array(this.length)
      .fill('')
      .map((_, i) => safe[i] || '');
  }
  registerOnChange(fn: (val: string) => void) { this.onChange = fn; }
  registerOnTouched(fn: () => void) { this.onTouched = fn; }
  setDisabledState(d: boolean) { this.disabled = d; }

  // ---- input handling ----
  onInput(e: Event, idx: number) {
    const input = e.target as HTMLInputElement;
    const v = input.value.replace(/\D/g, '');
    this.digits[idx] = v.slice(-1) || '';
    input.value = this.digits[idx];
    this.emit();
    if (this.digits[idx] && idx < this.length - 1) {
      this.cellRefs.get(idx + 1)?.nativeElement.focus();
    }
  }

  onKeyDown(e: KeyboardEvent, idx: number) {
    if (e.key === 'Backspace' && !this.digits[idx] && idx > 0) {
      this.cellRefs.get(idx - 1)?.nativeElement.focus();
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      this.cellRefs.get(idx - 1)?.nativeElement.focus();
    } else if (e.key === 'ArrowRight' && idx < this.length - 1) {
      this.cellRefs.get(idx + 1)?.nativeElement.focus();
    }
  }

  onPaste(e: ClipboardEvent) {
    e.preventDefault();
    const txt = (e.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, this.length);
    if (!txt) return;
    this.digits = Array(this.length)
      .fill('')
      .map((_, i) => txt[i] || '');
    this.emit();
    const last = Math.min(txt.length, this.length) - 1;
    this.cellRefs.get(last)?.nativeElement.focus();
  }

  private emit() {
    const val = this.digits.join('');
    this.onChange(val);
    this.onTouched();
    if (val.length === this.length) this.completed.emit(val);
  }
}
