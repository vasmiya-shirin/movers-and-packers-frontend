const Unauthorized = () => {
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <h1 className="text-3xl font-bold text-red-600">Unauthorized</h1>
      <p className="text-gray-600 mt-2">You do not have permission to view this page.</p>
      <a href="/" className="text-blue-600 mt-4 underline">Go Home</a>
    </div>
  );
};

export default Unauthorized;
