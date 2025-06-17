import { useSetAtom } from 'jotai';
import { userAtom } from '../atoms/user';
import { RESET } from 'jotai/utils';

const Logout = () => {
  const setUser = useSetAtom(userAtom);
  return <button onClick={() => setUser(RESET)}>Se déconnecter</button>;
};

export default Logout;
