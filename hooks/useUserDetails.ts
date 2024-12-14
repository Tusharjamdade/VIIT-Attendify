import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, firestore } from '@/src/firebase';

const useUserDetails = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentUserDetails = useCallback(async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
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
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(firestore, 'users', user.uid);

      // Listen for real-time updates to the user's document
      const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
        if (snapshot.exists()) {
          setCurrentUser(snapshot.data());
        } else {
          console.error('User document does not exist');
        }
      }, (err) => {
        console.error('Error listening to user document updates:', err);
        setError(err);
      });

      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    fetchCurrentUserDetails();
  }, [fetchCurrentUserDetails]);

  return { currentUser, loading, error, refetch: fetchCurrentUserDetails };
};

export default useUserDetails;
