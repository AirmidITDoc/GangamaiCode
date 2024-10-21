import { Component, OnInit } from '@angular/core';
import { BedMasterService } from '../bed-master.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-bed',
  templateUrl: './new-bed.component.html',
  styleUrls: ['./new-bed.component.scss']
})
export class NewBedComponent implements OnInit {

  constructor(public _bedService: BedMasterService,
    public toastr : ToastrService) { }

  ngOnInit(): void {
  }

  onClear(){}
  onSubmit(){}
//   onSubmit() {
//     if (this._bedService.myform.valid) {
//         if (!this._bedService.myform.get("BedId").value) {
//             var m_data = {
//                 bedMasterInsert: {
//                     bedName_1: this._bedService.myform
//                         .get("BedName")
//                         .value.trim(),
//                     roomId_2:
//                         this._bedService.myform.get("RoomId").value.RoomId,
//                     isAvailible_3: 1,
//                     //addedBy: 1,
//                     isActive_4: 0,
//                 },
//             };

//             this._bedService.bedMasterInsert(m_data).subscribe((data) => {
               
//                 if (data) {
//                     this.toastr.success('Record Saved Successfully.', 'Saved !', {
//                         toastClass: 'tostr-tost custom-toast-success',
//                       });
                  
//                 } else {
//                     this.toastr.error('Bed Master Data not saved !, Please check API error..', 'Error !', {
//                         toastClass: 'tostr-tost custom-toast-error',
//                       });
//                 }
              
//             },error => {
//                 this.toastr.error('Bed Data not saved !, Please check API error..', 'Error !', {
//                  toastClass: 'tostr-tost custom-toast-error',
//                });
//              });
//         } else {
//             var m_dataUpdate = {
//                 bedMasterUpdate: {
//                     bedId_1: this._bedService.myform.get("BedId").value,
//                     bedName_2: this._bedService.myform
//                         .get("BedName")
//                         .value.trim(),
//                     roomId_3:
//                         this._bedService.myform.get("RoomId").value.RoomId,
//                     // isAvailable: 1,
//                     isActive_4: 0,
//                     //  updatedBy: 1,
//                 },
//             };

//             this._bedService
//                 .bedMasterUpdate(m_dataUpdate)
//                 .subscribe((data) => {
                    
//                     if (data) {
//                         this.toastr.success('Record updated Successfully.', 'updated !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
                       
//                     } else {
                       
//                         this.toastr.error('Bed Master Data not Updated !, Please check API error..', 'Updated !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
                
//                     }
                   
//                 },error => {
//                     this.toastr.error('Bed Data not Updated !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  });
//         }
//        // this.onClear();
//     }
// }
}
