/**
 * * Created by ${USER} on ${DATE}
 */

import {Component, OnInit} from '@angular/core';
import {SalesManService} from '../../services/sales-man.service';
import {Router} from '@angular/router';
import {SalesMan} from '../../models/SalesMan';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-sales-man',
    templateUrl: './sales-man.component.html',
    styleUrls: ['./sales-man.component.css']
})
export class SalesManComponent implements OnInit {
    closeResult: string = '';
    displayedColumns = ['_id', 'firstName', 'lastName', 'actions'];
    salesmens: SalesMan[] = [];
    activeSalesMan: SalesMan= new SalesMan();
    firstname: string;
    constructor(private router: Router, private salesManService: SalesManService, private modalService: NgbModal) { }
    ngOnInit(): void {
        this.fetchSalesmans();
    }
    fetchSalesmans(): void{
        this.salesManService.getAllSalesMan().subscribe((response): void => {
            if (response.status === 200){
                this.salesmens = response.body;
            }
        });
    }
    deleteMethod(row: SalesMan): void {
        if (confirm('Are you sure to delete ' + row.firstName)) {
            this.salesManService.deleteSalesman(row._id);
        }
    }
    showSalesMan(row: SalesMan): void{
    }

    open(content:any, row: SalesMan) {
        if(row)
        {
        this.activeSalesMan.firstName=row.firstName;
            this.activeSalesMan.lastName=row.lastName;
            this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
                this.salesManService.updateSalesman(row._id,this.activeSalesMan).subscribe((response: any) => {
                    this.fetchSalesmans();
                }, () => {
                    this.fetchSalesmans();
                });
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        }
        else {
            this.activeSalesMan=new SalesMan();
            this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
                this.salesManService.saveSalesman(this.activeSalesMan).subscribe((response: any) => {
                    this.fetchSalesmans();
                }, () => {
                    this.fetchSalesmans();
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
