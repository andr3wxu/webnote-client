import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  localStorage.clear();

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    return;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    setError("");
    e.preventDefault(); // prevents default form behaviour
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:8000/api/signup/",
        data: {
          email: formData.email,
          username: formData.username,
          password: formData.password,
        },
      });
      Cookies.set("wn_auth_token", response.data.token);
      Cookies.set("wn_user_id", response.data.id);
      navigate("/");
    } catch {
      console.log("Sign up failed.");
    }
    return;
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div className="flex flex-col px-4 pb-3 pt-3">
          <h1 className="text-2xl mx-auto pb-4 pt-2 font-light text-gray-600">
            Sign up for{" "}
            <span className="font-light text-green-700">
              web
              <span style={{ fontFamily: "Martian Mono", fontSize: "0.83em" }}>
                note
              </span>
            </span>
          </h1>
          <input
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500 mb-2"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          ></input>
          <input
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500 mb-2"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          ></input>
          <input
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          ></input>
          {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
          <div className="mt-3 flex justify-center">
            <button className="p-2 bg-slate-100">Submit</button>
          </div>
          <Link
            to={"/login"}
            className="text-xs text-blue-500 hover:text-blue-600 transition duration-150 mx-auto mt-4"
          >
            <p>Already have an account? Log in</p>
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
