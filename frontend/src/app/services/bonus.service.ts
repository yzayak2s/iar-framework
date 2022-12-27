import {Injectable} from '@angular/core';
import {Bonus} from '../models/Bonus';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BonusService {
    private bonusesUrl = 'api/bonuses'; // URL to web api
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

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

    /** UPDATE single bonus */
    updateBonus(bonus: Bonus): Observable<any> {
        return this.http.put(this.bonusesUrl, bonus, this.httpOptions);
    }

    /** ADD new bonus */
    addBonus(bonus: Bonus): Observable<Bonus> {
        return this.http.post<Bonus>(this.bonusesUrl, bonus, this.httpOptions);
    }

    /** DELETE: delete the bonus from the server */
    deleteBonus(id: number): Observable<Bonus> {
        const url = `${this.bonusesUrl}/${id}`;

        return this.http.delete<Bonus>(url, this.httpOptions);
    }
}
