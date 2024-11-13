import React,{ useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Signup(){
    let formDatas={
        firstName:"",
        email:"",
        password:""
    };
    let [resHeader, setResHeader]=useState('hello');

    const navigate = useNavigate();
    let [ formData, setForm ]=useState(formDatas);

    function fetchData(data){
        let param={};
        for (let key in data){
            param[key]=data[key];
        }
        axios.post('http://localhost:3009/user/signup', { headers: { 'Content-Type': 'application/json' }, params: param })
        .then((response)=>{ 
            console.log(response);
            if(response.status===200){
                navigate('/login');
            }
            else{
                setResHeader(response.data);
            }
        })
        .catch((err)=>{
            setResHeader(err.response.data);
        });
    }
    
    function setFormData(evt){
        setForm((prev)=>{
            prev[evt.target.name]=evt.target.value;
            return prev;
        });
    }

    async function clearForm(){
        await fetchData(formData);
        document.querySelector('.password').value="";
        // for (let key in formData){
        //     document.querySelector(`.${key}`).value="";
        // }
    }

    return(
        <div>
            <div>
            <label htmlFor="firstName">First Name: </label>
            <input className="firstName" type="text" name="firstName" placeholder="name" onChange={(evt)=>{
                setFormData(evt);
            }}></input>
            </div>
            <div>
            <label htmlFor="email">Email: </label>
            <input className="email" type="text" name="email" placeholder="email" onChange={(evt)=>{
                setFormData(evt);
            }}></input>
            </div>
            <div>
            <label htmlFor="pws">password: </label>
            <input className="password" type="password" name="password" placeholder="password" onChange={(evt)=>{
                setFormData(evt);
            }}></input>
            </div>
            <button type="Submit" onClick={async (evt)=>{
                evt.preventDefault();
                await clearForm();
            }}>Submit</button>
            <h3>{resHeader}</h3>
        </div>
    )
}

export default Signup;