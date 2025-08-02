import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <div className="font-bold text-lg">Local Help Hub</div>
      <div className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/register">Register</Link>
        <Link href="/login">Login</Link>
        <Link href="/profile">Profile</Link>
      </div>
    </nav>
  )
}
