import { useAtom } from 'jotai';
import { userAtom } from '../atoms/user';

const Profile = () => {
  const [user, setUser] = useAtom(userAtom);

  if (!user) return <p>Non connecté</p>;

  const handleChange = (e) => {
    const newBio = e.target.value;
    setUser({ ...user, description: newBio });
  };

  const handleSubmit = async () => {
    const res = await fetch(`http://localhost:1337/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.jwt}`,
      },
      body: JSON.stringify({
        username: user.username,
        description: user.description
      }),
    });

    if (!res.ok) {
      console.error('Erreur mise à jour');
    }
  };

  return (
    <div>
      <h2>Profil de {user.username}</h2>
      <input
        value={user.description || ''}
        onChange={handleChange}
        placeholder="Ta bio ici"
      />
      <button onClick={handleSubmit}>Enregistrer</button>
    </div>
  );
};

export default Profile;
