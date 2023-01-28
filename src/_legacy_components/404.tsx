import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h2 className="mb-3  font-semibold">페이지를 찾을 수 없습니다.</h2>
      <h4 className="mb-5  font-medium">페이지가 없거나 변경됐습니다.</h4>
      <Link className="text-lime-600 hover:underline" to="/">
        처음화면으로 이동하기
      </Link>
    </div>
  );
}
