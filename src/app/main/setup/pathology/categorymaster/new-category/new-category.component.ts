import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss']
})
export class NewCategoryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

//   onSubmit() {
//     if (this._categorymasterService.myform.valid) {
//         if (!this._categorymasterService.myform.get("CategoryId").value) {
//             var m_data = {
//                 insertPathologyCategoryMaster: {
//                     categoryName: this._categorymasterService.myform.get("CategoryName").value.trim(),
//                     isDeleted: Boolean(JSON.parse(this._categorymasterService.myform.get("IsDeleted").value)),
//                     addedBy: this.accountService.currentUserValue.user.id,
//                 },
//             };
//             console.log(m_data)
//             this._categorymasterService.insertPathologyCategoryMaster(m_data)
//                 .subscribe((data) => {
//                     this.msg = data;
//                     if (data) {
//                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                         });
//                         this.getCategoryMasterList();
//                     } else {
//                         this.toastr.error('Category Master Data not saved !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                         });
//                     }
//                     this.getCategoryMasterList();
//                 }, error => {
//                     this.toastr.error('Category not saved !, Please check API error..', 'Error !', {
//                         toastClass: 'tostr-tost custom-toast-error',
//                     });
//                 });
//         } else {

//             var m_dataUpdate = {
//                 updatePathologyCategoryMaster: {
//                     categoryId: this._categorymasterService.myform.get("CategoryId").value,
//                     categoryName: this._categorymasterService.myform.get("CategoryName").value,
//                     isDeleted: Boolean(JSON.parse(this._categorymasterService.myform.get("IsDeleted").value)),
//                     updatedBy: this.accountService.currentUserValue.user.id,
//                 },
//             };
//             console.log(m_dataUpdate)
//             this._categorymasterService.updatePathologyCategoryMaster(m_dataUpdate)
//                 .subscribe((data) => {
//                     this.msg = data;
//                     if (data) {
//                         this.toastr.success('Record updated Successfully.', 'updated !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                         });
//                         this.getCategoryMasterList();
//                     } else {
//                         this.toastr.error('Category Master Data not updated !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                         });
//                     }
//                     this.getCategoryMasterList();
//                 }, error => {
//                     this.toastr.error('Category not updated !, Please check API error..', 'Error !', {
//                         toastClass: 'tostr-tost custom-toast-error',
//                     });
//                 });
//         }
//         this.onClear();
//     }
// }
}
