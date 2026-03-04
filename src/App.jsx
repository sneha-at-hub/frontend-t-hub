import { Routes, Route } from "react-router-dom";
import Login from "./componenets/pages/Login";
import MainLayout from "./componenets/admin/mainlayout";
import Categorylist from "./componenets/pages/Categorylist";
import Addcat from "./componenets/pages/Addcat";
import { OpenRoutes } from "./routing/OpenRoutes";
import { PrivateRoutes } from "./routing/PrivateRoutes";

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