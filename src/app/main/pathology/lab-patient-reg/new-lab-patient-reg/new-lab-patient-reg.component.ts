import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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
import { LabPatientList, LabRequest } from '../lab-patient-reg.component';
import { LabPatientRegService } from '../lab-patient-reg.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-new-lab-patient-reg',
  templateUrl: './new-lab-patient-reg.component.html',
  styleUrls: ['./new-lab-patient-reg.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewLabPatientRegComponent {
  myForm: FormGroup
  searchFormGroup: FormGroup
  screenFromString = 'Common-Form';
  registerObj = new LabPatientList({});
  RegId = 0;
  CityName = ""
  vRegNo: any;
  vTariffId: any = 1;
  vClassId: any = 1;
  vRegId: any;
  isServiceIdSelected: boolean = false;
  isDoctor: boolean = false;

  autocompleteModepatienttype: string = "PatientType";
  autocompleteModegender: string = "Gender";
  autocompleteModecountry: string = "Country";
  autocompleteModeDepartment: string = "Department";
  autocompleteModerefdoc: string = "RefDoctor";
  dsLabRequest2 = new MatTableDataSource<LabRequest>();
  dstable1 = new MatTableDataSource<LabRequest>();
  chargeslist: any = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dateTimeObj: any;
  minDate = new Date();
  selectedPatient: any;
  selectedMobile: any;
  displayedServiceColumns: string[] = [
    'ServiceName',
    'Action'
  ]

  displayedServiceselected: string[] = [
    'ServiceName',
    'Price',
    'buttons'
  ]

  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
  @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
  @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;

  constructor(public _labPatientRegService: LabPatientRegService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewLabPatientRegComponent>,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public _formbuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.myForm = this.CreateMyForm();
    this.myForm.markAllAsTouched();
    this.getServiceList();
  }

  CreateMyForm() {
    return this._formbuilder.group({
      labPatientId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      regDate: [new Date()],
      regTime: [],
      unitId: this.accountService.currentUserValue.user.unitId,
      prefixId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      firstName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$")]],
      middleName: ['', [Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$"), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      lastName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$")]],
      genderId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      dateofBirth: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      ageYear: ['', [Validators.maxLength(3), Validators.pattern("^[0-9]*$")]],
      ageMonth: ['', [Validators.pattern("^[0-9]*$")]],
      ageDay: ['', [Validators.pattern("^[0-9]*$")]],
      address: ['', [Validators.maxLength(100), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      cityId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      stateId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      countryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      patientTypeId: [1],
      tariffId: [1], // need to ask sir what value to pass
      classId: [1],
      departmentId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      doctorId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      refDocId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

      tLabTestRequests: this._formbuilder.array([]),

      // extra fields
      mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      regId: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      IsPathRad: ['1'],
      ServiceId: [''],
      totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      totalDiscountPer: [0, [Validators.min(0), Validators.max(100), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      discountAmt: [0, [Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      paymentType: ['CashPay'],
      patientName: [''],

    })
  }

  createLabTestReqArrayForm(element: any = {}): FormGroup {
    debugger
    return this._formbuilder.group({
      labTestRequestId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      labPatientId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      labServiceId: [element.ServiceId],
      price: [element.Price],
      qty: [0],
      totalAmount: [0],
      discountAmount: [0],
      netAmount: [0],
      paidAmount: [0],
    });
  }
  get labTestArray(): FormArray {
    return this.myForm.get('tLabTestRequests') as FormArray;
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getSelectedObjextPatient(event: any): void {
    console.log("Patient Data:", event);

    if (event) {
      const fullName = event.patientName?.trim() || '';
      const nameParts = fullName.split(' ');

      const firstName = nameParts[0] || '';
      // const middleName = nameParts[1] || '';
      const lastName = nameParts[1] || '';
      this.myForm.patchValue({
        // firstName: firstName,
        // middleName: middleName,
        lastName: lastName,
        mobileNo: event.extMobileNo ?? '',
      });

      // this.myForm.get('mobileNo').setValue(event)
      this.selectedPatient = event;
    }
    const extAddressNameElement = document.querySelector(`[name='middleName']`) as HTMLElement;
    if (extAddressNameElement) {
      extAddressNameElement.focus();
    }
  }

  getSelectedObjextMobile(event) {
    console.log("Mobile Data:", event)
    if (event) {
      this.myForm.get('firstName').setValue(event)

      const fullName = event.patientName?.trim() || '';
      const nameParts = fullName.split(' ');

      const firstName = nameParts[0] || '';
      // const middleName = nameParts[1] || '';
      const lastName = nameParts[1] || '';
      this.myForm.patchValue({
        // firstName: firstName,
        // middleName: middleName,
        lastName: lastName,
      });
    }
    this.selectedMobile = event
    const extAddressNameElement = document.querySelector(`[name='address']`) as HTMLElement;
    if (extAddressNameElement) {
      extAddressNameElement.focus();
    }
  }

  // called this fun becasue externel api only provide minimum data so i cant featch in field
  getSelectedObj(obj) {
    this.RegId = obj.value;
    if ((obj.value ?? 0) > 0) {
      setTimeout(() => {
        this._labPatientRegService.getRegistraionById(obj.value).subscribe((response) => {
          this.registerObj = response;
          console.log("Searched data:", this.registerObj)
        });
      }, 500);
    }
  }

  getServiceList() {
    let ServiceName = this.myForm.get("ServiceId").value + "%" || "%";
    let IsPathRad = this.myForm.get("IsPathRad").value || "1"
    // if (this.vRegNo) {
    var param = {
      "first": 0,
      "rows": 10,
      "sortField": "ServiceId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "ServiceName",
          "fieldValue": ServiceName,
          "opType": "Equals"
        },
        {
          "fieldName": "TariffId",
          "fieldValue": String(this.vTariffId),
          "opType": "Equals"
        },
        {
          "fieldName": "IsPathRad",
          "fieldValue": String(IsPathRad),
          "opType": "Equals"
        },
        {
          "fieldName": "ClassId",
          "fieldValue": String(this.vClassId),
          "opType": "Equals"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }

    this._labPatientRegService.getserviceList(param).subscribe(Menu => {

      this.dsLabRequest2.data = Menu.data as LabRequest[];
      this.dsLabRequest2.sort = this.sort;
      this.dsLabRequest2.paginator = this.paginator;
      // console.log(this.dsLabRequest2.data)
    });
    // } else {
    //   if (!this.myForm.get('regId')?.value && !this.vRegId) {
    //     this.toastr.warning('Please Select Patient', 'Warning!', {
    //       toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    //   }
    // }
  }

  onSaveEntry(row) {
    let doctorid = 0;
    const formValue = this.myForm.value
    if (this.isDoctor) {
      if ((formValue.doctorId == '' || formValue.doctorId == null || formValue.doctorId == '0')) {
        this.toastr.warning('Please select Doctor', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if (formValue.doctorId)
        doctorid = this.myForm.get("doctorId")?.value ?? 0;
    }

    this.dstable1.data = [];
    if (this.chargeslist && this.chargeslist.length > 0) {
      let duplicateItem = this.chargeslist.filter((ele, index) => ele.ServiceId === row.serviceId);
      if (duplicateItem && duplicateItem.length == 0) {
        this.addChargList(row);
        return;
      }

      this.dstable1.data = this.chargeslist;
      this.dstable1.sort = this.sort;
      this.dstable1.paginator = this.paginator;
    } else if (this.chargeslist && this.chargeslist.length == 0) {
      this.addChargList(row);
    }
    else {
      this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }

  addChargList(row) {
    this.chargeslist.push(
      {
        ServiceId: row.serviceId,
        ServiceName: row.serviceName,
        Price: row.price || 0
      });

    console.log(this.chargeslist);
    this.updateCalculation();
    this.dstable1.data = this.chargeslist;
    this.dstable1.sort = this.sort;
    this.dstable1.paginator = this.paginator;
  }

  updateCalculation() {
    // debugger
    const total = this.chargeslist.reduce((sum, item) => sum + (item.Price || 0), 0);
    const discPer = Number(this.myForm.get('totalDiscountPer')?.value) || 0;

    const discountAmt = (total * discPer) / 100;
    const netAmt = total - discountAmt;

    this.myForm.patchValue({
      totalAmt: total,
      discountAmt: discountAmt,
      netPayableAmt: netAmt
    });
  }

  deleteTableRow(element) {
    this.chargeslist = this.dstable1.data;
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dstable1.data = [];
      this.dstable1.data = this.chargeslist;

      if (this.chargeslist.length === 0) {
        this.myForm.patchValue({
          totalAmt: 0,
          totalDiscountPer: 0,
          discountAmt: 0,
          netPayableAmt: 0
        });
      } else {
        this.updateCalculation();
      }
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  chkChange() {
    if (this.registerObj.dateOfBirth > this.minDate) {
      this.toastr.warning('Enter Proper Birth Date', 'warning !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    }
  }

  onChangePrefix(e) {
    this.ddlGender.SetSelection(e.sexId);
  }

  onChangecity(e) {
    this.CityName = e.cityName
    this.registerObj.stateId = e.stateId
    this._labPatientRegService.getstateId(e.stateId).subscribe((Response) => {
      this.ddlState.SetSelection(Response.stateId)
      this.ddlCountry.SetSelection(Response.countryId);
    });
  }

  selectChangedepartment(obj: any) {
    if (obj.value) {
      this._labPatientRegService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
        this.ddlDoctor.options = data;
        this.ddlDoctor.bindGridAutoComplete();
      });
    }
    else {
      this._labPatientRegService.getDoctorsByDepartment(obj.departmentId).subscribe((data: any) => {
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

  allowOnlyDigits(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only digits (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    // Prevent entering more than 10 digits
    const input = event.target as HTMLInputElement;
    if (input.value.length >= 10) {
      event.preventDefault();
      return false;
    }
    return true;
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

  onNewSave() {
    const formattedDate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd");
    const formattedTime = formattedDate + this.dateTimeObj.time;

    this.myForm.get('regDate').setValue(formattedDate);
    this.myForm.get('regTime').setValue(formattedTime);

    if (this.selectedPatient) {
      const fullName = this.selectedPatient.patientName?.trim() || '';
      const nameParts = fullName.split(' ');

      const firstNameControl = this.myForm.get('patientName');
      const lastNameControl = this.myForm.get('lastName');
      const mobileControl = this.myForm.get('mobileNo');

      if (this.myForm.get('patientName')) {
        // debugger
        const firstName = fullName.split(' ')[0] || '';
        this.myForm.get('firstName').setValue(firstName)
      }
      if (!lastNameControl?.value) {
        const lastName = nameParts.slice(1).join(' ');
        lastNameControl?.setValue(lastName || '');
      }
      if (!mobileControl?.value) {
        mobileControl?.setValue(this.selectedPatient.extMobileNo || '');
      }
    }else{
      this.myForm.get('firstName').setValue(this.myForm.get('patientName').value)
    }

    console.log(this.myForm.value)

    if (!this.myForm.invalid) {
      debugger
      let DateOfBirth1 = this.myForm.get('dateofBirth')?.value;
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
        this.myForm.get('ageYear')?.setValue(String(ageYear), { emitEvent: false });
        this.myForm.get('ageMonth')?.setValue(String(ageMonth), { emitEvent: false });
        this.myForm.get('ageDay')?.setValue(String(ageDay), { emitEvent: false });
      }

      this.labTestArray.clear();
      if (this.dstable1.data.length === 0) {
        this.toastr.warning('Data is not available in list ,please add data in the list.', 'Warning');
        return;
      }
      this.dstable1.data.forEach(item => {
        this.labTestArray.push(this.createLabTestReqArrayForm(item));
      });

      const formValue = { ...this.myForm.value };
      const controlsToRemove = ['patientName','mobileNo', 'regId', 'IsPathRad', 'ServiceId', 'totalAmt', 'totalDiscountPer', 'discountAmt', 'netPayableAmt', 'paymentType'];
      controlsToRemove.forEach(key => delete formValue[key]);

      console.log(formValue)
      this._labPatientRegService.labPatientSave(formValue).subscribe((response) => {
        // this.OnPrint(response)
        this.onClose();
      });
    } else {
      let invalidFields: string[] = [];

      const validateFormGroup = (formGroup: FormGroup | FormArray, parentKey: string = '') => {
        Object.keys(formGroup.controls).forEach(key => {
          const control = formGroup.get(key);
          const fieldKey = parentKey ? `${parentKey}.${key}` : key;

          if (control instanceof FormGroup || control instanceof FormArray) {
            validateFormGroup(control, fieldKey);
          } else {
            if (control?.invalid) {
              invalidFields.push(fieldKey);
            }
          }
        });
      };

      validateFormGroup(this.myForm);

      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Please check this field "${field}"`, 'Warning!');
        });
        return;
      }
    }
  }

  onClose() {
    this.myForm.reset();
    this.dialogRef.close();
  }
}
