"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faGithub,
  faTiktok,
  faXTwitter,
  faLinkedin,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import { faCertificate } from "@fortawesome/free-solid-svg-icons";
import MotionList from "./motion-list";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { analytics } from "@/lib/analytics";
type Contact = {
  name: string;
  className: string;
  href: string;
  icon: any;
};
const contacts: Contact[] = [
  {
    name: "Email",
    className: "bg-yellow-500 hover:bg-yellow-600",
    href: "mailto:maharajanabishek@gmail.com",
    icon: faEnvelope,
  },

  {
    name: "X",
    className: "bg-black hover:bg-gray-800/90",
    href: "https://x.com/abizhek_m",
    icon: faXTwitter,
  },
  {
    name: "Github",
    className: "bg-black hover:bg-gray-800/90",
    href: "https://github.com/TentacioPro",
    icon: faGithub,
  },
  {
    name: "LinkedIn",
    className: "bg-blue-600 hover:bg-blue-700",
    href: "https://www.linkedin.com/in/abishek-maharajan/",
    icon: faLinkedin,
  },
  {
    name: "Google Cloud Skills Boost",
    className: "bg-blue-500 hover:bg-blue-600",
    href: "https://www.cloudskillsboost.google/public_profiles/1033425b-861c-4054-8944-26fd68d262f6",
    icon: faGoogle,
  },
  {
    name: "Credly",
    className: "bg-blue-500 hover:bg-blue-600",
    href: "https://www.credly.com/users/abishek-maharajan",
    icon: faCertificate,
  },
];
export default function ContactList({
  delayOffset = 0,
  showWhenInView = true,
}: {
  delayOffset?: number;
  showWhenInView?: boolean;
}) {
  const handleContactClick = (contactName: string, href: string) => {
    analytics.trackContactClick(contactName, {
      targetUrl: href,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <MotionList delayOffset={delayOffset} showWhenInView={showWhenInView}>
      {contacts.map((contact, index) => (
        <TooltipProvider delayDuration={0} key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full p-3 md:h-12 md:w-12",
                  contact.className,
                )}
                asChild
                aria-label={contact.name}
              >
                <Link
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={contact.name}
                  onClick={() => handleContactClick(contact.name, contact.href)}
                >
                  <FontAwesomeIcon icon={contact.icon} className="size-6" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              <p>{contact.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </MotionList>
  );
}
