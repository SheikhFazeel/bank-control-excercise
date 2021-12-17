import { Address } from "./address";

export class User {
    id: number;
    personalId: string;
    image: string;
    firstName: string;
    lastName: string;
    email: string;
    contactNo: string;
    gender: string;
    address: Address;
    accounts: [];
}