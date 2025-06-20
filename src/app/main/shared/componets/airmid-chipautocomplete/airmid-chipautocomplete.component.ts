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
  @Input() options: any[] = [];
  @Input() mode: string;
  @Output() selectionChange = new EventEmitter<any>();
  private destroy: Subject<void> = new Subject();
  control = new FormControl();
  @Input() formGroup: FormGroup;
  @Input() formControlName: string;
  @Input() validations: [] = [];
  @Input() label: string = "";
  @Input() IsMultiPle: boolean;
  @Input() TextField: string = "text";
  @Input() ValueField: string = "value";
  @Input() ApiUrl: string = "";
  @Input() ReqFullObj: boolean = false;
  @Input() appearance: string = "outline";

  // made by raksha
  @Input() readonly: boolean = false;

  private _disabled: boolean = false;
  private _focused: boolean = false;
  private _placeholder: string = '';
  private _required: boolean = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  @Input()
  get placeholder(): string {
    return this._placeholder ?? this.label;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  get errorState(): boolean {
    return this.ngControl.control !== null ? !!this.ngControl.control : false;
  }

  get activeErrors(): string[] {
    try {
      if (!this.formGroup || !this.formGroup.controls[this.formControlName] || !this.validations || this.validations.length <= 0) {
        return [];
      }
      // Find active validation 
      return this.validations
        .filter((validation: any) => typeof validation?.name === 'string' && this.formGroup.controls[this.formControlName].hasError(validation.name.toLowerCase()))
        .map((validation: any) => validation.Message);
    } catch (error) {
      console.log("Textbox Error => ", error);
    }
  }
@Input()
get value(): any {
  return this.control.value;
}
set value(value: any) {
  if (value !== this.control.value) {
    this.control.setValue(value);
    this.stateChanges.next();
  }
}

  onTouched(): void { }

  registerOnChange(onChange: (value: string | null) => void): void {
    this.control.valueChanges.pipe(takeUntil(this.destroy)).subscribe(onChange);
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }
  writeValue(value: string | null): void {
    this.control.setValue(value);
  }
  constructor(private _httpClient: ApiCaller, private changeDetectorRefs: ChangeDetectorRef,
    @Optional() @Self() public ngControl: NgControl | null) {
    if (ngControl) {
      this.ngControl.valueAccessor = this;
      ngControl.valueAccessor = this;
    }
  }

  protected ddls: any[] = [];
  typedValue: string = '';

  //public ddlCtrl: FormControl = new FormControl();
  public ddlFilterCtrl: FormControl = new FormControl();
  public filteredDdls: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild("singleSelect", { static: true }) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  stateChanges: Subject<void> = new Subject();
  ngOnInit() {
    this.bindGridAutoComplete();
    // listen for search field value changes
    this.ddlFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe((searchValue: string) => {
        this.filterDdls();

        // Store typed value (even if not selected)
        this.typedValue = searchValue;

        // Optionally set in form control if needed
        if (!this.formGroup.controls[this.formControlName].value && searchValue) {
          this.formGroup.controls[this.formControlName].setValue(searchValue);
        }
      });

    if (this.readonly && this.singleSelect) {
      this.disableDropdown();
    }
  }

  disableDropdown() {
    if (this.singleSelect) {
      // Override open method to block opening
      this.singleSelect.open = () => {
        // Do nothing when readonly
        if (!this.readonly) {

        }
      };
    }
  }

  onClick(event: MouseEvent) {
    if (this.readonly) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  bindGridAutoComplete() {
    if (this.options?.length > 0) {
      this.ddls = this.options as [];
      this.filteredDdls.next(this.ddls.slice());
    } else {
      if (this.ApiUrl == "")
        this._httpClient
          .GetData('Dropdown/GetBindDropDown?mode=' + this.mode)
          .subscribe((data: any) => {
            this.ddls = data as [];
            this.filteredDdls.next(this.ddls.slice());
            if (this.value) {
              this.SetSelection(this.value);
            }
          });
      else
        this._httpClient
          .GetData(this.ApiUrl)
          .subscribe((data: any) => {
            this.ddls = data as [];
            this.filteredDdls.next(this.ddls.slice());
            if (this.value) {
              if (this.IsMultiPle) {
                if (this.value instanceof Array) {
                  this.value = this.value.map(x => x[this.ValueField] ?? x) as [];
                }
              }
              this.SetSelection(this.value);
            }
          });
    }

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    this.stateChanges.complete();
  }

 public comparer(o1: any, o2: any): boolean {
  const label = this["ariaLabel"];
  return (
    o1?.[label]?.toString?.() === o2?.toString?.() ||
    (o1?.[label]?.toString?.() ?? '') === (o2?.[label]?.toString?.() ?? '')
  );
}

  protected filterDdls() {
    if (!this.ddls) {
      return;
    }
    let search = this.ddlFilterCtrl.value;
    if (!search) {
      this.filteredDdls.next(this.ddls.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredDdls.next(
      this.ddls.filter(
        (ddl) => ddl[this.TextField].toLowerCase().indexOf(search) > -1
      )
    );

  }

//   public onDdlChange($event) {
//   if (this.ReqFullObj)
//       this.formGroup.controls[this.formControlName].setValue($event.value);
//   else
//       this.formGroup.controls[this.formControlName].setValue($event.value[this.ValueField]);

//   this.selectionChange.emit($event.value);
// }

onDdlChange($event: any) {
  const control = this.formGroup.get(this.formControlName);
  const currentVal = control?.value || [];
  const selectedItem = $event.value;

  const newItem = this.ReqFullObj
    ? selectedItem
    : {
        [this.ValueField]: selectedItem[this.ValueField],
        [this.TextField]: selectedItem[this.TextField]
      };

  if (this.IsMultiPle) {
    // Ensure merged list includes previous + new, avoid duplicates
    const updated = Array.isArray(currentVal) ? [...currentVal] : [];

    const isDuplicate = updated.some(
      x =>
        x[this.TextField]?.toLowerCase() === newItem[this.TextField]?.toLowerCase()
    );

    if (!isDuplicate) {
      updated.push(newItem);
    }

    control.setValue(updated);
    this.value = updated;
    this.selectionChange.emit(updated); // emit updated list
  } else {
    control.setValue(newItem);
    this.value = newItem;
    this.selectionChange.emit(newItem);
  }
}


  SetSelection(value) {
    console.log(value)
    if (this.IsMultiPle) {
      this.control.setValue(value);
      if (this.ddls.length > 0)
        this.formGroup.get(this.formControlName).setValue(this.ddls.filter(x => value.indexOf(x[this.ValueField]) >= 0));
    }
    else {
      this.control.setValue(this.ddls.find(x => x[this.ValueField] == value.toString()));
      this.formGroup.get(this.formControlName).setValue(value.toString());
    }
    this.stateChanges.next();
    this.changeDetectorRefs.detectChanges();
    // this.selectDdlObject.emit(value);
  }
  clearSelection(event: Event): void {
    event.stopPropagation();
    const control = this.formGroup.controls[this.formControlName];
    if (control) {
      // control.setValue(null)
      control.setValue("0")
      // control.reset();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.value?.firstChange && changes.value?.currentValue) {
      this.SetSelection(changes.value.currentValue);
    }
    this.changeDetectorRefs.detectChanges();
  }

  onEnterTyped(event: KeyboardEvent): void {
  const typedValue = this.ddlFilterCtrl.value?.trim();
  if (!typedValue) return;

  // Check if the typed value already exists in dropdown
  const match = this.ddls.find(item => item[this.TextField].toLowerCase() === typedValue.toLowerCase());

  if (match) {
    // Already exists — select it
    this.onDdlChange({ value: match });
  } else {
    // Add new item as custom entry
    const newItem = {
      [this.ValueField]: '', // or generate a temporary ID like -1
      [this.TextField]: typedValue
    };

    this.ddls.push(newItem);
    this.filteredDdls.next(this.ddls.slice());

    if (this.IsMultiPle) {
      const currentVal = this.formGroup.controls[this.formControlName].value || [];
      currentVal.push(this.ReqFullObj ? newItem : newItem[this.ValueField]);
      this.formGroup.controls[this.formControlName].setValue(currentVal);
      this.value = currentVal;
    } else {
      this.formGroup.controls[this.formControlName].setValue(this.ReqFullObj ? newItem : newItem[this.ValueField]);
      this.value = this.ReqFullObj ? newItem : newItem[this.ValueField];
    }

    this.selectionChange.emit(newItem);
  }

  // Clear search box
  this.ddlFilterCtrl.setValue('');
  event.preventDefault();
}

}

// old method which was working but [object.Object] issue

// export class AirmidChipautocompleteComponent implements OnInit {
//   @Input() formGroup!: FormGroup;
//   @Input() controlName!: string;
//   @Input() apiUrl!: string;
//   @Input() label: string = 'Select Items';
//   @Input() placeholder: string = 'Type to search...';
//   @Input() displayWith: string = ''; // property to show in mat-option
//   @Input() selectable: boolean = true;
//   @Input() removable: boolean = true;
//   @Input() allowFreeText: boolean = true;

//   @Output() selectedItemsChange = new EventEmitter<any[]>();

//   allOptions: any[] = [];
//   selectedItems: any[] = [];
//   filteredOptions$!: Observable<any[]>;

//   constructor(
//     public _httpClient1: ApiCaller,
//   ) { }

//   ngOnInit(): void {
//     if (!this.apiUrl) {
//       console.error('API URL is required');
//       return;
//     }

//     const control = this.control;
//     if (!control) {
//       console.error('FormControl not found for controlName:', this.controlName);
//       return;
//     }

//     this._httpClient1.GetData(this.apiUrl).subscribe((data: any[]) => {
//       this.allOptions = data;
//       // debugger
//       const retrievedItems = this.formGroup.get(this.controlName)?.value || [];
//       const selectedFromBackend = retrievedItems.map((item: any) => {
//         if (typeof item === 'string') {
//           return this.allowFreeText ? { [this.displayWith]: item, isCustom: true } : null;
//         }
//         const match = this.allOptions.find(opt => opt[this.displayWith] === item[this.displayWith]);
//         return match || item;
//       }).filter(Boolean); // remove any nulls
//       this.selectedItems = selectedFromBackend;
//       this.formGroup.get(this.controlName)?.setValue(this.selectedItems);
//       this.filteredOptions$ = control.valueChanges.pipe(
//         startWith(''),
//         map(value => {
//           const inputText = typeof value === 'string'
//             ? value
//             : this.displayFn(value);
//           const filterValue = (inputText || '').toLowerCase();

//           return this.allOptions.filter(opt =>
//             this.displayFn(opt).toLowerCase().includes(filterValue) &&
//             !this.selectedItems.some(sel => this.displayFn(sel) === this.displayFn(opt))
//           );
//         })
//       );
//     });
//   }

//   get control(): FormControl {
//     return this.formGroup.get(this.controlName) as FormControl;
//   }

//   displayFn(item: any): string {
//     if (!item) return '';
//     if (typeof item === 'string') return item;
//     if (this.displayWith && typeof item === 'object' && item[this.displayWith]) {
//       return item[this.displayWith];
//     }
//     return ''; // fallback to empty string instead of showing [object Object]
//   }
//   addFromInput(event: any): void {
//     const input = (event.value || '').trim();
//     if (!input) return;

//     const match = this.allOptions.find(opt =>
//       this.displayFn(opt).toLowerCase() === input.toLowerCase()
//     );

//     const newItem = match || (this.allowFreeText ? { [this.displayWith]: input, isCustom: true } : null);

//     if (newItem && !this.selectedItems.some(sel => this.displayFn(sel) === this.displayFn(newItem))) {
//       this.selectedItems.push(newItem);
//       this.selectedItemsChange.emit(this.selectedItems);
//     }

//     this.formGroup.get(this.controlName)?.setValue('');
//   }

//   selectOption(option: any): void {
//     if (!this.selectedItems.some(sel => this.displayFn(sel) === this.displayFn(option))) {
//       this.selectedItems.push(option);
//       this.selectedItemsChange.emit(this.selectedItems);
//     }
//     this.formGroup.get(this.controlName)?.setValue('');
//   }

//   remove(item: any): void {
//     const index = this.selectedItems.indexOf(item);
//     if (index >= 0) {
//       this.selectedItems.splice(index, 1);
//       this.selectedItemsChange.emit(this.selectedItems);
//     }
//   }
// }
