import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaEnvelope } from 'react-icons/fa';
import { SITE_CONTACT } from '../config/siteContact';
import Seo from '../components/Seo';
import { PAGE_SEO } from '../config/seo';

const SectionDivider = () => (
    <hr className="my-8 border-gray-200" aria-hidden="true" />
);

const PrivacyPolicyPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const seo = PAGE_SEO.privacy;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-header pb-16">
            <Seo title={seo.title} description={seo.description} path={seo.path} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-4">
                        <FaShieldAlt className="text-indigo-600 mr-2" />
                        <span className="text-sm font-medium text-indigo-700">Legal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        How we collect, use, store, and protect your information when you use ProtAcc.
                    </p>
                </div>

                <article className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-gray-700 leading-relaxed">
                    <p className="mb-4">
                        Welcome to <strong>ProtAcc</strong>. Your privacy is important to us. This Privacy Policy
                        explains how we collect, use, store, and protect your information when you use our website
                        and services.
                    </p>
                    <p className="mb-6">
                        By accessing or using our website, you agree to the terms of this Privacy Policy.
                    </p>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                        <p className="mb-4">We may collect the following types of information:</p>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
                        <ul className="list-disc pl-6 space-y-2 mb-6">
                            <li>Name</li>
                            <li>Mobile number</li>
                            <li>Email address</li>
                            <li>PAN details</li>
                            <li>GST details</li>
                            <li>Address</li>
                            <li>Financial and business-related documents</li>
                            <li>Any information submitted through forms or consultations</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Information</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>IP address</li>
                            <li>Browser type</li>
                            <li>Device information</li>
                            <li>Pages visited</li>
                            <li>Cookies and usage data</li>
                        </ul>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                        <p className="mb-4">We use your information for purposes including:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Providing taxation, accounting, and compliance services</li>
                            <li>Processing registrations and filings</li>
                            <li>Communicating regarding your service requests</li>
                            <li>Improving website functionality and user experience</li>
                            <li>Maintaining internal records</li>
                            <li>Complying with legal and regulatory obligations</li>
                        </ul>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Sharing of Information</h2>
                        <p className="mb-4">We do not sell or rent your personal information.</p>
                        <p className="mb-4">However, information may be shared with:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Government authorities and portals for statutory filings</li>
                            <li>Payment gateway providers</li>
                            <li>Trusted third-party service providers assisting in operations</li>
                            <li>Legal authorities where required under law</li>
                        </ul>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                        <p className="mb-4">
                            We implement reasonable security measures to protect your personal information from:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Unauthorized access</li>
                            <li>Misuse</li>
                            <li>Disclosure</li>
                            <li>Alteration</li>
                            <li>Loss or destruction</li>
                        </ul>
                        <p>
                            However, no online platform can guarantee complete security of data transmission over
                            the internet.
                        </p>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies</h2>
                        <p className="mb-4">ProtAcc may use cookies and similar technologies to:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Improve user experience</li>
                            <li>Analyze website traffic</li>
                            <li>Remember user preferences</li>
                        </ul>
                        <p>
                            Users may disable cookies through browser settings, though some features may not function
                            properly.
                        </p>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
                        <p className="mb-4">We retain client information and documents:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>For as long as necessary to provide services</li>
                            <li>To comply with legal, tax, and regulatory obligations</li>
                            <li>For record-keeping and dispute resolution purposes</li>
                        </ul>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Websites</h2>
                        <p>
                            Our website may contain links to external websites or portals. We are not responsible for
                            the privacy practices or content of such third-party websites.
                        </p>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. User Rights</h2>
                        <p className="mb-4">You may request:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Access to your personal information</li>
                            <li>Correction of inaccurate information</li>
                            <li>Deletion of data where legally permissible</li>
                        </ul>
                        <p>
                            Requests may be sent through our official contact email{' '}
                            <a href={SITE_CONTACT.emailMailto} className="text-indigo-600 hover:text-indigo-800">
                                {SITE_CONTACT.email}
                            </a>
                            .
                        </p>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children&rsquo;s Privacy</h2>
                        <p>
                            Our services are not directed toward individuals below 18 years of age. We do not
                            knowingly collect personal data from minors.
                        </p>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
                        <p>
                            We reserve the right to modify or update this Privacy Policy at any time. Updated versions
                            will be posted on this page.
                        </p>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
                        <p className="mb-4">For any questions regarding this Privacy Policy, contact:</p>
                        <ul className="space-y-3">
                            <li>
                                <span className="font-medium text-gray-900">Website:</span>{' '}
                                <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                    ProtAcc
                                </Link>
                            </li>
                            <li className="flex items-center gap-2">
                                <FaEnvelope className="text-indigo-600" />
                                <span className="font-medium text-gray-900">Email:</span>{' '}
                                <a
                                    href={SITE_CONTACT.emailMailto}
                                    className="text-indigo-600 hover:text-indigo-800"
                                >
                                    {SITE_CONTACT.email}
                                </a>
                            </li>
                        </ul>
                    </section>
                </article>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
