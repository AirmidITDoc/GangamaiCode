import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { InstructionmasterService } from "./instructionmaster.service";
import Swal from "sweetalert2";

@Component({
    selector: "app-instructionmaster",
    templateUrl: "./instructionmaster.component.html",
    styleUrls: ["./instructionmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class InstructionmasterComponent implements OnInit {
    InstructionMasterList: any;

    msg: any;

    displayedColumns: string[] = [
        "InstructionId",
        "InstructionName",
        "IsDeleted",
        "action",
    ];

    DSInstructionMasterList = new MatTableDataSource<InstructionMaster>();

    constructor(public _InstructionService: InstructionmasterService) {}

    ngOnInit(): void {
        this.getInstructionMasterList();
    }

    getInstructionMasterList() {
        var param = {
            InstructionName:
                this._InstructionService.myformSearch
                    .get("InstructionNameSearch")
                    .value.trim() + "%" || "%",
        };
        this._InstructionService
            .getInstructionMasterList(param)
            .subscribe(
                (Menu) =>
                    (this.DSInstructionMasterList.data =
                        Menu as InstructionMaster[])
            );
    }
    onSearch() {
        this.getInstructionMasterList();
    }

    onSearchClear() {
        this._InstructionService.myformSearch.reset({
            InstructionNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getInstructionMasterList();
    }
    onClear() {
        this._InstructionService.myForm.reset({ IsDeleted: "false" });
        this._InstructionService.initializeFormGroup();
    }

    onSubmit() {
        if (this._InstructionService.myForm.valid) {
            if (!this._InstructionService.myForm.get("InstructionId").value) {
                var m_data = {
                    insertInstructionMaster: {
                        instructionName: this._InstructionService.myForm
                            .get("InstructionName")
                            .value.trim(),

                        isActive: Boolean(
                            JSON.parse(
                                this._InstructionService.myForm.get("IsDeleted")
                                    .value
                            )
                        ),
                        // addedBy: 1,
                    },
                };
                this._InstructionService
                    .insertInstructionMaster(m_data)
                    .subscribe((data) => {
                        this.msg = m_data;
                        if (data) {
                            Swal.fire(
                                "Saved !",
                                "Record saved Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getInstructionMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not saved",
                                "error"
                            );
                        }
                        this.getInstructionMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    updateInstructionMaster: {
                        instructionId:
                            this._InstructionService.myForm.get("InstructionId")
                                .value,
                        instructionName: this._InstructionService.myForm
                            .get("InstructionName")
                            .value.trim(),

                        isActive: Boolean(
                            JSON.parse(
                                this._InstructionService.myForm.get("IsDeleted")
                                    .value
                            )
                        ),
                        // updatedBy: 1,
                    },
                };
                this._InstructionService
                    .updateInstructionMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = m_dataUpdate;
                        if (data) {
                            Swal.fire(
                                "Updated !",
                                "Record updated Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getInstructionMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not updated",
                                "error"
                            );
                        }
                        this.getInstructionMasterList();
                    });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data1 = {
            InstructionId: row.InstructionId,
            InstructionName: row.InstructionName.trim(),
            IsDeleted: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
        };
        console.log(m_data1);
        this._InstructionService.populateForm(m_data1);
    }
}
export class InstructionMaster {
    InstructionId: number;
    InstructionName: string;

    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param InstructionMaster
     */
    constructor(InstructionMaster) {
        {
            this.InstructionId = InstructionMaster.InstructionId || "";
            this.InstructionName = InstructionMaster.InstructionName || "";

            this.IsDeleted = InstructionMaster.IsDeleted || "false";
            this.AddedBy = InstructionMaster.AddedBy || "";
            this.UpdatedBy = InstructionMaster.UpdatedBy || "";
        }
    }
}
