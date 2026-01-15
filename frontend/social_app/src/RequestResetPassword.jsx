import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from './api';
import './Auth.css';

const RequestResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            await api.post('auth/request-reset-email/', { email });
            setMessage('Check your email for the reset link.');
        } catch (err) {
            setError('Error sending email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Reset Password</h2>
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        disabled={loading}
                    />
                </div>
                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
            <p>
                Remember your password? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default RequestResetPassword;
