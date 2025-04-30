import { Link } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt, FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="bg-[#0c5b91] text-white relative">
            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 px-6 py-10">
                {/* Contact Info */}
                <div className="md:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <FaEnvelope /> <span>info@finlogiconline.in</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaPhoneAlt /> <span>+91 7206071581</span>
                    </div>
                </div>

                {/* Useful Links */}
                <div>
                    <h3 className="text-lg font-bold mb-2">Useful Links</h3>
                    <ul className="space-y-1 text-sm">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms & Conditions</Link></li>
                        <li><Link to="/disclaimer">Disclaimer</Link></li>
                        <li><Link to="/account">My Account</Link></li>
                        <li><Link to="/track-order">Track Order</Link></li>
                        <li><Link to="/pay-now">Pay Now</Link></li>
                    </ul>
                </div>

                {/* Start a Business */}
                <div>
                    <h3 className="text-lg font-bold mb-2">Start a Business</h3>
                    <ul className="space-y-1 text-sm">
                        <li><Link to="/services/proprietorship">Proprietorship Registration</Link></li>
                        <li><Link to="/services/partnership">Partnership Firm Registration</Link></li>
                        <li><Link to="/services/opc">One Person Company</Link></li>
                        <li><Link to="/services/private-limited">Private Limited Company</Link></li>
                        <li><Link to="/services/llp">Limited Liability Partnership</Link></li>
                        <li><Link to="/services/nidhi">Nidhi Company</Link></li>
                        <li><Link to="/services/producer">Producer Company</Link></li>
                        <li><Link to="/services/ngo">Section 8 Company/NGO</Link></li>
                    </ul>
                </div>

                {/* GST */}
                <div>
                    <h3 className="text-lg font-bold mb-2">GST</h3>
                    <ul className="space-y-1 text-sm">
                        <li><Link to="/services/gst-registration">GST Registration in India</Link></li>
                        <li><Link to="/services/gst-filing">GST Filing (Monthly/Quarterly)</Link></li>
                        <li><Link to="/services/gst-annual">GST Annual Filing</Link></li>
                    </ul>
                </div>

                {/* Licenses & Registrations */}
                <div>
                    <h3 className="text-lg font-bold mb-2">Licences & Registrations</h3>
                    <ul className="space-y-1 text-sm">
                        <li><Link to="/services/digital-signature">Digital Signature</Link></li>
                        <li><Link to="/services/msme">MSME Registration</Link></li>
                        <li><Link to="/services/import-export">Import Export Code</Link></li>
                        <li><Link to="/services/trademark">Trademark Registration</Link></li>
                        <li><Link to="/services/pan">PAN Application</Link></li>
                        <li><Link to="/services/tan">TAN Application</Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="bg-[#092e4e] py-4 px-6 text-center text-xs md:text-sm">
                <p className="mb-2">
                    © 2020 Finlogic Online All Rights Reserved | FinLogic employs/hires CAs/CS/other professionals but not a licensed CA/CS/other kind of professional firm.
                </p>
                <div className="flex justify-center space-x-4 mt-2">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-all"><FaFacebookF /></a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-all"><FaInstagram /></a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-all"><FaYoutube /></a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-all"><FaLinkedinIn /></a>
                </div>
            </div>

            {/* WhatsApp Floating Button */}
            <a
                href="https://wa.me/917206071581"
                className="fixed bottom-4 right-4 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all"
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaWhatsapp className="text-2xl" />
            </a>
        </footer>
    );
}
