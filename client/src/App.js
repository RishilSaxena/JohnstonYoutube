import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
  Link,
} from "react-router-dom";
import Home from "./pages/Home"
import Tags from "./pages/Tags";

function App() {
  return (
    <div className="App">
     
      <Router>
      <nav className="w-full bg-blue-500 align-middle relative inline-block shadow-md">
      <Link
        to="/"
        className="inline-block text-white font-medium p-5 text-xl hover:text-gray-300 transition-all"
      >
        Home
      </Link>
      <Link
        to="/tags"
        className="inline-block text-white font-medium p-5 text-xl hover:text-gray-300 transition-all"
      >
        Tag Generator
      </Link>
      </nav>
        <Switch>
          <Route exact path="/" element={<Home/>}/>
          <Route path="/tags" element={<Tags/>}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
