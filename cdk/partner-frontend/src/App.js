//import logo from './logo.svg';
import './App.css';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { ChartContentBox } from './ChartContentBox';
import {LogsContentBox} from './LogsContentBox';

Chart.register(CategoryScale);

function App() {

  return (
    <div className="App">
        < Title />
      <header className="App-header">
        <div className="Content-Row">
          <ChartContentBox metric_type="memory" metric_title="Memory Usage" metric_subtitle="Memory usage by function over time." />
          <ChartContentBox metric_type="duration" metric_title="Function Duration" metric_subtitle="Function duration over time." />
          <ChartContentBox metric_type="init" metric_title="Function Init Time" metric_subtitle="Function initialization time over time." />
        </div>
        <div className="Content-Row">
          <LogsContentBox />
        </div>
      </header>
      <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.1.1/chart.min.js"></script>
    </div>
  );
}

export default App;


function Title() {
  return (
    
      <div className="Title">
        <h1>Partner Tool</h1>
        <div className="Title-Subtitle">
          The best observability platform in the world.
        </div>
      </div>

  )
}
