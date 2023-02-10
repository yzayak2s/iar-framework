/**
 * * Created by ${USER} on ${DATE}
 */

import {Component, ViewChild} from '@angular/core';
import {SalesManService} from '../../services/sales-man.service';
import {SalesMan} from '../../models/SalesMan';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-sales-man',
    templateUrl: './sales-man.component.html',
    styleUrls: ['./sales-man.component.css']
})
export class SalesManComponent {

    displayedColumns = ['_id', 'firstname', 'lastname', 'jobTitle', 'unit', 'actions'];
    dataSource = new MatTableDataSource<SalesMan>();
    @ViewChild(MatTable) table: MatTable<SalesMan>;
    allowedSync = false;

    constructor(private salesManService: SalesManService, private userService: UserService) {
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
