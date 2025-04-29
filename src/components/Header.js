import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-blue-700 text-white shadow-md">
      <Link to="/" className="text-2xl font-bold">Protacc</Link>
      <nav className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/services" className="hover:underline">Services</Link>
        <Link to="/contact" className="hover:underline">Contact</Link>
      </nav>
    </header>
  );
}
