/**
 * Firebase Storage helper using React Native Firebase Modular SDK v25.
 * Uses getStorage(), ref(), uploadFile(), and getDownloadURL().
 */
import {
  getStorage,
  ref,
  uploadFile,
  getDownloadURL,
} from '@react-native-firebase/storage';

/**
 * Uploads a local file to Firebase Storage under the given path and returns its HTTPS download URL.
 */
export async function uploadFileToStorage(
  storagePath: string,
  localFilePath: string,
): Promise<string> {
  const cleanUri = localFilePath.startsWith('file://')
    ? localFilePath
    : `file://${localFilePath}`;

  const storageInstance = getStorage();
  const fileRef = ref(storageInstance, storagePath);

  // Upload file to Firebase Storage
  await uploadFile(fileRef, cleanUri);

  // Fetch download HTTPS URL
  const downloadUrl = await getDownloadURL(fileRef);
  return downloadUrl;
}
