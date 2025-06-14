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
  ) {}

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
  //   return typeof item === 'string' ? item : item[this.displayWith] || '';
  // }

  displayFn(item: any): string {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return this.displayWith && item[this.displayWith] ? item[this.displayWith] : JSON.stringify(item);
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
