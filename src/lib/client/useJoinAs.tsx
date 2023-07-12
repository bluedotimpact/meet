import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import { MeetingJwtRequest, MeetingJwtResponse } from "../../pages/api/public/meeting-jwt";

const useJoinAs = ({ cohortClassId, setPage }: CustomNameViewProps) => {
  const [joinError, setJoinError] = useState<string>('');
  const joinAs = async ({ name }: { name: string }) => {
    try {
      setJoinError('');
      const res = await axios.request<MeetingJwtResponse, AxiosResponse<MeetingJwtResponse>, MeetingJwtRequest>({
        method: 'post',
        url: '/api/public/meeting-jwt',
        data: { cohortClassId },
      });
      if (res.data.type === "error") {
        throw new Error(res.data.message)
      }
      setPage({
        name: 'room',
        jwt: res.data.meetingSdkJwt,
        participantName: name,
        meetingNumber: res.data.meetingNumber,
        meetingPassword: res.data.meetingPassword,
      })
    } catch (err) {
      setJoinError(err instanceof Error ? err.message : String(err));
    }
  }

  return { joinError, joinAs }
}

export default useJoinAs;
