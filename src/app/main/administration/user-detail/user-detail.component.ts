import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { AdministrationService } from '../administration.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { BatchAndExpDateAdjustmentService } from 'app/main/inventory/batch-and-exp-date-adjustment/batch-and-exp-date-adjustment.service';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations, 
})
export class UserDetailComponent implements OnInit {

  submitted = false;
  data1:[];

  StoreList: any = [];
  RoleList:any=[];
  DoctortypecmbList:any=[];
  UserForm:FormGroup;
   msg:any;
   
   snackmessage:any;
screenFromString = 'admission-form';
   //doctorone filter
public doctorFilterCtrl: FormControl = new FormControl();
public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

//role filter
public roleFilterCtrl: FormControl = new FormControl();
public filteredRole: ReplaySubject<any> = new ReplaySubject<any>(1);

//role filter
public storeFilterCtrl: FormControl = new FormControl();
public filteredStore: ReplaySubject<any> = new ReplaySubject<any>(1);

private _onDestroy = new Subject<void>();
  isLoading: string;
  
  

  constructor( public _UserService: AdministrationService,
    private accountService: AuthenticationService,
      // public notification:NotificationServiceService,
      public _matDialog: MatDialog,
      public _BatchAndExpDateAdjustmentService: BatchAndExpDateAdjustmentService,
      private _loggedService: AuthenticationService,
      public dialogRef: MatDialogRef<UserDetailComponent>,
      private _formBuilder: FormBuilder

  ) { }

  ngOnInit(): void {

    this.UserForm = this.createPesonalForm();

    this.getDoctorlist1();
    this. getRoleNamelist1();
   this.gePharStoreList();
    this.getRolelist();
    this.getDoctorlist();

    
   

    // this.roleFilterCtrl.valueChanges
    // .pipe(takeUntil(this._onDestroy))
    // .subscribe(() => {
    //   this.filterRole();
    // });
    
    // this.doctorFilterCtrl.valueChanges
    // .pipe(takeUntil(this._onDestroy))
    // .subscribe(() => {
    //   this.filterDoctor();
    // });
  }

