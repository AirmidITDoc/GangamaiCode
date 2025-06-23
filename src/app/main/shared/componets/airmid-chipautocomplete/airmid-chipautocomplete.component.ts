import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Optional, Output, QueryList, Self, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { map, Observable, ReplaySubject, startWith, Subject, takeUntil } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { of } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-airmid-chipautocomplete',
  templateUrl: './airmid-chipautocomplete.component.html',
  styleUrls: ['./airmid-chipautocomplete.component.scss']
})
export class AirmidChipautocompleteComponent implements OnInit {

  @Input() chips: any[] = [];
  @Input() apiUrl: string = '';
  @Output() chipsChange = new EventEmitter<string[]>();
  @Input() displayKey: string = 'descriptionName'; // default fallback
  @Input() allowCustom: boolean = true;

  inputValue: string = '';
  allOptions: any[] = [];  // array of objects
  filteredOptions: any[] = [];

  showDropdown = false;
  focusedIndex: number = -1;
  @ViewChildren('autocompleteItem') autocompleteItems!: QueryList<ElementRef>;

  constructor(private http: ApiCaller) { }

  ngOnInit() {
    if (this.apiUrl) {
      this.http.GetData(this.apiUrl).subscribe({
        next: (res) => {
          this.allOptions = res;
          this.filteredOptions = [...this.allOptions];
        },
        error: (err) => console.error('Error fetching options:', err)
      });
    }
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
  }


  removeChip(value: string) {
    this.chips = this.chips.filter(chip => chip !== value);
    this.chipsChange.emit(this.chips);
  }

  // filterOptions() {
  //   const filter = this.inputValue.toLowerCase();
  //   this.filteredOptions = this.allOptions.filter(opt =>
  //     (opt[this.displayKey]?.toLowerCase() || '').includes(filter)
  //   );
  // }
  filterOptions() {
    const filter = this.inputValue.toLowerCase();
    this.filteredOptions = this.allOptions.filter(opt =>
      (opt[this.displayKey]?.toLowerCase() || '').includes(filter)
    );
    this.focusedIndex = this.filteredOptions.length > 0 ? 0 : -1;
    this.showDropdown = true;
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

  // private resetInput() {
  //   this.inputValue = '';
  //   this.filteredOptions = [...this.allOptions];
  // }

  private resetInput() {
    this.inputValue = '';
    this.filteredOptions = [...this.allOptions];
    this.focusedIndex = -1;
  }

  hideDropdownWithDelay() {
    setTimeout(() => this.showDropdown = false, 200); // delay to allow click
  }

  // selectOption(option: any) {
  //     this.addChip(option[this.displayKey]);
  //     this.showDropdown = false;
  //   }

  selectOption(option: any) {
    const value = option[this.displayKey];
    this.addChip(value);
    this.showDropdown = false;
  }

}

