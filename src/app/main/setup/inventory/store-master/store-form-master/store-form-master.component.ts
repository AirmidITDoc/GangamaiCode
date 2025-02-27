import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { StoreMasterService } from "../store-master.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { FormGroup } from "@angular/forms";
import { StoreMaster } from "../store-master.component";


@Component({
    selector: "app-store-form-master",
    templateUrl: "./store-form-master.component.html",
    styleUrls: ["./store-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class StoreFormMasterComponent implements OnInit {

    // editordoc = jsonDoc;

//   editor: Editor;
//   toolbar: Toolbar = [
//     ['bold', 'italic'],
//     ['underline', 'strike'],
//     ['code', 'blockquote'],
//     ['ordered_list', 'bullet_list'],
//     [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
//     ['link', 'image'],
//     ['text_color', 'background_color'],
//     ['align_left', 'align_center', 'align_right', 'align_justify'],
//   ];

    // onBlur(e: any) {
    //     this.Header = e.target.innerHTML;
    // }

    onBlur(e: any) {
        this.vTemplateDesc = e.target.innerHTML;
        throw new Error('Method not implemented.');
    }

    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '24rem',
        minHeight: '24rem',
        translate: 'yes',
        placeholder: 'Enter text here...',
        enableToolbar: true,
        showToolbar: true,
    };

    vTemplateDesc: any;
    storeForm: FormGroup;
    isActive: boolean = true;
    registerObj = new StoreMaster({});
    autocompleteModeCashcounter: string = "CashCounter";
    
    constructor(
        public _StoreMasterService: StoreMasterService,
        public dialogRef: MatDialogRef<StoreFormMasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.storeForm = this._StoreMasterService.createStoremasterForm();

        console.log(this.data)
        if((this.data?.storeId??0) > 0)
        {
            this.isActive =this.data.isActive
            this.storeForm.patchValue(this.data);
            this.vTemplateDesc = this.data.templateDesc;
            
            setTimeout(() => {
                this._StoreMasterService.getStoreById(this.data.storeId).subscribe((response) => {
                    this.registerObj = response;
                    console.log(this.registerObj)  
                   });
            }, 500);
        }

    }


    onSubmit() {
        
        // if (!this.storeForm.invalid) {
            console.log("StoreCategoryMaster Insert:", this.storeForm.value)
            debugger
            this._StoreMasterService.storeMasterSave(this.storeForm.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        // }
        // else {
        //     this.toastr.warning('please check from is invalid', 'Warning !', {
        //         toastClass: 'tostr-tost custom-toast-warning',
        //     });
        //     return;
        // }
    }

    onClear(val: boolean) {
        this.storeForm.reset();
        this.dialogRef.close(val);
    }

    cashcounterId1 = 0;
    cashcounterId2 = 0;
    cashcounterId3 = 0;
    selectChangepharSalCountId(obj) {
        console.log(obj);
        this.cashcounterId1 = obj
    }


    selectChangepharSalRecCountId(obj) {
        console.log(obj);
        this.cashcounterId2 = obj
    }

    selectChangepharSalReturnCountId(obj) {
        console.log(obj);
        this.cashcounterId3 = obj
    }

    getValidationMessages() {
        return {
            storeName: [
                { name: "required", Message: "storeName  is required" },
                { name: "maxlength", Message: "storeName  should not be greater than 50 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ],
            storeShortName: [
                { name: "required", Message: "storeShortName is required" },
                { name: "maxlength", Message: "storeShortName should not be greater than 50 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ],
            indentPrefix: [
                { name: "required", Message: "Indent Prefix is required" },
                { name: "maxlength", Message: "Indent Prefix should not be greater than 50 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ],
            indentNo: [
                { name: "required", Message: "Indent No is required" },
                { name: "maxlength", Message: "Indent No should not be greater than 30 Numbers." },
                { name: "pattern", Message: "Only Numbers allowed." }
            ],
            grnreturnNoPrefix: [
                { name: "required", Message: "GRN Return No Prefix is required" },
                { name: "maxlength", Message: "GRN Return No Prefix should not be greater than 50 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ],
            grnreturnNo: [
                { name: "required", Message: "GRN Return No is required" },
                { name: "maxlength", Message: "GRN Return No should not be greater than 30 Numbers." },
                { name: "pattern", Message: "Only Numbers allowed." }
            ],
            purchasePrefix: [
                { name: "required", Message: "Purchase Prefix is required" },
                { name: "maxlength", Message: "Purchase Prefix should not be greater than 50 char." },
                { name: "pattern", Message: "Only Characters allowed." }
            ],
            purchaseNo: [
                { name: "required", Message: "Purchase No is required" },
                { name: "maxlength", Message: "Purchase No should not be greater than 30 char." },
                { name: "pattern", Message: "Only Numbers allowed." }
            ],
            issueToDeptPrefix: [
                { name: "required", Message: "Issue to Dept Prefix is required" },
                { name: "maxlength", Message: "Indent Prefix should not be greater than 50 char." },
                { name: "pattern", Message: "Only Characters allowed." }
            ],
            issueToDeptNo: [
                { name: "required", Message: "Issue to Dept No is required" },
                { name: "maxlength", Message: "Issue to Dept No should not be greater than 30 char." },
                { name: "pattern", Message: "Only Numbers allowed." }
            ],
            grnPrefix: [
                { name: "required", Message: "GRN Prefix is required" },
                { name: "maxlength", Message: "GRN Prefix should not be greater than 50 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ],
            grnNo: [
                { name: "required", Message: "GRN No is required" },
                { name: "maxlength", Message: "GRN No should not be greater than 30 char." },
                { name: "pattern", Message: "Only Numbers allowed." }
            ],
            returnFromDeptNoPrefix: [
                { name: "required", Message: "Return From Dept No Prefix is required" },
                { name: "maxlength", Message: "Return From Dept No Prefix should not be greater than 50 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ],
            returnFromDeptNo: [
                { name: "required", Message: "Return From Dept No is required" },
                { name: "maxlength", Message: "Return From Dept No should not be greater than 30 char." },
                { name: "pattern", Message: "Only Numbers allowed." }
            ],
            pharSalCountId: [
                { name: "required", Message: "Phar Sales Cash Counter is required" }
            ],
            pharSalRecCountId: [
                { name: "required", Message: "Phar Sales Rec Cash Counter is required" }
            ],
            pharSalReturnCountId: [
                { name: "required", Message: "Phar Sales Return Cash Counter is required" }
            ],

        };
    }
    
}
