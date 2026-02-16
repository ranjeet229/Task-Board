import type { ActivityEntry } from '@/types';

export interface ActivityPanelProps {
  entries: ActivityEntry[];
}

export function ActivityPanel({ entries }: ActivityPanelProps) {
  return (
    <aside className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
        <h3 className="font-semibold text-slate-800">Activity</h3>
        <p className="text-xs text-slate-500">Latest 10 actions</p>
      </div>
      <ul className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto" aria-label="Activity log">
        {entries.length === 0 ? (
          <li className="px-4 py-6 text-center text-slate-400 text-sm">No activity yet.</li>
        ) : (
          [...entries].reverse().map((entry) => (
            <li key={entry.id} className="px-4 py-2.5 text-sm text-slate-600">
              <span className="text-slate-400 font-mono mr-2">[{entry.timeLabel}]</span>
              {entry.message}
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}
