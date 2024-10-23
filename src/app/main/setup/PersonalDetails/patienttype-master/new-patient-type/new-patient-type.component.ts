import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-patient-type',
  templateUrl: './new-patient-type.component.html',
  styleUrls: ['./new-patient-type.component.scss']
})
export class NewPatientTypeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
//   onSubmit() {
//     if (this._PatientTypeService.myForm.valid) {
//         if (!this._PatientTypeService.myForm.get("PatientTypeId").value) {
//             var m_data = {
//                 patientTypeMasterInsert: {
//                     patientType: this._PatientTypeService.myForm
//                         .get("PatientType")
//                         .value.trim(),
//                     addedBy: 1,
//                     isActive: Boolean(
//                         JSON.parse(
//                             this._PatientTypeService.myForm.get("IsDeleted")
//                                 .value
//                         )
//                     ),
//                 },
//             };
//             this._PatientTypeService
//                 .patientTypeMasterInsert(m_data)
//                 .subscribe((data) => {
//                     this.msg = data;
//                     if (data) {
//                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
//                           //this.getPatientTypeMasterList();
//                         // Swal.fire(
//                         //     "Saved !",
//                         //     "Record saved Successfully !",
//                         //     "success"
//                         // ).then((result) => {
//                         //     if (result.isConfirmed) {
//                         //         this.getPatientTypeMasterList();
//                         //     }
//                         // });
//                     } else {
//                         this.toastr.error('Patient Type Master Data not saved !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
//                     }
//                     this.getPatientTypeMasterList();
//                 },error => {
//                     this.toastr.error('Patient Type Data not saved !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  } );
//         } else {
//             var m_dataUpdate = {
//                 patientTypeMasterUpdate: {
//                     patientTypeID:
//                         this._PatientTypeService.myForm.get("PatientTypeId")
//                             .value,
//                     patientType: this._PatientTypeService.myForm
//                         .get("PatientType")
//                         .value.trim(),
//                     isActive: Boolean(
//                         JSON.parse(
//                             this._PatientTypeService.myForm.get("IsDeleted")
//                                 .value
//                         )
//                     ),
//                     updatedBy: 1,
//                 },
//             };
//             console.log(m_dataUpdate);
//             this._PatientTypeService
//                 .patientTypeMasterUpdate(m_dataUpdate)
//                 .subscribe((data) => {
//                     this.msg = m_dataUpdate;
//                     if (data) {
//                         this.toastr.success('Record Updated Successfully.', 'Updated !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
//                           this.getPatientTypeMasterList();
//                         // Swal.fire(
//                         //     "Updated !",
//                         //     "Record updated Successfully !",
//                         //     "success"
//                         // ).then((result) => {
//                         //     if (result.isConfirmed) {
//                         //         this.getPatientTypeMasterList();
//                         //     }
//                         // });
//                     } else {
                       
//                         this.toastr.error('Patient Type Master Data not Updated !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
//                     }
//                     this.getPatientTypeMasterList();
//                 },error => {
//                     this.toastr.error('Patient Type Data not Updated !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  } );
//         }
//         this.onClear();
//     }
// }
}
