import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUndo, FaEnvelope } from 'react-icons/fa';
import { SITE_CONTACT } from '../config/siteContact';
import Seo from '../components/Seo';
import { PAGE_SEO } from '../config/seo';

const SectionDivider = () => (
    <hr className="my-8 border-gray-200" aria-hidden="true" />
);

const RefundPolicyPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const seo = PAGE_SEO.refund;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-header pb-16">
            <Seo title={seo.title} description={seo.description} path={seo.path} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-4">
                        <FaUndo className="text-indigo-600 mr-2" />
                        <span className="text-sm font-medium text-indigo-700">Legal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Refund Policy</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Terms under which refunds may or may not be provided for ProtAcc services.
                    </p>
                </div>

                <article className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-gray-700 leading-relaxed">
                    <p className="mb-6">
                        Welcome to <strong>ProtAcc</strong>. At ProtAcc, we strive to provide high-quality
                        professional services related to taxation, compliance, accounting, registration, and
                        consultancy. This Refund Policy explains the terms under which refunds may or may not be
                        provided.
                    </p>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. General Policy</h2>
                        <p className="mb-4">
                            Due to the nature of professional and digital services, refunds are subject to the
                            stage of work completed and resources already utilized.
                        </p>
                        <p>
                            By purchasing any service from ProtAcc, you agree to this Refund Policy.
                        </p>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligible Refund Cases</h2>
                        <p className="mb-4">Refunds may be considered in the following situations:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Duplicate payment made by mistake</li>
                            <li>Payment deducted but service order not received</li>
                            <li>Service could not be initiated due to our inability</li>
                            <li>Cancellation request raised before work commencement</li>
                            <li>Technical/payment gateway errors</li>
                        </ul>
                        <p>
                            Approved refunds will generally be processed within 7–10 business days through the
                            original mode of payment.
                        </p>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Non-Refundable Cases</h2>
                        <p className="mb-4">Refunds shall not be provided in the following cases:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Work has already been initiated or completed</li>
                            <li>Government filing fees, challans, penalties, or statutory charges already paid</li>
                            <li>Delay caused due to incomplete information or non-submission of documents by the client</li>
                            <li>Rejection by government authorities due to incorrect information provided by the client</li>
                            <li>Change of mind after service initiation</li>
                            <li>Consultation or advisory services already delivered</li>
                            <li>Services completed as per agreed scope</li>
                        </ul>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Service-Specific Refund Terms</h2>

                        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">GST / ITR / TDS Filing</h3>
                        <ul className="list-disc pl-6 space-y-2 mb-6">
                            <li>Before filing submission: Eligible for partial/full refund depending on work completed</li>
                            <li>After filing submission: No refund</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Company / LLP / Firm Registration</h3>
                        <ul className="list-disc pl-6 space-y-2 mb-6">
                            <li>Before application filing: Partial refund possible</li>
                            <li>After application filed with authority: No refund on government fees</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Accounting &amp; Compliance Services</h3>
                        <ul className="list-disc pl-6 space-y-2 mb-6">
                            <li>Monthly services may be cancelled with prior notice</li>
                            <li>Refunds, if applicable, shall be calculated proportionately</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Consultation Services</h3>
                        <p>
                            Consultation fees are non-refundable once the session has been conducted.
                        </p>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cancellation Policy</h2>
                        <p className="mb-4">
                            Clients may request cancellation by writing to us through our official email mentioned
                            on the website.
                        </p>
                        <p className="mb-4">Cancellation requests will only be considered if:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Work has not substantially commenced, or</li>
                            <li>Government filing/application has not been submitted.</li>
                        </ul>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Refund Processing</h2>
                        <p className="mb-4">Once approved:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Refunds are processed within 7–10 working days</li>
                            <li>Refunds are credited via the original payment method</li>
                            <li>Payment gateway charges, if any, may be deducted</li>
                        </ul>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
                        <p className="mb-4">ProtAcc shall not be responsible for:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Delays caused by government departments/portals</li>
                            <li>Technical failures beyond our control</li>
                            <li>Rejections due to incorrect or incomplete client information</li>
                        </ul>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
                        <p>
                            We reserve the right to modify this Refund Policy at any time without prior notice.
                            Updated versions will be posted on this page.
                        </p>
                    </section>

                    <SectionDivider />

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
                        <p className="mb-4">For refund or cancellation related queries, contact:</p>
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

                    <p className="mt-10 pt-6 border-t border-gray-100 text-sm text-gray-500 italic">
                        Based on common professional-service refund structures used by Indian consultancy and
                        compliance firms.
                    </p>
                </article>
            </div>
        </div>
    );
};

export default RefundPolicyPage;
