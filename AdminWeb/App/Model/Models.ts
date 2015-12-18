declare module Models {
    export interface IPerson {
        LastName: string;
        FirstName: string;
        MiddleName: string;
        BirthDate: any;
        Gender: number;
        Address: Address;
        Phone: Contact;
        Celular: Contact;
        Email: Contact;
        //Addresses: Array<Address>;
    }

    export interface Contact {
        Use: string;
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