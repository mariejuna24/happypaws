import { db, auth } from "../firebase";
import {
  collection, getDocs, getDoc, addDoc,
  updateDoc, deleteDoc, doc, query, where,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

// ─────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────
export const getServices = async () => {
  const snapshot = await getDocs(collection(db, "services"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getServiceById = async (id) => {
  const snapshot = await getDoc(doc(db, "services", id));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const addService = async (serviceData) => {
  const ref = await addDoc(collection(db, "services"), serviceData);
  return { id: ref.id, ...serviceData };
};

export const updateService = async (id, serviceData) => {
  await updateDoc(doc(db, "services", id), serviceData);
  return { id, ...serviceData };
};

export const deleteService = async (id) => {
  await deleteDoc(doc(db, "services", id));
};

// ─────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────
export const registerUser = async (name, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await updateProfile(user, { displayName: name });
  await addDoc(collection(db, "users"), {
    uid: user.uid,
    name,
    email,
  });
  return user;
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const getCurrentUser = () => auth.currentUser;

// ─────────────────────────────────────────
// BOOKINGS
// ─────────────────────────────────────────
export const createBooking = async (bookingData) => {
  const user = auth.currentUser;
  const ref = await addDoc(collection(db, "bookings"), {
    ...bookingData,
    userId: user ? user.uid : null,
    status: "Confirmed",
  });
  return { id: ref.id, ...bookingData };
};

export const getBookingsByUser = async (uid) => {
  const q = query(collection(db, "bookings"), where("userId", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getAllBookings = async () => {
  const snapshot = await getDocs(collection(db, "bookings"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateBookingStatus = async (id, status) => {
  await updateDoc(doc(db, "bookings", id), { status });
};

export const deleteBooking = async (id) => {
  await deleteDoc(doc(db, "bookings", id));
};

export const updateBookingRating = async (id, rating, feedback) => {
  await updateDoc(doc(db, "bookings", id), { rating, feedback });
};

// ─────────────────────────────────────────
// USERS (Admin)
// ─────────────────────────────────────────
export const getAllUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteUser = async (id) => {
  await deleteDoc(doc(db, "users", id));
};