import { Types } from "mongoose";
import { number } from "zod";

export interface IExpert {
  auth: Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  image?: string;
  country: string;
  city: string;
  signature: string;
  date: Date;
  profession: {
    designation: string,
    title: string,
    experience: number,
  };
  license:{
      qualification: string
      certificate: string,
      proof: string
  };
  session : {
      topic: string,
      format: string,
      length: string,
  };
  availability: {
      day: string,
      timezone: string
  };
  isApproved: boolean;
}

export interface ISession{
  expert: Types.ObjectId;
  status: string;
  title: string;
  description: string;
  time: string;
  date: Date;
  channelName: string;
  recordingUrl: string;
  isApproved: boolean;
}

export interface ISessionReport{
  session: Types.ObjectId;
  name : string;
  email: string;
  content: string;
}

export interface IExpertCredintial {
  email: string;
  password: string;
  confirmPassword: string;
  role: string
}