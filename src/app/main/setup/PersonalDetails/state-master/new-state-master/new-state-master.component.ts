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
  isActive:boolean=true;
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
      console.log(this.data)
    if(this.data.stateId > 0){
      this.isActive=this.data.isActive;
      this.stateForm.patchValue(this.data);
}
    else{
      this.stateForm.reset();
      this.stateForm.get('isActive').setValue(1);

    }
  }

  saveflag : boolean = false;
  onSubmit() {
    if(!this.stateForm.invalid)
        {
        this.saveflag = true;
        console.log(this.stateForm.value)
          this._StateMasterService.stateMasterSave(this.stateForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
      else
      {
        this.toastr.warning('please check from is invalid', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
      }

    }
      
  

  getValidationMessages() {
    return {
      countryId: [
            { name: "required", Message: "Country Name is required" }
        ],
        stateName: [
          { name: "required", Message: "State Name is required" },
          { name: "maxlength", Message: "Religion name should not be greater than 50 char." },
          { name: "pattern", Message: "Only char allowed." }
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