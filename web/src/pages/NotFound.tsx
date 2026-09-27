import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="wrap narrow center">
      <h1>Page not found</h1>
      <p><Link to="/">Back to all papers</Link></p>
    </div>
  );
}
