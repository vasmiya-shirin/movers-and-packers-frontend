export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-lg">© {new Date().getFullYear()} Movers & Packers</p>
        <p className="text-sm mt-1">
          Safe, Fast & Reliable Relocation Services
        </p>
      </div>
    </footer>
  );
}
