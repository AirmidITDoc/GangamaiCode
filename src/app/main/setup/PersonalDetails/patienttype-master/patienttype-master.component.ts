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
import { MatDialog } from "@angular/material/dialog";
import { NewpatientTypeMasterComponent } from "./newpatient-type-master/newpatient-type-master.component";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";

@Component({
    selector: "app-patienttype-master",
    templateUrl: "./patienttype-master.component.html",
    styleUrls: ["./patienttype-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PatienttypeMasterComponent implements OnInit {
    msg: any;
    sIsLoading: string = '';
    hasSelectedContacts: boolean;

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

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    // field validation 
    get f() { return this._PatientTypeService.myformSearch.controls; }


    constructor(
        public _PatientTypeService: PatienttypeMasterService,
        private accountService: AuthenticationService,
        public notification: NotificationServiceService,
        private _fuseSidebarService: FuseSidebarService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
    ) { }
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
            PatientType: this._PatientTypeService.myformSearch.get("PatientTypeSearch").value.trim() + "%" || "%",

        };
        // console.log(param)
        this._PatientTypeService.getPatientTypeMasterList(param).subscribe((Menu) => {
            this.DSPatientTypeMasterList.data = Menu as PatientTypeMaster[];
            this.DSPatientTypeMasterList.sort = this.sort;
            this.DSPatientTypeMasterList.paginator = this.paginator;
        });
    }

    newPatient() {
        const dialogRef = this._matDialog.open(NewpatientTypeMasterComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "30%",
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getPatientTypeMasterList();
        });
    }

    onEdit(row) {
        //     console.log(row);
        //     var m_data1 = {
        //         PatientTypeId: row.PatientTypeId,
        //         PatientType: row.PatientType.trim(),
        //         IsDeleted: JSON.stringify(row.IsActive),
        //         UpdatedBy: row.UpdatedBy,
        //     };
        //    // console.log(m_data1);
        //     this._PatientTypeService.populateForm(m_data1);
        const dialogRef = this._matDialog.open(NewpatientTypeMasterComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "30%",
                data: {
                    Obj: row
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getPatientTypeMasterList();
        });
    }

    onDeactive(PatientTypeId){
 debugger
            Swal.fire({
                title: 'Confirm Status',
                text: 'Are you sure you want to Change Status?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes,Change Status!'
            }).then((result) => {
                debugger
    
                if (result.isConfirmed) {
                    let Query;
                    const tableItem = this.DSPatientTypeMasterList.data.find(item => item.PatientTypeId === PatientTypeId);
                    console.log("table:", tableItem)
    
                    if (tableItem.IsActive) {
                        Query = "Update PatientTypeMaster set IsActive=0 where PatientTypeId=" + PatientTypeId;
                    } else {
                        Query = "Update PatientTypeMaster set IsActive=1 where PatientTypeId=" + PatientTypeId;
                    }
    
                    console.log("query:", Query);
    
                    this._PatientTypeService.deactivateTheStatus(Query)
                        .subscribe(
                            (data) => {
                                Swal.fire('Changed!', 'Patient Type Status has been Changed.', 'success');
                                this.getPatientTypeMasterList();
                            },
                            (error) => {
                                Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                            }
                        );
                }
    
            });
    }
}


export class PatientTypeMaster {
    PatientTypeId: number;
    PatientType: string;
    IsDeleted: boolean;
    IsActive: boolean;
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
            this.IsActive = PatientTypeMaster.IsActive || "";
        }
    }
}
