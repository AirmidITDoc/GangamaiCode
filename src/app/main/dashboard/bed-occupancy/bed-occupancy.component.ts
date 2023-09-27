import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-bed-occupancy',
  templateUrl: './bed-occupancy.component.html',
  styleUrls: ['./bed-occupancy.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class BedOccupancyComponent implements OnInit {


  warDataArr: WardDetails[] = [];
  warItemArr: WardItemDetails[] = [];
  prevSelectedWard: WardDetails;

  constructor(
    public _dashboardServices: DashboardService
  ) { }

  ngOnInit(): void {
    this.getWard();
  }

  getWard() {
    this._dashboardServices.getWard({}).subscribe(data => {
      this.warDataArr = data as WardDetails [];
      this.warDataArr.forEach(element => {
        element['isSelected'] = false;
      });
      this.warDataArr[0].isSelected = true;
      this.prevSelectedWard = this.warDataArr[0]; 
      console.log(this.warDataArr);
      this.getWardDetails(this.prevSelectedWard.RoomId);
    });
  }

  onSelectWard(element: WardDetails) {
    this.prevSelectedWard.isSelected = false;
    this.prevSelectedWard = element;
    element.isSelected = true;
    this.getWardDetails(element.RoomId);
    console.log(element)
  }

  getWardDetails(item: any) {
    let reqParam = {
      WardId: item
    }
    this._dashboardServices.getWardDetails(reqParam).subscribe(data => {
      console.log(data);
      this.warItemArr = data as WardItemDetails [];
    });
  }

}
export class WardDetails {
  AvailableCount: number;
  LocationName: String;
  OccuipedCount: number;
  RoomId: number;
  RoomName: String;
  isSelected: boolean = false;

  constructor(wardData) {
    this.AvailableCount = wardData.AvailableCount || 0;
    this.LocationName = wardData.LocationName || '';
    this.OccuipedCount = wardData.OccuipedCount || 0;
    this.RoomId = wardData.RoomId || 0;
    this.RoomName = wardData.RoomName || '';
    this.isSelected = wardData.isSelected || false;
  }
}

export class WardItemDetails {
  AvailableCnt: number;
  BedName: String;
  DocNameID: number;
  DoctorName: String;
  FirstName: String;
  IsAvailible: boolean;
  OccuipiedCnt: number;
  PatientName: String;
  RegNo: String;
  RoomId: number;
  RoomName: String;
  WardId: number;

  constructor(wardData) {
    this.AvailableCnt = wardData.AvailableCnt || 0;
    this.BedName = wardData.BedName || '';
    this.DocNameID = wardData.DocNameID || 0;
    this.DoctorName = wardData.DoctorName || '';
    this.FirstName = wardData.FirstName || '';
    this.IsAvailible = wardData.IsAvailible || false;
    this.OccuipiedCnt = wardData.OccuipiedCnt || 0;
    this.PatientName = wardData.PatientName || '';
    this.RegNo = wardData.RegNo || '';
    this.RoomId = wardData.RoomId || 0;
    this.RoomName = wardData.RoomName || '';
    this.WardId = wardData.WardId || 0;
  }
}