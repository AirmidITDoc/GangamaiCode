import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-cash-counter',
  templateUrl: './new-cash-counter.component.html',
  styleUrls: ['./new-cash-counter.component.scss']
})
export class NewCashCounterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  onSubmit() {
    // if (this._cashcounterService.myform.valid) {
    //     if (!this._cashcounterService.myform.get("CashCounterId").value) {
    //         var m_data = {
    //             cashCounterMasterInsert: {
    //                 cashCounter: this._cashcounterService.myform
    //                     .get("CashCounterName")
    //                     .value.trim(),
    //                 prefix: this._cashcounterService.myform
    //                     .get("Prefix")
    //                     .value.trim(),
    //                 billNo: this._cashcounterService.myform
    //                     .get("BillNo")
    //                     .value.trim(),
    //                 //  addedBy: 1,
    //                 isActive: Boolean(
    //                     JSON.parse(
    //                         this._cashcounterService.myform.get("IsDeleted")
    //                             .value
    //                     )
    //                 ),
    //             },
    //         };
    //         this._cashcounterService
    //             .cashCounterMasterInsert(m_data)
    //             .subscribe((response) => {
    //                 this.msg = response;
    //                 if (response) {
    //                     this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //                         toastClass: 'tostr-tost custom-toast-success',
    //                       });
    //                       this.getCashcounterMasterList();
    //                     // Swal.fire(
    //                     //     "Saved !",
    //                     //     "Record saved Successfully !",
    //                     //     "success"
    //                     // ).then((result) => {
    //                     //     if (result.isConfirmed) {
    //                     //         this.getCashcounterMasterList();
    //                     //     }
    //                     // });
    //                 } else {
    //                     this.toastr.error('Cash-Counter Master Data not saved !, Please check API error..', 'Error !', {
    //                         toastClass: 'tostr-tost custom-toast-error',
    //                       });
    //                 }
    //             },error => {
    //                 this.toastr.error('Cash-Counter Master Data not saved !, Please check API error..', 'Error !', {
    //                  toastClass: 'tostr-tost custom-toast-error',
    //                });
    //              });
    //     } else {
    //         var m_dataUpdate = {
    //             cashCounterMasterUpdate: {
    //                 cashCounterId:
    //                     this._cashcounterService.myform.get("CashCounterId")
    //                         .value,
    //                 cashCounter:
    //                     this._cashcounterService.myform.get(
    //                         "CashCounterName"
    //                     ).value,

    //                 isActive: Boolean(
    //                     JSON.parse(
    //                         this._cashcounterService.myform.get("IsDeleted")
    //                             .value
    //                     )
    //                 ),
    //             },
    //         };

    //         this._cashcounterService
    //             .cashCounterMasterUpdate(m_dataUpdate)
    //             .subscribe((data) => {
    //                 this.msg = data;
    //                 if (data) {
    //                     this.toastr.success('Record updated Successfully.', 'updated !', {
    //                         toastClass: 'tostr-tost custom-toast-success',
    //                       });
    //                     this.getCashcounterMasterList();
    //                     // Swal.fire(
    //                     //     "Updated !",
    //                     //     "Record updated Successfully !",
    //                     //     "success"
    //                     // ).then((result) => {
    //                     //     if (result.isConfirmed) {
    //                     //         this.getCashcounterMasterList();
    //                     //     }
    //                     // });
    //                 } else {
    //                     this.toastr.error('Cash-Counter Master Data not updated !, Please check API error..', 'Error !', {
    //                         toastClass: 'tostr-tost custom-toast-error',
    //                       });
    //                 }
    //                 this.getCashcounterMasterList();
    //             },error => {
    //                 this.toastr.error('Cash-Counter Master Data not updated !, Please check API error..', 'Error !', {
    //                  toastClass: 'tostr-tost custom-toast-error',
    //                });
    //              });
    //     }
    //     this.onClear();
    // }
}
}
