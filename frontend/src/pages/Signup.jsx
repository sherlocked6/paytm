import { useState } from "react"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { Button } from "../components/Button"
import { BottomWarning } from "../components/BottomWarning"
import axios from 'axios';
import {useNavigate} from 'react-router-dom'


export const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign up"}></Heading>
                <SubHeading label={"Enter your information to create a account"}></SubHeading>
                <InputBox label={"First Name"} placeholder={"John"} onChange={e => {
                    setFirstName(e.target.value)
                    console.log("firstname" + firstName);
                }} ></InputBox>
                <InputBox label={"Last Name"} placeholder={"Doe"} onChange={e => {
                    setLastName(e.target.value)
                }} ></InputBox>
                <InputBox label={"Email"} placeholder={"Johndoegmail.com"} onChange={e => {
                    setUsername(e.target.value)
                }} ></InputBox>
                <InputBox label={"Password"} onChange={e => {
                    setPassword(e.target.value)
                }} ></InputBox>
                <div className="pt-4">
                    <Button label={"Sign Up"} onClick={async() => {
                        console.log(firstName);
                        console.log(lastName)
                        console.log(username)
                        console.log(password)
                        const response =await  axios.post("http://localhost:3000/api/v1/user/signup",{
                            firstName,
                            lastName,
                            username,
                            password
                        })
                        localStorage.setItem("token", response.data.token)
                        navigate("/dashboard")
                    }}></Button>
                </div>
                <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={'/signin'}></BottomWarning>
             </div>
        </div>
    </div>
}