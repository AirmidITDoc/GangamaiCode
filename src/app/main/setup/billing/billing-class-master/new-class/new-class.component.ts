import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BillingClassMasterService } from '../billing-class-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-class',
  templateUrl: './new-class.component.html',
  styleUrls: ['./new-class.component.scss']
})
export class NewClassComponent implements OnInit {

  classForm: FormGroup;
  isActive:boolean=true
  constructor(
      public _BillingClassMasterService: BillingClassMasterService,
      public dialogRef: MatDialogRef<NewClassComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.classForm = this._BillingClassMasterService.createClassForm();
      if(this.data){
        this.isActive=this.data.isActive
         this.classForm.patchValue(this.data);}
      
  }
  onSubmit() {
   
      if (this.classForm.valid) {
        
          this._BillingClassMasterService.classMasterSave(this.classForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }else{
        this.toastr.warning('Please Enter Valid data.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
      }
    }     
  

  onClear(val: boolean) {
      this.classForm.reset();
      this.dialogRef.close(val);
  }
}
