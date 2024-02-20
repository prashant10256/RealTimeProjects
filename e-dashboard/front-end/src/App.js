import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AddProduct from "./components/AddProduct";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Nav from "./components/Nav";
import PrivateComponent from "./components/PrivateComponent";
import ProductList from "./components/ProductList";
import Signup from "./components/Signup";
import UpdateProduct from "./components/UpdateProduct";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route element={<PrivateComponent />}>
            <Route path="/" element={<ProductList />} />
            <Route path="add" element={<AddProduct />} />
            <Route path="update/:id" element={<UpdateProduct />} />
            <Route path="logout" element={<h1>Logout componet</h1>} />
            <Route path="profile" element={<h1> Profile componet</h1>} />
          </Route>

          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
