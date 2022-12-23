import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {BonusesPageDataSource} from './bonuses-page-datasource';
import {BonusesService} from '../../services/bonuses.service';
import {Bonus} from '../../models/Bonus';
import {UserService} from '../../services/user.service';
import {User} from '../../models/User';

@Component({
    selector: 'app-bonuses-page',
    templateUrl: './bonuses-page.component.html',
    styleUrls: ['./bonuses-page.component.css']
})
export class BonusesPageComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<Bonus>;
    dataSource: BonusesPageDataSource;

    /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
    displayedColumns = ['_id', 'year', 'value', 'remark', 'verified', 'salesManID'];

    user: User;
    constructor(private userService: UserService, private bonusesService: BonusesService) {
        this.dataSource = new BonusesPageDataSource(bonusesService);
    }

    ngOnInit(): void {
        this.fetchUser();
        this.dataSource.loadBonuses();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.table.dataSource = this.dataSource;
        this.dataSource.loadBonuses();
        // console.log(this.dataSource);
    }

    /**
     * fetches information about logged-in user
     */
    fetchUser(): void {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
        });
    }

    onRowClicked(row: any): void {
        console.log('Row clicked: ', row);
    }
}
