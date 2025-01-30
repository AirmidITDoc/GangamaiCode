import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { RelationshipMasterService } from "./relationship-master.service";
import { FuseUtils } from "@fuse/utils";
import { NotificationServiceService } from "app/core/notification-service.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { NewRelationshipMasterComponent } from "./new-relationship-master/new-relationship-master.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: "app-relationship-master",
    templateUrl: "./relationship-master.component.html",
    styleUrls: ["./relationship-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class RelationshipMasterComponent implements OnInit {
    RelationshipMasterList: any;
    msg: any;
    sIsLoading: string = '';
    hasSelectedContacts: boolean;

    displayedColumns: string[] = [
        "RelationshipId",
        "RelationshipName",
        // "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSRelationshipMasterList = new MatTableDataSource<RelationshipMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    // field validation 
    get f() { return this._relationshipService.myformSearch.controls; }

    constructor(
        public _relationshipService: RelationshipMasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,) { }

    onSearch() {
        this.getrelationshipMasterList();
    }

    onSearchClear() {
        this._relationshipService.myformSearch.reset({
            RelationshipNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getrelationshipMasterList();
    }

    ngOnInit(): void {
        this.getrelationshipMasterList();
    }

    newRelationship() {
        const dialogRef = this._matDialog.open(NewRelationshipMasterComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "30%",
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getrelationshipMasterList();
        });
    }

    getrelationshipMasterList() {
        var m_data = {
            RelativeName:
                this._relationshipService.myformSearch
                    .get("RelationshipNameSearch")
                    .value.trim() || "%",
        };

        this._relationshipService
            .getrelationshipMasterList(m_data)
            .subscribe((Menu) => {
                this.DSRelationshipMasterList.data =
                    Menu as RelationshipMaster[];
                this.DSRelationshipMasterList.sort = this.sort;
                this.DSRelationshipMasterList.paginator = this.paginator;
                console.log(this.DSRelationshipMasterList);
            });
    }

    onEdit(row) {
        // console.log(row);
        // var m_data = {
        //     RelationshipId: row.RelationshipId,
        //     RelationshipName: row.RelationshipName.trim(),
        //     IsDeleted: JSON.stringify(row.IsDeleted),
        //     UpdatedBy: row.UpdatedBy,
        // };
        // this._relationshipService.populateForm(m_data);
        const dialogRef = this._matDialog.open(NewRelationshipMasterComponent,
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
            this.getrelationshipMasterList();
        });
    }
      onDeactive(RelationshipId) {
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
                        const tableItem = this.DSRelationshipMasterList.data.find(item => item.RelationshipId === RelationshipId);
                        console.log("table:", tableItem)
        
                        if (tableItem.IsDeleted) {
                            Query = "Update M_RelationshipMaster set IsDeleted=0 where RelationshipId=" + RelationshipId;
                        } else {
                            Query = "Update M_RelationshipMaster set IsDeleted=1 where RelationshipId=" + RelationshipId;
                        }
        
                        console.log("query:", Query);
        
                        this._relationshipService.deactivateTheStatus(Query)
                            .subscribe(
                                (data) => {
                                    Swal.fire('Changed!', 'Relationship Status has been Changed.', 'success');
                                    this.getrelationshipMasterList();
                                },
                                (error) => {
                                    Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                                }
                            );
                    }
        
                });
            }
}

export class RelationshipMaster {
    RelationshipId: number;
    RelationshipName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param RelationshipMaster
     */
    constructor(RelationshipMaster) {
        {
            this.RelationshipId = RelationshipMaster.RelationshipId || "";
            this.RelationshipName = RelationshipMaster.RelationshipName || "";
            this.IsDeleted = RelationshipMaster.IsDeleted || "false";
            this.AddedBy = RelationshipMaster.AddedBy || "";
            this.UpdatedBy = RelationshipMaster.UpdatedBy || "";
        }
    }
}
