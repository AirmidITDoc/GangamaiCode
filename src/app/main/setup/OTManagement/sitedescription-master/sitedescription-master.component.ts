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
import { SitedescriptionMasterService } from './sitedescription-master.service';
import { NewSitedescriptionMasterComponent } from './new-sitedescription-master/new-sitedescription-master.component';

@Component({
  selector: 'app-sitedescription-master',
  templateUrl: './sitedescription-master.component.html',
  styleUrls: ['./sitedescription-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SitedescriptionMasterComponent implements OnInit {

  hasSelectedContacts: boolean;
  dataSource = new MatTableDataSource<OtSiteDescMasterList>();
  sIsLoading: string = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  displayedColumns = [
    'OtSiteDescId',
    'OtSiteDescName',
    'IsActive',
    'action'
  ];

  constructor(public _otSiteDescMasterService: SitedescriptionMasterService,
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
  get f() { return this._otSiteDescMasterService.myformSearch.controls; }

  getotSiteDescList(){

  }

  newOtSiteDesc(){
    const dialogRef = this._matDialog.open(NewSitedescriptionMasterComponent,
      {
        maxWidth: "60%",
        width: "45%",
        height: "40%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getotSiteDescList();
    });
  }

  OnEdit(contact){
    const dialogRef = this._matDialog.open(NewSitedescriptionMasterComponent,
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
      this.getotSiteDescList();
    });
  }

  onClear() {
    this._otSiteDescMasterService.myformSearch.reset({
      OtSiteDescNameSearch: "",
    });
    this.getotSiteDescList();
  }
}
export class OtSiteDescMasterList {
  OtSiteDescId:number;
  OtSiteDescName:string;
  IsActive:string;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(OtSiteDescMasterList) {
    {
      this.OtSiteDescId = OtSiteDescMasterList.OtSiteDescId || '';
      this.OtSiteDescName = OtSiteDescMasterList.OtSiteDescName || '';
      this.IsActive=OtSiteDescMasterList.IsActive || '';
    }
  }
}
