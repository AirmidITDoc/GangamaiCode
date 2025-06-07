import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { ToastrService } from 'ngx-toastr';
import { CasepaperService } from '../casepaper.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-prescription-template',
  templateUrl: './prescription-template.component.html',
  styleUrls: ['./prescription-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrescriptionTemplateComponent implements OnInit {

  TemplateInsertForm: FormGroup;
  sIsLoading: string = '';
  currentDate = new Date
  vRemark: any;
  chargelist: any = [];
  registerObj: any;
  savebtn: boolean = false;

  constructor(
    private _CasepaperService: CasepaperService,
    private _formBuilder: UntypedFormBuilder,
    private advanceDataStored: AdvanceDataStored,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<PrescriptionTemplateComponent>,
    private _FormvalidationserviceService: FormvalidationserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.registerObj = this.data.Obj;
      this.chargelist = this.registerObj
      console.log(this.registerObj)
    }
    this.TemplateForm();
  }

  TemplateForm() {
    this.TemplateInsertForm = this._formBuilder.group({
      prescriptionOPTemplate: this._formBuilder.group({
        presId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        presTemplateName: ['', [Validators.required, this._FormvalidationserviceService.notBlankValidator(), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        isActive: true,
        opIpType: [0],
        isAddBy: [this._loggedService.currentUserValue.userId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        isUpdatedBy: [this._loggedService.currentUserValue.userId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      }),

      presTemplate: this._formBuilder.array([
        this.createprescription()
      ])
    });
  }

  // 2. FormArray Group for Refund Detail
  createprescription(item: any = {}): FormGroup {
    return this._formBuilder.group({
      presId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      classId: [item.classID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      genericId: [item.genericId ?? item.GenericId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      drugId: [item.drugId ?? item.DrugId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doseId: [item.doseId != null ? Number(item.doseId) : item.DoseId != null ? Number(item.DoseId) : 0,
      [this._FormvalidationserviceService.onlyNumberValidator()]],
      days: [item.days ?? item.Days ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      instructionId: [item.instructionId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      qtyPerDay: [item.qtyPerDay ?? item.QtyPerDay ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      totalQty: [(item.days * item.qtyPerDay) || (item.Days * item.QtyPerDay) || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      instruction: [item.instruction ?? item.Instruction ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      isEnglishOrIsMarathi: true
    });
  }

  get prescriptionArray(): FormArray {
    return this.TemplateInsertForm.get('presTemplate') as FormArray;
  }

  onSave() {
    if (!this.TemplateInsertForm.invalid) {

      this.TemplateInsertForm.removeControl('TemplateName');

      this.prescriptionArray.clear();

      // Safely load prescription data from chargelist
      const dataList = Array.isArray(this.chargelist)
        ? this.chargelist : Array.isArray(this.chargelist?.data)
          ? this.chargelist.data : [];

      dataList.forEach(item => {
        this.prescriptionArray.push(this.createprescription(item));
      });

      console.log(this.TemplateInsertForm.value);

      this._CasepaperService.SavePrescriptionTemplate(this.TemplateInsertForm.value).subscribe(response => {
        if (response) {
          this.onClose();
          this.savebtn = false;
        } else {
          this.savebtn = true;
        }
      });
    }
    else {
      let invalidFields: string[] = [];
      // checks nested error 
      if (this.TemplateInsertForm.invalid) {
        for (const controlName in this.TemplateInsertForm.controls) {
          const control = this.TemplateInsertForm.get(controlName);

          if (control instanceof FormGroup || control instanceof FormArray) {
            for (const nestedKey in control.controls) {
              if (control.get(nestedKey)?.invalid) {
                invalidFields.push(`NestedForm: ${controlName}.${nestedKey}`);
              }
            }
          } else if (control?.invalid) {
            invalidFields.push(`MainForm: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }
    }
  }

  onClose() {
    this._matDialog.closeAll();
  }

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  add: boolean = false;
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('dosename') dosename: ElementRef;
  @ViewChild('Day') Day: ElementRef;
  @ViewChild('Instruction') Instruction: ElementRef;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;

  onEnterItem(event): void {
    if (event.which === 13) {
      this.dosename.nativeElement.focus();
    }
  }
  public onEnterDose(event): void {
    if (event.which === 13) {
      this.Day.nativeElement.focus();
    }
  }
  public onEnterqty(event): void {
    if (event.which === 13) {
      this.Instruction.nativeElement.focus();
    }
  }
  public onEnterremark(event): void {
    if (event.which === 13) {
      this.addbutton.focus;
      this.add = true;
    }
  }


}
