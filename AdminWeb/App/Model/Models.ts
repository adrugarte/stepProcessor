declare module Models {
    export interface IPerson {
        LastName: string;
        FirstName: string;
        MiddleName: string;
        BirthDate: any;
        Gender: number;
        Contacts: Array<Contact>;
        Addresses: Array<Address>;
    }

    export interface Contact {
        Use: number;
        Type: any;
        Prefered: boolean;
        Value: string;
        Comment: string;
    }

    export interface Address{
        Type: any;
        Address1: string;
        Address2: string;
        City: string;
        State: string;
        ZipCode: string;
    }


}