import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from './testing.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIServiceService {

  baseURL: string = "http://localhost:3000/";
 
  constructor(private http: HttpClient) {
  }
 
  getPeople(): Observable<Person[]> {
    console.log('getPeople '+this.baseURL + 'people')
    return this.http.get<Person[]>(this.baseURL + 'people')
  }
 
  addPerson(person:Person): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(person);
    console.log(body)
    return this.http.post(this.baseURL + 'people', body,{'headers':headers})
  }
}