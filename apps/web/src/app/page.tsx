import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {Footer} from "@/components/footer";
import Header from "@/components/header";

export default function Home() {
	return (
		<>
			<Header />
			<div className="min-h-screen bg-gradient-to-b from-background to-muted pt-16 md:pt-20">
			{/* Hero Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto max-w-6xl text-center">
					<h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
						Transform Your Links into Traffic Magnets
					</h1>
					<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
						Automatically generate eye-catching social previews for every page on your site with a single line of code. Boost engagement, increase clicks, and drive more traffic to your content effortlessly.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
						<Link href="/login">
							<Button size="lg" className="text-lg px-8">
								Start Creating Free
							</Button>
						</Link>
					</div>
					<div className="flex flex-col md:flex-row gap-8 justify-center items-center">
						<div className="text-center w-full md:w-auto">
							<h3 className="text-lg font-semibold mb-4">Before OG Image</h3>
							<img
								src="https://pub-7b6bedfb5ea44184927ff54ae90daa5f.r2.dev/without-og-image.png"
								alt="Preview of a link without an OG image"
								className="rounded-lg shadow-lg max-w-full h-auto w-full md:max-w-sm"
							/>
						</div>
						<div className="text-center w-full md:w-auto">
							<h3 className="text-lg font-semibold mb-4">After OG Image</h3>
							<img
								src="https://pub-7b6bedfb5ea44184927ff54ae90daa5f.r2.dev/with-og-image.png"
								alt="Preview of a link with an attractive OG image"
								className="rounded-lg shadow-lg max-w-full h-auto w-full md:max-w-sm"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-20 px-4 bg-muted/30">
				<div className="container mx-auto max-w-6xl">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Why Choose Craft Previews?
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Discover the benefits that make us the top choice for social media creators
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-8">
						<Card className="text-center">
							<CardHeader>
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<span className="text-2xl">📈</span>
								</div>
								<CardTitle className="text-xl">Boost Engagement</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									Increase click-through rates with eye-catching, optimized social previews
									that drive more traffic to your content.
								</p>
							</CardContent>
						</Card>
						<Card className="text-center">
							<CardHeader>
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<span className="text-2xl">⚡</span>
								</div>
								<CardTitle className="text-xl">Save Time</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									Automate the creation of preview images with one line of code, freeing up
									your time for what matters most.
								</p>
							</CardContent>
						</Card>
						<Card className="text-center">
							<CardHeader>
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<span className="text-2xl">🎨</span>
								</div>
								<CardTitle className="text-xl">Professional Quality</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									Create stunning, high-resolution images that look professional and
									consistent across all your social media platforms.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section id="how-it-works" className="py-20 px-4 bg-muted/50">
				<div className="container mx-auto max-w-6xl">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							How It Works
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Get professional preview images in just three simple steps
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-8">
						<Card className="text-center">
							<CardHeader>
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<span className="text-2xl">🎨</span>
								</div>
								<CardTitle className="text-xl">1. Choose a Template</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									Browse our curated collection of professionally designed templates
									for blogs, products, events, and more.
								</p>
							</CardContent>
						</Card>
						<Card className="text-center">
							<CardHeader>
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<span className="text-2xl">✏️</span>
								</div>
								<CardTitle className="text-xl">2. Customize & Edit</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									Easily edit text, colors, images, and layouts with our intuitive
									drag-and-drop editor. No design experience needed.
								</p>
							</CardContent>
						</Card>
						<Card className="text-center">
							<CardHeader>
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<span className="text-2xl">⬇️</span>
								</div>
								<CardTitle className="text-xl">3. Download & Share</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									Export your creation in multiple formats and sizes. Perfect for
									social media, blogs, and marketing campaigns.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section id="pricing" className="py-20 px-4">
				<div className="container mx-auto max-w-6xl">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Choose Your Plan
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Start free and scale as you grow. All plans include unlimited downloads
							and premium support.
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-8">
						<Card className="relative">
							<CardHeader>
								<CardTitle className="text-2xl">Free</CardTitle>
								<CardDescription>Perfect for getting started</CardDescription>
								<div className="text-3xl font-bold">$0<span className="text-lg font-normal">/month</span></div>
							</CardHeader>
							<CardContent className="space-y-4">
								<ul className="space-y-2">
									<li className="flex items-center">
										<span className="text-green-500 mr-2">✓</span>
										5 social images per month
									</li>
									<li className="flex items-center">
										<span className="text-green-500 mr-2">✓</span>
										Basic templates
									</li>
									<li className="flex items-center">
										<span className="text-green-500 mr-2">✓</span>
										PNG & JPG export
									</li>
									<li className="flex items-center">
										<span className="text-green-500 mr-2">✓</span>
										Community support
									</li>
								</ul>
								<Link href="/login">
									<Button className="w-full">Get Started</Button>
								</Link>
							</CardContent>
						</Card>
						<Card className="relative border-primary">
							<Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
								Most Popular
							</Badge>
							<CardHeader>
								<CardTitle className="text-2xl">Pro</CardTitle>
								<CardDescription>For creators and small businesses</CardDescription>
								<div className="text-3xl font-bold">$9<span className="text-lg font-normal">/month</span></div>
							</CardHeader>
							<CardContent className="space-y-4">
								<ul className="space-y-2">
									<li className="flex items-center">
										<span className="text-green-500 mr-2">✓</span>
										100 social images per month
									</li>
									<li className="flex items-center">
										<span className="text-green-500 mr-2">✓</span>
										Premium templates
									</li>
									<li className="flex items-center">
										<span className="text-green-500 mr-2">✓</span>
										Custom branding
									</li>
									<li className="flex items-center">
										<span className="text-green-500 mr-2">✓</span>
										Priority support
									</li>
									<li className="flex items-center">
										<span className="text-green-500 mr-2">✓</span>
										High-resolution export
									</li>
								</ul>
								<Link href="/login">
									<Button className="w-full">Start Pro Trial</Button>
								</Link>
							</CardContent>
						</Card>
						<Card className="relative">
							<CardHeader>
								<CardTitle className="text-2xl">Enterprise</CardTitle>
								<CardDescription>For teams and large organizations</CardDescription>
								<div className="text-3xl font-bold">$29<span className="text-lg font-normal">/month</span></div>
							</CardHeader>
							<CardContent className="space-y-4">
								<ul className="space-y-2">
									<li className="flex items-center">
										<span className="text-green-500 mr-2">✓</span>
										Unlimited images
									</li>
									<li className="flex items-center">
										<span className="text-green-500 mr-2">✓</span>
										Custom templates
									</li>
									<li className="flex items-center">
										<span className="text-green-500 mr-2">✓</span>
										Team collaboration
									</li>
									<li className="flex items-center">
										<span className="text-green-500 mr-2">✓</span>
										API access
									</li>
									<li className="flex items-center">
										<span className="text-green-500 mr-2">✓</span>
										Dedicated support
									</li>
								</ul>
								<Button variant="outline" className="w-full">Contact Sales</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section id="faq" className="py-20 px-4 bg-muted/50">
				<div className="container mx-auto max-w-4xl">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Frequently Asked Questions
						</h2>
						<p className="text-lg text-muted-foreground">
							Everything you need to know about Social Image Maker
						</p>
					</div>
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="item-1">
							<AccordionTrigger>What makes Social Image Maker different?</AccordionTrigger>
							<AccordionContent>
								Unlike other tools, we focus exclusively on social media images with
								AI-powered suggestions, one-click optimization for each platform, and
								a library of conversion-optimized templates proven to increase engagement.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-2">
							<AccordionTrigger>Can I use my own images and fonts?</AccordionTrigger>
							<AccordionContent>
								Absolutely! Upload your own images, logos, and even custom fonts.
								Our Pro and Enterprise plans include advanced branding features to
								maintain consistency across all your social media content.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-3">
							<AccordionTrigger>Do you offer refunds?</AccordionTrigger>
							<AccordionContent>
								Yes, we offer a 30-day money-back guarantee on all paid plans.
								If you're not completely satisfied, we'll refund your payment no questions asked.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-4">
							<AccordionTrigger>Can I cancel my subscription anytime?</AccordionTrigger>
							<AccordionContent>
								Of course! You can cancel or change your plan at any time from your
								account settings. Your access will continue until the end of your
								current billing period.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-5">
							<AccordionTrigger>Is my data secure?</AccordionTrigger>
							<AccordionContent>
								Security is our top priority. All data is encrypted in transit and at rest,
								and we never share your content with third parties. We comply with GDPR
								and CCPA privacy regulations.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</section>

			<Footer />
		</div>
		</>
	);
}
