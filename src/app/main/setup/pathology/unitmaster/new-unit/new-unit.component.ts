import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-unit',
  templateUrl: './new-unit.component.html',
  styleUrls: ['./new-unit.component.scss']
})
export class NewUnitComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
//   onSubmit() {
//     if (this._unitmasterService.myform.valid) {
//         if (!this._unitmasterService.myform.get("UnitId").value) {
//             var m_data = {
//                 insertUnitMaster: {
//                     unitName: this._unitmasterService.myform
//                         .get("UnitName")
//                         .value.trim(),
//                     isDeleted: Boolean(
//                         JSON.parse(
//                             this._unitmasterService.myform.get("IsDeleted")
//                                 .value
//                         )
//                     ),
//                     addedBy: this.accountService.currentUserValue.user.id,
//                 },
//             };

//             this._unitmasterService
//                 .insertUnitMaster(m_data)
//                 .subscribe((data) => {
//                     this.msg = data;
//                     if (data) {
//                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                         });
//                         this.getUnitMasterList();
//                     } else {
//                         this.toastr.error('Unit Master Data not saved !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                         });
//                     }
//                     this.getUnitMasterList();
//                 }, error => {
//                     this.toastr.error('Unit not saved !, Please check API error..', 'Error !', {
//                         toastClass: 'tostr-tost custom-toast-error',
//                     });
//                 });
//         } else {
//             var m_dataUpdate = {
//                 updateUnitMaster: {
//                     unitId: this._unitmasterService.myform.get("UnitId")
//                         .value,
//                     unitName:
//                         this._unitmasterService.myform.get("UnitName")
//                             .value,
//                     isDeleted: Boolean(
//                         JSON.parse(
//                             this._unitmasterService.myform.get("IsDeleted")
//                                 .value
//                         )
//                     ),
//                     updatedBy:this.accountService.currentUserValue.user.id,
//                 },
//             };
//             this._unitmasterService
//                 .updateUnitMaster(m_dataUpdate)
//                 .subscribe((data) => {
//                     this.msg = data;
//                     if (data) {
//                         this.toastr.success('Record updated Successfully.', 'updated !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                         });
//                         this.getUnitMasterList();
//                     } else {
//                         this.toastr.error('Unit Master Data not updated !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                         });
//                     }
//                     this.getUnitMasterList();
//                 }, error => {
//                     this.toastr.error('Unit not updated !, Please check API error..', 'Error !', {
//                         toastClass: 'tostr-tost custom-toast-error',
//                     });
//                 });
//         }
//         this.onClear();
//     }
// }
}
