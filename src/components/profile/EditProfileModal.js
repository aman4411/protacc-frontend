import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaTimes, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import { updateProfile } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required').min(2, 'At least 2 characters'),
    lastName: Yup.string().required('Last name is required').min(2, 'At least 2 characters'),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required'),
});

const EditProfileModal = ({ isOpen, onClose }) => {
    const { user, updateUser } = useAuth();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phone: user?.phone || '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const updatedUser = await updateProfile(values);
                updateUser(updatedUser);
                toast.success('Profile updated successfully');
                onClose();
            } catch (error) {
                toast.error(error.toString());
            } finally {
                setSubmitting(false);
            }
        },
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={formik.handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <FaEnvelope className="mr-2 text-gray-400" />
                            Email (cannot be changed)
                        </label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <FaUser className="mr-2 text-gray-400" />
                                First Name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                {...formik.getFieldProps('firstName')}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                    formik.touched.firstName && formik.errors.firstName ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.firstName}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="lastName" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <FaUser className="mr-2 text-gray-400" />
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                {...formik.getFieldProps('lastName')}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                    formik.touched.lastName && formik.errors.lastName ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {formik.touched.lastName && formik.errors.lastName && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.lastName}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <FaPhone className="mr-2 text-gray-400" />
                            Phone Number
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            maxLength={10}
                            {...formik.getFieldProps('phone')}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                formik.touched.phone && formik.errors.phone ? 'border-red-300' : 'border-gray-300'
                            }`}
                        />
                        {formik.touched.phone && formik.errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.phone}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60"
                        >
                            {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
