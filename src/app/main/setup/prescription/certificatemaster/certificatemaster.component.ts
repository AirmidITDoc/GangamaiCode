import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CertificatemasterService } from './certificatemaster.service';
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
import { NewCertificatemasterComponent } from './new-certificatemaster/new-certificatemaster/new-certificatemaster.component';
import { Row } from 'jspdf-autotable';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-certificatemaster',
  templateUrl: './certificatemaster.component.html',
  styleUrls: ['./certificatemaster.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CertificatemasterComponent implements OnInit {

  sIsLoading: string = '';
  hasSelectedContacts: boolean;
  dataSource = new MatTableDataSource<CertificateList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns = [
    // 'PhoneAppId',
    'CertificateId',
    'CertificateName',
    'CertificateDesc',
    'IsActive',
    'action'
  ];

  constructor(public _certificatetemplateService: CertificatemasterService,
    private accountService: AuthenticationService,
    public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    private _ActRoute: Router,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
  ) { }

  ngOnInit(): void {
    this.getCertificateTempletList();
  }

  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  // field validation 
  get f() { return this._certificatetemplateService.myformSearch.controls; }

  getCertificateTempletList(){
    debugger
    this.sIsLoading = 'loading-data';
    var D_data = {
      "CertificateName": this._certificatetemplateService.myformSearch.get("TemplateNameSearch").value + '%' || '%',
    }
    console.log("certificateList:", D_data);
    this._certificatetemplateService.getCertificatelist(D_data).subscribe(Visit => {
    this.dataSource.data = Visit as CertificateList[];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  newCertificateTemplate(){
    const dialogRef = this._matDialog.open(NewCertificatemasterComponent,
      {
        maxWidth: "80%",
        width: "80%",
        height: "95%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getCertificateTempletList();
    });
  }

  onClear() {
    this._certificatetemplateService.myformSearch.reset({
      TemplateNameSearch: "",
    });
    this.getCertificateTempletList();
  }

  OnEdit(row){
    console.log("row:",row)
    const dialogRef = this._matDialog.open(NewCertificatemasterComponent,
      {
        maxWidth: "80%",
        width: "80%",
        height: "95%",
        data:{
          obj:row,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getCertificateTempletList();
    });
  }

  onDeactive(CertificateId){
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
        const tableItem = this.dataSource.data.find(item => item.CertificateId === CertificateId);
        console.log("table:",tableItem)
    
        if (tableItem.IsActive) {
            Query = "Update M_CertificateMaster set IsActive=0 where CertificateId=" + CertificateId;
        } else {
            Query = "Update M_CertificateMaster set IsActive=1 where CertificateId=" + CertificateId;
        }
    
        console.log("query:", Query);
    
        this._certificatetemplateService.deactivateTheStatus(Query)
            .subscribe(
                (data) => {
                    Swal.fire('Changed!', 'Certificate Status has been Changed.', 'success');
                    this.getCertificateTempletList();
                },
                (error) => {
                    Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                }
            );
    }
    
  });
  }
}

export class CertificateList {
  CertificateId:number;
  CertificateName:string;
  CertificateDesc:string;
  IsActive:String;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(CertificateList) {
    {
      this.CertificateId = CertificateList.CertificateId || '';
      this.CertificateName = CertificateList.CertificateName || '';
      this.CertificateDesc = CertificateList.CertificateDesc || '';
      this.IsActive = CertificateList.IsActive || '';
    }
  }
}