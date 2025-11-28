import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { HospitalMaster } from '../hospital-master.component';
import { HospitalService } from '../hospital.service';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ConfigService } from 'app/core/services/config.service';

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
  vTemplateDesc: " ";
  registerObj = new HospitalMaster({});
  optionsCity: any[] = [];
  cityList: any = [];
  filteredOptionsCity: Observable<string[]>;
  isCitySelected: boolean = false;
  vCityId: any;
  vCityName: any;
  HospitalId = 0;
  HospitalHeader: any = '';
  isExpanded = false;
  selectedTabIndex = 0;
  isActive=true
    Is5_Digit_Pincode_Id: boolean = false;
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
  autocompleteIPDAdvanceReceiptCounterId: string = "CashCounter";
  autocompleteIPDRefundofAdvanceReceiptCounterId: string = "CashCounter";

  constructor(public _HospitalService: HospitalService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _configue:ConfigService,
    public dialogRef: MatDialogRef<NewHospitalComponent>) { }

  ngOnInit(): void {
    this.HospitalForm = this._HospitalService.createHospitalForm();
    this.HospitalForm.markAllAsTouched();
    console.log(this.data)

    if ((this.data?.hospitalId ?? 0) > 0) {
      this.registerObj = this.data;
      this.HospitalId = this.registerObj.hospitalId
      this.isActive=this.registerObj.isActive
      this.HospitalForm.get('pin').setValue(this.data.pin)
      this.HospitalForm.get('cityId').setValue(this.data.cityId)
      this.vCityName=this.data.city
      this.HospitalForm.patchValue(this.data);

      setTimeout(() => {
        this._HospitalService.gethospitalById(this.data.hospitalId).subscribe((response) => {
          this.registerObj = response;
          console.log(this.registerObj)
          this.HospitalForm.get('hospitalId').setValue(this.registerObj.hospitalId)
          this.HospitalForm.get('hospitalName').setValue(this.registerObj.hospitalName)
          this.HospitalForm.get('hospitalAddress').setValue(this.registerObj.hospitalAddress)
          this.HospitalForm.get('phone').setValue(this.registerObj.phone)
        });
      }, 500);
    }
            //this code for Mediforte 5 digit pincode id
const rawValue = this?._configue?.configParams?.Is9_Digit_NationalId || "";
const [id, val] = rawValue.includes(":") ? rawValue.split(":") : [null, null]; 
this.Is5_Digit_Pincode_Id = id === "1";
  }

  selectChangecity(obj: any) {
    console.log(obj)
    this.vCityName = obj.cityName
    this.vCityId = obj.cityId
  }

  onSubmit() {
    debugger
    if (this.HospitalForm.get('header')?.value === "") {
      this.toastr.warning('Please enter Template Details', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.HospitalForm.get('City')?.setValue(this.vCityName)
    if (!this.HospitalForm.invalid) {
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
    const maxLen = this.Is5_Digit_Pincode_Id ? 5 : 6;
    return {
      cityId: [
        { name: "required", Message: "CityName  is required" },
        // { name: "maxlength", Message: "CityName  should not be greater than 50 char." },
        // { name: "pattern", Message: "Only Characters Allowed." }
      ],
      HospitalName: [
        { name: "required", Message: "HospitalName is required" },
        // { name: "maxlength", Message: "HospitalName should not be greater than 50 char." },
        // { name: "pattern", Message: "Only Characters Allowed." }
      ],
      HospitalAddress: [
        { name: "required", Message: "HospitalAddress is required" },
        // { name: "maxlength", Message: "HospitalAddress should not be greater than 250 char." },
        // { name: "pattern", Message: "Only Characters Allowed." }
      ],
      Email: [
        // { name: "required", Message: "Email is required" },
        { name: "maxlength", Message: "Email should not be greater than 250 char." },
        // { name: "pattern", Message: "Only Characters Allowed." }
      ],
      website: [],
      Phone: [],
      // Pin: []
                  Pin: [ ,
                { name: "required", Message: "Pin / Country ID is required" },
                { name: "minLength", Message: `${maxLen} digits required.` },
                { name: "maxLength", Message: `More than ${maxLen} digits not allowed.` }
            ],
    };
  }

  onTabChange(event: MatTabChangeEvent) {
    this.selectedTabIndex = event.index;
  }


  onClose() {
    this._matDialog.closeAll();
  }

  onClear(val: boolean) {
    this.HospitalForm.reset();
    this.dialogRef.close(val);
  }
}


