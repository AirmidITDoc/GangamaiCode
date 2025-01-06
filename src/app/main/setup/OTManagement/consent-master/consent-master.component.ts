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
import { ConsentMasterService } from './consent-master.service';
import { NewConsentMasterComponent } from './new-consent-master/new-consent-master.component';

@Component({
  selector: 'app-consent-master',
  templateUrl: './consent-master.component.html',
  styleUrls: ['./consent-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ConsentMasterComponent implements OnInit {

  hasSelectedContacts: boolean;
  dataSource = new MatTableDataSource<OtConsentMasterList>();
  sIsLoading: string = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  displayedColumns = [
    'OtConsentId',
    'OtConsentName',
    'IsActive',
    'action'
  ];

  constructor(public _otConsentService: ConsentMasterService,
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
  get f() { return this._otConsentService.myformSearch.controls; }

  getotConsentList(){

  }

  newConsent(){
    const dialogRef = this._matDialog.open(NewConsentMasterComponent,
      {
        maxWidth: "60%",
        width: "45%",
        height: "40%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getotConsentList();
    });
  }

  OnEdit(contact){
    const dialogRef = this._matDialog.open(NewConsentMasterComponent,
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
      this.getotConsentList();
    });
  }

  onClear() {
    this._otConsentService.myformSearch.reset({
      OtConsentNameSearch: "",
    });
    this.getotConsentList();
  }

}
export class OtConsentMasterList {
  OtConsentId:number;
  OtConsentName:string;
  IsActive:string;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(OtSiteDescMasterList) {
    {
      this.OtConsentId = OtSiteDescMasterList.OtConsentId || '';
      this.OtConsentName = OtSiteDescMasterList.OtConsentName || '';
      this.IsActive=OtSiteDescMasterList.IsActive || '';
    }
  }
}
