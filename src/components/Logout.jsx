import { useSetAtom } from 'jotai';
import { userAtom } from '../atoms/user';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Logout = () => {
  const setUser = useSetAtom(userAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('current-user'); // 👈 Efface aussi le user du storage
    setUser(null);
    navigate('/login');
  };

  return <button onClick={handleLogout}>Déconnexion</button>;
};

export default Logout;
