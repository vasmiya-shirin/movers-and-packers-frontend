import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      
      {/* ---------- HERO SECTION ---------- */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-28 bg-white dark:bg-gray-800 shadow-sm">
        
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight"
        >
          Smart Movers & Packers Service
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mt-4"
        >
          Fast, reliable, and secure moving services. Book trusted professionals and move stress-free.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex gap-4 mt-8"
        >
          <Link
            to="/services"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md text-lg"
          >
            Explore Services
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md text-lg"
          >
            Login
          </Link>
        </motion.div>
      </section>

      {/* ---------- FEATURES SECTION ---------- */}
      <section className="px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why Choose Us?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          
          {/* Card 1 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl text-center border border-gray-200 dark:border-gray-700"
          >
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="font-semibold text-xl dark:text-white">Professional Movers</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Verified and trained providers who ensure safe shifting.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl text-center border border-gray-200 dark:border-gray-700"
          >
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="font-semibold text-xl dark:text-white">Secure Packaging</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              High-quality packing materials to protect your belongings.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl text-center border border-gray-200 dark:border-gray-700"
          >
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="font-semibold text-xl dark:text-white">On-Time Delivery</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Track your move and enjoy fast deliveries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ---------- CTA SECTION ---------- */}
      <section className="py-20 bg-blue-600 dark:bg-blue-700 text-white text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold"
        >
          Ready to Get Started?
        </motion.h2>

        <p className="mt-3 text-lg opacity-90">
          Book trusted movers in minutes.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link
            to="/register"
            className="mt-6 inline-block bg-white text-blue-600 dark:bg-gray-100 dark:text-blue-800 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-200 shadow-md"
          >
            Create Account
          </Link>
        </motion.div>
      </section>

    </div>
  );
}

