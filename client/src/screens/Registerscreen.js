import React, { useState } from "react";
import axios from "axios";
import Error from "../components/Error";
import Loader from "../components/Loader";
import Success from '../components/Success';
import Swal from 'sweetalert2';

export default function Registerscreen() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  const [success, setsuccess] = useState(false);

  async function register() {
    if (!name || !email || !password || !cpassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill all fields!',
      });
      return;
    }

    if (password !== cpassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!',
      });
      return;
    }

    const user = {
      name,
      email,
      password
    };

    try {
      setloading(true);
      const result = await axios.post('/api/users/register', user);
      setloading(false);
      setsuccess(true);
      setname('');
      setemail('');
      setpassword('');
      setcpassword('');
    } catch (error) {
      seterror(true);
      setloading(false);
      console.log(error);
    }
  }

  return (
    <div className='register'>
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5 text-left shadow-lg p-3 mb-5 bg-white rounded">
          {loading && <Loader />}
          {success && <Success success='User Registered Successfully' />}
          {error && <Error error='Email already registered' />}

          <h2 className="text-center m-2" style={{ fontSize: "35px" }}>
            Register
          </h2>
          <div>
            <input
              type="text"
              placeholder="name"
              className="form-control mt-1"
              value={name}
              onChange={(e) => setname(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="email"
              className="form-control mt-1"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="password"
              className="form-control mt-1"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="confirm password"
              className="form-control mt-1"
              value={cpassword}
              onChange={(e) => setcpassword(e.target.value)}
              required
            />
            <button onClick={register} className="btn btn-primary rounded-pill mt-3 mb-3">REGISTER</button>
            <br />
            <a style={{ color: 'black' }} href="/login">Click Here To Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}
