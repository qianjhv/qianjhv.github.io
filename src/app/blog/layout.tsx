import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";

export const MyLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function BolgLayout({ children }) {
  return (
    <div className="w-screen">
			<nav className="max-w-[768px] mx-auto">
				<Navbar shouldHideOnScroll>
					<NavbarBrand>
						<Link href="/"> <MyLogo /> </Link>
					</NavbarBrand>
					<NavbarContent className="hidden sm:flex gap-4" justify="end">
						<NavbarItem isActive>
							<Link color="foreground" href="/blog"> blog </Link>
						</NavbarItem>
						<NavbarItem>
							<Link aria-current="page" href="/tag"> tag </Link>
						</NavbarItem>
						<NavbarItem>
							<Link color="foreground" href="/about"> me </Link>
						</NavbarItem>
					</NavbarContent>
				</Navbar>
			</nav>

			<main className="w-full mx-auto max-w-[768px] px-6">
				{children}
			</main>

			<footer>

			</footer>
		</div>
  );
}
