import { useParams } from "react-router-dom";

const Sheet = () => {
  const { sheetName } = useParams();

  return (
    <div>
      <h2>{sheetName.toUpperCase()} DSA Sheet</h2>
      <p>Problems will be displayed here</p>
    </div>
  );
};

export default Sheet;
