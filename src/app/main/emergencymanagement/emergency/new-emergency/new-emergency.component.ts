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

  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
  @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
  @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
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
    if ((this.data?.emgId ?? 0) > 0) {
      console.log("data:", this.data)

      this.registerObj = this.data
      // debugger
      console.log("Retrived data:", this.registerObj)
      this.myForm.patchValue({
        prefixId: this.registerObj?.prefixId,
        firstName: this.registerObj?.firstName,
        middleName: this.registerObj?.middleName,
        lastName: this.registerObj?.lastName,
        genderId: this.registerObj?.genderID,
        // DateOfBirth: format(new Date(this.registerObj?.dateofBirth), 'dd-MM-yyyy HH:mm:ss'),
        // DateOfBirth: this.registerObj?.dateofBirth,
        address: this.registerObj?.address,
        pinNo: this.registerObj?.pinNo,
        cityId: this.registerObj?.cityId,
        mobileNo: this.registerObj?.mobileNo?.trim(),
        phoneNo: this.registerObj?.phoneNo,
        departmentId: this.registerObj?.departmentId,
        tariffId: this.registerObj?.tariffid,
        classId: this.registerObj?.classid,
        comment: this.registerObj?.comment,
        // doctorId: this.registerObj?.doctorId,
      });
      this.selectChangedepartment(this.registerObj)
      this.onChangecity(this.registerObj)
    }
  }

  createSearchForm() {
    return this.formBuilder.group({
      regId: [],
    });
  }

  chkChange() {
      if (this.registerObj.dateOfBirth > this.minDate) {
          // Swal.fire("Enter Proper Birth Date ")
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
      let DateOfBirth1 = this.myForm.get('DateOfBirth')?.value;
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
      ['PinNo', 'PhoneNo'].forEach(control => {
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
