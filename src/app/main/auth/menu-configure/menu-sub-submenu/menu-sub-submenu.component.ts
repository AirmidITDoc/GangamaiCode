import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MenuConfigureService } from '../menu-configure.service';
import { Sub_SubMenuMaster } from '../menu.model';

@Component({
  selector: 'app-menu-sub-submenu',
  templateUrl: './menu-sub-submenu.component.html',
  styleUrls: ['./menu-sub-submenu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MenuSubSubmenuComponent implements OnInit {
  msg: any;
  MenuMasterid :any;
  MenuData:any=[];
  Menu_SubData:any=[];

  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  
  displayedColumns: string[] = [ 
    // 'menu_master_detail_detail_master_id' ,
    // 'menu_master_detail_detail_master_sr_no' ,
    'menu_master_detail_detail_sr_no' ,
    'menu_master_detail_detail_link_name' ,
    'menu_master_detail_detail_action',
    'menu_master_detail_detail_block',
    // 'menu_master_detail_detail_display_sr_no',
    // 'Menu_Sub_SubID',
    // 'menu_master_detail_detail_icon',    
    'action',
  ];

  dataSource = new MatTableDataSource<Sub_SubMenuMaster>();
  
  constructor(public _MenuService: MenuConfigureService,
    public notification:NotificationServiceService) { }

  ngOnInit(): void {
    this._MenuService.initializeFormMenuSub_SubMenuMaster();
    this.getSub_SubMenuList();
    this.getMenuNameCombobox();
    this.getMenu_SubMenuNameCombobox();
  }
  
  getMenuNameCombobox() {
    this._MenuService.getMenuMasterCombo().subscribe(data => this.MenuData = data);
  }

  getMenu_SubMenuNameCombobox() {
    var D_data = {
      "Menu_Id": this._MenuService.myformMenuSubMenu.get("menu_master_detail_master_id").value,
    }
    this._MenuService.getMenu_SubMenuMasterCombo(D_data).subscribe(data => this.Menu_SubData = data);
  }

  getSub_SubMenuList() {
    var D_data = {
      "master_SubMenu_Id": this._MenuService.myformMenuSubMenu.get("menu_master_detail_master_id").value,
      "master_SubMenu_SrNo": this._MenuService.myformMenuSubMenu.get("menu_master_detail_sr_no").value,
    }
    this._MenuService.getSub_SubMenuMasterList(D_data).subscribe(report => {
      this.dataSource.data = report as Sub_SubMenuMaster[];
      this.dataSource.sort =this.sort;
      this.dataSource.paginator=this.paginator;
    });
  }

  onSubmitSubMenu(){
    if (!this._MenuService.myformMenuSub_SubMenu.get("menu_Sub_SubID").value) {
      console.log('insert');
      var m_data = {
        menuMasterDetails_DetailsInsert: {
          "menu_master_detail_detail_master_id": Number(this._MenuService.myformMenuSub_SubMenu.get("menu_master_detail_detail_master_id").value),
          "menu_master_detail_detail_master_sr_no": Number(this._MenuService.myformMenuSub_SubMenu.get("menu_master_detail_detail_master_sr_no").value),
          "menu_master_detail_detail_sr_no": Number(this._MenuService.myformMenuSub_SubMenu.get("menu_master_detail_detail_sr_no").value),
          "menu_master_detail_detail_link_name": this._MenuService.myformMenuSub_SubMenu.get("menu_master_detail_detail_link_name").value,
          "menu_master_detail_detail_action": this._MenuService.myformMenuSub_SubMenu.get("menu_master_detail_detail_action").value,
          "menu_master_detail_detail_block": Number(this._MenuService.myformMenuSub_SubMenu.get("menu_master_detail_detail_block").value),
          "menu_master_detail_detail_display_sr_no": Number(this._MenuService.myformMenuSub_SubMenu.get("menu_master_detail_detail_display_sr_no").value),
        }
      }
      console.log(m_data);
      this._MenuService.insertSub_SubMenuMaster(m_data).subscribe(data => {
        this.msg = data;
        this.getSub_SubMenuList();
      });
      this.notification.success('Record added successfully')
    }

    else {
      var m_dataUpdate = {
        menuMasterDetails_DetailsUpdate: {
          "Menu_Sub_SubID": Number(this._MenuService.myformMenuSub_SubMenu.get("menu_Sub_SubID").value),
          "menu_master_detail_detail_master_id": Number(this._MenuService.myformMenuSub_SubMenu.get("menu_master_detail_detail_master_id").value),
          "menu_master_detail_detail_master_sr_no": Number(this._MenuService.myformMenuSub_SubMenu.get("menu_master_detail_detail_master_sr_no").value),
          "menu_master_detail_detail_sr_no": Number(this._MenuService.myformMenuSub_SubMenu.get("menu_master_detail_detail_sr_no").value),
          "menu_master_detail_detail_link_name": this._MenuService.myformMenuSub_SubMenu.get("menu_master_detail_detail_link_name").value,
          "menu_master_detail_detail_action": this._MenuService.myformMenuSub_SubMenu.get("menu_master_detail_detail_action").value,
          "menu_master_detail_detail_block": Number(this._MenuService.myformMenuSub_SubMenu.get("menu_master_detail_detail_block").value),
          "menu_master_detail_detail_display_sr_no": Number(this._MenuService.myformMenuSub_SubMenu.get("menu_master_detail_detail_display_sr_no").value),
        }
      }
      console.log(m_dataUpdate);
      this._MenuService.updateSub_SubMenuMaster(m_dataUpdate).subscribe(data => {
        this.msg = data;
        this.getSub_SubMenuList();
      });
      this.notification.success('Record updated successfully')
    }
    this.onClear();  
  }

  onClear() {
    this._MenuService.myformMenuSub_SubMenu.reset();
    this._MenuService.initializeFormMenuSub_SubMenuMaster();
  }
  onEdit(row){
    var m_data = {
      "menu_Sub_SubID": row.Menu_Sub_SubID,
      "menu_master_detail_detail_master_id": row.menu_master_detail_detail_master_id,
      "menu_master_detail_detail_master_sr_no": row.menu_master_detail_detail_master_sr_no,
      "menu_master_detail_detail_sr_no": row.menu_master_detail_detail_sr_no,
      "menu_master_detail_detail_link_name": row.menu_master_detail_detail_link_name,
      "menu_master_detail_detail_action": row.menu_master_detail_detail_action,
      "menu_master_detail_detail_block": Number(row.menu_master_detail_detail_block),
      "menu_master_detail_detail_display_sr_no":row.menu_master_detail_detail_display_sr_no
    }
    console.log(m_data);
    this._MenuService.populateSub_SubMenuFormEdit(m_data);
  }
}
