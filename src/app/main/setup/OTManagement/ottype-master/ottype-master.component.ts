import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { NewOttypeMasterComponent } from './new-ottype-master/new-ottype-master.component';
import { OttypeMasterService } from './ottype-master.service';

@Component({
  selector: 'app-ottype-master',
  templateUrl: './ottype-master.component.html',
  styleUrls: ['./ottype-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class OttypeMasterComponent implements OnInit {

  hasSelectedContacts: boolean;
  dataSource = new MatTableDataSource<OtTypeMasterList>();
  sIsLoading: string = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  displayedColumns = [
    'OtTypeId',
    'OtTypeName',
    'IsActive',
    'action'
  ];

  constructor(public _otTypeMasterService: OttypeMasterService,
    private accountService: AuthenticationService,
    public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    private _ActRoute: Router,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
  ) { }

  ngOnInit(): void {
  }

  
  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  // field validation 
  get f() { return this._otTypeMasterService.myformSearch.controls; }

  getotTypeList(){

  }

  newOtType(){
    const dialogRef = this._matDialog.open(NewOttypeMasterComponent,
      {
        maxWidth: "60%",
        width: "45%",
        height: "40%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getotTypeList();
    });
  }

  OnEdit(contact){
    const dialogRef = this._matDialog.open(NewOttypeMasterComponent,
      {
        maxWidth: "60%",
        width: "45%",
        height: "40%",
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getotTypeList();
    });
  }

  onClear() {
    this._otTypeMasterService.myformSearch.reset({
      OtTypeNameSearch: "",
    });
    this.getotTypeList();
  }

}
export class OtTypeMasterList {
  OtTypeId:number;
  OtTypeName:string;
  IsActive:string;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(OtTypeMasterList) {
    {
      this.OtTypeId = OtTypeMasterList.OtTypeId || '';
      this.OtTypeName = OtTypeMasterList.OtTypeName || '';
      this.IsActive=OtTypeMasterList.IsActive || '';
    }
  }
}