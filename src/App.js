import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// ------ Auth Components ------
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      onLogin(found);
      navigate("/");
    } else {
      setMsg("Invalid email or password.");
    }
  };

  return (
    <div className="container my-5" style={{maxWidth: 400}}>
      <h2 className="mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input className="form-control" type="email" placeholder="Email" required
            value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="mb-2">
          <input className="form-control" type="password" placeholder="Password" required
            value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary w-100" type="submit">Login</button>
      </form>
      {msg && <div className="mt-3 text-danger">{msg}</div>}
      <div className="mt-3 text-center">
        New user? <Link to="/register">Sign up</Link>
      </div>
    </div>
  );
}

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    if (!email.includes("@")) {
      setMsg("Enter valid email.");
      return;
    }
    if (password.length < 5) {
      setMsg("Password too short.");
      return;
    }
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find(u => u.email === email)) {
      setMsg("Email already registered.");
      return;
    }
    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));
    setMsg("Registration successful! Login now.");
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <div className="container my-5" style={{maxWidth: 400}}>
      <h2 className="mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input className="form-control" type="email" placeholder="Email" required
            value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="mb-2">
          <input className="form-control" type="password" placeholder="Password" required
            value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary w-100" type="submit">Sign Up</button>
      </form>
      {msg && <div className="mt-3 text-success">{msg}</div>}
      <div className="mt-3 text-center">
        Have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

// ------ Home Page ------
function Home({ products, onAddToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(search.toLowerCase()) &&
    (category ? product.category === category : true)
  );

  return (
    <div className="container py-4">
      <h2 className="mb-4">Product Listing Page (Home)</h2>
      <div className="mb-3 d-flex flex-wrap gap-3">
        <input
          type="text"
          className="form-control"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          style={{ minWidth: 180 }}
        />
        <select
          className="form-select"
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ maxWidth: 240 }}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option value={c} key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="row g-3">
        {filteredProducts.map((product) => (
          <div className="col-sm-6 col-md-4 col-lg-3 d-flex" key={product.id}>
            <div className="card h-100 product-card w-100 d-flex flex-column">
              <Link
                to={`/product/${product.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
                className="flex-grow-1"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="card-img-top product-image"
                  style={{ height: 200, objectFit: "contain", background: "#fafafa" }}
                  loading="lazy"
                />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="text-success fw-bold mb-1">${product.price}</p>
                  <p className="text-muted mb-0">{product.category}</p>
                </div>
              </Link>
              <div className="card-footer bg-transparent border-0 p-2">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => onAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------ Product Details ------
function ProductDetails({ product, onAddToCart }) {
  if (!product) return <div className="container py-5">Product not found.</div>;
  return (
    <div className="container my-5">
      <h2>{product.title}</h2>
      <div className="row align-items-center my-4">
        <div className="col-md-5">
          <img
            src={product.image}
            alt={product.title}
            className="img-fluid"
            style={{ maxHeight: 300, objectFit: "contain" }}
          />
        </div>
        <div className="col-md-7">
          <p className="fs-4 text-success">${product.price}</p>
          <p className="text-muted mb-3">{product.category}</p>
          <p>{product.description}</p>
          <button
            className="btn btn-primary"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// ------ Cart ------
function Cart({ cartItems, onAdd, onRemove }) {
  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);

  return (
    <div className="container my-5">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
        <ul className="list-group mb-4">
          {cartItems.map((item) => (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{item.title}</strong><br/>
                ${item.price} &times; {item.qty}
              </div>
              <div>
                <button className="btn btn-outline-success btn-sm mx-1" onClick={() => onAdd(item)}>+</button>
                <button className="btn btn-outline-danger btn-sm mx-1" onClick={() => onRemove(item)}>-</button>
                <button className="btn btn-danger btn-sm mx-1" onClick={() => onRemove(item, true)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
        <h3>Total: ${getTotal()}</h3>
        <Link to="/checkout" className="btn btn-primary mt-3">Proceed to Checkout</Link>
        </>
      )}
    </div>
  );
}

// ------ Checkout ------
function Checkout({ onPlaceOrder }) {
  return (
    <div className="container my-5 text-center">
      <h2>Checkout</h2>
      <p>Ready to complete your purchase?</p>
      <button className="btn btn-success btn-lg mt-3" onClick={onPlaceOrder}>Place Order</button>
    </div>
  );
}

// ------ Success ------
function OrderSuccess() {
  return (
    <div className="container my-5 text-center">
      <h2>Thank you for your order!</h2>
      <p>Your order has been placed successfully.</p>
      <Link to="/">Return to Home</Link>
    </div>
  );
}

// ------ App ------
function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const found = prevCart.find((item) => item.id === product.id);
      if (found) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, qty: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (product, removeAll = false) => {
    setCart((prevCart) => {
      const found = prevCart.find((item) => item.id === product.id);
      if (!found) return prevCart;
      if (removeAll || found.qty === 1) {
        return prevCart.filter((item) => item.id !== product.id);
      } else {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty - 1 } : item
        );
      }
    });
  };

  const handlePlaceOrder = () => {
    setCart([]);
    localStorage.removeItem("cart");
    window.location.href = "/order-success";
  };

  const getProductById = (id) => products.find((p) => p.id === Number(id));

  function ProductDetailsWrapper() {
    const { id } = useParams();
    const product = getProductById(id);
    return <ProductDetails product={product} onAddToCart={handleAddToCart} />;
  }

  return (
    <Router>
      <nav className="bg-primary p-3 text-white">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <Link to="/" className="text-white fw-bold me-3">Home</Link>
            <Link to="/cart" className="text-white fw-bold">
              Cart ({cart.reduce((s, item) => s + item.qty, 0)})
            </Link>
          </div>
          <div>
            {user ? (
              <span className="me-3">Welcome, {user.email}</span>
            ) : null}
            {user
              ? <button className="btn btn-light btn-sm" onClick={() => setUser(null)}>Logout</button>
              : (
                <>
                  <Link to="/login" className="btn btn-outline-light btn-sm me-2">Login</Link>
                  <Link to="/register" className="btn btn-outline-light btn-sm">Sign Up</Link>
                </>
              )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home products={products} onAddToCart={handleAddToCart} />} />
        <Route path="/product/:id" element={<ProductDetailsWrapper />} />
        <Route path="/cart" element={<Cart cartItems={cart} onAdd={handleAddToCart} onRemove={handleRemoveFromCart} />} />
        <Route path="/checkout" element={<Checkout onPlaceOrder={handlePlaceOrder} />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
