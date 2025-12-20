import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>CodeArena</h1>
      <p>Structured DSA Practice & Progress Tracking Platform</p>

      <Link to="/sheet/striver">Striver DSA Sheet</Link>
      <br />
      <Link to="/sheet/love-babbar">Love Babbar Sheet</Link>
    </div>
  );
};

export default Home;
