/**
 * this model specifies the format to exchange a user with the backend
 */
export class SalesMan{
    constructor(
        public _id: string,
        public firstname: string,
        public lastname: string,
        public fullName: string,
        public middleName: string,
        public unit: string,
        public jobTitle: string,
        public uid: string,
    ) {  }
}
