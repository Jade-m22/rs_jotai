import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

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

  if (!user) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Profil de {user.username}</h2>
      <p>Email : {user.email}</p>
      <p>Bio : {user.description || 'Pas de bio'}</p>
    </div>
  );
};

export default PublicProfile;
