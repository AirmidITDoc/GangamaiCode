import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { RefundbillService } from 'app/main/opd/refundbill/refundbill.service';
import { FormvalidationserviceService } from '../../services/formvalidationservice.service';
import { ConfigService } from 'app/core/services/config.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PatientSearchComponent implements OnInit {
  SearchGroupForm: FormGroup;
  SaveForm: FormGroup;
  registerObj: any;
  Is9_Digit_National_Id: boolean = false;


  constructor(
    public _formbuilder: FormBuilder,
    public _RefundbillService: RefundbillService,
    public _matdailog: MatDialog,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<PatientSearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _formvalidationservice: FormvalidationserviceService,
    public _configue: ConfigService
  ) { }
  ngOnInit(): void {
    //this code for Mediforte 9 digit national id
    const rawValue = this?._configue?.configParams?.Is9_Digit_NationalId || "";
    const [id, val] = rawValue.includes(":") ? rawValue.split(":") : [null, null];
    this.Is9_Digit_National_Id = id === "1";
    this.SearchGroupForm = this.createSearchform();
    this.SearchGroupForm.markAllAsTouched();
    this.SaveForm = this.CreateSaveForm();
  }
  createSearchform() {
    const maxLen = this.Is9_Digit_National_Id ? 9 : 12;
     const minLen = this.Is9_Digit_National_Id ? 7 : 12;
    return this._formbuilder.group({
      RegId: [0, [this._formvalidationservice.notEmptyOrZeroValidator()]],
      mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
      this._formvalidationservice.onlyNumberValidator()
      ]],
      emailId: ['', [Validators.required, Validators.email]],
      aadharCardNo: ['', [Validators.required, Validators.minLength(minLen), Validators.maxLength(maxLen),
      this._formvalidationservice.onlyNumberValidator()
      ]],
    })
  }
  getSelectedObj(obj) {
    console.log(obj);
    this.registerObj = obj;
    this.SearchGroupForm.patchValue({
      mobileNo: obj?.mobileNo || '',
      emailId: obj?.emailId || '',
      aadharCardNo: obj?.aadharCardNo || ''
    })
  }

  CreateSaveForm() {
    return this._formbuilder.group({
      regId: [0, [this._formvalidationservice.notEmptyOrZeroValidator()]],
      mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
      this._formvalidationservice.onlyNumberValidator()
      ]],
      emailId: ['', [Validators.required, Validators.email]],
      aadharCardNo: ['', [Validators.required, this._formvalidationservice.onlyNumberValidator()
      ]],
    })
  }
  OnSave() {
    debugger
    const fromvalues = this.SearchGroupForm.value
    this.SaveForm.patchValue({
      regId: fromvalues?.RegId?.regId || 0,
      mobileNo: fromvalues?.mobileNo || '',
      emailId: fromvalues?.emailId || '',
      aadharCardNo: fromvalues?.aadharCardNo || ''
    })
    //    {
    //     "text": "SACHIN  MAHAMUNI | 351 | 7028310382",
    //     "value": 140309,
    //     "regNo": "351",
    //     "mobileNo": "7028310382",
    //     "ageYear": "1         ",
    //     "ageMonth": "1         ",
    //     "ageDay": "0         ",
    //     "patientName": "SACHIN   MAHAMUNI",
    //     "regId": 140309,
    //     "aadharCardNo": ""
    // }
    if (this.SaveForm.valid) {
      this._RefundbillService.globlePatientdetUpdates(this.SaveForm.value, fromvalues?.RegId?.regId).subscribe(response => {
        this.OnClose();
      })
    } else {
      const invalidFields = [];
      if (this.SaveForm.invalid) {
        for (const controlName in this.SaveForm.controls) {
          if (this.SaveForm.controls[controlName].invalid) {
            invalidFields.push(`${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
          );
        });
        return
      }
    }
  }
  OnClose() {
    this.SearchGroupForm.reset();
    this.dialogRef.close();
  }

  getValidationMessages() {
    const maxLen = this.Is9_Digit_National_Id ? 9 : 12;
      const minLen = this.Is9_Digit_National_Id ? 7 : 12;
    return {
      mobileNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "Mobile No is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ],
      emailId: [
        { name: "required", Message: "Mail Id is required" },
        { name: "email", Message: "Enter a valid Mail Id" }
      ],
      aadharCardNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "Aadhaar / National ID is required" },
        { name: "minLength", Message: `Minimum ${minLen} digits required.` },
        { name: "maxLength", Message: `More than ${maxLen} digits not allowed.` }
      ],

    };
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
}
