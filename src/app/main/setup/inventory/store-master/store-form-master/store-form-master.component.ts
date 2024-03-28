import { Component, ElementRef, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { StoreMasterService } from "../store-master.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
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
    Savebtn: boolean = false;
    vshortName:any;
    vStoreName:any;
    vIndentPrefix:any;
    vIndentNo:any;
    vGrnreturnNoPrefix:any;
    vGrnreturnNo:any;
    vPurchasePrefix:any;
    vPurchaseNo:any;
    vIssueToDeptPrefix:any;
    vIssueToDeptNo:any;
    vGrnPrefix:any;
    vGrnNo:any;
    vReturnFromDeptNoPrefix:any;
    vReturnFromDeptNo:any;
    registerObj:any;
    vStoreId:any;
    vDeleted:any;
    checkradiobtn:any;

    constructor(
        public _StoreService: StoreMasterService,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<StoreMasterComponent>,
        private elementRef: ElementRef,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit(): void {
    if(this.data.Obj){
        this.registerObj = this.data.Obj;
        console.log(this.registerObj);
        this.vStoreId = this.registerObj.StoreId;
       this.vshortName = this.registerObj.StoreShortName ;
       this.vStoreName = this.registerObj.StoreName ;
       this.vIndentPrefix = this.registerObj.IndentPrefix ;
       this.vIndentNo = this.registerObj.IndentNo.trim() ;
       this.vGrnreturnNoPrefix = this.registerObj.GrnreturnNoPrefix ;
       this.vGrnreturnNo = this.registerObj.GrnreturnNo.trim() ;
       this.vPurchasePrefix = this.registerObj.PurchasePrefix ;
       this.vPurchaseNo = this.registerObj.PurchaseNo.trim() ;
       this.vIssueToDeptPrefix = this.registerObj.IssueToDeptPrefix ;
       this.vIssueToDeptNo = this.registerObj.IssueToDeptNo.trim() ;
       this.vGrnPrefix = this.registerObj.GrnPrefix ;
       this.vGrnNo = this.registerObj.GrnNo.trim() ;
       this.vReturnFromDeptNoPrefix = this.registerObj.ReturnFromDeptNoPrefix ;
       this.vReturnFromDeptNo = this.registerObj.ReturnFromDeptNo.trim() ;

       this.checkradiobtn =JSON.stringify(this.registerObj.IsDeleted);
       if(this.checkradiobtn === 'true'){
        this.vDeleted = 1;
       }else{
        this.vDeleted = 0;
       }
    }
    }
    focusNext(nextElementId: string): void {
        const nextElement = this.elementRef.nativeElement.querySelector(`#${nextElementId}`);
        if (nextElement) {
          nextElement.focus();
        }
      }
    onSubmit() {
        if ((this.vshortName == '' || this.vshortName == null || this.vshortName == undefined)) {
            this.toastr.warning('Please enter a ShortName', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vStoreName == '' || this.vStoreName == null || this.vStoreName == undefined)) {
            this.toastr.warning('Please enter a StoreName', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vIndentPrefix == '' || this.vIndentPrefix == null || this.vIndentPrefix == undefined)) {
            this.toastr.warning('Please enter a IndentPrefix', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vIndentNo == '' || this.vIndentNo == null || this.vIndentNo == undefined)) {
            this.toastr.warning('Please enter a IndentNo', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vGrnreturnNoPrefix == '' || this.vGrnreturnNoPrefix == null || this.vGrnreturnNoPrefix == undefined)) {
            this.toastr.warning('Please enter a GRN ReturnPrefix', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vGrnreturnNo == '' || this.vGrnreturnNo == null || this.vGrnreturnNo == undefined)) {
            this.toastr.warning('Please enter a GRN ReturnNo', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vPurchasePrefix == '' || this.vPurchasePrefix == null || this.vPurchasePrefix == undefined)) {
            this.toastr.warning('Please enter a PurchasePrefix', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vPurchaseNo == '' || this.vPurchaseNo == null || this.vPurchaseNo == undefined)) {
            this.toastr.warning('Please enter a PurchaseNo', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vIssueToDeptPrefix == '' || this.vIssueToDeptPrefix == null || this.vIssueToDeptPrefix == undefined)) {
            this.toastr.warning('Please enter a IssueToDeptPrefix', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vIssueToDeptNo == '' || this.vIssueToDeptNo == null || this.vIssueToDeptNo == undefined)) {
            this.toastr.warning('Please enter a IssueToDeptNo', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vGrnPrefix == '' || this.vGrnPrefix == null || this.vGrnPrefix == undefined)) {
            this.toastr.warning('Please enter a GRNPrefix', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vGrnNo == '' || this.vGrnNo == null || this.vGrnNo == undefined)) {
            this.toastr.warning('Please enter a GRNNo', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vReturnFromDeptNoPrefix == '' || this.vReturnFromDeptNoPrefix == null || this.vReturnFromDeptNoPrefix == undefined)) {
            this.toastr.warning('Please enter a ReturnFromDeptPrefix', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vReturnFromDeptNo == '' || this.vReturnFromDeptNo == null || this.vReturnFromDeptNo == undefined)) {
            this.toastr.warning('Please enter a ReturnFromDeptNo', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (this._StoreService.myform.valid) {
            if (!this._StoreService.myform.get("StoreId").value) {
                this.Savebtn = true;
                var m_data = {
                    insertStoreMaster: {
                        storeShortName: this._StoreService.myform.get("StoreShortName").value.trim(),
                        storeName: this._StoreService.myform.get("StoreName").value.trim(),
                        indentPrefix: this._StoreService.myform.get("IndentPrefix").value.trim(),
                        indentNo: this._StoreService.myform.get("IndentNo").value,
                        purchasePrefix: this._StoreService.myform.get("PurchasePrefix").value.trim(),
                        purchaseNo: this._StoreService.myform.get("PurchaseNo").value,
                        grnPrefix: this._StoreService.myform.get("GrnPrefix").value.trim(),
                        grnNo: this._StoreService.myform.get("GrnNo").value,
                        grnreturnNoPrefix: this._StoreService.myform.get("GrnreturnNoPrefix").value.trim(),
                        grnreturnNo: this._StoreService.myform.get("GrnreturnNo").value,
                        issueToDeptPrefix: this._StoreService.myform.get("IssueToDeptPrefix").value.trim(),
                        issueToDeptNo: this._StoreService.myform.get("IssueToDeptNo").value,
                        returnFromDeptNoPrefix: this._StoreService.myform.get("ReturnFromDeptNoPrefix").value.trim(),
                        returnFromDeptNo: this._StoreService.myform.get("ReturnFromDeptNo").value,
                        isDeleted: Boolean(JSON.parse(this._StoreService.myform.get("IsDeleted").value)),
                        addedBy: 1,
                    },
                };
                console.log(m_data);
                this._StoreService.insertStoreMaster(m_data).subscribe((data) => {
                    this.msg = data;
                    if (data) {
                        this.toastr.success('Record Saved Successfully.', 'Saved !', {
                            toastClass: 'tostr-tost custom-toast-success',
                        });
                        this.Savebtn = false;
                        this.onClose();
                    } else {
                        this.toastr.error('Store-Form Master Master Data not saved !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    }
                }, error => {
                    this.toastr.error('Store-Form not saved !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                });
            } else {
                this.Savebtn = true;
                var m_dataUpdate = {
                    updateStoreMaster: {
                        storeId: this._StoreService.myform.get("StoreId").value,
                        storeShortName: this._StoreService.myform.get("StoreShortName").value.trim(),
                        storeName: this._StoreService.myform.get("StoreName").value.trim(),
                        isDeleted: Boolean(JSON.parse(this._StoreService.myform.get("IsDeleted").value)),
                        updatedBy: 1,
                    },
                };
                this._StoreService.updateStoreMaster(m_dataUpdate).subscribe((data) => {
                    this.msg = data;
                    if (data) {
                        this.toastr.success('Record updated Successfully.', 'updated !', {
                            toastClass: 'tostr-tost custom-toast-success',
                        });
                        this.Savebtn = false;
                        this.onClose();
                    } else {
                        this.toastr.error('Store-Form Master Master Data not updated !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    }
                }, error => {
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
        console.log(row)
        console.log(m_data)
    }

    onClear() {
        this._StoreService.myform.reset();
    }
    onClose() {
        this._StoreService.myform.reset();
        this.dialogRef.close();
    }
}
