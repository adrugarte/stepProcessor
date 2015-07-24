declare module Models {
    export interface IStep {
        Name: string;

    }

    export interface IFieldlayout {
        field: string;
        fieldtype: string;
        lenght: number;
        ngmodel: string;
        divclass: string;
        labelclass: string;
        fieldclass: string;
        labelstyle: string;
        dataformater: string;
        dpstyle: string;
        radioclass: string;
        showfield: string;
        valuefield: string;
        radiolist: string;
        required: string;
    }

    export interface IOnlineServices {
        id: number;
        languageId: number;
        description: string;
        href: string;
        ngclick: string
    }

    export interface ISettingsService {
        contactphone: string;
        setcontactphone: (phone: string) => void;
    }


    export interface ILoginData {
        userName: string;
        password: string;

    }

    export interface ILogedSite {
        domain: string;
        token: string;
        userName: string;
        refreshToken: string;
        useRefreshToken: boolean;
        tokenExpires: any;
        roles: string;
    }

    export interface IAuthentication {
        isAuth: boolean;
        userName: string;
        isAdmin: boolean;
        roles: Array<any>;
        redirectTo:string
    }

    export interface Iregistration {
        userName: string;
        password: string;
        confirmPasword: string;
        email: string;
        confirmEmail: string;
    }

    export interface IFileToUpload {
        Id?: string;
        Label: any;
        OriginalName: string;
        Type: IDocumentType;
        Path?: string;
        Uploaded?: string;
        Canceled?: string;
        CustomerId?: string;
        file?:any
    }

    export interface IDocumentType {
        Id: string;
        TypeDesc: string;
    }
}