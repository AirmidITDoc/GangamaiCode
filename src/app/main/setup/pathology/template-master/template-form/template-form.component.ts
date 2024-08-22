import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TemplateServieService } from '../template-servie.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-template-form',
    templateUrl: './template-form.component.html',
    styleUrls: ['./template-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TemplateFormComponent implements OnInit {

    msg: any;
    registerObj: any;
    vTemplateName: any;
    vTemplateDesc: any;
    TemplateId: any;
    vTemplateId:any;

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
        public _TemplateServieService: TemplateServieService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
        private accountService: AuthenticationService,
        public dialogRef: MatDialogRef<TemplateFormComponent>
    ) { }

    ngOnInit(): void {
        if (this.data) {
            this.registerObj = this.data.registerObj;
            this.TemplateId = this.registerObj.TemplateId;
            this.vTemplateName = this.registerObj.TemplateName;
            this.vTemplateDesc = this.registerObj.TemplateDescInHTML;
            console.log(this.registerObj)
        }
    }


    onSubmit() {

debugger
        if ((this.vTemplateDesc == '' || this.vTemplateDesc == null || this.vTemplateDesc == undefined)) {
            this.toastr.warning('Please Enter valid Template ', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }
        if (this._TemplateServieService.myform.valid) {
            if (!this._TemplateServieService.myform.get("TemplateId").value) {
                let insertPathologyTemplateMaster = {};

                insertPathologyTemplateMaster['templateName'] = this._TemplateServieService.myform.get("TemplateName").value;
                insertPathologyTemplateMaster['TemplateDescInHTML'] =this.vTemplateDesc,// this._TemplateServieService.myform.get("TemplateName").value;
                insertPathologyTemplateMaster['templateDesc'] =this.vTemplateDesc, this._TemplateServieService.myform.get("TemplateDesc").value;
                insertPathologyTemplateMaster['addedBy'] = this.accountService.currentUserValue.user.id,
                    insertPathologyTemplateMaster['isDeleted'] =1// this._TemplateServieService.myform.get("IsDeleted").value

                let submitData = {
                    "insertPathologyTemplateMaster": insertPathologyTemplateMaster

                };
                console.log(submitData)
                this._TemplateServieService.insertTemplateMaster(submitData)
                    .subscribe((data) => {
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                            });

                            this.onClear();

                        } 
                    });
            } else {
                let updatePathologyTemplateMaster = {};
                updatePathologyTemplateMaster['templateId'] = this.TemplateId;
                updatePathologyTemplateMaster['templateName'] = this.vTemplateName;
                updatePathologyTemplateMaster['templateDesc'] = this.vTemplateDesc;
                updatePathologyTemplateMaster['TemplateDescInHTML'] = this.vTemplateDesc;
                updatePathologyTemplateMaster['updatedBy'] = this.accountService.currentUserValue.user.id;
                    updatePathologyTemplateMaster['isDeleted'] = 1// this._TemplateServieService.myform.get("IsDeleted").value;

                let submitData = {
                    "updatePathologyTemplateMaster": updatePathologyTemplateMaster
                };
                console.log(submitData)
                this._TemplateServieService.updateTemplateMaster(submitData).subscribe((data) => {
                    if (data) {
                        this.toastr.success('Record Updated Successfully.', 'Saved !', {
                            toastClass: 'tostr-tost custom-toast-success',
                        });

                        this.onClear();

                    }
                    
                });
            }
            this.onClose();
        }
    }

    onBlur(e: any) {
        this.vTemplateDesc = e.target.innerHTML;
    }


    onClear() {
        this._TemplateServieService.myform.reset();
    }

    onClose() {
        this._TemplateServieService.myform.reset();
        this.dialogRef.close();
    }
}
