import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes, gridActions } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { MenuMasterService } from './menu-master.service';
import { NewMenuComponent } from './new-menu/new-menu.component';

@Component({
  selector: 'app-menu-master',
  templateUrl: './menu-master.component.html',
  styleUrls: ['./menu-master.component.scss']
})
export class MenuMasterComponent implements OnInit {

   confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    
          @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
          gridConfig: gridModel = {
          apiUrl: "MenuMaster/List",
          columnsList: [
              { heading: "Code", key: "id", sort: true, align: 'left', emptySign: 'NA', width:100 },
              { heading: "UpId", key: "upId", sort: true, align: 'left', emptySign: 'NA', width:100 },
              { heading: "Menu Name", key: "linkName", sort: true, align: 'left', emptySign: 'NA', width:300 },
              { heading: "Icon", key: "icon", sort: true, align: 'left', emptySign: 'NA', width:200 },
              { heading: "Action", key: "linkAction", sort: true, align: 'left', emptySign: 'NA', width:200 },
            //   { heading: "Sort Order", key: "sortOrder", sort: true, align: 'left', emptySign: 'NA', width:100 },
            //   { heading: "IsActive", key: "isActive", sort: true, align: 'left', emptySign: 'NA', width:100 },
              { heading: "IsBlock", key: "isDisplay", sort: true, align: 'left', emptySign: 'NA', width:150 },
            //   { heading: "Permission Code", key: "permissionCode", sort: true, align: 'left', emptySign: 'NA', width:100 },
            //   { heading: "Table Names", key: "tableNames", sort: true, align: 'left', emptySign: 'NA', width:100 },
              { heading: "Action", key: "action", align: "right", width:100, type: gridColumnTypes.action, actions: [
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
                                          this._MenuMasterService.deactivateTheStatus(data.bedId).subscribe((response: any) => {
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
            sortField: "id",
            sortOrder: 0,
            filters: [
            { fieldName: "Menu Name", fieldValue: "", opType: OperatorComparer.Contains }
            ],
            row: 25
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
                      height: '60%',
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
