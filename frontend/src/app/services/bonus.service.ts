import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Bonus} from '../models/Bonus';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BonusService {

    constructor(private http: HttpClient) {
    }

    getAllBonus(): Observable<HttpResponse<Bonus[]>> {
        return this.http.get<Bonus[]>(environment.apiEndpoint + '/api/bonuses/read/all', {
            observe: 'response',
            withCredentials: true
        });
    }
    deleteBonus(id: string): void{
        this.http.delete(environment.apiEndpoint + '/api/bonuses/delete/id/' + id.toString(), {
            withCredentials: true
        }) .subscribe((): void =>  console.log('Call delete service'));
    }


    public updateBonus(id: string,Bonus: Bonus): Observable<any> {
        const url = environment.apiEndpoint + '/api/bonuses/update/id/' + id;
        return this.http.put<any>(url, Bonus, {
            withCredentials: true
        });
    }
    public saveBonus(Bonus: Bonus): Observable<any> {
        const url = environment.apiEndpoint +'/api/bonuses/create';
        return this.http.post<any>(url, Bonus,  {
            withCredentials: true
        });
    }

}
