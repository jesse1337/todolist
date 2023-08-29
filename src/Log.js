import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "./firestore";
import yumi from "./yumi.jpg";

function Log() {
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      console.error("Log-in error: ", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "1.5em",
        backgroundColor: "rgb(83, 83, 83)",
      }}
    >
      <img
        src={yumi}
        style={{
          height: "300px",
          padding: "10px",
          marginTop: "-125px",
        }}
      />
      <p
        style={{
          fontFamily: "Comic Sans MS, Comic Sans, cursive	",
          fontSize: "30px",
          fontWeight: "700",
        }}
      >
        Log in to use
      </p>
      <button
        style={{
          padding: "10px 20px",
          fontSize: "1em",
          marginTop: "20px",
          backgroundColor: "rgb(92, 162, 236)",
          border: "none",
        }}
        onClick={handleSignIn}
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default Log;
