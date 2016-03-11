﻿declare module Models {
    export interface IPerson {
        id: string;
        lastName: string;
        firstName: string;
        middleName: string;
        birthDate: any;
        birthCity: any;
        birthCountry: any;
        gender: any;
        contacts: Array<Contact>;
        email: string;
        addresses: Array<Address>;
    }

    export interface IPersonList {
        id: string;
        Name: string;
        birthDate: any;
        gender: any;
        phone: string;
        celular: string;
        email: string;
        address: string;
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

    export interface PersonService {
        Id: number;
        ServiceDesc: string;
        Form: string;
        Price: number;
        PaidAmount: number;
        Created: any;
        Finished: any
        UserCreated: string;
        PersonId: number;
        ServiceId: number;
    }
  
}