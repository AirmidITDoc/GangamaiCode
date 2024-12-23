import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PrescriptionclassmasterService } from '../prescriptionclassmaster.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-prescription-class',
  templateUrl: './new-prescription-class.component.html',
  styleUrls: ['./new-prescription-class.component.scss']
})
export class NewPrescriptionClassComponent implements OnInit {

  prescriptionForm:FormGroup;
  isActive:boolean=true;

  constructor(
    public _PrescriptionclassService: PrescriptionclassmasterService,
        public dialogRef: MatDialogRef<NewPrescriptionClassComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.prescriptionForm=this._PrescriptionclassService.createPrescriptionclassForm();
    if(this.data){
        this.isActive=this.data.isActive
        this.prescriptionForm.patchValue(this.data);
    }
  }

  Saveflag: boolean= false;
  onSubmit() {
    this.Saveflag=true

      if(!this.prescriptionForm.get("ClassId").value){
        var mdata={
          "classId": 0,
          "className": this.prescriptionForm.get("ClassName").value || ""
        }
        console.log("class json:", mdata);
  
        this._PrescriptionclassService.prescriptionClassMasterSave(this.prescriptionForm.value).subscribe((response)=>{
          this.toastr.success(response.message);
          this.onClear(true);
        }, (error)=>{
          this.toastr.error(error.message);
        });
      } else{
        //update
      }
    
    
//     if (this.prescriptionForm.valid) {
//         if (
//             !this.prescriptionForm.get("TemplateId").value
//         ) {
//             var m_data = {
//                 prescriptionTemplateMasterInsert: {
//                     templateName: this.prescriptionForm
//                         .get("TemplateName")
//                         .value.trim(),
//                     templateDesc: this.prescriptionForm
//                         .get("TemplateDesc")
//                         .value.trim(),
//                     isDeleted: Boolean(
//                         JSON.parse(
//                             this.prescriptionForm.get(
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
//                         this.prescriptionForm.get(
//                             "TemplateId"
//                         ).value,
//                     templateName: this.prescriptionForm
//                         .get("TemplateName")
//                         .value.trim(),
//                     templateDesc: this.prescriptionForm
//                         .get("TemplateDesc")
//                         .value.trim(),
//                     isDeleted: Boolean(
//                         JSON.parse(
//                             this.prescriptionForm.get(
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
}
onClear(val: boolean) {
  this.prescriptionForm.reset();
  this.dialogRef.close(val);
}
}
