import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaSpinner, FaTrash, FaEdit, FaSearch, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getAdminCoupons, createCoupon, updateCoupon, deleteCoupon, getServices, getServiceCategories } from '../../services/api';

const MODE_LABELS = {
    final: 'Discount off final payment',
    proportional: 'Split across booking & final',
    booking: 'Discount off booking payment',
};

const EMPTY_FORM = {
    code: '', description: '', discount_type: 'percentage', discount_value: '',
    max_discount_amount: '', min_order_amount: '', application_mode: 'final',
    usage_limit: '', per_user_limit: '', valid_from: '', valid_until: '', is_active: true, is_visible: false, show_on_homepage: false,
    applicable_category_ids: [], applicable_service_ids: [], scope: 'all',
};

const toLocalInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 16) : '');
const fmtMoney = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [filters, setFilters] = useState({ search: '', status: '', limit: 10 });
    const [page, setPage] = useState(1);
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [serviceSearch, setServiceSearch] = useState('');

    const load = async () => {
        try {
            setCoupons(await getAdminCoupons());
        } catch (e) {
            toast.error(typeof e === 'string' ? e : 'Failed to load coupons');
        }
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            await load();
            try {
                const [svc, cats] = await Promise.all([getServices(), getServiceCategories()]);
                setServices(Array.isArray(svc) ? svc : []);
                setCategories(Array.isArray(cats) ? cats : []);
            } catch (e) { /* non-critical */ }
            setLoading(false);
        })();
    }, []);

    const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setServiceSearch(''); setShowForm(true); };
    const openEdit = (c) => {
        setEditingId(c.id);
        setForm({
            code: c.code, description: c.description || '', discount_type: c.discount_type,
            discount_value: c.discount_value, max_discount_amount: c.max_discount_amount ?? '',
            min_order_amount: c.min_order_amount ?? '', application_mode: c.application_mode,
            usage_limit: c.usage_limit ?? '', per_user_limit: c.per_user_limit ?? '',
            valid_from: toLocalInput(c.valid_from), valid_until: toLocalInput(c.valid_until),
            is_active: c.is_active, is_visible: c.is_visible, show_on_homepage: c.show_on_homepage,
            applicable_category_ids: c.applicable_category_ids || [],
            applicable_service_ids: c.applicable_service_ids || [],
            scope: (c.applicable_category_ids || []).length > 0
                ? 'categories'
                : (c.applicable_service_ids || []).length > 0 ? 'services' : 'all',
        });
        setShowForm(true);
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.code.trim()) { toast.error('Coupon code is required'); return; }
        if (!form.discount_value || Number(form.discount_value) <= 0) { toast.error('Enter a discount value'); return; }
        const payload = {
            code: form.code.trim().toUpperCase(),
            description: form.description,
            discount_type: form.discount_type,
            discount_value: parseFloat(form.discount_value) || 0,
            max_discount_amount: form.max_discount_amount ? parseFloat(form.max_discount_amount) : null,
            min_order_amount: parseFloat(form.min_order_amount) || 0,
            application_mode: form.application_mode,
            usage_limit: form.usage_limit ? parseInt(form.usage_limit, 10) : null,
            per_user_limit: form.per_user_limit ? parseInt(form.per_user_limit, 10) : null,
            valid_from: form.valid_from ? new Date(form.valid_from).toISOString() : null,
            valid_until: form.valid_until ? new Date(form.valid_until).toISOString() : null,
            is_active: form.is_active,
            is_visible: form.is_visible,
            show_on_homepage: form.show_on_homepage,
            applicable_category_ids: form.scope === 'categories' ? form.applicable_category_ids : [],
            applicable_service_ids: form.scope === 'services' ? form.applicable_service_ids : [],
        };
        setSubmitting(true);
        try {
            if (editingId) await updateCoupon(editingId, payload);
            else await createCoupon(payload);
            toast.success(editingId ? 'Coupon updated' : 'Coupon created');
            setShowForm(false);
            setEditingId(null);
            setForm(EMPTY_FORM);
            load();
        } catch (err) {
            toast.error(typeof err === 'string' ? err : 'Failed to save coupon');
        } finally {
            setSubmitting(false);
        }
    };

    const toggleActive = async (c) => {
        try {
            await updateCoupon(c.id, {
                code: c.code, description: c.description, discount_type: c.discount_type,
                discount_value: c.discount_value, max_discount_amount: c.max_discount_amount,
                min_order_amount: c.min_order_amount, application_mode: c.application_mode,
                usage_limit: c.usage_limit, per_user_limit: c.per_user_limit,
                valid_from: c.valid_from, valid_until: c.valid_until, is_active: !c.is_active, is_visible: c.is_visible, show_on_homepage: c.show_on_homepage,
                applicable_category_ids: c.applicable_category_ids, applicable_service_ids: c.applicable_service_ids,
            });
            load();
        } catch (e) {
            toast.error(typeof e === 'string' ? e : 'Failed to update');
        }
    };

    const remove = async (c) => {
        if (!window.confirm(`Delete coupon ${c.code}?`)) return;
        try { await deleteCoupon(c.id); toast.success('Coupon deleted'); load(); }
        catch (e) { toast.error(typeof e === 'string' ? e : 'Failed to delete'); }
    };

    const filtered = useMemo(() => {
        const term = filters.search.trim().toLowerCase();
        return coupons.filter((c) => {
            if (filters.status === 'active' && !c.is_active) return false;
            if (filters.status === 'inactive' && c.is_active) return false;
            if (term && !`${c.code} ${c.description || ''}`.toLowerCase().includes(term)) return false;
            return true;
        });
    }, [coupons, filters]);

    const perPage = filters.limit;
    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const curPage = Math.min(page, totalPages);
    const paged = filtered.slice((curPage - 1) * perPage, curPage * perPage);

    const discountLabel = (c) => c.discount_type === 'percentage'
        ? `${c.discount_value}%${c.max_discount_amount ? ` (max ${fmtMoney(c.max_discount_amount)})` : ''}`
        : fmtMoney(c.discount_value);

    if (loading) {
        return <div className="flex items-center justify-center py-20"><FaSpinner className="animate-spin text-3xl text-indigo-600" /></div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Coupon Management</h2>
                    <p className="text-gray-600">Create and manage discount coupons</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <FaPlus /> Add Coupon
                </button>
            </div>

            {showForm && (
                <form onSubmit={submit} className="bg-white rounded-lg shadow-sm p-6 mb-6 space-y-4">
                    <h3 className="font-semibold text-gray-900">{editingId ? 'Edit coupon' : 'New coupon'}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                            <input value={form.code} onChange={(e) => setField('code', e.target.value.toUpperCase())} placeholder="LAUNCH20"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md uppercase focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (shown to you only)</label>
                            <input value={form.description} onChange={(e) => setField('description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount type</label>
                            <select value={form.discount_type} onChange={(e) => setField('discount_type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500">
                                <option value="percentage">Percentage (%)</option>
                                <option value="flat">Flat amount (₹)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Discount value {form.discount_type === 'percentage' ? '(%)' : '(₹)'}
                            </label>
                            <input type="number" value={form.discount_value} onChange={(e) => setField('discount_value', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        {form.discount_type === 'percentage' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max discount (₹, optional cap)</label>
                                <input type="number" value={form.max_discount_amount} onChange={(e) => setField('max_discount_amount', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum order amount (₹)</label>
                            <input type="number" value={form.min_order_amount} onChange={(e) => setField('min_order_amount', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">How the discount applies (two-stage payment)</label>
                            <select value={form.application_mode} onChange={(e) => setField('application_mode', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500">
                                <option value="final">{MODE_LABELS.final} — booking unchanged</option>
                                <option value="proportional">{MODE_LABELS.proportional}</option>
                                <option value="booking">{MODE_LABELS.booking}</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">The customer's total saving is the same in all modes; only how it splits between the booking and final payment changes.</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Applies to</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {[
                                    { v: 'all', label: 'All services' },
                                    { v: 'categories', label: 'Specific categories' },
                                    { v: 'services', label: 'Specific services' },
                                ].map((opt) => (
                                    <button
                                        type="button"
                                        key={opt.v}
                                        onClick={() => setField('scope', opt.v)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                            form.scope === opt.v
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            {form.scope === 'categories' && (
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((c) => {
                                        const sel = form.applicable_category_ids.includes(c.id);
                                        return (
                                            <button
                                                type="button"
                                                key={c.id}
                                                onClick={() => setField('applicable_category_ids', sel
                                                    ? form.applicable_category_ids.filter((id) => id !== c.id)
                                                    : [...form.applicable_category_ids, c.id])}
                                                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                                                    sel ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {sel ? '✓ ' : ''}{c.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {form.scope === 'services' && (
                                <div className="border border-gray-200 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2 gap-2">
                                        <input
                                            value={serviceSearch}
                                            onChange={(e) => setServiceSearch(e.target.value)}
                                            placeholder="Search services..."
                                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <span className="text-xs text-gray-500 whitespace-nowrap">{form.applicable_service_ids.length} selected</span>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto space-y-3">
                                        {categories.map((cat) => {
                                            const catServices = services.filter(
                                                (s) => s.category_id === cat.id &&
                                                    s.name.toLowerCase().includes(serviceSearch.trim().toLowerCase())
                                            );
                                            if (catServices.length === 0) return null;
                                            return (
                                                <div key={cat.id}>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{cat.name}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {catServices.map((s) => {
                                                            const sel = form.applicable_service_ids.includes(s.id);
                                                            return (
                                                                <button
                                                                    type="button"
                                                                    key={s.id}
                                                                    onClick={() => setField('applicable_service_ids', sel
                                                                        ? form.applicable_service_ids.filter((id) => id !== s.id)
                                                                        : [...form.applicable_service_ids, s.id])}
                                                                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                                                                        sel ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                                                    }`}
                                                                >
                                                                    {sel ? '✓ ' : ''}{s.name}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total usage limit (blank = unlimited)</label>
                            <input type="number" value={form.usage_limit} onChange={(e) => setField('usage_limit', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Per-user limit (blank = unlimited)</label>
                            <input type="number" value={form.per_user_limit} onChange={(e) => setField('per_user_limit', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valid from (optional)</label>
                            <input type="datetime-local" value={form.valid_from} onChange={(e) => setField('valid_from', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valid until (optional)</label>
                            <input type="datetime-local" value={form.valid_until} onChange={(e) => setField('valid_until', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input type="checkbox" checked={form.is_active} onChange={(e) => setField('is_active', e.target.checked)} />
                            Active
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input type="checkbox" checked={form.is_visible} onChange={(e) => setField('is_visible', e.target.checked)} />
                            Show on cart page (customers can see &amp; one-tap apply it)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input type="checkbox" checked={form.show_on_homepage} onChange={(e) => setField('show_on_homepage', e.target.checked)} />
                            Show as campaign banner on homepage
                        </label>
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" disabled={submitting} className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
                            {submitting ? <FaSpinner className="animate-spin" /> : null} {editingId ? 'Save changes' : 'Create coupon'}
                        </button>
                        <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-5 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                    </div>
                </form>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 max-w-md relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={filters.search} onChange={(e) => { setFilters((f) => ({ ...f, search: e.target.value })); setPage(1); }}
                            placeholder="Search code or description..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="flex items-center gap-3">
                        <select value={filters.status} onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); setPage(1); }}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <select value={filters.limit} onChange={(e) => { setFilters((f) => ({ ...f, limit: parseInt(e.target.value, 10) })); setPage(1); }}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                            <option value={10}>10 per page</option>
                            <option value={25}>25 per page</option>
                            <option value={50}>50 per page</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Code', 'Discount', 'Applies to', 'Min order', 'Usage', 'Validity', 'Status', 'Actions'].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paged.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{c.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{discountLabel(c)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{MODE_LABELS[c.application_mode]}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{c.min_order_amount ? fmtMoney(c.min_order_amount) : '—'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ''}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {c.valid_until ? `till ${new Date(c.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : 'No expiry'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                            {c.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => toggleActive(c)} title={c.is_active ? 'Deactivate' : 'Activate'} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg">
                                                {c.is_active ? <FaToggleOn className="text-green-600" /> : <FaToggleOff />}
                                            </button>
                                            <button onClick={() => openEdit(c)} title="Edit" className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg"><FaEdit /></button>
                                            <button onClick={() => remove(c)} title="Delete" className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg"><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        {coupons.length === 0 ? 'No coupons yet. Create your first one!' : 'No coupons match your filters.'}
                    </div>
                )}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                        <p className="text-sm text-gray-700">
                            Showing {(curPage - 1) * perPage + 1}–{Math.min(curPage * perPage, filtered.length)} of {filtered.length}
                        </p>
                        <div className="flex gap-2">
                            <button onClick={() => setPage(curPage - 1)} disabled={curPage <= 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                            <button onClick={() => setPage(curPage + 1)} disabled={curPage >= totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CouponManagement;
