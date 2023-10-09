import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
} from "react-router-dom";
import Home from "./pages/Home"

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" element={<Home/>}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
