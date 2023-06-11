import { Component, OnInit } from '@angular/core';
import { APIServiceService } from './apiservice.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {

 
  title = 'httpGet Example';
  people:Person[];
  person = new Person();
  
  constructor(private apiService:APIServiceService) {}
 
  ngOnInit() {
    this.refreshPeople()
  }
 
  refreshPeople() {
    this.apiService.getPeople()
      .subscribe(data => {
        console.log(data)
        this.people=data;
      })      
 
  }
 
  addPerson() {
    this.apiService.addPerson(this.person)
      .subscribe(data => {
        console.log(data)
        this.refreshPeople();
      })      
  }
 
}


export class Person {
  id:number
  name:string
}
 