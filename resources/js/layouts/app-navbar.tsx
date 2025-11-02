import { usePage } from "@inertiajs/react"
import { useEffect, useState } from "react"
import { buttonStyles } from "@/components/ui/button"
import {
  Navbar,
  NavbarGap,
  NavbarItem,
  NavbarMobile,
  NavbarProvider,
  NavbarSection,
  NavbarSpacer,
  NavbarStart,
  NavbarTrigger,
} from "@/components/ui/navbar"
import { Logo } from "@/components/logo"
import type { SharedData } from "@/types/shared"
import { Link } from "@/components/ui/link"
import { UserMenu } from "@/components/user-menu"
import { UserTeams } from "@/components/user-teams"

const navigations = [
  {
    name: "Home",
    textValue: "Home",
    href: "/",
  },
]

export function AppNavbar({ children, ...props }: React.ComponentProps<typeof Navbar>) {
  const page = usePage()
  const { auth } = usePage<SharedData>().props
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => setIsOpen(false), [page.url])
  return (
    <NavbarProvider isOpen={isOpen} onOpenChange={setIsOpen}>
      <Navbar {...props}>
        <NavbarStart>
          <Link href="/" aria-label="Goto homepage">
            <Logo />
          </Link>
        </NavbarStart>
        <NavbarGap />

        <NavbarSection>
          {navigations.map((item) => (
            <NavbarItem isCurrent={item.href === page.url} key={item.href} href={item.href}>
              {item.name}
            </NavbarItem>
          ))}
          <NavbarItem target="_blank" href="https://intentui.com" className="justify-between">
            Documentation
          </NavbarItem>
          <NavbarItem target="_blank" href="https://design.intentui.com">
            Blocks
          </NavbarItem>
        </NavbarSection>
        <NavbarSpacer />
        <NavbarSection className="ml-auto hidden gap-x-2 lg:flex">
          {auth.user ? (
            <>
              <UserTeams />
              <UserMenu />
            </>
          ) : (
            <>
              <NavbarItem href="/login">Login</NavbarItem>
              <NavbarItem href="/register">Register</NavbarItem>
            </>
          )}
        </NavbarSection>
      </Navbar>
      <NavbarMobile>
        <NavbarTrigger />
        <NavbarSpacer />
        <NavbarSection>
          {auth.user ? (
            <>
              <UserTeams />
              <UserMenu />
            </>
          ) : (
            <NavbarItem
              className={buttonStyles({
                intent: "outline",
                size: "sm",
              })}
              href="/login"
            >
              Login
            </NavbarItem>
          )}
        </NavbarSection>
      </NavbarMobile>
    </NavbarProvider>
  )
}
