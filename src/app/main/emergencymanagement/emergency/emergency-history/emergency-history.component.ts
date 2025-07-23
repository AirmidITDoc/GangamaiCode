import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { EmergencyService } from '../emergency.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { EmergencyList } from '../emergency.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-emergency-history',
  templateUrl: './emergency-history.component.html',
  styleUrls: ['./emergency-history.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EmergencyHistoryComponent {
  screenFromString = 'Common-form';
  dateTimeObj: any;
  registerObj = new EmergencyList({});
  historyForm: FormGroup

  constructor(
      public _EmergencyService: EmergencyService,
      private _loggedService: AuthenticationService,
      public datePipe: DatePipe,
      public _matDialog: MatDialog,
      public dialogRef: MatDialogRef<EmergencyHistoryComponent>,      
      public toastr: ToastrService,   
      private _FormvalidationserviceService: FormvalidationserviceService,
      public _frombuilder: UntypedFormBuilder,            
      @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
  
    ngOnInit(): void {
      this.historyForm=this.CreateMyForm()
      if(this.data){
        this.registerObj=this.data
        console.log("Data:",this.registerObj)
      }
      // this._EmergencyService.getEmergencyById(this.data.emgId).subscribe((res) => {
      //   this.registerObj = res;
      //   console.log(this.registerObj)
      // });
    }

    CreateMyForm() {
        return this._frombuilder.group({
          clinicalHistory: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$")]],
          PatientName: ['', [Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$"),this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        })
      }

    getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

onSave(){
  
}

  onClose(){
    this.historyForm.reset();
    this.dialogRef.close();
  }
}
