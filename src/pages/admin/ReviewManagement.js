import React, { useState, useEffect, useMemo } from 'react';
import {
    FaStar, FaTrash, FaEye, FaEyeSlash, FaPlus, FaSpinner,
    FaSearch, FaChevronLeft, FaChevronRight, FaTimes,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import {
    getAdminReviews,
    deleteAdminReview,
    updateAdminReviewStatus,
    adminCreateReview,
    getServices,
} from '../../services/api';

const StarRow = ({ value, onChange, size = 'text-sm' }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
            <button
                type="button"
                key={s}
                onClick={onChange ? () => onChange(s) : undefined}
                className={`${onChange ? 'text-lg cursor-pointer' : size} focus:outline-none`}
                disabled={!onChange}
                aria-label={`${s} star`}
            >
                <FaStar className={s <= value ? 'text-yellow-400' : 'text-gray-300'} />
            </button>
        ))}
    </div>
);

const DEFAULT_FILTERS = { search: '', status: '', rating: '', limit: 10 };

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ service_id: '', reviewer_name: '', rating: 0, comment: '' });
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState(null);

    const loadReviews = async () => {
        try {
            const data = await getAdminReviews();
            setReviews(data);
        } catch (e) {
            toast.error(typeof e === 'string' ? e : 'Failed to load reviews');
        }
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            await loadReviews();
            try {
                const svc = await getServices();
                setServices(Array.isArray(svc) ? svc : []);
            } catch (e) { /* non-critical */ }
            setLoading(false);
        })();
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters((f) => ({ ...f, [key]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters(DEFAULT_FILTERS);
        setCurrentPage(1);
    };

    // Client-side filtering.
    const filtered = useMemo(() => {
        const term = filters.search.trim().toLowerCase();
        return reviews.filter((r) => {
            if (filters.status && r.status !== filters.status) return false;
            if (filters.rating && String(r.rating) !== String(filters.rating)) return false;
            if (term) {
                const haystack = `${r.reviewer_name || ''} ${r.service_name || ''} ${r.comment || ''}`.toLowerCase();
                if (!haystack.includes(term)) return false;
            }
            return true;
        });
    }, [reviews, filters]);

    const perPage = filters.limit;
    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const page = Math.min(currentPage, totalPages);
    const paged = filtered.slice((page - 1) * perPage, page * perPage);

    const handleToggleStatus = async (review) => {
        const next = review.status === 'hidden' ? 'published' : 'hidden';
        try {
            await updateAdminReviewStatus(review.id, next);
            toast.success(next === 'hidden' ? 'Review hidden' : 'Review published');
            loadReviews();
        } catch (e) {
            toast.error(typeof e === 'string' ? e : 'Failed to update review');
        }
    };

    const handleDelete = async (review) => {
        if (!window.confirm('Delete this review permanently?')) return;
        try {
            await deleteAdminReview(review.id);
            toast.success('Review deleted');
            loadReviews();
        } catch (e) {
            toast.error(typeof e === 'string' ? e : 'Failed to delete review');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.service_id) { toast.error('Select a service'); return; }
        if (form.rating < 1) { toast.error('Select a rating'); return; }
        if (!form.reviewer_name.trim()) { toast.error('Enter a reviewer name'); return; }
        setSubmitting(true);
        try {
            await adminCreateReview({
                serviceId: parseInt(form.service_id, 10),
                rating: form.rating,
                comment: form.comment,
                reviewerName: form.reviewer_name.trim(),
            });
            toast.success('Review added');
            setForm({ service_id: '', reviewer_name: '', rating: 0, comment: '' });
            setShowForm(false);
            loadReviews();
        } catch (err) {
            toast.error(typeof err === 'string' ? err : 'Failed to add review');
        } finally {
            setSubmitting(false);
        }
    };

    const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        if (totalPages <= 5) return i + 1;
        if (page <= 3) return i + 1;
        if (page >= totalPages - 2) return totalPages - 4 + i;
        return page - 2 + i;
    });

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Review Management</h2>
                    <p className="text-gray-600">Moderate customer reviews and publish your own</p>
                </div>
                <button
                    onClick={() => setShowForm((s) => !s)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <FaPlus /> Add Review
                </button>
            </div>

            {/* Add review form */}
            {showForm && (
                <form onSubmit={handleCreate} className="bg-white rounded-lg shadow-sm p-6 mb-6 space-y-4">
                    <h3 className="font-semibold text-gray-900">Add a review</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                            <select
                                value={form.service_id}
                                onChange={(e) => setForm((f) => ({ ...f, service_id: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Select a service…</option>
                                {services.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer name</label>
                            <input
                                type="text"
                                value={form.reviewer_name}
                                onChange={(e) => setForm((f) => ({ ...f, reviewer_name: e.target.value }))}
                                placeholder="e.g. Rahul S."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <StarRow value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                        <textarea
                            value={form.comment}
                            onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {submitting ? <FaSpinner className="animate-spin" /> : null} Publish Review
                    </button>
                </form>
            )}

            {/* Filters Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by reviewer, service, or comment..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">All Status</option>
                            <option value="published">Published</option>
                            <option value="hidden">Hidden</option>
                        </select>
                        <select
                            value={filters.rating}
                            onChange={(e) => handleFilterChange('rating', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">All Ratings</option>
                            {[5, 4, 3, 2, 1].map((r) => (
                                <option key={r} value={r}>{r} Star{r === 1 ? '' : 's'}</option>
                            ))}
                        </select>
                        <select
                            value={filters.limit}
                            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value, 10))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={25}>25 per page</option>
                            <option value={50}>50 per page</option>
                        </select>
                        <button onClick={clearFilters} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                            Clear All
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <FaSpinner className="animate-spin text-2xl text-indigo-600" />
                        <span className="ml-2 text-gray-600">Loading reviews...</span>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px] divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paged.map((review) => (
                                        <tr key={review.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                {review.reviewer_name || 'Customer'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">
                                                {review.service_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StarRow value={review.rating} />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                                                {review.comment ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelected(review)}
                                                        title="View full review"
                                                        className="text-left hover:text-indigo-600"
                                                    >
                                                        <span className="line-clamp-2">{review.comment}</span>
                                                        <span className="text-indigo-600 text-xs font-medium">View</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    review.status === 'hidden'
                                                        ? 'bg-gray-200 text-gray-600'
                                                        : 'bg-green-100 text-green-700'
                                                }`}>
                                                    {review.status === 'hidden' ? 'Hidden' : 'Published'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleToggleStatus(review)}
                                                        title={review.status === 'hidden' ? 'Publish' : 'Hide'}
                                                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg"
                                                    >
                                                        {review.status === 'hidden' ? <FaEye /> : <FaEyeSlash />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(review)}
                                                        title="Delete"
                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{(page - 1) * perPage + 1}</span> to{' '}
                                        <span className="font-medium">{Math.min(page * perPage, filtered.length)}</span> of{' '}
                                        <span className="font-medium">{filtered.length}</span> results
                                    </p>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => setCurrentPage(page - 1)}
                                            disabled={page <= 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaChevronLeft />
                                        </button>
                                        {pageNumbers.map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setCurrentPage(p)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    p === page
                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setCurrentPage(page + 1)}
                                            disabled={page >= totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaChevronRight />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {filtered.length === 0 && (
                            <div className="text-center py-12">
                                <FaStar className="mx-auto text-4xl text-gray-300 mb-4" />
                                <p className="text-gray-500">
                                    {reviews.length === 0 ? 'No reviews yet.' : 'No reviews match your filters.'}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Full review modal */}
            {selected && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{selected.reviewer_name || 'Customer'}</h3>
                                <p className="text-sm text-indigo-600">{selected.service_name}</p>
                            </div>
                            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 p-1" aria-label="Close">
                                <FaTimes />
                            </button>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <StarRow value={selected.rating} />
                            <span className="text-sm text-gray-500">
                                {new Date(selected.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                selected.status === 'hidden' ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'
                            }`}>
                                {selected.status === 'hidden' ? 'Hidden' : 'Published'}
                            </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.comment || '—'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewManagement;
