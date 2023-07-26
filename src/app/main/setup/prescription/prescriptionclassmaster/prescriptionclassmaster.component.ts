import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { PrescriptionclassmasterService } from "./prescriptionclassmaster.service";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";

@Component({
    selector: "app-prescriptionclassmaster",
    templateUrl: "./prescriptionclassmaster.component.html",
    styleUrls: ["./prescriptionclassmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PrescriptionclassmasterComponent implements OnInit {
    PrescriptionclassMasterList: any;
    msg: any;

    displayedColumns: string[] = [
        "TemplateId",
        "TemplateName",
        "TemplateDesc",
        "IsDeleted",
        "AddedByName",
        "action",
    ];

    DSPrescriptionClassMasterList =
        new MatTableDataSource<PrescriptionClassMaster>();

    constructor(
        public _PrescriptionclassService: PrescriptionclassmasterService
    ) {}

    ngOnInit(): void {
        this.getPrescriptionclassMasterList();
    }
    onSearch() {
        this.getPrescriptionclassMasterList();
    }

    onSearchClear() {
        this._PrescriptionclassService.myformSearch.reset({
            TemplateNameSearch: "",
            IsDeletedSearch: "2",
        });
    }
    getPrescriptionclassMasterList() {
        this._PrescriptionclassService
            .getPrescriptionclassMasterList()
            .subscribe(
                (Menu) =>
                    (this.DSPrescriptionClassMasterList.data =
                        Menu as PrescriptionClassMaster[])
            );
    }

    onClear() {
        this._PrescriptionclassService.myForm.reset({ IsDeleted: "false" });
        this._PrescriptionclassService.initializeFormGroup();
    }

    onSubmit() {
        if (this._PrescriptionclassService.myForm.valid) {
            if (
                !this._PrescriptionclassService.myForm.get("TemplateId").value
            ) {
                var m_data = {
                    prescriptionTemplateMasterInsert: {
                        templateName: this._PrescriptionclassService.myForm
                            .get("TemplateName")
                            .value.trim(),
                        templateDesc: this._PrescriptionclassService.myForm
                            .get("TemplateDesc")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._PrescriptionclassService.myForm.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                        addedBy: 1,
                    },
                };
                this._PrescriptionclassService
                    .prescriptionTemplateMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = m_data;
                        if (data) {
                            Swal.fire(
                                "Saved !",
                                "Record saved Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getPrescriptionclassMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not saved",
                                "error"
                            );
                        }
                        this.getPrescriptionclassMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    prescriptionTemplateMasterUpdate: {
                        templateId:
                            this._PrescriptionclassService.myForm.get(
                                "TemplateId"
                            ).value,
                        templateName: this._PrescriptionclassService.myForm
                            .get("TemplateName")
                            .value.trim(),
                        templateDesc: this._PrescriptionclassService.myForm
                            .get("TemplateDesc")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._PrescriptionclassService.myForm.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                        updatedBy: 1,
                    },
                };
                this._PrescriptionclassService
                    .prescriptionTemplateMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = m_dataUpdate;
                        if (data) {
                            Swal.fire(
                                "Updated !",
                                "Record updated Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getPrescriptionclassMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not updated",
                                "error"
                            );
                        }
                        this.getPrescriptionclassMasterList();
                    });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        // console.log(row);
        var m_data1 = {
            TemplateId: row.TemplateId,
            TemplateName: row.TemplateName.trim(),
            TemplateDesc: row.TemplateDesc.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        console.log(m_data1);
        this._PrescriptionclassService.populateForm(m_data1);
    }
}
export class PrescriptionClassMaster {
    TemplateId: number;
    TemplateName: string;
    TemplateDesc: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param PrescriptionClassMaster
     */
    constructor(PrescriptionClassMaster) {
        {
            this.TemplateId = PrescriptionClassMaster.TemplateId || "";
            this.TemplateName = PrescriptionClassMaster.TemplateName || "";
            this.TemplateDesc = PrescriptionClassMaster.TemplateDesc || "";
            this.IsDeleted = PrescriptionClassMaster.IsDeleted || "false";
            this.AddedBy = PrescriptionClassMaster.AddedBy || "";
            this.UpdatedBy = PrescriptionClassMaster.UpdatedBy || "";
            this.AddedByName = PrescriptionClassMaster.AddedByName || "";
        }
    }
}
