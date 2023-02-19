import { ENUM_ACTION } from "../enum/actionEnum.js";
import { balanceCheck } from "../utils/balanceCheck.js";
import { addTrasaction, editUser, editTx, getUsersByEmail, addHistory } from "./firestore.js";

export const editExpense = async (txid, title) => {
  await editTx(txid, title);
}

export const transfer = async (fromUserId, toUserEmail, title, amount, type) => {
  // let expenseRef;
  //todo: if toUser exist trong user => phai3 add record cua3 ca3 2. neu61 ko thi2 chi3 1 tk thui
  if(toUserEmail){
    const totalFromValue = await balanceCheck(fromUserId, amount, ENUM_ACTION.EX);
    const toUser = (await getUsersByEmail(toUserEmail));
    if (!toUser) {
      throw new Error('No user was found')
    }
    const totalToValue = await balanceCheck(toUser.id, amount, ENUM_ACTION.IN);
    const expenseFromRef = await addTrasaction({title, type: ENUM_ACTION.EX, amount, ref: fromUserId, isTransfer: true});
    await editUser(fromUserId, totalFromValue);
    await addHistory(fromUserId, expenseFromRef)
    const incomeToRef = await addTrasaction({title, type: ENUM_ACTION.IN, amount, ref: toUser.id, isTransfer: true});
    await editUser(toUser.id, totalToValue);
    await addHistory(toUser.id, incomeToRef)
    return;
  } else {
    const editedValue = await balanceCheck(fromUserId, amount, type);
    const expenseRef = await addTrasaction({title, type, amount, ref: fromUserId});
    await addHistory(fromUserId, expenseRef);
    await editUser(fromUserId, editedValue);
  }    
}