import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { AdministrationService } from '../administration.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  submitted = false;
  data1:[];

  StoreList:any=[];
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
  formBuilder: any;

  constructor( public _UserService: AdministrationService,
    private accountService: AuthenticationService,
      // public notification:NotificationServiceService,
      public _matDialog: MatDialog,
      public dialogRef: MatDialogRef<UserDetailComponent>,

  ) { }

  ngOnInit(): void {

    this.UserForm = this.createPesonalForm();


    this.getstorelist();
    this.getRolelist();
    this.getDoctorlist();

    
    this.storeFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterStore();
    });

    this.roleFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterRole();
    });
    
    this.doctorFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterDoctor();
    });
  }

  createPesonalForm() {
    return this.formBuilder.group({
      UserId: '',
      UserName: '',
      LoginName: '',
      Password: '',
      StoreId:'',
      RoleId: '',
      MailDomain: '',
      DoctorId: '',
      Status: '',
      poverify: '',
      Ipoverify:'',
      Grnverify: '',
      Indentverify: '',
      IIverify: ''
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
  
   // store filter code  
   private filterStore() {

    if (!this.StoreList) {
      return;
    }
    // get the search keyword
    let search = this.storeFilterCtrl.value;
    if (!search) {
      this.filteredStore.next(this.StoreList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredStore.next(
      this.StoreList.filter(bank => bank.StoreName.toLowerCase().indexOf(search) > -1)
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

  getstorelist(){
    this._UserService.getStoreCombo().subscribe(data => { this.StoreList = data; 
      this.filteredStore.next(this.StoreList.slice());
    })
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

  onClose()
  {
    this.dialogRef.close();
  }
  Save() {

  var m_data = {
    "insertUserDetail": {
      "UserId": 0,
      "UserName": this.UserForm.get('UserName').value || '',
      "LoginName": this.UserForm.get('LoginName').value || '',
      "Password": this.UserForm.get('Password').value || 0,
      "StoreId": this.UserForm.get('StoreId').value.StoreId || 0,
      "RoleId": this.UserForm.get('RoleId').value.RoleId || 0,
      "MailDomain":  this.UserForm.get('MailDomain').value || 0,
      "DoctorId":  this.UserForm.get('DoctorId').value.DoctorId || 0,
      "Status": this.UserForm.get('Status').value || '',
      "poverify": this.UserForm.get('poverify').value || 0,
      "Ipoverify": this.UserForm.get('Ipoverify').value || 0,
      "Grnverify": this.UserForm.get('Grnverify').value || 0,
      "Indentverify": this.UserForm.get('Indentverify').value || 0,
      "IIverify": this.UserForm.get('IIverify').value || 0
    }
  }
  this._UserService.UserInsert(m_data).subscribe(response => {
    if (response) {
      this.myFunction("UserDetail Data  saved', 'error !");
          this._matDialog.closeAll();
    } else {
      this.myFunction("UserDetail Data  not saved', 'error !");
      // Swal.fire('Error !', 'Register Data  not saved', 'error');
    }
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

