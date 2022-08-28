import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  url = environment.appUul;

  constructor(private httpClient: HttpClient) {}

  generateReport(data: any) {
    return this.httpClient.post(this.url + '/bill/generateReport', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  getPDF(data: any) {
    return this.httpClient.post(this.url + '/bill/getPdf', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  getBills() {
    return this.httpClient.get(this.url + '/bill/getBill/');
  }

  getBillByEmail(email: any) {
    return this.httpClient.get(this.url + '/bill/getBill/' + email);
  }

  deleteBill(id: any) {
    return this.httpClient.delete(this.url + '/bill/deleteBill/' + id, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }
}
