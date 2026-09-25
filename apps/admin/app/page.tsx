import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Mission Mindfulness Admin</h1>
      <p>Secure admin dashboard shell.</p>
      <Link href="/dashboard">Go to dashboard</Link>
    </main>
  );
}
