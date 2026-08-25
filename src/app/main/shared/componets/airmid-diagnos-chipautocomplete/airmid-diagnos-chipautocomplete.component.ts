
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Optional, Output, QueryList, Self, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { debounceTime, distinctUntilChanged, map, Observable, ReplaySubject, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { of } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatSelect } from '@angular/material/select';
import { BaseFormControlComponent } from '../base-form-control-component';

@Component({
  selector: 'app-airmid-diagnos-chipautocomplete',
  templateUrl: './airmid-diagnos-chipautocomplete.component.html',
  styleUrls: ['./airmid-diagnos-chipautocomplete.component.scss']
})
export class AirmidDiagnosChipautocompleteComponent extends BaseFormControlComponent implements OnInit {

  @Input() chips: any[] = [];
  @Input() apiUrl: string = '';
  @Output() chipsChange = new EventEmitter<string[]>();
  @Input() displayKey: string = ''; // default fallback
  @Input() allowCustom: boolean = true;
  @Input() placeholder: string = "Select";
  @Input() label: string = "";

  inputValue: string = '';
  allOptions: any[] = [];  // array of objects
  filteredOptions: any[] = [];
  private searchSubject = new Subject<string>();
  showDropdown = false;
  focusedIndex: number = -1;
  @ViewChildren('autocompleteItem') autocompleteItems!: QueryList<ElementRef>;

  constructor(private http: ApiCaller, el: ElementRef) {
    super(el);
  }

  ngOnInit() {

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(keyword => {
        debugger
        // Do not call API if keyword is empty
        if (!keyword || keyword.trim().length < 1) {
          this.allOptions = [];
          this.filteredOptions = [];
          return of([]);
        }
        const url = this.apiUrl + encodeURIComponent(keyword.trim());
        return this.http.GetData(url);
      })
    ).subscribe({
      next: (res: any) => {
        this.allOptions = Array.isArray(res) ? res : (res?.data || []);
        this.applyLocalFilter();
      },
      error: (err) => {
        console.error('Error fetching options:', err);
        this.allOptions = [];
        this.filteredOptions = [];
      }
    });
  }

  addChip(value: string) {
    value = value.trim();
    if (!value) return;

    const matched = this.allOptions.find(opt =>
      (opt[this.displayKey] || '').toLowerCase() === value.toLowerCase()
    );

    const alreadyExists = this.chips.some(c =>
      (c[this.displayKey] || '').toLowerCase() === value.toLowerCase()
    );

    if (alreadyExists) return;

    if (matched) {
      this.chips.push(matched);
    } else if (this.allowCustom) {
      const customObj: any = {
        [this.displayKey]: value,
        id: 0
      };
      this.chips.push(customObj);
    }

    this.chipsChange.emit(this.chips);
    this.resetInput();
    this.filterOptions();
  }


  removeChip(value: string) {
    this.chips = this.chips.filter(chip => chip !== value);
    this.chipsChange.emit(this.chips);
    this.filterOptions();
  }


  onKeyDown(event: KeyboardEvent) {
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
        const option = this.filteredOptions[this.focusedIndex];
        this.selectOption(option);
      } else {
        this.handleEnter();
      }
    }
  }

  scrollToFocusedItem() {
    const items = this.autocompleteItems.toArray();
    if (this.focusedIndex >= 0 && this.focusedIndex < items.length) {
      items[this.focusedIndex].nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }

  onInputFocus() {
    this.filterOptions();
    this.showDropdown = true;
  }

  handleEnter() {
    this.addChip(this.inputValue);
  }

  handleChange() {
    this.addChip(this.inputValue);
  }


  private resetInput() {
    this.inputValue = '';
    this.filteredOptions = [...this.allOptions];
    this.focusedIndex = -1;
  }

  hideDropdownWithDelay() {
    setTimeout(() => this.showDropdown = false, 200); // delay to allow click
  }



  selectOption(option: any) {
    const value = option[this.displayKey];
    this.addChip(value);
    this.showDropdown = false;
  }


  filterOptions() {

    debugger
    const keyword = (this.inputValue || this.inputValue.toLowerCase() || '').trim();
    this.searchSubject.next(keyword);
    this.applyLocalFilter();
  }

  private applyLocalFilter() {
    const filter = (this.inputValue || this.inputValue.toLowerCase() || '').toLowerCase();

    this.filteredOptions = this.allOptions
      .filter(opt =>
        (opt[this.displayKey]?.toLowerCase() || '').includes(filter)
      )
      .filter(opt => !this.chips.some(chip => chip[this.displayKey] === opt[this.displayKey]));

    this.focusedIndex = this.filteredOptions.length > 0 ? 0 : -1;
    this.showDropdown = this.filteredOptions.length > 0;
  }
}

