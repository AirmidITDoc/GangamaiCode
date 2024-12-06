import { Component, ElementRef, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { StoreMasterService } from "../store-master.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { StoreMasterComponent } from "../store-master.component";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { FormGroup } from "@angular/forms";

@Component({
    selector: "app-store-form-master",
    templateUrl: "./store-form-master.component.html",
    styleUrls: ["./store-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class StoreFormMasterComponent implements OnInit {
    storeForm: FormGroup;

    constructor(
      public _StoreMasterService: StoreMasterService,
      public dialogRef: MatDialogRef<StoreFormMasterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
    ) { }

    ngOnInit(): void {
      this.storeForm = this._StoreMasterService.createStoremasterForm();
      var m_data = {
        storeId: this.data?.storeId,
        storeShortName: this.data?.storeShortName.trim(),
        storeName: this.data?.storeName.trim(),
        isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.storeForm.patchValue(m_data);
    }

    onSubmit() {
        if (this.storeForm.invalid) {
        this.toastr.warning('please check form is invalid', 'Warning !', {
            toastClass:'tostr-tost custom-toast-warning',
        })
        return;
        }else{
        debugger
        var mdata =
        {
            "storeId": 0,
            "storeShortName": this.storeForm.get("storeShortName").value,
            "storeName": this.storeForm.get("storeName").value,    
        }

        console.log("StoreCategoryMaster Insert:",mdata)
        
        this._StoreMasterService.storeMasterSave(mdata).subscribe((response) => {
        this.toastr.success(response.message);
        this.onClear(true);
        }, (error) => {
        this.toastr.error(error.message);
        });


    //   if (this.storeForm.valid) {
    //       this._StoreMasterService.storeMasterSave(this.storeForm.value).subscribe((response) => {
    //           this.toastr.success(response.message);
    //           this.onClear(true);
    //       }, (error) => {
    //           this.toastr.error(error.message);
    //       });
    //   }
      }
  }

  onClear(val: boolean) {
      this.storeForm.reset();
      this.dialogRef.close(val);
  }

}
