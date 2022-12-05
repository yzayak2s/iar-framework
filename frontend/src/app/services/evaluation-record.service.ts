import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EvaluationRecord} from '../models/EvaluationRecord';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EvaluationRecordService {

    constructor(private http: HttpClient) {
    }

    getAllEvaluationRecord(): Observable<HttpResponse<EvaluationRecord[]>> {
        return this.http.get<EvaluationRecord[]>(environment.apiEndpoint + '/api/evaluationRecords/read/all', {
            observe: 'response',
            withCredentials: true
        });
    }
    deleteSalesman(id: string): void{
        this.http.delete(environment.apiEndpoint + '/api/evaluationRecords/delete/id/' + id, {
            withCredentials: true
        }) .subscribe((): void =>  console.log('Call delete service'));
    }

}
