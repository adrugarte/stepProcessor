declare module Models {
    export interface IPerson {
        id: string;
        lastName: string;
        firstName: string;
        middleName: string;
        birthDate: any;
        gender: any;
        contacts: Array<Contact>;
        email: string;
        addresses: Array<Address>;
    }

    export interface Contact {
        use: string;
        type: any;
        prefered: boolean;
        value: string;
        comment: string;
    }

    export interface Address{
        type: any;
        address1: string;
        address2: string;
        city: string;
        state: string;
        zipCode: string;
    }


}