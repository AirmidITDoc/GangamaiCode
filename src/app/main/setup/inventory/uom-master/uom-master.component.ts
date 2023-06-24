import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { UomMasterService } from "./uom-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";

@Component({
    selector: "app-uom-master",
    templateUrl: "./uom-master.component.html",
    styleUrls: ["./uom-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class UomMasterComponent implements OnInit {
    msg: any;

    displayedColumns: string[] = [
        "UnitofMeasurementId",
        "UnitofMeasurementName",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSUnitofmeasurementList = new MatTableDataSource<UnitofmeasurementMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _unitofmeasurementService: UomMasterService) {}

    ngOnInit(): void {
        this.getUnitofmeasurementMasterList();
    }
    onSearch() {
        this.getUnitofmeasurementMasterList();
    }

    onSearchClear() {
        this._unitofmeasurementService.myformSearch.reset({
            UnitofMeasurementSearch: "",
            IsDeletedSearch: "2",
        });
    }
    getUnitofmeasurementMasterList() {
        var param = { UnitofMeasurmentName: "%" };
        this._unitofmeasurementService
            .getUnitofmeasurementMasterList(param)
            .subscribe((Menu) => {
                this.DSUnitofmeasurementList.data =
                    Menu as UnitofmeasurementMaster[];
                this.DSUnitofmeasurementList.sort = this.sort;
                this.DSUnitofmeasurementList.paginator = this.paginator;
            });
    }

    onClear() {
        this._unitofmeasurementService.myform.reset({ IsDeleted: "false" });
        this._unitofmeasurementService.initializeFormGroup();
    }

    onSubmit() {
        if (this._unitofmeasurementService.myform.valid) {
            if (
                !this._unitofmeasurementService.myform.get(
                    "UnitofMeasurementId"
                ).value
            ) {
                var m_data = {
                    insertUnitofMeasurementMaster: {
                        unitofMeasurementName:
                            this._unitofmeasurementService.myform
                                .get("UnitofMeasurementName")
                                .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._unitofmeasurementService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                        addedBy: 1,
                    },
                };

                this._unitofmeasurementService
                    .insertUnitofMeasurementMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Saved !",
                                "Record saved Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getUnitofmeasurementMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not saved",
                                "error"
                            );
                        }
                        this.getUnitofmeasurementMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    updateUnitofMeasurementMaster: {
                        unitofMeasurementId:
                            this._unitofmeasurementService.myform.get(
                                "UnitofMeasurementId"
                            ).value,
                        unitofMeasurementName:
                            this._unitofmeasurementService.myform
                                .get("UnitofMeasurementName")
                                .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._unitofmeasurementService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                        updatedBy: 1,
                    },
                };

                this._unitofmeasurementService
                    .updateUnitofMeasurementMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Updated !",
                                "Record updated Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getUnitofmeasurementMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not updated",
                                "error"
                            );
                        }
                        this.getUnitofmeasurementMasterList();
                    });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            UnitofMeasurementId: row.UnitofMeasurementId,
            UnitofMeasurementName: row.UnitofMeasurementName,
            UpdatedBy: row.UpdatedBy,
        };
        this._unitofmeasurementService.populateForm(m_data);
    }
}
export class UnitofmeasurementMaster {
    UnitofMeasurementId: number;
    UnitofMeasurementName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param UnitofmeasurementMaster
     */
    constructor(UnitofmeasurementMaster) {
        {
            this.UnitofMeasurementId =
                UnitofmeasurementMaster.UnitofMeasurementId || "";
            this.UnitofMeasurementName =
                UnitofmeasurementMaster.UnitofMeasurementName || "";
            this.IsDeleted = UnitofmeasurementMaster.IsDeleted || "false";
            this.AddedBy = UnitofmeasurementMaster.AddedBy || "";
            this.UpdatedBy = UnitofmeasurementMaster.UpdatedBy || "";
        }
    }
}
