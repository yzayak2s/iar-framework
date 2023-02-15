
import {Component, OnInit} from '@angular/core';
import {EvaluationRecordService} from '../../services/evaluation-record.service';
import {SalesManService} from '../../services/sales-man.service';
import {EvaluationRecord, Goal} from '../../models/EvaluationRecord';
import {SalesMan} from '../../models/SalesMan';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'app-evaluation-record',
    templateUrl: './evaluation-record.component.html',
    styleUrls: ['./evaluation-record.component.css']
})

export class EvaluationRecordComponent implements OnInit {
    currentYear = String(new Date().getFullYear());
    closeResult = '';
    displayedColumns = ['salesMan', 'year', 'goal', 'targetValue', 'actualValue', 'actions'];
    evaluationrecords: EvaluationRecord[] = [];
    goals: Goal[] = [];
    salesMenArray: SalesMan[] = [];
    evaluationrecord: EvaluationRecord;
    createdEvaluationRecord: EvaluationRecord = new EvaluationRecord('5', '4', this.currentYear);

    constructor(private evaluationRecordService: EvaluationRecordService,
                private salesManService: SalesManService,
                private modalService: NgbModal) { }

    ngOnInit(): void {
        this.fetchEvaluationRecords();
        this.getGoals();
        this.getSalesMen();
    }

    fetchEvaluationRecords(): void{
        this.evaluationRecordService.getAllEvaluationRecord().subscribe((response): void => {
            if (response.status === 200){
                this.evaluationrecords = response.body;
                for (const evaluation of this.evaluationrecords) {
                    evaluation.salesMan = evaluation.salesMan[0] as SalesMan;
                }
            }
        });
    }

    getSalesMen(): void{
        this.salesManService.getAllSalesMan().subscribe((response): void => {
            if (response.status === 200){
                this.salesMenArray = response.body;
            }
        });
    }

    getGoals(): void{
        this.evaluationRecordService.getGoals().subscribe((response): void => {
            if (response.status === 200){
                this.goals = response.body;
            }
        });
    }
    deleteMethod(row: EvaluationRecord): void {
        if (confirm('Are you sure to delete evaluation record ' + String(row._id))) {
            this.evaluationRecordService.deleteEvaluationRecord(row._id).subscribe((): void => {
                this.fetchEvaluationRecords();
            }, (): void => {
                this.fetchEvaluationRecords();
            });
            this.fetchEvaluationRecords();
        }
    }

    open(content: any, row: EvaluationRecord): void {
        if (row)
        {
            this.evaluationrecord = row;
            this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result: any): void => {
                this.closeResult = `Closed with: ${String(result)}`;
                this.evaluationrecord.salesManID = this.evaluationrecord.salesMan._id;
                this.evaluationRecordService.updateEvaluationRecord(row._id, this.evaluationrecord).subscribe((): void => {
                    this.fetchEvaluationRecords();
                }, (): void => {
                    this.fetchEvaluationRecords();
                });
            }, (reason): void => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        }
        else {
            this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result): void => {
                this.closeResult = `Closed with: ${String(result)}`;
                this.createdEvaluationRecord.salesManID = this.createdEvaluationRecord.salesMan._id;
                delete this.createdEvaluationRecord.salesMan;
                this.evaluationRecordService.saveEvaluationRecord(this.createdEvaluationRecord).subscribe((): void => {
                    this.fetchEvaluationRecords();
                }, (error: HttpErrorResponse): void => {
                    if (error.status === 409) {
                        alert(
                            `Evaluationrecord criteria with ${this.createdEvaluationRecord.goalDescription} already exist!`
                        );
                    }
                });
            }, (reason): void => {
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
            return  `with: ${String(reason)}`;
        }
    }

    compareSalesMen(o1: SalesMan, o2: SalesMan): boolean {
        return o1.fullName === o2.fullName && o1._id === o2._id;
    }

}
