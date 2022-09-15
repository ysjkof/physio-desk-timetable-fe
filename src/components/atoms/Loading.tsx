export default function Loading() {
  return (
    <div className="position-center absolute space-y-6">
      <div className="mx-auto w-full max-w-sm rounded-md border p-4 shadow">
        <div className="flex animate-pulse space-x-4">
          <div className="h-10 w-10 rounded-full bg-slate-200"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 rounded bg-slate-200"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-slate-200"></div>
                <div className="col-span-1 h-2 rounded bg-slate-200"></div>
              </div>
              <div className="h-2 rounded bg-slate-200"></div>
            </div>
          </div>
        </div>
      </div>
      <p className="animate-pulse  text-base">
        불러오는 중입니다. 몇초 뒤에 변화가 없으면 새로고침하세요.
      </p>
    </div>
  );
}
