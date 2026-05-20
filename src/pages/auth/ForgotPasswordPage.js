import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { forgotPassword } from '../../services/api';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
});

const ForgotPasswordPage = () => {
    const [submitted, setSubmitted] = React.useState(false);

    const formik = useFormik({
        initialValues: { email: '' },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await forgotPassword(values.email);
                setSubmitted(true);
                toast.success('Check your email for the reset link');
            } catch (error) {
                toast.error(error.toString());
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen bg-white flex pt-header">
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900">Forgot Password</h1>
                        <p className="text-sm text-gray-600 mt-2">
                            Enter your email and we will send you a link to reset your password
                        </p>
                    </div>

                    <div className="bg-white py-8 px-8 shadow-2xl rounded-xl">
                        {submitted ? (
                            <div className="text-center space-y-4">
                                <p className="text-gray-700">
                                    If an account exists for <strong>{formik.values.email}</strong>, you will receive a password reset link shortly.
                                </p>
                                <p className="text-sm text-gray-500">
                                    The link expires in 1 hour. Check your spam folder if you do not see the email.
                                </p>
                                <Link
                                    to="/login"
                                    className="inline-block mt-4 text-indigo-600 hover:text-indigo-500 font-medium"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={formik.handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        {...formik.getFieldProps('email')}
                                        className={`mt-1 block w-full px-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 ${
                                            formik.touched.email && formik.errors.email
                                                ? 'border-red-300'
                                                : 'border-gray-300'
                                        }`}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60"
                                >
                                    {formik.isSubmitting ? 'Sending...' : 'Send Reset Link'}
                                </button>

                                <p className="text-center text-sm text-gray-600">
                                    <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                        Back to Login
                                    </Link>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
