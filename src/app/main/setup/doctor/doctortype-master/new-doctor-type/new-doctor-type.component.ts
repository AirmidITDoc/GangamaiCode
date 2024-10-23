import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-doctor-type',
  templateUrl: './new-doctor-type.component.html',
  styleUrls: ['./new-doctor-type.component.scss']
})
export class NewDoctorTypeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
//   onSubmit() {
//     if (this._doctortypeService.myform.valid) {
//         if (!this._doctortypeService.myform.get("Id").value) {
//             var m_data = {
//                 doctortTypeMasterInsert: {
//                     doctorType: this._doctortypeService.myform
//                         .get("DoctorType")
//                         .value.trim(),
//                     IsActive: Boolean(
//                         JSON.parse(
//                             this._doctortypeService.myform.get("isActive")
//                                 .value
//                         )
//                     ),
//                 },
//             };

//             this._doctortypeService
//                 .doctortTypeMasterInsert(m_data)
//                 .subscribe((data) => {
//                     this.msg = data;
//                     if (data) {
//                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
//                           this.getDoctortypeMasterList();
                       
//                     } else {
//                         this.toastr.error('DoctorType Master Master Data not saved !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
//                     }
//                     this.getDoctortypeMasterList();
//                 },error => {
//                     this.toastr.error('DoctorType Data not saved !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  });
//         } else {
//             var m_dataUpdate = {
//                 doctorTypeMasterUpdate: {
//                     id: this._doctortypeService.myform.get("Id").value,
//                     doctorType:
//                         this._doctortypeService.myform.get("DoctorType")
//                             .value,
//                             IsActive: Boolean(
//                         JSON.parse(
//                             this._doctortypeService.myform.get("isActive")
//                                 .value
//                         )
//                     ),
//                 },
//             };
//             this._doctortypeService
//                 .doctorTypeMasterUpdate(m_dataUpdate)
//                 .subscribe((data) => {
//                     this.msg = data;
//                     if (data) {
//                         this.toastr.success('Record updated Successfully.', 'updated !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
//                           this.getDoctortypeMasterList();
                       
//                     } else {
//                         this.toastr.error('DoctorType Master Data not updated !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
//                     }
//                     this.getDoctortypeMasterList();
//                 },error => {
//                     this.toastr.error('DoctorType Data not Updated !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  });
                
                
//         }
//         this.onClear();
//     }
// }
}
