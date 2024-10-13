import { useState } from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios'




function RegisterPage(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [Message, setMessage] = useState('');
    const [Success, setSuccess] = useState(false);


    async function register(ev){

        if (!name || !email || !password) {
            ev.preventDefault()
            setMessage('Please fill in all the fields.')
        }

        ev.preventDefault();


        try {
            await axios.post('/register', {
                name,
                email,
                password,
            });

            setMessage('Registration successful!');
            setSuccess(true);
        } catch (e) {
            if (e.response && e.response.status === 422) {
                const errorMessage = e.response.data.error;
                if (errorMessage === 'Email is already registered') {
                    setSuccess(false);
                    setMessage('Email is already registered with an account');
                } else if (errorMessage === 'Username is already taken') {
                    setSuccess(false);
                    setMessage('Username is already taken');
                }
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    }

    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div>
                <h1 className="text-4xl text-center">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={ev => register(ev)}>
                    <input type="text" placeholder='John Doe' onChange={ev => setName(ev.target.value)}/>
                    <input type="email" placeholder='youremail@gmail.com'onChange={ev => setEmail(ev.target.value)}/>
                    <input type="password" placeholder='password123'onChange={ev => setPassword(ev.target.value)}/>
                    <p className={Success ? "text-green-500 m-1" : "text-red-500 m-1"}>{Message}</p>
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        have an account? <Link to={'/login'} className="underline text-black">Login</Link>

                    </div>
                </form>
            </div>
        </div>
    );

}

export default RegisterPage;