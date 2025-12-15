export default function About() {
  return (
    <div className="min-h-screen px-6 py-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          About MoversPackers
        </h1>

        <p className="text-lg leading-relaxed mb-8 text-center">
          <span className="font-semibold text-blue-600">MoversPackers</span> is
          a reliable and technology-driven platform designed to simplify
          relocation. We connect customers with verified moving professionals to
          ensure a seamless, secure, and stress-free moving experience.
        </p>

        <div className="grid md:grid-cols-2 gap-10 mt-12">
          {/* Mission */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
            <p className="text-lg leading-relaxed">
              Our mission is to transform the moving industry by providing a
              transparent, efficient, and customer-focused platform. We aim to
              empower users with trusted service providers while maintaining
              high standards of professionalism and reliability.
            </p>
          </div>

          {/* Vision */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
            <p className="text-lg leading-relaxed">
              We envision becoming a leading digital marketplace for relocation
              services, recognized for quality, trust, and innovation across
              regions.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-4">
            Why Choose MoversPackers?
          </h2>
          <ul className="grid md:grid-cols-2 gap-4 text-lg list-disc ml-6">
            <li>Verified and background-checked service providers</li>
            <li>Transparent pricing with no hidden costs</li>
            <li>Professional packing and safe item handling</li>
            <li>Timely service with real-time tracking support</li>
            <li>Dedicated customer support throughout the move</li>
            <li>Secure platform with trusted payment processing</li>
          </ul>
        </div>

        {/* Closing */}
        <div className="mt-14 text-center">
          <p className="text-lg leading-relaxed">
            At{" "}
            <span className="font-semibold text-blue-600">MoversPackers</span>,
            we are committed to delivering excellence at every step of your
            relocation journey — from booking to final delivery.
          </p>
        </div>
      </div>
    </div>
  );
}
