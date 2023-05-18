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

    // editorConfig: AngularEditorConfig = {
    //     editable: true,
    //     spellcheck: true,
    //     height: "auto",
    //     minHeight: "0",
    //     maxHeight: "auto",
    //     width: "auto",
    //     minWidth: "0",
    //     translate: "yes",
    //     enableToolbar: true,
    //     showToolbar: true,
    //     placeholder: "Enter text here...",
    //     defaultParagraphSeparator: "",
    //     defaultFontName: "",
    //     defaultFontSize: "",
    //     fonts: [
    //         { class: "arial", name: "Arial" },
    //         { class: "times-new-roman", name: "Times New Roman" },
    //         { class: "calibri", name: "Calibri" },
    //         { class: "comic-sans-ms", name: "Comic Sans MS" },
    //     ],
    //     customClasses: [
    //         {
    //             name: "quote",
    //             class: "quote",
    //         },
    //         {
    //             name: "redText",
    //             class: "redText",
    //         },
    //         {
    //             name: "titleText",
    //             class: "titleText",
    //             tag: "h1",
    //         },
    //     ],
    //     uploadUrl: "v1/image",
    //     uploadWithCredentials: false,
    //     sanitize: true,
    //     toolbarPosition: "top",
    //     toolbarHiddenButtons: [["bold", "italic"], ["fontSize"]],
    // };
    constructor(
        public _templateService: TemplatemasterService,

        public dialogRef: MatDialogRef<PathologyTemplateFormComponent>
    ) {}

    ngOnInit(): void {
        // this.editor = new Editor();
    }

    onSubmit() {
        if (this._templateService.myform.valid) {
            if (!this._templateService.myform.get("TemplateId").value) {
                var m_data = {
                    insertPathologyTemplateMaster: {
                        TestId: this._templateService.myform.get("TestId")
                            .value,
                        TemplateId:
                            this._templateService.myform.get("TemplateId")
                                .value,
                    },
                };

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
