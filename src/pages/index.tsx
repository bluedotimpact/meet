import Button from '../components/Button';
import { Page } from '../components/Page';
import { H1 } from '../components/Text';
import { useSearchParams } from 'next/navigation'
import useAxios from 'axios-hooks';
import { MeetingParticipantsRequest, MeetingParticipantsResponse } from './api/public/meeting-participants';
import Link from '../components/Link';
import { useState } from 'react';
import MeetingView from '../components/MeetingView';
import axios, { AxiosResponse } from 'axios';
import { MeetingJwtRequest, MeetingJwtResponse } from './api/public/meeting-jwt';

type PageState =
  | { name: 'select' }
  | { name: 'custom', cohortClassId: string }
  | { name: 'room', jwt: string, participantName: string, meetingNumber: string, meetingPassword: string }

const Home: React.FC = () => {
  const searchParams = useSearchParams()
  const cohortId = searchParams.get('cohortId') ?? "";
  // TODO: use this to skip first page? or at least somehow highlight?
  const participantId = searchParams.get('participantId') ?? undefined;

  const [page, setPage] = useState<PageState>({ name: 'select' })

  if (!cohortId) {
    return (
      <Page>
        <H1 className="flex-1">Error: Missing cohort id.</H1>
        <p>Ensure you've navigated to the correct link, or try asking the person who gave the link to check it's correct.</p>
      </Page>
    )
  }

  return (<>
    {page.name === "select" && <SelectView cohortId={cohortId} setPage={setPage} />}
    {page.name === "custom" && <GuestView cohortClassId={page.cohortClassId} setPage={setPage} />}
    {page.name === "room" && <MeetingView jwt={page.jwt} participantName={page.participantName} meetingNumber={page.meetingNumber} meetingPassword={page.meetingPassword} />}
  </>)
};

type SelectPageProps = {
  cohortId: string,
  setPage: (page: PageState) => void,
}

const SelectView: React.FC<SelectPageProps> = ({ cohortId, setPage }) => {
  const [{ data, loading, error }] = useAxios<MeetingParticipantsResponse, MeetingParticipantsRequest>({
    method: 'post',
    url: '/api/public/meeting-participants',
    data: { cohortId },
  });

  const { joinAs, joinError } = useJoinAs({ cohortClassId: data?.type === "success" ? data.cohortClassId : "", setPage });

  if (loading) {
    return (
      <Page>
        <H1 className="flex-1">Loading...</H1>
      </Page>
    )
  }

  const errorMessage = error?.response?.data?.type === "error" ? error.response.data.message : error?.message;
  if (errorMessage || data?.type !== "success") {
    return (
      <Page>
        <H1 className="flex-1">Error: {errorMessage ?? "Unknown error"}</H1>
        <p>If this error persists, please contact us at software@bluedotimpact.org.</p>
      </Page>
    )
  }

  return (
    <Page>
      <div className="flex">
        <H1 className="flex-1">Hey there! Who are you?</H1>
      </div>
      {joinError && <p>{joinError}</p>}
      <div className="grid gap-2 w-1/2">
        {data.participants.map((participant) => (
          <Button key={participant.id} onClick={() => joinAs({ name: participant.name })}>{participant.name}</Button>
        ))}
      </div>
      <div className='mt-4'>
        <Link onClick={() => {setPage({ name: 'custom', cohortClassId: data.cohortClassId })}}>I'm not on this list</Link>
      </div>
    </Page>
  );
}

type GuestViewProps = {
  cohortClassId: string,
  setPage: (page: PageState) => void,
}

const GuestView: React.FC<GuestViewProps> = ({ cohortClassId, setPage }) => {
  const [name, setName] = useState('')
  const { joinAs, joinError } = useJoinAs({ cohortClassId, setPage });

  return (
    <Page>
      <div className="flex">
        <H1 className="flex-1">Hey there! Who are you?</H1>
      </div>
      <p>If you're sure this is the meeting for you, enter your name below</p>
      <form className="flex gap-2 mt-2" onSubmit={(event) => { event.preventDefault(); return joinAs({ name }) }}>
        <input type="text" autoComplete="name" placeholder="Your name" className="px-2 py-1.5 rounded border-2" value={name} onChange={(value) => setName(value.target.value)} />
        <Button onClick={() => joinAs({ name })}>Join</Button>
      </form>
      {joinError && <p>{joinError}</p>}
    </Page>
  );
}

export default Home;


const useJoinAs = ({ cohortClassId, setPage }: GuestViewProps) => {
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