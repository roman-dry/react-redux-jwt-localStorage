import React from "react";
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { useSelector ,useDispatch} from "react-redux";
import { removeUser } from "../redux/slices/userSlice";
import { removeToken } from "../redux/slices/tokenSlice";

const LOGOUT_URL = '/api/v1/auth/logout';

function Home() {
    
    const user = useSelector((state) => state.userReducer.user);
    const token = useSelector((state) => state.tokenReducer.item.access_token);
    const dispatch = useDispatch();
    const firstname = user.firstname;

    async function onLogout() {
        console.log(user);
        console.log(token);
        try {  
            await axios.post(LOGOUT_URL,  JSON.stringify({}),
                {headers: {
                     Authorization: `Bearer ${token}`,
                     'Content-Type': 'application/json'
                 }          
                });
            dispatch(removeUser());
            dispatch(removeToken());

        } catch {
            alert('Fail logout')

        }

    }
    return (
        <div>
            <p>Welcome to Homepage, {firstname !== undefined ? firstname : 'guest'}</p>
            {firstname === undefined ? <p>If you already have an account, please <Link to="/login">login</Link></p> : ''}
            {firstname === undefined ? <p>If you don`t have an acount, please <Link to="/register">sing up</Link></p> : ''}
            {firstname !== undefined ? <button onClick={() => onLogout()}>Logout</button> : ''}
        </div>
    )
}

export default Home;