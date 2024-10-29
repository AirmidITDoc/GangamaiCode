import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-bank',
  templateUrl: './new-bank.component.html',
  styleUrls: ['./new-bank.component.scss']
})
export class NewBankComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  onSubmit() {
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
}
}
