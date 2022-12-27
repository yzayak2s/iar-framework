import {Injectable} from '@angular/core';
import {Bonus} from '../models/Bonus';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BonusService {
    private bonusesUrl = 'api/bonuses'; // URL to web api

    constructor(
        private http: HttpClient
    ) { }

    /** GET bonuses from the server */
    getBonuses(): Observable<Bonus[]> {
        return this.http.get<Bonus[]>(this.bonusesUrl);
    }

    /** GET single bonus from the backend */
    getBonus(id: string): Observable<Bonus> {
        const url = `${this.bonusesUrl}/read/id/${id}`;
        return this.http.get<Bonus>(url);
    }
}
