import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { HospitalMaster } from '../hospital-master.component';
import { HospitalService } from '../hospital.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-hospital',
  templateUrl: './new-hospital.component.html',
  styleUrls: ['./new-hospital.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewHospitalComponent implements OnInit {
  Header: string;
  HospitalForm: FormGroup;
  vTemplateDesc: ''
  registerObj = new HospitalMaster({});
  optionsCity: any[] = [];
  cityList: any = [];
  filteredOptionsCity: Observable<string[]>;
  isCitySelected: boolean = false;
  vCityId: any;
  HospitalId = 0;
  HospitalHeader: any = '';
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '20rem',
    minHeight: '20rem',
    translate: 'yes',
    placeholder: 'Enter text here...',
    enableToolbar: true,
    showToolbar: true,

  };

  onBlur(e: any) {
    this.vTemplateDesc = e.target.innerHTML;
    throw new Error('Method not implemented.');
  }

  constructor(public _HospitalService: HospitalService,
    public _matDialog: MatDialog,
    private reportDownloadService: ExcelDownloadService,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewHospitalComponent>,
    private _fuseSidebarService: FuseSidebarService,) { }

  ngOnInit(): void {
    this.HospitalForm = this._HospitalService.createHospitalForm();
  this.HospitalForm.markAllAsTouched();
  
    if (this.data) {
      this.registerObj = this.data;
      this.HospitalId = this.registerObj.hospitalId
      console.log(this.registerObj)

    }

  }

  onSubmit() {
    let hospitalarr = [];
    debugger
    if (this.HospitalForm.valid) {
       console.log(this.HospitalForm.valid)
      console.log(this.HospitalForm.value)
      this._HospitalService.HospitalInsert(this.HospitalForm.value).subscribe(response => {
         this.onClear(true);

      });
    } else {
      let invalidFields = [];

      if (this.HospitalForm.invalid) {
        for (const controlName in this.HospitalForm.controls) {
          if (this.HospitalForm.controls[controlName].invalid) {
            invalidFields.push(`Hospital Form: ${controlName}`);
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

    this._matDialog.closeAll();
  }

  getValidationMessages() {
    return {
      cityId: [
        { name: "required", Message: "CityName  is required" },
        { name: "maxlength", Message: "CityName  should not be greater than 50 char." },
        { name: "pattern", Message: "Only Characters Allowed." }
      ],
      HospitalName: [
        { name: "required", Message: "HospitalName is required" },
        { name: "maxlength", Message: "HospitalName should not be greater than 50 char." },
        { name: "pattern", Message: "Only Characters Allowed." }
      ],
      HospitalAddress: [
        { name: "required", Message: "HospitalAddress is required" },
        { name: "maxlength", Message: "HospitalAddress should not be greater than 250 char." },
        { name: "pattern", Message: "Only Characters Allowed." }
      ],
      Email: [
        // { name: "required", Message: "Email is required" },
        { name: "maxlength", Message: "Email should not be greater than 250 char." },
        // { name: "pattern", Message: "Only Characters Allowed." }
      ],
      website: [],
      Phone: [],
      Pin: []
    };
  }

  onClose() {
      this._matDialog.closeAll();
  }

    onClear(val: boolean) {
        this.HospitalForm.reset();
        this.dialogRef.close(val);
    }
}


