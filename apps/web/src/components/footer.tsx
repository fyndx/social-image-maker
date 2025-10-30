import React from "react";

export function Footer() {
	return (
		<footer className="py-12 px-4 border-t">
			<div className="container mx-auto max-w-6xl">
				<div className="grid md:grid-cols-4 gap-8 mb-8">
					<div>
						<h3 className="font-semibold mb-4">Product</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li><a href="#how-it-works" className="hover:text-foreground">How It Works</a></li>
							<li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
							<li><a href="#" className="hover:text-foreground">Templates</a></li>
							<li><a href="#" className="hover:text-foreground">API</a></li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold mb-4">Company</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li><a href="#" className="hover:text-foreground">About</a></li>
							<li><a href="#" className="hover:text-foreground">Blog</a></li>
							<li><a href="#" className="hover:text-foreground">Careers</a></li>
							<li><a href="#" className="hover:text-foreground">Contact</a></li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold mb-4">Support</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
							<li><a href="#" className="hover:text-foreground">Help Center</a></li>
							<li><a href="#" className="hover:text-foreground">Community</a></li>
							<li><a href="#" className="hover:text-foreground">Status</a></li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold mb-4">Legal</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
							<li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
							<li><a href="#" className="hover:text-foreground">Cookie Policy</a></li>
							<li><a href="#" className="hover:text-foreground">GDPR</a></li>
						</ul>
					</div>
				</div>
				<div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t">
					<p className="text-sm text-muted-foreground mb-4 md:mb-0">
						© {new Date().getFullYear()} Social Image Maker. All rights reserved.
					</p>
					<div className="flex space-x-4">
						<a href="#" className="text-muted-foreground hover:text-foreground">
							Twitter
						</a>
						<a href="#" className="text-muted-foreground hover:text-foreground">
							LinkedIn
						</a>
						<a href="#" className="text-muted-foreground hover:text-foreground">
							GitHub
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
