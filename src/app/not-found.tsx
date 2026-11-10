import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-32 text-center">
      <p className="font-mono text-sm text-accent-strong">404 · node not found</p>
      <h1 className="mt-3 text-3xl font-semibold text-fg">This path has no outgoing connection.</h1>
      <ButtonLink href="/" className="mt-8">
        Back to home
      </ButtonLink>
    </Container>
  );
}
