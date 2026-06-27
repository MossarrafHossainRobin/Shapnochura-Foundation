import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

// Login user
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

// Register user
export async function registerUser(name, email, password, role = "user") {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    await updateProfile(user, {
      displayName: name,
    });

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role,
      status: "active",
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

// Logout user
export async function logoutUser() {
  try {
    await signOut(auth);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

// Get user data from Firestore
export async function getUserData(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return {
        success: true,
        data: {
          id: userSnap.id,
          ...userSnap.data(),
        },
      };
    }

    return {
      success: false,
      message: "User not found",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}