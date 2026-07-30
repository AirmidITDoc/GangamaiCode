import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HsncodeserviceService } from './hsncodeservice.service';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { NewHsncodeComponent } from './new-hsncode/new-hsncode.component';
import { MatDialog } from '@angular/material/dialog';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-hsncode-maser',
    templateUrl: './hsncode-maser.component.html',
    styleUrls: ['./hsncode-maser.component.scss'],
        encapsulation: ViewEncapsulation.None,
        animations: fuseAnimations,
})
export class HSNCODEMaserComponent {
    // IsAdd: boolean = this.permissionService.getPermission(permissionCodes.ItemCategoryMaster, permissionType.Add);
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    }
    allcolumns = [
        { heading: "HSNCODE", key: "hsncodeName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "GST", key: "gstRate", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Unit", key: "unitOfMeasure", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Effective From ", key: "effectiveFrom", sort: true, align: 'left', emptySign: 'NA', type: 6 },
        { heading: "Effective To", key: "effectiveTo", sort: true, align: 'left', emptySign: 'NA', type: 6 },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]

    allfilters = [
        { fieldName: "HsncodeName", fieldValue: "", opType: OperatorComparer.StartsWith }
    ]
    gridConfig: gridModel = {
        // permissionCode: permissionCodes.ItemCategoryMaster,
        apiUrl: "HSNCodeMaster/List",
        columnsList: this.allcolumns,
        sortField: "HsncodeId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(
        public _HsncodeserviceService: HsncodeserviceService,
        public _matDialog: MatDialog,
        public toastr: ToastrService, public permissionService: PagePermissionService
    ) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewHsncodeComponent,
            {
                maxWidth: "50vw",
                maxHeight: '50%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    delitem(obj) {
        debugger
        this._HsncodeserviceService.deactivateTheStatus(obj.hsncodeId).subscribe((response: any) => {
            this.grid.bindGridData();
        });
    }
}
