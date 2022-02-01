import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Header } from "../components/header";

export function Home() {
  return (
    <div>
      <h1 className=" text-3xl">홈</h1>
      <Link className="text-sky-400" to="/create-patient">
        Create Patient
      </Link>
      <br />
      <Link className="text-sky-400" to="/list-patient">
        List Patient
      </Link>
      <br />
      <Link className="text-sky-400" to="/reserve">
        Reserve
      </Link>
    </div>
  );
}
