import { useAtom } from 'jotai';
import { postsAtom } from '../atoms/posts';
import { userAtom } from '../atoms/user';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PostList = () => {
  const [posts, setPosts] = useAtom(postsAtom);
  const [user] = useAtom(userAtom);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('http://localhost:1337/api/posts?populate=author,users_likes&sort=createdAt:desc');
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

    fetchPosts();
  }, [setPosts]);

  const handleLike = async (post) => {
    if (!user) return;

    const alreadyLiked = post.users_likes.includes(user.id);
    const updatedLikes = alreadyLiked ? post.like - 1 : post.like + 1;
    const updatedUsers = alreadyLiked
      ? post.users_likes.filter((id) => id !== user.id)
      : [...post.users_likes, user.id];

    const res = await fetch(`http://localhost:1337/api/posts/${post.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.jwt}`,
      },
      body: JSON.stringify({
        data: {
          like: updatedLikes,
          users_likes: updatedUsers,
        },
      }),
    });

    if (res.ok) {
      const updated = posts.map((p) =>
        p.id === post.id
          ? { ...p, like: updatedLikes, users_likes: updatedUsers }
          : p
      );
      setPosts(updated);
    }
  };

  const handleDelete = async (postId) => {
    if (!user?.jwt) return;

    const res = await fetch(`http://localhost:1337/api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.jwt}`,
      },
    });

    if (res.ok) {
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } else {
      console.error('Erreur lors de la suppression du post');
    }
  };

  return (
    <ul>
      {posts.map((p) => {
        const isLikedByUser = user && p.users_likes.includes(user.id);

        return (
          <li key={p.id}>
            <strong>
              <Link to={`/profile/${p.authorId}`}>{p.author}</Link>
            </strong>{' '}
            — {new Date(p.createdAt).toLocaleString()}
            <p>{p.content}</p>

            {user && (
              <p>
                <button onClick={() => handleLike(p)}>
                  {isLikedByUser ? '💔 Dislike' : '❤️ Like'} ({p.like})
                </button>
              </p>
            )}

            {user?.id === p.authorId && (
              <button onClick={() => handleDelete(p.id)}>🗑️ Supprimer</button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default PostList;
