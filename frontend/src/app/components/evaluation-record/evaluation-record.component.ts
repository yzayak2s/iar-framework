
import {Component, OnInit} from '@angular/core';
import {EvaluationRecordService} from '../../services/evaluation-record.service';
import {Router} from '@angular/router';
import {EvaluationRecord} from '../../models/EvaluationRecord';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {SalesMan} from "../../models/SalesMan";


@Component({
    selector: 'app-evaluation-record',
    templateUrl: './evaluation-record.component.html',
    styleUrls: ['./evaluation-record.component.css']
})
export class EvaluationRecordComponent implements OnInit {
    closeResult: string = '';
    displayedColumns = ['_id', 'goalDescription', 'targetValue', 'actualValue', 'year', 'salesManID', 'actions'];
    evaluationrecords: EvaluationRecord[] = [];
    evaluationrecord: EvaluationRecord= new EvaluationRecord();

    //constructor(private router: Router, private evaluationRecordService: EvaluationRecordService) { }
    /* evaluationRecord: EvaluationRecord= new EvaluationRecord( _id: number;
       goalDescription: string;
       targetValue: string;
       actualValue: string;
       year: string;
       salesManID: string);*/
    activeEvaluationRecord: EvaluationRecord= new EvaluationRecord();

    targetValue: string;
    actualValue: string;
    constructor(private router: Router, private evaluationRecordService: EvaluationRecordService, private modalService: NgbModal) { }

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
        if (confirm('Are you sure to delete evaluation record ' + String(row._id))) {
            this.evaluationRecordService.deleteEvaluationRecord(row._id);
        }
    }
    showEvaluationRecord(row: EvaluationRecord): void{
        console.log(row);
    }
    open(content:any, row: EvaluationRecord) {
        console.log("update");
        if(row)
        {
            console.log("update");
            this.evaluationrecord.actualValue=row.actualValue;
            this.evaluationrecord.targetValue=row.targetValue;
            this.evaluationrecord.year=row.year;
            this.evaluationrecord.goalDescription=row.goalDescription;
            this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
                this.evaluationRecordService.updateEvaluationRecord(row._id,this.evaluationrecord).subscribe((response: any) => {
                    this.fetchEvaluationRecords();
                }, () => {
                    this.fetchEvaluationRecords();
                });
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        }
        else {
            this.evaluationrecord=new EvaluationRecord();
            this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
                this.evaluationRecordService.saveEvaluationRecord(this.evaluationrecord).subscribe((response: any) => {
                    this.fetchEvaluationRecords();
                }, () => {
                    this.fetchEvaluationRecords();
                });
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        }
    }

    /**
     * Write code on Method
     *
     * @return response()
     */
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }


}
