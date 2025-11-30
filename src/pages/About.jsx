export default function About() {
  return (
    <div className="min-h-screen px-6 py-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <p className="text-lg leading-relaxed mb-6">
          Welcome to <span className="font-semibold text-blue-600">MoversPackers</span>,
          your trusted partner for reliable and hassle-free moving services.
          Our goal is to make your relocation experience smooth, safe, and stress-free.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Our Mission</h2>
        <p className="text-lg leading-relaxed mb-6">
          We aim to connect clients with professional service providers who deliver quality
          packing, moving, and logistics support at affordable prices.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Why Choose Us?</h2>
        <ul className="list-disc ml-6 text-lg space-y-2">
          <li>Verified and trusted service providers</li>
          <li>Affordable and transparent pricing</li>
          <li>Fast, reliable, and professional service</li>
          <li>Secure handling of your valuable items</li>
        </ul>
      </div>
    </div>
  );
}
