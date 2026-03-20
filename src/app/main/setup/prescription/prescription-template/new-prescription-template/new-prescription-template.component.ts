import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { ToastrService } from 'ngx-toastr';
import { PrescriptionTemplateService } from '../prescription-template.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MedicineItemList } from 'app/main/opd/new-casepaper/new-casepaper.component';

@Component({
  selector: 'app-new-prescription-template',
  templateUrl: './new-prescription-template.component.html',
  styleUrls: ['./new-prescription-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewPrescriptionTemplateComponent {
  TemplateInsertForm: FormGroup;
  MedicineItemForm: FormGroup;
  registerObj: any;
  screenFromString = 'Common-form';
  autocompleteModeDose: string = "DoseMaster";
  dateTimeObj: any;
  categoryNames: string[] = ["PrescriptionTemplate", "CasePaperTemplate", "DischargeSummeryTemplate"];
  vstoreId = this._loggedService.currentUserValue.user.storeId;
  durgId: any;
  durgName: any;
  vdoseName: any;
  vDay: any;
  vInstruction: any;
  doseId: any;
  vItemGenericNameId: any;
  vItemGenericName: any;
  doseName: any;
  Chargelist: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dsItemList = new MatTableDataSource<MedicineItemList>();

  displayedColumns: string[] = [
    'ItemName',
    'DoseName',
    'day',
    'QtyPerday',
    'totalQty',
    'instr',
    'Action'
  ]
  vSelectedOption: any = '0';

  constructor(
    public _PrescriptionTemplateService: PrescriptionTemplateService,
    private _formBuilder: UntypedFormBuilder,
    private advanceDataStored: AdvanceDataStored,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<NewPrescriptionTemplateComponent>,
    private _FormvalidationserviceService: FormvalidationserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {

    this.TemplateInsertForm = this.TemplateForm();
    this.TemplateInsertForm.markAllAsTouched();

    this.MedicineItemform();
    this.MedicineItemForm.markAllAsTouched();

    if (this.data) {
      this.registerObj = this.data;
      console.log(this.registerObj)
      this.vSelectedOption = String(this.registerObj.opIpType)
      // this.MedicineItemForm.get('opIpType').setValue(String(this.vSelectedOption));
      this.MedicineItemForm.get('templateCategory').setValue(this.registerObj.templateCategory);
      this.MedicineItemForm.get('presTemplateName').setValue(this.registerObj.presTemplateName);
      this.gettemplatePrecList(this.registerObj);
    }

    this.prescriptionArray.push(this.createprescription());

    this.MedicineItemForm.get('days')?.valueChanges.subscribe(() => {
      this.calculateTotalQty();
    });
    this.MedicineItemForm.get('qtyPerDay')?.valueChanges.subscribe(() => {
      this.calculateTotalQty();
    });
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  TemplateForm() {
    return this._formBuilder.group({
      presId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      presTemplateName: ['', [Validators.required]],
      isActive: true,
      opIpType: [0, [Validators.required]],
      templateCategory: ['', [Validators.required]],
      isAddBy: [this._loggedService.currentUserValue.userId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      isUpdatedBy: [this._loggedService.currentUserValue.userId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      createdBy: [this._loggedService.currentUserValue.userId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

      mPresTemplateDs: this._formBuilder.array([])
    });
  }

  // 2. FormArray Group for Refund Detail
  createprescription(item: any = {}): FormGroup {
    return this._formBuilder.group({
      presId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      classId: [item.classID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      genericId: [item.genericId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      drugId: [item.drugId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doseId: [item.doseId ?? 0,
      [this._FormvalidationserviceService.onlyNumberValidator()]],
      days: [item.days ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      instructionId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      qtyPerDay: [item.qtyPerDay ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      totalQty: [item.totalQty ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      instruction: [item.instruction ?? item.Instruction ?? item.Remark ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      remark: [''],
      isEnglishOrIsMarathi: true
    });
  }

  get prescriptionArray(): FormArray {
    return this.TemplateInsertForm.get('mPresTemplateDs') as FormArray;
  }

  MedicineItemform() {
    this.MedicineItemForm = this._formBuilder.group({
      presTemplateName: ['', [Validators.required]],
      isActive: true,
      opIpType: [0, [Validators.required]],
      templateCategory: ['', [Validators.required]],
      drugId: [0, [Validators.required]],
      doseId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      days: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      qtyPerDay: '',
      totalQty: ['', [Validators.maxLength(200)]],
      instruction: '',
      remark: '',
    });
  }

  selectChangeItemName(row) {
    console.log("ItemName:", row)
    this.durgId = row.itemId
    this.durgName = row.itemName
    this.vdoseName = row.doseName
    const doseControl = this.vdoseName //used for focus purpose
    this.vDay = row.doseDay
    const dayControl = this.vDay //used for focus purpose
    this.vInstruction = row.instruction
    this.MedicineItemForm.get('doseId').setValue(this.vdoseName)

    if (this.vdoseName) {
      const doseRow = {
        value: this.vdoseName,   // assuming doseName is used as ID
        text: this.vdoseName     // or whatever label you're using
      };
      this.selectChangeDoseName(doseRow);
    }
    if ((this.durgId ?? 0) > 0) {
      setTimeout(() => {
        this._PrescriptionTemplateService.getItemMasterById(this.durgId).subscribe((response) => {
          this.vItemGenericNameId = response.itemGenericNameId

          if ((this.vItemGenericNameId ?? 0) > 0) {
            setTimeout(() => {
              this._PrescriptionTemplateService.getItemGenericById(this.vItemGenericNameId).subscribe((response) => {
                this.vItemGenericName = response.itemGenericName
                console.log('genericName:', this.vItemGenericName)
              });
            }, 500);
          }
        });
      }, 500);
    }

    // setTimeout(() => {
    //   if (!doseControl) {
    //     const inputEl = this.doseDropdown.nativeElement.querySelector('input');
    //     if (inputEl) {
    //       inputEl.focus();
    //     }
    //   } else if (!dayControl) {
    //     this.dayField.nativeElement.focus();
    //   } else {
    //     this.instructionField.nativeElement.focus();
    //   }
    // }, 0);
  }

  ItemFromReset() {
    const form = this.MedicineItemForm;
    form.patchValue({
      ItemId: "",
      DoseId: "",
      vDay: "",
      Day: "",
      Instruction: ""
    });
  }

  deleteTableRow(event, element) {
    const index = this.Chargelist.indexOf(element);
    if (index >= 0) {
      this.Chargelist.splice(index, 1);
      this.dsItemList.data = [];
      this.dsItemList.data = this.Chargelist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  gettemplatePrecList(row) {
    const vdata = {
      "first": 0,
      "rows": 10,
      "sortField": "Presid",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "Presid",
          "fieldValue": String(row.presId),//"40773",	
          "opType": "Equals"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }

    this._PrescriptionTemplateService.getTempPrescriptionList(vdata).subscribe(data => {
      this.dsItemList.data = data.data as MedicineItemList[];
      console.log('Template data:', this.dsItemList.data)
      const validItems = this.dsItemList.data.filter(item => (item?.genericid ?? 0) > 0);

      this.Chargelist = data.data as MedicineItemList[];
    });
  }

  selectChangeDoseName(row) {
    this.doseId = row.value
    // this.doseName = row.text

    if ((this.doseId ?? 0) > 0) {
      setTimeout(() => {
        this._PrescriptionTemplateService.getDoseMasterById(this.doseId).subscribe((response) => {
          this.doseName = response.doseName
        });
      }, 500);
    }
  }

  calculateTotalQty() {
    const days = Number(this.MedicineItemForm.get('days')?.value) || 0;
    const qtyPerDay = Number(this.MedicineItemForm.get('qtyPerDay')?.value) || 0;

    const total = days * qtyPerDay;

    this.MedicineItemForm.get('totalQty')?.setValue(total, { emitEvent: false });
  }

  onAdd() {
    if (!this.MedicineItemForm.get("drugId")?.value) {
      this.toastr.warning('Please select a Item Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.MedicineItemForm.get("doseId")?.value) {
      this.toastr.warning('Please select a Dose Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.MedicineItemForm.get("days")?.value) {
      this.toastr.warning('Please enter a Day', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.MedicineItemForm.get("qtyPerDay")?.value) {
      this.toastr.warning('Please enter a QtyPerDay', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (!Array.isArray(this.Chargelist)) {
      console.warn("Chargelist was not an array. Resetting...");
      this.Chargelist = [...this.dsItemList.data];
    }
    const iscekDuplicate = this.dsItemList.data.some(item => item.DrugId == this.durgId)
    if (!iscekDuplicate) {

      const newEntry = {
        classId: 0,
        genericId: this.vItemGenericNameId,
        drugId: this.MedicineItemForm.get('drugId').value.itemId,
        drugName: this.MedicineItemForm.get('drugId').value.itemName,
        doseId: this.doseId,
        doseName: this.doseName,
        days: this.MedicineItemForm.get('days').value,
        qtyPerDay: this.MedicineItemForm.get('qtyPerDay').value,
        totalQty: this.MedicineItemForm.get('totalQty').value,
        instruction: this.MedicineItemForm.get('instruction').value,
      };
      this.Chargelist.push(newEntry);
      this.dsItemList.data = [...this.Chargelist];
      console.log("List:", this.dsItemList.data)
    } else {
      this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    this.MedicineItemForm.get('drugId').reset('');
    this.MedicineItemForm.get('doseId').reset('');
    this.MedicineItemForm.get('days').reset('');
    this.MedicineItemForm.get('qtyPerDay').reset('');
    this.MedicineItemForm.get('totalQty').reset('');
    this.MedicineItemForm.get('instruction').reset('');
    setTimeout(() => {
      const input = document.querySelector('airmid-autocomplete input') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 0);
  }

  onSave() {
    this.TemplateInsertForm.get('presId').setValue(this.registerObj?.presId ?? 0)
    this.TemplateInsertForm.get('templateCategory').setValue(this.MedicineItemForm.get('templateCategory').value)
    this.TemplateInsertForm.get('presTemplateName').setValue(this.MedicineItemForm.get('presTemplateName').value)
    this.TemplateInsertForm.get('opIpType').setValue(this.MedicineItemForm.get('opIpType').value)
    if (!this.TemplateInsertForm.invalid) {
      this.prescriptionArray.clear();

      this.prescriptionArray.clear();
      if (this.dsItemList.data.length === 0) {
        this.toastr.warning('No data in the item list!', 'Warning');
        return;
      }

      this.dsItemList.data.forEach(item => {
        this.prescriptionArray.push(this.createprescription(item));
      });

      console.log(this.TemplateInsertForm.value);

      this._PrescriptionTemplateService.SavePrescriptionTemplate(this.TemplateInsertForm.value).subscribe(response => {
        this.onClose();
      });
    }
    else {
      const invalidFields = this.collectErrors(this.TemplateInsertForm);

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

  onClose() {
    this.dialogRef.close();
  }

  keyPressAlphanumeric(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  keyPressCharater(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}
