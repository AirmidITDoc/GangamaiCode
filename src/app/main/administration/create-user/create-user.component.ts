import { Component, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AdministrationService } from '../administration.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { CreateUserService } from './create-user.service';
import { PasswordChangeComponent } from '../password-change/password-change.component';
import { RoleTemplateMasterComponent } from '../role-template-master/role-template-master.component';
import { MyprofileComponent } from '../myprofile/myprofile.component';
import { UserDetailComponent } from '../user-detail/user-detail.component';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CreateUserComponent implements OnInit {
  isLoading:boolean;
  UserIdList :any =[];
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  hasSelectedContacts: boolean;
  click : boolean = false;
  
  MouseEvent=true;
  displayedColumns: string[] = [
    
   
    
    // 'UserId',
	  // 'FirstName',
    // 'LastName',
    'UserName',
  	'UserLoginName',
    'RoleName',
   
    'StoreName',
    'DoctorName',
    'IsDateIntervalDays',
    'MailDomain',
     'MailId' ,
    'IsActive',
    'AddChargeIsDelete',
    'IsBedStatus',
    'IsCollection',
    'IsCurrentStk',
    'IsDateInterval',
    'IsDoctorType',
    'IsGRNVerify',
    'IsInchIndVfy',
    'IsIndentVerify',
    'IsPOVerify',
    'IsPatientInfo',
    
    
    'action'

  ]; 
  sIsLoading: string = '';
  dataSource1 = new MatTableDataSource<UserList>();

  dataSource = new MatTableDataSource<UserMaster>();
  
  constructor(public _UserService: CreateUserService,
    private accountService: AuthenticationService,
    // public notification:NotificationServiceService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    private advanceDataStored: AdvanceDataStored,
    public _AdministrationService: AdministrationService,
    ) { }


  ngOnInit(): void {
    this.getUserList();

    
  }
 

   onEdit(row) {
    var m_data ={
    
    "RollId":row.RollId,
	  "RollName":row.RollName,
    // "FirstName":row.FirstName.trim(),
	  // "MiddleName":row.MiddleName.trim(),
    // "LastName":row.LastName.trim(),
    // "DateofBirth":row.DateofBirth,
	  // "Address":row.Address.trim(),
	  // "City":row.City.trim(),
	  // "Pin":row.Pin.trim(),
	  // "Phone":row.Phone.trim(),
	  
  }

    console.log(m_data);
    this._UserService.populateForm(m_data);

    // const dialogRef = this._matDialog.open(ChangePasswordComponent, 
    //   {  maxWidth: "40vw",
    //   maxHeight: "80vh", width: '100%', height: "100%"
    // });
    
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed - Insert Action', result);
    //   // this.getDoctorMasterList();
    // });
  } 

  ChangePassword(){
    
    const dialogRef = this._matDialog.open(PasswordChangeComponent, 
      {  maxWidth: "40vw",
      maxHeight: "50vh", width: '100%', height: "100%"
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      // this.getDoctorMasterList();
    });
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  RoleTemp() {
    const dialogRef = this._matDialog.open(RoleTemplateMasterComponent,
      {
        maxWidth: "80vw",
        maxHeight: "300vh", width: '100%', height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }



  // addNewProfile(contact,m):void{
  //   ;
    
  
  //    console.log(contact);
         
  //      let xx = {
        
  //               FirstName: contact.FirstName,
  //               LastName: contact.LastName,
  //               LoginName:contact.LoginName,
  //                Password:contact.Password,
  //                RoleName:contact.RoleName,
  //                MailDomain:contact.MailDomain,
  //                 MailId:contact.MailId,
  //                DoctorId:contact.DoctorId,
        
        
  //      };
  //       this.advanceDataStored.storage = new AdvanceDetailObj(xx);
      
  //         const dialogRef = this._matDialog.open(ProfieComponent, 
  //         {   maxWidth: "80vw",
  //               maxHeight: "75vh", width: '100%', height: "100%",
           
            
  //       });
        
  //       dialogRef.afterClosed().subscribe(result => {
  //         console.log('The dialog was closed - Insert Action', result);
        
  //       });
  //    }




  onresultentry(c,m) {
    console.log(m);
    
     let xx = {
     
      UserLoginName: m.UserLoginName,
      RoleName: m.RoleName,
      UserName: m.UserName,
      StoreName:m. StoreName,
      DoctorName:m.DoctorName,
      IsDateIntervalDays: m.IsDateIntervalDays,
      MailDomain:m.MailDomain,
      MailId:m.MailId,
      IsActive:m. IsActive,
      AddChargeIsDelete:m. AddChargeIsDelete,
      IsBedStatus: m.IsBedStatus,
      IsCollection: m.IsCollection,
      IsCurrentStk:m.IsCurrentStk,
      IsDateInterval:m.IsDateInterval,
      IsDoctorType:m.IsDoctorType,
      IsGRNVerify:m.IsGRNVerify,
      IsInchIndVfy:m.IsInchIndVfy,
      IsIndentVerify:m.IsIndentVerify,
      IsPOVerify:m.IsPOVerify,
      IsPatientInfo:m.IsPatientInfo,
      UserId :m.UserId,
      IsPurchaseRequestionVerify:m.IsPurchaseRequestionVerify,
      IsPathAuthorizationVerify:m.IsPathAuthorizationVerify,
      IsCreditBillScroll:m.IsCreditBillScroll,
      IsCollectionInformation:m.IsCollectionInformation,
      IsViewBrowseBill:m.IsViewBrowseBill,

     
     };

      this.advanceDataStored.storage = new UserList(xx);
            
            
           const dialogRef = this._matDialog.open(MyprofileComponent, 
             {  
              maxWidth: "55vw",
              maxHeight: "100vh", width: '100%',
              // height: "100%",

           });
           dialogRef.afterClosed().subscribe(result => {
             console.log('The dialog was closed - Insert Action', result);
           
           });
               
 }

  // addNewProfile() {
  //   const dialogRef = this._matDialog.open(ProfieComponent,
  //     {
  //       maxWidth: "80vw",
  //       maxHeight: "52vh", width: '100%', height: "100%"

  //     });
  //   // dialogRef.afterClosed().subscribe(result => {
      
  //   // });
  // }

  addUserDetails() {
    const dialogRef = this._matDialog.open(UserDetailComponent,
      {
        maxWidth: "75vw",
        // maxHeight: "95vh", 
        height: "60vh",
        width: '100%',
        // height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      // this.getAdmittedPatientList();
    });
  }

 

  onShow(event:MouseEvent) {
    this.click=!this.click;
      setTimeout(() => {    
        {       
         this.sIsLoading = 'loading-data';
       
         this. getUserList(); 
       }
        
     }, 1000);
        this.MouseEvent=true;
        this.click = true;
 }

  onClear() {

    this._UserService.myformSearch.get('UserName').reset();
   
  }

  getUserList() {
    this.sIsLoading = 'loading-data';
    var m_data = {
      "UserName": (this._UserService.myformSearch.get("UserName").value).trim() || '%',
    }
    this._UserService.getUserList(m_data).subscribe(Visit => {
      this.dataSource1.data = Visit as UserList[];
      console.log(this.dataSource1.data);
      this.dataSource1.sort = this.sort;
      this.dataSource1.paginator = this.paginator;
      this.sIsLoading = '';
      this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });
  }


}
export class UserList {
  UserId:number;
  FirstName: string;
  LastName: string;
  UserLoginName: string;
  RoleName: string;
  UserName: string;
  StoreName: string;
  DoctorName:string;
  IsDateIntervalDays:number;
  MailDomain:string;
  MailId:string;
  IsActive: boolean;
  AddChargeIsDelete: boolean;
  IsBedStatus: boolean;
  IsCollection: boolean;
  IsCurrentStk:boolean;
  IsDateInterval:number;
  IsDoctorType:boolean;
  IsGRNVerify:boolean;
  IsInchIndVfy:boolean;
  IsIndentVerify:boolean;
  IsPOVerify:boolean;
  IsPatientInfo:boolean;
  IsPurchaseRequestionVerify:boolean;
  IsPathAuthorizationVerify:boolean;
  IsCreditBillScroll:boolean;
  IsCollectionInformation:boolean;
  IsViewBrowseBill:boolean;
  Indent: string;

  constructor(UserList) {
    this.UserId=UserList.UserId || 0;
    this.FirstName = UserList.FirstName ||'';
    this.LastName = UserList.LastName ||'';
    this.UserLoginName = UserList.UserLoginName || '';
    this.RoleName = UserList.RoleName || ''
    this.UserName = UserList.UserName ||'';
    this.StoreName = UserList.StoreName ||'';
    this.DoctorName = UserList.DoctorName ||'';
    this.IsDateIntervalDays = UserList.IsDateIntervalDays ||0;
    this.MailDomain = UserList.MailDomain ||'';
    this.MailId = UserList.MailId ||'';
    this.IsActive = UserList.IsActive || 0;
    this.AddChargeIsDelete = UserList.AddChargeIsDelete || 0;
    this.IsBedStatus = UserList.IsBedStatus || 0;
    this.IsCollection = UserList.IsCollection || 0;
    this.IsCurrentStk = UserList.IsCurrentStk || 0;
    this.IsDateInterval= UserList.IsDateInterval || 0;
    this.IsDoctorType= UserList.IsDoctorType || 0;
    this. IsGRNVerify= UserList.IsGRNVerify || 0;
    //this.IsGRNVerify= UserList.IsGRNVerify || 0;
    this.IsInchIndVfy = UserList.IsInchIndVfy || 0;
    this.IsIndentVerify= UserList.IsIndentVerify || 0;
   
    // if(this. IsGRNVerify= true)
    // this. IsGRNVerify= UserList.IsGRNVerify || 'YES';
    // else(this. IsGRNVerify= false)
    // this. IsGRNVerify= UserList.IsGRNVerify || 'NO';
    
    this.IsPOVerify= UserList.IsPOVerify || 0;
    this.IsPatientInfo= UserList.IsPatientInfo || 0;
    this.IsPurchaseRequestionVerify= UserList.IsPurchaseRequestionVerify || 0;
    this. IsPathAuthorizationVerify= UserList.IsPathAuthorizationVerify || 0;
    this.IsCreditBillScroll= UserList.IsCreditBillScroll || 0;
    this.IsCollectionInformation= UserList.IsCollectionInformation || 0;
    this.IsViewBrowseBill= UserList.IsViewBrowseBill || 0;


   
   
  }

}

export class UserMaster {
    
  UserId:Number;
  FirstName:String;
  LastName:String;
  LoginName:String;
  Password:String;
  RoleId:Number;
  RoleName:String;
  IsDoctor:Boolean;
  DoctorName:String;
  StoreId:Number;
  StoreName:String;
  MAilId:String;
  MailDomain:String;
  Status:boolean;
  /**
   * Constructor
   *
   * @param UserMaster
   */
  constructor(UserMaster) {
      {
          this.UserId = UserMaster.UserId || '';
          this.FirstName = UserMaster.FirstName || '';
          this.LastName = UserMaster.LastName || '';
          this.LoginName = UserMaster.LoginName || '';
          this.Password = UserMaster.Password || '';
          this.RoleId = UserMaster.RoleId || '';
          this.RoleName = UserMaster.RoleName || '';
          this.IsDoctor = UserMaster.IsDoctor || '';
          this.DoctorName = UserMaster.DoctorName || '';
          this.StoreId = UserMaster.StoreId || '';
          this.StoreName = UserMaster.StoreName || '';
          this.MAilId = UserMaster.MAilId || '';
          this.MailDomain = UserMaster.MailDomain || '';
          this.Status = UserMaster.Status || '';
          
      }
  }
}






