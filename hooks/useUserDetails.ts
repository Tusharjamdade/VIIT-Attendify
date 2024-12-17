import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, firestore } from '@/src/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const useUserDetails = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // Use router for navigation

  // Fetch current user details from Firestore
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
      } else {
        console.error('No user is authenticated');
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for real-time updates to the user document
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(firestore, 'users', user.uid);

      const unsubscribe = onSnapshot(
        userDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setCurrentUser(snapshot.data());
          } else {
            console.error('User document does not exist');
          }
        },
        (err) => {
          console.error('Error listening to user document updates:', err);
          setError(err);
        }
      );

      return () => unsubscribe();
    }
  }, []);

  // Monitor authentication state and redirect if not logged in
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCurrentUserDetails();
      } else {
        setCurrentUser(null);
        setLoading(false);
        router.replace('/signin'); // Redirect to Sign In page
      }
    });

    return () => unsubscribeAuth();
  }, [fetchCurrentUserDetails, router]);

  return { currentUser, loading, error, refetch: fetchCurrentUserDetails };
};

export default useUserDetails;
