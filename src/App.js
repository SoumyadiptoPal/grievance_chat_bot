import "./App.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import State from "./context/State";

function App() {
  return (
    <State>
      <div>
        <Navbar />
        <Home />
      </div>
    </State>
  );
}

export default App;
