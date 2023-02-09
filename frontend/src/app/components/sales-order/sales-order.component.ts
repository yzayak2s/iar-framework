/**
 * * Created by ${USER} on ${DATE}
 */

import {Component, OnInit} from '@angular/core';
import {SalesOrderService} from '../../services/sales-order.service';
import {Router} from '@angular/router';
import {SalesOrder} from '../../models/SalesOrder';

@Component({
    selector: 'app-sales-order',
    templateUrl: './sales-order.component.html',
    styleUrls: ['./sales-order.component.css']
})
export class SalesOrderComponent implements OnInit {

    displayedColumns = ['contractType', 'salesOrderUID', 'createdAt','priority', 'totalAmountIncludingTax', 'totalBaseAmount', 'totalTaxAmount'];
    salesoders: SalesOrder[] = [];
    constructor(private router: Router, private salesOrderService: SalesOrderService) { }
    ngOnInit(): void {
        console.log('test');
        this.fetchSalesorders();
    }
    fetchSalesorders(): void{
        this.salesOrderService.getAllSalesOrder().subscribe((response): void => {
            if (response.status === 200){
                console.log('inside 200');
                this.salesoders = response.body;
            }
            console.log(this.salesoders);
        });
    }
    showSalesOrder(row: SalesOrder): void{
        console.log(row);
    }
}
