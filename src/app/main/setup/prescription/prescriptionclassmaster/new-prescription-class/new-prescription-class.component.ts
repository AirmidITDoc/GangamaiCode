import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-prescription-class',
  templateUrl: './new-prescription-class.component.html',
  styleUrls: ['./new-prescription-class.component.scss']
})
export class NewPrescriptionClassComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
//   onSubmit() {
//     if (this._PrescriptionclassService.myForm.valid) {
//         if (
//             !this._PrescriptionclassService.myForm.get("TemplateId").value
//         ) {
//             var m_data = {
//                 prescriptionTemplateMasterInsert: {
//                     templateName: this._PrescriptionclassService.myForm
//                         .get("TemplateName")
//                         .value.trim(),
//                     templateDesc: this._PrescriptionclassService.myForm
//                         .get("TemplateDesc")
//                         .value.trim(),
//                     isDeleted: Boolean(
//                         JSON.parse(
//                             this._PrescriptionclassService.myForm.get(
//                                 "IsDeleted"
//                             ).value
//                         )
//                     ),
//                     addedBy: 1,
//                 },
//             };
//             this._PrescriptionclassService
//                 .prescriptionTemplateMasterInsert(m_data)
//                 .subscribe((data) => {
//                     this.msg = m_data;
//                     if (data) {
//                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
                         
//                         // Swal.fire(
//                         //     "Saved !",
//                         //     "Record saved Successfully !",
//                         //     "success"
//                         // ).then((result) => {
//                         //     if (result.isConfirmed) {
//                         //        
//                         //     }
//                         // });
//                     } else {
//                         this.toastr.error('Prescription Class Master Data not saved !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
//                     }
                   
//                 },error => {
//                     this.toastr.error('Prescription Class Data not saved !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  });
//         } else {
//             var m_dataUpdate = {
//                 prescriptionTemplateMasterUpdate: {
//                     templateId:
//                         this._PrescriptionclassService.myForm.get(
//                             "TemplateId"
//                         ).value,
//                     templateName: this._PrescriptionclassService.myForm
//                         .get("TemplateName")
//                         .value.trim(),
//                     templateDesc: this._PrescriptionclassService.myForm
//                         .get("TemplateDesc")
//                         .value.trim(),
//                     isDeleted: Boolean(
//                         JSON.parse(
//                             this._PrescriptionclassService.myForm.get(
//                                 "IsDeleted"
//                             ).value
//                         )
//                     ),
//                     updatedBy: 1,
//                 },
//             };
//             this._PrescriptionclassService
//                 .prescriptionTemplateMasterUpdate(m_dataUpdate)
//                 .subscribe((data) => {
//                     this.msg = m_dataUpdate;
//                     if (data) {
//                         this.toastr.success('Record updated Successfully.', 'updated !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
                         
//                         // Swal.fire(
//                         //     "Updated !",
//                         //     "Record updated Successfully !",
//                         //     "success"
//                         // ).then((result) => {
//                         //     if (result.isConfirmed) {
//                         //        
//                         //     }
//                         // });
//                     } else {
//                         this.toastr.error('Prescription Class Master Data not updated !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
//                     }
                   
//                 },error => {
//                     this.toastr.error('Prescription Class Data not saved !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  });
//         }
//         this.onClear();
//     }
// }
}
