import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center"
      style={{ backgroundColor: "#071C3C" }}
    >
      <p
        className="text-xs font-bold uppercase tracking-widest mb-4"
        style={{ color: "#C9A35A" }}
      >
        404 — Page not found
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
        This page does not exist or has moved.
      </h1>
      <p className="text-sm mb-8 max-w-md" style={{ color: "#CBD5E0" }}>
        The page you are looking for could not be found. Explore our services or
        contact us for a confidential consultation.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 text-sm font-semibold rounded transition-colors"
          style={{ backgroundColor: "#C9A35A", color: "#071C3C" }}
        >
          Back to homepage
        </Link>
        <Link
          href="/contact"
          className="px-6 py-3 text-sm font-semibold rounded border transition-colors text-white"
          style={{ borderColor: "#C9A35A" }}
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
