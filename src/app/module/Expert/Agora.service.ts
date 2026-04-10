import { RtcRole } from "agora-token";
import { AgoraTokenService, generateAgoraUid } from "../../../helper/agora";
import { IJwtPayload } from "../../../interface/jwt.interface";
import { ENUM_SESSION_STATUS } from "../../../utilities/enum";
import { ExpertModel, SessionModel } from "./Expert.model";
import ApiError from "../../../error/ApiError";
import UserModel from "../User/User.model";




//start live session
const startLiveSession = async (userDetails: IJwtPayload,id: string) => {
    const {profileId} = userDetails;

    try {
      //check
  
      // const doctor = req.user; // assume doctor role check here
      // if (!doctor || doctor.role !== 'doctor') return res.status(403).json({ error: 'Only doctors' });
  
      const expert:any = await ExpertModel.findById(profileId).select("agoraUid name email");
  
      if (!expert) {
          throw new ApiError(404,"Expert not found to start  a new live session.");
      }

      const safeName = expert?.name?.trim()
          .replace(/\s+/g, "_")       // spaces → _
            .replace(/[^a-zA-Z0-9_]/g, ""); // remove special chars

      const channelName = `live_${safeName}_${profileId}_${Date.now()}`;
      //const channelName = `live_${expert?.name}_${profileId}_${Date.now()}`; // unique per stream
  
      // Save to MongoDB
      // await LiveStream.create({
      //     channelName,
      //     doctorId: doctor._id,
      //     status: 'active',
      //     startedAt: new Date(),
      // });
  
      //generate uid for agora live 
      let uid;
  
      //if no agora uid then generate
      if(!expert.agoraUid){
  
          uid = generateAgoraUid(profileId);
          expert.agoraUid = uid;
          await expert.save();
      }else{
          uid = expert.agoraUid;
      }
  
      const session = await SessionModel.findByIdAndUpdate(id, {
          status: ENUM_SESSION_STATUS.ONGOING,
          channelName: channelName,
          doctorUid: uid,
          startedAt: new Date()
      },{new: true});
  
      if (session.status !== ENUM_SESSION_STATUS.ONGOING) {
          throw new ApiError(404,"Failed to start a new live session.");
      }
  
      //generate token
      const token = AgoraTokenService.generateToken(
          channelName,
          uid, // convert to number
          RtcRole.PUBLISHER // or 1
      );
  
      if (!token) {
          throw new ApiError(400,"Failed to generate token to start a new live seeion. Try again.");
      }
  
  
      // 4. Start Cloud Recording (in background)
      // const recordingUid = Math.floor(Math.random() * 900000000) + 100000000; // Unique bot UID
  
      // const resourceId = await AgoraRecordingService.acquireResource(channelName, recordingUid);
      
      // const recordingResult = await AgoraRecordingService.startRecording(
      //   resourceId,
      //   channelName,
      //   recordingUid,
      //   doctorToken   // Pass doctor's token
      // );
  
      // // 5. Update LiveStream with recording info
      // liveStream = await LiveStream.findByIdAndUpdate(
      //   liveStream._id,
      //   {
      //     resourceId,
      //     sid: recordingResult.sid,
      //     recordingUid,
      //     status: 'active'
      //   },
      //   { new: true }
      // );
  
      // // Return everything to React frontend
      // res.json({
      //   success: true,
      //   channelName,
      //   token: doctorToken,
      //   uid: doctorUid,
      //   recording: {
      //     resourceId,
      //     sid: recordingResult.sid,
      //     recordingUid
      //   },
      //   message: 'Live stream started with recording'
      // });

      console.log(channelName,token,uid);
  
      return {
          channelName, 
          token,
          uid
      };
      
    } catch (error) {
      console.error('Start live + recording failed:', error);
      // res.status(500).json({ 
      //   error: 'Failed to start live stream',
      //   details: error.response?.data || error.message 
      // });
    }
}

