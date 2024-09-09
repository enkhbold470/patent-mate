import { PatentApplicationForm } from "@/components/patent-application-form.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function AbilitySearch() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Patent Ability Search
          </CardTitle>
          <CardDescription className="text-lg">
            Evaluate your invention&apos;s patentability and get guidance on the
            patent application process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatentApplicationForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default AbilitySearch;
