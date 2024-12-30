import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Row } from 'jspdf-autotable';
import { SurgeryMasterService } from './surgery-master.service';
import { NewSurgeryMasterComponent } from './new-surgery-master/new-surgery-master.component';

@Component({
  selector: 'app-surgery-master',
  templateUrl: './surgery-master.component.html',
  styleUrls: ['./surgery-master.component.scss']
})
export class SurgeryMasterComponent implements OnInit {

  sIsLoading: string = '';
  hasSelectedContacts: boolean;
  dataSource = new MatTableDataSource<SurgeryMasterList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns = [
    'SurgeryId',
    'ProcedureName',
    'CategoryName',
    'DepartmentName',
    'Amount',
    'Site',
    'IsActive',
  ];

  constructor(public _surgeryMasterService: SurgeryMasterService,
  private accountService: AuthenticationService,
  public notification: NotificationServiceService,
  public _matDialog: MatDialog,
  private _fuseSidebarService: FuseSidebarService,
  private _ActRoute: Router,
  public toastr: ToastrService,
  private advanceDataStored: AdvanceDataStored,
  ) { }

  ngOnInit(): void {
    this.getSurgeryList();
  }

  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  // field validation 
  get f() { return this._surgeryMasterService.myformSearch.controls; }

  getSurgeryList(){

  }

  newSurgery(){
    const dialogRef = this._matDialog.open(NewSurgeryMasterComponent,
      {
        maxWidth: "60%",
        width: "65%",
        height: "70%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getSurgeryList();
    });
  }
  
  OnEdit(obj){

  }

  onClear() {
    this._surgeryMasterService.myformSearch.reset({
      SurgeryNameSearch: "",
    });
    this.getSurgeryList();
  }

}
export class SurgeryMasterList {
  SurgeryId:number;
  ProcedureName:string;
  CategoryName:string;
  DepartmentName:string;
  Amount:number;
  Site:string;
  IsDeleted:String;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(SurgeryMasterList) {
    {
      this.SurgeryId = SurgeryMasterList.SurgeryId || '';
      this.ProcedureName = SurgeryMasterList.ProcedureName || '';      
      this.CategoryName = SurgeryMasterList.CategoryName || '';
      this.DepartmentName = SurgeryMasterList.DepartmentName || '';   
      this.Amount = SurgeryMasterList.Amount || '';   
      this.Site = SurgeryMasterList.Site || '';
      this.IsDeleted = SurgeryMasterList.IsDeleted;
    }
  }
}