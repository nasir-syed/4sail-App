import {Link, Navigate} from 'react-router-dom'
import { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';

function LoginPage(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [Message, setMessage] = useState('');
    const [redirect, setRedirect] = useState(false)
    const {setUser} = useContext(UserContext);

    async function handleLogin(ev) {
        ev.preventDefault();

        if (!email || !password) {
            setMessage('Please fill both the fields.');
            return;
        }

        try {
            const {data} = await axios.post('/login', { email, password });
            setUser(data)
            setRedirect(true);
        } catch (e) {
            setMessage('There was an error in logging in.');
        }
    }

    if (redirect) {
        return <Navigate to="/" />;
    }

    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div>
                <h1 className="text-4xl text-center">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={ev => handleLogin(ev)}>
                    <input type="email" placeholder='youremail@gmail.com' onChange={ev => setEmail(ev.target.value)}/>
                    <input type="password" placeholder='password123' onChange={ev => setPassword(ev.target.value)}/>
                    <p className="text-red-500 m-1">{Message}</p>
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don't have an account? <Link to={'/register'} className="underline text-black">Register</Link>

                    </div>
                </form>
            </div>
        </div>

        


    );

}

export default LoginPage;