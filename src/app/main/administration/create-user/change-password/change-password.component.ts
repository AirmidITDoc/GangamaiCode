import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { UserList } from '../create-user.component';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { UntypedFormBuilder, FormGroup, FormBuilder } from '@angular/forms';
import { AdministrationService } from '../../administration.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import Swal from 'sweetalert2';
import { CreateUserService } from '../create-user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

 
 
    // selectedAdvanceObj: UserList;
    hasSelectedContacts: boolean;
    fname: String;
    lname: String;
    Uname: String;
    changePasswordFormGroup: FormGroup;
    hide = true;
    UserId:any;
    passrule:boolean=false;
    
    constructor(private _fuseSidebarService: FuseSidebarService,
      private accountService: AuthenticationService,
      private dialogRef: MatDialogRef<ChangePasswordComponent>,
      public dialog: MatDialog,
      public _CreateUserService: CreateUserService,
      private advanceDataStored: AdvanceDataStored,
      public _matDialog: MatDialog,
      private formBuilder: FormBuilder,) {
      dialogRef.disableClose = true;
      this.UserId= this.accountService.currentUserValue.user.id;
    }
  
    ngOnInit(): void {
      this.changePasswordFormGroup = this.createchangePasswordForm();
      this.fname = this.accountService.currentUserValue.user.firstName;
      this.lname = this.accountService.currentUserValue.user.lastName;
      this.Uname = this.accountService.currentUserValue.user.userName;
    }
    toggleSidebar(name): void {
      this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    onClose() {
      this.dialogRef.close();
    }
  
    onClear(){
      this.changePasswordFormGroup.get("password").reset();
    }
  
    passrulesdisp(){
      setTimeout(() => {
        this.passrule=true;
      }, 500);
      this.passrule=false;
    }
    changepassflag(){
      this.passrule=false;
    }
   
    createchangePasswordForm() {
      return this.formBuilder.group({
        fname: '',
        lname: '',
        Uname: '',
        password: '',
      });
    }
  
    changepassword() {
      let pass = this.changePasswordFormGroup.get('password').value;
      let id = this.accountService.currentUserValue.user.id;
  
      // let UpdateUserPassword = "update LoginManager set Password ='" + pass + "' where UserId=" + id 
      let changePasswordObj = {};
      changePasswordObj['userId'] =  this.UserId
      changePasswordObj['userName'] = this.Uname;
      changePasswordObj['password'] = this.changePasswordFormGroup.get('password').value || ''
  
        let submitData = {
          "changePassword": changePasswordObj,
        }
      
    //   this._CreateUserService.getpasswwordChange(submitData).subscribe(data => {
    //     if (data) {
    //       Swal.fire('Pasword Changed!', 'Record updated Successfully !', 'success').then((result) => {
    //         if (result.isConfirmed) {
    //           this._matDialog.closeAll();
    //         }
    //       });
    //     } else {
    //       Swal.fire('Error !', 'Password not Updated', 'error');
    //     }
    //   },
        // (error) => {
        //   this.isLoading = 'list-loaded';
        // }
    //   );
    }
  
    screenFromString = 'OP-billing';
    dateTimeObj: any;
    getDateTime(dateTimeObj) {
      this.dateTimeObj = dateTimeObj;
    }
  }
  
  
  