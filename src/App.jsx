import { Routes, Route, useLocation } from 'react-router-dom';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { userAtom } from './atoms/user';
import { pageVisitCountAtom } from './atoms/pwaNotification';
import InstallBanner from './components/InstallBanner';
import { showInstallBannerAtom, installPromptAtom } from './atoms/pwaNotification';
import useInstallPrompt from './hooks/useInstallPrompt';

import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import PublicProfile from './components/PublicProfile';
import NewPost from './components/NewPost';
import PostList from './components/PostList';
import Navbar from './components/Navbar';
import useAuth from './hooks/useAuth';

const App = () => {
  useAuth();
  useInstallPrompt();
  const user = useAtomValue(userAtom);
  const location = useLocation();
  const [, setCount] = useAtom(pageVisitCountAtom);
  const [showBanner, setShowBanner] = useAtom(showInstallBannerAtom);
  const [prompt, setPrompt] = useAtom(installPromptAtom);

const handleInstall = () => {
  if (prompt) {
    prompt.prompt();
    setPrompt(null);
    setShowBanner(false);
  }
};

const handleCloseBanner = () => {
  setShowBanner(false);
};


  useEffect(() => {
    setCount((prev) => prev + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div>
      <Navbar />
      
      {showBanner && (
        <InstallBanner onInstall={handleInstall} onClose={handleCloseBanner} />
      )}

      <Routes>
        <Route path="/" element={<>{user && <NewPost />}<PostList /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/me" element={<Profile />} />
        <Route path="/profile/:id" element={<PublicProfile />} />
      </Routes>
    </div>
  );

};

export default App;
