import { useAtom } from 'jotai';
import { userAtom } from '../atoms/user';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../styles/components/_AuthForm.scss';

const Login = () => {
  const [, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value.trim();
    const password = e.target.elements.password.value.trim();

    try {
      const res = await fetch('http://localhost:1337/api/auth/local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password }),
      });

      const data = await res.json();

      if (data.user) {
        Cookies.set('token', data.jwt, { path: '/' });
        setUser({
          jwt: data.jwt,
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          bio: data.user.description || '',
        });
        navigate('/');
      } else {
        alert(data.error?.message || 'Erreur de connexion');
      }
    } catch {
      alert('Erreur de connexion');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Connexion</h2>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Mot de passe" required />
      <button type="submit">Se connecter</button>
    </form>
  );
};

export default Login;
