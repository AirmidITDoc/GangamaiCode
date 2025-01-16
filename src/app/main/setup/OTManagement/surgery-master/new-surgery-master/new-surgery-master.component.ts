import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { SurgeryMasterService } from '../surgery-master.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-new-surgery-master',
  templateUrl: './new-surgery-master.component.html',
  styleUrls: ['./new-surgery-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewSurgeryMasterComponent implements OnInit {

  registerObj:any;
  vSurgeryId:string;
  vSurgeryName:string;
  vCategoryName:string;
  vDepartmentName:string;
  vAmount:string;
  vSystemName:string;
  vSiteName:string;
  vTemplateName:string;
  isDepartmentSelected:boolean=false;
  isSurgeryCatSelected: boolean = false;  
  isSiteSelected: boolean = false; 

  filteredOptionsDep: Observable<string[]>;
  optionsDep: any[] = [];
  DepartmentList: any = [];

  vSurgeryCategoryId:any=[];
  CategoryList: any = [];
  optionsSurgeryCategory: any[] = [];
  filteredOptionsSurgeryCategory: Observable<string[]>;
  
  vSiteDescId:any;
  optionsSite: any[] = [];
  filteredOptionsSite: Observable<string[]>;
  Sitelist: any = [];

  constructor(
    public _surgeryMasterService: SurgeryMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewSurgeryMasterComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getDepartmentList();
    this.getCategoryList();

    if(this.data){
      debugger
      this.registerObj=this.data.Obj;
      console.log("SurgeryObj:",this.registerObj)
      this.vSurgeryId=this.registerObj.SurgeryId;
      this.vSurgeryName = this.registerObj.SurgeryName;
      this.vAmount = this.registerObj.SurgeryAmount;      
      this.vDepartmentName = this.registerObj.DepartmentName;      
      this.vCategoryName = this.registerObj.SurgeryCategoryName;
      this.vSiteName = this.registerObj.SiteDescriptionName;

      if(this.registerObj.IsActive==true){
        this._surgeryMasterService.myform.get("IsDeleted").setValue(true)
      }else{
        this._surgeryMasterService.myform.get("IsDeleted").setValue(false)
      }
    }
  }

  onSave(){
    if (this.vDepartmentName == '' || this.vDepartmentName == null || this.vDepartmentName== undefined) {
      this.toastr.warning('Please select Department', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this._surgeryMasterService.myform.get('Departmentid').value) {
      if (!this.DepartmentList.find(item => item.DepartmentName == this._surgeryMasterService.myform.get('Departmentid').value.DepartmentName)) {
        this.toastr.warning('Please select Valid Department Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.vSurgeryCategoryId == '' || this.vSurgeryCategoryId == null || this.vSurgeryCategoryId== undefined) {
      this.toastr.warning('Please select SurgeryCategory', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this._surgeryMasterService.myform.get('SurgeryCategoryId').value) {
      if (!this.CategoryList.find(item => item.SurgeryCategoryName == this._surgeryMasterService.myform.get('SurgeryCategoryId').value.SurgeryCategoryName)) {
        this.toastr.warning('Please select Valid SurgeryCategory Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.vSiteDescId == '' || this.vSiteDescId == null || this.vSiteDescId== undefined) {
      this.toastr.warning('Please select SiteDescriptionName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this._surgeryMasterService.myform.get('SiteDescId').value) {
      if (!this.Sitelist.find(item => item.SiteDescriptionName == this._surgeryMasterService.myform.get('SiteDescId').value.SiteDescriptionName)) {
        this.toastr.warning('Please select Valid SiteDescription Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    // template and service remaining
    if (this.vSurgeryName == '' || this.vSurgeryName == null || this.vSurgeryName == undefined) {
      this.toastr.warning('Please enter SurgeryName ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vAmount == '' || this.vAmount == null || this.vAmount == undefined) {
      this.toastr.warning('Please enter SurgeryAmount ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    Swal.fire({
      title: 'Do you want to Save the OtRoom Recode ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save it!" ,
      cancelButtonText: "No, Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
          this.onSubmit();
      }
    });
  }

  onSubmit() {
    debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd'); 

    if(!this.vSurgeryId){

      var m_dataInsert={
        "saveMOTSurgeryMasterParam": {
          "surgeryName": this._surgeryMasterService.myform.get("SurgeryName").value || '',
          "surgeryCategoryId": this._surgeryMasterService.myform.get("SurgeryCategoryId").value.SurgeryCategoryId || 0,
          "departmentId": this._surgeryMasterService.myform.get("Departmentid").value.DepartmentId || 0,
          "surgeryAmount": parseFloat(this._surgeryMasterService.myform.get("Amount").value) || 0,
          "siteDescId": this._surgeryMasterService.myform.get("SiteDescId").value.SiteDescId || 0,
          "otTemplateID": 0, //this._surgeryMasterService.myform.get("Department").value.DepartmentId || 0,
          "serviceId": 0, //this._surgeryMasterService.myform.get("Department").value.DepartmentId || 0,
          "isActive": Boolean(JSON.parse(this._surgeryMasterService.myform.get("IsDeleted").value) || 0),
          "createdBy": this._loggedService.currentUserValue.user.id,
          "surgeryId": 0
        }
      }
      console.log("insertJson:", m_dataInsert);

      this._surgeryMasterService.OtSurgeryInsert(m_dataInsert).subscribe(response =>{
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
    else{
      debugger
      var m_dataUpdate={
          "updateMOTSurgeryMasterParam": {
          "surgeryId": this.vSurgeryId,
          "surgeryName": this._surgeryMasterService.myform.get("SurgeryName").value || '',
          "surgeryCategoryId": this._surgeryMasterService.myform.get("SurgeryCategoryId").value.SurgeryCategoryId || 0,
          "departmentId": this._surgeryMasterService.myform.get("Departmentid").value.DepartmentId || 0,
          "surgeryAmount": parseFloat(this._surgeryMasterService.myform.get("Amount").value) || 0,
          "siteDescId": this._surgeryMasterService.myform.get("SiteDescId").value.SiteDescId || 0,
          "otTemplateID": 0, //this._surgeryMasterService.myform.get("Department").value.DepartmentId || 0,
          "serviceId": 0, //this._surgeryMasterService.myform.get("Department").value.DepartmentId || 0,
          "isActive": Boolean(JSON.parse(this._surgeryMasterService.myform.get("IsDeleted").value) || 0),
          "modifiedBy": this._loggedService.currentUserValue.user.id,
        }
      }
      console.log("UpdateJson:", m_dataUpdate);

      this._surgeryMasterService.OtSurgeryUpdate(m_dataUpdate).subscribe(response =>{
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
  }

  // department dropdown
  private _filterDep(value: any): string[] {
    if (value) {
      const filterValue = value && value.DepartmentName ? value.DepartmentName.toLowerCase() : value.toLowerCase();
      return this.optionsDep.filter(option => option.DepartmentName.toLowerCase().includes(filterValue));
    }
  }

  getDepartmentList(){
    
    this._surgeryMasterService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDep = this.DepartmentList.slice();
      this.filteredOptionsDep = this._surgeryMasterService.myform.get('Departmentid').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );
      if(this.registerObj){
        
        const DValue = this.DepartmentList.filter(item => item.DepartmentName == this.registerObj.DepartmentName);
        console.log("Departmentid:",DValue)
        this._surgeryMasterService.myform.get('Departmentid').setValue(DValue[0]);
        this._surgeryMasterService.myform.updateValueAndValidity();
        return;
      }
      // this.filteredDepartment.next(this.DepartmentList.slice());
    });
  }
  getOptionTextDep(option) {
    
    return option && option.DepartmentName ? option.DepartmentName : '';
  }
  // end

  // surgery category dropdown
  getCategoryList() {
    
    this._surgeryMasterService.getCategoryCombo().subscribe(data => {
      this.CategoryList = data;
      this.optionsSurgeryCategory = this.CategoryList.slice();
      this.filteredOptionsSurgeryCategory = this._surgeryMasterService.myform.get('SurgeryCategoryId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSurgeryCategory(value) : this.CategoryList.slice()),
      );
      if (this.data) {
        debugger
        const DValue = this.CategoryList.filter(item => item.SurgeryCategoryId == this.registerObj.SurgeryCategoryId);
        console.log("SurgeryCategoryId:",DValue)
        this._surgeryMasterService.myform.get('SurgeryCategoryId').setValue(DValue[0]);
        this._surgeryMasterService.myform.updateValueAndValidity();
        this.onChangeSiteList(DValue[0]);
        return;
      }
    });

  }
  private _filterSurgeryCategory(value: any): string[] {
    if (value) {
      const filterValue = value && value.SurgeryCategoryName ? value.SurgeryCategoryName.toLowerCase() : value.toLowerCase();
      return this.optionsSurgeryCategory.filter(option => option.SurgeryCategoryName.toLowerCase().includes(filterValue));
    }

  }  
  
  getOptionTextautoSurgeryCategory(option) {
    return option && option.SurgeryCategoryName ? option.SurgeryCategoryName : '';
  }
  // end

  // site desc dropdown
  private _filterSite(value: any): string[] {
    if (value) {
      const filterValue = value && value.SiteDescriptionName ? value.SiteDescriptionName.toLowerCase() : value.toLowerCase();
      this.isSiteSelected=false;
      return this.optionsSite.filter(option => option.SiteDescriptionName.toLowerCase().includes(filterValue));
    }

  }
  getOptionTextautoSiteDesc(option) {
    return option && option.SiteDescriptionName ? option.SiteDescriptionName : '';
  }

  onChangeSiteList(systemObj){
    
    console.log(systemObj)
    this._surgeryMasterService.myform.get('SiteDescId').reset();
    var vdata={
      "Id":systemObj.SurgeryCategoryId
    } 
    this.isSurgeryCatSelected = true;

    this._surgeryMasterService.getSiteCombo(vdata).subscribe(
      data => {
        this.Sitelist = data;
        console.log(this.Sitelist)
        this.optionsSite = this.Sitelist.slice();
        this.filteredOptionsSite = this._surgeryMasterService.myform.get('SiteDescId').valueChanges.pipe(
          startWith(''),
            map(value => value ? this._filterSite(value) : this.Sitelist.slice()),
        );
        if (this.registerObj) {    
          debugger    
          const SValue = this.Sitelist.filter(item => item.SiteDescId == this.registerObj.SiteDescId);
          console.log("SiteDescId:",SValue)
          this._surgeryMasterService.myform.get('SiteDescId').setValue(SValue[0]);
          this._surgeryMasterService.myform.updateValueAndValidity();
          return;
        }
        console.log("Site ndfkdf:",this._surgeryMasterService.myform.get('SiteDescId').value)
      })

  }
  // end

  onClose(){
    this._surgeryMasterService.myform.reset({IsDeleted: true});
    this.dialogRef.close();
  }

}
export class SurgeryMasterList {
  SurgeryId:number;
  SurgeryName:string;
  CategoryName:string;
  DepartmentName:string;
  Amount:number;
  Site:string;
  IsDeleted:String;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(SurgeryMasterList) {
    {
      this.SurgeryId = SurgeryMasterList.SurgeryId || '';
      this.SurgeryName = SurgeryMasterList.SurgeryName || '';      
      this.CategoryName = SurgeryMasterList.CategoryName || '';
      this.DepartmentName = SurgeryMasterList.DepartmentName || '';   
      this.Amount = SurgeryMasterList.Amount || '';   
      this.Site = SurgeryMasterList.Site || '';
      this.IsDeleted = SurgeryMasterList.IsDeleted;
    }
  }
}
