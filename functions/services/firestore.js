import { addDoc, collection, getDocs, query, where, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase.js";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";

export const getUsers = async() => {
    const users = [];
    const rs = await getDocs(collection(db, "users"));
    rs.forEach((user) => {
        users.push({ ...user.data(), id: user.id });
    });
    return users;
}

export const getUsersByName = async(searchName) => {
    const users = [];
    const q = query(
      collection(db, "users"),
      where("name", "==", searchName)
    );
    const rs = await getDocs(q);
    rs.forEach((user) => {
        users.push({ ...user.data(), id: user.id});
    });
    return users[0];
}

export const getUserTransactions = async(searchName) => {
    const {history} = await getUsersByName(searchName);
    return Promise.all(history.map(async (trx) => (await (await getDoc(doc(db, trx.path))).data())))
}

export const addUser = async (userInfo) => {
    // TODO: Make name field unique
    const auth = getAuth();
    console.log('name: ', userInfo.name);
    try {
        const {user} = await createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password);
        await updateProfile(auth.currentUser, {displayName: userInfo.name});
        console.log(auth.currentUser);
        await setDoc(doc(db, 'users', user.uid), {
            "email": user.email,
            "displayName": user.displayName,
            "phone": userInfo.phone, 
            "total": 0
        })
    } catch(err) {
        console.log(err)
    } 
}

export const login = async (user) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, user.email, user.password).then(cre => {
        // console.log(cre.user);
        return cre.user;
    }).catch((err) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    })
    const useCre = new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, user.email, user.password).then(cre => {
            // console.log(cre.user);
            resolve(cre.user);
        }).catch((err) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            reject(errorMessage);
        })
    })
    return useCre;
} 
export const editUser = async (userId, editedValue) => {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, editedValue, { merge: true });
}

export const addExpense = async (record) => {
    return await addDoc(collection(db, "expenses"), record)
}