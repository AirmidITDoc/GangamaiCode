import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { NewSubquestionComponent } from './new-subquestion/new-subquestion.component';
import { SubquestionMasterService } from './subquestion-master.service';

@Component({
    selector: 'app-sub-question-master',
    templateUrl: './sub-question-master.component.html',
    styleUrls: ['./sub-question-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SubQuestionMasterComponent {
    // IsAdd: boolean = this.permissionService.getPermission(permissionCodes.DepartmentMaster, permissionType.Add);

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    msg: any;
    departmentName: any = "";

    allcolumns = [
        { heading: "Subquestion Name", key: "subQuestionName", sort: true, align: 'left', emptySign: 'NA', width: 450 },
        { heading: "Sequence No", key: "sequenceNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Shortcut Values", key: "shortCutValues", sort: true, align: 'left', emptySign: 'NA', width: 150 },


        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    // action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.DepartmentMaster, permissionType.Edit), callback: (data: any) => {
                    //     this.onSave(data);
                    // }
                    action: gridActions.edit, callback: (data: any) => {
                        this.onSave(data) // EDIT Records
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this._SubquestionMasterService.deactivateTheStatus(data.subQuestionId).subscribe((response: any) => {

                            this.grid.bindGridData();
                        });
                    }
                }]
        }
    ]

    allfilters = [
        { fieldName: "SubQuestionName", fieldValue: "", opType: OperatorComparer.StartsWith },
        // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        // permissionCode: permissionCodes.DepartmentMaster,
        apiUrl: "SubQuestionMaster/List",
        columnsList: this.allcolumns,
        sortField: "SubQuestionId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(
        public _SubquestionMasterService: SubquestionMasterService,
        public _matDialog: MatDialog, public permissionService: PagePermissionService,
        public toastr: ToastrService,) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewSubquestionComponent,
            {
                maxWidth: "70vw",
                maxHeight: '70%',
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