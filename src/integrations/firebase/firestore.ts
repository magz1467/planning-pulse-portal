import { db, websocketRetryConfig } from './config';
import { enableIndexedDbPersistence } from 'firebase/firestore';

let retryCount = 0;
const maxRetries = websocketRetryConfig.maxRetries;

const initializeFirestore = async () => {
  try {
    // Enable offline persistence
    await enableIndexedDbPersistence(db);
    console.log('Firestore offline persistence enabled');
    retryCount = 0; // Reset retry count on successful connection
  } catch (err: any) {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn('Multiple tabs open, persistence enabled in another tab');
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support persistence
      console.warn('Current browser doesn\'t support persistence');
    } else {
      if (retryCount < maxRetries) {
        retryCount++;
        const delay = Math.min(
          websocketRetryConfig.initialDelay * Math.pow(2, retryCount),
          websocketRetryConfig.maxDelay
        );
        console.log(`Retrying connection in ${delay}ms (attempt ${retryCount}/${maxRetries})`);
        setTimeout(initializeFirestore, delay);
      } else {
        console.error('Max retry attempts reached:', err);
      }
    }
  }
};

export { initializeFirestore };