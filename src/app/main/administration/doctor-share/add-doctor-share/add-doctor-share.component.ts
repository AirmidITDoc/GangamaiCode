import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorShareService } from '../doctor-share.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { BillListForDocShrList } from '../doctor-share.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { AnyNaptrRecord } from 'dns';

@Component({
  selector: 'app-add-doctor-share',
  templateUrl: './add-doctor-share.component.html',
  styleUrls: ['./add-doctor-share.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AddDoctorShareComponent implements OnInit {
  displayedColumns:string[] = [ 
    'DoctorName',
    'ServiceName',
    'Share',
    'ShareAmt',
    'DocShareType',
    'ClassName',
    'OP_IP_Type',  
  ];

  DoctorListfilteredOptions:Observable<string[]>; 
  ClassListfilteredOptions:Observable<string[]>; 
  doctorNameCmbList:any=[];
  sIsLoading: string = '';
  isDoctorIDSelected: boolean=false;
  isServiceIDSelected: boolean=false; 
  isClassIdSelected: boolean=false; 
  ServiceList:any=[];
  filterdService:any;
  noOptionFound:any;
  
  dataSource = new MatTableDataSource<BillListForDocShrList>();
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  
  constructor(
    public _DoctorShareService: DoctorShareService,
    public datePipe: DatePipe, 
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getDoctorNameCombobox();
    this.getClassNameCombobox(); 
  }

  getDoctorNameCombobox() {
    this._DoctorShareService.getAdmittedDoctorCombo().subscribe(data => {
      this.doctorNameCmbList = data; 
      console.log(this.doctorNameCmbList);
      this.DoctorListfilteredOptions = this._DoctorShareService.UserFormGroup.get('DoctorID').valueChanges.pipe(
        startWith(''), 
        map(value => value ? this._filterDocname(value) : this.doctorNameCmbList.slice()),
      );
    });
  }
  private _filterDocname(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.doctorNameCmbList.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextDoctorName(option) {
    return option && option.Doctorname;
  } 

  getAddDoctorList() { 
    this.sIsLoading = 'loading-data';
    var m_data = { 
      "F_Name" : this._DoctorShareService.DocFormGroup.get('FirstName').value.Doctorname || '%',
      "L_Name" : this._DoctorShareService.DocFormGroup.get('LastName').value.Doctorname || '%',
      "ShrTypeSerOrGrp":this._DoctorShareService.DocFormGroup.get('Type').value
    } 
    console.log(m_data);
    this._DoctorShareService.getDocShrList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as BillListForDocShrList[];
      console.log(this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = ''; 
    },
      error => {
        this.sIsLoading = '';
      });
  } 
  

  getServiceListCombobox() {
    let tempObj;
    var m_data = {
      SrvcName: `${this._DoctorShareService.DocFormGroup.get('ServiceID').value}%`,
      TariffId: 0,
      ClassId:  0
    };
    if (this._DoctorShareService.DocFormGroup.get('ServiceID').value.length >= 1) {
      this._DoctorShareService.getServiceList(m_data).subscribe(data => {
        this.filterdService = data;
        this.ServiceList = data;
        if (this.filterdService.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      }); 
    }
  }
  getOptionTextService(option) { 
    return option && option.ServiceName ? option.ServiceName : ''; 
  }
  ClassList:any=[];
  getClassNameCombobox() {
    var vdata={
       'ClassName': this._DoctorShareService.DocFormGroup.get('ClassId').value || '%'
    }
    this._DoctorShareService.getClassList(vdata).subscribe(data => {
      this.ClassList = data; 
      console.log(this.ClassList);
      this.ClassListfilteredOptions = this._DoctorShareService.DocFormGroup.get('ClassId').valueChanges.pipe(
        startWith(''), 
        map(value => value ? this._filterClassName(value) : this.ClassList.slice()),
      );
    });
  }
  private _filterClassName(value: any): string[] {
    if (value) {
      const filterValue = value && value.ClassName ? value.ClassName.toLowerCase() : value.toLowerCase();
      return this.ClassList.filter(option => option.ClassName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextClassName(option) {
    return option && option.ClassName;
  } 
  onClose(){

  }
}
