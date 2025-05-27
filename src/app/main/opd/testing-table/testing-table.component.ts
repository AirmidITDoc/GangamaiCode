import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MenuMaster } from 'app/main/administration/role-permission/role-permission.component';
import { OPSearhlistService } from '../op-search-list/op-searhlist.service';
export interface PeriodicElement {
  Id: string;
  UpId: number;
  LinkName: number;
  Icon: string;
  LinkAction: string;
}
@Component({
  selector: 'app-testing-table',
  templateUrl: './testing-table.component.html',
  styleUrls: ['./testing-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [MatTableModule, NgFor, MatButtonModule, NgIf, MatIconModule],
})



export class TestingTableComponent  implements OnInit{
  MenuMasterList: any;
  dialogRef: any;
  msg: any;

  // dataSource = ELEMENT_DATA;
  // columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
  columnsToDisplay= [
    'id',
    'upId',
    'linkName',
    'icon',
    'linkAction'
     ];

  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'linkAction'];
  expandedElement: PeriodicElement | null;
  

  dataSource1 = new MatTableDataSource<MenuMaster>();
  constructor(public _MenuService: OPSearhlistService, public _matDialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.getMenuMasterList();
  }

  getMenuMasterList() {
   var mdat=
    {
      "first": 0,
      "rows": 20,
      sortField: "UpId",
        sortOrder: 0,
        filters: [],
      "exportType": "JSON"
    }
    console.log(mdat)
    this._MenuService.getNewMenuMasterList(mdat).subscribe(Menu => {
      console.log(Menu.data.data);
       this.dataSource1.data = Menu.data.data as MenuMaster[];
     
       console.log(this.dataSource1.data);
     })
  }

}