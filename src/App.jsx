import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import NewThread from "./pages/NewThread";
import LatestThreads from "./pages/LatestThreads";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LatestThreads />} />
          <Route path="threads/new" element={<NewThread />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;