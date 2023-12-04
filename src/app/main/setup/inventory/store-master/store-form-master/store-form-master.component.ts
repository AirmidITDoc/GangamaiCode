import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { StoreMasterService } from "../store-master.service";
import { MatDialogRef } from "@angular/material/dialog";
import { StoreMasterComponent } from "../store-master.component";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-store-form-master",
    templateUrl: "./store-form-master.component.html",
    styleUrls: ["./store-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class StoreFormMasterComponent implements OnInit {
    msg: any;

    constructor(
        public _StoreService: StoreMasterService,
        public toastr : ToastrService,
        public dialogRef: MatDialogRef<StoreMasterComponent>
    ) {}

    ngOnInit(): void {
        //
    }

    onSubmit() {
        if (this._StoreService.myform.valid) {
            if (!this._StoreService.myform.get("StoreId").value) {
                var m_data = {
                    insertStoreMaster: {
                        storeShortName: this._StoreService.myform
                            .get("StoreShortName")
                            .value.trim(),
                        storeName: this._StoreService.myform
                            .get("StoreName")
                            .value.trim(),
                        indentPrefix: this._StoreService.myform
                            .get("IndentPrefix")
                            .value.trim(),
                        indentNo: this._StoreService.myform
                            .get("IndentNo")
                            .value.trim(),
                        purchasePrefix: this._StoreService.myform
                            .get("PurchasePrefix")
                            .value.trim(),
                        purchaseNo: this._StoreService.myform
                            .get("PurchaseNo")
                            .value.trim(),
                        grnPrefix: this._StoreService.myform
                            .get("GrnPrefix")
                            .value.trim(),
                        grnNo: this._StoreService.myform
                            .get("GrnNo")
                            .value.trim(),
                        grnreturnNoPrefix: this._StoreService.myform
                            .get("GrnreturnNoPrefix")
                            .value.trim(),
                        grnreturnNo: this._StoreService.myform
                            .get("GrnreturnNo")
                            .value.trim(),
                        issueToDeptPrefix: this._StoreService.myform
                            .get("IssueToDeptPrefix")
                            .value.trim(),
                        issueToDeptNo: this._StoreService.myform
                            .get("IssueToDeptNo")
                            .value.trim(),
                        returnFromDeptNoPrefix: this._StoreService.myform
                            .get("ReturnFromDeptNoPrefix")
                            .value.trim(),
                        returnFromDeptNo: this._StoreService.myform
                            .get("ReturnFromDeptNo")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._StoreService.myform.get("IsDeleted").value
                            )
                        ),
                        addedBy: 1,
                    },
                };
                console.log(m_data);
                this._StoreService
                    .insertStoreMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //     }
                            // });
                        } else {
                            this.toastr.error('Store-Form Master Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                    },error => {
                        this.toastr.error('Store-Form not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    updateStoreMaster: {
                        storeId: this._StoreService.myform.get("StoreId").value,
                        storeShortName: this._StoreService.myform
                            .get("StoreShortName")
                            .value.trim(),
                        storeName: this._StoreService.myform
                            .get("StoreName")
                            .value.trim(),

                        isDeleted: Boolean(
                            JSON.parse(
                                this._StoreService.myform.get("IsDeleted").value
                            )
                        ),
                        updatedBy: 1,
                    },
                };
                this._StoreService
                    .updateStoreMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //     }
                            // });
                        } else {
                            this.toastr.error('Store-Form Master Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                    },error => {
                        this.toastr.error('Store-Form not updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClose();
        }
    }
    onEdit(row) {
        var m_data = {
            StoreId: row.StoreId,
            StoreShortName: row.StoreShortName.trim(),
            StoreName: row.StoreName.trim(),
            IndentPrefix: row.IndentPrefix.trim(),
            IndentNo: row.IndentNo.trim(),
            PurchasePrefix: row.PurchasePrefix.trim(),
            PurchaseNo: row.PurchaseNo.trim(),
            GrnPrefix: row.GrnPrefix.trim(),
            GrnNo: row.GrnNo.trim(),
            GrnreturnNoPrefix: row.GrnreturnNoPrefix.trim(),
            GrnreturnNo: row.GrnreturnNo.trim(),
            IssueToDeptPrefix: row.IssueToDeptPrefix.trim(),
            IssueToDeptNo: row.IssueToDeptNo.trim(),
            ReturnFromDeptNoPrefix: row.ReturnFromDeptNoPrefix.trim(),
            ReturnFromDeptNo: row.ReturnFromDeptNo.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };

        this._StoreService.populateForm(m_data);
    }

    onClear() {
        this._StoreService.myform.reset();
    }
    onClose() {
        this._StoreService.myform.reset();
        this.dialogRef.close();
    }
}
