import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { TemplatemasterService } from "../templatemaster.service";

@Component({
    selector: "app-pathology-template-form",
    templateUrl: "./pathology-template-form.component.html",
    styleUrls: ["./pathology-template-form.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PathologyTemplateFormComponent implements OnInit {
    msg: any;
    registerObj:any;
    vTemplateName:any;
    vTemplateDesc:any;
    
    constructor(
        public _templateService: TemplatemasterService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<PathologyTemplateFormComponent>
    ) {}

    ngOnInit(): void {
        if (this.data) {
            this.registerObj = this.data.registerObj; 
           this.vTemplateName = this.registerObj.TemplateName;
            this.vTemplateDesc = this.registerObj.TemplateDesc;
        }
    }
   

    onSubmit() {
        if (this._templateService.myform.valid) {
            if (!this._templateService.myform.get("TemplateId").value) {
                var m_data = {
                    insertPathologyTemplateMaster: {
                        testId: 0,
                        templateId:this._templateService.myform.get("TemplateId").value,
                    },
                };
                console.log(m_data)

                this._templateService.insertTemplateMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                    });
            } else {
                var m_dataUpdate = {
                    updatePathologyTemplateMaster: {
                        PTemplateId:
                            this._templateService.myform.get("PTemplateId")
                                .value,
                        testId: this._templateService.myform.get("TestId")
                            .value,
                        templateId:
                            this._templateService.myform.get("TemplateId")
                                .value,
                    },
                };

                this._templateService
                    .updateTemplateMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                    });
            }
            this.onClose();
        }
    }
    // onEdit(row) {
    //     var m_data = {
    //         TemplateId: row.TemplateId,
    //         TestId: row.TestId,
    //         PTemplateId: row.PTemplateId,
    //     };
    //     this._templateService.populateForm(m_data);
    // }

    onClear() {
        this._templateService.myform.reset();
    }

    onClose() {
       this._templateService.myform.reset();
        this.dialogRef.close();
    }
}
