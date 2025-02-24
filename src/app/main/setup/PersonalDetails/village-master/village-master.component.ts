import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { VillageMasterService } from "./village-master.service";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { NewVillageComponent } from "./new-village/new-village.component";
import { MatDialog } from "@angular/material/dialog";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-village-master",
    templateUrl: "./village-master.component.html",
    styleUrls: ["./village-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class VillageMasterComponent implements OnInit {
     msg: any;
           @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
           gridConfig: gridModel = {
               apiUrl: "VillageMaster/List",
               columnsList: [
                   { heading: "Code", key: "villageId", sort: true, align: 'left', emptySign: 'NA' },
                   { heading: "VillageName", key: "villageName", sort: true, align: 'left', emptySign: 'NA' },
                   { heading: "TalukaName", key: "talukaName", sort: true, align: 'left', emptySign: 'NA' },
                   { heading: "UserName", key: "addedByName", sort: true, align: 'left', emptySign: 'NA' },
                   { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
                   {
                       heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                           {
                               action: gridActions.edit, callback: (data: any) => {
                                   this.onSave(data);
                               }
                           }, {
                               action: gridActions.delete, callback: (data: any) => {
                                   this._VillageMasterService.deactivateTheStatus(data.villageId).subscribe((response: any) => {
                                       this.toastr.success(response.message);
                                       this.grid.bindGridData();
                                   });
                               }
                           }]
                   } //Action 1-view, 2-Edit,3-delete
               ],
               sortField: "VillageName",
               sortOrder: 0,
               filters: [
                   { fieldName: "villageName", fieldValue: "", opType: OperatorComparer.Contains },
                   { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
               ],
               row: 25
           }
       
           constructor(
               public _VillageMasterService: VillageMasterService,
               public toastr: ToastrService, public _matDialog: MatDialog
           ) { }
       
           ngOnInit(): void { }
       
           onSave(row: any = null) {
               const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
               buttonElement.blur(); // Remove focus from the button
       
               let that = this;
               const dialogRef = this._matDialog.open(NewVillageComponent,
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
