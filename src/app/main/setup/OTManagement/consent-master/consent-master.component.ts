import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { ConsentMasterService } from './consent-master.service';
import { NewConsentMasterComponent } from './new-consent-master/new-consent-master.component';

@Component({
    selector: 'app-consent-master',
    templateUrl: './consent-master.component.html',
    styleUrls: ['./consent-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ConsentMasterComponent implements OnInit {
    msg: any;
    consentName: any = "";
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.SetupOTConsent, permissionType.Add);

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    allColumns = [
        // { heading: "Code", key: "consentId", sort: true, align: 'left', emptySign: 'NA' ,width:150},
        { heading: "OT Consent Name", key: "consentName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Consent Desc ", key: "consentDesc", sort: true, align: 'left', emptySign: 'NA', width: 350 },
        { heading: "Department Name", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Consent Type", key: "value", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "isActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.SetupOTConsent, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.SetupOTConsent, permissionType.Delete), callback: (data: any) => {
                        this._ConsentMasterService.deactivateTheStatus(data.consentId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ]
    allFilters = [
        { fieldName: "isActive", fieldValue: "2", opType: OperatorComparer.Equals },
        { fieldName: "ConsentName", fieldValue: "", opType: OperatorComparer.StartsWith },
    ]
    gridConfig: gridModel = {
        permissionCode: permissionCodes.SetupOTConsent,
        apiUrl: "ConsentMaster/List",
        columnsList: this.allColumns,
        sortField: "ConsentId",
        sortOrder: 0,
        filters: this.allFilters
    }

    constructor(
        public _ConsentMasterService: ConsentMasterService,
        public permissionService: PagePermissionService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewConsentMasterComponent,
            {
                maxWidth: "90vw",
                maxHeight: '85%',
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
