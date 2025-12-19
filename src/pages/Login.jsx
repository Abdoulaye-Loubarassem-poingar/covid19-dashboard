export default function Login({ setUser }) {
  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    });

    const data = await res.json();
    setUser(data.user);
  };

  return (
    <form onSubmit={handleLogin} className="p-6 max-w-md mx-auto">
      <input name="email" placeholder="Email" className="block w-full mb-2" />
      <input name="password" type="password" placeholder="Password" className="block w-full mb-2" />
      <button className="bg-blue-600 text-white px-4 py-2">Login</button>
    </form>
  );
}
