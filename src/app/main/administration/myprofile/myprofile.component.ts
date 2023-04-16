import { Component, OnInit } from '@angular/core';
import { UserList } from '../create-user/create-user.component';
import { Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SamplecollectionEntryService } from 'app/main/pathology/samplecollection-entry.service';
import { AdvanceDataStored } from 'app/main/ipd/ip-search-list/advance';
import { CreateUserService } from '../create-user/create-user.service';
import { CreateUserComponent } from '../create-user/create-user.component';
import { AdministrationService } from '../administration.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit {
  advanceData: any;
  selectedAdvanceObj: UserList;
  Indent:any;
  GRN:any;
  POVerify:any;
  Very:any;
  docname:any;
  active:any;
  Uname:any;
  ULoginName:any;
  rolename:any;
  storename:any;
  sIsLoading: string = '';
  isindentVerify:any;
  isGRNVerify:any;
  isPOVerify:any;
  isPurchaseRequestionVerify:any;
  isPathAuthorizationVerify:any;
  isCreditBillScroll:any;
  isCollectionInformation:any;
  isBedStatus:any;
  isCurrentStk:any;
  isPatientInfo:any;
  isViewBrowseBill:any;
  addChargeIsDelete:any;




  dataSource1 = new MatTableDataSource<UserList>();
  constructor(
    // public _CreateUserService: CreateUserService,
    //  public datePipe: DatePipe,
    // @Inject(MAT_DIALOG_DATA) public data: any,
     private dialogRef: MatDialogRef<MyprofileComponent>,
     public dialog: MatDialog,
    private accountService: AuthenticationService,
    public _AdministrationService: AdministrationService,
     private advanceDataStored: AdvanceDataStored,
     private _fuseSidebarService: FuseSidebarService,
  ) { 

    //  this.advanceData = data;
    // console.log(this.advanceData);
  }

  ngOnInit(): void {
    //  if (this.advanceDataStored.storage) {
    //     this.selectedAdvanceObj = this.advanceDataStored.storage;
  
    // if(this.selectedAdvanceObj.IsIndentVerify)
    // this.Indent="YES";
    // else
    // this. Indent='NO';
   
    
    // if(this.selectedAdvanceObj.IsGRNVerify)
    // this.GRN="YES";
    // else
    // this. GRN='NO';
   

    // if(this.selectedAdvanceObj.IsPOVerify)
    // this.POVerify="YES";
    // else
    // this. POVerify='NO';
   
    //  }

     console.log(this.accountService.currentUserValue);



    // if (this.advanceDataStored.storage) {
    //   this.selectedAdvanceObj = this.advanceDataStored.storage;

    // }

    // this.getSampledetailList();

    debugger;
    this.sIsLoading = 'loading-data';
    var m_data = {
      "UserName": this.accountService.currentUserValue.user.userName || '%',
    }
    console.log(m_data);
    this._AdministrationService.getUserList(m_data).subscribe(Visit => {
      // console.log(Visit);
      this.dataSource1.data = Visit as UserList[];
     
   //  this.docname=this.dataSource1.data.;
      // console.log(this.dataSource1.data[0].IsActive);
      this.Uname=this.dataSource1.data[0].UserName;
      this.ULoginName=this.dataSource1.data[0].UserLoginName;
      this.rolename=this.dataSource1.data[0].RoleName;
      this.docname=this.dataSource1.data[0].DoctorName;
      this.storename=this.dataSource1.data[0].StoreName;
      this.active=this.dataSource1.data[0].IsActive;
      this.isindentVerify=this.dataSource1.data[0].IsIndentVerify;
      this.isGRNVerify=this.dataSource1.data[0].IsGRNVerify;
      this.isPOVerify=this.dataSource1.data[0].IsPOVerify;
      this.isPurchaseRequestionVerify=this.dataSource1.data[0].IsPurchaseRequestionVerify;
      this.isPathAuthorizationVerify=this.dataSource1.data[0].IsPathAuthorizationVerify;
      this.isCreditBillScroll=this.dataSource1.data[0].IsCreditBillScroll;
      this.isCollectionInformation=this.dataSource1.data[0].IsCollectionInformation;
      this.isBedStatus=this.dataSource1.data[0].IsBedStatus;
      this.isCurrentStk=this.dataSource1.data[0].IsCurrentStk;
      this.isPatientInfo=this.dataSource1.data[0].IsPatientInfo;
      this.isViewBrowseBill=this.dataSource1.data[0].IsViewBrowseBill;
      this.addChargeIsDelete=this.dataSource1.data[0].AddChargeIsDelete;
     

        
      
    },
      );
  }



onClose() {
  
  this.dialogRef.close();
 }

}