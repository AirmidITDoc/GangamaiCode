import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TallyInterfaceService } from '../tally-interface.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-tally',
  templateUrl: './new-tally.component.html',
  styleUrls: ['./new-tally.component.scss']
})
export class NewTallyComponent implements OnInit {

  bankForm: FormGroup;
  isActive:boolean=true;
  bankName:any;
  
  constructor(
    public _TallyInterfaceService: TallyInterfaceService,
    public dialogRef: MatDialogRef<NewTallyComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }

  
    ngOnInit(): void {
        debugger
    this.bankForm=this._TallyInterfaceService.createBankForm();
   
        if((this.data?.bankId??0) > 0)
        {
           
            this.isActive=this.data.isActive
            this.data.bankName=this.data.bankName.trim()
          this.bankForm.patchValue(this.data);
            console.log( this.data)
        }
    }

  onSubmit(){
      if(!this.bankForm.invalid){
           
        console.log("bank json:", this.bankForm.value);

        this._TallyInterfaceService.bankMasterSave(this.bankForm.value).subscribe((response)=>{
          this.toastr.success(response.message);
          this.onClear(true);
        }, (error)=>{
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

    onClear(val: boolean) {
        this.bankForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages(){
        return{
          bankName:[
                { name: "required", Message: "Bank Name is required" },
                // { name: "maxlength", Message: "Bank Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        }
    }

 
}