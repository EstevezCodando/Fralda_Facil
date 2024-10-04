import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadImageAsync = async (uri: string, path: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storage = getStorage();
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
};
