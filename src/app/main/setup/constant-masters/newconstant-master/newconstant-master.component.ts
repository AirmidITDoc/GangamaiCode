import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { ConstantMastersService } from '../constant-masters.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-newconstant-master',
  templateUrl: './newconstant-master.component.html',
  styleUrls: ['./newconstant-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewconstantMasterComponent {
  form: FormGroup;
  constantTypeList: any[] = [];
  type: any;

  constructor(
    public _ConstantService: ConstantMastersService,
    public dialogRef: MatDialogRef<NewconstantMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }


  ngOnInit(): void {

    this.form = this._ConstantService.Form();
    this.form.markAllAsTouched();

    if ((this.data?.constantId ?? 0) > 0) {
      this.form.patchValue(this.data);
      console.log(this.data)
    }

    this._ConstantService.getconstantType().subscribe({
      next: (res) => {
        this.constantTypeList = res;
      },
      error: (err) => {
        console.error('Failed to load constant types', err);
      }
    });
  }

  selectChange(event: MatSelectChange): void {
    this.type = event.value;
    console.log('Selected type:', this.type);
  }

  onSubmit() {
    // this.form.get('value').setValue(this.form.get('value').value)
    if (!this.form.invalid) {
      console.log(this.form.value)
      this._ConstantService.constantMasterSave(this.form.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      const invalidFields = [];
      if (this.form.invalid) {
        for (const controlName in this.form.controls) {
          if (this.form.controls[controlName].invalid) {
            invalidFields.push(`Form: ${controlName}`);
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

  onClear(val: boolean) {
    this.form.reset();
    this.dialogRef.close(val);
  }
}
