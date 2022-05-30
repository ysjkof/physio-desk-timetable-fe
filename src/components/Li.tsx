import React from "react";
import { Link } from "react-router-dom";

interface ILiProps {
  id: number;
  loading?: boolean;
  name: string;
  gender?: string;
  registrationNumber?: string | null;
  birthday?: string | null;
}

export const Li: React.FC<ILiProps> = ({
  id,
  name,
  gender,
  registrationNumber,
  birthday,
  loading,
}) => (
  <li className="flex justify-between px-10">
    {loading ? (
      "Loading..."
    ) : (
      <>
        <span className="w-1/4">{name}</span>
        <span className="w-1/4  font-extralight ">{gender}</span>
        <span className="w-1/4  font-extralight ">{birthday}</span>
        <span className="w-1/4  font-extralight ">{registrationNumber}</span>
        <Link className="w-1/4 text-right text-sky-500" to={`/patoent/${id}`}>
          Edit
        </Link>
      </>
    )}
  </li>
);
