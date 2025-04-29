import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Homepage() {
  return (
    <div>
      <Header />
      <section className="text-center py-20 bg-gray-100">
        <h2 className="text-4xl font-bold mb-4">Simplify Your Tax & Accounting</h2>
        <p className="text-lg mb-6 max-w-xl mx-auto">
          Get expert services like GST filing, ITR preparation, business registration and more — all online and hassle-free.
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Get Started
        </button>
      </section>
      <Footer />
    </div>
  );
}
