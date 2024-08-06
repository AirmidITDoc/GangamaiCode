import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppEmailService {

  constructor(
    public _httpClient: HttpClient,
    private _loaderService: LoaderService
  ) { }

  public InsertWhatsappSales(emp, loader=true){
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("WhatsappEmail/WhatsappSalesSave", emp);
  }

}
