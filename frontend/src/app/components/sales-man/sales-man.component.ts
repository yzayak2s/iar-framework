/**
 * * Created by ${USER} on ${DATE}
 */

import {Component, ViewChild} from '@angular/core';
import {SalesManService} from '../../services/sales-man.service';
import {SalesMan} from '../../models/SalesMan';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-sales-man',
    templateUrl: './sales-man.component.html',
    styleUrls: ['./sales-man.component.css']
})
export class SalesManComponent {

    displayedColumns = ['_id', 'firstname', 'lastname', 'jobTitle', 'unit', 'actions'];
    dataSource = new MatTableDataSource<SalesMan>();
    @ViewChild(MatTable) table: MatTable<SalesMan>;

    constructor(private salesManService: SalesManService) {
        this.fetchSalesmans();
    }

    fetchSalesmans(): void{
        this.salesManService.getAllSalesMan().subscribe((response): void => {
            if (response.status === 200){
                this.dataSource.data = response.body;
                this.table.renderRows();
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
        console.log(row);
    }

    syncButton_click(): void {
        this.salesManService.syncSalesman().subscribe((): void => {
            this.fetchSalesmans();
        });
    }
}
