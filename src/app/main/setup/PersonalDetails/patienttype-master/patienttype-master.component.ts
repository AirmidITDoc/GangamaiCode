import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { NotificationServiceService } from "app/core/notification-service.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { PatienttypeMasterService } from "./patienttype-master.service";
import Swal from "sweetalert2";

@Component({
    selector: "app-patienttype-master",
    templateUrl: "./patienttype-master.component.html",
    styleUrls: ["./patienttype-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PatienttypeMasterComponent implements OnInit {
    msg: any;

    displayedColumns: string[] = [
        "PatientTypeId",
        "PatientType",
        //   "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSPatientTypeMasterList = new MatTableDataSource<PatientTypeMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        public _PatientTypeService: PatienttypeMasterService,
        private accountService: AuthenticationService,
        public notification: NotificationServiceService
    ) {}
    onSearch() {
        this.getPatientTypeMasterList();
    }

    onSearchClear() {
        this._PatientTypeService.myformSearch.reset({
            PatientTypeSearch: "",
            IsDeletedSearch: "2",
        });
        this.getPatientTypeMasterList();
    }
    ngOnInit(): void {
        this.getPatientTypeMasterList();
    }
    getPatientTypeMasterList() {
        var param = {
            PatientType:
                this._PatientTypeService.myformSearch
                    .get("PatientTypeSearch")
                    .value.trim() || "%",
        };
        this._PatientTypeService
            .getPatientTypeMasterList(param)
            .subscribe(
                (Menu) =>
                    (this.DSPatientTypeMasterList.data =
                        Menu as PatientTypeMaster[])
            );
    }

    onClear() {
        this._PatientTypeService.myForm.reset({ IsDeleted: "false" });
        this._PatientTypeService.initializeFormGroup();
    }

    onSubmit() {
        if (this._PatientTypeService.myForm.valid) {
            if (!this._PatientTypeService.myForm.get("PatientTypeId").value) {
                var m_data = {
                    patientTypeMasterInsert: {
                        patientType: this._PatientTypeService.myForm
                            .get("PatientType")
                            .value.trim(),
                        addedBy: 1,
                        isActive: Boolean(
                            JSON.parse(
                                this._PatientTypeService.myForm.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };
                this._PatientTypeService
                    .patientTypeMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Saved !",
                                "Record saved Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getPatientTypeMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not saved",
                                "error"
                            );
                        }
                        this.getPatientTypeMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    patientTypeMasterUpdate: {
                        patientTypeID:
                            this._PatientTypeService.myForm.get("PatientTypeId")
                                .value,
                        patientType: this._PatientTypeService.myForm
                            .get("PatientType")
                            .value.trim(),
                        isActive: Boolean(
                            JSON.parse(
                                this._PatientTypeService.myForm.get("IsDeleted")
                                    .value
                            )
                        ),
                        updatedBy: 1,
                    },
                };
                this._PatientTypeService
                    .patientTypeMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = m_dataUpdate;
                        if (data) {
                            Swal.fire(
                                "Updated !",
                                "Record updated Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getPatientTypeMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not updated",
                                "error"
                            );
                        }
                        this.getPatientTypeMasterList();
                    });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data1 = {
            PatientTypeId: row.PatientTypeId,
            PatientType: row.PatientType.trim(),
            IsDeleted: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
        };
        console.log(m_data1);
        this._PatientTypeService.populateForm(m_data1);
    }
}

export class PatientTypeMaster {
    PatientTypeId: number;
    PatientType: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param PatientTypeMaster
     */
    constructor(PatientTypeMaster) {
        {
            this.PatientTypeId = PatientTypeMaster.PatientTypeId || "";
            this.PatientType = PatientTypeMaster.PatientType || "";
            this.IsDeleted = PatientTypeMaster.IsDeleted || "false";
            this.AddedBy = PatientTypeMaster.AddedBy || "";
            this.UpdatedBy = PatientTypeMaster.UpdatedBy || "";
        }
    }
}
