import { Link } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt, FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="relative bg-indigo-600 text-white">
            {/* Top Section */}
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 px-6 py-12">
                {/* Contact Info */}
                <div className="md:col-span-1 space-y-4">
                    <h3 className="text-lg font-bold mb-6 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-white/30">Contact Us</h3>
                    <div className="flex items-center gap-3 group">
                        <FaEnvelope className="text-lg group-hover:text-indigo-300 transition-colors" />
                        <a href="mailto:info@protacc.in" className="hover:text-indigo-300 transition-colors">
                            info@protacc.in
                        </a>
                    </div>
                    <div className="flex items-center gap-3 group">
                        <FaPhoneAlt className="text-lg group-hover:text-indigo-300 transition-colors" />
                        <a href="tel:+917206071581" className="hover:text-indigo-300 transition-colors">
                            +91 7206071581
                        </a>
                    </div>
                </div>

                {/* Useful Links */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold mb-6 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-white/30">Useful Links</h3>
                    <ul className="space-y-2">
                        <li><Link to="/" className="hover:text-indigo-300 transition-colors block">Home</Link></li>
                        <li><Link to="/about" className="hover:text-indigo-300 transition-colors block">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-indigo-300 transition-colors block">Contact Us</Link></li>
                        <li><Link to="/privacy-policy" className="hover:text-indigo-300 transition-colors block">Privacy Policy</Link></li>
                        <li><Link to="/terms" className="hover:text-indigo-300 transition-colors block">Terms & Conditions</Link></li>
                        <li><Link to="/disclaimer" className="hover:text-indigo-300 transition-colors block">Disclaimer</Link></li>
                        <li><Link to="/account" className="hover:text-indigo-300 transition-colors block">My Account</Link></li>
                        <li><Link to="/track-order" className="hover:text-indigo-300 transition-colors block">Track Order</Link></li>
                        <li><Link to="/pay-now" className="hover:text-indigo-300 transition-colors block">Pay Now</Link></li>
                    </ul>
                </div>

                {/* Start a Business */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold mb-6 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-white/30">Start a Business</h3>
                    <ul className="space-y-2">
                        <li><Link to="/services/proprietorship" className="hover:text-indigo-300 transition-colors block">Proprietorship Registration</Link></li>
                        <li><Link to="/services/partnership" className="hover:text-indigo-300 transition-colors block">Partnership Firm Registration</Link></li>
                        <li><Link to="/services/opc" className="hover:text-indigo-300 transition-colors block">One Person Company</Link></li>
                        <li><Link to="/services/private-limited" className="hover:text-indigo-300 transition-colors block">Private Limited Company</Link></li>
                        <li><Link to="/services/llp" className="hover:text-indigo-300 transition-colors block">Limited Liability Partnership</Link></li>
                        <li><Link to="/services/nidhi" className="hover:text-indigo-300 transition-colors block">Nidhi Company</Link></li>
                        <li><Link to="/services/producer" className="hover:text-indigo-300 transition-colors block">Producer Company</Link></li>
                        <li><Link to="/services/ngo" className="hover:text-indigo-300 transition-colors block">Section 8 Company/NGO</Link></li>
                    </ul>
                </div>

                {/* GST */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold mb-6 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-white/30">GST</h3>
                    <ul className="space-y-2">
                        <li><Link to="/services/gst-registration" className="hover:text-indigo-300 transition-colors block">GST Registration in India</Link></li>
                        <li><Link to="/services/gst-filing" className="hover:text-indigo-300 transition-colors block">GST Filing (Monthly/Quarterly)</Link></li>
                        <li><Link to="/services/gst-annual" className="hover:text-indigo-300 transition-colors block">GST Annual Filing</Link></li>
                    </ul>
                </div>

                {/* Licenses & Registrations */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold mb-6 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-white/30">Licences & Registrations</h3>
                    <ul className="space-y-2">
                        <li><Link to="/services/digital-signature" className="hover:text-indigo-300 transition-colors block">Digital Signature</Link></li>
                        <li><Link to="/services/msme" className="hover:text-indigo-300 transition-colors block">MSME Registration</Link></li>
                        <li><Link to="/services/import-export" className="hover:text-indigo-300 transition-colors block">Import Export Code</Link></li>
                        <li><Link to="/services/trademark" className="hover:text-indigo-300 transition-colors block">Trademark Registration</Link></li>
                        <li><Link to="/services/pan" className="hover:text-indigo-300 transition-colors block">PAN Application</Link></li>
                        <li><Link to="/services/tan" className="hover:text-indigo-300 transition-colors block">TAN Application</Link></li>
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
                href="https://wa.me/917206071581"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 z-50"
            >
                <FaWhatsapp className="text-2xl" />
            </a>
        </footer>
    );
}