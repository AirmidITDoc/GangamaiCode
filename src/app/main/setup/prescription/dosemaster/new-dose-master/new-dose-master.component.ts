import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DosemasterService } from '../dosemaster.service';

@Component({
  selector: 'app-new-dose-master',
  templateUrl: './new-dose-master.component.html',
  styleUrls: ['./new-dose-master.component.scss']
})
export class NewDoseMasterComponent implements OnInit {

  doseForm:FormGroup;

  constructor(
    public _doseMasterService: DosemasterService,
    public dialogRef: MatDialogRef<NewDoseMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
) { }

  ngOnInit(): void {
    this.doseForm=this._doseMasterService.createDoseForm();
    var m_data={
      DoseId:this.data?.DrugId,
      DoseName:this.data?.DrugName, 
    };
    this.doseForm.patchValue(m_data);    
    console.log("dose mdata:", m_data)
  }



//   getGenericNameCombobox() {
//     this._drugService.getGenericMasterCombo().subscribe((data) => {
//         this.GenericmbList = data;
//         this.filteredGeneric.next(this.GenericmbList.slice());
//     });
// }
// getClassNameCombobox() {
//     this._drugService.getClassMasterCombo().subscribe((data) => {
//         this.ClassmbList = data;
//         this.filteredClass.next(this.ClassmbList.slice());
//         console.log(this.ClassmbList);
//     });
// }


onSubmit() {
  if(!this.doseForm.get("DoseId").value){
    debugger
    var mdata=
    {
      "doseId": 0,
      "doseName": this.doseForm.get("DoseName").value || "",
    }
    console.log("dose json:", mdata);

    this._doseMasterService.doseMasterInsert(this.doseForm.value).subscribe((response)=>{
      this.toastr.success(response.message);
      this.onClear(true);
    }, (error)=>{
      this.toastr.error(error.message);
    });
  } else{
    //update
  }
//   if (this._DoseService.myForm.valid) {
//       if (!this._DoseService.myForm.get("DoseId").value) {
//           var m_data = {
//               insertDoseMaster: {
//                   doseName: this._DoseService.myForm
//                       .get("DoseName")
//                       .value.trim(),
//                   doseNameInEnglish: this._DoseService.myForm
//                       .get("DoseNameInEnglish")
//                       .value.trim(),
//                   doseNameInMarathi: "",
//                   doseQtyPerDay:
//                       this._DoseService.myForm.get("DoseQtyPerDay").value,

//                   isActive: Boolean(
//                       JSON.parse(
//                           this._DoseService.myForm.get("IsDeleted").value
//                       )
//                   ),
//                   // addedBy: 1,
//               },
//           };
//           this._DoseService.insertDoseMaster(m_data).subscribe((data) => {
//               this.msg = m_data;
//               if (data) {
//                   this.toastr.success('Record Saved Successfully.', 'Saved !', {
//                       toastClass: 'tostr-tost custom-toast-success',
//                     });
//                   this.getDoseMasterList();
//                   // Swal.fire(
//                   //     "Saved !",
//                   //     "Record saved Successfully !",
//                   //     "success"
//                   // ).then((result) => {
//                   //     if (result.isConfirmed) {
//                   //         this.getDoseMasterList();
//                   //     }
//                   // });
//               } else {
//                   this.toastr.error(' Dose Master Data not saved !, Please check API error..', 'Error !', {
//                       toastClass: 'tostr-tost custom-toast-error',
//                     });
//               }
//               this.getDoseMasterList();
//           },error => {
//               this.toastr.error('Dose Class Data not saved !, Please check API error..', 'Error !', {
//                toastClass: 'tostr-tost custom-toast-error',
//              });
//            });
//       } else {
//           var m_dataUpdate = {
//               updateDoseMaster: {
//                   doseId: this._DoseService.myForm.get("DoseId").value,
//                   doseName: this._DoseService.myForm
//                       .get("DoseName")
//                       .value.trim(),
//                   doseNameInEnglish: this._DoseService.myForm
//                       .get("DoseNameInEnglish")
//                       .value.trim(),
//                   doseNameInMarathi: "",
//                   isActive: Boolean(
//                       JSON.parse(
//                           this._DoseService.myForm.get("IsDeleted").value
//                       )
//                   ),
//                   doseQtyPerDay:
//                       this._DoseService.myForm.get("DoseQtyPerDay").value,
//                   //  updatedBy: 1,
//               },
//           };
//           this._DoseService
//               .updateDoseMaster(m_dataUpdate)
//               .subscribe((data) => {
//                   this.msg = m_dataUpdate;
//                   if (data) {
//                       this.toastr.success('Record updated Successfully.', 'updated !', {
//                           toastClass: 'tostr-tost custom-toast-success',
//                         });
//                       this.getDoseMasterList();
//                       // Swal.fire(
//                       //     "Updated !",
//                       //     "Record updated Successfully !",
//                       //     "success"
//                       // ).then((result) => {
//                       //     if (result.isConfirmed) {
//                       //         this.getDoseMasterList();
//                       //     }
//                       // });
//                   } else {
//                       this.toastr.error(' Dose Master Data not updated !, Please check API error..', 'Error !', {
//                           toastClass: 'tostr-tost custom-toast-error',
//                         });
//                   }
//                   this.getDoseMasterList();
//               },error => {
//                   this.toastr.error('Dose Class Data not updated !, Please check API error..', 'Error !', {
//                    toastClass: 'tostr-tost custom-toast-error',
//                  });
//                });
//       }
//       this.onClear();
//   }
}
onClear(val: boolean) {
  this.doseForm.reset();
  this.dialogRef.close(val);
}
}
