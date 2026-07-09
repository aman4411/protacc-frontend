import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { FaSpinner, FaArrowLeft, FaArrowRight, FaTag, FaRegNewspaper } from 'react-icons/fa';
import { getBlogPost, getRelatedPosts } from '../services/api';
import Seo from '../components/Seo';
import { blogPostingSchema } from '../utils/structuredData';
import { sizedImage } from '../utils/images';

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '');
const formatShortDate = (iso) => (iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

const BlogPostPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        setRelated([]);
        getBlogPost(slug)
            .then(setPost)
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
        getRelatedPosts(slug, 3).then(setRelated).catch(() => {});
    }, [slug]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center pt-header"><FaSpinner className="animate-spin text-4xl text-indigo-600" /></div>;
    }

    if (notFound || !post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-header gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Article not found</h1>
                <button onClick={() => navigate('/articles')} className="text-indigo-600 font-semibold">← Back to articles</button>
            </div>
        );
    }

    const safeHtml = DOMPurify.sanitize(post.content || '');

    return (
        <div className="min-h-screen bg-white pt-header">
            <Seo
                title={`${post.title} | ProtAcc`}
                description={post.excerpt || post.title}
                path={`/articles/${post.slug}`}
                type="article"
                image={post.cover_image || undefined}
                jsonLd={blogPostingSchema(post)}
                jsonLdId="protacc-blogposting-jsonld"
            />

            <article className="container mx-auto px-4 py-12 max-w-3xl">
                <div className="mb-6">
                    <Link to="/articles" className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800">
                        <FaArrowLeft /> Back to articles
                    </Link>
                </div>

                {post.category && (
                    <div className="mb-4">
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">{post.category}</span>
                    </div>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">{post.title}</h1>
                <p className="text-gray-500 mb-8">{formatDate(post.published_at || post.created_at)}</p>

                {post.cover_image && (
                    <img src={sizedImage(post.cover_image, 1000)} alt={post.title} decoding="async" className="w-full rounded-2xl mb-8 object-cover" />
                )}

                {/* eslint-disable-next-line react/no-danger */}
                <div className="blog-content" dangerouslySetInnerHTML={{ __html: safeHtml }} />

                {post.tags && post.tags.length > 0 && (
                    <div className="mt-10 flex flex-wrap items-center gap-2">
                        <FaTag className="text-gray-500" />
                        {post.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 capitalize">{tag}</span>
                        ))}
                    </div>
                )}

                <div className="mt-12 border-t border-gray-100 pt-8 text-center">
                    <p className="text-gray-700 mb-4 font-medium">Need help with this? Our Chartered Accountants can handle it for you.</p>
                    <Link to="/consultancy" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-xl transition-all">
                        Book a free consultation
                    </Link>
                </div>
            </article>

            {related.length > 0 && (
                <section className="bg-gray-50 border-t border-gray-100 py-14">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Related articles</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {related.map((rp) => (
                                <Link
                                    key={rp.id}
                                    to={`/articles/${rp.slug}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col"
                                >
                                    {rp.cover_image ? (
                                        <img src={sizedImage(rp.cover_image, 400)} alt={rp.title} loading="lazy" decoding="async" className="h-36 w-full object-cover" />
                                    ) : (
                                        <div className="h-36 w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                            <FaRegNewspaper className="text-4xl text-white/70" />
                                        </div>
                                    )}
                                    <div className="p-5 flex-grow flex flex-col">
                                        {rp.category && (
                                            <span className="inline-block w-fit px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 mb-2">{rp.category}</span>
                                        )}
                                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">{rp.title}</h3>
                                        {rp.excerpt && <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">{rp.excerpt}</p>}
                                        <div className="mt-auto flex items-center justify-between text-sm">
                                            <span className="text-gray-500">{formatShortDate(rp.published_at || rp.created_at)}</span>
                                            <span className="text-indigo-600 font-semibold flex items-center gap-1">Read <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default BlogPostPage;
