import { Component, OnInit } from '@angular/core';
import { DischargetypeMasterService } from '../dischargetype-master.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-dischargetype',
  templateUrl: './new-dischargetype.component.html',
  styleUrls: ['./new-dischargetype.component.scss']
})
export class NewDischargetypeComponent implements OnInit {

  constructor( public _dischargetypeService: DischargetypeMasterService,
    public toastr : ToastrService) { }

  ngOnInit(): void {
  }
//   onSubmit() {
//     if (this._dischargetypeService.myform.valid) {
//         if (
//             !this._dischargetypeService.myform.get("DischargeTypeId").value
//         ) {
//             var m_data = {
//                 dischargeTypeMasterInsert: {
//                     dischargeTypeName: this._dischargetypeService.myform
//                         .get("DischargeTypeName")
//                         .value.trim(),
//                     isActive: 0,
//                     addedBy: 1,
//                     updatedBy: 1,
//                 },
//             };

//             this._dischargetypeService
//                 .dischargeTypeMasterInsert(m_data)
//                 .subscribe((data) => {
                    
//                     if (data) {
//                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
                       
//                     } else {
//                         this.toastr.error('DischargeType Master Data not saved !, Please check API error..', 'Error !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
//                     }
                    
//                 },error => {
//                     this.toastr.error('DischargeType Data not saved !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  });
//         } else {
//             var m_dataUpdate = {
//                 dischargeTypeMasterUpdate: {
//                     dischargeTypeId:
//                         this._dischargetypeService.myform.get(
//                             "DischargeTypeId"
//                         ).value,
//                     dischargeTypeName: this._dischargetypeService.myform
//                         .get("DischargeTypeName")
//                         .value.trim(),
//                     isActive: 0,
//                     updatedBy: 1,
//                 },
//             };

//             this._dischargetypeService
//                 .dischargeTypeMasterUpdate(m_dataUpdate)
//                 .subscribe((data) => {
                  
//                     if (data) {
//                         this.toastr.success('Record updated Successfully.', 'updated !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
                       
//                     } else {
                       
//                         this.toastr.error('DischargeType Master Data not Updated !, Please check API error..', 'Updated !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
                
//                     }
                  
//                 },error => {
//                     this.toastr.error('DischargeType Data not Updated !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  });
//         }
//        // this.onClear();
//     }
// }

}
