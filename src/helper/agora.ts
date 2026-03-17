import { RtcTokenBuilder, RtcRole } from "agora-token";

const APP_ID = process.env.AGORA_APP_ID as string;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE as string;

export const generateRtcToken = (channelName: string, uid: string | number) => {

  const role = RtcRole.PUBLISHER;

  const expireTime = 3600; // 1 hour

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const tokenExpireTime = currentTimestamp + expireTime;
  const privilegeExpireTime = currentTimestamp + expireTime;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    tokenExpireTime,
    privilegeExpireTime
  );

  return token;
};

