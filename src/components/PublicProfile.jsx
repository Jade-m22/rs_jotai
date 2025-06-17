import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/components/_Profile.scss';

const PublicProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`http://localhost:1337/api/users/${id}`);
      const data = await res.json();
      setUser(data);
    };
    load();
  }, [id]);

  if (!user) return <p className="profile__loading">Chargement...</p>;

  return (
    <div className="profile profile--public">
      <h2 className="profile__title">Profil de {user.username}</h2>
      <p><strong>Email :</strong> {user.email}</p>
      <p><strong>Bio :</strong> {user.description || 'Pas de bio.'}</p>
    </div>
  );
};

export default PublicProfile;
