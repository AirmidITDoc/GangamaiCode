import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MenuMasterService } from '../menu-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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

  autocompleteModeDietType: string = 'MDietTypeMaster'
  autocompleteModeMealType: string = 'MMealTypeMaster'
  autocompleteModeFoodItem: string = 'FoodItem'
  autocompleteModeUnit: string = 'TypesOfFoodItemUnits'

  selectedFoodItems: any[] = [];
  foodItemList: any[] = [];

  constructor(
    public _menuMasterService: MenuMasterService,
    public dialogRef: MatDialogRef<NewMenuMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
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

  ngOnInit(): void {
    this.dietMenuForm = this._menuMasterService.createMenuForm();
    this.dietMenuForm.markAllAsTouched();

    this.dietMenuDetailForm = this._menuMasterService.createDietMenuDetailForm();
    this.dietMenuDetailForm.markAllAsTouched();
  }

  //old
  // selectChangeFoodName(data: any): void {

  //   if (!data) {
  //     return;
  //   }

  //   // Get selected food item ID
  //   const foodItemId = data.foodItemId;

  //   // Get selected food item name
  //   const foodName = data.foodName;

  //   // Prevent duplicate food items
  //   const alreadyExists = this.selectedFoodItems.some(
  //     (item: any) => item.foodItemId == foodItemId
  //   );

  //   if (!alreadyExists) {

  //     // this.selectedFoodItems.push({
  //     //   foodItemId: foodItemId,
  //     //   name: foodName
  //     // });
  //     this.selectedFoodItems.push({
  //       foodItemId: foodItemId,
  //       name: foodName,
  //       quantity: 0,
  //       unitId: 0,
  //       sequenceNo: this.selectedFoodItems.length + 1
  //     });

  //   }

  //   // Clear dropdown
  //   this.dietMenuForm.get('foodItemId')?.setValue(null);
  // }

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

    this.selectedFoodItems.push({
      menuDetId: 0,
      dietMenuId: this.dietMenuForm.get('dietMenuId')?.value || 0,
      foodItemId: foodItemId,
      name: foodName,
      quantity: '',
      unitId: '',
      sequenceNo: this.selectedFoodItems.length + 1
    });

    console.log('Selected Food Items:', this.selectedFoodItems);

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

  //old
  // onSubmit() {

  //   if (this.dietMenuForm.invalid) {
  //     const invalidFields = [];

  //     for (const controlName in this.dietMenuForm.controls) {

  //       if (this.dietMenuForm.controls[controlName].invalid) {

  //         invalidFields.push(`New Menu Form: ${controlName}`);

  //       }

  //     }

  //     if (invalidFields.length > 0) {

  //       invalidFields.forEach(field => {

  //         this.toastr.warning(
  //           `Field "${field}" is invalid.`,
  //           'Warning'
  //         );

  //       });

  //     }

  //     return;
  //   }

  //   // Check food items
  //   if (this.selectedFoodItems.length === 0) {

  //     this.toastr.warning(
  //       'Please select at least one food item.',
  //       'Warning'
  //     );

  //     return;
  //   }

  //   // Create detail list
  //   const detailList = this.selectedFoodItems.map((item, index) => {

  //     return {
  //       menuDetId: 0,
  //       dietMenuId: this.dietMenuForm.get('dietMenuId')?.value || 0,
  //       foodItemId: item.foodItemId,
  //       quantity: Number(item.quantity),
  //       unitId: Number(item.unitId),
  //       sequenceNo: index + 1
  //     };

  //   });


  //   // Final API payload
  //   const payload = {
  //     dietMenuId: this.dietMenuForm.get('dietMenuId')?.value || 0,
  //     dietMenuCode: this.dietMenuForm.get('dietMenuCode')?.value,
  //     dietMenuName: this.dietMenuForm.get('dietMenuName')?.value,
  //     mealTypeId: this.dietMenuForm.get('mealTypeId')?.value,
  //     dietTypeId: this.dietMenuForm.get('dietTypeId')?.value,
  //     texture: this.dietMenuForm.get('texture')?.value,
  //     calories: this.dietMenuForm.get('calories')?.value,
  //     protein: this.dietMenuForm.get('protein')?.value,
  //     mDietMenuDetailMasters: detailList
  //   }

  //   this._menuMasterService.menuSave(payload).subscribe(
  //     response => {

  //       this.toastr.success(
  //         'Diet Menu saved successfully.',
  //         'Success'
  //       );

  //       this.onClear(true);

  //     }
  //   );
  // }

  //new 
  onSubmit(): void {

    if (this.dietMenuForm.invalid) {
      this.dietMenuForm.markAllAsTouched();
      return;
    }

    const dietMenuId = this.dietMenuForm.get('dietMenuId')?.value || 0;
    const menuData = {
      dietMenuId: dietMenuId,
      dietMenuName: this.dietMenuForm.get('dietMenuName')?.value,
      mealTypeId: this.dietMenuForm.get('mealTypeId')?.value,
      dietTypeId: this.dietMenuForm.get('dietTypeId')?.value,
      texture: this.dietMenuForm.get('texture')?.value,
      calories: this.dietMenuForm.get('calories')?.value,
      protein: this.dietMenuForm.get('protein')?.value,

      mDietMenuDetailMasters: this.selectedFoodItems.map(
        (item, index) => ({
          menuDetId: item.menuDetId || 0,
          dietMenuId: dietMenuId,
          foodItemId: Number(item.foodItemId),
          quantity: Number(item.quantity),
          unitId: Number(item.unitId),
          sequenceNo: index + 1
        })
      )
    };

    console.log(menuData);

    this._menuMasterService.menuSave(menuData).subscribe({
      next: (response) => {
        this.onClear(true);
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
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
