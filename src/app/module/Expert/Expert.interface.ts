import { Types } from "mongoose";
import { number } from "zod";

export interface IExpert {
  auth: Types.ObjectId;
  agoraUid: number;
  name: string;
  phone: string;
  email: string;
  image?: string;
  country: string;
  city: string;
  signature: string;
  date: Date;
  profession: {
    designation: string[],
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
      format: string[],
      length: string,
  };
  availability: {
      days: string[],
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
  
  // Recording fields
  doctorUid: number,
  recordingUid: number,
  resourceId: string,
  sid: string,
  
  // Final recording files (filled after stop)
  recordingMp4Url: string,      // Direct MP4 for easy playback
  recordingHlsUrl: string,      // HLS (m3u8) for adaptive streaming
  recordingFiles?: [{            // Full file list from Agora (optional)
    fileName: string,
    url: string,
    type: string // "mp4" or "hls"
  }],
  
  duration: number,
  startedAt: Date;
  finishedAt: Date;
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