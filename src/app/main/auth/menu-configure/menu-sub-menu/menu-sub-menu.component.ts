import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MenuMaster } from '../menu.model';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { MenuConfigureService } from '../menu-configure.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MatDialog } from '@angular/material/dialog';
import { MenuSubSubmenuComponent } from '../menu-sub-submenu/menu-sub-submenu.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-menu-sub-menu',
  templateUrl: './menu-sub-menu.component.html',
  styleUrls: ['./menu-sub-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MenuSubMenuComponent implements OnInit {
  msg: any;
  MenuMasterid :any;
  MenuData:any=[];

  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  
  displayedColumns: string[] = [ 
    'Menu_Master_Detail_Display_Sr_no' ,
    'Menu_Master_Detail_Link_name' ,
    'Menu_Master_Detail_Action' ,
    'Menu_Master_Detail_Block' ,
    'action',
  ];

  dataSource = new MatTableDataSource<MenuMaster>();
  
  constructor(private _Activatedroute:ActivatedRoute,
    public _MenuService: MenuConfigureService,
    public notification:NotificationServiceService,
    public _matDialog: MatDialog
    ) { 
    this.MenuMasterid=this._Activatedroute.snapshot.paramMap.get("id");
  }

  ngOnInit(): void {
    this._MenuService.initializeFormMenu_SubMenuMaster();
    this.getSubMenuList();
    this.getMenuNameCombobox();
  }

  getMenuNameCombobox() {
    this._MenuService.getMenuMasterCombo().subscribe(data => this.MenuData = data);
  }

  
  getSubMenuList() {
    var D_data = {
      "master_id": this.MenuMasterid,
    }
    this._MenuService.getSubMenuMasterList(D_data).subscribe(report => {
      this.dataSource.data = report as MenuMaster[];
      this.dataSource.sort =this.sort;
      this.dataSource.paginator=this.paginator;
    });
  }

  onClear() {
    this._MenuService.myformMenuSubMenu.reset();
    this._MenuService.initializeFormMenu_SubMenuMaster();
  }

  onSubmitSubMenu() {
    if (!this._MenuService.myformMenuSubMenu.get("Menu_SubID").value) {
      console.log('insert');
      var m_data = {
        menuMasterDetailsInsert: {
          "menu_master_detail_master_id": Number(this._MenuService.myformMenuSubMenu.get("menu_master_detail_master_id").value),
          "menu_master_detail_sr_no": Number(this._MenuService.myformMenuSubMenu.get("menu_master_detail_display_sr_no").value),
          "menu_master_detail_display_sr_no": Number(this._MenuService.myformMenuSubMenu.get("menu_master_detail_display_sr_no").value),
          "menu_master_detail_block": this._MenuService.myformMenuSubMenu.get("menu_master_detail_block").value,
          "menu_master_detail_link_name": this._MenuService.myformMenuSubMenu.get("menu_master_detail_link_name").value,
          "menu_master_detail_action": this._MenuService.myformMenuSubMenu.get("menu_master_detail_action").value,
        }
      }
      console.log(m_data);
      this._MenuService.insertSubMenuMaster(m_data).subscribe(data => {
        this.msg = data;
        this.getSubMenuList();
      });
      this.notification.success('Record added successfully')
    }

    else {
      var m_dataUpdate = {
        menuMasterDetailsUpdate: {
          "Menu_SubID": Number(this._MenuService.myformMenuSubMenu.get("Menu_SubID").value),
          "menu_master_detail_master_id": Number(this._MenuService.myformMenuSubMenu.get("menu_master_detail_master_id").value),
          "menu_master_detail_sr_no": Number(this._MenuService.myformMenuSubMenu.get("menu_master_detail_display_sr_no").value),
          "menu_master_detail_display_sr_no": Number(this._MenuService.myformMenuSubMenu.get("menu_master_detail_display_sr_no").value),
          "menu_master_detail_block": this._MenuService.myformMenuSubMenu.get("menu_master_detail_block").value,
          "menu_master_detail_link_name": this._MenuService.myformMenuSubMenu.get("menu_master_detail_link_name").value,
          "menu_master_detail_action": this._MenuService.myformMenuSubMenu.get("menu_master_detail_action").value,
        }
      }
      console.log(m_dataUpdate);
      this._MenuService.updateSubMenuMaster(m_dataUpdate).subscribe(data => {
        this.msg = data;
        this.getSubMenuList();
      });
      this.notification.success('Record updated successfully')
    }
    // this.SubMenuShow();
    // this.onClose();  
  }

  onEdit(row) {
    var m_data = {
      "Menu_SubID": row.Menu_SubID,
      "menu_master_detail_master_id": row.menu_master_detail_master_id,
      "menu_master_detail_sr_no": row.menu_master_detail_sr_no,
      "menu_master_detail_display_sr_no": row.menu_master_detail_display_sr_no,
      "menu_master_detail_block": Number(row.menu_master_detail_block),
      "menu_master_detail_link_name": row.menu_master_detail_link_name,
      "menu_master_detail_action": row.menu_master_detail_action,
    }
    console.log(m_data);
    this._MenuService.populateSubMenuForm(m_data);
  }

  onEditSub_Submenu(row) {
    //console.log(row);
    var m_data = {
      "menu_master_detail_master_id": row.menu_master_detail_master_id,
      "menu_master_detail_sr_no": row.menu_master_detail_sr_no
    }
    console.log(m_data);
    this._MenuService.populateSub_SubMenuForm(m_data);
    const dialogRef = this._matDialog.open(MenuSubSubmenuComponent,
      {
        maxWidth: "90vw",
        maxHeight: "74vh", width: '100%', height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      // this.getRadiologytemplateMasterList();
    });

  }
}
