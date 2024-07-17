import axios from "axios";
import { useEffect, useState } from "react"
import { Button } from "./Button";
import {useNavigate} from 'react-router-dom'

export const Users = () => {
    const [filter, setFilter] = useState("");
    const [users, setUsers] = useState([]);

    useEffect( () => {
        axios.get("http://localhost:3000/api/v1/user/bulk?filter=" + filter)
            .then(response => {
                setUsers(response.data.users)
            })
    },[filter])
    
    return <div className=" mx-4">
        <div className="font-bold text-lg mt-4">
            Users
        </div>
        <div className="my-2">
            <input onChange={(e) => {
                setFilter(e.target.value)
            }} type="text" placeholder="Search users..." className="w-full border border-slate-200 rounded px-2 py-1"></input>
        </div>
        <div>
            {users.map((user) => <User user={user}></User>)}
        </div>
    </div>
}

function User({user}){
    const navigate = useNavigate();

   return  <div className="flex justify-between">
        <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                        {user.firstName[0].toUpperCase()}
                    </div>
                </div>
                <div className="flex flex-col justify-center h-ful">
                    {user.firstName} {user.lastName}
                </div>
        </div>
        <div className="flex flex-col justify-center h-ful">
            <Button label={"Send Money"} onClick={(e) => {
                navigate("/sendmoney?id=" + user._id);
            }}></Button>
        </div>        
   </div>
}