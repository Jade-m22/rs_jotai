import { Link } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { userAtom } from '../atoms/user';
import Logout from './Logout';

const Navbar = () => {
  const user = useAtomValue(userAtom);
  const username = user?.username;

  return (
    <nav>
      <Link to="/">Accueil</Link>
      {user ? (
        <>
          <Link to="/me">Mon profil</Link>
          <Logout />
          <span>Bonjour {username} !</span>
        </>
      ) : (
        <>
          <Link to="/login">Connexion</Link>
          <Link to="/signup">Inscription</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
