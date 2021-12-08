export default function Warning({children}) {
  return (
    <div className="bg-blue-500 text-blue-200 py-2 px-4 rounded bg-opacity-25 mb-8 text-base">
      <strong className="block mb-2">Note</strong>
      {children}
    </div>
  );
}
