import React from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container";

const NotFound = () => {
  return (
    <Container>
      <div className="py-16">
        <h2 className="text-2xl font-extrabold text-slate-900">Page not found</h2>
        <p className="mt-2 text-slate-600">The page you requested does not exist.</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Go Home
        </Link>
      </div>
    </Container>
  );
};

export default NotFound;

