import {Component, OnInit} from '@angular/core';
import {SalesMan} from '../../models/SalesMan';
import {SalesManService} from '../../services/sales-man.service';
import {ActivatedRoute} from '@angular/router';
import {BonusService} from '../../services/bonus.service';
import {Bonus} from '../../models/Bonus';

@Component({
    selector: 'app-salesman',
    templateUrl: './salesman.component.html',
    styleUrls: ['./salesman.component.css']
})
export class SalesmanComponent implements OnInit {
    salesman: SalesMan;
    bonus: Bonus;

    constructor(
        private route: ActivatedRoute,
        private salesManService: SalesManService,
        private bonusService: BonusService
    ) {
    }

    ngOnInit(): void {
        this.getSalesMan();
    }

    getSalesMan(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.bonusService.getBonus(id)
            .subscribe((bonus): void => {
                this.bonus = bonus.body;
                this.salesManService.getSalesMan(bonus.body.salesManID)
                    .subscribe((salesMan): void => {
                        this.salesman = salesMan.body;
                    });
            });
    }

}
