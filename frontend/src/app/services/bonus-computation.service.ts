import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Bonus} from '../models/Bonus';

@Injectable({
    providedIn: 'root'
})
export class BonusComputationService {
    private bonusesUrl = `${environment.apiEndpoint}/api/bonuses`; // URL to web api
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true
    };

    constructor(
        private http: HttpClient
    ) {
    }

    calculateBonus(bonus: Bonus) {
        const url = `${this.bonusesUrl}/calculateBonus/sid/${bonus.salesManID}/${bonus.year}`;
        return this.http.get<Bonus>(url, {
            observe: 'response',
            withCredentials: true
        });
    }

    calculateAllBonuses(year: number) {
        const url = `${this.bonusesUrl}/calculateBonus/all/${year}`;
        return this.http.get<Bonus>(url, {
            observe: 'response',
            withCredentials: true
        });
    }
}
