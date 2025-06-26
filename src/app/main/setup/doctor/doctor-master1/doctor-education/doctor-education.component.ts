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
EducationForm:FormGroup
 autocompleteModecountry: string = "Country";
 autocompleteModecity: string = "City";

 registerObj = new EducationDetail({})

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
   }


    createEducationForm() {
      return this.formBuilder.group({
  
        doctorId:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        educationId:[0],
        Qualification: ['', [
          Validators.required]],
        ShortName: ['', [
          Validators.required]],
        PassingYear: [(new Date()).toISOString()],
        InstitutionName: ['', [
          Validators.required]],
        City: ['', [
          Validators.required]],
        CountryId: ['', [
          Validators.required]],
            
  
      });
    }

selectedYear: any;

  chosenYearHandler(normalizedYear: Date, datepicker: any) {
    this.selectedYear = this.datePipe.transform(new Date(normalizedYear.getFullYear(), 0, 1),'dd/MM/yyyy')
    datepicker.close();
  }
  onSubmit(){

  }

  getValidationMessages(){
     return {
    countryId:[],
    City:[],

    };
  }
  onClose(){ this.dialogRef.close()}
}
            
export class EducationDetail {
  educationId: any;
  Qualification:any;
  ShortName: any;
  PassingYear: any;
  InstitutionName: any;
  city: any;
  countryId: any;
  
  /**
   * Constructor
   *
   * @param RegInsert
   */

  constructor(EducationDetail) {
    {
      this.educationId = EducationDetail.educationId || 0;
        this.Qualification = EducationDetail.Qualification || '';
      this.ShortName = EducationDetail.ShortName || '';
      this.PassingYear = EducationDetail.PassingYear || '';
      this.InstitutionName = EducationDetail.InstitutionName || '';
      this.city = EducationDetail.city || '';
      this.countryId = EducationDetail.countryId || '';
     
    }
  }
}