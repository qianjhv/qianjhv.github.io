import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h2>404 Not Found</h2>
      <Link href="/">Return Home</Link>
    </div>
  )
}