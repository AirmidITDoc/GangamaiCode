import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-newcity-master',
  templateUrl: './newcity-master.component.html',
  styleUrls: ['./newcity-master.component.scss']
})
export class NewcityMasterComponent implements OnInit {

  vCityId:any;
  vCityName:any;
  constructor() { }

  ngOnInit(): void {
  }

}
