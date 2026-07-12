export default function ComingSoon({ title }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center p-10">
      <h2 className="text-2xl font-semibold text-slate-200">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">
        This screen isn't built yet — coming soon.
      </p>
    </div>
  );
}