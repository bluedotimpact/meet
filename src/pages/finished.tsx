import { Page } from '../components/Page';
import { H1 } from '../components/Text';
import Button from '../components/Button';

const Home: React.FC = () => {
return (
  <Page>
    <H1 className="flex-1">Thanks for attending!</H1>
    <Button href={`/${window.location.search}`}>Rejoin the meeting</Button>
  </Page>
)
};

export default Home;
