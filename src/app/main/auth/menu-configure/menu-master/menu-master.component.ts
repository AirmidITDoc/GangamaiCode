import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MenuConfigureService } from '../menu-configure.service';
import { MenuMaster } from '../menu.model';

@Component({
  selector: 'app-menu-master',
  templateUrl: './menu-master.component.html',
  styleUrls: ['./menu-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MenuMasterComponent implements OnInit {
  MenuMasterList: any;
  dialogRef: any;
  msg: any;
  
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;

  displayedColumns: string[] = [
    'menu_master_id',
    'menu_master_link_name',
    'menu_master_icon',
    'menu_master_action',
    // 'MenuDisplaySrno',
    'menu_master_block',
    'action',
  ];

  dataSource = new MatTableDataSource<MenuMaster>();
  constructor(public _MenuService: MenuConfigureService, public _matDialog: MatDialog,
    private router: Router,
    public notification: NotificationServiceService
    ) { }

  ngOnInit(): void {
    this.getMenuMasterList();
   }
 
   getMenuMasterList() {
    
    debugger;
     this._MenuService.getMenuMasterList().subscribe(Menu => {
        this.dataSource.data = Menu as MenuMaster[];
        this.dataSource.sort =this.sort;
        this.dataSource.paginator=this.paginator;

        console.log(this.dataSource.data);
      })
   }
 
   onEditSubmenu(){
     // this.dialogRef = this._matDialog.open(MenuSubMenuComponent, {
     //   disableClose: false, width: "100%", height: "100%"
     // });
   }
   SubMenu(){
     this.router.navigate(["auth/menu-master/Menu-SubMenu"]);
   }

   onClear() {
    this._MenuService.myformMenu.reset();
    this._MenuService.initializeFormGroupMenuMaster();
  }

  onSubmit() {
    if (this._MenuService.myformMenu.valid) {
      if (!this._MenuService.myformMenu.get("Id").value) {
        console.log('insert');
        var m_data = {
          menuMasterInsert: {
            "menu_master_id": this._MenuService.myformMenu.get("menu_master_id").value,
            "menu_master_link_name": this._MenuService.myformMenu.get("menu_master_link_name").value,
            "menu_master_icon": this._MenuService.myformMenu.get("menu_master_icon").value,
            "menu_master_controller": this._MenuService.myformMenu.get("menu_master_link_name").value,
            "menu_master_action": this._MenuService.myformMenu.get("menu_master_action").value,
            "menu_master_display_sr_no": this._MenuService.myformMenu.get("menu_master_display_sr_no").value,
            "menu_master_block": this._MenuService.myformMenu.get("menu_master_block").value,
          }
        }
        this._MenuService.insertMenuMaster(m_data).subscribe( data => {
          this.msg = data;
          this.getMenuMasterList();
        });
        this.notification.success('Record added successfully')
      }
      else {
        var m_dataUpdate = {
          menuMasterUpdate: {
            "Id": this._MenuService.myformMenu.get("Id").value,
            "menu_master_id": this._MenuService.myformMenu.get("menu_master_id").value,
            "menu_master_link_name": this._MenuService.myformMenu.get("menu_master_link_name").value,
            "menu_master_icon": this._MenuService.myformMenu.get("menu_master_icon").value,
            "menu_master_controller": this._MenuService.myformMenu.get("menu_master_link_name").value,
            "menu_master_action": this._MenuService.myformMenu.get("menu_master_action").value,
            "menu_master_display_sr_no": this._MenuService.myformMenu.get("menu_master_display_sr_no").value,
            "menu_master_block": this._MenuService.myformMenu.get("menu_master_block").value,
          }
        }
        this._MenuService.updateMenuMaster(m_dataUpdate).subscribe( data => {
          this.msg = data;
          this.getMenuMasterList();
        });
        this.notification.success('Record updated successfully')
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
