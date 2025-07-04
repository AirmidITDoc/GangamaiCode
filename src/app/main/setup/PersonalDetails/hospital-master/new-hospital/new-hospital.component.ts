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
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

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

    autocompleteOPDBillingCounterId: string = "CashCounter";
    autocompleteOPDReceiptCounterId: string = "CashCounter";
    autocompleteOPDRefundBillCounterId: string = "CashCounter";
    autocompleteOPDRefundBillReceiptCounterId: string = "CashCounter";
    autocompleteOPDAdvanceCounterId: string = "CashCounter";
    autocompleteOPDRefundAdvanceCounterId: string = "CashCounter";

    autocompleteIPDAdvanceCounterId: string = "CashCounter";
    autocompleteIPDBillingCounterId: string = "CashCounter";
    autocompleteIPDReceiptCounterId: string = "CashCounter";
    autocompleteIPDRefundofBillCounterId: string = "CashCounter";
 autocompleteIPDRefundofBillReceiptCounterId: string = "CashCounter";
autocompleteIPDRefundofAdvanceCounterId: string = "CashCounter";

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '36rem',
    minHeight: '36rem',
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
    private _formBuilder: UntypedFormBuilder,
    public toastr: ToastrService,
    private _FormvalidationserviceService: FormvalidationserviceService,
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

  //  createHospitalForm(): FormGroup {
  //     return this._formBuilder.group({
  //       HospitalId: [0, this._FormvalidationserviceService.onlyNumberValidator()],
  //       HospitalName: ["",[ this._FormvalidationserviceService.allowEmptyStringValidatorOnly(),
                  
  //                     Validators.required,
  //                     Validators.pattern('^[a-zA-Z0-9 ]*$')
  //                 ]
  //             ],
  //       HospitalAddress:["",[ this._FormvalidationserviceService.allowEmptyStringValidatorOnly(),
  //                 [
  //                     Validators.required,
  //                     Validators.pattern('^[a-zA-Z0-9 ]*$')
  //                 ]
  //             ]],
  //       City:["",
  //                       [
  //                           Validators.required,
  //                           Validators.pattern('^[a-zA-Z0-9 ]*$')
  //                       ]
  //                   ],
  //       // CityId: [""],
  //       Pin: ["", Validators.pattern("[0-9]{7}")],
  //       Phone:['', [Validators.required,
  //             Validators.minLength(10),
  //             Validators.maxLength(10),
  //             Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
  //             this._FormvalidationserviceService.onlyNumberValidator()
  //             ]],
  //       Email: [""],
  //       website: [""],
      
  //       // HospitalHeader: [""]
  //       header:[""],
  //       IsActive:1,
  
  // opdBillingCounterId:'',//[0, this._FormvalidationserviceService.onlyNumberValidator()],
  // opdReceiptCounterId:[0, this._FormvalidationserviceService.onlyNumberValidator()],
  // opdRefundBillCounterId:[0, this._FormvalidationserviceService.onlyNumberValidator()],
  // opdRefundBillReceiptCounterId:[0, this._FormvalidationserviceService.onlyNumberValidator()],
  // opdAdvanceCounterId:[0, this._FormvalidationserviceService.onlyNumberValidator()],
  // opdRefundAdvanceCounterId: [0, this._FormvalidationserviceService.onlyNumberValidator()],
  // ipdAdvanceCounterId:[0, this._FormvalidationserviceService.onlyNumberValidator()],
  // ipdBillingCounterId:[0, this._FormvalidationserviceService.onlyNumberValidator()],
  // ipdReceiptCounterId:[0, this._FormvalidationserviceService.onlyNumberValidator()],
  // ipdRefundOfBillCounterId:[0, this._FormvalidationserviceService.onlyNumberValidator()],
  // ipdRefundOfBillReceiptCounterId: [0, this._FormvalidationserviceService.onlyNumberValidator()],
  // ipdRefundOfAdvanceCounterId:[0, this._FormvalidationserviceService.onlyNumberValidator()],
  //     });
  //   }

  onSubmit() {
    let hospitalarr = [];
    debugger
     console.log(this.HospitalForm.value)
    if (!this.HospitalForm.invalid) {
       console.log(this.HospitalForm.valid)
     
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

  
    keyPressAlphanumeric(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
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


