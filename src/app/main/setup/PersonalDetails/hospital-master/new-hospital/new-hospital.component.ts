import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HospitalService } from '../hospital.service';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { HospitalMaster } from '../hospital-master.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-new-hospital',
  templateUrl: './new-hospital.component.html',
  styleUrls: ['./new-hospital.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewHospitalComponent implements OnInit {
  Header: string;
  editorConfig: AngularEditorConfig = {
      // color:true,
      editable: true,
      spellcheck: true,
      height: '35rem',
      minHeight: '35rem',
      translate: 'yes',
      placeholder: 'Enter text here...',
      enableToolbar: true,
      showToolbar: true,

  };
  onBlur(e: any) {
      this.Header = e.target.innerHTML;
  }
  
    registerObj= new HospitalMaster({});
    optionsCity: any[] = [];
    cityList:any=[];
    filteredOptionsCity: Observable<string[]>;
    isCitySelected: boolean = false;
    vCityId:any;
    HospitalId=0;
    HospitalHeader:any='';
  constructor( public _HospitalService: HospitalService,
    public _matDialog: MatDialog,
    private reportDownloadService: ExcelDownloadService,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewHospitalComponent>,
    private _fuseSidebarService: FuseSidebarService) { }

  ngOnInit(): void {
    
    this.getcityList() 
    if(this.data){
      this.registerObj=this.data.registerObj;
     this.HospitalId=this.registerObj.HospitalId
     console.log(this.registerObj)
     this.getCitylist();
    }
         
    this.filteredOptionsCity = this._HospitalService.HospitalForm.get('CityId').valueChanges.pipe(
        startWith(''),
        map(value => this._filtercity(value)),
  
      );
  }

  onSubmit(){
    let hospitalarr = [];
   if(this.HospitalId==0){
    let hospitaldata = {};
    
    hospitaldata['HospitalName'] =  this._HospitalService.HospitalForm.get('HospitalName').value || '';
    hospitaldata['HospitalAddress'] =this._HospitalService.HospitalForm.get('HospitalAddress').value || '';
    hospitaldata['City'] =this._HospitalService.HospitalForm.get('CityId').value.CityName;
    hospitaldata['Pin'] = this._HospitalService.HospitalForm.get('Pin').value || '';
    hospitaldata['Phone'] = this._HospitalService.HospitalForm.get('Phone').value || '';
    hospitaldata['Email'] =this._HospitalService.HospitalForm.get('Email').value  || '';
    hospitaldata['Website'] = this._HospitalService.HospitalForm.get('website').value  || '';
    hospitaldata['HospitalHeader'] = this._HospitalService.HospitalForm.get('HospitalHeader').value  || '';
   
    let submitData = {
      hospitalMasterInsert:hospitaldata
    };
    
    console.log(submitData)
    this._HospitalService.HospitalInsert(submitData).subscribe(response => {
        if (response) {
          Swal.fire('Congratulations !', 'Hospital  Saved Successfully  !', 'success').then((result) => {
         
          });
        } else {
          Swal.fire('Error !');
        }
        
      });
    }else{
      let hospitaldata = {};
      hospitaldata['HospitalId'] = this.HospitalId;
      hospitaldata['HospitalName'] =  this._HospitalService.HospitalForm.get('HospitalName').value || '';
      hospitaldata['HospitalAddress'] =this._HospitalService.HospitalForm.get('HospitalAddress').value || '';
      hospitaldata['City'] =this._HospitalService.HospitalForm.get('CityId').value.CityName;
      hospitaldata['Pin'] = this._HospitalService.HospitalForm.get('Pin').value || '';
      hospitaldata['Phone'] = this._HospitalService.HospitalForm.get('Phone').value || '';
      hospitaldata['Email'] =this._HospitalService.HospitalForm.get('Email').value  || '';
      hospitaldata['Website'] = this._HospitalService.HospitalForm.get('website').value  || '';
      hospitaldata['HospitalHeader'] = this._HospitalService.HospitalForm.get('HospitalHeader').value  || '';
      // hospitalarr.push(hospitaldata);
  
     
      let submitData = {
        hospitalMasterUpdate:hospitaldata
      };
      
      console.log(submitData)
      this._HospitalService.HospitalUpdate(submitData).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Hospital Updated Successfully  !', 'success').then((result) => {
           
            });
          } else {
            Swal.fire('Error !');
          }
          
        });
    }
    this._matDialog.closeAll();
  }
  

  @ViewChild('hname') hname: ElementRef;
  @ViewChild('address') address: ElementRef;
  @ViewChild('city') city: ElementRef;
  @ViewChild('pin') pin: ElementRef;
  @ViewChild('phone') phone: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('website') website: ElementRef;

  public onEnterhname(event): void {
    if (event.which === 13) {
        // this.lname.nativeElement.focus();
    }
}

  public   onEntercity(event): void {

      if (event.which === 13) {
  
              // this.fname.nativeElement.focus();
          }
      }
  
  
  
  public onEnteraddress(event): void {
      if (event.which === 13) {
          // this.mname.nativeElement.focus();
      }
  }
  public onEnterpin(event): void {
      if (event.which === 13) {
          // this.lname.nativeElement.focus();
      }
  }
  public onEntermobile(event): void {
      if (event.which === 13) {
          // this.agey.nativeElement.focus();
          
      }
  }
  public onEnterEmail(event): void {
    if (event.which === 13) {
        // this.agey.nativeElement.focus();
        
    }
}


public onEnterwebsite(event): void {
  if (event.which === 13) {
      // this.agey.nativeElement.focus();
      
  }
}

getcityList() {

    this._HospitalService.getCityList().subscribe(data => {
      this.cityList = data;
      this.optionsCity = this.cityList.slice();
      this.filteredOptionsCity = this._HospitalService.HospitalForm.get('CityId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCity(value) : this.cityList.slice()),
      );
console.log(this.cityList)
    });

  }

getCitylist() {
    
    this._HospitalService.getCityList().subscribe(data => {
      this.cityList = data;
      if (this.data) {
        const ddValue = this.cityList.filter(c => c.CityId == this.registerObj.City);
        this._HospitalService.HospitalForm.get('CityId').setValue(ddValue[0]);
        this._HospitalService.HospitalForm.updateValueAndValidity();
        return;
      }
    });
   
  }


  getOptionTextCity(option) {
    return option && option.CityName ? option.CityName : '';

  }


  private _filterCity(value: any): string[] {
    if (value) {
      const filterValue = value && value.CityName ? value.CityName.toLowerCase() : value.toLowerCase();

      return this.optionsCity.filter(option => option.CityName.toLowerCase().includes(filterValue));
    }

  }

  private _filtercity(value: any): string[] {
    if (value) {
      const filterValue = value && value.CityName ? value.CityName.toLowerCase() : value.toLowerCase();
      return this.cityList.filter(option => option.CityName.toLowerCase().includes(filterValue));
    }
  }

  get f() {
    return this._HospitalService.HospitalForm.controls;
}
  onClose(){
    this._HospitalService.HospitalForm.reset();
    this._matDialog.closeAll();
  }

  onClear(){
    this._matDialog.closeAll();
  }
}
  

