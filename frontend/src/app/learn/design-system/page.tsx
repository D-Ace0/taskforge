import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

export default function DesignSystem() {
    return (
        <main className="min-h-screen bg-slate-50 p-6">
            <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Card className="grid gap-2">
                    <Button>primary</Button>
                    <Button disabled>disabled primary</Button>
                    <Button variant="secondary">secondary</Button>
                    <Button variant="danger">danger</Button>
                </Card>
                <Card className="grid gap-2">
                    <h1>title</h1>
                    <p>description</p>
                    <div className="flex gap-2 flex-wrap">
                        <Button>button 1</Button>
                        <Button variant="secondary">button 2</Button>
                    </div>
                </Card>
            </div>
        </main>
    )
}