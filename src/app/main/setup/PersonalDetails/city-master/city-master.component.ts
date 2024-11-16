import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import { CityMasterService } from "./city-master.service";
import { takeUntil } from "rxjs/operators";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { NewCityComponent } from "./new-city/new-city.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-city-master",
    templateUrl: "./city-master.component.html",
    styleUrls: ["./city-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CityMasterComponent implements OnInit {
  
    msg: any;
    options:any[]=[{Text:'Text-1',Id:1},{Text:'Text-2',Id:2},{Text:'Text-3',Id:3}];
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "CityMaster/List",
        columnsList: [
            { heading: "Code", key: "cityId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "City Name", key: "cityName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "State Name", key: "stateId", sort: true, align: 'left', emptySign: 'NA' },
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
                                    this._CityMasterService.deactivateTheStatus(data.cityId).subscribe((response: any) => {
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
        sortField: "cityId",
        sortOrder: 0,
        filters: [
            { fieldName: "cityName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
    autocompleteMode: string = "CityMaster";
    public autocompleteOptions: any[] = [
        {text: 'Bank A (Solapur)', value: 'S'},
        {text: 'Bank B (Satara)', value: 'B'},
        {text: 'Bank C (Pune)', value: 'C'},
        {text: 'Bank D (Sangali)', value: 'D'},
        {text: 'Bank E (Kolhapur)', value: 'K'},
        {text: 'Bank F (Mumbai)', value: 'F'},
        {text: 'Bank G (Dellhi)', value: 'G'},
        {text: 'Bank H (Jalgaon)', value: 'H'},
        {text: 'Bank I (Nagpur)', value: 'I'},
        {text: 'Bank J (Nanded)', value: 'J'},
        // {text: 'Bank Kolombia (United States of America)', value: 'K'},
        // {text: 'Bank L (Germany)', value: 'L'},
        // {text: 'Bank M (Germany)', value: 'M'},
        // {text: 'Bank N (Germany)', value: 'N'},
        // {text: 'Bank O (Germany)', value: 'O'},
        // {text: 'Bank P (Germany)', value: 'P'},
        // {text: 'Bank Q (Germany)', value: 'Q'},
        // {text: 'Bank R (Germany)', value: 'R'}
      ];
    constructor(
        public _CityMasterService: CityMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }
    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewCityComponent,
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

    selectChange(obj: any){
        console.log(obj);
    }

}