// App.tsx ✅
import { Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
            404 – Page Not Found
          </div>
        }
      />
    </Routes>
  );
}
