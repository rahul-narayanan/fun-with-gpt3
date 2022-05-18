import './App.css';
import { Form } from './components/form';
import { Responses } from './components/responses';
import store from './store'
import { Provider } from 'react-redux'

function App() {

  function renderNavBar() {
    return (
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand h1" style={{ fontSize: "24px", marginTop: 5 }}>
            Fun with GPT-3 AI
          </span>
        </div>
      </nav >
    );
  }

  function renderContent() {
    return (
      <div className="contentContainer">
        <Form />
        <Responses />
      </div>
    )
  }

  return (
    <Provider store={store}>
      <div className="container-fluid mainContainer">
        {renderNavBar()}
        {renderContent()}
      </div>
    </Provider>
  );
}

export default App;
