export default function Layout({ children, className = "" }) {
  return (
    <div className={`px-[20px] w-full ${className}`}>
      <div className="grid grid-cols-12 gap-[20px]">{children}</div>
    </div>
  );
}
