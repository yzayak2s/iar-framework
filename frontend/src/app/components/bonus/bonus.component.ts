
import {Component, OnInit} from '@angular/core';
import {BonusService} from '../../services/bonus.service';
import {Router} from '@angular/router';
import {Bonus} from '../../models/Bonus';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-bonus',
    templateUrl: './bonus.component.html',
    styleUrls: ['./bonus.component.css']
})
export class BonusComponent implements OnInit {
    closeResult: string = '';
    displayedColumns = ['_id','year','value','verified','salesManID', 'actions'];
    bonuses: Bonus[] = [];
    bonus: Bonus= new Bonus();

    //constructor(private router: Router, private BonusService: BonusService) { }
    /* Bonus: Bonus= new Bonus( _id: number;
       goalDescription: string;
       targetValue: string;
       actualValue: string;
       year: string;
       salesManID: string);*/
    activeBonus: Bonus= new Bonus();

    targetValue: string;
    actualValue: string;
    constructor(private router: Router, private BonusService: BonusService, private modalService: NgbModal) { }

    ngOnInit(): void {
        console.log('test');
        this.fetchBonuses();
    }
    fetchBonuses(): void{
        this.BonusService.getAllBonus().subscribe((response): void => {
            if (response.status === 200){
                this.bonuses = response.body;
            }
            console.log(this.bonuses);
        });
    }
    deleteMethod(row: Bonus): void {
        if (confirm('Are you sure to delete bonus ' + String(row._id))) {
            this.BonusService.deleteBonus(row._id);
        }
    }
    showBonus(row: Bonus): void{
        console.log(row);
    }
    open(content:any, row: Bonus) {
        console.log("update");
        if(row)
        {
            console.log("update");
            this.bonus.year=row.year;
            this.bonus.value=row.value;
            this.bonus.verified=row.verified;
            this.bonus.salesManID=row.salesManID;
            this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
                this.BonusService.updateBonus(row._id,this.bonus).subscribe((response: any) => {
                    this.fetchBonuses();
                }, () => {
                    this.fetchBonuses();
                });
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        }
        else {
            this.bonus=new Bonus();
            this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
                this.BonusService.saveBonus(this.bonus).subscribe((response: any) => {
                    this.fetchBonuses();
                }, () => {
                    this.fetchBonuses();
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
