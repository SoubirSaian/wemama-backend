import { Types } from "mongoose";

export interface ISettings {
    // id: string;
    description: string;
}

export interface IFaq{
    question: string;
    answer: string;
}

export interface IHelpAndSupport {
    name: string;
    email: string;
    description: string;
}