import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          DASM-e
        </Link>
        <nav className="flex gap-6">
          <Link to="/catalog" className="text-slate-600 hover:text-slate-900">
            المعرض
          </Link>
          <Link to="/map" className="text-slate-600 hover:text-slate-900">
            الخريطة
          </Link>
          <Link to="/services" className="text-slate-600 hover:text-slate-900">
            الخدمات
          </Link>
          <Link to="/rules" className="text-slate-600 hover:text-slate-900">
            القوانين
          </Link>
        </nav>
      </div>
    </header>
  )
}
