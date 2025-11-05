import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-blue-700 text-white p-4 flex justify-between items-center sticky top-0">
      <div className="font-bold text-xl">MyStore</div>
      <nav className="space-x-6">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/cart" className="hover:underline">Cart</Link>
        <Link to="/login" className="hover:underline">Login</Link>
      </nav>
    </header>
  );
}
