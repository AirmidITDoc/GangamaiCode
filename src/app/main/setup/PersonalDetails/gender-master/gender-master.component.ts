import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { GenderMasterService } from "./gender-master.service";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

import { NewGendermasterComponent } from "./new-gendermaster/new-gendermaster.component";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-gender-master",
    templateUrl: "./gender-master.component.html",
    styleUrls: ["./gender-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class GenderMasterComponent implements OnInit {
    GenderMasterList: any;
    msg: any;
    options: any[] = [{ Text: 'Text-1', Id: 1 }, { Text: 'Text-2', Id: 2 }, { Text: 'Text-3', Id: 3 }];
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "Gender/List",
        columnsList: [
            { heading: "Code", key: "genderId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Gender Name", key: "genderName", sort: true, align: 'left', emptySign: 'NA', width: 700 },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center", width: 200 },
            {
                heading: "Action", key: "action", align: "right", width: 100, type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._GenderService.deactivateTheStatus(data.genderId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
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
        row: 25
    }
    autocompleteMode: string = "Gender";
    public autocompleteOptions: any[] = [
        { text: 'Bank A (Switzerland)', value: 'A' },
        { text: 'Bank B (Switzerland)', value: 'B' },
        { text: 'Bank C (France)', value: 'C' },
        { text: 'Bank D (France)', value: 'D' },
        { text: 'Bank E (France)', value: 'E' },
        { text: 'Bank F (Italy)', value: 'F' },
        { text: 'Bank G (Italy)', value: 'G' },
        { text: 'Bank H (Italy)', value: 'H' },
        { text: 'Bank I (Italy)', value: 'I' },
        { text: 'Bank J (Italy)', value: 'J' },
        { text: 'Bank Kolombia (United States of America)', value: 'K' },
        { text: 'Bank L (Germany)', value: 'L' },
        { text: 'Bank M (Germany)', value: 'M' },
        { text: 'Bank N (Germany)', value: 'N' },
        { text: 'Bank O (Germany)', value: 'O' },
        { text: 'Bank P (Germany)', value: 'P' },
        { text: 'Bank Q (Germany)', value: 'Q' },
        { text: 'Bank R (Germany)', value: 'R' }
    ];
    constructor(
        public _GenderService: GenderMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }
    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewGendermasterComponent,
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
    selectChange(obj: any) {
        console.log(obj);
    }

}