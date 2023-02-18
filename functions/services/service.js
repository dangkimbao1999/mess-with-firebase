import { ENUM_ACTION } from "../enum/actionEnum.js";
import { addTrasaction, editUser, getTxById, getUserById, getUsersByName as getUserByName, getUserTransactions, editTx } from "./firestore.js";

export const addExpense = async (id, title, amount, type) => {
    const {total} = await getUserById(id);
    //TODO: Validate valid amount
    let amountResult 
    if (type === ENUM_ACTION.IN)
      amountResult= total + amount;
    else 
      amountResult = total - amount;
    if (amountResult < 0) 
      throw new Error('Balance is negative');
    const editedValue = {total: amountResult};
    await transfer(id, '', title, type, amount);
    await editUser(id, editedValue);
}

export const editExpense = async (txid, title) => {
  await editTx(txid, title);
}

const addHistory = async (id, expenseRef) => {
    const {history} = await getUserById(id);
    await editUser(id, {history: [...history, expenseRef]});
}


export const transfer = async (fromUserId, toUserName, title, type, amount) => {
    const expenseRef = await addTrasaction({title, type, amount, ref: fromUserId});
    //todo: if toUser exist trong user => phai3 add record cua3 ca3 2. neu61 ko thi2 chi3 1 tk thui
    const fromUser = (await getUserById(fromUserId));
    // if(toUserName){
    //   const toUser = (await getUserByName(toUserName))[0];
    //   return;
    // }
    
    // await reduceAmount(fromUserName, amount);
    await addHistory(fromUserId, expenseRef);
}