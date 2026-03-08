type Props = {
  answer?: string | null;
  type?: string;
};

export default function AnswerCard({ answer, type }: Props) {
  if (!answer) return null;
  return (
    <div className="glass-card p-4">
      <div className="text-xs uppercase tracking-[0.08em] text-slate-400 mb-1">Answer {type ? `· ${type}` : ""}</div>
      <div className="text-lg text-slate-100">{answer}</div>
    </div>
  );
}
