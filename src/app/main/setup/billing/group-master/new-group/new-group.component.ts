import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss']
})
export class NewGroupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  onSubmit() {
    // if (this._groupService.myform.valid) {
    //     if (!this._groupService.myform.get("GroupId").value) {
    //         var m_data = {
    //             groupMasterInsert: {
    //                 groupName: this._groupService.myform
    //                     .get("GroupName")
    //                     .value.trim(),
    //                 isconsolidated: Boolean(
    //                     JSON.parse(
    //                         this._groupService.myform.get("Isconsolidated")
    //                             .value
    //                     )
    //                 ),
    //                 isConsolidatedDR: Boolean(
    //                     JSON.parse(
    //                         this._groupService.myform.get(
    //                             "IsConsolidatedDR"
    //                         ).value
    //                     )
    //                 ),

    //                 isActive: Boolean(
    //                     JSON.parse(
    //                         this._groupService.myform.get("IsActive").value
    //                     )
    //                 ),
    //                 // PrintSeqNo:
    //                 //     this._groupService.myform.get("PrintSeqNo").value,
    //             },
    //         };

    //         this._groupService
    //             .groupMasterInsert(m_data)
    //             .subscribe((data) => {
    //                 this.msg = data;
    //                 if (data) {
    //                     this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //                         toastClass: 'tostr-tost custom-toast-success',
    //                       });
                      
    //                     // Swal.fire(
    //                     //     "Saved !",
    //                     //     "Record saved Successfully !",
    //                     //     "success"
    //                     // ).then((result) => {
    //                     //     if (result.isConfirmed) {
    //                     //       
    //                     //     }
    //                     // });
    //                 } else {
    //                     this.toastr.error('Group Master Data not saved !, Please check API error..', 'Error !', {
    //                         toastClass: 'tostr-tost custom-toast-error',
    //                       });
    //                 }
                  
    //             },error => {
    //                 this.toastr.error('Group Data not saved !, Please check API error..', 'Error !', {
    //                  toastClass: 'tostr-tost custom-toast-error',
    //                });
    //              });
    //     } else {
    //         var m_dataUpdate = {
    //             groupMasterUpdate: {
    //                 groupId: this._groupService.myform.get("GroupId").value,
    //                 groupName: this._groupService.myform
    //                     .get("GroupName")
    //                     .value.trim(),
    //                 isconsolidated: Boolean(
    //                     JSON.parse(
    //                         this._groupService.myform.get("Isconsolidated")
    //                             .value
    //                     )
    //                 ),
    //                 isConsolidatedDR: Boolean(
    //                     JSON.parse(
    //                         this._groupService.myform.get(
    //                             "IsConsolidatedDR"
    //                         ).value
    //                     )
    //                 ),

    //                 isActive: Boolean(
    //                     JSON.parse(
    //                         this._groupService.myform.get("IsActive").value
    //                     )
    //                 ),
    //                 // PrintSeqNo:
    //                 //     this._groupService.myform.get("PrintSeqNo").value,
    //             },
    //         };

    //         this._groupService
    //             .groupMasterUpdate(m_dataUpdate)
    //             .subscribe((data) => {
    //                 this.msg = data;
    //                 if (data) {
    //                     this.toastr.success('Record updated Successfully.', 'updated !', {
    //                         toastClass: 'tostr-tost custom-toast-success',
    //                       });
                        
    //                     // Swal.fire(
    //                     //     "Updated !",
    //                     //     "Record updated Successfully !",
    //                     //     "success"
    //                     // ).then((result) => {
    //                     //     if (result.isConfirmed) {
    //                     //       
    //                     //     }
    //                     // });
    //                 } else {
    //                     this.toastr.error('Group Master Data not updated !, Please check API error..', 'Error !', {
    //                         toastClass: 'tostr-tost custom-toast-error',
    //                       });
    //                 }
                  
    //             },error => {
    //                 this.toastr.error('Group Data not Updated !, Please check API error..', 'Error !', {
    //                  toastClass: 'tostr-tost custom-toast-error',
    //                });
    //              });
    //     }
    //     this.onClear();
    // }
}

}
