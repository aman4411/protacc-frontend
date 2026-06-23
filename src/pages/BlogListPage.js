import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSpinner, FaArrowRight, FaRegNewspaper, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getBlogPosts, getArticleCategories } from '../services/api';
import Seo from '../components/Seo';
import { PAGE_SEO } from '../config/seo';

const PAGE_SIZE = 9;
const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

const BlogListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory = searchParams.get('category') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);

    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const seo = PAGE_SEO.articles;

    // Categories that have published articles (for the filter pills).
    useEffect(() => {
        getArticleCategories().then(setCategories).catch(() => {});
    }, []);

    // Server-side paginated + category-filtered fetch.
    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        getBlogPosts(page, PAGE_SIZE, selectedCategory)
            .then((data) => {
                setPosts(data.posts || []);
                setPagination(data.pagination || { current_page: 1, total_pages: 1, total: 0 });
            })
            .catch(() => setPosts([]))
            .finally(() => setLoading(false));
    }, [page, selectedCategory]);

    const selectCategory = (cat) => {
        const next = {};
        if (cat) next.category = cat; // omitting page resets to 1
        setSearchParams(next);
    };

    const goToPage = (p) => {
        const next = {};
        if (selectedCategory) next.category = selectedCategory;
        if (p > 1) next.page = String(p);
        setSearchParams(next);
    };

    const totalPages = pagination.total_pages || 1;
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="min-h-screen bg-gray-50 pt-header">
            <Seo title={seo.title} description={seo.description} keywords={seo.keywords} path={seo.path} />

            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">ProtAcc Articles</h1>
                    <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
                        Latest amendments, announcements and expert insights on GST, income tax & compliance.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                {/* Category filter pills */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        <button
                            onClick={() => selectCategory('')}
                            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                                !selectedCategory ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                            }`}
                        >
                            All Articles
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => selectCategory(cat)}
                                className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                                    selectedCategory === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-4xl text-indigo-600" /></div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <FaRegNewspaper className="mx-auto text-5xl text-gray-300 mb-4" />
                        <p>{selectedCategory ? `No articles in "${selectedCategory}" yet.` : 'No articles yet. Check back soon!'}</p>
                        {selectedCategory && (
                            <button onClick={() => selectCategory('')} className="mt-4 text-indigo-600 font-semibold">View all articles</button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    to={`/articles/${post.slug}`}
                                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border border-gray-100 flex flex-col"
                                >
                                    {post.cover_image ? (
                                        <img src={post.cover_image} alt={post.title} className="h-48 w-full object-cover" />
                                    ) : (
                                        <div className="h-48 w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                            <FaRegNewspaper className="text-5xl text-white/70" />
                                        </div>
                                    )}
                                    <div className="p-6 flex-grow flex flex-col">
                                        {post.category && (
                                            <span className="inline-block w-fit px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 mb-3">{post.category}</span>
                                        )}
                                        <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">{post.title}</h2>
                                        {post.excerpt && <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>}
                                        <div className="mt-auto flex items-center justify-between text-sm">
                                            <span className="text-gray-400">{formatDate(post.published_at || post.created_at)}</span>
                                            <span className="text-indigo-600 font-semibold flex items-center gap-1">Read <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-14">
                                <button
                                    onClick={() => goToPage(page - 1)}
                                    disabled={page <= 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 shadow-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                    aria-label="Previous page"
                                >
                                    <FaChevronLeft />
                                </button>
                                {pageNumbers.map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => goToPage(p)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition-all ${
                                            p === page ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => goToPage(page + 1)}
                                    disabled={page >= totalPages}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 shadow-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                    aria-label="Next page"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogListPage;
