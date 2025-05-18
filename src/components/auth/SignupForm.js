import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signup } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const validationSchema = Yup.object({
    firstName: Yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters'),
    lastName: Yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

const SignupForm = () => {
    const { startVerification } = useAuth();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await signup(values);
                toast.success('Please check your email for verification code.');
                startVerification(values.email);
            } catch (error) {
                toast.error(error.toString());
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="space-y-6">
            <form onSubmit={formik.handleSubmit} className="space-y-8">
                {/* Name Section */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label 
                                htmlFor="firstName" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                First Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    placeholder="Enter your first name"
                                    {...formik.getFieldProps('firstName')}
                                    className={`appearance-none block w-full px-3 py-3 border ${
                                        formik.touched.firstName && formik.errors.firstName
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm`}
                                />
                                {formik.touched.firstName && formik.errors.firstName && (
                                    <p className="mt-2 text-sm text-red-600">{formik.errors.firstName}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label 
                                htmlFor="lastName" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Last Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    placeholder="Enter your last name"
                                    {...formik.getFieldProps('lastName')}
                                    className={`appearance-none block w-full px-3 py-3 border ${
                                        formik.touched.lastName && formik.errors.lastName
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm`}
                                />
                                {formik.touched.lastName && formik.errors.lastName && (
                                    <p className="mt-2 text-sm text-red-600">{formik.errors.lastName}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <label 
                            htmlFor="email" 
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="Enter your email"
                                {...formik.getFieldProps('email')}
                                className={`appearance-none block w-full px-3 py-3 border ${
                                    formik.touched.email && formik.errors.email
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm`}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label 
                            htmlFor="phone" 
                            className="block text-sm font-medium text-gray-700"
                        >
                            Phone number
                        </label>
                        <div className="mt-1">
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                placeholder="Enter your phone number"
                                {...formik.getFieldProps('phone')}
                                className={`appearance-none block w-full px-3 py-3 border ${
                                    formik.touched.phone && formik.errors.phone
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm`}
                            />
                            {formik.touched.phone && formik.errors.phone && (
                                <p className="mt-2 text-sm text-red-600">{formik.errors.phone}</p>
                            )}
                        </div>
                    </div>

                    {/* Password Section */}
                    <div>
                        <label 
                            htmlFor="password" 
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Create a password"
                                {...formik.getFieldProps('password')}
                                className={`appearance-none block w-full px-3 py-3 border ${
                                    formik.touched.password && formik.errors.password
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm`}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="mt-2 text-sm text-red-600">{formik.errors.password}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label 
                            htmlFor="confirmPassword" 
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>
                        <div className="mt-1">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Confirm your password"
                                {...formik.getFieldProps('confirmPassword')}
                                className={`appearance-none block w-full px-3 py-3 border ${
                                    formik.touched.confirmPassword && formik.errors.confirmPassword
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm`}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                            I agree to the{' '}
                            <Link to="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
                            formik.isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {formik.isSubmitting ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating account...
                            </span>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </div>

                {/* Login Link */}
                <div className="text-center space-y-2">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign in to your account
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default SignupForm; 