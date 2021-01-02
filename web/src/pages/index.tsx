import Link from "next/link"

const Index = () => (
  <div title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js 👋</h1>
    <p>
      <Link href="/">
        <a>About</a>
      </Link>
    </p>
  </div>
)

export default Index