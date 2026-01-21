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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

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
      alert(errorMessage);
      console.error("Auth Error:", err);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-12">
      <div className="bg-bg-card border border-border-dim p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-2 text-center text-text-base">Create Account</h2>
        <p className="text-center text-text-muted mb-8">Join Ignite Academy today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">First Name</label>
              <input
                name="firstName"
                type="text"
                required
                className="p-3 rounded-lg bg-bg-main border border-border-dim focus:ring-2 focus:ring-brand outline-none text-text-base"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Last Name</label>
              <input
                name="lastName"
                type="text"
                required
                className="p-3 rounded-lg bg-bg-main border border-border-dim focus:ring-2 focus:ring-brand outline-none text-text-base"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Email</label>
            <input
              name="email"
              type="email"
              required
              className="p-3 rounded-lg bg-bg-main border border-border-dim focus:ring-2 focus:ring-brand outline-none text-text-base"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Password</label>
            <input
              name="password"
              type="password"
              required
              className="p-3 rounded-lg bg-bg-main border border-border-dim focus:ring-2 focus:ring-brand outline-none text-text-base"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              required
              className="p-3 rounded-lg bg-bg-main border border-border-dim focus:ring-2 focus:ring-brand outline-none text-text-base"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-hover transition-all shadow-lg shadow-brand/20 mt-4">
            Create Account
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