import { RtcTokenBuilder, RtcRole } from 'agora-token';
import config from '../config';
import crypto from "crypto";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// dotenv.config();

const APP_ID = config.agora.agora_app_id!;
const APP_CERTIFICATE = config.agora.agora_app_certificate!;
const CUSTOMER_ID = config.agora.agora_customer_id!;
const CUSTOMER_CERT = config.agora.agora_app_certificate!;

const BASE_URL = `https://api.agora.io/v1/apps/${APP_ID}/cloud_recording`;
// const APP_ID = process.env.AGORA_APP_ID!;
// const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE!;

//generate agora token
export class AgoraTokenService {
  /**
   * Generate token for Doctor (Publisher) or User (Subscriber)
   */
  static generateToken(
    channelName: string,
    uid: number,                    // Must be integer (32-bit)
    role: typeof RtcRole.PUBLISHER | typeof RtcRole.SUBSCRIBER,  // Cleanest type,                  // Publisher=1 or Subscriber=2
    tokenExpireInSeconds = 3600     // 1 hour recommended
  ): string {
    if (!channelName || !uid) {
      throw new Error('channelName and uid are required');
    }

    const privilegeExpireInSeconds = tokenExpireInSeconds;

    return RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      role,
      tokenExpireInSeconds,
      privilegeExpireInSeconds
    );
  }
}

//handle auto video recording
export class AgoraRecordingService {
  /**
   * Step 1: Acquire Resource ID
   */
  static async acquireResource(channelName: string, recordingUid: number) {
    const response = await axios.post(
      `${BASE_URL}/resourceid`,
      {
        cname: channelName,
        uid: recordingUid.toString(), // Recording bot UID (must be unique, not same as doctor)
        clientRequest: {}
      },
      {
        auth: { username: CUSTOMER_ID, password: CUSTOMER_CERT }
      }
    );
    return response.data.resourceId;
  }

  /**
   * Step 2: Start Composite Recording (Recommended for doctor live)
   */
  static async startRecording(
    resourceId: string,
    channelName: string,
    recordingUid: number,
    doctorToken: string // Token with Publisher role
  ) {
    const recordingConfig = {
      maxIdleTime: 60,           // Stop recording if no one is streaming (seconds)
      streamTypes: 2,            // 0=Audio only, 1=Video only, 2=Both
      channelType: 1,            // 0=Communication, 1=Live Broadcasting (recommended for streaming)
      videoStreamType: 0,        // 0=High quality, 1=Low quality
      subscribeVideoUids: ["#all#"],  // Record all video publishers
      subscribeAudioUids: ["#all#"]
    };

    const storageConfig = {
      vendor: 1,                 // 1 = AWS S3
      region: 8,                 // Change according to your S3 region (e.g., 8 = ap-southeast-1)
      bucket: process.env.AWS_S3_BUCKET!,
      accessKey: process.env.AWS_S3_ACCESS_KEY!,
      secretKey: process.env.AWS_S3_SECRET_KEY!,
      fileNamePrefix: ["recordings", channelName] // Optional folder structure
    };

    const response = await axios.post(
      `${BASE_URL}/resourceid/${resourceId}/mode/mix/start`,
      {
        cname: channelName,
        uid: recordingUid.toString(),
        clientRequest: {
          token: doctorToken,           // Important: Use a valid token
          recordingConfig,
          storageConfig,
          recordingFileConfig: {
            avFileType: ["hls", "mp4"]   // Get both HLS (for streaming) and MP4
          }
        }
      },
      {
        auth: { username: CUSTOMER_ID, password: CUSTOMER_CERT }
      }
    );

    return {
      sid: response.data.sid,
      resourceId,
      ...response.data
    };
  }

  /**
   * Stop Recording and Get Final File URLs
   */
  static async stopRecording(
    resourceId: string,
    sid: string,
    channelName: string,
    recordingUid: number
  ) {
    const response = await axios.post(
      `${BASE_URL}/resourceid/${resourceId}/sid/${sid}/mode/mix/stop`,
      {
        cname: channelName,
        uid: recordingUid.toString(),
        clientRequest: {}   // Can be empty for most cases
      },
      {
        auth: { 
          username: CUSTOMER_ID, 
          password: CUSTOMER_CERT 
        }
      }
    );

    const data = response.data;

    // Extract file URLs from Agora response
    const serverResponse = data.serverResponse || {};
    const fileList = serverResponse.fileList || [];

    let mp4Url = '';
    let hlsUrl = '';

    // Parse the fileList (Agora returns array of objects)
    fileList.forEach((file: any) => {
      if (file.fileName?.endsWith('.mp4')) {
        mp4Url = file.fileUrl || '';           // Full S3 URL
      } else if (file.fileName?.endsWith('.m3u8')) {
        hlsUrl = file.fileUrl || '';
      }
    });

    return {
      success: true,
      mp4Url,
      hlsUrl,
      fileList,                    // Full details for debugging
      duration: serverResponse.duration || 0,
      ...data
    };
  }
}


//generate agora uid
export function generateAgoraUid(profileId: string | any): number {
  // Convert ObjectId to string safely
  const idStr = profileId.toString();

  // Create a consistent 32-bit unsigned integer using hash
  const hash = crypto.createHash('md5').update(idStr).digest('hex');
  
  // Take first 8 hex chars → convert to number (32-bit)
  const uid = parseInt(hash.substring(0, 8), 16);   // This gives 0 to 4,294,967,295

  // Ensure it's at least 1 (Agora doesn't like 0 in some cases)
  return uid === 0 ? 1 : uid;
}