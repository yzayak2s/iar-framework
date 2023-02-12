import {Component, OnInit} from '@angular/core';
import {EvaluationRecord} from '../../models/EvaluationRecord';
import {Bonus} from '../../models/Bonus';
import {ActivatedRoute} from '@angular/router';
import {EvaluationRecordService} from '../../services/evaluation-record.service';
import {BonusService} from '../../services/bonus.service';
import {BonusComputationService} from '../../services/bonus-computation.service';

@Component({
    selector: 'app-evaluationrecord',
    templateUrl: './evaluationrecord.component.html',
    styleUrls: ['./evaluationrecord.component.css']
})
export class EvaluationrecordComponent implements OnInit {
    evaluationRecords: EvaluationRecord[];
    bonus: Bonus;
    bonusComputation: any;
    displayedColumns = ['goalDescription', 'targetValue', 'actualValue', 'bonus'];

    constructor(
        private route: ActivatedRoute,
        private evaluationRecordService: EvaluationRecordService,
        private bonusService: BonusService,
        private bonusComputationService: BonusComputationService
    ) {
    }

    ngOnInit(): void {
        this.getEvaluationRecords();
    }

    private getEvaluationRecords() {
        const id = this.route.snapshot.paramMap.get('id');
        this.bonusService.getBonus(id)
            .subscribe((bonus): void => {
                this.bonus = bonus.body;
                this.evaluationRecordService.getEvaluationRecordsBySalesManIDAndYear(this.bonus.salesManID, this.bonus.year)
                    .subscribe((evaluationRecords): void => {
                        this.evaluationRecords = evaluationRecords.body
                    })
                this.bonusComputationService.getBonusComputationBySalesManIDAndYear(this.bonus.salesManID, this.bonus.year)
                    .subscribe((bonusComputation) => {
                        this.bonusComputation = bonusComputation.body
                    })
            })
    }

    filterBonus(evaluationRecord: any, bonusComputation: any): number {
        return bonusComputation.perfBonus.evalRecords.filter((value) => value.goalDescription === evaluationRecord.goalDescription)[0].bonus
    }
}
