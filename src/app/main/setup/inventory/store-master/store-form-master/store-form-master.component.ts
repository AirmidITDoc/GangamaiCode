import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { StoreMasterService } from "../store-master.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { UntypedFormGroup } from "@angular/forms";

@Component({
    selector: "app-store-form-master",
    templateUrl: "./store-form-master.component.html",
    styleUrls: ["./store-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class StoreFormMasterComponent implements OnInit {

    Header: string;
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '20rem',
        minHeight: '20rem',
        translate: 'yes',
        placeholder: 'Enter text here...',
        enableToolbar: true,
        showToolbar: true,
    };

    onBlur(e: any) {
        this.Header = e.target.innerHTML;
    }

    storeForm: UntypedFormGroup;
    isActive:boolean=true;
    saveflag : boolean = false;
    
    autocompleteModeCashcounter: string = "CashCounter";
    constructor(
      public _StoreMasterService: StoreMasterService,
      public dialogRef: MatDialogRef<StoreFormMasterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.storeForm = this._StoreMasterService.createStoremasterForm();
        if(this.data){
            this.isActive=this.data.isActive
            this.storeForm.patchValue(this.data);
        }
    }

    
    onSubmit() {
        debugger
        if(!this.storeForm.invalid){
            this.saveflag = true;
        console.log("StoreCategoryMaster Insert:",this.storeForm.value)
        
        this._StoreMasterService.storeMasterSave(this.storeForm.value).subscribe((response) => {
        this.toastr.success(response.message);
        this.onClear(true);
        }, (error) => {
        this.toastr.error(error.message);
        });
    }
    else{
        this.toastr.warning('please check from is invalid', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
    }
  }

  onClear(val: boolean) {
      this.storeForm.reset();
      this.dialogRef.close(val);
  }

  getValidationMessages() {
    return {
        storeName: [
            { name: "required", Message: "storeName  is required" },
            { name: "maxlength", Message: "storeName  should not be greater than 50 char." },
            { name: "pattern", Message: "Special char not allowed." }
        ],
        storeShortName: [
            { name: "required", Message: "storeShortName is required" },
            { name: "maxlength", Message: "storeShortName should not be greater than 50 char." },
            { name: "pattern", Message: "Special char not allowed." }
        ],
        indentPrefix:[
            {name : "required", Message: "Indent Prefix is required"},
            { name: "maxlength", Message: "Indent Prefix should not be greater than 50 char." },
            { name: "pattern", Message: "Special char not allowed." }
        ],
        indentNo:[
            {name : "required", Message: "Indent No is required"},
            { name: "maxlength", Message: "Indent No should not be greater than 30 Numbers." },
            { name: "pattern", Message: "Only Numbers allowed." }
        ],
        grnreturnNoPrefix:[
            {name : "required", Message: "GRN Return No Prefix is required"},
            { name: "maxlength", Message: "GRN Return No Prefix should not be greater than 50 char." },
            { name: "pattern", Message: "Special char not allowed." }
        ],
        grnreturnNo:[
            {name : "required", Message: "GRN Return No is required"},
            { name: "maxlength", Message: "GRN Return No should not be greater than 30 Numbers." },
            { name: "pattern", Message: "Only Numbers allowed." }
        ],
        purchasePrefix:[
            {name : "required", Message: "Purchase Prefix is required"},
            { name: "maxlength", Message: "Purchase Prefix should not be greater than 50 char." },
            { name: "pattern", Message: "Only Characters allowed." }
        ],
        purchaseNo:[
            {name : "required", Message: "Purchase No is required"},
            { name: "maxlength", Message: "Purchase No should not be greater than 30 char." },
            { name: "pattern", Message: "Only Numbers allowed." }
        ],
        issueToDeptPrefix:[
            {name : "required", Message: "Issue to Dept Prefix is required"},
            { name: "maxlength", Message: "Indent Prefix should not be greater than 50 char." },
            { name: "pattern", Message: "Only Characters allowed." }
        ],
        issueToDeptNo:[
            {name : "required", Message: "Issue to Dept No is required"},
            { name: "maxlength", Message: "Issue to Dept No should not be greater than 30 char." },
            { name: "pattern", Message: "Only Numbers allowed." }
        ],
        grnPrefix:[
            {name : "required", Message: "GRN Prefix is required"},
            { name: "maxlength", Message: "GRN Prefix should not be greater than 50 char." },
            { name: "pattern", Message: "Special char not allowed." }
        ],
        grnNo:[
            {name : "required", Message: "GRN No is required"},
            { name: "maxlength", Message: "GRN No should not be greater than 30 char." },
            { name: "pattern", Message: "Only Numbers allowed."}
        ],
        returnFromDeptNoPrefix:[
            {name : "required", Message: "Return From Dept No Prefix is required"},
            { name: "maxlength", Message: "Return From Dept No Prefix should not be greater than 50 char." },
            { name: "pattern", Message: "Special char not allowed." }
        ],
        returnFromDeptNo:[
            {name : "required", Message: "Return From Dept No is required"},
            { name: "maxlength", Message: "Return From Dept No should not be greater than 30 char." },
            { name: "pattern", Message: "Only Numbers allowed."}
        ],
        pharSalCountId:[
            {name : "required", Message: "Phar Sales Cash Counter is required"}
        ],
        pharSalRecCountId:[
            {name : "required", Message: "Phar Sales Rec Cash Counter is required"}
        ],
        pharSalReturnCountId:[
            {name : "required", Message: "Phar Sales Return Cash Counter is required"}
        ],

    };
 }
 cashcounterId1=0;
 cashcounterId2=0;
 cashcounterId3=0;
 selectChangepharSalCountId(obj){
    console.log(obj);
    this.cashcounterId1=obj
 }


 selectChangepharSalRecCountId(obj){
    console.log(obj);
    this.cashcounterId2=obj
 }
 
 selectChangepharSalReturnCountId(obj){
    console.log(obj);
    this.cashcounterId3=obj
 }

}
