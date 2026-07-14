import React, { useState, useEffect, useCallback } from 'react';
import {
    FaGoogleDrive,
    FaUpload,
    FaDownload,
    FaExternalLinkAlt,
    FaSpinner,
    FaFileAlt,
    FaInfoCircle,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import {
    getOrderDocuments,
    addOrderDocument,
    addAdminOrderDocument,
} from '../../services/api';
import { parseGoogleDriveUrl } from '../../utils/googleDrive';

const DocumentCard = ({ doc }) => {
    const drive = doc.drive || parseGoogleDriveUrl(doc.drive_url);
    const [showPreview, setShowPreview] = useState(false);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 bg-green-50 rounded-lg flex-shrink-0">
                        <FaGoogleDrive className="text-green-600 text-xl" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{doc.title}</h4>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {doc.document_type === 'user_upload' ? 'Submitted by you' : 'Delivered by Protacc'}
                            {doc.uploader && doc.document_type === 'admin_delivery' && (
                                <> · {doc.uploader.firstName} {doc.uploader.lastName}</>
                            )}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {new Date(doc.created_at).toLocaleString()}
                        </p>
                        {doc.notes && (
                            <p className="text-sm text-gray-600 mt-2">{doc.notes}</p>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                    {drive?.embedUrl && (
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
                        >
                            {showPreview ? 'Hide Preview' : 'View'}
                        </button>
                    )}
                    <a
                        href={drive?.viewUrl || doc.drive_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 inline-flex items-center gap-1"
                    >
                        <FaExternalLinkAlt className="text-xs" /> Open
                    </a>
                    {drive?.downloadUrl && !drive?.isFolder && (
                        <a
                            href={drive.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-900 inline-flex items-center gap-1"
                        >
                            <FaDownload className="text-xs" /> Download
                        </a>
                    )}
                </div>
            </div>
            {showPreview && drive?.embedUrl && (
                <div className="border-t border-gray-100 bg-gray-50 p-2">
                    <iframe
                        src={drive.embedUrl}
                        title={doc.title}
                        className="w-full rounded-lg bg-white"
                        style={{ minHeight: drive.isFolder ? '400px' : '480px' }}
                        allow="autoplay"
                    />
                    <p className="text-xs text-gray-500 px-2 py-2 flex items-center gap-1">
                        <FaInfoCircle />
                        If preview does not load, ensure the file is shared as &quot;Anyone with the link&quot; on Google Drive.
                    </p>
                </div>
            )}
        </div>
    );
};

const AddDocumentForm = ({ onSubmit, submitting, submitLabel, placeholderTitle }) => {
    const [title, setTitle] = useState('');
    const [driveUrl, setDriveUrl] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!parseGoogleDriveUrl(driveUrl)) {
            toast.error('Please enter a valid Google Drive link');
            return;
        }
        onSubmit({ title, driveUrl, notes }, () => {
            setTitle('');
            setDriveUrl('');
            setNotes('');
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-4">
            <div className="flex items-start gap-2 text-sm text-indigo-800">
                <FaInfoCircle className="mt-0.5 flex-shrink-0" />
                <p>
                    Share your Google Drive link with &quot;Anyone with the link&quot; access so we can view and download your files.
                </p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document name</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={placeholderTitle || 'e.g. PAN Card, Bank Statement'}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Drive link</label>
                <input
                    type="url"
                    value={driveUrl}
                    onChange={(e) => setDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Any additional details..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
                {submitting ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                {submitting ? 'Submitting...' : submitLabel}
            </button>
        </form>
    );
};

const OrderDocumentsSection = ({ orderId, orderStatus, isAdmin = false, onDocumentsChange }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const loadDocuments = useCallback(async () => {
        if (!orderId) return;
        try {
            setLoading(true);
            const data = await getOrderDocuments(orderId, isAdmin);
            setDocuments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load documents:', error);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    }, [orderId, isAdmin]);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    const userUploads = documents.filter((d) => d.document_type === 'user_upload');
    const adminDeliveries = documents.filter((d) => d.document_type === 'admin_delivery');

    const canUserUpload = !isAdmin && ['documents_required', 'documents_received', 'processing'].includes(orderStatus);
    const canAdminUpload = isAdmin && [
        'documents_received', 'in_progress', 'processing',
        'pending_final_payment', 'full_payment_received', 'completed',
    ].includes(orderStatus);

    const handleUserSubmit = async (payload, resetForm) => {
        try {
            setSubmitting(true);
            await addOrderDocument(orderId, payload);
            toast.success('Document link submitted successfully');
            resetForm();
            await loadDocuments();
            onDocumentsChange?.();
        } catch (error) {
            toast.error(error.toString());
        } finally {
            setSubmitting(false);
        }
    };

    const handleAdminSubmit = async (payload, resetForm) => {
        try {
            setSubmitting(true);
            await addAdminOrderDocument(orderId, payload);
            toast.success('Deliverable shared with customer');
            resetForm();
            await loadDocuments();
            onDocumentsChange?.();
        } catch (error) {
            toast.error(error.toString());
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {canUserUpload && (
                <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaUpload className="text-orange-500" />
                        Submit Required Documents
                    </h4>
                    {orderStatus === 'documents_required' && (
                        <p className="text-sm text-orange-700 bg-orange-50 border border-orange-100 rounded-lg p-3 mb-4">
                            Protacc has requested documents for this order. Please share your Google Drive links below.
                        </p>
                    )}
                    <AddDocumentForm
                        onSubmit={handleUserSubmit}
                        submitting={submitting}
                        submitLabel="Submit Document Link"
                        placeholderTitle="e.g. PAN Card, Aadhaar, Bank Statement"
                    />
                </div>
            )}

            {canAdminUpload && (
                <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaFileAlt className="text-green-600" />
                        Share Processed Documents (ITR / Deliverables)
                    </h4>
                    <AddDocumentForm
                        onSubmit={handleAdminSubmit}
                        submitting={submitting}
                        submitLabel="Share with Customer"
                        placeholderTitle="e.g. ITR Acknowledgement, Filed Return"
                    />
                </div>
            )}

            {userUploads.length > 0 && (
                <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">
                        {isAdmin ? 'Customer Submitted Documents' : 'Your Submitted Documents'}
                        <span className="ml-2 text-sm font-normal text-gray-500">({userUploads.length})</span>
                    </h4>
                    <div className="space-y-4">
                        {userUploads.map((doc) => (
                            <DocumentCard key={doc.id} doc={doc} />
                        ))}
                    </div>
                </div>
            )}

            {adminDeliveries.length > 0 && (
                <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">
                        {isAdmin ? 'Deliverables Shared with Customer' : 'Documents from Protacc'}
                        <span className="ml-2 text-sm font-normal text-gray-500">({adminDeliveries.length})</span>
                    </h4>
                    <div className="space-y-4">
                        {adminDeliveries.map((doc) => (
                            <DocumentCard key={doc.id} doc={doc} />
                        ))}
                    </div>
                </div>
            )}

            {documents.length === 0 && !canUserUpload && !canAdminUpload && (
                <p className="text-sm text-gray-500 text-center py-6">
                    No documents have been shared for this order yet.
                </p>
            )}
        </div>
    );
};

export default OrderDocumentsSection;
