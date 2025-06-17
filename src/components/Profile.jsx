import { useAtom } from 'jotai';
import { userAtom } from '../atoms/user';
import '../styles/components/_Profile.scss';

const Profile = () => {
  const [user, setUser] = useAtom(userAtom);

  if (!user) return <p className="profile__not-connected">Non connecté</p>;

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
        description: user.description,
      }),
    });

    if (!res.ok) {
      console.error('Erreur mise à jour');
    }
  };

  return (
    <div className="profile">
      <h2 className="profile__title">Profil de {user.username}</h2>
      <textarea
        value={user.description || ''}
        onChange={handleChange}
        placeholder="Ta bio ici..."
        className="profile__textarea"
      />
      <button className="profile__button" onClick={handleSubmit}>
        Enregistrer
      </button>
    </div>
  );
};

export default Profile;
