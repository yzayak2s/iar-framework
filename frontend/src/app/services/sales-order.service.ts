import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SalesOrder} from '../models/SalesOrder';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SalesOrderService {
    private salesOrderUrl = `${environment.apiEndpoint}/api/salesOrders`;

    constructor(private http: HttpClient) {
    }

    getAllSalesOrder(): Observable<HttpResponse<SalesOrder[]>> {
        return this.http.get<SalesOrder[]>(environment.apiEndpoint + '/api/salesOrders/read/all', {
            observe: 'response',
            withCredentials: true
        });
    }

    getSalesOrder(salesOrderID: number): Observable<HttpResponse<SalesOrder>> {
        const url = `${this.salesOrderUrl}/read/uid/${salesOrderID}`;
        return this.http.get<SalesOrder>(url, {
            observe: 'response',
            withCredentials: true
        });
    }



}
