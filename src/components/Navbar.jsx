import { Link } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { userAtom } from '../atoms/user';
import Logout from './Logout';
import '../styles/components/_Navbar.scss';

const Navbar = () => {
  const user = useAtomValue(userAtom);

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__link">Accueil</Link>
      </div>

      <div className="navbar__right">
        {user ? (
          <>
            <Link to="/me" className="navbar__link">Mon profil</Link>
            <Logout />
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__link">Connexion</Link>
            <Link to="/signup" className="navbar__link">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
