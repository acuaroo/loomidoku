import Header from "./components/Header";
import Grid from "./components/Grid";

function App() {
  return (
    <div className="font-russo text-white">
      <Header />

      <h1 className="text-3xl text-center pt-8 pb-0 text-cyan">
        Puzzle <span className="text-cyan-400">#000</span>
      </h1>

      <Grid />
    </div>
  )
}

export default App
