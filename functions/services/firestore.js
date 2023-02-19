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

export const getUserById = async(id) => {
    const docRef = doc(db, "users", id)
    const docSnap = await getDoc(docRef);
    const user = docSnap.data();
    return user;
}

export const getTxById = async(id) => {
    const docRef = doc(db, "expenses", id)
    const docSnap = await getDoc(docRef);
    const tx = docSnap.data();
    return tx;
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

export const getUsersByEmail = async(email) => {
    const users = [];
    const q = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const rs = await getDocs(q);
    rs.forEach((user) => {
        console.log(user);
        users.push({ ...user.data(), id: user.id});
    });
    return users[0];
}

export const getUserTransactions = async(userId, title, type, amount) => {
    // const {history} = await getUserById(userId);
    let q = query(collection(db, "expenses"));
    q = query(q, where("ref", "==", userId))
    if (title) q = query(q, where("title", "==", title));
    if(type) q = query(q, where("type", "==", type));
    const rs = await getDocs(q);
    const transactionHistory = [];
    rs.forEach((tx) => {
        transactionHistory.push({...tx.data(), id: tx.id});
    })
    return(transactionHistory);
}

export const addUser = async (userInfo) => {
    // TODO: Make name field unique
    const auth = getAuth();
    // console.log('name: ', userInfo.name);
    try {
        const {user} = await createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password);
        await updateProfile(auth.currentUser, {displayName: userInfo.name});
        console.log(auth.currentUser);
        await setDoc(doc(db, 'users', user.uid), {
            "email": user.email,
            "displayName": user.displayName,
            "phone": userInfo.phone, 
            "history": [],
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

export const editTx = async (txId, editedValue) => {
    const userRef = doc(db, "expenses", txId);
    await setDoc(userRef, {title: editedValue}, { merge: true });
}

export const addTrasaction = async (record) => {
    return await addDoc(collection(db, "expenses"), record)
}

export const addHistory = async (id, expenseRef) => {
    const {history} = await getUserById(id);
    await editUser(id, {history: [...history, expenseRef]});
}