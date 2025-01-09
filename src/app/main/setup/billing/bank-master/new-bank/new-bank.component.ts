import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BankMasterService } from '../bank-master.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-bank',
  templateUrl: './new-bank.component.html',
  styleUrls: ['./new-bank.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewBankComponent implements OnInit {

  
  bankForm: FormGroup;
  isActive:boolean=true;
  saveflag : boolean = false;

  constructor(
    public _BankMasterService: BankMasterService,
    public dialogRef: MatDialogRef<NewBankComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }

    ngOnInit(): void {
    this.bankForm=this._BankMasterService.createBankForm();
        if(this.data){
            this.isActive=this.data.isActive
            this.bankForm.patchValue(this.data);
        }
    }

  onSubmit(){
    
      if(!this.bankForm.invalid){
        
        this.saveflag = true;
   
        console.log("bank json:", this.bankForm.value);

        this._BankMasterService.bankMasterSave(this.bankForm.value).subscribe((response)=>{
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
                { name: "maxlength", Message: "Bank Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        }
    }

 
}