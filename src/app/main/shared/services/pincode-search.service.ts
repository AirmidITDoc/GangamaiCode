import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PincodeSearchService {

  // private apiKey = 'AIzaSyD-9txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
  // private url = 'https://maps.googleapis.com/maps/api/geocode/json';
constructor(private http: HttpClient) {}
// getCityFromPincode(pincode: string, country = 'IN'): Observable<any> {
//     const params = {
//       components: `postal_code:${pincode}|country:${country}`,
//       key: this.apiKey
//     };

//     return this.http.get(this.url, { params }).pipe(
//       map((res: any) => {
//         if (res.status !== 'OK' || !res.results?.length) return null;

//         const components = res.results[0].address_components;
//         const get = (type: string) =>
//           components.find((c: any) => c.types.includes(type))?.long_name || '';

//         return {
//           city: get('locality') || get('administrative_area_level_2'),
//           state: get('administrative_area_level_1'),
//           country: get('country'),
//           formattedAddress: res.results[0].formatted_address,
//           lat: res.results[0].geometry.location.lat,
//           lng: res.results[0].geometry.location.lng
//         };
//       })
//     );
//   }


  getCity(pincode: string): Observable<string | null> {
    if (!pincode || pincode.length !== 6) {
      return of(null);
    }
debugger
    return this.http.get<any[]>(`https://api.postalpincode.in/pincode/${pincode}`).pipe(
      map(res => {
        if (res?.[0]?.Status === 'Success' && res[0].PostOffice?.length > 0) {
          return res[0].PostOffice[0].District; // City / District
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }
}