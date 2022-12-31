import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EvaluationRecord} from '../models/EvaluationRecord';
import {environment} from '../../../environments/environment';
import {SalesMan} from "../models/SalesMan";

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
    deleteEvaluationRecord(id: string): void{
        this.http.delete(environment.apiEndpoint + '/api/evaluationRecords/delete/id/' + id.toString(), {
            withCredentials: true
        }) .subscribe((): void =>  console.log('Call delete service'));
    }


    public updateEvaluationRecord(id: string,evaluationrecord: EvaluationRecord): Observable<any> {
        const url = environment.apiEndpoint + '/api/evaluationRecords/update/id/' + id;
        return this.http.put<any>(url, evaluationrecord, {
            withCredentials: true
        });
    }
    public saveEvaluationRecord(evaluationRecord: EvaluationRecord): Observable<any> {
        const url = environment.apiEndpoint +'/api/evaluationRecords/create';
        return this.http.post<any>(url, evaluationRecord,  {
            withCredentials: true
        });
    }

}
