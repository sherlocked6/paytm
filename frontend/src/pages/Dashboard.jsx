import { AppBar } from "../components/AppBar"
import { Balance } from "../components/Balance"
import {Users} from '../components/Users'



export const Dashboard = () =>{
    return <div>
        <AppBar></AppBar>
        <Balance></Balance>
        <Users></Users>
    </div>
}