import React, { useState } from 'react';
import { verifyEmail } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const OTPVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { verificationEmail, completeVerification } = useAuth();

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = e.target.previousSibling;
            if (prevInput) {
                prevInput.focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await verifyEmail({
                email: verificationEmail,
                otp: otp.join(''),
            });

            toast.success('Email verified successfully');
            completeVerification();
            navigate('/login');
        } catch (error) {
            toast.error(error.toString());
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!verificationEmail) {
        return (
            <div className="text-center">
                <p className="text-gray-600">No verification in progress.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                    Verify Your Email
                </h3>
                <p className="text-center text-gray-600 text-sm">
                    Please enter the verification code sent to <span className="font-medium">{verificationEmail}</span>
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex justify-center space-x-3">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onFocus={(e) => e.target.select()}
                            className="w-12 h-14 text-center text-xl font-semibold border rounded-md shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                        />
                    ))}
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting || otp.includes('')}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
                            (isSubmitting || otp.includes('')) ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Verifying...
                            </span>
                        ) : (
                            'Verify Email'
                        )}
                    </button>
                </div>
            </form>

            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Didn't receive the code?{' '}
                    <button 
                        type="button"
                        onClick={() => {
                            // Add resend functionality here
                            toast.success('Verification code resent');
                        }}
                        className="text-indigo-600 hover:text-indigo-500 font-medium focus:outline-none focus:underline transition-colors duration-200"
                    >
                        Resend
                    </button>
                </p>
            </div>
        </div>
    );
};

export default OTPVerification; 