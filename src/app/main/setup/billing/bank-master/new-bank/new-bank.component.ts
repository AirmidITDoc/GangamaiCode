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
  format="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').slice(0, 10);";
  format1="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').slice(0, 12);";
  maxLength1="10"
  minLength1="10"
   maxLength="12"
  minLength="12"
  value="true"
  constructor(
    public _BankMasterService: BankMasterService,
    public dialogRef: MatDialogRef<NewBankComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.bankForm=this._BankMasterService.createBankForm();
    
    var m_data = {
      bankId: this.data?.bankId,
     bankName: this.data?.bankName.trim(),
     isActive: JSON.stringify(this.data?.isActive),
    };
    this.bankForm.patchValue(m_data);
    console.log("mdata:", m_data)
  }

  onSubmit(){
    console.log(this.bankForm.get("isActive").value)
    if (this.bankForm.invalid) {
      this.toastr.warning('please check from is invalid', 'Warning !', {
        toastClass:'tostr-tost custom-toast-warning',
    })
    return;
    }else{
      if(!this.bankForm.get("bankId").value){
        debugger
        var mdata=
        {
          "bankId": 0,
          "bankName": this.bankForm.get("bankName").value || ""
        }
        console.log("bank json:", mdata);

        this._BankMasterService.bankMasterSave(mdata).subscribe((response)=>{
          this.toastr.success(response.message);
          this.onClear(true);
        }, (error)=>{
          this.toastr.error(error.message);
        });
      } else{
        //update
      }
    }
    
  }

  onClear(val: boolean) {
    this.bankForm.reset();
    this.dialogRef.close(val);
}

 
}