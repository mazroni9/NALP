import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <p className="font-bold text-slate-800">DASM-e</p>
            <p className="text-sm text-slate-600">منصة المزادات الحضورية</p>
          </div>
          <div className="flex gap-6">
            <Link to="/rules" className="text-sm text-slate-600 hover:text-slate-900">
              القوانين
            </Link>
            <span className="text-sm text-slate-400">تواصل (قريباً)</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
