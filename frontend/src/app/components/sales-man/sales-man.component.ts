/**
 * * Created by ${USER} on ${DATE}
 */

import {Component, OnInit} from '@angular/core';
import {SalesManService} from '../../services/sales-man.service';
import {Router} from '@angular/router';
import {SalesMan} from '../../models/SalesMan';

@Component({
    selector: 'app-sales-man',
    templateUrl: './sales-man.component.html',
    styleUrls: ['./sales-man.component.css']
})
export class SalesManComponent implements OnInit {

    displayedColumns = ['_id', 'firstName', 'lastName', 'actions'];
    salesmens: SalesMan[] = [];
    constructor(private router: Router, private salesManService: SalesManService) { }
    ngOnInit(): void {
        console.log('test');
        this.fetchSalesmans();
    }
    fetchSalesmans(): void{
        this.salesManService.getAllSalesMan().subscribe((response): void => {
            if (response.status === 200){
                console.log('inside 200');
                this.salesmens = response.body;
            }
            console.log(this.salesmens);
        });
    }
    deleteMethod(row: SalesMan): void {
        console.log(row);
        if (confirm('Are you sure to delete ' + row.firstName)) {
            console.log('Implement delete functionality here');
            this.salesManService.deleteSalesman(row._id);
        }
    }
    showSalesMan(row: SalesMan): void{
        console.log(row);
    }
}
