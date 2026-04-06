import clsx from "clsx";
import { useState } from "react";
import { loginApi } from "../services/authService";
import { useAuth } from "../core/auth/authContext";

const loginImage =
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (loading) return; // 🔥 evita doble submit

        if (!email || !password) {
            return;
        }

        setLoading(true);

        try {
            const res = await loginApi(email, password);

            if (res.success) {
                await login(res.returnData.token, res.returnData.refreshToken);
            } else {
                setErrorMessage(res.errors?.[0]?.description || "Login failed");
            }
        } catch {
            setErrorMessage("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={clsx(
                "min-h-screen flex items-center justify-center bg-slate-50",
                loading && "cursor-wait"
            )}
        >
            <div
                className={clsx(
                    "flex w-full max-w-5xl h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
                )}
            >
                {/* IMAGE */}
                <div className="hidden md:block md:w-1/2 bg-slate-100 h-full">
                    <img
                        src={loginImage}
                        alt="Login visual"
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* FORM */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center h-full">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">
                        Sign in to InnNou
                    </h1>

                    <p className="text-slate-500 mb-6 text-center">
                        Welcome back! Please enter your credentials.
                    </p>

                    {/* 🔥 WRAPPER PARA OVERLAY */}
                    <div className="relative">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* EMAIL */}
                            <input
                                type="email"
                                disabled={loading}
                                className={clsx(
                                    "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 transition",
                                    loading &&
                                    "bg-slate-100 cursor-not-allowed"
                                )}
                                placeholder="Email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrorMessage("");
                                }}
                                autoFocus
                            />

                            {/* PASSWORD */}
                            <input
                                type="password"
                                disabled={loading}
                                className={clsx(
                                    "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 transition",
                                    loading &&
                                    "bg-slate-100 cursor-not-allowed"
                                )}
                                placeholder="Password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />

                            {/* BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={clsx(
                                    "w-full py-2 rounded-lg font-semibold transition",
                                    "bg-slate-800 text-white hover:bg-slate-700",
                                    loading && "opacity-70 cursor-not-allowed"
                                )}
                            >
                                Login
                            </button>
                            {errorMessage && (
                                <div className="text-red-500 text-lg text-center">
                                    {errorMessage}
                                </div>
                            )}
                        </form>

                        {/* 🔥 OVERLAY */}
                        {loading && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                                <span className="w-6 h-6 border-4 border-slate-800 border-t-transparent rounded-full animate-spin"></span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;