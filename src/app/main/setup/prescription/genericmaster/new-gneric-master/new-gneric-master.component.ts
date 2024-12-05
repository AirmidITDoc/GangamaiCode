import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GenericmasterService } from '../genericmaster.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-gneric-master',
  templateUrl: './new-gneric-master.component.html',
  styleUrls: ['./new-gneric-master.component.scss']
})
export class NewGnericMasterComponent implements OnInit {

  genericForm:FormGroup;

  constructor(
    public _GenericMasterService: GenericmasterService,
      public dialogRef: MatDialogRef<NewGnericMasterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.genericForm=this._GenericMasterService.createGenericForm();
    var m_data={
      GenericId:this.data?.GenericId,
      GenericName:this.data?.GenericName,      
      isActive: JSON.stringify(this.data?.isActive)
    };
    this.genericForm.patchValue(m_data);    
    console.log("mdata:", m_data)
  }
  onSubmit() {
    if (this.genericForm.invalid) {
      this.toastr.warning('please check from is invalid', 'Warning !', {
        toastClass:'tostr-tost custom-toast-warning',
    })
    return;
    }else{
      if(!this.genericForm.get("GenericId").value){
        debugger
        var mdata=
        {
          "genericId": 0,
          "genericName": this.genericForm.get("GenericName").value || ""
        }
        console.log("generic json:", mdata);
  
        this._GenericMasterService.genericMasterInsert(mdata).subscribe((response)=>{
          this.toastr.success(response.message);
          this.onClear(true);
        }, (error)=>{
          this.toastr.error(error.message);
        });
      } else{
        //update
      }
    }
    
//     if (this._GenericService.myForm.valid) {
//         if (!this._GenericService.myForm.get("GenericId").value) {
//             var m_data = {
//                 insertGenericMaster: {
//                     genericName: this._GenericService.myForm
//                         .get("GenericName")
//                         .value.trim(),
//                     isActive: Boolean(
//                         JSON.parse(
//                             this._GenericService.myForm.get("IsDeleted")
//                                 .value
//                         )
//                     ),
//                     // addedBy: 1,
//                 },
//             };
//             this._GenericService
//                 .insertGenericMaster(m_data)
//                 .subscribe((data) => {
//                     this.msg = m_data;
//                     if (data) {
//                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
//                         this.getGenericMasterList();
//                         // Swal.fire(
//                         //     "Saved !",
//                         //     "Record saved Successfully !",
//                         //     "success"
//                         // ).then((result) => {
//                         //     if (result.isConfirmed) {
//                         //         this.getGenericMasterList();
//                         //     }
//                         // });
//                     } else {
//                         this.toastr.error('Generic Master Data not saved !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
//                     }
//                     this.getGenericMasterList();
//                 },error => {
//                     this.toastr.error('Generic Class Data not saved !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  });
//         } else {
//             var m_dataUpdate = {
//                 updateGenericMaster: {
//                     genericId:
//                         this._GenericService.myForm.get("GenericId").value,
//                     genericName: this._GenericService.myForm
//                         .get("GenericName")
//                         .value.trim(),

//                     isActive: Boolean(
//                         JSON.parse(
//                             this._GenericService.myForm.get("IsDeleted")
//                                 .value
//                         )
//                     ),
//                     //  updatedBy: 1,
//                 },
//             };
//             this._GenericService
//                 .updateGenericMaster(m_dataUpdate)
//                 .subscribe((data) => {
//                     this.msg = m_dataUpdate;
//                     if (data) {
//                         this.toastr.success('Record updated Successfully.', 'updated !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
//                         this.getGenericMasterList();
//                         // Swal.fire(
//                         //     "Updated !",
//                         //     "Record updated Successfully !",
//                         //     "success"
//                         // ).then((result) => {
//                         //     if (result.isConfirmed) {
//                         //         this.getGenericMasterList();
//                         //     }
//                         // });
//                     } else {
//                         this.toastr.error('Generic Master Data not updated !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
//                     }
//                     this.getGenericMasterList();
//                 },error => {
//                     this.toastr.error('Generic Class Data not updated !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  });
//         }
//         this.onClear();
//     }
 }
 onClear(val: boolean) {
  this.genericForm.reset();
  this.dialogRef.close(val);
}
}
