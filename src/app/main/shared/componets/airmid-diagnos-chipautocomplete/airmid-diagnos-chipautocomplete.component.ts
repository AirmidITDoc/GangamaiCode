import {
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
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ApiCaller } from 'app/core/services/apiCaller';
import { BaseFormControlComponent } from '../base-form-control-component';

@Component({
  selector: 'app-airmid-diagnos-chipautocomplete',
  templateUrl: './airmid-diagnos-chipautocomplete.component.html',
  styleUrls: ['./airmid-diagnos-chipautocomplete.component.scss']
})
export class AirmidDiagnosChipautocompleteComponent
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

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private http: ApiCaller, el: ElementRef) {
    super(el);
  }

  ngOnInit(): void {
    this.initSpeechRecognition();

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(keyword => {
          if (!keyword || keyword.trim().length < 1) {
            this.allOptions = [];
            this.filteredOptions = [];
            return of([]);
          }
          const url = this.apiUrl + encodeURIComponent(keyword.trim());
          return this.http.GetData(url);
        })
      )
      .subscribe({
        next: (res: any) => {
          this.allOptions = Array.isArray(res) ? res : res?.data || [];
          this.applyLocalFilter();
        },
        error: err => {
          console.error('Error fetching options:', err);
          this.allOptions = [];
          this.filteredOptions = [];
        }
      });
  }

  ngOnDestroy(): void {
    this.stopListening();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Speech Recognition ─────────────────────────────────────────────

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
    this.recognition.continuous = false;          // stop after one phrase
    this.recognition.interimResults = false;      // only final result
    this.recognition.lang = 'en-IN';               // change if needed (en-US, hi-IN…)

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      if (transcript) {
        this.inputValue = transcript;
        this.filterOptions();          // trigger API search

          // Add voice text as chip
    setTimeout(() => {
      this.addChip(transcript);
      this.showDropdown = false;
    }, 350);
    
        // Optional: auto-add the spoken value as a chip
        // this.addChip(transcript);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  startSpeechRecognition() {
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

    this.recognition.start();
}



 toggleListening(): void {
    if (!this.speechSupported) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  private startListening(): void {
    try {
      this.recognition.start();
    } catch (e) {
      // already started
      console.warn(e);
    }
  }

  private stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    this.isListening = false;
  }

  // ─── Chip management ────────────────────────────────────────────────

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
      this.chips = [
        ...this.chips,
        { [this.displayKey]: value, id: 0 }
      ];
    } else {
      return;
    }

    this.chipsChange.emit(this.chips);
    this.resetInput();
  }

  removeChip(chipToRemove: any): void {
    this.chips = this.chips.filter(
      chip => chip[this.displayKey] !== chipToRemove[this.displayKey]
    );
    this.chipsChange.emit(this.chips);
    this.applyLocalFilter();
  }

  // ─── Keyboard & focus ───────────────────────────────────────────────

  onKeyDown(event: KeyboardEvent): void {
    const total = this.filteredOptions.length;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (total > 0) {
          this.focusedIndex = (this.focusedIndex + 1) % total;
          this.scrollToFocusedItem();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (total > 0) {
          this.focusedIndex = (this.focusedIndex - 1 + total) % total;
          this.scrollToFocusedItem();
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (this.focusedIndex >= 0 && this.focusedIndex < total) {
          this.selectOption(this.filteredOptions[this.focusedIndex]);
        } else {
          this.handleEnter();
        }
        break;

      case 'Escape':
        this.showDropdown = false;
        this.focusedIndex = -1;
        this.stopListening();
        break;
    }
  }

  private scrollToFocusedItem(): void {
    const items = this.autocompleteItems?.toArray() || [];
    if (this.focusedIndex >= 0 && this.focusedIndex < items.length) {
      items[this.focusedIndex].nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }

  onInputFocus(): void {
    this.showDropdown = true;
    this.filterOptions();
  }

  hideDropdownWithDelay(): void {
    setTimeout(() => {
      this.showDropdown = false;
      this.focusedIndex = -1;
    }, 200);
  }

  // ─── Selection helpers ──────────────────────────────────────────────

  selectOption(option: any): void {
    this.addChip(option[this.displayKey]);
    this.showDropdown = false;
  }

  handleEnter(): void {
    this.addChip(this.inputValue);
  }

  // ─── Filtering ──────────────────────────────────────────────────────

  filterOptions(): void {
    const keyword = (this.inputValue || '').trim();
    this.searchSubject.next(keyword);
    this.applyLocalFilter();
  }

  private applyLocalFilter(): void {
    const filter = (this.inputValue || '').toLowerCase().trim();

    this.filteredOptions = this.allOptions
      .filter(opt =>
        (opt[this.displayKey] || '').toLowerCase().includes(filter)
      )
      .filter(
        opt =>
          !this.chips.some(
            chip => chip[this.displayKey] === opt[this.displayKey]
          )
      );

    this.focusedIndex = this.filteredOptions.length > 0 ? 0 : -1;
  }

  private resetInput(): void {
    this.inputValue = '';
    this.focusedIndex = -1;
    this.applyLocalFilter();
  }
}