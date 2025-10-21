import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TicketProvider } from './context/TicketContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import TicketBoard from './pages/TicketBoard';
import TicketDetail from './pages/TicketDetail';
import Statistics from './pages/Statistics';

function App() {
  return (
    <Router>
      <TicketProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/crear-ticket" element={<CreateTicket />} />
            <Route path="/tablero" element={<TicketBoard />} />
            <Route path="/estadisticas" element={<Statistics />} />
            <Route path="/ticket/:id" element={<TicketDetail />} />
          </Routes>
        </Layout>
      </TicketProvider>
    </Router>
  );
}

export default App;

