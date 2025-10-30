"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const links = [
		{ to: "/", label: "Craft Previews" },
		{ to: "/#how-it-works", label: "How It Works" },
		{ to: "/#pricing", label: "Pricing" },
		{ to: "/#faq", label: "FAQ" },
	] as const;

	return (
		<div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
			<div className="flex flex-row items-center justify-between px-4 md:px-6 py-2 md:py-3">
				<div className="flex items-center">
					<Link href="/" className="text-lg font-bold">
						Craft Previews
					</Link>
					<nav className="hidden md:flex ml-4 gap-2 md:gap-4 text-sm md:text-lg">
						{links.slice(1).map(({ to, label }) => (
							<Link key={to} href={to}>
								{label}
							</Link>
						))}
					</nav>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="md:hidden p-2"
						aria-label="Toggle menu"
					>
						{isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
					</button>
					<ModeToggle />
					<UserMenu />
				</div>
			</div>
			{isMenuOpen && (
				<div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur border-b">
					<nav className="flex flex-col gap-2 p-4 text-sm">
						{links.map(({ to, label }) => (
							<Link
								key={to}
								href={to}
								onClick={() => setIsMenuOpen(false)}
							>
								{label}
							</Link>
						))}
					</nav>
				</div>
			)}
		</div>
	);
}