  createPesonalForm() {
    return this._formBuilder.group({
      FirstName: '',
      LastName: '',
      LoginName: '',
      Password: '',
      StoreId:'',
      MailId: '',
      MailDomain: '',
      DoctorId: '',
      RoleName:'',
      Status: '',
      poverify: '',
      Ipoverify:'',
      Grnverify: '',
      Indentverify: '',
      IIverify: '',
      CollectionInformation: '',
      CurrentStock:'',
      PatientInformation: '',
      ViewBrowseBill: '',
      IsAddChargeDelete:'',
      IsPharmacyBalClearnace: '',
      BedStatus: '',
    });
    
  }


  
   // doctorone filter code  
   private filterDoctor() {

    if (!this.DoctortypecmbList) {
      return;
    }
    // get the search keyword
    let search = this.doctorFilterCtrl.value;
    if (!search) {
      this.filteredDoctor.next(this.DoctortypecmbList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDoctor.next(
      this.DoctortypecmbList.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );
}
  
  


   // role filter code  
   private filterRole() {

    if (!this.RoleList) {
      return;
    }
    // get the search keyword
    let search = this.roleFilterCtrl.value;
    if (!search) {
      this.filteredRole.next(this.RoleList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredRole.next(
      this.RoleList.filter(bank => bank.RoleName.toLowerCase().indexOf(search) > -1)
    );
}

 
gePharStoreList() {
  var vdata = {
    Id: this._loggedService.currentUserValue.user.storeId
  }
  console.log(vdata);
  this._BatchAndExpDateAdjustmentService.getLoggedStoreList(vdata).subscribe(data => {
    this.StoreList = data;
    // console.log(this.StoreList);
    this.UserForm.get('StoreId').setValue(this.StoreList[0]);
  });
}
  getRolelist(){
    this._UserService.getRoleCombobox().subscribe(data => { this.RoleList = data; 
      this.filteredRole.next(this.RoleList.slice());
    })
  }
  
  getDoctorlist(){
    this._UserService.getDoctorMasterCombo().subscribe(data => { this.DoctortypecmbList = data; 
      this.filteredDoctor.next(this.DoctortypecmbList.slice());
    })
  }
  DocotorList:any = [];
  RoleNameList:any = [];
  getDoctorlist1(){
    this._UserService.getDoctorMasterCombo().subscribe(data => {
       this.DocotorList = data; 
       //console.log(this.DocotorList);
    
    })
  }
  getRoleNamelist1(){
    this._UserService.getRoleCombobox().subscribe(data => {
       this.RoleNameList = data; 
       console.log(this.RoleNameList);
    
    })
  }
 








  onClose()
  {
    this.dialogRef.close();
  }

  Save() {
    this.isLoading = 'submit';

  var m_data = {
    "insertUserDetail": {
      "UserId": 0,
      "UserName":  '',
      "FirstName": this.UserForm.get('FirstName').value || '',
      "LastName": this.UserForm.get('LastName').value || '',
      "LoginName": this.UserForm.get('LoginName').value || '',
      "Password": this.UserForm.get('Password').value || 0,
      "StoreId": this.UserForm.get('StoreId').value.StoreId || 0,
      "RoleId": this.UserForm.get('RoleName').value.RoleId || 0,
      "MailDomain":  this.UserForm.get('MailDomain').value || 0,
      "DoctorId":  this.UserForm.get('DoctorId').value.DoctorId || 0,
      "Status": this.UserForm.get('Status').value || '',
      "poverify": this.UserForm.get('poverify').value || 0,
      "Ipoverify": this.UserForm.get('Ipoverify').value || 0,
      "Grnverify": this.UserForm.get('Grnverify').value || 0,
      "Indentverify": this.UserForm.get('Indentverify').value || 0,
      "IIverify": this.UserForm.get('IIverify').value || 0,
      "CollectionInformation": this.UserForm.get('CollectionInformation').value || '',
      "CurrentStock": this.UserForm.get('CurrentStock').value || 0,
      "PatientInformation": this.UserForm.get('PatientInformation').value || 0,
      "ViewBrowseBill": this.UserForm.get('ViewBrowseBill').value || 0,
      "IsAddChargeDelete": this.UserForm.get('IsAddChargeDelete').value || 0,
      "IsPharmacyBalClearnace": this.UserForm.get('IsPharmacyBalClearnace').value || 0,
      "BedStatus":  this.UserForm.get('BedStatus').value.DoctorId || 0,
      
    }
  }
  // this._UserService.UserInsert(m_data).subscribe(response => {
  //   if (response) {
  //     this.myFunction("UserDetail Data  saved', 'error !");
  //         this._matDialog.closeAll();
  //   } else {
  //     this.myFunction("UserDetail Data  not saved', 'error !");
  //     // Swal.fire('Error !', 'Register Data  not saved', 'error');
  //   }
  // });

  console.log(m_data);

  this._UserService.UserInsert(m_data).subscribe(response => {
    console.log(response);
    if (response) {
      Swal.fire('Congratulations !', 'New Prescription Saved Successfully  !', 'success').then((result) => {
        if (result.isConfirmed) {
          this._matDialog.closeAll();
        }   
      });
    } else {
      Swal.fire('Error !', 'Prescription Not Updated', 'error');
    }
    this.isLoading = '';
  });

}


myFunction(s) {
  this.snackmessage=s;
  console.log(s);
  console.log(this.snackmessage);
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
}
}


export class UserDetail {
  UserId: any;
  UserName: any;
  LoginName:  any;
  Password: any;
  StoreId: any;
  RoleId:  any;
  MailDomain:  any;
  DoctorId:  any;
  Status:  any;
  poverify:  any;
  Ipoverify: any;
  Grnverify:  any;
  Indentverify: any;
  IIverify:  any;
 
  /**
   * Constructor
   *
   * @param UserDetail
   */

  constructor(UserDetail) {
    {
      this.UserId = UserDetail.UserId || '';
      this.UserName = UserDetail.UserName || '';
      this.LoginName = UserDetail.LoginName || '';
      this.Password = UserDetail.Password || 0;
      this.StoreId = UserDetail.StoreId || '';
      this.RoleId = UserDetail.RoleId || '';
      this.MailDomain = UserDetail.MailDomain || '';
      this.DoctorId = UserDetail.DoctorId || 0;
      this.Status = UserDetail.Status || '';
      this.poverify = UserDetail.poverify || '';
      this.Ipoverify = UserDetail.Ipoverify || '';
      this.Grnverify = UserDetail.Grnverify || '';

      this.Indentverify = UserDetail.Indentverify || '';
      this.IIverify = UserDetail.IIverify || '';
     
    }
  }
}

