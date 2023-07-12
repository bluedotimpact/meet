import useAxios from "axios-hooks";
import { PageState } from "../lib/client/pageState";
import { MeetingParticipantsRequest, MeetingParticipantsResponse } from "../pages/api/public/meeting-participants";
import useJoinAs from "../lib/client/useJoinAs";
import { Page } from "./Page";
import { H1 } from "./Text";
import Button from "./Button";
import Link from "./Link";

export type SelectPersonViewProps = {
  cohortId: string,
  setPage: (page: PageState) => void,
}

const SelectPersonView: React.FC<SelectPersonViewProps> = ({ cohortId, setPage }) => {
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
      <div className="grid gap-2 md:w-1/2">
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

export default SelectPersonView;