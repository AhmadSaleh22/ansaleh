import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { books } from '../lib/content'

export function Library() {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-8">
      {books.map((book) => (
        <li key={book.slug} className="w-[132px]">
          <Link to={`/library/${book.slug}`} viewTransition className="group block" aria-label={`${book.title}, notes`}>
          <div style={{ perspective: 600 }}>
            <motion.div
              variants={{ rest: { rotateY: 0 }, hover: { rotateY: -12 } }}
              initial="rest"
              whileHover="hover"
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              style={{ transformStyle: 'preserve-3d', transformOrigin: 'left center' }}
              className="aspect-[3/4] overflow-hidden rounded-[3px] bg-ground outline outline-1 -outline-offset-1 outline-line"
            >
              {book.cover && (
                <img src={book.cover} alt="" width={132} height={176} loading="lazy" draggable={false} className="h-full w-full object-cover" />
              )}
            </motion.div>
          </div>
          <p className="mt-3 text-[13px] leading-snug transition-colors duration-150 ease-out group-hover:text-muted">{book.title}</p>
          <p className="text-[13px] leading-snug text-muted">{book.author}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
