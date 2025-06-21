import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Optional, Output, Self, SimpleChanges, ViewChild } from '@angular/core';
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

  filterOptions() {
    const filter = this.inputValue.toLowerCase();
    this.filteredOptions = this.allOptions.filter(opt =>
      (opt[this.displayKey]?.toLowerCase() || '').includes(filter)
    );
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
  }

  showDropdown = false;

hideDropdownWithDelay() {
  setTimeout(() => this.showDropdown = false, 200); // delay to allow click
}

selectOption(option: any) {
    this.addChip(option[this.displayKey]);
    this.showDropdown = false;
  }

}

