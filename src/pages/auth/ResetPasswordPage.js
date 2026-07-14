import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resetPassword, validateResetToken } from '../../services/api';

const validationSchema = Yup.object({
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || '';
    const [validating, setValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            if (!token) {
                setValidating(false);
                setTokenValid(false);
                return;
            }
            try {
                await validateResetToken(token);
                setTokenValid(true);
            } catch {
                setTokenValid(false);
            } finally {
                setValidating(false);
            }
        };
        checkToken();
    }, [token]);

    const formik = useFormik({
        initialValues: { password: '', confirmPassword: '' },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await resetPassword({
                    token,
                    password: values.password,
                    confirmPassword: values.confirmPassword,
                });
                toast.success('Password updated! Please log in with your new password.');
                navigate('/login', { replace: true });
            } catch (error) {
                toast.error(error.toString());
            } finally {
                setSubmitting(false);
            }
        },
    });

    if (validating) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-header">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-header px-4">
                <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h1>
                    <p className="text-gray-600 mb-6">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <Link
                        to="/forgot-password"
                        className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                    >
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex pt-header">
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900">Set New Password</h1>
                        <p className="text-sm text-gray-600 mt-2">
                            Choose a strong password for your Protacc account
                        </p>
                    </div>

                    <div className="bg-white py-8 px-8 shadow-2xl rounded-xl">
                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    {...formik.getFieldProps('password')}
                                    className={`mt-1 block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                                        formik.touched.password && formik.errors.password
                                            ? 'border-red-300'
                                            : 'border-gray-300'
                                    }`}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    {...formik.getFieldProps('confirmPassword')}
                                    className={`mt-1 block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                                        formik.touched.confirmPassword && formik.errors.confirmPassword
                                            ? 'border-red-300'
                                            : 'border-gray-300'
                                    }`}
                                />
                                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60"
                            >
                                {formik.isSubmitting ? 'Updating...' : 'Update Password'}
                            </button>

                            <p className="text-center text-sm text-gray-600">
                                <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                    Back to Login
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
