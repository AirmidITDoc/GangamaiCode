import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { NewTalukaComponent } from "./new-taluka/new-taluka.component";
import { TalukaMasterService } from "./taluka-master.service";

@Component({
    selector: "app-taluka-master",
    templateUrl: "./taluka-master.component.html",
    styleUrls: ["./taluka-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TalukaMasterComponent implements OnInit {
     @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    msg: any;
    talukaName: any = "";

        allcolumns =  [
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
           ]
          
           allfilters =[
               { fieldName: "talukaName", fieldValue: "", opType: OperatorComparer.Contains },
               { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
           ]
       
    gridConfig: gridModel = {
        apiUrl: "TalukaMaster/List",
        columnsList: this.allcolumns,
        sortField: "talukaId",
        sortOrder: 0,
        filters: this.allfilters
    }
       constructor(
           public _TalukaMasterService: TalukaMasterService,
           public toastr: ToastrService, public _matDialog: MatDialog
       ) { }
   
       ngOnInit(): void { }
   //filters addedby avdhoot vedpathak date-27/05/2025
    //    Clearfilter(event) {
    //     console.log(event)
    //     if (event == 'TalukaNameSearch')
    //         this._TalukaMasterService.myformSearch.get('TalukaNameSearch').setValue("")

    //     //this.onChangeFirst();
    // }

    // onChangeFirst() {
    //     this.talukaName = this._TalukaMasterService.myformSearch.get('TalukaNameSearch').value
    //     this.getfilterdata();
    // }

    getfilterdata() {
        debugger
        let isActive = this._TalukaMasterService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "TalukaMaster/List",
            columnsList: this.allcolumns,
            sortField: "talukaId",
            sortOrder: 0,
            filters: [
                { fieldName: "talukaName", fieldValue: this.talukaName, opType: OperatorComparer.Contains },
                { fieldName: "isActive", fieldValue: isActive, opType: OperatorComparer.Equals }
            ]
        }
        // this.grid.gridConfig = this.gridConfig;
        // this.grid.bindGridData();
        console.log("GridConfig:", this.gridConfig);

    if (this.grid) {
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    } else {
        console.error("Grid is undefined!");
    }
    }
       onSave(row: any = null) {
           const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
           buttonElement.blur(); // Remove focus from the button
   
           let that = this;
           const dialogRef = this._matDialog.open(NewTalukaComponent,
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
