import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Manager() {
  const [show, setShow] = useState(false);
  const [copy, setCopy] = useState(null);
  const [form, setForm] = useState({
    site: "",
    username: "",
    password: "",
  });
  const [passwordArray, setPasswordArray] = useState([]);

  const getPasswords = async () => {
    let req = await fetch("http://localhost:8080/");
    let passwords = await req.json();
    setPasswordArray(passwords);
    // console.log(passwords);

    // Access the generated _id from the response
    // if (passwords.insertedId) {
    //   setInsertedId(passwords.insertedId);
    // }
    // console.log(passwords.insertedId);
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const showPass = () => {
    setShow(!show);
  };

  const copyItem = (item) => {
    window.navigator.clipboard.writeText(item);
    console.log(item);
    setCopy(item);
  };

  const savePass = async () => {
    setPasswordArray([...passwordArray, form]);

    await fetch("http://localhost:8080/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...form }),
    });
    // localStorage.setItem("passwords", JSON.stringify([...passwordArray, form]));
    // console.log([...passwordArray, form]);
    setForm({ site: "", username: "", password: "" });
  };

  const deletePass = async (id) => {
    // console.log(id);

    setPasswordArray(passwordArray.filter((i) => i._id !== id));
    // console.log(updatedPass);

    await fetch("http://localhost:8080/", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    // localStorage.setItem(
    //   "passwords",
    //   JSON.stringify(passwordArray.filter((i) => i.id !== id))
    // );
  };

  const handleChange = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
      <h1 className="text-3xl text-gray-700 p-4 font-poppins font-extrabold text-center">
        Aqua<i className="fa-solid fa-lock"></i>
      </h1>
      <div className="mx-auto max-w-2xl mt-8 bg-white">
        <div className="shadow-2xl rounded-xl mx-10">
          <div className="flex flex-col justify-center items-center p-4 gap-3">
            <input
              className="rounded-lg border font-poppins text-gray-700 font-semibold w-full p-2 py-1 outline-none shadow-md"
              placeholder="Enter Website URL"
              type="text"
              value={form.site}
              onChange={handleChange}
              name="site"
            />
            <div className="flex w-full gap-5">
              <input
                className="rounded-lg border font-poppins text-gray-700 font-semibold w-full p-2 py-1 outline-none shadow-md"
                placeholder="Enter Username"
                type="text"
                value={form.username}
                onChange={handleChange}
                name="username"
              />
              <div className="relative w-full">
                <input
                  className="rounded-lg border font-poppins text-gray-700 font-semibold w-full p-2 py-1 outline-none shadow-md"
                  placeholder="Enter Password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  name="password"
                />
                <span
                  className="absolute right-3 top-1 cursor-pointer"
                  onClick={showPass}
                >
                  {show ? (
                    <i className="fa-solid fa-eye-slash"></i>
                  ) : (
                    <i className="fa-solid fa-eye"></i>
                  )}
                </span>
              </div>
            </div>
            <button
              onClick={savePass}
              className="border-2 font-poppins font-extrabold shadow-md bg-gray-100 text-gray-700 rounded-lg px-3 py-1"
            >
              Add Password
            </button>
          </div>
        </div>
      </div>
      {passwordArray.length === 0 && (
        <h1 className="m-20 text-center text-2xl font-poppins font-bold text-gray-700">
          No Passwords!
        </h1>
      )}
      {passwordArray.length != 0 && (
        <div className="m-10 mt-20">
          <table className="mx-auto max-w-5xl w-full shadow-2xl rounded-xl overflow-hidden font-poppins text-gray-700 bg-white">
            <thead className="uppercase">
              <tr className="border-b">
                <th className="py-3 px-2 text-left">Site</th>
                <th className="py-3 px-2 text-left">Username</th>
                <th className="py-3 px-2 text-left">Password</th>
                <th className="py-3 px-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {passwordArray.map((item, index) => (
                <tr className="border-b" key={index}>
                  <th className="py-3 font-semibold text-left px-2 whitespace-nowrap">
                    {item.site}
                    <span
                      className="ml-3 cursor-pointer"
                      onClick={() => copyItem(item.site)}
                    >
                      <i
                        className={`${
                          copy === item.site
                            ? "fa-solid fa-copy"
                            : "fa-regular fa-copy"
                        }`}
                      ></i>
                    </span>
                  </th>
                  <td className="py-3 text-left px-2 whitespace-nowrap">
                    {item.username}
                    <span
                      className="ml-3 cursor-pointer"
                      onClick={() => copyItem(item.username)}
                    >
                      <i
                        className={`${
                          copy === item.username
                            ? "fa-solid fa-copy"
                            : "fa-regular fa-copy"
                        }`}
                      ></i>
                    </span>
                  </td>
                  <td className="py-3 text-left px-2 whitespace-nowrap">
                    {"*".repeat(item.password.length)}
                    <span
                      className="ml-3 cursor-pointer"
                      onClick={() => copyItem(item.password)}
                    >
                      <i
                        className={`${
                          copy === item.password
                            ? "fa-solid fa-copy"
                            : "fa-regular fa-copy"
                        }`}
                      ></i>
                    </span>
                  </td>
                  <td className="py-3 text-left px-2 whitespace-nowrap">
                    <i
                      onClick={() => deletePass(item._id)}
                      className="fa-solid fa-trash cursor-pointer"
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
