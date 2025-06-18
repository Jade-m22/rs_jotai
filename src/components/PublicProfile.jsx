import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/_Profile.scss';
import '../styles/components/_PostList.scss';

const PublicProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfileAndPosts = async () => {
      try {
        // Charger l'utilisateur
        const resUser = await fetch(`http://localhost:1337/api/users/${id}`);
        const userData = await resUser.json();
        setUser(userData);

        // Charger ses posts
        const resPosts = await fetch(
          `http://localhost:1337/api/posts?filters[author][id][$eq]=${id}&populate=author,users_likes&sort=createdAt:desc`
        );
        const postsData = await resPosts.json();

        const cleanPosts = postsData.data.map((p) => ({
          id: p.id,
          content: p.attributes.text,
          createdAt: p.attributes.createdAt,
          author: p.attributes.author?.data?.attributes?.username || 'Anonyme',
          authorId: p.attributes.author?.data?.id || null,
          like: p.attributes.like || 0,
          users_likes: p.attributes.users_likes?.data?.map((u) => u.id) || [],
        }));

        setPosts(cleanPosts);
      } catch (err) {
        console.error('Erreur lors du chargement du profil ou des posts :', err);
        setError('Impossible de charger le profil.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileAndPosts();
  }, [id]);

  if (loading) return <p className="profile__loading">Chargement...</p>;
  if (error) return <p className="profile__error">{error}</p>;
  if (!user) return <p className="profile__error">Utilisateur introuvable.</p>;

  return (
    <div className="profile profile--public">
      <h2 className="profile__title">Profil de {user.username}</h2>
      <p><strong>Email :</strong> {user.email}</p>
      <p><strong>Bio :</strong> {user.description || 'Pas de bio.'}</p>

      <h3 className="postlist__title">📝 Publications de {user.username}</h3>
      <ul className="post-list">
        {posts.length === 0 ? (
          <p>Pas encore de publications.</p>
        ) : (
          posts.map((p) => (
            <li key={p.id} className="post-item">
              <div className="post-header">
                <Link to={user?.id === p.authorId ? '/me' : `/profile/${p.authorId}`}
                  className="post-author"
                >
                @{p.author}
                </Link>
                <span className="post-date">
                  {new Date(p.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="post-content">{p.content}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default PublicProfile;
