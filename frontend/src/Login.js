import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate }from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try{
            const response = await axios.post('http://127.0.0.1:8000/api/login/',{
                username,
                password
            });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error){
            setMessage('Invalid Credentials');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>username:</label>
                    <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type='submit'>Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;