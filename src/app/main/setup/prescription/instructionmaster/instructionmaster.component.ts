import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { InstructionmasterService } from "./instructionmaster.service";

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

        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSInstructionMasterList = new MatTableDataSource<InstructionMaster>();

    constructor(public _InstructionService: InstructionmasterService) {}

    ngOnInit(): void {
        this.getInstructionMasterList();
    }

    getInstructionMasterList() {
        this._InstructionService
            .getInstructionMasterList()
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
                        InstructionName: this._InstructionService.myForm
                            .get("InstructionName")
                            .value.trim(),

                        IsDeleted: Boolean(
                            JSON.parse(
                                this._InstructionService.myForm.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };
                this._InstructionService
                    .insertInstructionMaster(m_data)
                    .subscribe((data) => {
                        this.msg = m_data;
                        this.getInstructionMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    updateInstructionMaster: {
                        InstructionId:
                            this._InstructionService.myForm.get("InstructionId")
                                .value,
                        InstructionName: this._InstructionService.myForm
                            .get("InstructionName")
                            .value.trim(),

                        IsDeleted: Boolean(
                            JSON.parse(
                                this._InstructionService.myForm.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };
                this._InstructionService
                    .updateInstructionMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = m_dataUpdate;
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
            IsDeleted: JSON.stringify(row.IsDeleted),
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
    AddedByName: string;

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
            this.AddedByName = InstructionMaster.AddedByName || "";
        }
    }
}
