import { offers } from '../content/help'
import { ask } from './Ask'

export function Help() {
  return (
    <ul className="help-list">
      {offers.map((o) => (
        <li key={o.title} className="help-item">
          <h3 className="font-medium">{o.title}</h3>
          <p className="pt-1">{o.body}</p>
          <p className="pt-2 text-[13px] text-muted">{o.proof}</p>
          <button type="button" className="link mt-3 text-[13px] text-fg" onClick={() => ask({ intent: o.intent, topic: o.title })}>
            {o.cta} →
          </button>
        </li>
      ))}
    </ul>
  )
}
