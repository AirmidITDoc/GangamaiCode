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
    'SiteDescId',
    'SiteDescriptionName',
    'SurgeryCategoryName',
    'AddedBy',
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
    this.getotSiteDescList();
  }

  
  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  // field validation 
  get f() { return this._otSiteDescMasterService.myformSearch.controls; }

  getotSiteDescList(){
    debugger
    this.sIsLoading = 'loading-data';

    const sitDescNameSearch = this._otSiteDescMasterService.myformSearch.get("OtSiteDescNameSearch").value || '';
  
    const D_data = {
      "SiteDescriptionName": sitDescNameSearch.trim() ? sitDescNameSearch + '%' : '%', // Use '%' if search is empty
    };

    console.log("SiteDescriptionName:",D_data)
    this._otSiteDescMasterService.getSiteDesclist(D_data).subscribe(Visit => {
    this.dataSource.data = Visit as OtSiteDescMasterList[];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
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

  onDeactive(SiteDescId){
    debugger
    Swal.fire({
      title: 'Confirm Status',
      text: 'Are you sure you want to Change Status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Change Status!'
  }).then((result) => {
    debugger

      if (result.isConfirmed) {
        let Query;
        const tableItem = this.dataSource.data.find(item => item.SiteDescId === SiteDescId);
        console.log("table:",tableItem)
    
        if (tableItem.IsActive) {
            Query = "Update M_OT_SiteDescriptionMaster set IsActive=0 where SiteDescId=" + SiteDescId;
        } else {
            Query = "Update M_OT_SiteDescriptionMaster set IsActive=1 where SiteDescId=" + SiteDescId;
        }
    
        console.log("query:", Query);
    
        this._otSiteDescMasterService.deactivateTheStatus(Query)
            .subscribe(
                (data) => {
                    Swal.fire('Changed!', 'SiteDesc Status has been Changed.', 'success');
                    this.getotSiteDescList();
                },
                (error) => {
                    Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                }
            );
    }
    
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
  SiteDescId:number;
  SiteDescriptionName:string;
  SurgeryCategoryName:any;
  AddedBy:boolean;
  IsActive:string;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(OtSiteDescMasterList) {
    {
      this.SiteDescId = OtSiteDescMasterList.SiteDescId || '';
      this.SiteDescriptionName = OtSiteDescMasterList.SiteDescriptionName || '';
      this.SurgeryCategoryName=OtSiteDescMasterList.SurgeryCategoryName || '';
      this.AddedBy = OtSiteDescMasterList.AddedBy || '';
      this.IsActive=OtSiteDescMasterList.IsActive || '';
    }
  }
}
