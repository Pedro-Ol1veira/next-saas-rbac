import Header from "@/components/header";

export default async function Home() {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-300 space-y-4">
        <p className="text-sm text-muted-foreground">Select an organization</p>
      </main>
    </div>
  )
}