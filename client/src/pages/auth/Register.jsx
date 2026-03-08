import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../service/AuthContext';
import api from '../../service/api';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const target = user.role === 'ADMIN' ? '/admin' : '/dashboard';
      navigate(target);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const newErrors = {};
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      login(data.user); // Update AuthContext state
      const target = data.user.role === 'ADMIN' ? '/admin' : '/dashboard';
      navigate(target);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Registration failed";
      if (errorMessage.toLowerCase().includes("email")) {
        setErrors({ email: errorMessage });
      } else {
        setErrors({ form: errorMessage });
      }
      console.error("Auth Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-12">
      <div className="bg-bg-card border border-border-dim p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-2 text-center text-text-base">Create Account</h2>
        <p className="text-center text-text-muted mb-8">Join Ignite Academy today</p>

        {errors.form && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">First Name</label>
              <input
                name="firstName"
                type="text"
                required
                className={`p-3 rounded-lg bg-bg-main border ${errors.firstName ? "border-red-500" : "border-border-dim"} focus:ring-2 focus:ring-brand outline-none text-text-base`}
                onChange={handleChange}
              />
              {errors.firstName && <span className="text-[10px] text-red-500 font-bold ml-1">{errors.firstName}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Last Name</label>
              <input
                name="lastName"
                type="text"
                required
                className={`p-3 rounded-lg bg-bg-main border ${errors.lastName ? "border-red-500" : "border-border-dim"} focus:ring-2 focus:ring-brand outline-none text-text-base`}
                onChange={handleChange}
              />
              {errors.lastName && <span className="text-[10px] text-red-500 font-bold ml-1">{errors.lastName}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Email</label>
            <input
              name="email"
              type="email"
              required
              className={`p-3 rounded-lg bg-bg-main border ${errors.email ? "border-red-500" : "border-border-dim"} focus:ring-2 focus:ring-brand outline-none text-text-base`}
              onChange={handleChange}
            />
            {errors.email && <span className="text-[10px] text-red-500 font-bold ml-1">{errors.email}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Password</label>
            <input
              name="password"
              type="password"
              required
              className={`p-3 rounded-lg bg-bg-main border ${errors.password ? "border-red-500" : "border-border-dim"} focus:ring-2 focus:ring-brand outline-none text-text-base`}
              onChange={handleChange}
            />
            {errors.password && <span className="text-[10px] text-red-500 font-bold ml-1">{errors.password}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              required
              className={`p-3 rounded-lg bg-bg-main border ${errors.confirmPassword ? "border-red-500" : "border-border-dim"} focus:ring-2 focus:ring-brand outline-none text-text-base`}
              onChange={handleChange}
            />
            {errors.confirmPassword && <span className="text-[10px] text-red-500 font-bold ml-1">{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-hover transition-all shadow-lg shadow-brand/20 mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account? <Link to="/login" className="text-brand font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;