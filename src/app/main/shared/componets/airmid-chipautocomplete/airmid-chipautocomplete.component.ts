import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-airmid-chipautocomplete',
  templateUrl: './airmid-chipautocomplete.component.html',
  styleUrls: ['./airmid-chipautocomplete.component.scss']
})
export class AirmidChipautocompleteComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() apiUrl!: string;
  @Input() label: string = 'Select Items';
  @Input() placeholder: string = 'Type to search...';
  @Input() displayWith: string = ''; // property to show in mat-option
  @Input() selectable: boolean = true;
  @Input() removable: boolean = true;
  @Input() allowFreeText: boolean = true;

  @Output() selectedItemsChange = new EventEmitter<any[]>();

  allOptions: any[] = [];
  selectedItems: any[] = [];
  filteredOptions$!: Observable<any[]>;

  constructor(
    public _httpClient1: ApiCaller,
  ) { }

  ngOnInit(): void {
    if (!this.apiUrl) {
      console.error('API URL is required');
      return;
    }

    const control = this.control;
    if (!control) {
      console.error('FormControl not found for controlName:', this.controlName);
      return;
    }

    this._httpClient1.GetData(this.apiUrl).subscribe((data: any[]) => {
      this.allOptions = data;
      // debugger
      // ✅ STEP 1: Load selected values from FormGroup (if already set)
      const retrievedItems = this.formGroup.get(this.controlName)?.value || [];

      // ✅ STEP 2: Match retrieved items with full objects from API
      const selectedFromBackend = retrievedItems.map((item: any) => {
        if (typeof item === 'string') {
          // For freeText mode, allow raw string chip
          return this.allowFreeText ? { [this.displayWith]: item, isCustom: true } : null;
        }
        const match = this.allOptions.find(opt => opt[this.displayWith] === item[this.displayWith]);
        return match || item;
      }).filter(Boolean); // remove any nulls

      // ✅ STEP 3: Assign to chip list
      this.selectedItems = selectedFromBackend;

      // ✅ STEP 4: Set cleaned selectedItems into the form control
      this.formGroup.get(this.controlName)?.setValue(this.selectedItems);

      // ✅ STEP 5: Set up autocomplete filtering
      this.filteredOptions$ = control.valueChanges.pipe(
        startWith(''),
        map(value => {
          const inputText = typeof value === 'string'
            ? value
            : this.displayFn(value);
          const filterValue = (inputText || '').toLowerCase();

          return this.allOptions.filter(opt =>
            this.displayFn(opt).toLowerCase().includes(filterValue) &&
            !this.selectedItems.some(sel => this.displayFn(sel) === this.displayFn(opt))
          );
        })
      );
    });
  }

  get control(): FormControl {
    return this.formGroup.get(this.controlName) as FormControl;
  }

  // displayFn(item: any): string {
  //   if (!item) return '';
  //   if (typeof item === 'string') return item;

  //   if (this.displayWith && item[this.displayWith] != null) {
  //     return String(item[this.displayWith]);
  //   }

  //   // Optional fallback if displayWith is missing or invalid
  //   const fallbackKey = Object.keys(item).find(k => typeof item[k] === 'string');
  //   return fallbackKey ? item[fallbackKey] : 'Unknown';
  // }
 displayFn(item: any): string {
      if (!item) return '';
  if (typeof item === 'string') return item;
  if (this.displayWith && typeof item === 'object' && item[this.displayWith]) {
    return item[this.displayWith];
  }
  return ''; // fallback to empty string instead of showing [object Object]
}
  addFromInput(event: any): void {
    const input = (event.value || '').trim();
    if (!input) return;

    const match = this.allOptions.find(opt =>
      this.displayFn(opt).toLowerCase() === input.toLowerCase()
    );

    const newItem = match || (this.allowFreeText ? { [this.displayWith]: input, isCustom: true } : null);

    if (newItem && !this.selectedItems.some(sel => this.displayFn(sel) === this.displayFn(newItem))) {
      this.selectedItems.push(newItem);
      this.selectedItemsChange.emit(this.selectedItems);
    }

    this.formGroup.get(this.controlName)?.setValue('');
  }

  selectOption(option: any): void {
    if (!this.selectedItems.some(sel => this.displayFn(sel) === this.displayFn(option))) {
      this.selectedItems.push(option);
      this.selectedItemsChange.emit(this.selectedItems);
    }
    this.formGroup.get(this.controlName)?.setValue('');
  }

  remove(item: any): void {
    const index = this.selectedItems.indexOf(item);
    if (index >= 0) {
      this.selectedItems.splice(index, 1);
      this.selectedItemsChange.emit(this.selectedItems);
    }
  }
}
