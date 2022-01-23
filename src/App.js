import Pinned_to_card from "./pinned-to-card";
import {useAsync} from 'react-async';

function App() {
  const { data, error, isLoading } = useAsync({ promiseFn: Pinned_to_card,  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  if (data) return <div>{data}</div>;
  return <div>Nothing</div>;
}
export default App;
