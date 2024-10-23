import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { NotificationServiceService } from "app/core/notification-service.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { PatienttypeMasterService } from "./patienttype-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { NewPatientTypeComponent } from "./new-patient-type/new-patient-type.component";



@Component({
    selector: "app-patienttype-master",
    templateUrl: "./patienttype-master.component.html",
    styleUrls: ["./patienttype-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PatienttypeMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "Gender/List",
        columnsList: [
            { heading: "Code", key: "genderId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Gender Name", key: "genderName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            debugger
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            debugger
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "genderId",
        sortOrder: 0,
        filters: [
            { fieldName: "genderName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }
    constructor(
        public _PatientTypeService: PatienttypeMasterService, public _matDialog: MatDialog,
        private accountService: AuthenticationService,
        public notification: NotificationServiceService,
        public toastr : ToastrService,
    ) {}
    onSearch() {
        
    }

    onSearchClear() {
        this._PatientTypeService.myformSearch.reset({
            PatientTypeSearch: "",
            IsDeletedSearch: "2",
        });
        
    }
    ngOnInit(): void {
        
    }
  

  

    onClear() {
        this._PatientTypeService.myForm.reset({ IsDeleted: "false" });
        this._PatientTypeService.initializeFormGroup();
    }
 

   
    onEdit(row) {
        console.log(row);
        var m_data1 = {
            PatientTypeId: row.PatientTypeId,
            PatientType: row.PatientType.trim(),
            IsDeleted: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
        };
       // console.log(m_data1);
        this._PatientTypeService.populateForm(m_data1);
    }

    changeStatus(status: any) {
        switch (status.id) {
            case 1:
                //this.onEdit(status.data)
                break;
            case 2:
                this.onEdit(status.data)
                break;
            case 5:
                this.onDeactive(status.data.genderId);
                break;
            default:
                break;
        }
    }
  
    onDeactive(genderId) {
        debugger
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage =
            "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            debugger
            if (result) {
                this._PatientTypeService.deactivateTheStatus(genderId).subscribe((data: any) => {
                   
                    if (data.StatusCode == 200) {
                        this.toastr.success(
                            "Record updated Successfully.",
                            "updated !",
                            {
                                toastClass:
                                    "tostr-tost custom-toast-success",
                            }
                        );
                        // this.getGenderMasterList();
                    }
                });
            }
            this.confirmDialogRef = null;
        });
    }

    newnewpatienttypemaster() {
        const dialogRef = this._matDialog.open(NewPatientTypeComponent,
            {
                maxWidth: "45vw",
                height: '35%',
                width: '70%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);

        });
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
