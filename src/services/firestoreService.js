import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";

const getUserCollectionRef = (uid, dataType) => {
  return collection(db, "users", uid, dataType);
};

const getUserDocumentRef = (uid, dataType, itemId) => {
  return doc(db, "users", uid, dataType, itemId);
};

export const getUserItems = async (uid, dataType) => {
  const itemsQuery = query(getUserCollectionRef(uid, dataType), orderBy("date", "desc"));
  const snapshot = await getDocs(itemsQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
};

export const addUserItem = async (uid, dataType, item) => {
  await setDoc(getUserDocumentRef(uid, dataType, item.id), item);
  return item;
};

export const updateUserItem = async (uid, dataType, item) => {
  await updateDoc(getUserDocumentRef(uid, dataType, item.id), item);
  return item;
};

export const deleteUserItem = async (uid, dataType, itemId) => {
  await deleteDoc(getUserDocumentRef(uid, dataType, itemId));
};

export const deleteUserItems = async (uid, dataType) => {
  const snapshot = await getDocs(getUserCollectionRef(uid, dataType));
  await Promise.all(snapshot.docs.map((document) => deleteDoc(document.ref)));
};

export const deleteAllUserItems = async (uid, dataTypes) => {
  await Promise.all(dataTypes.map((dataType) => deleteUserItems(uid, dataType)));
};
