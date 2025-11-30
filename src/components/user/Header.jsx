import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Movers<span className="text-gray-700 dark:text-gray-300">Packers</span>
        </Link>

        {/* Nav Links */}
        <nav className="space-x-6 text-lg">
          <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            Home
          </Link>
          <Link to="/services" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            Services
          </Link>
          <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            Contact
          </Link>
        </nav>

        {/* Buttons */}
        <div className="space-x-3 flex items-center">

          <ThemeToggle />

          <Link
            to="/login"
            className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
