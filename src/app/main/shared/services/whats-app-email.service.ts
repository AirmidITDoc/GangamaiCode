import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppEmailService {

  constructor(
    public _httpClient: HttpClient,
  ) { }

  public InsertWhatsappSales(emp){
    return this._httpClient.post("WhatsappEmail/WhatsappSalesSave", emp);
  }

}
