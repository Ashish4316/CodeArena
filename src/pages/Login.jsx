import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError("Failed to log in: " + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
            <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
                <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">Login</h2>
                {error && <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-400"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-400"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:opacity-50"
                    >
                        {loading ? "Logging In..." : "Log In"}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-400 hover:underline">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
