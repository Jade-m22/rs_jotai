import { useAtom } from 'jotai';
import { userAtom } from '../atoms/user';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/_Profile.scss';
import '../styles/components/_PostList.scss';

const Profile = () => {
  const [user, setUser] = useAtom(userAtom);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user?.id) return;

      const res = await fetch(
        `http://localhost:1337/api/posts?filters[author][id][$eq]=${user.id}&populate=author,users_likes&sort=createdAt:desc`
      );
      const json = await res.json();

      const cleanPosts = json.data.map((p) => ({
        id: p.id,
        content: p.attributes.text,
        createdAt: p.attributes.createdAt,
        author: p.attributes.author?.data?.attributes?.username || 'Anonyme',
        authorId: p.attributes.author?.data?.id || null,
        like: p.attributes.like || 0,
        users_likes: p.attributes.users_likes?.data?.map((u) => u.id) || [],
      }));

      setPosts(cleanPosts);
    };

    fetchUserPosts();
  }, [user?.id]);

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

      <h3 className="postlist__title">📝 Tes publications</h3>
      <ul className="post-list">
        {posts.length === 0 ? (
          <p>Tu n’as pas encore publié.</p>
        ) : (
          posts.map((p) => (
            <li key={p.id} className="post-item">
              <div className="post-header">
                <Link to={`/profile/${p.authorId}`} className="post-author">
                  @{p.author}
                </Link>
                <span className="post-date">
                  {new Date(p.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="post-content">{p.content}</p>
              {/* Ici tu peux rajouter les boutons like/delete si tu veux */}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Profile;
