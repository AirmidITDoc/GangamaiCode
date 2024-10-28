import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { NewMenuService } from '../../new-menu/new-menu.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { MenuConfigureService } from '../menu-configure.service';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MenuFormComponent implements OnInit {

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
    'IsDisplay',
    'action',
  ];

  dataSource = new MatTableDataSource<MenuMaster>();
  constructor(public _MenuService: MenuConfigureService, public _matDialog: MatDialog,
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
    if (this._MenuService.menuform.valid) {
      // if (!this._MenuService.menuform.get("Id").value) {
        debugger
        var m_data = {
          menuInsert: {
            "id": this._MenuService.menuform.get("Id").value,
            "upId": this._MenuService.menuform.get("UpId").value,
            "linkName": this._MenuService.menuform.get("LinkName").value,
            "icon": this._MenuService.menuform.get("Icon").value,
            "linkAction": this._MenuService.menuform.get("LinkAction").value,
            "sortOrder": this._MenuService.menuform.get("SortOrder").value,
            "isActive": this._MenuService.menuform.get("IsActive").value,
            "display": this._MenuService.menuform.get("IsBlock").value
          }
        }
        console.log(m_data);
        this._MenuService.insertMenuMasterNew(m_data).subscribe( data => {
          this.msg = data;
          this.getMenuMasterList();
        });
        
      // }
      // else {
      //   var m_dataUpdate = {
      //     menuUpdate: {
      //       "id": this._MenuService.menuform.get("Id").value,
      //       "upId": this._MenuService.menuform.get("UpId").value,
      //       "linkName": this._MenuService.menuform.get("LinkName").value,
      //       "icon": this._MenuService.menuform.get("Icon").value,
      //       "linkAction": this._MenuService.menuform.get("LinkAction").value,
      //       "sortOrder": this._MenuService.menuform.get("SortOrder").value,
      //       "isActive": this._MenuService.menuform.get("IsActive").value,
      //       "display": this._MenuService.menuform.get("Display").value
      //     }
      //   }
      //   console.log(m_data);
      //   this._MenuService.updateMenuMasterNew(m_dataUpdate).subscribe( data => {
      //     this.msg = data;
      //     this.getMenuMasterList();
      //   });
        
      // }
    }

  }

  onClear(){}

  onEditMenu(row) {
    debugger
    var m_data = {
      "Id":row.Id,
      "UpId": row.UpId, 
      "LinkName": row.LinkName,
      "LinkAction": row.LinkAction, 
      "SortOrder": row.SortOrder, 
      "Display": row.Display,
      "IsActive": row.IsActive
    }
    this._MenuService.populateMenuform(m_data);
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
  IsDisplay:number ;


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
        this.IsDisplay = menuMaster.IsDisplay || 1;

       
    }
}
}
