import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Container from "../../components/admin/Container";
import Input from "../../components/admin/Input";
import Select from "../../components/admin/Select";
import Button from "../../components/admin/Button";
import { api } from "../../state/api";
import { useAuth } from "../../state/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [role, setRole] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/v1/user/login", { email, password, role });
      await refresh();
      toast.success("Logged in");
      navigate("/admin");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <div className="mx-auto max-w-md py-12">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900">Dashboard Login</h2>
          <p className="mt-1 text-sm text-slate-600">Admin and Doctor login uses secure cookies.</p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <Select label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
            </Select>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button disabled={submitting} className="w-full">
              {submitting ? "Signing in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Login;

