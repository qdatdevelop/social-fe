import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useEffect, useReducer, useRef, useState } from "react";
import { Form, Formik } from "formik";
import LoginInput from "../../components/inputs/loginInput";
import SendEmail from "./SendEmail";
import CodeVerification from "./CodeVerification";
import Footer from "../../components/login/Footer";
import axios from "axios";
import { useParams } from "react-router-dom";
export default function VerifiRegister(socket) {
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const { emailRegister } = useParams();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(0);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [conf_password, setConf_password] = useState("");
  const [error, setError] = useState("");
  const [userInfos, setUserInfos] = useState("");
  const logout = () => {
    Cookies.set("user", "");
    dispatch({
      type: "LOGOUT",
    });
    navigate("/login");
  };
  console.log(userInfos);
  const handleSearch = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/findUser`, {
        email: emailRegister,
        verified: false,
      });
      setUserInfos(data);
      setVisible(2);
      setError("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  useEffect(() => {
    setEmail(emailRegister);
    handleSearch();
  }, []);
  console.log(visible);
  return (
    <div className="reset">
      <div className="reset_header">
        <img src="../../../icons/facebook.svg" alt="" />
        {user ? (
          <div className="right_reset">
            <Link to="/profile">
              <img src={user.picture} alt="" />
            </Link>
            <button
              className="blue_btn"
              onClick={() => {
                logout();
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="right_reset">
            <button className="blue_btn">Login</button>
          </Link>
        )}
      </div>
      <div className="reset_wrap">
        {visible === 1 && userInfos && (
          <SendEmail
            email={email}
            userInfos={userInfos}
            error={error}
            setError={setError}
            setLoading={setLoading}
            setUserInfos={setUserInfos}
            setVisible={setVisible}
          />
        )}
        {visible === 2 && (
          <CodeVerification
            user={user}
            code={code}
            setCode={setCode}
            error={error}
            setError={setError}
            setLoading={setLoading}
            setVisible={setVisible}
            userInfos={userInfos}
            socket={socket}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
