import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Movers<span className="text-gray-700">Packers</span>
        </Link>

        {/* Nav Links */}
        <nav className="space-x-6 text-lg">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/services" className="text-gray-700 hover:text-blue-600">Services</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
        </nav>

        {/* Buttons */}
        <div className="space-x-3">
          <Link to="/login" className="px-4 py-2 border rounded-lg hover:bg-gray-100">
            Login
          </Link>

          <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
