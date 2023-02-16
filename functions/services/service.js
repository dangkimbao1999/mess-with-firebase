import { addExpense, editUser, getUsersByName as getUserByName, getUserTransactions } from "./firestore.js";

const reduceAmount = async (name, amount) => {
    const {id, total} = await getUserByName(name);
    //TODO: Validate valid amount
    const amountResult = total - amount;
    const editedValue = {total: amountResult};
    await editUser(id, editedValue);
}

const addHistory = async (name, expenseRef) => {
    const {id, history} = await getUserByName(name);
    await editUser(id, {history: [...history, expenseRef]});
}


export const transfer = async (fromUserName, toUserName, amount, title) => {
    const expenseRef = await addExpense({title, amount});
    //todo: if toUser exist trong user => phai3 add record cua3 ca3 2. neu61 ko thi2 chi3 1 tk thui
    const fromUser = (await getUserByName(fromUserName))[0];
      if(toUserName){
        const toUser = (await getUserByName(toUserName))[0];
        return;
      }
    
    await reduceAmount(fromUserName, amount);
    await addHistory(fromUserName, expenseRef);

    
}