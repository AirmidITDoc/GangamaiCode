import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { QuestionMasterService } from './question-master.service';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { NewQuestionComponent } from './new-question/new-question.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-gastology-question-master',
    templateUrl: './gastology-question-master.component.html',
    styleUrls: ['./gastology-question-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class GastologyQuestionMasterComponent {
    //   IsAdd: boolean = this.permissionService.getPermission(permissionCodes.QuestionMaster, permissionType.Add);

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    msg: any;
    questionName: any = "";

    allcolumns = [
        { heading: "Question Name", key: "questionName", sort: true, align: 'left', emptySign: 'NA', width: 650},
        { heading: "ShortcutValues", key: "shortCutValues", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },

        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    //     action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.QuestionMaster, permissionType.Edit), callback: (data: any) => {
                    //                                   this.onSave(data);
                    //  }

                    action: gridActions.edit, callback: (data: any) => {
                        this.onSave(data) // EDIT Records
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this._QuestionMasterService.deactivateTheStatus(data.questionId).subscribe((response: any) => {

                            this.grid.bindGridData();
                        });
                    }
                }]
        }
    ]

    allfilters = [
        { fieldName: "QuestionName", fieldValue: "", opType: OperatorComparer.StartsWith }
    ]
    gridConfig: gridModel = {
        //   permissionCode: permissionCodes.QuestionMaster,
        apiUrl: "QuestionMaster/List",
        columnsList: this.allcolumns,
        sortField: "QuestionId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(
        public _QuestionMasterService: QuestionMasterService,
        public _matDialog: MatDialog, public permissionService: PagePermissionService,
        public toastr: ToastrService,) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewQuestionComponent,
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

}