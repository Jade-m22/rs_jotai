import { useEffect } from 'react';
import { useAtom } from 'jotai';
import {
  installPromptAtom,
  pageVisitCountAtom,
  postCountAtom,
  showInstallBannerAtom,
} from '../atoms/pwaNotification';

const useInstallPrompt = () => {
  const [prompt, setPrompt] = useAtom(installPromptAtom);
  const [pageCount] = useAtom(pageVisitCountAtom);
  const [postCount] = useAtom(postCountAtom);
  const [, setShowBanner] = useAtom(showInstallBannerAtom);

  // Capture l'événement 'beforeinstallprompt'
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [setPrompt]);

  // Affiche la bannière à la 3e page, puis toutes les 2 pages
  useEffect(() => {
    if (prompt && (pageCount === 3 || (pageCount > 3 && (pageCount - 3) % 2 === 0))) {
      setShowBanner(true);
    }
  }, [pageCount, prompt, setShowBanner]);

  // Affiche aussi tous les 4 posts
  useEffect(() => {
    if (prompt && postCount > 0 && postCount % 4 === 0) {
      setShowBanner(true);
    }
  }, [postCount, prompt, setShowBanner]);
};

export default useInstallPrompt;
