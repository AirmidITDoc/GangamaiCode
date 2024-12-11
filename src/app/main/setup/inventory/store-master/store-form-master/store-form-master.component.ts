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
    vTemplateDesc: any;
Header: any;
onClose() {
throw new Error('Method not implemented.');
}
    storeForm: FormGroup;
    gridConfig: any;

    editorConfig: AngularEditorConfig = {
        // color:true,
        editable: true,
        spellcheck: true,
        height: '20rem',
        minHeight: '20rem',
        translate: 'yes',
        placeholder: 'Enter text here...',
        enableToolbar: true,
        showToolbar: true,
    
      };

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

    /*
    {
  "storeId": 0,
  "storeShortName": "shilpa",
  "storeName": "medical",
  "indentPrefix": "abc",
  "indentNo": "123",
  "purchasePrefix": "xyz",
  "purchaseNo": "453",
  "grnPrefix": "sss",
  "grnNo": "5643",
  "grnreturnNoPrefix": "123",
  "grnreturnNo": "string",
  "issueToDeptPrefix": "string",
  "issueToDeptNo": "11",
  "returnFromDeptNoPrefix": "string",
  "returnFromDeptNo": "string",
  "workOrderPrefix": "string",
  "workOrderNo": "string",
  "pharSalCountId": 0,
  "pharSalRecCountId": 0,
  "pharSalReturnCountId": 0,
  "pharAdvId": 0,
  "pharAdvReptId": 0,
  "pharAdvRefId": 0,
  "pharAdvRefReptId": 0,
  "printStoreName": "string",
  "dlNo": "string",
  "gstin": "string",
  "storeAddress": "pune",
  "hospitalMobileNo": "9987654311",
  "hospitalEmailId": "shilpameshra@23gmail.com",
  "printStoreUnitName": "facewash",
  "isPharStore": true,
  "isWhatsAppMsg": true,
  "whatsAppTemplateId": "string",
  "isSmsmsg": true,
  "smstemplateId": "string"
} */

    onSubmit() {
        debugger
        if (this.storeForm.invalid) {
            this.toastr.warning('please check form is invalid','Warning !', {
              toastClass:'tostr-tost custom-toast-warning',
          })
          return;
        }else{
        var m_data =
        {
            "storeId": 0,
            "storeShortName" : this.storeForm.get("storeShortName").value,
            "storeName" : this.storeForm.get("storeName").value, 
            "indentPrefix" : this.storeForm.get("indentPrefix").value,
            "indentNo" : this.storeForm.get("indentNo").value,
            "grnreturnNoPrefix": this.storeForm.get("grnreturnNoPrefix").value,
            "grnreturnNo" : this.storeForm.get("grnreturnNo").value,
            "purchasePrefix" : this.storeForm.get("purchasePrefix").value,
            "purchaseNo" : this.storeForm.get("purchaseNo").value,
            "issueToDeptPrefix" : this.storeForm.get("issueToDeptPrefix").value,
            "issueToDeptNo" : this.storeForm.get("issueToDeptNo").value,
            "grnPrefix" : this.storeForm.get("grnPrefix").value,
            "grnNo" : this.storeForm.get("grnNo").value,
            "returnFromDeptNoPrefix" : this.storeForm.get("returnFromDeptNoPrefix").value,
            "returnFromDeptNo" : this.storeForm.get("returnFromDeptNo").value,
            "pharSalCountId" : this.storeForm.get("pharSalCountId").value,
            "pharSalRecCountId" : this.storeForm.get("pharSalRecCountId").value,
            "pharSalReturnCountId" : this.storeForm.get("pharSalReturnCountId").value,
            "DL_NO" : 0,
            "GSTIN" : 0,
            "Header" : this.storeForm.get("Header").value,
            // "isDeleted" : Boolean(JSON.parse(this.storeForm.get("IsDeleted").value)),
            // "addedBy" : 1, 
            // "pharAdvId" : 0,
            // "pharAdvReptId" : 0,
            // "pharAdvRefId" : 0,
            // "pharAdvRefReptId" : 0,
            // "printStoreName" : "string",
            // "dlNo" : "string",
            // "gstin" : "string",
            // "storeAddress" : "pune",
            // "hospitalMobileNo" : "9987654311",
            // "hospitalEmailId" : "shilpameshra@23gmail.com",
            // "printStoreUnitName" : "facewash",
            // "isPharStore" : true,
            // "isWhatsAppMsg" : true,
            // "whatsAppTemplateId" : "string",
            // "isSmsmsg" : true,
            // "smstemplateId" : "string"
        }

        console.log("StoreMaster Insert:",m_data)
        
        this._StoreMasterService.storeMasterSave(m_data).subscribe((response) => {
        this.toastr.success(response.message);
        this.onClear(true);
        }, (error) => {
            this.toastr.error(error.message);
        });
   }
}

    onBlur(e: any) {
        this.vTemplateDesc = e.target.innerHTML;
    }
    
    onClear(val: boolean) {
        this.storeForm.reset();
        this.dialogRef.close(val);
    }

}



