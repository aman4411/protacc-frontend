import React, { useState, useEffect, useCallback } from 'react';
import { FaSpinner, FaTrash, FaSyncAlt, FaDatabase, FaBolt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getCacheStats, purgeCache } from '../../services/api';

// Friendly labels for the cache families the backend reports (key prefix before ':').
const FAMILY_LABELS = {
    services: 'Services & Categories',
    posts: 'Articles',
    coupons: 'Coupons',
    deadlines: 'Deadlines',
    reviews: 'Reviews',
    settings: 'Public Settings',
};

const familyLabel = (key) => FAMILY_LABELS[key] || key;

const CacheManagement = () => {
    const [stats, setStats] = useState({ total: 0, families: {} });
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(''); // which purge is in-flight ('' | 'all' | prefix)

    const load = useCallback(async () => {
        try {
            const data = await getCacheStats();
            setStats({ total: data.total || 0, families: data.families || {} });
        } catch (e) {
            toast.error(typeof e === 'string' ? e : 'Failed to load cache stats');
        }
    }, []);

    useEffect(() => {
        (async () => { setLoading(true); await load(); setLoading(false); })();
    }, [load]);

    const purge = async (prefix, label) => {
        setBusy(prefix || 'all');
        try {
            const res = await purgeCache(prefix);
            toast.success(`Cleared ${res.purged} cached ${res.purged === 1 ? 'entry' : 'entries'} from ${label}.`);
            await load();
        } catch (e) {
            toast.error(typeof e === 'string' ? e : 'Failed to purge cache');
        } finally {
            setBusy('');
        }
    };

    const families = Object.entries(stats.families).sort((a, b) => b[1] - a[1]);

    return (
        <div className="p-4 sm:p-6 max-w-4xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FaDatabase className="text-indigo-600" /> Cache Management
                </h1>
                <button
                    onClick={load}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                    <FaSyncAlt /> Refresh
                </button>
            </div>
            <p className="text-gray-500 text-sm mb-6">
                Public pages (services, articles, coupons, etc.) are served from an in-memory cache to reduce database load.
                Edits refresh the cache automatically; use this only to force an immediate refresh.
            </p>

            {loading ? (
                <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-3xl text-indigo-600" /></div>
            ) : (
                <>
                    {/* Total + clear all */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="text-sm text-gray-500">Cached entries</div>
                            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                        </div>
                        <button
                            onClick={() => purge('', 'the entire cache')}
                            disabled={busy !== '' || stats.total === 0}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {busy === 'all' ? <FaSpinner className="animate-spin" /> : <FaBolt />} Clear all cache
                        </button>
                    </div>

                    {/* Per-family */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-100 text-sm font-semibold text-gray-700">By section</div>
                        {families.length === 0 ? (
                            <div className="px-5 py-10 text-center text-gray-400 text-sm">Cache is empty — nothing to clear.</div>
                        ) : (
                            families.map(([key, count]) => (
                                <div key={key} className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-50 last:border-0">
                                    <div>
                                        <div className="font-medium text-gray-900">{familyLabel(key)}</div>
                                        <div className="text-xs text-gray-400">{count} cached {count === 1 ? 'entry' : 'entries'}</div>
                                    </div>
                                    <button
                                        onClick={() => purge(`${key}:`, familyLabel(key))}
                                        disabled={busy !== ''}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {busy === `${key}:` ? <FaSpinner className="animate-spin" /> : <FaTrash />} Clear
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default CacheManagement;
