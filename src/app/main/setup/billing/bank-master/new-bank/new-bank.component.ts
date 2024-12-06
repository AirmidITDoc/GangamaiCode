import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BankMasterService } from '../bank-master.service';

@Component({
  selector: 'app-new-bank',
  templateUrl: './new-bank.component.html',
  styleUrls: ['./new-bank.component.scss']
})
export class NewBankComponent implements OnInit {

  bankForm: FormGroup;

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
     isDeleted: JSON.stringify(this.data?.isActive),
    };
    this.bankForm.patchValue(m_data);
    console.log("mdata:", m_data)
  }

  onSubmit(){
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

  // onSubmit() {
    // if (this._bankService.myform.valid) {
    //     if (!this._bankService.myform.get("BankId").value) {
    //         var m_data = {
    //             bankMasterInsert: {
    //                 bankName: this._bankService.myform
    //                     .get("BankName")
    //                     .value.trim(),
    //                 isDeleted: JSON.parse(
    //                     this._bankService.myform.get("IsDeleted").value
    //                 ),
    //                 addedBy: 1,
    //             },
    //         };

    //         console.log(m_data);
    //         this._bankService.bankMasterInsert(m_data).subscribe((data) => {
    //             this.msg = data;
    //             if (data) {
    //                 this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //                     toastClass: 'tostr-tost custom-toast-success',
    //                   });
    //                   this.getBankMasterList();
    //                 // Swal.fire(
    //                 //     "Saved !",
    //                 //     "Record saved Successfully !",
    //                 //     "success"
    //                 // ).then((result) => {
    //                 //     if (result.isConfirmed) {
    //                 //         this.getBankMasterList();
    //                 //     }
    //                 // });
    //             } else {
    //                 this.toastr.error('Bank Master Data not saved !, Please check API error..', 'Error !', {
    //                     toastClass: 'tostr-tost custom-toast-error',
    //                   });
    //             }
    //             this.getBankMasterList();
    //         },error => {
    //             this.toastr.error('Bank Master Data not saved !, Please check API error..', 'Error !', {
    //              toastClass: 'tostr-tost custom-toast-error',
    //            });
    //          });
    //     } else {
    //         var m_dataUpdate = {
    //             bankMasterUpdate: {
    //                 bankID: this._bankService.myform.get("BankId").value,
    //                 bankName:
    //                     this._bankService.myform.get("BankName").value,
    //                 isDeleted: JSON.parse(
    //                     this._bankService.myform.get("IsDeleted").value
    //                 ),
    //                 updatedBy: 1,
    //             },
    //         };
    //         console.log(m_dataUpdate);
    //         this._bankService
    //             .bankMasterUpdate(m_dataUpdate)
    //             .subscribe((data) => {
    //                 this.msg = data;
    //                 if (data) {
    //                     this.toastr.success('Record updated Successfully.', 'updated !', {
    //                         toastClass: 'tostr-tost custom-toast-success',
    //                       });
    //                     this.getBankMasterList();
                       
    //                 } else {
    //                     Swal.fire(
    //                         "Error !",
    //                         "Appoinment not updated",
    //                         "error"
    //                     );
    //                 }
    //                 this.getBankMasterList();
    //             });
    //     }
    //     this.onClear();
    // }
// }
}
