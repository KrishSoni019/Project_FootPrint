export default function Section({ id, className = "", children }) {
  return (
    <section id={id} className={`relative ${className}`}>
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        {children}
      </div>
    </section>
  );
}
