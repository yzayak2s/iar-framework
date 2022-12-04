import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SalesMan} from '../models/SalesMan';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SalesManService {

    constructor(private http: HttpClient) {
    }

    getAllSalesMan(): Observable<HttpResponse<SalesMan[]>> {
        return this.http.get<SalesMan[]>(environment.apiEndpoint + '/api/salesmen/read/all', {
            observe: 'response',
            withCredentials: true
        });
    }
    deleteSalesman(salesmanid: string): void{
        this.http.delete(environment.apiEndpoint + '/api/salesmen/delete/id/' + salesmanid, {
            withCredentials: true
        }) .subscribe(() =>  console.log('Call delete service'));
    }

}
