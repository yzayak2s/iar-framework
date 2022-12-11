/**
 * Created by oukha on 04/12/2022
 */


import {Component, OnInit} from '@angular/core';
import {EvaluationRecordService} from '../../services/evaluation-record.service';
import {Router} from '@angular/router';
import {EvaluationRecord} from '../../models/EvaluationRecord';

@Component({
    selector: 'app-evaluation-record',
    templateUrl: './evaluation-record.component.html',
    styleUrls: ['./evaluation-record.component.css']
})
export class EvaluationRecordComponent implements OnInit {

    displayedColumns = ['_id', 'goalDescription', 'targetValue', 'actualValue', 'year', 'salesManID', 'actions'];
    evaluationrecords: EvaluationRecord[] = [];
    constructor(private router: Router, private evaluationRecordService: EvaluationRecordService) { }
    ngOnInit(): void {
        console.log('test');
        this.fetchEvaluationRecords();
    }
    fetchEvaluationRecords(): void{
        this.evaluationRecordService.getAllEvaluationRecord().subscribe((response): void => {
            if (response.status === 200){
                this.evaluationrecords = response.body;
            }
            console.log(this.evaluationrecords);
        });
    }
    deleteMethod(row: EvaluationRecord): void {
        if (confirm('Are you sure to delete evaluation record ' + row._id)) {
            console.log('Implement delete functionality here');
            this.evaluationRecordService.deleteEvaluationRecord(row._id);
        }
    }
    showEvaluationRecord(row: EvaluationRecord): void{
        console.log(row);
    }
}