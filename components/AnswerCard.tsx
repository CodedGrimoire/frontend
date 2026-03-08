type Props = {
  answer?: string | null;
  type?: string;
};

export default function AnswerCard({ answer, type }: Props) {
  if (!answer) return null;
  return (
    <div className="glass-card p-2 px-3 leading-[1.5]">
      <div className="text-xs uppercase tracking-[0.08em] text-slate-400 mb-1 w-full">
        Answer {type ? `· ${type}` : ""}
      </div>
      <div className="text-lg text-slate-100 w-full">{answer}</div>
    </div>
  );
}
