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

  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
  @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;

  constructor(public _EmergencyService: EmergencyService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewEmergencyComponent>,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.myForm = this._EmergencyService.CreateMyForm();
    this.myForm.markAllAsTouched();
    this.searchFormGroup = this.createSearchForm();
    if((this.data?.emgId ?? 0) > 0){
      this.registerObj=this.data
      console.log("Retrived data:",this.registerObj)
    }
  }

  createSearchForm() {
    return this.formBuilder.group({
      regId: [],
    });
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getSelectedObj(obj) {
    this.RegId = obj.value;
    if ((obj.value ?? 0) > 0) {
      setTimeout(() => {
        this._EmergencyService.getRegistraionById(obj.value).subscribe((response) => {
          this.registerObj = response;
          console.log("Searched data:",this.registerObj)
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
      this.ddlCountry.SetSelection(Response.countryId);
    });
  }

  selectChangedepartment(obj: any) {
    this._EmergencyService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
      this.ddlDoctor.options = data;
      this.ddlDoctor.bindGridAutoComplete();
    });
  }

  onNewSave() {
    if (!this.myForm.invalid) {
      const dateOfBirthValue = this.myForm.get('DateOfBirth')?.value;

      if (dateOfBirthValue) {
        const today = new Date();
        const dob = new Date(dateOfBirthValue);
        let ageYear = today.getFullYear() - dob.getFullYear();
        this.myForm.get('ageYear')?.setValue(ageYear, { emitEvent: false });
      }

      this.myForm.get('regId')?.setValue(this.RegId);
      this.myForm.get('emgDate')?.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
      ['PinNo', 'PhoneNo', 'StateId', 'CountryId', 'DateOfBirth'].forEach(control => {
        this.myForm.removeControl(control)
      })
      console.log(this.myForm.value)
      this._EmergencyService.EmgSaveUpdate(this.myForm.value).subscribe((res) => {
        this.onClose()
      })
    } else {
      let invalidfields = [];
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

  onClose() {
    this.myForm.reset();
    this.dialogRef.close();
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
}
