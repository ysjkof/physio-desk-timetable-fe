import React from "react";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="container mx-auto flex flex-col items-center gap-4">
      <h1 className="text-3xl">홈</h1>
      <button className="rounded-md border px-4 py-1">
        <Link className="text-sky-400" to="/create-patient">
          Create Patient
        </Link>
      </button>

      <button className="rounded-md border px-4 py-1">
        <Link className="text-sky-400" to="/list-patient">
          List Patient
        </Link>
      </button>
    </div>
  );
}
