import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { DoctorMasterService } from '../doctor-master.service';
import { DatePipe } from '@angular/common';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-doctor-education',
  templateUrl: './doctor-education.component.html',
  styleUrls: ['./doctor-education.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DoctorEducationComponent {
  EducationForm: FormGroup
  autocompleteModecountry: string = "Country";
  autocompleteModecity: string = "City";
  selectedYear: any;
  registerObj = new EducationDetail({})
  QualifyName: any;
  QualifyId: any;
  InstituteName: any;
  InstituteId: any;
 CityName: any;
  CityId: any;
  CountryName: any;
  CountryId: any;

  autocompleteModeQualifiy: string = "Qualification";
  autocompleteModeInstitute: string = "InstitueName";

  constructor(public _DoctorMasterService: DoctorMasterService,
    private formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<DoctorEducationComponent>,

  ) {
  }

  ngOnInit(): void {
    this.EducationForm = this.createEducationForm();
    this.EducationForm.markAllAsTouched();
    if (this.data) {
      this.registerObj = this.data
    }
  }


  createEducationForm() {
    return this.formBuilder.group({

      doctorId: [0],
      docQualfiId: [0],
      qualificationId: ["", [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      Qualification:[''],
      InstituteName:[''],
      passingYear: [(new Date()).toISOString()],
      institutionNameId: ["", [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      cityId: ["", [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      cityName:[''],
      countryId: ["", [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      countryName:['']  
    });
  }


  getSelectedqualifiObj(obj) {
    console.log(obj)
    this.QualifyName = obj.text;
    this.QualifyId = obj.value;

  }

  getSelectedInstitueObj(obj) {
    console.log(obj)
    this.InstituteName = obj.text;
    this.InstituteId = obj.value;

  }
getSelectedcityObj(obj) {
    console.log(obj)
    this.CityName = obj.text;
    this.CityId = obj.value;

  }

  getSelectedcountryObj(obj) {
    console.log(obj)
    this.CountryName = obj.text;
    this.CountryId = obj.value;

  }


  chosenYearHandler(normalizedYear: Date, datepicker: any) {
    this.selectedYear = this.datePipe.transform(new Date(normalizedYear.getFullYear(), 0, 1), 'dd/MM/yyyy')
    datepicker.close();
  }



  onSubmit() {

    this.EducationForm.get("qualificationId").setValue(this.QualifyId)
    this.EducationForm.get("Qualification").setValue(this.QualifyName)

    this.EducationForm.get("institutionNameId").setValue(this.InstituteId)
    this.EducationForm.get("InstituteName").setValue(this.InstituteName)


      this.EducationForm.get("cityId").setValue(this.CityId)
    this.EducationForm.get("cityName").setValue(this.CityName)

    this.EducationForm.get("countryId").setValue(this.CountryId)
    this.EducationForm.get("countryName").setValue(this.CountryName)




    if (!this.EducationForm.invalid) {
      this.dialogRef.close(this.EducationForm.value)
    } else {
      let invalidFields = [];
      if (this.EducationForm.invalid) {
        for (const controlName in this.EducationForm.controls) {
          if (this.EducationForm.controls[controlName].invalid) { invalidFields.push(`Education Form: ${controlName}`); }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
      }
    }

  }

  getValidationMessages() {
    return {
      countryId: [],
      City: [],

    };
  }

  onClear() {
    this.dialogRef.close()
    this.EducationForm.reset();
  }

  onClose() { this.dialogRef.close() }
}

export class EducationDetail {
  qualificationId: any;
  docQualfiId: any;
  qualification: any;
  // shortName: any;
  passingYear: any;
  institutionNameId: any;
  institutionName: any;
  cityId: any;
  cityName:any;
  countryId: any;
countryName:any;
  /**
   * Constructor
   *
   * @param EducationDetail
   */

  constructor(EducationDetail) {
    {
      this.qualificationId = EducationDetail.qualificationId || 0;
      this.docQualfiId = EducationDetail.docQualfiId || 0;
      this.qualification = EducationDetail.qualification || '';
      // this.shortName = EducationDetail.shortName || '';
      this.passingYear = EducationDetail.passingYear || '';
      this.institutionNameId = EducationDetail.institutionNameId || 0;
      this.institutionName = EducationDetail.institutionName || 0;
      this.cityId = EducationDetail.cityId || 0;
      this.countryId = EducationDetail.countryId || '';
       this.cityName = EducationDetail.cityName || 0;
      this.countryName = EducationDetail.countryName || '';

    }
  }
}