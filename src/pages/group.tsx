import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";

export const Group = () => {
  return (
    <>
      <Helmet>
        <title>그룹| Muool</title>
      </Helmet>
      <div className="container mx-auto h-full">
        <h1 className="text-2xl font-medium">그룹 목록</h1>
        {[1, 1, 1, 1].map((group) => (
          <>
            <h2 className="group-name">group1</h2>
            <h2 className="group-date">1989-11-23</h2>
            <h2 className="group-member">1989-11-23</h2>
          </>
        ))}
        <h1 className="mt-16 text-2xl font-medium">그룹 만들기</h1>
      </div>
    </>
  );
};
