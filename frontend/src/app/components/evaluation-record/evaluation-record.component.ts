
import {Component, OnInit} from '@angular/core';
import {EvaluationRecordService} from '../../services/evaluation-record.service';
import {SalesManService} from '../../services/sales-man.service';
import {Router} from '@angular/router';
import {EvaluationRecord, Goal} from '../../models/EvaluationRecord';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {SalesMan} from "../../models/SalesMan";

@Component({
    selector: 'app-evaluation-record',
    templateUrl: './evaluation-record.component.html',
    styleUrls: ['./evaluation-record.component.css']
})



export class EvaluationRecordComponent implements OnInit {
    closeResult: string = '';
    displayedColumns = ['salesMan', 'year', 'goal', 'targetValue', 'actualValue', 'actions'];
    evaluationrecords: EvaluationRecord[] = [];
    goals: Goal[] = [];
    salesMen: SalesMan[] = [];
    evaluationrecord: EvaluationRecord= new EvaluationRecord();
    //goal: Goal = new Goal(1, "Leadership Competence");

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
    constructor(private router: Router,
                private evaluationRecordService: EvaluationRecordService,
                private salesManService : SalesManService,
                private modalService: NgbModal) { }

    selectedValue: string;
    selectedCar: string;
    ngOnInit(): void {
        console.log('test');
        this.fetchEvaluationRecords();
        this.getGoals();
        this.getSalesMen();
    }
    fetchEvaluationRecords(): void{
        this.evaluationRecordService.getAllEvaluationRecord().subscribe((response): void => {
            if (response.status === 200){
                this.evaluationrecords = response.body;
                for (let evaluation of this.evaluationrecords) {
                    evaluation.salesMan = evaluation.salesMan[0];
                }
                //this.evaluationrecord.salesMan = this.evaluationrecord.salesMan[0]
            }
            console.log(this.evaluationrecords);
        });
    }

    getSalesMen(): void{
        this.salesManService.getAllSalesMan().subscribe((response): void => {
            if (response.status === 200){
                this.salesMen = response.body;
            }
            console.log(this.salesMen);
        });
    }

    getGoals(): void{
        this.evaluationRecordService.getGoals().subscribe((response): void => {
            if (response.status === 200){
                this.goals = response.body;
            }
            console.log(this.goals);
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
        console.log("open modal");
        if(row)
        {
            console.log("update");
            this.evaluationrecord.actualValue=row.actualValue;
            this.evaluationrecord.targetValue=row.targetValue;
            this.evaluationrecord.year=row.year;
            this.evaluationrecord.goalDescription=row.goalDescription;
            this.evaluationrecord.salesManID=row.salesManID;
            this.evaluationrecord.salesMan=row.salesMan;
            console.log(row);
            this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
                console.log("save");
                console.log(this.evaluationrecord);
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
            console.log(this.goals);
            this.evaluationrecord=new EvaluationRecord();
            this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
                this.evaluationrecord.salesManID = this.evaluationrecord.salesMan._id
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

    sortBy(list?, attribute?) {
        if (list) {
            return list.sort((a,b) => a[attribute] > b[attribute] ? 1 : b[attribute] > a[attribute] ? -1 : 0)
        }
    }

    compareSalesMen(o1: any, o2: any): boolean {
        return o1.fullName === o2.fullName;
    }

}
