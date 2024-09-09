import { InventionDisclosureForm } from '@/components/InventionDisclosureForm';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

function InventionDisclosureAnalysis() {
	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-4xl mx-auto">
				<CardHeader className="text-center">
					<CardTitle className="text-3xl font-bold">
						Invention Disclosure Analysis
					</CardTitle>
					<CardDescription className="text-lg">
						Review and submit your patent description for contributor analysis.
						The form is pre-populated with the description you provided earlier.
						Feel free to make any necessary adjustments before submitting.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<InventionDisclosureForm />
				</CardContent>
			</Card>
		</div>
	);
}

export default InventionDisclosureAnalysis;
