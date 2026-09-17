export function StepHeading({
  title,
  accent,
  subtitle,
}: {
  title: string;
  accent: string;
  subtitle?: string;
}) {
  return (
    <div className="px-6 mt-5">
      <h1 className="text-[26px] font-semibold leading-tight">
        {title}
        <br />
        <span className="accent-text text-[28px]">{accent}</span>
      </h1>
      {subtitle && <p className="text-text-dim text-sm mt-2">{subtitle}</p>}
    </div>
  );
}
