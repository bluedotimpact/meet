import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Page } from '../components/Page';
import { H1 } from '../components/Text';
import MeetingView from '../components/MeetingView';
import CustomNameView from '../components/CustomNameView';
import SelectPersonView from '../components/SelectPersonView';
import { PageState } from '../lib/client/pageState';

const Home: React.FC = () => {
  const searchParams = useSearchParams();
  const cohortId = searchParams.get('cohortId') ?? '';
  // TODO: use this to skip first page? or at least somehow highlight?
  // const participantId = searchParams.get('participantId') ?? undefined;

  const [page, setPage] = useState<PageState>({ name: 'select' });

  if (!cohortId) {
    return (
      <Page>
        <H1 className="flex-1">Error: Missing cohort id.</H1>
        <p className="mb-2">Ensure you've navigated to the correct link, or try asking the person who gave the link to check it's correct.</p>
        <p>If you're still having difficulties, drop us a line at software@bluedot.org.</p>
      </Page>
    );
  }

  return (
    <>
      {page.name === 'select' && <SelectPersonView cohortId={cohortId} setPage={setPage} />}
      {page.name === 'custom' && <CustomNameView cohortClassId={page.cohortClassId} setPage={setPage} />}
      {page.name === 'room' && <MeetingView jwt={page.jwt} participantName={page.participantName} meetingNumber={page.meetingNumber} meetingPassword={page.meetingPassword} />}
    </>
  );
};

export default Home;
