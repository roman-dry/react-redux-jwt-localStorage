import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '../context/Authprovider';
import { jwtDecode } from "jwt-decode";
import { setTokenItem } from "../redux/slices/tokenSlice";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { Link } from 'react-router-dom';
//import useAuth from '../hooks/useAuth';
//import { Link, useNavigate, useLocation } from 'react-router-dom';

import axios from '../api/axios';
const LOGIN_URL = '/api/v1/auth/authenticate';

const Login = () => {
    //const { setAuth } = useAuth();
    const { setAuth } = useContext(AuthContext);
    const dispatch = useDispatch();

    //const navigate = useNavigate();
    //const location = useLocation();
    //const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [name, setName] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [name, pwd])

    const user1 = {
        "email": name,
        "password": pwd
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify(user1),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log(JSON.stringify(response?.data));
            console.log(JSON.stringify(response));
            const accessToken = response?.data?.access_token;
            const data = response.data;
            const role = response?.data?.role;
            console.log(role);
            dispatch(
                setTokenItem({
                  userId: data.userId,
                  access_token: accessToken,
                  exp: jwtDecode(accessToken).exp,
                })
            );
            const responseUser = await axios.get(`api/v1/auth/user/${data.userId}`, {
                headers: { Authorization: `Bearer ${data.access_token}` },
              });
              const dataUser = responseUser.data;
              dispatch(setUser(dataUser));
              console.log(dataUser);
            setAuth({ name, pwd, role, accessToken });
            setName('');
            setPwd('');
            setSuccess(true);
            //navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <>
        {success ? (
            <section>
                <h1>You are logged in!</h1>
                <br />
                <p>
                    <Link to='/'>Go to Home</Link>
                </p>

            </section>) : (
            <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button>Sign In</button>
            </form>
            <p>
                Need an Account?<br />
                <span className="line">
                    {/* <Link to="/register">Sign Up</Link> */}
                    <a href='#Sing Up'></a>
                </span>
            </p>
        </section>)}
        </>
        

        

    )
}

export default Login