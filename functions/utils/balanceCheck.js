import { getUserById } from "../services/firestore.js";
import { ENUM_ACTION } from "../enum/actionEnum.js";
export const balanceCheck = async (id, amount, type) => {
    const {total} = await getUserById(id);
    let amountResult 
    if (type === ENUM_ACTION.IN)
        amountResult= total + amount;
    else if (type === ENUM_ACTION.EX)
        amountResult = total - amount;
    else amountResult = amount;
    if (amountResult < 0) 
        throw new Error('Balance is negative');
    return {total: amountResult};
} 