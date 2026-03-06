import { Routes, Route } from "react-router-dom";
import Login from "./componenets/pages/Login";
import MainLayout from "./componenets/admin/mainlayout";
import Categorylist from "./componenets/pages/Categorylist";
import Addcat from "./componenets/pages/Addcat";
import { OpenRoutes } from "./routing/OpenRoutes";
import { PrivateRoutes } from "./routing/PrivateRoutes";
import AddColor from "./componenets/pages/Addcolor";
import ColorList from "./componenets/pages/Colotlist";
import BrandList from "./componenets/pages/Brandlist";
import Addbrand from "./componenets/pages/Addbrand";
import Addproduct from "./componenets/pages/Addproduct";
import Productlist from "./componenets/pages/Productlist";
import OrderList from "./componenets/pages/OrderList";
function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/"
        element={
          <OpenRoutes>
            <Login />
          </OpenRoutes>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoutes>
            <MainLayout />
          </PrivateRoutes>
        }
      >
        <Route path="list-category" element={<Categorylist />} />
        <Route path="category" element={<Addcat />} />
        <Route path="category/:id" element={<Addcat />} />
        <Route path="color" element={<AddColor />} />
        <Route path="color/:id" element={<AddColor />} />
        <Route path="list-color" element={<ColorList />} />
        <Route path="list-brand" element={<BrandList />} />
        <Route path="brand" element={<Addbrand />} />
        <Route path="brand/:id" element={<Addbrand />} />
        <Route path="product" element={<Addproduct />} />
        <Route path="product/:id" element={<Addproduct />} />
        <Route path="list-product" element={<Productlist />} />
        <Route path="list-order" element={<OrderList />} />

      </Route>

      {/* 404 Page */}
      <Route
        path="*"
        element={
          <h1 className="text-center mt-20 text-3xl">404 Not Found</h1>
        }
      />

    </Routes>
  );
}

export default App;