import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-32 text-center">
      <span className="inline-block -rotate-3 rounded-lg border-2 border-ink bg-coral px-3 py-1 font-display text-lg font-extrabold shadow-pop-sm">
        404
      </span>
      <h1 className="mt-6 text-4xl font-extrabold text-ink sm:text-5xl">This node has no outgoing connection.</h1>
      <ButtonLink href="/" className="mt-10">
        Take me home
      </ButtonLink>
    </Container>
  );
}
