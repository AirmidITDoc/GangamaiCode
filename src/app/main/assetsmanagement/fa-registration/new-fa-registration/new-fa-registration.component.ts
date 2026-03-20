import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { MatTabChangeEvent } from '@angular/material/tabs';
import Swal from 'sweetalert2';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ConfigService } from 'app/core/services/config.service';
import { MatTableDataSource } from '@angular/material/table';
import { AreaMasterComponent } from 'app/main/setup/PersonalDetails/area-master/area-master.component';
import { NewAreaComponent } from 'app/main/setup/PersonalDetails/area-master/new-area/new-area.component';
import { FARegistrationService } from '../fa-registration.service';
import { assert } from 'console';
import { assetsInsert } from '../fa-registration.component';

@Component({
  selector: 'app-new-fa-registration',
  templateUrl: './new-fa-registration.component.html',
  styleUrls: ['./new-fa-registration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewFARegistrationComponent {

  screenFromString = 'Common-form';
  filteredOptions: any[] = [];
  prevResults: any[] = [];
  debounceTimers: { [key: string]: any } = {};
  FARegFormGroup: FormGroup
  isExpanded1 = false;
  dateTimeObj: any;
  registerObj = new assetsInsert({});
  rawDate1: Date | string = '1900-01-01';
  autocompletedepartment: string = "Store";

  constructor(
    public _FARegistrationService: FARegistrationService,
    private _formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<NewFARegistrationComponent>,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    private _fuseSidebarService: FuseSidebarService,
    public _WhatsAppEmailService: WhatsAppEmailService,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    public matDialog: MatDialog,
    private commonService: PrintserviceService,
    private _configue: ConfigService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.FARegFormGroup = this.createPesonalForm();
    this.FARegFormGroup.markAllAsTouched();
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  createPesonalForm() {
    return this._formBuilder.group({
      // basic info parameters
      assertId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      assetsName: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z0-9() ]*$")
      ]],
      assetCode: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z0-9()\\- ]*$")
      ]],
      categoryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      subcategoryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      serialNo: ['', [
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z0-9() ]*$")
      ]],
      modelNo: ['', [
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z0-9()\\- ]*$")
      ]],
      manufacturer: ['', [
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      conditionId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      description: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(200)]],

      // financial parameters
      purchaseDate: ['', [Validators.required]],
      purchaseCost: [0, [Validators.required, Validators.pattern("^[0-9]*$")]],
      supplier: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      invoiceNo: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z0-9()\\- ]*$")
      ]],
      depreciationId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      usefullife: [0, [Validators.required, Validators.pattern("^[0-9]*$")]],

      // insurance parameters
      insurancePro: ['', [
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      policyNo: ['', [
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z0-9()\\- ]*$")
      ]],
      insuranceExpDate: [''],
      warrantyprovider: ['', [
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      warrantyExpDate: [''],
      amcprovider: ['', [
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      amcExpDate: [''],

      // location parameters
      location: ['', [
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      departmentId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      assignedTo: ['', [
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      building: ['', [
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      floor: ['', [
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z0-9()\\- ]*$")
      ]],
      room: ['', [
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z0-9()\\- ]*$")
      ]],

      // additional parameters
      statusId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }

  onPurchaseDateChange(event: MatDatepickerInputEvent<Date>) {
    console.log('Purchase date selected:', event.value);
    this.rawDate1 = event.value || '1900-01-01';
  }
  onInsuranceExpDateChange(event: MatDatepickerInputEvent<Date>) {
    console.log('Insurance Expdate selected:', event.value);
    this.rawDate1 = event.value || '1900-01-01';
  }
  onWarrantyExpDateChange(event: MatDatepickerInputEvent<Date>) {
    console.log('Warrancy Expdate selected:', event.value);
    this.rawDate1 = event.value || '1900-01-01';
  }

  onSave() {

  }

  onClose() {

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

  handleInputChange(changedField: string): void {
    // Get all current field values
    const firstName = this.FARegFormGroup.get('FirstName').value?.trim() || '';
    const lastName = this.FARegFormGroup.get('LastName').value?.trim() || '';
    const mobileNo = this.FARegFormGroup.get('MobileNo').value?.trim() || '';

    // If all fields are empty, clear everything
    if (!firstName && !lastName && !mobileNo) {
      this.resetFilteredOptions();
      return;
    }

    // Count how many fields are filled
    const filledFields = [firstName, mobileNo].filter(Boolean).length;

    // If only one field is filled, and it's FirstName or MobileNo, call API
    if (filledFields === 1 && (changedField === 'FirstName' || changedField === 'MobileNo')) {
      const keyword = firstName || mobileNo;
      this._FARegistrationService.getSuggestions("OutPatient/auto-complete?Keyword=", keyword).subscribe(results => {
        this.prevResults = results || [];
        this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
      });
      return;
    }

    // If only one field is filled, and it's LastName, just filter prevResults (do not call API)
    if (filledFields === 1 && changedField === 'LastName') {
      this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
      return;
    }

    // If more than one field is filled, filter from prevResults
    if (this.prevResults.length > 0) {
      this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
    } else if (changedField === 'FirstName' || changedField === 'MobileNo') {
      // Fallback: if prevResults is empty, call API with the changed field (if allowed)
      const keyword = this.FARegFormGroup.get(changedField).value?.trim();
      if (keyword) {
        this._FARegistrationService.getSuggestions("OutPatient/auto-complete?Keyword=", keyword).subscribe(results => {
          this.prevResults = results || [];
          this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
        });
      }
    } else {
      // If changedField is LastName and prevResults is empty, do nothing
      this.filteredOptions = [];
    }
  }

  // Helper function to filter results by all non-empty fields
  filterResults(results: any[], fields: { firstName: string, lastName: string, mobileNo: string }) {
    const { firstName, lastName, mobileNo } = fields;
    return results.filter(item => {
      return (!firstName || item.patientName?.toLowerCase().includes(firstName.toLowerCase()))
        && (!lastName || item.patientName?.toLowerCase().includes(lastName.toLowerCase()))
        && (!mobileNo || item.mobileNo?.startsWith(mobileNo));
    });
  }
  onSelectPatient(row: any) {
    // this.getSelectedObj(row);
    this.resetFilteredOptions();
  }
  handleInputChangeDebounced(changedField: string): void {
    // Clear any existing timer for this field
    if (this.debounceTimers[changedField]) {
      clearTimeout(this.debounceTimers[changedField]);
    }
    // Set a new timer
    this.debounceTimers[changedField] = setTimeout(() => {
      this.handleInputChange(changedField);
    }, 300); // 300ms debounce
  }
  resetFilteredOptions() {
    this.filteredOptions = [];
    this.prevResults = [];
  }
}
