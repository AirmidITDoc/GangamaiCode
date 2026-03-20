import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { EmergencyComponent, EmergencyList } from '../emergency.component';
import { EmergencyService } from '../emergency.service';
import { format } from 'date-fns';
@Component({
  selector: 'app-new-emergency',
  templateUrl: './new-emergency.component.html',
  styleUrls: ['./new-emergency.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewEmergencyComponent {

  myForm: FormGroup
  searchFormGroup: FormGroup
  screenFromString = 'Emergency';
  registerObj = new EmergencyList({});
  RegId = 0;
  CityName = ""
  
  autocompleteModepatienttype: string = "PatientType";
  autocompleteModegender: string = "Gender";
  autocompleteModecountry: string = "Country";
  autocompleteModeDepartment: string = "Department";
  autocompleteModeClass: string = "Class";
  autocompleteModetariff: string = "Tariff";
  autocompleteModeRefDoctor: string = "RefDoctor";

  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
  @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
  @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;

  constructor(public _EmergencyService: EmergencyService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewEmergencyComponent>,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private commonService: PrintserviceService,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.myForm = this._EmergencyService.CreateMyForm();
    this.myForm.markAllAsTouched();
    this.searchFormGroup = this.createSearchForm();
    if ((this.data?.emgId) > 0) {
      this._EmergencyService.getEmergencyById(this.data.emgId).subscribe((response) => {
          this.registerObj = response;
          this.selectChangedepartment(this.registerObj)
          this.RegId=this.registerObj.regId
          this.myForm.get('IsMlc').setValue(this.registerObj.isMlc)
          console.log(this.registerObj)
      });
    }
  }

  createSearchForm() {
    return this.formBuilder.group({
      regId: [],
    });
  }

  chkChange() {
      if (this.registerObj.dateOfBirth > this.minDate) {
          this.toastr.warning('Enter Proper Birth Date', 'warning !', {
              toastClass: 'tostr-tost custom-toast-success',
          });
      }
  }

  dateTimeObj: any;
  minDate = new Date();

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
 
  getSelectedObj(obj) {
    this.RegId = obj.value;
    if ((obj.value ?? 0) > 0) {
      setTimeout(() => {
        this._EmergencyService.getRegistraionById(obj.value).subscribe((response) => {
          this.registerObj = response;
          console.log("Searched data:", this.registerObj)
        });
      }, 500);
    }
  }

  onChangePrefix(e) {
    this.ddlGender.SetSelection(e.sexId);
  }

  onChangecity(e) {
    this.CityName = e.cityName
    this.registerObj.stateId = e.stateId
    this._EmergencyService.getstateId(e.stateId).subscribe((Response) => {
      this.ddlState.SetSelection(Response.stateId)
      this.ddlCountry.SetSelection(Response.countryId);
    });
  }

  selectChangedepartment(obj: any) {
    if (obj.value) {
      this._EmergencyService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
        this.ddlDoctor.options = data;
        this.ddlDoctor.bindGridAutoComplete();
      });
    }
    else {
      this._EmergencyService.getDoctorsByDepartment(obj.departmentId).subscribe((data: any) => {
        // debugger
        this.ddlDoctor.options = data;
        // this.ddlDoctor.bindGridAutoComplete();
        const incomingDoctorId = obj.doctorId;
        console.log("Id:", incomingDoctorId)
        setTimeout(() => {
          this.ddlDoctor.bindGridAutoComplete();
          if (incomingDoctorId) {
            const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
            if (matchedDoctor) {
              this.ddlDoctor.SetSelection(matchedDoctor.value);
              // this.myForm.get('doctorId')?.setValue(matchedDoctor.value);
            }
          }
        }, 100);
      });
    }
  }

  onNewSave() {
    if (!this.myForm.invalid) {
      const DateOfBirth1 = this.myForm.get('DateOfBirth')?.value;
      console.log("DOB Raw:", DateOfBirth1);

      if (DateOfBirth1) {
        const todayDate = new Date();
        const dob = new Date(DateOfBirth1);
        let ageYear = (todayDate.getFullYear() - dob.getFullYear());
        let ageMonth = (todayDate.getMonth() - dob.getMonth());
        let ageDay = (todayDate.getDate() - dob.getDate());

        if (ageDay < 0) {
          (ageMonth)--;
          const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
          ageDay += previousMonth.getDate();
        }

        if (ageMonth < 0) {
          ageYear--;
          ageMonth += 12;
        }
        if (
          (!ageYear || ageYear == 0) &&
          (!ageMonth || ageMonth == 0) &&
          (!ageDay || ageDay == 0)
        ) {
          this.toastr.warning('Please select the birthdate or enter the age of the patient.', 'Warning!', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        this.myForm.get('ageYear')?.setValue(ageYear, { emitEvent: false });
        this.myForm.get('ageMonth')?.setValue(ageMonth, { emitEvent: false });
        this.myForm.get('ageDay')?.setValue(ageDay, { emitEvent: false });
      }

      this.myForm.get('regId')?.setValue(this.RegId);
      this.myForm.get('emgId')?.setValue(this.registerObj?.emgId || 0);
      this.myForm.get('emgDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'));
      this.myForm.get('emgTime').setValue(this.dateTimeObj.time);
      this.myForm.get("DateOfBirth").setValue(this.datePipe.transform(this.myForm.get("DateOfBirth").value, "yyyy-MM-dd"));
      if(this.registerObj?.emgId > 0){
        this.myForm.removeControl('createdBy')
      }else{
        this.myForm.removeControl('modifiedBy')
      }
      console.log(this.myForm.value)
      this._EmergencyService.EmgSaveUpdate(this.myForm.value).subscribe((res) => {
        this.OnViewReportPdf(res)
        this.onClose()
      })
    } else {
      const invalidfields = [];
      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
            invalidfields.push(`Emergency Form: ${controlName}`)
          }
        }
      }
      if (invalidfields.length > 0) {
        invalidfields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }
    }
  }

  OnViewReportPdf(EmgId: any) {
    this.commonService.Onprint("EmgId", EmgId, "EmergencyPrint");
  }

  onClose() {
    this.myForm.reset();
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

    prevResults: any[] = [];
  filteredOptions: any[] = [];
  resetFilteredOptions() {
    this.filteredOptions = [];
    this.prevResults = [];
  }

  debounceTimers: { [key: string]: any } = {};
     handleInputChange(changedField: string): void {
        // Get all current field values
        const firstName = this.myForm.get('firstName').value?.trim() || '';
        const lastName = this.myForm.get('lastName').value?.trim() || '';
        const mobileNo = this.myForm.get('mobileNo').value?.trim() || '';

        // If all fields are empty, clear everything
        if (!firstName && !lastName && !mobileNo) {
            this.resetFilteredOptions();
            return;
        }

        // Count how many fields are filled
        const filledFields = [firstName, mobileNo].filter(Boolean).length;

        // If only one field is filled, and it's firstName or mobileNo, call API
        if (filledFields === 1 && (changedField === 'firstName' || changedField === 'mobileNo')) {
            const keyword = firstName || mobileNo;
            this._EmergencyService.getSuggestions("OutPatient/auto-complete?Keyword=", keyword).subscribe(results => {
                this.prevResults = results || [];
                this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
            });
            return;
        }

        // If only one field is filled, and it's lastName, just filter prevResults (do not call API)
        if (filledFields === 1 && changedField === 'lastName') {
            this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
            return;
        }

        // If more than one field is filled, filter from prevResults
        if (this.prevResults.length > 0) {
            this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
        } else if (changedField === 'firstName' || changedField === 'mobileNo') {
            // Fallback: if prevResults is empty, call API with the changed field (if allowed)
            const keyword = this.myForm.get(changedField).value?.trim();
            if (keyword) {
                this._EmergencyService.getSuggestions("OutPatient/auto-complete?Keyword=", keyword).subscribe(results => {
                    this.prevResults = results || [];
                    this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
                });
            }
        } else {
            // If changedField is lastName and prevResults is empty, do nothing
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
    onSelectPatient(row: any) {
        this.getSelectedObj(row);
        this.resetFilteredOptions();
    }
}
