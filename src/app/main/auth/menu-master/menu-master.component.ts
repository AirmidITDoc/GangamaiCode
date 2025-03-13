import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes, gridActions } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { MenuMasterService } from './menu-master.service';
import { NewMenuComponent } from './new-menu/new-menu.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-menu-master',
    templateUrl: './menu-master.component.html',
    styleUrls: ['./menu-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class MenuMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "MenuMaster/MenuMasterList",
        columnsList: [
            { heading: "Code", key: "id", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UpId", key: "upId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "MenuName", key: "linkName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "Icon", key: "icon", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Action", key: "linkAction", sort: true, align: 'left', emptySign: 'NA', width: 300 },
            { heading: "Sort Order", key: "sortOrder", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsBlock", key: "isDisplay", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Permission Code", key: "permissionCode", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "Table Names", key: "tableNames", sort: true, align: 'left', emptySign: 'NA', width: 250 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", width: 100, type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._MenuMasterService.deactivateTheStatus(data.id).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "UpId",
        sortOrder: 0,
        filters: [
            // { fieldName: "Id", fieldValue: "217", opType: OperatorComparer.Equals },
            // { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            // { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }
        ]
    }

    constructor(
        public _MenuMasterService: MenuMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewMenuComponent,
            {
                maxWidth: "55vw",
                maxHeight: '65vh',
                width: '100%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }
}
