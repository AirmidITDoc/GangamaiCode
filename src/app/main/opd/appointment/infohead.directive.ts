import { Directive } from '@angular/core';
import Swal from 'sweetalert2';

@Directive({
  selector: '[appInfohead]'
})
export class InfoheadDirective {
  HospitalName: any;
  HospitalAddress: any;
  Phone: any;
  EmailId: any;
  formBuilder: any;
  name: any;

  constructor() {
    // this.dis() 
    this.HospitalName = 'GANGAMI HOSPITAL'
    this.HospitalAddress = 'Plot No 1 CS No 279/2, Solapur City, Near Railway Under Park Modi Khana, Solapur-413007'
    this.Phone = '9765999855'
    this.EmailId = 'GangamaiHospitalsolapur@gmail.com'


    var strabc = `<div style="display:flex"><img class="logo-print" src="../../../../assets/images/logos/Hospital_logo.jpg"
    width="910" height="110">
  <div>
    <div
      style="font-weight:700;font-size:30px;text-align:left;width:1100px;margin-left:290px;font-family:serif;font-size:x-large;padding-top:10px">
     ' + this.HospitalName +' </div>
    <div
      style="color:#464343;text-align:left;font-size:18px;width:1100px;margin-left:90px;font-family:serif;font-weight:700">
     ' + this.HospitalAddress + '</div>
    <div
      style="color:#464343;text-align:left;font-size:18px;width:900px;margin-left:180px;font-family:serif;font-weight:700">
     '+ Call:- {{Phone}}, EmailId : {{EmailId}} + '</div>
  </div>
</div>`;

    Swal.fire(strabc)
  }



  dis() {
    let docname = '';
    var strabc = `<hr style="border-color:white" >
<div style="display:flex;margin:8px 0">
<div style="display:flex;width:60px;margin-left:20px;">
    <div>`+ 1 + `</div> <!-- <div>BLOOD UREA</div> -->
</div>
<div style="display:flex;width:300px;margin-left:10px;text-align:left;">
    <div>`+ 'ServiceName' + `</div> <!-- <div>BLOOD UREA</div> -->
</div>
<div style="display:flex;width:300px;margin-left:10px;text-align:left;">
<div>`+ 'docname' + `</div> <!-- <div>BLOOD UREA</div> -->
</div>
<div style="display:flex;width:80px;margin-left:10px;text-align:left;">
    <div>`+ '₹' + 'objreportPrint.Price.toFixed(2)' + `</div> <!-- <div>450</div> -->
</div>
<div style="display:flex;width:80px;margin-left:10px;text-align:left;">
    <div>`+ 'objreportPrint.Qty' + `</div> <!-- <div>1</div> -->
</div>
<div style="display:flex;width:110px;margin-left:30px;text-align:center;">
    <div>`+ '₹' + 'objreportPrint.NetAmount.toFixed(2)' + `</div> <!-- <div>450</div> -->
</div>
</div>`;
    // strrowslist += strabc;
  }

}