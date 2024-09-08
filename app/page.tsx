import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export default function Home() {
	return (
		<div className="container mx-auto px-4 py-16">
			<header className="text-center mb-16">
				<h1 className="text-4xl font-bold mb-4">PatentMate</h1>
				<p className="text-xl text-muted-foreground">
					Streamlining your patent journey from idea to application
				</p>
			</header>

			<main className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Pre-filing Process</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription>
							We simplify the complex pre-filing process, guiding you through
							each step to ensure your patent application is thorough and
							well-prepared.
						</CardDescription>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Invention Disclosure Analysis</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription>
							Our advanced analysis tools help you create a comprehensive
							invention disclosure, identifying key aspects of your innovation.
						</CardDescription>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Legal Recommendations</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription>
							We match you with lawyers and law firms specialized in your
							specific patent needs, ensuring expert guidance throughout the
							process.
						</CardDescription>
					</CardContent>
				</Card>

				<Card className="md:col-span-2 lg:col-span-3">
					<CardHeader>
						<CardTitle>Comprehensive Report Generation</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription>
							PatentMate generates detailed reports that provide insights into
							your invention's patentability, potential challenges, and
							recommended next steps.
						</CardDescription>
					</CardContent>
				</Card>
			</main>

			<div className="text-center mt-16">
				<Link href="/ability-search">
					<Button size="lg">Start Your Patent Journey</Button>
				</Link>
			</div>
		</div>
	);
}
