import { useAtom } from 'jotai';
import { postsAtom } from '../atoms/posts';
import { userAtom } from '../atoms/user';

const NewPost = () => {
  const [posts, setPosts] = useAtom(postsAtom);
  const [user] = useAtom(userAtom);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value.trim();
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
        },
      }),
    });

    const data = await res.json();

    const newPost = {
      id: data.data.id,
      content: data.data.attributes.text,
      createdAt: data.data.attributes.createdAt,
      author: data.data.attributes.author?.data?.attributes?.username || user.username,
    };

    setPosts([newPost, ...posts]);
    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea name="content" placeholder="Quoi de neuf ?" required />
      <button type="submit">Poster</button>
    </form>
  );
};

export default NewPost;
