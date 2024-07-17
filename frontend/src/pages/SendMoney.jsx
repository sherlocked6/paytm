import { useEffect, useState } from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom'
import axios from 'axios';

export const SendMoney = () =>{
    const [searchparams] = useSearchParams();
    const navigate = useNavigate();
    const [user,setUser] = useState({firstName: '', lastName: ''});
    const [amount, setAmount] = useState('');
    const id = searchparams.get("id")

    useEffect(() => {
        const fetchUser = async () => {
            try{
                const response = await axios.get(`http://localhost:3000/api/v1/user/getUser/${id}`);
                const {data} = response
                if(data.success){
                    setUser({firstName: data.user.firstName, lastName: data.user.lastName})
                }
                else{
                    console.log(data.message)
                }
            }
            catch(error){
                alert(error.response.data.message)
            } 
        }
        fetchUser();
    },[])

    const handleTransfer = async () => {
        try{
            const response = await axios.post('http://localhost:3000/api/v1/account/transfer',
                {amount: parseInt(amount), to: id},
                {headers: {
                    Authorization: 'Bearer ' +`${localStorage.getItem('token')}`
                }}
            )
            if(response.data.success){
                alert(response.data.message)
                navigate('/dashboard')
            }
        }catch(error){
            alert(error.response.data.message)
        }
    }

    return <div className="flex justify-center h-screen bg-gray-100">
       <div className="h-full flex flex-col justify-center">
            <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                <div class="flex flex-col space-y-1.5 p-6">
                    <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    <div className='p-6'>
                        <div class = 'flex items-center space-x-4'>
                            <div class="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span class="text-2xl text-white">{user.firstName.substring(0,1).toUpperCase()}</span>
                            </div> 
                            <h3 class="text-2xl font-semibold">{user.firstName} {user.lastName}</h3>
                        </div> 
                    </div>
                    <div class="space-y-4">
                        <div class="space-y-2">
                            <label
                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            for="amount">
                                Amount (in Rs)
                            </label>
                            <input placeholder='Enter Amount' type='number' onChange={(e) => {
                                setAmount(e.target.value)
                            }} value={amount} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"></input>
                        </div>
                        <button onClick={handleTransfer} class="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white">Initiate Transfer</button>
                    </div>
                </div>
            </div>
       </div>
    </div>
}