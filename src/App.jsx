import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import BusDetails from "./components/BusDetails";
import BookNow from "./components/BookNow";
import BookingsPage from "./components/BookingsPage";
import CreateBus from "./components/CreateBus";
import AdminBookedTicketsList from "./components/AdminBookedTicketsList";
import AdminBookedTickets from "./components/AdminBookedTickets";
import PaymentStatus from "./components/PaymentStatus";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/buses/:busId" element={<BusDetails />} />
      <Route path="/buses/:busId/book" element={<BookNow />} />
      <Route path="/bookings" element={<BookingsPage />} />
      <Route path="/create-bus" element={<CreateBus />} />
      <Route
        path="/admin/booked-tickets"
        element={<AdminBookedTicketsList />}
      />
      <Route
        path="/admin/booked-tickets/:busId"
        element={<AdminBookedTickets />}
      />
      <Route path="/paymentStatus/success" element={<PaymentStatus />} />
    </Routes>
  );
};

export default App;
