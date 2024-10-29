import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-subgroup',
  templateUrl: './new-subgroup.component.html',
  styleUrls: ['./new-subgroup.component.scss']
})
export class NewSubgroupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    // if (this._subgroupService.myform.valid) {
    //     if (!this._subgroupService.myform.get("SubGroupId").value) {
    //         var m_data = {
    //             subGroupMasterInsert: {
    //                 groupId:
    //                     this._subgroupService.myform.get("GroupId").value
    //                         .GroupId,
    //                 subGroupName: this._subgroupService.myform
    //                     .get("SubGroupName")
    //                     .value.trim(),
    //                 addedBy: 1,
    //                 isDeleted: Boolean(
    //                     JSON.parse(
    //                         this._subgroupService.myform.get("IsDeleted")
    //                             .value
    //                     )
    //                 ),
    //             },
    //         };

    //         this._subgroupService
    //             .subGroupMasterInsert(m_data)
    //             .subscribe((data) => {
    //                 this.msg = data;
    //                 if (data) {
    //                     this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //                         toastClass: 'tostr-tost custom-toast-success',
    //                       });
    //                       this.getSubgroupMasterList();
    //                     // Swal.fire(
    //                     //     "Saved !",
    //                     //     "Record saved Successfully !",
    //                     //     "success"
    //                     // ).then((result) => {
    //                     //     if (result.isConfirmed) {
    //                     //         this.getSubgroupMasterList();
    //                     //     }
    //                     // });
    //                 } else {
    //                     this.toastr.error('Sub-Group Master Data not saved !, Please check API error..', 'Error !', {
    //                         toastClass: 'tostr-tost custom-toast-error',
    //                       });
    //                 }
    //                 this.getSubgroupMasterList();
    //             },error => {
    //                 this.toastr.error('Sub-Group Data not saved !, Please check API error..', 'Error !', {
    //                  toastClass: 'tostr-tost custom-toast-error',
    //                });
    //              });
    //     } else {
    //         var m_dataUpdate = {
    //             subGroupMasterUpdate: {
    //                 subGroupID:
    //                     this._subgroupService.myform.get("SubGroupId")
    //                         .value,
    //                 groupId:
    //                     this._subgroupService.myform.get("GroupId").value
    //                         .GroupId,
    //                 subGroupName:
    //                     this._subgroupService.myform.get("SubGroupName")
    //                         .value,

    //                 isDeleted: Boolean(
    //                     JSON.parse(
    //                         this._subgroupService.myform.get("IsDeleted")
    //                             .value
    //                     )
    //                 ),
    //                 updatedBy: 1,
    //             },
    //         };

    //         this._subgroupService
    //             .subGroupMasterUpdate(m_dataUpdate)
    //             .subscribe((data) => {
    //                 this.msg = data;
    //                 if (data) {
    //                     this.toastr.success('Record updated Successfully.', 'updated !', {
    //                         toastClass: 'tostr-tost custom-toast-success',
    //                       });
    //                     this.getSubgroupMasterList();
    //                     // Swal.fire(
    //                     //     "Updated !",
    //                     //     "Record updated Successfully !",
    //                     //     "success"
    //                     // ).then((result) => {
    //                     //     if (result.isConfirmed) {
    //                     //         this.getSubgroupMasterList();
    //                     //     }
    //                     // });
    //                 } else {
    //                     this.toastr.error('Sub-Group Master Data not updated !, Please check API error..', 'Error !', {
    //                         toastClass: 'tostr-tost custom-toast-error',
    //                       });
    //                 }
    //                 this.getSubgroupMasterList();
    //             },error => {
    //                 this.toastr.error('Sub-Group Data not Updated !, Please check API error..', 'Error !', {
    //                  toastClass: 'tostr-tost custom-toast-error',
    //                });
    //              });
    //     }
    //     this.onClear();
    // }
}

}
