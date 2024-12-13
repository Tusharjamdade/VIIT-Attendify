import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '@/src/firebase';

const useUserDetails = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentUserDetails = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data());
        } else {
          console.error('User document does not exist');
        }
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUserDetails();
  }, []);

  return { currentUser, loading, error, refetch: fetchCurrentUserDetails };
};

export default useUserDetails;
