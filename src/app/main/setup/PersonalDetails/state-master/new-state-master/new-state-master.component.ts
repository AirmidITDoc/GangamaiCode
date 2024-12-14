import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StateMasterService } from '../state-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-state-master',
  templateUrl: './new-state-master.component.html',
  styleUrls: ['./new-state-master.component.scss']
})


export class NewStateMasterComponent implements OnInit {

  stateForm: FormGroup;
  constructor(
      public _StateMasterService: StateMasterService,
      public dialogRef: MatDialogRef<NewStateMasterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }

  autocompleteModecountry: string = "State";

  countryId = 0;

  ngOnInit(): void {
      this.stateForm = this._StateMasterService.createStateForm();
      
      var m_data = {
        stateId: this.data?.stateId,
        stateName: this.data?.stateName.trim(),
        countryId: this.data?.countryId || this.countryId ,
        isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.stateForm.patchValue(m_data);
  }

  saveflag : boolean = false;
  onSubmit() {
    this.saveflag = true;
    
    if (this.stateForm.invalid) {
        this.toastr.warning('please check from is invalid', 'Warning !', {
          toastClass:'tostr-tost custom-toast-warning',
      })
      return;
    }else{
      if (this.stateForm.valid) {
          this._StateMasterService.stateMasterSave(this.stateForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
    }  
  }

  getValidationCountryMessages() {
    return {
      countryId: [
            { name: "required", Message: "Country Name is required" }
        ]
    };
}

  selectChangecountry(obj: any){
    console.log(obj);
    this.countryId=obj.value
  }

  onClear(val: boolean) {
      this.stateForm.reset();
      this.dialogRef.close(val);
  }
}