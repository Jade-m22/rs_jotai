import { useAtom } from 'jotai';
import { postsAtom } from '../atoms/posts';
import { userAtom } from '../atoms/user';
import { useState } from 'react';
import { postCountAtom } from '../atoms/pwaNotification';
import '../styles/components/_NewPost.scss';

const NewPost = () => {
  const [posts, setPosts] = useAtom(postsAtom);
  const [user] = useAtom(userAtom);
  const [text, setText] = useState('');
  const [, setPostCount] = useAtom(postCountAtom);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;

    const res = await fetch('http://localhost:1337/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.jwt}`,
      },
      body: JSON.stringify({
        data: {
          text: content,
          author: user.id,
        },
      }),
    });

    const data = await res.json();

    const newPost = {
      id: data.data.id,
      content: data.data.attributes.text,
      createdAt: data.data.attributes.createdAt,
      author: user.username,
      authorId: user.id,
      like: 0,
      users_likes: [],
    };

    setPosts([newPost, ...posts]);
    setPostCount((prev) => prev + 1);
    setText('');
  };

  return (
    <div className="new-post">
      {user && (
        <p className="new-post__welcome">Bonjour {user.username} 👋</p>
      )}
      <form onSubmit={handleSubmit}>
        <textarea
          name="content"
          placeholder="Quoi de neuf ?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit">Poster</button>
      </form>
    </div>
  );
};

export default NewPost;
