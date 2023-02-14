import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Bonus} from '../models/Bonus';
import {Bonus_calc} from '../models/bonus_calc';

@Injectable({
    providedIn: 'root'
})
export class BonusComputationService {
    private bonusesUrl = `${environment.apiEndpoint}/api/bonuses`; // URL to web api
    private bonusComputationUrl = `${environment.apiEndpoint}/api/bonusComputations`; // URL to web api
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true
    };

    constructor(
        private http: HttpClient
    ) {
    }

    calculateBonus(bonus: Bonus): Observable<HttpResponse<Bonus_calc>> {
        const url = `${this.bonusesUrl}/calculateBonus/sid/${bonus.salesManID}/${bonus.year}`;
        return this.http.get<Bonus_calc>(url, {
            observe: 'response',
            withCredentials: true
        });
    }

    calculateAllBonuses(year: number): Observable<HttpResponse<Bonus_calc[]>> {
        const url = `${this.bonusesUrl}/calculateBonus/all/${year}`;
        return this.http.get<Bonus_calc[]>(url, {
            observe: 'response',
            withCredentials: true
        });
    }

    getBonusComputationBySalesManIDAndYear(salesManID: number, year: number): Observable<HttpResponse<Bonus_calc>> {
        const url = `${this.bonusComputationUrl}/read/salesManID/${salesManID}/${year}`;
        return this.http.get<Bonus_calc>(url, {
            observe: 'response',
            withCredentials: true
        });
    }
}
