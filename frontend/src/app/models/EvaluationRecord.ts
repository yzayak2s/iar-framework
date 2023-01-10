/**
 * this model specifies the format to exchange an evaluation record
 */
import {SalesMan} from "./SalesMan";

export class EvaluationRecord{
    public _id: string;
    public goalDescription: string;
    public targetValue: string;
    public actualValue: string;
    public year: string;
    public salesManID: string;
    public salesMan: SalesMan;
    /*constructor(

    ) {  }*/
}

export class Goal {
    public goal_id: number
    public goal_description : string

    constructor(goal_id, goal_description) {
        this.goal_id = goal_id
        this.goal_description = goal_description
    }
}
