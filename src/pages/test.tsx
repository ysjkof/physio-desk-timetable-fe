import { Helmet } from "react-helmet-async";

export const Test = () => {
  return (
    <>
      <Helmet>
        <title>시간표 | Muool</title>
      </Helmet>
      <h1 className="text-lg font-bold">TEST PAGE</h1>
      <div className="flex h-[500px]"></div>
    </>
  );
};
