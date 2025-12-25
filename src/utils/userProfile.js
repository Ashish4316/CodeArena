import { auth, db } from "../firebase";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc
} from "firebase/firestore";

/**
 * Get user profile data from Firestore
 * @param {string} uid 
 * @returns {Promise<Object|null>}
 */
export const getUserProfile = async (uid) => {
    if (!uid) return null;
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
};

/**
 * Update user profile data in Firestore
 * @param {string} uid 
 * @param {Object} data 
 * @returns {Promise<boolean>}
 */
export const updateUserProfile = async (uid, data) => {
    if (!uid) return false;
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await updateDoc(docRef, {
                ...data,
                updatedAt: new Date().toISOString()
            });
        } else {
            await setDoc(docRef, {
                ...data,
                uid,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }
        return true;
    } catch (error) {
        console.error("Error updating user profile:", error);
        return false;
    }
};
