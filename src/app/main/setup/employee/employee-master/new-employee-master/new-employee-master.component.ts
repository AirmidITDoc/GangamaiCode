import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { EmployeeMasterService } from '../employee-master.service';
import { RegInsert } from '../employee-master.component';

@Component({
  selector: 'app-new-employee-master',
  templateUrl: './new-employee-master.component.html',
  styleUrls: ['./new-employee-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewEmployeeMasterComponent {
  personalFormGroup: FormGroup;
  autocompleteModegender: string = "Gender";
  autocompleteModecity: string = "City";
  autocompleteModeunit: string = "Hospital";
  autocompleteModeEmpDep: string = "EmployeeDepartmentMaster";
  autocompleteModeEmpDesig: string = "EmployeeDesignationMaster";
  registerObj = new RegInsert({});
  isActive: boolean = true;
  isRepersentative: boolean = false;

  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;

  constructor(public _companyEmpService: EmployeeMasterService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<NewEmployeeMasterComponent>,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    public _configue: ConfigService
  ) { }

  onChangePrefix(e) {
    this.ddlGender.SetSelection(e.sexId);
  }

  ngOnInit(): void {
    this.personalFormGroup = this._companyEmpService.createPesonalForm1();
    this.personalFormGroup.markAllAsTouched();

    if ((this.data?.executiveId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.isRepersentative = this.data.isRepresentative
      setTimeout(() => {
        this._companyEmpService.getCompanyEmpById(this.data.executiveId).subscribe((response) => {
          this.registerObj = response;
        });
      }, 500);
    }
  }

  onSubmit() {
    if (!this.personalFormGroup.invalid) {
      this.personalFormGroup.removeControl('isActive')
      this.personalFormGroup.get('executiveId').setValue(this.data?.executiveId ?? 0)
      console.log(this.personalFormGroup.value)
      this._companyEmpService.companyEmpSave(this.personalFormGroup.value).subscribe((response) => {
        this.onClose();
      });
    } {
      const invalidFields = [];
      if (this.personalFormGroup.invalid) {
        for (const controlName in this.personalFormGroup.controls) {
          if (this.personalFormGroup.controls[controlName].invalid) {
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

  keyPressAlphanumeric(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  getValidationMessages() {
    return {
      firstName: [
        { name: "required", Message: "First Name is required" },
        { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      middleName: [
        { name: "pattern", Message: "only char allowed." }
      ],
      lastName: [
        { name: "required", Message: "Last Name is required" },
        { name: "pattern", Message: "only char allowed." }
      ],
      address: [
        { name: "required", Message: "Address is required" },

      ],
      prefixId: [
        { name: "required", Message: "Prefix Name is required" }
      ],
      genderId: [
        { name: "required", Message: "Gender is required" }
      ],
      cityId: [
        { name: "required", Message: "City Name is required" }
      ],
      mobileNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "Mobile No is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ]
    };
  }
}
