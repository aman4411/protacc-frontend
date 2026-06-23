import React, { useState, useEffect } from 'react';
import { FaPlus, FaSpinner, FaTrash, FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getAdminDeadlines, createDeadline, updateDeadline, deleteDeadline } from '../../services/api';

const CATEGORIES = ['GST', 'Income Tax', 'TDS', 'ROC / MCA', 'Other'];
const CATEGORY_COLORS = {
    'GST': 'bg-emerald-100 text-emerald-700',
    'Income Tax': 'bg-blue-100 text-blue-700',
    'TDS': 'bg-amber-100 text-amber-700',
    'ROC / MCA': 'bg-purple-100 text-purple-700',
    'Other': 'bg-gray-100 text-gray-700',
};

const EMPTY = { title: '', category: 'GST', due_date: '', description: '', is_active: true };
const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const toDateInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : '');

const DeadlineManagement = () => {
    const [deadlines, setDeadlines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState(EMPTY);

    const load = async () => {
        try {
            setDeadlines(await getAdminDeadlines());
        } catch (e) {
            toast.error(typeof e === 'string' ? e : 'Failed to load deadlines');
        }
    };

    useEffect(() => {
        (async () => { setLoading(true); await load(); setLoading(false); })();
    }, []);

    const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const openCreate = () => { setEditingId(null); setForm(EMPTY); setShowForm(true); };
    const openEdit = (d) => {
        setEditingId(d.id);
        setForm({ title: d.title, category: d.category || 'Other', due_date: toDateInput(d.due_date), description: d.description || '', is_active: d.is_active });
        setShowForm(true);
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) { toast.error('Enter a title'); return; }
        if (!form.due_date) { toast.error('Pick a due date'); return; }
        const payload = {
            title: form.title.trim(),
            category: form.category,
            due_date: new Date(form.due_date).toISOString(),
            description: form.description,
            is_active: form.is_active,
        };
        setSubmitting(true);
        try {
            if (editingId) await updateDeadline(editingId, payload);
            else await createDeadline(payload);
            toast.success(editingId ? 'Deadline updated' : 'Deadline added');
            setShowForm(false);
            setEditingId(null);
            setForm(EMPTY);
            load();
        } catch (err) {
            toast.error(typeof err === 'string' ? err : 'Failed to save deadline');
        } finally {
            setSubmitting(false);
        }
    };

    const toggleActive = async (d) => {
        try {
            await updateDeadline(d.id, {
                title: d.title, category: d.category, due_date: d.due_date,
                description: d.description, is_active: !d.is_active,
            });
            load();
        } catch (e) {
            toast.error(typeof e === 'string' ? e : 'Failed to update');
        }
    };

    const remove = async (d) => {
        if (!window.confirm(`Delete "${d.title}"?`)) return;
        try { await deleteDeadline(d.id); toast.success('Deadline deleted'); load(); }
        catch (e) { toast.error(typeof e === 'string' ? e : 'Failed to delete'); }
    };

    const isPast = (iso) => new Date(iso) < new Date(new Date().toDateString());

    if (loading) {
        return <div className="flex items-center justify-center py-20"><FaSpinner className="animate-spin text-3xl text-indigo-600" /></div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Deadline Management</h2>
                    <p className="text-gray-600">Tax &amp; compliance due dates shown on the homepage</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <FaPlus /> Add Deadline
                </button>
            </div>

            {showForm && (
                <form onSubmit={submit} className="bg-white rounded-lg shadow-sm p-6 mb-6 space-y-4">
                    <h3 className="font-semibold text-gray-900">{editingId ? 'Edit deadline' : 'New deadline'}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input value={form.title} onChange={(e) => setField('title', e.target.value)} placeholder="e.g. GSTR-3B (Monthly)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select value={form.category} onChange={(e) => setField('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500">
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due date</label>
                            <input type="date" value={form.due_date} onChange={(e) => setField('due_date', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                            <input value={form.description} onChange={(e) => setField('description', e.target.value)} placeholder="e.g. For taxpayers with turnover above ₹5 Cr"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={form.is_active} onChange={(e) => setField('is_active', e.target.checked)} /> Active (visible on homepage)
                    </label>
                    <div className="flex gap-3">
                        <button type="submit" disabled={submitting} className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
                            {submitting ? <FaSpinner className="animate-spin" /> : null} {editingId ? 'Save changes' : 'Add deadline'}
                        </button>
                        <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-5 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Due date', 'Title', 'Category', 'Status', 'Actions'].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {deadlines.map((d) => (
                                <tr key={d.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`font-medium ${isPast(d.due_date) ? 'text-gray-400' : 'text-gray-900'}`}>{fmtDate(d.due_date)}</span>
                                        {isPast(d.due_date) && <span className="ml-2 text-xs text-gray-400">(past)</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{d.title}</div>
                                        {d.description && <div className="text-sm text-gray-500">{d.description}</div>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[d.category] || CATEGORY_COLORS.Other}`}>{d.category || 'Other'}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${d.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                            {d.is_active ? 'Active' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => toggleActive(d)} title={d.is_active ? 'Hide' : 'Show'} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg">
                                                {d.is_active ? <FaToggleOn className="text-green-600" /> : <FaToggleOff />}
                                            </button>
                                            <button onClick={() => openEdit(d)} title="Edit" className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg"><FaEdit /></button>
                                            <button onClick={() => remove(d)} title="Delete" className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg"><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {deadlines.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No deadlines yet. Add tax/compliance due dates to show them on the homepage.</div>
                )}
            </div>
        </div>
    );
};

export default DeadlineManagement;
