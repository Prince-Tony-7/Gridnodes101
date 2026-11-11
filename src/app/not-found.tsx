import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-32 text-center">
      <p className="font-mono text-sm font-medium text-ink-mute">Error 404</p>
      <h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">This page doesn&rsquo;t exist.</h1>
      <p className="mt-4 max-w-md text-lg text-ink-soft">The link may be outdated, or the page has moved.</p>
      <ButtonLink href="/" className="mt-10">
        Back to home
      </ButtonLink>
    </Container>
  );
}
