import { DatePipe } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-new-diet-plan',
  templateUrl: './new-diet-plan.component.html',
  styleUrls: ['./new-diet-plan.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewDietPlanComponent {
  DietForm: FormGroup
  ItemForm: FormGroup;
  searchFormGroup: FormGroup;

  registerObj = new DiettypeList({});
  isActive = true
  screenFromString = 'Common-form';

  Chargelist: any = [];
  dsItemList = new MatTableDataSource<DiettypeList>();
  mealTypeId = 0
  mealType: any
  dietTypeId = 0
  dietType: any
  vInstruction: any
  dietMenuId = 0
  dietMenu: any

  displayedColumns: string[] = [
    'mealType',
    'dietType',
    'dietMenu',
    'Instruction',
    'Action'
  ]

  autocompleteModedietMenu: string = "MDietMenuMaster";
  autocompleteModemealType: string = "MMealTypeMaster";
  autocompleteModedietType: string = "MDietTypeMaster";

  constructor(private fb: FormBuilder, public _matDialog: MatDialog,
    public datePipe: DatePipe, public toastr: ToastrService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    this.DietForm = this.fb.group({
      planstartDate: [this.today(), Validators.required],
      planendDate: [this.today(), Validators.required],
      isActive: [true],

    });
    if (this.data)
      this.registerObj = this.data
    this.ItemForm = this.createItemForm();
    this.ItemForm.markAllAsTouched();
    this.searchFormGroup = this.createSearchForm();
  }

  createSearchForm() {
    return this.fb.group({
      RegID: 0,

    });
  }

  createItemForm() {
    return this.fb.group({
      mealTypeId: ['', [Validators.required]],
      dietTypeId: '',
      dietMenuId: '',
      Instruction: ['', [Validators.maxLength(200)]],

    })
  }

  vPatientName = ''
  getSelectedObjIP(obj) {

    console.log(obj)
    if ((obj.regID ?? 0) > 0) {
      console.log("Admitted patient:", obj)
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.data = obj;
      this.registerObj = obj;
      console.log(obj)
    }

  }

  onAdd() {
    debugger
    // if (!this.ItemForm.invalid) {
    // const iscekDuplicate = this.dsItemList.data.some(item => item.ItemID == this.vitemId)
    // if (!iscekDuplicate) {
    this.dsItemList.data = [];
    this.Chargelist.push(
      {
        mealTypeId: this.mealTypeId || 0,
        mealType: this.mealType || '',

        dietTypeId: this.dietTypeId || 0,
        dietType: this.dietType || '',
        dietMenuId: this.dietMenuId || 0,
        dietMenu: this.dietMenu || '',

        Instruction: this.ItemForm.get('Instruction').value || '',

      });
    this.dsItemList.data = this.Chargelist
    this.ItemForm.get('mealTypeId').reset('');
    this.ItemForm.get('dietTypeId').reset('');
    this.ItemForm.get('Instruction').reset('');
    // Focus back to Item Name
    const itemNameElement = document.querySelector(`[name='mealTypeId']`) as HTMLElement;
    if (itemNameElement) {
      itemNameElement.focus();
    }

    // } else {
    //   this.toastr.warning('Selected Meal already added in the list ', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }


    // } else {
    //   const invalidFields = [];
    //   if (this.ItemForm.invalid) {
    //     for (const controlName in this.ItemForm.controls) {
    //       if (this.ItemForm.controls[controlName].invalid) {
    //         invalidFields.push(`Item Form: ${controlName}`);
    //       }
    //     }
    //   }

    //   if (invalidFields.length > 0) {
    //     invalidFields.forEach(field => {
    //       this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
    //       );
    //     });
    //   }
    // }


  }


  ChangemealType($event) {
    console.log($event)
    this.mealTypeId = $event.Value
    this.mealType = $event.text
  }
  ChangedietType($event) {
    console.log($event)
    this.dietTypeId = $event.Value
    this.dietType = $event.text
  }

  ChangedietMenu($event) {
    console.log($event)
    this.dietMenuId = $event.Value
    this.dietMenu = $event.text
  }

  getValidationMessages() {
    return {
      mealTypeId: [
        { name: "required", Message: "mealTypeId is required" }
      ],
      weight: [
        { name: "required", Message: "weight is required" }
      ],
      bmi: [
        { name: "required", Message: "bmi is required" }
      ],
      assessedBy: [
        { name: "required", Message: "assessedBy is required" }
      ]
    };


  }

  private today(): string {
    return new Date().toISOString().substring(0, 10); // yyyy-MM-dd for <input type="date">
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  onDietForm() { }
  onClose(): void {
    this._matDialog.closeAll();
  }
}


export class DiettypeList {
  mealTypeId: any
  mealType: any
  dietTypeId: any
  dietType: any
  Instruction: any
  /**
  * Constructor
  *
  * @param DiettypeList
  */
  constructor(DiettypeList) {
    {
      this.mealTypeId = DiettypeList.mealTypeId || 0;
      this.mealType = DiettypeList.mealType || '';
      this.dietTypeId = DiettypeList.dietTypeId || "";
      this.dietType = DiettypeList.dietType || '';
      this.Instruction = DiettypeList.Instruction || '';
    }
  }
}