import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { userAtom } from './atoms/user';
import Login from './components/Login';
import Logout from './components/Logout';
import Signup from './components/Signup';
import Profile from './components/Profile';
import PublicProfile from './components/PublicProfile';
import NewPost from './components/NewPost';
import PostList from './components/PostList';
import Navbar from './components/Navbar';
import useAuth from './hooks/useAuth';

const App = () => {
  useAuth();
  const user = useAtomValue(userAtom);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={ <> {user && <NewPost />} <PostList /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/me" element={<Profile />} />
        <Route path="/profile/:id" element={<PublicProfile />} />
      </Routes>
    </div>
  );
};

export default App;
