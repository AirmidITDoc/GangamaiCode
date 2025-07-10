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
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewEmergencyComponent>,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private commonService: PrintserviceService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.myForm = this._EmergencyService.CreateMyForm();
    this.myForm.markAllAsTouched();
    this.searchFormGroup = this.createSearchForm();
  }

   createSearchForm() {
    return this.formBuilder.group({
      RegId: [],
    });
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

    getSelectedObj(obj) {
    console.log(obj)
    this.RegId = obj.value;
    if ((obj.value ?? 0) > 0) {

      console.log(this.data)
      setTimeout(() => {
        this._EmergencyService.getRegistraionById(obj.value).subscribe((response) => {
          this.registerObj = response;
          console.log(this.registerObj)
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
      console.log(Response)
      this.ddlCountry.SetSelection(Response.countryId);
    });
  }

   selectChangedepartment(obj: any) {
    this._EmergencyService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
      this.ddlDoctor.options = data;
      this.ddlDoctor.bindGridAutoComplete();
    });
  }

  onNewSave(){

  }

  onClose(){

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
