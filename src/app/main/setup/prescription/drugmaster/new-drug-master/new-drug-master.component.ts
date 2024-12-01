import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DrugmasterService } from '../drugmaster.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-drug-master',
  templateUrl: './new-drug-master.component.html',
  styleUrls: ['./new-drug-master.component.scss']
})
export class NewDrugMasterComponent implements OnInit {

  drugForm:FormGroup;

  autocompleteModeClass: string = "Class";  
  autocompleteModeGenericName: string = "GenericName";

  constructor(
      public _durgMasterService: DrugmasterService,
      public dialogRef: MatDialogRef<NewDrugMasterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // this.getGenericNameCombobox();
    // this.getClassNameCombobox();
    this.drugForm=this._durgMasterService.createDrugForm();
    var m_data={
      DrugId:this.data?.DrugId,
      DrugName:this.data?.DrugName, 
      GenericId:this.data?.GenericId, 
      ClassId:this.data?.ClassId,      
      isActive: JSON.stringify(this.data?.isActive)
    };
    this.drugForm.patchValue(m_data);    
    console.log("drug mdata:", m_data)

  }
  onSubmit() {
    if(!this.drugForm.get("DrugId").value){
      debugger
      var mdata=
      {
        "drugId": 0,
        "drugName": this.drugForm.get("DrugName").value || "",
        "genericId": parseInt(this.drugForm.get("GenericId").value) || 0,
        "classId": parseInt(this.drugForm.get("ClassId").value) || 0,
        "isActive": true
      }
      console.log("drug json:", mdata);

      this._durgMasterService.drugMasterInsert(this.drugForm.value).subscribe((response)=>{
        this.toastr.success(response.message);
        this.onClear(true);
      }, (error)=>{
        this.toastr.error(error.message);
      });
    } else{
      //update
    }

//     if (this._drugService.myform.valid) {
//         if (!this._drugService.myform.get("DrugId").value) {
//             var m_data = {
//                 insertDrugMaster: {
//                     drugName: this._drugService.myform
//                         .get("DrugName")
//                         .value.trim(),
//                     genericId:
//                         this._drugService.myform.get("GenericId").value
//                             .GenericId,
//                     classId:
//                         this._drugService.myform.get("ClassId").value
//                             .ClassId,
//                     isActive: Boolean(
//                         JSON.parse(
//                             this._drugService.myform.get("IsDeleted").value
//                         )
//                     ),
//                     // addedBy: 1,
//                 },
//             };

//             this._drugService.insertDrugMaster(m_data).subscribe((data) => {
//                 this.msg = data;
//                 console.log(this.msg);
//                 if (data) {
//                     this.toastr.success('Record Saved Successfully.', 'Saved !', {
//                         toastClass: 'tostr-tost custom-toast-success',
//                       });
//                     this.getDrugMasterList();
//                     // Swal.fire(
//                     //     "Saved !",
//                     //     "Record saved Successfully !",
//                     //     "success"
//                     // ).then((result) => {
//                     //     if (result.isConfirmed) {
//                     //         this.getDrugMasterList();
//                     //     }
//                     // });
//                 } else {
//                     this.toastr.error('Drug Master Data not saved !, Please check API error..', 'Error !', {
//                         toastClass: 'tostr-tost custom-toast-error',
//                       });
//                     }
//                 this.getDrugMasterList();
//             },error => {
//                 this.toastr.error('Drug Class Data not saved !, Please check API error..', 'Error !', {
//                  toastClass: 'tostr-tost custom-toast-error',
//                });
//              });
//         } else {
//             var m_dataUpdate = {
//                 updateDrugMaster: {
//                     drugId: this._drugService.myform.get("DrugId").value,
//                     drugName:
//                         this._drugService.myform.get("DrugName").value,
//                     genericId:
//                         this._drugService.myform.get("GenericId").value
//                             .GenericId,
//                     classId:
//                         this._drugService.myform.get("ClassId").value
//                             .ClassId,
//                     isActive: Boolean(
//                         JSON.parse(
//                             this._drugService.myform.get("IsDeleted").value
//                         )
//                     ),
//                     //  updatedBy: 1,
//                 },
//             };
//             this._drugService
//                 .updateDrugMaster(m_dataUpdate)
//                 .subscribe((data) => {
//                     this.msg = data;
//                     if (data) {
//                         this.toastr.success('Record updated Successfully.', 'updated !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
//                         this.getDrugMasterList();
//                         // Swal.fire(
//                         //     "Updated !",
//                         //     "Record updated Successfully !",
//                         //     "success"
//                         // ).then((result) => {
//                         //     if (result.isConfirmed) {
//                         //         this.getDrugMasterList();
//                         //     }
//                         // });
//                     } else {
//                         this.toastr.error('Drug Master Data not updated !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
//                     }
//                     this.getDrugMasterList();
//                 },error => {
//                     this.toastr.error('Drug Class Data not updated !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  });
//         }
//         this.onClear();
//     }
}

onClear(val: boolean) {
  this.drugForm.reset();
  this.dialogRef.close(val);
}

ClassId=0;
GenericId=0;

selectChangeClass(obj: any){
  console.log(obj);
  this.ClassId=obj.value
}
selectChangeGeneric(obj: any){
  console.log(obj);
  this.ClassId=obj.value
}

getValidationGeneric(){
  return {
    GenericId: [
          { name: "required", Message: "Generic Name is required" }
      ]
  };
}
getValidationClass(){
  return {
    ClassId: [
          { name: "required", Message: "Class Name is required" }
      ]
  };
}

}
