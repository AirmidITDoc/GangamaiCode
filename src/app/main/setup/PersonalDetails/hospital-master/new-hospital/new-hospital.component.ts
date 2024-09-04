import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HospitalService } from '../hospital.service';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-hospital',
  templateUrl: './new-hospital.component.html',
  styleUrls: ['./new-hospital.component.scss']
})
export class NewHospitalComponent implements OnInit {
    registerObj: any;
  
  constructor( public _HospitalService: HospitalService,
    public _matDialog: MatDialog,
    private reportDownloadService: ExcelDownloadService,
    public toastr: ToastrService,
    private _fuseSidebarService: FuseSidebarService,) { }

  ngOnInit(): void {
  }

  onSubmit(){}
  

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

  public   onEntercity(event, value): void {

      if (event.which === 13) {
  
          console.log(value)
          if (value == undefined) {
              this.toastr.warning('Please Enter Valid Prefix.', 'Warning !', {
                  toastClass: 'tostr-tost custom-toast-warning',
              });
              return;
          } else {
              // this.fname.nativeElement.focus();
          }
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
  
}
