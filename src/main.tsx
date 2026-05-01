import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext";
import { BookingProvider } from "./context/BookingContext";
import { BookingModal } from "./components/aryan/BookingModal";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BookingProvider>
        <App />
        <BookingModal />
      </BookingProvider>
    </ThemeProvider>
  </React.StrictMode>
);
