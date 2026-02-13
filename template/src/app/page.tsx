"use client";

import { Button } from "src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Separator } from "src/components/ui/separator";
import { Switch } from "src/components/ui/switch";
import { Textarea } from "src/components/ui/textarea";
import { useToast } from "src/shared/hooks/toast/use-toast";

export default function Page() {
	const toast = useToast();

	return (
		<div className="mx-auto max-w-3xl space-y-10 p-10">
			<h1 className="text-3xl font-bold">Component Preview</h1>

			{/* Buttons */}
			<section className="space-y-3">
				<h2 className="text-xl font-semibold">Button</h2>
				<div className="flex flex-wrap gap-3">
					<Button>Default</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="destructive">Destructive</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="link">Link</Button>
				</div>
				<div className="flex flex-wrap gap-3">
					<Button size="sm">Small</Button>
					<Button size="default">Default</Button>
					<Button size="lg">Large</Button>
					<Button disabled>Disabled</Button>
				</div>
			</section>

			<Separator />

			<section className="space-y-3">
				<h2 className="text-xl font-semibold">Test Toast</h2>
				<Button onClick={() => toast.success("Toast triggered.")}>Trigger toast</Button>
			</section>

			<Separator />

			{/* Badge */}
			<section className="space-y-3">
				<h2 className="text-xl font-semibold">Badge</h2>
				<div className="flex flex-wrap gap-3">
					<Badge>Default</Badge>
					<Badge variant="secondary">Secondary</Badge>
					<Badge variant="destructive">Destructive</Badge>
					<Badge variant="outline">Outline</Badge>
				</div>
			</section>

			<Separator />

			{/* Card */}
			<section className="space-y-3">
				<h2 className="text-xl font-semibold">Card</h2>
				<Card className="max-w-sm">
					<CardHeader>
						<CardTitle>Card Title</CardTitle>
						<CardDescription>Card description goes here.</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							This is an example card component with header, content, and
							footer sections.
						</p>
					</CardContent>
					<CardFooter className="gap-2">
						<Button size="sm">Confirm</Button>
						<Button size="sm" variant="outline">
							Cancel
						</Button>
					</CardFooter>
				</Card>
			</section>

			<Separator />

			{/* Input & Label */}
			<section className="space-y-3">
				<h2 className="text-xl font-semibold">Input</h2>
				<div className="grid max-w-sm gap-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" placeholder="you@example.com" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="disabled">Disabled</Label>
						<Input id="disabled" placeholder="Disabled input" disabled />
					</div>
				</div>
			</section>

			<Separator />

			{/* Textarea */}
			<section className="space-y-3">
				<h2 className="text-xl font-semibold">Textarea</h2>
				<div className="max-w-sm space-y-2">
					<Label htmlFor="message">Message</Label>
					<Textarea id="message" placeholder="Type your message here." />
				</div>
			</section>

			<Separator />

			{/* Switch */}
			<section className="space-y-3">
				<h2 className="text-xl font-semibold">Switch</h2>
				<div className="flex items-center gap-3">
					<Switch id="notifications" />
					<Label htmlFor="notifications">Enable notifications</Label>
				</div>
			</section>
		</div>
	);
}
