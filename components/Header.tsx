import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
	return (
		<header className="bg-white shadow-sm">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<Link href="/" className="text-2xl font-bold text-primary">
					PatentMate
				</Link>
				<nav>
					<ul className="flex space-x-4">
						<li>
							<Link href="/">
								<Button variant="ghost">Home</Button>
							</Link>
						</li>
						<li>
							<Link href="/ability-search">
								<Button variant="ghost">Patent Search</Button>
							</Link>
						</li>
						<li>
							<Link href="/invention-disclosure-analysis">
								<Button variant="ghost">Invention Disclosure Analysis</Button>
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
}
