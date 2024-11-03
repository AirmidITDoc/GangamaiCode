import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CompanyMasterService } from "./company-master.service";
import { ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import { CompanyMasterListComponent } from "./company-master-list/company-master-list.component";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "app/core/services/authentication.service";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import {  MatDialogRef } from "@angular/material/dialog";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";



@Component({
    selector: "app-company-master",
    templateUrl: "./company-master.component.html",
    styleUrls: ["./company-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CompanyMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    

    gridConfig: gridModel = {
        apiUrl: "CompanyMaster/List",
        columnsList: [
            { heading: "Code", key: "companyId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "CompTypeId", key: "compTypeId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "City", key: "city", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "pinNo", key: "pinNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PhoneNo", key: "phoneNo", sort: true, align: 'left', emptySign: 'NA' },
           
           { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.confirmDialogRef = this._matDialog.open(
                                FuseConfirmDialogComponent,
                                {
                                    disableClose: false,
                                }
                            );
                            this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                            this.confirmDialogRef.afterClosed().subscribe((result) => {
                                if (result) {
                                    let that = this;
                                    this._CompanyMasterService.deactivateTheStatus(data.companyId).subscribe((response: any) => {
                                        this.toastr.success(response.message);
                                        that.grid.bindGridData();
                                    });
                                }
                                this.confirmDialogRef = null;
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "companyId",
        sortOrder: 0,
        filters: [
            { fieldName: "companyName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
    constructor(
        public _CompanyMasterService: CompanyMasterService,
        public _matDialog: MatDialog,
        private accountService: AuthenticationService,
        private _fuseSidebarService: FuseSidebarService,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {
        
    }

  onSave(row: any = null) {
        debugger
        let that = this;
        const dialogRef = this._matDialog.open(CompanyMasterListComponent,
            {
                maxWidth: "45vw",
                height: '35%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }
}