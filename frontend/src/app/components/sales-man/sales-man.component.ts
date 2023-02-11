/**
 * * Created by ${USER} on ${DATE}
 */

import {Component, OnInit} from '@angular/core';
import {SalesManService} from '../../services/sales-man.service';
import {Router} from '@angular/router';
import {SalesMan} from '../../models/SalesMan';
import {EvaluationRecordService} from '../../services/evaluation-record.service';
import {EvaluationRecord} from "../../models/EvaluationRecord";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-sales-man',
    templateUrl: './sales-man.component.html',
    styleUrls: ['./sales-man.component.css']
})
export class SalesManComponent implements OnInit {

    displayedColumns = ['_id', 'firstname', 'lastname', 'jobTitle', 'unit', 'actions'];
    displayedColumnsEvaluatinRecord = [ 'year_2', 'goal_2', 'targetValue_2', 'actualValue_2'];
    dataSource: SalesMan[] = [];
    evaluationrecords: EvaluationRecord[] = [];
    show: boolean=false;
    closeResult: string = '';
    allowedSync = false;
    constructor(private router: Router, private salesManService: SalesManService, private evaluationRecordService: EvaluationRecordService, private modalService: NgbModal, private userService: UserService) { }
    ngOnInit(): void {
        this.fetchSalesmans();
        this.userService.getOwnUser().subscribe((user): void => {
            if (user.role === 'HR' || user.isAdmin) {
                this.allowedSync = true;
            }
        });
    }

    fetchSalesmans(): void{
        this.salesManService.getAllSalesMan().subscribe((response): void => {
            if (response.status === 200){
                this.dataSource = response.body;
            }
        });
    }
    deleteMethod(row: SalesMan): void {
        console.log(row);
        if (confirm('Are you sure to delete ' + row.firstname)) {
            this.salesManService.deleteSalesman(row._id).subscribe((): void => {
                this.fetchSalesmans();
            });
        }
    }

    showSalesMan(row: SalesMan): void{

    showSalesMan(content:any, row: SalesMan): void{
        this.evaluationRecordService.getEvaluationRecordBySalesManID(row._id).subscribe((response): void => {
            if (response.status === 200){
                this.evaluationrecords = response.body;

                console.log("this.evaluationrecords");
                console.log(this.evaluationrecords);
                this.show=true;
                this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
                    this.closeResult = `Closed with: ${result}`;

                }, (reason) => {
                    //  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                });
            }
        });

        console.log(row);
    }

    syncButton_click(): void {
        this.salesManService.syncSalesman().subscribe((): void => {
            this.fetchSalesmans();
        });
    }
}