const joinLiveSession = async (userDetails:IJwtPayload, query: Record<string,unknown>) => {
    const {profileId} = userDetails;
    const { channelName } = query;
//   if (!channelName) return res.status(400).json({ error: 'channelName required' });

  const session = await SessionModel.findOne({ channelName, status: ENUM_SESSION_STATUS.ONGOING });
  if (!session) {
    throw new ApiError(404,"Session not found to join live.");
  }

  const user = await UserModel.findById(profileId).select("agoraUid name email");
  if (!user) {
    throw new ApiError(404,"user not found to join love.");
  }

  let uid;

  //if no agora uid then generate
  if(!user.agoraUid){

      uid = generateAgoraUid(profileId);
      user.agoraUid = uid;
      await user.save();
  }else{
    uid = user.agoraUid;
  }

//   const user = req.user;
  const token = AgoraTokenService.generateToken(
    channelName as string,
    uid,
    RtcRole.SUBSCRIBER // or 2
  );

  if (!token) {
    throw new ApiError(404,"Failed to generate token to join a live session. Try again.");
  }

  return{ channelName, token, uid };

}

//token renewal service function both for Publisher amd Subscriber
const tokenRenewalService = async (userDetails: IJwtPayload, payload: any) => {
    const {profileId} = userDetails;

    const { channelName, uid, role } = payload;

    const token = AgoraTokenService.generateToken(
        channelName,
        parseInt(uid),
        role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER
    );

    return token;
}

//finish live session
const FinishLiveSession = async (userDetails: IJwtPayload,query: Record<string,unknown>) => {
    const {profileId} = userDetails;

//     const doctor = req.user;
//   if (!doctor || doctor.role !== 'doctor') {
//     return res.status(403).json({ error: 'Only doctors can end live streams' });
//   }

  const { channelName } = query;
//   if (!session) {
//     throw new ApiError(404,"Session not found to join.");
//   }

  try {
    // Update the stream status in MongoDB
    const updatedSession = await SessionModel.findOneAndUpdate(
      { 
        channelName, 
        status: ENUM_SESSION_STATUS.ONGOING
      },
      { 
        status: ENUM_SESSION_STATUS.COMPLETED,
        finishedAt: new Date()
      },
      { new: true } // return the updated document
    );

    if (updatedSession.status !== ENUM_SESSION_STATUS.COMPLETED) {
        throw new ApiError(400,"Failed to update session after finishing live stream.");
    }

    // TODO: Later — Call Agora Cloud Recording STOP API here (if recording is active)
    // Find the active stream
    // const liveStream = await LiveStream.findOne({
    //   channelName,
    //   doctorId: doctor._id,
    //   status: 'active'
    // });

    // if (!liveStream) {
    //   return res.status(404).json({ error: 'Active live stream not found' });
    // }

    // let mp4Url = '';
    // let hlsUrl = '';

    // // Stop Cloud Recording if it was started
    // if (liveStream.resourceId && liveStream.sid && liveStream.recordingUid) {
    //   try {
    //     const stopResult = await AgoraRecordingService.stopRecording(
    //       liveStream.resourceId,
    //       liveStream.sid,
    //       channelName,
    //       liveStream.recordingUid
    //     );

    //     mp4Url = stopResult.mp4Url;
    //     hlsUrl = stopResult.hlsUrl;

    //     console.log('Recording stopped successfully:', { mp4Url, hlsUrl });
    //   } catch (recError: any) {
    //     console.error('Failed to stop recording:', recError.response?.data || recError.message);
    //     // Continue anyway — don't fail the end-live because of recording issue
    //   }
    // }

    // // Update LiveStream document
    // const updatedStream = await LiveStream.findByIdAndUpdate(
    //   liveStream._id,
    //   {
    //     status: 'ended',
    //     endedAt: new Date(),
    //     recordingMp4Url: mp4Url,
    //     recordingHlsUrl: hlsUrl,
    //     // Optionally store full fileList
    //     recordingFiles: liveStream.recordingFiles || [] // You can push parsed files here if needed
    //   },
    //   { new: true }
    // );

    // res.json({
    //   success: true,
    //   message: 'Live stream ended and recording stopped successfully',
    //   stream: updatedStream,
    //   recording: {
    //     mp4Url,
    //     hlsUrl
    //   }
    // });

  } catch (error) {
    console.error('Error ending live stream:', error);
    // res.status(500).json({ 
    //   error: 'Failed to end live stream',
    //   details: error.message 
    // });
  }
}

//create session report
const createSessionReport = async () => {
    
}

const AgoraServices = {
    startLiveSession,
    joinLiveSession,
    tokenRenewalService,
    FinishLiveSession,
    createSessionReport
}

export default AgoraServices;