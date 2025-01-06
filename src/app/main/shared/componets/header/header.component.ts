import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input('screenFrom') screenFromString = '';
  @Output() dateTimeEventEmitter = new EventEmitter<{}>();

  dateForm: UntypedFormGroup;
  HospitalName:any;
  HospitalAddress:any;
  Phone:any;
  EmailId:any;
  
  constructor() {}

  ngOnInit(): void {
  
    this.HospitalName='GANGAMI HOSPITAL'
    this.HospitalAddress='Plot No 1 CS No 279/2, Solapur City, Near Railway Under Park Modi Khana, Solapur-413007';
    this.Phone='9765999855';
    this.EmailId='GangamaiHospitalsolapur@gmail.com';

  
  }

// addData(){
  
//   this.HospitalName='GANGAMI HOSPITAL'
//     this.HospitalAddress='Plot No 1 CS No 279/2, Solapur City, Near Railway Under Park Modi Khana, Solapur-413007';
//     this.Phone='9765999855';
//     this.EmailId='GangamaiHospitalsolapur@gmail.com';

// }
  
}
