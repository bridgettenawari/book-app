import { apiDelete } from "./Api.js"; // helper for DELETE requests

function LogoutButton({ onLogout }) {
  const handleLogout = () => {
    apiDelete("/logout")
      .then(() => {
        alert("Logged out!");
        if (onLogout) onLogout();
      })
      .catch((err) => console.error(err));
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;
