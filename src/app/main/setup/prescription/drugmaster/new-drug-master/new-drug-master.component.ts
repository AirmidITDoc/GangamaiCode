import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-drug-master',
  templateUrl: './new-drug-master.component.html',
  styleUrls: ['./new-drug-master.component.scss']
})
export class NewDrugMasterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // this.getGenericNameCombobox();
    // this.getClassNameCombobox();

  }
//   onSubmit() {
//     if (this._drugService.myform.valid) {
//         if (!this._drugService.myform.get("DrugId").value) {
//             var m_data = {
//                 insertDrugMaster: {
//                     drugName: this._drugService.myform
//                         .get("DrugName")
//                         .value.trim(),
//                     genericId:
//                         this._drugService.myform.get("GenericId").value
//                             .GenericId,
//                     classId:
//                         this._drugService.myform.get("ClassId").value
//                             .ClassId,
//                     isActive: Boolean(
//                         JSON.parse(
//                             this._drugService.myform.get("IsDeleted").value
//                         )
//                     ),
//                     // addedBy: 1,
//                 },
//             };

//             this._drugService.insertDrugMaster(m_data).subscribe((data) => {
//                 this.msg = data;
//                 console.log(this.msg);
//                 if (data) {
//                     this.toastr.success('Record Saved Successfully.', 'Saved !', {
//                         toastClass: 'tostr-tost custom-toast-success',
//                       });
//                     this.getDrugMasterList();
//                     // Swal.fire(
//                     //     "Saved !",
//                     //     "Record saved Successfully !",
//                     //     "success"
//                     // ).then((result) => {
//                     //     if (result.isConfirmed) {
//                     //         this.getDrugMasterList();
//                     //     }
//                     // });
//                 } else {
//                     this.toastr.error('Drug Master Data not saved !, Please check API error..', 'Error !', {
//                         toastClass: 'tostr-tost custom-toast-error',
//                       });
//                     }
//                 this.getDrugMasterList();
//             },error => {
//                 this.toastr.error('Drug Class Data not saved !, Please check API error..', 'Error !', {
//                  toastClass: 'tostr-tost custom-toast-error',
//                });
//              });
//         } else {
//             var m_dataUpdate = {
//                 updateDrugMaster: {
//                     drugId: this._drugService.myform.get("DrugId").value,
//                     drugName:
//                         this._drugService.myform.get("DrugName").value,
//                     genericId:
//                         this._drugService.myform.get("GenericId").value
//                             .GenericId,
//                     classId:
//                         this._drugService.myform.get("ClassId").value
//                             .ClassId,
//                     isActive: Boolean(
//                         JSON.parse(
//                             this._drugService.myform.get("IsDeleted").value
//                         )
//                     ),
//                     //  updatedBy: 1,
//                 },
//             };
//             this._drugService
//                 .updateDrugMaster(m_dataUpdate)
//                 .subscribe((data) => {
//                     this.msg = data;
//                     if (data) {
//                         this.toastr.success('Record updated Successfully.', 'updated !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
//                         this.getDrugMasterList();
//                         // Swal.fire(
//                         //     "Updated !",
//                         //     "Record updated Successfully !",
//                         //     "success"
//                         // ).then((result) => {
//                         //     if (result.isConfirmed) {
//                         //         this.getDrugMasterList();
//                         //     }
//                         // });
//                     } else {
//                         this.toastr.error('Drug Master Data not updated !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
//                     }
//                     this.getDrugMasterList();
//                 },error => {
//                     this.toastr.error('Drug Class Data not updated !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  });
//         }
//         this.onClear();
//     }
// }
}
