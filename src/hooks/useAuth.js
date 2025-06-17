import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import Cookies from 'js-cookie';
import { userAtom } from '../atoms/user';

const useAuth = () => {
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return;

    fetch('http://localhost:1337/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setUser({
            jwt: token,
            id: data.id,
            username: data.username,
            email: data.email,
            bio: data.description || '',
          });
        } else {
          Cookies.remove('token');
        }
      })
      .catch(() => {
        Cookies.remove('token');
      });
  }, [setUser]);
};

export default useAuth;
