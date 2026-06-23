import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFileContract, FaEnvelope } from 'react-icons/fa';
import { SITE_CONTACT } from '../config/siteContact';
import Seo from '../components/Seo';
import { PAGE_SEO } from '../config/seo';

const SectionDivider = () => (
    <hr className="my-8 border-gray-200" aria-hidden="true" />
);

const TermsOfServicePage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const seo = PAGE_SEO.terms;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-header pb-16">
            <Seo title={seo.title} description={seo.description} path={seo.path} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-4">
                        <FaFileContract className="text-indigo-600 mr-2" />
                        <span className="text-sm font-medium text-indigo-700">Legal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Terms governing your access to and use of the ProtAcc website and services.
                    </p>
                </div>

                <article className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-gray-700 leading-relaxed">
                    <p className="mb-4">
                        Welcome to <strong>ProtAcc</strong>. These Terms of Service (&ldquo;Terms&rdquo;) govern your
                        access to and use of our website and services. By using this website, you agree to comply with
                        these Terms.
                    </p>
                    <p className="mb-6">
                        If you do not agree with any part of these Terms, please do not use our website or services.
                    </p>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. About Us</h2>
                        <p className="mb-4">
                            ProtAcc provides professional services including but not limited to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Income Tax Return (ITR) Filing</li>
                            <li>GST Registration &amp; Compliance</li>
                            <li>TDS Filing</li>
                            <li>Company / LLP Registration</li>
                            <li>Accounting &amp; Bookkeeping</li>
                            <li>Tax Consultancy &amp; Financial Advisory</li>
                            <li>Other compliance-related services</li>
                        </ul>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Responsibilities</h2>
                        <p className="mb-4">By using our services, you agree that:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>All information and documents provided by you are accurate and genuine</li>
                            <li>You will provide required documents within reasonable timelines</li>
                            <li>You will not use the website for unlawful activities</li>
                            <li>You are responsible for maintaining confidentiality of your credentials and communications</li>
                        </ul>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Service Scope</h2>
                        <p className="mb-4">Our services are based on:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Information and documents provided by the client</li>
                            <li>Applicable laws, rules, and regulations as on the date of service</li>
                        </ul>
                        <p className="mb-4">We reserve the right to refuse service in cases involving:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Fraudulent information</li>
                            <li>Illegal activities</li>
                            <li>Non-cooperation by the client</li>
                            <li>Abuse or misconduct</li>
                        </ul>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Fees &amp; Payments</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Service fees shall be communicated before commencement of work</li>
                            <li>Certain services may require advance payment</li>
                            <li>Government fees, taxes, penalties, and statutory charges are separate unless specifically mentioned</li>
                            <li>Payments once made are subject to our Refund Policy</li>
                        </ul>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Refund &amp; Cancellation</h2>
                        <p>
                            Refunds and cancellations shall be governed as per our{' '}
                            <Link to="/refund-policy" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                Refund Policy
                            </Link>{' '}
                            available on the website.
                        </p>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Timelines &amp; Delays</h2>
                        <p className="mb-4">
                            While we strive to complete services within reasonable timelines, we are not responsible
                            for delays caused due to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Government portal/server issues</li>
                            <li>Delay in client response or document submission</li>
                            <li>Third-party verification processes</li>
                            <li>Technical disruptions beyond our control</li>
                        </ul>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
                        <p className="mb-4">All website content including:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Logos</li>
                            <li>Branding</li>
                            <li>Text</li>
                            <li>Graphics</li>
                            <li>Designs</li>
                            <li>Documents</li>
                            <li>Content structure</li>
                        </ul>
                        <p>
                            are the intellectual property of ProtAcc and may not be copied, reproduced, or distributed
                            without prior written permission.
                        </p>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
                        <p className="mb-4">ProtAcc shall not be liable for:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Any indirect or consequential loss</li>
                            <li>Rejection of applications due to incorrect client information</li>
                            <li>Financial losses arising from delayed submissions caused by client-side delays</li>
                            <li>Actions taken by government authorities</li>
                        </ul>
                        <p>
                            Our total liability, if any, shall be limited to the professional fee paid for the
                            concerned service.
                        </p>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Links</h2>
                        <p>
                            Our website may contain links to third-party websites or portals. We do not control or take
                            responsibility for their content, privacy policies, or practices.
                        </p>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Privacy</h2>
                        <p>
                            By using our services, you also agree to our{' '}
                            <Link to="/privacy-policy" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                Privacy Policy
                            </Link>{' '}
                            regarding collection and usage of your information.
                        </p>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Modification of Terms</h2>
                        <p>
                            We reserve the right to update or modify these Terms at any time without prior notice.
                            Updated Terms will be published on this page.
                        </p>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law &amp; Jurisdiction</h2>
                        <p className="mb-4">These Terms shall be governed by the laws of India.</p>
                        <p>
                            Any disputes arising shall be subject to the jurisdiction of courts located in Delhi, India.
                        </p>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
                        <p className="mb-4">For any queries regarding these Terms, contact:</p>
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

export default TermsOfServicePage;
