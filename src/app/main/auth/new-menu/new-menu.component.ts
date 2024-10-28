import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NewMenuService } from './new-menu.service';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-menu',
  templateUrl: './new-menu.component.html',
  styleUrls: ['./new-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewMenuComponent implements OnInit {
  MenuMasterList: any;
  dialogRef: any;
  msg: any;
  
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;

  displayedColumns: string[] = [
    'Id',
    'UpId',
    'LinkName',
    'Icon',
    'LinkAction',
    // 'SortOrder',
    // 'IsActive',
    // 'Display',
    'action',
  ];

  dataSource = new MatTableDataSource<MenuMaster>();
  constructor(public _MenuService: NewMenuService, public _matDialog: MatDialog,
    private router: Router,) { }

  ngOnInit(): void {
    this.getMenuMasterList();
  }


  getMenuMasterList() {
    
     this._MenuService.getNewMenuMasterList().subscribe(Menu => {
        this.dataSource.data = Menu as MenuMaster[];
        this.dataSource.sort =this.sort;
        this.dataSource.paginator=this.paginator;

        console.log(this.dataSource.data);
      })
   }


   onSubmit() {
    if (this._MenuService.myformMenu.valid) {
      if (!this._MenuService.myformMenu.get("Id").value) {
        console.log('insert');
        var m_data = {
          menuInsert: {
            "id": this._MenuService.myformMenu.get("Id").value,
            "upId": this._MenuService.myformMenu.get("UpId").value,
            "linkName": this._MenuService.myformMenu.get("LinkName").value,
            "icon": this._MenuService.myformMenu.get("Icon").value,
            "linkAction": this._MenuService.myformMenu.get("LinkAction").value,
            "sortOrder": this._MenuService.myformMenu.get("SortOrder").value,
            "isActive": this._MenuService.myformMenu.get("IsActive").value,
            "display": this._MenuService.myformMenu.get("Display").value
          }
        }
        this._MenuService.insertMenuMaster(m_data).subscribe( data => {
          this.msg = data;
          this.getMenuMasterList();
        });
        
      }
      else {
        var m_dataUpdate = {
          menuUpdate: {
            "id": this._MenuService.myformMenu.get("Id").value,
            "upId": this._MenuService.myformMenu.get("UpId").value,
            "linkName": this._MenuService.myformMenu.get("LinkName").value,
            "icon": this._MenuService.myformMenu.get("Icon").value,
            "linkAction": this._MenuService.myformMenu.get("LinkAction").value,
            "sortOrder": this._MenuService.myformMenu.get("SortOrder").value,
            "isActive": this._MenuService.myformMenu.get("IsActive").value,
            "display": this._MenuService.myformMenu.get("Display").value
          }
        }
        this._MenuService.updateMenuMaster(m_dataUpdate).subscribe( data => {
          this.msg = data;
          this.getMenuMasterList();
        });
        
      }
    }

  }

  onEditMenu(row) {
    var m_data = {
      "Id":row.Id,"menu_master_id": row.menu_master_id, 
      "menu_master_link_name": row.menu_master_link_name, 
      "menu_master_icon": row.menu_master_icon,
      "menu_master_controller": row.menu_master_controller, 
      "menu_master_action": row.menu_master_action, 
      "menu_master_display_sr_no": row.menu_master_display_sr_no,
      "menu_master_block": row.menu_master_block
    }
    this._MenuService.populateMenu(m_data);
  }
}


export class MenuMaster {
  Id:number;
  UpId:number;
  LinkName: string;
  Icon: string;
  LinkAction:string ;
  SortOrder: string;
  IsActive: number;
  Display:number ;


/**
 * Constructor
 *
 * @param menuMaster
 */
constructor(menuMaster) {
    {
        this.Id = menuMaster.Id || 0;
        this.UpId = menuMaster.UpId || 0;
        this.LinkName = menuMaster.LinkName || '';
        this. Icon= menuMaster.Icon|| '';
        this.LinkAction = menuMaster.LinkAction || '';
        this.SortOrder = menuMaster.SortOrder || '';
        this.IsActive = menuMaster.IsActive|| 1;
        this.Display = menuMaster.Display || 1;

       
    }
}
}
