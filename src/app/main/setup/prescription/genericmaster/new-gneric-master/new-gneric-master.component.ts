import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-gneric-master',
  templateUrl: './new-gneric-master.component.html',
  styleUrls: ['./new-gneric-master.component.scss']
})
export class NewGnericMasterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
//   onSubmit() {
//     if (this._GenericService.myForm.valid) {
//         if (!this._GenericService.myForm.get("GenericId").value) {
//             var m_data = {
//                 insertGenericMaster: {
//                     genericName: this._GenericService.myForm
//                         .get("GenericName")
//                         .value.trim(),
//                     isActive: Boolean(
//                         JSON.parse(
//                             this._GenericService.myForm.get("IsDeleted")
//                                 .value
//                         )
//                     ),
//                     // addedBy: 1,
//                 },
//             };
//             this._GenericService
//                 .insertGenericMaster(m_data)
//                 .subscribe((data) => {
//                     this.msg = m_data;
//                     if (data) {
//                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
//                         this.getGenericMasterList();
//                         // Swal.fire(
//                         //     "Saved !",
//                         //     "Record saved Successfully !",
//                         //     "success"
//                         // ).then((result) => {
//                         //     if (result.isConfirmed) {
//                         //         this.getGenericMasterList();
//                         //     }
//                         // });
//                     } else {
//                         this.toastr.error('Generic Master Data not saved !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
//                     }
//                     this.getGenericMasterList();
//                 },error => {
//                     this.toastr.error('Generic Class Data not saved !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  });
//         } else {
//             var m_dataUpdate = {
//                 updateGenericMaster: {
//                     genericId:
//                         this._GenericService.myForm.get("GenericId").value,
//                     genericName: this._GenericService.myForm
//                         .get("GenericName")
//                         .value.trim(),

//                     isActive: Boolean(
//                         JSON.parse(
//                             this._GenericService.myForm.get("IsDeleted")
//                                 .value
//                         )
//                     ),
//                     //  updatedBy: 1,
//                 },
//             };
//             this._GenericService
//                 .updateGenericMaster(m_dataUpdate)
//                 .subscribe((data) => {
//                     this.msg = m_dataUpdate;
//                     if (data) {
//                         this.toastr.success('Record updated Successfully.', 'updated !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
//                         this.getGenericMasterList();
//                         // Swal.fire(
//                         //     "Updated !",
//                         //     "Record updated Successfully !",
//                         //     "success"
//                         // ).then((result) => {
//                         //     if (result.isConfirmed) {
//                         //         this.getGenericMasterList();
//                         //     }
//                         // });
//                     } else {
//                         this.toastr.error('Generic Master Data not updated !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
//                     }
//                     this.getGenericMasterList();
//                 },error => {
//                     this.toastr.error('Generic Class Data not updated !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  });
//         }
//         this.onClear();
//     }
// }
}
