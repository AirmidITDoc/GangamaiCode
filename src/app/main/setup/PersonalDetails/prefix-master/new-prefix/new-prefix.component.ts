import { Component, OnInit } from '@angular/core';
import { PrefixMasterService } from '../prefix-master.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { gridModel } from 'app/core/models/gridRequest';


@Component({
  selector: 'app-new-prefix',
  templateUrl: './new-prefix.component.html',
  styleUrls: ['./new-prefix.component.scss']
})
export class NewPrefixComponent implements OnInit {
  msg: any;

 
  constructor(
      public _PrefixMasterService: PrefixMasterService,
      public toastr: ToastrService, public _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
  }
  onClear() {
      this._PrefixMasterService.myform.reset({ isDeleted: "false" });
      this._PrefixMasterService.initializeFormGroup();
  }

  onSubmit() {
      // if (this._PrefixMasterService.myform.valid) {
      //     if (!this._PrefixMasterService.myform.get("GenderId").value) {
      //         var m_data = {
      //             genderId: 0,
      //             genderName: this._PrefixMasterService.myform
      //                 .get("GenderName")
      //                 .value.trim(),
      //             isActive: Boolean(
      //                 JSON.parse(
      //                     this._PrefixMasterService.myform.get("IsDeleted")
      //                         .value
      //                 )
      //             )
      //         };
      //         console.log(m_data);
      //         this._PrefixMasterService.insertPrefixMaster(m_data).subscribe(
      //             (data) => {
      //                 this.msg = data;
      //                 if (data.StatusCode == 200) {
      //                     this.toastr.success(
      //                         "Record Saved Successfully.",
      //                         "Saved !",
      //                         {
      //                             toastClass:
      //                                 "tostr-tost custom-toast-success",
      //                         }
      //                     );
                         
      //                 } else {
      //                     this.toastr.error(
      //                         "Gender Master Data not saved !, Please check API error..",
      //                         "Error !",
      //                         {
      //                             toastClass: "tostr-tost custom-toast-error",
      //                         }
      //                     );
      //                 }
                     
      //             },
      //             (error) => {
      //                 this.toastr.error(
      //                     "Gender Data not saved !, Please check API error..",
      //                     "Error !",
      //                     {
      //                         toastClass: "tostr-tost custom-toast-error",
      //                     }
      //                 );
      //             }
      //         );
      //     } else {
      //         var m_dataUpdate = {
      //             genderId: this._PrefixMasterService.myform.get("GenderId").value,
      //             genderName: this._PrefixMasterService.myform
      //                 .get("GenderName")
      //                 .value.trim(),
      //             isActive: Boolean(
      //                 JSON.parse(
      //                     this._PrefixMasterService.myform.get("IsDeleted")
      //                         .value
      //                 )
      //             ),
      //         };

      //         this._PrefixMasterService.updatePrefixMaster(this._PrefixMasterService.myform.get("GenderId").value, m_dataUpdate).subscribe(
      //             (data) => {
      //                 this.msg = data;
      //                 if (data.StatusCode == 200) {
      //                     this.toastr.success(
      //                         "Record updated Successfully.",
      //                         "updated !",
      //                         {
      //                             toastClass:
      //                                 "tostr-tost custom-toast-success",
      //                         }
      //                     );
      //                     //this.getGenderMasterList();
      //                     // Swal.fire(
      //                     //     "Updated !",
      //                     //     "Record updated Successfully !",
      //                     //     "success"
      //                     // ).then((result) => {
      //                     //     if (result.isConfirmed) {
      //                     //         this.getGenderMasterList();
      //                     //     }
      //                     // });
      //                 } else {
      //                     this.toastr.error(
      //                         "Gender Master Data not updated !, Please check API error..",
      //                         "Error !",
      //                         {
      //                             toastClass: "tostr-tost custom-toast-error",
      //                         }
      //                     );
      //                 }
      //                 //this.getGenderMasterList();
      //             },
      //             (error) => {
      //                 this.toastr.error(
      //                     "Gender Data not Updated !, Please check API error..",
      //                     "Error !",
      //                     {
      //                         toastClass: "tostr-tost custom-toast-error",
      //                     }
      //                 );
      //             }
      //         );
      //     }
      //     this.onClear();
      // }
  }
 
}

