import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
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

    
    constructor(
        public _templateService: TemplatemasterService,
        public dialogRef: MatDialogRef<PathologyTemplateFormComponent>
    ) {}

    ngOnInit(): void {
        
    }

    onSubmit() {
        if (this._templateService.newTemplateFrom.valid) {
            if (!this._templateService.newTemplateFrom.get("TemplateId").value) {
                var m_data = {
                    insertPathologyTemplateMaster: {
                        TemplateName: this._templateService.newTemplateFrom.get("TemplateName").value,
                        TemplateDesc:this._templateService.newTemplateFrom.get("TemplateDetails").value,
                        IsDeleted:this._templateService.newTemplateFrom.get("IsDeleted").value,
                        AddedBy:1
                    },
                };
                console.log(m_data)

                this._templateService
                    .insertTemplateMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                    });
            } else {
                var m_dataUpdate = {
                    updatePathologyTemplateMaster: {
                        PTemplateId:
                            this._templateService.myform.get("PTemplateId")
                                .value,
                        TestId: this._templateService.myform.get("TestId")
                            .value,
                        TemplateId:
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
    onEdit(row) {
        var m_data = {
            TemplateId: row.TemplateId,
            TestId: row.TestId,
            PTemplateId: row.PTemplateId,
        };
        this._templateService.populateForm(m_data);
    }

    onClear() {
        this._templateService.myform.reset();
    }

    onClose() {
       this._templateService.myform.reset();
        this.dialogRef.close();
    }
}
