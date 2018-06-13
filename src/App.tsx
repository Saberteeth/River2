import * as React from 'react';
import './App.css';
import { createActivity, MainActivity } from './HelloWorld/Main';



class App extends React.Component {
  main: MainActivity | null = null;

  public render() {
    return (
      <div className="App">
        <canvas id="helloworld" />
      </div>
    );
  }

  public componentDidMount() {
    if (!this.main) {
      this.main = createActivity('helloworld');
      this.main.onCreate();
    }
  }
}

export default App;
