import { Link } from 'react-router-dom'
export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">R</span>
              </div>
              <span className="font-display font-semibold text-xl">
                Rent<span className="text-primary-400">Ease</span>
              </span>
            </div>
            <p className="font-body text-gray-400 text-sm leading-relaxed max-w-xs">
              Connecting tenants, landlords, and agents across Nigeria.
              Find verified properties with zero fraud, zero hassle.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              {['Home', 'Properties', 'Login', 'Register'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item === 'Home' ? '' : item.toLowerCase()}`}
                    className="font-body text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Contact
            </h4>
            <ul className="space-y-2 font-body text-sm text-gray-400">
              <li>support@rentease.ng</li>
              <li>+234-8149769770</li>
              <li>Lagos, Nigeria</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-gray-500">
            © {new Date().getFullYear()} RentEase. All rights reserved.
          </p>
          <p className="font-body text-xs text-gray-500">
            Built with ❤️ for Nigeria
          </p>
        </div>
      </div>
    </footer>
  )
}
