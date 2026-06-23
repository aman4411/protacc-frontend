import React, { useState, useEffect } from 'react';
import { FaPlus, FaSpinner, FaTrash, FaEdit, FaExternalLinkAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getAdminPosts, createPost, updatePost, deletePost } from '../../services/api';
import RichTextEditor from '../../components/admin/RichTextEditor';

const CATEGORIES = ['Announcements', 'Amendments', 'GST', 'Income Tax', 'TDS', 'Company / ROC', 'Guides', 'Other'];
const EMPTY = { title: '', slug: '', category: 'Announcements', cover_image: '', excerpt: '', content: '', tags: '', status: 'draft' };
const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');

const BlogManagement = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // 'list' | 'form'
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState(EMPTY);

    const load = async () => {
        try {
            setPosts(await getAdminPosts());
        } catch (e) {
            toast.error(typeof e === 'string' ? e : 'Failed to load posts');
        }
    };

    useEffect(() => {
        (async () => { setLoading(true); await load(); setLoading(false); })();
    }, []);

    const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const openCreate = () => { setEditingId(null); setForm(EMPTY); setView('form'); };
    const openEdit = (p) => {
        setEditingId(p.id);
        setForm({
            title: p.title, slug: p.slug || '', category: p.category || 'Other',
            cover_image: p.cover_image || '', excerpt: p.excerpt || '', content: p.content || '',
            tags: (p.tags || []).join(', '), status: p.status || 'draft',
        });
        setView('form');
    };

    const save = async (statusOverride) => {
        if (!form.title.trim()) { toast.error('Enter a title'); return; }
        const status = statusOverride || form.status;
        const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
        const payload = { ...form, status, tags };
        setSubmitting(true);
        try {
            if (editingId) await updatePost(editingId, payload);
            else await createPost(payload);
            toast.success(status === 'published' ? 'Post published' : 'Draft saved');
            setView('list');
            setEditingId(null);
            setForm(EMPTY);
            load();
        } catch (err) {
            toast.error(typeof err === 'string' ? err : 'Failed to save post');
        } finally {
            setSubmitting(false);
        }
    };

    const remove = async (p) => {
        if (!window.confirm(`Delete "${p.title}"?`)) return;
        try { await deletePost(p.id); toast.success('Post deleted'); load(); }
        catch (e) { toast.error(typeof e === 'string' ? e : 'Failed to delete'); }
    };

    if (loading) {
        return <div className="flex items-center justify-center py-20"><FaSpinner className="animate-spin text-3xl text-indigo-600" /></div>;
    }

    if (view === 'form') {
        return (
            <div className="p-6 max-w-4xl">
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">{editingId ? 'Edit post' : 'New post'}</h2>
                    <button onClick={() => { setView('list'); setEditingId(null); }} className="text-gray-600 hover:text-gray-800">Cancel</button>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input value={form.title} onChange={(e) => setField('title', e.target.value)} placeholder="e.g. GST rate changes effective July 2026"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select value={form.category} onChange={(e) => setField('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500">
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL slug (optional)</label>
                            <input value={form.slug} onChange={(e) => setField('slug', e.target.value)} placeholder="auto-generated from title"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover image URL (optional)</label>
                        <input value={form.cover_image} onChange={(e) => setField('cover_image', e.target.value)} placeholder="https://..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated — powers related articles)</label>
                        <input value={form.tags} onChange={(e) => setField('tags', e.target.value)} placeholder="gst, return filing, deadlines"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                        <p className="mt-1 text-xs text-gray-400">Tags are matched between posts to suggest related reading. Lowercased automatically.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (short summary, shown in listings & search)</label>
                        <textarea value={form.excerpt} onChange={(e) => setField('excerpt', e.target.value)} rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <RichTextEditor value={form.content} onChange={(html) => setField('content', html)} />
                    </div>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <button onClick={() => save('published')} disabled={submitting}
                            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
                            {submitting ? <FaSpinner className="animate-spin" /> : null} Publish
                        </button>
                        <button onClick={() => save('draft')} disabled={submitting}
                            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                            Save as draft
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Articles</h2>
                    <p className="text-gray-600">{posts.length} post{posts.length === 1 ? '' : 's'}</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <FaPlus /> New Post
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Title', 'Category', 'Status', 'Published', 'Actions'].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {posts.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 max-w-md"><span className="line-clamp-1">{p.title}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.category || '—'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                            {p.status === 'published' ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.status === 'published' ? fmtDate(p.published_at) : '—'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {p.status === 'published' && (
                                                <a href={`/articles/${p.slug}`} target="_blank" rel="noopener noreferrer" title="View" className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg"><FaExternalLinkAlt /></a>
                                            )}
                                            <button onClick={() => openEdit(p)} title="Edit" className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg"><FaEdit /></button>
                                            <button onClick={() => remove(p)} title="Delete" className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg"><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {posts.length === 0 && <div className="text-center py-12 text-gray-500">No posts yet. Write your first article!</div>}
            </div>
        </div>
    );
};

export default BlogManagement;
