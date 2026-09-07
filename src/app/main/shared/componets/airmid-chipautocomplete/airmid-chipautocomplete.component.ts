import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { ApiCaller } from 'app/core/services/apiCaller';
import { BaseFormControlComponent } from '../base-form-control-component';

@Component({
  selector: 'app-airmid-chipautocomplete',
  templateUrl: './airmid-chipautocomplete.component.html',
  styleUrls: ['./airmid-chipautocomplete.component.scss']
})
export class AirmidChipautocompleteComponent
  extends BaseFormControlComponent
  implements OnInit, OnDestroy {

  @Input() chips: any[] = [];
  @Input() apiUrl = '';
  @Input() displayKey = '';
  @Input() allowCustom = true;
  @Input() placeholder = 'Select';
  @Input() label = '';

  @Output() chipsChange = new EventEmitter<any[]>();

  inputValue = '';
  allOptions: any[] = [];
  filteredOptions: any[] = [];
  showDropdown = false;
  focusedIndex = -1;

  // Speech recognition
  isListening = false;
  speechSupported = false;
  private recognition: any = null;

  @ViewChildren('autocompleteItem') autocompleteItems!: QueryList<ElementRef>;

  constructor(
    private http: ApiCaller,
    private cdr: ChangeDetectorRef,
    el: ElementRef
  ) {
    super(el);
  }

  ngOnInit(): void {
    this.initSpeechRecognition();

    if (this.apiUrl) {
      this.http.GetData(this.apiUrl).subscribe({
        next: (res) => {
          this.allOptions = res || [];
          this.filteredOptions = [...this.allOptions];
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Error fetching options:', err)
      });
    }
  }

  ngOnDestroy(): void {
    this.stopListening();
  }

  // ───────────────────── Speech Recognition ─────────────────────

  private initSpeechRecognition(): void {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.speechSupported = false;
      return;
    }

    this.speechSupported = true;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-IN';          // change if needed

    this.recognition.onstart = () => {
      this.isListening = true;
      this.cdr.detectChanges();
    };

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      if (transcript) {
        this.inputValue = transcript;
        this.filterOptions();

        // Auto-add the spoken text as a chip (same as working Diagnosis)
        setTimeout(() => {
          this.addChip(transcript);
          this.showDropdown = false;
          this.cdr.detectChanges();
        }, 350);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      this.isListening = false;
      this.cdr.detectChanges();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.cdr.detectChanges();
    };
  }

  startSpeechRecognition(): void {
    if (!this.recognition) {
      this.initSpeechRecognition();
    }

    if (!this.recognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
      return;
    }

    try {
      this.recognition.start();
    } catch (e) {
      console.warn(e);
    }
  }

  private stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    this.isListening = false;
  }

  // ───────────────────── Chip Logic ─────────────────────

  addChip(value: string): void {
    value = (value || '').trim();
    if (!value) return;

    const alreadyExists = this.chips.some(
      c => (c[this.displayKey] || '').toLowerCase() === value.toLowerCase()
    );
    if (alreadyExists) return;

    const matched = this.allOptions.find(
      opt => (opt[this.displayKey] || '').toLowerCase() === value.toLowerCase()
    );

    if (matched) {
      this.chips = [...this.chips, matched];
    } else if (this.allowCustom) {
      this.chips = [...this.chips, { [this.displayKey]: value, id: 0 }];
    } else {
      return;
    }

    this.chipsChange.emit(this.chips);
    this.resetInput();
    this.cdr.detectChanges();
  }

  removeChip(chipToRemove: any): void {
    this.chips = this.chips.filter(
      chip => chip[this.displayKey] !== chipToRemove[this.displayKey]
    );
    this.chipsChange.emit(this.chips);
    this.filterOptions();
  }

  selectOption(option: any): void {
    this.addChip(option[this.displayKey]);
    this.showDropdown = false;
  }

  // ───────────────────── Keyboard & Focus ─────────────────────

  onKeyDown(event: KeyboardEvent): void {
    const total = this.filteredOptions.length;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (total > 0) {
        this.focusedIndex = (this.focusedIndex + 1) % total;
        this.scrollToFocusedItem();
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (total > 0) {
        this.focusedIndex = (this.focusedIndex - 1 + total) % total;
        this.scrollToFocusedItem();
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.focusedIndex >= 0 && this.focusedIndex < total) {
        this.selectOption(this.filteredOptions[this.focusedIndex]);
      } else {
        this.addChip(this.inputValue);
      }
    } else if (event.key === 'Backspace' && !this.inputValue && this.chips.length) {
      this.removeChip(this.chips[this.chips.length - 1]);
    } else if (event.key === 'Escape') {
      this.showDropdown = false;
      this.stopListening();
    }
  }

  scrollToFocusedItem(): void {
    const items = this.autocompleteItems?.toArray() || [];
    if (this.focusedIndex >= 0 && this.focusedIndex < items.length) {
      items[this.focusedIndex].nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }

  onInputFocus(): void {
    this.filterOptions();
    this.showDropdown = true;
  }

  hideDropdownWithDelay(): void {
    setTimeout(() => {
      this.showDropdown = false;
      this.cdr.markForCheck();
    }, 200);
  }

  // ───────────────────── Filtering ─────────────────────

  filterOptions(): void {
    const filter = (this.inputValue || '').toLowerCase();

    this.filteredOptions = this.allOptions
      .filter(opt =>
        (opt[this.displayKey]?.toLowerCase() || '').includes(filter)
      )
      .filter(opt =>
        !this.chips.some(chip => chip[this.displayKey] === opt[this.displayKey])
      );

    this.focusedIndex = this.filteredOptions.length > 0 ? 0 : -1;
    this.showDropdown = true;
  }

  private resetInput(): void {
    this.inputValue = '';
    this.focusedIndex = -1;
    this.filterOptions();
  }
}