import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-maritalstatus',
  templateUrl: './new-maritalstatus.component.html',
  styleUrls: ['./new-maritalstatus.component.scss']
})
export class NewMaritalstatusComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
//   onSubmit() {
//     if (this._maritalService.myform.valid) {
//         if (!this._maritalService.myform.get("MaritalStatusId").value) {
//             var m_data = {
//                 maritalStatusMasterInsert: {
//                     maritalStatusName: this._maritalService.myform
//                         .get("MaritalStatusName")
//                         .value.trim(),
//                     addedBy: 1,
//                     isDeleted: Boolean(
//                         JSON.parse(
//                             this._maritalService.myform.get("IsDeleted")
//                                 .value
//                         )
//                     ),
//                 },
//             };

//             this._maritalService
//                 .insertMaritalStatusMaster(m_data)
//                 .subscribe((data) => {
//                     this.msg = data;
//                     if (data) {
//                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
                        
//                     } else {
//                         this.toastr.error('MaritalStatus Master Data not Saved !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
//                     }
                  
//                 },error => {
//                     this.toastr.error('MaritalStatus Data not saved !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  } );
//         } else {
//             var m_dataUpdate = {
//                 maritalStatusMasterUpdate: {
//                     maritalStatusId:
//                         this._maritalService.myform.get("MaritalStatusId")
//                             .value,
//                     maritalStatusName: this._maritalService.myform
//                         .get("MaritalStatusName")
//                         .value.trim(),
//                     isDeleted: Boolean(
//                         JSON.parse(
//                             this._maritalService.myform.get("IsDeleted")
//                                 .value
//                         )
//                     ),
//                     updatedBy: 1,
//                 },
//             };

//             this._maritalService
//                 .updateMaritalStatusMaster(m_dataUpdate)
//                 .subscribe((data) => {
//                    // this.msg = data;
//                     if (data) {
//                         this.toastr.success('Record updated Successfully.', 'updated !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
                       
//                     } else {
//                         this.toastr.error('MaritalStatus Master Data not updated !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
//                     }
                    
//                 });
//         }
//         this.onClear();
//     }
// }
}
