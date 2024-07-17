import { useEffect, useState } from "react"
import axios from 'axios';

const url = 'http://localhost:3000/api/v1/account/balance'

export const Balance = () => {
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBalance = async () => {
            try{
                console.log("twice")
                const respone = await axios.get(`${url}`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem('token')
                    }
                })
                setBalance(respone.data.balance.toFixed(2))
            }
            catch(error){
               setError(error.respone.data.message)
            }
        }

        fetchBalance();
    },[])

    if(error){
        return <div>Error: {error}</div>
    }

    if(balance == null){
        return <div className=" ml-4 p-2">Loading..</div>
    }

    return <div className="font-bold text-lg mt-4 mx-4">
        Your Balance Rs {balance}
    </div>
}