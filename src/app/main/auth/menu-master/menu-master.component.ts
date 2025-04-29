import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes, gridActions } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { MenuMasterService } from './menu-master.service';
import { NewMenuComponent } from './new-menu/new-menu.component';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-menu-master',
    templateUrl: './menu-master.component.html',
    styleUrls: ['./menu-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class MenuMasterComponent implements OnInit {
    mysearchform:FormGroup;
    MenuId="0";
    LinkName="%"
    autocompletemenu: string = "MenuMain"
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

     allcolumns = [
    
        { heading: "Code", key: "id", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "UpId", key: "upId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "MenuName", key: "linkName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Icon", key: "icon", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Action", key: "linkAction", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Sort Order", key: "sortOrder", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsBlock", key: "isDisplay", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Permission Code", key: "permissionCode", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Table Names", key: "tableNames", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", width: 100, type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this._MenuMasterService.deactivateTheStatus(data.id).subscribe((response: any) => {
                            this.toastr.success(response.message);
                            this.grid.bindGridData();
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ]

    gridConfig: gridModel = {
        apiUrl: "MenuMaster/MenuMasterList",
        columnsList: this.allcolumns,
        sortField: "MenuId", 
        sortOrder: 0,
        filters: [
        { fieldName: "Id", fieldValue: this.MenuId, opType: OperatorComparer.Equals },
        { fieldName: "LinkName", fieldValue: this.LinkName, opType: OperatorComparer.Contains }
        
        ]
    }

    constructor(
        public _MenuMasterService: MenuMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { 
      this.mysearchform= this._MenuMasterService.createSearchForm()
    }


    ListView(value) {
            if (value.value !== 0)
            this.MenuId = value.value
          else
            this.MenuId = "0"
            this.onChangeFirst(value);
      }
    
      onChangeFirst(value) {
        
        this.MenuId = String(this.MenuId)
        this.LinkName = this.mysearchform.get("LinkSearch").value + "%"
       
        this.getfilterdata();
      }
    
      getfilterdata() {
        debugger
        this.gridConfig = {
            apiUrl: "MenuMaster/MenuMasterList",
            columnsList: this.allcolumns,
            sortField: "MenuId", 
          sortOrder: 0,
          filters: [
            { fieldName: "Id", fieldValue: this.MenuId, opType: OperatorComparer.Equals },
            { fieldName: "LinkName", fieldValue: this.LinkName, opType: OperatorComparer.Contains }
        
          ],
          row: 25
        }
       
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    
      }

        

Clearfilter(event) {
    console.log(event)
    if (event == 'LinkSearch')
        this.mysearchform.get('LinkSearch').setValue("%")
   
    this.onChangeFirst(event);
  }

      
    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewMenuComponent,
            {
                maxWidth: "55vw",
                maxHeight: '65vh',
                width: '100%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }
}
