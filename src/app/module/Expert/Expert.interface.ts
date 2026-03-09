import { Types } from "mongoose";
import { number } from "zod";

export interface IExpert {
  name: string
  phone: string
  email: string
  image?: string
  country: string
  city: string
  profession: {
    designation: string,
    title: string,
    experience: number,
  }
  license:{
      qualification: string
      number: string,
      proof: string
  }
  session : {
        topic: string,
        format: string,
        length: string,
    }

    availability: {
        day: string,
        time: string
    }
}

export interface ISession{
  expert: Types.ObjectId;
  status: string;
  title: string;
  description: string;
  time: Date;
  date: Date;
}

export interface IExpertCredintial {
  email: string;
  password: string;
  confirmPassword: string;
  role: string
}