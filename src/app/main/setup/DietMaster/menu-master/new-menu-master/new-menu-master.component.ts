import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MenuMasterService } from '../menu-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { ApiCaller } from 'app/core/services/apiCaller';

@Component({
  selector: 'app-new-menu-master',
  templateUrl: './new-menu-master.component.html',
  styleUrls: ['./new-menu-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewMenuMasterComponent implements OnInit {
  dietMenuForm: FormGroup;
  dietMenuDetailForm: FormGroup;
  isActive: boolean = true;
  private destroy$ = new Subject<void>()

  autocompleteModeDietType: string = 'MDietTypeMaster'
  autocompleteModeMealType: string = 'MMealTypeMaster'
  autocompleteModeFoodItem: string = 'FoodItem'
  autocompleteModeUnit: string = 'TypesOfFoodItemUnits'

  selectedFoodItems: any[] = [];
  foodItemList: any[] = [];
  unitList: any[] = [];

  constructor(
    public _menuMasterService: MenuMasterService,
    public dialogRef: MatDialogRef<NewMenuMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private apiCaller: ApiCaller
  ) { }

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  scrollCards(direction: 'left' | 'right'): void {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = 300;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

  createMenuForm(): FormGroup {
    return this._formBuilder.group({
      dietMenuId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      dietMenuName: ["", [Validators.pattern(/^[a-zA-Z ]+$/), Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      // dietMenuCode: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      mealTypeId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      dietTypeId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      texture: ["", [Validators.pattern(/^[a-zA-Z ]+$/), Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      calories: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      protein: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      // active: [true, [Validators.required]],

      ///extra fild
      foodItemId: [''],

      mDietMenuDetailMasters: this._formBuilder.array([])
    });
  }

  createDietMenuDetailForm(element: any = {}): FormGroup {
    return this._formBuilder.group({
      menuDetId: [element.menuDetId ?? 0],
      dietMenuId: [element.dietMenuId ?? 0],
      foodItemId: [element.foodItemId ?? 0],
      // foodName: [element.name ?? ''],
      quantity: [element.quantity ?? 0],
      unitId: [element.unitId ?? 0],
      sequenceNo: [element.sequenceNo ?? 0]
    });
  }

  get dietDetailArray(): FormArray {
    return this.dietMenuForm.get('mDietMenuDetailMasters') as FormArray;
  }

  ngOnInit(): void {
    this.dietMenuForm = this.createMenuForm();
    this.dietMenuForm.markAllAsTouched();

    this.dietMenuDetailForm = this.createDietMenuDetailForm();
    this.dietDetailArray.push(this.createDietMenuDetailForm());

    this.loadDropdownOptions();
  }

  selectChangeFoodName(data: any): void {

    console.log('Selected Food:', data);

    const selectedItem = data?.value ?? data;

    if (!selectedItem) {
      return;
    }

    const foodItemId =
      selectedItem?.foodItemId ?? selectedItem?.id;

    const foodName =
      selectedItem?.foodName ?? selectedItem?.text ?? selectedItem?.name;

    if (!foodItemId) {
      return;
    }

    const alreadyExists = this.selectedFoodItems.some(
      item => item.foodItemId === foodItemId
    );

    if (alreadyExists) {
      return;
    }

    const unit = this.unitList.find(u =>
      String(u.value) === String(selectedItem.unit) ||
      u.text?.toLowerCase() === String(selectedItem.unit ?? '').toLowerCase()
    );

    this.selectedFoodItems.push({
      menuDetId: 0,
      dietMenuId: this.dietMenuForm.get('dietMenuId')?.value || 0,
      foodItemId: foodItemId,
      name: foodName,
      quantity: 0,
      unitId: unit?.value ?? 0, //unit is defined as value
      sequenceNo: this.selectedFoodItems.length + 1
    });
    console.log('Selected Food ADDed Items:', this.selectedFoodItems);

    this.dietMenuForm.patchValue({
      foodItemId: null
    });
  }

  removeFoodItem(index: number): void {
    this.selectedFoodItems.splice(index, 1);

    this.selectedFoodItems.forEach((item, i) => {
      item.sequenceNo = i + 1;
    });
  }

  private loadDropdownOptions(): void {
    this.fetchDropdownOptions(this.autocompleteModeUnit)
      .pipe(takeUntil(this.destroy$))
      .subscribe(options => {
        this.unitList = options || [];
      });
  }

  private fetchDropdownOptions(mode: string): Observable<any[]> {
    if (!mode) {
      return of([]);
    }
    return this.apiCaller.GetData(`Dropdown/GetBindDropDown?mode=${mode}`);
  }

  onSubmit(): void {

    if (!this.dietMenuForm.invalid) {

      this.dietDetailArray.clear();
      if (this.selectedFoodItems.length === 0) {
        this.toastr.warning('No food items selected!', 'Warning');
        return;
      }

      this.selectedFoodItems.forEach((item, i) => {
        item.sequenceNo = i + 1;
        this.dietDetailArray.push(this.createDietMenuDetailForm(item));
      });

      this.dietMenuForm.removeControl('foodItemId')
      console.log(this.dietMenuForm.value);
      this._menuMasterService.menuSave(this.dietMenuForm.value).subscribe(response => {
        this.toastr.success('Diet Menu saved successfully.', 'Success');
        this.onClear(true);
      });
    }
    else {
      const invalidFields = this.collectErrors(this.dietMenuForm);
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
        });
        return;
      }
    }
  }

  collectErrors(formGroup: FormGroup | FormArray, parentKey: string = ''): string[] {
    let errors: string[] = [];
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (control instanceof FormGroup || control instanceof FormArray) {
        // go deeper
        errors = errors.concat(this.collectErrors(control, newKey));
      } else {
        if (control?.invalid) {
          errors.push(newKey);
        }
      }
    });
    return errors;
  }

  dropFoodItem(event: CdkDragDrop<any[]>): void {

    moveItemInArray(
      this.selectedFoodItems,
      event.previousIndex,
      event.currentIndex
    );

    this.selectedFoodItems.forEach((item, index) => {
      item.sequenceNo = index + 1;
    });

  }

  getValidationMessages() {
    return {
      MenuName: [
        // { name: "required", Message: "Menu Name is required" },
        // { name: "maxlength", Message: "Menu Name should not be greater than 50 char." },
        // { name: "pattern", Message: "Only char allowed." }
      ],
      MealType: [
        { name: "required", Message: "Meal Type is required" }
      ],
      DietType: [
        { name: "required", Message: "Diet Type is required" }
      ],
      Texture: [
        // { name: "required", Message: "Texture is required" }
      ],
      Calories: [
        // { name: "required", Message: "Calories is required" }
      ],
      Protein: [
        // { name: "required", Message: "Protein is required" }
      ]
    };
  }

  onClear(val: boolean) {
    this.dietMenuForm.reset();
    this.dialogRef.close(val);
  }
}
