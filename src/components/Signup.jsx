import { useAtom } from 'jotai';
import { userAtom } from '../atoms/user';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value.trim();
    const email = e.target.elements.email.value.trim();
    const password = e.target.elements.password.value.trim();

    try {
      const res = await fetch('http://localhost:1337/api/auth/local/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (data.user) {
        setUser({
          jwt: data.jwt,
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          bio: data.user.description || '',
        });
        navigate('/');
      } else {
        alert(data.error?.message || 'Erreur à l’inscription');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Erreur à l’inscription');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inscription</h2>
      <input name="username" placeholder="Nom d'utilisateur" required />
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Mot de passe" required />
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default Signup;
