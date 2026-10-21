import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OTBillingTemplateService } from '../otbilling-template.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-otbill-template',
  templateUrl: './new-otbill-template.component.html',
  styleUrls: ['./new-otbill-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewOTBillTemplateComponent implements OnInit {
  displayedColumns = [
    //'Serviceid',
    'srNo',
    'serviceName',
    'percentage',
    'action'
  ];

  myForm: FormGroup;
  SaveForm: FormGroup;
  registerObj: any;
  vTemplateId: any = 0;

  constructor(
    public _OTBillingTemplateService: OTBillingTemplateService,
    public dialogRef: MatDialogRef<NewOTBillTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    public datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) { }

  @ViewChild('ddlLocation') ddlLocation: AirmidDropDownComponent;
  @ViewChild('ddlService') ddlService: AirmidDropDownComponent;

  autocompleteModeService: string = "Service";

  dsServicelist = new MatTableDataSource<OtTemplate>();

  ngOnInit(): void {
    this.myForm = this.createTemplateForm();
    this.myForm.markAllAsTouched();
    this.SaveForm = this.createTemplateSaveForm();

    if ((this.data?.otbTempId ?? 0) > 0) { 
      this.vTemplateId = this.data?.otbTempId || 0;
      this.myForm.patchValue({otBillTemplateName: this.data?.otBillTemplateName})
      this.SaveForm.get('otbtempId').setValue(this.data?.otbTempId);
      this.getTemplatedetails(this.data?.otbTempId);
    }
  }
  createTemplateForm(): FormGroup {
    return this._formBuilder.group({
      serviceId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      percentage: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      otBillTemplateName: ['', [Validators.required]]
    });
  }
  createTemplateSaveForm(): FormGroup {
    return this._formBuilder.group({
      otbtempId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otBillTemplateName: ['', [Validators.required]],
      mOtBillTemplateDetails: this._formBuilder.array([]),
    });
  }
  createSavedetailsTemplateForm(items: OtTemplate): FormGroup {
    return this._formBuilder.group({
      otbtempDetId: [0 || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otbtempId: [items?.otbTempId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceId: [items?.serviceId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      percentage: [Number(items?.percentage || 0), [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    })
  }

  get tempdetailsArray(): FormArray {
    return this.SaveForm.get('mOtBillTemplateDetails') as FormArray;
  }

  selectChangeServiceName(event: any): void {
    console.log('Selected :', event);
    if (event?.serviceId) {
      this.registerObj = event;
    }
  }
  chargelist: any = [];
  onAdd() {
    debugger
    const formValue = this.myForm.value
    if (!formValue?.otBillTemplateName) {
      this.toastr.warning('Please select Template name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!formValue?.serviceId) {
      this.toastr.warning('Please select service name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!formValue?.percentage) {
      this.toastr.warning('Please enter percentage', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.dsServicelist.data.length > 0) {
      const deuplicateRecord = this.dsServicelist.data.find(item => item.serviceId == this.registerObj?.serviceId)
      if (deuplicateRecord) {
        this.toastr.warning('Please check selected Service already added in list', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    this.chargelist.push(
      {
        serviceId: this.registerObj?.serviceId,
        serviceName: this.registerObj?.serviceName,
        percentage: formValue?.percentage
      }
    )
    this.dsServicelist.data = this.chargelist
    const serviceIdElement = document.querySelector(`[name='serviceName']`) as HTMLElement;
    if (serviceIdElement) {
      serviceIdElement.focus();
    }
    this.myForm.patchValue({
      serviceId: 0,
      percentage: 0
    });
    this.myForm.markAllAsTouched();
  }
  deleteTableRow(element) {
    const index = this.chargelist.indexOf(element);
    if (index >= 0) {
      this.chargelist.splice(index, 1);
      this.dsServicelist.data = [];
      this.dsServicelist.data = this.chargelist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }
  onSubmit() {
    if (!this.dsServicelist.data.length) {
      this.toastr.warning('lease add at least one service to the list before saving.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.isValidForm()) {
      // Swal.fire('Please enter valid table data.');
      return;
    }
    Swal.fire({
      title: 'Confirm Save',
      text: 'Are you sure you want to save this Template?',
      icon: 'warning', // or 'question'
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Blue
      cancelButtonColor: '#d33',     // Red
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.OnSave(); // Call your save function
      }
    });
  }
  OnSave() {
    debugger
    this.SaveForm.get('otBillTemplateName').setValue(this.myForm.get('otBillTemplateName')?.value);
    if (this.SaveForm.valid) {
      this.tempdetailsArray.clear();
      this.dsServicelist.data.forEach(item => (
        this.tempdetailsArray.push(this.createSavedetailsTemplateForm(item as OtTemplate))
      ))
      this._OTBillingTemplateService.OTbillTemlateSave(this.SaveForm.value, this.vTemplateId)
        .subscribe({
          next: (response) => {
            this.onClear();
          },
          error: (error) => {
            console.error(error);
            this.toastr.error('Error while saving record.');
          }
        });
    }
    else {
      const invalidFields = [];
      if (this.SaveForm.invalid) {
        for (const controlName in this.SaveForm.controls) {
          if (this.SaveForm.controls[controlName].invalid) {
            invalidFields.push(`Save Form: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
        });
      }
    }
  }

  onClear() {
    this.myForm.reset();
    this.SaveForm.reset();
    this.registerObj = '';
    this.chargelist = [];
    this.dsServicelist.data = [];
    this.vTemplateId = 0;
    this.myForm.markAllAsTouched();
    this.dialogRef.close();
  }

  getTemplatedetails(Obj) {
    const vdata = {
      "first": 0,
      "rows": 999,
      "sortField": "OTBTempDetId",
      "sortOrder": 0,
      "filters": [{ "fieldName": "OTBTempId", "fieldValue": String(Obj), "opType": "Equals" }],
      "Columns": [],
      "exportType": "JSON"
    }
    this._OTBillingTemplateService.getTemplatedetails(vdata).subscribe((response) => {
      this.chargelist = response.data;
      this.dsServicelist.data = this.chargelist;
    });
  }
  // it allowed only Digit 
  keyPressDigitsOnly(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  // it allowed only Digit & decimal
  keyPressDigitDecimalOnly(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  isValidForm(): boolean {
    const invalidItem = this.dsServicelist.data.find((item, index) => {
      if (item.percentage <= 0) {
        this.toastr.warning(
          `Row ${index + 1}: Percentage must be greater than 0`,
          'Warning !',
          { toastClass: 'tostr-tost custom-toast-warning' }
        );
        return true;
      }
       if (item.percentage > 100) {
        this.toastr.warning(
          `Row ${index + 1}: Percentage must be greater than 0 and less than 100`,
          'Warning !',
          { toastClass: 'tostr-tost custom-toast-warning' }
        );
        return true;
      }
      return false;
    });
    return !invalidItem; // valid only if no invalid row
  }
  percentageValidate(){
    const percentage = +this.myForm.get('percentage')?.value || 0
    if(percentage > 100){
        this.toastr.warning(`Percentage must be greater than 0 and less than 100.`, 'Warning');
    }
  }
}
export class OtTemplate {
  otbTempId: any;
  serviceId: any;
  percentage: any;

  /**
    * Constructor
    *
    * @param OtTemplate
    */

  constructor(OtTemplate) {
    {
      this.otbTempId = OtTemplate.otbTempId || 0;
      this.serviceId = OtTemplate.serviceId || 0;
      this.percentage = OtTemplate.percentage

    }
  }
}