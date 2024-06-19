import "./App.css";
import SoundMeter from "./components/SoundMeter.js";
import { MeshGradientRenderer } from "@johnn-e/react-mesh-gradient";

function App() {
  return (
    <div>
      <MeshGradientRenderer
        id="gradient-container"
        className="gradient"
        colors={["#C3E4FF", "#6EC3F4", "#EAE2FF", "#B9BEFF", "#B3B8F9"]}
        wireframe={true}
      />
      <SoundMeter />
    </div>
  );
}

// The general idea is that this should look quite calm but when you start recording it bursts into colour, emanating out from the button

export default App;
