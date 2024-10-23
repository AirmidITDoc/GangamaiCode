import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-location',
  templateUrl: './new-location.component.html',
  styleUrls: ['./new-location.component.scss']
})
export class NewLocationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
//   onSubmit() {
//     if (this._locationService.myform.valid) {
//         if (!this._locationService.myform.get("LocationId").value) {
//             var m_data = {
//                 locationMasterInsert: {
//                     locatioName_1: this._locationService.myform
//                         .get("LocationName")
//                         .value.trim(),
//                     //  addedBy: 1,
//                     isActive_2: 1,
//                 },
//             };

//             this._locationService
//                 .locationMasterInsert(m_data)
//                 .subscribe((data) => {
//                     this.msg = data;
//                     if (data) {
//                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
//                           this.getLocationMasterList();
//                         // Swal.fire(
//                         //     "Saved !",
//                         //     "Record saved Successfully !",
//                         //     "success"
//                         // ).then((result) => {
//                         //     if (result.isConfirmed) {
//                         //         this.getLocationMasterList();
//                         //     }
//                         // });
//                     } else {
//                         this.toastr.error('Location Master Data not saved !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
//                     }
//                     this.getLocationMasterList();
//                 },error => {
//                     this.toastr.error('Location Data not saved !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  });
//         } else {
//             var m_dataUpdate = {
//                 locationMasterUpdate: {
//                     locationId_1:
//                         this._locationService.myform.get("LocationId")
//                             .value,
//                     locationName_2: this._locationService.myform
//                         .get("LocationName")
//                         .value.trim(),
//                     isActive_3: 1,
//                     // updatedBy: 1,
//                 },
//             };

//             this._locationService
//                 .locationMasterUpdate(m_dataUpdate)
//                 .subscribe((data) => {
//                     this.msg = data;
//                     if (data) {
//                         this.toastr.success('Record updated Successfully.', 'updated !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
//                           this.getLocationMasterList();
//                         // Swal.fire(
//                         //     "Updated !",
//                         //     "Record updated Successfully !",
//                         //     "success"
//                         // ).then((result) => {
//                         //     if (result.isConfirmed) {
//                         //         this.getLocationMasterList();
//                         //     }
//                         // });
//                     } else {
//                         this.toastr.error('Location Master Data not Updated !, Please check API error..', 'Updated !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
//                     }
//                     this.getLocationMasterList();
//                 },error => {
//                     this.toastr.error('Location Data not Updated !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  });
//         }
//         this.onClear();
//     }
// }
}
