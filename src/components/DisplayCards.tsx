import { BriefcaseBusiness, Megaphone, Video } from 'lucide-react'

const cards = [
  { title: 'Web + product', description: 'Websites & apps', date: 'Build · deploy · improve', icon: BriefcaseBusiness, tone: 'card-web' },
  { title: 'Growth systems', description: 'Digital marketing', date: 'Campaigns · leads · sales', icon: Megaphone, tone: 'card-growth' },
  { title: 'Creative work', description: 'Video editing', date: 'Scripts · reels · assets', icon: Video, tone: 'card-creative' },
]

export default function DisplayCards() {
  return <div className="display-cards" aria-label="Kushagra's areas of work">{cards.map(({ title, description, date, icon: Icon, tone }, index) => <article className={`display-card display-card-${index + 1} ${tone}`} key={title}><div className="display-card-top"><span className="display-card-icon"><Icon size={16} /></span><strong>{title}</strong></div><p>{description}</p><small>{date}</small></article>)}</div>
}
