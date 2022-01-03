import React from "react";
import { Link } from "react-router-dom";

interface ILiProps {
  id: number;
  loading?: boolean;
  name: string;
  gender?: string;
  birthday?: string;
}

export const Li: React.FC<ILiProps> = ({
  id,
  name,
  gender,
  birthday,
  loading,
}) => (
  <li className="flex justify-between px-10">
    {loading ? (
      "Loading..."
    ) : (
      <>
        <span className="w-1/4">{name}</span>
        <span className=" text-sm w-1/4 font-extralight text-gray-400">
          {gender}
        </span>
        <span className="text-sm w-1/4 font-extralight text-gray-400">
          {birthday}
        </span>
        <Link className="text-right w-1/4 text-sky-500" to={`/patoent/${id}`}>
          Edit
        </Link>
      </>
    )}
  </li>
);
