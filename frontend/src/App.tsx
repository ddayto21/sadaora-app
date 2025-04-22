// src/App.tsx
import "./App.css";
import AppRouter from "./router";
import { AuthProvider } from "./context/auth/provider";

function App() {
  return (
    <>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
      \
    </>
  );
}

export default App;
