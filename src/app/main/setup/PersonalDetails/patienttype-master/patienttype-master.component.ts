import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { NotificationServiceService } from "app/core/notification-service.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { PatienttypeMasterService } from "./patienttype-master.service";

@Component({
    selector: "app-patienttype-master",
    templateUrl: "./patienttype-master.component.html",
    styleUrls: ["./patienttype-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PatienttypeMasterComponent implements OnInit {
    PatientTypeMasterList: any;
    msg: any;

    displayedColumns: string[] = [
        "PatientTypeId",
        "PatientType",
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    dataSource = new MatTableDataSource<PatientTypeMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        public _PatientTypeService: PatienttypeMasterService,
        private accountService: AuthenticationService,
        public notification: NotificationServiceService
    ) {}

    ngOnInit(): void {
        this.getPatientTypeMasterList();
    }
    getPatientTypeMasterList() {
        this._PatientTypeService
            .getPatientTypeMasterList()
            .subscribe(
                (Menu) => (this.dataSource.data = Menu as PatientTypeMaster[])
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
                        PatientType: this._PatientTypeService.myForm
                            .get("PatientType")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._PatientTypeService.myForm.get("IsDeleted")
                                    .value
                            )
                        ),
                        AddedBy: this.accountService.currentUserValue.user.id,
                    },
                };
                this._PatientTypeService
                    .patientTypeMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getPatientTypeMasterList();
                    });
                this.notification.success("Record added successfully");
            } else {
                var m_dataUpdate = {
                    patientTypeMasterUpdate: {
                        PatientTypeId:
                            this._PatientTypeService.myForm.get("PatientTypeId")
                                .value,
                        PatientType: this._PatientTypeService.myForm
                            .get("PatientType")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._PatientTypeService.myForm.get("IsDeleted")
                                    .value
                            )
                        ),
                        UpdatedBy: this.accountService.currentUserValue.user.id,
                    },
                };
                this._PatientTypeService
                    .patientTypeMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = m_dataUpdate;
                        this.getPatientTypeMasterList();
                    });
                this.notification.success("Record updated successfully");
            }
            this.onClear();
        }
    }
    onEdit(row) {
        // console.log(row);
        var m_data1 = {
            PatientTypeId: row.PatientTypeId,
            PatientType: row.PatientType.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
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
    AddedByName: string;

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
            this.AddedByName = PatientTypeMaster.AddedByName || "";
        }
    }
}
