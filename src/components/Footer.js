import { Link } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt, FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="relative bg-indigo-600 text-white">
            {/* Top Section */}
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6 py-12">
                {/* Contact Info & Quick Links */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold mb-6 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-white/30">Contact Us</h3>
                    <div className="flex items-center gap-3 group">
                        <FaEnvelope className="text-lg group-hover:text-indigo-300 transition-colors" />
                        <a href="mailto:info@protacc.in" className="hover:text-indigo-300 transition-colors">
                            info@protacc.in
                        </a>
                    </div>
                    <div className="flex items-center gap-3 group">
                        <FaPhoneAlt className="text-lg group-hover:text-indigo-300 transition-colors" />
                        <a href="tel:+919817889933" className="hover:text-indigo-300 transition-colors">
                            +91 9817889933
                        </a>
                    </div>
                    
                    {/* Quick Links */}
                    <div className="pt-4">
                        <h4 className="text-md font-semibold mb-4 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-white/30">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-indigo-300 transition-colors block">Home</Link></li>
                            <li><Link to="/about" className="hover:text-indigo-300 transition-colors block">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-indigo-300 transition-colors block">Contact Us</Link></li>
                            <li><Link to="/track-order" className="hover:text-indigo-300 transition-colors block">Track Order</Link></li>
                            <li><Link to="/privacy-policy" className="hover:text-indigo-300 transition-colors block">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Business & Registration Services */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold mb-6 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-white/30">Business & Registration</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/services/proprietorship-registration" className="hover:text-indigo-300 transition-colors block">Proprietorship Registration</Link></li>
                        <li><Link to="/services/partnership-registration" className="hover:text-indigo-300 transition-colors block">Partnership Registration</Link></li>
                        <li><Link to="/services/private-limited-company" className="hover:text-indigo-300 transition-colors block">Private Limited Company</Link></li>
                        <li><Link to="/services/llp-registration" className="hover:text-indigo-300 transition-colors block">LLP Registration</Link></li>
                        <li><Link to="/services/fssai-registration" className="hover:text-indigo-300 transition-colors block">FSSAI Registration</Link></li>
                        <li><Link to="/services/trademark-registration" className="hover:text-indigo-300 transition-colors block">Trademark Registration</Link></li>
                        <li><Link to="/services/import-export-code" className="hover:text-indigo-300 transition-colors block">Import Export Code</Link></li>
                        <li><Link to="/services/udyam-msme-registration" className="hover:text-indigo-300 transition-colors block">MSME Registration</Link></li>
                        <li><Link to="/services/digital-signature" className="hover:text-indigo-300 transition-colors block">Digital Signature</Link></li>
                    </ul>
                </div>

                {/* Tax Services */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold mb-6 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-white/30">Tax Services</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/services/gst-registration" className="hover:text-indigo-300 transition-colors block">GST Registration</Link></li>
                        <li><Link to="/services/gstr-1-filing" className="hover:text-indigo-300 transition-colors block">GSTR 1 Filing</Link></li>
                        <li><Link to="/services/gstr-3b-filing" className="hover:text-indigo-300 transition-colors block">GSTR 3B Filing</Link></li>
                        <li><Link to="/services/pan-registration" className="hover:text-indigo-300 transition-colors block">PAN Registration</Link></li>
                        <li><Link to="/services/itr-1-filing" className="hover:text-indigo-300 transition-colors block">ITR 1 Filing</Link></li>
                        <li><Link to="/services/itr-2-filing" className="hover:text-indigo-300 transition-colors block">ITR 2 Filing</Link></li>
                        <li><Link to="/services/itr-3-filing" className="hover:text-indigo-300 transition-colors block">ITR 3 Filing</Link></li>
                        <li><Link to="/services/tds-return-filing" className="hover:text-indigo-300 transition-colors block">TDS Return Filing</Link></li>
                        <li><Link to="/services/gst-notice-handling" className="hover:text-indigo-300 transition-colors block">Tax Notice Handling</Link></li>
                    </ul>
                </div>

                {/* Compliance & Additional Services */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold mb-6 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-white/30">Compliance & Services</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/services/company-compliances" className="hover:text-indigo-300 transition-colors block">Company Compliances</Link></li>
                        <li><Link to="/services/llp-compliances" className="hover:text-indigo-300 transition-colors block">LLP Compliances</Link></li>
                        <li><Link to="/services/fssai-return-filing" className="hover:text-indigo-300 transition-colors block">FSSAI Return Filing</Link></li>
                        <li><Link to="/services/consultancy" className="hover:text-indigo-300 transition-colors block">Business Consultancy</Link></li>
                        <li><Link to="/services/project-reports" className="hover:text-indigo-300 transition-colors block">Project Reports</Link></li>
                        <li><Link to="/services/bookkeeping" className="hover:text-indigo-300 transition-colors block">Bookkeeping Services</Link></li>
                        <li><Link to="/services/cma-data" className="hover:text-indigo-300 transition-colors block">CMA Data Preparation</Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="bg-indigo-700 py-6 px-6">
                <div className="container mx-auto">
                    <p className="text-center text-sm md:text-base text-white/90 mb-4">
                        © 2024 Protacc All Rights Reserved | Protacc employs/hires CAs/CS/other professionals but not a licensed CA/CS/other kind of professional firm.
                    </p>
                    <div className="flex justify-center items-center space-x-6">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                           className="text-white/90 hover:text-indigo-300 transition-colors transform hover:scale-110">
                            <FaFacebookF className="text-xl" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                           className="text-white/90 hover:text-indigo-300 transition-colors transform hover:scale-110">
                            <FaInstagram className="text-xl" />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" 
                           className="text-white/90 hover:text-indigo-300 transition-colors transform hover:scale-110">
                            <FaYoutube className="text-xl" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                           className="text-white/90 hover:text-indigo-300 transition-colors transform hover:scale-110">
                            <FaLinkedinIn className="text-xl" />
                        </a>
                    </div>
                </div>
            </div>

            {/* WhatsApp Floating Button */}
            <a
                href="https://wa.me/919817889933"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 z-50"
            >
                <FaWhatsapp className="text-2xl" />
            </a>
        </footer>
    );
}