import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { TalukaMasterService } from "./taluka-master.service";
import { ToastrService } from "ngx-toastr";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { MatDialog } from "@angular/material/dialog";
import { NewTalukaComponent } from "./new-taluka/new-taluka.component";

@Component({
    selector: "app-taluka-master",
    templateUrl: "./taluka-master.component.html",
    styleUrls: ["./taluka-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TalukaMasterComponent implements OnInit {
    msg: any;
       @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
       gridConfig: gridModel = {
           apiUrl: "TalukaMaster/List",
           columnsList: [
               { heading: "Code", key: "talukaId", sort: true, align: 'left', emptySign: 'NA' },
               { heading: "Taluka Name", key: "talukaName", sort: true, align: 'left', emptySign: 'NA' },
               { heading: "City Name", key: "cityId", sort: true, align: 'left', emptySign: 'NA' },
               { heading: "UserName", key: "username", sort: true, align: 'left', emptySign: 'NA' },
               { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
               {
                   heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                       {
                           action: gridActions.edit, callback: (data: any) => {
                               this.onSave(data);
                           }
                       }, {
                           action: gridActions.delete, callback: (data: any) => {
                               this._TalukaMasterService.deactivateTheStatus(data.talukaId).subscribe((response: any) => {
                                   this.toastr.success(response.message);
                                   this.grid.bindGridData();
                               });
                           }
                       }]
               } //Action 1-view, 2-Edit,3-delete
           ],
           sortField: "talukaId",
           sortOrder: 0,
           filters: [
               { fieldName: "talukaName", fieldValue: "", opType: OperatorComparer.Contains },
               { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
           ],
           row: 25
       }
   
       constructor(
           public _TalukaMasterService: TalukaMasterService,
           public toastr: ToastrService, public _matDialog: MatDialog
       ) { }
   
       ngOnInit(): void { }
   
       onSave(row: any = null) {
           const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
           buttonElement.blur(); // Remove focus from the button
   
           let that = this;
           const dialogRef = this._matDialog.open(NewTalukaComponent,
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
